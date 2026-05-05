# Exportación Excel de órdenes

Se integró la exportación de todas las órdenes cargadas desde Supabase.

## Permisos
La función solo permite exportar si el rol de `public.usuarios.rol` es:

- `admin`
- `supervisor`

El rol `bodeguero` no puede ejecutar la exportación aunque intente llamar la función desde consola.

## Hojas incluidas

1. **Ordenes**: datos generales de cada orden, estado, potrero, programa, mojamiento total, acumulado y pendiente.
2. **Productos por orden**: receta/productos planificados, cantidad acumulada salida y pendiente.
3. **Salidas bodega**: detalle por salida y producto.
4. **Resumen por salida**: una fila por salida, con mojamiento, productos entregados y costo total.
5. **Resumen mojamiento**: total planificado, acumulado, pendiente y avance por orden.
6. **Stock productos**: estado actual de productos.
7. **Movimientos stock**: movimientos registrados de inventario.

## Archivo generado
El archivo se descarga como:

`ordenes-canelillo-AAAA-MM-DD.xls`
