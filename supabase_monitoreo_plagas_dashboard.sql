begin;

create index if not exists monitoreo_plagas_excel_fecha_idx
  on public.monitoreo_plagas (potrero_excel, bloque_excel, fecha desc);

create or replace view public.v_monitoreo_plagas
with (security_invoker = true)
as
select
  mp.id,
  mp.campo_id,
  mp.fecha,
  mp.tipo_plaga,
  coalesce(c.potrero, nullif(trim(mp.potrero_excel), ''), 'Sin potrero') as potrero,
  coalesce(c.bloque, nullif(trim(mp.bloque_mapa), ''), nullif(trim(mp.bloque_excel), '')) as bloque,
  c.especie,
  c.variedad,
  c.hectareas,
  (mp.campo_id is not null) as campo_normalizado,
  mp.potrero_excel,
  mp.bloque_excel,
  mp.alias_geojson,
  mp.bloque_geojson,
  mp.alias_mapa,
  mp.bloque_mapa,
  mp.numero_arbol,
  mp.orden_monitoreo,
  mp.encontrado_en,
  mp.sector_monitoreo,
  mp.evidencia_foto,
  mp.total_origen,
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
  mp.origen_capa,
  mp.origen_fid,
  mp.creado_en,
  mp.actualizado_en,
  (mp.huevos + mp.ninfas_1 + mp.ninfas_2 + mp.ninfas_3) as total_huevos_ninfas,
  (
    mp.huevos + mp.ninfas_1 + mp.ninfas_2 + mp.ninfas_3
    + mp.adultos + mp.larvas + mp.pupas
  ) as carga_observada
from public.monitoreo_plagas mp
left join public.campos c on c.id = mp.campo_id;

grant select on public.v_monitoreo_plagas to authenticated;

notify pgrst, 'reload schema';

commit;

select
  tipo_plaga,
  count(*) as monitoreos,
  round(100.0 * count(*) filter (
    where huevos + ninfas_1 + ninfas_2 + ninfas_3 + adultos + larvas + pupas > 0
  ) / nullif(count(*), 0), 1) as presencia_porcentaje,
  sum(huevos + ninfas_1 + ninfas_2 + ninfas_3) as total_huevos_ninfas,
  sum(huevos + ninfas_1 + ninfas_2 + ninfas_3 + adultos + larvas + pupas) as carga_observada
from public.monitoreo_plagas
group by tipo_plaga
order by tipo_plaga;
