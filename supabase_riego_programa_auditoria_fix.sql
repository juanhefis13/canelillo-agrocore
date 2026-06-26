-- Correccion para que Riego real y Programa de riego guarden en Supabase
-- con auditoria de usuario por celda.
-- Ejecutar en Supabase SQL Editor.

begin;

create table if not exists public.riego (
  id uuid primary key default gen_random_uuid(),
  campo_id uuid not null references public.campos(id) on delete cascade,
  fecha date not null,
  horas_riego numeric(10, 2) not null default 0,
  volumen numeric(14, 3) not null default 0,
  constraint riego_campo_fecha_key unique (campo_id, fecha)
);

create table if not exists public.programa_riego (
  id uuid primary key default gen_random_uuid(),
  campo_id uuid not null references public.campos(id) on delete cascade,
  fecha date not null,
  horas_programadas numeric(10, 2) not null default 0,
  volumen_programado numeric(14, 3) not null default 0,
  constraint programa_riego_campo_fecha_key unique (campo_id, fecha)
);

alter table public.riego
  add column if not exists potrero text,
  add column if not exists bloque text,
  add column if not exists especie text,
  add column if not exists variedad text,
  add column if not exists hectareas numeric(12, 3),
  add column if not exists precipitacion numeric,
  add column if not exists caudal numeric,
  add column if not exists creado_por uuid,
  add column if not exists creado_por_nombre text,
  add column if not exists modificado_por uuid,
  add column if not exists modificado_por_nombre text,
  add column if not exists modificado_en timestamptz,
  add column if not exists creado_en timestamptz not null default now(),
  add column if not exists actualizado_en timestamptz not null default now();

alter table public.programa_riego
  add column if not exists potrero text,
  add column if not exists bloque text,
  add column if not exists especie text,
  add column if not exists variedad text,
  add column if not exists hectareas numeric(12, 3),
  add column if not exists precipitacion numeric,
  add column if not exists caudal numeric,
  add column if not exists creado_por uuid,
  add column if not exists creado_por_nombre text,
  add column if not exists modificado_por uuid,
  add column if not exists modificado_por_nombre text,
  add column if not exists modificado_en timestamptz,
  add column if not exists creado_en timestamptz not null default now(),
  add column if not exists actualizado_en timestamptz not null default now();

create index if not exists riego_campo_fecha_idx on public.riego (campo_id, fecha);
create index if not exists programa_riego_campo_fecha_idx on public.programa_riego (campo_id, fecha);

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
    or r.variedad is null
    or r.hectareas is null
    or r.precipitacion is null
    or r.caudal is null
  );

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
    or pr.variedad is null
    or pr.hectareas is null
    or pr.precipitacion is null
    or pr.caudal is null
  );

update public.riego r
set creado_por_nombre = coalesce(u.nombre_completo, u.email, r.modificado_por_nombre)
from public.usuarios u
where r.creado_por = u.id
  and r.creado_por_nombre is null;

update public.programa_riego pr
set creado_por_nombre = coalesce(u.nombre_completo, u.email, pr.modificado_por_nombre)
from public.usuarios u
where pr.creado_por = u.id
  and pr.creado_por_nombre is null;

create or replace function public.set_actualizado_en()
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

drop trigger if exists trg_riego_actualizado_en on public.riego;
create trigger trg_riego_actualizado_en
before update on public.riego
for each row execute function public.set_actualizado_en();

drop trigger if exists trg_programa_riego_actualizado_en on public.programa_riego;
create trigger trg_programa_riego_actualizado_en
before update on public.programa_riego
for each row execute function public.set_actualizado_en();

alter table public.riego enable row level security;
alter table public.programa_riego enable row level security;

drop policy if exists riego_authenticated_all on public.riego;
create policy riego_authenticated_all
on public.riego
for all
to authenticated
using (true)
with check (true);

drop policy if exists programa_riego_authenticated_all on public.programa_riego;
create policy programa_riego_authenticated_all
on public.programa_riego
for all
to authenticated
using (true)
with check (true);

grant select, insert, update, delete on public.riego to authenticated;
grant select, insert, update, delete on public.programa_riego to authenticated;

commit;
