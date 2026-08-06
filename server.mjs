import { createServer } from "node:http";
import { createHash } from "node:crypto";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const root = process.cwd();
const port = Number(process.env.PORT || 8787);
const sentinelHubTokenUrl = process.env.SENTINEL_HUB_TOKEN_URL || "https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token";
const sentinelHubProcessUrl = process.env.SENTINEL_HUB_PROCESS_URL || "https://sh.dataspace.copernicus.eu/api/v1/process";
const sentinelHubClientId = process.env.SENTINEL_HUB_CLIENT_ID || "";
const sentinelHubClientSecret = process.env.SENTINEL_HUB_CLIENT_SECRET || "";
const planetApiKey = process.env.PLANET_API_KEY || process.env.PL_API_KEY || "";
const planetBasemapsUrl = process.env.PLANET_BASEMAPS_URL || "https://api.planet.com/basemaps/v1";
const planetTileBaseUrl = process.env.PLANET_TILE_BASE_URL || "https://tiles0.planet.com/basemaps/v1/planet-tiles";
let sentinelHubToken = { value: "", expiresAt: 0 };
const satelliteTileCache = new Map();
const satelliteTileCacheMax = Number(process.env.SATELLITE_TILE_CACHE_MAX || 900);
const satelliteTileCacheTtlMs = Number(process.env.SATELLITE_TILE_CACHE_TTL_MS || 1000 * 60 * 60 * 6);
const satelliteTileDiskCacheDir = process.env.SATELLITE_TILE_DISK_CACHE_DIR || join(root, ".cache", "satellite-tiles");
const satelliteAoiGeoJsonPath = process.env.SATELLITE_AOI_GEOJSON || join(root, "data", "canelillo_limites.geojson");
const transparentPng = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADElEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==", "base64");
let satelliteAoiMetaPromise = null;
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8"
};

const satelliteIndexes = {
  NDVI: { expression: "safeIndex(sample.B08, sample.B04)", stops: [[-0.1, [0.45, 0.05, 0.05]], [0.2, [0.9, 0.32, 0.12]], [0.35, [0.96, 0.75, 0.20]], [0.5, [0.56, 0.78, 0.36]], [0.7, [0.14, 0.55, 0.25]], [0.85, [0.02, 0.34, 0.16]]] },
  NDMI: { expression: "safeIndex(sample.B08, sample.B11)", stops: [[-0.35, [0.50, 0.08, 0.08]], [-0.1, [0.88, 0.32, 0.10]], [0.1, [0.95, 0.77, 0.20]], [0.25, [0.44, 0.75, 0.40]], [0.45, [0.13, 0.42, 0.72]], [0.65, [0.04, 0.23, 0.48]]] },
  NDRE: { expression: "safeIndex(sample.B08, sample.B05)", stops: [[0.0, [0.45, 0.05, 0.05]], [0.12, [0.9, 0.32, 0.12]], [0.22, [0.96, 0.75, 0.20]], [0.32, [0.56, 0.78, 0.36]], [0.45, [0.14, 0.55, 0.25]], [0.58, [0.02, 0.34, 0.16]]] },
  GNDVI: { expression: "safeIndex(sample.B08, sample.B03)", stops: [[-0.1, [0.45, 0.05, 0.05]], [0.25, [0.9, 0.32, 0.12]], [0.4, [0.96, 0.75, 0.20]], [0.55, [0.56, 0.78, 0.36]], [0.72, [0.14, 0.55, 0.25]], [0.85, [0.02, 0.34, 0.16]]] },
  SAVI: { expression: "1.5 * (sample.B08 - sample.B04) / Math.max(0.0001, sample.B08 + sample.B04 + 0.5)", stops: [[-0.1, [0.45, 0.05, 0.05]], [0.18, [0.9, 0.32, 0.12]], [0.32, [0.96, 0.75, 0.20]], [0.48, [0.56, 0.78, 0.36]], [0.65, [0.14, 0.55, 0.25]], [0.8, [0.02, 0.34, 0.16]]] }
};

