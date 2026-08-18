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
  constraint fertilizante_estanques_caseta_numero_unq unique (caseta_id, numero_estanque_normalizado)
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

create or replace function public.validar_capacidad_fertilizante_estanque()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_caseta_id uuid;
  v_estanque_key text;
  v_capacidad numeric;
  v_preparado numeric;
  v_aplicado numeric;
  v_actual numeric;
  v_old_id uuid;
begin
  if tg_op = 'UPDATE' then
    v_old_id := old.id;
  end if;
  select e.caseta_id, e.numero_estanque_normalizado
  into v_caseta_id, v_estanque_key
  from public.fertilizante_estanques e
  where e.id = new.estanque_id and e.activo;

  if v_caseta_id is null then
    raise exception 'El estanque seleccionado no existe o esta inactivo';
  end if;

  perform pg_advisory_xact_lock(hashtext(v_caseta_id::text || '|' || v_estanque_key));

  select max(e.volumen_maximo_litros)
  into v_capacidad
  from public.fertilizante_estanques e
  where e.activo
    and e.caseta_id = v_caseta_id
    and e.numero_estanque_normalizado = v_estanque_key;

  select coalesce(sum(p.cantidad_litros), 0)
  into v_preparado
  from public.fertilizante_preparaciones p
  join public.fertilizante_estanques e on e.id = p.estanque_id
  where e.activo
    and e.caseta_id = v_caseta_id
    and e.numero_estanque_normalizado = v_estanque_key
    and (v_old_id is null or p.id <> v_old_id);

  select coalesce(sum(a.cantidad_litros), 0)
  into v_aplicado
  from public.fertilizante_aplicaciones a
  join public.fertilizante_estanques e on e.id = a.estanque_id
  where e.activo
    and e.caseta_id = v_caseta_id
    and e.numero_estanque_normalizado = v_estanque_key;

  v_actual := greatest(0, v_preparado - v_aplicado);
  if coalesce(v_capacidad, 0) <= 0 then
    raise exception 'El estanque no tiene una capacidad maxima configurada';
  end if;
  if v_actual + new.cantidad_litros > v_capacidad + 0.000001 then
    raise exception 'La preparacion supera la capacidad del estanque. Disponible: % L de % L',
      greatest(0, v_capacidad - v_actual), v_capacidad;
  end if;
  return new;
end;
$$;

drop trigger if exists fertilizante_preparaciones_validar_capacidad_trg on public.fertilizante_preparaciones;
create trigger fertilizante_preparaciones_validar_capacidad_trg
before insert or update of estanque_id, cantidad_litros
on public.fertilizante_preparaciones
for each row
execute function public.validar_capacidad_fertilizante_estanque();

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

create or replace view public.v_fertilizante_estanque_campos as
select
  e.id as estanque_id,
  e.caseta_id,
  cst.nombre as caseta,
  e.numero_estanque,
  e.numero_estanque_normalizado,
  e.fip,
  e.fip_normalizado,
  e.volumen_maximo_litros,
  ep.potrero,
  campos.id as campo_id,
  campos.bloque,
  campos.especie,
  campos.variedad,
  campos.hectareas,
  campos.plantas
from public.fertilizante_estanques e
join public.fertilizante_casetas cst on cst.id = e.caseta_id
join public.fertilizante_estanque_potreros ep on ep.estanque_id = e.id and ep.activo
join public.campos campos
  on lower(trim(campos.potrero)) = lower(trim(ep.potrero))
  and campos.activo
where e.activo;

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
grant select on public.v_fertilizante_estanque_campos to authenticated;
grant insert on public.fertilizante_preparaciones, public.fertilizante_aplicaciones to authenticated;

commit;
