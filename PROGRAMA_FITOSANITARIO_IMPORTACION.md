# Importacion Programa Fitosanitario

- Programas oficiales: 70
- Lineas de producto: 253
- Productos unicos: 96
- Lineas por revisar: 9

## Criterios aplicados

- `NARANJOS` se normaliza como `NARANJA`; el valor original queda en `especie_fuente`.
- Las filas 146 a 148 sin numero se agrupan como aplicacion `7-TARDIA`, porque forman la etapa de cuaja tardia entre las aplicaciones 7 y 8.
- La fila 220 se registra como `UREA`, indicada expresamente en el objetivo de esa fila.
- Las dosis ausentes o unidades no interpretables quedan con `incompleto = true`; no se inventan cantidades.
- Las fechas numericas de Excel se convierten a fecha ISO.

## Filas por revisar

- 68: GARLON sin dosis.
- 81 y 84: PROTECTOR SOLAR sin dosis ni unidad.
- 190: ENVIDOR con dosis, pero sin unidad.
- 224 a 227: FOSTROL, FOSFIMAX4020, FOSFIMAX y BIOREND sin dosis.
- 235: POLI MAGNESIO contiene `200` en la columna unidad.

Estas lineas aparecen en el catalogo, pero no se copian a una orden hasta completar su dosis oficial.

## Ejecucion

Ejecuta `supabase_programa_fitosanitario.sql` completo en Supabase SQL Editor. El bloque final informa cuantas filas quedaron cargadas.
