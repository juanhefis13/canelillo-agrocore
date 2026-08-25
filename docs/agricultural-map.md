# Componente AgroMap

`agricultural-map.js` concentra la configuracion y el estilo de los mapas de AgroCore.

## API principal

- `AgroMap.ensureMap(...)`: crea o reutiliza un Google Map con navegacion, controles y gestos comunes.
- `AgroMap.renderFieldLayers(...)`: dibuja potreros, bloques, limites y etiquetas desde anillos GeoJSON.
- `AgroMap.renderInfrastructureLayers(...)`: dibuja casetas con icono y tranques con contorno azul discontinuo.
- `AgroMap.addGeoJsonLayer(...)`: agrega una capa GeoJSON adicional, por ejemplo tranques, casetas o caminos.
- `AgroMap.clearOverlays(...)`: retira las capas generadas sin recrear el mapa.

## Capa GeoJSON adicional

```js
const casetasLayer = AgroMap.addGeoJsonLayer({
  maps: google.maps,
  map,
  geoJson: casetasGeoJson,
  style: {
    icon: "/assets/caseta.png"
  },
  onClick: ({ feature, latLng }) => {
    // Abrir la ficha de la caseta sin reconstruir el mapa.
  }
});
```

El archivo puede contener `Point`, `Polygon` o `MultiPolygon`. La capa retornada implementa `setMap(null)` para ocultarla y `setMap(map)` para volver a mostrarla.

## Archivos base

- `outputs/potreros.geojson`
- `outputs/bloques.geojson`
- `outputs/casetas.geojson`
- `outputs/tranques.geojson`

Todos los archivos que consume el navegador deben quedar en `EPSG:4326` (`[longitud, latitud]`). El importador `scripts/normalize-agricultural-map.mjs` detecta coordenadas UTM `EPSG:32719`, las convierte a WGS84 y conserva el CRS original como metadato.

Los nombres oficiales y los atributos productivos se obtienen desde `public.campos`. El importador conserva también los nombres originales del GeoJSON y marca `normalizacion_estado` para auditar diferencias sin inventar relaciones.

## Infraestructura comun

```js
const infrastructure = AgroMap.renderInfrastructureLayers({
  maps: google.maps,
  map,
  casetas: layers.casetas,
  tranques: layers.tranques,
  casetaIconUrl: "assets/caseta-map-marker.png"
});

overlays.push(...infrastructure.overlays);
```

Las casetas muestran un icono con el nombre disponible como tooltip. Los tranques mantienen relleno azul suave, borde discontinuo y etiqueta blanca con contorno negro.
