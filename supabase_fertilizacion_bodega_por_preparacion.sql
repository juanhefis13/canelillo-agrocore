-- Corrige el saldo de bodega para descontar el producto al preparar.
-- La aplicacion posterior descuenta litros del estanque, no nuevamente de bodega.

begin;

create or replace view public.v_fertilizante_bodega_caseta as
with ingresos as (
  select
    fl.caseta_id,
    fl.producto_id,
    max(fl.unidad) as unidad,
    sum(fl.cantidad_total) as cantidad_ingresada,
    string_agg(distinct fl.folio, ', ' order by fl.folio)
      filter (where fl.folio is not null and fl.folio <> '') as folios,
    string_agg(distinct fl.lote, ', ' order by fl.lote)
      filter (where fl.lote is not null and fl.lote <> '') as lotes
  from public.fertilizante_lotes fl
  where fl.activo
  group by fl.caseta_id, fl.producto_id
), preparaciones as (
  select
    fe.caseta_id,
    fp.producto_id,
    sum(coalesce(fp.producto_cantidad, 0)) as cantidad_preparada
  from public.fertilizante_preparaciones fp
  join public.fertilizante_estanques fe on fe.id = fp.estanque_id
  where fp.producto_id is not null
  group by fe.caseta_id, fp.producto_id
)
select
  c.id as caseta_id,
  c.nombre as caseta,
  p.id as producto_id,
  p.nombre_comercial as producto,
  coalesce(i.unidad, p.unidad) as unidad,
  coalesce(i.cantidad_ingresada, 0) as cantidad_ingresada,
  coalesce(pr.cantidad_preparada, 0) as cantidad_preparada,
  coalesce(i.cantidad_ingresada, 0) - coalesce(pr.cantidad_preparada, 0) as cantidad_disponible,
  coalesce(i.folios, '') as folios,
  coalesce(i.lotes, '') as lotes
from public.fertilizante_casetas c
join ingresos i on i.caseta_id = c.id
join public.fertilizante_productos p on p.id = i.producto_id
left join preparaciones pr
  on pr.caseta_id = c.id
 and pr.producto_id = p.id
where c.activo
  and p.activo;

grant select on public.v_fertilizante_bodega_caseta to authenticated;

commit;

