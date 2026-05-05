const STORAGE_KEY = "agroaplicaciones.state.v1";
const CLOUD_ONLY_MODE = true;
const SESSION_KEY = "agroaplicaciones.supabase.session.v1";
const SUPABASE_URL = "https://lhmifnsdydullldhmcsd.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxobWlmbnNkeWR1bGxsZGhtY3NkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMzg4NTUsImV4cCI6MjA5MjgxNDg1NX0.TaFzWd_OQTdQMMnf3cMd3WejqGpHmWkJLwGRFS8ITtM";
const REGISTRATION_CODE = "CANELILLO2026";
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
let reportFilters = { species: "Todas", programNumber: "Todos" };
let managerYear = String(new Date().getFullYear());
let managerMonth = String(new Date().getMonth() + 1).padStart(2, "0");
let managerOrdersMonth = "all";
let managerGanttMode = "month";
let managerGanttMobileOpen = false;
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
let supabaseSession = loadSession();
let currentProfile = null;
let registerAttempts = Number(localStorage.getItem("agroaplicaciones.registerAttempts") || 0);

const views = {
  dashboard: document.getElementById("dashboard"),
  program: document.getElementById("program"),
  manager: document.getElementById("manager"),
  warehouse: document.getElementById("warehouse"),
  orders: document.getElementById("orders"),
  execution: document.getElementById("execution"),
  inventory: document.getElementById("inventory"),
  prices: document.getElementById("prices"),
  reports: document.getElementById("reports"),
  masters: document.getElementById("masters")
};

