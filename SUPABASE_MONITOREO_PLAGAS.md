# Monitoreo de plagas en Supabase

## Instalacion

Ejecutar en el SQL Editor de Supabase, en este orden:

1. `supabase_monitoreo_plagas.sql`
2. `supabase_monitoreo_plagas_import.sql`

Si la tabla ya estaba instalada, ejecutar solamente
`supabase_monitoreo_plagas_dashboard.sql` para agregar los totales calculados y
el indice utilizado por los filtros de potrero/bloque Excel.

El primer archivo crea la tabla, la vista unificada, indices, permisos, RLS y
Realtime. Tambien registra los bloques 1 al 5 de CirrusAgro en `campos`.

El segundo archivo importa 13.786 observaciones. Es idempotente: utiliza la
combinacion `origen_capa + origen_fid`, por lo que volver a ejecutarlo actualiza
los registros existentes en lugar de duplicarlos.

## Modelo

- `monitoreo_plagas.campo_id` enlaza cada observacion con `campos`.
- Potrero, bloque, especie, variedad y hectareas canonicos se leen desde
  `v_monitoreo_plagas`.
- `potrero_excel` y `bloque_excel` conservan la fuente tabular.
- `alias_geojson`, `bloque_geojson`, latitud y longitud conservan la fuente GIS.
- `total_origen` mantiene el `TOTAL` recibido y `total_calculado` mantiene la
  suma real de las etapas de la plaga.
- `total_huevos_ninfas` suma huevos y ninfas 1 a 3.
- `carga_observada` agrega adultos, larvas y pupas para no ocultar presencia en
  plagas que no registran estados inmaduros.

## Verificacion esperada

Al terminar la importacion, la primera consulta debe informar:

- `total_registros`: 13.786
- `asociados_a_campos`: 13.779
- `sin_asociar`: 7

Los siete registros no asociados no tienen un potrero confiable en el archivo
de origen y se mantienen sin `campo_id` para evitar asignaciones incorrectas.

## Regenerar el import

Cuando cambie el archivo consolidado o las capas QGIS:

```powershell
node tools\build_plagas_supabase_import.mjs "C:\ruta\a\geojson"
```

El comando vuelve a generar `supabase_monitoreo_plagas_import.sql` y valida que
cada plaga tenga la misma cantidad de filas y geometrias antes de escribirlo.
