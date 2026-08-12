-- Agrega la dosis agronomica recomendada al maestro de productos de fertilizacion.
-- Ejecutar una vez en Supabase para instalaciones existentes.

begin;

alter table public.fertilizante_productos
  add column if not exists kg_ha_recomendado numeric(12, 3) null;

alter table public.fertilizante_productos
  drop constraint if exists fertilizante_productos_kg_ha_recomendado_chk;

alter table public.fertilizante_productos
  add constraint fertilizante_productos_kg_ha_recomendado_chk
  check (kg_ha_recomendado is null or kg_ha_recomendado >= 0);

drop policy if exists fertilizante_productos_actualizacion on public.fertilizante_productos;
create policy fertilizante_productos_actualizacion
  on public.fertilizante_productos
  for update
  to authenticated
  using (true)
  with check (kg_ha_recomendado is null or kg_ha_recomendado >= 0);

grant select on public.fertilizante_productos to authenticated;
grant update (kg_ha_recomendado, actualizado_en) on public.fertilizante_productos to authenticated;

commit;

select id, nombre_comercial, unidad, disolucion, kg_ha_recomendado
from public.fertilizante_productos
where activo
order by nombre_comercial;
