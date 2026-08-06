# Configuracion NDVI / Planet y Sentinel Hub

La capa procesada de `Riego > NDVI` puede usar Planet Mosaics o Sentinel Hub para pintar indices directamente sobre el mapa.

## Opcion recomendada con Planet

Planet permite renderizar indices sobre mosaicos Surface Reflectance sin descargar archivos. La API key debe quedar solo en el servidor.

```powershell
$env:PLANET_API_KEY="tu_planet_api_key"
node server.mjs
```

La web usa:

```text
/api/planet/status
/api/planet/mosaics?from=...&to=...
/api/planet/tile?z=...&x=...&y=...&mosaic=...&proc=ndvi
```

Indices Planet disponibles en la pantalla:

- NDVI
- NDWI
- MSAVI2
- VARI
- MTVI2
- TGI

Si la cuenta no tiene acceso a Mosaics o al Area of Access, Planet puede responder sin mosaicos o con 404 en tiles.

## Respaldo con Sentinel Hub

Crear una cuenta en Copernicus Data Space / Sentinel Hub y generar un OAuth Client.

Variables requeridas en el servidor:

```powershell
$env:SENTINEL_HUB_CLIENT_ID="tu_client_id"
$env:SENTINEL_HUB_CLIENT_SECRET="tu_client_secret"
node server.mjs
```

Endpoints usados por defecto:

```text
Token:   https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token
Process: https://sh.dataspace.copernicus.eu/api/v1/process
```

Si se requiere cambiar endpoint:

```powershell
$env:SENTINEL_HUB_TOKEN_URL="..."
$env:SENTINEL_HUB_PROCESS_URL="..."
```

## Como se ve en AgroCore

La web llama a:

```text
/api/sentinel-hub/status
/api/sentinel-hub/tile?z=...&x=...&y=...&index=NDVI&from=...&to=...
```

El `client_secret` queda solo en el servidor. No debe agregarse a `app.js`.

## Netlify

En `netlify.app`, `server.mjs` no se ejecuta. La version web usa la Function:

```text
netlify/functions/sentinel-hub.mjs
```

Endpoints publicados:

```text
/api/sentinel-hub/status
/api/sentinel-hub/tile
```

Configurar las variables en Netlify:

```powershell
netlify env:set SENTINEL_HUB_CLIENT_ID "tu_client_id" --secret
netlify env:set SENTINEL_HUB_CLIENT_SECRET "tu_client_secret" --secret
```

Tambien se pueden agregar desde la web de Netlify en:

```text
Site configuration > Environment variables
```

Despues de guardar variables, hacer un nuevo deploy para que la Function las reciba.

## Cache de tiles

`server.mjs` mantiene cache en memoria para tiles satelitales ya procesados. Esto evita repetir consultas a Copernicus o Planet cuando el usuario vuelve al mismo rango, indice, nivel de zoom y tile.

Variables opcionales:

```powershell
$env:SATELLITE_TILE_CACHE_MAX="900"
$env:SATELLITE_TILE_CACHE_TTL_MS="21600000"
```

La opacidad se aplica en el navegador, por lo que cambiarla no recalcula el NDVI.

## Limite del campo

El procesamiento satelital usa el archivo:

```text
data/canelillo_limites.geojson
```

Ese poligono se usa para:

- Evitar requests desde el navegador para tiles fuera del campo.
- Devolver tile transparente en backend si un tile no intersecta el AOI.
- Mantener libre la movilidad del mapa; el limite solo controla el procesamiento satelital.

Variable opcional para usar otro archivo:

```powershell
$env:SATELLITE_AOI_GEOJSON="C:\ruta\limite.geojson"
```

Guardar este limite en Supabase tambien es posible y no consume mucho: es un GeoJSON pequeno. Conviene hacerlo cuando existan varios campos o varias empresas; para un solo campo, el archivo local es mas simple y rapido.
