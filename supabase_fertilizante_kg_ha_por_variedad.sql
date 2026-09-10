-- Habilita dosis recomendadas por variedad en el maestro de fertilizantes.
-- Ejecutar una vez en Supabase. Conserva las columnas antiguas por especie
-- para no romper integraciones anteriores.

begin;

alter table public.fertilizante_productos
  add column if not exists kg_ha_recomendado numeric(12, 3) null,
  add column if not exists kg_ha_palto numeric(12, 3) null,
  add column if not exists kg_ha_mandarina numeric(12, 3) null,
  add column if not exists kg_ha_naranja numeric(12, 3) null,
  add column if not exists kg_ha_por_variedad jsonb not null default '{}'::jsonb;

comment on column public.fertilizante_productos.kg_ha_por_variedad is
  'Dosis kg/ha por variedad. Las claves usan el nombre normalizado de campos.variedad.';

alter table public.fertilizante_productos
  drop constraint if exists fertilizante_productos_kg_ha_por_variedad_chk;

alter table public.fertilizante_productos
  add constraint fertilizante_productos_kg_ha_por_variedad_chk
  check (jsonb_typeof(kg_ha_por_variedad) = 'object');

-- Transforma las dosis existentes por especie en valores iniciales para cada
-- variedad activa. Un valor ya guardado por variedad siempre tiene prioridad.
update public.fertilizante_productos fp
set kg_ha_por_variedad = coalesce((
  select jsonb_object_agg(v.variedad_key, v.dosis)
  from (
    select distinct
      upper(regexp_replace(trim(c.variedad), '[^[:alnum:]]+', ' ', 'g')) as variedad_key,
      case
        when upper(c.especie) like '%PAL%' then fp.kg_ha_palto
        when upper(c.especie) like '%MANDARIN%' then fp.kg_ha_mandarina
        when upper(c.especie) like '%NARANJ%' then coalesce(fp.kg_ha_naranja, fp.kg_ha_recomendado)
        else null
      end as dosis
    from public.campos c
    where c.activo is not false
      and nullif(trim(c.variedad), '') is not null
  ) v
  where v.dosis is not null
    and v.dosis >= 0
), '{}'::jsonb) || coalesce(fp.kg_ha_por_variedad, '{}'::jsonb);

grant select on public.fertilizante_productos to authenticated;
grant update (kg_ha_por_variedad, actualizado_en)
on public.fertilizante_productos to authenticated;

commit;

select id, nombre_comercial, unidad, disolucion, kg_ha_por_variedad
from public.fertilizante_productos
where activo
order by nombre_comercial;