function sendJson(res, status, payload) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*"
  });
  res.end(JSON.stringify(payload));
}

function sendText(res, status, message) {
  res.writeHead(status, {
    "Content-Type": "text/plain; charset=utf-8",
    "Access-Control-Allow-Origin": "*"
  });
  res.end(message);
}

function satelliteTileCacheKey(prefix, values) {
  const pairs = Object.entries(values)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .sort(([a], [b]) => a.localeCompare(b));
  return `${prefix}:${pairs.map(([key, value]) => `${key}=${value}`).join("&")}`;
}

function getSatelliteTileFromCache(key) {
  const entry = satelliteTileCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    satelliteTileCache.delete(key);
    return null;
  }
  satelliteTileCache.delete(key);
  satelliteTileCache.set(key, entry);
  return entry;
}

function setSatelliteTileCache(key, image, contentType) {
  satelliteTileCache.set(key, {
    image,
    contentType,
    expiresAt: Date.now() + satelliteTileCacheTtlMs
  });
  while (satelliteTileCache.size > satelliteTileCacheMax) {
    const oldestKey = satelliteTileCache.keys().next().value;
    if (!oldestKey) break;
    satelliteTileCache.delete(oldestKey);
  }
}

function sendImage(res, image, contentType = "image/png", cacheStatus = "MISS") {
  res.writeHead(200, {
    "Content-Type": contentType,
    "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    "X-AgroCore-Cache": cacheStatus,
    "Access-Control-Allow-Origin": "*"
  });
  res.end(image);
}

function satelliteDiskCachePath(key) {
  const hash = createHash("sha1").update(key).digest("hex");
  return join(satelliteTileDiskCacheDir, `${hash}.png`);
}

async function getSatelliteTileFromDiskCache(key) {
  try {
    const filePath = satelliteDiskCachePath(key);
    const info = await stat(filePath);
    if (Date.now() - info.mtimeMs > satelliteTileCacheTtlMs) return null;
    const image = await readFile(filePath);
    const entry = { image, contentType: "image/png", expiresAt: Date.now() + satelliteTileCacheTtlMs };
    satelliteTileCache.set(key, entry);
    return entry;
  } catch {
    return null;
  }
}

async function setSatelliteTileDiskCache(key, image) {
  try {
    await mkdir(satelliteTileDiskCacheDir, { recursive: true });
    await writeFile(satelliteDiskCachePath(key), image);
  } catch {
    // El cache en disco es una optimizacion; si falla, el cache en memoria sigue operativo.
  }
}

function coordinatesFromGeoJsonGeometry(geometry, output = []) {
  if (!geometry) return output;
  if (geometry.type === "GeometryCollection") {
    (geometry.geometries || []).forEach((item) => coordinatesFromGeoJsonGeometry(item, output));
    return output;
  }
  const visit = (value) => {
    if (!Array.isArray(value)) return;
    if (Number.isFinite(Number(value[0])) && Number.isFinite(Number(value[1]))) {
      output.push([Number(value[0]), Number(value[1])]);
      return;
    }
    value.forEach(visit);
  };
  visit(geometry.coordinates);
  return output;
}

async function satelliteAoiMeta() {
  if (satelliteAoiMetaPromise) return satelliteAoiMetaPromise;
  satelliteAoiMetaPromise = (async () => {
    try {
      const payload = JSON.parse(await readFile(satelliteAoiGeoJsonPath, "utf8"));
      const features = payload.type === "FeatureCollection" ? payload.features || [] : payload.type === "Feature" ? [payload] : [{ geometry: payload }];
      const points = features.flatMap((feature) => coordinatesFromGeoJsonGeometry(feature.geometry));
      const lngs = points.map(([lng]) => lng).filter(Number.isFinite);
      const lats = points.map(([, lat]) => lat).filter(Number.isFinite);
      if (!lngs.length || !lats.length) return null;
      return {
        bbox: [Math.min(...lngs), Math.min(...lats), Math.max(...lngs), Math.max(...lats)],
        points: points.length
      };
    } catch {
      return null;
    }
  })();
  return satelliteAoiMetaPromise;
}

