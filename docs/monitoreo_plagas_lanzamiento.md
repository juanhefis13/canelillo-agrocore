# Lanzamiento - Canelillo Monitoreo

## Estado

- Flutter analyze: correcto.
- Pruebas automatizadas: 19 correctas.
- APK release firmado: generado y verificado.
- AAB release firmado: generado.
- Supabase Auth: disponible.
- Migraciones remotas: pendientes de ejecutar con una cuenta administradora.
- Prueba en telefono fisico: pendiente.

## Despliegue Supabase

Ejecutar en este orden y detenerse ante cualquier error:

1. `supabase_monitoreo_plagas_movil.sql`.
2. `supabase_monitoreo_protocolos_auditoria.sql`.
3. `supabase_monitoreo_protocolos.sql`.
4. `supabase_monitoreo_protocolos_seed.sql`.
5. `supabase_monitoreo_protocolos_admin.sql`.
6. `supabase_monitoreo_protocolos_tests.sql` en un ambiente de validacion.

En Supabase Auth > URL Configuration registrar:
`com.canelillo.monitoreo://login-callback/`.

La auditoria no modifica datos. La migracion principal es aditiva. Las pruebas
usan una transaccion y finalizan con `ROLLBACK`.

## Prueba de aceptacion en terreno

1. Iniciar sesion con un monitor y confirmar restauracion de sesion.
2. Con GPS activo, seleccionar un bloque y un arbol existente.
3. Registrar dos plagas en una visita y completar estructuras obligatorias.
4. Marcar unidades positivas, estados superpuestos, dano y una fotografia.
5. Activar modo avion, cerrar la app y confirmar que el borrador reaparece.
6. Finalizar sin conexion, recuperar senal y sincronizar dos veces.
7. Confirmar en Supabase una sola visita y ausencia de duplicados.
8. Revisar historial, resumen ponderado y mapa por plaga + estructura.
9. Con rol admin, crear una nueva version cambiando 10 unidades a 20.
10. Confirmar que el monitoreo anterior mantiene 10 y el nuevo utiliza 20.

## Publicacion Android

- Subir `app-release.aab` a una pista interna de Google Play.
- Restringir la clave de Google Maps al package
  `com.canelillo.canelillo_monitoreo` y a la huella de firma release.
- Respaldar `android/canelillo-upload-key.jks` y `android/key.properties` fuera
  del equipo y del repositorio.
- No distribuir masivamente hasta completar la prueba de aceptacion.

## Publicacion iOS

- Compilar en macOS con Xcode.
- Crear `ios/Flutter/Secrets.xcconfig` desde el ejemplo y configurar una clave
  Google Maps restringida a `com.canelillo.canelilloMonitoreo`.
- Configurar equipo, certificados y perfil de App Store Connect.
- Probar permisos de ubicacion, camara y galeria en un iPhone fisico.
