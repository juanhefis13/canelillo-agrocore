# Monitoreo de plagas - Fases 3 y 4

## Alcance

Esta entrega incorpora el modelo protocolizado en Supabase sin reemplazar el
modelo historico. No modifica la interfaz Flutter ni cambia todavia el flujo
que utilizan los monitores en terreno.

## Orden de ejecucion

Ejecutar cada archivo completo en el SQL Editor de Supabase y comprobar su
resultado antes de continuar:

1. `supabase_monitoreo_protocolos.sql`
2. `supabase_monitoreo_protocolos_seed.sql`
3. `supabase_monitoreo_protocolos_tests.sql`

El tercer archivo finaliza con `ROLLBACK`; sus arboles, visitas y monitoreos de
prueba nunca quedan guardados.

No ejecutar `supabase_monitoreo_plagas_normalizar_campos.sql` como parte de
este proceso porque contiene eliminaciones incompatibles con esta ampliacion.

## Tablas nuevas

### Catalogos

- `plagas`
- `estructuras_vegetales`
- `estados_biologicos`
- `plaga_estados_biologicos`
- `tipos_dano`
- `enemigos_naturales`
- `fenologias`
- `atributos_monitoreo`

### Protocolos

- `protocolos_monitoreo`
- `protocolo_estructuras`
- `protocolo_atributos`

### Operacion

- `visitas_monitoreo`
- `monitoreo_estructuras`
- `monitoreo_unidades`
- `monitoreo_unidad_estados`
- `monitoreo_unidad_danos`
- `monitoreo_unidad_enemigos`
- `monitoreo_atributos`
- `monitoreo_fotografias`

La tabla `monitoreo_fotografias` conserva el metadato y la idempotencia. El
bucket privado `monitoreo-fotografias`, sus politicas y la cola local se
implementaron en
la fase especifica de fotografias.

## Columnas aditivas en monitoreo_plagas

- `plaga_id`
- `visita_id`
- `protocolo_id`
- `protocolo_version`
- `fenologia`
- `estado_registro`
- `observaciones`
- `finalizado_en`

Se conservan sin cambios `tipo_plaga`, `total_calculado`, los conteos por etapa,
`arbol_id`, `id_operacion_cliente` y las columnas de ubicacion y autoria.

## Compatibilidad

- Los registros sin protocolo siguen usando la validacion movil historica.
- Los registros protocolizados usan unidades revisadas y positivas.
- `total_calculado` no se usa como incidencia.
- `tipo_plaga` se mantiene y se sincroniza con la plaga del protocolo nuevo.
- El seed completa `plaga_id` comparando nombres normalizados, sin reemplazar
  el texto historico.
- Una visita, su arbol y `campo_id` deben corresponder al mismo bloque.
- Una version de protocolo utilizada queda protegida; los cambios futuros
  deben crearse como una version nueva.

## Calculos

`monitoreo_estructuras.incidencia_porcentaje` es una columna generada:

```text
cantidad_positiva / cantidad_revisada * 100
```

Cuando no hay unidades revisadas o la estructura no es evaluable, la incidencia
es `NULL`. La vista `v_monitoreo_resumen_estructura` agrega numeradores y
denominadores por fecha, plaga y estructura; no promedia porcentajes ni mezcla
hojas, frutos, brotes o ramillas.

## Seguridad

- Todas las tablas nuevas tienen RLS habilitado.
- Los usuarios autenticados pueden leer catalogos y operacion.
- `admin` administra catalogos y protocolos.
- `admin` y `supervisor` registran y actualizan operacion.
- Solo `admin` elimina registros operativos.
- Las vistas nuevas usan `security_invoker`.

## Pruebas incluidas

- Incidencia 4/10 = 40%.
- Incidencia 2/10 = 20% sin mezclarlas.
- Cero revisadas produce `NULL`.
- Positivas mayores que revisadas se rechazan.
- Dos estados en una misma unidad no duplican la unidad positiva.
- Snapshot de protocolo version 1 frente a version 2.
- Agregacion ponderada 6/30 = 20%.
- Estructura obligatoria incompleta no se puede finalizar.
- `no_evaluable` permite finalizar con motivo.
- `id_operacion_cliente` repetido se rechaza.
- RLS y politica de insercion existen.

## Validacion local realizada

Los tres archivos se ejecutaron sobre PostgreSQL aislado con un esquema base
equivalente al auditado. Tambien se repitieron migracion y seed para comprobar
idempotencia. La secuencia completa termino sin errores.

## Continuacion movil

La persistencia Flutter, SQLite v2 y la cola protocolizada se documentan en
`docs/monitoreo_plagas_fase_4_movil.md`. La interfaz de captura se incorpora en
la fase siguiente, manteniendo el flujo historico durante la transicion.
