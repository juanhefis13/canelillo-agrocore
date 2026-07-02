begin;

lock table public.monitoreo_plagas in share row exclusive mode;

drop view if exists public.v_monitoreo_plagas;

-- Primera pasada: nombres que ya coinciden con el catalogo oficial.
update public.monitoreo_plagas mp
set campo_id = c.id
from public.campos c
where mp.campo_id is null
  and lower(trim(c.potrero)) = lower(trim(mp.potrero_excel))
  and upper(trim(c.bloque)) = upper(trim(mp.bloque_excel));

-- Segunda pasada: equivalencias QGIS -> public.campos usadas por Calicatas.
with source_names as (
  select
    mp.id,
    lower(trim(coalesce(nullif(mp.alias_mapa, ''), nullif(mp.alias_geojson, ''), nullif(mp.potrero_excel, ''), ''))) as alias_key,
    trim(coalesce(nullif(mp.bloque_mapa, ''), nullif(mp.bloque_geojson, ''), nullif(mp.bloque_excel, ''), '')) as source_block
  from public.monitoreo_plagas mp
  where mp.campo_id is null
), normalized as (
  select
    id,
    case alias_key
      when 'casa verde' then '28'
      when 'el parque 1' then 'El parque 1'
      when 'el peumo' then '29'
      when 'los pinos' then '10'
      when 'los pinos 80' then 'Los pinos Paltos'
      when 'los pinos 2004' then 'Los pinos Paltos'
      when 'parque 2' then 'El parque 2'
      when 'parque 3' then 'El parque 3'
      when 'p1' then '1'
      when 'p19' then '19'
      when 'p20' then '20'
      when 'p20a' then '20A'
      when 'p21' then '21'
      when 'p22' then '22'
      when 'p23' then '23'
      when 'p24' then '24'
      when 'p25' then '25'
      when 'p27 c' then '27 IMP'
      when 'p27 r' then '27 GRAV'
      when 'p2b4' then '2'
      when 'p2b5' then '2'
      when 'p30 4,5' then '30'
      when 'p30 6,7' then '30'
      when 'p30 barnfield' then '30'
      when 'p5' then '5'
      when 'p6' then '6'
      when 'p7' then '7'
      when 'unidad d' then 'D'
      when 'unidad e' then 'E'
      when 'unidad f' then 'F'
      when 'unidad g' then 'G'
      when 'unidad h' then 'H'
      when 'unidad i' then 'I'
      when 'unidad j' then 'J'
      else null
    end as canonical_potrero,
    source_block
  from source_names
), candidates as (
  select
    id,
    canonical_potrero,
    case
      when canonical_potrero = '29' and upper(source_block) in ('2A', '2B') then '2'
      when canonical_potrero = '29' and upper(source_block) in ('5A', '5B') then '5'
      when canonical_potrero = '19' and upper(source_block) = '1' then '4'
      when canonical_potrero = '6' and upper(source_block) = '1' then '3'
      when canonical_potrero ~ '^[D-J]$'
        and upper(source_block) not like canonical_potrero || '%'
        then canonical_potrero || source_block
      else source_block
    end as canonical_bloque
  from normalized
  where canonical_potrero is not null
)
update public.monitoreo_plagas mp
set campo_id = c.id
from candidates n
join public.campos c
  on lower(trim(c.potrero)) = lower(trim(n.canonical_potrero))
 and upper(trim(c.bloque)) = upper(trim(n.canonical_bloque))
where mp.id = n.id
  and mp.campo_id is null;

-- potrero_excel y bloque_excel quedan como copia sincronizada de public.campos.
update public.monitoreo_plagas mp
set
  potrero_excel = c.potrero,
  bloque_excel = c.bloque
from public.campos c
where c.id = mp.campo_id
  and (
    mp.potrero_excel is distinct from c.potrero
    or mp.bloque_excel is distinct from c.bloque
  );

-- Conserva un informe temporal antes de retirar los alias de la tabla productiva.
drop table if exists tmp_monitoreo_plagas_sin_campo;
create temporary table tmp_monitoreo_plagas_sin_campo as
select
  id,
  potrero_excel,
  bloque_excel,
  alias_geojson,
  bloque_geojson,
  alias_mapa,
  bloque_mapa,
  latitud,
  longitud
from public.monitoreo_plagas
where campo_id is null;

-- Sin una coincidencia real, campo_id queda nulo y se conservan los nombres
-- Excel disponibles para poder corregirlos posteriormente sin perder trazabilidad.

drop trigger if exists monitoreo_plagas_actualizado_en on public.monitoreo_plagas;
drop function if exists public.set_monitoreo_plagas_actualizado_en();

-- Conserva una identidad deterministica antes de retirar las columnas de origen.
-- Asi el importador puede ejecutarse nuevamente sin duplicar observaciones.
update public.monitoreo_plagas
set id = md5(origen_capa || ':' || origen_fid::text)::uuid
where nullif(trim(origen_capa), '') is not null
  and origen_fid is not null;

alter table public.monitoreo_plagas
  drop constraint if exists monitoreo_plagas_origen_key,
  drop column if exists total_origen,
  drop column if exists alias_geojson,
  drop column if exists bloque_geojson,
  drop column if exists alias_mapa,
  drop column if exists bloque_mapa,
  drop column if exists sector_monitoreo,
  drop column if exists evidencia_foto,
  drop column if exists origen_capa,
  drop column if exists origen_fid,
  drop column if exists creado_por,
  drop column if exists creado_en,
  drop column if exists actualizado_en,
  drop column if exists total_calculado;

alter table public.monitoreo_plagas
  add column total_calculado numeric(12, 3) generated always as (
    huevos + ninfas_1 + ninfas_2 + ninfas_3
  ) stored;

create or replace view public.v_monitoreo_plagas
with (security_invoker = true)
as
select
  mp.id,
  mp.campo_id,
  mp.fecha,
  mp.tipo_plaga,
  coalesce(c.potrero, 'Sin potrero') as potrero,
  c.bloque,
  c.especie,
  c.variedad,
  c.hectareas,
  (mp.campo_id is not null) as campo_normalizado,
  mp.potrero_excel,
  mp.bloque_excel,
  mp.numero_arbol,
  mp.orden_monitoreo,
  mp.encontrado_en,
  mp.total_calculado,
  mp.huevos,
  mp.ninfas_1,
  mp.ninfas_2,
  mp.ninfas_3,
  mp.adultos,
  mp.larvas,
  mp.pupas,
  mp.longitud,
  mp.latitud,
  mp.total_calculado as total_huevos_ninfas,
  (
    mp.total_calculado + mp.adultos + mp.larvas + mp.pupas
  ) as carga_observada
from public.monitoreo_plagas mp
left join public.campos c on c.id = mp.campo_id;

grant select on public.v_monitoreo_plagas to authenticated;

notify pgrst, 'reload schema';

commit;

select
  count(*) as total_registros,
  count(campo_id) as normalizados_con_campos,
  count(*) filter (where campo_id is null) as sin_campo,
  count(*) filter (
    where campo_id is not null
      and (potrero_excel is null or bloque_excel is null)
  ) as textos_sincronizados_incompletos
from public.monitoreo_plagas;

select
  coalesce(potrero_excel, alias_mapa, alias_geojson, 'Sin potrero') as potrero_origen,
  coalesce(bloque_excel, bloque_mapa, bloque_geojson, 'Sin bloque') as bloque_origen,
  count(*) as registros_sin_coincidencia
from tmp_monitoreo_plagas_sin_campo
group by potrero_origen, bloque_origen
order by registros_sin_coincidencia desc, potrero_origen, bloque_origen;
