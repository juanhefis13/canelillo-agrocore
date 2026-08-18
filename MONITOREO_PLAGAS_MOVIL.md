# Monitoreo de plagas movil

## Modelo de campo confirmado

- `campos` es la fuente oficial de potrero, bloque, especie y variedad.
- `monitoreo_arboles.campo_id` identifica el bloque oficial del arbol.
- `monitoreo_plagas.campo_id` y `arbol_id` identifican el bloque y el arbol
  inspeccionado.
- La ubicacion GPS propone el bloque, pero el usuario puede mover el marcador
  antes de guardar. La aplicacion nunca debe adivinar un bloque si el punto
  queda fuera de todos los poligonos.
- Los 498 arboles normalizados heredan especie y variedad desde `campos`.
  Quedan 9 pendientes documentados en `reports/monitoreo_arboles_sin_campo.md`.

## Flujo de terreno

1. Iniciar sesion y descargar catalogos, campos, poligonos y arboles activos.
2. Mostrar la posicion actual, precision GPS y bloque detectado.
3. Seleccionar un arbol existente o crear uno en el punto actual.
4. Permitir arrastrar el marcador y confirmar potrero, bloque, especie y
   variedad antes de guardar.
5. Seleccionar la plaga. El formulario muestra solo las etapas configuradas
   para ese tipo de plaga.
6. Registrar valores de 0 a 10 o marcar `No encontrada`. El maximo queda en el
   catalogo y puede cambiarse sin publicar una nueva version de la app.
7. Guardar primero en SQLite local. La pantalla confirma `Guardado en equipo`.
8. Sincronizar con Supabase en segundo plano. Al confirmar, mostrar
   `Sincronizado` y el correlativo entregado por la base.

## Formularios por plaga

La tabla `monitoreo_plagas_catalogo` controla las etapas visibles. La migracion
inicial infiere la configuracion desde las plagas historicas:

| Plaga | Etapas visibles |
|---|---|
| Aranita roja | Huevos, Ninfa 1, Adultos |
| Conchuela blanca | Ninfa 2, Adultos |
| Escama | Adultos |
| Mosquita blanca | Huevos, Adultos, Larvas, Pupas |
| Pulgon | Ninfa 1, Adultos |
| Trips | Huevos, Adultos, Larvas, Pupas |
| Chanchito blanco | Huevos, Ninfa 1, Adultos |

Antes de construir el formulario Flutter definitivo se debe validar esta tabla
con el encargado de monitoreo. Los registros historicos no se limitan a 10; la
validacion solo se activa en filas nuevas con `id_operacion_cliente`.

## Estrategia offline

- Base local: Drift sobre SQLite.
- Cada arbol y monitoreo nuevo recibe un UUID en `id_operacion_cliente`.
- Estados de cola: `pendiente`, `sincronizando`, `sincronizado`, `error`.
- Reintento exponencial con un maximo de 15 minutos entre intentos.
- La clave unica de operacion hace idempotente cada envio: una reconexion no
  duplica arboles ni monitoreos.
- La sincronizacion envia primero arboles y despues sus monitoreos.
- No se elimina una fila local hasta recibir el `id` y `correlativo` de
  Supabase.
- Supabase Realtime actualiza el mapa web y otros telefonos conectados.

## Precision geografica

- Usar `Geolocator` con alta precision y guardar `precision_metros`.
- Detectar el bloque con point-in-polygon sobre los poligonos descargados.
- Si la precision es mayor a 15 m, mostrar advertencia y mantener disponible
  el ajuste manual.
- Guardar `ubicacion_fuente` como `gps` o `manual` para conservar trazabilidad.
- El mapa web interpola cada bloque por separado y recorta la capa con el
  poligono exacto; el color no se propaga a bloques vecinos.

## Orden de instalacion Supabase

1. `supabase_monitoreo_plagas.sql`
2. `supabase_monitoreo_arboles.sql`
3. `supabase_monitoreo_arboles_import.sql`
4. `supabase_monitoreo_plagas_movil.sql`

El rol operativo inicial puede ser `supervisor`, que ya tiene permisos de
escritura. Antes de desplegar a terreno conviene crear permisos especificos de
monitoreo sin ampliar el acceso a otros modulos.
