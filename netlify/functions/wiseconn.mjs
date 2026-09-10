const wiseconnApiBase = "https://api.wiseconn.com";
const defaultFarmId = 4212;
const responseCache = new Map();
const cacheTtlMs = 5 * 60 * 1000;

function env(name) {
  return globalThis.Netlify?.env?.get?.(name) || process.env[name] || "";
}

function corsHeaders(extra = {}) {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Access-Control-Allow-Headers": "authorization,content-type",
    ...extra
  };
}

function json(status, payload) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: corsHeaders({
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "private, no-store"
    })
  });
}

function dateOnly(value) {
  const match = String(value || "").match(/^\d{4}-\d{2}-\d{2}$/);
  return match ? match[0] : "";
}

function dateParts(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function addUtcDays(value, days) {
  const date = dateParts(value);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function rangeDays(from, to) {
  return Math.round((dateParts(to) - dateParts(from)) / 86400000) + 1;
}

function rangeSegments(from, to) {
  const segments = [];
  let cursor = from;
  while (cursor <= to) {
    const end = addUtcDays(cursor, 28) < to ? addUtcDays(cursor, 28) : to;
    segments.push({ from: cursor, to: end });
    cursor = addUtcDays(end, 1);
  }
  return segments;
}

async function verifySupabaseUser(req) {
  const authorization = req.headers.get("authorization") || "";
  if (!authorization.toLowerCase().startsWith("bearer ")) {
    throw Object.assign(new Error("Sesion de AgroCore requerida"), { status: 401 });
  }
  const supabaseUrl = env("SUPABASE_URL") || "https://lhmifnsdydullldhmcsd.supabase.co";
  const supabaseAnonKey = env("SUPABASE_ANON_KEY") || env("AGROCORE_SUPABASE_ANON_KEY");
  if (!supabaseAnonKey) {
    throw Object.assign(new Error("Falta SUPABASE_ANON_KEY en Netlify"), { status: 503 });
  }
  const response = await fetch(`${supabaseUrl.replace(/\/+$/, "")}/auth/v1/user`, {
    headers: { apikey: supabaseAnonKey, Authorization: authorization },
    signal: AbortSignal.timeout(10000)
  });
  if (!response.ok) {
    throw Object.assign(new Error("Sesion de AgroCore invalida o vencida"), { status: 401 });
  }
  return response.json();
}

function configuredFarmId() {
  const value = Number(env("WISECONN_FARM_ID") || defaultFarmId);
  return Number.isInteger(value) && value > 0 ? value : defaultFarmId;
}

function wiseconnHeaders() {
  const apiKey = env("WISECONN_API_KEY");
  if (!apiKey) throw Object.assign(new Error("Falta WISECONN_API_KEY en Netlify"), { status: 503 });
  return { api_key: apiKey, Accept: "application/json" };
}

async function wiseconnGet(path, params = {}) {
  const url = new URL(`${wiseconnApiBase}${path}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, String(value));
  });
  const response = await fetch(url, {
    headers: wiseconnHeaders(),
    signal: AbortSignal.timeout(25000)
  });
  if (!response.ok) {
    const detail = (await response.text()).slice(0, 300);
    throw Object.assign(new Error(`WiseConn ${response.status}: ${detail || response.statusText}`), { status: response.status });
  }
  return response.json();
}

function minimalEvent(event = {}) {
  const numeric = (value) => Number.isFinite(Number(value)) ? Number(value) : null;
  return {
    id: Number(event.id),
    zoneId: Number(event.zoneId),
    pumpSystemId: numeric(event.pumpSystemId),
    initTime: event.initTime || "",
    endTime: event.endTime || "",
    status: event.status || "",
    type: event.type?.description || event.type || "",
    volumeM3: numeric(event.volume?.value),
    precipitationMm: numeric(event.precipitation?.value),
    flowM3H: numeric(event.flow?.value)
  };
}

function minimalZone(zone = {}) {
  return {
    id: Number(zone.id),
    name: zone.name || "",
    pumpSystemId: Number(zone.pumpSystemId) || null,
    theoreticalFlow: Number(zone.theoreticalFlow) || null,
    area: Number(zone.area) || null,
    areaUnit: zone.areaUnit || "",
    onlyMonitoring: Boolean(zone.onlyMonitoring)
  };
}

async function cached(key, loader) {
  const previous = responseCache.get(key);
  if (previous && previous.expiresAt > Date.now()) return { value: previous.value, cache: "HIT" };
  const value = await loader();
  responseCache.set(key, { value, expiresAt: Date.now() + cacheTtlMs });
  return { value, cache: "MISS" };
}

async function realIrrigations(farmId, from, to) {
  const all = [];
  for (const segment of rangeSegments(from, to)) {
    const rows = await wiseconnGet(`/farms/${farmId}/realIrrigations`, {
      initTime: `${segment.from}T00:00:00`,
      endTime: `${segment.to}T23:59:59`
    });
    all.push(...(Array.isArray(rows) ? rows : []));
    if (segment.to !== to) await new Promise((resolve) => setTimeout(resolve, 375));
  }
  return [...new Map(all.map((event) => [Number(event.id), minimalEvent(event)])).values()]
    .filter((event) => Number.isFinite(event.id) && Number.isFinite(event.zoneId));
}

export default async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders() });
  try {
    await verifySupabaseUser(req);
    const url = new URL(req.url);
    const farmId = configuredFarmId();
    if (url.pathname.endsWith("/status")) {
      return json(200, {
        configured: Boolean(env("WISECONN_API_KEY")),
        farmId,
        provider: "WiseConn API",
        calculation: "horas = volumen_m3 / caudal_agrocore_m3_h"
      });
    }
    if (url.pathname.endsWith("/zones")) {
      const result = await cached(`zones:${farmId}`, async () => {
        const rows = await wiseconnGet(`/farms/${farmId}/zones`);
        return (Array.isArray(rows) ? rows : []).map(minimalZone);
      });
      return json(200, { farmId, cache: result.cache, zones: result.value });
    }
    if (!url.pathname.endsWith("/real-irrigations")) return json(404, { message: "Endpoint WiseConn no encontrado" });
    const from = dateOnly(url.searchParams.get("from"));
    const to = dateOnly(url.searchParams.get("to"));
    if (!from || !to || from > to) return json(400, { message: "Rango de fechas invalido" });
    if (rangeDays(from, to) > 62) return json(400, { message: "El rango maximo permitido es de 62 dias" });
    const result = await cached(`events:${farmId}:${from}:${to}`, () => realIrrigations(farmId, from, to));
    return json(200, {
      farmId,
      from,
      to,
      cache: result.cache,
      syncedAt: new Date().toISOString(),
      events: result.value
    });
  } catch (error) {
    return json(Number(error?.status) || 502, { message: error?.message || "No se pudo consultar WiseConn" });
  }
};

export const config = {
  path: ["/api/wiseconn/status", "/api/wiseconn/zones", "/api/wiseconn/real-irrigations"],
  method: ["GET", "OPTIONS"]
};
