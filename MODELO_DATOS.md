# Modelo logico de aplicaciones

## Relaciones principales

1. `temporadas`
   - Representa una temporada agricola de dos años, por ejemplo `2024/2025`.
   - Contiene varios programas.

2. `programas`
   - Pertenece a una temporada.
   - Tiene un numero definido, usado como etapa o numero de programa.
   - Define el objetivo tecnico que se debe cumplir durante la temporada.
   - El avance real del programa se calcula desde las ordenes y salidas asociadas.

3. `ordenes_aplicacion`
   - La crea el supervisor.
   - Pertenece a una temporada y a un numero de programa.
   - Define potrero, bloques, especie, hectareas, mojamiento por hectarea, productos y dosis.
   - Puede haber varias ordenes para el mismo potrero y mismo programa en fechas distintas.

4. `despachos`
   - La registra bodega dentro de una orden.
   - Descuenta stock.
   - Acumula mojamiento salido y kg/L salidos.
   - Puede ser parcial hasta completar la orden.

5. `Devolucion`
   - Se registra cuando sobra producto o se despacho de mas.
   - Devuelve stock.
   - Resta del acumulado neto de la orden.

6. `movimientos_stock`
   - Controla productos, lotes, vencimiento, kg/L disponibles y costo unitario.
   - Los ingresos por saco calculan costo por kg/L desde precio por saco y kg por saco.

## Calculos de avance

- `Mojamiento programado orden = hectareas * mojamiento L/ha`
- `Producto programado orden = kg/L por ha * hectareas`
- `Producto usado = salidas - devoluciones`
- `Producto faltante = programado - usado`
- `% completado = mojamiento salido neto / mojamiento programado`

## Lectura operacional

La pregunta central del sistema es:

`En esta temporada, para el programa numero X, en este potrero y bloques, cuanto estaba planificado, cuanto se despacho, cuanto costo y cuanto falta?`
