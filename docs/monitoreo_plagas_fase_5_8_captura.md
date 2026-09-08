# Monitoreo de plagas - Fases 5 a 8

## Implementado

- Acceso `Visita de monitoreo` desde el boton principal del mapa.
- Reutilizacion del selector y los 507 puntos de `monitoreo_arboles`.
- Recuperacion o descarte confirmado de un borrador local pendiente.
- Protocolos filtrados dinamicamente por la especie del bloque.
- Fenologia obtenida desde el catalogo Supabase.
- Estructuras, cantidades, instrucciones y estados biologicos leidos desde el
  protocolo, sin cantidades incrustadas en la pantalla.
- Grilla tactil de unidades: se tocan solamente las positivas y las restantes
  se confirman como negativas.
- Detalle de estados biologicos, abundancia, dano, severidad, enemigos
  naturales y observacion para cada unidad positiva.
- Motivo obligatorio cuando una estructura no se pudo evaluar.
- Resumen separado por estructura con positivas, revisadas e incidencia.
- Guardado continuo del borrador y finalizacion mediante la cola offline.
- Una visita conserva varios arboles bajo una sola sesion y permite continuar,
  editar o retirar cada arbol antes de finalizar el recorrido.
- El registro simple anterior permanece disponible durante la transicion.

## Validaciones de terreno

- No se puede finalizar sin al menos una plaga.
- No se puede finalizar una estructura incompleta.
- Una estructura no evaluable requiere motivo y no aporta negativos.
- Una unidad positiva con varios estados cuenta una sola vez.
- El sincronizador respeta visita, plaga, estructura, unidades y detalle antes
  de finalizar.

## Evidencia fotografica

- Cada unidad positiva admite camara o galeria.
- La imagen se copia al directorio permanente de la aplicacion y su referencia
  queda dentro del borrador SQLite.
- La cola sube primero el archivo al bucket privado
  `monitoreo-fotografias`, registra despues sus metadatos y conserva el archivo
  local ante cualquier error.
- El archivo local solo se elimina al confirmar ambas escrituras remotas.

## Verificacion

- `flutter analyze`: sin hallazgos.
- `flutter test`: modelos, incidencia, jerarquia multiarbol, fotografias, cola
  e interaccion de grilla.
- `flutter build apk --debug`: compilacion Android correcta.
