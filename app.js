const STORAGE_KEY = "agroaplicaciones.state.v1";
const CLOUD_ONLY_MODE = true;
const SESSION_KEY = "agroaplicaciones.supabase.session.v1";
const IRRIGATION_DRAFT_KEY = "canelillo.irrigation.hours.v1";
const IRRIGATION_PROGRAM_KEY = "canelillo.irrigation.program.hours.v1";
const IRRIGATION_AUDIT_KEY = "canelillo.irrigation.audit.v1";
const IRRIGATION_PROGRAM_AUDIT_KEY = "canelillo.irrigation.program.audit.v1";
const IRRIGATION_OBSERVATIONS_KEY = "canelillo.irrigation.observations.v1";
const IRRIGATION_PROGRAM_OBSERVATIONS_KEY = "canelillo.irrigation.program.observations.v1";
const IRRIGATION_OPTIONAL_COLUMNS = [
  "creado_por",
  "creado_por_nombre",
  "modificado_por",
  "modificado_por_nombre",
  "modificado_en",
  "potrero",
  "bloque",
  "especie",
  "variedad",
  "hectareas",
  "precipitacion",
  "caudal"
];
const SUPABASE_URL = "https://lhmifnsdydullldhmcsd.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxobWlmbnNkeWR1bGxsZGhtY3NkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMzg4NTUsImV4cCI6MjA5MjgxNDg1NX0.TaFzWd_OQTdQMMnf3cMd3WejqGpHmWkJLwGRFS8ITtM";
const REGISTRATION_CODE = "Canelillo2026#";
const GOOGLE_MAPS_API_KEY = "AIzaSyBFUloIJfR87F6vLQh4P7HH91LTOTYmCiM";

function escapeHtml(value = "") {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const seedState = {
  settings: {
    farmName: "Agricola El Canelillo",
    season: "2024/2025",
    currentSeasonId: "season-2024-2025",
    defaultTankLiters: 2000,
    lowStockDays: 21
  },
  seasons: [
    { id: "season-2024-2025", name: "2024/2025", startYear: 2024, endYear: 2025, status: "activa" }
  ],
  programs: [
    { id: "program-1", seasonId: "season-2024-2025", number: 1, name: "Calibre / estres", crop: "NARANJA", objective: "Caida de fruta y manejo de estres" },
    { id: "program-2", seasonId: "season-2024-2025", number: 2, name: "Control plagas", crop: "MANDARINA", objective: "Araña roja y chanchito blanco" }
  ],
  products: [
    { id: "p-ultrasol", name: "ULTRASOL K ACID", ingredient: "NPK acidificante", unit: "kg", dose100: 300, reentryHours: 24, carencyDays: 0, stock: 420, minStock: 80, cost: 1380, lot: "UKA-25-01", expires: "2027-03-31" },
    { id: "p-biorend", name: "BIOREND", ingredient: "Quitosano", unit: "L", dose100: 100, reentryHours: 24, carencyDays: 0, stock: 180, minStock: 35, cost: 9500, lot: "BIO-25-04", expires: "2026-11-30" },
    { id: "p-konan", name: "Konan 240SC", ingredient: "Spirodiclofen", unit: "L", dose100: 40, reentryHours: 24, carencyDays: 7, stock: 42, minStock: 12, cost: 38800, lot: "KON-24-09", expires: "2026-08-15" },
    { id: "p-hurricame", name: "Hurricame 70WP", ingredient: "Acetamiprid 70%", unit: "kg", dose100: 15, reentryHours: 24, carencyDays: 25, stock: 22, minStock: 8, cost: 64500, lot: "HUR-25-02", expires: "2027-01-20" },
    { id: "p-fosfimax", name: "FOSFIMAX 40-20", ingredient: "Fosfito potasico", unit: "L", dose100: 250, reentryHours: 24, carencyDays: 0, stock: 260, minStock: 55, cost: 4200, lot: "FOS-25-03", expires: "2027-06-30" },
    { id: "p-silwet", name: "SILWET TX100", ingredient: "Coadyuvante organosiliconado", unit: "L", dose100: 20, reentryHours: 24, carencyDays: 0, stock: 65, minStock: 20, cost: 17500, lot: "SIL-24-12", expires: "2026-05-30" }
  ],
  blocks: [
    { id: "b-p1-1", potrero: "P1", block: "1", crop: "MANDARINA", variety: "MURCOTT", hectares: 3 },
    { id: "b-p1-2", potrero: "P1", block: "2", crop: "MANDARINA", variety: "MURCOTT", hectares: 3 },
    { id: "b-p1-3", potrero: "P1", block: "3", crop: "MANDARINA", variety: "MURCOTT", hectares: 3.63 },
    { id: "b-p1-4", potrero: "P1", block: "4", crop: "MANDARINA", variety: "MURCOTT", hectares: 3.6 },
    { id: "b-p28-1", potrero: "P28", block: "1", crop: "NARANJA", variety: "FUKUMOTO", hectares: 5.04 },
    { id: "b-p28-2", potrero: "P28", block: "2", crop: "NARANJA", variety: "FUKUMOTO", hectares: 5.05 },
    { id: "b-av-1", potrero: "PALTO 1", block: "A", crop: "PALTO", variety: "HASS", hectares: 4.8 }
  ],
  operators: [
    { id: "op-1", name: "Juan Contreras", phone: "", active: true },
    { id: "op-2", name: "Luis Ramirez", phone: "", active: true },
    { id: "op-3", name: "Marcelo Diaz", phone: "", active: true }
  ],
  equipment: [
    { id: "eq-1", type: "Nebulizadora", code: "N-01", tankLiters: 2000 },
    { id: "eq-2", type: "Nebulizadora", code: "N-02", tankLiters: 1500 },
    { id: "tr-1", type: "Tractor", code: "T-03", tankLiters: 0 }
  ],
  vehicles: [
    { id: "veh-254", classification: "Aplicación", type: "Tractor", brand: "John Deere", model: "M5BL4", serialNumber: "068221 CD", year: 1972, code: "254" },
    { id: "veh-201", classification: "Aplicación", type: "Tractor", brand: "Landini", model: "Advantage DT 65 F", serialNumber: "7096E15028", year: 2000, code: "201" }
  ],
  weather: [
    { date: "2025-04-08", max: 26.2, min: 11.4, wind: 3, humidity: 64 },
    { date: "2025-03-12", max: 28.1, min: 13.7, wind: 4, humidity: 58 },
    { date: "2024-02-14", max: 29.4, min: 15.1, wind: 2, humidity: 52 }
  ],
  orders: [
    {
      id: "o-638",
      number: 638,
      seasonId: "season-2024-2025",
      programNumber: 1,
      program: "Programa calibre/estres",
      classification: "N",
      date: "2025-04-08",
      plannedDate: "2025-04-08",
      objective: "Caida fruta, Stress",
      crop: "NARANJA",
      variety: "FUKUMOTO",
      potrero: "P28",
      blocks: ["1", "2"],
      hectares: 10.09,
      waterHa: 1200,
      speed: 4.5,
      nozzle: "ATR 80",
      pressure: 18,
      tractorCode: "T-03",
      machineCode: "N-01",
      dosifier: "Si",
      operatorId: "op-1",
      sprayerId: "eq-1",
      tractorId: "tr-1",
      status: "closed",
      notes: "Orden migrada desde planilla.",
      recipe: [
        { productId: "p-biorend", dose100: 100 },
        { productId: "p-fosfimax", dose100: 250 },
        { productId: "p-silwet", dose100: 20 }
      ],
      dispatches: [
        { id: "s-638-1", type: "salida", date: "2025-04-08", liters: 5600, note: "Salida bodega orden 638", products: { "p-biorend": 5.6, "p-fosfimax": 14, "p-silwet": 1.12 } }
      ],
      tanks: [
        { id: "t-1", liters: 2000, appliedAt: "2025-04-08T09:15", products: { "p-biorend": 2, "p-fosfimax": 5, "p-silwet": 0.4 } },
        { id: "t-2", liters: 2000, appliedAt: "2025-04-08T10:40", products: { "p-biorend": 2, "p-fosfimax": 5, "p-silwet": 0.4 } },
        { id: "t-3", liters: 1600, appliedAt: "2025-04-08T12:10", products: { "p-biorend": 1.6, "p-fosfimax": 4, "p-silwet": 0.32 } }
      ],
      movements: []
    },
    {
      id: "o-639",
      number: 639,
      seasonId: "season-2024-2025",
      programNumber: 2,
      program: "Programa control plagas",
      classification: "N",
      date: "2025-04-08",
      plannedDate: "2025-04-15",
      objective: "Control Araña Roja y chanchito blanco",
      crop: "MANDARINA",
      variety: "MURCOTT",
      potrero: "P1",
      blocks: ["1", "2", "3", "4"],
      hectares: 13.23,
      waterHa: 1500,
      speed: 4,
      nozzle: "ATR 80",
      pressure: 20,
      tractorCode: "T-03",
      machineCode: "N-01",
      dosifier: "Si",
      operatorId: "op-2",
      sprayerId: "eq-1",
      tractorId: "tr-1",
      status: "in_progress",
      notes: "",
      recipe: [
        { productId: "p-konan", dose100: 40 },
        { productId: "p-hurricame", dose100: 15 },
        { productId: "p-silwet", dose100: 20 }
      ],
      dispatches: [
        { id: "s-639-1", type: "salida", date: "2025-04-08", liters: 2000, note: "Primera salida", products: { "p-konan": 0.8, "p-hurricame": 0.3, "p-silwet": 0.4 } }
      ],
      tanks: [
        { id: "t-4", liters: 2000, appliedAt: "2025-04-08T15:20", products: { "p-konan": 0.8, "p-hurricame": 0.3, "p-silwet": 0.4 } }
      ],
      movements: []
    }
  ],
  inventoryMovements: [
    { id: "m-1", date: "2025-04-08", type: "salida", productId: "p-biorend", quantity: 5.6, orderId: "o-638", note: "Cierre orden 638" },
    { id: "m-2", date: "2025-04-08", type: "salida", productId: "p-fosfimax", quantity: 14, orderId: "o-638", note: "Cierre orden 638" },
    { id: "m-3", date: "2025-04-08", type: "salida", productId: "p-silwet", quantity: 1.12, orderId: "o-638", note: "Cierre orden 638" }
  ]
};

let state = normalizeState(loadState());
let currentView = "dashboard";
let programFilters = { seasonId: "Todas", program: "", species: "Todas", number: "Todos" };
let reportFilters = { seasonId: "Todas", species: "Todas", programNumber: "Todos" };
let managerYear = String(new Date().getFullYear());
let managerMonth = String(new Date().getMonth() + 1).padStart(2, "0");
let managerOrdersMonth = "all";
let managerGanttMode = "month";
let managerGanttMobileOpen = false;
let irrigationYear = String(new Date().getFullYear());
let irrigationMonth = String(new Date().getMonth() + 1).padStart(2, "0");
let irrigationSpeciesFilter = "Todas";
let irrigationPotreroFilter = "Todos";
let irrigationTab = "gantt";
let irrigationFiltersOpen = false;
let irrigationStationFilter = "Todas";
let irrigationBandejaScrollLeft = 0;
let irrigationBandejaScrollTop = 0;
let irrigationBandejaFocusPending = true;
let irrigationBalancePotreroFilter = "Todos";
let irrigationBalanceSelectedPotreros = new Set();
let calicataYear = String(new Date().getFullYear());
let calicataMonth = String(new Date().getMonth() + 1).padStart(2, "0");
let calicataSpeciesFilter = "Todas";
let calicataPotreroFilter = "Todos";
let irrigationHours = loadIrrigationHours();
let irrigationProgramHours = loadIrrigationProgramHours();
let irrigationAudit = loadJsonMap(IRRIGATION_AUDIT_KEY);
let irrigationProgramAudit = loadJsonMap(IRRIGATION_PROGRAM_AUDIT_KEY);
let irrigationObservations = loadJsonMap(IRRIGATION_OBSERVATIONS_KEY);
let irrigationProgramObservations = loadJsonMap(IRRIGATION_PROGRAM_OBSERVATIONS_KEY);
let expandedCalicataKeys = new Set();
let irrigationSaveTimers = new Map();
let irrigationCloudAvailable = true;
let irrigationProgramSaveTimers = new Map();
let irrigationProgramCloudAvailable = true;
let irrigationObservationsCloudAvailable = true;
let irrigationObservationContext = null;
let irrigationObservationTouch = null;
let selectedGanttOrderId = "";
let managerStatusFilter = "all";
let managerPotreroFilter = "Todos";
let managerSpeciesFilters = new Set(["Todas"]);
let warehouseStatusFilter = "in_progress";
let warehouseDateFromFilter = "";
let warehouseDateToFilter = "";
let cloudSyncTimer = null; // respaldo antiguo: ya no se usa setInterval para evitar parpadeos
let cloudSyncInProgress = false;
let cloudRealtimeClient = null;
let cloudRealtimeChannels = [];
let cloudRealtimeReloadTimer = null;
let geoJsonCache = null;
let googleMapsLoading = null;
let dashboardMap = null;
let dashboardMapElement = null;
let dashboardMapOverlays = [];
let harvestMap = null;
let harvestMapElement = null;
let harvestMapBaseOverlays = [];
let harvestMapMarkerCache = new Map();
let harvestMapBaseReady = false;
let harvestMapBaseBounds = null;
let harvestMapRenderVersion = 0;
let harvestMapVisibleRecords = [];
let harvestMapIdleListener = null;
let harvestMapMarkerRenderFrame = 0;
let harvestInfoWindow = null;
let irrigationCalicataBlockFilter = "Todos";
let irrigationCalicataMap = null;
let irrigationCalicataMapElement = null;
let irrigationCalicataOverlays = [];
let irrigationCalicataInfoWindow = null;
let irrigationCalicataMarkers = new Map();
let selectedHarvestBinId = "";
let harvestDateFromFilter = "";
let harvestDateToFilter = "";
let harvestCrewFilter = "Todas";
let harvestStatusFilter = "Todos";
let harvestSdpFilter = "Todos";
let harvestUniqueCacheSource = null;
let harvestUniqueCache = [];
let harvestFilteredCacheSource = null;
let harvestFilteredCacheKey = "";
let harvestFilteredCache = [];
let pestMonitoringRecords = null;
let pestMonitoringLoadPromise = null;
let pestMonitoringLoadError = "";
let pestMonitoringDataSource = "";
let pestMonitoringDateFrom = "";
let pestMonitoringDateTo = "";
let pestMonitoringPest = "Chanchito blanco";
let pestMonitoringPotrero = "Todos";
let pestMonitoringBlock = "Todos";
let pestMonitoringMap = null;
let pestMonitoringMapElement = null;
let pestMonitoringPolygons = [];
let pestMonitoringHeatOverlay = null;
let pestMonitoringInfoWindow = null;
let pestMonitoringMapRenderVersion = 0;
let pestMonitoringCurrentSummaries = new Map();
let weatherStationYear = String(new Date().getFullYear());
let weatherStationMonth = "Todos";
let weatherStationCloudAvailable = true;
let weatherStationImportPreview = null;
let irrigationEvaporationLoadedMonths = new Set();
let irrigationEvaporationLoadingMonths = new Set();
let supabaseSession = loadSession();
let passwordRecoverySession = null;
let currentProfile = null;
const CHILE_HOLIDAYS_2026 = new Set([
  "2026-01-01",
  "2026-04-03",
  "2026-04-04",
  "2026-05-01",
  "2026-05-21",
  "2026-06-20",
  "2026-06-29",
  "2026-07-16",
  "2026-08-15",
  "2026-09-18",
  "2026-09-19",
  "2026-10-12",
  "2026-10-31",
  "2026-11-01",
  "2026-12-08",
  "2026-12-25"
]);

if (localStorage.getItem("canelillo.irrigation.program.cleared.v1") !== "true") {
  localStorage.removeItem(IRRIGATION_PROGRAM_KEY);
  irrigationProgramHours = {};
  localStorage.setItem("canelillo.irrigation.program.cleared.v1", "true");
}

const views = {
  dashboard: document.getElementById("dashboard"),
  irrigation: document.getElementById("irrigation"),
  calicatas: document.getElementById("calicatas"),
  fertilizers: document.getElementById("fertilizers"),
  pestMonitoring: document.getElementById("pestMonitoring"),
  applicationDashboard: document.getElementById("applicationDashboard"),
  program: document.getElementById("program"),
  manager: document.getElementById("manager"),
  warehouse: document.getElementById("warehouse"),
  orders: document.getElementById("orders"),
  execution: document.getElementById("execution"),
  inventory: document.getElementById("inventory"),
  prices: document.getElementById("prices"),
  reports: document.getElementById("reports"),
  harvestMap: document.getElementById("harvestMap"),
  harvestInfo: document.getElementById("harvestInfo"),
  masters: document.getElementById("masters")
};

const titles = {
  dashboard: "Inicio",
  irrigation: "Riegos",
  calicatas: "Calicatas",
  fertilizers: "Fertilizantes",
  pestMonitoring: "Monitoreo de plagas",
  applicationDashboard: "Panel principal de aplicaciones",
  program: "Programa de aplicaciones",
  manager: "Panel supervisor encargado",
  warehouse: "Panel bodeguero",
  orders: "Ordenes de aplicacion",
  execution: "Ejecucion en terreno",
  inventory: "Bodega y stock",
  reports: "Reportes y ahorro",
  harvestMap: "Mapa de cosecha",
  harvestInfo: "Informacion de cosecha",
  masters: "Maestros del campo"
};

function loadState() {
  // Modo nube: los datos operativos se cargan desde Supabase al iniciar sesion.
  // Solo se usa seedState para renderizar la pantalla bloqueada antes del login.
  if (CLOUD_ONLY_MODE) return structuredClone(seedState);
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return structuredClone(seedState);
  try {
    return JSON.parse(stored);
  } catch {
    return structuredClone(seedState);
  }
}

function loadSession() {
  const stored = localStorage.getItem(SESSION_KEY);
  if (!stored) return null;
  try {
    const session = JSON.parse(stored);
    if (!session?.access_token) return null;
    if (Date.now() / 1000 > Number(session.expires_at || 0) && !session.refresh_token) return null;
    return session;
  } catch {
    return null;
  }
}

function saveSession(session) {
  supabaseSession = session;
  if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  else localStorage.removeItem(SESSION_KEY);
}

let supabaseRefreshPromise = null;

async function ensureSupabaseSession(force = false) {
  if (!supabaseSession?.access_token) return null;
  const expiresAt = Number(supabaseSession.expires_at || 0);
  const stillValid = expiresAt > Date.now() / 1000 + 60;
  if (!force && stillValid) return supabaseSession;
  if (!supabaseSession.refresh_token) throw new Error("La sesion de Supabase expiro. Vuelve a iniciar sesion.");
  if (supabaseRefreshPromise) return supabaseRefreshPromise;

  supabaseRefreshPromise = (async () => {
    const previous = supabaseSession;
    const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ refresh_token: previous.refresh_token })
    });
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;
    if (!response.ok || !data?.access_token) {
      saveSession(null);
      setAuthGate(true);
      throw new Error(data?.message || data?.msg || "La sesion de Supabase expiro. Vuelve a iniciar sesion.");
    }
    const refreshed = {
      ...previous,
      ...data,
      user: data.user || previous.user,
      refresh_token: data.refresh_token || previous.refresh_token,
      expires_at: data.expires_at || Math.floor(Date.now() / 1000) + Number(data.expires_in || 3600)
    };
    saveSession(refreshed);
    cloudRealtimeClient?.realtime?.setAuth?.(refreshed.access_token);
    return refreshed;
  })().finally(() => {
    supabaseRefreshPromise = null;
  });
  return supabaseRefreshPromise;
}

function setAuthGate(visible) {
  const authGate = document.getElementById("authGate");
  const appShell = document.querySelector(".app-shell");
  if (authGate) authGate.classList.toggle("hidden", !visible);
  if (appShell) {
    appShell.classList.toggle("locked", visible);
    appShell.setAttribute("aria-hidden", String(Boolean(visible)));
  }
  document.body.classList.toggle("auth-locked", Boolean(visible));
}

function normalizeState(rawState) {
  const next = structuredClone(rawState || seedState);
  next.products ||= [];
  next.seasons ||= [{ id: next.settings?.currentSeasonId || "season-2024-2025", name: next.settings?.season || "2024/2025", startYear: 2024, endYear: 2025, status: "activa" }];
  next.programs ||= [];
  next.programs.forEach((program) => {
    program.startDate ??= "";
    program.endDate ??= "";
    program.waterHa ??= 0;
  });
  next.blocks ||= [];
  next.operators ||= [];
  next.equipment ||= [];
  next.vehicles ||= [];
  next.orders ||= [];
  next.inventoryMovements ||= [];
  next.calicatas ||= [];
  next.irrigationEvaporation ||= [];
  next.irrigationRecords ||= [];
  next.weatherStationDaily ||= [];
  next.weatherStationLatest ||= null;
  next.harvestRecords ||= [];
  next.harvestOfficialRecords ||= [];
  next.harvestCrewSchedule ||= [];
  next.harvestJornales ||= [];
  const localEquipmentCode = (id) => next.equipment.find((item) => item.id === id)?.code || "";
  next.orders.forEach((order) => {
    order.seasonId ??= next.settings?.currentSeasonId || next.seasons[0]?.id || "";
    order.programNumber ??= inferProgramNumber(order);
    order.programNumbers = [...new Set((order.programNumbers?.length ? order.programNumbers : [order.programNumber]).filter((value) => value !== "" && value !== null && value !== undefined).map(Number))];
    order.program ??= "";
    order.classification ??= "";
    order.plannedDate ??= order.date || new Date().toISOString().slice(0, 10);
    order.endDate ??= order.plannedEndDate || order.plannedDate;
    order.speed ??= "";
    order.nozzle ??= "";
    order.pressure ??= "";
    order.tractorCode ??= localEquipmentCode(order.tractorId);
    order.machineCode ??= localEquipmentCode(order.sprayerId);
    order.dosifier ??= "";
    order.finishedByManager ??= false;
    if (order.status === "closed") order.finishedByManager ||= false;
    if (order.status === "draft") order.status = "planned";
    order.dispatches ||= [];
    order.tanks ||= [];
    order.recipe ||= [];
    order.recipe.forEach((line) => {
      line.dose100 ??= 0;
      line.programNumber ??= order.programNumbers?.[0] || order.programNumber || "";
      line.productHaProgram ??= productHaFromDose(order, line);
      line.totalProgram ??= plannedProduct(order, line);
    });
    syncOrderStatus(order);
  });
  return next;
}

function inferProgramNumber(order) {
  const text = `${order.program || ""} ${order.objective || ""}`;
  const match = text.match(/\b(\d{1,2})\b/);
  if (match) return Number(match[1]);
  if ((order.program || "").toLowerCase().includes("calibre")) return 1;
  if ((order.program || "").toLowerCase().includes("plaga")) return 2;
  return "";
}

function saveState() {
  if (!CLOUD_ONLY_MODE) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
  const mode = supabaseSession ? `Supabase ${currentProfile?.role || ""}` : "Solo Supabase";
  document.getElementById("storageStatus").textContent = `${mode} ${new Date().toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}`;
}

function sbHeaders(prefer) {
  const headers = {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${supabaseSession?.access_token || SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json"
  };
  if (prefer) headers.Prefer = prefer;
  return headers;
}

async function sbFetch(path, options = {}, retryAuth = true) {
  if (supabaseSession) await ensureSupabaseSession(false);
  const response = await fetch(`${SUPABASE_URL}${path}`, {
    ...options,
    headers: { ...sbHeaders(options.prefer), ...(options.headers || {}) }
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    const message = data?.message || data?.msg || text || response.statusText;
    if (response.status === 401 && retryAuth && supabaseSession?.refresh_token) {
      await ensureSupabaseSession(true);
      return sbFetch(path, options, false);
    }
    if (String(message).toLowerCase().includes("row-level security")) {
      const role = normalizeRole(currentProfile?.role || currentProfile?.rol);
      throw new Error(`${message}. Sesion: ${roleLabel(role)}. Revisa que el usuario exista en public.usuarios con id = auth.uid() y rol admin/supervisor/bodeguero.`);
    }
    throw new Error(message);
  }
  return data;
}

function isMissingSupabaseColumn(error, columns) {
  const message = String(error?.message || "").toLowerCase();
  return columns.some((column) => message.includes(String(column).toLowerCase()));
}

function normalizeRole(role) {
  const clean = String(role || "").trim().toLowerCase();
  const map = {
    administrador: "admin",
    admin: "admin",
    supervisor: "supervisor",
    jefe: "supervisor",
    encargado: "supervisor",
    bodeguero: "bodeguero",
    bodega: "bodeguero",
    aplicador: "bodeguero",
    operador: "operador",
    lectura: "lectura",
    solo_lectura: "lectura",
    "solo lectura": "lectura"
  };
  return map[clean] || clean || "bodeguero";
}

function toDbRole(role) {
  // Mantener los mismos nombres que existen en Supabase/RLS: admin, supervisor, bodeguero.
  return normalizeRole(role);
}

function normalizeRegistrationArea(area) {
  const clean = String(area || "").trim().toLowerCase();
  const map = {
    all: "todas",
    todo: "todas",
    todos: "todas",
    todas: "todas",
    agro: "agrocore",
    agrocore: "agrocore",
    "agro core": "agrocore",
    cosecha: "cosecha",
    harvest: "cosecha",
    canelillo_harvest: "cosecha",
    calicata: "calicatas",
    calicatas: "calicatas",
    riego: "riego",
    riegos: "riego",
    fertilizante: "fertilizacion",
    fertilizantes: "fertilizacion",
    fertilizacion: "fertilizacion"
  };
  return map[clean] || "todas";
}

function areaLabel(area) {
  const labels = {
    todas: "Todas las apps",
    agrocore: "AgroCore",
    cosecha: "Cosecha",
    calicatas: "Calicatas",
    riego: "Riego",
    fertilizacion: "Fertilizacion"
  };
  return labels[normalizeRegistrationArea(area)] || "Todas las apps";
}

function normalizeRutValue(rut) {
  return String(rut || "").trim().replace(/\s+/g, "").toUpperCase();
}

function normalizeEmailValue(email) {
  return String(email || "").trim().toLowerCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

function roleLabel(role) {
  const normalized = normalizeRole(role);
  const labels = { admin: "Admin", supervisor: "Jefe", bodeguero: "Bodeguero", operador: "Operador", lectura: "Solo lectura" };
  return labels[normalized] || role || "sin perfil";
}

function hasRole(...roles) {
  const normalized = normalizeRole(currentProfile?.role || currentProfile?.rol);
  return roles.map(normalizeRole).includes(normalized);
}

function currentUserRole() {
  return normalizeRole(currentProfile?.rol || currentProfile?.role);
}

function roleCanAccessView(role, view) {
  const normalized = normalizeRole(role);
  const permissions = {
    admin: ["dashboard", "irrigation", "calicatas", "fertilizers", "pestMonitoring", "applicationDashboard", "program", "manager", "warehouse", "inventory", "prices", "reports", "harvestMap", "harvestInfo", "orders", "execution", "masters"],
    supervisor: ["dashboard", "irrigation", "calicatas", "fertilizers", "pestMonitoring", "applicationDashboard", "program", "manager", "warehouse", "inventory", "prices", "reports", "harvestMap", "harvestInfo", "orders", "execution", "masters"],
    bodeguero: ["dashboard", "fertilizers", "warehouse", "inventory", "prices"],
    operador: ["execution"],
    lectura: ["dashboard", "irrigation", "calicatas", "fertilizers", "pestMonitoring", "reports", "harvestMap", "harvestInfo"]
  };
  return (permissions[normalized] || []).includes(view);
}

function defaultViewForRole(role) {
  const normalized = normalizeRole(role);
  if (normalized === "bodeguero") return "dashboard";
  if (normalized === "operador") return "execution";
  return "dashboard";
}

function visibleViewsForRole(role) {
  const normalized = normalizeRole(role);
  const viewsByRole = {
    admin: ["dashboard", "irrigation", "calicatas", "fertilizers", "pestMonitoring", "applicationDashboard", "program", "manager", "warehouse", "inventory", "prices", "reports", "harvestMap", "harvestInfo"],
    supervisor: ["dashboard", "irrigation", "calicatas", "fertilizers", "pestMonitoring", "applicationDashboard", "program", "manager", "warehouse", "inventory", "prices", "reports", "harvestMap", "harvestInfo"],
    bodeguero: ["dashboard", "fertilizers", "warehouse", "inventory", "prices"],
    operador: ["execution"],
    lectura: ["dashboard", "irrigation", "calicatas", "fertilizers", "pestMonitoring", "reports", "harvestMap", "harvestInfo"]
  };
  return new Set(viewsByRole[normalized] || [defaultViewForRole(normalized)]);
}

function fromDbOrderStatus(status) {
  const map = {
    planificada: "planned",
    en_proceso: "in_progress",
    completada: "closed",
    cancelada: "cancelled",
    borrador: "draft",
    draft: "draft",
    completed: "closed"
  };
  return map[status] || status || "planned";
}

function toDbOrderStatus(status) {
  const map = {
    planned: "planificada",
    in_progress: "en_proceso",
    closed: "completada",
    completed: "completada",
    cancelled: "cancelada",
    draft: "borrador"
  };
  return map[status] || status || "planificada";
}

async function sbSelect(table, query = "select=*") {
  return sbFetch(`/rest/v1/${table}?${query}`);
}

async function sbSelectAll(table, query = "select=*", pageSize = 1000) {
  const rows = [];
  for (let page = 0; page < 50; page += 1) {
    const from = page * pageSize;
    const to = from + pageSize - 1;
    const batch = await sbFetch(`/rest/v1/${table}?${query}`, {
      headers: { Range: `${from}-${to}` }
    });
    rows.push(...(batch || []));
    if (!batch || batch.length < pageSize) break;
  }
  return rows;
}

async function sbSelectPublic(table, query = "select=*") {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json"
    }
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) throw new Error(data?.message || data?.msg || text || response.statusText);
  return data;
}

async function sbSelectAllPublic(table, query = "select=*", pageSize = 1000) {
  const rows = [];
  for (let page = 0; page < 50; page += 1) {
    const from = page * pageSize;
    const to = from + pageSize - 1;
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
        Range: `${from}-${to}`
      }
    });
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;
    if (!response.ok) throw new Error(data?.message || data?.msg || text || response.statusText);
    rows.push(...(data || []));
    if (!data || data.length < pageSize) break;
  }
  return rows;
}

function mapEvaporationRows(rows = []) {
  return rows.map((item) => ({
    date: String(item.fecha || "").slice(0, 10),
    evaporation: item.evaporacion === null ? null : Number(item.evaporacion),
    station: item.estacion === null || item.estacion === undefined ? "" : String(item.estacion)
  })).filter((item) => item.date);
}

function mergeEvaporationRows(rows = []) {
  const byDate = new Map((state.irrigationEvaporation || []).map((item) => [item.date, item]));
  mapEvaporationRows(rows).forEach((item) => byDate.set(item.date, item));
  state.irrigationEvaporation = [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
}

async function ensureIrrigationEvaporationData(monthPrefix, daysInMonth) {
  if (!monthPrefix || irrigationEvaporationLoadedMonths.has(monthPrefix) || irrigationEvaporationLoadingMonths.has(monthPrefix)) return;
  irrigationEvaporationLoadingMonths.add(monthPrefix);
  const start = `${monthPrefix}-01`;
  const end = `${monthPrefix}-${String(daysInMonth).padStart(2, "0")}`;
  const query = `select=fecha,evaporacion,estacion&fecha=gte.${start}&fecha=lte.${end}&order=fecha.asc`;
  try {
    const rows = await sbSelect("evaporacion_bandeja", query)
      .then((items) => items?.length ? items : sbSelectPublic("evaporacion_bandeja", query))
      .catch(() => sbSelectPublic("evaporacion_bandeja", query));
    mergeEvaporationRows(rows);
    irrigationEvaporationLoadedMonths.add(monthPrefix);
    if (currentView === "irrigation" && `${irrigationYear}-${irrigationMonth}` === monthPrefix) renderIrrigation();
  } catch (error) {
    console.warn("No se pudo cargar evaporacion de bandeja del mes", error);
  } finally {
    irrigationEvaporationLoadingMonths.delete(monthPrefix);
  }
}

async function saveIrrigationBandejaRecord() {
  const form = document.getElementById("irrigationBandejaForm");
  if (!form || !form.reportValidity()) return;
  if (!supabaseSession) {
    showToast("Inicia sesion para guardar bandeja");
    return;
  }
  const data = Object.fromEntries(new FormData(form));
  const date = String(data.fecha || "").slice(0, 10);
  const evaporation = Number(data.evaporacion);
  const station = String(data.estacion || "").trim();
  if (!date || !Number.isFinite(evaporation) || evaporation < 0) {
    showToast("Revisa fecha y evaporacion");
    return;
  }
  try {
    const saved = await sbFetch("/rest/v1/evaporacion_bandeja?select=fecha,evaporacion,estacion", {
      method: "POST",
      prefer: "return=representation",
      body: JSON.stringify([{
        fecha: date,
        evaporacion: evaporation,
        estacion: station || null
      }])
    });
    const row = saved?.[0] || { fecha: date, evaporacion: evaporation, estacion: station };
    mergeEvaporationRows([row]);
    irrigationEvaporationLoadedMonths.add(date.slice(0, 7));
    if (date.slice(0, 7) !== `${irrigationYear}-${irrigationMonth}`) {
      irrigationYear = date.slice(0, 4);
      irrigationMonth = date.slice(5, 7);
    }
    irrigationBandejaFocusPending = true;
    renderIrrigation();
    showToast("Dato de bandeja guardado");
  } catch (error) {
    showToast(`No se guardo bandeja: ${error.message}`);
  }
}

function money(value) {
  return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(value || 0);
}

function number(value, digits = 1) {
  return new Intl.NumberFormat("es-CL", { maximumFractionDigits: digits }).format(value || 0);
}

function currentTimeValue() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

function extractTimeValue(value) {
  if (!value) return "";
  const text = String(value);
  const timeMatch = text.match(/(?:T|\s)(\d{2}:\d{2})/);
  if (timeMatch) return timeMatch[1];
  const plainTime = text.match(/^(\d{2}:\d{2})/);
  return plainTime ? plainTime[1] : "";
}

function dispatchDisplayTime(dispatch) {
  return dispatch.time || extractTimeValue(dispatch.createdAt) || extractTimeValue(dispatch.date) || "-";
}

function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function getProduct(id) {
  return state.products.find((product) => product.id === id);
}

function getOperator(id) {
  if (!id) return "Sin asignar";
  return state.operators.find((operator) => operator.id === id)?.name || String(id);
}

function getEquipment(id) {
  return state.equipment.find((item) => item.id === id)?.code || "Sin equipo";
}

function getSeason(id) {
  return state.seasons.find((season) => season.id === id) || state.seasons[0] || { id: "", name: state.settings.season };
}

function getProgramDefinition(order) {
  return state.programs.find((program) => program.seasonId === order.seasonId && String(program.number) === String(order.programNumber));
}

function getProgramDefinitionByNumber(seasonId, numberValue) {
  return state.programs.find((program) => program.seasonId === seasonId && String(program.number) === String(numberValue));
}

function programLabel(order) {
  const numbers = order.programNumbers?.length ? order.programNumbers : [order.programNumber].filter(Boolean);
  return numbers.length ? `Programa ${numbers.join(", ")}` : "Programa s/n";
}

function programNumbersLabel(order) {
  const numbers = order.programNumbers?.length ? order.programNumbers : [order.programNumber].filter(Boolean);
  return numbers.length ? numbers.join(", ") : "-";
}

function fieldSummary(potrero) {
  const blocks = state.blocks.filter((block) => block.potrero === potrero);
  if (!blocks.length) return null;
  return {
    potrero,
    blocks: blocks.map((block) => block.block),
    crop: blocks[0].crop,
    variety: blocks[0].variety,
    hectares: blocks.reduce((sum, block) => sum + (Number(block.hectares) || 0), 0)
  };
}

function blocksForPotrero(potrero) {
  return state.blocks
    .filter((block) => block.potrero === potrero)
    .sort(blockSort);
}

function uniquePotreros() {
  return [...new Set(state.blocks.map((block) => block.potrero).filter(Boolean))].sort(comparePotrero);
}

function loadIrrigationHours() {
  try {
    return JSON.parse(localStorage.getItem(IRRIGATION_DRAFT_KEY) || "{}");
  } catch {
    return {};
  }
}

function loadIrrigationProgramHours() {
  try {
    return JSON.parse(localStorage.getItem(IRRIGATION_PROGRAM_KEY) || "{}");
  } catch {
    return {};
  }
}

function loadJsonMap(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "{}");
  } catch {
    return {};
  }
}

function saveIrrigationHours() {
  localStorage.setItem(IRRIGATION_DRAFT_KEY, JSON.stringify(irrigationHours));
}

function saveIrrigationProgramHours() {
  localStorage.setItem(IRRIGATION_PROGRAM_KEY, JSON.stringify(irrigationProgramHours));
}

function saveIrrigationAudit() {
  localStorage.setItem(IRRIGATION_AUDIT_KEY, JSON.stringify(irrigationAudit));
}

function saveIrrigationProgramAudit() {
  localStorage.setItem(IRRIGATION_PROGRAM_AUDIT_KEY, JSON.stringify(irrigationProgramAudit));
}

function saveIrrigationObservations() {
  localStorage.setItem(IRRIGATION_OBSERVATIONS_KEY, JSON.stringify(irrigationObservations));
  localStorage.setItem(IRRIGATION_PROGRAM_OBSERVATIONS_KEY, JSON.stringify(irrigationProgramObservations));
}

function irrigationKey(blockId, date) {
  return `${blockId}__${date}`;
}

function pruneEmptyIrrigationAudits() {
  let changedReal = false;
  let changedProgram = false;
  Object.keys(irrigationAudit).forEach((key) => {
    if (Number(irrigationHours[key]) > 0) return;
    delete irrigationAudit[key];
    changedReal = true;
  });
  Object.keys(irrigationProgramAudit).forEach((key) => {
    if (Number(irrigationProgramHours[key]) > 0) return;
    delete irrigationProgramAudit[key];
    changedProgram = true;
  });
  if (changedReal) saveIrrigationAudit();
  if (changedProgram) saveIrrigationProgramAudit();
}

function currentAuditUser() {
  return {
    id: currentProfile?.id || supabaseSession?.user?.id || null,
    name: currentProfile?.full_name || currentProfile?.nombre_completo || supabaseSession?.user?.email || "Usuario",
    email: supabaseSession?.user?.email || ""
  };
}

function irrigationAuditEntry() {
  const user = currentAuditUser();
  return {
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    updatedAt: new Date().toISOString()
  };
}

function irrigationAuditTitle(kind, block, date, value) {
  const key = irrigationKey(block.id, date);
  const audit = kind === "program" ? irrigationProgramAudit[key] : irrigationAudit[key];
  const observation = irrigationCellObservation(kind, block.id, date);
  const base = `${kind === "program" ? "Programa" : "Riego real"} ${block.potrero} bloque ${block.block} - ${date}`;
  const hours = value === "" || value === null || value === undefined ? "Sin horas" : `${value} hrs`;
  const lines = [base, hours];
  if (observation?.text) {
    lines.push(`Observacion: ${observation.text}`);
    if (observation.updatedByName || observation.updatedAt) {
      const observationWhen = observation.updatedAt ? new Date(observation.updatedAt).toLocaleString("es-CL") : "Sin fecha";
      lines.push(`Observacion registrada por: ${observation.updatedByName || "Usuario"}`, `Fecha observacion: ${observationWhen}`);
    }
    lines.push("Doble clic para editar la observacion");
  } else {
    lines.push("Doble clic para anadir una observacion");
  }
  if (!audit) lines.push("Sin modificacion de horas registrada");
  else {
    const when = audit.updatedAt ? new Date(audit.updatedAt).toLocaleString("es-CL") : "Sin fecha";
    lines.push(`Horas modificadas por: ${audit.userName || audit.userEmail || "Usuario"}`, `Fecha horas: ${when}`);
  }
  return lines.join("\n");
}

function irrigationObservationMap(kind) {
  return kind === "program" ? irrigationProgramObservations : irrigationObservations;
}

function irrigationCellObservation(kind, blockId, date) {
  return irrigationObservationMap(kind)[irrigationKey(blockId, date)] || null;
}

function irrigationObservationClass(kind, blockId, date) {
  return irrigationCellObservation(kind, blockId, date)?.text ? "has-observation" : "";
}

function renderIrrigationHourCell(kind, block, date, value, rowIndex, dayIndex) {
  const key = irrigationKey(block.id, date);
  const audit = kind === "program" ? irrigationProgramAudit[key] : irrigationAudit[key];
  const auditClass = Number(value) > 0 && audit ? "has-audit" : "";
  const observationClass = irrigationObservationClass(kind, block.id, date);
  const selectedClass = irrigationObservationContext?.kind === kind && irrigationObservationContext?.blockId === block.id && irrigationObservationContext?.date === date ? "is-selected" : "";
  const idAttribute = kind === "program" ? `data-program-block-id="${htmlAttr(block.id)}"` : `data-block-id="${htmlAttr(block.id)}"`;
  const label = `${kind === "program" ? "Programa" : "Riego real"} ${block.potrero} bloque ${block.block} dia ${dayIndex + 1}`;
  return `<input class="irrigation-hour-input ${kind === "program" ? "irrigation-program-input" : ""} ${irrigationDayClass(date)} ${auditClass} ${observationClass} ${selectedClass} ${Number(value) > 0 ? "has-hours" : ""}" type="number" min="0" step="0.5" inputmode="decimal" aria-label="${htmlAttr(label)}" title="${htmlAttr(irrigationAuditTitle(kind, block, date, value))}" data-grid-kind="${kind}" data-row-index="${rowIndex}" data-day-index="${dayIndex}" ${idAttribute} data-date="${date}" value="${htmlAttr(value)}">`;
}

function applyIrrigationObservationRecords(rows = []) {
  const pendingReal = Object.fromEntries(Object.entries(irrigationObservations).filter(([, item]) => item?.pending));
  const pendingProgram = Object.fromEntries(Object.entries(irrigationProgramObservations).filter(([, item]) => item?.pending));
  const real = {};
  const program = {};
  rows.forEach((item) => {
    const date = String(item.fecha || "").slice(0, 10);
    if (!item.campo_id || !date || !String(item.observacion || "").trim()) return;
    const target = item.tipo === "programa" ? program : real;
    target[irrigationKey(item.campo_id, date)] = {
      id: item.id,
      text: String(item.observacion).trim(),
      createdById: item.creado_por || null,
      createdByName: item.creado_por_nombre || "",
      updatedById: item.actualizado_por || item.creado_por || null,
      updatedByName: item.actualizado_por_nombre || item.creado_por_nombre || "",
      updatedAt: item.actualizado_en || item.creado_en || "",
      pending: false
    };
  });
  irrigationObservations = { ...real, ...pendingReal };
  irrigationProgramObservations = { ...program, ...pendingProgram };
  saveIrrigationObservations();
}

function setIrrigationCellAudit(kind, blockId, date) {
  const key = irrigationKey(blockId, date);
  const entry = irrigationAuditEntry();
  if (kind === "program") {
    irrigationProgramAudit[key] = entry;
    saveIrrigationProgramAudit();
  } else {
    irrigationAudit[key] = entry;
    saveIrrigationAudit();
  }
  return entry;
}

function clearIrrigationCellAudit(kind, blockId, date) {
  const key = irrigationKey(blockId, date);
  if (kind === "program") {
    delete irrigationProgramAudit[key];
    saveIrrigationProgramAudit();
  } else {
    delete irrigationAudit[key];
    saveIrrigationAudit();
  }
}

function irrigationAuditPayload(entry) {
  return {
    creado_por_nombre: entry.userName || null,
    modificado_por: entry.userId,
    modificado_por_nombre: entry.userName || null,
    modificado_en: entry.updatedAt
  };
}

function irrigationDayClass(date) {
  const day = new Date(`${date}T12:00:00`);
  const weekend = day.getDay() === 0 || day.getDay() === 6;
  const holiday = CHILE_HOLIDAYS_2026.has(date);
  return `${weekend ? "is-weekend" : ""} ${holiday ? "is-holiday" : ""}`.trim();
}

function irrigationDayTitle(date, base = "") {
  const labels = [];
  const day = new Date(`${date}T12:00:00`);
  if (day.getDay() === 0 || day.getDay() === 6) labels.push("Fin de semana");
  if (CHILE_HOLIDAYS_2026.has(date)) labels.push("Feriado");
  return [base, ...labels].filter(Boolean).join(" · ");
}

function irrigationVolume(hours, flow) {
  const h = Number(hours);
  const f = Number(flow);
  if (!Number.isFinite(h) || !Number.isFinite(f)) return 0;
  return h * f;
}

function irrigationBlockSnapshot(block) {
  return {
    potrero: block?.potrero || "",
    bloque: block?.block || "",
    especie: block?.crop || "",
    variedad: block?.variety || "",
    hectareas: Number(block?.hectares) || 0,
    precipitacion: block?.precipitation === null || block?.precipitation === undefined ? null : Number(block.precipitation),
    caudal: block?.flow === null || block?.flow === undefined ? null : Number(block.flow)
  };
}

function missingSupabaseColumnName(error, columns) {
  const message = String(error?.message || "").toLowerCase();
  return columns.find((column) => message.includes(String(column).toLowerCase())) || "";
}

async function upsertSupabaseRowWithOptionalColumns(path, payload, optionalColumns) {
  let body = { ...payload };
  let remaining = [...optionalColumns];
  while (true) {
    try {
      return await sbFetch(path, {
        method: "POST",
        prefer: "resolution=merge-duplicates,return=minimal",
        body: JSON.stringify(body)
      });
    } catch (error) {
      const missing = missingSupabaseColumnName(error, remaining);
      if (!missing) throw error;
      delete body[missing];
      remaining = remaining.filter((column) => column !== missing);
    }
  }
}

function applyIrrigationRecords(rows = []) {
  const pendingKeys = new Set(irrigationSaveTimers.keys());
  const pendingHours = Object.fromEntries(Object.entries(irrigationHours).filter(([key]) => pendingKeys.has(key)));
  const pendingAudit = Object.fromEntries(Object.entries(irrigationAudit).filter(([key]) => pendingKeys.has(key)));
  state.irrigationRecords = rows.map((item) => ({
    id: item.id,
    blockId: item.campo_id,
    date: String(item.fecha || "").slice(0, 10),
    hours: Number(item.horas_riego) || 0,
    volume: Number(item.volumen) || 0,
    modifiedByName: item.modificado_por_nombre || item.creado_por_nombre || "",
    modifiedAt: item.modificado_en || item.actualizado_en || item.updated_at || ""
  })).filter((item) => item.blockId && item.date);
  const cloudHours = {};
  const cloudAudit = {};
  state.irrigationRecords.forEach((item) => {
    const key = irrigationKey(item.blockId, item.date);
    if (item.hours > 0) cloudHours[key] = item.hours;
    if (item.hours > 0 && (item.modifiedByName || item.modifiedAt)) {
      cloudAudit[key] = { userName: item.modifiedByName, updatedAt: item.modifiedAt };
    }
  });
  irrigationHours = { ...cloudHours, ...pendingHours };
  irrigationAudit = { ...cloudAudit, ...pendingAudit };
  saveIrrigationHours();
  saveIrrigationAudit();
}

function applyIrrigationProgramRecords(rows = []) {
  const pendingKeys = new Set(irrigationProgramSaveTimers.keys());
  const pendingHours = Object.fromEntries(Object.entries(irrigationProgramHours).filter(([key]) => pendingKeys.has(key)));
  const pendingAudit = Object.fromEntries(Object.entries(irrigationProgramAudit).filter(([key]) => pendingKeys.has(key)));
  const cloudHours = {};
  const cloudAudit = {};
  (rows || []).forEach((item) => {
    const key = irrigationKey(item.campo_id, String(item.fecha || "").slice(0, 10));
    const hours = Number(item.horas_programadas) || 0;
    if (item.campo_id && item.fecha && hours > 0) cloudHours[key] = hours;
    if (hours > 0 && (item.modificado_por_nombre || item.modificado_en || item.actualizado_en)) {
      cloudAudit[key] = {
        userName: item.modificado_por_nombre || item.creado_por_nombre || "",
        updatedAt: item.modificado_en || item.actualizado_en || ""
      };
    }
  });
  irrigationProgramHours = { ...cloudHours, ...pendingHours };
  irrigationProgramAudit = { ...cloudAudit, ...pendingAudit };
  saveIrrigationProgramHours();
  saveIrrigationProgramAudit();
}

function setIrrigationCellSyncState(kind, blockId, date, status, message = "") {
  const context = { kind, blockId, date };
  const input = irrigationObservationInput(context);
  if (!input) return;
  input.classList.remove("is-syncing", "is-synced", "is-sync-error");
  if (status) input.classList.add(`is-${status}`);
  input.dataset.syncStatus = status || "";
  if (message) input.dataset.syncMessage = message;
  else delete input.dataset.syncMessage;
}

async function saveIrrigationCell(blockId, date, hours) {
  if (!supabaseSession) {
    showToast("No se guardo el riego: no hay una sesion activa de Supabase");
    return false;
  }
  const block = state.blocks.find((item) => item.id === blockId);
  if (!block || !date) return false;
  const value = Number(hours);
  const audit = irrigationAudit[irrigationKey(blockId, date)] || irrigationAuditEntry();
  try {
    if (!Number.isFinite(value) || value <= 0) {
      await sbFetch(`/rest/v1/riego?campo_id=eq.${encodeURIComponent(blockId)}&fecha=eq.${encodeURIComponent(date)}`, {
        method: "DELETE",
        prefer: "return=minimal"
      });
      irrigationCloudAvailable = true;
      return true;
    }
    const payload = {
      campo_id: blockId,
      fecha: date,
      horas_riego: value,
      volumen: irrigationVolume(value, block.flow),
      creado_por: audit.userId,
      ...irrigationAuditPayload(audit),
      ...irrigationBlockSnapshot(block)
    };
    await upsertSupabaseRowWithOptionalColumns(`/rest/v1/riego?on_conflict=campo_id,fecha`, payload, IRRIGATION_OPTIONAL_COLUMNS);
    irrigationCloudAvailable = true;
    return true;
  } catch (error) {
    irrigationCloudAvailable = !String(error?.message || "").toLowerCase().includes("could not find the table");
    console.warn("No se pudo guardar riego en Supabase", error);
    showToast(`Supabase rechazo el riego: ${error.message || "error desconocido"}`);
    return false;
  }
}

function scheduleIrrigationCellSave(blockId, date, hours) {
  const key = irrigationKey(blockId, date);
  clearTimeout(irrigationSaveTimers.get(key));
  setIrrigationCellSyncState("real", blockId, date, "syncing");
  const timer = setTimeout(async () => {
    const saved = await saveIrrigationCell(blockId, date, hours);
    if (irrigationSaveTimers.get(key) === timer) irrigationSaveTimers.delete(key);
    setIrrigationCellSyncState("real", blockId, date, saved ? "synced" : "sync-error", saved ? "Guardado en Supabase" : "No sincronizado");
  }, 650);
  irrigationSaveTimers.set(key, timer);
}

async function saveIrrigationProgramCell(blockId, date, hours) {
  if (!supabaseSession) {
    showToast("No se guardo el programa: no hay una sesion activa de Supabase");
    return false;
  }
  const block = state.blocks.find((item) => item.id === blockId);
  if (!block || !date) return false;
  const value = Number(hours);
  const audit = irrigationProgramAudit[irrigationKey(blockId, date)] || irrigationAuditEntry();
  try {
    if (!Number.isFinite(value) || value <= 0) {
      await sbFetch(`/rest/v1/programa_riego?campo_id=eq.${encodeURIComponent(blockId)}&fecha=eq.${encodeURIComponent(date)}`, {
        method: "DELETE",
        prefer: "return=minimal"
      });
      irrigationProgramCloudAvailable = true;
      return true;
    }
    const payload = {
      campo_id: blockId,
      fecha: date,
      horas_programadas: value,
      volumen_programado: irrigationVolume(value, block.flow),
      creado_por: audit.userId,
      ...irrigationAuditPayload(audit),
      ...irrigationBlockSnapshot(block)
    };
    await upsertSupabaseRowWithOptionalColumns(`/rest/v1/programa_riego?on_conflict=campo_id,fecha`, payload, IRRIGATION_OPTIONAL_COLUMNS);
    irrigationProgramCloudAvailable = true;
    return true;
  } catch (error) {
    irrigationProgramCloudAvailable = !String(error?.message || "").toLowerCase().includes("could not find the table");
    console.warn("No se pudo guardar programa de riego en Supabase", error);
    showToast(`Supabase rechazo el programa: ${error.message || "error desconocido"}`);
    return false;
  }
}

function scheduleIrrigationProgramCellSave(blockId, date, hours) {
  const key = irrigationKey(blockId, date);
  clearTimeout(irrigationProgramSaveTimers.get(key));
  setIrrigationCellSyncState("program", blockId, date, "syncing");
  const timer = setTimeout(async () => {
    const saved = await saveIrrigationProgramCell(blockId, date, hours);
    if (irrigationProgramSaveTimers.get(key) === timer) irrigationProgramSaveTimers.delete(key);
    setIrrigationCellSyncState("program", blockId, date, saved ? "synced" : "sync-error", saved ? "Guardado en Supabase" : "No sincronizado");
  }, 650);
  irrigationProgramSaveTimers.set(key, timer);
}

function irrigationObservationInput(context = irrigationObservationContext) {
  if (!context || !views.irrigation) return null;
  const idAttribute = context.kind === "program" ? "data-program-block-id" : "data-block-id";
  return views.irrigation.querySelector(`.irrigation-hour-input[${idAttribute}="${CSS.escape(context.blockId)}"][data-date="${CSS.escape(context.date)}"]`);
}

function updateIrrigationObservationCellUi(context = irrigationObservationContext) {
  const input = irrigationObservationInput(context);
  if (!input) return;
  const block = state.blocks.find((item) => item.id === context.blockId) || { id: context.blockId, potrero: "", block: "" };
  const hasObservation = Boolean(irrigationCellObservation(context.kind, context.blockId, context.date)?.text);
  input.classList.toggle("has-observation", hasObservation);
  input.title = irrigationAuditTitle(context.kind, block, context.date, input.value);
}

function selectIrrigationObservationCell(input) {
  if (!setIrrigationObservationContextFromInput(input)) return false;
  views.irrigation?.querySelectorAll(".irrigation-hour-input.is-selected").forEach((cell) => cell.classList.remove("is-selected"));
  input.classList.add("is-selected");
  return true;
}

async function saveIrrigationObservation(context, observation) {
  if (!context?.blockId || !context?.date || !["real", "program"].includes(context.kind)) return false;
  const text = String(observation || "").trim();
  if (text.length > 500) {
    showToast("La observacion no puede superar 500 caracteres");
    return false;
  }
  const key = irrigationKey(context.blockId, context.date);
  const map = irrigationObservationMap(context.kind);
  const previous = map[key] ? { ...map[key] } : null;
  const user = currentAuditUser();
  const updatedAt = new Date().toISOString();

  if (text) {
    map[key] = {
      ...previous,
      text,
      createdById: previous?.createdById || user.id,
      createdByName: previous?.createdByName || user.name,
      updatedById: user.id,
      updatedByName: user.name,
      updatedAt,
      pending: true
    };
  } else {
    delete map[key];
  }
  saveIrrigationObservations();
  updateIrrigationObservationCellUi(context);

  if (!supabaseSession) {
    showToast("Observacion guardada localmente; inicia sesion para sincronizar");
    return true;
  }
  if (!irrigationObservationsCloudAvailable) {
    if (!text && previous) map[key] = previous;
    saveIrrigationObservations();
    updateIrrigationObservationCellUi(context);
    showToast("Falta crear public.observaciones_riego en Supabase");
    return false;
  }

  try {
    const type = context.kind === "program" ? "programa" : "real";
    const query = `tipo=eq.${type}&campo_id=eq.${encodeURIComponent(context.blockId)}&fecha=eq.${encodeURIComponent(context.date)}`;
    if (!text) {
      await sbFetch(`/rest/v1/observaciones_riego?${query}`, { method: "DELETE", prefer: "return=minimal" });
    } else {
      const block = state.blocks.find((item) => item.id === context.blockId);
      if (!block) throw new Error("No se encontro el bloque de la observacion");
      const entry = map[key];
      await sbFetch("/rest/v1/observaciones_riego?on_conflict=tipo,campo_id,fecha", {
        method: "POST",
        prefer: "resolution=merge-duplicates,return=minimal",
        body: JSON.stringify({
          tipo: type,
          campo_id: context.blockId,
          fecha: context.date,
          observacion: text,
          creado_por: entry.createdById,
          creado_por_nombre: entry.createdByName || null,
          actualizado_por: entry.updatedById,
          actualizado_por_nombre: entry.updatedByName || null
        })
      });
      entry.pending = false;
      saveIrrigationObservations();
    }
    updateIrrigationObservationCellUi(context);
    showToast(text ? "Observacion guardada en Supabase" : "Observacion eliminada");
    return true;
  } catch (error) {
    const message = String(error?.message || "").toLowerCase();
    irrigationObservationsCloudAvailable = !message.includes("could not find the table") && !message.includes("schema cache");
    if (!text && previous) map[key] = previous;
    saveIrrigationObservations();
    updateIrrigationObservationCellUi(context);
    console.warn("No se pudo guardar la observacion de riego", error);
    showToast(irrigationObservationsCloudAvailable ? "No se pudo sincronizar la observacion; quedo pendiente localmente" : "Falta crear public.observaciones_riego en Supabase");
    return false;
  }
}

function setIrrigationObservationContextFromInput(input) {
  const kind = input.dataset.gridKind;
  const blockId = kind === "program" ? input.dataset.programBlockId : input.dataset.blockId;
  if (!blockId || !input.dataset.date) return false;
  irrigationObservationContext = { kind, blockId, date: input.dataset.date };
  return true;
}

function openIrrigationObservationForInput(input) {
  if (!setIrrigationObservationContextFromInput(input)) return;
  openIrrigationObservationDialog();
}

function openIrrigationObservationDialog() {
  const context = irrigationObservationContext;
  if (!context) return;
  const block = state.blocks.find((item) => item.id === context.blockId);
  if (!block) return;
  const observationEntry = irrigationCellObservation(context.kind, context.blockId, context.date);
  const existing = observationEntry?.text || "";
  const key = irrigationKey(context.blockId, context.date);
  const hourAudit = context.kind === "program" ? irrigationProgramAudit[key] : irrigationAudit[key];
  const hours = context.kind === "program" ? irrigationProgramHours[key] : irrigationHours[key];
  const lastUser = observationEntry?.updatedByName || hourAudit?.userName || hourAudit?.userEmail || "Sin registro";
  const lastDateValue = observationEntry?.updatedAt || hourAudit?.updatedAt || "";
  const lastDate = lastDateValue ? new Date(lastDateValue).toLocaleString("es-CL") : "Sin registro";
  const dialog = document.getElementById("irrigationObservationDialog");
  dialog.innerHTML = `
    <form id="irrigationObservationForm" class="dialog-card irrigation-observation-dialog">
      <div class="dialog-header">
        <div>
          <h3>Observacion:</h3>
          <p>${context.kind === "program" ? "Programa" : "Riego real"} · Potrero ${escapeHtml(block.potrero)} · Bloque ${escapeHtml(block.block)} · ${escapeHtml(context.date)}</p>
        </div>
        <button class="icon-button" type="button" data-action="close-dialog" title="Cerrar">x</button>
      </div>
      <div class="irrigation-observation-summary">
        <span><small>Horas</small><strong>${hours === "" || hours === undefined ? "-" : escapeHtml(hours)}</strong></span>
        <span><small>Ultimo usuario</small><strong>${escapeHtml(lastUser)}</strong></span>
        <span><small>Ultima modificacion</small><strong>${escapeHtml(lastDate)}</strong></span>
      </div>
      <label>Observacion
        <textarea id="irrigationObservationText" maxlength="500" rows="5" required placeholder="Escribe la informacion relevante de esta celda">${escapeHtml(existing)}</textarea>
      </label>
      <div class="irrigation-observation-meta"><span>Maximo 500 caracteres</span><span id="irrigationObservationCount">${existing.length}/500</span></div>
      <div class="dialog-actions">
        ${existing ? '<button class="danger-button" type="button" data-action="delete-irrigation-observation">Eliminar</button>' : ""}
        <button class="secondary-button" type="button" data-action="close-dialog">Cancelar</button>
        <button class="primary-button" type="submit">Guardar</button>
      </div>
    </form>`;
  const form = dialog.querySelector("form");
  const textarea = dialog.querySelector("textarea");
  textarea?.addEventListener("input", () => {
    const count = document.getElementById("irrigationObservationCount");
    if (count) count.textContent = `${textarea.value.length}/500`;
  });
  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submit = form.querySelector('[type="submit"]');
    submit.disabled = true;
    const saved = await saveIrrigationObservation(context, textarea.value);
    submit.disabled = false;
    if (saved) dialog.close();
  });
  if (dialog.open) dialog.close();
  dialog.showModal();
  textarea?.focus();
}

async function deleteCloudIrrigationMonth(blocks, year, month) {
  if (!supabaseSession || !irrigationCloudAvailable) return;
  const daysInMonth = new Date(Number(year), Number(month), 0).getDate();
  const deletes = blocks.flatMap((block) => Array.from({ length: daysInMonth }, (_, index) => {
    const date = `${year}-${month}-${String(index + 1).padStart(2, "0")}`;
    return sbFetch(`/rest/v1/riego?campo_id=eq.${encodeURIComponent(block.id)}&fecha=eq.${encodeURIComponent(date)}`, {
      method: "DELETE",
      prefer: "return=minimal"
    }).catch((error) => {
      irrigationCloudAvailable = !String(error?.message || "").toLowerCase().includes("could not find the table");
      console.warn("No se pudo eliminar riego en Supabase", error);
    });
  }));
  await Promise.all(deletes);
}

function calicataBlockKey(potrero, block) {
  return `${String(potrero || "").trim()}__${String(block || "").trim()}`;
}

function calicatasForBlock(block) {
  const key = calicataBlockKey(block.potrero, block.block);
  return (state.calicatas || []).filter((item) => calicataBlockKey(item.potrero, item.block) === key);
}

function calicataDate(item) {
  return String(item.createdAt || "").slice(0, 10);
}

function average(values) {
  const valid = values.map(Number).filter((value) => Number.isFinite(value));
  return valid.length ? valid.reduce((sum, value) => sum + value, 0) / valid.length : null;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function mixColor(start, end, ratio) {
  const clean = (hex) => hex.replace("#", "").match(/.{1,2}/g).map((part) => parseInt(part, 16));
  const [sr, sg, sb] = clean(start);
  const [er, eg, eb] = clean(end);
  const t = clamp(ratio, 0, 1);
  const toHex = (value) => Math.round(value).toString(16).padStart(2, "0");
  return `#${toHex(sr + (er - sr) * t)}${toHex(sg + (eg - sg) * t)}${toHex(sb + (eb - sb) * t)}`;
}

function calicataValueColor(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return "#94a3b8";
  const clamped = clamp(numeric, 1, 5);
  if (clamped <= 2.5) return mixColor("#dc2626", "#facc15", (clamped - 1) / 1.5);
  return mixColor("#facc15", "#2563eb", (clamped - 2.5) / 2.5);
}

function calicataAverageValue(item) {
  return average([item?.depth20, item?.depth40, item?.depth60, item?.depth80]);
}

function calicataColorStyle(value) {
  const color = calicataValueColor(value);
  return `--calicata-color:${color};--calicata-bg:${color}22;--calicata-border:${color}99;`;
}

function calicataSummary(calicatas) {
  const active = calicatas.filter((item) => !item.empty);
  const depth20 = average(active.map((item) => item.depth20));
  const depth40 = average(active.map((item) => item.depth40));
  const depth60 = average(active.map((item) => item.depth60));
  const depth80 = average(active.map((item) => item.depth80));
  const general = average([depth20, depth40, depth60, depth80]);
  return { count: active.length, depth20, depth40, depth60, depth80, general };
}

function calicataDepthCell(calicatas, field) {
  const value = average(calicatas.filter((item) => !item.empty).map((item) => item[field]));
  return value === null ? "" : number(value);
}

function calicataTextCell(calicatas, field) {
  const values = [...new Set(calicatas.map((item) => String(item[field] || "").trim()).filter(Boolean))];
  if (!values.length) return "";
  return values.length > 1 ? `${values[0]} +${values.length - 1}` : values[0];
}

function calicataMonthMatches(item, monthPrefix) {
  return !monthPrefix || calicataDate(item).slice(0, 7) === monthPrefix;
}

function irrigationCalicataOptions(blocks) {
  const seen = new Map();
  blocks.forEach((block) => {
    const key = calicataBlockKey(block.potrero, block.block);
    if (!seen.has(key)) seen.set(key, { key, label: `${block.potrero || "-"} / bloque ${block.block || "-"}` });
  });
  return [{ key: "Todos", label: "Todos" }, ...[...seen.values()].sort((a, b) => comparePotrero(a.label, b.label))];
}

function filteredIrrigationCalicatas(blocks, monthPrefix) {
  const visibleKeys = new Set(blocks.map((block) => calicataBlockKey(block.potrero, block.block)));
  return (state.calicatas || [])
    .filter((item) => visibleKeys.has(calicataBlockKey(item.potrero, item.block)))
    .filter((item) => irrigationCalicataBlockFilter === "Todos" || calicataBlockKey(item.potrero, item.block) === irrigationCalicataBlockFilter)
    .filter((item) => calicataMonthMatches(item, monthPrefix))
    .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
}

function calicataDepthList(item) {
  return [
    ["20", item.depth20],
    ["40", item.depth40],
    ["60", item.depth60],
    ["80", item.depth80]
  ].map(([depth, value]) => `${depth}: ${value === null || value === undefined || value === "" ? "-" : number(value)}`).join(" / ");
}

function irrigationStationLabel(value) {
  const clean = String(value || "").trim();
  return clean || "Sin estacion";
}

function irrigationEvaporationRowsForMonth(monthPrefix, station = "Todas") {
  return (state.irrigationEvaporation || []).filter((item) => {
    const dateOk = String(item.date || "").slice(0, 7) === monthPrefix;
    const stationOk = station === "Todas" || irrigationStationLabel(item.station) === station;
    return dateOk && stationOk;
  });
}

function irrigationEvaporationRowsForMonthName(month, station = "Todas") {
  return (state.irrigationEvaporation || []).filter((item) => {
    const dateOk = String(item.date || "").slice(5, 7) === month;
    const stationOk = station === "Todas" || irrigationStationLabel(item.station) === station;
    return dateOk && stationOk;
  });
}

function evaporationByDateMap(rows = state.irrigationEvaporation || []) {
  const map = new Map();
  const buckets = new Map();
  (rows || []).forEach((item) => {
    const value = Number(item.evaporation);
    if (!item.date || !Number.isFinite(value)) return;
    const bucket = buckets.get(item.date) || { sum: 0, count: 0, stations: new Set() };
    bucket.sum += value;
    bucket.count += 1;
    bucket.stations.add(irrigationStationLabel(item.station));
    buckets.set(item.date, bucket);
  });
  buckets.forEach((bucket, date) => {
    map.set(date, {
      date,
      evaporation: bucket.sum / bucket.count,
      station: [...bucket.stations].join(", "),
      count: bucket.count
    });
  });
  return map;
}

function historicalEvaporationByMonthDay(month, station = "Todas") {
  const buckets = new Map();
  irrigationEvaporationRowsForMonthName(month, station).forEach((item) => {
    const date = String(item.date || "");
    const value = Number(item.evaporation);
    if (!date || date.slice(5, 7) !== month || !Number.isFinite(value)) return;
    const day = date.slice(8, 10);
    const bucket = buckets.get(day) || { sum: 0, count: 0 };
    bucket.sum += value;
    bucket.count += 1;
    buckets.set(day, bucket);
  });
  const averages = new Map();
  buckets.forEach((bucket, day) => {
    if (bucket.count) averages.set(day, bucket.sum / bucket.count);
  });
  return averages;
}

function irrigationBandejaLabel(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? number(numeric, 1) : "-";
}

function irrigationReposicion(totalHours, precipitation, monthEvaporationTotal) {
  const hours = Number(totalHours);
  const precip = Number(precipitation);
  const bandeja = Number(monthEvaporationTotal);
  if (!Number.isFinite(hours) || !Number.isFinite(precip) || !Number.isFinite(bandeja) || bandeja <= 0) return null;
  return hours * precip / bandeja;
}

function irrigationReposicionLabel(value) {
  return value === null ? "-" : `${number(value * 100, 1)}%`;
}

function irrigationDifferencePercent(realValue, programValue) {
  const real = Number(realValue) || 0;
  const program = Number(programValue) || 0;
  if (program > 0) return (real - program) / program;
  if (real === 0) return 0;
  return null;
}

function irrigationDifferenceLabel(value) {
  if (value === null) return "-";
  const percent = value * 100;
  const sign = percent > 0 ? "+" : "";
  return `${sign}${number(percent, 1)}%`;
}

function irrigationDifferenceClass(value) {
  if (value === null) return "is-empty";
  if (value > 0.005) return "is-over";
  if (value < -0.005) return "is-under";
  return "is-even";
}

function irrigationBlockMonthTotal(source, blockId, monthPrefix, daysInMonth) {
  return Array.from({ length: daysInMonth }, (_, index) => {
    const date = `${monthPrefix}-${String(index + 1).padStart(2, "0")}`;
    return Number(source[irrigationKey(blockId, date)]) || 0;
  }).reduce((sum, value) => sum + value, 0);
}

function irrigationSourceHours(source, blockId, date) {
  return Number(source[irrigationKey(blockId, date)]) || 0;
}

function irrigationBlockDayBalance(block, date) {
  const programHours = irrigationSourceHours(irrigationProgramHours, block.id, date);
  const realHours = irrigationSourceHours(irrigationHours, block.id, date);
  const programVolume = irrigationVolume(programHours, block.flow);
  const realVolume = irrigationVolume(realHours, block.flow);
  return {
    programHours,
    realHours,
    programVolume,
    realVolume,
    difference: realVolume - programVolume,
    differencePercent: irrigationDifferencePercent(realVolume, programVolume)
  };
}

function irrigationMonthDates(monthPrefix, daysInMonth) {
  return Array.from({ length: daysInMonth }, (_, index) => `${monthPrefix}-${String(index + 1).padStart(2, "0")}`);
}

function irrigationBalanceDailyRows(blocks, monthPrefix, daysInMonth) {
  return irrigationMonthDates(monthPrefix, daysInMonth).map((date) => {
    const totals = blocks.reduce((acc, block) => {
      const day = irrigationBlockDayBalance(block, date);
      acc.programHours += day.programHours;
      acc.realHours += day.realHours;
      acc.programVolume += day.programVolume;
      acc.realVolume += day.realVolume;
      return acc;
    }, { date, programHours: 0, realHours: 0, programVolume: 0, realVolume: 0 });
    totals.difference = totals.realVolume - totals.programVolume;
    totals.differencePercent = irrigationDifferencePercent(totals.realVolume, totals.programVolume);
    return totals;
  });
}

function irrigationBalanceBlockRows(blocks, monthPrefix, daysInMonth) {
  return blocks.map((block) => {
    const totals = irrigationMonthDates(monthPrefix, daysInMonth).reduce((acc, date) => {
      const day = irrigationBlockDayBalance(block, date);
      acc.programHours += day.programHours;
      acc.realHours += day.realHours;
      acc.programVolume += day.programVolume;
      acc.realVolume += day.realVolume;
      return acc;
    }, {
      block,
      programHours: 0,
      realHours: 0,
      programVolume: 0,
      realVolume: 0
    });
    totals.difference = totals.realVolume - totals.programVolume;
    totals.differencePercent = irrigationDifferencePercent(totals.realVolume, totals.programVolume);
    return totals;
  }).sort((a, b) => blockSort(a.block, b.block));
}

function irrigationBalancePotreroRows(blockRows) {
  return Object.values(blockRows.reduce((acc, row) => {
    const potrero = row.block.potrero || "Sin potrero";
    acc[potrero] ||= {
      potrero,
      programHours: 0,
      realHours: 0,
      programVolume: 0,
      realVolume: 0,
      blocks: 0
    };
    acc[potrero].programHours += row.programHours;
    acc[potrero].realHours += row.realHours;
    acc[potrero].programVolume += row.programVolume;
    acc[potrero].realVolume += row.realVolume;
    acc[potrero].blocks += 1;
    return acc;
  }, {})).map((row) => ({
    ...row,
    difference: row.realVolume - row.programVolume,
    differencePercent: irrigationDifferencePercent(row.realVolume, row.programVolume)
  })).sort((a, b) => comparePotrero(a.potrero, b.potrero));
}

function irrigationBandejaRows(monthPrefix, daysInMonth, evaporationMap, historicalEvaporationMap) {
  return irrigationMonthDates(monthPrefix, daysInMonth).map((date) => {
    const day = date.slice(8, 10);
    const real = evaporationMap.get(date)?.evaporation;
    const historical = historicalEvaporationMap.get(day);
    return {
      date,
      day: Number(day),
      real: Number.isFinite(Number(real)) ? Number(real) : null,
      historical: Number.isFinite(Number(historical)) ? Number(historical) : null,
      difference: Number.isFinite(Number(real)) && Number.isFinite(Number(historical)) ? Number(real) - Number(historical) : null
    };
  });
}

function irrigationStationBandejaRows(monthPrefix) {
  const rows = irrigationEvaporationRowsForMonth(monthPrefix);
  const overallAverage = irrigationAverage(rows.map((item) => item.evaporation));
  const grouped = rows.reduce((acc, item) => {
    const station = irrigationStationLabel(item.station);
    const value = Number(item.evaporation);
    if (!Number.isFinite(value)) return acc;
    acc[station] ||= { station, sum: 0, count: 0 };
    acc[station].sum += value;
    acc[station].count += 1;
    return acc;
  }, {});
  return Object.values(grouped).map((row) => {
    const averageValue = row.count ? row.sum / row.count : null;
    return {
      station: row.station,
      average: averageValue,
      total: row.sum,
      count: row.count,
      difference: averageValue === null || overallAverage === null ? null : averageValue - overallAverage,
      differencePercent: irrigationDifferencePercent(averageValue, overallAverage)
    };
  }).sort((a, b) => Math.abs(b.difference || 0) - Math.abs(a.difference || 0));
}

function irrigationBandejaDailyChart(rows) {
  const max = Math.max(...rows.flatMap((row) => [row.real || 0, row.historical || 0]), 1);
  return `
    <div class="irrigation-bandeja-chart" aria-label="Bandeja diaria contra historico">
      ${rows.map((row) => {
        const realHeight = Math.max(2, (Number(row.real) || 0) / max * 100);
        const historicalHeight = Math.max(2, (Number(row.historical) || 0) / max * 100);
        return `
          <div class="irrigation-bandeja-day" title="${row.date}: bandeja ${irrigationBandejaLabel(row.real)}, historico ${irrigationBandejaLabel(row.historical)}">
            <div>
              <i class="real" style="height:${realHeight}%"><em>${irrigationBandejaLabel(row.real)}</em></i>
              <i class="historical" style="height:${historicalHeight}%"><em>${irrigationBandejaLabel(row.historical)}</em></i>
            </div>
            <span>${row.day}</span>
          </div>
        `;
      }).join("")}
    </div>
    <div class="irrigation-chart-legend">
      <span><i class="real"></i> Bandeja</span>
      <span><i class="historical"></i> Historico</span>
    </div>
  `;
}

function irrigationAverage(values) {
  const valid = values.map(Number).filter((value) => Number.isFinite(value));
  return valid.length ? valid.reduce((sum, value) => sum + value, 0) / valid.length : null;
}

function irrigationVolumeLabel(value) {
  return `${number(Number(value) || 0, 0)} m3`;
}

function updateIrrigationComparisonCells(blockId, daysInMonth, monthPrefix, historicalEvaporationTotal, monthEvaporationTotal) {
  const block = state.blocks.find((item) => item.id === blockId);
  if (!block) return;
  const programTotal = irrigationBlockMonthTotal(irrigationProgramHours, blockId, monthPrefix, daysInMonth);
  const realTotal = irrigationBlockMonthTotal(irrigationHours, blockId, monthPrefix, daysInMonth);
  const programReposition = irrigationReposicion(programTotal, block.precipitation, historicalEvaporationTotal);
  const realReposition = irrigationReposicion(realTotal, block.precipitation, monthEvaporationTotal);
  const hoursDiff = irrigationDifferencePercent(realTotal, programTotal);
  const repositionDiff = irrigationDifferencePercent(realReposition, programReposition);
  const hoursCell = views.irrigation?.querySelector(`[data-block-hours-diff="${CSS.escape(blockId)}"]`);
  const repositionCell = views.irrigation?.querySelector(`[data-block-reposition-diff="${CSS.escape(blockId)}"]`);
  if (hoursCell) {
    hoursCell.textContent = irrigationDifferenceLabel(hoursDiff);
    hoursCell.className = `irrigation-difference irrigation-difference-hours ${irrigationDifferenceClass(hoursDiff)}`;
    hoursCell.title = `Horas reales ${number(realTotal)} vs programa ${number(programTotal)}`;
  }
  if (repositionCell) {
    repositionCell.textContent = irrigationDifferenceLabel(repositionDiff);
    repositionCell.className = `irrigation-difference irrigation-difference-reposition ${irrigationDifferenceClass(repositionDiff)}`;
    repositionCell.title = `Reposicion real ${irrigationReposicionLabel(realReposition)} vs programa ${irrigationReposicionLabel(programReposition)}`;
  }
}

function selectHistoricalPriorityDays({ daysInMonth, startDay, eventCount, skipDays, historicalMap }) {
  const candidates = Array.from({ length: Math.max(0, daysInMonth - startDay + 1) }, (_, index) => {
    const day = startDay + index;
    const value = Number(historicalMap.get(String(day).padStart(2, "0")));
    return { day, value };
  }).filter((item) => Number.isFinite(item.value) && item.value > 0);
  const sortedValues = candidates.map((item) => item.value).sort((a, b) => a - b);
  const hasMeaningfulRange = sortedValues.length >= 5 && sortedValues.at(-1) - sortedValues[0] > 0.05;
  const lowCutoff = hasMeaningfulRange ? sortedValues[Math.floor((sortedValues.length - 1) * 0.2)] : null;
  const manualInterval = Number.isFinite(skipDays) && skipDays >= 0;
  const requestedEvents = Math.max(0, Math.floor(eventCount));
  const availableDays = Math.max(0, daysInMonth - startDay + 1);
  const possibleEvents = Math.min(requestedEvents, availableDays);
  let interval = manualInterval
    ? Math.max(1, Math.floor(skipDays) + 1)
    : possibleEvents <= 1 ? 1 : Math.max(1, Math.floor((daysInMonth - startDay) / (possibleEvents - 1)));
  const theoreticalDays = [];
  if (manualInterval) {
    for (let day = startDay; day <= daysInMonth && theoreticalDays.length < requestedEvents; day += interval) {
      theoreticalDays.push(day);
    }
  } else if (possibleEvents === 1) {
    theoreticalDays.push(startDay);
  } else if (possibleEvents > 1) {
    const span = daysInMonth - startDay;
    for (let index = 0; index < possibleEvents; index += 1) {
      theoreticalDays.push(startDay + Math.floor(index * span / (possibleEvents - 1)));
    }
  }

  const valuesByDay = new Map(candidates.map((item) => [item.day, item.value]));
  const windowRadius = theoreticalDays.length <= 1 ? Math.min(2, Math.max(0, daysInMonth - startDay)) : interval >= 10 ? 2 : interval >= 3 ? 1 : 0;
  let skippedLowDays = 0;
  let adjustedEvents = 0;
  const selected = theoreticalDays.map((targetDay, index) => {
    const previousTarget = theoreticalDays[index - 1];
    const nextTarget = theoreticalDays[index + 1];
    const segmentStart = previousTarget === undefined ? startDay : Math.floor((previousTarget + targetDay) / 2) + 1;
    const segmentEnd = nextTarget === undefined ? daysInMonth : Math.floor((targetDay + nextTarget) / 2);
    const from = Math.max(startDay, segmentStart, targetDay - windowRadius);
    const to = Math.min(daysInMonth, segmentEnd, targetDay + windowRadius);
    const targetValue = valuesByDay.get(targetDay);
    const targetIsLow = lowCutoff !== null && Number.isFinite(targetValue) && targetValue <= lowCutoff;
    const targetHasNoHistory = !Number.isFinite(targetValue);
    if ((!targetIsLow && !targetHasNoHistory) || windowRadius === 0) return targetDay;

    const nearbyHighDays = [];
    for (let day = from; day <= to; day += 1) {
      const value = valuesByDay.get(day);
      if (!Number.isFinite(value)) continue;
      if (lowCutoff !== null && value <= lowCutoff) continue;
      nearbyHighDays.push({ day, value, distance: Math.abs(day - targetDay) });
    }
    nearbyHighDays.sort((a, b) => b.value - a.value || a.distance - b.distance || a.day - b.day);
    const chosenDay = nearbyHighDays[0]?.day ?? targetDay;
    if (chosenDay !== targetDay) {
      adjustedEvents += 1;
      if (targetIsLow) skippedLowDays += 1;
    }
    return chosenDay;
  });

  return {
    days: [...selected].sort((a, b) => a - b),
    theoreticalDays,
    availableHistoricalDays: candidates.length,
    eligibleHighDays: lowCutoff === null ? candidates.length : candidates.filter((item) => item.value > lowCutoff).length,
    skippedLowDays,
    adjustedEvents,
    lowCutoff,
    windowRadius,
    interval,
    manualInterval
  };
}

function automaticIrrigationBlockPlan({ block, daysInMonth, historicalMap, historicalTotal, hoursPerEvent, targetRepos, skipDays, startDay }) {
  const precipitation = Number(block.precipitation);
  if (!Number.isFinite(precipitation) || precipitation <= 0) {
    return { block, error: "el bloque no tiene precipitacion valida" };
  }
  if (!Number.isFinite(historicalTotal) || historicalTotal <= 0) {
    return { block, error: "no hay bandeja historica para el mes" };
  }
  const repositionPerEvent = hoursPerEvent * precipitation / historicalTotal * 100;
  if (!Number.isFinite(repositionPerEvent) || repositionPerEvent <= 0) {
    return { block, error: "no se pudo calcular el aporte de cada riego" };
  }
  const requiredEvents = Math.max(1, Math.ceil(targetRepos / repositionPerEvent - 1e-9));
  const selection = selectHistoricalPriorityDays({ daysInMonth, startDay, eventCount: requiredEvents, skipDays, historicalMap });
  const achievedRepos = selection.days.length * repositionPerEvent;
  const difference = achievedRepos - targetRepos;
  let warning = "";
  if (selection.days.length < requiredEvents) {
    const causes = [];
    if (startDay > 1) causes.push(`el programa comienza el dia ${startDay}`);
    if (selection.manualInterval && selection.interval > 1) causes.push(`la frecuencia de ${selection.interval} dias no permite mas eventos antes de terminar el mes`);
    if (selection.availableHistoricalDays === 0) causes.push("no hay valores historicos diarios desde la fecha de inicio");
    warning = `Bloque ${block.block || "-"}: no se pudo llegar a ${number(targetRepos, 1)}% porque ${causes.join(", ") || "no existen suficientes dias elegibles"}. Se logro ${number(achievedRepos, 1)}%.`;
  } else if (difference > 0.5) {
    warning = `Bloque ${block.block || "-"}: no se pudo llegar exactamente a ${number(targetRepos, 1)}% porque cada riego de ${number(hoursPerEvent, 1)} h agrega ${number(repositionPerEvent, 1)}%. Para no quedar bajo el objetivo se programaron ${requiredEvents} riegos y por eso se paso a ${number(achievedRepos, 1)}%.`;
  }
  return {
    block,
    days: selection.days,
    requiredEvents,
    achievedRepos,
    repositionPerEvent,
    warning,
    ...selection
  };
}

function applyAutomaticIrrigationProgram({ blocks, daysInMonth, monthPrefix, historicalEvaporationMap, historicalEvaporationTotal, monthEvaporationTotal }) {
  const hoursInput = document.getElementById("programAutoHours");
  const reposInput = document.getElementById("programAutoReposicion");
  const skipInput = document.getElementById("programAutoSkipDays");
  const startInput = document.getElementById("programAutoStartDate");
  const hoursPerEvent = Number(hoursInput?.value);
  const targetRepos = Number(reposInput?.value);
  const skipText = String(skipInput?.value || "").trim();
  const skipDays = skipText === "" ? NaN : Number(skipText);
  const startDate = String(startInput?.value || `${monthPrefix}-01`);
  const startDay = Number(startDate.slice(8, 10));
  if (!Number.isFinite(hoursPerEvent) || hoursPerEvent <= 0) {
    showToast("Ingresa horas por riego validas");
    return;
  }
  if (!Number.isFinite(targetRepos) || targetRepos <= 0) {
    showToast("Ingresa reposicion objetivo");
    return;
  }
  if (!startDate.startsWith(`${monthPrefix}-`) || !Number.isInteger(startDay) || startDay < 1 || startDay > daysInMonth) {
    showToast("Selecciona una fecha de inicio dentro del mes");
    return;
  }
  const selectedIds = new Set([...document.querySelectorAll("[data-program-auto-block]:checked")].map((input) => input.dataset.programAutoBlock));
  const targetBlocks = blocks.filter((block) => selectedIds.has(block.id));
  if (!targetBlocks.length) {
    showToast("Selecciona al menos un bloque");
    return;
  }
  const plans = targetBlocks.map((block) => automaticIrrigationBlockPlan({
    block,
    daysInMonth,
    historicalMap: historicalEvaporationMap,
    historicalTotal: historicalEvaporationTotal,
    hoursPerEvent,
    targetRepos,
    skipDays,
    startDay
  }));
  plans.forEach((plan) => {
    if (plan.error) return;
    const block = plan.block;
    for (let index = 1; index <= daysInMonth; index += 1) {
      const date = `${monthPrefix}-${String(index).padStart(2, "0")}`;
      const key = irrigationKey(block.id, date);
      if (plan.days.includes(index)) {
        irrigationProgramHours[key] = hoursPerEvent;
        setIrrigationCellAudit("program", block.id, date);
        scheduleIrrigationProgramCellSave(block.id, date, hoursPerEvent);
      } else {
        const hadValue = irrigationProgramHours[key] !== undefined || irrigationProgramAudit[key] !== undefined;
        delete irrigationProgramHours[key];
        clearIrrigationCellAudit("program", block.id, date);
        if (hadValue) scheduleIrrigationProgramCellSave(block.id, date, "");
      }
    }
    updateIrrigationComparisonCells(block.id, daysInMonth, monthPrefix, historicalEvaporationTotal, monthEvaporationTotal);
  });
  saveIrrigationProgramHours();
  saveIrrigationProgramAudit();
  document.getElementById("irrigationProgramDialog")?.close();
  renderIrrigation();
  const warnings = plans.map((plan) => plan.warning || (plan.error ? `Bloque ${plan.block.block || "-"}: ${plan.error}.` : "")).filter(Boolean);
  showToast(warnings.length ? "Programa generado con alerta" : "Programa generado");
  if (warnings.length) setTimeout(() => window.alert(`Alerta del programa de riego\n\n${warnings.join("\n\n")}`), 0);
}

function irrigationVisibleBlocksForProgramDialog() {
  return [...state.blocks]
    .filter((block) => block.active !== false)
    .filter((block) => irrigationSpeciesFilter === "Todas" || block.crop === irrigationSpeciesFilter)
    .sort(blockSort);
}

function renderProgramDialogBlockOptions(blocks, selectedPotrero) {
  const filtered = blocks.filter((block) => block.potrero === selectedPotrero);
  return filtered.map((block) => `
    <label class="program-block-chip" title="${htmlAttr(`${block.potrero} bloque ${block.block}`)}">
      <input type="checkbox" data-program-auto-block="${htmlAttr(block.id)}" checked>
      <span>${escapeHtml(block.block || "-")}</span>
      <small>${number(block.hectares)} ha</small>
    </label>
  `).join("") || `<span class="empty">Sin bloques para este potrero.</span>`;
}

function openIrrigationProgramDialog() {
  const dialog = document.getElementById("irrigationProgramDialog");
  if (!dialog) return;
  const blocks = irrigationVisibleBlocksForProgramDialog();
  const potreros = [...new Set(blocks.map((block) => block.potrero).filter(Boolean))].sort(comparePotrero);
  const selectedPotrero = irrigationPotreroFilter !== "Todos" && potreros.includes(irrigationPotreroFilter) ? irrigationPotreroFilter : potreros[0] || "";
  const monthPrefix = `${irrigationYear}-${irrigationMonth}`;
  const daysInMonth = new Date(Number(irrigationYear), Number(irrigationMonth), 0).getDate();
  const firstDate = `${monthPrefix}-01`;
  const lastDate = `${monthPrefix}-${String(daysInMonth).padStart(2, "0")}`;
  dialog.innerHTML = `
    <form method="dialog" class="dialog-card irrigation-program-dialog">
      <div class="dialog-header">
        <div>
          <h3>Programa automatico</h3>
          <p>${monthOptions().find((month) => month.value === irrigationMonth)?.label || irrigationMonth} ${irrigationYear}</p>
        </div>
        <button class="icon-button" type="button" data-action="close-dialog">x</button>
      </div>
      <div class="program-dialog-summary">
        <span>Respeta la frecuencia y mueve cada riego solo a una evaporacion alta cercana cuando la fecha teorica es baja.</span>
      </div>
      <div class="irrigation-program-tool-controls">
        <label>Potrero
          <select id="programAutoPotrero">
            ${potreros.map((potrero) => `<option value="${htmlAttr(potrero)}" ${potrero === selectedPotrero ? "selected" : ""}>${escapeHtml(potrero)}</option>`).join("")}
          </select>
        </label>
        <label>Fecha de inicio
          <input id="programAutoStartDate" type="date" min="${firstDate}" max="${lastDate}" value="${firstDate}">
        </label>
        <label>Horas por riego
          <input id="programAutoHours" type="number" min="0" step="0.5" inputmode="decimal" value="5">
        </label>
        <label>Reposicion objetivo %
          <input id="programAutoReposicion" type="number" min="0" step="1" inputmode="decimal" placeholder="Ej. 65">
        </label>
        <label>Dias a saltar
          <input id="programAutoSkipDays" type="number" min="0" step="1" inputmode="numeric" placeholder="Auto">
        </label>
      </div>
      <div>
        <strong class="dialog-section-label">Bloques</strong>
        <div id="programAutoBlocks" class="irrigation-program-blocks irrigation-program-blocks-dialog">
          ${renderProgramDialogBlockOptions(blocks, selectedPotrero)}
        </div>
      </div>
      <div id="programAutoPreview" class="program-auto-preview">
        <span>Completa horas, reposicion y bloques para ver la distribucion.</span>
      </div>
      <div class="dialog-actions">
        <button class="secondary-button" type="button" data-action="close-dialog">Cancelar</button>
        <button class="primary-button" type="button" data-action="apply-irrigation-program-auto">Aplicar programa</button>
      </div>
    </form>
  `;
  dialog.showModal();
  updateIrrigationProgramDialogPreview();
}

function updateIrrigationProgramDialogBlocks() {
  const container = document.getElementById("programAutoBlocks");
  const potrero = document.getElementById("programAutoPotrero")?.value || "";
  if (!container) return;
  container.innerHTML = renderProgramDialogBlockOptions(irrigationVisibleBlocksForProgramDialog(), potrero);
  updateIrrigationProgramDialogPreview();
}

function updateIrrigationProgramDialogPreview() {
  const preview = document.getElementById("programAutoPreview");
  if (!preview) return;
  const hours = Number(document.getElementById("programAutoHours")?.value);
  const targetRepos = Number(document.getElementById("programAutoReposicion")?.value);
  const skipText = String(document.getElementById("programAutoSkipDays")?.value || "").trim();
  const skipDays = skipText === "" ? NaN : Number(skipText);
  const startDate = String(document.getElementById("programAutoStartDate")?.value || "");
  const selectedIds = new Set([...document.querySelectorAll("[data-program-auto-block]:checked")].map((input) => input.dataset.programAutoBlock));
  const blocks = irrigationVisibleBlocksForProgramDialog().filter((block) => selectedIds.has(block.id));
  const daysInMonth = new Date(Number(irrigationYear), Number(irrigationMonth), 0).getDate();
  const historicalMap = historicalEvaporationByMonthDay(irrigationMonth);
  const historicalTotal = Array.from({ length: daysInMonth }, (_, index) => {
    const day = String(index + 1).padStart(2, "0");
    return Number(historicalMap.get(day)) || 0;
  }).reduce((sum, value) => sum + value, 0);
  const monthPrefix = `${irrigationYear}-${irrigationMonth}`;
  const startDay = Number(startDate.slice(8, 10));
  if (!Number.isFinite(hours) || hours <= 0 || !Number.isFinite(targetRepos) || targetRepos <= 0 || !blocks.length || historicalTotal <= 0 || !startDate.startsWith(`${monthPrefix}-`) || !Number.isInteger(startDay)) {
    preview.innerHTML = `<span>Completa horas, reposicion y bloques para ver la distribucion.</span>`;
    return;
  }
  const rows = blocks.slice(0, 4).map((block) => {
    const plan = automaticIrrigationBlockPlan({
      block,
      daysInMonth,
      historicalMap,
      historicalTotal,
      hoursPerEvent: hours,
      targetRepos,
      skipDays,
      startDay
    });
    if (plan.error) return `<span class="is-warning">Bloque ${escapeHtml(block.block || "-")}: ${escapeHtml(plan.error)}</span>`;
    return `<span class="${plan.warning ? "is-warning" : ""}"><strong>Bloque ${escapeHtml(block.block || "-")}</strong> · dias ${plan.days.join(", ") || "-"} · repos. ${number(plan.achievedRepos, 1)}%${plan.adjustedEvents ? ` · ${plan.adjustedEvents} ajuste${plan.adjustedEvents === 1 ? "" : "s"} por evaporacion` : ""}</span>`;
  });
  const extra = blocks.length > 4 ? `<span>+${blocks.length - 4} bloques mas con el mismo criterio</span>` : "";
  preview.innerHTML = `${rows.join("")}${extra}`;
}

function focusIrrigationCellFromKeyboard(input, key) {
  const gridKind = input.dataset.gridKind;
  const row = Number(input.dataset.rowIndex);
  const day = Number(input.dataset.dayIndex);
  if (!gridKind || !Number.isFinite(row) || !Number.isFinite(day)) return false;
  const next = { row, day };
  if (key === "ArrowLeft") next.day -= 1;
  else if (key === "ArrowRight") next.day += 1;
  else if (key === "ArrowUp") next.row -= 1;
  else if (key === "ArrowDown") next.row += 1;
  else return false;
  const selector = `.irrigation-hour-input[data-grid-kind="${CSS.escape(gridKind)}"][data-row-index="${next.row}"][data-day-index="${next.day}"]`;
  const target = views.irrigation?.querySelector(selector);
  if (!target) return true;
  target.focus({ preventScroll: false });
  target.select?.();
  return true;
}

function irrigationBandejaDataYears() {
  return [...new Set((state.irrigationEvaporation || [])
    .map((item) => Number(String(item.date || "").slice(0, 4)))
    .filter((year) => Number.isInteger(year) && year >= 1900 && year <= 2100))]
    .sort((a, b) => a - b);
}

function irrigationBandejaVisibleYears(focusYear) {
  const dataYears = irrigationBandejaDataYears();
  const focus = Math.min(2100, Math.max(1900, Number(focusYear) || new Date().getFullYear()));
  if (!dataYears.length) return [focus - 1, focus, focus + 1];
  let first = Math.min(dataYears[0], focus - 1);
  let last = Math.max(dataYears.at(-1), focus + 1);
  const maxVisibleYears = 25;
  if (last - first + 1 > maxVisibleYears) {
    last = Math.min(Math.max(dataYears.at(-1), focus + 1), focus + 2);
    first = last - maxVisibleYears + 1;
    if (first > focus - 1) {
      first = focus - 1;
      last = first + maxVisibleYears - 1;
    }
  }
  first = Math.max(1900, first);
  last = Math.min(2100, last);
  return Array.from({ length: last - first + 1 }, (_, index) => first + index);
}

function irrigationBandejaHistoricalDays(month, evaporationMap) {
  const buckets = new Map();
  evaporationMap.forEach((item, date) => {
    if (String(date).slice(5, 7) !== month) return;
    const value = Number(item.evaporation);
    if (!Number.isFinite(value)) return;
    const day = String(date).slice(8, 10);
    const bucket = buckets.get(day) || { sum: 0, count: 0 };
    bucket.sum += value;
    bucket.count += 1;
    buckets.set(day, bucket);
  });
  return new Map([...buckets.entries()].map(([day, bucket]) => [day, {
    average: bucket.count ? bucket.sum / bucket.count : null,
    count: bucket.count
  }]));
}

function irrigationBandejaMonthMatrix(month, years, evaporationMap) {
  const monthName = monthOptions().find((item) => item.value === month)?.label || month;
  const maxDays = new Date(2000, Number(month), 0).getDate();
  const historicalDays = irrigationBandejaHistoricalDays(month, evaporationMap);
  const historicalMonthDays = Array.from(historicalDays.values())
    .map((item) => Number(item.average))
    .filter(Number.isFinite);
  const historicalMonth = historicalMonthDays.length
    ? historicalMonthDays.reduce((sum, value) => sum + value, 0) / historicalMonthDays.length
    : null;
  const accumulators = new Map(years.map((year) => [year, 0]));
  const hasStarted = new Set();
  const totals = new Map(years.map((year) => [year, 0]));
  const counts = new Map(years.map((year) => [year, 0]));
  const rows = Array.from({ length: maxDays }, (_, index) => {
    const day = index + 1;
    const dayText = String(day).padStart(2, "0");
    const historical = historicalDays.get(dayText);
    const yearCells = years.map((year) => {
      const validDay = day <= new Date(year, Number(month), 0).getDate();
      if (!validDay) {
        return `<td class="bandeja-date is-unavailable">-</td><td class="bandeja-value is-unavailable">-</td><td class="bandeja-accum is-unavailable">-</td>`;
      }
      const date = `${year}-${month}-${dayText}`;
      const rawValue = evaporationMap.get(date)?.evaporation;
      const hasValue = rawValue !== null && rawValue !== undefined && Number.isFinite(Number(rawValue));
      if (hasValue) {
        accumulators.set(year, accumulators.get(year) + Number(rawValue));
        totals.set(year, totals.get(year) + Number(rawValue));
        counts.set(year, counts.get(year) + 1);
        hasStarted.add(year);
      }
      const focusClass = String(year) === String(irrigationYear) ? " is-focus-year" : "";
      const carriedClass = !hasValue && hasStarted.has(year) ? " is-carried" : "";
      return `
        <td class="bandeja-date${focusClass}">${dayText}-${month}-${String(year).slice(-2)}</td>
        <td class="bandeja-value${focusClass} ${hasValue ? "has-value" : ""}">${hasValue ? irrigationBandejaLabel(rawValue) : "-"}</td>
        <td class="bandeja-accum${focusClass}${carriedClass}">${hasStarted.has(year) ? irrigationBandejaLabel(accumulators.get(year)) : "-"}</td>
      `;
    }).join("");
    return `
      <tr>
        <th class="bandeja-day" scope="row">${day}</th>
        ${yearCells}
        <td class="bandeja-historical" title="${historical ? `Promedio de ${historical.count} anos` : "Sin registros historicos"}">${historical ? irrigationBandejaLabel(historical.average) : "-"}</td>
      </tr>`;
  }).join("");
  const footerCells = years.map((year) => {
    const total = totals.get(year);
    const count = counts.get(year);
    const average = count ? total / count : null;
    const focusClass = String(year) === String(irrigationYear) ? " is-focus-year" : "";
    return `<td class="bandeja-date${focusClass}">Total mes</td><td class="bandeja-value${focusClass}" title="Promedio de ${count} dia${count === 1 ? "" : "s"}">${count ? irrigationBandejaLabel(average) : "-"}</td><td class="bandeja-accum${focusClass}">${count ? irrigationBandejaLabel(total) : "-"}</td>`;
  }).join("");
  return `
    <section class="irrigation-bandeja-month" data-bandeja-month="${month}">
      <table class="irrigation-bandeja-matrix-table" style="--bandeja-years:${years.length}">
        <colgroup>
          <col class="bandeja-col-day">
          ${years.map(() => '<col class="bandeja-col-date"><col class="bandeja-col-value"><col class="bandeja-col-accum">').join("")}
          <col class="bandeja-col-historical">
        </colgroup>
        <thead>
          <tr class="bandeja-month-heading">
            <th class="bandeja-month-fixed" colspan="4"><div><strong>${monthName}</strong><span>Prom. hist. mes ${historicalMonth === null ? "-" : irrigationBandejaLabel(historicalMonth)}</span></div></th>
            <th class="bandeja-month-fill" colspan="${years.length * 3 - 2}" aria-hidden="true"></th>
          </tr>
          <tr class="bandeja-year-heading">
            <th rowspan="2" class="bandeja-day">Dia</th>
            ${years.map((year) => `<th colspan="3" data-bandeja-year="${year}" class="${String(year) === String(irrigationYear) ? "is-focus-year" : ""}">${year}</th>`).join("")}
            <th rowspan="2" class="bandeja-historical">Prom. hist.<small>por dia</small></th>
          </tr>
          <tr class="bandeja-fields-heading">
            ${years.map((year) => {
              const focusClass = String(year) === String(irrigationYear) ? " class=\"is-focus-year\"" : "";
              return `<th${focusClass}>Fecha</th><th${focusClass}>Evap.</th><th${focusClass}>Acum.</th>`;
            }).join("")}
          </tr>
        </thead>
        <tbody>${rows}</tbody>
        <tfoot><tr><th class="bandeja-day">Mes</th>${footerCells}<td class="bandeja-historical"><strong>${irrigationBandejaLabel(historicalMonth)}</strong><small>Prom. hist. mes</small></td></tr></tfoot>
      </table>
    </section>`;
}

function renderIrrigationBandejasPanel({ year }) {
  const focusYear = Number(year) || new Date().getFullYear();
  const years = irrigationBandejaVisibleYears(focusYear);
  const dataYears = irrigationBandejaDataYears();
  const evaporationMap = evaporationByDateMap(state.irrigationEvaporation || []);
  const dates = [...evaporationMap.keys()].sort();
  const defaultDay = Math.min(new Date().getDate(), new Date(focusYear, Number(irrigationMonth), 0).getDate());
  const defaultDate = `${focusYear}-${irrigationMonth}-${String(defaultDay).padStart(2, "0")}`;
  const rangeLabel = dates.length ? `${dates[0]} a ${dates.at(-1)}` : "Sin registros";
  return `
    <div class="irrigation-subpanel irrigation-bandeja-history-panel">
      <section class="panel irrigation-bandeja-entry-panel">
        <form id="irrigationBandejaForm" class="irrigation-bandeja-form">
          <label>Fecha
            <input name="fecha" type="date" required value="${defaultDate}">
          </label>
          <label>Evaporacion
            <input name="evaporacion" type="number" min="0" step="0.01" inputmode="decimal" required placeholder="0.00">
          </label>
          <label>Estacion
            <input name="estacion" type="text" placeholder="Nombre o codigo">
          </label>
          <button class="primary-button" type="button" data-action="save-irrigation-bandeja">Guardar dato</button>
        </form>
      </section>
      <div class="irrigation-bandeja-summary">
        <span><strong>${number(evaporationMap.size, 0)}</strong> dias registrados</span>
        <span><strong>${number(dataYears.length, 0)}</strong> anos con datos</span>
        <span><strong>${escapeHtml(rangeLabel)}</strong> rango disponible</span>
      </div>
      <section class="panel irrigation-bandeja-matrix-panel">
        <div class="irrigation-bandeja-matrix-help">
          <span>Desplaza verticalmente para cambiar de mes.</span>
          <span>Izquierda: anos anteriores · Derecha: anos siguientes.</span>
        </div>
        <div id="irrigationBandejaMatrixScroll" class="irrigation-bandeja-matrix-scroll">
          <div class="irrigation-bandeja-matrix-content">
            ${monthOptions().map((item) => irrigationBandejaMonthMatrix(item.value, years, evaporationMap)).join("")}
          </div>
        </div>
      </section>
    </div>`;
}

function focusIrrigationBandejaMatrix(year = irrigationYear, month = irrigationMonth, behavior = "auto") {
  const scroller = document.getElementById("irrigationBandejaMatrixScroll");
  if (!scroller) return;
  const yearHeader = scroller.querySelector(`[data-bandeja-year="${CSS.escape(String(year))}"]`);
  const monthSection = scroller.querySelector(`[data-bandeja-month="${CSS.escape(String(month))}"]`);
  if (yearHeader) scroller.scrollTo({ left: Math.max(0, yearHeader.offsetLeft - 64), top: scroller.scrollTop, behavior });
  if (monthSection) scroller.scrollTo({ left: scroller.scrollLeft, top: Math.max(0, monthSection.offsetTop - 4), behavior });
}

function wireIrrigationBandejaMatrix() {
  const scroller = document.getElementById("irrigationBandejaMatrixScroll");
  if (!scroller) return;
  requestAnimationFrame(() => {
    if (irrigationBandejaFocusPending) {
      focusIrrigationBandejaMatrix(irrigationYear, irrigationMonth);
      irrigationBandejaFocusPending = false;
    } else {
      scroller.scrollLeft = irrigationBandejaScrollLeft;
      scroller.scrollTop = irrigationBandejaScrollTop;
    }
  });
  scroller.addEventListener("scroll", () => {
    irrigationBandejaScrollLeft = scroller.scrollLeft;
    irrigationBandejaScrollTop = scroller.scrollTop;
  }, { passive: true });
  document.getElementById("irrigationBandejaMonthJump")?.addEventListener("change", (event) => {
    irrigationMonth = event.target.value;
    focusIrrigationBandejaMatrix(irrigationYear, irrigationMonth, "smooth");
  });
}

function irrigationBalanceSelectionLabel(selectedPotreros) {
  if (!selectedPotreros.size) return "Todos";
  if (selectedPotreros.size === 1) return [...selectedPotreros][0];
  return `${selectedPotreros.size} potreros`;
}

function irrigationBalancePotreroChart(rows, selectedPotreros) {
  const visible = rows;
  const max = Math.max(...visible.flatMap((row) => [row.programVolume, row.realVolume]), 1);
  return `
    <div class="irrigation-balance-chart" aria-label="Volumen real contra programa por potrero">
      ${visible.map((row) => {
        const programHeight = Math.max(3, row.programVolume / max * 100);
        const realHeight = Math.max(3, row.realVolume / max * 100);
        const active = selectedPotreros.has(row.potrero);
        return `
          <button class="irrigation-balance-potrero-bar ${active ? "active" : ""}" type="button" data-action="select-irrigation-balance-potrero" data-potrero="${htmlAttr(row.potrero)}" title="${htmlAttr(`${row.potrero}: real ${irrigationVolumeLabel(row.realVolume)} / programa ${irrigationVolumeLabel(row.programVolume)}. Ctrl+clic permite seleccionar varios.`)}">
            <div>
              <i class="program" style="height:${programHeight}%"><em>${number(row.programVolume, 0)}</em></i>
              <i class="real" style="height:${realHeight}%"><em>${number(row.realVolume, 0)}</em></i>
            </div>
            <strong>${escapeHtml(row.potrero)}</strong>
            <span>${irrigationDifferenceLabel(row.differencePercent)}</span>
          </button>
        `;
      }).join("") || `<div class="empty">Sin volumen para el filtro seleccionado.</div>`}
    </div>
    <div class="irrigation-chart-legend">
      <span><i class="program"></i> Deberia llevar</span>
      <span><i class="real"></i> Real</span>
    </div>
  `;
}

function irrigationBalanceBlockChart(rows) {
  const visible = rows;
  const max = Math.max(...visible.flatMap((row) => [row.programVolume, row.realVolume]), 1);
  return `
    <div class="irrigation-balance-block-chart" aria-label="Volumen por bloque">
      ${visible.map((row) => {
        const programHeight = Math.max(3, row.programVolume / max * 100);
        const realHeight = Math.max(3, row.realVolume / max * 100);
        return `
          <div class="irrigation-block-chart-row">
            <div>
              <strong>${escapeHtml(row.block.potrero || "-")} / Bloque ${escapeHtml(row.block.block || "-")}</strong>
              <span>Real ${irrigationVolumeLabel(row.realVolume)} · Prog ${irrigationVolumeLabel(row.programVolume)}</span>
            </div>
            <div class="irrigation-block-chart-bars">
              <i class="program" style="height:${programHeight}%"><em>${number(row.programVolume, 0)}</em></i>
              <i class="real" style="height:${realHeight}%"><em>${number(row.realVolume, 0)}</em></i>
            </div>
            <small>Real ${irrigationVolumeLabel(row.realVolume)} · Prog ${irrigationVolumeLabel(row.programVolume)}</small>
          </div>
        `;
      }).join("") || `<div class="empty">Selecciona otro potrero o revisa programa/riego real.</div>`}
    </div>
  `;
}

function irrigationBalanceVolumeMatrix(rows, monthPrefix, daysInMonth) {
  const sorted = [...rows].sort((a, b) => blockSort(a.block, b.block));
  return `
    <div class="irrigation-balance-matrix" style="--days:${daysInMonth}">
      <div class="irrigation-balance-row irrigation-balance-row-head">
        <div>Potrero / bloque</div>
        <div class="irrigation-balance-days">
          ${Array.from({ length: daysInMonth }, (_, index) => {
            const date = `${monthPrefix}-${String(index + 1).padStart(2, "0")}`;
            return `<b class="${irrigationDayClass(date)}">${index + 1}</b>`;
          }).join("")}
        </div>
        <div>Total real</div>
        <div>Deberia</div>
        <div>Dif.</div>
      </div>
      ${sorted.map((row) => `
        <div class="irrigation-balance-row">
          <div class="irrigation-balance-block-label">
            <strong>${escapeHtml(row.block.potrero || "-")} / ${escapeHtml(row.block.block || "-")}</strong>
            <span>${irrigationBandejaLabel(row.block.flow)} caudal</span>
          </div>
          <div class="irrigation-balance-days">
            ${Array.from({ length: daysInMonth }, (_, index) => {
              const date = `${monthPrefix}-${String(index + 1).padStart(2, "0")}`;
              const day = irrigationBlockDayBalance(row.block, date);
              return `<span class="${irrigationDayClass(date)} ${day.realVolume > 0 ? "has-volume" : ""}" title="${htmlAttr(`${date}: ${irrigationVolumeLabel(day.realVolume)}`)}">${day.realVolume > 0 ? number(day.realVolume, 0) : ""}</span>`;
            }).join("")}
          </div>
          <div class="irrigation-balance-total">${irrigationVolumeLabel(row.realVolume)}</div>
          <div class="irrigation-balance-total">${irrigationVolumeLabel(row.programVolume)}</div>
          <div class="irrigation-diff-pill ${irrigationDifferenceClass(row.differencePercent)}">${irrigationVolumeLabel(row.difference)}</div>
        </div>
      `).join("") || `<div class="empty">No hay bloques para mostrar.</div>`}
    </div>
  `;
}

function renderIrrigationBalancePanel({ blockRows, monthPrefix, daysInMonth, monthLabel, year }) {
  const potreroRows = irrigationBalancePotreroRows(blockRows);
  const potreroOptions = ["Todos", ...potreroRows.map((row) => row.potrero)];
  if (!potreroOptions.includes(irrigationBalancePotreroFilter)) irrigationBalancePotreroFilter = "Todos";
  irrigationBalanceSelectedPotreros = new Set([...irrigationBalanceSelectedPotreros].filter((potrero) => potreroOptions.includes(potrero)));
  if (irrigationBalancePotreroFilter !== "Todos" && !irrigationBalanceSelectedPotreros.size) irrigationBalanceSelectedPotreros.add(irrigationBalancePotreroFilter);
  const selectedPotreros = irrigationBalanceSelectedPotreros;
  const selectedLabel = irrigationBalanceSelectionLabel(selectedPotreros);
  const selectedBlockRows = selectedPotreros.size ? blockRows.filter((row) => selectedPotreros.has(row.block.potrero)) : blockRows;
  const totals = blockRows.reduce((acc, row) => {
    acc.programHours += row.programHours;
    acc.realHours += row.realHours;
    acc.programVolume += row.programVolume;
    acc.realVolume += row.realVolume;
    return acc;
  }, { programHours: 0, realHours: 0, programVolume: 0, realVolume: 0 });
  totals.difference = totals.realVolume - totals.programVolume;
  totals.differencePercent = irrigationDifferencePercent(totals.realVolume, totals.programVolume);
  const selectedTotals = selectedBlockRows.reduce((acc, row) => {
    acc.programVolume += row.programVolume;
    acc.realVolume += row.realVolume;
    acc.blocks += 1;
    return acc;
  }, { programVolume: 0, realVolume: 0, blocks: 0 });
  selectedTotals.difference = selectedTotals.realVolume - selectedTotals.programVolume;
  selectedTotals.differencePercent = irrigationDifferencePercent(selectedTotals.realVolume, selectedTotals.programVolume);
  return `
    <div class="irrigation-subpanel">
      <div class="irrigation-balance-toolbar">
        <div>
          <strong>Balance hidrico</strong>
          <span>${monthLabel} ${year}</span>
        </div>
        <label>Potrero detalle
          <select id="irrigationBalancePotreroFilter">
            ${potreroOptions.map((item) => `<option value="${htmlAttr(item)}" ${item === irrigationBalancePotreroFilter ? "selected" : ""}>${escapeHtml(item)}</option>`).join("")}
          </select>
        </label>
      </div>
      <div class="irrigation-kpis irrigation-kpis-three">
        ${kpi("Deberia llevar", irrigationVolumeLabel(totals.programVolume), `${number(totals.programHours)} hrs programadas`)}
        ${kpi("Volumen real", irrigationVolumeLabel(totals.realVolume), `${number(totals.realHours)} hrs reales`)}
        ${kpi("Diferencia", irrigationVolumeLabel(totals.difference), irrigationDifferenceLabel(totals.differencePercent))}
      </div>
      <div class="irrigation-balance-charts">
        <section class="panel chart-panel">
          <div class="panel-header">
            <div>
              <h2>Volumen por potrero</h2>
            </div>
          </div>
          ${irrigationBalancePotreroChart(potreroRows, selectedPotreros)}
        </section>
        <section class="panel chart-panel">
          <div class="panel-header">
            <div>
              <h2>Bloques ${selectedLabel === "Todos" ? "del filtro" : selectedLabel}</h2>
              <p>${selectedTotals.blocks} bloque${selectedTotals.blocks === 1 ? "" : "s"} · real ${irrigationVolumeLabel(selectedTotals.realVolume)} · deberia ${irrigationVolumeLabel(selectedTotals.programVolume)}</p>
            </div>
          </div>
          ${irrigationBalanceBlockChart(selectedBlockRows)}
        </section>
      </div>
      <section class="panel irrigation-report-panel irrigation-balance-summary-panel">
        <div class="panel-header">
          <div>
            <h2>Resumen mensual de volumen real</h2>
            <p>m3 reales por dia, con total real, deberia llevar y diferencia mensual.</p>
          </div>
        </div>
        ${irrigationBalanceVolumeMatrix(selectedBlockRows, monthPrefix, daysInMonth)}
      </section>
    </div>
  `;
}

function renderIrrigationProgramTool(blocks, monthLabel) {
  return "";
}

function renderIrrigationCalicatasPanel(blocks, monthPrefix, monthLabel, year = irrigationYear) {
  const options = irrigationCalicataOptions(blocks);
  if (!options.some((item) => item.key === irrigationCalicataBlockFilter)) irrigationCalicataBlockFilter = "Todos";
  const records = filteredIrrigationCalicatas(blocks, monthPrefix);
  const mappedRecords = records.filter((item) => Number.isFinite(Number(item.latitude)) && Number.isFinite(Number(item.longitude)));
  return `
    <section class="irrigation-calicatas-panel">
      <div class="irrigation-calicatas-head">
        <div>
          <strong>Calicatas</strong>
          <span>${monthLabel} ${year} · ${records.length} registro${records.length === 1 ? "" : "s"} · ${mappedRecords.length} con ubicacion</span>
        </div>
        <label>Bloque
          <select id="irrigationCalicataBlockFilter">
            ${options.map((item) => `<option value="${htmlAttr(item.key)}" ${item.key === irrigationCalicataBlockFilter ? "selected" : ""}>${escapeHtml(item.label)}</option>`).join("")}
          </select>
        </label>
      </div>
      <div class="irrigation-calicatas-layout">
        <div id="irrigationCalicataMap" class="geo-map irrigation-calicata-map">
          <span>Cargando mapa de calicatas...</span>
        </div>
        <aside class="irrigation-calicata-history" aria-label="Historial de calicatas">
          <div class="irrigation-calicata-history-title">
            <strong>Historial</strong>
            <span>${records.length ? "Ultimos registros filtrados" : "Sin registros para el filtro"}</span>
          </div>
          ${records.slice(0, 14).map((item) => `
            <button class="irrigation-calicata-card" type="button" data-action="focus-calicata" data-calicata-id="${htmlAttr(item.id)}">
              <span>${escapeHtml(calicataDate(item) || "Sin fecha")}</span>
              <strong>${escapeHtml(item.potrero || "-")} · bloque ${escapeHtml(item.block || "-")}</strong>
              <small>${escapeHtml(item.workerName || "Sin trabajador")} · ${escapeHtml(calicataDepthList(item))}</small>
              ${item.observation ? `<em>${escapeHtml(item.observation)}</em>` : ""}
            </button>
          `).join("") || `<div class="empty-state compact-empty"><strong>No hay calicatas en este mes.</strong><p>Cambia potrero, bloque o mes para revisar otros registros.</p></div>`}
        </aside>
      </div>
    </section>
  `;
}

const PALTO_POTRERO_ORDER = [
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "5",
  "6",
  "19",
  "23",
  "Mirador 1",
  "Mirador 2",
  "Los pinos Paltos",
  "Parque 1",
  "Parque 2",
  "Parque 3",
  "Parque 4"
];

function normalizePotreroOrderName(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\s*\/.*$/, "")
    .replace(/\s+bloque\s+.*$/i, "")
    .replace(/^el parque\b/i, "Parque")
    .toLowerCase();
}

function paltoPotreroRank(value) {
  const normalized = normalizePotreroOrderName(value);
  const index = PALTO_POTRERO_ORDER.findIndex((item) => normalizePotreroOrderName(item) === normalized);
  return index >= 0 ? index : null;
}

function comparePotrero(a, b) {
  const paltoA = paltoPotreroRank(a);
  const paltoB = paltoPotreroRank(b);
  if (paltoA !== null && paltoB !== null && paltoA !== paltoB) return paltoA - paltoB;
  return String(a || "").localeCompare(String(b || ""), "es", { numeric: true, sensitivity: "base" });
}

function blockNumber(block) {
  const text = String(block?.block ?? block ?? "");
  const numeric = text.match(/\d+/)?.[0];
  return numeric ? Number(numeric) : Number.POSITIVE_INFINITY;
}

function blockSort(a, b) {
  return comparePotrero(a.potrero, b.potrero)
    || blockNumber(a) - blockNumber(b)
    || String(a.block || "").localeCompare(String(b.block || ""), "es", { numeric: true, sensitivity: "base" });
}

function harvestBinKey(record) {
  return String(record.numBin || record.localCode || record.id || "").trim();
}

function firstHarvestDateValue(item, keys) {
  for (const key of keys) {
    const value = item?.[key];
    const text = value === null || value === undefined ? "" : String(value).trim();
    if (text && text.toLowerCase() !== "null") return text;
  }
  return "";
}

function harvestScanDateFromItem(item) {
  return firstHarvestDateValue(item, [
    "fecha_escaneo",
    "fecha_escaneo_local",
    "fecha_escaneo_cosecha",
    "fecha_recepcion"
  ]);
}

function harvestRecordDate(record) {
  return String(record.scanDate || "").slice(0, 10);
}

function todayChileIso() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Santiago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function harvestRecordStatus(record) {
  return record.type === "tarja_despachada" || record.truckPlate ? "despachado" : "terreno";
}

function uniqueHarvestRecords(records = state.harvestRecords || []) {
  const cacheable = records === state.harvestRecords;
  if (cacheable && harvestUniqueCacheSource === records) return harvestUniqueCache;
  const byBin = new Map();
  records.forEach((record) => {
    const key = harvestBinKey(record);
    if (!key) return;
    const prev = byBin.get(key);
    if (!prev || String(record.scanDate || record.createdAt || "") > String(prev.scanDate || prev.createdAt || "")) byBin.set(key, record);
  });
  const unique = [...byBin.values()];
  if (cacheable) {
    harvestUniqueCacheSource = records;
    harvestUniqueCache = unique;
  }
  return unique;
}

function filteredHarvestRecords(records = state.harvestRecords || []) {
  const cacheable = records === state.harvestRecords;
  const cacheKey = `${harvestDateFromFilter}|${harvestDateToFilter}|${harvestCrewFilter}|${harvestStatusFilter}|${harvestSdpFilter}`;
  if (cacheable && harvestFilteredCacheSource === records && harvestFilteredCacheKey === cacheKey) return harvestFilteredCache;
  const filtered = records.filter((record) => {
    const date = harvestRecordDate(record);
    if (harvestDateFromFilter && (!date || date < harvestDateFromFilter)) return false;
    if (harvestDateToFilter && (!date || date > harvestDateToFilter)) return false;
    if (harvestCrewFilter !== "Todas" && (record.crew || "Sin cuadrilla") !== harvestCrewFilter) return false;
    if (harvestStatusFilter !== "Todos" && harvestRecordStatus(record) !== harvestStatusFilter) return false;
    if (harvestSdpFilter !== "Todos" && (record.sdp || "Sin SDP") !== harvestSdpFilter) return false;
    return true;
  });
  const unique = uniqueHarvestRecords(filtered);
  if (cacheable) {
    harvestFilteredCacheSource = records;
    harvestFilteredCacheKey = cacheKey;
    harvestFilteredCache = unique;
  }
  return unique;
}

function harvestCrewValue(record) {
  return String(record.crew || "").trim() || "Sin cuadrilla";
}

function harvestStats(records = filteredHarvestRecords()) {
  const unique = uniqueHarvestRecords(records);
  const crews = new Set(unique.map(harvestCrewValue).filter(Boolean));
  const contractors = new Set(unique.map((record) => record.contractor || "Sin contratista"));
  const days = new Set(unique.map(harvestRecordDate).filter(Boolean));
  const today = todayChileIso();
  const todayScannedCrews = new Set(uniqueHarvestRecords((state.harvestRecords || []).filter((record) => harvestRecordDate(record) === today)).map(harvestCrewValue).filter(Boolean));
  const scheduledToday = state.harvestCrewSchedule.filter((item) => {
    const date = String(item.date || "").slice(0, 10);
    if (date !== today) return false;
    if (harvestCrewFilter !== "Todas" && (item.crew || "Sin cuadrilla") !== harvestCrewFilter) return false;
    return true;
  });
  const scheduledCrews = new Set(scheduledToday.map((item) => item.crew).filter(Boolean));
  const missingCrews = [...scheduledCrews].filter((crew) => !todayScannedCrews.has(crew));
  return { total: unique.length, crews, contractors, days, scheduledCrews, missingCrews, today, todayScannedCrews };
}

function harvestJornalDate(item) {
  return String(item.date || "").slice(0, 10);
}

function filteredHarvestJornales(items = state.harvestJornales || []) {
  return items.filter((item) => {
    const date = harvestJornalDate(item);
    if (harvestDateFromFilter && (!date || date < harvestDateFromFilter)) return false;
    if (harvestDateToFilter && (!date || date > harvestDateToFilter)) return false;
    if (harvestCrewFilter !== "Todas" && (item.crew || "Sin cuadrilla") !== harvestCrewFilter) return false;
    return true;
  });
}

function harvestBinsPerJornalRows(records = filteredHarvestRecords()) {
  const jornales = filteredHarvestJornales();
  const jornalCounts = new Map();
  jornales.forEach((item) => {
    const key = `${item.contractor || "Sin contratista"}__${item.crew || "Sin cuadrilla"}`;
    jornalCounts.set(key, (jornalCounts.get(key) || 0) + 1);
  });
  const bins = groupCount(records, (record) => `${record.contractor || "Sin contratista"}__${record.crew || "Sin cuadrilla"}`);
  return bins.map((row) => {
    const jornalesCount = jornalCounts.get(row.label) || 0;
    const [contractor, crew] = row.label.split("__");
    return {
      label: `${crew || "Sin cuadrilla"} - ${contractor || "Sin contratista"}`,
      value: jornalesCount ? row.value / jornalesCount : 0,
      detail: `${row.value} bins / ${jornalesCount || 0} jornales`
    };
  }).filter((row) => row.value > 0).sort((a, b) => b.value - a.value || a.label.localeCompare(b.label, "es", { numeric: true }));
}

function classificationOptions(selected) {
  const options = [
    ["", "Seleccionar"],
    ["N", "N - Nebulizacion"],
    ["P", "P - Pulverizacion"],
    ["VR", "VR - Via riego"],
    ["ME", "ME - Maquina espalda"],
    ["VD", "VD - Aereo"],
    ["G", "G - Grench"],
    ["M", "M - Manual"]
  ];
  return options.map(([value, label]) => `<option value="${value}" ${value === selected ? "selected" : ""}>${label}</option>`).join("");
}

function plannedLiters(order) {
  return (Number(order.hectares) || 0) * (Number(order.waterHa) || 0);
}

function appliedLiters(order) {
  return (order.tanks || []).reduce((sum, tank) => sum + (Number(tank.liters) || 0), 0);
}

function dispatchedLiters(order) {
  return (order.dispatches || []).reduce((sum, item) => sum + (item.type === "devolucion" ? -1 : 1) * (Number(item.liters) || 0), 0);
}

function dispatchedProduct(order, productId) {
  return (order.dispatches || []).reduce((sum, item) => {
    const qty = Number(item.products?.[productId]) || 0;
    return sum + (item.type === "devolucion" ? -qty : qty);
  }, 0);
}

function isOrderCompleteByWater(order) {
  const total = plannedLiters(order);
  return total > 0 && dispatchedLiters(order) >= total;
}

function effectiveOrderStatus(order) {
  if (order.status === "cancelled") return "cancelled";
  if (order.finishedByManager || isOrderCompleteByWater(order)) return "closed";
  if (dispatchedLiters(order) > 0 || order.status === "in_progress") return "in_progress";
  if (order.status === "draft") return "draft";
  return "planned";
}

function orderCreatedValue(order) {
  // Usar solo fecha/hora real de creación. No usar fecha de inicio como fallback,
  // porque eso hacía que una orden nueva no siempre subiera arriba si tenía
  // la misma fecha planificada que otras órdenes.
  return order?.createdAt || order?.created_at || order?.creado_en || order?.fecha_creacion || "";
}

function isNewOrder(order) {
  const created = orderCreatedValue(order);
  const createdTime = created ? new Date(created).getTime() : NaN;
  const recentByDate = Number.isFinite(createdTime) && Date.now() - createdTime <= 1000 * 60 * 60 * 24;
  const maxNumber = Math.max(0, ...state.orders.map((item) => Number(item.number) || 0));
  const recentByNumber = !Number.isFinite(createdTime) && maxNumber > 0 && Number(order.number) === maxNumber;
  return recentByDate || recentByNumber;
}

function newOrderMark(order) {
  return isNewOrder(order) ? `<span class="new-order-badge" title="Orden ingresada recientemente">Nuevo</span>` : "";
}

function syncOrderStatus(order) {
  order.status = effectiveOrderStatus(order);
  return order.status;
}

function latestDispatch(order) {
  return [...(order.dispatches || [])].reverse().find((dispatch) => dispatch.type === "salida") || {};
}

function orderDateValue(order) {
  return orderStartDate(order);
}

function orderStartDate(order) {
  // Fecha de inicio es la fuente principal de ordenamiento y filtros.
  // La UI usa fechaInicio; Supabase conserva fecha_planificada/fecha como compatibilidad.
  return (
    order?.fechaInicio ||
    order?.fecha_inicio ||
    order?.plannedDate ||
    order?.fecha_planificada ||
    order?.date ||
    order?.fecha ||
    ""
  );
}

function orderEndDate(order) {
  return order?.endDate || order?.plannedEndDate || orderStartDate(order);
}

function orderOverlapsRange(order, start, end) {
  const orderStart = orderStartDate(order);
  const orderEnd = orderEndDate(order);
  return orderStart <= end && orderEnd >= start;
}

function orderOverlapsYear(order, year) {
  return orderOverlapsRange(order, `${year}-01-01`, `${year}-12-31`);
}

function orderOverlapsMonth(order, year, month) {
  const lastDay = String(new Date(Number(year), Number(month), 0).getDate()).padStart(2, "0");
  return orderOverlapsRange(order, `${year}-${month}-01`, `${year}-${month}-${lastDay}`);
}

function htmlAttr(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeHtml(value) {
  return htmlAttr(value).replaceAll("'", "&#039;");
}

function orderSortTimestamp(order) {
  // Para Supervisor y Bodega la prioridad real es la última orden ingresada.
  // Supabase guarda esto en creado_en/created_at. Si por alguna razón no viene,
  // usamos la fecha de inicio como respaldo para no romper filtros antiguos.
  const created = orderCreatedValue(order);
  const createdMs = created ? new Date(created).getTime() : NaN;
  if (Number.isFinite(createdMs)) return createdMs;

  const start = orderStartDate(order);
  const startMs = start ? new Date(`${start}T00:00:00`).getTime() : NaN;
  return Number.isFinite(startMs) ? startMs : 0;
}

function orderNumberValue(order) {
  return Number(order?.number ?? order?.numero_orden ?? 0) || 0;
}

function sortOrdersNewestFirst(orders) {
  return [...orders].sort((a, b) => {
    // 1) Última creada primero. Esto evita que una orden recién creada
    // quede abajo solo porque comparte la misma fecha de inicio con otras.
    const createdCompare = orderSortTimestamp(b) - orderSortTimestamp(a);
    if (createdCompare) return createdCompare;

    // 2) Si no hay timestamp o empatan, fecha de inicio más nueva primero.
    const dateCompare = String(orderDateValue(b) || "").localeCompare(String(orderDateValue(a) || ""));
    if (dateCompare) return dateCompare;

    // 3) Fallback: número de orden más alto primero.
    const numberCompare = orderNumberValue(b) - orderNumberValue(a);
    if (numberCompare) return numberCompare;

    return String(b.id || "").localeCompare(String(a.id || ""));
  });
}

function matchesOrderStatusFilter(order, filter) {
  const status = effectiveOrderStatus(order);
  const normalizedFilter = String(filter || "all");
  if (normalizedFilter === "all") return true;
  return status === normalizedFilter;
}

function orderDateForFilter(order) {
  return (orderStartDate(order) || order.createdAt || "").slice(0, 10);
}

function matchesWarehouseDateFilter(order) {
  const date = orderDateForFilter(order);
  if (!date) return true;
  if (warehouseDateFromFilter && date < warehouseDateFromFilter) return false;
  if (warehouseDateToFilter && date > warehouseDateToFilter) return false;
  return true;
}

function matchesManagerFilters(order) {
  const potreroOk = managerPotreroFilter === "Todos" || order.potrero === managerPotreroFilter || String(order.potrero || "").split(",").map((item) => item.trim()).includes(managerPotreroFilter);
  const speciesOk = managerSpeciesFilters.has("Todas") || managerSpeciesFilters.has(order.crop || "");
  return potreroOk && speciesOk;
}

const ORDER_STATUS_FILTERS = [
  { value: "all", label: "Todos" },
  { value: "planned", label: "Pendiente" },
  { value: "in_progress", label: "En proceso" },
  { value: "closed", label: "Finalizada" },
  { value: "cancelled", label: "Cancelada" },
  { value: "draft", label: "Borrador" }
];

function statusFilterOptions(selected) {
  return ORDER_STATUS_FILTERS.map((status) => `
    <option value="${status.value}" ${selected === status.value ? "selected" : ""}>${status.label}</option>
  `).join("");
}


function orderListMonthOptions(selected) {
  return [`<option value="all" ${selected === "all" ? "selected" : ""}>Todos los meses</option>`, ...monthOptions().map((month) => `<option value="${month.value}" ${month.value === selected ? "selected" : ""}>${month.label}</option>`)].join("");
}

function matchesManagerOrdersMonth(order) {
  if (!managerOrdersMonth || managerOrdersMonth === "all") return true;
  return orderOverlapsMonth(order, managerYear, managerOrdersMonth);
}
function plannedProduct(order, recipeLine) {
  if (Number(recipeLine.totalProgram) > 0) return Number(recipeLine.totalProgram);
  return plannedLiters(order) * (Number(recipeLine.dose100) || 0) / 100;
}

function productHaFromDose(order, recipeLine) {
  if (Number(recipeLine.productHaProgram) > 0) return Number(recipeLine.productHaProgram);
  return (Number(order.waterHa) || 0) * (Number(recipeLine.dose100) || 0) / 100;
}

function dispatchProductQuantity(order, recipeLine, liters) {
  const waterHa = Number(order.waterHa) || 0;
  const productHa = productHaFromDose(order, recipeLine);
  if (waterHa > 0) return (Number(liters) || 0) / waterHa * productHa;
  return (Number(liters) || 0) * (Number(recipeLine.dose100) || 0) / 100;
}

function actualProduct(order, productId) {
  return order.tanks.reduce((sum, tank) => sum + (Number(tank.products?.[productId]) || 0), 0);
}

function orderCost(order, actual = true) {
  return order.recipe.reduce((sum, line) => {
    const product = getProduct(line.productId);
    const qty = actual ? actualProduct(order, line.productId) : plannedProduct(order, line);
    return sum + qty * (product?.cost || 0);
  }, 0);
}

function statusLabel(status) {
  const map = {
    draft: "📝 Borrador",
    planned: "⏳ Pendiente",
    in_progress: "⚙️ En proceso",
    closed: "✅ Finalizada",
    cancelled: "❌ Cancelada"
  };
  return map[status] || status;
}

function statusClass(status) {
  const map = {
    draft: "status-badge status-draft",
    planned: "status-badge status-planned",
    in_progress: "status-badge status-in-progress",
    closed: "status-badge status-closed",
    cancelled: "status-badge status-cancelled"
  };
  return map[status] || "status-badge status-neutral";
}

function ganttState(order) {
  const dispatched = dispatchedLiters(order);
  const status = effectiveOrderStatus(order);
  if (status === "cancelled") {
    return { key: "cancelled", label: "Cancelada" };
  }
  if (status === "closed") {
    return { key: "done", label: "Completada" };
  }
  if (status === "in_progress" || dispatched > 0) {
    return { key: "process", label: "En proceso" };
  }
  return { key: "pending", label: "Pendiente" };
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("visible");
  setTimeout(() => toast.classList.remove("visible"), 2600);
}

function setGateStatus(message, type = "info") {
  const status = document.getElementById("gateStatus");
  if (!status) return;
  status.textContent = message || "";
  status.className = `auth-status ${type}`;
}

function showGateTab(tab) {
  document.querySelectorAll("#authGate .auth-tabs button").forEach((button) => button.classList.toggle("active", button.dataset.tab === tab));
  ["login", "register", "recover", "resetPassword"].forEach((name) => {
    document.getElementById(`gate${name[0].toUpperCase()}${name.slice(1)}Form`)?.classList.toggle("active-auth-pane", tab === name);
  });
}

function clearRegistrationForm() {
  const form = document.getElementById("gateRegisterForm");
  if (form) form.reset();
  const modalForm = document.getElementById("authForm");
  if (modalForm) {
    ["fullName", "rut", "inviteCode", "registerEmail", "registerPassword", "registerPassword2"].forEach((name) => {
      if (modalForm.elements[name]) modalForm.elements[name].value = "";
    });
  }
}

function openAuthDialog() {
  const dialog = document.getElementById("authDialog");
  if (supabaseSession) {
    dialog.innerHTML = `
      <form method="dialog" class="modal-body">
        <div class="modal-head">
          <h2>Supabase conectado</h2>
          <button class="icon-button" type="button" data-action="close-dialog" title="Cerrar">x</button>
        </div>
        <p>Usuario: ${currentProfile?.full_name || supabaseSession.user?.email || "Sesion activa"}<br>Rol: ${roleLabel(currentProfile?.rol || currentProfile?.role)}<br>Area: ${areaLabel(currentProfile?.area)}</p>
        <div class="modal-actions">
          <button class="secondary-button" type="button" data-action="close-dialog">Cerrar</button>
          <button class="danger-button" type="button" data-action="logout">Cerrar sesion</button>
        </div>
      </form>
    `;
    dialog.showModal();
    return;
  }
  dialog.innerHTML = `
    <form method="dialog" class="modal-body auth-body" id="authForm">
      <div class="modal-head">
        <h2>Acceso AgroAplicaciones</h2>
        <button class="icon-button" type="button" data-action="close-dialog" title="Cerrar">x</button>
      </div>
      <div class="auth-tabs">
        <button type="button" class="active" data-action="auth-tab" data-tab="login">Ingresar</button>
        <button type="button" data-action="auth-tab" data-tab="register">Registrar</button>
      </div>
      <div id="loginPane" class="auth-pane active-auth-pane">
        <div class="form-grid">
          <label class="full">Correo<input name="email" type="email" autocomplete="email"></label>
          <label class="full">Contraseña<input name="password" type="password" autocomplete="current-password"></label>
        </div>
        <div class="modal-actions">
          <button class="secondary-button" type="button" data-action="close-dialog">Cancelar</button>
          <button class="primary-button" type="button" id="loginButton">Entrar</button>
        </div>
      </div>
      <div id="registerPane" class="auth-pane">
        <div class="form-grid">
          <label>Nombre completo<input name="fullName" autocomplete="name"></label>
          <label>RUT<input name="rut" placeholder="12.345.678-9"></label>
          <label>Rol<select name="role"><option value="bodeguero">Bodeguero</option><option value="supervisor">Jefe</option><option value="admin">Admin</option></select></label>
          <label>Area/App<select name="area"><option value="todas">Todas las apps</option><option value="agrocore">AgroCore</option><option value="cosecha">Cosecha</option><option value="calicatas">Calicatas</option><option value="riego">Riego</option><option value="fertilizacion">Fertilizacion</option></select></label>
          <label>Codigo de registro<input name="inviteCode" autocomplete="one-time-code"></label>
          <label class="full">Correo<input name="registerEmail" type="email" autocomplete="email"></label>
          <label>Contraseña<input name="registerPassword" type="password" autocomplete="new-password"></label>
          <label>Repetir contraseña<input name="registerPassword2" type="password" autocomplete="new-password"></label>
        </div>
        <div class="modal-actions">
          <button class="secondary-button" type="button" data-action="close-dialog">Cancelar</button>
          <button class="primary-button" type="button" id="registerButton">Crear cuenta</button>
        </div>
      </div>
    </form>
  `;
  dialog.showModal();
  document.getElementById("loginButton").addEventListener("click", loginSupabase);
  document.getElementById("registerButton").addEventListener("click", registerSupabase);
}

async function loginSupabase() {
  const form = document.getElementById("authForm") || document.getElementById("gateLoginForm");
  const data = Object.fromEntries(new FormData(form));
  const email = normalizeEmailValue(data.email);
  const password = String(data.password || "");
  if (!email || !password) {
    setGateStatus("Ingresa correo y contraseña.", "error");
    showToast("Ingresa correo y contraseña");
    return;
  }
  try {
    setGateStatus("Verificando credenciales...", "info");
    const session = await sbAuthPassword(email, password);
    saveSession(session);
    await loadCloudData();
    startCloudSync();
    document.getElementById("authDialog")?.close();
    setAuthGate(false);
    setGateStatus("", "info");
    showToast("Sesion Supabase iniciada");
  } catch (error) {
    setGateStatus(`No se pudo ingresar: ${error.message}`, "error");
    showToast(`Login fallido: ${error.message}`);
  }
}

async function registerSupabase() {
  const form = document.getElementById("authForm") || document.getElementById("gateRegisterForm");
  const data = Object.fromEntries(new FormData(form));
  const fullName = String(data.fullName || "").trim();
  const rut = normalizeRutValue(data.rut);
  const email = normalizeEmailValue(data.registerEmail);
  const role = toDbRole(data.role);
  const area = normalizeRegistrationArea(data.area);
  const inviteCode = String(data.inviteCode || "").trim();
  const password = String(data.registerPassword || "");
  const password2 = String(data.registerPassword2 || "");
  if (!fullName || !rut || !email || !password || !password2 || !inviteCode) {
    setGateStatus("Completa todos los datos de registro.", "error");
    showToast("Completa todos los datos de registro");
    return;
  }
  if (!isValidEmail(email)) {
    setGateStatus("Ingresa un correo valido.", "error");
    showToast("Correo invalido");
    return;
  }
  if (inviteCode !== REGISTRATION_CODE) {
    setGateStatus("Codigo de registro incorrecto.", "error");
    showToast("Codigo de registro incorrecto");
    return;
  }
  if (password !== password2) {
    setGateStatus("Las contraseñas no coinciden.", "error");
    showToast("Las contraseñas no coinciden");
    return;
  }
  if (password.length < 6) {
    setGateStatus("La contraseña debe tener al menos 6 caracteres.", "error");
    showToast("La contraseña debe tener al menos 6 caracteres");
    return;
  }
  try {
    setGateStatus("Creando cuenta en Supabase...", "info");
    const signup = await sbSignUp(email, password, userRegistrationMetadata(fullName, rut, role, area));
    if (signup?.access_token) {
      await createProfileWithSession(signup, fullName, rut, role, area);
    }
    clearRegistrationForm();
    showGateTab("login");
    setGateStatus(signup?.access_token
      ? "Cuenta creada exitosamente. Ahora ingresa con tu correo y contraseña."
      : "Cuenta creada. Revisa el correo si Supabase pide confirmacion; luego ingresa.",
      "success"
    );
    showToast("Cuenta creada exitosamente");
  } catch (error) {
    setGateStatus(`Registro fallido: ${error.message}`, "error");
    showToast(`Registro fallido: ${error.message}`);
  }
}

async function sbAuthPassword(email, password) {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error_description || data.msg || data.message || "No se pudo iniciar sesion");
  return data;
}

function userRegistrationMetadata(fullName, rut, role, area) {
  const dbRole = toDbRole(role);
  const appArea = normalizeRegistrationArea(area);
  return {
    full_name: fullName,
    nombre_completo: fullName,
    rut,
    role: dbRole,
    rol: dbRole,
    area: appArea,
    app_origen: "agrocore",
    apps: appArea === "todas" ? ["agrocore", "cosecha", "calicatas", "riego", "fertilizacion"] : [appArea]
  };
}

async function sbSignUp(email, password, metadata) {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password, data: metadata })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error_description || data.msg || data.message || "No se pudo registrar");
  return data;
}

async function sbRecoverPassword(email) {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/recover`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      redirect_to: `${window.location.origin}${window.location.pathname}`
    })
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) throw new Error(data?.error_description || data?.msg || data?.message || text || "No se pudo enviar recuperacion");
  return data;
}

async function sbUpdatePassword(accessToken, password) {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    method: "PUT",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ password })
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) throw new Error(data?.error_description || data?.msg || data?.message || text || "No se pudo actualizar contrasena");
  return data;
}

function readRecoverySessionFromUrl() {
  const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  if (params.get("type") !== "recovery" || !params.get("access_token")) return null;
  return {
    access_token: params.get("access_token"),
    refresh_token: params.get("refresh_token") || "",
    token_type: params.get("token_type") || "bearer",
    expires_in: Number(params.get("expires_in") || 0)
  };
}

async function recoverSupabasePassword() {
  const form = document.getElementById("gateRecoverForm");
  const data = Object.fromEntries(new FormData(form));
  const email = normalizeEmailValue(data.recoverEmail);
  if (!email || !isValidEmail(email)) {
    setGateStatus("Ingresa un correo valido para recuperar.", "error");
    showToast("Correo invalido");
    return;
  }
  try {
    setGateStatus("Enviando enlace de recuperacion...", "info");
    await sbRecoverPassword(email);
    setGateStatus("Si el correo existe, Supabase enviara un enlace para crear una nueva contrasena.", "success");
    showToast("Revisa tu correo");
    showGateTab("login");
  } catch (error) {
    setGateStatus(`No se pudo enviar recuperacion: ${error.message}`, "error");
    showToast("No se pudo enviar recuperacion");
  }
}

async function resetSupabasePassword() {
  const form = document.getElementById("gateResetPasswordForm");
  const data = Object.fromEntries(new FormData(form));
  const password = String(data.newPassword || "");
  const password2 = String(data.newPassword2 || "");
  if (!passwordRecoverySession?.access_token) {
    setGateStatus("El enlace de recuperacion no es valido o expiro.", "error");
    return;
  }
  if (password !== password2) {
    setGateStatus("Las contrasenas no coinciden.", "error");
    return;
  }
  if (password.length < 6) {
    setGateStatus("La contrasena debe tener al menos 6 caracteres.", "error");
    return;
  }
  try {
    setGateStatus("Actualizando contrasena...", "info");
    await sbUpdatePassword(passwordRecoverySession.access_token, password);
    passwordRecoverySession = null;
    window.history.replaceState({}, document.title, window.location.pathname);
    form.reset();
    showGateTab("login");
    setGateStatus("Contrasena actualizada. Ingresa con tu nueva contrasena.", "success");
    showToast("Contrasena actualizada");
  } catch (error) {
    setGateStatus(`No se pudo actualizar: ${error.message}`, "error");
    showToast("No se pudo actualizar contrasena");
  }
}

async function createOwnProfile(fullName, rut, role, area = "todas") {
  await sbFetch("/rest/v1/usuarios", {
    method: "POST",
    prefer: "resolution=merge-duplicates,return=minimal",
    body: JSON.stringify([{
      id: supabaseSession.user?.id,
      nombre_completo: fullName,
      rut,
      rol: toDbRole(role),
      area: normalizeRegistrationArea(area)
    }])
  });
}

async function createProfileWithSession(session, fullName, rut, role, area = "todas") {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/usuarios`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal"
    },
    body: JSON.stringify([{
      id: session.user?.id,
      nombre_completo: fullName,
      rut,
      rol: toDbRole(role),
      area: normalizeRegistrationArea(area)
    }])
  });
  const text = await response.text();
  if (!response.ok) {
    let data = {};
    try { data = text ? JSON.parse(text) : {}; } catch {}
    throw new Error(data.message || data.msg || text || "No se pudo crear perfil");
  }
}

async function logoutSupabase() {
  const sessionToClose = supabaseSession;

  // Bloquea inmediatamente el panel para que no siga visible mientras se cierra sesión.
  setAuthGate(true);
  showGateTab("login");
  setGateStatus("Cerrando sesión...", "info");

  // Detener primero Realtime/sincronizaciones para que no vuelvan a cargar datos
  // mientras se está cerrando la sesión.
  stopCloudSync();
  clearTimeout(cloudRealtimeReloadTimer);
  cloudRealtimeReloadTimer = null;
  cloudSyncInProgress = false;

  // Avisar a Supabase Auth. Es best-effort: aunque falle por red/token vencido,
  // igual limpiamos la sesión local para que el usuario salga de la app.
  if (sessionToClose?.access_token) {
    try {
      await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${sessionToClose.access_token}`
        }
      });
    } catch (error) {
      console.warn("No se pudo cerrar sesión en Supabase Auth, se limpiará localmente.", error);
    }
  }

  saveSession(null);
  currentProfile = null;
  currentView = "dashboard";
  state = normalizeState(structuredClone(seedState));

  // Limpieza fuerte: elimina la sesión manual y cualquier token que haya dejado supabase-js.
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("sb-") || key.includes("supabase") || key.includes("auth-token")) {
      localStorage.removeItem(key);
    }
  });
  Object.keys(sessionStorage).forEach((key) => {
    if (key.startsWith("sb-") || key.includes("supabase") || key.includes("auth-token")) {
      sessionStorage.removeItem(key);
    }
  });
  if (CLOUD_ONLY_MODE) localStorage.removeItem(STORAGE_KEY);

  document.querySelectorAll("dialog[open]").forEach((dialog) => dialog.close());
  document.querySelectorAll(".nav-item").forEach((button) => button.classList.toggle("active", button.dataset.view === currentView));
  Object.entries(views).forEach(([key, element]) => element.classList.toggle("active-view", key === currentView));

  applyRoleNavigation();
  render();

  const authButton = document.getElementById("authButton");
  if (authButton) authButton.textContent = "Cuenta";

  const storageStatus = document.getElementById("storageStatus");
  if (storageStatus) storageStatus.textContent = "Esperando inicio de sesión";

  const title = document.getElementById("viewTitle");
  if (title) title.textContent = titles[currentView] || "Panel operativo";

  setAuthGate(true);
  showGateTab("login");
  setGateStatus("Sesión cerrada. Ingresa nuevamente para continuar.", "info");
  showToast("Sesión cerrada");
}

function switchView(view) {
  const role = currentUserRole();
  if (supabaseSession && !roleCanAccessView(role, view)) {
    view = defaultViewForRole(role);
    showToast(`Tu rol ${roleLabel(role)} no tiene acceso a ese modulo`);
  }
  currentView = view;
  document.querySelectorAll(".nav-item").forEach((button) => {
    const sameView = button.dataset.view === view;
    const sameIrrigationTab = view !== "irrigation" || !button.dataset.irrigationMenuTab || button.dataset.irrigationMenuTab === irrigationTab;
    button.classList.toggle("active", sameView && sameIrrigationTab);
  });
  Object.entries(views).forEach(([key, element]) => element.classList.toggle("active-view", key === view));
  document.getElementById("viewTitle").textContent = titles[view];
  render();
}

function render() {
  const renderers = {
    dashboard: renderDashboard,
    irrigation: renderIrrigation,
    calicatas: renderCalicatas,
    fertilizers: renderFertilizers,
    pestMonitoring: renderPestMonitoring,
    applicationDashboard: renderApplicationDashboard,
    program: renderProgram,
    manager: renderManager,
    warehouse: renderWarehouse,
    orders: renderOrders,
    execution: renderExecution,
    inventory: renderInventory,
    prices: renderPrices,
    reports: renderReports,
    harvestMap: renderHarvestMap,
    harvestInfo: renderHarvestInfo,
    masters: renderMasters
  };
  renderers[currentView]?.();
}

function operationalSummary() {
  const orders = state.orders || [];
  const activeOrders = orders.filter((order) => effectiveOrderStatus(order) !== "closed").length;
  const finishedOrders = orders.filter((order) => effectiveOrderStatus(order) === "closed").length;
  const cost = orders.reduce((sum, order) => sum + dispatchCost(order), 0);
  const lowStock = state.products.filter((product) => Number(product.stock) <= Number(product.minStock || 0)).length;
  const activeProducts = state.products.length;
  return { orders, activeOrders, finishedOrders, cost, lowStock, activeProducts };
}

function coreModuleCard(view, label, value, hint, meta) {
  return `
    <button class="module-card" type="button" data-view="${view}">
      <span>${label}</span>
      <strong>${value}</strong>
      <small>${hint}</small>
      <em>${meta}</em>
    </button>
  `;
}

function weatherStationImportButton() {
  if (!hasRole("admin")) return "";
  return `<button class="secondary-button weather-import-button" type="button" data-action="open-weather-station-import">Actualizar BD</button>`;
}

function renderDashboard() {
  const dailyRows = [...(state.weatherStationDaily || [])].sort((a, b) => String(a.date).localeCompare(String(b.date)));
  const years = [...new Set(dailyRows.map((row) => String(row.date || "").slice(0, 4)).filter(Boolean))].sort();
  if (years.length && !years.includes(weatherStationYear)) weatherStationYear = years.at(-1);
  const rows = dailyRows.filter((row) => {
    const yearMatches = String(row.date || "").startsWith(`${weatherStationYear}-`);
    const monthMatches = weatherStationMonth === "Todos" || String(row.date || "").slice(5, 7) === weatherStationMonth;
    return yearMatches && monthMatches;
  });

  if (!dailyRows.length) {
    views.dashboard.innerHTML = `
      <section class="panel weather-station-empty">
        <div class="panel-header">
          <div>
            <span class="weather-eyebrow">Estacion climatica</span>
            <h2>Monitoreo meteorologico</h2>
          </div>
          ${weatherStationImportButton()}
        </div>
        <div class="empty-state">
          <strong>${weatherStationCloudAvailable ? "Sin mediciones disponibles" : "Estacion pendiente de configurar"}</strong>
          <p>Ejecuta <code>supabase_estacion_climatica.sql</code> y luego <code>supabase_estacion_climatica_import.sql</code> en Supabase.</p>
        </div>
      </section>
    `;
    return;
  }

  const summary = weatherStationSummary(rows);
  const latest = state.weatherStationLatest;
  const monthOptions = [
    ["Todos", "Todo el ano"], ["01", "Enero"], ["02", "Febrero"], ["03", "Marzo"],
    ["04", "Abril"], ["05", "Mayo"], ["06", "Junio"], ["07", "Julio"],
    ["08", "Agosto"], ["09", "Septiembre"], ["10", "Octubre"], ["11", "Noviembre"], ["12", "Diciembre"]
  ];
  const latestDate = latest?.date ? weatherStationDateLabel(latest.date, { day: true }) : "Sin lectura";
  const latestTime = latest?.time ? String(latest.time).slice(0, 5) : "";

  views.dashboard.innerHTML = `
    <section class="weather-station-home">
      <div class="weather-station-header">
        <div>
          <span class="weather-eyebrow">Estacion climatica Canelillo</span>
          <h2>Condiciones termicas</h2>
          <p>${number(summary.records, 0)} registros · cobertura ${number(summary.completeness, 1)}%</p>
        </div>
        <div class="weather-station-header-actions">
          ${weatherStationImportButton()}
          <div class="weather-station-filters" aria-label="Filtros de estacion climatica">
            <label>Ano
              <select id="weatherStationYearFilter">
                ${years.map((year) => `<option value="${year}" ${year === weatherStationYear ? "selected" : ""}>${year}</option>`).join("")}
              </select>
            </label>
            <label>Periodo
              <select id="weatherStationMonthFilter">
                ${monthOptions.map(([value, label]) => `<option value="${value}" ${value === weatherStationMonth ? "selected" : ""}>${label}</option>`).join("")}
              </select>
            </label>
          </div>
        </div>
      </div>

      <div class="weather-kpi-grid">
        ${weatherStationKpi("Temperatura actual", latest ? `${number(latest.tempOut, 1)} °C` : "-", `${latestDate}${latestTime ? ` · ${latestTime}` : ""}`, "current")}
        ${weatherStationKpi("Minima del periodo", summary.hasRows ? `${number(summary.minimum, 1)} °C` : "-", summary.minimumDate ? weatherStationDateLabel(summary.minimumDate, { day: true }) : "", "minimum")}
        ${weatherStationKpi("Maxima del periodo", summary.hasRows ? `${number(summary.maximum, 1)} °C` : "-", summary.maximumDate ? weatherStationDateLabel(summary.maximumDate, { day: true }) : "", "maximum")}
        ${weatherStationKpi("Horas sobre 7 °C", summary.hasRows ? `${number(summary.hoursAbove7, 1)} h` : "-", "Suma de intervalos medidos", "thermal")}
        ${weatherStationKpi("Grados-dia base 7 °C", summary.hasRows ? `${number(summary.degreeDays, 1)} °C-dia` : "-", "Metodo Tmax/Tmin diario", "degree")}
        ${weatherStationKpi("Dias con helada", summary.hasRows ? number(summary.frostDays, 0) : "-", summary.hasRows ? `${number(summary.totalFrostHours, 1)} h bajo 0 °C` : "", "frost")}
      </div>

      <div class="weather-dashboard-grid">
        <section class="panel weather-temperature-panel">
          <div class="weather-panel-title">
            <div><h3>Rango de temperatura</h3><p>Minima, promedio y maxima</p></div>
            <span>${weatherStationPeriodLabel()}</span>
          </div>
          ${weatherTemperatureChart(rows)}
        </section>

        <section class="panel weather-frost-panel">
          <div class="weather-panel-title">
            <div><h3>Duracion de heladas</h3><p>Horas acumuladas por intensidad</p></div>
          </div>
          ${weatherFrostWindow(rows)}
          ${weatherFrostBands(summary)}
        </section>
      </div>

      <section class="panel weather-frost-history">
        <div class="weather-panel-title">
          <div><h3>Resumen diario de heladas</h3><p>Temperatura minima, horario corregido y duracion por rango</p></div>
        </div>
        ${weatherFrostTable(rows)}
      </section>
    </section>
  `;

  document.getElementById("weatherStationYearFilter")?.addEventListener("change", (event) => {
    weatherStationYear = event.target.value;
    renderDashboard();
  });
  document.getElementById("weatherStationMonthFilter")?.addEventListener("change", (event) => {
    weatherStationMonth = event.target.value;
    renderDashboard();
  });
}

function weatherStationImportFileInput() {
  return `<input id="weatherStationExcelInput" type="file" accept=".xlsx,.xls" hidden>`;
}

function wireWeatherStationImportInput() {
  document.getElementById("weatherStationExcelInput")?.addEventListener("change", analyzeWeatherStationExcel);
}

function openWeatherStationImportDialog() {
  if (!supabaseSession || !hasRole("admin")) {
    showToast("Solo un administrador puede actualizar la base de datos climatica");
    return;
  }
  weatherStationImportPreview = null;
  const dialog = document.getElementById("weatherStationImportDialog");
  dialog.innerHTML = `
    <div class="modal-body weather-import-modal-body">
      <div class="modal-head">
        <div><h2>Actualizar base de datos</h2><p>Estacion climatica</p></div>
        <button class="icon-button" type="button" data-action="close-dialog" title="Cerrar">x</button>
      </div>
      <div class="weather-import-intro">
        <strong>Selecciona el Excel de la estacion</strong>
        <span>Columnas requeridas: FECHA, HORA, TEMP OUT, HI TEMP y LOW TEMP.</span>
      </div>
      <button class="weather-file-picker" type="button" data-action="choose-weather-station-excel">
        <strong>Seleccionar archivo Excel</strong>
        <span>Se comparara fecha y hora antes de guardar.</span>
      </button>
      ${weatherStationImportFileInput()}
      <div class="modal-actions">
        <button class="secondary-button" type="button" data-action="close-dialog">Cancelar</button>
      </div>
    </div>
  `;
  wireWeatherStationImportInput();
  dialog.showModal();
}

function renderWeatherStationImportLoading(fileName, message = "Analizando registros...") {
  const dialog = document.getElementById("weatherStationImportDialog");
  dialog.innerHTML = `
    <div class="modal-body weather-import-modal-body">
      <div class="modal-head"><div><h2>Actualizar base de datos</h2><p>${escapeHtml(fileName)}</p></div></div>
      <div class="weather-import-loading" role="status" aria-live="polite">
        <span class="weather-import-spinner"></span>
        <strong>${escapeHtml(message)}</strong>
        <small>El archivo no se guardara hasta confirmar la importacion.</small>
      </div>
    </div>
  `;
}

function stationExcelHeader(value) {
  return normalizeText(value).replace(/[^a-z0-9]/g, "");
}

function stationExcelDate(value) {
  let year;
  let month;
  let day;
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    year = value.getFullYear();
    month = value.getMonth() + 1;
    day = value.getDate();
  } else if (typeof value === "number" && window.XLSX?.SSF?.parse_date_code) {
    const parsed = window.XLSX.SSF.parse_date_code(value);
    if (!parsed) return "";
    year = parsed.y;
    month = parsed.m;
    day = parsed.d;
  } else {
    const text = String(value ?? "").trim();
    let match = text.match(/^(\d{4})[-/]([01]?\d)[-/]([0-3]?\d)(?:\s|$)/);
    if (match) {
      year = Number(match[1]);
      month = Number(match[2]);
      day = Number(match[3]);
    } else {
      match = text.match(/^([0-3]?\d)[-/]([01]?\d)[-/](\d{2}|\d{4})(?:\s|$)/);
      if (!match) return "";
      day = Number(match[1]);
      month = Number(match[2]);
      year = Number(match[3]);
      if (year < 100) year += year < 70 ? 2000 : 1900;
    }
  }
  const check = new Date(Date.UTC(year, month - 1, day));
  if (check.getUTCFullYear() !== year || check.getUTCMonth() + 1 !== month || check.getUTCDate() !== day) return "";
  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function stationExcelTime(value) {
  let hour;
  let minute;
  let second;
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    hour = value.getHours();
    minute = value.getMinutes();
    second = value.getSeconds();
  } else if (typeof value === "number" && Number.isFinite(value)) {
    const fraction = ((value % 1) + 1) % 1;
    const totalSeconds = Math.round(fraction * 86400) % 86400;
    hour = Math.floor(totalSeconds / 3600);
    minute = Math.floor((totalSeconds % 3600) / 60);
    second = totalSeconds % 60;
  } else {
    const match = String(value ?? "").trim().match(/^(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?/);
    if (!match) return "";
    hour = Number(match[1]);
    minute = Number(match[2]);
    second = Number(match[3] || 0);
  }
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59 || second < 0 || second > 59) return "";
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:${String(second).padStart(2, "0")}`;
}

function stationExcelTemperature(value) {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(String(value).trim().replace(/\s+/g, "").replace(",", "."));
  return Number.isFinite(parsed) && parsed >= -60 && parsed <= 70 ? parsed : null;
}

function parseWeatherStationExcelRows(matrix) {
  if (!Array.isArray(matrix) || !matrix.length) throw new Error("El Excel no contiene filas");
  const headers = matrix[0].map(stationExcelHeader);
  const expected = {
    fecha: headers.indexOf("fecha"),
    hora: headers.indexOf("hora"),
    tempOut: headers.indexOf("tempout"),
    hiTemp: headers.indexOf("hitemp"),
    lowTemp: headers.indexOf("lowtemp")
  };
  const missing = Object.entries(expected).filter(([, index]) => index < 0).map(([key]) => ({
    fecha: "FECHA", hora: "HORA", tempOut: "TEMP OUT", hiTemp: "HI TEMP", lowTemp: "LOW TEMP"
  })[key]);
  if (missing.length) throw new Error(`Faltan columnas requeridas: ${missing.join(", ")}`);

  const unique = new Map();
  const invalidSamples = [];
  let spreadsheetRows = 0;
  let validRows = 0;
  let duplicateRows = 0;
  matrix.slice(1).forEach((row, index) => {
    if (!Array.isArray(row) || !row.some((value) => value !== null && value !== undefined && String(value).trim() !== "")) return;
    spreadsheetRows += 1;
    const date = stationExcelDate(row[expected.fecha]);
    const time = stationExcelTime(row[expected.hora]);
    const tempOut = stationExcelTemperature(row[expected.tempOut]);
    const hiTemp = stationExcelTemperature(row[expected.hiTemp]);
    const lowTemp = stationExcelTemperature(row[expected.lowTemp]);
    const errors = [];
    if (!date) errors.push("fecha");
    if (!time) errors.push("hora");
    if (tempOut === null) errors.push("temp out");
    if (hiTemp === null) errors.push("hi temp");
    if (lowTemp === null) errors.push("low temp");
    if (hiTemp !== null && lowTemp !== null && hiTemp < lowTemp) errors.push("maxima menor que minima");
    if (errors.length) {
      if (invalidSamples.length < 5) invalidSamples.push({ row: index + 2, reason: errors.join(", ") });
      return;
    }
    validRows += 1;
    const key = `${date}|${time}`;
    if (unique.has(key)) duplicateRows += 1;
    unique.set(key, {
      fecha: date,
      hora: time,
      temp_out: tempOut,
      hi_temp: hiTemp,
      low_temp: lowTemp,
      fuente: "excel_estacion"
    });
  });
  return {
    spreadsheetRows,
    validRows,
    duplicateRows,
    invalidRows: spreadsheetRows - validRows,
    invalidSamples,
    uniqueRows: [...unique.values()].sort((a, b) => `${a.fecha} ${a.hora}`.localeCompare(`${b.fecha} ${b.hora}`))
  };
}

async function analyzeWeatherStationExcel(event) {
  const input = event.target;
  const file = input.files?.[0];
  if (!file) return;
  if (!/\.(xlsx|xls)$/i.test(file.name)) {
    showToast("Selecciona un archivo Excel .xlsx o .xls");
    input.value = "";
    return;
  }
  if (!window.XLSX) {
    showToast("No se pudo cargar el lector de Excel. Revisa la conexion y recarga la pagina.");
    return;
  }
  renderWeatherStationImportLoading(file.name);
  try {
    const workbook = window.XLSX.read(await file.arrayBuffer(), { type: "array", cellDates: false });
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) throw new Error("El Excel no contiene hojas");
    const matrix = window.XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1, defval: null, raw: true });
    const parsed = parseWeatherStationExcelRows(matrix);
    if (!parsed.uniqueRows.length) throw new Error("No se encontraron lecturas validas");
    const firstDate = parsed.uniqueRows[0].fecha;
    const lastDate = parsed.uniqueRows.at(-1).fecha;
    renderWeatherStationImportLoading(file.name, "Comparando con Supabase...");
    const existingRows = await sbSelectAll("estacion_climatica", `select=fecha,hora&fecha=gte.${firstDate}&fecha=lte.${lastDate}&order=fecha.asc,hora.asc`);
    const existingKeys = new Set(existingRows.map((row) => `${stationExcelDate(row.fecha)}|${stationExcelTime(row.hora)}`));
    const newRows = parsed.uniqueRows.filter((row) => !existingKeys.has(`${row.fecha}|${row.hora}`));
    weatherStationImportPreview = {
      ...parsed,
      fileName: file.name,
      sheetName,
      firstDate,
      lastDate,
      existingRows: parsed.uniqueRows.length - newRows.length,
      newRows
    };
    renderWeatherStationImportPreview();
  } catch (error) {
    weatherStationImportPreview = null;
    renderWeatherStationImportError(file.name, error.message);
  }
}

function renderWeatherStationImportPreview() {
  const preview = weatherStationImportPreview;
  if (!preview) return;
  const dialog = document.getElementById("weatherStationImportDialog");
  const invalidDetail = preview.invalidSamples.length
    ? `<div class="weather-import-errors"><strong>Filas omitidas</strong>${preview.invalidSamples.map((item) => `<span>Fila ${item.row}: ${escapeHtml(item.reason)}</span>`).join("")}</div>`
    : "";
  dialog.innerHTML = `
    <div class="modal-body weather-import-modal-body">
      <div class="modal-head">
        <div><h2>Vista previa</h2><p>${escapeHtml(preview.fileName)} · ${escapeHtml(preview.sheetName)}</p></div>
        <button class="icon-button" type="button" data-action="close-dialog" title="Cerrar">x</button>
      </div>
      <div class="weather-import-range"><span>Periodo detectado</span><strong>${preview.firstDate} a ${preview.lastDate}</strong></div>
      <div class="weather-import-summary">
        <article><span>Filas del Excel</span><strong>${number(preview.spreadsheetRows, 0)}</strong></article>
        <article><span>Ya existentes</span><strong>${number(preview.existingRows, 0)}</strong></article>
        <article class="is-new"><span>Nuevas</span><strong>${number(preview.newRows.length, 0)}</strong></article>
        <article class="is-warning"><span>Omitidas</span><strong>${number(preview.invalidRows + preview.duplicateRows, 0)}</strong></article>
      </div>
      <div class="weather-import-note">
        <strong>${preview.newRows.length ? "Solo se insertaran las lecturas nuevas." : "La base de datos ya contiene todas estas lecturas."}</strong>
        <span>Los registros se comparan mediante FECHA + HORA. Los existentes no se modifican.</span>
      </div>
      ${invalidDetail}
      ${weatherStationImportFileInput()}
      <div class="modal-actions">
        <button class="secondary-button" type="button" data-action="choose-weather-station-excel">Cambiar archivo</button>
        <button class="primary-button" type="button" data-action="import-weather-station-excel" ${preview.newRows.length ? "" : "disabled"}>Insertar ${number(preview.newRows.length, 0)} nuevas</button>
      </div>
    </div>
  `;
  wireWeatherStationImportInput();
}

function renderWeatherStationImportError(fileName, message) {
  const dialog = document.getElementById("weatherStationImportDialog");
  dialog.innerHTML = `
    <div class="modal-body weather-import-modal-body">
      <div class="modal-head"><div><h2>No se pudo analizar</h2><p>${escapeHtml(fileName)}</p></div><button class="icon-button" type="button" data-action="close-dialog" title="Cerrar">x</button></div>
      <div class="weather-import-error"><strong>Revisa el archivo</strong><span>${escapeHtml(message)}</span></div>
      ${weatherStationImportFileInput()}
      <div class="modal-actions"><button class="secondary-button" type="button" data-action="close-dialog">Cancelar</button><button class="primary-button" type="button" data-action="choose-weather-station-excel">Elegir otro archivo</button></div>
    </div>
  `;
  wireWeatherStationImportInput();
}

function updateWeatherStationImportProgress(done, total) {
  const progress = document.getElementById("weatherStationImportProgress");
  if (!progress) return;
  const percent = total ? Math.round(done / total * 100) : 0;
  progress.querySelector("i").style.width = `${percent}%`;
  progress.querySelector("strong").textContent = `${number(done, 0)} de ${number(total, 0)}`;
}

async function importWeatherStationExcel() {
  const preview = weatherStationImportPreview;
  if (!preview?.newRows?.length || !hasRole("admin")) return;
  if (!confirm(`Insertar ${preview.newRows.length} lecturas nuevas en estacion_climatica?`)) return;
  const dialog = document.getElementById("weatherStationImportDialog");
  dialog.innerHTML = `
    <div class="modal-body weather-import-modal-body">
      <div class="modal-head"><div><h2>Actualizando base de datos</h2><p>${escapeHtml(preview.fileName)}</p></div></div>
      <div class="weather-import-loading" role="status" aria-live="polite"><span class="weather-import-spinner"></span><strong>Insertando lecturas nuevas...</strong></div>
      <div class="weather-import-progress" id="weatherStationImportProgress"><div><i></i></div><strong>0 de ${number(preview.newRows.length, 0)}</strong></div>
    </div>
  `;
  const batchSize = 500;
  let inserted = 0;
  try {
    for (let index = 0; index < preview.newRows.length; index += batchSize) {
      const batch = preview.newRows.slice(index, index + batchSize);
      await sbFetch("/rest/v1/estacion_climatica?on_conflict=fecha%2Chora", {
        method: "POST",
        prefer: "resolution=ignore-duplicates,return=minimal",
        body: JSON.stringify(batch)
      });
      inserted += batch.length;
      updateWeatherStationImportProgress(inserted, preview.newRows.length);
    }
    weatherStationImportPreview = null;
    await loadCloudData();
    dialog.close();
    if (currentView === "dashboard") renderDashboard();
    showToast(`${inserted} lecturas nuevas agregadas a la base de datos`);
  } catch (error) {
    renderWeatherStationImportError(preview.fileName, `${inserted} lecturas procesadas antes del error. ${error.message}`);
    showToast(`No se completo la actualizacion: ${error.message}`);
  }
}

function weatherStationKpi(label, value, hint, tone) {
  return `<article class="weather-kpi weather-kpi-${tone}"><span>${label}</span><strong>${value}</strong><small>${hint || ""}</small></article>`;
}

function weatherStationDateLabel(value, options = {}) {
  if (!value) return "-";
  const date = new Date(`${String(value).slice(0, 10)}T12:00:00`);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("es-CL", options.day
    ? { day: "2-digit", month: "short", year: "numeric" }
    : { month: "short", year: "numeric" }).format(date).replace(".", "");
}

function weatherStationPeriodLabel() {
  if (weatherStationMonth === "Todos") return weatherStationYear;
  return weatherStationDateLabel(`${weatherStationYear}-${weatherStationMonth}-01`);
}

function weatherStationSummary(rows) {
  if (!rows.length) {
    return { hasRows: false, records: 0, completeness: 0, hoursAbove7: 0, degreeDays: 0, frostDays: 0, totalFrostHours: 0, frost0ToMinus1: 0, frostMinus1ToMinus2: 0, frostBelowMinus2: 0 };
  }
  const minimumRow = rows.reduce((best, row) => Number(row.minimum) < Number(best.minimum) ? row : best, rows[0]);
  const maximumRow = rows.reduce((best, row) => Number(row.maximum) > Number(best.maximum) ? row : best, rows[0]);
  const records = rows.reduce((sum, row) => sum + Number(row.records || 0), 0);
  const first = new Date(`${rows[0].date}T12:00:00`);
  const last = new Date(`${rows.at(-1).date}T12:00:00`);
  const calendarDays = Math.max(1, Math.round((last - first) / 86400000) + 1);
  const frost0ToMinus1 = rows.reduce((sum, row) => sum + Number(row.frost0ToMinus1 || 0), 0);
  const frostMinus1ToMinus2 = rows.reduce((sum, row) => sum + Number(row.frostMinus1ToMinus2 || 0), 0);
  const frostBelowMinus2 = rows.reduce((sum, row) => sum + Number(row.frostBelowMinus2 || 0), 0);
  return {
    hasRows: true,
    records,
    completeness: records / (calendarDays * 96) * 100,
    minimum: Number(minimumRow.minimum),
    minimumDate: minimumRow.date,
    maximum: Number(maximumRow.maximum),
    maximumDate: maximumRow.date,
    hoursAbove7: rows.reduce((sum, row) => sum + Number(row.hoursAbove7 || 0), 0),
    degreeDays: rows.reduce((sum, row) => sum + Number(row.degreeDays || 0), 0),
    frostDays: rows.filter((row) => Number(row.minimum) <= 0).length,
    frost0ToMinus1,
    frostMinus1ToMinus2,
    frostBelowMinus2,
    totalFrostHours: frost0ToMinus1 + frostMinus1ToMinus2 + frostBelowMinus2
  };
}

function weatherTemperatureSeries(rows) {
  if (weatherStationMonth !== "Todos") {
    return rows.map((row) => ({ ...row, label: String(row.date).slice(8, 10) }));
  }
  const months = new Map();
  rows.forEach((row) => {
    const key = String(row.date).slice(0, 7);
    const bucket = months.get(key) || { key, records: 0, weightedAverage: 0, minimum: Infinity, maximum: -Infinity };
    const records = Number(row.records || 0);
    bucket.records += records;
    bucket.weightedAverage += Number(row.average || 0) * records;
    bucket.minimum = Math.min(bucket.minimum, Number(row.minimum));
    bucket.maximum = Math.max(bucket.maximum, Number(row.maximum));
    months.set(key, bucket);
  });
  return [...months.values()].map((bucket) => ({
    label: weatherStationDateLabel(`${bucket.key}-01`).split(" ")[0],
    minimum: bucket.minimum,
    maximum: bucket.maximum,
    average: bucket.records ? bucket.weightedAverage / bucket.records : 0
  }));
}

function weatherTemperatureChart(rows) {
  const series = weatherTemperatureSeries(rows);
  if (!series.length) return '<div class="empty-state compact-empty"><strong>Sin datos para el periodo.</strong></div>';
  const scaleMinimum = Math.min(-5, Math.floor(Math.min(...series.map((item) => Number(item.minimum))) / 5) * 5);
  const scaleMaximum = Math.max(40, Math.ceil(Math.max(...series.map((item) => Number(item.maximum))) / 5) * 5);
  const scaleRange = scaleMaximum - scaleMinimum || 1;
  return `
    <div class="weather-temperature-chart">
      <div class="weather-temperature-scale"><span>${scaleMaximum}°</span><span>${number((scaleMaximum + scaleMinimum) / 2, 0)}°</span><span>${scaleMinimum}°</span></div>
      <div class="weather-temperature-scroll">
        <div class="weather-temperature-columns" style="--weather-columns:${series.length}">
          ${series.map((item) => {
            const minimum = Number(item.minimum);
            const maximum = Number(item.maximum);
            const average = Number(item.average);
            const top = (scaleMaximum - maximum) / scaleRange * 100;
            const height = Math.max(2, (maximum - minimum) / scaleRange * 100);
            const averageTop = (scaleMaximum - average) / scaleRange * 100;
            return `<div class="weather-temperature-column" title="${item.label}: min ${number(minimum, 1)} °C, prom ${number(average, 1)} °C, max ${number(maximum, 1)} °C">
              <span class="weather-temperature-max">${number(maximum, 0)}°</span>
              <div class="weather-temperature-track">
                <i style="top:${top}%;height:${height}%"></i>
                <b style="top:${averageTop}%"></b>
              </div>
              <span class="weather-temperature-min">${number(minimum, 0)}°</span>
              <strong>${item.label}</strong>
            </div>`;
          }).join("")}
        </div>
      </div>
    </div>`;
}

function weatherFrostBands(summary) {
  const bands = [
    { label: "0 a -1 °C", value: summary.frost0ToMinus1, tone: "light" },
    { label: "-1 a -2 °C", value: summary.frostMinus1ToMinus2, tone: "medium" },
    { label: "Menor o igual a -2 °C", value: summary.frostBelowMinus2, tone: "severe" }
  ];
  const maximum = Math.max(1, ...bands.map((band) => band.value));
  return `<div class="weather-frost-bands">${bands.map((band) => `
    <article class="weather-frost-band weather-frost-${band.tone}">
      <div><span>${band.label}</span><strong>${number(band.value, 2)} h</strong></div>
      <div class="weather-frost-progress"><i style="width:${band.value / maximum * 100}%"></i></div>
    </article>`).join("")}</div>`;
}

function weatherFrostTimeLabel(value) {
  const time = String(value || "").slice(0, 5);
  return /^\d{2}:\d{2}$/.test(time) ? time : "-";
}

function weatherCorrectedFrostMinutes(value) {
  const match = String(value || "").match(/^(\d{1,2}):(\d{2})/);
  if (!match) return null;
  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours >= 12) hours -= 12;
  return hours * 60 + minutes;
}

function weatherMinutesLabel(value) {
  const minutes = ((Number(value) % 1440) + 1440) % 1440;
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}

function weatherStationFrostWindowsByDate(readings) {
  const minutesByDate = new Map();
  readings.forEach((reading) => {
    if (Number(reading.temp_out) > 0 || !reading.fecha) return;
    const minutes = weatherCorrectedFrostMinutes(reading.hora);
    if (minutes === null) return;
    if (!minutesByDate.has(reading.fecha)) minutesByDate.set(reading.fecha, new Set());
    minutesByDate.get(reading.fecha).add(minutes);
  });
  const result = new Map();
  minutesByDate.forEach((minuteSet, date) => {
    const values = [...minuteSet].sort((a, b) => a - b);
    if (!values.length) return;
    const segments = [];
    let start = values[0];
    let previous = values[0];
    values.slice(1).forEach((minutes) => {
      if (minutes - previous > 30) {
        segments.push({ start, end: previous + 15 });
        start = minutes;
      }
      previous = minutes;
    });
    segments.push({ start, end: previous + 15 });
    result.set(date, {
      start: weatherMinutesLabel(segments[0].start),
      end: weatherMinutesLabel(segments.at(-1).end),
      label: segments.map((segment) => `${weatherMinutesLabel(segment.start)} a ${weatherMinutesLabel(segment.end)}`).join(" / ")
    });
  });
  return result;
}

function weatherFrostWindowLabel(row) {
  if (row.frostWindows) return row.frostWindows;
  if (row.frostStart && row.frostEnd) return `${weatherFrostTimeLabel(row.frostStart)} a ${weatherFrostTimeLabel(row.frostEnd)}`;
  return "-";
}

function weatherFrostWindow(rows) {
  const latestFrost = [...rows]
    .filter((row) => Number(row.minimum) <= 0 && row.frostStart && row.frostEnd)
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))[0];
  if (!latestFrost) return "";
  const frost0ToMinus1 = Number(latestFrost.frost0ToMinus1 || 0);
  const frostMinus1ToMinus2 = Number(latestFrost.frostMinus1ToMinus2 || 0);
  const frostBelowMinus2 = Number(latestFrost.frostBelowMinus2 || 0);
  const totalFrostHours = frost0ToMinus1 + frostMinus1ToMinus2 + frostBelowMinus2;
  return `
    <div class="weather-frost-window">
      <div class="weather-frost-window-head">
        <div><span>Ultima helada</span><small>${weatherStationDateLabel(latestFrost.date, { day: true })}</small></div>
        <strong>${weatherFrostWindowLabel(latestFrost)}</strong>
      </div>
      <div class="weather-frost-window-metrics">
        <div><span>0 a -1 °C</span><b>${number(frost0ToMinus1, 2)} h</b></div>
        <div><span>-1 a -2 °C</span><b>${number(frostMinus1ToMinus2, 2)} h</b></div>
        <div><span>≤ -2 °C</span><b>${number(frostBelowMinus2, 2)} h</b></div>
        <div class="weather-frost-window-total"><span>Total</span><b>${number(totalFrostHours, 2)} h</b></div>
      </div>
    </div>`;
}

function weatherFrostTable(rows) {
  const frostRows = rows.filter((row) => Number(row.minimum) <= 0).sort((a, b) => String(b.date).localeCompare(String(a.date)));
  if (!frostRows.length) return '<div class="empty-state compact-empty"><strong>No se registraron heladas en el periodo.</strong></div>';
  return `<div class="table-wrap weather-frost-table"><table>
    <thead><tr><th>Fecha</th><th>Minima</th><th>Inicio - termino</th><th>0 a -1 °C</th><th>-1 a -2 °C</th><th>≤ -2 °C</th><th>Total</th></tr></thead>
    <tbody>${frostRows.map((row) => {
      const total = Number(row.frost0ToMinus1 || 0) + Number(row.frostMinus1ToMinus2 || 0) + Number(row.frostBelowMinus2 || 0);
      const frostWindow = weatherFrostWindowLabel(row);
      return `<tr><td data-label="Fecha">${weatherStationDateLabel(row.date, { day: true })}</td><td data-label="Minima"><strong>${number(row.minimum, 1)} °C</strong></td><td data-label="Inicio - termino"><strong>${frostWindow}</strong></td><td data-label="0 a -1 °C">${number(row.frost0ToMinus1, 2)} h</td><td data-label="-1 a -2 °C">${number(row.frostMinus1ToMinus2, 2)} h</td><td data-label="Menor o igual a -2 °C">${number(row.frostBelowMinus2, 2)} h</td><td data-label="Total"><strong>${number(total, 2)} h</strong></td></tr>`;
    }).join("")}</tbody>
  </table></div>`;
}

function renderApplicationDashboard() {
  const summary = operationalSummary();
  const applicationAlerts = overApplicationAlerts(state.orders).slice(0, 8);
  const warehouseAlertRows = warehouseAlerts();

  views.applicationDashboard.innerHTML = `
    <div class="kpi-grid">
      ${kpi("Aplicaciones activas", summary.activeOrders, "Pendientes o en proceso")}
      ${kpi("Aplicaciones finalizadas", summary.finishedOrders, "Ordenes cerradas")}
      ${kpi("Costo aplicaciones", money(summary.cost), "Segun salidas de bodega")}
      ${kpi("Alertas bodega", summary.lowStock, `${summary.activeProducts} productos activos`)}
    </div>
    <section class="core-overview">
      ${coreModuleCard("program", "Programa", `${summary.activeOrders} activas`, `${summary.finishedOrders} finalizadas`, "Planificacion")}
      ${coreModuleCard("manager", "Supervisor", "Control", "Gantt y cierre", "Aplicaciones")}
      ${coreModuleCard("warehouse", "Bodega", `${summary.lowStock} alertas`, `${summary.activeProducts} productos activos`, "Stock")}
      ${coreModuleCard("reports", "Control", money(summary.cost), "Reportes y costos", "Auditoria")}
    </section>
    <div class="dashboard-ops">
      <section class="panel map-panel">
        <div class="panel-header">
          <div>
            <h2>Mapa del campo</h2>
            <p>Vista territorial para cruzar potreros, bloques y ordenes.</p>
          </div>
        </div>
        <div id="geoJsonMap" class="geo-map"><span>Cargando Google Maps...</span></div>
      </section>
      <aside class="dashboard-alerts">
        <div class="panel alert-panel">
          <div class="panel-header">
            <div>
              <h2>Alertas de aplicacion</h2>
              <p>Mas recientes arriba.</p>
            </div>
            <span class="badge ${applicationAlerts.length ? "danger" : "success"}">${applicationAlerts.length ? `${applicationAlerts.length}` : "OK"}</span>
          </div>
          <div class="alert-list scroll-alerts">
            ${applicationAlerts.map(applicationAlertRow).join("") || `<div class="empty">No hay excesos de mojamiento o producto detectados.</div>`}
          </div>
        </div>
        <div class="panel alert-panel">
          <div class="panel-header">
            <div>
              <h2>Alertas de bodega</h2>
              <p>Ordenes y stock critico.</p>
            </div>
            <button class="secondary-button" data-action="new-movement">Movimiento</button>
          </div>
          <div class="alert-list scroll-alerts">
            ${warehouseAlertRows.join("")}
          </div>
        </div>
      </aside>
    </div>
  `;
  renderGeoJsonMap();
}

function setIrrigationFiltersOpen(open) {
  irrigationFiltersOpen = Boolean(open);
  const drawer = document.getElementById("irrigationFilterDrawer");
  const toggle = views.irrigation?.querySelector(".irrigation-filter-toggle");
  drawer?.classList.toggle("is-open", irrigationFiltersOpen);
  drawer?.setAttribute("aria-hidden", String(!irrigationFiltersOpen));
  if (toggle) {
    toggle.classList.toggle("is-open", irrigationFiltersOpen);
    toggle.setAttribute("aria-expanded", String(irrigationFiltersOpen));
    toggle.setAttribute("title", irrigationFiltersOpen ? "Ocultar filtros" : "Mostrar filtros");
    toggle.innerHTML = irrigationFiltersOpen ? "&#8250;" : "&#8249;";
  }
}

function renderIrrigation() {
  pruneEmptyIrrigationAudits();
  const allBlocks = [...state.blocks].filter((block) => block.active !== false).sort(blockSort);
  const species = ["Todas", ...new Set(allBlocks.map((block) => block.crop).filter(Boolean))].sort((a, b) => a === "Todas" ? -1 : a.localeCompare(b));
  const speciesScoped = allBlocks.filter((block) => irrigationSpeciesFilter === "Todas" || block.crop === irrigationSpeciesFilter);
  const potreros = ["Todos", ...new Set(speciesScoped.map((block) => block.potrero).filter(Boolean))].sort((a, b) => a === "Todos" ? -1 : b === "Todos" ? 1 : comparePotrero(a, b));
  if (irrigationPotreroFilter !== "Todos" && !potreros.includes(irrigationPotreroFilter)) irrigationPotreroFilter = "Todos";
  const filteredBlocks = speciesScoped
    .filter((block) => irrigationPotreroFilter === "Todos" || block.potrero === irrigationPotreroFilter)
    .sort(blockSort);
  const daysInMonth = new Date(Number(irrigationYear), Number(irrigationMonth), 0).getDate();
  const monthLabel = monthOptions().find((item) => item.value === irrigationMonth)?.label || irrigationMonth;
  const monthPrefix = `${irrigationYear}-${irrigationMonth}`;
  ensureIrrigationEvaporationData(monthPrefix, daysInMonth);
  const stationRows = irrigationStationBandejaRows(monthPrefix);
  irrigationStationFilter = "Todas";
  const monthEvaporationRows = irrigationEvaporationRowsForMonth(monthPrefix);
  const bandejaEvaporationRows = monthEvaporationRows;
  const evaporationMap = evaporationByDateMap(monthEvaporationRows);
  const bandejaEvaporationMap = evaporationByDateMap(bandejaEvaporationRows);
  const historicalEvaporationMap = historicalEvaporationByMonthDay(irrigationMonth);
  const bandejaHistoricalEvaporationMap = historicalEvaporationMap;
  const historicalEvaporationTotal = Array.from({ length: daysInMonth }, (_, index) => {
    const day = String(index + 1).padStart(2, "0");
    return Number(historicalEvaporationMap.get(day)) || 0;
  }).reduce((sum, value) => sum + value, 0);
  const bandejaHistoricalEvaporationTotal = Array.from({ length: daysInMonth }, (_, index) => {
    const day = String(index + 1).padStart(2, "0");
    return Number(bandejaHistoricalEvaporationMap.get(day)) || 0;
  }).reduce((sum, value) => sum + value, 0);
  const monthEvaporationTotal = Array.from({ length: daysInMonth }, (_, index) => {
    const date = `${monthPrefix}-${String(index + 1).padStart(2, "0")}`;
    return Number(evaporationMap.get(date)?.evaporation) || 0;
  }).reduce((sum, value) => sum + value, 0);
  const bandejaMonthEvaporationTotal = Array.from({ length: daysInMonth }, (_, index) => {
    const date = `${monthPrefix}-${String(index + 1).padStart(2, "0")}`;
    return Number(bandejaEvaporationMap.get(date)?.evaporation) || 0;
  }).reduce((sum, value) => sum + value, 0);
  const blockGroups = Object.values(filteredBlocks.reduce((acc, block) => {
    acc[block.potrero] ||= { potrero: block.potrero, blocks: [] };
    acc[block.potrero].blocks.push(block);
    return acc;
  }, {})).sort((a, b) => comparePotrero(a.potrero, b.potrero));
  const blockRowIndexMap = new Map(filteredBlocks.map((block, index) => [block.id, index]));
  const bandejaRows = irrigationBandejaRows(monthPrefix, daysInMonth, bandejaEvaporationMap, bandejaHistoricalEvaporationMap);
  const balanceBlockRows = irrigationBalanceBlockRows(filteredBlocks, monthPrefix, daysInMonth);
  const irrigationHeaderControls = irrigationTab === "bandejas" ? `
    <div class="irrigation-bandeja-navigation">
      <button class="icon-button" type="button" data-action="shift-irrigation-bandeja-year" data-delta="-1" title="Ano anterior" aria-label="Ano anterior">&#8592;</button>
      <label>Ano foco
        <input id="irrigationYearFilter" type="number" min="1900" max="2100" step="1" value="${irrigationYear}">
      </label>
      <button class="icon-button" type="button" data-action="shift-irrigation-bandeja-year" data-delta="1" title="Ano siguiente" aria-label="Ano siguiente">&#8594;</button>
      <label>Ir a mes
        <select id="irrigationBandejaMonthJump">${monthOptions().map((month) => `<option value="${month.value}" ${month.value === irrigationMonth ? "selected" : ""}>${month.label}</option>`).join("")}</select>
      </label>
      <button class="secondary-button" type="button" data-action="focus-current-irrigation-bandeja">Hoy</button>
    </div>` : `
    <div class="program-filters irrigation-filters">
      <label>Especie
        <select id="irrigationSpeciesFilter">${species.map((item) => `<option value="${htmlAttr(item)}" ${item === irrigationSpeciesFilter ? "selected" : ""}>${item}</option>`).join("")}</select>
      </label>
      <label>Potrero
        <select id="irrigationPotreroFilter">${potreros.map((item) => `<option value="${htmlAttr(item)}" ${item === irrigationPotreroFilter ? "selected" : ""}>${item}</option>`).join("")}</select>
      </label>
      <label>Mes
        <select id="irrigationMonthFilter">${monthOptions().map((month) => `<option value="${month.value}" ${month.value === irrigationMonth ? "selected" : ""}>${month.label}</option>`).join("")}</select>
      </label>
      <label>Ano
        <input id="irrigationYearFilter" type="number" min="2020" max="2100" step="1" value="${irrigationYear}">
      </label>
      ${irrigationTab === "gantt" ? `
        <button class="primary-button" type="button" data-action="open-irrigation-program-dialog">Editar programa</button>
        <button class="secondary-button" type="button" data-action="open-selected-irrigation-observation" title="Selecciona una celda y usa Alt + O">Observacion</button>
        <button class="secondary-button" type="button" data-action="clear-irrigation-hours">Limpiar</button>` : ""}
    </div>`;

  views.irrigation.innerHTML = `
    <section class="panel irrigation-panel ${irrigationTab === "gantt" ? "irrigation-panel-gantt" : ""}">
      <button
        class="irrigation-filter-toggle ${irrigationFiltersOpen ? "is-open" : ""}"
        type="button"
        data-action="toggle-irrigation-filters"
        aria-controls="irrigationFilterDrawer"
        aria-expanded="${irrigationFiltersOpen}"
        title="${irrigationFiltersOpen ? "Ocultar filtros" : "Mostrar filtros"}"
      >${irrigationFiltersOpen ? "&#8250;" : "&#8249;"}</button>
      <aside
        id="irrigationFilterDrawer"
        class="irrigation-filter-drawer ${irrigationFiltersOpen ? "is-open" : ""}"
        aria-hidden="${!irrigationFiltersOpen}"
      >
        <div class="irrigation-filter-drawer-head">
          <div>
            <strong>Filtros de riego</strong>
            <span>${monthLabel} ${irrigationYear}</span>
          </div>
          <button class="icon-button" type="button" data-action="toggle-irrigation-filters" title="Ocultar filtros" aria-label="Ocultar filtros">&#10005;</button>
        </div>
        ${irrigationHeaderControls}
      </aside>
      ${irrigationTab === "bandejas" ? renderIrrigationBandejasPanel({
        year: irrigationYear
      }) : irrigationTab === "balance" ? renderIrrigationBalancePanel({
        blockRows: balanceBlockRows,
        monthPrefix,
        daysInMonth,
        monthLabel,
        year: irrigationYear
      }) : `
      ${renderIrrigationProgramTool(filteredBlocks, monthLabel)}
      <div class="irrigation-compare-wrap">
        <div class="irrigation-section-title">
          <strong>Programa</strong>
          <span>Bandeja historica promedio ${monthLabel.toLowerCase()} · total ${irrigationBandejaLabel(historicalEvaporationTotal)}</span>
        </div>
        <div class="irrigation-gantt irrigation-gantt-program" style="--days:${daysInMonth}">
          <div class="irrigation-row irrigation-row-head">
            <div class="irrigation-block-head">Bloque</div>
            <div class="irrigation-days">
              ${Array.from({ length: daysInMonth }, (_, index) => {
                const day = String(index + 1).padStart(2, "0");
                const date = `${monthPrefix}-${day}`;
                const bandeja = historicalEvaporationMap.get(day);
                return `<b class="irrigation-date-cell ${irrigationDayClass(date)}" title="${htmlAttr(irrigationDayTitle(date, `Promedio historico ${monthLabel} dia ${index + 1}: ${irrigationBandejaLabel(bandeja)}`))}">
                  <em>${index + 1}</em>
                  <span>${irrigationBandejaLabel(bandeja)}</span>
                </b>`;
              }).join("")}
            </div>
            <div class="irrigation-total-head">Total</div>
            <div class="irrigation-reposition-head" title="Reposicion programada con bandeja historica promedio">Repos. %</div>
            <div class="irrigation-difference-head irrigation-difference-hours">Dif. hrs</div>
            <div class="irrigation-difference-head irrigation-difference-reposition">Dif. repos.</div>
          </div>
          ${blockGroups.map((group) => `
            <div class="irrigation-potrero-group irrigation-potrero-group-compact">
              <strong>Potrero ${group.potrero}</strong>
              <span>${group.blocks.length} bloque${group.blocks.length === 1 ? "" : "s"}</span>
            </div>
            ${group.blocks.map((block) => {
              const programmedValues = Array.from({ length: daysInMonth }, (_, index) => {
                const date = `${monthPrefix}-${String(index + 1).padStart(2, "0")}`;
                return irrigationProgramHours[irrigationKey(block.id, date)] ?? "";
              });
              const programTotal = programmedValues.reduce((sum, value) => sum + (Number(value) || 0), 0);
              const programReposition = irrigationReposicion(programTotal, block.precipitation, historicalEvaporationTotal);
              const calicataKey = calicataBlockKey(block.potrero, block.block);
              const expanded = expandedCalicataKeys.has(calicataKey);
              const rowIndex = blockRowIndexMap.get(block.id) ?? 0;
              return `
                <div class="irrigation-row irrigation-program-row">
                  <div class="irrigation-block-label">
                    <strong>${block.block}</strong>
                    <span>${number(block.hectares)} ha</span>
                    <div class="irrigation-block-data">
                      <small>${block.crop || "-"}${block.variety ? ` · ${block.variety}` : ""}</small>
                      <small class="irrigation-block-metric">
                        <span>Presipitacion ${irrigationBandejaLabel(block.precipitation)}</span>
                        <span>Caudal ${irrigationBandejaLabel(block.flow)}</span>
                      </small>
                    </div>
                  </div>
                  <div class="irrigation-days irrigation-program-days">
                    ${programmedValues.map((value, index) => {
                      const date = `${monthPrefix}-${String(index + 1).padStart(2, "0")}`;
                      return renderIrrigationHourCell("program", block, date, value, rowIndex, index);
                    }).join("")}
                  </div>
                  <div class="irrigation-total" data-program-total="${block.id}">${number(programTotal)}</div>
                  <div class="irrigation-reposition" data-program-reposition="${block.id}">${irrigationReposicionLabel(programReposition)}</div>
                  <div class="irrigation-difference irrigation-difference-hours irrigation-difference-base">Base</div>
                  <div class="irrigation-difference irrigation-difference-reposition irrigation-difference-base">Base</div>
                </div>
                <div class="irrigation-row calicata-row irrigation-program-spacer-row">
                  <div class="irrigation-block-label calicata-label">
                    <strong>Calicatas</strong>
                    <span>Referencia real</span>
                  </div>
                  <div class="irrigation-days calicata-days">
                    ${Array.from({ length: daysInMonth }, (_, index) => {
                      const date = `${monthPrefix}-${String(index + 1).padStart(2, "0")}`;
                      return `<span class="calicata-day-cell ${irrigationDayClass(date)}"></span>`;
                    }).join("")}
                  </div>
                  <div class="irrigation-total calicata-label"></div>
                  <div class="irrigation-reposition calicata-label"></div>
                  <div class="irrigation-difference irrigation-difference-hours calicata-label"></div>
                  <div class="irrigation-difference irrigation-difference-reposition calicata-label"></div>
                </div>
                ${[
                  ["20 cm"], ["40 cm"], ["60 cm"], ["80 cm"], ["Trab."], ["Obs."]
                ].map(([label]) => `
                  <div class="irrigation-row calicata-detail-row irrigation-program-spacer-row ${expanded ? "" : "is-hidden"}" data-calicata-detail="${htmlAttr(calicataKey)}">
                    <div class="irrigation-block-label calicata-label">
                      <strong>${label}</strong>
                    </div>
                    <div class="irrigation-days calicata-detail-days">
                      ${Array.from({ length: daysInMonth }, (_, index) => {
                        const date = `${monthPrefix}-${String(index + 1).padStart(2, "0")}`;
                        return `<span class="calicata-detail-cell ${irrigationDayClass(date)}"></span>`;
                      }).join("")}
                    </div>
                    <div class="irrigation-total calicata-label"></div>
                    <div class="irrigation-reposition calicata-label"></div>
                    <div class="irrigation-difference irrigation-difference-hours calicata-label"></div>
                    <div class="irrigation-difference irrigation-difference-reposition calicata-label"></div>
                  </div>
                `).join("")}
              `;
            }).join("")}
          `).join("") || `<div class="empty-state"><strong>No hay bloques para el filtro seleccionado.</strong><p>Revisa especie, potrero o la tabla public.campos.</p></div>`}
        </div>
      <div class="irrigation-section-title">
        <strong>Riegos reales</strong>
        <span>Bandeja registrada ${monthLabel.toLowerCase()} ${irrigationYear} · total ${irrigationBandejaLabel(monthEvaporationTotal)}</span>
      </div>
      <div class="irrigation-gantt irrigation-gantt-real" style="--days:${daysInMonth}">
        <div class="irrigation-row irrigation-row-head">
          <div class="irrigation-block-head">Bloque</div>
          <div class="irrigation-days">
            ${Array.from({ length: daysInMonth }, (_, index) => {
              const day = String(index + 1).padStart(2, "0");
              const date = `${monthPrefix}-${day}`;
              const bandeja = evaporationMap.get(date)?.evaporation;
              return `<b class="irrigation-date-cell ${irrigationDayClass(date)}" title="${htmlAttr(irrigationDayTitle(date, `${date} · Bandeja ${irrigationBandejaLabel(bandeja)}`))}">
                <em>${index + 1}</em>
                <span>${irrigationBandejaLabel(bandeja)}</span>
              </b>`;
            }).join("")}
          </div>
          <div class="irrigation-total-head">Total</div>
          <div class="irrigation-reposition-head" title="((Total horas bloque x precipitacion bloque) / suma bandeja mensual) x 100">Repos. %</div>
          <div class="irrigation-difference-head irrigation-difference-hours" title="(Horas reales - horas programa) / horas programa">Dif. hrs</div>
          <div class="irrigation-difference-head irrigation-difference-reposition" title="(Reposicion real - reposicion programa) / reposicion programa">Dif. repos.</div>
        </div>
        ${blockGroups.map((group) => `
          <div class="irrigation-potrero-group irrigation-potrero-group-compact">
            <strong>Potrero ${group.potrero}</strong>
            <span>${group.blocks.length} bloque${group.blocks.length === 1 ? "" : "s"}</span>
          </div>
          ${group.blocks.map((block) => {
          const blockTotal = Array.from({ length: daysInMonth }, (_, index) => {
            const date = `${monthPrefix}-${String(index + 1).padStart(2, "0")}`;
            return Number(irrigationHours[irrigationKey(block.id, date)]) || 0;
          }).reduce((sum, value) => sum + value, 0);
          const programTotal = irrigationBlockMonthTotal(irrigationProgramHours, block.id, monthPrefix, daysInMonth);
          const programReposition = irrigationReposicion(programTotal, block.precipitation, historicalEvaporationTotal);
          const reposition = irrigationReposicion(blockTotal, block.precipitation, monthEvaporationTotal);
          const hoursDiff = irrigationDifferencePercent(blockTotal, programTotal);
          const repositionDiff = irrigationDifferencePercent(reposition, programReposition);
          const calicatas = calicatasForBlock(block);
          const calicata = calicataSummary(calicatas);
          const calicataKey = calicataBlockKey(block.potrero, block.block);
          const expanded = expandedCalicataKeys.has(calicataKey);
          const rowIndex = blockRowIndexMap.get(block.id) ?? 0;
          return `
            <div class="irrigation-row">
              <div class="irrigation-block-label">
                <strong>${block.block}</strong>
                <span>${number(block.hectares)} ha</span>
                <div class="irrigation-block-data">
                  <small>${block.crop || "-"}${block.variety ? ` · ${block.variety}` : ""}</small>
                  <small class="irrigation-block-metric">
                    <span>Presipitacion ${irrigationBandejaLabel(block.precipitation)}</span>
                    <span>Caudal ${irrigationBandejaLabel(block.flow)}</span>
                  </small>
                </div>
              </div>
              <div class="irrigation-days">
                ${Array.from({ length: daysInMonth }, (_, index) => {
                const day = String(index + 1).padStart(2, "0");
                const date = `${monthPrefix}-${day}`;
                const key = irrigationKey(block.id, date);
                const value = irrigationHours[key] ?? "";
                return renderIrrigationHourCell("real", block, date, value, rowIndex, index);
                }).join("")}
              </div>
              <div class="irrigation-total" data-block-total="${block.id}">${number(blockTotal)}</div>
              <div class="irrigation-reposition" data-block-reposition="${block.id}" title="Precipitacion ${irrigationBandejaLabel(block.precipitation)} / Bandeja mes ${irrigationBandejaLabel(monthEvaporationTotal)}">${irrigationReposicionLabel(reposition)}</div>
              <div class="irrigation-difference irrigation-difference-hours ${irrigationDifferenceClass(hoursDiff)}" data-block-hours-diff="${block.id}" title="Horas reales ${number(blockTotal)} vs programa ${number(programTotal)}">${irrigationDifferenceLabel(hoursDiff)}</div>
              <div class="irrigation-difference irrigation-difference-reposition ${irrigationDifferenceClass(repositionDiff)}" data-block-reposition-diff="${block.id}" title="Reposicion real ${irrigationReposicionLabel(reposition)} vs programa ${irrigationReposicionLabel(programReposition)}">${irrigationDifferenceLabel(repositionDiff)}</div>
            </div>
            <div class="irrigation-row calicata-row">
              <div class="irrigation-block-label calicata-label">
                <strong>Calicatas</strong>
                <span>${calicata.general === null ? "Promedio -" : `Promedio ${number(calicata.general)}`}</span>
              </div>
              <div class="irrigation-days calicata-days">
                ${Array.from({ length: daysInMonth }, (_, index) => {
                  const date = `${monthPrefix}-${String(index + 1).padStart(2, "0")}`;
                  const dayCalicatas = calicatas.filter((item) => calicataDate(item) === date);
                  if (!dayCalicatas.length) return `<span class="calicata-day-cell ${irrigationDayClass(date)}"></span>`;
                  const daySummary = calicataSummary(dayCalicatas);
                  const label = daySummary.general === null ? dayCalicatas.length : number(daySummary.general);
                  const style = daySummary.general === null ? "" : ` style="${htmlAttr(calicataColorStyle(daySummary.general))}"`;
                  return `<span class="calicata-day-cell ${irrigationDayClass(date)} has-calicata"${style} title="${dayCalicatas.length} calicata(s) · promedio ${daySummary.general === null ? "-" : number(daySummary.general)}">${label}</span>`;
                }).join("")}
              </div>
              <button class="icon-button calicata-toggle" type="button" data-action="toggle-calicatas" data-key="${htmlAttr(calicataKey)}" aria-expanded="${expanded}" title="${expanded ? "Ocultar calicatas" : "Ver calicatas"}">${expanded ? "^" : "v"}</button>
              <div class="irrigation-reposition calicata-label"></div>
              <div class="irrigation-difference irrigation-difference-hours calicata-label"></div>
              <div class="irrigation-difference irrigation-difference-reposition calicata-label"></div>
            </div>
            ${[
                ["20 cm", "depth20", "depth"],
                ["40 cm", "depth40", "depth"],
                ["60 cm", "depth60", "depth"],
                ["80 cm", "depth80", "depth"],
                ["Trab.", "workerName", "text"],
                ["Obs.", "observation", "text"]
              ].map(([label, field, type]) => `
                <div class="irrigation-row calicata-detail-row ${expanded ? "" : "is-hidden"}" data-calicata-detail="${htmlAttr(calicataKey)}">
                  <div class="irrigation-block-label calicata-label">
                    <strong>${label}</strong>
                  </div>
                  <div class="irrigation-days calicata-detail-days">
                    ${Array.from({ length: daysInMonth }, (_, index) => {
                      const date = `${monthPrefix}-${String(index + 1).padStart(2, "0")}`;
                      const dayCalicatas = calicatas.filter((item) => calicataDate(item) === date);
                      const value = type === "depth" ? calicataDepthCell(dayCalicatas, field) : calicataTextCell(dayCalicatas, field);
                      return `<span class="calicata-detail-cell ${irrigationDayClass(date)} ${value ? "has-calicata" : ""}" title="${htmlAttr(value || "")}">${escapeHtml(value)}</span>`;
                    }).join("")}
                  </div>
                  <div class="irrigation-total calicata-label"></div>
                  <div class="irrigation-reposition calicata-label"></div>
                  <div class="irrigation-difference irrigation-difference-hours calicata-label"></div>
                  <div class="irrigation-difference irrigation-difference-reposition calicata-label"></div>
                </div>
              `).join("")}
          `;
          }).join("")}
        `).join("") || `<div class="empty-state"><strong>No hay bloques para el filtro seleccionado.</strong><p>Revisa especie, potrero o la tabla public.campos.</p></div>`}
      </div>
      </div>
      `}
    </section>
  `;
  document.getElementById("irrigationBalancePotreroFilter")?.addEventListener("change", (event) => {
    irrigationBalancePotreroFilter = event.target.value || "Todos";
    irrigationBalanceSelectedPotreros = irrigationBalancePotreroFilter === "Todos" ? new Set() : new Set([irrigationBalancePotreroFilter]);
    renderIrrigation();
  });
  document.getElementById("irrigationSpeciesFilter")?.addEventListener("change", (event) => {
    irrigationSpeciesFilter = event.target.value;
    irrigationPotreroFilter = "Todos";
    irrigationBalancePotreroFilter = "Todos";
    irrigationBalanceSelectedPotreros = new Set();
    renderIrrigation();
  });
  document.getElementById("irrigationPotreroFilter")?.addEventListener("change", (event) => {
    irrigationPotreroFilter = event.target.value;
    irrigationBalancePotreroFilter = "Todos";
    irrigationBalanceSelectedPotreros = new Set();
    renderIrrigation();
  });
  document.getElementById("irrigationMonthFilter")?.addEventListener("change", (event) => {
    irrigationMonth = event.target.value;
    renderIrrigation();
  });
  document.getElementById("irrigationYearFilter")?.addEventListener("change", (event) => {
    irrigationYear = String(event.target.value || new Date().getFullYear());
    if (irrigationTab === "bandejas") irrigationBandejaFocusPending = true;
    renderIrrigation();
  });
  views.irrigation.querySelectorAll(".irrigation-hour-input").forEach((input) => {
    input.addEventListener("focus", (event) => selectIrrigationObservationCell(event.currentTarget));
    input.addEventListener("click", (event) => selectIrrigationObservationCell(event.currentTarget));
    input.addEventListener("keydown", (event) => {
      if ((event.altKey && event.key.toLowerCase() === "o") || (event.shiftKey && event.key === "F2")) {
        selectIrrigationObservationCell(event.currentTarget);
        openIrrigationObservationForInput(event.currentTarget);
        event.preventDefault();
        return;
      }
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
      if (focusIrrigationCellFromKeyboard(event.currentTarget, event.key)) event.preventDefault();
    });
  });
  views.irrigation.querySelectorAll(".irrigation-program-input").forEach((input) => {
    input.addEventListener("input", (event) => {
      const target = event.target;
      const key = irrigationKey(target.dataset.programBlockId, target.dataset.date);
      const value = Number(target.value);
      const block = state.blocks.find((item) => item.id === target.dataset.programBlockId);
      if (target.value === "" || value <= 0) {
        delete irrigationProgramHours[key];
        clearIrrigationCellAudit("program", target.dataset.programBlockId, target.dataset.date);
      } else {
        irrigationProgramHours[key] = value;
        setIrrigationCellAudit("program", target.dataset.programBlockId, target.dataset.date);
      }
      target.title = irrigationAuditTitle("program", block || { id: target.dataset.programBlockId, potrero: "", block: "" }, target.dataset.date, target.value);
      target.classList.toggle("has-hours", Boolean(irrigationProgramHours[key]));
      target.classList.toggle("has-audit", Boolean(irrigationProgramAudit[key]));
      saveIrrigationProgramHours();
      const programTotal = Array.from({ length: daysInMonth }, (_, index) => {
        const date = `${monthPrefix}-${String(index + 1).padStart(2, "0")}`;
        return Number(irrigationProgramHours[irrigationKey(target.dataset.programBlockId, date)]) || 0;
      }).reduce((sum, item) => sum + item, 0);
      const reposition = irrigationReposicion(programTotal, block?.precipitation, historicalEvaporationTotal);
      const totalCell = views.irrigation.querySelector(`[data-program-total="${CSS.escape(target.dataset.programBlockId)}"]`);
      const repositionCell = views.irrigation.querySelector(`[data-program-reposition="${CSS.escape(target.dataset.programBlockId)}"]`);
      if (totalCell) totalCell.textContent = number(programTotal);
      if (repositionCell) repositionCell.textContent = irrigationReposicionLabel(reposition);
      updateIrrigationComparisonCells(target.dataset.programBlockId, daysInMonth, monthPrefix, historicalEvaporationTotal, monthEvaporationTotal);
      scheduleIrrigationProgramCellSave(target.dataset.programBlockId, target.dataset.date, target.value);
    });
  });
  views.irrigation.querySelectorAll(".irrigation-hour-input").forEach((input) => {
    if (input.classList.contains("irrigation-program-input")) return;
    input.addEventListener("input", (event) => {
      const target = event.target;
      const key = irrigationKey(target.dataset.blockId, target.dataset.date);
      const value = Number(target.value);
      const block = state.blocks.find((item) => item.id === target.dataset.blockId);
      if (target.value === "" || value <= 0) {
        delete irrigationHours[key];
        clearIrrigationCellAudit("real", target.dataset.blockId, target.dataset.date);
      } else {
        irrigationHours[key] = value;
        setIrrigationCellAudit("real", target.dataset.blockId, target.dataset.date);
      }
      target.title = irrigationAuditTitle("real", block || { id: target.dataset.blockId, potrero: "", block: "" }, target.dataset.date, target.value);
      target.classList.toggle("has-hours", Boolean(irrigationHours[key]));
      target.classList.toggle("has-audit", Boolean(irrigationAudit[key]));
      saveIrrigationHours();
      scheduleIrrigationCellSave(target.dataset.blockId, target.dataset.date, target.value);
      const blockTotal = Array.from({ length: daysInMonth }, (_, index) => {
        const date = `${monthPrefix}-${String(index + 1).padStart(2, "0")}`;
        return Number(irrigationHours[irrigationKey(target.dataset.blockId, date)]) || 0;
      }).reduce((sum, item) => sum + item, 0);
      views.irrigation.querySelector(`[data-block-total="${target.dataset.blockId}"]`).textContent = number(blockTotal);
      const reposition = irrigationReposicion(blockTotal, block?.precipitation, monthEvaporationTotal);
      const repositionCell = views.irrigation.querySelector(`[data-block-reposition="${target.dataset.blockId}"]`);
      if (repositionCell) repositionCell.textContent = irrigationReposicionLabel(reposition);
      updateIrrigationComparisonCells(target.dataset.blockId, daysInMonth, monthPrefix, historicalEvaporationTotal, monthEvaporationTotal);
    });
  });
  if (irrigationTab === "bandejas") wireIrrigationBandejaMatrix();
  syncIrrigationGanttScroll();
}

function renderCalicatas() {
  const allBlocks = [...state.blocks].filter((block) => block.active !== false).sort(blockSort);
  const species = ["Todas", ...new Set(allBlocks.map((block) => block.crop).filter(Boolean))].sort((a, b) => a === "Todas" ? -1 : a.localeCompare(b));
  const speciesScoped = allBlocks.filter((block) => calicataSpeciesFilter === "Todas" || block.crop === calicataSpeciesFilter);
  const potreros = ["Todos", ...new Set(speciesScoped.map((block) => block.potrero).filter(Boolean))].sort((a, b) => a === "Todos" ? -1 : b === "Todos" ? 1 : comparePotrero(a, b));
  if (calicataPotreroFilter !== "Todos" && !potreros.includes(calicataPotreroFilter)) calicataPotreroFilter = "Todos";
  const filteredBlocks = speciesScoped
    .filter((block) => calicataPotreroFilter === "Todos" || block.potrero === calicataPotreroFilter)
    .sort(blockSort);
  const monthLabel = monthOptions().find((item) => item.value === calicataMonth)?.label || calicataMonth;
  const monthPrefix = `${calicataYear}-${calicataMonth}`;
  views.calicatas.innerHTML = `
    <section class="panel calicatas-panel">
      <div class="panel-header calicatas-panel-header">
        <div>
          <h2>Calicatas</h2>
          <p>Mapa e historial de registros de humedad por potrero y bloque.</p>
        </div>
        <div class="program-filters calicatas-filters">
          <label>Especie
            <select id="calicataSpeciesFilter">${species.map((item) => `<option value="${htmlAttr(item)}" ${item === calicataSpeciesFilter ? "selected" : ""}>${item}</option>`).join("")}</select>
          </label>
          <label>Potrero
            <select id="calicataPotreroFilter">${potreros.map((item) => `<option value="${htmlAttr(item)}" ${item === calicataPotreroFilter ? "selected" : ""}>${item}</option>`).join("")}</select>
          </label>
          <label>Mes
            <select id="calicataMonthFilter">${monthOptions().map((month) => `<option value="${month.value}" ${month.value === calicataMonth ? "selected" : ""}>${month.label}</option>`).join("")}</select>
          </label>
          <label>Ano
            <input id="calicataYearFilter" type="number" min="2020" max="2100" step="1" value="${calicataYear}">
          </label>
        </div>
      </div>
      ${renderIrrigationCalicatasPanel(filteredBlocks, monthPrefix, monthLabel, calicataYear)}
    </section>
  `;
  document.getElementById("calicataSpeciesFilter")?.addEventListener("change", (event) => {
    calicataSpeciesFilter = event.target.value;
    calicataPotreroFilter = "Todos";
    irrigationCalicataBlockFilter = "Todos";
    renderCalicatas();
  });
  document.getElementById("calicataPotreroFilter")?.addEventListener("change", (event) => {
    calicataPotreroFilter = event.target.value;
    irrigationCalicataBlockFilter = "Todos";
    renderCalicatas();
  });
  document.getElementById("calicataMonthFilter")?.addEventListener("change", (event) => {
    calicataMonth = event.target.value;
    renderCalicatas();
  });
  document.getElementById("calicataYearFilter")?.addEventListener("change", (event) => {
    calicataYear = String(event.target.value || new Date().getFullYear());
    renderCalicatas();
  });
  document.getElementById("irrigationCalicataBlockFilter")?.addEventListener("change", (event) => {
    irrigationCalicataBlockFilter = event.target.value || "Todos";
    renderCalicatas();
  });
  if (currentView === "calicatas") renderIrrigationCalicatasMap(filteredBlocks, monthPrefix);
}

function syncIrrigationGanttScroll() {
  const program = views.irrigation.querySelector(".irrigation-gantt-program");
  const real = views.irrigation.querySelector(".irrigation-gantt-real");
  if (!program || !real) return;
  let syncing = false;
  const sync = (source, target) => {
    if (syncing) return;
    syncing = true;
    target.scrollLeft = source.scrollLeft;
    target.scrollTop = source.scrollTop;
    requestAnimationFrame(() => { syncing = false; });
  };
  program.addEventListener("scroll", () => sync(program, real), { passive: true });
  real.addEventListener("scroll", () => sync(real, program), { passive: true });
}

function renderFertilizers() {
  views.fertilizers.innerHTML = `
    <div class="kpi-grid">
      ${kpi("Planes fertilizacion", 0, "")}
      ${kpi("Aplicaciones fertirriego", 0, "")}
      ${kpi("Nutrientes registrados", 0, "")}
      ${kpi("Alertas fertilizante", 0, "")}
    </div>
    <section class="panel empty-module">
      <div class="panel-header">
        <div>
          <h2>Fertilizantes</h2>
        </div>
      </div>
      <div class="empty-state">
        <strong>Sin registros disponibles.</strong>
      </div>
    </section>
  `;
}

function harvestFilterControls() {
  const crews = ["Todas", ...new Set(uniqueHarvestRecords().map(harvestCrewValue))].sort((a, b) => a === "Todas" ? -1 : b === "Todas" ? 1 : a.localeCompare(b, "es", { numeric: true }));
  const sdps = ["Todos", ...new Set(uniqueHarvestRecords().map((record) => record.sdp || "Sin SDP"))].sort((a, b) => a === "Todos" ? -1 : b === "Todos" ? 1 : a.localeCompare(b, "es", { numeric: true }));
  if (harvestCrewFilter !== "Todas" && !crews.includes(harvestCrewFilter)) harvestCrewFilter = "Todas";
  if (harvestSdpFilter !== "Todos" && !sdps.includes(harvestSdpFilter)) harvestSdpFilter = "Todos";
  return `
    <div class="program-filters harvest-filters">
      <label class="harvest-date-range">Rango fechas
        <span>
          <input data-harvest-filter="from" type="date" value="${harvestDateFromFilter}" title="Fecha inicio">
          <input data-harvest-filter="to" type="date" value="${harvestDateToFilter}" title="Fecha termino">
        </span>
      </label>
      <label>Cuadrilla<select data-harvest-filter="crew">${crews.map((crew) => `<option value="${htmlAttr(crew)}" ${crew === harvestCrewFilter ? "selected" : ""}>${crew}</option>`).join("")}</select></label>
      <label>SDP<select data-harvest-filter="sdp">${sdps.map((sdp) => `<option value="${htmlAttr(sdp)}" ${sdp === harvestSdpFilter ? "selected" : ""}>${sdp}</option>`).join("")}</select></label>
      <label>Estado<select data-harvest-filter="status">
        <option value="Todos" ${harvestStatusFilter === "Todos" ? "selected" : ""}>Todos</option>
        <option value="terreno" ${harvestStatusFilter === "terreno" ? "selected" : ""}>En terreno</option>
        <option value="despachado" ${harvestStatusFilter === "despachado" ? "selected" : ""}>Despachados</option>
      </select></label>
      <button class="secondary-button" type="button" data-action="clear-harvest-filter">Limpiar</button>
    </div>
  `;
}

function setPestMonitoringDefaultDates() {
  const dates = (pestMonitoringRecords || []).map((record) => record.date).filter(Boolean).sort();
  if (!pestMonitoringDateTo && dates.length) {
    pestMonitoringDateTo = dates.at(-1);
    const from = new Date(`${pestMonitoringDateTo}T12:00:00`);
    from.setDate(from.getDate() - 30);
    pestMonitoringDateFrom = from.toISOString().slice(0, 10);
  }
}

function mapSupabasePestMonitoringRecord(row) {
  return {
    date: row.fecha || "",
    pest: row.tipo_plaga || "",
    potrero: row.potrero_excel || row.potrero || "Sin potrero",
    canonicalPotrero: row.potrero || "Sin potrero",
    potreroNormalized: Boolean(row.campo_normalizado),
    sourceAlias: row.alias_geojson || "",
    sourceBlock: row.bloque_geojson || "",
    excelBlock: row.bloque_excel || row.bloque || "",
    mapAlias: row.alias_mapa || row.alias_geojson || "",
    mapBlock: row.bloque_mapa || row.bloque || "",
    block: row.bloque_excel || row.bloque || "",
    tree: String(row.numero_arbol ?? ""),
    monitoringOrder: String(row.orden_monitoreo ?? ""),
    foundAt: row.encontrado_en || "",
    sector: String(row.sector_monitoreo ?? ""),
    photoUrl: row.evidencia_foto || "",
    sourceTotal: Number(row.total_origen) || 0,
    stageTotal: Number(row.total_calculado) || 0,
    eggs: Number(row.huevos) || 0,
    nymph1: Number(row.ninfas_1) || 0,
    nymph2: Number(row.ninfas_2) || 0,
    nymph3: Number(row.ninfas_3) || 0,
    adults: Number(row.adultos) || 0,
    larvae: Number(row.larvas) || 0,
    pupae: Number(row.pupas) || 0,
    longitude: Number(row.longitud),
    latitude: Number(row.latitud)
  };
}

async function loadPestMonitoringFromSupabase() {
  if (!supabaseSession) throw new Error("Se requiere una sesion de Supabase");
  const select = [
    "fecha", "tipo_plaga", "potrero", "bloque", "campo_normalizado", "potrero_excel", "bloque_excel",
    "alias_geojson", "bloque_geojson", "alias_mapa", "bloque_mapa", "numero_arbol",
    "orden_monitoreo", "encontrado_en", "sector_monitoreo", "evidencia_foto",
    "total_origen", "total_calculado", "huevos", "ninfas_1", "ninfas_2", "ninfas_3",
    "adultos", "larvas", "pupas", "longitud", "latitud", "origen_capa", "origen_fid"
  ].join(",");
  const rows = await sbSelectAll(
    "v_monitoreo_plagas",
    `select=${select}&order=fecha.asc.nullslast,origen_capa.asc,origen_fid.asc`,
    1000
  );
  if (!rows.length) throw new Error("La tabla monitoreo_plagas aun no contiene registros");
  pestMonitoringDataSource = "Supabase";
  return rows.map(mapSupabasePestMonitoringRecord);
}

async function loadPestMonitoringFromLocalBackup() {
  const response = await fetch("outputs/plagas_monitoreo.compact.json?v=4", { cache: "force-cache" });
  if (!response.ok) throw new Error(`No se pudo cargar el respaldo del monitoreo (${response.status})`);
  const collection = await response.json();
  const dictionaries = collection.dictionaries || {};
  pestMonitoringDataSource = "Respaldo local";
  return (collection.records || []).map((row) => ({
        date: dictionaries.dates?.[row[0]] || "",
        pest: dictionaries.pests?.[row[1]] || "",
        potrero: dictionaries.potreros?.[row[2]] || "Sin potrero",
        canonicalPotrero: dictionaries.potreros?.[row[2]] || "Sin potrero",
        potreroNormalized: Boolean(row[3]),
        sourceAlias: dictionaries.aliases?.[row[4]] || "",
        sourceBlock: dictionaries.blocks?.[row[5]] || "",
        excelBlock: dictionaries.blocks?.[row[6]] || "",
        mapAlias: dictionaries.aliases?.[row[7]] || "",
        mapBlock: dictionaries.blocks?.[row[8]] || "",
        block: dictionaries.blocks?.[row[6]] || "",
        tree: String(row[9] ?? ""),
        monitoringOrder: String(row[10] ?? ""),
        foundAt: dictionaries.foundAt?.[row[11]] || "",
        sector: dictionaries.sectors?.[row[12]] || "",
        photoUrl: dictionaries.photos?.[row[13]] || "",
        sourceTotal: Number(row[14]) || 0,
        stageTotal: Number(row[15]) || 0,
        eggs: Number(row[16]) || 0,
        nymph1: Number(row[17]) || 0,
        nymph2: Number(row[18]) || 0,
        nymph3: Number(row[19]) || 0,
        adults: Number(row[20]) || 0,
        larvae: Number(row[21]) || 0,
        pupae: Number(row[22]) || 0,
        longitude: Number(row[23]),
        latitude: Number(row[24])
      }));
}

async function loadPestMonitoringRecords() {
  if (pestMonitoringRecords) return pestMonitoringRecords;
  if (pestMonitoringLoadPromise) return pestMonitoringLoadPromise;
  pestMonitoringLoadPromise = (async () => {
    try {
      pestMonitoringRecords = await loadPestMonitoringFromSupabase();
    } catch (error) {
      console.warn("Monitoreo de plagas usa respaldo local", error);
      pestMonitoringRecords = await loadPestMonitoringFromLocalBackup();
    }
    pestMonitoringRecords = pestMonitoringRecords.filter((record) =>
      Number.isFinite(record.latitude) && Number.isFinite(record.longitude)
    );
    setPestMonitoringDefaultDates();
      pestMonitoringLoadError = "";
      return pestMonitoringRecords;
  })().catch((error) => {
      pestMonitoringLoadError = error.message || "No se pudo cargar el monitoreo";
      throw error;
  }).finally(() => { pestMonitoringLoadPromise = null; });
  return pestMonitoringLoadPromise;
}

function pestMonitoringEggNymphTotal(record) {
  return (Number(record.eggs) || 0)
    + (Number(record.nymph1) || 0)
    + (Number(record.nymph2) || 0)
    + (Number(record.nymph3) || 0);
}

function pestMonitoringObservedTotal(record) {
  return pestMonitoringEggNymphTotal(record)
    + (Number(record.adults) || 0)
    + (Number(record.larvae) || 0)
    + (Number(record.pupae) || 0);
}

function pestMonitoringFilteredRecords({ includePest = true } = {}) {
  return (pestMonitoringRecords || []).filter((record) => {
    if (pestMonitoringDateFrom && (!record.date || record.date < pestMonitoringDateFrom)) return false;
    if (pestMonitoringDateTo && (!record.date || record.date > pestMonitoringDateTo)) return false;
    if (includePest && pestMonitoringPest !== "Todas" && record.pest !== pestMonitoringPest) return false;
    if (pestMonitoringPotrero !== "Todos" && record.potrero !== pestMonitoringPotrero) return false;
    if (pestMonitoringBlock !== "Todos" && String(record.excelBlock || "") !== pestMonitoringBlock) return false;
    return true;
  });
}

function pestMonitoringBlockKey(recordOrProperties) {
  const alias = recordOrProperties.mapAlias ?? recordOrProperties.sourceAlias ?? recordOrProperties["Potrero_Alias:"] ?? "";
  const block = recordOrProperties.mapBlock ?? recordOrProperties.block ?? recordOrProperties.Bloque ?? "";
  return `${String(alias).trim()}|${String(block).trim()}`;
}

function pestMonitoringBlockSummaries(records) {
  const summaries = new Map();
  records.forEach((record) => {
    const key = pestMonitoringBlockKey(record);
    const summary = summaries.get(key) || {
      key,
      potrero: record.potrero || "Sin potrero",
      sourceAlias: record.sourceAlias || "",
      block: "",
      excelBlocks: new Set(),
      samples: 0,
      positives: 0,
      total: 0,
      eggNymphTotal: 0,
      latest: "",
      pests: new Set(),
      trees: new Set(),
      orders: new Set(),
      foundAt: new Map(),
      stages: { eggs: 0, nymph1: 0, nymph2: 0, nymph3: 0, adults: 0, larvae: 0, pupae: 0 }
    };
    const observedTotal = pestMonitoringObservedTotal(record);
    summary.samples += 1;
    summary.total += observedTotal;
    summary.eggNymphTotal += pestMonitoringEggNymphTotal(record);
    if (observedTotal > 0) summary.positives += 1;
    if (record.date > summary.latest) summary.latest = record.date;
    summary.pests.add(record.pest);
    if (record.excelBlock) summary.excelBlocks.add(String(record.excelBlock));
    if (record.tree) summary.trees.add(record.tree);
    if (record.monitoringOrder) summary.orders.add(record.monitoringOrder);
    if (record.foundAt) summary.foundAt.set(record.foundAt, (summary.foundAt.get(record.foundAt) || 0) + 1);
    Object.keys(summary.stages).forEach((stage) => { summary.stages[stage] += Number(record[stage]) || 0; });
    summaries.set(key, summary);
  });
  summaries.forEach((summary) => {
    summary.block = [...summary.excelBlocks].sort((a, b) => a.localeCompare(b, "es", { numeric: true })).join(", ");
    summary.incidence = summary.samples ? summary.positives / summary.samples * 100 : 0;
    summary.intensity = summary.samples ? summary.total / summary.samples : 0;
  });
  return summaries;
}

const PEST_RISK_COLORS = ["#147d64", "#78c98b", "#b8d96b", "#f0cf4a", "#ee9638", "#d9362b"];

function pestMonitoringQuantile(sortedValues, ratio) {
  if (!sortedValues.length) return 0;
  const position = (sortedValues.length - 1) * ratio;
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  if (lower === upper) return sortedValues[lower];
  return sortedValues[lower] + (sortedValues[upper] - sortedValues[lower]) * (position - lower);
}

function pestMonitoringRiskScale(records) {
  const positives = records
    .map(pestMonitoringObservedTotal)
    .filter((value) => value > 0)
    .sort((a, b) => a - b);
  return {
    thresholds: [0.2, 0.4, 0.6, 0.8].map((ratio) => pestMonitoringQuantile(positives, ratio)),
    maximum: positives.at(-1) || 0,
    positives: positives.length
  };
}

function pestMonitoringRiskLevel(value, scale) {
  if (value <= 0) return 0;
  const [veryLow, low, medium, high] = scale.thresholds;
  if (value <= veryLow) return 1;
  if (value <= low) return 2;
  if (value <= medium) return 3;
  if (value <= high) return 4;
  return 5;
}

function pestMonitoringRiskColor(value, scale) {
  return PEST_RISK_COLORS[pestMonitoringRiskLevel(value, scale)];
}

function pestMonitoringLegend(scale) {
  if (!scale.positives) {
    return `<strong>Carga observada · ${escapeHtml(pestMonitoringPest)}</strong><div><span style="background:${PEST_RISK_COLORS[0]}"></span>0 · monitoreado sin presencia</div>`;
  }
  const [veryLow, low, medium, high] = scale.thresholds;
  const items = [
    [PEST_RISK_COLORS[0], "0 · monitoreado sin presencia"],
    [PEST_RISK_COLORS[1], `Muy baja · hasta ${number(veryLow, 1)}`],
    [PEST_RISK_COLORS[2], `Baja · hasta ${number(low, 1)}`],
    [PEST_RISK_COLORS[3], `Media · hasta ${number(medium, 1)}`],
    [PEST_RISK_COLORS[4], `Alta · hasta ${number(high, 1)}`],
    [PEST_RISK_COLORS[5], `Muy alta · sobre ${number(high, 1)}`]
  ];
  return `<strong>Carga observada · escala ${escapeHtml(pestMonitoringPest)}</strong>${items.map(([color, label]) => `<div><span style="background:${color}"></span>${label}</div>`).join("")}`;
}

function createPestMonitoringHeatOverlay(maps, map) {
  class PestCanvasHeatOverlay extends maps.OverlayView {
    constructor() {
      super();
      this.container = null;
      this.canvas = null;
      this.points = [];
      this.scale = { thresholds: [0, 0, 0, 0], maximum: 0, positives: 0 };
      this.frame = 0;
      this.setMap(map);
    }

    onAdd() {
      this.container = document.createElement("div");
      this.container.className = "pest-heat-overlay";
      this.canvas = document.createElement("canvas");
      this.container.appendChild(this.canvas);
      this.getPanes().overlayLayer.appendChild(this.container);
    }

    setData(points, scale) {
      this.points = points;
      this.scale = scale;
      this.draw();
    }

    draw() {
      if (this.frame) cancelAnimationFrame(this.frame);
      this.frame = requestAnimationFrame(() => this.paint());
    }

    paint() {
      this.frame = 0;
      if (!this.container || !this.canvas || !this.getProjection()) return;
      const bounds = map.getBounds();
      if (!bounds) return;
      const projection = this.getProjection();
      const northEast = projection.fromLatLngToDivPixel(bounds.getNorthEast());
      const southWest = projection.fromLatLngToDivPixel(bounds.getSouthWest());
      const width = Math.max(1, Math.round(northEast.x - southWest.x));
      const height = Math.max(1, Math.round(southWest.y - northEast.y));
      this.container.style.left = `${southWest.x}px`;
      this.container.style.top = `${northEast.y}px`;
      this.container.style.width = `${width}px`;
      this.container.style.height = `${height}px`;
      const pixelRatio = Math.min(1.5, window.devicePixelRatio || 1);
      this.canvas.width = Math.round(width * pixelRatio);
      this.canvas.height = Math.round(height * pixelRatio);
      this.canvas.style.width = `${width}px`;
      this.canvas.style.height = `${height}px`;
      const context = this.canvas.getContext("2d");
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.clearRect(0, 0, width, height);

      const gridSize = 14;
      const buckets = new Map();
      this.points.forEach((point) => {
        const pixel = projection.fromLatLngToDivPixel(new maps.LatLng(point.lat, point.lng));
        const x = pixel.x - southWest.x;
        const y = pixel.y - northEast.y;
        if (x < -40 || x > width + 40 || y < -40 || y > height + 40) return;
        const key = `${Math.floor(x / gridSize)}:${Math.floor(y / gridSize)}`;
        const bucket = buckets.get(key) || { x: 0, y: 0, weight: 0, count: 0 };
        bucket.x += x;
        bucket.y += y;
        bucket.weight += point.weight;
        bucket.count += 1;
        buckets.set(key, bucket);
      });
      const cells = [...buckets.values()].map((bucket) => ({
        x: bucket.x / bucket.count,
        y: bucket.y / bucket.count,
        value: bucket.weight / bucket.count
      }));
      cells.forEach((cell) => {
        const level = pestMonitoringRiskLevel(cell.value, this.scale);
        const color = pestMonitoringRiskColor(cell.value, this.scale);
        const radius = level === 0 ? 11 : 19 + level * 4;
        const gradient = context.createRadialGradient(cell.x, cell.y, 0, cell.x, cell.y, radius);
        gradient.addColorStop(0, `${color}${level === 0 ? "b8" : "e0"}`);
        gradient.addColorStop(0.42, `${color}${level === 0 ? "55" : "78"}`);
        gradient.addColorStop(1, `${color}00`);
        context.fillStyle = gradient;
        context.beginPath();
        context.arc(cell.x, cell.y, radius, 0, Math.PI * 2);
        context.fill();
      });
    }

    onRemove() {
      if (this.frame) cancelAnimationFrame(this.frame);
      this.container?.remove();
      this.container = null;
      this.canvas = null;
    }
  }
  return new PestCanvasHeatOverlay();
}

function pestMonitoringKpis(records, summaries) {
  const positives = records.filter((record) => pestMonitoringObservedTotal(record) > 0).length;
  const incidence = records.length ? positives / records.length * 100 : 0;
  const total = records.reduce((sum, record) => sum + pestMonitoringObservedTotal(record), 0);
  const intensity = records.length ? total / records.length : 0;
  const affectedBlocks = [...summaries.values()].filter((summary) => summary.positives > 0).length;
  return `
    ${kpi("Monitoreos", records.length, "Registros del filtro")}
    ${kpi("Presencia", `${number(incidence, 1)}%`, `${positives} observaciones positivas`)}
    ${kpi("Carga observada", number(total, 0), `${number(intensity, 2)} por monitoreo`)}
    ${kpi("Bloques con presencia", affectedBlocks, `${summaries.size} bloques monitoreados`)}
  `;
}

function pestMonitoringCoverageRows(summaries, totalRecords) {
  const rows = [...summaries.values()].sort((a, b) => b.samples - a.samples || b.incidence - a.incidence || comparePotrero(a.potrero, b.potrero));
  if (!rows.length) return `<tr><td colspan="4"><div class="empty-state compact"><strong>Sin datos</strong><span>Ajusta los filtros.</span></div></td></tr>`;
  return rows.map((summary) => `
    <tr>
      <td><button type="button" data-pest-block-key="${htmlAttr(summary.key)}">${escapeHtml(summary.potrero)} <span>B${escapeHtml(summary.block || "-")}</span></button></td>
      <td>${summary.samples}</td>
      <td>${number(totalRecords ? summary.samples / totalRecords * 100 : 0, 1)}%</td>
      <td><strong>${number(summary.incidence, 1)}%</strong></td>
    </tr>
  `).join("");
}

function pestMonitoringMonthlyRows(records) {
  const grouped = new Map();
  records.forEach((record) => {
    const month = record.date ? record.date.slice(0, 7) : "Sin fecha";
    const key = `${month}|${record.pest}`;
    const summary = grouped.get(key) || {
      month,
      pest: record.pest,
      samples: 0,
      positives: 0,
      eggs: 0,
      nymph1: 0,
      nymph2: 0,
      nymph3: 0,
      adults: 0,
      larvae: 0,
      pupae: 0,
      eggNymphTotal: 0,
      observedTotal: 0
    };
    summary.samples += 1;
    if (pestMonitoringObservedTotal(record) > 0) summary.positives += 1;
    ["eggs", "nymph1", "nymph2", "nymph3", "adults", "larvae", "pupae"].forEach((stage) => {
      summary[stage] += Number(record[stage]) || 0;
    });
    summary.eggNymphTotal += pestMonitoringEggNymphTotal(record);
    summary.observedTotal += pestMonitoringObservedTotal(record);
    grouped.set(key, summary);
  });
  return [...grouped.values()].sort((a, b) => b.month.localeCompare(a.month) || a.pest.localeCompare(b.pest, "es"));
}

function renderPestMonitoringMonthlyTable(records) {
  const rows = pestMonitoringMonthlyRows(records);
  if (!rows.length) return `<div class="empty-state compact"><strong>Sin datos mensuales</strong><span>Ajusta el rango de fechas o los filtros de campo.</span></div>`;
  return `
    <div class="pest-monthly-table-wrap">
      <table class="pest-monthly-table">
        <thead><tr><th>Mes</th><th>Plaga</th><th>Monit.</th><th>Presencia</th><th>Huevos</th><th>Ninfa 1</th><th>Ninfa 2</th><th>Ninfa 3</th><th>Adultos</th><th>Larvas</th><th>Pupas</th><th>Total H+N</th><th>Carga total</th></tr></thead>
        <tbody>${rows.map((row) => `
          <tr>
            <td>${escapeHtml(row.month)}</td><td><strong>${escapeHtml(row.pest)}</strong></td><td>${row.samples}</td>
            <td>${number(row.samples ? row.positives / row.samples * 100 : 0, 1)}%</td>
            <td>${number(row.eggs, 0)}</td><td>${number(row.nymph1, 0)}</td><td>${number(row.nymph2, 0)}</td><td>${number(row.nymph3, 0)}</td>
            <td>${number(row.adults, 0)}</td><td>${number(row.larvae, 0)}</td><td>${number(row.pupae, 0)}</td>
            <td><strong>${number(row.eggNymphTotal, 0)}</strong></td><td><strong>${number(row.observedTotal, 0)}</strong></td>
          </tr>`).join("")}</tbody>
      </table>
    </div>`;
}

function renderPestMonitoring() {
  if (!pestMonitoringRecords) {
    views.pestMonitoring.innerHTML = `
      <section class="panel pest-loading-state">
        <div class="loading-spinner" aria-hidden="true"></div>
        <strong>${pestMonitoringLoadError ? "No se pudo cargar el monitoreo" : "Cargando monitoreo de plagas"}</strong>
        <span>${escapeHtml(pestMonitoringLoadError || "Preparando 13.786 observaciones georreferenciadas")}</span>
        ${pestMonitoringLoadError ? `<button class="secondary-button" type="button" data-action="retry-pest-monitoring">Reintentar</button>` : ""}
      </section>`;
    if (!pestMonitoringLoadError) loadPestMonitoringRecords().then(() => {
      if (currentView === "pestMonitoring") renderPestMonitoring();
    }).catch(() => {
      if (currentView === "pestMonitoring") renderPestMonitoring();
    });
    return;
  }
  const existingMap = document.getElementById("pestMonitoringMap");
  if (existingMap && views.pestMonitoring.contains(existingMap)) {
    refreshPestMonitoring();
    return;
  }
  const pests = [...new Set(pestMonitoringRecords.map((record) => record.pest))].sort((a, b) => a.localeCompare(b, "es"));
  const potreros = [...new Set(pestMonitoringRecords.map((record) => record.potrero).filter(Boolean))].sort(comparePotrero);
  views.pestMonitoring.innerHTML = `
    <section class="pest-monitoring-shell">
      <div class="pest-filter-bar">
        <label>Desde<input type="date" value="${htmlAttr(pestMonitoringDateFrom)}" data-pest-filter="from"></label>
        <label>Hasta<input type="date" value="${htmlAttr(pestMonitoringDateTo)}" data-pest-filter="to"></label>
        <label>Plaga<select data-pest-filter="pest">${pests.map((pest) => `<option value="${htmlAttr(pest)}" ${pest === pestMonitoringPest ? "selected" : ""}>${escapeHtml(pest)}</option>`).join("")}</select></label>
        <label>Potrero<select data-pest-filter="potrero"><option>Todos</option>${potreros.map((potrero) => `<option value="${htmlAttr(potrero)}" ${potrero === pestMonitoringPotrero ? "selected" : ""}>${escapeHtml(potrero)}</option>`).join("")}</select></label>
        <label>Bloque<select data-pest-filter="block" id="pestMonitoringBlockFilter"><option>Todos</option></select></label>
        <button class="icon-button" type="button" data-action="clear-pest-filters" title="Limpiar filtros" aria-label="Limpiar filtros">×</button>
      </div>
      <div class="kpi-grid pest-kpis" id="pestMonitoringKpis"></div>
      <div class="pest-monitoring-layout">
        <section class="panel pest-map-panel">
          <div id="pestMonitoringMap" class="geo-map pest-monitoring-map"><span>Cargando mapa...</span></div>
          <div class="pest-map-legend" id="pestMonitoringLegend" aria-label="Escala de riesgo"></div>
        </section>
        <aside class="panel pest-ranking-panel">
          <div class="panel-header"><div><h2>Cobertura del monitoreo</h2><span id="pestMonitoringSummary"></span></div></div>
          <div class="pest-coverage-wrap">
            <table class="pest-coverage-table">
              <thead><tr><th>Potrero / bloque</th><th>N</th><th>% monit.</th><th>% pres.</th></tr></thead>
              <tbody id="pestMonitoringCoverage"></tbody>
            </table>
          </div>
          <div class="pest-data-note" id="pestMonitoringDataNote"></div>
        </aside>
      </div>
      <section class="panel pest-monthly-panel">
        <div class="panel-header"><div><h2>Resumen mensual por plaga</h2><p>Etapas observadas según fecha, potrero y bloque Excel.</p></div></div>
        <div id="pestMonitoringMonthly"></div>
      </section>
    </section>`;
  wirePestMonitoringFilters();
  refreshPestMonitoring();
}

function wirePestMonitoringFilters() {
  views.pestMonitoring.querySelectorAll("[data-pest-filter]").forEach((control) => {
    control.addEventListener("change", () => {
      const filter = control.dataset.pestFilter;
      if (filter === "from") pestMonitoringDateFrom = control.value;
      if (filter === "to") pestMonitoringDateTo = control.value;
      if (pestMonitoringDateFrom && pestMonitoringDateTo && pestMonitoringDateFrom > pestMonitoringDateTo) {
        if (filter === "from") pestMonitoringDateTo = pestMonitoringDateFrom;
        else pestMonitoringDateFrom = pestMonitoringDateTo;
        const fromControl = views.pestMonitoring.querySelector('[data-pest-filter="from"]');
        const toControl = views.pestMonitoring.querySelector('[data-pest-filter="to"]');
        if (fromControl) fromControl.value = pestMonitoringDateFrom;
        if (toControl) toControl.value = pestMonitoringDateTo;
      }
      if (filter === "pest") pestMonitoringPest = control.value;
      if (filter === "potrero") {
        pestMonitoringPotrero = control.value;
        pestMonitoringBlock = "Todos";
      }
      if (filter === "block") pestMonitoringBlock = control.value;
      refreshPestMonitoring();
    });
  });
}

function refreshPestMonitoring() {
  if (!pestMonitoringRecords) return;
  const blockControl = document.getElementById("pestMonitoringBlockFilter");
  if (blockControl) {
    const blocks = [...new Set(pestMonitoringRecords
      .filter((record) => record.pest === pestMonitoringPest)
      .filter((record) => pestMonitoringPotrero === "Todos" || record.potrero === pestMonitoringPotrero)
      .map((record) => String(record.excelBlock || "")).filter(Boolean))]
      .sort((a, b) => a.localeCompare(b, "es", { numeric: true }));
    if (pestMonitoringBlock !== "Todos" && !blocks.includes(pestMonitoringBlock)) pestMonitoringBlock = "Todos";
    blockControl.innerHTML = `<option>Todos</option>${blocks.map((block) => `<option value="${htmlAttr(block)}" ${block === pestMonitoringBlock ? "selected" : ""}>${escapeHtml(block)}</option>`).join("")}`;
  }
  const records = pestMonitoringFilteredRecords();
  const summaries = pestMonitoringBlockSummaries(records);
  pestMonitoringCurrentSummaries = summaries;
  const kpis = document.getElementById("pestMonitoringKpis");
  if (kpis) kpis.innerHTML = pestMonitoringKpis(records, summaries);
  const coverage = document.getElementById("pestMonitoringCoverage");
  if (coverage) coverage.innerHTML = pestMonitoringCoverageRows(summaries, records.length);
  const monthly = document.getElementById("pestMonitoringMonthly");
  if (monthly) monthly.innerHTML = renderPestMonitoringMonthlyTable(pestMonitoringFilteredRecords({ includePest: false }));
  const summary = document.getElementById("pestMonitoringSummary");
  if (summary) summary.textContent = `${summaries.size} bloques · ${records.length} monitoreos`;
  const pending = records.filter((record) => record.potreroNormalized === false).length;
  const note = document.getElementById("pestMonitoringDataNote");
  if (note) {
    const pendingNote = pending ? `<strong>${pending} registros sin potrero</strong><span>La fuente no permite asociarlos de forma segura.</span>` : "";
    const sourceNote = pestMonitoringDataSource === "Respaldo local" ? `<strong>Respaldo local activo</strong><span>Ejecuta la migracion e importacion de monitoreo en Supabase.</span>` : "";
    note.innerHTML = `${pendingNote}${sourceNote}`;
  }
  const scale = pestMonitoringRiskScale(records);
  const legend = document.getElementById("pestMonitoringLegend");
  if (legend) legend.innerHTML = pestMonitoringLegend(scale);
  renderPestMonitoringMap(records, summaries, scale);
  views.pestMonitoring.querySelectorAll("[data-pest-block-key]").forEach((button) => {
    button.addEventListener("click", () => focusPestMonitoringBlock(button.dataset.pestBlockKey, summaries));
  });
}

async function renderPestMonitoringMap(records, summaries, scale) {
  const element = document.getElementById("pestMonitoringMap");
  if (!element) return;
  const renderVersion = ++pestMonitoringMapRenderVersion;
  try {
    const [maps, layers] = await Promise.all([loadGoogleMaps(), (async () => { geoJsonCache ||= await loadGeoJson(); return geoJsonCache; })()]);
    if (renderVersion !== pestMonitoringMapRenderVersion || !element.isConnected) return;
    if (pestMonitoringMapElement !== element) {
      pestMonitoringHeatOverlay?.setMap?.(null);
      pestMonitoringPolygons.forEach((entry) => entry.polygon.setMap(null));
      pestMonitoringMap = null;
      pestMonitoringMapElement = element;
      pestMonitoringPolygons = [];
      pestMonitoringHeatOverlay = null;
      pestMonitoringInfoWindow?.close();
    }
    if (!pestMonitoringMap) {
      pestMonitoringMap = new maps.Map(element, {
        mapTypeId: "satellite",
        streetViewControl: false,
        fullscreenControl: true,
        mapTypeControl: true,
        clickableIcons: false,
        tilt: 0
      });
      const blockRings = geoFeaturesToRings(layers?.bloques?.features || []);
      blockRings.forEach((item) => {
        item.rings.forEach((ring) => {
          const sourceKey = pestMonitoringBlockKey(item.feature.properties || {});
          const polygon = new maps.Polygon({
            paths: ring.map(([lng, lat]) => ({ lat, lng })),
            strokeColor: "#ffffff",
            strokeOpacity: 0.62,
            strokeWeight: 1.2,
            fillColor: "#6e8f83",
            fillOpacity: 0.05,
            zIndex: 2
          });
          polygon.setMap(pestMonitoringMap);
          polygon.addListener("click", (event) => showPestMonitoringBlockInfo(sourceKey, event.latLng, pestMonitoringCurrentSummaries, maps));
          pestMonitoringPolygons.push({ polygon, key: sourceKey });
        });
      });
      pestMonitoringHeatOverlay = createPestMonitoringHeatOverlay(maps, pestMonitoringMap);
    }
    pestMonitoringPolygons.forEach((entry) => {
      const block = summaries.get(entry.key);
      const value = block?.intensity || 0;
      const level = block ? pestMonitoringRiskLevel(value, scale) : 0;
      entry.polygon.setOptions({
        fillColor: block ? pestMonitoringRiskColor(value, scale) : "#6e8f83",
        fillOpacity: block ? 0.18 + level * 0.045 : 0.035,
        strokeOpacity: block ? 0.9 : 0.32,
        strokeWeight: block ? 1.8 : 1
      });
    });
    pestMonitoringHeatOverlay.setData(records.map((record) => ({
      lat: record.latitude,
      lng: record.longitude,
      weight: pestMonitoringObservedTotal(record)
    })), scale);
    const bounds = new maps.LatLngBounds();
    records.forEach((record) => bounds.extend({ lat: record.latitude, lng: record.longitude }));
    if (!bounds.isEmpty()) pestMonitoringMap.fitBounds(bounds, 36);
  } catch (error) {
    if (renderVersion === pestMonitoringMapRenderVersion) element.innerHTML = `<div class="empty-state"><strong>No se pudo cargar el mapa</strong><span>${escapeHtml(error.message)}</span></div>`;
  }
}

function showPestMonitoringBlockInfo(key, position, summaries, maps) {
  const summary = summaries.get(key);
  if (!summary || !pestMonitoringMap) return;
  const foundAt = [...summary.foundAt.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([place, count]) => `${place} (${count})`)
    .join(", ");
  pestMonitoringInfoWindow ||= new maps.InfoWindow({ maxWidth: 280 });
  pestMonitoringInfoWindow.setContent(`
    <div class="pest-map-info">
      <strong>${escapeHtml(summary.potrero)} / Bloque ${escapeHtml(summary.block || "-")}</strong>
      <div><span>Monitoreos</span><b>${summary.samples}</b></div>
      <div><span>Positivos</span><b>${summary.positives}</b></div>
      <div><span>Incidencia</span><b>${number(summary.incidence, 1)}%</b></div>
      <div><span>Carga total</span><b>${number(summary.total, 0)}</b></div>
      <div><span>Total huevos + ninfas</span><b>${number(summary.eggNymphTotal, 0)}</b></div>
      <div><span>Arboles registrados</span><b>${summary.trees.size}</b></div>
      <div><span>Ordenes monitoreo</span><b>${summary.orders.size}</b></div>
      <div><span>Encontrado en</span><b>${escapeHtml(foundAt || "-")}</b></div>
      <div><span>Ultimo monitoreo</span><b>${escapeHtml(summary.latest || "-")}</b></div>
    </div>`);
  pestMonitoringInfoWindow.setPosition(position);
  pestMonitoringInfoWindow.open({ map: pestMonitoringMap });
}

function focusPestMonitoringBlock(key, summaries) {
  const entry = pestMonitoringPolygons.find((item) => item.key === key);
  const summary = summaries.get(key);
  if (!entry || !summary || !pestMonitoringMap) return;
  const bounds = new google.maps.LatLngBounds();
  entry.polygon.getPath().forEach((position) => bounds.extend(position));
  if (!bounds.isEmpty()) pestMonitoringMap.fitBounds(bounds, 48);
  showPestMonitoringBlockInfo(key, bounds.getCenter(), summaries, google.maps);
}

function wireHarvestFilters() {
  document.querySelectorAll("[data-harvest-filter]").forEach((control) => {
    control.addEventListener("change", (event) => {
      const target = event.target;
      if (target.dataset.harvestFilter === "from") harvestDateFromFilter = target.value;
      if (target.dataset.harvestFilter === "to") harvestDateToFilter = target.value;
      if (target.dataset.harvestFilter === "crew") harvestCrewFilter = target.value;
      if (target.dataset.harvestFilter === "sdp") harvestSdpFilter = target.value;
      if (target.dataset.harvestFilter === "status") harvestStatusFilter = target.value;
      selectedHarvestBinId = "";
      if (currentView === "harvestMap") refreshHarvestMapView();
      if (currentView === "harvestInfo") renderHarvestInfo();
    });
  });
}

function harvestMapKpis(records, stats = harvestStats(records)) {
  return `
    ${kpi("Bines filtrados", stats.total, "Con ubicacion y filtros aplicados")}
    ${kpi("Cuadrillas", stats.crews.size, "Han escaneado bins")}
    ${kpi("Despachados", records.filter((record) => harvestRecordStatus(record) === "despachado").length, "Con trazabilidad camion")}
    ${kpi("Pendientes", records.filter((record) => harvestRecordStatus(record) !== "despachado").length, "En terreno")}
  `;
}

function syncHarvestFilterControlValues() {
  document.querySelectorAll("[data-harvest-filter]").forEach((control) => {
    if (control.dataset.harvestFilter === "from") control.value = harvestDateFromFilter;
    if (control.dataset.harvestFilter === "to") control.value = harvestDateToFilter;
    if (control.dataset.harvestFilter === "crew") control.value = harvestCrewFilter;
    if (control.dataset.harvestFilter === "sdp") control.value = harvestSdpFilter;
    if (control.dataset.harvestFilter === "status") control.value = harvestStatusFilter;
  });
}

function refreshHarvestMapView() {
  const mapElement = document.getElementById("harvestGeoMap");
  if (!mapElement) {
    renderHarvestMap();
    return;
  }
  const records = filteredHarvestRecords();
  syncHarvestFilterControlValues();
  const kpis = document.getElementById("harvestMapKpis");
  if (kpis) kpis.innerHTML = harvestMapKpis(records);
  renderHarvestGeoMap({ fitBounds: false });
}

function renderHarvestMap() {
  const records = filteredHarvestRecords();
  const stats = harvestStats(records);
  const existingMapElement = document.getElementById("harvestGeoMap");
  if (existingMapElement && views.harvestMap.contains(existingMapElement)) {
    const kpis = document.getElementById("harvestMapKpis");
    if (kpis) kpis.innerHTML = harvestMapKpis(records, stats);
    renderHarvestGeoMap({ fitBounds: false });
    return;
  }
  views.harvestMap.innerHTML = `
    <div class="kpi-grid" id="harvestMapKpis">
      ${harvestMapKpis(records, stats)}
    </div>
    <section class="panel harvest-map-panel">
      <div class="panel-header">
        <div>
          <h2>Mapa de bines</h2>
          <p>Ubicaciones de escaneo desde cosecha, sobre el mapa de potreros y bloques.</p>
        </div>
      </div>
      ${harvestFilterControls()}
      <div id="harvestGeoMap" class="geo-map harvest-map"><span>Cargando mapa de cosecha...</span></div>
    </section>
  `;
  wireHarvestFilters();
  renderHarvestGeoMap({ fitBounds: true });
}

function renderHarvestInfo() {
  const records = filteredHarvestRecords();
  const stats = harvestStats(records);
  const byDay = groupCount(records, (record) => harvestRecordDate(record) || "Sin fecha");
  const byCrew = groupCount(records, harvestCrewValue);
  const byContractor = groupCount(records, (record) => record.contractor || "Sin contratista");
  const byField = groupCount(records, (record) => `${record.field || "Sin cuartel"} / ${record.block || "Sin bloque"}`);
  const bySdpFieldBlock = groupCount(records, (record) => `${record.sdp || "Sin SDP"} - ${record.sdpField || "Sin potrero SDP"} / ${record.sdpBlock || "Sin bloque SDP"}`);
  const byJornales = harvestBinsPerJornalRows(records);
  const avgDaily = stats.days.size ? stats.total / stats.days.size : 0;
  views.harvestInfo.innerHTML = `
    <div class="kpi-grid">
      ${kpi("Total bines", stats.total, "Bines unicos escaneados")}
      ${kpi("Dias activos", stats.days.size, `${number(avgDaily)} bins/dia`)}
      ${kpi("Cuadrillas faltan hoy", stats.missingCrews.length, `${stats.scheduledCrews.size} programadas hoy`)}
      ${kpi("Jornales filtrados", filteredHarvestJornales().length, "Segun rango y cuadrilla")}
    </div>
    <section class="panel">
      <div class="panel-header">
        <div>
          <h2>Informacion de cosecha</h2>
          <p>Dashboard basado en los datos usados para el Excel de cosecha.</p>
        </div>
      </div>
      <div class="harvest-missing-compact">
        <strong>Sin escaneo hoy</strong>
        <span class="badge warning">${stats.today}</span>
        <div>
          ${stats.missingCrews.map((crew) => `<span class="harvest-missing-chip">${escapeHtml(crew)}</span>`).join("") || `<span class="empty">No hay cuadrillas programadas faltantes para hoy.</span>`}
        </div>
      </div>
      ${harvestFilterControls()}
      <div class="harvest-dashboard-grid">
        ${harvestRanking("Bines por dia", byDay, "Fecha")}
        ${harvestRanking("Ranking por cuadrilla", byCrew, "Cuadrilla")}
        ${harvestRanking("Ranking por contratista", byContractor, "Contratista")}
        ${harvestRanking("Detalle SDP / potrero / bloque", bySdpFieldBlock, "SDP / sector")}
        ${harvestRanking("Bines por cuartel/bloque", byField, "Sector")}
        ${harvestRanking("Bines por jornal", byJornales, "Jornal", { decimals: 1 })}
      </div>
    </section>
  `;
  wireHarvestFilters();
}

function groupCount(records, getKey) {
  const map = new Map();
  records.forEach((record) => {
    const key = getKey(record) || "Sin dato";
    const set = map.get(key) || new Set();
    set.add(harvestBinKey(record));
    map.set(key, set);
  });
  return [...map.entries()].map(([label, bins]) => ({ label, value: bins.size })).sort((a, b) => b.value - a.value || a.label.localeCompare(b.label, "es", { numeric: true }));
}

function harvestRanking(title, rows, label, options = {}) {
  const top = rows.slice(0, 10);
  const max = Math.max(1, ...top.map((row) => row.value));
  const decimals = options.decimals ?? 0;
  return `
    <article class="panel harvest-ranking">
      <div class="panel-header"><h2>${escapeHtml(title)}</h2></div>
      <div class="harvest-rank-list">
        ${top.map((row) => `
          <div class="harvest-rank-row">
            <span title="${htmlAttr(row.detail || row.label)}">${escapeHtml(row.label)}</span>
            <div><i style="width:${Math.max(4, row.value / max * 100)}%"></i></div>
            <strong>${number(row.value, decimals)}</strong>
          </div>
        `).join("") || `<div class="empty">Sin datos para ${escapeHtml(label.toLowerCase())}.</div>`}
      </div>
    </article>
  `;
}

function renderProgram() {
  const seasonScopedOrders = state.orders.filter((order) => programFilters.seasonId === "Todas" || order.seasonId === programFilters.seasonId);
  const seasonScopedPrograms = state.programs.filter((program) => programFilters.seasonId === "Todas" || program.seasonId === programFilters.seasonId);
  const species = ["Todas", ...new Set(seasonScopedOrders.map((order) => order.crop).filter(Boolean))];
  const programs = [...new Set(seasonScopedOrders.map((order) => order.program).filter(Boolean))];
  const programNumbers = ["Todos", ...new Set(seasonScopedOrders.flatMap((order) => order.programNumbers?.length ? order.programNumbers : [order.programNumber]).filter((value) => value !== "" && value !== undefined).map(String))].sort((a, b) => a === "Todos" ? -1 : Number(a) - Number(b));
  const filtered = state.orders.filter((order) => {
    const seasonOk = programFilters.seasonId === "Todas" || order.seasonId === programFilters.seasonId;
    const programOk = !programFilters.program || (order.program || "").toLowerCase().includes(programFilters.program.toLowerCase());
    const speciesOk = programFilters.species === "Todas" || order.crop === programFilters.species;
    const numberOk = programFilters.number === "Todos" || (order.programNumbers?.length ? order.programNumbers.map(String).includes(String(programFilters.number)) : String(order.programNumber) === String(programFilters.number));
    return seasonOk && programOk && speciesOk && numberOk;
  });
  const grouped = Object.values(filtered.reduce((acc, order) => {
    const key = `${order.programNumber || "SN"}__${order.potrero}__${order.blocks?.join(", ") || "-"}`;
    acc[key] ||= {
      programNumber: order.programNumber || "",
      programName: programLabel(order),
      potrero: order.potrero,
      blocks: order.blocks?.join(", ") || "-",
      crop: order.crop,
      variety: order.variety,
      hectares: 0,
      plannedWater: 0,
      dispatchedWater: 0,
      plannedKg: 0,
      dispatchedKg: 0,
      cost: 0,
      orders: []
    };
    acc[key].hectares += Number(order.hectares) || 0;
    acc[key].plannedWater += plannedLiters(order);
    acc[key].dispatchedWater += dispatchedLiters(order);
    acc[key].plannedKg += order.recipe.reduce((sum, line) => sum + plannedProduct(order, line), 0);
    acc[key].dispatchedKg += order.recipe.reduce((sum, line) => sum + dispatchedProduct(order, line.productId), 0);
    acc[key].cost += dispatchCost(order);
    acc[key].orders.push(order.number);
    return acc;
  }, {})).sort((a, b) => comparePotrero(a.potrero, b.potrero));
  const totals = grouped.reduce((acc, row) => {
    acc.hectares += row.hectares;
    acc.plannedWater += row.plannedWater;
    acc.dispatchedWater += row.dispatchedWater;
    acc.plannedKg += row.plannedKg;
    acc.dispatchedKg += row.dispatchedKg;
    acc.cost += row.cost;
    return acc;
  }, { hectares: 0, plannedWater: 0, dispatchedWater: 0, plannedKg: 0, dispatchedKg: 0, cost: 0 });

  views.program.innerHTML = `
    <section class="panel">
      <div class="panel-header">
        <div>
          <h2>Seguimiento por programa</h2>
          <p>Filtra por programa y especie para ver avance de mojamiento y kg/L por potrero.</p>
        </div>
        <button class="secondary-button" data-action="export-excel">Exportar Excel</button>
      </div>
      <div class="program-filters">
        <label>Temporada
          <select id="programSeasonFilterInput">
            <option value="Todas" ${programFilters.seasonId === "Todas" ? "selected" : ""}>Todas</option>
            ${state.seasons.map((season) => `<option value="${season.id}" ${season.id === programFilters.seasonId ? "selected" : ""}>${season.name}</option>`).join("")}
          </select>
        </label>
        <label>N programa
          <select id="programNumberFilterInput">${programNumbers.map((item) => `<option value="${item}" ${item === programFilters.number ? "selected" : ""}>${item}</option>`).join("")}</select>
        </label>
        <label>Programa
          <input id="programFilterInput" value="${programFilters.program}" list="programOptions" placeholder="Ej: control plagas, calibre, foliar">
          <datalist id="programOptions">${programs.map((program) => `<option value="${program}"></option>`).join("")}</datalist>
        </label>
        <label>Especie
          <select id="speciesFilterInput">${species.map((item) => `<option value="${item}" ${item === programFilters.species ? "selected" : ""}>${item}</option>`).join("")}</select>
        </label>
        <button class="secondary-button" data-action="clear-program-filter">Limpiar</button>
      </div>
      <div class="kpi-grid program-kpis">
        ${kpi("Hectareas", `${number(totals.hectares)} ha`, "Segun filtro actual")}
        ${kpi("Mojamiento total", `${number(totals.plannedWater, 0)} L`, "Solicitado por supervisor")}
        ${kpi("Mojamiento salido", `${number(totals.dispatchedWater, 0)} L`, "Neto bodega")}
        ${kpi("Kg/L salidos", `${number(totals.dispatchedKg)} kg/L`, money(totals.cost))}
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>N programa</th><th>Potrero</th><th>Bloques</th><th>Especie</th><th>Has</th><th>Mojamiento total</th><th>Salido</th><th>Saldo</th><th>kg/L total</th><th>kg/L salido</th><th>Faltan kg/L</th><th>%</th><th>Costo</th></tr></thead>
          <tbody>
            ${grouped.map((row) => {
              const pct = row.plannedWater ? Math.min(100, row.dispatchedWater / row.plannedWater * 100) : 0;
              return `
                <tr>
                  <td><strong class="program-number-chip" style="--program-color:${programColorForNumber(row.programNumber)}">${row.programNumber || "-"}</strong><br><span>${row.programName}</span></td>
                  <td><strong>${row.potrero}</strong><br><span>Ordenes ${row.orders.join(", ")}</span></td>
                  <td>${row.blocks}</td>
                  <td>${row.crop || "-"}<br><span>${row.variety || ""}</span></td>
                  <td>${number(row.hectares)}</td>
                  <td>${number(row.plannedWater, 0)} L</td>
                  <td><div class="mini-progress"><i style="width:${pct}%"></i></div>${number(row.dispatchedWater, 0)} L</td>
                  <td>${number(row.plannedWater - row.dispatchedWater, 0)} L</td>
                  <td>${number(row.plannedKg)} kg/L</td>
                  <td>${number(row.dispatchedKg)} kg/L</td>
                  <td>${number(row.plannedKg - row.dispatchedKg)} kg/L</td>
                  <td>${number(pct, 0)}%</td>
                  <td>${money(row.cost)}</td>
                </tr>
              `;
            }).join("") || `<tr><td colspan="13">No hay datos para el filtro seleccionado.</td></tr>`}
          </tbody>
        </table>
      </div>
    </section>
  `;

  document.getElementById("programFilterInput")?.addEventListener("input", (event) => {
    programFilters.program = event.target.value;
    renderProgram();
  });
  document.getElementById("programSeasonFilterInput")?.addEventListener("change", (event) => {
    programFilters.seasonId = event.target.value;
    programFilters.number = "Todos";
    renderProgram();
  });
  document.getElementById("speciesFilterInput")?.addEventListener("change", (event) => {
    programFilters.species = event.target.value;
    renderProgram();
  });
  document.getElementById("programNumberFilterInput")?.addEventListener("change", (event) => {
    programFilters.number = event.target.value;
    renderProgram();
  });
}

function renderManager() {
  const availableYears = [...new Set(state.orders.flatMap((order) => [String(orderStartDate(order).slice(0, 4)), String(orderEndDate(order).slice(0, 4))]).filter(Boolean))].sort();
  if (!availableYears.includes(managerYear)) availableYears.push(managerYear);
  const orderPotreros = state.orders.flatMap((order) => String(order.potrero || "").split(",").map((item) => item.trim()).filter(Boolean));
  const managerPotreros = ["Todos", ...new Set([...uniquePotreros(), ...orderPotreros])].sort((a, b) => a === "Todos" ? -1 : b === "Todos" ? 1 : comparePotrero(a, b));
  const managerSpecies = ["Todas", ...new Set(state.orders.map((order) => order.crop).filter(Boolean))].sort((a, b) => a === "Todas" ? -1 : b === "Todas" ? 1 : a.localeCompare(b));
  if (!managerPotreros.includes(managerPotreroFilter)) managerPotreroFilter = "Todos";
  if (![...managerSpeciesFilters].some((item) => managerSpecies.includes(item))) managerSpeciesFilters = new Set(["Todas"]);
  const yearOrders = sortOrdersNewestFirst(state.orders
    .filter((order) => orderOverlapsYear(order, managerYear))
    .filter((order) => matchesOrderStatusFilter(order, managerStatusFilter))
    .filter(matchesManagerFilters));
  const visibleOrders = managerGanttMode === "month"
    ? yearOrders.filter((order) => orderOverlapsMonth(order, managerYear, managerMonth))
    : yearOrders;
  const gantt = managerGantt(visibleOrders);
  const listOrders = yearOrders.filter(matchesManagerOrdersMonth);
  const rows = listOrders.map((order) => {
    const total = plannedLiters(order);
    const dispatched = dispatchedLiters(order);
    const pct = total ? Math.min(100, dispatched / total * 100) : 0;
    return `
      <article class="order-card">
        <div class="order-card-head">
          <div>
            <span class="overline">Orden #${order.number}</span>
            <h3>${order.potrero} - bloques ${order.blocks?.join(", ") || "-"}</h3>
            <p>${programLabel(order)} - ${orderStartDate(order) || "-"} a ${orderEndDate(order) || "-"}</p>
          </div>
          <span class="badge info">Creada</span>
        </div>
        <p>${order.objective || "Sin objetivo"} - ${number(order.hectares)} ha x ${number(order.waterHa, 0)} L/ha</p>
        <div class="progress-box">
          <div><strong>${number(dispatched, 0)} L</strong><span>salidos de ${number(total, 0)} L autorizados</span><b class="order-progress-percent">${number(pct, 0)}%</b></div>
          <div class="progress"><i style="width:${pct}%"></i></div>
        </div>
        <div class="recipe-list">
          ${order.recipe.map((line) => {
            const product = getProduct(line.productId);
            return `<span>${product?.name}: ${number(productHaFromDose(order, line))} ${product?.unit}/ha - ${number(plannedProduct(order, line))} total</span>`;
          }).join("")}
        </div>
        <div class="card-actions">
          <button class="secondary-button" data-action="edit-order" data-id="${order.id}">Editar orden</button>
          <button class="secondary-button" data-action="open-dispatch-info" data-id="${order.id}">Información de salida</button>
          ${!["closed", "cancelled"].includes(effectiveOrderStatus(order)) ? `<button class="danger-button" data-action="finish-order" data-id="${order.id}">Terminar orden</button>` : ""}
          ${!["closed", "cancelled"].includes(effectiveOrderStatus(order)) ? `<button class="danger-button cancel-order-button" data-action="cancel-order" data-id="${order.id}">Cancelar orden</button>` : ""}
          <button class="secondary-button" data-action="print-order" data-id="${order.id}">PDF orden</button>
        </div>
      </article>
    `;
  }).join("") || `<div class="empty">No hay órdenes para el mes seleccionado.</div>`;

  views.manager.innerHTML = `
    <section class="panel">
      <div class="panel-header">
        <div>
          <h2>Ordenes creadas por supervisor</h2>
          <p>Define potrero, bloques, hectareas, mojamiento total y receta para que bodega haga las salidas.</p>
        </div>
        <div class="top-actions">
          <button class="secondary-button" data-action="export-excel">Exportar Excel</button>
          <button class="primary-button" data-action="new-order">Nueva orden</button>
        </div>
      </div>
      <div class="gantt-panel ${managerGanttMobileOpen ? "mobile-gantt-open" : ""}">
        <div class="gantt-mobile-gate">
          <div>
            <strong>Carta Gantt aplicaciones</strong>
            <span>Para verla mejor en celular, toca el botón y gira el teléfono en horizontal.</span>
          </div>
          <button class="primary-button" type="button" data-action="toggle-mobile-gantt" aria-expanded="${managerGanttMobileOpen ? "true" : "false"}">${managerGanttMobileOpen ? "Ocultar Gantt" : "Ver Gantt"}</button>
        </div>
        <div class="gantt-head">
          <div>
          <h3>Carta Gantt por especie y potrero</h3>
            <p>Planifica por dia o revisa el año completo. Un potrero puede tener varias órdenes en fechas distintas.</p>
          </div>
          <div class="gantt-controls">
            <label>Potrero
              <select id="managerPotreroFilter">${managerPotreros.map((potrero) => `<option value="${htmlAttr(potrero)}" ${potrero === managerPotreroFilter ? "selected" : ""}>${potrero}</option>`).join("")}</select>
            </label>
            <fieldset class="gantt-species-filter">
              <legend>Especie</legend>
              ${managerSpecies.map((species) => `<label><input class="manager-species-filter" type="checkbox" value="${htmlAttr(species)}" ${managerSpeciesFilters.has(species) ? "checked" : ""}> ${species}</label>`).join("")}
            </fieldset>
            <label>Vista
              <select id="managerModeFilter">
                <option value="month" ${managerGanttMode === "month" ? "selected" : ""}>Mes detallado</option>
                <option value="year" ${managerGanttMode === "year" ? "selected" : ""}>Año completo</option>
              </select>
            </label>
            <label>Año
              <select id="managerYearFilter">${availableYears.sort((a, b) => b.localeCompare(a)).map((year) => `<option value="${year}" ${year === managerYear ? "selected" : ""}>${year}</option>`).join("")}</select>
            </label>
            <label class="${managerGanttMode === "year" ? "muted-control" : ""}">Mes
              <select id="managerMonthFilter" ${managerGanttMode === "year" ? "disabled" : ""}>${monthOptions().map((month) => `<option value="${month.value}" ${month.value === managerMonth ? "selected" : ""}>${month.label}</option>`).join("")}</select>
            </label>
            <label>Estado
              <select id="managerStatusFilter">${statusFilterOptions(managerStatusFilter)}</select>
            </label>
          </div>
        </div>
        <p class="gantt-mobile-hint">Gira el celular en horizontal y desliza la carta hacia los lados. Toca una barra para ver el detalle.</p>
        ${gantt}
        ${ganttStatusLegend()}
        <div class="gantt-bottom-filter">
          <label>Ordenar / ver por mes
            <select id="managerMonthBottomFilter">${orderListMonthOptions(managerOrdersMonth)}</select>
          </label>
          <small>Este filtro ordena/filtra solo las órdenes de abajo. La Carta Gantt mantiene sus propios filtros superiores.</small>
        </div>
      </div>
      <div class="order-grid">${rows}</div>
    </section>
  `;
  views.manager.querySelector(".gantt-head h3").textContent = "CARTA GANTT APLICACIONES";
  views.manager.querySelector(".gantt-head p")?.remove();
  document.getElementById("managerYearFilter")?.addEventListener("change", (event) => {
    managerYear = event.target.value;
    renderManager();
  });
  document.getElementById("managerMonthFilter")?.addEventListener("change", (event) => {
    managerMonth = event.target.value;
    renderManager();
  });
  document.getElementById("managerMonthBottomFilter")?.addEventListener("change", (event) => {
    managerOrdersMonth = event.target.value;
    renderManager();
  });
  document.getElementById("managerModeFilter")?.addEventListener("change", (event) => {
    managerGanttMode = event.target.value;
    renderManager();
  });
  document.getElementById("managerStatusFilter")?.addEventListener("change", (event) => {
    managerStatusFilter = event.target.value;
    renderManager();
  });
  document.getElementById("managerPotreroFilter")?.addEventListener("change", (event) => {
    managerPotreroFilter = event.target.value;
    renderManager();
  });
  document.querySelectorAll(".manager-species-filter").forEach((input) => {
    input.addEventListener("change", () => {
      if (input.value === "Todas" && input.checked) {
        managerSpeciesFilters = new Set(["Todas"]);
      } else {
        const selected = [...document.querySelectorAll(".manager-species-filter:checked")]
          .map((item) => item.value)
          .filter((item) => item !== "Todas");
        managerSpeciesFilters = selected.length ? new Set(selected) : new Set(["Todas"]);
      }
      renderManager();
    });
  });
}

function managerGantt(orders) {
  const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  if (managerGanttMode === "month") return managerMonthGantt(orders);
  const groups = ganttGroupsByPotrero(orders);
  return `
    <div class="gantt-table">
      <div class="gantt-row gantt-months">
        <span>Especie / Potrero</span>
        <div class="gantt-month-grid">${months.map((month) => `<b>${month}</b>`).join("")}</div>
      </div>
      ${groups.map((group) => {
        return `
          <div class="gantt-row">
            <span><strong>${group.potrero}</strong><small>${group.species} · Ordenes ${group.orders.map((order) => `#${order.number}`).join(", ")}</small></span>
            <div class="gantt-month-grid gantt-track">
              ${months.map((_, index) => {
                const month = String(index + 1).padStart(2, "0");
                const monthOrders = group.orders.filter((order) => orderOverlapsMonth(order, managerYear, month));
                return `<span class="gantt-stack">${monthOrders.map((order) => ganttMarker(order)).join("")}</span>`;
              }).join("")}
            </div>
          </div>
        `;
      }).join("") || `<div class="empty">No hay ordenes planificadas para ${managerYear}.</div>`}
    </div>
  `;
}

function managerMonthGantt(orders) {
  const daysInMonth = new Date(Number(managerYear), Number(managerMonth), 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, index) => index + 1);
  const groups = ganttGroupsByPotrero(orders);
  return `
    <div class="gantt-table gantt-table-month">
      <div class="gantt-row gantt-month-detail gantt-month-header">
        <span>Especie / Potrero</span>
        <div class="gantt-day-grid" style="--days:${daysInMonth}">${days.map((day) => `<b>${day}</b>`).join("")}</div>
      </div>
      ${groups.map((group) => {
        return `
          <div class="gantt-row gantt-month-detail ${group.orders.some((order) => selectedGanttOrderId === order.id) ? "selected" : ""}">
            <span><strong>${group.potrero}</strong><small>${group.species} · Ordenes ${group.orders.map((order) => `#${order.number}`).join(", ")}</small></span>
            <div class="gantt-day-grid gantt-day-track" style="--days:${daysInMonth};--rows:${Math.max(1, group.orders.filter((order) => orderOverlapsMonth(order, managerYear, managerMonth)).length)}">
              ${group.orders
                .filter((order) => orderOverlapsMonth(order, managerYear, managerMonth))
                .map((order, index) => ganttRangeMarker(order, index, daysInMonth))
                .join("")}
            </div>
          </div>
        `;
      }).join("") || `<div class="empty">No hay ordenes planificadas para ${monthOptions().find((item) => item.value === managerMonth)?.label} ${managerYear}.</div>`}
    </div>
  `;
}


function ganttSpeciesLabel(order) {
  return order.crop || order.cultivo || "Sin especie";
}

function potreroSortParts(potrero) {
  const text = String(potrero || "Sin potrero").trim();
  const numberMatch = text.match(/\d+(?:[\.,]\d+)?/);
  return {
    text,
    number: numberMatch ? Number(numberMatch[0].replace(",", ".")) : Number.MAX_SAFE_INTEGER,
    prefix: normalizeText(text.replace(/\d+(?:[\.,]\d+)?/, "")).replace(/\s+/g, " ")
  };
}

function comparePotreroNatural(a, b) {
  const pa = potreroSortParts(a);
  const pb = potreroSortParts(b);
  const prefixCompare = pa.prefix.localeCompare(pb.prefix, "es", { numeric: true, sensitivity: "base" });
  if (prefixCompare) return prefixCompare;
  if (pa.number !== pb.number) return pa.number - pb.number;
  return pa.text.localeCompare(pb.text, "es", { numeric: true, sensitivity: "base" });
}

function compareGanttGroups(a, b) {
  const speciesCompare = a.species.localeCompare(b.species, "es", { numeric: true, sensitivity: "base" });
  if (speciesCompare) return speciesCompare;
  return comparePotreroNatural(a.potrero, b.potrero);
}

function ganttGroupsByPotrero(orders) {
  return Object.values(orders.reduce((acc, order) => {
    const potrero = order.potrero || "Sin potrero";
    const species = ganttSpeciesLabel(order);
    const key = `${species}__${potrero}`;
    acc[key] ||= { species, potrero, orders: [] };
    acc[key].orders.push(order);
    return acc;
  }, {}))
    .map((group) => ({ ...group, orders: sortOrdersNewestFirst(group.orders) }))
    .sort(compareGanttGroups);
}

function groupPrograms(group) {
  return [...new Set(group.orders.flatMap((order) => order.programNumbers?.length ? order.programNumbers : [order.programNumber]).filter(Boolean))].join(", ") || "-";
}


function ganttStateColor(key) {
  const colors = {
    cancelled: "#ef4444",
    done: "#16a34a",
    process: "#2563eb",
    pending: "#facc15"
  };
  return colors[key] || "#2563eb";
}

function ganttMarker(order, extraStyle = "") {
  const progress = plannedLiters(order) ? Math.min(100, dispatchedLiters(order) / plannedLiters(order) * 100) : 0;
  const stateInfo = ganttState(order);
  const productLines = order.recipe.map((line) => {
    const product = getProduct(line.productId);
    if (!product) return "";
    return `- ${product.name}`;
  }).filter(Boolean);
  const progressLabel = `${Math.round(progress)}%`;
  const tooltip = [
    `Orden #${order.number}`,
    `Estado actual: ${stateInfo.label}`,
    `Avance: ${progressLabel}`,
    `Objetivo / descripción: ${order.objective || "Sin objetivo"}`,
    order.notes ? `Nota: ${order.notes}` : "Nota: -",
    "Productos:",
    productLines.length ? productLines.join("\n") : "-"
  ].join("\n");
  return `<i class="active ${stateInfo.key}" data-action="select-gantt-order" data-id="${order.id}" style="--progress:${progress}%;--program-color:${programColor(order)};--gantt-state-color:${ganttStateColor(stateInfo.key)};${extraStyle}" data-tooltip="${htmlAttr(tooltip)}"><span>#${order.number}</span></i>`;
}

function ganttRangeMarker(order, index, daysInMonth) {
  const start = orderStartDate(order);
  const end = orderEndDate(order);
  const monthStart = `${managerYear}-${managerMonth}-01`;
  const monthEnd = `${managerYear}-${managerMonth}-${String(daysInMonth).padStart(2, "0")}`;
  const clampedStart = start && start > monthStart ? start : monthStart;
  const clampedEnd = end && end < monthEnd ? end : monthEnd;
  const startDay = Math.max(1, Number(clampedStart.slice(8, 10)) || 1);
  const endDay = Math.min(daysInMonth, Number(clampedEnd.slice(8, 10)) || startDay);
  const span = Math.max(1, endDay - startDay + 1);
  return ganttMarker(order, `grid-column:${startDay} / span ${span};grid-row:${index + 1};`);
}

function programColor(order) {
  return programColorForNumber(order.programNumbers?.[0] || order.programNumber || 0);
}

function programColorForNumber(numberValue) {
  const number = Number(numberValue);
  const palette = {
    1: "#1f7a43",
    2: "#1f5fbf",
    3: "#c48a15",
    4: "#9a3fb5",
    5: "#c84632",
    6: "#287b82"
  };
  return palette[number] || "#333333";
}

function programColorLegend(orders) {
  const numbers = [...new Set(orders.flatMap((order) => order.programNumbers?.length ? order.programNumbers : [order.programNumber]).filter(Boolean))].sort((a, b) => Number(a) - Number(b));
  if (!numbers.length) return "";
  return `
    <div class="program-color-legend">
      ${numbers.map((numberValue) => {
        const program = state.programs.find((item) => String(item.number) === String(numberValue));
        return `<span style="--program-color:${programColorForNumber(numberValue)}"><i></i>Programa ${numberValue}</span>`;
      }).join("")}
    </div>
  `;
}


function ganttStatusLegend() {
  const statuses = [
    ["cancelled", "Cancelada", "#ef4444"],
    ["done", "Completa / Terminada", "#16a34a"],
    ["process", "En proceso", "#2563eb"],
    ["pending", "Pendiente", "#facc15"]
  ];
  return `
    <div class="gantt-status-legend">
      ${statuses.map(([key, label, color]) => `<span class="${key}" style="--gantt-state-color:${color}"><i></i>${label}</span>`).join("")}
    </div>
  `;
}

function ganttDetail() {
  const order = state.orders.find((item) => item.id === selectedGanttOrderId);
  if (!order) return `<div class="gantt-detail empty">Selecciona una orden de la Gantt para ver el detalle del dia.</div>`;
  return `
    <div class="gantt-detail">
      <div>
        <span class="overline">Detalle del dia ${orderStartDate(order) || "-"} - ${ganttState(order).label}</span>
        <h3>Orden #${order.number} - ${order.potrero}</h3>
        <p>${programLabel(order)} - ${order.objective || "Sin objetivo"}</p>
      </div>
      <div class="gantt-detail-grid">
        <span><strong>Bloques</strong>${order.blocks?.join(", ") || "-"}</span>
        <span><strong>Especie</strong>${order.crop || "-"} ${order.variety || ""}</span>
        <span><strong>Has</strong>${number(order.hectares)} ha</span>
        <span><strong>Mojamiento</strong>${number(plannedLiters(order), 0)} L</span>
        <span><strong>Salida</strong>${number(dispatchedLiters(order), 0)} L</span>
        <span><strong>Avance</strong>${number(plannedLiters(order) ? Math.min(100, dispatchedLiters(order) / plannedLiters(order) * 100) : 0, 0)}%</span>
      </div>
      ${order.notes ? `<div class="gantt-detail-note"><strong>Nota de la orden</strong><p>${escapeHtml(order.notes)}</p></div>` : ""}
      <div class="recipe-list">
        ${order.recipe.map((line) => {
          const product = getProduct(line.productId);
          return `<span>${product?.name || "Producto"}: ${number(productHaFromDose(order, line))} ${product?.unit || ""}/ha - ${number(plannedProduct(order, line))} total - salido ${number(dispatchedProduct(order, line.productId))}</span>`;
        }).join("")}
      </div>
      <div class="card-actions">
        <button class="secondary-button" data-action="edit-order" data-id="${order.id}">Editar orden</button>
        <button class="secondary-button" data-action="open-dispatch-info" data-id="${order.id}">Información de salida</button>
        ${!["closed", "cancelled"].includes(effectiveOrderStatus(order)) ? `<button class="danger-button" data-action="finish-order" data-id="${order.id}">Terminar orden</button>` : ""}
        ${!["closed", "cancelled"].includes(effectiveOrderStatus(order)) ? `<button class="danger-button cancel-order-button" data-action="cancel-order" data-id="${order.id}">Cancelar orden</button>` : ""}
        <button class="secondary-button" data-action="print-order" data-id="${order.id}">PDF orden</button>
      </div>
    </div>
  `;
}

function monthOptions() {
  return [
    ["01", "Enero"], ["02", "Febrero"], ["03", "Marzo"], ["04", "Abril"],
    ["05", "Mayo"], ["06", "Junio"], ["07", "Julio"], ["08", "Agosto"],
    ["09", "Septiembre"], ["10", "Octubre"], ["11", "Noviembre"], ["12", "Diciembre"]
  ].map(([value, label]) => ({ value, label }));
}


function normalizeText(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}


async function ensureVehicleCodesLoaded() {
  try {
    // Fuente unica para el selector Codigo tractor de Bodega.
    // Consulta public.vehiculos y muestra TODOS los codigos registrados.
    const vehicles = await sbSelect(
      "vehiculos",
      "select=id,clasificacion,tipo_vehiculo,marca,modelo,numero_serie,anio,codigo&codigo=not.is.null&order=codigo.asc"
    );

    state.vehicles = (vehicles || []).map((vehicle) => ({
      id: vehicle.id,
      classification: vehicle.clasificacion || "",
      type: vehicle.tipo_vehiculo || "",
      brand: vehicle.marca || "",
      model: vehicle.modelo || "",
      serialNumber: vehicle.numero_serie || "",
      year: vehicle.anio || "",
      code: String(vehicle.codigo || "").trim()
    })).filter((vehicle) => vehicle.code);

    return state.vehicles;
  } catch (error) {
    console.warn("No se pudieron cargar los codigos desde public.vehiculos", error);
    showToast(`No se pudieron cargar codigos de vehiculos: ${error.message}`);
    return state.vehicles || [];
  }
}

function vehicleOptionLabel(vehicle) {
  const code = String(vehicle.code || vehicle.codigo || "").trim();
  const type = vehicle.type || vehicle.tipo_vehiculo || "";
  const brand = vehicle.brand || vehicle.marca || "";
  const model = vehicle.model || vehicle.modelo || "";
  const detail = `${brand} ${model}`.trim();
  return `${code}${type ? ` - ${type}` : ""}${detail ? ` - ${detail}` : ""}`;
}

function tractorCodeOptions(selected = "") {
  const selectedValue = String(selected || "");
  const vehicles = (state.vehicles || [])
    .filter((vehicle) => String(vehicle.code || vehicle.codigo || "").trim())
    .sort((a, b) => String(a.code || a.codigo || "").localeCompare(String(b.code || b.codigo || ""), "es", { numeric: true }));

  if (!vehicles.length) {
    return `<option value="">Cargando codigos...</option>`;
  }

  const options = [`<option value="">Seleccionar codigo</option>`];
  const knownCodes = new Set(vehicles.map((vehicle) => String(vehicle.code || vehicle.codigo || "").trim()));

  if (selectedValue && !knownCodes.has(selectedValue)) {
    const option = document.createElement("option");
    option.value = selectedValue;
    option.textContent = `${selectedValue} - guardado actualmente`;
    option.selected = true;
    options.push(option.outerHTML);
  }

  vehicles.forEach((vehicle) => {
    const code = String(vehicle.code || vehicle.codigo || "").trim();
    const option = document.createElement("option");
    option.value = code;
    option.textContent = vehicleOptionLabel(vehicle);
    option.selected = code === selectedValue;
    options.push(option.outerHTML);
  });

  return options.join("");
}

async function refreshVehicleCodeSelect(select, selected = "") {
  if (!select) return;
  select.innerHTML = `<option value="">Cargando codigos...</option>`;

  try {
    await ensureVehicleCodesLoaded();
    const selectedValue = String(selected || "");
    const vehicles = (state.vehicles || [])
      .filter((vehicle) => String(vehicle.code || vehicle.codigo || "").trim())
      .sort((a, b) => String(a.code || a.codigo || "").localeCompare(String(b.code || b.codigo || ""), "es", { numeric: true }));

    select.innerHTML = "";

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = vehicles.length ? "Seleccionar codigo" : "Sin codigos disponibles";
    select.appendChild(placeholder);

    const knownCodes = new Set(vehicles.map((vehicle) => String(vehicle.code || vehicle.codigo || "").trim()));
    if (selectedValue && !knownCodes.has(selectedValue)) {
      const savedOption = document.createElement("option");
      savedOption.value = selectedValue;
      savedOption.textContent = `${selectedValue} - guardado actualmente`;
      savedOption.selected = true;
      select.appendChild(savedOption);
    }

    vehicles.forEach((vehicle) => {
      const code = String(vehicle.code || vehicle.codigo || "").trim();
      const option = document.createElement("option");
      option.value = code;
      option.textContent = vehicleOptionLabel(vehicle);
      option.selected = code === selectedValue;
      select.appendChild(option);
    });

    if (!vehicles.length) {
      showToast("Vehiculos devolvio 0 codigos. Si en SQL Editor si aparecen, falta la politica RLS SELECT para authenticated/anon.");
    }
  } catch (error) {
    select.innerHTML = `<option value="">Error cargando codigos</option>`;
    showToast(`Error cargando vehiculos: ${error.message}`);
  }
}

async function loadCloudData(options = {}) {
  if (!supabaseSession) return;
  const userId = supabaseSession.user?.id;

  // Primero se carga SOLO el perfil. Si mezclamos perfil + tablas en Promise.all,
  // Supabase puede bloquear las tablas por RLS antes de que el rol quede normalizado.
  const profiles = await sbSelect("usuarios", `select=*&id=eq.${userId}`);
  const profile = profiles[0] || null;

  if (!profile) {
    currentProfile = null;
    throw new Error("Tu usuario no existe en public.usuarios. Revisa que el ID sea igual al usuario de Authentication y que tenga rol admin/supervisor/bodeguero.");
  }
  if (profile.activo === false) {
    currentProfile = null;
    throw new Error("Tu usuario esta desactivado. Solicita activacion a un administrador.");
  }

  const normalizedProfileRole = normalizeRole(profile.rol || profile.role);
  currentProfile = {
    ...profile,
    full_name: profile.nombre_completo,
    area: normalizeRegistrationArea(profile.area),
    role: normalizedProfileRole,
    rol: normalizedProfileRole
  };

  // Si quedó un rol antiguo como jefe/encargado, intentamos guardarlo como supervisor.
  // Aunque falle por permisos, el frontend seguirá usando el rol normalizado.
  if (profile.rol && normalizedProfileRole !== String(profile.rol).trim().toLowerCase()) {
    try {
      await sbFetch(`/rest/v1/usuarios?id=eq.${userId}`, {
        method: "PATCH",
        prefer: "return=minimal",
        body: JSON.stringify({ rol: normalizedProfileRole })
      });
    } catch (error) {
      console.warn("No se pudo normalizar el rol del usuario en Supabase", error);
    }
  }

  const role = currentUserRole();
  const canSeePlanning = ["admin", "supervisor"].includes(role);

  // Cargar solo las tablas que el rol necesita. Esto evita que un bodeguero
  // pierda Bodega/Stock porque RLS bloquee modulos que no debe ver.
  const [seasons, programs, fields, products, orders, orderProducts, dispatches, dispatchProducts, stockMovements, vehicles, calicatas, irrigationRows, irrigationProgramRows, irrigationObservationRows, evaporationRows, weatherDailyRows, weatherFrostRows, weatherLatestRows, harvestRecords, harvestCrewSchedule, harvestJornales] = await Promise.all([
    canSeePlanning ? sbSelect("temporadas", "select=*&order=anio_inicio.desc") : Promise.resolve([]),
    canSeePlanning ? sbSelect("programas", "select=*&order=numero_programa.asc") : Promise.resolve([]),
    sbSelect("campos", "select=*&activo=eq.true&order=potrero.asc,bloque.asc"),
    sbSelect("productos", "select=*&activo=eq.true&order=nombre.asc"),
    sbSelect("ordenes_aplicacion", "select=*&order=creado_en.desc,fecha_planificada.desc,numero_orden.desc"),
    sbSelect("orden_productos", "select=*"),
    sbSelect("despachos", "select=*&order=fecha.asc"),
    sbSelect("despacho_productos", "select=*"),
    sbSelect("movimientos_stock", "select=*&order=fecha.asc"),
    sbSelect("vehiculos", "select=*&order=codigo.asc").catch((error) => {
      console.warn("Tabla vehiculos no disponible. Ejecuta supabase_vehiculos.sql", error);
      return [];
    }),
    sbSelect("calicatas", "select=*&order=created_at.desc").catch((error) => {
      console.warn("No se pudieron cargar calicatas", error);
      return [];
    }),
    sbSelectAll("riego", "select=id,campo_id,fecha,horas_riego,volumen,creado_por_nombre,modificado_por_nombre,modificado_en,actualizado_en,updated_at&order=fecha.asc,campo_id.asc")
      .catch((error) => {
        if (!isMissingSupabaseColumn(error, ["creado_por_nombre", "modificado_por_nombre", "modificado_en", "actualizado_en", "updated_at"])) throw error;
        return sbSelectAll("riego", "select=id,campo_id,fecha,horas_riego,volumen&order=fecha.asc,campo_id.asc");
      })
      .then((rows) => {
        irrigationCloudAvailable = true;
        return rows;
      })
      .catch((error) => {
        console.warn("No se pudieron cargar registros de riego", error);
        irrigationCloudAvailable = !String(error?.message || "").toLowerCase().includes("could not find the table");
        return null;
      }),
    sbSelectAll("programa_riego", "select=id,campo_id,fecha,horas_programadas,volumen_programado,creado_por_nombre,modificado_por_nombre,modificado_en,actualizado_en&order=fecha.asc,campo_id.asc")
      .catch((error) => {
        if (!isMissingSupabaseColumn(error, ["creado_por_nombre", "modificado_por_nombre", "modificado_en", "actualizado_en"])) throw error;
        return sbSelectAll("programa_riego", "select=id,campo_id,fecha,horas_programadas,volumen_programado&order=fecha.asc,campo_id.asc");
      })
      .then((rows) => {
        irrigationProgramCloudAvailable = true;
        return rows;
      })
      .catch((error) => {
        console.warn("No se pudo cargar programa de riego", error);
        irrigationProgramCloudAvailable = !String(error?.message || "").toLowerCase().includes("could not find the table");
        return null;
      }),
    sbSelectAll("observaciones_riego", "select=id,tipo,campo_id,fecha,observacion,creado_por,creado_por_nombre,actualizado_por,actualizado_por_nombre,creado_en,actualizado_en&order=fecha.asc")
      .catch((error) => {
        console.warn("No se pudieron cargar observaciones de riego", error);
        const message = String(error?.message || "").toLowerCase();
        irrigationObservationsCloudAvailable = !message.includes("could not find the table") && !message.includes("schema cache");
        return null;
      }),
    sbSelectAll("evaporacion_bandeja", "select=fecha,evaporacion,estacion&order=fecha.asc")
      .then((rows) => rows?.length ? rows : sbSelectAllPublic("evaporacion_bandeja", "select=fecha,evaporacion,estacion&order=fecha.asc"))
      .catch((error) => {
        console.warn("No se pudo cargar evaporacion de bandeja con sesion, probando lectura publica", error);
        return sbSelectAllPublic("evaporacion_bandeja", "select=fecha,evaporacion,estacion&order=fecha.asc").catch((publicError) => {
          console.warn("No se pudo cargar evaporacion de bandeja", publicError);
          return [];
        });
      }),
    sbSelectAll("v_estacion_climatica_diaria", "select=fecha,registros,temperatura_promedio,temperatura_minima,temperatura_maxima,horas_sobre_7,grados_dia_base_7,helada_0_menos_1,helada_menos_1_menos_2,helada_menor_igual_menos_2,helada_inicio,helada_termino&order=fecha.asc")
      .catch((error) => {
        if (!isMissingSupabaseColumn(error, ["helada_inicio", "helada_termino"])) throw error;
        return sbSelectAll("v_estacion_climatica_diaria", "select=fecha,registros,temperatura_promedio,temperatura_minima,temperatura_maxima,horas_sobre_7,grados_dia_base_7,helada_0_menos_1,helada_menos_1_menos_2,helada_menor_igual_menos_2&order=fecha.asc");
      })
      .then((rows) => {
        weatherStationCloudAvailable = true;
        return rows;
      })
      .catch((error) => {
        console.warn("No se pudo cargar el resumen de la estacion climatica", error);
        weatherStationCloudAvailable = false;
        return [];
      }),
    sbSelectAll("estacion_climatica", "select=fecha,hora,temp_out&temp_out=lte.0&order=fecha.asc,hora.asc")
      .catch((error) => {
        console.warn("No se pudieron cargar los horarios de helada", error);
        return [];
      }),
    sbSelect("estacion_climatica", "select=fecha,hora,temp_out,hi_temp,low_temp&order=fecha.desc,hora.desc&limit=1")
      .catch((error) => {
        console.warn("No se pudo cargar la ultima lectura de la estacion climatica", error);
        return [];
      }),
    sbSelectAll("registros_trazabilidad", "select=id,tipo_registro,num_bin,codigo_local,contratista,cuadrilla,cuartel,bloque,cuartel_sdp,bloque_sdp,sdp,especie,variedad,fecha_cosecha,fecha_escaneo,patente,conductor_nombre,fecha_despacho_camion,latitud,longitud,fecha_sincronizacion,ultima_sincronizacion&order=id.desc").catch((error) => {
      console.warn("No se pudieron cargar registros de cosecha", error);
      return [];
    }),
    sbSelect("v_programacion_cuadrillas_dia", "select=*").catch((error) => {
      console.warn("No se pudo cargar programacion de cuadrillas", error);
      return [];
    }),
    sbSelect("v_jornales_cuadrilla_dia", "select=*").catch((error) => {
      console.warn("No se pudieron cargar jornales de cosecha", error);
      return [];
    })
  ]);
  state.seasons = seasons.map((season) => ({
    id: season.id,
    name: season.nombre,
    startYear: season.anio_inicio,
    endYear: season.anio_fin,
    status: season.estado
  }));
  state.settings.currentSeasonId = state.seasons[0]?.id || "";
  state.settings.season = state.seasons[0]?.name || state.settings.season;
  state.programs = programs.map((program) => ({
    id: program.id,
    seasonId: program.temporada_id,
    number: program.numero_programa,
    name: program.nombre,
    crop: program.cultivo,
    objective: program.objetivo,
    startDate: program.fecha_inicio || "",
    endDate: program.fecha_termino || "",
    waterHa: Number(program.agua_por_ha) || 0
  }));
  state.blocks = fields.map((field) => ({
    id: field.id,
    potrero: field.potrero,
    block: field.bloque,
    crop: field.especie || field.cultivo,
    variety: field.variedad,
    hectares: Number(field.hectareas) || 0,
    precipitation: field.precipitacion === null || field.precipitacion === undefined ? null : Number(field.precipitacion),
    flow: field.caudal === null || field.caudal === undefined ? null : Number(field.caudal),
    active: field.activo !== false,
    plants: Number(field.plantas) || 0,
    plantsPerHa: Number(field.plantas_por_ha) || 0
  }));
  state.calicatas = calicatas.map((item) => ({
    id: item.id,
    workerId: item.trabajador_id || "",
    workerName: item.trabajador_nombre || "",
    potrero: item.potrero || "",
    block: item.bloque || "",
    depth20: item.profundidad_20 === null ? null : Number(item.profundidad_20),
    depth40: item.profundidad_40 === null ? null : Number(item.profundidad_40),
    depth60: item.profundidad_60 === null ? null : Number(item.profundidad_60),
    depth80: item.profundidad_80 === null ? null : Number(item.profundidad_80),
    latitude: item.latitud,
    longitude: item.longitud,
    photoUrl: item.foto_url || "",
    createdAt: item.created_at || "",
    empty: Boolean(item.vacio),
    observation: item.observacion || ""
  }));
  if (Array.isArray(irrigationRows)) applyIrrigationRecords(irrigationRows);
  if (Array.isArray(irrigationProgramRows)) applyIrrigationProgramRecords(irrigationProgramRows);
  if (Array.isArray(irrigationObservationRows)) applyIrrigationObservationRecords(irrigationObservationRows);
  state.irrigationEvaporation = mapEvaporationRows(evaporationRows);
  const frostWindowsByDate = weatherStationFrostWindowsByDate(weatherFrostRows || []);
  state.weatherStationDaily = (weatherDailyRows || []).map((item) => ({
    date: item.fecha || "",
    records: Number(item.registros) || 0,
    average: Number(item.temperatura_promedio) || 0,
    minimum: Number(item.temperatura_minima),
    maximum: Number(item.temperatura_maxima),
    hoursAbove7: Number(item.horas_sobre_7) || 0,
    degreeDays: Number(item.grados_dia_base_7) || 0,
    frost0ToMinus1: Number(item.helada_0_menos_1) || 0,
    frostMinus1ToMinus2: Number(item.helada_menos_1_menos_2) || 0,
    frostBelowMinus2: Number(item.helada_menor_igual_menos_2) || 0,
    frostStart: frostWindowsByDate.get(item.fecha)?.start || item.helada_inicio || "",
    frostEnd: frostWindowsByDate.get(item.fecha)?.end || item.helada_termino || "",
    frostWindows: frostWindowsByDate.get(item.fecha)?.label || ""
  })).filter((item) => item.date && Number.isFinite(item.minimum) && Number.isFinite(item.maximum));
  const latestWeather = weatherLatestRows?.[0];
  state.weatherStationLatest = latestWeather ? {
    date: latestWeather.fecha || "",
    time: latestWeather.hora || "",
    tempOut: Number(latestWeather.temp_out),
    hiTemp: Number(latestWeather.hi_temp),
    lowTemp: Number(latestWeather.low_temp)
  } : null;
  const mapHarvestRecord = (item, source = "operativo") => {
    const scanDate = harvestScanDateFromItem(item);
    return {
      id: `${source}-${item.id || item.num_bin || item.codigo_local}`,
      source,
      type: item.tipo_registro || "",
      numBin: item.num_bin || "",
      localCode: item.codigo_local || "",
      contractor: item.contratista || "",
      crew: item.cuadrilla || "",
      field: item.cuartel || item.cuartel_sdp || "",
      block: item.bloque || item.bloque_sdp || "",
      realField: item.cuartel || "",
      realBlock: item.bloque || "",
      sdpField: item.cuartel_sdp || "",
      sdpBlock: item.bloque_sdp || "",
      sdp: item.sdp || "",
      crop: item.especie || "",
      variety: item.variedad || "",
      harvestDate: item.fecha_cosecha || "",
      scanDate,
      truckPlate: item.patente || "",
      driverName: item.conductor_nombre || "",
      dispatchDate: item.fecha_despacho_camion || "",
      latitude: item.latitud === null || item.latitud === undefined ? null : Number(item.latitud),
      longitude: item.longitud === null || item.longitud === undefined ? null : Number(item.longitud),
      createdAt: firstHarvestDateValue(item, ["creado_en", "created_at", "fecha_sincronizacion", "ultima_sincronizacion", "actualizado_en"])
    };
  };
  state.harvestRecords = harvestRecords.map((item) => mapHarvestRecord(item, "operativo"));
  state.harvestOfficialRecords = [];
  state.harvestCrewSchedule = harvestCrewSchedule.map((item) => ({
    date: item.fecha || item.fecha_cosecha || "",
    contractor: item.nombre_empresa || item.contratista || "",
    crew: item.codigo_cuadrilla || item.cuadrilla || ""
  }));
  state.harvestJornales = harvestJornales.map((item) => ({
    id: item.id,
    date: item.fecha || "",
    workerName: `${item.nombre_jornal || ""} ${item.apellido_jornal || ""}`.trim(),
    workerRut: item.rut_jornal || "",
    capachoCode: item.codigo_capacho || "",
    contractor: item.nombre_empresa || item.contratista || "",
    crew: item.codigo_cuadrilla || item.cuadrilla || "",
    active: item.activo !== false
  })).filter((item) => item.active);
  state.products = products.map((product) => ({
    id: product.id,
    name: product.nombre,
    ingredient: product.ingrediente_activo,
    unit: product.unidad,
    dose100: Number(product.dosis_por_100) || 0,
    reentryHours: product.horas_reingreso,
    carencyDays: product.dias_carencia,
    stock: Number(product.stock_actual) || 0,
    minStock: Number(product.stock_minimo) || 0,
    cost: Number(product.costo_unitario) || 0,
    sackPrice: Number(product.precio_saco) || 0,
    kgPerSack: Number(product.kg_por_saco) || 0,
    lot: product.lote,
    expires: product.fecha_vencimiento
  }));
  state.vehicles = vehicles.map((vehicle) => ({
    id: vehicle.id,
    classification: vehicle.clasificacion,
    type: vehicle.tipo_vehiculo,
    brand: vehicle.marca,
    model: vehicle.modelo,
    serialNumber: vehicle.numero_serie,
    year: vehicle.anio,
    code: String(vehicle.codigo || "")
  }));
  const productsByOrder = groupBy(orderProducts, "orden_id");
  const dispatchProductsByDispatch = groupBy(dispatchProducts, "despacho_id");
  const dispatchesByOrder = groupBy(dispatches, "orden_id");
  state.orders = sortOrdersNewestFirst(orders.map((order) => ({
    id: order.id,
    number: order.numero_orden,
    seasonId: order.temporada_id,
    programNumber: order.numero_programa || "",
    programNumbers: order.numeros_programa?.length ? order.numeros_programa : [order.numero_programa].filter(Boolean),
    program: order.nombre_programa || "",
    classification: order.clasificacion || "",
    date: order.fecha_inicio || order.fecha_planificada || order.fecha,
    plannedDate: order.fecha_inicio || order.fecha_planificada || order.fecha,
    fechaInicio: order.fecha_inicio || order.fecha_planificada || order.fecha,
    endDate: order.fecha_fin_planificada || order.fecha_inicio || order.fecha_planificada || order.fecha,
    objective: order.objetivo,
    crop: order.cultivo,
    variety: order.variedad,
    potrero: order.potrero,
    blocks: order.bloques || [],
    hectares: Number(order.hectareas) || 0,
    waterHa: Number(order.agua_por_ha) || 0,
    pressure: order.presion,
    nozzle: order.boquilla,
    speed: order.velocidad,
    tractorCode: order.codigo_tractor,
    machineCode: order.codigo_maquina,
    dosifier: order.dosificador,
    status: fromDbOrderStatus(order.estado),
    dbStatus: fromDbOrderStatus(order.estado),
    finishedByManager: Boolean(order.finalizada_por_jefe),
    dbFinishedByManager: Boolean(order.finalizada_por_jefe),
    createdAt: order.creado_en || order.created_at || order.fecha_creacion || "",
    notes: "",
    operatorId: "",
    sprayerId: "",
    tractorId: "",
    recipe: (productsByOrder[order.id] || []).map((line) => ({
      id: line.id,
      productId: line.producto_id,
      programNumber: line.numero_programa || order.numero_programa || "",
      dose100: Number(line.dosis_por_100) || 0,
      productHaProgram: Number(line.producto_por_ha_programa) || 0,
      totalProgram: Number(line.total_programa) || 0
    })),
    dispatches: (dispatchesByOrder[order.id] || []).map((dispatch) => ({
      id: dispatch.id,
      type: dispatch.tipo,
      date: dispatch.fecha,
      time: dispatch.hora_salida || extractTimeValue(dispatch.fecha) || extractTimeValue(dispatch.creado_en || dispatch.created_at),
      createdAt: dispatch.creado_en || dispatch.created_at || "",
      liters: Number(dispatch.litros) || 0,
      tractorCode: dispatch.codigo_tractor || dispatch.tractor || dispatch.tractor_code || "",
      machineCode: dispatch.codigo_maquina || dispatch.maquina || dispatch.machine_code || "",
      operatorId: dispatch.aplicador_id || dispatch.aplicador || dispatch.operator_id || "",
      note: dispatch.nota,
      products: Object.fromEntries((dispatchProductsByDispatch[dispatch.id] || []).map((item) => [item.producto_id, Number(item.cantidad) || 0]))
    })),
    tanks: [],
    movements: []
  })).map((order) => {
    syncOrderStatus(order);
    return order;
  }));
  state.inventoryMovements = stockMovements.map((movement) => ({
    id: movement.id,
    date: movement.fecha,
    type: movement.tipo,
    productId: movement.producto_id,
    orderId: movement.orden_id,
    dispatchId: movement.despacho_id,
    quantity: Number(movement.cantidad) || 0,
    unitCost: Number(movement.costo_unitario) || 0,
    sacks: Number(movement.sacos) || 0,
    kgPerSack: Number(movement.kg_por_saco) || 0,
    sackPrice: Number(movement.precio_saco) || 0,
    lot: movement.lote,
    note: movement.nota
  }));
  state = normalizeState(state);
  await reconcileCloudOrderStatuses();
  applyRoleNavigation();
  saveState();
  render();
  document.getElementById("authButton").textContent = `${roleLabel(currentProfile?.role) || "Supabase"}: ${currentProfile?.full_name || supabaseSession.user?.email || ""}`;
  document.getElementById("storageStatus").textContent = `Supabase conectado ${new Date().toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}`;
  setAuthGate(false);
}

function hasOpenModal() {
  return Boolean(document.querySelector("dialog[open]"));
}

function createRealtimeClient() {
  if (!window.supabase?.createClient || !supabaseSession?.access_token) return null;
  const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    },
    global: {
      headers: {
        Authorization: `Bearer ${supabaseSession.access_token}`
      }
    }
  });
  client.realtime?.setAuth?.(supabaseSession.access_token);
  return client;
}

function scheduleRealtimeCloudReload(reason = "cambio remoto") {
  if (!supabaseSession || document.hidden || hasOpenModal()) return;
  clearTimeout(cloudRealtimeReloadTimer);
  cloudRealtimeReloadTimer = setTimeout(async () => {
    if (!supabaseSession || cloudSyncInProgress || document.hidden || hasOpenModal()) return;
    cloudSyncInProgress = true;
    try {
      await loadCloudData({ source: "realtime" });
      document.getElementById("storageStatus").textContent = `Supabase sincronizado por ${reason} ${new Date().toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}`;
    } catch (error) {
      console.warn("No se pudo sincronizar Supabase Realtime", error);
    } finally {
      cloudSyncInProgress = false;
    }
  }, 900);
}

function startCloudSync() {
  stopCloudSync();

  const realtimeTables = [
    "campos",
    "calicatas",
    "riego",
    "programa_riego",
    "observaciones_riego",
    "evaporacion_bandeja",
    "estacion_climatica",
    "monitoreo_plagas",
    "registros_trazabilidad",
    "ordenes_aplicacion",
    "orden_productos",
    "despachos",
    "despacho_productos",
    "movimientos_stock",
    "productos",
    "programas",
    "vehiculos",
    "usuarios"
  ];

  cloudRealtimeClient = createRealtimeClient();
  if (!cloudRealtimeClient) {
    document.getElementById("storageStatus").textContent = "Supabase conectado · Realtime no disponible";
    return;
  }

  cloudRealtimeChannels = realtimeTables.map((table) => {
    return cloudRealtimeClient
      .channel(`agrocore-${table}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        () => {
          if (table === "monitoreo_plagas") {
            pestMonitoringRecords = null;
            pestMonitoringLoadError = "";
            pestMonitoringDataSource = "";
            if (currentView === "pestMonitoring") renderPestMonitoring();
            return;
          }
          scheduleRealtimeCloudReload(table);
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          document.getElementById("storageStatus").textContent = "Supabase Realtime activo";
        }
      });
  });
}

function stopCloudSync() {
  clearTimeout(cloudRealtimeReloadTimer);
  cloudRealtimeReloadTimer = null;

  if (cloudSyncTimer) {
    clearInterval(cloudSyncTimer);
    cloudSyncTimer = null;
  }

  if (cloudRealtimeClient && cloudRealtimeChannels.length) {
    cloudRealtimeChannels.forEach((channel) => {
      try { cloudRealtimeClient.removeChannel(channel); } catch {}
    });
  }
  cloudRealtimeChannels = [];
  cloudRealtimeClient = null;
}

async function reconcileCloudOrderStatuses() {
  if (!supabaseSession) return;
  const updates = state.orders
    .filter((order) => isUuid(order.id))
    .filter((order) => order.status !== order.dbStatus || Boolean(order.finishedByManager) !== Boolean(order.dbFinishedByManager))
    .map((order) => sbFetch(`/rest/v1/ordenes_aplicacion?id=eq.${order.id}`, {
      method: "PATCH",
      prefer: "return=minimal",
      body: JSON.stringify({ estado: toDbOrderStatus(order.status), finalizada_por_jefe: Boolean(order.finishedByManager) })
    }));
  if (updates.length) await Promise.allSettled(updates);
}

function groupBy(rows, key) {
  return rows.reduce((acc, row) => {
    acc[row[key]] ||= [];
    acc[row[key]].push(row);
    return acc;
  }, {});
}

function applyRoleNavigation() {
  const role = currentUserRole();
  const allowed = visibleViewsForRole(role);

  document.querySelectorAll(".nav-item").forEach((button) => {
    const view = button.dataset.view;
    button.hidden = Boolean(supabaseSession && !allowed.has(view));
  });

  // Los maestros internos siguen ocultos en la barra principal; admin/supervisor conservan permisos por codigo.
  document.querySelector('[data-view="masters"]')?.setAttribute("hidden", "true");

  if (supabaseSession && !allowed.has(currentView)) {
    switchView(defaultViewForRole(role));
  }
}

async function cloudSaveOrder(order) {
  syncOrderStatus(order);
  const programDefinition = getProgramDefinition(order);
  const body = {
    id: isUuid(order.id) ? order.id : undefined,
    temporada_id: order.seasonId,
    programa_id: isUuid(programDefinition?.id) ? programDefinition.id : null,
    numero_orden: order.number,
    numero_programa: order.programNumber || null,
    numeros_programa: order.programNumbers?.length ? order.programNumbers : null,
    nombre_programa: null,
    clasificacion: order.classification || null,
    fecha: orderStartDate(order),
    fecha_planificada: orderStartDate(order),
    fecha_fin_planificada: order.endDate || orderStartDate(order),
    objetivo: order.objective,
    cultivo: order.crop,
    variedad: order.variety,
    potrero: order.potrero,
    bloques: order.blocks || [],
    hectareas: order.hectares || 0,
    agua_por_ha: order.waterHa || 0,
    presion: order.pressure || null,
    boquilla: order.nozzle || null,
    velocidad: order.speed || null,
    codigo_tractor: order.tractorCode || null,
    codigo_maquina: order.machineCode || null,
    dosificador: order.dosifier || null,
    estado: toDbOrderStatus(effectiveOrderStatus(order)),
    finalizada_por_jefe: Boolean(order.finishedByManager),
    creado_por: supabaseSession.user?.id
  };
  let saved;
  try {
    saved = await sbFetch("/rest/v1/ordenes_aplicacion?select=*", {
      method: "POST",
      prefer: "resolution=merge-duplicates,return=representation",
      body: JSON.stringify([body])
    });
  } catch (error) {
    const optionalColumns = ["numeros_programa", "fecha_fin_planificada", "finalizada_por_jefe", "clasificacion"];
    if (!isMissingSupabaseColumn(error, optionalColumns)) throw error;
    const fallbackBody = { ...body };
    optionalColumns.forEach((column) => delete fallbackBody[column]);
    saved = await sbFetch("/rest/v1/ordenes_aplicacion?select=*", {
      method: "POST",
      prefer: "resolution=merge-duplicates,return=representation",
      body: JSON.stringify([fallbackBody])
    });
    showToast("Orden guardada, pero faltan columnas nuevas en Supabase");
  }
  const cloudOrder = saved[0];
  if (!cloudOrder?.id) throw new Error("Supabase no devolvio la orden guardada");
  order.id = cloudOrder.id;
  order.createdAt = cloudOrder.creado_en || cloudOrder.created_at || order.createdAt || new Date().toISOString();
  await sbFetch(`/rest/v1/orden_productos?orden_id=eq.${cloudOrder.id}`, { method: "DELETE" });
  if (order.recipe.length) {
    const recipeRows = order.recipe.map((line) => ({
        orden_id: cloudOrder.id,
        producto_id: line.productId,
        numero_programa: line.programNumber || order.programNumbers?.[0] || order.programNumber || null,
        dosis_por_100: line.dose100 || 0,
        producto_por_ha_programa: line.productHaProgram || 0,
        total_programa: line.totalProgram || 0
      }));
    try {
      await sbFetch("/rest/v1/orden_productos", {
        method: "POST",
        prefer: "return=minimal",
        body: JSON.stringify(recipeRows)
      });
    } catch (error) {
      if (!isMissingSupabaseColumn(error, ["numero_programa"])) throw error;
      await sbFetch("/rest/v1/orden_productos", {
        method: "POST",
        prefer: "return=minimal",
        body: JSON.stringify(recipeRows.map(({ numero_programa, ...row }) => row))
      });
      showToast("Receta guardada, pero falta numero_programa en Supabase");
    }
  }
}

async function cloudSaveDispatch(order, dispatch) {
  // No se cambian IDs del formulario. Se toman los valores que ya existen
  // en saveDispatch(): tractorCode, machineCode y operatorId.
  const baseDispatchBody = {
      orden_id: order.id,
      tipo: dispatch.type,
      fecha: dispatch.date,
      litros: dispatch.liters || 0,
      nota: dispatch.note || null,
      creado_por: supabaseSession.user?.id
    };

  const traceSpanish = {
    hora_salida: dispatch.time || null,
    codigo_tractor: dispatch.tractorCode || null,
    codigo_maquina: dispatch.machineCode || null,
    aplicador_id: dispatch.operatorId || null
  };

  const traceFriendly = {
    hora_salida: dispatch.time || null,
    tractor: dispatch.tractorCode || null,
    maquina: dispatch.machineCode || null,
    aplicador: dispatch.operatorId || null
  };

  const candidates = [
    { ...baseDispatchBody, ...traceSpanish },
    { ...baseDispatchBody, ...traceFriendly },
    { ...baseDispatchBody, codigo_tractor: dispatch.tractorCode || null, codigo_maquina: dispatch.machineCode || null, aplicador_id: dispatch.operatorId || null },
    { ...baseDispatchBody, tractor: dispatch.tractorCode || null, maquina: dispatch.machineCode || null, aplicador: dispatch.operatorId || null },
    baseDispatchBody
  ];

  let saved;
  let lastColumnError = null;
  for (const candidate of candidates) {
    try {
      saved = await sbFetch("/rest/v1/despachos?select=*", {
        method: "POST",
        prefer: "return=representation",
        body: JSON.stringify([candidate])
      });
      break;
    } catch (error) {
      const optionalColumns = ["hora_salida", "codigo_tractor", "codigo_maquina", "aplicador_id", "tractor", "maquina", "aplicador"];
      if (!isMissingSupabaseColumn(error, optionalColumns)) throw error;
      lastColumnError = error;
    }
  }

  if (!saved) throw lastColumnError || new Error("No se pudo guardar la salida en Supabase");
  const cloudDispatch = saved[0];
  if (!cloudDispatch?.id) throw new Error("Supabase no devolvio el ID del despacho");
  dispatch.id = cloudDispatch.id;
  const products = Object.entries(dispatch.products || {}).map(([productId, quantity]) => {
    const product = getProduct(productId);
    return {
      despacho_id: cloudDispatch.id,
      producto_id: productId,
      cantidad: quantity,
      costo_unitario: product?.cost || 0,
      lote: product?.lot || null
    };
  });
  if (products.length) {
    await sbFetch("/rest/v1/despacho_productos", { method: "POST", prefer: "return=minimal", body: JSON.stringify(products) });
    await sbFetch("/rest/v1/movimientos_stock", {
      method: "POST",
      prefer: "return=minimal",
      body: JSON.stringify(products.map((item) => ({
        producto_id: item.producto_id,
        orden_id: order.id,
        despacho_id: cloudDispatch.id,
        tipo: dispatch.type,
        fecha: dispatch.date,
        cantidad: item.cantidad,
        costo_unitario: item.costo_unitario,
        lote: item.lote,
        nota: `${dispatch.type} orden ${order.number}`,
        creado_por: supabaseSession.user?.id
      })))
    });
  }
  await updateCloudProductStocks();
  try {
    await sbFetch(`/rest/v1/ordenes_aplicacion?id=eq.${order.id}`, {
      method: "PATCH",
      prefer: "return=minimal",
      body: JSON.stringify({ estado: toDbOrderStatus(effectiveOrderStatus(order)), finalizada_por_jefe: Boolean(order.finishedByManager) })
    });
  } catch (error) {
    try {
      if (!isMissingSupabaseColumn(error, ["finalizada_por_jefe"])) throw error;
      await sbFetch(`/rest/v1/ordenes_aplicacion?id=eq.${order.id}`, {
        method: "PATCH",
        prefer: "return=minimal",
        body: JSON.stringify({ estado: toDbOrderStatus(effectiveOrderStatus(order)) })
      });
    } catch {
      console.warn("Salida guardada; la orden se recalculara al sincronizar.");
    }
  }
}

async function cloudSavePurchase(product, movement) {
  await cloudSaveProduct(product);
  const saved = await sbFetch("/rest/v1/movimientos_stock?select=*", {
    method: "POST",
    prefer: "return=representation",
    body: JSON.stringify([{
      producto_id: product.id,
      tipo: "ingreso",
      fecha: movement.date,
      cantidad: movement.quantity,
      costo_unitario: movement.unitCost || product.cost || 0,
      sacos: movement.sacks || null,
      kg_por_saco: movement.kgPerSack || null,
      precio_saco: movement.sackPrice || null,
      lote: movement.lot || null,
      nota: movement.note || null,
      creado_por: supabaseSession.user?.id
    }])
  });
  if (saved?.[0]?.id) movement.id = saved[0].id;
}

async function cloudSaveProduct(product) {
  const saved = await sbFetch("/rest/v1/productos?select=*", {
    method: "POST",
    prefer: "resolution=merge-duplicates,return=representation",
    body: JSON.stringify([{
      id: isUuid(product.id) ? product.id : undefined,
      nombre: product.name,
      ingrediente_activo: product.ingredient,
      unidad: product.unit,
      dosis_por_100: product.dose100 || 0,
      horas_reingreso: product.reentryHours || 24,
      dias_carencia: product.carencyDays || 0,
      stock_minimo: product.minStock || 0,
      stock_actual: product.stock || 0,
      costo_unitario: product.cost || 0,
      precio_saco: product.sackPrice || null,
      kg_por_saco: product.kgPerSack || null,
      lote: product.lot || null,
      fecha_vencimiento: product.expires || null
    }])
  });
  if (saved?.[0]?.id) product.id = saved[0].id;
}


async function cloudUpdateDispatch(order, dispatch) {
  if (!supabaseSession || dispatch.id === undefined || dispatch.id === null || dispatch.id === "") throw new Error("La salida no esta sincronizada con Supabase");

  const despachoId = encodeURIComponent(dispatch.id);
  const baseDispatchBody = {
    tipo: dispatch.type,
    fecha: dispatch.date,
    litros: dispatch.liters || 0,
    nota: dispatch.note || null
  };

  const traceSpanish = {
    hora_salida: dispatch.time || null,
    codigo_tractor: dispatch.tractorCode || null,
    codigo_maquina: dispatch.machineCode || null,
    aplicador_id: dispatch.operatorId || null
  };

  const traceFriendly = {
    hora_salida: dispatch.time || null,
    tractor: dispatch.tractorCode || null,
    maquina: dispatch.machineCode || null,
    aplicador: dispatch.operatorId || null
  };

  const candidates = [
    { ...baseDispatchBody, ...traceSpanish },
    { ...baseDispatchBody, ...traceFriendly },
    { ...baseDispatchBody, codigo_tractor: dispatch.tractorCode || null, codigo_maquina: dispatch.machineCode || null, aplicador_id: dispatch.operatorId || null },
    { ...baseDispatchBody, tractor: dispatch.tractorCode || null, maquina: dispatch.machineCode || null, aplicador: dispatch.operatorId || null },
    baseDispatchBody
  ];

  let updated = false;
  let lastColumnError = null;
  for (const candidate of candidates) {
    try {
      await sbFetch(`/rest/v1/despachos?id=eq.${despachoId}`, {
        method: "PATCH",
        prefer: "return=minimal",
        body: JSON.stringify(candidate)
      });
      updated = true;
      break;
    } catch (error) {
      const optionalColumns = ["hora_salida", "codigo_tractor", "codigo_maquina", "aplicador_id", "tractor", "maquina", "aplicador"];
      if (!isMissingSupabaseColumn(error, optionalColumns)) throw error;
      lastColumnError = error;
    }
  }

  if (!updated) throw lastColumnError || new Error("No se pudo actualizar la salida en Supabase");

  const products = Object.entries(dispatch.products || {}).map(([productId, quantity]) => {
    const product = getProduct(productId);
    return {
      despacho_id: dispatch.id,
      producto_id: productId,
      cantidad: quantity,
      costo_unitario: product?.cost || 0,
      lote: product?.lot || null
    };
  });

  // Detalle de productos: se intenta reemplazar. Si la politica no permite DELETE,
  // no bloqueamos la modificacion principal de la salida.
  try {
    await sbFetch(`/rest/v1/despacho_productos?despacho_id=eq.${despachoId}`, { method: "DELETE" });
    if (products.length) {
      await sbFetch("/rest/v1/despacho_productos", { method: "POST", prefer: "return=minimal", body: JSON.stringify(products) });
    }
  } catch (error) {
    console.warn("Salida modificada, pero no se pudo reemplazar detalle de productos:", error);
  }
}

async function cloudDeleteDispatch(order, dispatch) {
  if (!supabaseSession || dispatch.id === undefined || dispatch.id === null || dispatch.id === "") {
    throw new Error("La salida no esta sincronizada con Supabase");
  }

  const despachoId = encodeURIComponent(dispatch.id);

  // Se usa el mismo ID real que se asigna al crear la salida en cloudSaveDispatch(): dispatch.id.
  try {
    await sbFetch(`/rest/v1/despacho_productos?despacho_id=eq.${despachoId}`, { method: "DELETE" });
  } catch (error) {
    console.warn("No se pudieron borrar los productos del despacho:", error);
  }

  try {
    await sbFetch(`/rest/v1/movimientos_stock?despacho_id=eq.${despachoId}`, { method: "DELETE" });
  } catch (error) {
    console.warn("No se pudieron borrar los movimientos del despacho:", error);
  }

  await sbFetch(`/rest/v1/despachos?id=eq.${despachoId}`, {
    method: "DELETE",
    prefer: "return=minimal"
  });

  await updateCloudProductStocks();
  try {
    await sbFetch(`/rest/v1/ordenes_aplicacion?id=eq.${order.id}`, {
      method: "PATCH",
      prefer: "return=minimal",
      body: JSON.stringify({ estado: toDbOrderStatus(effectiveOrderStatus(order)), finalizada_por_jefe: Boolean(order.finishedByManager) })
    });
  } catch (_) {}
}

async function updateCloudProductStocks() {
  const patches = state.products.map((product) => sbFetch(`/rest/v1/productos?id=eq.${product.id}`, {
    method: "PATCH",
    prefer: "return=minimal",
    body: JSON.stringify({ stock_actual: product.stock || 0 })
  }));
  await Promise.all(patches);
}

async function cloudSaveProgram(program) {
  if (!supabaseSession || !isUuid(program.id)) return;
  await sbFetch(`/rest/v1/programas?id=eq.${program.id}`, {
    method: "PATCH",
    prefer: "return=minimal",
    body: JSON.stringify({
      fecha_inicio: program.startDate || null,
      fecha_termino: program.endDate || null,
      agua_por_ha: program.waterHa || null
    })
  });
}

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value || ""));
}

function renderWarehouse() {
  const warehouseOrders = sortOrdersNewestFirst(state.orders)
    .filter((order) => matchesOrderStatusFilter(order, warehouseStatusFilter))
    .filter(matchesWarehouseDateFilter);
  views.warehouse.innerHTML = `
    <section class="panel">
      <div class="panel-header warehouse-panel-header">
        <div>
          <h2>Ordenes de salida de bodega</h2>
          <p>Registra salidas parciales y devoluciones. El mojamiento acumulado no debe superar lo autorizado.</p>
        </div>
        <div class="warehouse-filters">
          <label class="inline-filter">Estado
            <select id="warehouseStatusFilter">${statusFilterOptions(warehouseStatusFilter)}</select>
          </label>
          <label class="inline-filter">Desde
            <input id="warehouseDateFromFilter" type="date" value="${warehouseDateFromFilter}">
          </label>
          <label class="inline-filter">Hasta
            <input id="warehouseDateToFilter" type="date" value="${warehouseDateToFilter}">
          </label>
          <button class="secondary-button" data-action="clear-warehouse-filter">Limpiar</button>
        </div>
      </div>
      <div class="order-grid">
        ${warehouseOrders.map(warehouseCard).join("") || `<div class="empty">No hay ordenes para bodega con los filtros actuales.</div>`}
      </div>
    </section>
  `;
  document.getElementById("warehouseStatusFilter")?.addEventListener("change", (event) => {
    warehouseStatusFilter = event.target.value;
    renderWarehouse();
  });
  document.getElementById("warehouseDateFromFilter")?.addEventListener("change", (event) => {
    warehouseDateFromFilter = event.target.value;
    renderWarehouse();
  });
  document.getElementById("warehouseDateToFilter")?.addEventListener("change", (event) => {
    warehouseDateToFilter = event.target.value;
    renderWarehouse();
  });
}

function warehouseCard(order) {
  const status = effectiveOrderStatus(order);
  const total = plannedLiters(order);
  const dispatched = dispatchedLiters(order);
  const remaining = Math.max(0, total - dispatched);
  const pct = total ? Math.min(100, dispatched / total * 100) : 0;
  return `
    <article class="order-card warehouse-order-card ${isNewOrder(order) ? "is-new-order" : ""} ${status === "closed" ? "is-complete-order" : ""}">
      <div class="order-card-head">
        <div>
          <span class="overline">Orden #${order.number}</span>
          <h3>${order.potrero} - ${order.crop}</h3>
        </div>
        <div class="order-status-stack">
          ${newOrderMark(order)}
          <span class="badge ${statusClass(status)}">${statusLabel(status)}</span>
        </div>
      </div>
      <dl class="metrics">
        <div><dt>Total autorizado</dt><dd>${number(total, 0)} L</dd></div>
        <div><dt>Acumulado salida</dt><dd>${number(dispatched, 0)} L</dd></div>
        <div><dt>Saldo</dt><dd>${number(remaining, 0)} L</dd></div>
        <div><dt>Costo salido</dt><dd>${money(dispatchCost(order))}</dd></div>
      </dl>
      <div class="progress"><i style="width:${pct}%"></i></div>
      <div class="warehouse-order-context">
        <div><strong>N programa</strong><span>${programNumbersLabel(order)}</span></div>
        <div><strong>Objetivo</strong><span>${order.objective || "-"}</span></div>
      </div>
      <div class="table-wrap compact-table warehouse-product-table">
        <table>
          <thead><tr><th>Producto</th><th>kg/L ha</th><th>Plan</th><th>Salido neto</th><th>Costo</th></tr></thead>
          <tbody>
            ${order.recipe.map((line) => {
              const product = getProduct(line.productId);
              const qty = dispatchedProduct(order, line.productId);
              return `<tr><td data-label="Producto">${product?.name}</td><td data-label="kg/L ha">${number(productHaFromDose(order, line))}</td><td data-label="Plan">${number(plannedProduct(order, line))}</td><td data-label="Salido neto">${number(qty)} ${product?.unit}</td><td data-label="Costo">${money(qty * (product?.cost || 0))}</td></tr>`;
            }).join("")}
          </tbody>
        </table>
      </div>
      <div class="table-wrap compact-table warehouse-history-table">
        <table>
          <thead><tr><th>Fecha</th><th>Hora</th><th>Tipo</th><th>Mojamiento</th><th>Tractor</th><th>Maquina</th><th>Aplicador</th><th>Accion</th></tr></thead>
          <tbody>
            ${warehouseDispatchRows(order)}
          </tbody>
        </table>
      </div>
      <div class="card-actions warehouse-actions">
        ${status !== "closed" ? `<button class="primary-button warehouse-dispatch-button" data-action="open-dispatch" data-id="${order.id}">Nueva salida</button>` : `<button class="primary-button warehouse-complete-button" type="button" disabled>Orden completa</button>`}
        <button class="secondary-button" data-action="open-return" data-id="${order.id}">Devolucion</button>
        <button class="secondary-button" data-action="print-order" data-id="${order.id}">PDF orden</button>
      </div>
    </article>
  `;
}

function warehouseDispatchRows(order) {
  if (!order.dispatches.length) return `<tr><td colspan="8" data-label="Salidas">Sin salidas registradas aun.</td></tr>`;
  return order.dispatches.map((dispatch) => `
    <tr>
      <td data-label="Fecha">${dispatch.date || "-"}</td>
      <td data-label="Hora">${dispatchDisplayTime(dispatch)}</td>
      <td data-label="Tipo">${dispatch.type === "devolucion" ? "Devolucion" : "Salida"}</td>
      <td data-label="Mojamiento">${dispatch.type === "devolucion" ? "-" : ""}${number(dispatch.liters || 0, 0)} L</td>
      <td data-label="Tractor">${dispatch.tractorCode || "-"}</td>
      <td data-label="Maquina">${dispatch.machineCode || "-"}</td>
      <td data-label="Aplicador">${dispatch.operatorId ? getOperator(dispatch.operatorId) : "-"}</td>
      <td data-label="Accion"><div class="dispatch-row-actions"><button class="secondary-button small-button" type="button" data-action="edit-dispatch" data-id="${order.id}" data-dispatch-id="${dispatch.id}">Modificar</button><button class="danger-button small-button" type="button" data-action="delete-dispatch" data-id="${order.id}" data-dispatch-id="${dispatch.id}">Borrar</button></div></td>
    </tr>
  `).join("");
}

function dispatchCost(order) {
  return order.recipe.reduce((sum, line) => {
    const product = getProduct(line.productId);
    return sum + dispatchedProduct(order, line.productId) * (product?.cost || 0);
  }, 0);
}

function kpi(label, value, hint) {
  return `
    <article class="kpi">
      <span>${label}</span>
      <strong>${value}</strong>
      ${hint ? `<small>${hint}</small>` : ""}
    </article>
  `;
}

function stockAlert(product) {
  const ratio = product.minStock ? product.stock / product.minStock : 99;
  const cls = ratio <= 1 ? "danger" : ratio <= 1.5 ? "warning" : "success";
  const label = ratio <= 1 ? "Critico" : ratio <= 1.5 ? "Vigilar" : "OK";
  return `
    <div class="alert-row">
      <div>
        <strong>${product.name}</strong>
        <span>${number(product.stock)} ${product.unit} disponibles</span>
      </div>
      <span class="badge ${cls}">${label}</span>
    </div>
  `;
}

function warehouseAlerts() {
  const stockRows = [...state.products]
    .filter((product) => product.stock <= product.minStock * 1.5)
    .sort((a, b) => (a.stock / Math.max(a.minStock, 1)) - (b.stock / Math.max(b.minStock, 1)))
    .map(stockAlert);
  const pendingRows = sortOrdersNewestFirst(state.orders)
    .filter((order) => effectiveOrderStatus(order) !== "closed" && plannedLiters(order) > 0)
    .slice(0, 5)
    .map((order) => {
      const remaining = Math.max(0, plannedLiters(order) - dispatchedLiters(order));
      const pct = plannedLiters(order) ? dispatchedLiters(order) / plannedLiters(order) * 100 : 0;
      return `
        <div class="alert-row">
          <div>
            <strong>Orden #${order.number} - ${order.potrero}</strong>
            <span>${number(remaining, 0)} L pendientes / ${number(pct, 0)}% completado</span>
          </div>
          <span class="badge ${statusClass(effectiveOrderStatus(order))}">${statusLabel(effectiveOrderStatus(order))}</span>
        </div>
      `;
    });
  return [...pendingRows, ...stockRows].length ? [...pendingRows, ...stockRows] : [`<div class="empty">Bodega sin alertas operativas.</div>`];
}

function overApplicationAlerts(orders) {
  const alerts = [];
  orders.forEach((order) => {
    const planned = plannedLiters(order);
    const dispatched = dispatchedLiters(order);
    if (planned > 0 && dispatched > planned * 1.03) {
      alerts.push({
        order,
        date: orderDateValue(order),
        label: "Mojamiento total excedido",
        detail: `${number(dispatched - planned, 0)} L sobre lo solicitado`
      });
    }
    const realWaterHa = order.hectares ? dispatched / order.hectares : 0;
    if (order.waterHa > 0 && realWaterHa > order.waterHa * 1.03) {
      alerts.push({
        order,
        date: orderDateValue(order),
        label: "Mojamiento por hectarea excedido",
        detail: `${number(realWaterHa, 0)} L/ha real vs ${number(order.waterHa, 0)} L/ha programado`
      });
    }
    order.dispatches.forEach((dispatch) => {
      if (dispatch.type === "devolucion") return;
      order.recipe.forEach((line) => {
        const expected = (Number(dispatch.liters) || 0) * (Number(line.dose100) || 0) / 100;
        const actual = Number(dispatch.products?.[line.productId]) || 0;
        if (expected > 0 && actual > expected * 1.05) {
          alerts.push({
            order,
            date: dispatch.date || orderDateValue(order),
            label: "Producto sobre dosis",
            detail: `${getProduct(line.productId)?.name || "Producto"}: ${number(actual - expected)} sobre lo esperado`
          });
        }
      });
    });
  });
  return alerts.sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
}

function applicationAlertRow(alert) {
  return `
    <div class="alert-row">
      <div>
        <strong>${alert.label} - Orden #${alert.order.number}</strong>
        <span>${alert.order.potrero} / bloques ${alert.order.blocks?.join(", ") || "-"} - ${alert.detail}</span>
      </div>
      <span class="badge danger">Revisar</span>
    </div>
  `;
}

async function renderGeoJsonMap() {
  const el = document.getElementById("geoJsonMap");
  if (!el) return;
  try {
    geoJsonCache ||= await loadGeoJson();
    if (!geoJsonCache) {
      el.innerHTML = `<span>Deja tu archivo GeoJSON en <strong>outputs/potreros.geojson</strong> para activar el mapa.</span>`;
      return;
    }
    await renderGoogleGeoJsonMap(el, geoJsonCache);
  } catch (error) {
    el.innerHTML = geoJsonToSvg(geoJsonCache);
  }
}

function loadGoogleMaps() {
  if (window.google?.maps) return Promise.resolve(window.google.maps);
  googleMapsLoading ||= new Promise((resolve, reject) => {
    const callbackName = `initAgroMap${Date.now()}`;
    window[callbackName] = () => {
      resolve(window.google.maps);
      delete window[callbackName];
    };
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=${callbackName}`;
    script.async = true;
    script.defer = true;
    script.onerror = () => reject(new Error("Google Maps no cargo"));
    document.head.appendChild(script);
  });
  return googleMapsLoading;
}

async function renderGoogleGeoJsonMap(el, layers) {
  const maps = await loadGoogleMaps();
  const potreroFeatures = layers.potreros?.features || [];
  const blockFeatures = layers.bloques?.features || [];
  const blockRings = geoFeaturesToRings(blockFeatures);
  const potreroRings = geoFeaturesToRings(potreroFeatures);
  const allRings = [...blockRings, ...potreroRings];
  if (!allRings.length) {
    el.innerHTML = `<span>El GeoJSON no tiene poligonos dibujables.</span>`;
    return;
  }
  dashboardMapOverlays.forEach((overlay) => overlay.setMap?.(null));
  dashboardMapOverlays = [];
  if (dashboardMapElement !== el) {
    dashboardMap = null;
    dashboardMapElement = el;
  }
  if (!dashboardMap) {
    dashboardMap = new maps.Map(el, {
      mapTypeId: "satellite",
      disableDefaultUI: false,
      streetViewControl: false,
      fullscreenControl: true,
      mapTypeControl: true,
      tilt: 0
    });
  }
  const bounds = new maps.LatLngBounds();
  const active = activeBlockKeys();
  const activePotreros = activePotreroKeys(active);
  const potreroPalette = ["#1f6f4a", "#a85c1f", "#3759a8", "#8b3fa8", "#287b82", "#a8344f", "#6d741f", "#4f6fbd"];
  const blockPalette = ["#d4a017", "#c2601d", "#7c5bc2", "#297f8f", "#bd415b", "#759328", "#cf8d1c"];

  blockRings.forEach((item, index) => {
    const key = blockFeatureKey(item.feature);
    const activeBlock = active.has(key);
    const related = activePotreros.has(key.split(":")[0]);
    item.rings.forEach((ring) => {
      const polygon = new maps.Polygon({
        paths: ring.map(([lng, lat]) => ({ lat, lng })),
        strokeColor: blockPalette[index % blockPalette.length],
        strokeOpacity: 0.95,
        strokeWeight: activeBlock ? 2.4 : 1.15,
        fillColor: activeBlock ? "#1f6f4a" : related ? "#f7d98b" : "#dfe8dc",
        fillOpacity: activeBlock ? 0.42 : related ? 0.32 : 0.16,
        zIndex: activeBlock ? 4 : 1
      });
      polygon.setMap(dashboardMap);
      dashboardMapOverlays.push(polygon);
      ring.forEach(([lng, lat]) => bounds.extend({ lat, lng }));
    });
    const label = createMapLabelOverlay(maps, geoLatLngCenter(item.rings), `B${blockFeatureName(item.feature)}`, "map-label-block-google");
    label.setMap(dashboardMap);
    dashboardMapOverlays.push(label);
  });

  potreroRings.forEach((item, index) => {
    const alias = potreroFeatureName(item.feature);
    const activeParent = activePotreros.has(alias);
    item.rings.forEach((ring) => {
      const polygon = new maps.Polygon({
        paths: ring.map(([lng, lat]) => ({ lat, lng })),
        strokeColor: potreroPalette[index % potreroPalette.length],
        strokeOpacity: 1,
        strokeWeight: activeParent ? 6 : 4,
        fillOpacity: 0,
        zIndex: 8
      });
      polygon.setMap(dashboardMap);
      dashboardMapOverlays.push(polygon);
    });
    const labelPoint = shiftLatLng(geoLatLngCenter(item.rings), index, 34);
    const label = createMapLabelOverlay(maps, labelPoint, alias, "map-label-potrero-google");
    label.setMap(dashboardMap);
    dashboardMapOverlays.push(label);
  });

  if (!bounds.isEmpty()) dashboardMap.fitBounds(bounds, 24);
}

function createMapLabelOverlay(maps, position, text, className) {
  class LabelOverlay extends maps.OverlayView {
    constructor() {
      super();
      this.div = null;
    }

    onAdd() {
      this.div = document.createElement("div");
      this.div.className = `map-label-google ${className}`;
      this.div.textContent = text;
      this.getPanes().overlayMouseTarget.appendChild(this.div);
    }

    draw() {
      if (!this.div) return;
      const point = this.getProjection().fromLatLngToDivPixel(new maps.LatLng(position.lat, position.lng));
      this.div.style.left = `${point.x}px`;
      this.div.style.top = `${point.y}px`;
    }

    onRemove() {
      this.div?.remove();
      this.div = null;
    }
  }
  return new LabelOverlay();
}

async function renderHarvestGeoMap(options = {}) {
  const el = document.getElementById("harvestGeoMap");
  if (!el) return;
  const renderVersion = ++harvestMapRenderVersion;
  try {
    geoJsonCache ||= await loadGeoJson();
    await renderGoogleHarvestMap(el, geoJsonCache, { ...options, renderVersion });
  } catch (error) {
    if (renderVersion === harvestMapRenderVersion && el.isConnected) {
      el.innerHTML = `<span>No se pudo cargar Google Maps para cosecha.</span>`;
    }
  }
}

function harvestMarkerIcon(maps, record, count = 1) {
  const clustered = count > 1;
  return {
    path: maps.SymbolPath.CIRCLE,
    scale: clustered ? Math.min(23, 15 + Math.log2(count) * 1.7) : 15,
    fillColor: clustered ? "#176b87" : harvestRecordStatus(record) === "despachado" ? "#237847" : "#b42318",
    fillOpacity: 0.95,
    strokeColor: "#ffffff",
    strokeWeight: clustered ? 2.5 : 2
  };
}

function clearHarvestMapCache() {
  harvestMapIdleListener?.remove?.();
  harvestMapIdleListener = null;
  if (harvestMapMarkerRenderFrame) cancelAnimationFrame(harvestMapMarkerRenderFrame);
  harvestMapMarkerRenderFrame = 0;
  harvestMapBaseOverlays.forEach((overlay) => overlay.setMap?.(null));
  harvestMapMarkerCache.forEach((entry) => entry.marker?.setMap?.(null));
  harvestMapBaseOverlays = [];
  harvestMapMarkerCache = new Map();
  harvestMapBaseReady = false;
  harvestMapBaseBounds = null;
  harvestMapVisibleRecords = [];
}

function harvestMapClusters(records, zoom) {
  if (zoom >= 20) {
    return records.map((record) => ({
      key: `bin:${harvestBinKey(record)}`,
      latitude: record.latitude,
      longitude: record.longitude,
      records: [record]
    }));
  }
  const cellDegrees = Math.max(0.00008, 52 * 360 / (256 * (2 ** Math.max(1, zoom))));
  const buckets = new Map();
  records.forEach((record) => {
    const row = Math.floor(record.latitude / cellDegrees);
    const column = Math.floor(record.longitude / cellDegrees);
    const key = `cluster:${zoom}:${row}:${column}`;
    const bucket = buckets.get(key) || { key, latitude: 0, longitude: 0, records: [] };
    bucket.latitude += record.latitude;
    bucket.longitude += record.longitude;
    bucket.records.push(record);
    buckets.set(key, bucket);
  });
  return [...buckets.values()].map((bucket) => ({
    ...bucket,
    latitude: bucket.latitude / bucket.records.length,
    longitude: bucket.longitude / bucket.records.length
  }));
}

function renderHarvestMapMarkers(maps) {
  if (!harvestMap) return;
  const zoom = Math.round(harvestMap.getZoom?.() || 15);
  const bounds = harvestMap.getBounds?.();
  const recordsInView = bounds
    ? harvestMapVisibleRecords.filter((record) => bounds.contains({ lat: record.latitude, lng: record.longitude }))
    : harvestMapVisibleRecords;
  const clusters = harvestMapClusters(recordsInView, zoom);
  const visibleKeys = new Set(clusters.map((cluster) => cluster.key));
  harvestMapMarkerCache.forEach((entry, key) => {
    if (!visibleKeys.has(key)) {
      entry.marker.setMap(null);
      harvestMapMarkerCache.delete(key);
    }
  });

  clusters.forEach((cluster) => {
    const count = cluster.records.length;
    const record = cluster.records[0];
    const position = { lat: cluster.latitude, lng: cluster.longitude };
    const label = count > 1
      ? { text: String(count), color: "#ffffff", fontSize: "11px", fontWeight: "800" }
      : { text: harvestCrewMarkerLabel(record), color: "#ffffff", fontSize: "10px", fontWeight: "800" };
    const title = count > 1
      ? `${count} bines - acercar para ver detalle`
      : `${record.crew || "Sin cuadrilla"} - BIN ${record.numBin || record.localCode || "S/N"}`;
    let entry = harvestMapMarkerCache.get(cluster.key);
    if (!entry) {
      entry = { records: cluster.records, marker: null };
      entry.marker = new maps.Marker({
        position,
        map: harvestMap,
        label,
        icon: harvestMarkerIcon(maps, record, count),
        title,
        optimized: true
      });
      entry.marker.addListener("click", () => {
        if (entry.records.length > 1) {
          harvestInfoWindow?.close();
          harvestMap.panTo(entry.marker.getPosition());
          harvestMap.setZoom(Math.min(20, (harvestMap.getZoom() || 15) + 2));
          return;
        }
        const selected = entry.records[0];
        selectedHarvestBinId = selected.id;
        renderHarvestBinDetail(selected, entry.marker, maps);
      });
      harvestMapMarkerCache.set(cluster.key, entry);
    } else {
      entry.records = cluster.records;
      entry.marker.setPosition(position);
      entry.marker.setLabel(label);
      entry.marker.setIcon(harvestMarkerIcon(maps, record, count));
      entry.marker.setTitle(title);
      entry.marker.setMap(harvestMap);
    }
  });

  const selectedEntry = [...harvestMapMarkerCache.values()].find((entry) =>
    entry.marker.getMap?.() && entry.records.length === 1 && entry.records[0].id === selectedHarvestBinId);
  if (selectedEntry) renderHarvestBinDetail(selectedEntry.records[0], selectedEntry.marker, maps);
  else if (selectedHarvestBinId) harvestInfoWindow?.close();
}

function scheduleHarvestMapMarkerRender(maps) {
  if (harvestMapMarkerRenderFrame) cancelAnimationFrame(harvestMapMarkerRenderFrame);
  const renderVersion = harvestMapRenderVersion;
  harvestMapMarkerRenderFrame = requestAnimationFrame(() => {
    harvestMapMarkerRenderFrame = 0;
    if (renderVersion !== harvestMapRenderVersion) return;
    renderHarvestMapMarkers(maps);
  });
}

async function renderGoogleHarvestMap(el, layers, options = {}) {
  const maps = await loadGoogleMaps();
  if (options.renderVersion !== harvestMapRenderVersion || !el.isConnected) return;
  const records = filteredHarvestRecords().filter((record) => Number.isFinite(record.latitude) && Number.isFinite(record.longitude));
  if (harvestMapElement !== el) {
    clearHarvestMapCache();
    harvestMap = null;
    harvestMapElement = el;
  }
  const createdMap = !harvestMap;
  if (!harvestMap) {
    harvestMap = new maps.Map(el, {
      mapTypeId: "satellite",
      disableDefaultUI: false,
      streetViewControl: false,
      fullscreenControl: true,
      mapTypeControl: true,
      tilt: 0
    });
  }
  harvestMapVisibleRecords = records;
  if (!harvestMapIdleListener) {
    harvestMapIdleListener = maps.event.addListener(harvestMap, "idle", () => scheduleHarvestMapMarkerRender(maps));
  }
  maps.event.trigger(harvestMap, "resize");

  if (!harvestMapBaseReady) {
    const baseBounds = new maps.LatLngBounds();
    const blockRings = geoFeaturesToRings(layers?.bloques?.features || []);
    const potreroRings = geoFeaturesToRings(layers?.potreros?.features || []);
    blockRings.forEach((item, index) => {
      item.rings.forEach((ring) => {
        const polygon = new maps.Polygon({
          paths: ring.map(([lng, lat]) => ({ lat, lng })),
          strokeColor: ["#d4a017", "#297f8f", "#7c5bc2"][index % 3],
          strokeOpacity: 0.95,
          strokeWeight: 1.9,
          fillColor: "#dfe8dc",
          fillOpacity: 0.18,
          zIndex: 4
        });
        polygon.setMap(harvestMap);
        harvestMapBaseOverlays.push(polygon);
        ring.forEach(([lng, lat]) => baseBounds.extend({ lat, lng }));
      });
      const label = createMapLabelOverlay(maps, geoLatLngCenter(item.rings), `B${blockFeatureName(item.feature)}`, "map-label-block-google");
      label.setMap(harvestMap);
      harvestMapBaseOverlays.push(label);
    });
    potreroRings.forEach((item, index) => {
      item.rings.forEach((ring) => {
        const polygon = new maps.Polygon({
          paths: ring.map(([lng, lat]) => ({ lat, lng })),
          strokeColor: ["#1f6f4a", "#a85c1f", "#3759a8", "#8b3fa8"][index % 4],
          strokeOpacity: 1,
          strokeWeight: 3,
          fillOpacity: 0,
          zIndex: 2
        });
        polygon.setMap(harvestMap);
        harvestMapBaseOverlays.push(polygon);
      });
      const label = createMapLabelOverlay(maps, shiftLatLng(geoLatLngCenter(item.rings), index, 34), potreroFeatureName(item.feature), "map-label-potrero-google");
      label.setMap(harvestMap);
      harvestMapBaseOverlays.push(label);
    });
    harvestMapBaseBounds = baseBounds;
    harvestMapBaseReady = true;
  }

  const recordBounds = new maps.LatLngBounds();
  records.forEach((record) => recordBounds.extend({ lat: record.latitude, lng: record.longitude }));

  if ((createdMap || options.fitBounds) && harvestMap) {
    const bounds = new maps.LatLngBounds();
    if (harvestMapBaseBounds && !harvestMapBaseBounds.isEmpty()) bounds.union(harvestMapBaseBounds);
    if (!recordBounds.isEmpty()) bounds.union(recordBounds);
    if (!bounds.isEmpty()) harvestMap.fitBounds(bounds, 24);
  }
  scheduleHarvestMapMarkerRender(maps);
}

function harvestCrewMarkerLabel(record) {
  const label = String(record.crew || "S/C").trim() || "S/C";
  return label.length > 8 ? `${label.slice(0, 7)}.` : label;
}

function renderHarvestBinDetail(record, marker, maps) {
  if (!record || !marker || !maps || !harvestMap) return;
  harvestInfoWindow ||= new maps.InfoWindow({ maxWidth: 300 });
  harvestInfoWindow.setContent(`
    <div class="harvest-map-info">
      <div class="harvest-map-info-head">
        <strong>BIN ${escapeHtml(record.numBin || record.localCode || "S/N")}</strong>
        <span>${harvestRecordStatus(record) === "despachado" ? "Despachado" : "Terreno"}</span>
      </div>
      <div class="harvest-map-info-grid">
        ${harvestInfoField("Escaneo", harvestRecordDate(record) || "Sin fecha")}
        ${harvestInfoField("SDP", record.sdp || "Sin SDP")}
        ${harvestInfoField("Potrero SDP", record.sdpField || "Sin potrero SDP")}
        ${harvestInfoField("Bloque SDP", record.sdpBlock || "Sin bloque SDP")}
        ${harvestInfoField("Potrero real", record.realField || "Sin potrero real")}
        ${harvestInfoField("Bloque real", record.realBlock || "Sin bloque real")}
        ${harvestInfoField("Contratista", record.contractor || "Sin contratista")}
        ${harvestInfoField("Cuadrilla", record.crew || "Sin cuadrilla")}
      </div>
    </div>
  `);
  harvestInfoWindow.open({ map: harvestMap, anchor: marker });
}

function harvestInfoField(label, value) {
  return `<div><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`;
}

async function renderIrrigationCalicatasMap(blocks, monthPrefix) {
  const el = document.getElementById("irrigationCalicataMap");
  if (!el) return;
  try {
    geoJsonCache ||= await loadGeoJson();
    const maps = await loadGoogleMaps();
    const records = filteredIrrigationCalicatas(blocks, monthPrefix)
      .filter((item) => Number.isFinite(Number(item.latitude)) && Number.isFinite(Number(item.longitude)));
    if (irrigationCalicataMapElement !== el) {
      irrigationCalicataMap = null;
      irrigationCalicataMapElement = el;
    }
    irrigationCalicataOverlays.forEach((overlay) => overlay.setMap?.(null));
    irrigationCalicataOverlays = [];
    irrigationCalicataMarkers = new Map();
    irrigationCalicataInfoWindow?.close();
    if (!irrigationCalicataMap) {
      irrigationCalicataMap = new maps.Map(el, {
        mapTypeId: "satellite",
        disableDefaultUI: false,
        streetViewControl: false,
        fullscreenControl: true,
        mapTypeControl: true,
        tilt: 0
      });
    }
    const bounds = new maps.LatLngBounds();
    const visibleKeys = new Set(blocks.map((block) => `${block.potrero}:${block.block}`));
    const blockRings = geoFeaturesToRings(geoJsonCache?.bloques?.features || []);
    const potreroRings = geoFeaturesToRings(geoJsonCache?.potreros?.features || []);
    blockRings.forEach((item, index) => {
      const key = blockFeatureKey(item.feature);
      const active = visibleKeys.has(key);
      item.rings.forEach((ring) => {
        const polygon = new maps.Polygon({
          paths: ring.map(([lng, lat]) => ({ lat, lng })),
          strokeColor: active ? "#1f6f4a" : ["#d4a017", "#297f8f", "#7c5bc2"][index % 3],
          strokeOpacity: active ? 1 : 0.72,
          strokeWeight: active ? 2.2 : 1.3,
          fillColor: active ? "#7cc79a" : "#dfe8dc",
          fillOpacity: active ? 0.28 : 0.12,
          zIndex: active ? 4 : 1
        });
        polygon.setMap(irrigationCalicataMap);
        irrigationCalicataOverlays.push(polygon);
        ring.forEach(([lng, lat]) => bounds.extend({ lat, lng }));
      });
      const label = createMapLabelOverlay(maps, geoLatLngCenter(item.rings), blockFeatureName(item.feature), "map-label-block-google");
      label.setMap(irrigationCalicataMap);
      irrigationCalicataOverlays.push(label);
    });
    potreroRings.forEach((item, index) => {
      item.rings.forEach((ring) => {
        const polygon = new maps.Polygon({
          paths: ring.map(([lng, lat]) => ({ lat, lng })),
          strokeColor: ["#1f6f4a", "#a85c1f", "#3759a8", "#8b3fa8"][index % 4],
          strokeOpacity: 1,
          strokeWeight: 3,
          fillOpacity: 0,
          zIndex: 2
        });
        polygon.setMap(irrigationCalicataMap);
        irrigationCalicataOverlays.push(polygon);
      });
      const label = createMapLabelOverlay(maps, shiftLatLng(geoLatLngCenter(item.rings), index, 34), potreroFeatureName(item.feature), "map-label-potrero-google");
      label.setMap(irrigationCalicataMap);
      irrigationCalicataOverlays.push(label);
    });
    records.forEach((item) => {
      const position = { lat: Number(item.latitude), lng: Number(item.longitude) };
      const averageValue = calicataAverageValue(item);
      const icon = irrigationCalicataMarkerIcon(maps, calicataValueColor(averageValue));
      const marker = new maps.Marker({
        position,
        map: irrigationCalicataMap,
        icon,
        title: `Calicata ${item.potrero || "-"} bloque ${item.block || "-"} · promedio ${averageValue === null ? "-" : number(averageValue)}`
      });
      marker.addListener("click", () => showIrrigationCalicataInfo(item, marker, maps));
      irrigationCalicataMarkers.set(String(item.id), { marker, item });
      irrigationCalicataOverlays.push(marker);
      bounds.extend(position);
    });
    if (!bounds.isEmpty()) irrigationCalicataMap.fitBounds(bounds, 24);
  } catch (error) {
    el.innerHTML = `<span>No se pudo cargar el mapa de calicatas.</span>`;
  }
}

function irrigationCalicataMarkerIcon(maps, color = "#1f6f4a") {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34">
      <circle cx="17" cy="17" r="15" fill="${color}" stroke="#ffffff" stroke-width="3"/>
      <path d="M20.8 8.5l4.5 4.5-2.2 2.2-1.2-1.2-8.4 8.4 1.6 1.6-4.8 1.8-2.6-2.6 1.8-4.8 1.6 1.6 8.4-8.4-1.1-1.1 1.9-2z" fill="#ffffff"/>
    </svg>`;
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: new maps.Size(30, 30),
    anchor: new maps.Point(15, 15)
  };
}

function showIrrigationCalicataInfo(item, marker, maps) {
  if (!item || !marker || !maps || !irrigationCalicataMap) return;
  irrigationCalicataInfoWindow ||= new maps.InfoWindow({ maxWidth: 310 });
  const averageValue = calicataAverageValue(item);
  irrigationCalicataInfoWindow.setContent(`
    <div class="harvest-map-info irrigation-calicata-info">
      <div class="harvest-map-info-head">
        <strong>${escapeHtml(item.potrero || "-")} · Bloque ${escapeHtml(item.block || "-")}</strong>
        <span>${escapeHtml(calicataDate(item) || "Sin fecha")}</span>
      </div>
      ${item.photoUrl ? `<img class="irrigation-calicata-photo" src="${htmlAttr(item.photoUrl)}" alt="Foto calicata" loading="lazy">` : ""}
      <div class="harvest-map-info-grid">
        ${harvestInfoField("Trabajador", item.workerName || "Sin trabajador")}
        ${harvestInfoField("20 cm", item.depth20 === null ? "-" : number(item.depth20))}
        ${harvestInfoField("40 cm", item.depth40 === null ? "-" : number(item.depth40))}
        ${harvestInfoField("60 cm", item.depth60 === null ? "-" : number(item.depth60))}
        ${harvestInfoField("80 cm", item.depth80 === null ? "-" : number(item.depth80))}
        ${harvestInfoField("Promedio", averageValue === null ? "-" : number(averageValue))}
        ${harvestInfoField("Estado", item.empty ? "Vacia" : "Con lectura")}
      </div>
      ${item.observation ? `<p class="irrigation-calicata-observation">${escapeHtml(item.observation)}</p>` : ""}
    </div>
  `);
  irrigationCalicataInfoWindow.open({ map: irrigationCalicataMap, anchor: marker });
}

function focusIrrigationCalicataById(id) {
  const entry = irrigationCalicataMarkers.get(String(id));
  if (!entry || !irrigationCalicataMap || !window.google?.maps) return;
  irrigationCalicataMap.panTo(entry.marker.getPosition());
  irrigationCalicataMap.setZoom(Math.max(irrigationCalicataMap.getZoom() || 0, 18));
  showIrrigationCalicataInfo(entry.item, entry.marker, window.google.maps);
}

async function loadGeoJson() {
  const potreros = await fetchFirstGeoJson(["outputs/potreros.geojson", "potreros.geojson", "assets/maps/potreros.geojson"]);
  const bloques = await fetchFirstGeoJson(["outputs/bloques.geojson", "bloques.geojson", "assets/maps/bloques.geojson"]);
  return potreros || bloques ? { potreros, bloques } : null;
}

async function fetchFirstGeoJson(paths) {
  for (const path of paths) {
    try {
      const response = await fetch(path, { cache: "no-store" });
      if (response.ok) return response.json();
    } catch {
      // prueba la siguiente ruta
    }
  }
  return null;
}

function geoJsonToSvg(layers) {
  const potreroFeatures = layers.potreros?.features || [];
  const blockFeatures = layers.bloques?.features || [];
  const potreroRings = geoFeaturesToRings(potreroFeatures);
  const blockRings = geoFeaturesToRings(blockFeatures);
  const allRings = [...potreroRings, ...blockRings];
  const points = allRings.flatMap((item) => item.rings.flat());
  if (!points.length) return `<span>El GeoJSON no tiene poligonos dibujables.</span>`;
  const bounds = geoBounds(points);
  const width = 980;
  const height = 520;
  const project = geoProjector(bounds, width, height);
  const active = activeBlockKeys();
  const activePotreros = activePotreroKeys(active);
  const potreroPalette = ["#1f6f4a", "#a85c1f", "#3759a8", "#8b3fa8", "#287b82", "#a8344f", "#6d741f", "#4f6fbd"];

  const blocks = blockRings.map((item) => {
    const key = blockFeatureKey(item.feature);
    const cls = active.has(key) ? "active" : activePotreros.has(key.split(":")[0]) ? "related" : "";
    return `<path class="map-block ${cls}" d="${ringsPath(item.rings, project)}"><title>${key}</title></path>`;
  }).join("");

  const potreros = potreroRings.map((item, index) => {
    const alias = potreroFeatureName(item.feature);
    const stroke = potreroPalette[index % potreroPalette.length];
    const cls = activePotreros.has(alias) ? "active-parent" : "";
    return `<path class="map-potrero ${cls}" d="${ringsPath(item.rings, project)}" style="--stroke:${stroke}"><title>${alias}</title></path>`;
  }).join("");

  const blockLabels = blockRings.map((item) => {
    const center = project(geoCenter(item.rings));
    const label = blockFeatureName(item.feature);
    return `<text class="map-label map-label-block" x="${center[0].toFixed(1)}" y="${(center[1] + 9).toFixed(1)}">${label}</text>`;
  }).join("");

  const blockCenters = blockRings.map((item) => project(geoCenter(item.rings)));
  const potreroLabels = potreroRings.map((item) => {
    const center = project(geoCenter(item.rings));
    const closeBlock = blockCenters.some((point) => Math.abs(point[0] - center[0]) < 28 && Math.abs(point[1] - center[1]) < 22);
    const y = center[1] - (closeBlock ? 22 : 8);
    return `<text class="map-label map-label-potrero" x="${center[0].toFixed(1)}" y="${y.toFixed(1)}">${potreroFeatureName(item.feature)}</text>`;
  }).join("");

  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Mapa de potreros y bloques">${blocks}${potreros}${blockLabels}${potreroLabels}</svg>`;
}

function geoFeaturesToRings(features) {
  return features.map((feature) => ({
    feature,
    rings: extractGeoRings(feature.geometry)
  })).filter((item) => item.rings.length);
}

function geoBounds(points) {
  const xs = points.map((point) => point[0]);
  const ys = points.map((point) => point[1]);
  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys)
  };
}

function geoProjector(bounds, width, height) {
  const pad = 18;
  const sx = (width - pad * 2) / Math.max(bounds.maxX - bounds.minX, 0.000001);
  const sy = (height - pad * 2) / Math.max(bounds.maxY - bounds.minY, 0.000001);
  const scale = Math.min(sx, sy);
  return (point) => [
    pad + (point[0] - bounds.minX) * scale,
    height - pad - (point[1] - bounds.minY) * scale
  ];
}

function ringsPath(rings, project) {
  return rings.map((ring) => ring.map((point, index) => {
    const [x, y] = project(point);
    return `${index ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ") + " Z").join(" ");
}

function geoCenter(rings) {
  const points = rings.flat();
  const xs = points.map((point) => point[0]);
  const ys = points.map((point) => point[1]);
  return [(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2];
}

function geoLatLngCenter(rings) {
  const [lng, lat] = geoCenter(rings);
  return { lat, lng };
}

function shiftLatLng(point, index, meters) {
  const directions = [
    { lat: 1, lng: 1 },
    { lat: -1, lng: 1 },
    { lat: 1, lng: -1 },
    { lat: -1, lng: -1 },
    { lat: 0, lng: 1 },
    { lat: 1, lng: 0 }
  ];
  const direction = directions[index % directions.length];
  const latOffset = meters / 111320 * direction.lat;
  const safeCos = Math.max(0.2, Math.abs(Math.cos(point.lat * Math.PI / 180)));
  const lngOffset = meters / (111320 * safeCos) * direction.lng;
  return { lat: point.lat + latOffset, lng: point.lng + lngOffset };
}

function extractGeoRings(geometry) {
  if (!geometry) return [];
  if (geometry.type === "Polygon") return geometry.coordinates.map((ring) => ring.map(([x, y]) => [Number(x), Number(y)]));
  if (geometry.type === "MultiPolygon") return geometry.coordinates.flatMap((polygon) => polygon.map((ring) => ring.map(([x, y]) => [Number(x), Number(y)])));
  return [];
}

function potreroFeatureName(feature) {
  const p = feature.properties || {};
  return String(p["Alias:"] || p.Alias || p.alias || p.Nombre || p.Potrero || "").trim();
}

function blockFeatureName(feature) {
  const p = feature.properties || {};
  return String(p.bloque || p.Bloque || p.BLOQUE || p.block || p.BLOCK || "").trim();
}

function blockFeatureKey(feature) {
  const p = feature.properties || {};
  const potrero = String(p["Potrero_Alias:"] || p.Potrero_Alias || p.potrero || p.Potrero || p.POTRERO || "").trim();
  const block = blockFeatureName(feature);
  return `${potrero}:${block}`;
}

function activeBlockKeys() {
  const keys = new Set();
  state.orders.filter((order) => effectiveOrderStatus(order) !== "closed").forEach((order) => {
    (order.blocks || []).forEach((block) => {
      if (String(block).includes(":")) keys.add(String(block));
      else keys.add(`${order.potrero}:${block}`);
    });
  });
  return keys;
}

function activePotreroKeys(active) {
  return new Set([...active].map((item) => String(item).split(":")[0]).filter(Boolean));
}

function renderOrders() {
  views.orders.innerHTML = `
    <section class="panel">
      <div class="panel-header">
        <div>
          <h2>Planificacion de aplicaciones</h2>
          <p>Orden, receta, equipo, potrero y gasto programado.</p>
        </div>
        <button class="primary-button" data-action="new-order">Nueva orden</button>
      </div>
      <div class="order-grid">
        ${sortOrdersNewestFirst(state.orders).map(orderCard).join("")}
      </div>
    </section>
  `;
}

function orderCard(order) {
  const status = effectiveOrderStatus(order);
  const planned = plannedLiters(order);
  const real = dispatchedLiters(order);
  const variance = real - planned;
  return `
    <article class="order-card">
      <div class="order-card-head">
        <div>
          <span class="overline">Orden #${order.number}</span>
          <h3>${order.potrero} - ${order.crop}</h3>
        </div>
        <span class="badge ${statusClass(status)}">${statusLabel(status)}</span>
      </div>
      <p>${order.objective || "Sin objetivo declarado"}</p>
      <dl class="metrics">
        <div><dt>Hectareas</dt><dd>${number(order.hectares)} ha</dd></div>
        <div><dt>Mojamiento prog.</dt><dd>${number(planned, 0)} L</dd></div>
        <div><dt>Salida bodega</dt><dd>${number(real, 0)} L</dd></div>
        <div><dt>Diferencia</dt><dd class="${variance > 0 ? "bad" : "good"}">${number(variance, 0)} L</dd></div>
      </dl>
      <div class="tech-strip">
        <span>Presion: <strong>${order.pressure || "-"} bar</strong></span>
        <span>Boquilla: <strong>${order.nozzle || "-"}</strong></span>
        <span>Velocidad: <strong>${order.speed || "-"} km/h</strong></span>
      </div>
      ${order.notes ? `<div class="gantt-detail-note"><strong>Nota de la orden</strong><p>${escapeHtml(order.notes)}</p></div>` : ""}
      <div class="recipe-list">
        ${order.recipe.map((line) => {
          const product = getProduct(line.productId);
          return `<span>${product?.name || "Producto"}: ${number(productHaFromDose(order, line))} ${product?.unit || ""}/ha - total ${number(plannedProduct(order, line))} ${product?.unit || ""}</span>`;
        }).join("")}
      </div>
      <div class="card-actions">
        <button class="secondary-button" data-action="edit-order" data-id="${order.id}">Editar</button>
        <button class="primary-button" data-action="open-tank" data-id="${order.id}">Cargar estanque</button>
      </div>
    </article>
  `;
}

function renderExecution() {
  const runnable = sortOrdersNewestFirst(state.orders.filter((order) => effectiveOrderStatus(order) !== "closed"));
  views.execution.innerHTML = `
    <section class="operator-board">
      <div class="operator-title">
        <p class="eyebrow">Modo tractorista</p>
        <h2>Ordenes listas para aplicar</h2>
      </div>
      ${runnable.length ? runnable.map(executionCard).join("") : `<div class="empty">No hay ordenes pendientes.</div>`}
    </section>
  `;
}

function executionCard(order) {
  const sprayer = state.equipment.find((item) => item.id === order.sprayerId);
  const tankLiters = sprayer?.tankLiters || state.settings.defaultTankLiters;
  return `
    <article class="execution-card ${isNewOrder(order) ? "is-new-order" : ""}">
      <div>
        <span class="overline">Orden #${order.number} - ${getOperator(order.operatorId)}</span>
        ${newOrderMark(order)}
        <h3>${order.potrero} ${order.blocks?.length ? `bloques ${order.blocks.join(", ")}` : ""}</h3>
        <p>${order.objective || "Aplicacion programada"} - ${number(order.hectares)} ha</p>
        <div class="tech-strip compact">
          <span>${order.machineCode || getEquipment(order.sprayerId)}</span>
          <span>${order.tractorCode || getEquipment(order.tractorId)}</span>
          <span>${order.nozzle || "Boquilla s/i"}</span>
          <span>${order.pressure || "-"} bar</span>
          <span>${order.speed || "-"} km/h</span>
        </div>
      </div>
      <div class="mix-box">
        <strong>Receta para ${number(tankLiters, 0)} L</strong>
        ${order.recipe.map((line) => {
          const product = getProduct(line.productId);
          const qty = tankLiters * line.dose100 / 100;
          return `<span>${product?.name}: ${number(qty)} ${product?.unit} (${number(productHaFromDose(order, line))} ${product?.unit}/ha)</span>`;
        }).join("")}
      </div>
      <div class="wide-actions">
        <button class="secondary-button" data-action="start-order" data-id="${order.id}">Iniciar</button>
        <button class="primary-button" data-action="open-tank" data-id="${order.id}">Registrar estanque</button>
        <button class="danger-button" data-action="close-order" data-id="${order.id}">Cerrar aplicacion</button>
      </div>
    </article>
  `;
}

function renderInventory() {
  views.inventory.innerHTML = `
    <div class="layout two-columns inventory-layout">
      <section class="panel">
        <div class="panel-header">
          <div>
            <h2>Inventario de productos</h2>
            <p>Stock disponible, minimo, lote, vencimiento y costo.</p>
          </div>
          <div class="top-actions">
            <button class="secondary-button" data-action="open-stock-history">Historial</button>
            <button class="secondary-button" data-action="new-product">Nuevo producto</button>
            <button class="primary-button" data-action="new-purchase">Ingresar sacos/lote</button>
            <button class="primary-button" data-action="new-movement">Nuevo movimiento</button>
          </div>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Producto</th><th>Stock</th><th>Minimo</th><th>Lote</th><th>Vence</th><th>Precio saco</th><th>Costo kg/L</th><th>Valor stock</th></tr></thead>
            <tbody>
              ${state.products.map((product) => `
                <tr>
                  <td data-label="Producto"><strong>${product.name}</strong><br><span>${product.ingredient}</span></td>
                  <td data-label="Stock">${number(product.stock)} ${product.unit}</td>
                  <td data-label="Mínimo">${number(product.minStock)} ${product.unit}</td>
                  <td data-label="Lote">${product.lot || "-"}</td>
                  <td data-label="Vence">${product.expires || "-"}</td>
                  <td data-label="Precio saco">${product.sackPrice ? money(product.sackPrice) : "-"}</td>
                  <td data-label="Costo kg/L">${money(product.cost)}</td>
                  <td data-label="Valor stock">${money((product.stock || 0) * (product.cost || 0))}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </section>
      <section class="panel">
        <div class="panel-header"><h2>Ultimas salidas de stock</h2></div>
        <div class="timeline">
          ${[...state.inventoryMovements].filter((movement) => !["ingreso", "entrada"].includes(movement.type)).slice(-10).reverse().map((movement) => {
            const product = getProduct(movement.productId);
            return `
              <div class="timeline-item">
                <span>${movement.date}</span>
                <strong>${movement.type.toUpperCase()} ${number(movement.quantity)} ${product?.unit || ""} ${movement.unitCost ? `- ${money(movement.quantity * movement.unitCost)}` : ""}</strong>
                <p>${product?.name || "Producto"} ${movement.orderId ? `- orden ${state.orders.find((order) => order.id === movement.orderId)?.number || movement.orderId}` : ""} ${movement.lot ? `- lote ${movement.lot}` : ""} ${movement.note ? `- ${movement.note}` : ""}</p>
              </div>
            `;
          }).join("") || `<div class="empty">Sin salidas, devoluciones o ajustes recientes.</div>`}
        </div>
      </section>
    </div>
  `;
}

function renderPrices() {
  views.prices.innerHTML = `
    <section class="panel">
      <div class="panel-header">
        <div>
          <h2>Precios por producto</h2>
          <p>Define el precio unitario para calcular costos por kg/L procesado en cada salida.</p>
        </div>
        <button class="primary-button" data-action="save-prices">Guardar precios</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Producto</th><th>Unidad</th><th>Precio unitario</th><th>Stock</th><th>Valor stock</th></tr></thead>
          <tbody>
            ${state.products.map((product) => `
              <tr>
                <td data-label="Producto"><strong>${product.name}</strong><br><span>${product.ingredient || ""}</span></td>
                <td data-label="Unidad">${product.unit}</td>
                <td data-label="Precio unitario"><input class="price-input" data-product-id="${product.id}" type="number" step="1" value="${product.cost || 0}"></td>
                <td data-label="Stock">${number(product.stock)} ${product.unit}</td>
                <td data-label="Valor stock">${money((product.stock || 0) * (product.cost || 0))}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderReports() {
  const seasons = ["Todas", ...state.seasons.map((season) => season.id).filter(Boolean)];
  const seasonLabel = (seasonId) => seasonId === "Todas" ? "Todas" : getSeason(seasonId).name;
  const species = ["Todas", ...new Set(state.orders.map((order) => order.crop).filter(Boolean))];
  const programNumbers = ["Todos", ...new Set(state.orders.flatMap((order) => order.programNumbers?.length ? order.programNumbers : [order.programNumber]).filter((value) => value !== "" && value !== undefined).map(String))].sort((a, b) => a === "Todos" ? -1 : Number(a) - Number(b));
  const orders = state.orders.filter((order) => {
    const seasonOk = reportFilters.seasonId === "Todas" || order.seasonId === reportFilters.seasonId;
    const speciesOk = reportFilters.species === "Todas" || order.crop === reportFilters.species;
    const programOk = reportFilters.programNumber === "Todos" || (order.programNumbers?.length ? order.programNumbers.map(String).includes(String(reportFilters.programNumber)) : String(order.programNumber) === String(reportFilters.programNumber));
    return seasonOk && speciesOk && programOk;
  });
  const productRows = reportProductRows(orders);
  const byProduct = reportByProduct(orders);
  const byProgram = reportByKey(orders, (order) => programLabel(order));
  const waterByProgram = reportWaterByProgram(orders);
  const waterByOperator = reportWaterByOperator(orders);
  const productHaByPotrero = reportProductHaByPotrero(orders);
  const monthly = reportByMonth(orders);
  const plannedWater = orders.reduce((sum, order) => sum + plannedLiters(order), 0);
  const dispatchedWater = orders.reduce((sum, order) => sum + dispatchedLiters(order), 0);
  const plannedKg = productRows.reduce((sum, row) => sum + row.planned, 0);
  const dispatchedKg = productRows.reduce((sum, row) => sum + row.dispatched, 0);
  const cost = orders.reduce((sum, order) => sum + dispatchCost(order), 0);
  const hectares = orders.reduce((sum, order) => sum + (Number(order.hectares) || 0), 0);
  const avgWaterHa = hectares ? dispatchedWater / hectares : 0;
  const completion = plannedWater ? dispatchedWater / plannedWater * 100 : 0;

  views.reports.innerHTML = `
    <section class="panel report-toolbar">
      <div>
        <h2>Reportes de control</h2>
        <p>Avance, costos, mojamiento promedio por programa y tendencia de salidas.</p>
      </div>
      <div class="report-filters">
        <label>Temporada
          <select id="reportSeasonFilter">${seasons.map((item) => `<option value="${item}" ${item === reportFilters.seasonId ? "selected" : ""}>${seasonLabel(item)}</option>`).join("")}</select>
        </label>
        <label>Especie
          <select id="reportSpeciesFilter">${species.map((item) => `<option value="${item}" ${item === reportFilters.species ? "selected" : ""}>${item}</option>`).join("")}</select>
        </label>
        <label>N programa
          <select id="reportProgramFilter">${programNumbers.map((item) => `<option value="${item}" ${item === reportFilters.programNumber ? "selected" : ""}>${item}</option>`).join("")}</select>
        </label>
        <button class="secondary-button" data-action="clear-report-filter">Limpiar</button>
      </div>
    </section>
    <div class="kpi-grid report-kpis">
      ${kpi("Avance programa", `${number(completion, 0)}%`, `${number(dispatchedWater, 0)} de ${number(plannedWater, 0)} L`)}
      ${kpi("Mojamiento prom.", `${number(avgWaterHa, 0)} L/ha`, "Salidas netas / hectareas")}
      ${kpi("Kg/L usados", `${number(dispatchedKg)} kg/L`, `Faltan ${number(plannedKg - dispatchedKg)} kg/L`)}
      ${kpi("Costo usado", money(cost), "Valorizado por salidas")}
    </div>
    <div class="report-grid">
      ${chartPanel("Avance por programa", "Mojamiento salido vs planificado", byProgram.map((row) => progressBar(row.label, row.dispatchedWater, row.plannedWater, `${number(row.percent, 0)}%`)).join(""))}
      ${chartPanel("Mojamiento por tractorista", "Ranking por litros netos salidos en la temporada/filtro", waterByOperator.map((row) => valueBar(row.label, row.water, waterByOperator[0]?.water || 0, `${number(row.water, 0)} L`)).join(""))}
      ${chartPanel("Producto por hectarea por potrero", "Potreros con mayor cantidad neta de producto aplicado por ha", productHaByPotrero.map((row) => valueBar(row.label, row.productHa, productHaByPotrero[0]?.productHa || 0, `${number(row.productHa)} kg/L ha`)).join(""))}
      ${chartPanel("Costo por producto", "Valorizado con precio kg/L", byProduct.map((row) => valueBar(row.product.name, row.value, byProduct[0]?.value || 0, money(row.value))).join(""))}
      ${chartPanel("Stock utilizado por producto", "Total ingresado, usado y saldo disponible", stockUsageReport())}
      ${chartPanel("Mojamiento promedio por programa", "Despliega cada programa para ver potrero y bloque", waterByProgram.map(waterProgramDetails).join(""))}
      ${chartPanel("Tendencia mensual", "Mojamiento y costo por mes", monthly.map((row) => stackedMetric(row.label, row.water, Math.max(...monthly.map((item) => item.water), 1), `${number(row.water, 0)} L`, money(row.cost))).join(""))}
    </div>
  `;
  document.getElementById("reportSeasonFilter")?.addEventListener("change", (event) => {
    reportFilters.seasonId = event.target.value;
    renderReports();
  });
  document.getElementById("reportSpeciesFilter")?.addEventListener("change", (event) => {
    reportFilters.species = event.target.value;
    renderReports();
  });
  document.getElementById("reportProgramFilter")?.addEventListener("change", (event) => {
    reportFilters.programNumber = event.target.value;
    renderReports();
  });
}

function reportProductRows(orders) {
  return orders.flatMap((order) => order.recipe.map((line) => {
    const product = getProduct(line.productId);
    const planned = plannedProduct(order, line);
    const dispatched = dispatchedProduct(order, line.productId);
    return {
      order,
      product,
      productHa: productHaFromDose(order, line),
      planned,
      dispatched,
      remaining: planned - dispatched,
      value: dispatched * (product?.cost || 0)
    };
  }));
}

function reportByProduct(orders) {
  return state.products.map((product) => {
    const actual = orders.reduce((sum, order) => sum + dispatchedProduct(order, product.id), 0);
    return { product, actual, value: actual * (product.cost || 0) };
  }).filter((row) => row.actual > 0).sort((a, b) => b.value - a.value);
}

function reportWaterByOperator(orders) {
  const grouped = {};
  orders.forEach((order) => {
    (order.dispatches || []).forEach((dispatch) => {
      const operatorKey = dispatch.operatorId || "Sin asignar";
      const sign = dispatch.type === "devolucion" ? -1 : 1;
      grouped[operatorKey] ||= { id: operatorKey, label: getOperator(operatorKey), water: 0, count: 0 };
      grouped[operatorKey].water += sign * (Number(dispatch.liters) || 0);
      if (dispatch.type !== "devolucion") grouped[operatorKey].count += 1;
    });
  });
  return Object.values(grouped)
    .filter((row) => row.water > 0)
    .sort((a, b) => b.water - a.water);
}

function reportProductHaByPotrero(orders) {
  const grouped = {};
  orders.forEach((order) => {
    const key = order.potrero || "Sin potrero";
    grouped[key] ||= { label: key, hectares: 0, product: 0, orders: new Set() };
    if (!grouped[key].orders.has(order.id)) {
      grouped[key].orders.add(order.id);
      grouped[key].hectares += Number(order.hectares) || 0;
    }
    (order.dispatches || []).forEach((dispatch) => {
      const sign = dispatch.type === "devolucion" ? -1 : 1;
      grouped[key].product += Object.values(dispatch.products || {}).reduce((sum, value) => sum + sign * (Number(value) || 0), 0);
    });
  });
  return Object.values(grouped)
    .map((row) => ({ ...row, productHa: row.hectares ? row.product / row.hectares : 0 }))
    .filter((row) => row.productHa > 0)
    .sort((a, b) => b.productHa - a.productHa);
}

function stockUsageRows() {
  return state.products.map((product) => {
    const movements = state.inventoryMovements.filter((movement) => movement.productId === product.id);
    const ingresadoMov = movements
      .filter((movement) => ["ingreso", "entrada"].includes(movement.type))
      .reduce((sum, movement) => sum + (Number(movement.quantity) || 0), 0);
    const salidas = movements
      .filter((movement) => movement.type === "salida")
      .reduce((sum, movement) => sum + (Number(movement.quantity) || 0), 0);
    const devoluciones = movements
      .filter((movement) => movement.type === "devolucion")
      .reduce((sum, movement) => sum + (Number(movement.quantity) || 0), 0);
    const usado = Math.max(0, salidas - devoluciones);
    const saldo = Number(product.stock) || 0;
    const totalIngresado = ingresadoMov || saldo + usado;
    const pct = totalIngresado ? usado / totalIngresado * 100 : 0;
    return { product, totalIngresado, usado, saldo, pct };
  }).filter((row) => row.totalIngresado || row.usado || row.saldo)
    .sort((a, b) => b.pct - a.pct);
}

function stockUsageReport() {
  const rows = stockUsageRows();
  if (!rows.length) return "";
  return `
    <div class="table-wrap compact-table">
      <table>
        <thead><tr><th>Producto</th><th>Total ingresado</th><th>Usado neto</th><th>Stock queda</th><th>% usado</th><th>Valor saldo</th></tr></thead>
        <tbody>
          ${rows.map((row) => `
            <tr>
              <td><strong>${row.product.name}</strong><br><span>${row.product.ingredient || ""}</span></td>
              <td data-label="Total ingresado">${number(row.totalIngresado)} ${row.product.unit}</td>
              <td data-label="Usado neto">${number(row.usado)} ${row.product.unit}</td>
              <td data-label="Stock queda">${number(row.saldo)} ${row.product.unit}</td>
              <td data-label="% usado">${number(row.pct, 0)}%</td>
              <td data-label="Valor saldo">${money(row.saldo * (row.product.cost || 0))}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function reportByKey(orders, keyFn) {
  return Object.values(orders.reduce((acc, order) => {
    const key = keyFn(order);
    acc[key] ||= { label: key, plannedWater: 0, dispatchedWater: 0, cost: 0 };
    acc[key].plannedWater += plannedLiters(order);
    acc[key].dispatchedWater += dispatchedLiters(order);
    acc[key].cost += dispatchCost(order);
    acc[key].percent = acc[key].plannedWater ? acc[key].dispatchedWater / acc[key].plannedWater * 100 : 0;
    return acc;
  }, {})).sort((a, b) => b.cost - a.cost);
}

function reportByField(orders) {
  return Object.values(orders.reduce((acc, order) => {
    const key = `${order.potrero} / ${order.blocks?.join(", ") || "-"}`;
    acc[key] ||= { label: key, hectares: 0, plannedWater: 0, dispatchedWater: 0, cost: 0 };
    acc[key].hectares += Number(order.hectares) || 0;
    acc[key].plannedWater += plannedLiters(order);
    acc[key].dispatchedWater += dispatchedLiters(order);
    acc[key].cost += dispatchCost(order);
    acc[key].avgWaterHa = acc[key].hectares ? acc[key].dispatchedWater / acc[key].hectares : 0;
    return acc;
  }, {})).sort((a, b) => b.avgWaterHa - a.avgWaterHa);
}

function reportWaterByProgram(orders) {
  const grouped = {};
  orders.forEach((order) => {
    const programs = order.programNumbers?.length ? order.programNumbers : [order.programNumber || "SN"];
    programs.forEach((programNumber) => {
      const key = String(programNumber || "SN");
      grouped[key] ||= { label: `Programa ${key}`, hectares: 0, water: 0, children: {} };
      grouped[key].hectares += Number(order.hectares) || 0;
      grouped[key].water += dispatchedLiters(order);
      const fieldKey = `${order.potrero} / ${order.blocks?.join(", ") || "-"}`;
      grouped[key].children[fieldKey] ||= { label: fieldKey, hectares: 0, water: 0 };
      grouped[key].children[fieldKey].hectares += Number(order.hectares) || 0;
      grouped[key].children[fieldKey].water += dispatchedLiters(order);
    });
  });
  return Object.values(grouped).map((row) => ({
    ...row,
    avg: row.hectares ? row.water / row.hectares : 0,
    children: Object.values(row.children).map((child) => ({
      ...child,
      avg: child.hectares ? child.water / child.hectares : 0
    })).sort((a, b) => b.avg - a.avg)
  })).sort((a, b) => a.label.localeCompare(b.label, undefined, { numeric: true }));
}

function waterProgramDetails(row) {
  return `
    <details class="report-drill">
      <summary><strong>${row.label}</strong><span>${number(row.avg, 0)} L/ha promedio / ${number(row.water, 0)} L</span></summary>
      ${row.children.map((child) => valueBar(child.label, child.avg, Math.max(...row.children.map((item) => item.avg), 1), `${number(child.avg, 0)} L/ha`)).join("")}
    </details>
  `;
}

function reportByMonth(orders) {
  const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  return months.map((label, index) => {
    const month = String(index + 1).padStart(2, "0");
    const monthOrders = orders.filter((order) => String((orderStartDate(order) || "").slice(5, 7)) === month);
    return {
      label,
      water: monthOrders.reduce((sum, order) => sum + dispatchedLiters(order), 0),
      cost: monthOrders.reduce((sum, order) => sum + dispatchCost(order), 0)
    };
  });
}

function reportOveruseRows(orders) {
  const tolerance = 1.05;
  return orders.flatMap((order) => order.dispatches.flatMap((dispatch) => {
    if (dispatch.type === "devolucion") return [];
    const liters = Number(dispatch.liters) || 0;
    return order.recipe.map((line) => {
      const product = getProduct(line.productId);
      const expected = liters * (Number(line.dose100) || 0) / 100;
      const actual = Number(dispatch.products?.[line.productId]) || 0;
      const extra = actual - expected;
      return {
        order,
        product,
        date: dispatch.date,
        liters,
        waterHa: order.hectares ? liters / order.hectares : 0,
        expected,
        actual,
        extra,
        extraValue: extra * (product?.cost || 0)
      };
    }).filter((row) => row.actual > row.expected * tolerance && row.extra > 0);
  })).sort((a, b) => b.extraValue - a.extraValue);
}

function chartPanel(title, subtitle, content) {
  return `
    <section class="panel chart-panel">
      <div class="panel-header">
        <div>
          <h2>${title}</h2>
          <p>${subtitle}</p>
        </div>
      </div>
      <div class="chart-body">${content || `<div class="empty">Sin datos para este filtro.</div>`}</div>
    </section>
  `;
}

function progressBar(label, actual, total, valueLabel) {
  const pct = total ? Math.min(140, actual / total * 100) : 0;
  const cls = pct >= 100 ? "done" : pct > 0 ? "process" : "pending";
  return `
    <div class="report-progress-row">
      <span>${label}</span>
      <div><i class="${cls}" style="width:${Math.min(100, pct)}%"></i></div>
      <strong>${valueLabel}</strong>
    </div>
  `;
}

function valueBar(label, value, max, valueLabel) {
  const width = max ? Math.max(2, value / max * 100) : 0;
  return `
    <div class="report-progress-row">
      <span>${label}</span>
      <div><i style="width:${width}%"></i></div>
      <strong>${valueLabel}</strong>
    </div>
  `;
}

function stackedMetric(label, value, max, main, secondary) {
  const width = max ? Math.max(2, value / max * 100) : 0;
  return `
    <div class="monthly-row">
      <span>${label}</span>
      <div><i style="height:${width}%"></i></div>
      <strong>${main}</strong>
      <small>${secondary}</small>
    </div>
  `;
}

function renderMasters() {
  views.masters.innerHTML = `
    <div class="layout two-columns">
      <section class="panel">
        <div class="panel-header"><h2>Potreros y bloques</h2></div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Potrero</th><th>Bloque</th><th>Especie</th><th>Variedad</th><th>Has</th></tr></thead>
            <tbody>${state.blocks.map((block) => `<tr><td>${block.potrero}</td><td>${block.block}</td><td>${block.crop}</td><td>${block.variety}</td><td>${number(block.hectares)}</td></tr>`).join("")}</tbody>
          </table>
        </div>
      </section>
      <section class="panel">
        <div class="panel-header"><h2>Equipos y aplicadores</h2></div>
        <div class="split-list">
          <div>
            <h3>Aplicadores</h3>
            ${state.operators.map((operator) => `<p>${operator.name}</p>`).join("")}
          </div>
          <div>
            <h3>Equipos</h3>
            ${state.equipment.map((item) => `<p>${item.code} - ${item.type}${item.tankLiters ? ` - ${number(item.tankLiters, 0)} L` : ""}</p>`).join("")}
          </div>
        </div>
      </section>
    </div>
  `;
}

function openOrderDialog(orderId) {
  const dialog = document.getElementById("orderDialog");
  const order = orderId ? state.orders.find((item) => item.id === orderId) : null;
  const nextNumber = Math.max(0, ...state.orders.map((item) => Number(item.number) || 0)) + 1;
  const selectedRecipe = order?.recipe || state.products.slice(0, 2).map((product) => ({ productId: product.id, dose100: product.dose100 }));
  const potreros = uniquePotreros();
  const selectedPrograms = order?.programNumbers?.length ? order.programNumbers : [order?.programNumber].filter(Boolean);
  const initialPotrero = order?.classification === "P"
    ? firstPotreroFromSelection(order?.blocks, order?.potrero) || order?.potrero || ""
    : order?.potrero || "";

  dialog.innerHTML = `
    <form method="dialog" class="modal-body" id="orderForm">
      <div class="modal-head">
        <h2>${order ? "Editar orden" : "Nueva orden de aplicacion"}</h2>
        <button class="icon-button" type="button" data-action="close-dialog" title="Cerrar">x</button>
      </div>
      <div class="form-grid">
        <label>Numero<input name="number" type="number" step="0.01" value="${order?.number || nextNumber}" readonly required></label>
        <label>Temporada<select name="seasonId">${state.seasons.map((season) => `<option value="${season.id}" ${season.id === (order?.seasonId || state.settings.currentSeasonId) ? "selected" : ""}>${season.name}</option>`).join("")}</select></label>
        <label>Fecha de inicio<input name="plannedDate" type="date" value="${order ? orderStartDate(order) : new Date().toISOString().slice(0, 10)}" required></label>
        <label>Fecha termino aplicacion<input name="endDate" type="date" value="${order?.endDate || order?.plannedEndDate || (order ? orderStartDate(order) : new Date().toISOString().slice(0, 10))}" required></label>
        <div class="program-picker full">
          <input type="hidden" name="programNumbers" value="${selectedPrograms.join(", ")}">
          <div class="block-picker-head">
            <label>N programa / etapa
              <input id="programNumberInput" type="number" step="1" min="1" inputmode="numeric" placeholder="Ej: 1">
            </label>
            <button type="button" class="secondary-button" id="addProgramToOrder">Agregar programa</button>
          </div>
          <div id="selectedPrograms" class="selected-blocks"></div>
        </div>
        <label class="full">Objetivo<input name="objective" value="${order?.objective || ""}" placeholder="Control plaga, calibre, stress, foliar"></label>
        <label>Clasificacion
          <select name="classification">
            ${classificationOptions(order?.classification || "")}
          </select>
        </label>
        <label id="potreroSelectLabel">Potrero base
          <select name="potrero" id="potreroSelect" required>
            <option value="">Seleccionar</option>
            ${potreros.map((potrero) => `<option value="${potrero}" ${potrero === initialPotrero ? "selected" : ""}>${potrero}</option>`).join("")}
          </select>
        </label>
        <div class="block-picker full">
          <input type="hidden" name="blocks" value="${order?.blocks?.join(", ") || ""}">
          <div class="block-picker-head">
            <label>Bloque a agregar
              <select id="blockSelect">
                <option value="">Primero selecciona un potrero</option>
              </select>
            </label>
            <button type="button" class="secondary-button" id="addBlockToOrder">Agregar bloque</button>
          </div>
          <div id="selectedBlocks" class="selected-blocks"></div>
          <p id="blockSummary" class="field-hint">Selecciona el potrero y agrega uno o mas bloques. En Pulverizacion puedes mezclar mas de un potrero.</p>
        </div>
        <label class="autofill-locked-field">Especie<input name="crop" value="${order?.crop || ""}" placeholder="Se rellena automaticamente" readonly required><small>Autocompletado por potrero/bloque</small></label>
        <label class="autofill-locked-field">Variedad<input name="variety" value="${order?.variety || ""}" placeholder="Se rellena automaticamente" readonly><small>Autocompletado por potrero/bloque</small></label>
        <label>Hectareas<input name="hectares" type="number" step="0.01" value="${order?.hectares || ""}" readonly required></label>
        <label>Mojamiento L/ha<input name="waterHa" type="number" step="1" value="${order?.waterHa || 1500}" required></label>
        <label>Presion bar<input name="pressure" type="number" step="0.1" value="${order?.pressure || ""}" placeholder="18"></label>
        <label>Velocidad km/h<input name="speed" type="number" step="0.1" value="${order?.speed || ""}" placeholder="4.5"></label>
        <label>Boquilla<input name="nozzle" value="${order?.nozzle || ""}" placeholder="ATR 80, cono, abanico"></label>
        <label>Dosificador<input name="dosifier" value="${order?.dosifier || ""}" placeholder="Si / No / codigo"></label>
      </div>
      <div class="recipe-editor">
        <div class="panel-header">
          <h3>Receta</h3>
          <button type="button" class="secondary-button" id="addRecipeLine">Agregar producto</button>
        </div>
        <div id="recipeLines">
          <div class="recipe-line recipe-line-head">
            <strong>Producto</strong>
            <strong>Programa</strong>
            <strong>Dosis kg/L por 100 L</strong>
            <strong>Gasto kg/L por ha</strong>
            <span></span>
          </div>
          ${selectedRecipe.map((line) => recipeLineHtml(line, selectedPrograms)).join("")}
        </div>
      </div>
      <label>Observaciones<textarea name="notes" rows="3">${order?.notes || ""}</textarea></label>
      <div class="modal-actions">
        <button class="secondary-button" type="button" data-action="close-dialog">Cancelar</button>
        <button class="primary-button" type="button" id="saveOrder">${order ? "Guardar cambios" : "Crear orden"}</button>
      </div>
    </form>
  `;
  dialog.showModal();
  renderOrderProgramPicker(selectedPrograms);
  renderOrderBlockPicker(order?.blocks || []);
  document.querySelector('[name="classification"]').addEventListener("change", () => {
    const form = document.getElementById("orderForm");
    renderOrderBlockPicker(form.classification.value === "P" ? normalizeBlocksForPulverization(selectedOrderBlocks(), form.potrero.value) : []);
  });
  document.getElementById("potreroSelect").addEventListener("change", () => {
    const form = document.getElementById("orderForm");
    renderOrderBlockPicker(form.classification.value === "P" ? selectedOrderBlocks() : []);
    fillOrderFromSelectedBlocks();
  });
  document.querySelector('[name="plannedDate"]').addEventListener("change", (event) => {
    const endInput = document.querySelector('[name="endDate"]');
    if (endInput.value < event.target.value) endInput.value = event.target.value;
  });
  document.getElementById("addBlockToOrder").addEventListener("click", addSelectedBlockToOrder);
  document.getElementById("addProgramToOrder").addEventListener("click", addProgramToOrder);
  document.getElementById("addRecipeLine").addEventListener("click", () => {
    document.getElementById("recipeLines").insertAdjacentHTML("beforeend", recipeLineHtml({ productId: state.products[0].id, dose100: state.products[0].dose100 }, selectedOrderPrograms()));
  });
  dialog.addEventListener("click", removeRecipeLine);
  dialog.addEventListener("click", removeOrderBlock);
  dialog.addEventListener("click", removeOrderProgram);
  document.getElementById("saveOrder").addEventListener("click", () => saveOrder(order?.id));
}

function firstPotreroFromSelection(blocks = [], potreroText = "") {
  const fromBlock = (blocks || []).map(String).find((block) => block.includes(":"));
  if (fromBlock) return fromBlock.split(":")[0];
  return String(potreroText || "").split(",").map((item) => item.trim()).filter(Boolean)[0] || "";
}

function normalizeBlocksForPulverization(blocks = [], fallbackPotrero = "") {
  return blocks
    .map((block) => String(block).trim())
    .filter(Boolean)
    .map((block) => block.includes(":") || !fallbackPotrero ? block : `${fallbackPotrero}:${block}`);
}

function orderBlockKey(block, isMultiPotrero) {
  return isMultiPotrero ? `${block.potrero}:${block.block}` : String(block.block);
}

function parseOrderBlockKey(key, fallbackPotrero = "") {
  const value = String(key || "");
  if (value.includes(":")) {
    const [potrero, block] = value.split(":");
    return { potrero, block };
  }
  return { potrero: fallbackPotrero, block: value };
}

function blockLabelFromKey(key, fallbackPotrero = "") {
  const parsed = parseOrderBlockKey(key, fallbackPotrero);
  return parsed.potrero ? `${parsed.potrero} / Bloque ${parsed.block}` : `Bloque ${parsed.block}`;
}

function selectedBlocksByPotrero(selectedBlocks = [], fallbackPotrero = "") {
  return selectedBlocks.reduce((acc, key) => {
    const parsed = parseOrderBlockKey(key, fallbackPotrero);
    if (!parsed.block) return acc;
    const potrero = parsed.potrero || fallbackPotrero || "Sin potrero";
    acc[potrero] ||= [];
    acc[potrero].push({ key, block: parsed.block });
    return acc;
  }, {});
}

function selectedBlocksHtml(selected = [], fallbackPotrero = "") {
  if (!selected.length) return `<span class="muted-text">Aun no hay bloques agregados.</span>`;
  const groups = selectedBlocksByPotrero(selected, fallbackPotrero);
  return Object.entries(groups).map(([potrero, blocks]) => `
    <div class="selected-block-group">
      <strong>${potrero}</strong>
      <div>
        ${blocks.map((item) => `<button type="button" class="block-chip" data-action="remove-order-block" data-block="${htmlAttr(item.key)}">Bloque ${item.block}<span>x</span></button>`).join("")}
      </div>
    </div>
  `).join("");
}

function renderOrderBlockPicker(selectedBlocks = []) {
  const form = document.getElementById("orderForm");
  if (!form) return;
  const potrero = form.potrero.value;
  const isMultiPotrero = form.classification.value === "P";
  document.getElementById("potreroSelectLabel").firstChild.textContent = isMultiPotrero ? "Potrero a agregar " : "Potrero base ";
  const allAvailable = (isMultiPotrero ? state.blocks : blocksForPotrero(potrero)).sort(blockSort);
  const pickerAvailable = blocksForPotrero(potrero);
  const selected = selectedBlocks
    .map(String)
    .filter((block) => allAvailable.some((item) => orderBlockKey(item, isMultiPotrero) === block));
  form.blocks.value = selected.join(", ");
  const select = document.getElementById("blockSelect");
  select.innerHTML = pickerAvailable.length
    ? `<option value="__all__">Agregar todos los bloques de ${potrero}</option><option value="">Seleccionar bloque</option>${pickerAvailable
      .filter((block) => !selected.includes(orderBlockKey(block, isMultiPotrero)))
      .map((block) => `<option value="${orderBlockKey(block, isMultiPotrero)}">Bloque ${block.block} - ${number(block.hectares)} ha</option>`)
      .join("")}`
    : `<option value="">${potrero ? "Sin bloques registrados" : "Selecciona un potrero"}</option>`;
  document.getElementById("selectedBlocks").innerHTML = selectedBlocksHtml(selected, potrero);
  fillOrderFromSelectedBlocks();
}

function selectedOrderBlocks() {
  const form = document.getElementById("orderForm");
  return (form?.blocks.value || "").split(",").map((item) => item.trim()).filter(Boolean);
}

function addSelectedBlockToOrder() {
  const selected = selectedOrderBlocks();
  const block = document.getElementById("blockSelect").value;
  if (block === "__all__") {
    const form = document.getElementById("orderForm");
    const isMultiPotrero = form.classification.value === "P";
    const available = blocksForPotrero(form.potrero.value);
    const newBlocks = available.map((item) => orderBlockKey(item, isMultiPotrero));
    renderOrderBlockPicker([...new Set([...selected, ...newBlocks])]);
    return;
  }
  if (!block || selected.includes(block)) return;
  renderOrderBlockPicker([...selected, block]);
}

function removeOrderBlock(event) {
  if (event.target.closest("[data-action]")?.dataset.action !== "remove-order-block") return;
  const block = event.target.closest("[data-action]").dataset.block;
  renderOrderBlockPicker(selectedOrderBlocks().filter((item) => item !== block));
}

function fillOrderFromSelectedBlocks() {
  const form = document.getElementById("orderForm");
  if (!form) return;
  const potrero = form.potrero.value;
  const isMultiPotrero = form.classification.value === "P";
  const selected = selectedOrderBlocks();
  const rows = (isMultiPotrero ? state.blocks : blocksForPotrero(potrero))
    .filter((block) => selected.includes(orderBlockKey(block, isMultiPotrero)));
  const fallback = fieldSummary(potrero);
  const crops = [...new Set(rows.map((block) => block.crop).filter(Boolean))];
  const crop = crops.join(", ") || fallback?.crop || "";
  const varietyRows = rows.map((block) => {
    const isCaraCaraException = block.potrero === "P7" && String(block.block) === "9";
    return isCaraCaraException ? "CARA CARA" : block.variety;
  });
  const variety = [...new Set(varietyRows.filter(Boolean))].join(", ") || fallback?.variety || "";
  const hectares = rows.reduce((sum, block) => sum + (Number(block.hectares) || 0), 0);
  form.crop.value = crop;
  form.variety.value = variety;
  form.hectares.value = hectares ? hectares.toFixed(2) : "";
  document.getElementById("blockSummary").textContent = selected.length
    ? `${selected.length} bloque(s) seleccionados en ${Object.keys(selectedBlocksByPotrero(selected, potrero)).length} potrero(s) - ${number(hectares)} ha totales.`
    : "Agrega los bloques que entran en esta aplicacion. Las hectareas se suman automaticamente.";
}

function selectedOrderPrograms() {
  const form = document.getElementById("orderForm");
  return (form?.programNumbers.value || "").split(",").map((item) => Number(item.trim())).filter(Boolean);
}

function renderOrderProgramPicker(programs = []) {
  const form = document.getElementById("orderForm");
  if (!form) return;
  const selected = [...new Set(programs.map(Number).filter(Boolean))].sort((a, b) => a - b);
  form.programNumbers.value = selected.join(", ");
  document.getElementById("selectedPrograms").innerHTML = selected.length
    ? selected.map((program) => `<button type="button" class="block-chip" data-action="remove-order-program" data-program="${program}">Programa ${program}<span>x</span></button>`).join("")
    : `<span class="muted-text">Agrega al menos un numero de programa.</span>`;
  document.querySelectorAll(".recipe-line select[name='lineProgramNumber']").forEach((select) => {
    const current = select.value;
    select.innerHTML = programOptions(selected, current);
  });
}

function addProgramToOrder() {
  const input = document.getElementById("programNumberInput");
  const program = Number(input.value);
  if (!program) return;
  renderOrderProgramPicker([...selectedOrderPrograms(), program]);
  input.value = "";
}

function removeOrderProgram(event) {
  if (event.target.closest("[data-action]")?.dataset.action !== "remove-order-program") return;
  const program = Number(event.target.closest("[data-action]").dataset.program);
  renderOrderProgramPicker(selectedOrderPrograms().filter((item) => item !== program));
}

function programOptions(programs, selected) {
  const values = programs.length ? programs : [selected].filter(Boolean);
  return values.map((program) => `<option value="${program}" ${String(program) === String(selected) ? "selected" : ""}>Programa ${program}</option>`).join("");
}

function recipeLineHtml(line, programs = []) {
  return `
    <div class="recipe-line">
      <select name="productId">${state.products.map((product) => `<option value="${product.id}" ${product.id === line.productId ? "selected" : ""}>${product.name}</option>`).join("")}</select>
      <select name="lineProgramNumber">${programOptions(programs, line.programNumber || programs[0] || "")}</select>
      <input name="dose100" type="number" step="0.01" value="${line.dose100}" aria-label="Dosis kg/L por 100 litros" title="Dosis kg/L por 100 litros">
      <input name="productHaProgram" type="number" step="0.001" value="${line.productHaProgram || ""}" aria-label="Gasto kg/L por hectarea programado" title="Gasto kg/L por hectarea programado">
      <button type="button" class="icon-button" data-action="remove-recipe" title="Quitar">x</button>
    </div>
  `;
}

function removeRecipeLine(event) {
  if (event.target.dataset.action === "remove-recipe") {
    event.target.closest(".recipe-line").remove();
  }
}

async function saveOrder(orderId) {
  const form = document.getElementById("orderForm");
  if (!form.reportValidity()) return;
  const data = Object.fromEntries(new FormData(form));
  const selectedBlocks = data.blocks.split(",").map((item) => item.trim()).filter(Boolean);
  const selectedPrograms = data.programNumbers.split(",").map((item) => Number(item.trim())).filter(Boolean);
  if (!selectedBlocks.length) {
    showToast("Agrega al menos un bloque a la orden");
    return;
  }
  if (!selectedPrograms.length) {
    showToast("Agrega al menos un numero de programa");
    return;
  }
  const startDate = data.plannedDate || data.date || new Date().toISOString().slice(0, 10);
  const endDate = data.endDate || startDate;
  if (endDate < startDate) {
    showToast("La fecha termino no puede ser anterior al inicio");
    return;
  }
  const recipe = [...document.querySelectorAll(".recipe-line")]
    .filter((line) => line.querySelector('[name="productId"]'))
    .map((line) => ({
    productId: line.querySelector('[name="productId"]').value,
    programNumber: Number(line.querySelector('[name="lineProgramNumber"]').value) || selectedPrograms[0],
    dose100: Number(line.querySelector('[name="dose100"]').value),
    productHaProgram: Number(line.querySelector('[name="productHaProgram"]').value) || 0
  })).filter((line) => line.productId && line.dose100 > 0);

  recipe.forEach((line) => {
    if (!line.productHaProgram) line.productHaProgram = (Number(data.waterHa) || 0) * line.dose100 / 100;
    line.totalProgram = line.productHaProgram * (Number(data.hectares) || 0);
  });

  const payload = {
    number: Number(data.number),
    seasonId: data.seasonId,
    programNumber: selectedPrograms[0] || "",
    programNumbers: selectedPrograms,
    program: "",
    classification: data.classification,
    // Compatibilidad: Supabase aun usa los campos fecha y fecha_planificada.
    // En la interfaz dejamos un solo campo visible: Fecha de inicio.
    date: startDate,
    plannedDate: startDate,
    fechaInicio: startDate,
    endDate: endDate,
    objective: data.objective,
    crop: data.crop,
    variety: data.variety,
    potrero: data.classification === "P" && selectedBlocks.some((block) => block.includes(":"))
      ? [...new Set(selectedBlocks.map((block) => block.split(":")[0]))].join(", ")
      : data.potrero,
    blocks: selectedBlocks,
    hectares: Number(data.hectares),
    waterHa: Number(data.waterHa),
    pressure: data.pressure,
    speed: data.speed,
    nozzle: data.nozzle,
    dosifier: data.dosifier,
    tractorCode: "",
    machineCode: "",
    operatorId: "",
    sprayerId: "",
    tractorId: "",
    status: orderId ? effectiveOrderStatus(state.orders.find((item) => item.id === orderId) || {}) : "planned",
    notes: data.notes,
    recipe
  };

  if (supabaseSession) {
    const orderToSave = orderId
      ? { ...(state.orders.find((item) => item.id === orderId) || {}), ...payload }
      : { id: uid("o"), createdAt: new Date().toISOString(), tanks: [], dispatches: [], movements: [], ...payload };
    try {
      await cloudSaveOrder(orderToSave);
      await loadCloudData();
      document.getElementById("orderDialog").close();
      render();
      showToast("Orden guardada en Supabase");
    } catch (error) {
      showToast(`No se guardo en Supabase: ${error.message}`);
    }
    return;
  }

  if (orderId) {
    const order = state.orders.find((item) => item.id === orderId);
    Object.assign(order, payload);
  } else {
    state.orders.unshift({ id: uid("o"), createdAt: new Date().toISOString(), tanks: [], dispatches: [], movements: [], ...payload });
  }
  saveState();
  document.getElementById("orderDialog").close();
  render();
  showToast("Orden guardada");
}

function openTankDialog(orderId) {
  const order = state.orders.find((item) => item.id === orderId);
  if (!order) return;
  const dialog = document.getElementById("tankDialog");
  const sprayer = state.equipment.find((item) => item.id === order.sprayerId);
  const defaultLiters = sprayer?.tankLiters || state.settings.defaultTankLiters;
  dialog.innerHTML = `
    <form method="dialog" class="modal-body" id="tankForm">
      <div class="modal-head">
        <h2>Registrar estanque - Orden #${order.number}</h2>
        <button class="icon-button" type="button" data-action="close-dialog" title="Cerrar">x</button>
      </div>
      <div class="form-grid">
        <label>Litros cargados<input name="liters" type="number" step="1" value="${defaultLiters}" required></label>
        <label>Fecha y hora<input name="appliedAt" type="datetime-local" value="${new Date().toISOString().slice(0, 16)}" required></label>
        <label>Presion real bar<input name="pressure" type="number" step="0.1" value="${order.pressure || ""}"></label>
        <label>Velocidad real km/h<input name="speed" type="number" step="0.1" value="${order.speed || ""}"></label>
        <label>Boquilla usada<input name="nozzle" value="${order.nozzle || ""}"></label>
        <label>Codigo maquina<input name="machineCode" value="${order.machineCode || getEquipment(order.sprayerId)}"></label>
      </div>
      <div class="recipe-editor">
        <h3>Productos cargados</h3>
        ${order.recipe.map((line) => {
          const product = getProduct(line.productId);
          const planned = defaultLiters * line.dose100 / 100;
          return `<label>${product?.name}<input name="product-${line.productId}" type="number" step="0.001" value="${planned}" required><span>${product?.unit || ""}</span></label>`;
        }).join("")}
      </div>
      <div class="modal-actions">
        <button class="secondary-button" type="button" data-action="close-dialog">Cancelar</button>
        <button class="primary-button" type="button" id="saveTank">Guardar estanque</button>
      </div>
    </form>
  `;
  dialog.showModal();
  document.getElementById("saveTank").addEventListener("click", () => saveTank(orderId));
}

function saveTank(orderId) {
  const order = state.orders.find((item) => item.id === orderId);
  const form = document.getElementById("tankForm");
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const products = {};
  order.recipe.forEach((line) => {
    products[line.productId] = Number(data.get(`product-${line.productId}`)) || 0;
  });
  order.tanks.push({
    id: uid("t"),
    liters: Number(data.get("liters")),
    appliedAt: data.get("appliedAt"),
    pressure: data.get("pressure"),
    speed: data.get("speed"),
    nozzle: data.get("nozzle"),
    machineCode: data.get("machineCode"),
    products
  });
  syncOrderStatus(order);
  saveState();
  document.getElementById("tankDialog").close();
  render();
  showToast("Estanque registrado");
}

function closeOrder(orderId) {
  const order = state.orders.find((item) => item.id === orderId);
  if (!order) return;
  order.recipe.forEach((line) => {
    const product = getProduct(line.productId);
    const qty = actualProduct(order, line.productId);
    if (!product || qty <= 0) return;
    product.stock = Math.max(0, Number(product.stock) - qty);
    const movement = {
      id: uid("m"),
      date: new Date().toISOString().slice(0, 10),
      type: "salida",
      productId: product.id,
      quantity: qty,
      orderId: order.id,
      note: `Cierre orden ${order.number}`
    };
    state.inventoryMovements.push(movement);
  });
  order.status = "closed";
  saveState();
  render();
  showToast("Aplicacion cerrada y stock descontado");
}

async function finishOrder(orderId) {
  const order = state.orders.find((item) => item.id === orderId);
  if (!order) return;
  order.status = "closed";
  order.finishedByManager = true;
  saveState();
  if (supabaseSession && isUuid(order.id)) {
    try {
      await sbFetch(`/rest/v1/ordenes_aplicacion?id=eq.${order.id}`, {
        method: "PATCH",
        prefer: "return=minimal",
        body: JSON.stringify({ estado: toDbOrderStatus("closed"), finalizada_por_jefe: true })
      });
      await loadCloudData();
    } catch (error) {
      showToast(`No se guardo en Supabase: ${error.message}`);
    }
  }
  render();
  showToast("Orden finalizada por supervisor");
}

async function cancelOrder(orderId) {
  const order = state.orders.find((item) => item.id === orderId);
  if (!order) return;
  if (!confirm(`¿Cancelar la orden #${order.number}? Esta accion dejara la orden marcada como Cancelada.`)) return;
  order.status = "cancelled";
  saveState();
  if (supabaseSession && isUuid(order.id)) {
    try {
      await sbFetch(`/rest/v1/ordenes_aplicacion?id=eq.${order.id}`, {
        method: "PATCH",
        prefer: "return=minimal",
        body: JSON.stringify({ estado: toDbOrderStatus("cancelled") })
      });
      await loadCloudData();
    } catch (error) {
      showToast(`No se guardo en Supabase: ${error.message}`);
      render();
      return;
    }
  }
  render();
  showToast("Orden cancelada");
}



function dispatchInfoRows(order) {
  if (!order?.dispatches?.length) {
    return `<tr><td colspan="8" data-label="Salidas">Sin salidas registradas para esta orden.</td></tr>`;
  }
  return order.dispatches.map((dispatch) => {
    const products = Object.entries(dispatch.products || {})
      .map(([productId, qty]) => {
        const product = getProduct(productId);
        return `${product?.name || "Producto"}: ${number(qty)} ${product?.unit || ""}`;
      })
      .join("<br>") || "-";
    return `
      <tr>
        <td data-label="Fecha">${dispatch.date || "-"}</td>
        <td data-label="Hora">${dispatchDisplayTime(dispatch)}</td>
        <td data-label="Tipo">${dispatch.type === "devolucion" ? "Devolución" : "Salida"}</td>
        <td data-label="Mojamiento">${number(dispatch.liters || 0, 0)} L</td>
        <td data-label="Tractor">${dispatch.tractorCode || "-"}</td>
        <td data-label="Máquina">${dispatch.machineCode || "-"}</td>
        <td data-label="Aplicador">${dispatch.operatorId ? getOperator(dispatch.operatorId) : "-"}</td>
        <td data-label="Productos">${products}</td>
      </tr>
    `;
  }).join("");
}

function openDispatchInfoDialog(orderId) {
  const order = state.orders.find((item) => item.id === orderId);
  if (!order) return;
  const dialog = document.getElementById("outputInfoDialog") || document.getElementById("movementDialog");
  const total = plannedLiters(order);
  const dispatched = dispatchedLiters(order);
  const pct = total ? Math.min(100, dispatched / total * 100) : 0;
  const salidaCount = (order.dispatches || []).filter((item) => item.type !== "devolucion").length;
  const devolucionCount = (order.dispatches || []).filter((item) => item.type === "devolucion").length;
  dialog.innerHTML = `
    <div class="modal-body dispatch-info-modal">
      <div class="modal-head">
        <div>
          <h2>Información de salida - Orden #${order.number}</h2>
          <p>${order.potrero || "-"} · ${programLabel(order)} · ${order.objective || "Sin objetivo"}</p>
        </div>
        <button class="icon-button" type="button" data-action="close-dialog" title="Cerrar">x</button>
      </div>
      <div class="dispatch-info-summary">
        <span><strong>Total autorizado</strong>${number(total, 0)} L</span>
        <span><strong>Salido neto</strong>${number(dispatched, 0)} L</span>
        <span><strong>Avance</strong>${number(pct, 0)}%</span>
        <span><strong>Salidas</strong>${salidaCount}</span>
        <span><strong>Devoluciones</strong>${devolucionCount}</span>
      </div>
      <div class="progress"><i style="width:${pct}%"></i></div>
      <div class="table-wrap compact-table dispatch-info-table">
        <table>
          <thead><tr><th>Fecha</th><th>Hora</th><th>Tipo</th><th>Mojamiento</th><th>Tractor</th><th>Máquina</th><th>Aplicador</th><th>Productos</th></tr></thead>
          <tbody>${dispatchInfoRows(order)}</tbody>
        </table>
      </div>
      ${order.notes ? `<div class="gantt-detail-note"><strong>Nota / descripción</strong><p>${escapeHtml(order.notes)}</p></div>` : ""}
      <div class="modal-actions">
        <button class="secondary-button" type="button" data-action="close-dialog">Cerrar</button>
        <button class="secondary-button" type="button" data-action="print-order" data-id="${order.id}">PDF orden</button>
      </div>
    </div>
  `;
  dialog.showModal();
}

function openEditDispatchDialog(orderId, dispatchId) {
  const order = state.orders.find((item) => item.id === orderId);
  const dispatch = order?.dispatches?.find((item) => String(item.id) === String(dispatchId));
  if (!order || !dispatch) return;

  const dialog = document.getElementById(dispatch.type === "devolucion" ? "returnDialog" : "dispatchDialog");
  dialog.innerHTML = `
    <form method="dialog" class="modal-body" id="editDispatchForm">
      <div class="modal-head">
        <h2>Modificar ${dispatch.type === "devolucion" ? "devolucion" : "salida"} - Orden #${order.number}</h2>
        <button class="icon-button" type="button" data-action="close-dialog" title="Cerrar">x</button>
      </div>
      <div class="form-grid">
        <label>Fecha<input name="date" type="date" value="${dispatch.date || new Date().toISOString().slice(0, 10)}" required></label>
        <label>Hora salida<input name="time" type="time" value="${dispatchDisplayTime(dispatch) !== "-" ? dispatchDisplayTime(dispatch) : currentTimeValue()}" required></label>
        <label>Mojamiento ${dispatch.type === "devolucion" ? "devuelto" : "salida"} L<input name="liters" type="number" step="1" value="${dispatch.liters || 0}" required></label>
        <label class="locked-field">Potrero<input value="${order.potrero}" disabled><small>No editable por bodega</small></label>
        <label class="locked-field">Bloques<input value="${order.blocks?.join(", ") || ""}" disabled><small>No editable por bodega</small></label>
        <label class="locked-field">Total solicitado<input value="${number(plannedLiters(order), 0)} L" disabled><small>No editable por bodega</small></label>
        <label class="locked-field">Acumulado neto<input value="${number(dispatchedLiters(order), 0)} L" disabled><small>No editable por bodega</small></label>
        <label>Codigo tractor<select name="tractorCode" data-vehicle-code-select>${tractorCodeOptions(dispatch.tractorCode || "")}</select></label>
        <label>Codigo maquina<input name="machineCode" value="${dispatch.machineCode || ""}" placeholder="N-01"></label>
        <label>Aplicador<select name="operatorId">
          <option value="">Seleccionar</option>
          ${state.operators.map((operator) => `<option value="${operator.id}" ${operator.id === dispatch.operatorId ? "selected" : ""}>${operator.name}</option>`).join("")}
        </select></label>
      </div>
      <div class="recipe-editor">
        <h3>Productos ${dispatch.type === "devolucion" ? "devueltos" : "entregados"}</h3>
        ${order.recipe.map((line) => {
          const product = getProduct(line.productId);
          const qty = dispatch.products?.[line.productId] ?? 0;
          return `<label>${product?.name} (${number(productHaFromDose(order, line))} ${product?.unit}/ha)<input name="product-${line.productId}" data-product-input="${line.productId}" type="number" step="0.001" value="${Number(qty || 0).toFixed(3)}" required><span>${product?.unit || ""}</span></label>`;
        }).join("")}
      </div>
      <div class="calc-preview" id="editDispatchCalcPreview"></div>
      <label>Observacion<input name="note" value="${dispatch.note || ""}" placeholder="Motivo o detalle de la modificacion"></label>
      <div class="modal-actions">
        <button class="secondary-button" type="button" data-action="close-dialog">Cancelar</button>
        <button class="primary-button" type="button" id="updateDispatch">Guardar modificacion</button>
      </div>
    </form>
  `;
  dialog.showModal();
  refreshVehicleCodeSelect(dialog.querySelector('[name="tractorCode"]'), dispatch.tractorCode || "");
  updateEditDispatchPreview(orderId);
  document.querySelector('#editDispatchForm [name="liters"]')?.addEventListener("input", () => updateEditDispatchPreview(orderId));
  document.getElementById("updateDispatch")?.addEventListener("click", () => saveEditedDispatch(orderId, dispatchId, dialog));
}

function updateEditDispatchPreview(orderId) {
  const order = state.orders.find((item) => item.id === orderId);
  const form = document.getElementById("editDispatchForm");
  if (!order || !form) return;
  const liters = Number(form.liters.value) || 0;
  const equivalentHa = Number(order.waterHa) ? liters / Number(order.waterHa) : 0;
  const preview = document.getElementById("editDispatchCalcPreview");
  if (preview) {
    preview.innerHTML = `
      <span>Has equivalentes: <strong>${number(equivalentHa, 2)} ha</strong></span>
      <span>Edicion controlada: <strong>solo salida, trazabilidad y cantidades</strong></span>
      <span>Mojamiento orden: <strong>${number(order.waterHa, 0)} L/ha</strong></span>
    `;
  }
}

async function saveEditedDispatch(orderId, dispatchId, dialog) {
  const order = state.orders.find((item) => item.id === orderId);
  const dispatch = order?.dispatches?.find((item) => String(item.id) === String(dispatchId));
  const form = document.getElementById("editDispatchForm");
  if (!order || !dispatch || !form) return;
  if (!form.reportValidity()) return;

  const data = new FormData(form);
  const newLiters = Number(data.get("liters")) || 0;
  const otherDispatched = (order.dispatches || [])
    .filter((item) => String(item.id) !== String(dispatchId))
    .reduce((sum, item) => sum + (item.type === "devolucion" ? -(Number(item.liters) || 0) : (Number(item.liters) || 0)), 0);

  if (dispatch.type === "salida" && otherDispatched + newLiters > plannedLiters(order) * 1.03) {
    showToast("La modificacion supera el total autorizado");
    return;
  }

  const previous = {
    date: dispatch.date,
    time: dispatch.time,
    liters: dispatch.liters,
    tractorCode: dispatch.tractorCode,
    machineCode: dispatch.machineCode,
    operatorId: dispatch.operatorId,
    note: dispatch.note,
    products: { ...(dispatch.products || {}) },
    status: order.status,
    finishedByManager: order.finishedByManager
  };
  const previousProductStocks = new Map();

  order.recipe.forEach((line) => {
    const product = getProduct(line.productId);
    if (!product) return;
    previousProductStocks.set(product.id, Number(product.stock) || 0);
    const oldQty = Number(previous.products[line.productId]) || 0;
    const newQty = Number(data.get(`product-${line.productId}`)) || 0;
    const diff = newQty - oldQty;
    product.stock = dispatch.type === "devolucion"
      ? Math.max(0, product.stock + diff)
      : Math.max(0, product.stock - diff);
    dispatch.products[line.productId] = newQty;
  });

  dispatch.date = data.get("date");
  dispatch.time = data.get("time") || currentTimeValue();
  dispatch.liters = newLiters;
  dispatch.tractorCode = data.get("tractorCode");
  dispatch.machineCode = data.get("machineCode");
  dispatch.operatorId = data.get("operatorId");
  dispatch.note = data.get("note");
  syncOrderStatus(order);

  if (supabaseSession) {
    try {
      await cloudUpdateDispatch(order, dispatch);
      await loadCloudData();
      dialog.close();
      render();
      showToast("Salida modificada en Supabase");
    } catch (error) {
      Object.assign(dispatch, previous);
      previousProductStocks.forEach((stock, productId) => {
        const product = getProduct(productId);
        if (product) product.stock = stock;
      });
      order.status = previous.status;
      order.finishedByManager = previous.finishedByManager;
      showToast(`No se pudo modificar: ${error.message}`);
    }
    return;
  }

  saveState();
  dialog.close();
  render();
  showToast("Salida modificada");
}

async function deleteDispatch(orderId, dispatchId) {
  const order = state.orders.find((item) => item.id === orderId);
  const dispatch = order?.dispatches?.find((item) => String(item.id) === String(dispatchId));
  if (!order || !dispatch) return;

  const label = dispatch.type === "devolucion" ? "devolucion" : "salida";
  if (!confirm(`¿Borrar esta ${label} de la orden #${order.number}? Esta accion no se puede deshacer.`)) return;

  const previousDispatches = [...(order.dispatches || [])];
  const previousStatus = order.status;
  const previousFinished = order.finishedByManager;
  const previousProductStocks = new Map();

  Object.entries(dispatch.products || {}).forEach(([productId, quantity]) => {
    const product = getProduct(productId);
    if (!product) return;
    previousProductStocks.set(product.id, Number(product.stock) || 0);
    const qty = Number(quantity) || 0;
    product.stock = dispatch.type === "devolucion"
      ? Math.max(0, product.stock - qty)
      : product.stock + qty;
  });

  order.dispatches = (order.dispatches || []).filter((item) => String(item.id) !== String(dispatchId));
  syncOrderStatus(order);

  if (supabaseSession) {
    try {
      await cloudDeleteDispatch(order, dispatch);
      await loadCloudData();
      render();
      showToast("Salida borrada en Supabase");
    } catch (error) {
      order.dispatches = previousDispatches;
      previousProductStocks.forEach((stock, productId) => {
        const product = getProduct(productId);
        if (product) product.stock = stock;
      });
      order.status = previousStatus;
      order.finishedByManager = previousFinished;
      showToast(`No se pudo borrar: ${error.message}`);
    }
    return;
  }

  saveState();
  render();
  showToast("Salida borrada");
}

async function openDispatchDialog(orderId, type = "salida") {
  await ensureVehicleCodesLoaded();
  const order = state.orders.find((item) => item.id === orderId);
  if (!order) return;
  const remaining = Math.max(0, plannedLiters(order) - dispatchedLiters(order));
  const defaultLiters = type === "devolucion" ? 0 : Math.min(state.settings.defaultTankLiters, remaining || state.settings.defaultTankLiters);
  const lastDispatch = [...order.dispatches].reverse().find((item) => item.type === "salida") || {};
  const dialog = document.getElementById(type === "devolucion" ? "returnDialog" : "dispatchDialog");
  dialog.innerHTML = `
    <form method="dialog" class="modal-body" id="dispatchForm">
      <div class="modal-head">
        <h2>${type === "devolucion" ? "Devolucion de sobrante" : "Orden de salida"} - #${order.number}</h2>
        <button class="icon-button" type="button" data-action="close-dialog" title="Cerrar">x</button>
      </div>
      <div class="form-grid">
        <label>Fecha<input name="date" type="date" value="${new Date().toISOString().slice(0, 10)}" required></label>
        <label>Hora salida<input name="time" type="time" value="${currentTimeValue()}" required></label>
        <label>Mojamiento ${type === "devolucion" ? "devuelto" : "salida"} L<input name="liters" type="number" step="1" value="${defaultLiters}" required></label>
        <label class="locked-field">Potrero<input value="${order.potrero}" disabled><small>No editable por bodega</small></label>
        <label class="locked-field">Bloques<input value="${order.blocks?.join(", ") || ""}" disabled><small>No editable por bodega</small></label>
        <label class="locked-field">Total solicitado<input value="${number(plannedLiters(order), 0)} L" disabled><small>No editable por bodega</small></label>
        <label class="locked-field">Acumulado neto<input value="${number(dispatchedLiters(order), 0)} L" disabled><small>No editable por bodega</small></label>
        <label>Codigo tractor<select name="tractorCode" data-vehicle-code-select>${tractorCodeOptions(lastDispatch.tractorCode || "")}</select></label>
        <label>Codigo maquina<input name="machineCode" value="${lastDispatch.machineCode || ""}" placeholder="N-01"></label>
        <label>Aplicador<select name="operatorId">
          <option value="">Seleccionar</option>
          ${state.operators.map((operator) => `<option value="${operator.id}" ${operator.id === lastDispatch.operatorId ? "selected" : ""}>${operator.name}</option>`).join("")}
        </select></label>
      </div>
      <div class="recipe-editor">
        <h3>${type === "devolucion" ? "Productos devueltos" : "Productos a entregar"}</h3>
        ${order.recipe.map((line) => {
          const product = getProduct(line.productId);
          const qty = dispatchProductQuantity(order, line, defaultLiters);
          return `<label>${product?.name} (${number(productHaFromDose(order, line))} ${product?.unit}/ha)<input name="product-${line.productId}" data-product-input="${line.productId}" type="number" step="0.001" value="${number(qty, 3).replaceAll(".", "").replace(",", ".")}" required><span>${product?.unit || ""}</span></label>`;
        }).join("")}
      </div>
      <div class="calc-preview" id="dispatchCalcPreview"></div>
      <label>Observacion<input name="note" placeholder="${type === "devolucion" ? "Sobro producto, error de salida, devolucion parcial" : "Salida parcial, estanque, retiro de bodega"}"></label>
      <div class="modal-actions">
        <button class="secondary-button" type="button" data-action="close-dialog">Cancelar</button>
        <button class="primary-button" type="button" id="saveDispatch">${type === "devolucion" ? "Guardar devolucion" : "Guardar salida"}</button>
      </div>
    </form>
  `;
  dialog.showModal();
  refreshVehicleCodeSelect(dialog.querySelector('[name="tractorCode"]'), lastDispatch.tractorCode || "");
  updateDispatchProductQuantities(orderId);
  document.querySelector('#dispatchForm [name="liters"]').addEventListener("input", () => updateDispatchProductQuantities(orderId));
  document.getElementById("saveDispatch").addEventListener("click", () => saveDispatch(orderId, type, dialog));
}

function updateDispatchProductQuantities(orderId) {
  const order = state.orders.find((item) => item.id === orderId);
  const form = document.getElementById("dispatchForm");
  if (!order || !form) return;
  const liters = Number(form.liters.value) || 0;
  const equivalentHa = Number(order.waterHa) ? liters / Number(order.waterHa) : 0;
  order.recipe.forEach((line) => {
    const input = form.querySelector(`[data-product-input="${line.productId}"]`);
    if (!input) return;
    const qty = dispatchProductQuantity(order, line, liters);
    input.value = qty.toFixed(3);
  });
  const preview = document.getElementById("dispatchCalcPreview");
  if (preview) {
    preview.innerHTML = `
      <span>Has equivalentes: <strong>${number(equivalentHa, 2)} ha</strong></span>
      <span>Formula: <strong>Litros salida / ${number(order.waterHa, 0)} L/ha x kg-L/ha</strong></span>
      <span>Mojamiento orden: <strong>${number(order.waterHa, 0)} L/ha</strong></span>
    `;
  }
}

async function saveDispatch(orderId, type, dialog) {
  const order = state.orders.find((item) => item.id === orderId);
  const form = document.getElementById("dispatchForm");
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const liters = Number(data.get("liters")) || 0;
  if (type === "salida" && dispatchedLiters(order) + liters > plannedLiters(order) * 1.03) {
    showToast("La salida supera el total autorizado");
    return;
  }
  const products = {};
  const previousProductStocks = new Map();
  const newMovementIds = [];
  order.recipe.forEach((line) => {
    const qty = Number(data.get(`product-${line.productId}`)) || 0;
    products[line.productId] = qty;
    const product = getProduct(line.productId);
    if (!product) return;
    previousProductStocks.set(product.id, Number(product.stock) || 0);
    product.stock = type === "devolucion" ? product.stock + qty : Math.max(0, product.stock - qty);
    const movement = {
      id: uid("m"),
      date: data.get("date"),
      type,
      productId: line.productId,
      quantity: qty,
      unitCost: product.cost || 0,
      lot: product.lot || "",
      orderId,
      note: `${type === "devolucion" ? "Devolucion" : "Salida"} orden ${order.number}`
    };
    newMovementIds.push(movement.id);
    state.inventoryMovements.push(movement);
  });
  const dispatch = {
    id: uid(type === "devolucion" ? "d" : "s"),
    type,
    date: data.get("date"),
    time: data.get("time") || currentTimeValue(),
    liters,
    tractorCode: data.get("tractorCode"),
    machineCode: data.get("machineCode"),
    operatorId: data.get("operatorId"),
    note: data.get("note"),
    products
  };
  order.dispatches.push(dispatch);
  syncOrderStatus(order);
  if (supabaseSession) {
    if (!isUuid(order.id)) {
      order.dispatches = order.dispatches.filter((item) => item !== dispatch);
      previousProductStocks.forEach((stock, productId) => {
        const product = getProduct(productId);
        if (product) product.stock = stock;
      });
      state.inventoryMovements = state.inventoryMovements.filter((movement) => !newMovementIds.includes(movement.id));
      showToast("Esta orden no esta sincronizada con Supabase. Vuelve a crear/guardar la orden antes de despachar.");
      return;
    }
    try {
      await cloudSaveDispatch(order, dispatch);
      await loadCloudData();
      dialog.close();
      render();
      showToast(type === "devolucion" ? "Devolucion guardada en Supabase" : "Salida guardada en Supabase");
    } catch (error) {
      order.dispatches = order.dispatches.filter((item) => item !== dispatch);
      previousProductStocks.forEach((stock, productId) => {
        const product = getProduct(productId);
        if (product) product.stock = stock;
      });
      state.inventoryMovements = state.inventoryMovements.filter((movement) => !newMovementIds.includes(movement.id));
      showToast(`No se guardo en Supabase: ${error.message}`);
    }
    return;
  }
  saveState();
  dialog.close();
  render();
  showToast(type === "devolucion" ? "Devolucion registrada" : "Salida registrada");
}

function savePrices() {
  document.querySelectorAll(".price-input").forEach((input) => {
    const product = getProduct(input.dataset.productId);
    if (product) product.cost = Number(input.value) || 0;
  });
  saveState();
  render();
  showToast("Precios actualizados");
}

async function saveProgramDefinition(programId) {
  const program = state.programs.find((item) => item.id === programId);
  if (!program) return;
  document.querySelectorAll(`.program-def-input[data-program-id="${programId}"]`).forEach((input) => {
    program[input.dataset.field] = input.dataset.field === "waterHa" ? Number(input.value) || 0 : input.value;
  });
  saveState();
  if (supabaseSession) {
    try {
      await cloudSaveProgram(program);
    } catch (error) {
      showToast(`No se guardo en Supabase: ${error.message}`);
      return;
    }
  }
  renderProgram();
  showToast("Programa actualizado");
}

function xmlCell(value) {
  const text = value === null || value === undefined ? "" : String(value);
  return text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function worksheetXml(name, rows) {
  return `
    <Worksheet ss:Name="${xmlCell(name).slice(0, 31)}">
      <Table>
        ${rows.map((row) => `
          <Row>${row.map((cell) => `<Cell><Data ss:Type="${typeof cell === "number" ? "Number" : "String"}">${xmlCell(cell)}</Data></Cell>`).join("")}</Row>
        `).join("")}
      </Table>
    </Worksheet>
  `;
}

function cleanExcelValue(value) {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value.replace(/[\x00-\x1F\x7F]/g, " ").trim();
  return value;
}

function cleanStatusForExcel(status) {
  return String(status || "").replace(/[✅❌⏳⚙️📝]/g, "").trim();
}

function dispatchProductsText(order, dispatch) {
  return Object.entries(dispatch.products || {})
    .filter(([, qty]) => Number(qty) !== 0)
    .map(([productId, qty]) => {
      const product = getProduct(productId) || {};
      return `${product.name || productId}: ${number(qty)} ${product.unit || ""}`.trim();
    })
    .join(" | ");
}

function exportExcel() {
  const role = currentUserRole();
  if (!["admin", "supervisor"].includes(role)) {
    showToast("No tienes permisos para exportar Excel. Solo Admin o Jefe/Supervisor.");
    return;
  }

  const exportedAt = new Date().toLocaleString("es-CL");
  const sortedOrders = typeof sortOrdersNewestFirst === "function" ? sortOrdersNewestFirst([...state.orders]) : [...state.orders];

  const orderRows = [[
    "EXPORTADO", "TEMPORADA", "N PROGRAMA", "PROGRAMA", "CLASIFICACION", "ORDEN", "ESTADO", "FECHA INICIO", "FECHA INICIO BD", "FECHA TERMINO",
    "ESPECIE", "VARIEDAD", "POTRERO", "BLOQUES", "HAS", "OBJETIVO", "MOJAMIENTO HA", "MOJAMIENTO TOTAL PLANIFICADO",
    "MOJAMIENTO ACUMULADO SALIDO", "MOJAMIENTO PENDIENTE", "N SALIDAS", "N DEVOLUCIONES", "COSTO SALIDO", "PRESION", "BOQUILLA", "VELOCIDAD", "OBSERVACION"
  ]];

  const productRows = [[
    "ORDEN", "ESTADO", "FECHA INICIO", "POTRERO", "BLOQUES", "ESPECIE", "PROGRAMA", "PRODUCTO", "INGREDIENTE", "UNIDAD",
    "DOSIS KG/L 100L", "MOJAMIENTO HA", "KG/L HA PROG", "TOTAL PRODUCTO PROG", "KG/L SALIDO ACUMULADO", "KG/L PENDIENTE", "COSTO UNITARIO", "COSTO SALIDO"
  ]];

  const dispatchRows = [[
    "ORDEN", "ESTADO ORDEN", "N SALIDA", "TIPO", "FECHA", "HORA", "MOJAMIENTO SALIDA", "PRODUCTO", "UNIDAD", "CANTIDAD", "COSTO UNITARIO", "COSTO TOTAL", "TRACTOR", "MAQUINA", "APLICADOR", "NOTA"
  ]];

  const dispatchSummaryRows = [[
    "ORDEN", "N SALIDA", "TIPO", "FECHA", "HORA", "MOJAMIENTO SALIDA", "PRODUCTOS ENTREGADOS", "TOTAL PRODUCTOS", "COSTO TOTAL SALIDA", "TRACTOR", "MAQUINA", "APLICADOR", "NOTA"
  ]];

  const waterSummaryRows = [[
    "ORDEN", "ESTADO", "FECHA INICIO", "POTRERO", "BLOQUES", "ESPECIE", "MOJAMIENTO HA", "MOJAMIENTO TOTAL", "MOJAMIENTO ACUMULADO", "MOJAMIENTO PENDIENTE", "% AVANCE", "ULTIMA SALIDA FECHA", "ULTIMA SALIDA HORA"
  ]];

  sortedOrders.forEach((order) => {
    const seasonName = getSeason(order.seasonId).name;
    const status = cleanStatusForExcel(statusLabel(effectiveOrderStatus(order)));
    const plannedWater = plannedLiters(order);
    const dispatchedWater = dispatchedLiters(order);
    const pendingWater = Math.max(plannedWater - dispatchedWater, 0);
    const salidaCount = (order.dispatches || []).filter((item) => item.type !== "devolucion").length;
    const devolucionCount = (order.dispatches || []).filter((item) => item.type === "devolucion").length;
    const lastDispatch = latestDispatch(order);

    orderRows.push([
      exportedAt, seasonName, order.programNumber || "", programLabel(order), order.classification || "", order.number, status,
      orderStartDate(order) || "", orderStartDate(order) || "", order.endDate || "", order.crop || "", order.variety || "", order.potrero || "",
      order.blocks?.join(", ") || "", order.hectares || 0, order.objective || "", order.waterHa || 0, plannedWater, dispatchedWater,
      pendingWater, salidaCount, devolucionCount, dispatchCost(order), order.pressure || "", order.nozzle || "", order.speed || "", order.notes || ""
    ]);

    waterSummaryRows.push([
      order.number, status, orderStartDate(order) || "", order.potrero || "", order.blocks?.join(", ") || "", order.crop || "",
      order.waterHa || 0, plannedWater, dispatchedWater, pendingWater, plannedWater ? dispatchedWater / plannedWater : 0,
      lastDispatch.date || "", dispatchDisplayTime(lastDispatch)
    ]);

    (order.recipe || []).forEach((line) => {
      const product = getProduct(line.productId) || {};
      const dispatched = dispatchedProduct(order, line.productId);
      const planned = plannedProduct(order, line);
      productRows.push([
        order.number, status, orderStartDate(order) || "", order.potrero || "", order.blocks?.join(", ") || "", order.crop || "",
        programLabel(order), product.name || "", product.ingredient || "", product.unit || "", line.dose100 || 0, order.waterHa || 0,
        productHaFromDose(order, line), planned, dispatched, Math.max(planned - dispatched, 0), product.cost || 0, dispatched * (product.cost || 0)
      ]);
    });

    (order.dispatches || []).forEach((dispatch, index) => {
      const productEntries = Object.entries(dispatch.products || {}).filter(([, qty]) => Number(qty) !== 0);
      let dispatchCostTotal = 0;
      let dispatchQuantityTotal = 0;

      if (!productEntries.length) {
        dispatchRows.push([
          order.number, status, index + 1, dispatch.type === "devolucion" ? "Devolucion" : "Salida", dispatch.date || "", dispatchDisplayTime(dispatch),
          dispatch.liters || 0, "", "", 0, 0, 0, dispatch.tractorCode || "", dispatch.machineCode || "", dispatch.operatorId ? getOperator(dispatch.operatorId) : "", dispatch.note || ""
        ]);
      }

      productEntries.forEach(([productId, qty]) => {
        const product = getProduct(productId) || {};
        const quantity = Number(qty) || 0;
        const cost = Number(product.cost) || 0;
        dispatchQuantityTotal += quantity;
        dispatchCostTotal += quantity * cost;
        dispatchRows.push([
          order.number, status, index + 1, dispatch.type === "devolucion" ? "Devolucion" : "Salida", dispatch.date || "", dispatchDisplayTime(dispatch),
          dispatch.liters || 0, product.name || "", product.unit || "", quantity, cost, quantity * cost,
          dispatch.tractorCode || "", dispatch.machineCode || "", dispatch.operatorId ? getOperator(dispatch.operatorId) : "", dispatch.note || ""
        ]);
      });

      dispatchSummaryRows.push([
        order.number, index + 1, dispatch.type === "devolucion" ? "Devolucion" : "Salida", dispatch.date || "", dispatchDisplayTime(dispatch),
        dispatch.liters || 0, dispatchProductsText(order, dispatch), dispatchQuantityTotal, dispatchCostTotal,
        dispatch.tractorCode || "", dispatch.machineCode || "", dispatch.operatorId ? getOperator(dispatch.operatorId) : "", dispatch.note || ""
      ]);
    });
  });

  const productStockRows = [["PRODUCTO", "INGREDIENTE", "UNIDAD", "STOCK", "MINIMO", "KG/L POR SACO", "PRECIO SACO", "COSTO KG/L", "LOTE", "VENCIMIENTO"]];
  state.products.forEach((product) => productStockRows.push([
    product.name, product.ingredient, product.unit, product.stock, product.minStock, product.kgPerSack || "", product.sackPrice || "", product.cost || 0, product.lot || "", product.expires || ""
  ]));

  const movementRows = [["FECHA", "TIPO", "ORDEN", "PRODUCTO", "CANTIDAD", "COSTO UNITARIO", "COSTO TOTAL", "LOTE", "NOTA"]];
  state.inventoryMovements.forEach((movement) => {
    const product = getProduct(movement.productId) || {};
    const order = state.orders.find((item) => item.id === movement.orderId);
    movementRows.push([
      movement.date, movement.type, order?.number || "", product.name || "", movement.quantity || 0, movement.unitCost || product.cost || 0,
      (movement.quantity || 0) * (movement.unitCost || product.cost || 0), movement.lot || "", movement.note || ""
    ]);
  });

  const xml = `<?xml version="1.0"?>
  <?mso-application progid="Excel.Sheet"?>
  <Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
    xmlns:o="urn:schemas-microsoft-com:office:office"
    xmlns:x="urn:schemas-microsoft-com:office:excel"
    xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
    ${worksheetXml("Ordenes", orderRows.map((row) => row.map(cleanExcelValue)))}
    ${worksheetXml("Productos por orden", productRows.map((row) => row.map(cleanExcelValue)))}
    ${worksheetXml("Salidas bodega", dispatchRows.map((row) => row.map(cleanExcelValue)))}
    ${worksheetXml("Resumen por salida", dispatchSummaryRows.map((row) => row.map(cleanExcelValue)))}
    ${worksheetXml("Resumen mojamiento", waterSummaryRows.map((row) => row.map(cleanExcelValue)))}
    ${worksheetXml("Stock productos", productStockRows.map((row) => row.map(cleanExcelValue)))}
    ${worksheetXml("Movimientos stock", movementRows.map((row) => row.map(cleanExcelValue)))}
  </Workbook>`;
  downloadText(`ordenes-canelillo-${new Date().toISOString().slice(0, 10)}.xls`, xml, "application/vnd.ms-excel");
  showToast("Excel exportado correctamente");
}

function downloadText(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function printOrder(orderId) {
  const order = state.orders.find((item) => item.id === orderId);
  if (!order) return;
  const dispatchRows = order.dispatches.map((dispatch) => `
    <tr>
      <td>${dispatch.date || ""}</td>
      <td>${dispatch.type === "devolucion" ? "Devolucion" : "Salida"}</td>
      <td>${dispatch.type === "devolucion" ? "-" : ""}${number(dispatch.liters || 0, 0)}</td>
      <td>${dispatch.tractorCode || "-"}</td>
      <td>${dispatch.machineCode || "-"}</td>
      <td>${dispatch.operatorId ? getOperator(dispatch.operatorId) : "-"}</td>
      <td>${dispatch.note || ""}</td>
    </tr>
  `).join("");
  const rows = order.recipe.map((line) => {
    const product = getProduct(line.productId) || {};
    const salida = dispatchedProduct(order, line.productId);
    return `
      <tr>
        <td>${product.name || ""}</td>
        <td>${product.ingredient || ""}</td>
        <td>${number(line.dose100 || 0)}</td>
        <td>${number(productHaFromDose(order, line))}</td>
        <td>${number(plannedProduct(order, line))}</td>
        <td>${number(salida)}</td>
        <td>${product.unit || ""}</td>
      </tr>
    `;
  }).join("");
  document.getElementById("printArea").innerHTML = `
    <section class="print-sheet">
      <header class="print-head">
        <div>
          <h1>Orden de aplicacion #${order.number}</h1>
          <p>${state.settings.farmName} - Temporada ${state.settings.season}</p>
        </div>
        <div class="print-box">
          <strong>Fecha</strong>
          <span>${order.date || ""}</span>
        </div>
      </header>
      <div class="print-objective-title">
        <strong>Objetivo:</strong> ${order.objective || "-"}
      </div>
      <div class="print-grid">
        <div><strong>N programa</strong><span>${programNumbersLabel(order)}</span></div>
        <div><strong>Clasificacion</strong><span>${order.classification || "-"}</span></div>
        <div><strong>Objetivo</strong><span>${order.objective || "-"}</span></div>
        <div><strong>Especie</strong><span>${order.crop || "-"}</span></div>
        <div><strong>Variedad</strong><span>${order.variety || "-"}</span></div>
        <div><strong>Potrero</strong><span>${order.potrero || "-"}</span></div>
        <div><strong>Bloques</strong><span>${order.blocks?.join(", ") || "-"}</span></div>
        <div><strong>Hectareas</strong><span>${number(order.hectares)} ha</span></div>
        <div><strong>Mojamiento</strong><span>${number(order.waterHa, 0)} L/ha</span></div>
        <div><strong>Total mojamiento</strong><span>${number(plannedLiters(order), 0)} L</span></div>
        <div><strong>Salida acumulada</strong><span>${number(dispatchedLiters(order), 0)} L</span></div>
        <div><strong>Presion</strong><span>${order.pressure || "-"} bar</span></div>
        <div><strong>Boquilla</strong><span>${order.nozzle || "-"}</span></div>
        <div><strong>Velocidad</strong><span>${order.speed || "-"} km/h</span></div>
      </div>
      <table class="print-table">
        <thead><tr><th>Producto</th><th>Ingrediente</th><th>Dosis 100 L</th><th>kg/L ha</th><th>Total prog.</th><th>Salida neta</th><th>Unidad</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <table class="print-table">
        <thead><tr><th>Fecha salida</th><th>Tipo</th><th>Mojamiento L</th><th>Tractor</th><th>Maquina</th><th>Aplicador</th><th>Obs.</th></tr></thead>
        <tbody>${dispatchRows || `<tr><td colspan="7">Sin salidas registradas.</td></tr>`}</tbody>
      </table>
      <div class="signature-grid">
        <div><span></span><strong>Jefe encargado</strong></div>
        <div><span></span><strong>Bodeguero</strong></div>
        <div><span></span><strong>Aplicador</strong></div>
      </div>
    </section>
  `;
  setTimeout(() => window.print(), 50);
}

function openMovementDialog() {
  const dialog = document.getElementById("movementDialog");
  dialog.innerHTML = `
    <form method="dialog" class="modal-body" id="movementForm">
      <div class="modal-head">
        <h2>Movimiento de bodega</h2>
        <button class="icon-button" type="button" data-action="close-dialog" title="Cerrar">x</button>
      </div>
      <div class="form-grid">
        <label>Fecha<input name="date" type="date" value="${new Date().toISOString().slice(0, 10)}" required></label>
        <label>Tipo<select name="type"><option value="entrada">Entrada</option><option value="salida">Salida manual</option><option value="ajuste">Ajuste</option></select></label>
        <label class="full">Producto<select name="productId">${state.products.map((product) => `<option value="${product.id}">${product.name}</option>`).join("")}</select></label>
        <label>Cantidad<input name="quantity" type="number" step="0.001" required></label>
        <label class="full">Nota<input name="note" placeholder="Compra, devolucion, ajuste, merma"></label>
      </div>
      <div class="modal-actions">
        <button class="secondary-button" type="button" data-action="close-dialog">Cancelar</button>
        <button class="primary-button" type="button" id="saveMovement">Guardar movimiento</button>
      </div>
    </form>
  `;
  dialog.showModal();
  document.getElementById("saveMovement").addEventListener("click", saveMovement);
}

function openPurchaseDialog() {
  const dialog = document.getElementById("purchaseDialog");
  dialog.innerHTML = `
    <form method="dialog" class="modal-body" id="purchaseForm">
      <div class="modal-head">
        <h2>Ingreso de productos por saco</h2>
        <button class="icon-button" type="button" data-action="close-dialog" title="Cerrar">x</button>
      </div>
      <div class="form-grid">
        <label class="full">Producto<select name="productId">${state.products.map((product) => `<option value="${product.id}">${product.name}</option>`).join("")}</select></label>
        <label>Fecha<input name="date" type="date" value="${new Date().toISOString().slice(0, 10)}" required></label>
        <label>Cantidad de sacos/envases<input name="sacks" type="number" step="1" value="1" required></label>
        <label>Kg/L por saco/envase<input name="kgPerSack" type="number" step="0.001" value="25" required></label>
        <label>Precio por saco/envase<input name="sackPrice" type="number" step="1" required></label>
        <label>Vencimiento<input name="expires" type="date"></label>
        <label class="full">Observacion<input name="note" placeholder="Factura, proveedor, guia, compra temporada"></label>
      </div>
      <div class="calc-preview" id="purchasePreview"></div>
      <div class="modal-actions">
        <button class="secondary-button" type="button" data-action="close-dialog">Cancelar</button>
        <button class="primary-button" type="button" id="savePurchase">Ingresar a stock</button>
      </div>
    </form>
  `;
  dialog.showModal();
  const form = document.getElementById("purchaseForm");
  const update = () => {
    const sacks = Number(form.sacks.value) || 0;
    const kgPerSack = Number(form.kgPerSack.value) || 0;
    const sackPrice = Number(form.sackPrice.value) || 0;
    const total = sacks * kgPerSack;
    const unit = kgPerSack ? sackPrice / kgPerSack : 0;
    document.getElementById("purchasePreview").innerHTML = `
      <span>Total ingresado: <strong>${number(total)} kg/L</strong></span>
      <span>Costo calculado: <strong>${money(unit)} por kg/L</strong></span>
      <span>Total compra: <strong>${money(sacks * sackPrice)}</strong></span>
    `;
  };
  form.addEventListener("input", update);
  update();
  document.getElementById("savePurchase").addEventListener("click", savePurchase);
}

async function savePurchase() {
  const form = document.getElementById("purchaseForm");
  if (!form.reportValidity()) return;
  const data = Object.fromEntries(new FormData(form));
  const product = getProduct(data.productId);
  if (!product) return;
  const sacks = Number(data.sacks) || 0;
  const kgPerSack = Number(data.kgPerSack) || 0;
  const sackPrice = Number(data.sackPrice) || 0;
  const quantity = sacks * kgPerSack;
  const unitCost = kgPerSack ? sackPrice / kgPerSack : 0;
  product.stock = (Number(product.stock) || 0) + quantity;
  product.cost = unitCost;
  product.sacks = (Number(product.sacks) || 0) + sacks;
  product.kgPerSack = kgPerSack;
  product.sackPrice = sackPrice;
  product.expires = data.expires || product.expires;
  state.inventoryMovements.push({
    id: uid("m"),
    date: data.date,
    type: "ingreso",
    productId: product.id,
    quantity,
    sacks,
    kgPerSack,
    sackPrice,
    unitCost,
    lot: product.lot || "",
    note: data.note || "Ingreso por saco/lote"
  });
  saveState();
  if (supabaseSession) {
    try {
      await cloudSavePurchase(product, state.inventoryMovements[state.inventoryMovements.length - 1]);
      await loadCloudData();
    } catch (error) {
      showToast(`No se guardo en Supabase: ${error.message}`);
    }
  }
  document.getElementById("purchaseDialog").close();
  render();
  showToast("Ingreso a stock registrado");
}

function isSackIngressMovement(movement) {
  return movement?.type === "ingreso"
    && ((Number(movement.sacks) || 0) > 0 || (Number(movement.kgPerSack) || 0) > 0 || (Number(movement.sackPrice) || 0) > 0);
}

function stockMovementMatchQuery(movement) {
  const params = [
    `producto_id=eq.${encodeURIComponent(movement.productId)}`,
    "tipo=eq.ingreso",
    `fecha=eq.${encodeURIComponent(movement.date || "")}`,
    `cantidad=eq.${encodeURIComponent(Number(movement.quantity) || 0)}`,
    `sacos=eq.${encodeURIComponent(Number(movement.sacks) || 0)}`,
    `kg_por_saco=eq.${encodeURIComponent(Number(movement.kgPerSack) || 0)}`,
    `precio_saco=eq.${encodeURIComponent(Number(movement.sackPrice) || 0)}`
  ];
  if (movement.note) params.push(`nota=eq.${encodeURIComponent(movement.note)}`);
  params.push("limit=1");
  return params.join("&");
}

function openStockHistoryDialog() {
  const dialog = document.getElementById("movementDialog");
  const sackIngresses = [...state.inventoryMovements].filter(isSackIngressMovement).reverse();
  const lastIngress = sackIngresses[0];
  dialog.innerHTML = `
    <div class="modal-body">
      <div class="modal-head">
        <h2>Historial de ingresos por sacos</h2>
        <button class="icon-button" type="button" data-action="close-dialog" title="Cerrar">x</button>
      </div>
      <div class="table-wrap compact-table">
        <table>
          <thead><tr><th>Fecha</th><th>Producto</th><th>Sacos/envases</th><th>Kg/L saco</th><th>Total ingresado</th><th>Precio saco</th><th>Costo kg/L</th><th>Nota</th></tr></thead>
          <tbody>
            ${sackIngresses.map((movement) => {
              const product = getProduct(movement.productId);
              return `
                <tr>
                  <td>${movement.date || "-"}</td>
                  <td>${product?.name || movement.productId || "-"}</td>
                  <td>${number(movement.sacks, 0)}</td>
                  <td>${number(movement.kgPerSack)} ${product?.unit || ""}</td>
                  <td>${number(movement.quantity)} ${product?.unit || ""}</td>
                  <td>${movement.sackPrice ? money(movement.sackPrice) : "-"}</td>
                  <td>${movement.unitCost ? money(movement.unitCost) : "-"}</td>
                  <td>${movement.note || movement.lot || "-"}</td>
                </tr>
              `;
            }).join("") || `<tr><td colspan="8">Sin ingresos por sacos registrados.</td></tr>`}
          </tbody>
        </table>
      </div>
      <div class="modal-actions">
        <button class="danger-button" type="button" data-action="undo-last-stock-ingress" ${lastIngress ? "" : "disabled"}>Deshacer ultimo ingreso por sacos</button>
        <button class="secondary-button" type="button" data-action="close-dialog">Cerrar</button>
      </div>
    </div>
  `;
  dialog.showModal();
}

async function undoLastStockIngress() {
  const index = state.inventoryMovements.map((movement, i) => ({ movement, i }))
    .reverse()
    .find((item) => isSackIngressMovement(item.movement))?.i;
  if (index === undefined) {
    showToast("No hay ingresos por sacos para deshacer");
    return;
  }
  const movement = state.inventoryMovements[index];
  const product = getProduct(movement.productId);
  if (!product) return;
  if (!confirm(`Deshacer el ultimo ingreso por sacos de ${number(movement.quantity)} ${product.unit} de ${product.name}?`)) return;
  product.stock = Math.max(0, (Number(product.stock) || 0) - (Number(movement.quantity) || 0));
  state.inventoryMovements.splice(index, 1);
  saveState();
  if (supabaseSession) {
    try {
      if (isUuid(movement.id)) {
        await sbFetch(`/rest/v1/movimientos_stock?id=eq.${movement.id}`, { method: "DELETE", prefer: "return=minimal" });
      } else {
        await sbFetch(`/rest/v1/movimientos_stock?${stockMovementMatchQuery(movement)}`, { method: "DELETE", prefer: "return=minimal" });
      }
      await updateCloudProductStocks();
      await loadCloudData();
    } catch (error) {
      showToast(`No se pudo deshacer en Supabase: ${error.message}`);
    }
  }
  document.getElementById("movementDialog").close();
  render();
  showToast("Ultimo ingreso por sacos deshecho");
}

function openProductDialog() {
  const dialog = document.getElementById("productDialog");
  dialog.innerHTML = `
    <form method="dialog" class="modal-body" id="productForm">
      <div class="modal-head">
        <h2>Nuevo producto</h2>
        <button class="icon-button" type="button" data-action="close-dialog" title="Cerrar">x</button>
      </div>
      <div class="form-grid">
        <label class="full">Nombre comercial<input name="name" required placeholder="Nombre del producto"></label>
        <label>Ingrediente activo<input name="ingredient" placeholder="Ingrediente activo"></label>
        <label>Unidad<select name="unit"><option value="L">Litros</option><option value="kg">Kilos</option><option value="L/kg">L/kg</option></select></label>
        <label>Dosis / 100 L<input name="dose100" type="number" step="0.001" value="0"></label>
        <label>Stock inicial<input name="stock" type="number" step="0.001" value="0"></label>
        <label>Stock minimo<input name="minStock" type="number" step="0.001" value="0"></label>
        <label>Costo unitario<input name="cost" type="number" step="1" value="0"></label>
        <label>Reingreso horas<input name="reentryHours" type="number" step="1" value="24"></label>
        <label>Carencia dias<input name="carencyDays" type="number" step="1" value="0"></label>
        <label>Lote<input name="lot" placeholder="Lote"></label>
        <label>Vencimiento<input name="expires" type="date"></label>
      </div>
      <div class="modal-actions">
        <button class="secondary-button" type="button" data-action="close-dialog">Cancelar</button>
        <button class="primary-button" type="button" id="saveProduct">Guardar producto</button>
      </div>
    </form>
  `;
  dialog.showModal();
  document.getElementById("saveProduct").addEventListener("click", saveProduct);
}

async function saveProduct() {
  const form = document.getElementById("productForm");
  if (!form.reportValidity()) return;
  const data = Object.fromEntries(new FormData(form));
  const product = {
    id: uid("p"),
    name: data.name,
    ingredient: data.ingredient,
    unit: data.unit,
    dose100: Number(data.dose100) || 0,
    reentryHours: Number(data.reentryHours) || 24,
    carencyDays: Number(data.carencyDays) || 0,
    stock: Number(data.stock) || 0,
    minStock: Number(data.minStock) || 0,
    cost: Number(data.cost) || 0,
    lot: data.lot,
    expires: data.expires
  };
  state.products.push(product);
  saveState();
  if (supabaseSession) {
    try {
      await cloudSaveProduct(product);
      await loadCloudData();
    } catch (error) {
      showToast(`No se guardo en Supabase: ${error.message}`);
    }
  }
  document.getElementById("productDialog").close();
  render();
  showToast("Producto creado");
}

async function saveMovement() {
  const form = document.getElementById("movementForm");
  if (!form.reportValidity()) return;
  if (!supabaseSession) {
    showToast("Inicia sesion para guardar movimientos en Supabase");
    return;
  }
  const data = Object.fromEntries(new FormData(form));
  const product = getProduct(data.productId);
  const qty = Number(data.quantity);
  if (!product) return;
  if (data.type === "entrada") product.stock += qty;
  if (data.type === "salida") product.stock = Math.max(0, product.stock - qty);
  if (data.type === "ajuste") product.stock = qty;
  const movement = {
    id: uid("m"),
    ...data,
    quantity: qty,
    unitCost: product.cost || 0,
    lot: product.lot || ""
  };
  state.inventoryMovements.push(movement);
  saveState();
  try {
    const saved = await sbFetch("/rest/v1/movimientos_stock?select=*", {
      method: "POST",
      prefer: "return=representation",
      body: JSON.stringify([{
        producto_id: product.id,
        tipo: data.type,
        fecha: data.date,
        cantidad: qty,
        costo_unitario: movement.unitCost || 0,
        lote: movement.lot || null,
        nota: movement.note || null,
        creado_por: supabaseSession.user?.id
      }])
    });
    if (saved?.[0]?.id) movement.id = saved[0].id;
    await updateCloudProductStocks();
    await loadCloudData();
    document.getElementById("movementDialog").close();
    render();
    showToast("Movimiento guardado en Supabase");
  } catch (error) {
    showToast(`No se guardo en Supabase: ${error.message}`);
  }
}

function exportData() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `agroaplicaciones-respaldo-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function importData(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      state = JSON.parse(reader.result);
      saveState();
      render();
      showToast("Respaldo importado");
    } catch {
      showToast("No se pudo importar el archivo");
    }
  };
  reader.readAsText(file);
}

document.addEventListener("touchstart", (event) => {
  const input = event.target.closest?.(".irrigation-hour-input");
  if (!input || !views.irrigation?.contains(input) || event.touches.length !== 1) return;
  if (irrigationObservationTouch) clearTimeout(irrigationObservationTouch.timer);
  const touch = event.touches[0];
  const startX = touch.clientX;
  const startY = touch.clientY;
  irrigationObservationTouch = {
    input,
    startX,
    startY,
    opened: false,
    timer: setTimeout(() => {
      if (!irrigationObservationTouch) return;
      irrigationObservationTouch.opened = true;
      openIrrigationObservationForInput(input);
    }, 650)
  };
}, { passive: true });

document.addEventListener("touchmove", (event) => {
  if (!irrigationObservationTouch || event.touches.length !== 1) return;
  const touch = event.touches[0];
  if (Math.hypot(touch.clientX - irrigationObservationTouch.startX, touch.clientY - irrigationObservationTouch.startY) < 10) return;
  clearTimeout(irrigationObservationTouch.timer);
  irrigationObservationTouch = null;
}, { passive: true });

document.addEventListener("touchend", (event) => {
  if (!irrigationObservationTouch) return;
  clearTimeout(irrigationObservationTouch.timer);
  if (irrigationObservationTouch.opened) event.preventDefault();
  irrigationObservationTouch = null;
}, { passive: false });

document.addEventListener("touchcancel", () => {
  if (!irrigationObservationTouch) return;
  clearTimeout(irrigationObservationTouch.timer);
  irrigationObservationTouch = null;
});

document.addEventListener("click", async (event) => {
  const actionTarget = event.target.closest?.("[data-action]") || event.target;
  const viewTarget = event.target.closest?.("[data-view]");
  if (viewTarget && !viewTarget.classList.contains("nav-item") && !viewTarget.dataset?.action) {
    switchView(viewTarget.dataset.view);
    return;
  }
  const action = actionTarget.dataset?.action;
  const id = actionTarget.dataset?.id;
  if (action === "auth-tab") {
    document.querySelectorAll(".auth-tabs button").forEach((button) => button.classList.toggle("active", button.dataset.tab === actionTarget.dataset.tab));
    document.getElementById("loginPane").classList.toggle("active-auth-pane", actionTarget.dataset.tab === "login");
    document.getElementById("registerPane").classList.toggle("active-auth-pane", actionTarget.dataset.tab === "register");
  }
  if (action === "gate-tab") {
    showGateTab(actionTarget.dataset.tab);
  }
  if (action === "open-weather-station-import") {
    openWeatherStationImportDialog();
  }
  if (action === "choose-weather-station-excel") {
    document.getElementById("weatherStationExcelInput")?.click();
  }
  if (action === "import-weather-station-excel") {
    await importWeatherStationExcel();
  }
  if (action === "toggle-applications-menu") {
    const menu = document.getElementById("applicationsMenu");
    const open = !menu.classList.contains("open");
    menu.classList.toggle("open", open);
    actionTarget.setAttribute("aria-expanded", String(open));
  }
  if (action === "toggle-irrigation-menu") {
    const menu = document.getElementById("irrigationMenu");
    const open = !menu.classList.contains("open");
    menu.classList.toggle("open", open);
    actionTarget.setAttribute("aria-expanded", String(open));
  }
  if (action === "toggle-harvest-menu") {
    const menu = document.getElementById("harvestMenu");
    const open = !menu.classList.contains("open");
    menu.classList.toggle("open", open);
    actionTarget.setAttribute("aria-expanded", String(open));
  }
  if (action === "select-gantt-order") {
    selectedGanttOrderId = id;
    renderManager();
  }
  if (action === "toggle-mobile-gantt") {
    managerGanttMobileOpen = !managerGanttMobileOpen;
    renderManager();
  }
  if (action === "new-order") openOrderDialog();
  if (action === "edit-order") openOrderDialog(id);
  if (action === "close-dialog") actionTarget.closest("dialog")?.close();
  if (action === "open-selected-irrigation-observation") {
    const input = irrigationObservationInput();
    if (!input) {
      showToast("Selecciona primero una celda de Programa o Riego real");
      return;
    }
    openIrrigationObservationForInput(input);
    return;
  }
  if (action === "delete-irrigation-observation") {
    if (!irrigationObservationContext || !confirm("Eliminar esta observacion?")) return;
    const deleted = await saveIrrigationObservation(irrigationObservationContext, "");
    if (deleted) document.getElementById("irrigationObservationDialog")?.close();
  }
  if (action === "clear-program-filter") {
    programFilters = { seasonId: "Todas", program: "", species: "Todas", number: "Todos" };
    renderProgram();
  }
  if (action === "clear-report-filter") {
    reportFilters = { seasonId: "Todas", species: "Todas", programNumber: "Todos" };
    renderReports();
  }
  if (action === "clear-harvest-filter") {
    harvestDateFromFilter = "";
    harvestDateToFilter = "";
    harvestCrewFilter = "Todas";
    harvestStatusFilter = "Todos";
    harvestSdpFilter = "Todos";
    selectedHarvestBinId = "";
    if (currentView === "harvestMap") refreshHarvestMapView();
    if (currentView === "harvestInfo") renderHarvestInfo();
  }
  if (action === "retry-pest-monitoring") {
    pestMonitoringLoadError = "";
    pestMonitoringRecords = null;
    renderPestMonitoring();
  }
  if (action === "clear-pest-filters") {
    const dates = (pestMonitoringRecords || []).map((record) => record.date).filter(Boolean).sort();
    pestMonitoringDateFrom = dates[0] || "";
    pestMonitoringDateTo = dates.at(-1) || "";
    pestMonitoringPest = "Chanchito blanco";
    pestMonitoringPotrero = "Todos";
    pestMonitoringBlock = "Todos";
    views.pestMonitoring.innerHTML = "";
    renderPestMonitoring();
  }
  if (action === "clear-irrigation-hours") {
    if (!confirm(`Limpiar las horas de riego visibles para ${irrigationMonth}/${irrigationYear}?`)) return;
    const allBlocks = [...state.blocks].filter((block) => block.active !== false).sort(blockSort);
    const visibleBlocks = allBlocks
      .filter((block) => irrigationSpeciesFilter === "Todas" || block.crop === irrigationSpeciesFilter)
      .filter((block) => irrigationPotreroFilter === "Todos" || block.potrero === irrigationPotreroFilter);
    const daysInMonth = new Date(Number(irrigationYear), Number(irrigationMonth), 0).getDate();
    visibleBlocks.forEach((block) => {
      Array.from({ length: daysInMonth }, (_, index) => {
        const date = `${irrigationYear}-${irrigationMonth}-${String(index + 1).padStart(2, "0")}`;
        delete irrigationHours[irrigationKey(block.id, date)];
      });
    });
    saveIrrigationHours();
    deleteCloudIrrigationMonth(visibleBlocks, irrigationYear, irrigationMonth);
    renderIrrigation();
    showToast("Horas de riego limpiadas");
  }
  if (action === "toggle-irrigation-filters") {
    setIrrigationFiltersOpen(!irrigationFiltersOpen);
  }
  if (action === "open-irrigation-program-dialog") {
    setIrrigationFiltersOpen(false);
    openIrrigationProgramDialog();
  }
  if (action === "apply-irrigation-program-auto") {
    const allBlocks = irrigationVisibleBlocksForProgramDialog();
    const daysInMonth = new Date(Number(irrigationYear), Number(irrigationMonth), 0).getDate();
    const monthPrefix = `${irrigationYear}-${irrigationMonth}`;
    const historicalEvaporationMap = historicalEvaporationByMonthDay(irrigationMonth);
    const monthEvaporationRows = irrigationEvaporationRowsForMonth(monthPrefix);
    const evaporationMap = evaporationByDateMap(monthEvaporationRows);
    const historicalEvaporationTotal = Array.from({ length: daysInMonth }, (_, index) => {
      const day = String(index + 1).padStart(2, "0");
      return Number(historicalEvaporationMap.get(day)) || 0;
    }).reduce((sum, value) => sum + value, 0);
    const monthEvaporationTotal = Array.from({ length: daysInMonth }, (_, index) => {
      const date = `${monthPrefix}-${String(index + 1).padStart(2, "0")}`;
      return Number(evaporationMap.get(date)?.evaporation) || 0;
    }).reduce((sum, value) => sum + value, 0);
    applyAutomaticIrrigationProgram({ blocks: allBlocks, daysInMonth, monthPrefix, historicalEvaporationMap, historicalEvaporationTotal, monthEvaporationTotal });
  }
  if (action === "save-irrigation-bandeja") {
    await saveIrrigationBandejaRecord();
  }
  if (action === "shift-irrigation-bandeja-year") {
    irrigationYear = String(Math.min(2100, Math.max(1900, Number(irrigationYear) + Number(actionTarget.dataset.delta || 0))));
    irrigationBandejaFocusPending = true;
    renderIrrigation();
  }
  if (action === "focus-current-irrigation-bandeja") {
    const now = new Date();
    irrigationYear = String(now.getFullYear());
    irrigationMonth = String(now.getMonth() + 1).padStart(2, "0");
    irrigationBandejaFocusPending = true;
    renderIrrigation();
  }
  if (action === "toggle-calicatas") {
    const key = actionTarget.dataset.key;
    const expanded = !expandedCalicataKeys.has(key);
    if (expanded) expandedCalicataKeys.add(key);
    else expandedCalicataKeys.delete(key);
    actionTarget.setAttribute("aria-expanded", String(expanded));
    actionTarget.setAttribute("title", expanded ? "Ocultar calicatas" : "Ver calicatas");
    actionTarget.textContent = expanded ? "^" : "v";
    document.querySelectorAll(`[data-calicata-detail="${CSS.escape(key)}"]`).forEach((row) => row.classList.toggle("is-hidden", !expanded));
  }
  if (action === "focus-calicata") {
    focusIrrigationCalicataById(actionTarget.dataset.calicataId);
  }
  if (action === "select-irrigation-balance-potrero") {
    const potrero = actionTarget.dataset.potrero || "";
    if (event.ctrlKey || event.metaKey) {
      if (irrigationBalanceSelectedPotreros.has(potrero)) irrigationBalanceSelectedPotreros.delete(potrero);
      else if (potrero) irrigationBalanceSelectedPotreros.add(potrero);
      irrigationBalancePotreroFilter = irrigationBalanceSelectedPotreros.size === 1 ? [...irrigationBalanceSelectedPotreros][0] : "Todos";
    } else {
      irrigationBalanceSelectedPotreros = potrero ? new Set([potrero]) : new Set();
      irrigationBalancePotreroFilter = potrero || "Todos";
    }
    renderIrrigation();
  }
  if (action === "clear-warehouse-filter") {
    warehouseStatusFilter = "in_progress";
    warehouseDateFromFilter = "";
    warehouseDateToFilter = "";
    renderWarehouse();
  }
  if (action === "export-excel") exportExcel();
  if (action === "print-order") printOrder(id);
  if (action === "open-dispatch-info") openDispatchInfoDialog(id);
  if (action === "open-dispatch") await openDispatchDialog(id, "salida");
  if (action === "open-return") await openDispatchDialog(id, "devolucion");
  if (action === "edit-dispatch") openEditDispatchDialog(id, actionTarget.dataset.dispatchId);
  if (action === "delete-dispatch") deleteDispatch(id, actionTarget.dataset.dispatchId);
  if (action === "save-prices") savePrices();
  if (action === "open-tank") openTankDialog(id);
  if (action === "start-order") {
    const order = state.orders.find((item) => item.id === id);
    if (order) {
      order.status = "in_progress";
      syncOrderStatus(order);
      saveState();
      render();
      if (supabaseSession && isUuid(order.id)) {
        try {
          await sbFetch(`/rest/v1/ordenes_aplicacion?id=eq.${order.id}`, {
            method: "PATCH",
            prefer: "return=minimal",
            body: JSON.stringify({ estado: toDbOrderStatus(order.status) })
          });
          await loadCloudData();
        } catch (error) {
          showToast(`No se actualizo Supabase: ${error.message}`);
        }
      }
    }
  }
  if (action === "close-order") closeOrder(id);
  if (action === "finish-order") finishOrder(id);
  if (action === "cancel-order") cancelOrder(id);
  if (action === "save-program-definition") saveProgramDefinition(id);
  if (action === "new-movement") openMovementDialog();
  if (action === "new-product") openProductDialog();
  if (action === "new-purchase") openPurchaseDialog();
  if (action === "open-stock-history") openStockHistoryDialog();
  if (action === "undo-last-stock-ingress") undoLastStockIngress();
  if (action === "logout") {
    event.preventDefault();
    event.stopPropagation();
    await logoutSupabase();
    return;
  }
});

document.addEventListener("change", async (event) => {
  if (event.target?.id === "programAutoPotrero") {
    updateIrrigationProgramDialogBlocks();
    return;
  }
  if (event.target?.id === "programAutoStartDate") {
    updateIrrigationProgramDialogPreview();
    return;
  }
  if (event.target?.matches?.("[data-program-auto-block]")) {
    updateIrrigationProgramDialogPreview();
    return;
  }
  const action = event.target.dataset.action;
  const id = event.target.dataset.id;
  if (action !== "quick-planned-date" && action !== "quick-program") return;
  event.stopPropagation();
  const order = state.orders.find((item) => item.id === id);
  if (!order) return;
  if (action === "quick-planned-date") {
    order.plannedDate = event.target.value;
    managerYear = String((event.target.value || orderStartDate(order) || "").slice(0, 4) || managerYear);
  }
  if (action === "quick-program") return;
  saveState();
  renderManager();
  if (supabaseSession && isUuid(order.id)) {
    try {
      const body = {};
      if (action === "quick-planned-date") {
        body.fecha = orderStartDate(order) || null;
        body.fecha_planificada = orderStartDate(order) || null;
      }
      await sbFetch(`/rest/v1/ordenes_aplicacion?id=eq.${order.id}`, {
        method: "PATCH",
        prefer: "return=minimal",
        body: JSON.stringify(body)
      });
      await loadCloudData();
    } catch (error) {
      showToast(`No se actualizo Supabase: ${error.message}`);
      return;
    }
  }
  showToast("Planificacion actualizada en Supabase");
});

document.addEventListener("input", (event) => {
  if (["programAutoStartDate", "programAutoHours", "programAutoReposicion", "programAutoSkipDays"].includes(event.target?.id)) {
    updateIrrigationProgramDialogPreview();
  }
});

document.querySelectorAll(".nav-item").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.irrigationMenuTab) {
      if (button.dataset.irrigationMenuTab === "bandejas" && irrigationTab !== "bandejas") irrigationBandejaFocusPending = true;
      irrigationTab = button.dataset.irrigationMenuTab;
      irrigationFiltersOpen = false;
    }
    switchView(button.dataset.view);
  });
});

document.getElementById("newOrderTop").addEventListener("click", () => openOrderDialog());
document.getElementById("authButton").addEventListener("click", openAuthDialog);
document.getElementById("gateLoginButton").addEventListener("click", loginSupabase);
document.getElementById("gateRegisterButton").addEventListener("click", registerSupabase);
document.getElementById("gateRecoverButton").addEventListener("click", recoverSupabasePassword);
document.getElementById("gateResetPasswordButton").addEventListener("click", resetSupabasePassword);
document.getElementById("gateLoginForm").addEventListener("submit", (event) => {
  event.preventDefault();
  loginSupabase();
});
document.getElementById("gateRegisterForm").addEventListener("submit", (event) => {
  event.preventDefault();
  registerSupabase();
});
document.getElementById("gateRecoverForm").addEventListener("submit", (event) => {
  event.preventDefault();
  recoverSupabasePassword();
});
document.getElementById("gateResetPasswordForm").addEventListener("submit", (event) => {
  event.preventDefault();
  resetSupabasePassword();
});
const exportBackupButton = document.getElementById("exportData");
const importBackupInput = document.getElementById("importData");
const resetDemoButton = document.getElementById("resetDemo");

if (exportBackupButton) exportBackupButton.addEventListener("click", exportData);
if (importBackupInput) importBackupInput.addEventListener("change", importData);

if (CLOUD_ONLY_MODE) {
  exportBackupButton?.setAttribute("hidden", "true");
  document.querySelector(".file-action")?.setAttribute("hidden", "true");
  resetDemoButton?.setAttribute("hidden", "true");
}

if (resetDemoButton) {
  resetDemoButton.addEventListener("click", () => {
    if (!confirm("Restaurar los datos iniciales de demostracion?")) return;
    state = structuredClone(seedState);
    saveState();
    render();
    showToast("Datos iniciales restaurados");
  });
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
}

async function initApp() {
  passwordRecoverySession = readRecoverySessionFromUrl();
  if (passwordRecoverySession?.access_token) {
    saveSession(null);
    setAuthGate(true);
    showGateTab("resetPassword");
    setGateStatus("Ingresa una nueva contrasena para completar la recuperacion.", "info");
    return;
  }
  if (supabaseSession) {
    try {
      setAuthGate(true);
      await loadCloudData();
      startCloudSync();
      showToast("Datos cargados desde Supabase");
      return;
    } catch (error) {
      showToast(`Supabase no cargo: ${error.message}`);
      saveSession(null);
    }
  }
  setAuthGate(true);
  document.getElementById("storageStatus").textContent = "Esperando inicio de sesion";
}

initApp();
