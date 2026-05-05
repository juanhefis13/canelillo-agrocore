# AgroAplicaciones

Aplicacion web para planificar, ejecutar y controlar aplicaciones en citricos y paltos.

## Que resuelve

- Ordenes de aplicacion por potrero, bloques, hectareas, cultivo y objetivo.
- Receta tecnica con productos, dosis por 100 litros y mojamiento por hectarea.
- Modo tractorista para registrar estanques reales.
- Control de salida desde bodega y descuento automatico de stock al cerrar la aplicacion.
- Reporte planificado vs real por producto.
- Costos, alertas de stock minimo, lote y vencimiento.
- Respaldo e importacion de datos en JSON.

## Como abrir

Abre `index.html` en el navegador. La app funciona sin servidor y guarda los datos en el navegador usando `localStorage`.

Para usarla como PWA con cache offline, sirve la carpeta con un servidor local. Por ejemplo:

```powershell
python -m http.server 8787
```

Luego abre:

```text
http://127.0.0.1:8787
```

## Flujo recomendado

1. Crear o revisar productos en bodega.
2. Crear una orden de aplicacion.
3. Revisar la receta calculada para cada estanque.
4. En terreno, registrar cada estanque cargado y aplicado.
5. Cerrar la aplicacion.
6. La app descuenta el stock y genera la diferencia planificado vs real.

## Importar el Excel actual

El archivo `tools/excel_to_seed.py` transforma `Aplicaciones.xlsx` en un respaldo JSON compatible con la app.

Ejemplo:

```powershell
python tools/excel_to_seed.py "C:\Users\pc nuevo\Documents\Aplicaciones.xlsx" outputs\respaldo-aplicaciones.json
```

Despues, en la app usa **Importar respaldo** y selecciona el JSON generado.

## Notas importantes

- El Excel original no tiene un modulo completo de compras o existencias, por eso el importador calcula ordenes, recetas y maestros, pero deja el stock inicial en cero cuando no puede inferirlo.
- Para control fino de ahorro, lo ideal es cargar compras, devoluciones, mermas y salidas reales desde bodega.
- La app esta preparada para crecer a una base de datos real cuando quieras usarla con varios usuarios al mismo tiempo.
