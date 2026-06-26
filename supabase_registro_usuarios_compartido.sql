-- Registro compartido de usuarios Canelillo
-- Ejecutar en Supabase SQL Editor.
-- Objetivo: que AgroCore, Canelillo Harvest, Calicatas y futuras apps creen
-- el mismo perfil central en public.usuarios al registrar un usuario en Auth.

begin;

-- La tabla public.usuarios ya existe en BD CANELILLO:
-- id uuid references auth.users(id)
-- nombre_completo text
-- rol public.rol_usuario
-- activo boolean
-- rut text
-- area text

alter table public.usuarios
  add column if not exists area text;

create or replace function public.normalize_canelillo_role(raw_role text)
returns public.rol_usuario
language plpgsql
immutable
as $$
declare
  clean text := lower(trim(coalesce(raw_role, '')));
begin
  if clean in ('admin', 'administrador') then
    return 'admin'::public.rol_usuario;
  end if;

  if clean in ('supervisor', 'jefe', 'encargado') then
    return 'supervisor'::public.rol_usuario;
  end if;

  return 'bodeguero'::public.rol_usuario;
end;
$$;

create or replace function public.normalize_canelillo_area(raw_area text)
returns text
language sql
immutable
as $$
  select case lower(trim(coalesce(raw_area, '')))
    when 'agro' then 'agrocore'
    when 'agro core' then 'agrocore'
    when 'agrocore' then 'agrocore'
    when 'harvest' then 'cosecha'
    when 'canelillo_harvest' then 'cosecha'
    when 'cosecha' then 'cosecha'
    when 'calicata' then 'calicatas'
    when 'calicatas' then 'calicatas'
    when 'riego' then 'riego'
    when 'riegos' then 'riego'
    when 'fertilizante' then 'fertilizacion'
    when 'fertilizantes' then 'fertilizacion'
    when 'fertilizacion' then 'fertilizacion'
    when 'all' then 'todas'
    when 'todos' then 'todas'
    when 'todas' then 'todas'
    else 'todas'
  end;
$$;

create or replace function public.handle_canelillo_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  user_name text;
  user_rut text;
  user_role text;
  user_area text;
begin
  user_name := nullif(trim(coalesce(
    meta->>'nombre_completo',
    meta->>'full_name',
    split_part(new.email, '@', 1),
    'Usuario Canelillo'
  )), '');

  user_rut := nullif(upper(replace(trim(coalesce(meta->>'rut', '')), ' ', '')), '');
  user_role := coalesce(meta->>'rol', meta->>'role', 'bodeguero');
  user_area := coalesce(meta->>'area', meta->>'app_origen', 'todas');

  insert into public.usuarios (id, nombre_completo, rut, rol, area, activo)
  values (
    new.id,
    coalesce(user_name, 'Usuario Canelillo'),
    user_rut,
    public.normalize_canelillo_role(user_role),
    public.normalize_canelillo_area(user_area),
    true
  )
  on conflict (id) do update
  set
    nombre_completo = coalesce(excluded.nombre_completo, public.usuarios.nombre_completo),
    rut = coalesce(excluded.rut, public.usuarios.rut),
    rol = coalesce(public.usuarios.rol, excluded.rol),
    area = coalesce(public.usuarios.area, excluded.area),
    activo = coalesce(public.usuarios.activo, true);

  return new;
end;
$$;

drop trigger if exists on_canelillo_auth_user_created on auth.users;
create trigger on_canelillo_auth_user_created
after insert on auth.users
for each row execute function public.handle_canelillo_auth_user();

alter table public.usuarios enable row level security;

create or replace function public.current_app_role()
returns public.rol_usuario
language plpgsql
security definer
set search_path = public
set row_security = off
stable
as $$
declare
  user_role public.rol_usuario;
begin
  select u.rol
    into user_role
  from public.usuarios u
  where u.id = auth.uid()
    and u.activo is true
  limit 1;

  return coalesce(user_role, 'bodeguero'::public.rol_usuario);
end;
$$;

drop policy if exists "usuarios select own" on public.usuarios;
drop policy if exists "usuarios insert own" on public.usuarios;
drop policy if exists "usuarios update own" on public.usuarios;
drop policy if exists "usuarios select own or manager" on public.usuarios;
drop policy if exists "usuarios update own or admin" on public.usuarios;

create policy "usuarios select own or manager"
on public.usuarios
for select
using (
  id = auth.uid()
  or public.current_app_role() in ('admin', 'supervisor')
);

create policy "usuarios insert own"
on public.usuarios
for insert
with check (id = auth.uid());

create policy "usuarios update own or admin"
on public.usuarios
for update
using (
  id = auth.uid()
  or public.current_app_role() = 'admin'
)
with check (
  id = auth.uid()
  or public.current_app_role() = 'admin'
);

commit;

-- Metadata recomendada desde cualquier app:
-- {
--   "full_name": "Nombre Apellido",
--   "nombre_completo": "Nombre Apellido",
--   "rut": "12.345.678-9",
--   "role": "supervisor",
--   "rol": "supervisor",
--   "area": "cosecha",
--   "app_origen": "canelillo_harvest"
-- }
