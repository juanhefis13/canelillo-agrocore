-- Permite que bodega sincronice el estado de una orden despues de registrar salidas.
-- Ejecutar en Supabase SQL Editor si las salidas se guardan, pero la orden no refresca estado.
-- No borra datos.

drop policy if exists "ordenes bodega sync estado" on public.ordenes_aplicacion;

create policy "ordenes bodega sync estado"
on public.ordenes_aplicacion
for update
using (public.current_app_role() in ('admin', 'bodeguero'))
with check (public.current_app_role() in ('admin', 'bodeguero'));
