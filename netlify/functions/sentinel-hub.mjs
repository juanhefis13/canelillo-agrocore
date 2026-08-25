import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import indexColorScaleConfig from "../../index-color-scales.js";

const tokenUrl = env("SENTINEL_HUB_TOKEN_URL") || "https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token";
const processUrl = env("SENTINEL_HUB_PROCESS_URL") || "https://sh.dataspace.copernicus.eu/api/v1/process";
const catalogUrl = env("SENTINEL_HUB_CATALOG_URL") || "https://sh.dataspace.copernicus.eu/catalog/v1/search";
const statisticsUrl = env("SENTINEL_HUB_STATISTICS_URL") || "https://sh.dataspace.copernicus.eu/statistics/v1";
const clientId = env("SENTINEL_HUB_CLIENT_ID");
const clientSecret = env("SENTINEL_HUB_CLIENT_SECRET");
const cacheTtlMs = Number(env("SATELLITE_TILE_CACHE_TTL_MS") || 1000 * 60 * 60 * 6);
const cacheMax = Number(env("SATELLITE_TILE_CACHE_MAX") || 450);
const preferredCloudMax = normalizedCloud(env("SATELLITE_PREFERRED_CLOUD_MAX"), 35);
const transparentPng = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADElEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==", "base64");
const tileCache = new Map();
const availabilityCache = new Map();
const statisticsCache = new Map();
let tokenCache = { value: "", expiresAt: 0 };
let aoiMetaPromise = null;

const { INDEX_COLOR_SCALES, getIndexThresholds } = indexColorScaleConfig;

const layerStyles = {
  native: { alpha: 0.74 },
  standard: { alpha: 0.72 },
  contrast: { alpha: 0.88 },
  alerts: { alpha: 0.93 }
};