function tileToLonLatBbox(x, y, z) {
  const scale = 2 ** z;
  const lonLeft = x / scale * 360 - 180;
  const lonRight = (x + 1) / scale * 360 - 180;
  const latTopRad = Math.atan(Math.sinh(Math.PI * (1 - 2 * y / scale)));
  const latBottomRad = Math.atan(Math.sinh(Math.PI * (1 - 2 * (y + 1) / scale)));
  return [lonLeft, latBottomRad * 180 / Math.PI, lonRight, latTopRad * 180 / Math.PI];
}

function bboxesIntersect(a, b) {
  if (!a || !b) return true;
  return a[0] <= b[2] && a[2] >= b[0] && a[1] <= b[3] && a[3] >= b[1];
}

async function satelliteTileOutsideAoi(x, y, z) {
  const meta = await satelliteAoiMeta();
  if (!meta?.bbox) return false;
  return !bboxesIntersect(tileToLonLatBbox(x, y, z), meta.bbox);
}

function planetConfigured() {
  return Boolean(planetApiKey);
}

function planetAuthHeaders() {
  return {
    Authorization: `Basic ${Buffer.from(`${planetApiKey}:`).toString("base64")}`,
    Accept: "application/json"
  };
}

function safeDateOnly(value) {
  const text = String(value || "");
  const match = text.match(/\d{4}-\d{2}-\d{2}/);
  return match ? match[0] : "";
}

function planetMosaicDateValue(mosaic) {
  const direct = safeDateOnly(mosaic.last_acquired || mosaic.lastAcquired || mosaic.first_acquired || mosaic.firstAcquired || mosaic.interval_end || mosaic.intervalEnd);
  if (direct) return direct;
  const name = String(mosaic.name || mosaic.id || "");
  const nameMatch = name.match(/(20\d{2})[-_](\d{2})(?:[-_](\d{2}))?/);
  if (!nameMatch) return "";
  return `${nameMatch[1]}-${nameMatch[2]}-${nameMatch[3] || "15"}`;
}

function planetMosaicRecord(mosaic) {
  const links = mosaic._links || {};
  return {
    id: String(mosaic.id || mosaic.name || ""),
    name: String(mosaic.name || mosaic.id || ""),
    title: String(mosaic.title || mosaic.name || mosaic.id || ""),
    firstAcquired: safeDateOnly(mosaic.first_acquired || mosaic.firstAcquired || mosaic.interval_start || mosaic.intervalStart),
    lastAcquired: safeDateOnly(mosaic.last_acquired || mosaic.lastAcquired || mosaic.interval_end || mosaic.intervalEnd),
    date: planetMosaicDateValue(mosaic),
    tiles: String(links.tiles || links.tile || ""),
    quadCount: Number(mosaic.quad_count ?? mosaic.quadCount ?? 0) || 0
  };
}

function planetMosaicDateInRange(mosaic, from, to) {
  const date = planetMosaicDateValue(mosaic);
  if (!date || !from || !to) return false;
  return date >= from && date <= to;
}

function planetTileUrl(mosaic, z, x, y, proc) {
  const cleanBase = planetTileBaseUrl.replace(/\/+$/, "");
  const safeMosaic = encodeURIComponent(mosaic);
  const safeProc = encodeURIComponent(proc);
  return `${cleanBase}/${safeMosaic}/gmap/${z}/${x}/${y}.png?api_key=${encodeURIComponent(planetApiKey)}&proc=${safeProc}`;
}

