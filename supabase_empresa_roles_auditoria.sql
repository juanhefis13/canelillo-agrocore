-- Canelillo AgroCore - Seguridad empresarial, roles y auditoría
-- Ejecutar en Supabase SQL Editor después de revisar nombres de tablas existentes.

-- 1) Roles válidos usados por la app:
-- admin, jefe_agricola, operador, solo_lectura
alter table if exists public.usuarios
  add column if not exists activo boolean default true;

alter table if exists public.usuarios
  drop constraint if exists usuarios_rol_check;

alter table if exists public.usuarios
  add constraint usuarios_rol_check
  check (rol in ('admin', 'jefe_agricola', 'operador', 'solo_lectura', 'supervisor', 'bodeguero'));

-- 2) Auditoría de acciones importantes
create table if not exists public.auditoria_eventos (
  id uuid primary key default gen_random_uuid(),
  creado_en timestamptz not null default now(),
  creado_por uuid references auth.users(id) on delete set null,
  accion text not null,
  entidad text not null,
  entidad_id text,
  detalle jsonb default '{}'::jsonb
);

create index if not exists auditoria_eventos_creado_en_idx on public.auditoria_eventos (creado_en desc);
create index if not exists auditoria_eventos_entidad_idx on public.auditoria_eventos (entidad, entidad_id);

alter table public.auditoria_eventos enable row level security;

drop policy if exists "auditoria_insert_authenticated" on public.auditoria_eventos;
create policy "auditoria_insert_authenticated"
on public.auditoria_eventos
for insert
to authenticated
with check (auth.uid() = creado_por);

drop policy if exists "auditoria_select_admin_jefe" on public.auditoria_eventos;
create policy "auditoria_select_admin_jefe"
on public.auditoria_eventos
for select
to authenticated
using (
  exists (
    select 1 from public.usuarios u
    where u.id = auth.uid()
      and u.rol in ('admin', 'jefe_agricola', 'supervisor')
      and coalesce(u.activo, true) = true
  )
);

-- 3) Función utilitaria para políticas por rol
create or replace function public.usuario_rol_actual()
returns text
language sql
security definer
set search_path = public
as $$
  select coalesce((select rol from public.usuarios where id = auth.uid() and coalesce(activo, true) = true limit 1), 'solo_lectura');
$$;

-- 4) Recomendación de políticas por módulo
-- Ajusta nombres si tu esquema usa tablas distintas.
-- admin: todo
-- jefe_agricola: programa, jefe/órdenes, bodega/reportes
-- operador: bodega e inventario operativo
-- solo_lectura: lectura solamente

-- Ejemplo para productos:
alter table if exists public.productos enable row level security;
drop policy if exists "productos_select_roles" on public.productos;
create policy "productos_select_roles" on public.productos
for select to authenticated using (public.usuario_rol_actual() in ('admin','jefe_agricola','operador','solo_lectura','supervisor','bodeguero'));

drop policy if exists "productos_write_roles" on public.productos;
create policy "productos_write_roles" on public.productos
for all to authenticated
using (public.usuario_rol_actual() in ('admin','operador','bodeguero'))
with check (public.usuario_rol_actual() in ('admin','operador','bodeguero'));

-- Ejemplo para precios/productos, movimientos y órdenes:
alter table if exists public.movimientos_stock enable row level security;
drop policy if exists "movimientos_stock_select_roles" on public.movimientos_stock;
create policy "movimientos_stock_select_roles" on public.movimientos_stock
for select to authenticated using (public.usuario_rol_actual() in ('admin','jefe_agricola','operador','solo_lectura','supervisor','bodeguero'));

drop policy if exists "movimientos_stock_write_roles" on public.movimientos_stock;
create policy "movimientos_stock_write_roles" on public.movimientos_stock
for all to authenticated
using (public.usuario_rol_actual() in ('admin','operador','bodeguero'))
with check (public.usuario_rol_actual() in ('admin','operador','bodeguero'));

alter table if exists public.ordenes_aplicacion enable row level security;
drop policy if exists "ordenes_select_roles" on public.ordenes_aplicacion;
create policy "ordenes_select_roles" on public.ordenes_aplicacion
for select to authenticated using (public.usuario_rol_actual() in ('admin','jefe_agricola','operador','solo_lectura','supervisor','bodeguero'));

drop policy if exists "ordenes_write_roles" on public.ordenes_aplicacion;
create policy "ordenes_write_roles" on public.ordenes_aplicacion
for all to authenticated
using (public.usuario_rol_actual() in ('admin','jefe_agricola','supervisor'))
with check (public.usuario_rol_actual() in ('admin','jefe_agricola','supervisor'));
