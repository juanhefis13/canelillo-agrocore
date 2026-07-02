-- Sincronizacion completa de Carta Gantt: Riego real, Programa y observaciones.
-- Ejecutar una vez en Supabase SQL Editor. Es seguro volver a ejecutarlo.

begin;

alter table public.riego
  add column if not exists creado_por uuid,
  add column if not exists creado_por_nombre text,
  add column if not exists modificado_por uuid,
  add column if not exists modificado_por_nombre text,
  add column if not exists modificado_en timestamptz,
  add column if not exists creado_en timestamptz not null default now(),
  add column if not exists actualizado_en timestamptz not null default now();

alter table public.programa_riego
  add column if not exists creado_por uuid,
  add column if not exists creado_por_nombre text,
  add column if not exists modificado_por uuid,
  add column if not exists modificado_por_nombre text,
  add column if not exists modificado_en timestamptz,
  add column if not exists creado_en timestamptz not null default now(),
  add column if not exists actualizado_en timestamptz not null default now();

create unique index if not exists riego_campo_fecha_sync_uidx
  on public.riego (campo_id, fecha);

create unique index if not exists programa_riego_campo_fecha_sync_uidx
  on public.programa_riego (campo_id, fecha);

create table if not exists public.observaciones_riego (
  id uuid primary key default gen_random_uuid(),
  tipo text not null check (tipo in ('programa', 'real')),
  campo_id uuid not null references public.campos(id) on delete cascade,
  fecha date not null,
  observacion text not null check (char_length(btrim(observacion)) between 1 and 500),
  creado_por uuid,
  creado_por_nombre text,
  actualizado_por uuid,
  actualizado_por_nombre text,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  constraint observaciones_riego_celda_key unique (tipo, campo_id, fecha)
);

create index if not exists observaciones_riego_fecha_idx
  on public.observaciones_riego (fecha);

create or replace function public.set_riego_sync_actualizado_en()
returns trigger
language plpgsql
as $$
begin
  new.actualizado_en = now();
  if new.modificado_en is null then
    new.modificado_en = now();
  end if;
  return new;
end;
$$;

create or replace function public.set_observacion_riego_sync_actualizada()
returns trigger
language plpgsql
as $$
begin
  new.actualizado_en = now();
  return new;
end;
$$;

drop trigger if exists trg_riego_actualizado_en on public.riego;
drop trigger if exists trg_riego_sync_actualizado_en on public.riego;
create trigger trg_riego_sync_actualizado_en
before update on public.riego
for each row execute function public.set_riego_sync_actualizado_en();

drop trigger if exists trg_programa_riego_actualizado_en on public.programa_riego;
drop trigger if exists trg_programa_riego_sync_actualizado_en on public.programa_riego;
create trigger trg_programa_riego_sync_actualizado_en
before update on public.programa_riego
for each row execute function public.set_riego_sync_actualizado_en();

drop trigger if exists trg_observaciones_riego_actualizado_en on public.observaciones_riego;
drop trigger if exists trg_observaciones_riego_sync_actualizado_en on public.observaciones_riego;
create trigger trg_observaciones_riego_sync_actualizado_en
before update on public.observaciones_riego
for each row execute function public.set_observacion_riego_sync_actualizada();

alter table public.riego enable row level security;
alter table public.programa_riego enable row level security;
alter table public.observaciones_riego enable row level security;

drop policy if exists riego_authenticated_all on public.riego;
create policy riego_authenticated_all
on public.riego for all to authenticated
using (true) with check (true);

drop policy if exists programa_riego_authenticated_all on public.programa_riego;
create policy programa_riego_authenticated_all
on public.programa_riego for all to authenticated
using (true) with check (true);

drop policy if exists observaciones_riego_authenticated_all on public.observaciones_riego;
create policy observaciones_riego_authenticated_all
on public.observaciones_riego for all to authenticated
using (true) with check (true);

grant select, insert, update, delete on public.riego to authenticated;
grant select, insert, update, delete on public.programa_riego to authenticated;
grant select, insert, update, delete on public.observaciones_riego to authenticated;

do $$
declare
  sequence_name text;
begin
  sequence_name := pg_get_serial_sequence('public.riego', 'id');
  if sequence_name is not null then
    execute format('grant usage, select on sequence %s to authenticated', sequence_name);
  end if;
  sequence_name := pg_get_serial_sequence('public.programa_riego', 'id');
  if sequence_name is not null then
    execute format('grant usage, select on sequence %s to authenticated', sequence_name);
  end if;
end;
$$;

commit;

create or replace view public.v_observaciones_riego_detalle
with (security_invoker = true)
as
select
  o.id,
  o.tipo,
  o.campo_id,
  o.fecha,
  c.potrero,
  c.bloque,
  c.especie,
  c.variedad,
  c.hectareas,
  c.precipitacion,
  c.caudal,
  case when o.tipo = 'programa' then pr.horas_programadas else r.horas_riego end as horas,
  case when o.tipo = 'programa' then pr.volumen_programado else r.volumen end as volumen,
  o.observacion,
  o.creado_por_nombre,
  o.actualizado_por_nombre,
  o.creado_en,
  o.actualizado_en
from public.observaciones_riego o
join public.campos c on c.id = o.campo_id
left join public.riego r
  on o.tipo = 'real' and r.campo_id = o.campo_id and r.fecha = o.fecha
left join public.programa_riego pr
  on o.tipo = 'programa' and pr.campo_id = o.campo_id and pr.fecha = o.fecha;

grant select on public.v_observaciones_riego_detalle to authenticated;

do $$
declare
  table_name text;
begin
  foreach table_name in array array['riego', 'programa_riego', 'observaciones_riego']
  loop
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = table_name
    ) then
      execute format('alter publication supabase_realtime add table public.%I', table_name);
    end if;
  end loop;
end;
$$;

notify pgrst, 'reload schema';

select 'riego' as tabla, count(*) as registros from public.riego
union all
select 'programa_riego', count(*) from public.programa_riego
union all
select 'observaciones_riego', count(*) from public.observaciones_riego;
