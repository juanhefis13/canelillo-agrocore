# Activar Supabase Realtime para evitar parpadeos

El proyecto ahora ya no usa `setInterval` para refrescar cada pocos segundos. Usa Supabase Realtime y solo vuelve a cargar datos cuando cambia una tabla.

## Tablas que deben estar activas en Realtime

Activa Realtime para estas tablas en Supabase:

- `ordenes_aplicacion`
- `orden_productos`
- `despachos`
- `despacho_productos`
- `movimientos_stock`
- `productos`
- `programas`
- `usuarios`

Ruta recomendada en Supabase:

**Database → Replication → supabase_realtime → Source**

Marca las tablas anteriores.

## SQL alternativo

Si prefieres hacerlo por SQL:

```sql
alter publication supabase_realtime add table public.ordenes_aplicacion;
alter publication supabase_realtime add table public.orden_productos;
alter publication supabase_realtime add table public.despachos;
alter publication supabase_realtime add table public.despacho_productos;
alter publication supabase_realtime add table public.movimientos_stock;
alter publication supabase_realtime add table public.productos;
alter publication supabase_realtime add table public.programas;
alter publication supabase_realtime add table public.usuarios;
```

Si alguna ya estaba agregada, Supabase puede mostrar error de duplicado. En ese caso no pasa nada; esa tabla ya estaba activa.

## Qué se corrigió

- Se eliminó el refresco automático cada 12 segundos.
- Se agregó Supabase Realtime.
- Se añadió debounce para evitar recargas múltiples si una acción guarda varias filas.
- Se evitó que la sincronización vuelva a escribir estados iguales y genere loops visuales.
- Se actualizó el cache del service worker para que cargue la nueva versión.
