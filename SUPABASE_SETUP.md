# Supabase para AgroAplicaciones

Si. Supabase sirve para dejar la app funcionando de forma real con:

- base de datos PostgreSQL
- inicio de sesion
- cuentas por usuario
- permisos por rol
- datos compartidos entre computadores y celulares

Si ya tienes la base creada con los nombres antiguos, ejecuta primero
`supabase_refactor_es.sql`. Esa migracion renombra tablas, columnas, enums,
constraints y politicas RLS sin borrar datos.

## Roles propuestos

- `admin`: administra todo.
- `supervisor`: ve todo, crea programas, potreros y ordenes. En la app se muestra como Supervisor.
- `bodeguero`: ve solo bodega, stock, ordenes necesarias para despachar, salidas y devoluciones.

## Tablas principales

- `usuarios`: perfil del usuario y rol.
- `temporadas`: temporada de dos años, por ejemplo `2024/2025`.
- `programas`: programas por temporada y numero de etapa.
- `campos`: potreros, bloques, especie, variedad y hectareas.
- `productos`: productos, stock, costo, lote y vencimiento.
- `ordenes_aplicacion`: ordenes creadas por supervisor.
- `orden_productos`: productos/dosis de cada orden.
- `despachos`: salidas/devoluciones de bodega.
- `despacho_productos`: productos entregados por cada salida.
- `movimientos_stock`: trazabilidad completa de ingreso, salida, devolucion y ajuste.

## Permisos

El archivo [supabase_schema.sql](./supabase_schema.sql) activa Row Level Security.

Resumen:

- Supervisor/admin pueden crear y editar ordenes, programas y potreros.
- Bodeguero puede leer las ordenes, pero escribir solo salidas, devoluciones y stock.
- Bodeguero no necesita ver paneles de supervisor si la app oculta la navegacion por rol.

## Autocompletado de potreros

La tabla `campos` debe ser la fuente oficial para:

- potrero
- bloques
- especie
- variedad
- hectareas

En la app, al seleccionar un potrero, se pueden rellenar automaticamente bloques, especie, variedad y hectareas. Eso evita escribir mal un potrero o mezclar superficies.

## Siguiente paso tecnico

Para conectar la app a Supabase hace falta:

1. Crear proyecto Supabase.
2. Ejecutar `supabase_schema.sql`.
3. Crear usuarios desde Supabase Auth.
4. Insertar cada usuario en `usuarios` con su rol.
5. Agregar en la app:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - login/logout
   - consultas a tablas
   - ocultar menus segun rol

## Registro con codigo

La app incluye registro con:

- correo
- contraseña
- nombre
- RUT
- rol
- codigo de registro

El codigo actual esta en `app.js` como `REGISTRATION_CODE`.

Para pruebas funciona bien, pero para produccion el codigo no deberia vivir en el frontend porque alguien tecnico podria verlo inspeccionando el codigo. La version mas segura es validar el codigo con una Edge Function o una funcion RPC segura en Supabase.

Si ya creaste las tablas antes de esta mejora, ejecuta:

[supabase_registration_update.sql](./supabase_registration_update.sql)
