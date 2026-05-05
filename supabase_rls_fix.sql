-- Correccion de timeout RLS para AgroAplicaciones.
-- Ejecutar en Supabase SQL Editor si login/registro queda pegado con:
-- "canceling statement due to statement timeout"

create or replace function public.current_app_role()
returns app_role
language sql
security definer
set search_path = public
stable
as $$
  select role
  from public.profiles
  where id = auth.uid()
  limit 1
$$;

drop policy if exists "profiles own or admin" on public.profiles;
drop policy if exists "profiles insert own" on public.profiles;

create policy "profiles select own or manager"
on public.profiles
for select
using (
  id = auth.uid()
  or public.current_app_role() in ('admin', 'supervisor')
);

create policy "profiles insert own"
on public.profiles
for insert
with check (id = auth.uid());

create policy "profiles update own or admin"
on public.profiles
for update
using (
  id = auth.uid()
  or public.current_app_role() = 'admin'
)
with check (
  id = auth.uid()
  or public.current_app_role() = 'admin'
);
