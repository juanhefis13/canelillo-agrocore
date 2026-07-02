-- Observaciones por celda para Programa y Riego real.
-- Ejecutar una vez en Supabase SQL Editor.

begin;

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

create index if not exists observaciones_riego_campo_idx
  on public.observaciones_riego (campo_id, fecha);

create or replace function public.set_observacion_riego_actualizada()
returns trigger
language plpgsql
as $$
begin
  new.actualizado_en = now();
  return new;
end;
$$;

drop trigger if exists trg_observaciones_riego_actualizado_en on public.observaciones_riego;
create trigger trg_observaciones_riego_actualizado_en
before update on public.observaciones_riego
for each row execute function public.set_observacion_riego_actualizada();

alter table public.observaciones_riego enable row level security;

drop policy if exists observaciones_riego_authenticated_all on public.observaciones_riego;
create policy observaciones_riego_authenticated_all
on public.observaciones_riego
for all
to authenticated
using (true)
with check (true);

grant select, insert, update, delete on public.observaciones_riego to authenticated;

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
  o.creado_por,
  o.creado_por_nombre,
  o.actualizado_por,
  o.actualizado_por_nombre,
  o.creado_en,
  o.actualizado_en
from public.observaciones_riego o
join public.campos c on c.id = o.campo_id
left join public.riego r
  on o.tipo = 'real'
 and r.campo_id = o.campo_id
 and r.fecha = o.fecha
left join public.programa_riego pr
  on o.tipo = 'programa'
 and pr.campo_id = o.campo_id
 and pr.fecha = o.fecha;

grant select on public.v_observaciones_riego_detalle to authenticated;

-- Incluye la tabla en Supabase Realtime si aun no pertenece a la publicacion.
do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'observaciones_riego'
  ) then
    alter publication supabase_realtime add table public.observaciones_riego;
  end if;
end;
$$;
