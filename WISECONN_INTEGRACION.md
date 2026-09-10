# Integracion WiseConn con la carta Gantt de riego

## Calculo utilizado

AgroCore suma el volumen positivo informado por WiseConn para cada sector y dia. Luego calcula:

```text
horas de riego real = volumen WiseConn (m3) / caudal del bloque en campos (m3/h)
```

La duracion del evento de WiseConn queda como dato de auditoria, pero no reemplaza este calculo. Si un bloque no tiene un caudal mayor que cero en `public.campos`, AgroCore informa el caso y no inventa horas.

Los eventos que cruzan medianoche distribuyen su volumen entre ambos dias en proporcion a su duracion. Los eventos con volumen cero no generan horas.

## Configuracion

1. Ejecutar `supabase_wiseconn_riego.sql` en Supabase SQL Editor.
2. Crear estas variables de entorno en Netlify:
   - `WISECONN_API_KEY`: API key privada de WiseConn.
   - `WISECONN_FARM_ID`: `4212`.
   - `SUPABASE_ANON_KEY`: clave anon publica del proyecto Supabase usado por AgroCore.
   - `SUPABASE_URL`: URL del proyecto Supabase, si se desea sobrescribir la configuracion predeterminada.
3. Desplegar nuevamente el sitio para que Netlify Functions reciba las variables.
4. Entrar a Riego > Programa y usar `Actualizar WiseConn` para forzar una sincronizacion del mes visible.

La API key nunca se envia al navegador. La funcion de Netlify exige una sesion valida de Supabase antes de consultar WiseConn.

## Edicion manual

Una hora ingresada manualmente reemplaza el calculo WiseConn solamente para ese bloque y fecha. Al borrar la correccion manual, la celda vuelve a mostrar automaticamente el calculo WiseConn disponible.

## Cobertura inicial

La migracion contiene 89 relaciones activas entre zonas WiseConn y filas de `public.campos`. `P27 IMP Sector 8` queda registrado como excluido y no se sincroniza.
