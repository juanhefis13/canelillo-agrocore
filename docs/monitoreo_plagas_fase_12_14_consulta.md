# Monitoreo de plagas - Fases 12 a 14

## Historial

- Acceso desde el menu de la pantalla principal.
- Consulta paginada de 25 visitas; no descarga el historico completo.
- Filtros por rango de fecha, potrero/bloque, plaga y monitor.
- Detalle bajo demanda con arboles, plagas, estructuras, incidencia, unidades
  positivas, estados, danos, enemigos naturales y fotografias firmadas.
- Mapa compacto de los arboles incluidos en la visita.

## Resumen

- Filtros por fecha, bloque, plaga, estructura y monitor.
- Puntos monitoreados, puntos positivos, unidades revisadas y unidades
  positivas.
- La incidencia usa `SUM(positivas) / SUM(revisadas) * 100`; no promedia
  porcentajes individuales.
- Cada tarjeta mantiene separadas plaga y estructura.

## Mapa

- El usuario elige una unica combinacion plaga + estructura.
- Cada arbol se colorea por su incidencia ponderada dentro del periodo.
- No mezcla hojas, frutos, brotes o ramillas.
- No presenta hectareas infestadas porque el modelo no permite inferirlas.

## Rendimiento y estados

- La vista agregada se consulta por rango y en paginas de 1.000 filas.
- Las fotografias se firman solo al abrir el detalle de una visita.
- Todas las pantallas incluyen carga, error, sin datos y reintento o recarga.