const satelliteIndexes = {
  NDVI: { expression: "safeIndex(sample.B08, sample.B04)" },
  NDMI: { expression: "safeIndex(sample.B08, sample.B11)" },
  NDRE: { expression: "safeIndex(sample.B08, sample.B05)" },
  GNDVI: { expression: "safeIndex(sample.B08, sample.B03)" },
  SAVI: { expression: "1.5 * (sample.B08 - sample.B04) / Math.max(0.0001, sample.B08 + sample.B04 + 0.5)" },
  NDWI: { expression: "safeIndex(sample.B03, sample.B08)" },
  MSAVI2: { expression: "(2 * sample.B08 + 1 - Math.sqrt(Math.max(0.0001, Math.pow(2 * sample.B08 + 1, 2) - 8 * (sample.B08 - sample.B04)))) / 2" },
  VARI: { expression: "(sample.B03 - sample.B04) / Math.max(0.0001, sample.B03 + sample.B04 - sample.B02)" },
  MTVI2: { expression: "(1.5 * (1.2 * (sample.B08 - sample.B03) - 2.5 * (sample.B04 - sample.B03))) / Math.sqrt(Math.max(0.0001, Math.pow(2 * sample.B08 + 1, 2) - (6 * sample.B08 - 5 * Math.sqrt(Math.max(0, sample.B04))) - 0.5))" },
  TGI: { expression: "(sample.B03 - sample.B04) / Math.max(0.0001, sample.B03 + sample.B04 + sample.B02)" }
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
        geometry,
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

function shiftedDate(value, days) {
  const date = new Date(`${value}T12:00:00Z`);
  if (Number.isNaN(date.getTime())) return "";
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function normalizedCloud(value, fallback = 35) {
  if (value == null || String(value).trim() === "") return Math.min(100, Math.max(0, Number(fallback) || 35));
  const parsed = Number(value);
  return Math.min(100, Math.max(0, Number.isFinite(parsed) ? parsed : fallback));
}

async function catalogScenes(from, to, maxCloud) {
  const meta = await aoiMeta();
  if (!meta?.bbox) return [];
  const response = await fetch(catalogUrl, {
    method: "POST",
    headers: { Authorization: `Bearer ${await accessToken()}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      collections: ["sentinel-2-l2a"],
      bbox: meta.bbox,
      datetime: `${from}T00:00:00Z/${to}T23:59:59Z`,
      limit: 100,
      filter: `eo:cloud_cover <= ${maxCloud}`,
      "filter-lang": "cql2-text",
      fields: { include: ["properties.datetime", "properties.eo:cloud_cover"], exclude: ["assets", "links"] }
    }),
    signal: AbortSignal.timeout(16000)
  });
  if (!response.ok) throw new Error(`Catalogo Sentinel ${response.status}: ${(await response.text()).slice(0, 260)}`);
  const payload = await response.json();
  return (Array.isArray(payload.features) ? payload.features : []).map((feature) => ({
    id: String(feature.id || ""),
    datetime: String(feature.properties?.datetime || ""),
    date: String(feature.properties?.datetime || "").slice(0, 10),
    cloud: normalizedCloud(feature.properties?.["eo:cloud_cover"], 100)
  })).filter((scene) => /^\d{4}-\d{2}-\d{2}$/.test(scene.date));
}

function selectAutomaticCatalogScene(scenes, allowCloudyFallback = true) {
  const newestFirst = [...scenes].sort((a, b) => b.datetime.localeCompare(a.datetime));
  return newestFirst.find((scene) => scene.cloud <= preferredCloudMax)
    || (allowCloudyFallback ? newestFirst[0] : null)
    || null;
}

async function availabilityResponse(url) {
  if (!configured()) return json(503, { available: false, message: "Faltan credenciales Sentinel Hub en Netlify" });
  const from = String(url.searchParams.get("from") || "").slice(0, 10);
  const to = String(url.searchParams.get("to") || "").slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(from) || !/^\d{4}-\d{2}-\d{2}$/.test(to) || from > to) {
    return json(400, { available: false, message: "Rango de fecha invalido" });
  }
  const key = cacheKey({ type: "availability", from, to, strategy: "automatic-latest", preferredCloudMax });
  const cached = availabilityCache.get(key);
  if (cached && cached.expiresAt > Date.now()) return json(200, cached.payload);
  let scenes = await catalogScenes(from, to, 100);
  let fallback = false;
  let searchFrom = from;
  let selected = selectAutomaticCatalogScene(scenes, false);
  if (!selected) {
    fallback = true;
    searchFrom = shiftedDate(to, -120);
    scenes = await catalogScenes(searchFrom, to, 100);
    selected = selectAutomaticCatalogScene(scenes);
  }
  const cloudLimit = selected
    ? Math.min(100, Math.max(preferredCloudMax, Math.ceil(selected.cloud)))
    : preferredCloudMax;
  const payload = selected ? {
    available: true,
    fallback,
    requested: { from, to },
    searched: { from: searchFrom, to },
    effective: { from: selected.date, to: selected.date, date: selected.date, cloud: selected.cloud, cloudLimit, id: selected.id },
    sceneCount: scenes.length,
    message: fallback
      ? `Sin imagen utilizable en el rango solicitado. Se usara la ultima escena disponible del ${selected.date}.`
      : `Escena Sentinel disponible del ${selected.date}.`
  } : {
    available: false,
    fallback,
    requested: { from, to },
    searched: { from: searchFrom, to },
    sceneCount: 0,
    message: "No hay escenas Sentinel disponibles en los ultimos 120 dias."
  };
  availabilityCache.set(key, { payload, expiresAt: Date.now() + 10 * 60 * 1000 });
  return json(200, payload);
}

function statisticsEvalscript(indexName) {
  const definition = satelliteIndexes[indexName];
  return `//VERSION=3
function setup() {
  return {
    input: ["B02", "B03", "B04", "B05", "B08", "B11", "SCL", "dataMask"],
    output: [
      { id: "index", bands: 1, sampleType: "FLOAT32" },
      { id: "dataMask", bands: 1 }
    ]
  };
}
function safeIndex(a, b) {
  var denominator = a + b;
  return Math.abs(denominator) < 0.0001 ? -1 : (a - b) / denominator;
}
function maskedScl(value) {
  return value === 0 || value === 1 || value === 3 || value === 7 || value === 8 || value === 9 || value === 10 || value === 11;
}
function evaluatePixel(sample) {
  var valid = sample.dataMask !== 0 && !maskedScl(sample.SCL);
  return { index: [${definition.expression}], dataMask: [valid ? 1 : 0] };
}`;
}

async function statisticsResponse(url) {
  if (!configured()) return json(503, { message: "Faltan credenciales Sentinel Hub en Netlify" });
  const indexName = String(url.searchParams.get("index") || "TGI").toUpperCase();
  const from = String(url.searchParams.get("from") || "").slice(0, 10);
  const to = String(url.searchParams.get("to") || "").slice(0, 10);
  const maxCloud = normalizedCloud(url.searchParams.get("maxCloud"));
  const requestedMosaicking = String(url.searchParams.get("mosaicking") || "leastCC");
  const mosaickingOrder = ["leastCC", "mostRecent", "leastRecent"].includes(requestedMosaicking) ? requestedMosaicking : "leastCC";
  if (!INDEX_COLOR_SCALES[indexName]?.relative) return json(200, { index: indexName, relative: false, thresholds: getIndexThresholds(indexName) });
  const key = cacheKey({ type: "statistics", indexName, from, to, maxCloud, mosaickingOrder });
  const cached = statisticsCache.get(key);
  if (cached && cached.expiresAt > Date.now()) return json(200, cached.payload);
  const meta = await aoiMeta();
  if (!meta?.bbox) return json(500, { index: indexName, relative: true, thresholds: [], message: "No se pudo cargar el limite del campo" });
  const [minX, minY] = lonLatToMercatorCoordinate([meta.bbox[0], meta.bbox[1]]);
  const [maxX, maxY] = lonLatToMercatorCoordinate([meta.bbox[2], meta.bbox[3]]);
  const payload = {
    input: {
      bounds: {
        bbox: [minX, minY, maxX, maxY],
        geometry: meta.geometryMercator,
        properties: { crs: "http://www.opengis.net/def/crs/EPSG/0/3857" }
      },
      data: [{ type: "sentinel-2-l2a", dataFilter: { maxCloudCoverage: maxCloud, mosaickingOrder } }]
    },
    aggregation: {
      timeRange: { from: `${from}T00:00:00Z`, to: `${shiftedDate(to, 1)}T00:00:00Z` },
      aggregationInterval: { of: "P1D" },
      evalscript: statisticsEvalscript(indexName),
      resx: 20,
      resy: 20
    },
    calculations: { default: { statistics: { default: { percentiles: { k: [20, 40, 60, 80] } } } } }
  };
  const response = await fetch(statisticsUrl, {
    method: "POST",
    headers: { Authorization: `Bearer ${await accessToken()}`, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(24000)
  });
  if (!response.ok) return json(response.status, { index: indexName, relative: true, thresholds: [], message: `Estadisticas Sentinel ${response.status}: ${(await response.text()).slice(0, 320)}` });
  const result = await response.json();
  const stats = (result.data || []).map((item) => item?.outputs?.index?.bands?.B0?.stats).find((item) => item?.percentiles);
  const percentiles = stats?.percentiles || {};
  const thresholds = [20, 40, 60, 80].map((keyValue) => Number(percentiles[`${keyValue}.0`] ?? percentiles[String(keyValue)]));
  if (thresholds.some((value) => !Number.isFinite(value))) return json(502, { index: indexName, relative: true, thresholds: [], message: "Sentinel no devolvio percentiles validos para TGI" });
  const resultPayload = { index: indexName, relative: true, thresholds, percentiles: [20, 40, 60, 80], sampleCount: Number(stats.sampleCount) || 0, noDataCount: Number(stats.noDataCount) || 0 };
  statisticsCache.set(key, { payload: resultPayload, expiresAt: Date.now() + 1000 * 60 * 60 * 6 });
  return json(200, resultPayload);
}

function hexToRgbUnit(hex) {
  const normalized = String(hex || "").replace("#", "");
  return [0, 2, 4].map((offset) => Number.parseInt(normalized.slice(offset, offset + 2), 16) / 255);
}

function evalscript(indexName, styleName = "contrast", relativeThresholds = []) {
  const definition = satelliteIndexes[indexName];
  const style = layerStyles[styleName] || layerStyles.contrast;
  const scale = INDEX_COLOR_SCALES[indexName];
  const thresholds = getIndexThresholds(indexName, relativeThresholds);
  if (thresholds.length !== 4) throw new Error(`Faltan umbrales de clasificacion para ${indexName}`);
  const colors = scale.levels.map((level) => hexToRgbUnit(level.color));
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
  return value === 0 || value === 1 || value === 3 || value === 7 || value === 8 || value === 9 || value === 10 || value === 11;
}
var thresholds = ${JSON.stringify(thresholds)};
var colors = ${JSON.stringify(colors)};
var alpha = ${Number(style.alpha).toFixed(2)};
function classifiedColor(value) {
  for (var i = 0; i < thresholds.length; i++) {
    if (value <= thresholds[i]) return colors[i];
  }
  return colors[colors.length - 1];
}
function evaluatePixel(sample) {
  if (sample.dataMask === 0 || maskedScl(sample.SCL)) return [0, 0, 0, 0];
  var value = ${definition.expression};
  var color = classifiedColor(value);
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
    build: "sentinel-index-scales-v7-auto-latest-netlify",
    supportedIndexes: Object.keys(satelliteIndexes),
    supportedStyles: Object.keys(layerStyles),
    supportedMosaicking: ["leastCC", "mostRecent", "leastRecent"],
    availability: true,
    statistics: true,
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
  const maxCloud = normalizedCloud(url.searchParams.get("maxCloud"));
  const requestedMosaicking = String(url.searchParams.get("mosaicking") || "leastCC");
  const mosaickingOrder = ["leastCC", "mostRecent", "leastRecent"].includes(requestedMosaicking) ? requestedMosaicking : "leastCC";
  const relativeThresholds = String(url.searchParams.get("breaks") || "").split(",").map(Number).filter(Number.isFinite);
  const clientVersion = String(url.searchParams.get("v") || "").slice(0, 200);
  if (!Number.isInteger(z) || !Number.isInteger(x) || !Number.isInteger(y) || z < 0 || z > 22) return text(400, "Tile invalido");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(from) || !/^\d{4}-\d{2}-\d{2}$/.test(to)) return text(400, "Rango de fecha invalido");
  if (!satelliteIndexes[indexName]) return text(400, `Indice Sentinel no soportado: ${indexName}`);
  if (INDEX_COLOR_SCALES[indexName]?.relative && relativeThresholds.length !== 4) return text(400, `Faltan percentiles relativos para ${indexName}`);
  if (await outsideAoi(x, y, z)) return image(transparentPng, "AOI-SKIP");
  const outputSize = 256;
  const key = cacheKey({ z, x, y, indexName, styleName, outputSize, from, to, maxCloud, mosaickingOrder, relativeThresholds: relativeThresholds.join(","), clientVersion });
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
          mosaickingOrder
        }
      }]
    },
    output: { width: outputSize, height: outputSize, responses: [{ identifier: "default", format: { type: "image/png" } }] },
    evalscript: evalscript(indexName, styleName, relativeThresholds)
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
  if (url.pathname.endsWith("/availability")) return availabilityResponse(url);
  if (url.pathname.endsWith("/statistics")) return statisticsResponse(url);
  if (url.pathname.endsWith("/tile")) return tileResponse(url);
  return text(404, "Endpoint satelital no encontrado");
};

export const config = {
  path: ["/api/sentinel-hub/status", "/api/sentinel-hub/availability", "/api/sentinel-hub/statistics", "/api/sentinel-hub/tile"],
  method: ["GET", "OPTIONS"]
};
