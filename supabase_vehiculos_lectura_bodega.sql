-- Ejecuta esto si en Supabase SQL Editor la tabla vehiculos tiene datos,
-- pero en la web aparece "Sin codigos disponibles".
-- Permite que usuarios autenticados lean los codigos de vehiculos.

alter table public.vehiculos enable row level security;

drop policy if exists "vehiculos_select_autenticados" on public.vehiculos;

create policy "vehiculos_select_autenticados"
on public.vehiculos
for select
to authenticated
using (true);

-- Verificacion esperada:
select codigo, tipo_vehiculo, marca, modelo
from public.vehiculos
order by codigo asc;
