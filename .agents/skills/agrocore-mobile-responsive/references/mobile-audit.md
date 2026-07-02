# Mobile Audit Reference

Use this reference when performing a detailed responsive pass.

## Viewports

- Phone small: `390x844`
- Phone large: `430x932`
- Tablet portrait: `768x1024`
- Tablet landscape: `1024x768`
- Desktop: current browser size

## Inspection Points

- Header height and sticky behavior.
- Navigation width, scroll, active state, group visibility.
- Filter density and input readability.
- Cards and KPI text wrapping.
- Gantt/table sticky columns and horizontal scroll.
- Map height, marker visibility, popup fit.
- Dialog max width, max height, scroll, touch targets.
- Body overflow: `document.documentElement.scrollWidth > window.innerWidth`.

## Fix Priority

1. Broken navigation or inaccessible views.
2. Clipped controls or unreadable filters.
3. Matrices/tables unusable on phone.
4. Maps or dialogs hidden by viewport limits.
5. Visual polish and spacing consistency.
