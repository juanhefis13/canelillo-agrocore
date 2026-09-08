# Informe de implementacion - Monitoreo de plagas

## Esquema reutilizado

- `campos`: fuente oficial de potrero, bloque, especie y variedad.
- `monitoreo_arboles`: punto fisico canonico; los nuevos registros usan
  `arbol_id` y resuelven tambien `id_operacion_cliente` cuando el arbol sigue
  pendiente de sincronizacion.
- `monitoreo_plagas`: conserva `tipo_plaga`, estados historicos,
  `total_calculado`, `correlativo` y todas las columnas anteriores.
- `usuarios`: autenticacion, autoria y permisos existentes.
- Se reutilizan `dispositivo_id`, `precision_metros`, `ubicacion_fuente`,
  `creado_por`, `creado_en`, `actualizado_en` e `id_operacion_cliente`.

## Cambios Supabase

Nuevas tablas:

- Catalogos: `plagas`, `estructuras_vegetales`, `estados_biologicos`,
  `tipos_dano`, `enemigos_naturales`, `fenologias` y
  `atributos_monitoreo`.
- Configuracion: `plaga_estados_biologicos`, `protocolos_monitoreo`,
  `protocolo_estructuras` y `protocolo_atributos`.
- Operacion: `visitas_monitoreo`, `monitoreo_estructuras`,
  `monitoreo_unidades`, `monitoreo_unidad_estados`,
  `monitoreo_unidad_danos`, `monitoreo_unidad_enemigos`,
  `monitoreo_atributos` y `monitoreo_fotografias`.

Columnas aditivas de `monitoreo_plagas`:

- `plaga_id`, `visita_id`, `protocolo_id`, `protocolo_version`, `fenologia`,
  `estado_registro`, `observaciones` y `finalizado_en`.

La migracion crea FK, checks, indices, triggers, vistas, RLS y politicas. El
bucket privado `monitoreo-fotografias` acepta JPEG, PNG y HEIC hasta 10 MB.

## Aplicacion Flutter

- Catalogos cacheados y formulario generado desde la version activa del
  protocolo.
- Una visita contiene varios arboles y cada arbol varias plagas.
- La grilla crea todas las unidades al confirmar; el usuario toca solamente
  las positivas.
- Estados biologicos, atributos, cantidades e instrucciones vienen de
  Supabase. Los atributos admiten booleano, opcion, numero y texto.
- Danos, severidad, enemigos naturales, abundancia, observaciones y fotos se
  conservan dentro de la unidad correspondiente.
- Organismos no identificados quedan en `pendiente_identificacion`.
- La consola de configuracion restringida a `admin` administra catalogos,
  activa o desactiva versiones y crea protocolos/versiones desde el celular.
- El cambio de cantidad, frecuencia o instrucciones se guarda mediante una RPC
  atomica. La version previa se conserva para los resultados historicos.

## Offline y sincronizacion

- SQLite v2 conserva catalogos, borradores y operaciones pendientes.
- Cada objeto obtiene UUID estable antes de sincronizar.
- La cola respeta dependencias y reintento exponencial: visita, plaga,
  estructura, unidades, detalles, fotos y finalizacion.
- Reintentar una operacion usa upsert e `id_operacion_cliente`; no duplica.
- Una foto se copia al directorio permanente, se sube a Storage y solo se
  elimina localmente despues de confirmar archivo y metadato remoto.
- El formulario historico anterior sigue disponible y su sincronizador ignora
  tipos de operacion protocolizados.

## Consultas

- Historial paginado con detalle y fotografias bajo demanda.
- Dashboard con incidencia ponderada por plaga + estructura.
- Mapa por porcentaje de unidades positivas; no usa conteo absoluto ni estima
  hectareas infestadas.

## Ampliacion

- Nueva plaga: insertar en `plagas`, asociar estados y crear un protocolo.
- Nuevo cultivo: usar una nueva `cultivo_referencia` asociada a la especie de
  `campos`; Flutter no contiene pantallas separadas por cultivo.
- Cambio de protocolo: crear una nueva version. Los resultados guardan version,
  cantidad e instrucciones snapshot y no se recalculan.

## Verificacion

- `flutter analyze` sin hallazgos.
- 14 pruebas unitarias/widget para incidencia, multestado, no evaluable,
  jerarquia, multiarbol, fotos, idempotencia logica, organismo no identificado
  y agregacion ponderada.
- `flutter build apk --debug`, `flutter build apk --release` y
  `flutter build appbundle --release` correctos.
- SQL de auditoria y pruebas transaccionales incluidos para ejecutar en
  Supabase antes de produccion.

## Preparacion de lanzamiento

- Android genera APK y AAB `release` con una clave de carga RSA propia; ya no
  utiliza la firma de depuracion.
- Google Maps Android se obtiene desde `local.properties`. iOS usa
  `Secrets.xcconfig`, excluido de Git.
- `supabase_monitoreo_protocolos_admin.sql` agrega versionado atomico y evita
  que dos versiones del mismo protocolo queden activas simultaneamente.
- El backend Supabase responde correctamente en Auth. La migracion remota no se
  ejecuto desde este equipo porque no dispone de credenciales administrativas.
- Camara, galeria, permisos, GPS y recuperacion offline requieren la prueba de
  aceptacion final en un telefono fisico antes de distribuir a todos los
  monitores.
