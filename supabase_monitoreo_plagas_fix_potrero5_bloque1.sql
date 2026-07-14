begin;

with campo_destino as (
  select id, potrero, bloque
  from public.campos
  where trim(potrero) = '5'
    and trim(bloque) = '1'
  order by activo desc, id
  limit 1
), registros_objetivo(id) as (
  values
    ('7073dc40-1fc0-4d78-cfbd-24e7832e847f'::uuid),
    ('e684eba1-40c2-52bc-0401-d1a21e53ef73'::uuid),
    ('a4881c4a-7395-264d-f6fd-58998c2e2632'::uuid),
    ('bb173791-4e4a-da2e-e29f-965704f1e13c'::uuid),
    ('d1dc2daf-f710-64c0-d9f4-ded081ec30dc'::uuid),
    ('9c163c56-7140-1362-3ada-8ac8983a1507'::uuid),
    ('ee23c787-f94f-ad94-db2e-83778be5eb68'::uuid)
), actualizados as (
  update public.monitoreo_plagas mp
  set
    campo_id = campo_destino.id,
    potrero_excel = campo_destino.potrero,
    bloque_excel = campo_destino.bloque
  from campo_destino
  join registros_objetivo on true
  where mp.id = registros_objetivo.id
  returning mp.id, mp.fecha, mp.tipo_plaga, mp.potrero_excel, mp.bloque_excel
)
select *
from actualizados
order by fecha, tipo_plaga, id;

commit;
