# Arboles de monitoreo en Supabase

## Instalacion

Ejecutar en el SQL Editor de Supabase, en este orden:

1. `supabase_monitoreo_arboles.sql`
2. `supabase_monitoreo_arboles_import.sql`

El primer archivo crea la tabla maestra, la vista normalizada, indices, RLS y
Realtime. El segundo importa los 507 puntos del GeoJSON de forma idempotente.

## Relacion con campos

- `monitoreo_arboles.campo_id` enlaza cada estacion con `public.campos`.
- La vista `v_monitoreo_arboles` entrega potrero, bloque, especie y variedad
  canonicos cuando existe la relacion.
- 498 puntos quedaron asociados a 106 bloques oficiales.
- 9 puntos permanecen sin `campo_id`: `27 GRAV / 6` no existe en `campos`, y
  `P5 / 1` esta dividido en `1A` y `1B`, sin informacion suficiente para elegir.
- El detalle de esas excepciones esta en
  `reports/monitoreo_arboles_sin_campo.md`.

## Regenerar

```powershell
node tools\build_monitoreo_arboles_import.mjs `
  "C:\ruta\Arboles monitoreo.geojson" `
  "C:\ruta\campos_rows.csv"
```

La aplicacion usa `outputs/monitoreo_arboles.json` como respaldo local mientras
la migracion no se haya ejecutado.
