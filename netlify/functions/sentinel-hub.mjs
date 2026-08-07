import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const tokenUrl = env("SENTINEL_HUB_TOKEN_URL") || "https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token";
const processUrl = env("SENTINEL_HUB_PROCESS_URL") || "https://sh.dataspace.copernicus.eu/api/v1/process";
const clientId = env("SENTINEL_HUB_CLIENT_ID");
const clientSecret = env("SENTINEL_HUB_CLIENT_SECRET");
const cacheTtlMs = Number(env("SATELLITE_TILE_CACHE_TTL_MS") || 1000 * 60 * 60 * 6);
const cacheMax = Number(env("SATELLITE_TILE_CACHE_MAX") || 450);
const transparentPng = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADElEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==", "base64");
const tileCache = new Map();
let tokenCache = { value: "", expiresAt: 0 };
let aoiMetaPromise = null;

const vegetationPalettes = {
  standard: [[-0.1, [0.46, 0.05, 0.08]], [0.2, [0.88, 0.24, 0.12]], [0.35, [0.96, 0.70, 0.14]], [0.5, [0.64, 0.78, 0.24]], [0.7, [0.08, 0.55, 0.24]], [0.85, [0.00, 0.32, 0.14]]],
  contrast: [[-0.1, [0.64, 0.00, 0.05]], [0.2, [0.96, 0.12, 0.05]], [0.35, [1.00, 0.55, 0.00]], [0.5, [1.00, 0.86, 0.10]], [0.62, [0.43, 0.78, 0.18]], [0.78, [0.02, 0.58, 0.20]], [0.9, [0.00, 0.26, 0.10]]],
  alerts: [[-0.1, [0.55, 0.00, 0.05]], [0.18, [0.82, 0.00, 0.06]], [0.3, [1.00, 0.28, 0.00]], [0.42, [1.00, 0.78, 0.06]], [0.56, [0.78, 0.88, 0.10]], [0.72, [0.05, 0.62, 0.18]], [0.9, [0.00, 0.34, 0.10]]]
};

const moisturePalettes = {
  standard: [[-0.35, [0.52, 0.08, 0.07]], [-0.1, [0.86, 0.34, 0.08]], [0.1, [0.95, 0.76, 0.18]], [0.25, [0.52, 0.75, 0.35]], [0.45, [0.10, 0.42, 0.76]], [0.65, [0.02, 0.20, 0.48]]],
  contrast: [[-0.35, [0.68, 0.00, 0.04]], [-0.1, [0.95, 0.20, 0.00]], [0.08, [1.00, 0.70, 0.00]], [0.22, [0.72, 0.86, 0.18]], [0.42, [0.00, 0.55, 0.82]], [0.65, [0.00, 0.10, 0.55]]],
  alerts: [[-0.35, [0.70, 0.00, 0.04]], [-0.12, [1.00, 0.22, 0.00]], [0.08, [1.00, 0.78, 0.00]], [0.25, [0.20, 0.72, 0.78]], [0.45, [0.00, 0.34, 0.82]], [0.65, [0.00, 0.08, 0.55]]]
};

const waterPalettes = {
  standard: [[-0.8, [0.00, 0.48, 0.16]], [-0.2, [0.83, 0.78, 0.40]], [0, [1.00, 1.00, 1.00]], [0.2, [0.45, 0.74, 0.90]], [0.5, [0.00, 0.25, 0.80]], [0.8, [0.00, 0.05, 0.45]]],
  contrast: [[-0.8, [0.42, 0.20, 0.06]], [-0.2, [0.98, 0.48, 0.00]], [0, [1.00, 0.88, 0.16]], [0.18, [0.30, 0.82, 0.88]], [0.45, [0.00, 0.34, 0.95]], [0.8, [0.00, 0.02, 0.55]]],
  alerts: [[-0.8, [0.70, 0.00, 0.04]], [-0.2, [1.00, 0.22, 0.00]], [0, [1.00, 0.78, 0.00]], [0.2, [0.30, 0.82, 0.88]], [0.5, [0.00, 0.24, 0.90]], [0.8, [0.00, 0.02, 0.50]]]
};

