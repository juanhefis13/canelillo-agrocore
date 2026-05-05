-- Ejecutar en Supabase SQL Editor si el frontend muestra "Sin codigos disponibles"
-- aunque SELECT * FROM vehiculos ORDER BY codigo; funcione en el SQL Editor.
-- El SQL Editor usa permisos elevados; la pagina web usa el rol authenticated/anon y necesita policy SELECT.

alter table public.vehiculos enable row level security;

drop policy if exists "vehiculos_select_authenticated" on public.vehiculos;
create policy "vehiculos_select_authenticated"
on public.vehiculos
for select
to authenticated
using (true);

-- Opcional: deja lectura tambien para anon si tu app consulta antes de iniciar sesion.
drop policy if exists "vehiculos_select_anon" on public.vehiculos;
create policy "vehiculos_select_anon"
on public.vehiculos
for select
to anon
using (true);

-- Verificacion rapida:
select codigo, clasificacion, tipo_vehiculo, marca, modelo
from public.vehiculos
order by codigo;
