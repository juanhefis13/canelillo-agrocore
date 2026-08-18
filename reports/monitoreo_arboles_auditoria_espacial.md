# Auditoria espacial de arboles de monitoreo

Fecha de revision: 2026-08-13

## Resultado

| Revision | Resultado |
|---|---:|
| Puntos del GeoJSON | 507 |
| Enlazados a `campos` por potrero y bloque | 498 |
| Dentro del poligono del bloque enlazado | 496 |
| Fuera de cualquier poligono | 2 |
| Pendientes de relacion con `campos` | 9 |
| Concordancia espacial sobre puntos comparables | 99,6% |

Los nombres originales se normalizan primero y el `campo_id` resultante es la
fuente de potrero, bloque, especie y variedad. La auditoria posterior verifica
ademas que la coordenada realmente caiga dentro del poligono correspondiente.

## Puntos fuera del poligono

| FID | Potrero origen | Bloque origen | Campo asignado | Resultado |
|---:|---|---|---|---|
| 249 | P30 6,7 | 6 | 30 / 6 | Fuera de todos los poligonos |
| 790 | P22 | 5 | 22 / 5 | Fuera de todos los poligonos |

Estos dos puntos no deben moverse automaticamente. En la futura app movil se
debe mostrar la advertencia de precision y permitir que el encargado ajuste el
marcador antes de confirmar.

Los 9 puntos sin `campo_id` se detallan en
`reports/monitoreo_arboles_sin_campo.md`.
