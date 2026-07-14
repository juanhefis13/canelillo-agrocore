-- Modulo Fertilizantes / fertirriego por caseta y estanque.
-- Unidad operativa: litros.

begin;

create table if not exists public.fertilizante_casetas (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  nombre_normalizado text not null unique,
  activo boolean not null default true,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

create table if not exists public.fertilizante_estanques (
  id uuid primary key default gen_random_uuid(),
  caseta_id uuid not null references public.fertilizante_casetas(id) on update cascade on delete cascade,
  numero_estanque text not null,
  numero_estanque_normalizado text not null,
  fip text not null,
  fip_normalizado text not null,
  volumen_maximo_litros numeric(12, 3) not null default 0,
  volumen_origen text null,
  activo boolean not null default true,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  constraint fertilizante_estanques_unq unique (caseta_id, numero_estanque_normalizado, fip_normalizado, volumen_maximo_litros)
);

create table if not exists public.fertilizante_estanque_potreros (
  id uuid primary key default gen_random_uuid(),
  estanque_id uuid not null references public.fertilizante_estanques(id) on update cascade on delete cascade,
  campo_id uuid null references public.campos(id) on update cascade on delete set null,
  potrero text not null,
  activo boolean not null default true,
  creado_en timestamptz not null default now(),
  constraint fertilizante_estanque_potreros_unq unique (estanque_id, potrero)
);

create table if not exists public.fertilizante_preparaciones (
  id uuid primary key default gen_random_uuid(),
  estanque_id uuid not null references public.fertilizante_estanques(id) on update cascade on delete restrict,
  fecha timestamptz not null default now(),
  producto text null,
  cantidad_litros numeric(12, 3) not null,
  responsable_id uuid null,
  responsable_nombre text null,
  observacion text null,
  creado_por uuid null,
  creado_por_nombre text null,
  creado_en timestamptz not null default now(),
  constraint fertilizante_preparaciones_litros_chk check (cantidad_litros > 0)
);

create table if not exists public.fertilizante_aplicaciones (
  id uuid primary key default gen_random_uuid(),
  estanque_id uuid not null references public.fertilizante_estanques(id) on update cascade on delete restrict,
  campo_id uuid null references public.campos(id) on update cascade on delete set null,
  fecha timestamptz not null default now(),
  potrero text not null,
  bloque text null,
  cantidad_litros numeric(12, 3) not null,
  responsable_id uuid null,
  responsable_nombre text null,
  observacion text null,
  creado_por uuid null,
  creado_por_nombre text null,
  creado_en timestamptz not null default now(),
  constraint fertilizante_aplicaciones_litros_chk check (cantidad_litros > 0)
);

create index if not exists fertilizante_preparaciones_estanque_fecha_idx on public.fertilizante_preparaciones (estanque_id, fecha desc);
create index if not exists fertilizante_aplicaciones_estanque_fecha_idx on public.fertilizante_aplicaciones (estanque_id, fecha desc);
create index if not exists fertilizante_aplicaciones_campo_fecha_idx on public.fertilizante_aplicaciones (campo_id, fecha desc);

create or replace view public.v_fertilizante_estado_estanques as
with prep as (
  select estanque_id, sum(cantidad_litros) as litros_preparados, max(fecha) as ultima_preparacion
  from public.fertilizante_preparaciones
  group by estanque_id
), apl as (
  select estanque_id, sum(cantidad_litros) as litros_aplicados, max(fecha) as ultima_aplicacion
  from public.fertilizante_aplicaciones
  group by estanque_id
), potreros as (
  select
    ep.estanque_id,
    string_agg(distinct ep.potrero, ', ' order by ep.potrero) as potreros,
    jsonb_agg(distinct jsonb_build_object('potrero', ep.potrero, 'campo_id', ep.campo_id)) as potreros_json
  from public.fertilizante_estanque_potreros ep
  where ep.activo
  group by ep.estanque_id
)
select
  e.id,
  c.nombre as caseta,
  c.nombre_normalizado as caseta_key,
  e.numero_estanque,
  e.numero_estanque_normalizado as estanque_key,
  e.fip,
  e.fip_normalizado as fip_key,
  e.volumen_maximo_litros,
  greatest(0, coalesce(prep.litros_preparados, 0) - coalesce(apl.litros_aplicados, 0)) as litros_actuales,
  coalesce(prep.litros_preparados, 0) as litros_preparados,
  coalesce(apl.litros_aplicados, 0) as litros_aplicados,
  prep.ultima_preparacion,
  apl.ultima_aplicacion,
  coalesce(potreros.potreros, '') as potreros,
  coalesce(potreros.potreros_json, '[]'::jsonb) as potreros_json,
  e.activo
from public.fertilizante_estanques e
join public.fertilizante_casetas c on c.id = e.caseta_id
left join prep on prep.estanque_id = e.id
left join apl on apl.estanque_id = e.id
left join potreros on potreros.estanque_id = e.id;

alter table public.fertilizante_casetas enable row level security;
alter table public.fertilizante_estanques enable row level security;
alter table public.fertilizante_estanque_potreros enable row level security;
alter table public.fertilizante_preparaciones enable row level security;
alter table public.fertilizante_aplicaciones enable row level security;

drop policy if exists fertilizante_casetas_lectura on public.fertilizante_casetas;
create policy fertilizante_casetas_lectura on public.fertilizante_casetas for select to authenticated using (true);
drop policy if exists fertilizante_estanques_lectura on public.fertilizante_estanques;
create policy fertilizante_estanques_lectura on public.fertilizante_estanques for select to authenticated using (true);
drop policy if exists fertilizante_estanque_potreros_lectura on public.fertilizante_estanque_potreros;
create policy fertilizante_estanque_potreros_lectura on public.fertilizante_estanque_potreros for select to authenticated using (true);
drop policy if exists fertilizante_preparaciones_lectura on public.fertilizante_preparaciones;
create policy fertilizante_preparaciones_lectura on public.fertilizante_preparaciones for select to authenticated using (true);
drop policy if exists fertilizante_aplicaciones_lectura on public.fertilizante_aplicaciones;
create policy fertilizante_aplicaciones_lectura on public.fertilizante_aplicaciones for select to authenticated using (true);

drop policy if exists fertilizante_preparaciones_escritura on public.fertilizante_preparaciones;
create policy fertilizante_preparaciones_escritura on public.fertilizante_preparaciones for insert to authenticated with check (true);
drop policy if exists fertilizante_aplicaciones_escritura on public.fertilizante_aplicaciones;
create policy fertilizante_aplicaciones_escritura on public.fertilizante_aplicaciones for insert to authenticated with check (true);

grant select on public.fertilizante_casetas, public.fertilizante_estanques, public.fertilizante_estanque_potreros, public.fertilizante_preparaciones, public.fertilizante_aplicaciones to authenticated;
grant select on public.v_fertilizante_estado_estanques to authenticated;
grant insert on public.fertilizante_preparaciones, public.fertilizante_aplicaciones to authenticated;

commit;
