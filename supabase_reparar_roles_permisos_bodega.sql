-- Reparacion de roles y permisos para Canelillo AgroCore
-- Objetivo:
-- 1) Usar supervisor como rol interno de Jefe.
-- 2) Permitir que admin y supervisor no tengan limitaciones.
-- 3) Permitir que bodeguero trabaje sin limites en Stock y Bodega.
-- 4) Corregir insert/update en despachos, despacho_productos y movimientos_stock.

begin;

-- Si alguna cuenta quedó como jefe, se devuelve a supervisor.
-- Nota: rol::text evita problemas si el enum tiene valores antiguos.
update public.usuarios
set rol = 'supervisor'
where rol::text = 'jefe';

-- Funcion usada por las politicas RLS.
-- Busca el rol del usuario conectado en public.usuarios.
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
  limit 1;

  return coalesce(user_role, 'bodeguero'::public.rol_usuario);
end;
$$;

-- Usuarios: cada usuario puede ver su perfil. Admin y supervisor pueden ver perfiles.
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

-- Despachos/Bodega: admin, supervisor y bodeguero pueden leer, insertar y actualizar.
drop policy if exists "despachos read roles" on public.despachos;
drop policy if exists "despachos bodega write" on public.despachos;
drop policy if exists "despachos write roles" on public.despachos;

create policy "despachos read roles"
on public.despachos
for select
using (public.current_app_role() in ('admin', 'supervisor', 'bodeguero'));

create policy "despachos write roles"
on public.despachos
for all
using (public.current_app_role() in ('admin', 'supervisor', 'bodeguero'))
with check (public.current_app_role() in ('admin', 'supervisor', 'bodeguero'));

-- Productos del despacho: mismo permiso que despachos.
drop policy if exists "despacho productos read roles" on public.despacho_productos;
drop policy if exists "despacho productos bodega write" on public.despacho_productos;
drop policy if exists "despacho productos write roles" on public.despacho_productos;

create policy "despacho productos read roles"
on public.despacho_productos
for select
using (public.current_app_role() in ('admin', 'supervisor', 'bodeguero'));

create policy "despacho productos write roles"
on public.despacho_productos
for all
using (public.current_app_role() in ('admin', 'supervisor', 'bodeguero'))
with check (public.current_app_role() in ('admin', 'supervisor', 'bodeguero'));

-- Movimientos de stock: admin, supervisor y bodeguero pueden operar stock.
drop policy if exists "movimientos stock read roles" on public.movimientos_stock;
drop policy if exists "movimientos stock bodega write" on public.movimientos_stock;
drop policy if exists "movimientos stock write roles" on public.movimientos_stock;

create policy "movimientos stock read roles"
on public.movimientos_stock
for select
using (public.current_app_role() in ('admin', 'supervisor', 'bodeguero'));

create policy "movimientos stock write roles"
on public.movimientos_stock
for all
using (public.current_app_role() in ('admin', 'supervisor', 'bodeguero'))
with check (public.current_app_role() in ('admin', 'supervisor', 'bodeguero'));

-- Productos: admin, supervisor y bodeguero pueden manejar stock/productos.
drop policy if exists "productos read roles" on public.productos;
drop policy if exists "productos bodega write" on public.productos;
drop policy if exists "productos write roles" on public.productos;

create policy "productos read roles"
on public.productos
for select
using (public.current_app_role() in ('admin', 'supervisor', 'bodeguero'));

create policy "productos write roles"
on public.productos
for all
using (public.current_app_role() in ('admin', 'supervisor', 'bodeguero'))
with check (public.current_app_role() in ('admin', 'supervisor', 'bodeguero'));

commit;

-- Verificacion sugerida:
-- select id, email, nombre_completo, rol, activo from public.usuarios;
-- select rol, count(*) from public.usuarios group by rol;
