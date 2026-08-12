-- Agrega la dosis agronomica recomendada al maestro de productos de fertilizacion.
-- Ejecutar una vez en Supabase para instalaciones existentes.

begin;

alter table public.fertilizante_productos
  add column if not exists kg_ha_recomendado numeric(12, 3) null,
  add column if not exists kg_ha_palto numeric(12, 3) null,
  add column if not exists kg_ha_mandarina numeric(12, 3) null,
  add column if not exists kg_ha_naranja numeric(12, 3) null;

-- Los valores historicos generales pertenecen a Naranja. En una instalacion
-- nueva de estas columnas se conservan ahi, sin duplicarlos en otras especies.
update public.fertilizante_productos
set kg_ha_naranja = kg_ha_recomendado
where kg_ha_recomendado is not null
  and kg_ha_palto is null
  and kg_ha_mandarina is null
  and kg_ha_naranja is null;

-- Repara la version anterior de esta migracion, que copiaba el valor general
-- en las tres especies. El valor historico se conserva en Naranja y en
-- kg_ha_recomendado; Palto y Mandarina quedan disponibles para su dosis real.
update public.fertilizante_productos
set
  kg_ha_palto = null,
  kg_ha_mandarina = null,
  kg_ha_naranja = kg_ha_recomendado
where kg_ha_recomendado is not null
  and kg_ha_palto is not distinct from kg_ha_recomendado
  and kg_ha_mandarina is not distinct from kg_ha_recomendado
  and kg_ha_naranja is not distinct from kg_ha_recomendado;

alter table public.fertilizante_productos
  drop constraint if exists fertilizante_productos_kg_ha_recomendado_chk;

alter table public.fertilizante_productos
  add constraint fertilizante_productos_kg_ha_recomendado_chk
  check (kg_ha_recomendado is null or kg_ha_recomendado >= 0);

alter table public.fertilizante_productos
  drop constraint if exists fertilizante_productos_kg_ha_palto_chk,
  drop constraint if exists fertilizante_productos_kg_ha_mandarina_chk,
  drop constraint if exists fertilizante_productos_kg_ha_naranja_chk;

alter table public.fertilizante_productos
  add constraint fertilizante_productos_kg_ha_palto_chk check (kg_ha_palto is null or kg_ha_palto >= 0),
  add constraint fertilizante_productos_kg_ha_mandarina_chk check (kg_ha_mandarina is null or kg_ha_mandarina >= 0),
  add constraint fertilizante_productos_kg_ha_naranja_chk check (kg_ha_naranja is null or kg_ha_naranja >= 0);

drop policy if exists fertilizante_productos_actualizacion on public.fertilizante_productos;
create policy fertilizante_productos_actualizacion
  on public.fertilizante_productos
  for update
  to authenticated
  using (true)
  with check (
    (kg_ha_recomendado is null or kg_ha_recomendado >= 0)
    and (kg_ha_palto is null or kg_ha_palto >= 0)
    and (kg_ha_mandarina is null or kg_ha_mandarina >= 0)
    and (kg_ha_naranja is null or kg_ha_naranja >= 0)
  );

grant select on public.fertilizante_productos to authenticated;
grant update (kg_ha_recomendado, kg_ha_palto, kg_ha_mandarina, kg_ha_naranja, actualizado_en)
on public.fertilizante_productos to authenticated;

commit;

select id, nombre_comercial, unidad, disolucion,
  kg_ha_recomendado, kg_ha_palto, kg_ha_mandarina, kg_ha_naranja
from public.fertilizante_productos
where activo
order by nombre_comercial;
