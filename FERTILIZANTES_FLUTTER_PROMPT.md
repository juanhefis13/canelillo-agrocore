# Prompt base - modulo movil de Fertilizantes

Implementar en Flutter un modulo de terreno para Fertilizantes/Fertirriego conectado a Supabase.

Unidad operativa: litros.

## Flujo principal

1. Pantalla `Fertilizantes`
   - Acceso a `Preparacion de fertilizante`.
   - Acceso a `Aplicacion al riego`.
   - Estado rapido de casetas y estanques.

2. Preparacion de fertilizante
   - Seleccionar caseta.
   - Seleccionar estanque/FIP.
   - Mostrar volumen maximo y volumen actual.
   - Ingresar producto, cantidad preparada en litros, responsable y observacion.
   - Guardar en `public.fertilizante_preparaciones`.
   - Validar cantidad mayor a 0.

3. Aplicacion al riego
   - Seleccionar caseta.
   - Seleccionar estanque/FIP.
   - Seleccionar potrero y bloque desde `public.campos`.
   - Ingresar cantidad aplicada en litros.
   - Guardar en `public.fertilizante_aplicaciones`.
   - Validar cantidad mayor a 0 y no mayor al volumen actual disponible.

## Supabase

Leer estado desde `public.v_fertilizante_estado_estanques`.

Tablas:
- `public.fertilizante_casetas`
- `public.fertilizante_estanques`
- `public.fertilizante_estanque_potreros`
- `public.fertilizante_preparaciones`
- `public.fertilizante_aplicaciones`

## UX de terreno

- Formularios cortos.
- Botones grandes.
- Guardado con confirmacion visual.
- Modo mala conexion: guardar pendiente local y sincronizar luego.
- Mostrar claramente litros actuales antes de aplicar.
- Evitar seleccionar estanques sin litros disponibles.

## Reglas

- Toda cantidad se guarda en litros.
- Si se necesita m3 en reportes, se calcula como `litros / 1000`.
- Volumen actual = litros preparados - litros aplicados.
- Mantener trazabilidad con usuario, fecha y observacion.
