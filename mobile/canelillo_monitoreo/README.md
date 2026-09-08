# Canelillo Monitoreo

Aplicacion Flutter para registrar arboles y monitoreos de plagas en terreno.

![Inicio de sesion](test/screenshots/login_screen.png)

## Funciones

- Inicio de sesion con Supabase y opcion de conservar la sesion.
- Recuperacion de contrasena por correo, deep link y cambio dentro de la app.
- Mapa hibrido con poligonos oficiales de bloques.
- Vista de mapa de calor para analizar presencia por plaga y periodo.
- Vista de puntos con los iconos de plagas definidos en QGIS.
- Capa independiente de arboles, activable en calor o puntos.
- Ubicacion actual visible y acceso rapido para centrar el mapa.
- Panel superior plegable mediante flecha o gesto vertical.
- Vista de mapa respetando el area segura inferior del telefono.
- Alta y correccion de arboles mediante GPS o posicion manual, conservando
  origen y precision; sobre 15 m solicita revision del bloque.
- Captura de etapas configurables por tipo de plaga.
- Registro explicito de monitoreos sin presencia.
- Guardado local-first en SQLite y cola offline idempotente para no bloquear al
  operador con mala senal.
- Sincronizacion automatica al recuperar conectividad y actualizacion incremental
  mediante Supabase Realtime.
- Indicadores de carga para autenticacion, ubicacion, guardado y sincronizacion.
- Visitas protocolizadas con varios arboles, unidades positivas/negativas,
  estados, danos, atributos dinamicos y evidencia fotografica offline.
- Historial paginado, resumen ponderado y mapa de incidencia por plaga y
  estructura.
- Configuracion administrativa de catalogos y protocolos con versionado
  transaccional, disponible solo para cuentas con rol `admin`.

## Base de datos

Ejecutar en Supabase, en este orden, las migraciones ubicadas en la raiz de
AgroCore:

1. `supabase_monitoreo_plagas.sql`
2. `supabase_monitoreo_arboles.sql`
3. `supabase_monitoreo_arboles_import.sql`
4. `supabase_monitoreo_plagas_movil.sql`
5. `supabase_monitoreo_protocolos_auditoria.sql` (revision previa)
6. `supabase_monitoreo_protocolos.sql`
7. `supabase_monitoreo_protocolos_seed.sql`
8. `supabase_monitoreo_protocolos_admin.sql`

`supabase_monitoreo_protocolos_tests.sql` contiene pruebas transaccionales y
se ejecuta despues de la migracion y el seed en un ambiente de validacion.

La ultima migracion agrega catalogo de plagas, correlativos, autoria,
identificadores idempotentes, trazabilidad GPS, indices y Realtime para captura
movil.

## Recuperacion de contrasena

En Supabase Auth > URL Configuration agrega esta URL a `Redirect URLs`:

```text
com.canelillo.monitoreo://login-callback/
```

Android e iOS ya incluyen el esquema nativo. El enlace del correo abre la app y
muestra la pantalla para definir la nueva contrasena.

## Google Maps

Android lee la clave desde `android/local.properties`, archivo excluido de Git:

```properties
GOOGLE_MAPS_API_KEY=clave_android
```

Para iOS se debe configurar una clave restringida al bundle
`com.canelillo.canelilloMonitoreo` en
`ios/Flutter/Secrets.xcconfig`, usando como base
`ios/Flutter/Secrets.xcconfig.example`, antes de compilar en macOS.

## Firma Android

La compilacion `release` exige `android/key.properties` y una clave de carga.
Ambos archivos quedan excluidos de Git. La clave generada debe respaldarse en
un almacen seguro antes de publicar en Google Play; perderla impide actualizar
la aplicacion con la misma identidad.

## Ejecutar

```powershell
flutter pub get
flutter run
```

## Verificar

```powershell
flutter analyze
flutter test
flutter build apk --debug
flutter build apk --release
flutter build appbundle --release
```

El APK de desarrollo queda en
`build/app/outputs/flutter-apk/app-debug.apk`.

Los artefactos publicables quedan en:

- `build/app/outputs/flutter-apk/app-release.apk`
- `build/app/outputs/bundle/release/app-release.aab`
