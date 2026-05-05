# Importar datos del Excel a Supabase

No uses el archivo antiguo `outputs/supabase_import_aplicaciones.sql` para esta carga. Ese archivo era muy grande y, si una parte fallaba, Supabase podia no guardar nada.

Despues de ejecutar `supabase_refactor_es.sql`, vuelve a generar los SQL de importacion con `tools/excel_to_supabase_sql.py`, porque la base ahora usa tablas y columnas en español.

Usa estos archivos separados, en este orden, desde el SQL Editor de Supabase:

1. `outputs/supabase_import_steps/00_preparar_import.sql`
2. `outputs/supabase_import_steps/01_catalogos.sql`
3. `outputs/supabase_import_steps/02_ordenes.sql`
4. `outputs/supabase_import_steps/03_recetas.sql`
5. `outputs/supabase_import_steps/04_salidas_historicas.sql`
6. `outputs/supabase_import_steps/05_verificar_import.sql`

El resultado esperado aproximado desde el Excel actual es:

- Temporadas: 1
- Productos: 53
- Potreros/bloques: 165
- Ordenes: 82
- Productos dentro de ordenes: 195
- Salidas historicas importadas: 66

Si un paso falla, copia el error exacto y el nombre del archivo que estabas ejecutando. Como ahora esta separado por etapas, sera mucho mas facil encontrar el problema sin perder todo.
