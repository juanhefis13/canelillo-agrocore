# Monitoreo de plagas - Fase 1 y 2

## Objetivo

Auditar la aplicacion Flutter y las migraciones disponibles antes de ampliar el
modelo de monitoreo. Esta fase no modifica datos ni reemplaza el flujo
historico existente.

## Linea base validada

- Aplicacion: `mobile/canelillo_monitoreo`.
- Framework: Flutter con Material.
- Autenticacion: Supabase Auth con PKCE y sesion persistente.
- Mapas: Google Maps con poligonos GeoJSON locales y posicion GPS.
- Persistencia local: `sqflite`, base `canelillo_monitoreo.db`, version 1.
- Cache local: tabla `cache_entries`.
- Cola offline: tabla `pending_operations`.
- Idempotencia remota: `id_operacion_cliente` y `upsert`.
- Orden de sincronizacion: arboles antes que monitoreos.
- Pruebas iniciales: `flutter analyze` sin hallazgos y 3 tests aprobados.

## Tablas y columnas que se reutilizan

### `public.campos`

Es la fuente canonica de potrero, bloque, especie y variedad. No se creara un
catalogo paralelo de campos, potreros, bloques, especies ni variedades.

### `public.monitoreo_arboles`

Sigue siendo la fuente canonica de cada arbol o punto fisico. Se reutilizan:

- `id`
- `campo_id`
- `numero_arbol`
- `hilera`
- `sector_monitoreo`
- `latitud`
- `longitud`
- `activo`
- `id_operacion_cliente`
- `precision_metros`
- `ubicacion_fuente`
- `creado_por`
- `creado_en`
- `actualizado_en`

No se creara una tabla `puntos_monitoreo`.

### `public.monitoreo_plagas`

Se mantiene como cabecera compatible para registros historicos y nuevos. Se
conservan `tipo_plaga`, los conteos historicos por etapa, `total_calculado`,
`correlativo`, `arbol_id` y las columnas offline existentes.

Los registros nuevos protocolizados agregaran relaciones y estado, pero los
registros historicos con relaciones nulas continuaran siendo legibles.

## Arquitectura actual que debe conservarse

1. El dispositivo genera un UUID estable antes de intentar enviar.
2. El registro se intenta guardar primero en Supabase.
3. Si falla, el payload queda en SQLite sin eliminarse.
4. La sincronizacion reintenta arboles antes que monitoreos.
5. La fila local se elimina de la cola solo despues de recibir confirmacion.

Esta base es correcta para idempotencia, pero debe evolucionar para soportar
visitas completas y objetos dependientes.

## Brechas encontradas

### Datos y protocolo

- El formulario actual registra conteos por columnas historicas.
- No existen visitas de monitoreo ni protocolos versionados.
- No existen estructuras, unidades revisadas/positivas, estados normalizados ni danos.
- El formulario contiene reglas particulares para chanchito blanco.
- Los catalogos de respaldo estan hardcodeados en Flutter.

### Offline y sincronizacion

- SQLite esta en version 1 y no tiene tablas de borradores protocolizados.
- La cola no expresa dependencias entre visita, monitoreo, estructura y unidad.
- No hay backoff temporal; solo se contabilizan intentos.
- `connectivity_plus` esta instalado, pero no se utiliza.
- No existe sincronizacion en segundo plano.
- No existe almacenamiento local de fotografias.

### Rendimiento

- La pantalla inicial descarga hasta 5.000 monitoreos.
- El historico real supera ese limite y no esta paginado por fecha.
- `home_screen.dart` concentra mapa, filtros, formularios y detalle en un archivo grande.

### Seguridad y migraciones

- La escritura actual se limita a `admin` y `supervisor`.
- Debe decidirse si se agrega un rol operativo o se mantiene `supervisor`.
- `supabase_monitoreo_plagas_normalizar_campos.sql` contiene eliminaciones de
  columnas y no debe ejecutarse como parte de esta ampliacion.
- Los archivos SQL locales no prueban por si solos el esquema actualmente
  desplegado. Antes de crear FK se debe ejecutar la auditoria de solo lectura.

### Fotografias

No se encontro en el proyecto una infraestructura reutilizable para evidencia
fotografica de monitoreo. La existencia de buckets o politicas en el proyecto
Supabase vivo debe verificarse antes de crearla.

## Diseno aditivo propuesto

### Catalogos

- `plagas`
- `estructuras_vegetales`
- `estados_biologicos`
- `plaga_estados_biologicos`
- `tipos_dano`
- `enemigos_naturales`

La especie del cultivo se tomara de `campos.especie`; no se agregara una tabla
duplicada de cultivos salvo que la auditoria viva encuentre una fuente canonica
existente que deba referenciarse.

### Protocolos

- `protocolos_monitoreo`
- `protocolo_estructuras`

Cada resultado guardara `protocolo_id`, `protocolo_version` y
`cantidad_programada` para preservar el snapshot historico.

### Operacion

- `visitas_monitoreo`
- columnas aditivas en `monitoreo_plagas`
- `monitoreo_estructuras`
- `monitoreo_unidades`
- `monitoreo_unidad_estados`
- `monitoreo_unidad_danos`

La evidencia fotografica se incorporara despues de verificar Storage y las
politicas existentes.

## Reglas de compatibilidad

- Ninguna tabla historica se elimina o trunca.
- Ninguna columna historica se renombra o elimina.
- `tipo_plaga` se conserva junto con la futura `plaga_id`.
- `total_calculado` no se reutiliza como incidencia.
- La incidencia se calcula por estructura con `positivas / revisadas * 100`.
- `cantidad_revisada = 0` produce incidencia nula.
- Las agregaciones usan suma de numeradores sobre suma de denominadores.
- Los historicos sin protocolo o visita se muestran mediante el flujo compatible actual.

## Puertas de control

1. Ejecutar `supabase_monitoreo_protocolos_auditoria.sql` en Supabase.
   La ultima consulta entrega una columna `auditoria_monitoreo_json`; ese unico
   resultado se debe copiar o descargar para disenar la migracion contra el
   esquema realmente desplegado.
2. Revisar tipos UUID, FK, indices, triggers, RLS, funciones y roles reales.
3. Ajustar el diseno si el esquema vivo difiere.
4. Crear la migracion aditiva y sus pruebas SQL.
5. No ejecutar la migracion hasta aprobar sus consultas de preflight.
