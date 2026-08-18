# Programa de fertilizantes 2026-2027

## Orden de ejecucion en Supabase

1. Ejecutar completo `supabase_programa_fertilizante.sql`.
2. Ejecutar completo `supabase_programa_fertilizante_import.sql`.
3. Revisar la unica fila de auditoria que devuelve el segundo archivo.

El resultado esperado es:

- `filas_fuente`: 4793.
- `filas_insertadas_actualizadas`: 4793.
- `sin_campo`: 0.
- `sin_caseta`: 0.
- `sin_producto`: 0.

La importacion usa `ON CONFLICT`, por lo que se puede volver a ejecutar sin duplicar el programa. Si cambia el Excel, ejecutar nuevamente:

```powershell
python tools\build_programa_fertilizante_import.py
```

Luego se vuelve a ejecutar solamente `supabase_programa_fertilizante_import.sql` en Supabase.

## Criterio de comparacion

El programa toma las cantidades mensuales de la hoja `BASE DE DATOS BLOQUES`. La ejecucion real se calcula con la preparacion asociada al estanque y los litros aplicados al bloque:

`cantidad real de producto = litros aplicados * (cantidad de producto preparada / litros de agua preparados)`

El analisis presenta la cantidad de producto por hectarea, siguiendo la formula operativa usada por el informe de fertilizacion:

`kg aplicados = litros aplicados * disolucion de la preparacion`

`kg/ha = kg aplicados / hectareas del bloque`

Las unidades nutritivas se calculan por nutriente:

`unidad nutritiva = kg de producto * composicion del producto`

`unidad nutritiva/ha = unidad nutritiva / hectareas del bloque`

En los resumenes se suman los kg o unidades del filtro y se dividen por las hectareas unicas de sus bloques. La vista presenta simultaneamente kg/ha y unidades nutritivas/ha para el total de temporada y para cada mes, manteniendo colores distintos para programa y real.

Cada mes calcula el faltante como `programa - real`. Si el real supera al programa, la interfaz informa el exceso. El resumen se presenta como matriz, con los meses en filas y los productos en columnas. Puede alternarse entre una vista por hectarea (kg/ha y unidades/ha) y una vista total (kg y unidades totales). El porcentaje mensual se calcula con los kilos reales frente al programa de la vista seleccionada. El primer boton `+` abre sus dias de aplicacion y cada dia tiene otro `+` para mostrar los productos y hectareas tratadas. Los KPI superiores muestran los totales completos del filtro.

Los filtros son dependientes y siguen la jerarquia temporada, especie, potrero, caseta y producto. Al cambiar una seleccion se eliminan automaticamente las opciones posteriores que no pertenecen a la combinacion elegida.
