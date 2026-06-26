-- Programa de riego y snapshots para riego real
-- Ejecutar en Supabase SQL Editor.
-- La tabla se llama public.programa_riego porque PostgreSQL no usa espacios en nombres.

begin;

create table if not exists public.riego (
  id uuid primary key default gen_random_uuid(),
  campo_id uuid not null references public.campos(id) on delete cascade,
  fecha date not null,
  horas_riego numeric(10, 2) not null default 0,
  volumen numeric(14, 3) not null default 0,
  creado_por uuid references public.usuarios(id),
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  constraint riego_campo_fecha_key unique (campo_id, fecha)
);

create table if not exists public.programa_riego (
  id uuid primary key default gen_random_uuid(),
  campo_id uuid not null references public.campos(id) on delete cascade,
  fecha date not null,
  horas_programadas numeric(10, 2) not null default 0,
  volumen_programado numeric(14, 3) not null default 0,
  potrero text,
  bloque text,
  especie text,
  variedad text,
  hectareas numeric(12, 3),
  precipitacion numeric,
  caudal numeric,
  creado_por uuid references public.usuarios(id),
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  constraint programa_riego_campo_fecha_key unique (campo_id, fecha)
);

create index if not exists programa_riego_fecha_idx
on public.programa_riego (fecha);

create index if not exists programa_riego_potrero_bloque_idx
on public.programa_riego (potrero, bloque);

alter table public.riego
  add column if not exists potrero text,
  add column if not exists bloque text,
  add column if not exists especie text,
  add column if not exists variedad text,
  add column if not exists hectareas numeric(12, 3),
  add column if not exists precipitacion numeric,
  add column if not exists caudal numeric;

update public.programa_riego pr
set
  potrero = c.potrero,
  bloque = c.bloque,
  especie = c.especie,
  variedad = c.variedad,
  hectareas = c.hectareas,
  precipitacion = c.precipitacion,
  caudal = c.caudal
from public.campos c
where pr.campo_id = c.id
  and (
    pr.potrero is null
    or pr.bloque is null
    or pr.especie is null
    or pr.hectareas is null
    or pr.precipitacion is null
    or pr.caudal is null
  );

update public.riego r
set
  potrero = c.potrero,
  bloque = c.bloque,
  especie = c.especie,
  variedad = c.variedad,
  hectareas = c.hectareas,
  precipitacion = c.precipitacion,
  caudal = c.caudal
from public.campos c
where r.campo_id = c.id
  and (
    r.potrero is null
    or r.bloque is null
    or r.especie is null
    or r.hectareas is null
    or r.precipitacion is null
    or r.caudal is null
  );

alter table public.programa_riego enable row level security;

drop policy if exists "programa riego read roles" on public.programa_riego;
drop policy if exists "programa riego write roles" on public.programa_riego;

create policy "programa riego read roles"
on public.programa_riego
for select
using (public.current_app_role() in ('admin', 'supervisor', 'bodeguero'));

create policy "programa riego write roles"
on public.programa_riego
for all
using (public.current_app_role() in ('admin', 'supervisor', 'bodeguero'))
with check (public.current_app_role() in ('admin', 'supervisor', 'bodeguero'));

commit;
