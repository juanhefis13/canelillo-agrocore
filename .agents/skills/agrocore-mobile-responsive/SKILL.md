---
name: agrocore-mobile-responsive
description: Use this skill when auditing or improving Canelillo AgroCore responsive UI for mobile, tablet, and resized desktop views, especially menu-by-menu reviews of navigation, filters, Gantt matrices, maps, dashboards, tables, forms, and agricultural field workflows without losing existing functionality.
---

# AgroCore Mobile Responsive

## Objective

Make Canelillo AgroCore usable on phones, tablets, and resized desktop browsers for field and office users. Preserve business logic, data traceability, Supabase integration, and the desktop workflow while improving mobile ergonomics.

## Workflow

1. Inspect the current view hierarchy and CSS before editing.
2. Test at minimum these widths: `390x844`, `430x932`, `768x1024`, `1024x768`, and desktop.
3. Review menu by menu:
   - Inicio
   - Riego: Carta Gantt, Bandeja, Balance hidrico, Calicatas
   - Fertilizantes
   - Aplicaciones: Panel principal, Programa, Supervisor, Bodega, Stock, Precios, Reportes
   - Cosecha: Mapa, Informacion
4. Fix global layout first, then module-specific problems.
5. Validate with screenshots or browser inspection after edits.

## Mobile Design Rules

- Keep the app screen useful immediately after load; avoid tall headers.
- Use a compact sticky top navigation on mobile instead of a desktop sidebar.
- Keep primary actions reachable, but move secondary actions into compact rows or horizontal scroll.
- Filters should collapse into dense grids or horizontal chips, not tall vertical stacks.
- Tables and Gantt matrices may scroll horizontally, but their labels and totals must stay readable.
- Maps should have a defined mobile height and avoid being squeezed by side panels.
- Cards in mobile should be information-dense, not decorative.
- Inputs and buttons must be at least practical touch targets, usually `32px+`, unless inside dense matrix cells.
- Avoid text overflow; allow 2 lines for labels before truncating.
- Use `svh`/`dvh`, `minmax()`, `clamp()`, sticky labels, and overflow containers intentionally.

## Module Patterns

### Riego Carta Gantt

- Keep Programa and Riegos reales aligned.
- Preserve keyboard navigation and editable cells.
- On mobile, prioritize horizontal scrolling inside the matrix, not whole-page sideways overflow.
- The filter/header area should be compact and sticky only when it helps.

### Riego Balance Hidrico

- Potrero and Bloques charts should have matching heights.
- Charts can scroll internally when there are many potreros/bloques.
- Multi-select interactions such as `Ctrl+clic` must not break simple tap selection.

### Calicatas

- Map and history should become a single-column stack on mobile.
- Marker popups must fit within the phone viewport.
- Color scales must remain visible in cells and map markers.

### Cosecha

- Map controls and filters must not cover bin markers.
- Information dashboards should turn wide charts/tables into compact cards or scrollable tables.
- Date range and SDP filters must remain usable with thumbs.

### Aplicaciones / Supervisor

- Gantt and order tables need sticky identifiers and horizontal scroll.
- Action buttons should wrap cleanly and keep destructive actions visually distinct.
- Bodega forms must remain fast for repeated data entry.

## Validation Checklist

- No horizontal body overflow except intended scroll regions.
- No clipped buttons, labels, select values, map popups, or chart labels.
- Navigation remains usable with one thumb.
- Every menu can be opened, filtered, and returned from on mobile.
- Loading/empty/error states remain visible.
- Desktop layout is not degraded.
- `node --check app.js` passes after JavaScript changes.
- Cache version in `index.html` and `sw.js` is updated after app or CSS edits.
