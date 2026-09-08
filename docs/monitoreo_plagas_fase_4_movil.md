# Monitoreo de plagas - Fase 4 movil

## Alcance implementado

Esta fase prepara la persistencia y sincronizacion protocolizada de Flutter.
No reemplaza todavia el formulario historico ni expone pantallas nuevas.

## Modelo movil

La aplicacion representa la captura con esta jerarquia:

1. Visita de monitoreo por arbol y bloque.
2. Monitoreo de una plaga con protocolo versionado.
3. Estructuras vegetales exigidas por el protocolo.
4. Unidades revisadas dentro de cada estructura.
5. Estados biologicos, danos, enemigos naturales y atributos.

Los identificadores UUID se crean antes de sincronizar. Por eso una visita
puede guardarse completa sin conexion y conserva todas sus relaciones.

## SQLite v2

La migracion es aditiva: no elimina cache ni operaciones pendientes de la
version anterior.

- `visit_drafts` guarda el borrador completo como JSON.
- `pending_operations` incorpora estado, dependencia, prioridad, proximo
  intento, fecha de actualizacion y ultimo error.
- Las operaciones bloqueadas esperan a que su padre se sincronice.
- Los errores usan reintento exponencial con un maximo de 15 minutos.
- Una operacion marcada como sincronizando por mas de 5 minutos se recupera
  automaticamente al iniciar la app.

## Orden de sincronizacion

La cola respeta los triggers de Supabase:

1. Visita en progreso.
2. Monitoreo de plaga en progreso.
3. Estructura y snapshot del protocolo.
4. Unidades.
5. Estados, danos, enemigos y atributos.
6. Finalizacion del monitoreo.
7. Finalizacion de la visita.

Al volver a guardar un mismo borrador se reemplaza atomica y completamente su
plan pendiente para no conservar operaciones antiguas que el usuario elimino.

## Compatibilidad

El repositorio historico procesa exclusivamente `tree_upsert` y
`monitoring_upsert`. Las operaciones protocolizadas tienen un repositorio y
tipos propios, por lo que ningun sincronizador puede borrar datos que no
reconoce.

## Calculo de incidencia

La incidencia local usa unidades positivas / unidades revisadas. Una unidad
con dos o mas estados biologicos positivos cuenta una sola vez. Una estructura
sin unidades o marcada como no evaluable no produce un porcentaje artificial.

## Validacion realizada

- `flutter analyze`: sin hallazgos.
- `flutter test`: 7 pruebas aprobadas.
- Pruebas de incidencia 4/10, estructura no evaluable, serializacion completa
  del borrador y dependencias de la cola.

## Siguiente fase

Construir las pantallas de visita y captura protocolizada sobre este
repositorio, manteniendo el mapa y el formulario historico durante la
transicion.
