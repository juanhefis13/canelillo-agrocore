-- Indices de apoyo para acelerar ordenes, salidas e inventario de Aplicaciones.
-- Ejecutar una vez en Supabase SQL Editor, idealmente fuera del horario de mayor uso.

begin;

create index if not exists ordenes_aplicacion_creacion_fecha_numero_idx
  on public.ordenes_aplicacion (creado_en desc, fecha_planificada desc, numero_orden desc);

create index if not exists orden_productos_orden_idx
  on public.orden_productos (orden_id);

create index if not exists despachos_fecha_id_idx
  on public.despachos (fecha desc, id desc);

create index if not exists despacho_productos_despacho_idx
  on public.despacho_productos (despacho_id);

create index if not exists movimientos_stock_fecha_idx
  on public.movimientos_stock (fecha desc);

create index if not exists movimientos_stock_despacho_idx
  on public.movimientos_stock (despacho_id)
  where despacho_id is not null;

create index if not exists movimientos_stock_producto_fecha_idx
  on public.movimientos_stock (producto_id, fecha desc);

commit;

notify pgrst, 'reload schema';

select
  schemaname,
  tablename,
  indexname
from pg_indexes
where schemaname = 'public'
  and indexname in (
    'ordenes_aplicacion_creacion_fecha_numero_idx',
    'orden_productos_orden_idx',
    'despachos_fecha_id_idx',
    'despacho_productos_despacho_idx',
    'movimientos_stock_fecha_idx',
    'movimientos_stock_despacho_idx',
    'movimientos_stock_producto_fecha_idx'
  )
order by tablename, indexname;
