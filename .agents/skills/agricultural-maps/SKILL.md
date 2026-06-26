---
name: agricultural-maps
description: Use this skill when creating or improving map features for agricultural web apps, including fields, blocks, GeoJSON, layers, irrigation, fertilizer, harvest status, and alerts.
---

# Agricultural Maps Skill

Actúa como desarrollador senior especializado en mapas agrícolas web.

## Objetivo

Visualizar campos, potreros, cuarteles, bloques, sectores de riego, cosecha y fertilización en un mapa web.

## Funciones esperadas

- Mostrar polígonos de potreros, cuarteles o bloques.
- Colorear sectores por estado.
- Ver información al hacer clic.
- Filtrar por campo, especie, variedad, estado, fecha o actividad.
- Mostrar capas: riego, fertilización, cosecha, alertas.
- Mostrar ubicación actual si está disponible.
- Soportar GeoJSON si el proyecto lo usa.

## Diseño

- Mapa claro.
- Leyenda visible.
- Controles simples.
- Panel lateral con detalle.
- Responsive para móvil y desktop.

## Reglas técnicas

- No cargar todos los datos si son demasiados.
- Usar lazy loading o filtros si corresponde.
- Mantener buen rendimiento.
- Separar lógica de mapa, datos y UI.
- Manejar errores si el GeoJSON está mal formado.

## Entrega

Incluye:
- Componentes del mapa.
- Capas creadas.
- Estructura de datos esperada.
- Cómo probar con datos reales.

