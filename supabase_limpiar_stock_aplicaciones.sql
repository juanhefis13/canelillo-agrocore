-- Limpia exclusivamente el inventario de productos fitosanitarios de Aplicaciones.
-- Conserva el catalogo SAG, las ordenes, programas, salidas de bodega y productos.
-- ADVERTENCIA: elimina el historial de entradas, salidas y ajustes de stock.

begin;

lock table public.movimientos_stock in share row exclusive mode;

delete from public.movimientos_stock;

update public.productos
set stock_actual = 0,
    costo_unitario = 0,
    precio_saco = null,
    kg_por_saco = null,
    lote = null,
    fecha_vencimiento = null;

commit;

-- Comprobacion: debe devolver cero movimientos y cero productos con stock.
select
  (select count(*) from public.movimientos_stock) as movimientos_stock,
  (select count(*) from public.productos where stock_actual <> 0) as productos_con_stock,
  (select count(*) from public.productos where lote is not null or fecha_vencimiento is not null) as productos_con_lote;