async function handlePlanet(req, res, url) {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,OPTIONS",
      "Access-Control-Allow-Headers": "content-type"
    });
    res.end();
    return true;
  }
  if (url.pathname === "/api/planet/status") {
    const aoi = await satelliteAoiMeta();
    sendJson(res, 200, {
      configured: planetConfigured(),
      provider: "Planet Mosaics Surface Reflectance",
      aoi: aoi?.bbox ? { bbox: aoi.bbox, points: aoi.points } : null,
      cache: { memoryMax: satelliteTileCacheMax, ttlMs: satelliteTileCacheTtlMs },
      message: planetConfigured()
        ? "PLANET_API_KEY activa en el servidor"
        : "Falta PLANET_API_KEY o PL_API_KEY en el servidor"
    });
    return true;
  }
  if (!planetConfigured()) {
    sendJson(res, 503, {
      configured: false,
      message: "Falta PLANET_API_KEY o PL_API_KEY en el servidor"
    });
    return true;
  }
  if (url.pathname === "/api/planet/mosaics") {
    try {
      const from = safeDateOnly(url.searchParams.get("from"));
      const to = safeDateOnly(url.searchParams.get("to"));
      const requestUrl = `${planetBasemapsUrl.replace(/\/+$/, "")}/mosaics/?page_size=120`;
      const response = await fetch(requestUrl, { headers: planetAuthHeaders() });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        sendJson(res, response.status, {
          message: payload.message || payload.detail || `Planet Basemaps ${response.status}`
        });
        return true;
      }
      const rawMosaics = Array.isArray(payload.mosaics) ? payload.mosaics : Array.isArray(payload.items) ? payload.items : [];
      const inRange = rawMosaics.filter((mosaic) => planetMosaicDateInRange(mosaic, from, to));
      const source = inRange.length ? inRange : rawMosaics;
      const mosaics = source
        .map(planetMosaicRecord)
        .filter((item) => item.name)
        .sort((a, b) => String(b.date || b.lastAcquired || "").localeCompare(String(a.date || a.lastAcquired || "")))
        .slice(0, 80);
      sendJson(res, 200, {
        mosaics,
        filteredByDate: Boolean(inRange.length),
        message: mosaics.length
          ? ""
          : "La API key de Planet responde, pero no devolvio mosaicos. Revisa que la organizacion tenga acceso activo a Basemaps/Mosaics Surface Reflectance."
      });
      return true;
    } catch (error) {
      sendJson(res, 502, { message: error.message || "No se pudo consultar Planet Basemaps" });
      return true;
    }
  }
  if (url.pathname !== "/api/planet/tile") return false;
  const z = Number(url.searchParams.get("z"));
  const x = Number(url.searchParams.get("x"));
  const y = Number(url.searchParams.get("y"));
  const mosaic = String(url.searchParams.get("mosaic") || "");
  const proc = String(url.searchParams.get("proc") || "ndvi").toLowerCase();
  const allowedProc = new Set(["ndvi", "ndwi", "msavi2", "mtvi2", "vari", "tgi", "rgb", "cir"]);
  if (!Number.isInteger(z) || !Number.isInteger(x) || !Number.isInteger(y) || z < 0 || z > 22 || !mosaic || !allowedProc.has(proc)) {
    sendText(res, 400, "Tile Planet invalido");
    return true;
  }
  try {
    if (await satelliteTileOutsideAoi(x, y, z)) {
      sendImage(res, transparentPng, "image/png", "AOI-SKIP");
      return true;
    }
    const cacheKey = satelliteTileCacheKey("planet", { z, x, y, mosaic, proc });
    const cached = getSatelliteTileFromCache(cacheKey);
    if (cached) {
      sendImage(res, cached.image, cached.contentType, "HIT");
      return true;
    }
    const diskCached = await getSatelliteTileFromDiskCache(cacheKey);
    if (diskCached) {
      sendImage(res, diskCached.image, diskCached.contentType, "DISK");
      return true;
    }
    const response = await fetch(planetTileUrl(mosaic, z, x, y, proc));
    if (!response.ok) {
      sendText(res, response.status, `Planet Tiles ${response.status}: ${(await response.text()).slice(0, 240)}`);
      return true;
    }
    const image = Buffer.from(await response.arrayBuffer());
    const contentType = response.headers.get("content-type") || "image/png";
    setSatelliteTileCache(cacheKey, image, contentType);
    setSatelliteTileDiskCache(cacheKey, image);
    sendImage(res, image, contentType, "MISS");
    return true;
  } catch (error) {
    sendText(res, 502, error.message || "No se pudo procesar Planet Tiles");
    return true;
  }
}

