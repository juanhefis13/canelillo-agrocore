-- Correccion fuerte para recursion RLS en AgroAplicaciones.
-- Ejecutar completa en Supabase SQL Editor si aparece:
-- "stack depth limit exceeded"
-- o "canceling statement due to statement timeout".

-- 1) Reemplaza la funcion de rol para que lea profiles sin disparar RLS.
drop function if exists public.current_app_role();

create or replace function public.current_app_role()
returns app_role
language plpgsql
security definer
set search_path = public
set row_security = off
stable
as $$
declare
  user_role app_role;
begin
  select p.role
    into user_role
  from public.profiles p
  where p.id = auth.uid()
  limit 1;

  return user_role;
end;
$$;

grant execute on function public.current_app_role() to authenticated;
grant execute on function public.current_app_role() to anon;

-- 2) Elimina politicas de profiles que puedan llamar current_app_role().
drop policy if exists "profiles own or admin" on public.profiles;
drop policy if exists "profiles insert own" on public.profiles;
drop policy if exists "profiles select own or manager" on public.profiles;
drop policy if exists "profiles update own or admin" on public.profiles;

-- 3) Profiles queda simple: cada usuario lee/crea/actualiza su propio perfil.
-- Esto evita recursion. Mas adelante se puede crear una vista administrativa.
create policy "profiles select own"
on public.profiles
for select
using (id = auth.uid());

create policy "profiles insert own"
on public.profiles
for insert
with check (id = auth.uid());

create policy "profiles update own"
on public.profiles
for update
using (id = auth.uid())
with check (id = auth.uid());

-- 4) Refresca politicas principales usando la funcion corregida.
drop policy if exists "supervisor admin read all base" on public.seasons;
drop policy if exists "supervisor admin write seasons" on public.seasons;
drop policy if exists "programs readable" on public.programs;
drop policy if exists "programs supervisor write" on public.programs;
drop policy if exists "fields readable" on public.fields;
drop policy if exists "fields supervisor write" on public.fields;
drop policy if exists "products readable by supervisor bodega" on public.products;
drop policy if exists "products bodega write" on public.products;
drop policy if exists "orders readable by supervisor bodega" on public.application_orders;
drop policy if exists "orders supervisor write" on public.application_orders;
drop policy if exists "order products readable" on public.application_order_products;
drop policy if exists "order products supervisor write" on public.application_order_products;
drop policy if exists "dispatch readable by supervisor bodega" on public.dispatches;
drop policy if exists "dispatch bodega write" on public.dispatches;
drop policy if exists "dispatch products readable" on public.dispatch_products;
drop policy if exists "dispatch products bodega write" on public.dispatch_products;
drop policy if exists "stock readable by supervisor bodega" on public.stock_movements;
drop policy if exists "stock bodega write" on public.stock_movements;

create policy "seasons read roles" on public.seasons
for select using (public.current_app_role() in ('admin', 'supervisor', 'bodeguero'));

create policy "seasons supervisor write" on public.seasons
for all using (public.current_app_role() in ('admin', 'supervisor'))
with check (public.current_app_role() in ('admin', 'supervisor'));

create policy "programs read roles" on public.programs
for select using (public.current_app_role() in ('admin', 'supervisor', 'bodeguero'));

create policy "programs supervisor write" on public.programs
for all using (public.current_app_role() in ('admin', 'supervisor'))
with check (public.current_app_role() in ('admin', 'supervisor'));

create policy "fields read roles" on public.fields
for select using (public.current_app_role() in ('admin', 'supervisor', 'bodeguero'));

create policy "fields supervisor write" on public.fields
for all using (public.current_app_role() in ('admin', 'supervisor'))
with check (public.current_app_role() in ('admin', 'supervisor'));

create policy "products read roles" on public.products
for select using (public.current_app_role() in ('admin', 'supervisor', 'bodeguero'));

create policy "products bodega write" on public.products
for all using (public.current_app_role() in ('admin', 'supervisor', 'bodeguero'))
with check (public.current_app_role() in ('admin', 'supervisor', 'bodeguero'));

create policy "orders read roles" on public.application_orders
for select using (public.current_app_role() in ('admin', 'supervisor', 'bodeguero'));

create policy "orders supervisor write" on public.application_orders
for all using (public.current_app_role() in ('admin', 'supervisor'))
with check (public.current_app_role() in ('admin', 'supervisor'));

create policy "order products read roles" on public.application_order_products
for select using (public.current_app_role() in ('admin', 'supervisor', 'bodeguero'));

create policy "order products supervisor write" on public.application_order_products
for all using (public.current_app_role() in ('admin', 'supervisor'))
with check (public.current_app_role() in ('admin', 'supervisor'));

create policy "dispatch read roles" on public.dispatches
for select using (public.current_app_role() in ('admin', 'supervisor', 'bodeguero'));

create policy "dispatch bodega write" on public.dispatches
for all using (public.current_app_role() in ('admin', 'bodeguero'))
with check (public.current_app_role() in ('admin', 'bodeguero'));

create policy "dispatch products read roles" on public.dispatch_products
for select using (public.current_app_role() in ('admin', 'supervisor', 'bodeguero'));

create policy "dispatch products bodega write" on public.dispatch_products
for all using (public.current_app_role() in ('admin', 'bodeguero'))
with check (public.current_app_role() in ('admin', 'bodeguero'));

create policy "stock movements read roles" on public.stock_movements
for select using (public.current_app_role() in ('admin', 'supervisor', 'bodeguero'));

create policy "stock movements bodega write" on public.stock_movements
for all using (public.current_app_role() in ('admin', 'bodeguero'))
with check (public.current_app_role() in ('admin', 'bodeguero'));
