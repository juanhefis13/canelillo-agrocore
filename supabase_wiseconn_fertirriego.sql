-- Conserva el detalle compacto de los FIP/fertirrigaciones programados por WiseConn.
-- Es autonomo: puede ejecutarse aunque el esquema WiseConn aun no exista.
-- Ejecutar una vez en Supabase SQL Editor.

begin;

create table if not exists public.wiseconn_campos (
  farm_id bigint primary key,
  nombre_wiseconn text not null,
  nombre_agrocore text not null,
  zona_horaria text not null default 'America/Santiago',
  activo boolean not null default true,
  actualizado_en timestamptz not null default now()
);

insert into public.wiseconn_campos (
  farm_id,
  nombre_wiseconn,
  nombre_agrocore,
  zona_horaria,
  activo
)
values (
  4212,
  'Canelillo',
  'Canelillo AgroCore',
  'America/Santiago',
  true
)
on conflict (farm_id) do update set
  nombre_wiseconn = excluded.nombre_wiseconn,
  nombre_agrocore = excluded.nombre_agrocore,
  zona_horaria = excluded.zona_horaria,
  activo = true,
  actualizado_en = now();

create table if not exists public.wiseconn_riegos_programados (
  scheduled_id bigint primary key,
  farm_id bigint not null references public.wiseconn_campos(farm_id) on delete cascade,
  zone_id bigint not null,
  pump_system_id bigint,
  inicio timestamptz not null,
  termino timestamptz not null,
  estado text,
  tipo_riego text,
  tipo_programacion text,
  horas_programadas numeric(12, 3),
  volumen_programado_m3 numeric(16, 3),
  caudal_teorico_m3_h numeric(14, 3),
  programado_por text,
  fertirriego_programado jsonb not null default '[]'::jsonb,
  sincronizado_en timestamptz not null default now(),
  constraint wiseconn_programado_periodo_ck check (termino >= inicio)
);

-- Permite actualizar instalaciones que ya tenian una version anterior de la tabla.
alter table public.wiseconn_riegos_programados
  add column if not exists fertirriego_programado jsonb not null default '[]'::jsonb;

create index if not exists wiseconn_riegos_programados_zone_inicio_idx
  on public.wiseconn_riegos_programados (farm_id, zone_id, inicio);

alter table public.wiseconn_campos enable row level security;
alter table public.wiseconn_riegos_programados enable row level security;

drop policy if exists wiseconn_campos_select on public.wiseconn_campos;
create policy wiseconn_campos_select on public.wiseconn_campos
for select to authenticated using (true);

drop policy if exists wiseconn_riegos_programados_select on public.wiseconn_riegos_programados;
create policy wiseconn_riegos_programados_select on public.wiseconn_riegos_programados
for select to authenticated using (true);

drop policy if exists wiseconn_riegos_programados_insert on public.wiseconn_riegos_programados;
create policy wiseconn_riegos_programados_insert on public.wiseconn_riegos_programados
for insert to authenticated with check (true);

drop policy if exists wiseconn_riegos_programados_update on public.wiseconn_riegos_programados;
create policy wiseconn_riegos_programados_update on public.wiseconn_riegos_programados
for update to authenticated using (true) with check (true);

grant select on public.wiseconn_campos to authenticated;
grant select, insert, update on public.wiseconn_riegos_programados to authenticated;

commit;

notify pgrst, 'reload schema';

select
  count(*) as riegos_programados,
  count(*) filter (
    where jsonb_typeof(fertirriego_programado) = 'array'
      and jsonb_array_length(fertirriego_programado) > 0
  ) as riegos_con_fertirriego
from public.wiseconn_riegos_programados;