function sentinelConfigured() {
  return Boolean(sentinelHubClientId && sentinelHubClientSecret);
}

async function sentinelAccessToken() {
  if (sentinelHubToken.value && Date.now() < sentinelHubToken.expiresAt - 60000) return sentinelHubToken.value;
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: sentinelHubClientId,
    client_secret: sentinelHubClientSecret
  });
  const response = await fetch(sentinelHubTokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });
  if (!response.ok) throw new Error(`Token Sentinel Hub ${response.status}: ${(await response.text()).slice(0, 240)}`);
  const payload = await response.json();
  sentinelHubToken = {
    value: payload.access_token,
    expiresAt: Date.now() + Math.max(60, Number(payload.expires_in) || 3600) * 1000
  };
  return sentinelHubToken.value;
}

function tileToMercatorBbox(x, y, z) {
  const scale = 2 ** z;
  const origin = 20037508.342789244;
  const tileSize = origin * 2 / scale;
  const minX = -origin + x * tileSize;
  const maxX = minX + tileSize;
  const maxY = origin - y * tileSize;
  const minY = maxY - tileSize;
  return [minX, minY, maxX, maxY];
}

function satelliteEvalscript(indexName) {
  const definition = satelliteIndexes[indexName] || satelliteIndexes.NDVI;
  return `//VERSION=3
function setup() {
  return {
    input: ["B03", "B04", "B05", "B08", "B11", "SCL", "dataMask"],
    output: { bands: 4, sampleType: "AUTO" }
  };
}
function safeIndex(a, b) {
  var denominator = a + b;
  return Math.abs(denominator) < 0.0001 ? -1 : (a - b) / denominator;
}
function maskedScl(value) {
  return value === 0 || value === 1 || value === 3 || value === 8 || value === 9 || value === 10 || value === 11;
}
var stops = ${JSON.stringify(definition.stops)};
function ramp(value) {
  if (value <= stops[0][0]) return stops[0][1];
  for (var i = 1; i < stops.length; i++) {
    if (value <= stops[i][0]) {
      var previous = stops[i - 1];
      var current = stops[i];
      var amount = (value - previous[0]) / Math.max(0.0001, current[0] - previous[0]);
      return [
        previous[1][0] + (current[1][0] - previous[1][0]) * amount,
        previous[1][1] + (current[1][1] - previous[1][1]) * amount,
        previous[1][2] + (current[1][2] - previous[1][2]) * amount
      ];
    }
  }
  return stops[stops.length - 1][1];
}
function evaluatePixel(sample) {
  if (sample.dataMask === 0 || maskedScl(sample.SCL)) return [0, 0, 0, 0];
  var value = ${definition.expression};
  var color = ramp(value);
  return [color[0], color[1], color[2], 0.72];
}`;
}

