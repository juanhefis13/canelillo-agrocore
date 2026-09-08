-- Revision posterior y resolucion manual de equivalencias.
-- Este archivo no modifica datos. Ejecutar despues de 03_procesar.sql.

select tipo, count(*) as total
from importacion.fitosanitario_excepciones
where archivo_origen = 'BD FITOSANITARIO.xlsx'
group by tipo
order by tipo;

select
  e.tipo,
  e.fila_excel,
  e.datos ->> 'nombre_origen' as nombre_origen,
  e.datos -> 'candidatos' as candidatos_exactos,
  e.detalle
from importacion.fitosanitario_excepciones e
where e.archivo_origen = 'BD FITOSANITARIO.xlsx'
  and e.tipo in ('PRODUCTO_SIN_MAESTRO', 'PRODUCTO_MAESTRO_AMBIGUO')
order by e.tipo, nombre_origen;

-- Duplicados ya existentes en el maestro, normalizados por nombre comercial.
select
  regexp_replace(upper(coalesce(nombre_normalizado, nombre)), '[^A-Z0-9]', '', 'g') as clave,
  array_agg(nombre order by nombre) as productos,
  array_agg(id order by nombre) as ids
from public.productos
group by regexp_replace(upper(coalesce(nombre_normalizado, nombre)), '[^A-Z0-9]', '', 'g')
having count(*) > 1
order by clave;

-- Ejemplo para confirmar una equivalencia despues de revisarla:
-- insert into importacion.fitosanitario_producto_alias (origen_clave, producto_id, observacion)
-- select 'DMA6', id, 'Confirmado contra nombre comercial maestro'
-- from public.productos where nombre = 'DMA-6'
-- on conflict (origen_clave) do update set
--   producto_id = excluded.producto_id,
--   observacion = excluded.observacion,
--   confirmado_en = now();

select tipo, fila_excel, datos, detalle
from importacion.fitosanitario_excepciones
where archivo_origen = 'BD FITOSANITARIO.xlsx'
  and tipo not in ('PRODUCTO_SIN_MAESTRO', 'PRODUCTO_MAESTRO_AMBIGUO')
order by tipo, fila_excel nulls last;
