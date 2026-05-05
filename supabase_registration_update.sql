-- Ejecutar si ya habias creado las tablas antes de agregar registro desde la app.

alter table profiles
add column if not exists rut text;

drop policy if exists "profiles insert own" on profiles;
create policy "profiles insert own" on profiles
for insert
with check (id = auth.uid());

-- Opcional recomendado:
-- En Authentication -> Providers -> Email puedes desactivar confirm email
-- durante pruebas. Si lo dejas activo, el usuario debera confirmar correo
-- antes de poder iniciar sesion.