const titles = {
  dashboard: "Panel operativo",
  program: "Programa de aplicaciones",
  manager: "Panel supervisor encargado",
  warehouse: "Panel bodeguero",
  orders: "Ordenes de aplicacion",
  execution: "Ejecucion en terreno",
  inventory: "Bodega y stock",
  prices: "Precios de productos",
  reports: "Reportes y ahorro",
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
    if (!session?.access_token || Date.now() / 1000 > Number(session.expires_at || 0)) return null;
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

async function sbFetch(path, options = {}) {
  const response = await fetch(`${SUPABASE_URL}${path}`, {
    ...options,
    headers: { ...sbHeaders(options.prefer), ...(options.headers || {}) }
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    const message = data?.message || data?.msg || text || response.statusText;
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
    admin: ["dashboard", "program", "manager", "warehouse", "inventory", "prices", "reports", "orders", "execution", "masters"],
    supervisor: ["dashboard", "program", "manager", "warehouse", "inventory", "prices", "reports", "orders", "execution", "masters"],
    bodeguero: ["warehouse", "inventory"],
    operador: ["execution"],
    lectura: ["dashboard", "reports"]
  };
  return (permissions[normalized] || []).includes(view);
}

function defaultViewForRole(role) {
  const normalized = normalizeRole(role);
  if (normalized === "bodeguero") return "warehouse";
  if (normalized === "operador") return "execution";
  return "dashboard";
}

function visibleViewsForRole(role) {
  const normalized = normalizeRole(role);
  const viewsByRole = {
    admin: ["dashboard", "program", "manager", "warehouse", "inventory", "prices", "reports"],
    supervisor: ["dashboard", "program", "manager", "warehouse", "inventory", "prices", "reports"],
    bodeguero: ["warehouse", "inventory"],
    operador: ["execution"],
    lectura: ["dashboard", "reports"]
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
    .sort((a, b) => String(a.block).localeCompare(String(b.block), undefined, { numeric: true }));
}

function uniquePotreros() {
  return [...new Set(state.blocks.map((block) => block.potrero).filter(Boolean))].sort((a, b) => a.localeCompare(b));
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
  document.getElementById("gateLoginForm").classList.toggle("active-auth-pane", tab === "login");
  document.getElementById("gateRegisterForm").classList.toggle("active-auth-pane", tab === "register");
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
        <p>Usuario: ${currentProfile?.full_name || supabaseSession.user?.email || "Sesion activa"}<br>Rol: ${roleLabel(currentProfile?.rol || currentProfile?.role)}</p>
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
  if (!data.email || !data.password) {
    setGateStatus("Ingresa correo y contraseña.", "error");
    showToast("Ingresa correo y contraseña");
    return;
  }
  try {
    setGateStatus("Verificando credenciales...", "info");
    const session = await sbAuthPassword(data.email, data.password);
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
  if (registerAttempts >= 2) {
    setGateStatus("Registro bloqueado por 2 intentos fallidos. Recarga solo si el administrador lo permite.", "error");
    return;
  }
  if (!data.fullName || !data.rut || !data.registerEmail || !data.registerPassword || !data.registerPassword2 || !data.inviteCode) {
    setGateStatus("Completa todos los datos de registro.", "error");
    showToast("Completa todos los datos de registro");
    return;
  }
  if (data.inviteCode.trim() !== REGISTRATION_CODE) {
    registerAttempts += 1;
    localStorage.setItem("agroaplicaciones.registerAttempts", String(registerAttempts));
    setGateStatus(`Codigo incorrecto. Intentos restantes: ${Math.max(0, 2 - registerAttempts)}.`, "error");
    showToast("Codigo de registro incorrecto");
    return;
  }
  if (data.registerPassword !== data.registerPassword2) {
    setGateStatus("Las contraseñas no coinciden.", "error");
    showToast("Las contraseñas no coinciden");
    return;
  }
  if (data.registerPassword.length < 6) {
    setGateStatus("La contraseña debe tener al menos 6 caracteres.", "error");
    showToast("La contraseña debe tener al menos 6 caracteres");
    return;
  }
  try {
    setGateStatus("Creando cuenta en Supabase...", "info");
    const signup = await sbSignUp(data.registerEmail, data.registerPassword, {
      full_name: data.fullName,
      rut: data.rut,
      role: data.role
    });
    if (signup?.access_token) {
      await createProfileWithSession(signup, data.fullName, data.rut, data.role);
    }
    registerAttempts = 0;
    localStorage.setItem("agroaplicaciones.registerAttempts", "0");
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

async function createOwnProfile(fullName, rut, role) {
  await sbFetch("/rest/v1/usuarios", {
    method: "POST",
    prefer: "resolution=merge-duplicates,return=minimal",
    body: JSON.stringify([{
      id: supabaseSession.user?.id,
      nombre_completo: fullName,
      rut,
      rol: toDbRole(role)
    }])
  });
}

async function createProfileWithSession(session, fullName, rut, role) {
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
      rol: toDbRole(role)
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
  document.querySelectorAll(".nav-item").forEach((button) => button.classList.toggle("active", button.dataset.view === view));
  Object.entries(views).forEach(([key, element]) => element.classList.toggle("active-view", key === view));
  document.getElementById("viewTitle").textContent = titles[view];
  render();
}

function render() {
  renderDashboard();
  renderProgram();
  renderManager();
  renderWarehouse();
  renderOrders();
  renderExecution();
  renderInventory();
  renderPrices();
  renderReports();
  renderMasters();
}

function renderDashboard() {
  const activeOrders = state.orders.filter((order) => effectiveOrderStatus(order) !== "closed").length;
  const finishedOrders = state.orders.filter((order) => effectiveOrderStatus(order) === "closed").length;
  const applicationAlerts = overApplicationAlerts(state.orders).slice(0, 8);
  const warehouseAlertRows = warehouseAlerts();

  views.dashboard.innerHTML = `
    <div class="kpi-grid">
      ${kpi("Ordenes pendientes", activeOrders, "Pendientes o en proceso")}
      ${kpi("Ordenes finalizadas", finishedOrders, "Cerradas por mojamiento o supervisor")}
    </div>
    <div class="dashboard-ops">
      <section class="panel map-panel">
        <div class="panel-header">
          <div>
            <h2>Mapa operativo por bloques</h2>
            <p>Google Maps con potreros padre y bloques hijo desde GeoJSON.</p>
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
  }, {})).sort((a, b) => a.potrero.localeCompare(b.potrero));
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
  const managerPotreros = ["Todos", ...new Set([...uniquePotreros(), ...orderPotreros])].sort((a, b) => a === "Todos" ? -1 : b === "Todos" ? 1 : a.localeCompare(b, undefined, { numeric: true }));
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
          <h3>Carta Gantt por potrero</h3>
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
        <span>Potrero</span>
        <div class="gantt-month-grid">${months.map((month) => `<b>${month}</b>`).join("")}</div>
      </div>
      ${groups.map((group) => {
        return `
          <div class="gantt-row">
            <span><strong>${group.potrero}</strong><small>Ordenes ${group.orders.map((order) => `#${order.number}`).join(", ")}</small></span>
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
        <span>Potrero</span>
        <div class="gantt-day-grid" style="--days:${daysInMonth}">${days.map((day) => `<b>${day}</b>`).join("")}</div>
      </div>
      ${groups.map((group) => {
        return `
          <div class="gantt-row gantt-month-detail ${group.orders.some((order) => selectedGanttOrderId === order.id) ? "selected" : ""}">
            <span><strong>${group.potrero}</strong><small>Ordenes ${group.orders.map((order) => `#${order.number}`).join(", ")}</small></span>
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


function ganttGroupsByPotrero(orders) {
  return Object.values(orders.reduce((acc, order) => {
    const key = order.potrero || "Sin potrero";
    acc[key] ||= { potrero: key, orders: [] };
    acc[key].orders.push(order);
    return acc;
  }, {})).map((group) => ({ ...group, orders: sortOrdersNewestFirst(group.orders) }));
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
  return `<i class="active ${stateInfo.key}" data-action="select-gantt-order" data-id="${order.id}" style="--progress:${progress}%;--program-color:${programColor(order)};--gantt-state-color:${ganttStateColor(stateInfo.key)};${extraStyle}" data-tooltip="${htmlAttr(tooltip)}"><span>#${order.number}</span><em>${progressLabel}</em></i>`;
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

  const normalizedProfileRole = normalizeRole(profile.rol || profile.role);
  currentProfile = {
    ...profile,
    full_name: profile.nombre_completo,
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
  const [seasons, programs, fields, products, orders, orderProducts, dispatches, dispatchProducts, stockMovements, vehicles] = await Promise.all([
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
    crop: field.cultivo,
    variety: field.variedad,
    hectares: Number(field.hectareas) || 0
  }));
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
        () => scheduleRealtimeCloudReload(table)
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
      <small>${hint}</small>
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
  const species = ["Todas", ...new Set(state.orders.map((order) => order.crop).filter(Boolean))];
  const programNumbers = ["Todos", ...new Set(state.orders.flatMap((order) => order.programNumbers?.length ? order.programNumbers : [order.programNumber]).filter((value) => value !== "" && value !== undefined).map(String))].sort((a, b) => a === "Todos" ? -1 : Number(a) - Number(b));
  const orders = state.orders.filter((order) => {
    const speciesOk = reportFilters.species === "Todas" || order.crop === reportFilters.species;
    const programOk = reportFilters.programNumber === "Todos" || (order.programNumbers?.length ? order.programNumbers.map(String).includes(String(reportFilters.programNumber)) : String(order.programNumber) === String(reportFilters.programNumber));
    return speciesOk && programOk;
  });
  const productRows = reportProductRows(orders);
  const byProduct = reportByProduct(orders);
  const byProgram = reportByKey(orders, (order) => programLabel(order));
  const waterByProgram = reportWaterByProgram(orders);
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
      ${chartPanel("Costo por producto", "Valorizado con precio kg/L", byProduct.map((row) => valueBar(row.product.name, row.value, byProduct[0]?.value || 0, money(row.value))).join(""))}
      ${chartPanel("Stock utilizado por producto", "Total ingresado, usado y saldo disponible", stockUsageReport())}
      ${chartPanel("Mojamiento promedio por programa", "Despliega cada programa para ver potrero y bloque", waterByProgram.map(waterProgramDetails).join(""))}
      ${chartPanel("Tendencia mensual", "Mojamiento y costo por mes", monthly.map((row) => stackedMetric(row.label, row.water, Math.max(...monthly.map((item) => item.water), 1), `${number(row.water, 0)} L`, money(row.cost))).join(""))}
    </div>
  `;
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
  const allAvailable = (isMultiPotrero ? state.blocks : blocksForPotrero(potrero))
    .sort((a, b) => `${a.potrero}-${a.block}`.localeCompare(`${b.potrero}-${b.block}`, undefined, { numeric: true }));
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

document.addEventListener("click", async (event) => {
  const actionTarget = event.target.closest?.("[data-action]") || event.target;
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
  if (action === "toggle-applications-menu") {
    const menu = document.getElementById("applicationsMenu");
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
  if (action === "clear-program-filter") {
    programFilters = { seasonId: "Todas", program: "", species: "Todas", number: "Todos" };
    renderProgram();
  }
  if (action === "clear-report-filter") {
    reportFilters = { species: "Todas", programNumber: "Todos" };
    renderReports();
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

document.querySelectorAll(".nav-item").forEach((button) => {
  button.addEventListener("click", () => switchView(button.dataset.view));
});

document.getElementById("newOrderTop").addEventListener("click", () => openOrderDialog());
document.getElementById("authButton").addEventListener("click", openAuthDialog);
document.getElementById("gateLoginButton").addEventListener("click", loginSupabase);
document.getElementById("gateRegisterButton").addEventListener("click", registerSupabase);
document.getElementById("gateLoginForm").addEventListener("submit", (event) => {
  event.preventDefault();
  loginSupabase();
});
document.getElementById("gateRegisterForm").addEventListener("submit", (event) => {
  event.preventDefault();
  registerSupabase();
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

