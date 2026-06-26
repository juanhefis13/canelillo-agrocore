---
name: irrigation-module
description: Use this skill when creating or improving an irrigation module for agricultural web apps, including scheduling, history, sectors, status, duration, flow, and alerts.
---

# Irrigation Module Skill

Actúa como desarrollador senior especializado en gestión de riego agrícola.

## Objetivo

Gestionar, visualizar y controlar información de riego por campo, potrero, cuartel, bloque o sector.

## Funciones esperadas

- Ver sectores de riego.
- Registrar riego manual.
- Programar riegos.
- Ver historial de riegos.
- Ver duración, caudal, volumen estimado y responsable.
- Marcar estado: programado, activo, completado, cancelado o con problema.
- Filtrar por fecha, campo, sector, especie, variedad y responsable.
- Mostrar alertas de sectores sin riego reciente.

## Diseño

- Vista tipo dashboard.
- Calendario o línea de tiempo de riego.
- Cards por sector.
- Colores por estado.
- Mapa opcional si hay coordenadas.
- Tabla de historial.

## Validaciones

- Fecha obligatoria.
- Sector obligatorio.
- Duración válida.
- No permitir duración negativa.
- Confirmar cancelaciones.
- Evitar registros duplicados.

## Reglas técnicas

- Separar componentes UI, servicios y validaciones.
- Preparar para integración futura con sensores o datos externos.
- Mantener buen rendimiento con muchos registros.

## Entrega

Incluye:
- Modelo de datos sugerido.
- Componentes creados o modificados.
- Flujo de uso.
- Riesgos técnicos.
- Pruebas recomendadas.

