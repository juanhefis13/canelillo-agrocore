# Importacion Programa Fitosanitario CITRICOS TEMPORADA 2026-2027

- Programas oficiales: 63
- Lineas de producto: 228
- Productos unicos: 91
- Lineas por revisar: 8

## Criterios aplicados

- `NARANJOS` se normaliza como `NARANJA`; el valor original queda en `especie_fuente`.
- Los codigos alfanumericos, como `7A`, se conservan en `codigo_aplicacion`.
- La fila 474 se registra como `UREA`, indicada expresamente en el objetivo.
- Las dosis ausentes o unidades no interpretables quedan con `incompleto = true`; no se inventan cantidades.
- Las fechas numericas de Excel se convierten a fecha ISO.

## Filas por revisar

- Fila 322: GARLON; sin dosis y unidad CC/LTS.
- Fila 335: PROTECTOR SOLAR; sin dosis y sin unidad.
- Fila 338: PROTECTOR SOLAR; sin dosis y sin unidad.
- Fila 444: ENVIDOR; dosis 60 y sin unidad.
- Fila 478: FOSTROL; sin dosis y sin unidad.
- Fila 479: FOSFIMAX4020; sin dosis y sin unidad.
- Fila 480: FOSFIMAX; sin dosis y sin unidad.
- Fila 481: BIOREND; sin dosis y sin unidad.

Estas lineas aparecen en el catalogo, pero no se copian a una orden hasta completar su dosis oficial.

## Ejecucion

Ejecuta `supabase_programa_fitosanitario_2026_2027.sql` completo en Supabase SQL Editor. El bloque final informa cuantas filas quedaron cargadas.