const layerStyles = {
  native: { alpha: 0.74 },
  standard: { alpha: 0.72 },
  contrast: { alpha: 0.88 },
  alerts: { alpha: 0.93 }
};

const satelliteIndexes = {
  NDVI: { expression: "safeIndex(sample.B08, sample.B04)", palettes: vegetationPalettes },
  NDMI: { expression: "safeIndex(sample.B08, sample.B11)", palettes: moisturePalettes },
  NDRE: { expression: "safeIndex(sample.B08, sample.B05)", palettes: vegetationPalettes },
  GNDVI: { expression: "safeIndex(sample.B08, sample.B03)", palettes: vegetationPalettes },
  SAVI: { expression: "1.5 * (sample.B08 - sample.B04) / Math.max(0.0001, sample.B08 + sample.B04 + 0.5)", palettes: vegetationPalettes },
  NDWI: { expression: "safeIndex(sample.B03, sample.B08)", palettes: waterPalettes },
  MSAVI2: { expression: "(2 * sample.B08 + 1 - Math.sqrt(Math.max(0.0001, Math.pow(2 * sample.B08 + 1, 2) - 8 * (sample.B08 - sample.B04)))) / 2", palettes: vegetationPalettes },
  VARI: { expression: "(sample.B03 - sample.B04) / Math.max(0.0001, sample.B03 + sample.B04 - sample.B02)", palettes: vegetationPalettes },
  MTVI2: { expression: "(1.5 * (1.2 * (sample.B08 - sample.B03) - 2.5 * (sample.B04 - sample.B03))) / Math.sqrt(Math.max(0.0001, Math.pow(2 * sample.B08 + 1, 2) - (6 * sample.B08 - 5 * Math.sqrt(Math.max(0, sample.B04))) - 0.5))", palettes: vegetationPalettes },
  TGI: { expression: "(sample.B03 - sample.B04) / Math.max(0.0001, sample.B03 + sample.B04 + sample.B02)", palettes: vegetationPalettes }
};

function env(name) {
  return globalThis.Netlify?.env?.get?.(name) || process.env[name] || "";
}

function corsHeaders(extra = {}) {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Access-Control-Allow-Headers": "content-type",
    ...extra
  };
}

function json(status, payload) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: corsHeaders({ "Content-Type": "application/json; charset=utf-8" })
  });
}

function text(status, message) {
  return new Response(message, {
    status,
    headers: corsHeaders({ "Content-Type": "text/plain; charset=utf-8" })
  });
}

function image(body, cacheStatus = "MISS") {
  return new Response(body, {
    status: 200,
    headers: corsHeaders({
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      "X-AgroCore-Cache": cacheStatus
    })
  });
}

function configured() {
  return Boolean(clientId && clientSecret);
}