async function handleSentinelHub(req, res, url) {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,OPTIONS",
      "Access-Control-Allow-Headers": "content-type"
    });
    res.end();
    return true;
  }
  if (url.pathname === "/api/sentinel-hub/status") {
    const aoi = await satelliteAoiMeta();
    sendJson(res, 200, {
      configured: sentinelConfigured(),
      provider: "Copernicus Data Space - Sentinel Hub Process API",
      aoi: aoi?.bbox ? { bbox: aoi.bbox, points: aoi.points } : null,
      cache: { memoryMax: satelliteTileCacheMax, ttlMs: satelliteTileCacheTtlMs },
      message: sentinelConfigured()
        ? "Credenciales Sentinel Hub activas"
        : "Faltan SENTINEL_HUB_CLIENT_ID y SENTINEL_HUB_CLIENT_SECRET en el servidor"
    });
    return true;
  }
  if (url.pathname !== "/api/sentinel-hub/tile") return false;
  if (!sentinelConfigured()) {
    sendText(res, 503, "Faltan credenciales Sentinel Hub en el servidor");
    return true;
  }
  const z = Number(url.searchParams.get("z"));
  const x = Number(url.searchParams.get("x"));
  const y = Number(url.searchParams.get("y"));
  const indexName = String(url.searchParams.get("index") || "NDVI").toUpperCase();
  const from = String(url.searchParams.get("from") || "").slice(0, 10);
  const to = String(url.searchParams.get("to") || "").slice(0, 10);
  const maxCloud = Math.min(100, Math.max(0, Number(url.searchParams.get("maxCloud")) || 35));
  if (!Number.isInteger(z) || !Number.isInteger(x) || !Number.isInteger(y) || z < 0 || z > 22) {
    sendText(res, 400, "Tile invalido");
    return true;
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(from) || !/^\d{4}-\d{2}-\d{2}$/.test(to)) {
    sendText(res, 400, "Rango de fecha invalido");
    return true;
  }
  try {
    if (await satelliteTileOutsideAoi(x, y, z)) {
      sendImage(res, transparentPng, "image/png", "AOI-SKIP");
      return true;
    }
    const cacheKey = satelliteTileCacheKey("sentinel", { z, x, y, indexName, from, to, maxCloud });
    const cached = getSatelliteTileFromCache(cacheKey);
    if (cached) {
      sendImage(res, cached.image, cached.contentType, "HIT");
      return true;
    }
    const diskCached = await getSatelliteTileFromDiskCache(cacheKey);
    if (diskCached) {
      sendImage(res, diskCached.image, diskCached.contentType, "DISK");
      return true;
    }
    const token = await sentinelAccessToken();
    const bbox = tileToMercatorBbox(x, y, z);
    const payload = {
      input: {
        bounds: {
          bbox,
          properties: { crs: "http://www.opengis.net/def/crs/EPSG/0/3857" }
        },
        data: [{
          type: "sentinel-2-l2a",
          dataFilter: {
            timeRange: { from: `${from}T00:00:00Z`, to: `${to}T23:59:59Z` },
            maxCloudCoverage: maxCloud,
            mosaickingOrder: "leastCC"
          }
        }]
      },
      output: {
        width: 256,
        height: 256,
        responses: [{ identifier: "default", format: { type: "image/png" } }]
      },
      evalscript: satelliteEvalscript(indexName)
    };
    const response = await fetch(sentinelHubProcessUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "image/png"
      },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      sendText(res, response.status, `Sentinel Hub ${response.status}: ${(await response.text()).slice(0, 400)}`);
      return true;
    }
    const image = Buffer.from(await response.arrayBuffer());
    setSatelliteTileCache(cacheKey, image, "image/png");
    setSatelliteTileDiskCache(cacheKey, image);
    sendImage(res, image, "image/png", "MISS");
    return true;
  } catch (error) {
    sendText(res, 502, error.message || "No se pudo procesar Sentinel Hub");
    return true;
  }
}

createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host}`);
  if (url.pathname.startsWith("/api/planet")) {
    if (await handlePlanet(req, res, url)) return;
  }
  if (url.pathname.startsWith("/api/sentinel-hub")) {
    if (await handleSentinelHub(req, res, url)) return;
  }
  const requested = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
  const filePath = normalize(join(root, requested));
  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  try {
    const body = await readFile(filePath);
    res.writeHead(200, { "Content-Type": types[extname(filePath)] || "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
}).listen(port, "127.0.0.1", () => {
  console.log(`AgroAplicaciones listo en http://127.0.0.1:${port}`);
});