function coordinatesFromGeometry(geometry, output = []) {
  if (!geometry) return output;
  if (geometry.type === "GeometryCollection") {
    (geometry.geometries || []).forEach((item) => coordinatesFromGeometry(item, output));
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

function aoiGeometryFromFeatures(features) {
  const geometries = features.map((feature) => feature.geometry).filter(Boolean);
  if (!geometries.length) return null;
  if (geometries.length === 1) return geometries[0];
  const polygonCoordinates = [];
  geometries.forEach((geometry) => {
    if (geometry.type === "Polygon") polygonCoordinates.push(geometry.coordinates);
    if (geometry.type === "MultiPolygon") polygonCoordinates.push(...geometry.coordinates);
  });
  return polygonCoordinates.length ? { type: "MultiPolygon", coordinates: polygonCoordinates } : { type: "GeometryCollection", geometries };
}

function lonLatToMercatorCoordinate(coordinate) {
  const lng = Number(coordinate?.[0]);
  const lat = Math.max(-85.05112878, Math.min(85.05112878, Number(coordinate?.[1])));
  const origin = 20037508.342789244;
  return [
    lng * origin / 180,
    Math.log(Math.tan((90 + lat) * Math.PI / 360)) * origin / Math.PI
  ];
}

function transformCoordinates(value) {
  if (!Array.isArray(value)) return value;
  if (Number.isFinite(Number(value[0])) && Number.isFinite(Number(value[1]))) return lonLatToMercatorCoordinate(value);
  return value.map(transformCoordinates);
}

function geometryToMercator(geometry) {
  if (!geometry) return null;
  if (geometry.type === "GeometryCollection") {
    return { type: "GeometryCollection", geometries: (geometry.geometries || []).map(geometryToMercator).filter(Boolean) };
  }
  return { type: geometry.type, coordinates: transformCoordinates(geometry.coordinates) };
}

async function aoiMeta() {
  if (aoiMetaPromise) return aoiMetaPromise;
  aoiMetaPromise = (async () => {
    try {
      const payload = JSON.parse(await readFile(join(process.cwd(), "data", "canelillo_limites.geojson"), "utf8"));
      const features = payload.type === "FeatureCollection" ? payload.features || [] : payload.type === "Feature" ? [payload] : [{ geometry: payload }];
      const geometry = aoiGeometryFromFeatures(features);
      const points = features.flatMap((feature) => coordinatesFromGeometry(feature.geometry));
      const lngs = points.map(([lng]) => lng).filter(Number.isFinite);
      const lats = points.map(([, lat]) => lat).filter(Number.isFinite);
      if (!lngs.length || !lats.length) return null;
      return {
        bbox: [Math.min(...lngs), Math.min(...lats), Math.max(...lngs), Math.max(...lats)],
        geometryMercator: geometryToMercator(geometry),
        points: points.length
      };
    } catch {
      return null;
    }
  })();
  return aoiMetaPromise;
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

async function outsideAoi(x, y, z) {
  const meta = await aoiMeta();
  return meta?.bbox ? !bboxesIntersect(tileToLonLatBbox(x, y, z), meta.bbox) : false;
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

async function tileBounds(x, y, z) {
  const meta = await aoiMeta();
  const bounds = {
    bbox: tileToMercatorBbox(x, y, z),
    properties: { crs: "http://www.opengis.net/def/crs/EPSG/0/3857" }
  };
  if (meta?.geometryMercator) bounds.geometry = meta.geometryMercator;
  return bounds;
}

function cacheKey(values) {
  return createHash("sha1")
    .update(Object.entries(values).sort(([a], [b]) => a.localeCompare(b)).map(([key, value]) => `${key}=${value}`).join("&"))
    .digest("hex");
}

function getCached(key) {
  const entry = tileCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    tileCache.delete(key);
    return null;
  }
  tileCache.delete(key);
  tileCache.set(key, entry);
  return entry.image;
}

function setCached(key, value) {
  tileCache.set(key, { image: value, expiresAt: Date.now() + cacheTtlMs });
  while (tileCache.size > cacheMax) tileCache.delete(tileCache.keys().next().value);
}

async function accessToken() {
  if (tokenCache.value && Date.now() < tokenCache.expiresAt - 60000) return tokenCache.value;
  const body = new URLSearchParams({ grant_type: "client_credentials", client_id: clientId, client_secret: clientSecret });
  const response = await fetch(tokenUrl, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body });
  if (!response.ok) throw new Error(`Token Sentinel Hub ${response.status}: ${(await response.text()).slice(0, 240)}`);
  const payload = await response.json();
  tokenCache = {
    value: payload.access_token,
    expiresAt: Date.now() + Math.max(60, Number(payload.expires_in) || 3600) * 1000
  };
  return tokenCache.value;
}

function evalscript(indexName, styleName = "contrast") {
  const definition = satelliteIndexes[indexName];
  const style = layerStyles[styleName] || layerStyles.contrast;
  const paletteKey = styleName === "native" ? "standard" : styleName;
  const stops = definition.palettes?.[paletteKey] || definition.palettes?.standard || definition.palettes?.contrast || vegetationPalettes.standard;
  return `//VERSION=3
function setup() {
  return {
    input: ["B02", "B03", "B04", "B05", "B08", "B11", "SCL", "dataMask"],
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
var stops = ${JSON.stringify(stops)};
var alpha = ${Number(style.alpha).toFixed(2)};
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
  return [color[0], color[1], color[2], alpha];
}`;
}

async function statusResponse() {
  const aoi = await aoiMeta();
  const active = configured();
  const message = active ? "Credenciales Sentinel Hub configuradas" : "Faltan credenciales Sentinel Hub en Netlify";
  return json(200, {
    configured: active,
    provider: "Copernicus Data Space - Sentinel Hub Process API",
    build: "sentinel-palettes-v3-netlify",
    supportedIndexes: Object.keys(satelliteIndexes),
    supportedStyles: Object.keys(layerStyles),
    aoi: aoi?.bbox ? { bbox: aoi.bbox, points: aoi.points } : null,
    cache: { memoryMax: cacheMax, ttlMs: cacheTtlMs },
    message
  });
}

async function tileResponse(url) {
  if (!configured()) return text(503, "Faltan credenciales Sentinel Hub en Netlify");
  const z = Number(url.searchParams.get("z"));
  const x = Number(url.searchParams.get("x"));
  const y = Number(url.searchParams.get("y"));
  const indexName = String(url.searchParams.get("index") || "NDVI").toUpperCase();
  const styleName = String(url.searchParams.get("style") || "contrast").toLowerCase();
  const from = String(url.searchParams.get("from") || "").slice(0, 10);
  const to = String(url.searchParams.get("to") || "").slice(0, 10);
  const maxCloud = Math.min(100, Math.max(0, Number(url.searchParams.get("maxCloud")) || 35));
  if (!Number.isInteger(z) || !Number.isInteger(x) || !Number.isInteger(y) || z < 0 || z > 22) return text(400, "Tile invalido");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(from) || !/^\d{4}-\d{2}-\d{2}$/.test(to)) return text(400, "Rango de fecha invalido");
  if (!satelliteIndexes[indexName]) return text(400, `Indice Sentinel no soportado: ${indexName}`);
  if (await outsideAoi(x, y, z)) return image(transparentPng, "AOI-SKIP");
  const outputSize = 256;
  const key = cacheKey({ z, x, y, indexName, styleName, outputSize, from, to, maxCloud });
  const cached = getCached(key);
  if (cached) return image(cached, "HIT");

  const payload = {
    input: {
      bounds: await tileBounds(x, y, z),
      data: [{
        type: "sentinel-2-l2a",
        dataFilter: {
          timeRange: { from: `${from}T00:00:00Z`, to: `${to}T23:59:59Z` },
          maxCloudCoverage: maxCloud,
          mosaickingOrder: "mostRecent"
        }
      }]
    },
    output: { width: outputSize, height: outputSize, responses: [{ identifier: "default", format: { type: "image/png" } }] },
    evalscript: evalscript(indexName, styleName)
  };
  const response = await fetch(processUrl, {
    method: "POST",
    headers: { Authorization: `Bearer ${await accessToken()}`, "Content-Type": "application/json", Accept: "image/png" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(24000)
  });
  if (!response.ok) return text(response.status, `Sentinel Hub ${response.status}: ${(await response.text()).slice(0, 400)}`);
  const png = Buffer.from(await response.arrayBuffer());
  setCached(key, png);
  return image(png);
}

export default async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders() });
  const url = new URL(req.url);
  if (url.pathname.endsWith("/status")) return statusResponse();
  if (url.pathname.endsWith("/tile")) return tileResponse(url);
  return text(404, "Endpoint satelital no encontrado");
};

export const config = {
  path: ["/api/sentinel-hub/status", "/api/sentinel-hub/tile"],
  method: ["GET", "OPTIONS"]
};
