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

function potreroLabel(value = "") {
  const text = String(value ?? "").trim();
  if (!text) return "-";
  if (/^(todos|todas|sin potrero)$/i.test(text)) return text;
  if (/^p\s*\d+$/i.test(text)) return `P${text.replace(/^p\s*/i, "")}`;
  return /^\d+$/.test(text) ? `P${text}` : text;
}

function potreroListLabel(value = "") {
  return String(value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map(potreroLabel)
    .join(", ") || "-";
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
  harvestFields: [],
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
let programFilters = { seasonId: "Todas", search: "", species: "Todas", number: "Todos", type: "Todos", status: "Todos" };
let officialProgramFallbackCache = null;
let programSearchTimer = null;
let reportFilters = { seasonId: "Todas", species: "Todas", programNumber: "Todos" };
let managerYear = String(new Date().getFullYear());
let managerMonth = String(new Date().getMonth() + 1).padStart(2, "0");
let managerOrdersMonth = "all";
let managerGanttMode = "month";
let managerGanttMobileOpen = false;
let managerGanttFiltersOpen = false;
let irrigationYear = String(new Date().getFullYear());
let irrigationMonth = String(new Date().getMonth() + 1).padStart(2, "0");
let irrigationSpeciesFilter = "Todas";
let irrigationVarietyFilter = "Todas";
let irrigationPotreroFilter = "Todos";
let irrigationTab = "gantt";
let irrigationFiltersOpen = false;
let irrigationStationFilter = "Todas";
let irrigationBandejaScrollLeft = 0;
let irrigationBandejaScrollTop = 0;
let irrigationBandejaFocusPending = true;
let irrigationBalancePotreroFilter = "Todos";
let irrigationBalanceSelectedPotreros = new Set();
const IRRIGATION_SATELLITE_STAC_URL = "https://earth-search.aws.element84.com/v1/search";
const IRRIGATION_SATELLITE_COLLECTION = "sentinel-2-l2a";
const IRRIGATION_SATELLITE_DEFAULT_BBOX = [-71.29, -32.83, -71.24, -32.79];
const IRRIGATION_SATELLITE_PROXY_LOCAL = "/api/sentinel-hub";
const IRRIGATION_SATELLITE_PROXY_SUPABASE = "/api/sentinel-hub";
const IRRIGATION_PLANET_PROXY_LOCAL = "/api/planet";
const IRRIGATION_PLANET_PROXY_SUPABASE = "/api/planet";
const IRRIGATION_SATELLITE_PROXY_REMOTE = "https://canelillo-agrocore.netlify.app/api/sentinel-hub";
const IRRIGATION_SATELLITE_AOI_URL = "data/canelillo_limites.geojson";
const IRRIGATION_SATELLITE_TRANSPARENT_TILE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADElEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
const IRRIGATION_SATELLITE_LAYER_STYLES = Object.freeze({
  native: {
    name: "Normal del mapa",
    use: "Paleta base propia de cada indice."
  },
  standard: {
    name: "Agricola",
    use: "Rojo a verde tradicional para decision agricola."
  },
  contrast: {
    name: "Alto contraste",
    use: "Colores mas saturados para revisar diferencias al hacer zoom."
  },
  alerts: {
    name: "Criticos",
    use: "Resalta zonas rojas, amarillas y verdes con mayor fuerza."
  }
});
const IRRIGATION_SATELLITE_LAYER_STRENGTHS = Object.freeze({
  normal: { name: "Normal", layers: 1, factor: 1 },
  reinforced: { name: "Reforzada", layers: 2, factor: 0.85 },
  intense: { name: "Muy reforzada", layers: 3, factor: 0.78 }
});
const IRRIGATION_SATELLITE_PALETTES = Object.freeze({
  vegetation: {
    standard: ["#750d14", "#e03d1f", "#f5b324", "#a3c73d", "#148c3d", "#005224"],
    contrast: ["#a3000d", "#f51f0d", "#ff8c00", "#ffdb1a", "#6ec72e", "#059433", "#00421a"],
    alerts: ["#8c000d", "#d1000f", "#ff4700", "#ffc70f", "#c7e01a", "#0d9e2e", "#00571a"]
  },
  moisture: {
    standard: ["#851412", "#db5714", "#f2c22e", "#85bf59", "#1a6bc2", "#05337a"],
    contrast: ["#ad000a", "#f23300", "#ffb300", "#b8db2e", "#008cd1", "#001a8c"],
    alerts: ["#b3000a", "#ff3800", "#ffc700", "#33b8c7", "#0057d1", "#00148c"]
  },
  water: {
    standard: ["#007a29", "#d4c766", "#ffffff", "#73bde6", "#0040cc", "#000d73"],
    contrast: ["#6b330f", "#fa7a00", "#ffe029", "#4dd1e0", "#0057f2", "#00058c"],
    alerts: ["#b3000a", "#ff3800", "#ffc700", "#4dd1e0", "#003de6", "#000580"]
  }
});
const IRRIGATION_SATELLITE_INDEX_DEFINITIONS = Object.freeze({
  NDVI: {
    name: "NDVI",
    palette: "vegetation",
    formula: "(B08 - B04) / (B08 + B04)",
    use: "Vigor vegetal y cobertura activa.",
    bands: ["nir", "red"],
    planetProc: "ndvi",
    legend: [
      ["#9b1c1c", "Muy bajo", "< 0,20"],
      ["#e8892f", "Bajo", "0,20 - 0,35"],
      ["#f4d35e", "Medio", "0,35 - 0,50"],
      ["#86c779", "Bueno", "0,50 - 0,70"],
      ["#1f7a4d", "Alto", "> 0,70"]
    ]
  },
  NDMI: {
    name: "NDMI",
    palette: "moisture",
    formula: "(B08 - B11) / (B08 + B11)",
    use: "Humedad de vegetacion y estres hidrico.",
    bands: ["nir", "swir16"],
    legend: [
      ["#8b1e1e", "Muy seco", "< -0,10"],
      ["#df7e31", "Seco", "-0,10 - 0,10"],
      ["#f2d45c", "Intermedio", "0,10 - 0,25"],
      ["#6fbf7a", "Humedo", "0,25 - 0,45"],
      ["#206aa5", "Muy humedo", "> 0,45"]
    ]
  },
  NDRE: {
    name: "NDRE",
    palette: "vegetation",
    formula: "(B08 - B05) / (B08 + B05)",
    use: "Clorofila en canopia mas cerrada.",
    bands: ["nir", "rededge1"],
    legend: [
      ["#9b1c1c", "Bajo", "< 0,12"],
      ["#e8892f", "Vigilar", "0,12 - 0,22"],
      ["#f4d35e", "Medio", "0,22 - 0,32"],
      ["#86c779", "Bueno", "0,32 - 0,45"],
      ["#1f7a4d", "Alto", "> 0,45"]
    ]
  },
  GNDVI: {
    name: "GNDVI",
    palette: "vegetation",
    formula: "(B08 - B03) / (B08 + B03)",
    use: "Clorofila y respuesta nitrogenada.",
    bands: ["nir", "green"],
    legend: [
      ["#9b1c1c", "Muy bajo", "< 0,25"],
      ["#e8892f", "Bajo", "0,25 - 0,40"],
      ["#f4d35e", "Medio", "0,40 - 0,55"],
      ["#86c779", "Bueno", "0,55 - 0,72"],
      ["#1f7a4d", "Alto", "> 0,72"]
    ]
  },
  SAVI: {
    name: "SAVI",
    palette: "vegetation",
    formula: "1.5 * (B08 - B04) / (B08 + B04 + 0.5)",
    use: "Vigor con suelo expuesto.",
    bands: ["nir", "red"],
    legend: [
      ["#9b1c1c", "Muy bajo", "< 0,18"],
      ["#e8892f", "Bajo", "0,18 - 0,32"],
      ["#f4d35e", "Medio", "0,32 - 0,48"],
      ["#86c779", "Bueno", "0,48 - 0,65"],
      ["#1f7a4d", "Alto", "> 0,65"]
    ]
  },
  NDWI: {
    name: "NDWI",
    palette: "water",
    formula: "(Green - NIR) / (Green + NIR)",
    use: "Agua superficial y zonas con exceso de humedad.",
    bands: ["green", "nir"],
    planetProc: "ndwi",
    legend: [
      ["#8b1e1e", "Muy seco", "< -0,20"],
      ["#df7e31", "Seco", "-0,20 - 0,00"],
      ["#f2d45c", "Intermedio", "0,00 - 0,20"],
      ["#58a6d6", "Humedo", "0,20 - 0,40"],
      ["#1459a8", "Agua", "> 0,40"]
    ]
  },
  MSAVI2: {
    name: "MSAVI2",
    palette: "vegetation",
    formula: "(2*NIR+1-sqrt((2*NIR+1)^2-8*(NIR-Red))) / 2",
    use: "Vigor ajustado para suelo expuesto.",
    bands: ["nir", "red"],
    planetProc: "msavi2",
    legend: [
      ["#9b1c1c", "Muy bajo", "< 0,15"],
      ["#e8892f", "Bajo", "0,15 - 0,30"],
      ["#f4d35e", "Medio", "0,30 - 0,45"],
      ["#86c779", "Bueno", "0,45 - 0,62"],
      ["#1f7a4d", "Alto", "> 0,62"]
    ]
  },
  VARI: {
    name: "VARI",
    palette: "vegetation",
    formula: "(Green - Red) / (Green + Red - Blue)",
    use: "Verdor visible usando bandas RGB.",
    bands: ["green", "red", "blue"],
    planetProc: "vari",
    legend: [
      ["#9b1c1c", "Bajo", "< -0,05"],
      ["#e8892f", "Vigilar", "-0,05 - 0,05"],
      ["#f4d35e", "Medio", "0,05 - 0,15"],
      ["#86c779", "Bueno", "0,15 - 0,30"],
      ["#1f7a4d", "Alto", "> 0,30"]
    ]
  },
  MTVI2: {
    name: "MTVI2",
    palette: "vegetation",
    formula: "Indice triangular modificado",
    use: "Clorofila y vigor en canopia.",
    bands: ["nir", "red", "green"],
    planetProc: "mtvi2",
    legend: [
      ["#9b1c1c", "Muy bajo", "< 0,20"],
      ["#e8892f", "Bajo", "0,20 - 0,35"],
      ["#f4d35e", "Medio", "0,35 - 0,50"],
      ["#86c779", "Bueno", "0,50 - 0,68"],
      ["#1f7a4d", "Alto", "> 0,68"]
    ]
  },
  TGI: {
    name: "TGI",
    palette: "vegetation",
    formula: "Triangular Greenness Index",
    use: "Verdor y clorofila con bandas visibles.",
    bands: ["red", "green", "blue"],
    planetProc: "tgi",
    legend: [
      ["#9b1c1c", "Bajo", "< 0,10"],
      ["#e8892f", "Vigilar", "0,10 - 0,25"],
      ["#f4d35e", "Medio", "0,25 - 0,45"],
      ["#86c779", "Bueno", "0,45 - 0,65"],
      ["#1f7a4d", "Alto", "> 0,65"]
    ]
  }
});
let irrigationSatelliteDateFrom = "";
let irrigationSatelliteDateTo = "";
let irrigationSatelliteCloudMax = 35;
let irrigationSatelliteLimit = 10;
let irrigationSatelliteIndex = "NDVI";
let irrigationSatelliteLayerOpacity = 82;
let irrigationSatelliteLayerStyle = "native";
let irrigationSatelliteLayerStrength = "normal";
let irrigationSatellitePaintedLayer = true;
let irrigationSatelliteShowIndexLayer = true;
let irrigationSatelliteShowBlocks = true;
let irrigationSatelliteShowPotreros = true;
let irrigationSatelliteShowLabels = true;
let irrigationSatelliteScenes = [];
let irrigationSatelliteLoading = false;
let irrigationSatelliteError = "";
let irrigationSatelliteLastQueryKey = "";
let irrigationSatelliteQueryMeta = null;
let irrigationSatelliteMap = null;
let irrigationSatelliteMapElement = null;
let irrigationSatelliteOverlays = [];
let irrigationSatelliteInfoWindow = null;
let irrigationSatelliteTileOverlays = [];
let irrigationSatelliteTileRevision = 1;
let irrigationSatelliteProxyBase = "";
let irrigationSatelliteProcessingStatus = { checked: false, checking: false, configured: false, providerType: "", message: "Sin revisar", build: "", supportedIndexes: [] };
let irrigationPlanetMosaics = [];
let irrigationPlanetMosaic = "";
let irrigationPlanetMosaicsLoading = false;
let irrigationPlanetMosaicsError = "";
let irrigationPlanetMosaicsLastQueryKey = "";
let irrigationSatelliteAoi = null;
let irrigationSatelliteAoiLoading = null;
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
let irrigationSelectedInput = null;
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
let irrigationCalicataShowPotreroLabels = true;
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
let harvestExportSelectedYears = new Set();
let harvestExportSpeciesFilter = "Todas";
let harvestExportVarietyFilter = "Todas";
let harvestExportPotreroFilter = "Todos";
let harvestExportCalibreMode = "kg";
let harvestAnalysisSpeciesFilter = "Todas";
let harvestAnalysisVarietyFilter = "Todas";
let harvestAnalysisPotreroFilter = "Todos";
let harvestAnalysisSelectedSpecies = "Todas";
let harvestAnalysisSelectedYears = new Set();
let harvestAnalysisMetric = "kg";
let harvestAnalysisDbRows = [];
let harvestContractorExpandedKeys = new Set();
let harvestAnalysisOpenSections = new Set(["annual", "progress"]);
let harvestAnalysisRenderCacheSource = null;
let harvestAnalysisRenderCacheFields = null;
let harvestAnalysisRenderCache = new Map();
const HARVEST_ANALYSIS_RENDER_CACHE_MAX = 12;
let harvestAnalysisFieldIndexSource = null;
let harvestAnalysisFieldIndex = new Map();
let harvestExportDbRows = [];
let harvestExcelSyncState = null;
let harvestExcelSyncSaving = false;
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
let pestMonitoringSpecies = "Todas";
let pestMonitoringPotrero = "Todos";
let pestMonitoringBlock = "Todos";
let pestMonitoringMap = null;
let pestMonitoringMapElement = null;
let pestMonitoringPolygons = [];
let pestMonitoringBaseOverlays = [];
let pestMonitoringHeatOverlay = null;
let pestMonitoringInfoWindow = null;
let pestMonitoringMapRenderVersion = 0;
let pestMonitoringCurrentSummaries = new Map();
let fertilizerRows = null;
let fertilizerLoadPromise = null;
let fertilizerLoadError = "";
let fertilizerDataSource = "";
let fertilizerCasetaFilter = "Todas";
let fertilizerPotreroFilter = "Todos";
let fertilizerStatusFilter = "Todos";
let fertilizerReportExporting = false;
let fertilizerStorageView = "estanques";
let fertilizerStockRows = [];
let fertilizerStockLots = [];
let fertilizerProducts = [];
let fertilizerCasetas = [];
let fertilizerTanks = [];
let fertilizerFields = [];
let fertilizerPreparationHistory = [];
let fertilizerApplicationHistory = [];
let fertilizerUserNames = new Map();
let fertilizerHistoryLoadError = "";
let fertilizerStockError = "";
let fertilizerLotSaving = false;
let weatherStationYear = String(new Date().getFullYear());
let weatherStationMonth = "Todos";
let weatherStationView = "heladas";
let weatherStationCloudAvailable = true;
let weatherStationImportPreview = null;
let irrigationEvaporationLoadedMonths = new Set();
let irrigationEvaporationLoadingMonths = new Set();
let irrigationCloudLoadedMonths = new Set();
let supabaseSession = loadSession();
let passwordRecoverySession = null;
let currentProfile = null;
let cloudInitialLoadInProgress = false;
const CLOUD_MODULE_CACHE_META_KEY = "agrocore.cloud.module-cache.v1";
const CLOUD_MODULE_TTL_MS = {
  weather: 5 * 60 * 1000,
  fields: 24 * 60 * 60 * 1000,
  applications: 5 * 60 * 1000,
  irrigation: 2 * 60 * 1000,
  calicatas: 5 * 60 * 1000,
  harvest: 60 * 1000,
  harvestAnalysis: 5 * 60 * 1000,
  harvestExport: 5 * 60 * 1000
};
let cloudModuleCacheMeta = loadCloudModuleCacheMeta();
let cloudLoadedModules = new Set();
let cloudLoadingModules = new Map();
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
  harvestExport: document.getElementById("harvestExport"),
  harvestAnalysis: document.getElementById("harvestAnalysis"),
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
  harvestExport: "Exportacion",
  harvestAnalysis: "Cosecha Analisis",
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

async function loadCloudProfile() {
  if (!supabaseSession?.user?.id) throw new Error("No hay sesion activa de Supabase.");
  const userId = supabaseSession.user.id;
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

  applyRoleNavigation();
  updateAuthenticatedUserUi();
  return currentProfile;
}

function loadCloudModuleCacheMeta() {
  try {
    return JSON.parse(localStorage.getItem(CLOUD_MODULE_CACHE_META_KEY) || "{}") || {};
  } catch {
    return {};
  }
}

function saveCloudModuleCacheMeta() {
  try {
    localStorage.setItem(CLOUD_MODULE_CACHE_META_KEY, JSON.stringify(cloudModuleCacheMeta));
  } catch (error) {
    console.warn("No se pudo guardar metadata de cache por modulo", error);
  }
}

function cloudModuleHasUsableState(module) {
  if (module === "weather") return Boolean(state.weatherStationDaily?.length || state.weatherStationLatest);
  if (module === "fields") return Boolean(state.blocks?.length);
  if (module === "applications") return Boolean(state.orders?.length || state.products?.length || state.programs?.length);
  if (module === "irrigation") return Boolean(Object.keys(irrigationHours || {}).length || Object.keys(irrigationProgramHours || {}).length || state.irrigationEvaporation?.length);
  if (module === "calicatas") return Boolean(state.calicatas?.length);
  if (module === "harvest") return Boolean(state.harvestRecords?.length || state.harvestCrewSchedule?.length || state.harvestJornales?.length);
  if (module === "harvestAnalysis") return Boolean(state.harvestAnalysisRecords?.length && (state.harvestFields?.length || state.blocks?.length));
  if (module === "harvestExport") return Boolean(state.harvestExportRecords?.length && (state.harvestFields?.length || state.blocks?.length));
  return false;
}

function isCloudModuleFresh(module) {
  const timestamp = Number(cloudModuleCacheMeta[module] || 0);
  const ttl = CLOUD_MODULE_TTL_MS[module] || 0;
  return Boolean(timestamp && ttl && Date.now() - timestamp < ttl && (cloudLoadedModules.has(module) || cloudModuleHasUsableState(module)));
}

function hydrateCloudLoadedModulesFromCache() {
  const userId = supabaseSession?.user?.id || "";
  if (userId && cloudModuleCacheMeta.__userId && cloudModuleCacheMeta.__userId !== userId) {
    resetCloudModuleCache();
    return;
  }
  if (userId && !cloudModuleCacheMeta.__userId) return;
  Object.keys(CLOUD_MODULE_TTL_MS).forEach((module) => {
    if (isCloudModuleFresh(module)) cloudLoadedModules.add(module);
  });
}

function markCloudModulesLoaded(modules = []) {
  const now = Date.now();
  if (supabaseSession?.user?.id) cloudModuleCacheMeta.__userId = supabaseSession.user.id;
  modules.forEach((module) => {
    if (!module || module === "all") return;
    cloudLoadedModules.add(module);
    cloudModuleCacheMeta[module] = now;
  });
  saveCloudModuleCacheMeta();
}

function invalidateCloudModules(modules = []) {
  modules.forEach((module) => {
    cloudLoadedModules.delete(module);
    if (module === "irrigation") irrigationCloudLoadedMonths.clear();
    delete cloudModuleCacheMeta[module];
  });
  saveCloudModuleCacheMeta();
}

function resetCloudModuleCache() {
  cloudLoadedModules = new Set();
  cloudLoadingModules = new Map();
  irrigationCloudLoadedMonths = new Set();
  cloudModuleCacheMeta = {};
  try {
    localStorage.removeItem(CLOUD_MODULE_CACHE_META_KEY);
  } catch (error) {
    console.warn("No se pudo limpiar metadata de cache por modulo", error);
  }
}

function cloudModulesForView(view) {
  if (view === "dashboard") return ["weather"];
  if (view === "irrigation") {
    const modules = ["fields"];
    if (["gantt", "bandejas", "balance"].includes(irrigationTab)) modules.push("irrigation");
    if (irrigationTab === "gantt") modules.push("calicatas");
    if (irrigationTab === "bandejas" || irrigationTab === "balance") modules.push("weather");
    return modules;
  }
  if (view === "calicatas") return ["fields", "calicatas"];
  if (view === "harvestMap" || view === "harvestInfo") return ["harvest"];
  if (view === "harvestAnalysis") return ["harvestAnalysis"];
  if (view === "harvestExport") return ["harvestExport"];
  if (["applicationDashboard", "program", "manager", "warehouse", "orders", "execution", "inventory", "prices", "reports", "masters"].includes(view)) {
    return ["fields", "applications"];
  }
  return [];
}

function cloudModuleLoadingHtml(view) {
  const label = titles[view] || "Modulo";
  return `
    <section class="panel module-loading-panel">
      <div class="weather-import-loading" role="status" aria-live="polite">
        <span class="weather-import-spinner" aria-hidden="true"></span>
        <strong>Cargando ${escapeHtml(label)}</strong>
        <small>Sincronizando solo los datos necesarios de este modulo...</small>
      </div>
    </section>`;
}

function shouldLoadCloudModule(module, force = false) {
  if (force) return true;
  return !isCloudModuleFresh(module);
}

async function ensureCloudDataForView(view, options = {}) {
  if (!supabaseSession) return;
  const force = Boolean(options.force);
  const irrigationMonthPrefix = view === "irrigation" && irrigationTab === "gantt" ? `${irrigationYear}-${irrigationMonth}` : "";
  const modules = [...new Set(cloudModulesForView(view))].filter((module) => {
    if (force) return true;
    if (module === "irrigation" && irrigationMonthPrefix) return !irrigationCloudLoadedMonths.has(irrigationMonthPrefix);
    return shouldLoadCloudModule(module, force);
  });
  if (!modules.length) return;
  const key = `${modules.slice().sort().join("|")}${irrigationMonthPrefix ? `@${irrigationMonthPrefix}` : ""}`;
  if (cloudLoadingModules.has(key)) return cloudLoadingModules.get(key);
  const task = (async () => {
    const storageStatus = document.getElementById("storageStatus");
    if (storageStatus) storageStatus.textContent = `Cargando ${modules.join(", ")} desde Supabase...`;
    await loadCloudData({ modules, render: false, force, irrigationMonthPrefix });
    if (currentView === view) render();
  })().finally(() => cloudLoadingModules.delete(key));
  cloudLoadingModules.set(key, task);
  return task;
}

async function reloadCurrentCloudModules() {
  const modules = cloudModulesForView(currentView);
  await loadCloudData({
    modules: modules.length ? modules : ["weather"],
    render: false,
    force: true
  });
}

function showAuthenticatedShell(status = "Cargando datos desde Supabase...") {
  cloudInitialLoadInProgress = true;
  setAuthGate(false);
  if (status) document.getElementById("storageStatus").textContent = status;
  render();
}

async function loadCloudDataInBackground({ toastOnSuccess = false } = {}) {
  try {
    const loadedFromNetwork = shouldLoadCloudModule("weather");
    if (loadedFromNetwork) {
      await loadCloudData({ modules: ["weather"], render: false });
    }
    startCloudSync();
    if (currentView === "dashboard") renderDashboard();
    if (toastOnSuccess) showToast(loadedFromNetwork ? "Inicio cargado desde Supabase" : "Inicio cargado desde cache");
  } catch (error) {
    console.error("Supabase no cargo", error);
    document.getElementById("storageStatus").textContent = `Supabase no cargo: ${error.message}`;
    showToast(`Supabase no cargo: ${error.message}`);
  } finally {
    cloudInitialLoadInProgress = false;
    if (currentView === "dashboard") render();
  }
}

function normalizeState(rawState) {
  const next = structuredClone(rawState || seedState);
  next.products ||= [];
  next.seasons ||= [{ id: next.settings?.currentSeasonId || "season-2024-2025", name: next.settings?.season || "2024/2025", startYear: 2024, endYear: 2025, status: "activa" }];
  next.programs ||= [];
  next.programProducts ||= [];
  next.programs.forEach((program) => {
    program.startDate ??= "";
    program.endDate ??= "";
    program.waterHa ??= 0;
  });
  next.blocks ||= [];
  next.harvestFields ||= next.blocks || [];
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
  next.harvestAnalysisRecords ||= [];
  next.harvestExportRecords ||= [];
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
      line.dose ??= line.dose100;
      line.doseBasis ??= "per_100l";
      line.divisor ??= line.doseBasis === "per_100l" ? 1000 : 1;
      line.programNumber ??= order.programNumbers?.[0] || order.programNumber || "";
      line.productHaProgram = productHaFromDose(order, line);
      line.totalProgram = plannedProduct(order, line);
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

function isMissingSupabaseRelation(error, relations = []) {
  const message = String(error?.message || "").toLowerCase();
  return message.includes("does not exist")
    || message.includes("could not find the table")
    || message.includes("relation")
    || relations.some((relation) => message.includes(String(relation).toLowerCase()));
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

function accountInitials(name = "") {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "AC";
  return `${parts[0]?.[0] || ""}${parts.length > 1 ? parts.at(-1)?.[0] || "" : parts[0]?.[1] || ""}`.toLocaleUpperCase("es");
}

function updateAuthenticatedUserUi() {
  const button = document.getElementById("authButton");
  if (!button) return;
  const name = currentProfile?.full_name || currentProfile?.nombre_completo || supabaseSession?.user?.email || "Cuenta";
  const role = supabaseSession ? roleLabel(currentProfile?.role || currentProfile?.rol) : "Usuario";
  const nameNode = button.querySelector("[data-user-name]");
  const roleNode = button.querySelector("[data-user-role]");
  const avatarNode = button.querySelector("[data-user-avatar]");
  if (nameNode) nameNode.textContent = name;
  if (roleNode) roleNode.textContent = role;
  if (avatarNode) avatarNode.textContent = accountInitials(name);
  button.title = supabaseSession ? `${name} - ${role}` : "Cuenta";
}

function setUserMenuOpen(open) {
  const button = document.getElementById("authButton");
  const panel = document.getElementById("userMenuPanel");
  if (!button || !panel) return;
  panel.hidden = !open;
  button.setAttribute("aria-expanded", String(Boolean(open)));
  document.getElementById("userMenu")?.classList.toggle("open", Boolean(open));
}

function toggleUserMenu() {
  const panel = document.getElementById("userMenuPanel");
  setUserMenuOpen(Boolean(panel?.hidden));
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
    admin: ["dashboard", "irrigation", "calicatas", "fertilizers", "pestMonitoring", "applicationDashboard", "program", "manager", "warehouse", "inventory", "prices", "reports", "harvestMap", "harvestInfo", "harvestExport", "harvestAnalysis", "orders", "execution", "masters"],
    supervisor: ["dashboard", "irrigation", "calicatas", "fertilizers", "pestMonitoring", "applicationDashboard", "program", "manager", "warehouse", "inventory", "prices", "reports", "harvestMap", "harvestInfo", "harvestExport", "harvestAnalysis", "orders", "execution", "masters"],
    bodeguero: ["dashboard", "fertilizers", "warehouse", "inventory", "prices"],
    operador: ["execution"],
    lectura: ["dashboard", "irrigation", "calicatas", "fertilizers", "pestMonitoring", "reports", "harvestMap", "harvestInfo", "harvestExport", "harvestAnalysis"]
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
    admin: ["dashboard", "irrigation", "calicatas", "fertilizers", "pestMonitoring", "applicationDashboard", "program", "manager", "warehouse", "inventory", "prices", "reports", "harvestMap", "harvestInfo", "harvestExport", "harvestAnalysis"],
    supervisor: ["dashboard", "irrigation", "calicatas", "fertilizers", "pestMonitoring", "applicationDashboard", "program", "manager", "warehouse", "inventory", "prices", "reports", "harvestMap", "harvestInfo", "harvestExport", "harvestAnalysis"],
    bodeguero: ["dashboard", "fertilizers", "warehouse", "inventory", "prices"],
    operador: ["execution"],
    lectura: ["dashboard", "irrigation", "calicatas", "fertilizers", "pestMonitoring", "reports", "harvestMap", "harvestInfo", "harvestExport", "harvestAnalysis"]
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

async function loadOfficialProgramFallback() {
  if (officialProgramFallbackCache) return officialProgramFallbackCache;
  try {
    const response = await fetch("data/programa_fitosanitario.json", { cache: "no-cache" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    officialProgramFallbackCache = await response.json();
  } catch (error) {
    console.warn("No se pudo cargar el respaldo local del Programa Fitosanitario", error);
    officialProgramFallbackCache = { programs: [], summary: {} };
  }
  return officialProgramFallbackCache;
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

function normalizeWeatherDailySummaryRow(item = {}, existing = {}) {
  const date = item.fecha || item.date || "";
  const numberFrom = (keys, fallback = 0) => {
    for (const key of keys) {
      if (item[key] === null || item[key] === undefined || item[key] === "") continue;
      const value = Number(item[key]);
      if (Number.isFinite(value)) return value;
    }
    return fallback;
  };
  const textFrom = (keys, fallback = "") => {
    for (const key of keys) {
      if (item[key] === null || item[key] === undefined || item[key] === "") continue;
      return item[key];
    }
    return fallback;
  };
  return {
    date,
    records: numberFrom(["registros", "records"], existing.records || 0),
    average: numberFrom(["temperatura_promedio", "average"], existing.average || 0),
    minimum: numberFrom(["temperatura_minima", "minimum"], existing.minimum ?? null),
    maximum: numberFrom(["temperatura_maxima", "maximum"], existing.maximum ?? null),
    humidityAverage: numberFrom(["humedad_promedio", "humidityAverage"], existing.humidityAverage ?? null),
    windAverage: numberFrom(["velocidad_viento_promedio", "windAverage"], existing.windAverage ?? null),
    precipitationTotal: numberFrom(["precipitacion_acumulada", "precipitationTotal"], existing.precipitationTotal || 0),
    hoursAbove7: numberFrom(["horas_sobre_7", "hoursAbove7"], existing.hoursAbove7 || 0),
    degreeDays: numberFrom(["grados_dia_base_7", "degreeDays"], existing.degreeDays || 0),
    frost0ToMinus1: numberFrom(["helada_0_menos_1", "frost0ToMinus1"], existing.frost0ToMinus1 || 0),
    frostMinus1ToMinus2: numberFrom(["helada_menos_1_menos_2", "frostMinus1ToMinus2"], existing.frostMinus1ToMinus2 || 0),
    frostBelowMinus2: numberFrom(["helada_menor_igual_menos_2", "frostBelowMinus2"], existing.frostBelowMinus2 || 0),
    frostStart: textFrom(["helada_inicio", "frostStart"], existing.frostStart || ""),
    frostEnd: textFrom(["helada_termino", "frostEnd"], existing.frostEnd || ""),
    frostWindows: textFrom(["frostWindows"], existing.frostWindows || "")
  };
}

function mergeWeatherDailySummaryRows(rows = []) {
  const byDate = new Map((state.weatherStationDaily || []).map((item) => [item.date, item]));
  rows.forEach((row) => {
    const date = row.fecha || row.date || "";
    if (!date) return;
    byDate.set(date, normalizeWeatherDailySummaryRow(row, byDate.get(date) || {}));
  });
  state.weatherStationDaily = [...byDate.values()].sort((a, b) => String(a.date).localeCompare(String(b.date)));
}

function weatherRainByDateMap(rows = state.weatherStationDaily || []) {
  return new Map((rows || [])
    .map((row) => [String(row.date || "").slice(0, 10), Number(row.precipitationTotal || 0)])
    .filter(([date]) => date));
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
  if (!date || !Number.isFinite(evaporation) || evaporation < 0) {
    showToast("Revisa fecha y evaporacion");
    return;
  }
  try {
    const existingRows = await sbFetch(`/rest/v1/evaporacion_bandeja?select=id,fecha,evaporacion,estacion&fecha=eq.${date}&order=id.desc&limit=1`);
    let saved;
    if (existingRows?.length) {
      saved = await sbFetch(`/rest/v1/evaporacion_bandeja?id=eq.${existingRows[0].id}&select=fecha,evaporacion,estacion`, {
        method: "PATCH",
        prefer: "return=representation",
        body: JSON.stringify({ evaporacion: evaporation })
      });
    } else {
      saved = await sbFetch("/rest/v1/evaporacion_bandeja?select=fecha,evaporacion,estacion", {
        method: "POST",
        prefer: "return=representation",
        body: JSON.stringify([{
          fecha: date,
          evaporacion: evaporation,
          estacion: null
        }])
      });
    }
    const row = saved?.[0] || { fecha: date, evaporacion: evaporation, estacion: null };
    mergeEvaporationRows([row]);
    irrigationEvaporationLoadedMonths.add(date.slice(0, 7));
    if (date.slice(0, 7) !== `${irrigationYear}-${irrigationMonth}`) {
      irrigationYear = date.slice(0, 4);
      irrigationMonth = date.slice(5, 7);
    }
    irrigationBandejaFocusPending = true;
    renderIrrigation();
    showToast(existingRows?.length ? "Dato de bandeja actualizado" : "Dato de bandeja guardado");
  } catch (error) {
    showToast(`No se guardo bandeja: ${error.message}`);
  }
}

function updateIrrigationBandejaFocus(date) {
  irrigationEvaporationLoadedMonths.add(date.slice(0, 7));
  if (date.slice(0, 7) !== `${irrigationYear}-${irrigationMonth}`) {
    irrigationYear = date.slice(0, 4);
    irrigationMonth = date.slice(5, 7);
  }
  irrigationBandejaFocusPending = true;
}

async function deleteIrrigationBandejaRecord() {
  const form = document.getElementById("irrigationBandejaForm");
  if (!form) return;
  const date = String(Object.fromEntries(new FormData(form)).fecha || "").slice(0, 10);
  if (!date) {
    showToast("Selecciona la fecha de bandeja");
    return;
  }
  if (!supabaseSession) {
    showToast("Inicia sesion para eliminar bandeja");
    return;
  }
  if (!confirm(`Eliminar evaporacion de bandeja del ${date}?`)) return;
  try {
    await sbFetch(`/rest/v1/evaporacion_bandeja?fecha=eq.${date}`, {
      method: "DELETE",
      prefer: "return=minimal"
    });
    state.irrigationEvaporation = (state.irrigationEvaporation || []).filter((item) => item.date !== date);
    updateIrrigationBandejaFocus(date);
    renderIrrigation();
    showToast("Dato de bandeja eliminado");
  } catch (error) {
    showToast(`No se elimino bandeja: ${error.message}`);
  }
}

async function refreshIrrigationRainDay(date, fallbackRain = 0) {
  const dailyRows = await sbFetch(`/rest/v1/v_estacion_climatica_diaria?select=fecha,precipitacion_acumulada&fecha=eq.${date}`);
  mergeWeatherDailySummaryRows(dailyRows?.length ? dailyRows : [{ fecha: date, precipitacion_acumulada: fallbackRain }]);
}

async function saveIrrigationRainRecord() {
  const form = document.getElementById("irrigationRainForm");
  if (!form || !form.reportValidity()) return;
  if (!supabaseSession) {
    showToast("Inicia sesion para guardar lluvia");
    return;
  }
  const data = Object.fromEntries(new FormData(form));
  const date = String(data.fecha || "").slice(0, 10);
  const rain = Number(data.lluvia);
  if (!date || !Number.isFinite(rain) || rain < 0) {
    showToast("Revisa fecha y lluvia");
    return;
  }
  try {
    const existingRows = await sbFetch(`/rest/v1/estacion_climatica?select=id,hora,precipitacion,fuente&fecha=eq.${date}&fuente=eq.bandeja_lluvia_manual&order=hora.desc&limit=1`);
    if (existingRows?.length) {
      await sbFetch(`/rest/v1/estacion_climatica?id=eq.${existingRows[0].id}`, {
        method: "PATCH",
        prefer: "return=minimal",
        body: JSON.stringify({ precipitacion: rain })
      });
    } else {
      const latest = state.weatherStationLatest || {};
      const temp = Number.isFinite(Number(latest.tempOut)) ? Number(latest.tempOut) : 10;
      const hi = Number.isFinite(Number(latest.hiTemp)) ? Number(latest.hiTemp) : temp;
      const low = Number.isFinite(Number(latest.lowTemp)) ? Number(latest.lowTemp) : temp;
      await sbFetch("/rest/v1/estacion_climatica?select=fecha,hora,precipitacion", {
        method: "POST",
        prefer: "return=representation",
        body: JSON.stringify([{
          fecha: date,
          hora: "12:01",
          temp_out: temp,
          hi_temp: hi,
          low_temp: low,
          precipitacion: rain,
          fuente: "bandeja_lluvia_manual"
        }])
      });
    }
    await refreshIrrigationRainDay(date, rain);
    updateIrrigationBandejaFocus(date);
    renderIrrigation();
    showToast(existingRows?.length ? "Dato de lluvia actualizado" : "Dato de lluvia guardado");
  } catch (error) {
    showToast(`No se guardo lluvia: ${error.message}`);
  }
}

async function deleteIrrigationRainRecord() {
  const form = document.getElementById("irrigationRainForm");
  if (!form) return;
  const date = String(Object.fromEntries(new FormData(form)).fecha || "").slice(0, 10);
  if (!date) {
    showToast("Selecciona la fecha de lluvia");
    return;
  }
  if (!supabaseSession) {
    showToast("Inicia sesion para eliminar lluvia");
    return;
  }
  if (!confirm(`Eliminar lluvia manual del ${date}?`)) return;
  try {
    const manualRows = await sbFetch(`/rest/v1/estacion_climatica?select=id&fecha=eq.${date}&fuente=eq.bandeja_lluvia_manual`);
    if (manualRows?.length) {
      await sbFetch(`/rest/v1/estacion_climatica?fecha=eq.${date}&fuente=eq.bandeja_lluvia_manual`, {
        method: "DELETE",
        prefer: "return=minimal"
      });
    } else {
      const legacyRows = await sbFetch(`/rest/v1/estacion_climatica?select=id,hora,precipitacion,fuente&fecha=eq.${date}&precipitacion=gt.0&order=hora.desc&limit=1`);
      if (!legacyRows?.length) {
        showToast("No hay lluvia registrada para esa fecha");
        return;
      }
      const legacyRow = legacyRows[0];
      const hour = String(legacyRow.hora || "").slice(0, 5) || "sin hora";
      const source = legacyRow.fuente ? ` (${legacyRow.fuente})` : "";
      const message = `No encontre lluvia manual marcada para ${date}.\nLa version anterior pudo guardar la lluvia dentro de una lectura normal.\n\nSe dejara en 0 la lectura con lluvia de las ${hour}${source}.`;
      if (!confirm(message)) return;
      await sbFetch(`/rest/v1/estacion_climatica?id=eq.${legacyRow.id}`, {
        method: "PATCH",
        prefer: "return=minimal",
        body: JSON.stringify({ precipitacion: 0 })
      });
    }
    await refreshIrrigationRainDay(date, 0);
    updateIrrigationBandejaFocus(date);
    renderIrrigation();
    showToast("Dato de lluvia eliminado");
  } catch (error) {
    showToast(`No se elimino lluvia: ${error.message}`);
  }
}

function irrigationBandejaDefaultDate(focusYear = irrigationYear, month = irrigationMonth) {
  const year = Number(focusYear) || new Date().getFullYear();
  const monthValue = String(month || String(new Date().getMonth() + 1).padStart(2, "0")).padStart(2, "0");
  const defaultDay = Math.min(new Date().getDate(), new Date(year, Number(monthValue), 0).getDate());
  return `${year}-${monthValue}-${String(defaultDay).padStart(2, "0")}`;
}

function openIrrigationBandejaDialog() {
  const dialog = document.getElementById("irrigationBandejaDialog");
  if (!dialog) return;
  const defaultDate = irrigationBandejaDefaultDate();
  dialog.innerHTML = `
    <div class="dialog-card irrigation-bandeja-dialog">
      <div class="dialog-header">
        <div>
          <strong>Agregar datos de bandeja</strong>
          <p>Registra evaporacion y lluvia por fecha.</p>
        </div>
        <button class="icon-button" type="button" data-action="close-dialog" title="Cerrar">x</button>
      </div>
      <div class="irrigation-bandeja-dialog-grid">
        <form id="irrigationBandejaForm" class="irrigation-bandeja-dialog-form">
          <div>
            <strong>Evaporacion bandeja</strong>
            <span>Guarda o actualiza el dato diario.</span>
          </div>
          <label>Fecha
            <input name="fecha" type="date" required value="${defaultDate}">
          </label>
          <label>Evaporacion
            <input name="evaporacion" type="number" min="0" step="0.01" inputmode="decimal" required placeholder="0.00">
          </label>
          <div class="irrigation-bandeja-dialog-actions">
            <button class="primary-button" type="button" data-action="save-irrigation-bandeja">Guardar bandeja</button>
            <button class="danger-button" type="button" data-action="delete-irrigation-bandeja">Eliminar fecha</button>
          </div>
        </form>
        <form id="irrigationRainForm" class="irrigation-bandeja-dialog-form irrigation-bandeja-dialog-form-rain">
          <div>
            <strong>Lluvia</strong>
            <span>Se registra en la estacion climatica por fecha.</span>
          </div>
          <label>Fecha
            <input name="fecha" type="date" required value="${defaultDate}">
          </label>
          <label>Lluvia mm
            <input name="lluvia" type="number" min="0" step="0.01" inputmode="decimal" required placeholder="0.00">
          </label>
          <div class="irrigation-bandeja-dialog-actions">
            <button class="secondary-button" type="button" data-action="save-irrigation-rain">Guardar lluvia</button>
            <button class="danger-button" type="button" data-action="delete-irrigation-rain" title="Borra lluvia manual o corrige una lluvia antigua sin marca">Eliminar lluvia</button>
          </div>
        </form>
      </div>
      <div class="dialog-actions">
        <button class="secondary-button" type="button" data-action="close-dialog">Cerrar</button>
      </div>
    </div>`;
  if (dialog.open) dialog.close();
  dialog.showModal();
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

function currentDateTimeLocalValue() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 16);
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
  if (order?.programId) {
    const direct = state.programs.find((program) => String(program.id) === String(order.programId));
    if (direct) return direct;
  }
  return state.programs.find((program) => program.seasonId === order.seasonId
    && String(program.number) === String(order.programNumber)
    && (!order.crop || !program.crop || normalizeCatalogText(program.crop) === normalizeCatalogText(order.crop)));
}

function getProgramDefinitionByNumber(seasonId, numberValue) {
  return state.programs.find((program) => program.seasonId === seasonId && String(program.number) === String(numberValue));
}

function programLabel(order) {
  const definition = getProgramDefinition(order);
  if (definition?.official) return `${definition.name} ${definition.code || definition.number} · ${definition.crop || order.crop || ""}`.trim();
  const numbers = order.programNumbers?.length ? order.programNumbers : [order.programNumber].filter(Boolean);
  return numbers.length ? `Programa ${numbers.join(", ")}` : "Programa s/n";
}

function normalizeCatalogText(value) {
  return String(value || "").trim().replace(/\s+/g, " ").toLocaleUpperCase("es-CL");
}

function programProductsFor(programId) {
  return state.programProducts.filter((line) => String(line.programId) === String(programId)).sort((a, b) => a.order - b.order);
}

function officialPrograms() {
  return state.programs.filter((program) => program.official && program.active !== false);
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

const irrigationLocalSaveTimers = { real: null, program: null };

function saveIrrigationHours() {
  localStorage.setItem(IRRIGATION_DRAFT_KEY, JSON.stringify(irrigationHours));
}

function saveIrrigationProgramHours() {
  localStorage.setItem(IRRIGATION_PROGRAM_KEY, JSON.stringify(irrigationProgramHours));
}

function scheduleIrrigationLocalSave(kind) {
  const key = kind === "program" ? "program" : "real";
  clearTimeout(irrigationLocalSaveTimers[key]);
  irrigationLocalSaveTimers[key] = setTimeout(() => {
    irrigationLocalSaveTimers[key] = null;
    if (key === "program") saveIrrigationProgramHours();
    else saveIrrigationHours();
  }, 450);
}

function flushIrrigationLocalSaves() {
  if (irrigationLocalSaveTimers.real) {
    clearTimeout(irrigationLocalSaveTimers.real);
    irrigationLocalSaveTimers.real = null;
    saveIrrigationHours();
  }
  if (irrigationLocalSaveTimers.program) {
    clearTimeout(irrigationLocalSaveTimers.program);
    irrigationLocalSaveTimers.program = null;
    saveIrrigationProgramHours();
  }
}

window.addEventListener("beforeunload", flushIrrigationLocalSaves);

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

function irrigationKeyDate(key) {
  return String(key || "").split("__").pop() || "";
}

function irrigationKeyMatchesMonth(key, monthPrefix = "") {
  return Boolean(monthPrefix && irrigationKeyDate(key).startsWith(monthPrefix));
}

function irrigationMonthDateRange(monthPrefix = "") {
  const match = String(monthPrefix || "").match(/^(\d{4})-(\d{2})$/);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  if (!Number.isFinite(year) || !Number.isFinite(month) || month < 1 || month > 12) return null;
  const start = `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-01`;
  const next = new Date(Date.UTC(year, month, 1));
  const end = `${next.getUTCFullYear()}-${String(next.getUTCMonth() + 1).padStart(2, "0")}-01`;
  return { start, end };
}

function irrigationMonthFilterQuery(monthPrefix = "") {
  const range = irrigationMonthDateRange(monthPrefix);
  return range ? `&fecha=gte.${range.start}&fecha=lt.${range.end}` : "";
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
  const base = `${kind === "program" ? "Programa" : "Riego real"} ${potreroLabel(block.potrero)} bloque ${block.block} - ${date}`;
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
  const label = `${kind === "program" ? "Programa" : "Riego real"} ${potreroLabel(block.potrero)} bloque ${block.block} dia ${dayIndex + 1}`;
  const displayValue = value === "" || value === null || value === undefined ? "" : value;
  return `<button class="irrigation-hour-input irrigation-hour-cell ${kind === "program" ? "irrigation-program-input" : ""} ${irrigationDayClass(date)} ${auditClass} ${observationClass} ${selectedClass} ${Number(value) > 0 ? "has-hours" : ""}" type="button" aria-label="${htmlAttr(label)}" title="${htmlAttr(label)}" data-grid-kind="${kind}" data-row-index="${rowIndex}" data-day-index="${dayIndex}" ${idAttribute} data-date="${date}" data-value="${htmlAttr(displayValue)}" value="${htmlAttr(displayValue)}">${escapeHtml(displayValue)}</button>`;
}

function applyIrrigationObservationRecords(rows = [], options = {}) {
  const monthPrefix = options.monthPrefix || "";
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
  const previousReal = monthPrefix
    ? Object.fromEntries(Object.entries(irrigationObservations).filter(([key]) => !irrigationKeyMatchesMonth(key, monthPrefix)))
    : {};
  const previousProgram = monthPrefix
    ? Object.fromEntries(Object.entries(irrigationProgramObservations).filter(([key]) => !irrigationKeyMatchesMonth(key, monthPrefix)))
    : {};
  irrigationObservations = { ...previousReal, ...real, ...pendingReal };
  irrigationProgramObservations = { ...previousProgram, ...program, ...pendingProgram };
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

function irrigationBaseHours(block, fallback = 0) {
  const base = Number(block?.baseHours);
  if (Number.isFinite(base) && base > 0) return base;
  const backup = Number(fallback);
  return Number.isFinite(backup) && backup > 0 ? backup : 0;
}

function irrigationBaseHoursLabel(block) {
  const base = Number(block?.baseHours);
  return Number.isFinite(base) && base > 0 ? `${number(base, 1)} h base` : "Sin horas base";
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

function applyIrrigationRecords(rows = [], options = {}) {
  const monthPrefix = options.monthPrefix || "";
  const pendingKeys = new Set(irrigationSaveTimers.keys());
  const pendingHours = Object.fromEntries(Object.entries(irrigationHours).filter(([key]) => pendingKeys.has(key)));
  const pendingAudit = Object.fromEntries(Object.entries(irrigationAudit).filter(([key]) => pendingKeys.has(key)));
  const records = rows.map((item) => ({
    id: item.id,
    blockId: item.campo_id,
    date: String(item.fecha || "").slice(0, 10),
    hours: Number(item.horas_riego) || 0,
    volume: Number(item.volumen) || 0,
    modifiedByName: item.modificado_por_nombre || item.creado_por_nombre || "",
    modifiedAt: item.modificado_en || item.actualizado_en || item.updated_at || ""
  })).filter((item) => item.blockId && item.date);
  state.irrigationRecords = monthPrefix
    ? [...(state.irrigationRecords || []).filter((item) => !String(item.date || "").startsWith(monthPrefix)), ...records]
    : records;
  const cloudHours = {};
  const cloudAudit = {};
  records.forEach((item) => {
    const key = irrigationKey(item.blockId, item.date);
    if (item.hours > 0) cloudHours[key] = item.hours;
    if (item.hours > 0 && (item.modifiedByName || item.modifiedAt)) {
      cloudAudit[key] = { userName: item.modifiedByName, updatedAt: item.modifiedAt };
    }
  });
  const previousHours = monthPrefix
    ? Object.fromEntries(Object.entries(irrigationHours).filter(([key]) => !irrigationKeyMatchesMonth(key, monthPrefix)))
    : {};
  const previousAudit = monthPrefix
    ? Object.fromEntries(Object.entries(irrigationAudit).filter(([key]) => !irrigationKeyMatchesMonth(key, monthPrefix)))
    : {};
  irrigationHours = { ...previousHours, ...cloudHours, ...pendingHours };
  irrigationAudit = { ...previousAudit, ...cloudAudit, ...pendingAudit };
  saveIrrigationHours();
  saveIrrigationAudit();
}

function applyIrrigationProgramRecords(rows = [], options = {}) {
  const monthPrefix = options.monthPrefix || "";
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
  const previousHours = monthPrefix
    ? Object.fromEntries(Object.entries(irrigationProgramHours).filter(([key]) => !irrigationKeyMatchesMonth(key, monthPrefix)))
    : {};
  const previousAudit = monthPrefix
    ? Object.fromEntries(Object.entries(irrigationProgramAudit).filter(([key]) => !irrigationKeyMatchesMonth(key, monthPrefix)))
    : {};
  irrigationProgramHours = { ...previousHours, ...cloudHours, ...pendingHours };
  irrigationProgramAudit = { ...previousAudit, ...cloudAudit, ...pendingAudit };
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

function irrigationCellValue(cell) {
  if (!cell) return "";
  return cell.tagName === "INPUT" ? cell.value : (cell.dataset.value || cell.value || "");
}

function setIrrigationCellValue(cell, value) {
  if (!cell) return;
  const normalized = value === null || value === undefined ? "" : String(value);
  if (cell.tagName === "INPUT") cell.value = normalized;
  else {
    cell.dataset.value = normalized;
    cell.value = normalized;
    cell.textContent = normalized;
  }
}

function irrigationCellSelector() {
  return ".irrigation-hour-input";
}

function isIrrigationCellEditor(cell) {
  return cell?.tagName === "INPUT";
}

function irrigationCellClassForValue(cell, value, context = irrigationInputContext(cell)) {
  if (!cell || !context) return;
  const key = irrigationKey(context.blockId, context.date);
  const source = context.kind === "program" ? irrigationProgramHours : irrigationHours;
  const audit = context.kind === "program" ? irrigationProgramAudit : irrigationAudit;
  cell.classList.toggle("has-hours", Boolean(source[key]));
  cell.classList.toggle("has-audit", Boolean(audit[key]));
}

function createIrrigationEditorFromCell(cell) {
  const context = irrigationInputContext(cell);
  if (!cell || !context || isIrrigationCellEditor(cell)) return cell;
  const editor = document.createElement("input");
  editor.type = "text";
  editor.inputMode = "decimal";
  editor.min = "0";
  editor.step = "0.5";
  editor.className = cell.className.replace(/\birrigation-hour-cell\b/g, "irrigation-hour-editor");
  editor.setAttribute("aria-label", cell.getAttribute("aria-label") || "");
  editor.title = cell.title || "";
  editor.dataset.gridKind = cell.dataset.gridKind;
  editor.dataset.rowIndex = cell.dataset.rowIndex;
  editor.dataset.dayIndex = cell.dataset.dayIndex;
  editor.dataset.date = cell.dataset.date;
  editor.dataset.value = irrigationCellValue(cell);
  if (cell.dataset.blockId) editor.dataset.blockId = cell.dataset.blockId;
  if (cell.dataset.programBlockId) editor.dataset.programBlockId = cell.dataset.programBlockId;
  if (cell.dataset.titleSignature) editor.dataset.titleSignature = cell.dataset.titleSignature;
  editor.value = irrigationCellValue(cell);
  cell.replaceWith(editor);
  if (irrigationSelectedInput === cell) irrigationSelectedInput = editor;
  return editor;
}

function createIrrigationCellFromEditor(editor) {
  const context = irrigationInputContext(editor);
  if (!editor || !context || !isIrrigationCellEditor(editor)) return editor;
  const cell = document.createElement("button");
  cell.type = "button";
  cell.className = editor.className.replace(/\birrigation-hour-editor\b/g, "irrigation-hour-cell");
  cell.setAttribute("aria-label", editor.getAttribute("aria-label") || "");
  cell.title = editor.title || "";
  cell.dataset.gridKind = editor.dataset.gridKind;
  cell.dataset.rowIndex = editor.dataset.rowIndex;
  cell.dataset.dayIndex = editor.dataset.dayIndex;
  cell.dataset.date = editor.dataset.date;
  if (editor.dataset.blockId) cell.dataset.blockId = editor.dataset.blockId;
  if (editor.dataset.programBlockId) cell.dataset.programBlockId = editor.dataset.programBlockId;
  if (editor.dataset.titleSignature) cell.dataset.titleSignature = editor.dataset.titleSignature;
  setIrrigationCellValue(cell, editor.value);
  editor.replaceWith(cell);
  if (irrigationSelectedInput === editor) irrigationSelectedInput = cell;
  return cell;
}

function activateIrrigationCell(cell, select = true) {
  const editor = createIrrigationEditorFromCell(cell);
  editor?.focus?.({ preventScroll: true });
  if (select) editor?.select?.();
  return editor;
}

function irrigationObservationInput(context = irrigationObservationContext) {
  if (!context || !views.irrigation) return null;
  const idAttribute = context.kind === "program" ? "data-program-block-id" : "data-block-id";
  return views.irrigation.querySelector(`${irrigationCellSelector()}[${idAttribute}="${CSS.escape(context.blockId)}"][data-date="${CSS.escape(context.date)}"]`);
}

function irrigationInputContext(input) {
  if (!input?.classList?.contains("irrigation-hour-input")) return null;
  const kind = input.dataset.gridKind;
  const blockId = kind === "program" ? input.dataset.programBlockId : input.dataset.blockId;
  if (!blockId || !input.dataset.date || !["program", "real"].includes(kind)) return null;
  return { kind, blockId, date: input.dataset.date };
}

function hydrateIrrigationInputTitle(input, context = irrigationInputContext(input), block = null) {
  if (!input || !context) return;
  const key = irrigationKey(context.blockId, context.date);
  const audit = context.kind === "program" ? irrigationProgramAudit[key] : irrigationAudit[key];
  const observation = irrigationCellObservation(context.kind, context.blockId, context.date);
  const value = irrigationCellValue(input);
  const signature = [
    context.kind,
    context.blockId,
    context.date,
    value,
    audit?.updatedAt || "",
    observation?.updatedAt || "",
    observation?.text ? "obs" : ""
  ].join("|");
  if (input.dataset.titleSignature === signature) return;
  const blockInfo = block || state.blocks.find((item) => item.id === context.blockId) || { id: context.blockId, potrero: "", block: "" };
  input.title = irrigationAuditTitle(context.kind, blockInfo, context.date, value);
  input.dataset.titleSignature = signature;
}

function updateIrrigationObservationCellUi(context = irrigationObservationContext) {
  const input = irrigationObservationInput(context);
  if (!input) return;
  const block = state.blocks.find((item) => item.id === context.blockId) || { id: context.blockId, potrero: "", block: "" };
  const hasObservation = Boolean(irrigationCellObservation(context.kind, context.blockId, context.date)?.text);
  input.classList.toggle("has-observation", hasObservation);
  delete input.dataset.titleSignature;
  hydrateIrrigationInputTitle(input, context, block);
}

function selectIrrigationObservationCell(input) {
  if (!setIrrigationObservationContextFromInput(input)) return false;
  const previous = irrigationSelectedInput?.isConnected
    ? irrigationSelectedInput
    : views.irrigation?.querySelector(".irrigation-hour-input.is-selected");
  if (previous && previous !== input) previous.classList.remove("is-selected");
  input.classList.add("is-selected");
  irrigationSelectedInput = input;
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
          <p>${context.kind === "program" ? "Programa" : "Riego real"} · Potrero ${escapeHtml(potreroLabel(block.potrero))} · Bloque ${escapeHtml(block.block)} · ${escapeHtml(context.date)}</p>
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

function calicataDepthNumber(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : null;
}

function calicataDepthAverage(values) {
  return average(values.map(calicataDepthNumber).filter((value) => value !== null));
}

function calicataDepthLabel(value) {
  const numeric = calicataDepthNumber(value);
  return numeric === null ? "-" : number(numeric);
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
  if (clamped >= 4.75) return "#0b1f5e";
  if (clamped >= 4.25) return "#1d4ed8";
  if (clamped >= 3.75) return "#60a5fa";
  if (clamped >= 3.25) return "#ca8a04";
  if (clamped >= 2.75) return "#facc15";
  if (clamped >= 2.25) return "#c2410c";
  if (clamped >= 1.75) return "#fb923c";
  if (clamped >= 1.25) return "#f87171";
  return "#7f1d1d";
}

function calicataAverageValue(item) {
  return calicataDepthAverage([item?.depth20, item?.depth40, item?.depth60, item?.depth80]);
}

function calicataColorStyle(value) {
  const color = calicataValueColor(value);
  return `--calicata-color:${color};--calicata-bg:${color}22;--calicata-border:${color}99;`;
}

function calicataSummary(calicatas) {
  const active = calicatas.filter((item) => !item.empty);
  const depth20 = calicataDepthAverage(active.map((item) => item.depth20));
  const depth40 = calicataDepthAverage(active.map((item) => item.depth40));
  const depth60 = calicataDepthAverage(active.map((item) => item.depth60));
  const depth80 = calicataDepthAverage(active.map((item) => item.depth80));
  const general = calicataDepthAverage(active.flatMap((item) => [item.depth20, item.depth40, item.depth60, item.depth80]));
  return { count: active.length, depth20, depth40, depth60, depth80, general };
}

function calicataDepthCell(calicatas, field) {
  const value = calicataDepthAverage(calicatas.filter((item) => !item.empty).map((item) => item[field]));
  return value === null ? "" : number(value);
}

function calicataTextCell(calicatas, field) {
  const values = [...new Set(calicatas.map((item) => String(item[field] || "").trim()).filter(Boolean))];
  if (!values.length) return "";
  return values.length > 1 ? `${values[0]} +${values.length - 1}` : values[0];
}

const EMPTY_CALICATA_SUMMARY = Object.freeze({
  count: 0,
  depth20: null,
  depth40: null,
  depth60: null,
  depth80: null,
  general: null
});

const IRRIGATION_CALICATA_DETAIL_ROWS = [
  ["20 cm", "depth20", "depth"],
  ["40 cm", "depth40", "depth"],
  ["60 cm", "depth60", "depth"],
  ["80 cm", "depth80", "depth"],
  ["Trab.", "workerName", "text"],
  ["Obs.", "observation", "text"]
];

function irrigationCalicataDayKey(blockKey, date) {
  return `${blockKey}__${date}`;
}

function buildIrrigationGanttCalicataIndex(blocks, monthPrefix) {
  const visibleKeys = new Set(blocks.map((block) => calicataBlockKey(block.potrero, block.block)));
  const byBlock = new Map();
  const byDay = new Map();
  (state.calicatas || []).forEach((item) => {
    const blockKey = calicataBlockKey(item.potrero, item.block);
    if (!visibleKeys.has(blockKey)) return;
    if (!byBlock.has(blockKey)) byBlock.set(blockKey, []);
    byBlock.get(blockKey).push(item);

    const date = calicataDate(item);
    if (!date || !date.startsWith(monthPrefix)) return;
    const dayKey = irrigationCalicataDayKey(blockKey, date);
    if (!byDay.has(dayKey)) byDay.set(dayKey, []);
    byDay.get(dayKey).push(item);
  });
  const summaryByBlock = new Map([...byBlock.entries()].map(([key, rows]) => [key, calicataSummary(rows)]));
  const summaryByDay = new Map([...byDay.entries()].map(([key, rows]) => [key, calicataSummary(rows)]));
  return { byBlock, byDay, summaryByBlock, summaryByDay };
}

function renderIrrigationProgramCalicataDetailRows(calicataKey, monthDates, dayClassMap) {
  return IRRIGATION_CALICATA_DETAIL_ROWS.map(([label]) => `
    <div class="irrigation-row calicata-detail-row irrigation-program-spacer-row" data-calicata-detail="${htmlAttr(calicataKey)}">
      <div class="irrigation-block-label calicata-label">
        <strong>${label}</strong>
      </div>
      <div class="irrigation-days calicata-detail-days">
        ${monthDates.map((date) => `<span class="calicata-detail-cell ${dayClassMap.get(date) || ""}"></span>`).join("")}
      </div>
      <div class="irrigation-total calicata-label"></div>
      <div class="irrigation-reposition calicata-label"></div>
    </div>
  `).join("");
}

function renderIrrigationRealCalicataDetailRows(calicataKey, monthDates, dayClassMap, calicataIndex) {
  return IRRIGATION_CALICATA_DETAIL_ROWS.map(([label, field, type]) => `
    <div class="irrigation-row calicata-detail-row" data-calicata-detail="${htmlAttr(calicataKey)}">
      <div class="irrigation-block-label calicata-label">
        <strong>${label}</strong>
      </div>
      <div class="irrigation-days calicata-detail-days">
        ${monthDates.map((date) => {
          const dayCalicatas = calicataIndex.byDay.get(irrigationCalicataDayKey(calicataKey, date)) || [];
          const value = type === "depth" ? calicataDepthCell(dayCalicatas, field) : calicataTextCell(dayCalicatas, field);
          return `<span class="calicata-detail-cell ${dayClassMap.get(date) || ""} ${value ? "has-calicata" : ""}" title="${htmlAttr(value || "")}">${escapeHtml(value)}</span>`;
        }).join("")}
      </div>
      <div class="irrigation-total calicata-label"></div>
      <div class="irrigation-reposition calicata-label"></div>
      <div class="irrigation-difference irrigation-difference-hours calicata-label"></div>
      <div class="irrigation-difference irrigation-difference-reposition calicata-label"></div>
    </div>
  `).join("");
}

function calicataMonthMatches(item, monthPrefix) {
  return !monthPrefix || calicataDate(item).slice(0, 7) === monthPrefix;
}

function irrigationCalicataOptions(blocks) {
  const seen = new Map();
  blocks.forEach((block) => {
    const key = calicataBlockKey(block.potrero, block.block);
    if (!seen.has(key)) seen.set(key, { key, label: `${potreroLabel(block.potrero)} / bloque ${block.block || "-"}` });
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
  ].map(([depth, value]) => `${depth}: ${calicataDepthLabel(value)}`).join(" / ");
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

function irrigationMonthTotals(source, blocks, monthPrefix, daysInMonth) {
  const blockIds = new Set((blocks || []).map((block) => block.id));
  const prefix = `${monthPrefix}-`;
  const totals = new Map([...blockIds].map((blockId) => [blockId, 0]));
  Object.entries(source || {}).forEach(([key, value]) => {
    const separator = key.indexOf("__");
    if (separator < 0) return;
    const blockId = key.slice(0, separator);
    const date = key.slice(separator + 2);
    if (!blockIds.has(blockId) || !date.startsWith(prefix)) return;
    const day = Number(date.slice(8, 10));
    if (!Number.isInteger(day) || day < 1 || day > daysInMonth) return;
    totals.set(blockId, (totals.get(blockId) || 0) + (Number(value) || 0));
  });
  return totals;
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

function irrigationBalanceAnnualBlockRows(blocks, year) {
  const selectedYear = Number(year);
  if (!Number.isFinite(selectedYear)) return [];
  return blocks.map((block) => {
    const totals = Array.from({ length: 12 }, (_, index) => {
      const month = String(index + 1).padStart(2, "0");
      const daysInMonth = new Date(selectedYear, index + 1, 0).getDate();
      return irrigationMonthDates(`${selectedYear}-${month}`, daysInMonth);
    }).flat().reduce((acc, date) => {
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
  if (targetBlocks.some((block) => irrigationBaseHours(block, hoursPerEvent) <= 0)) {
    showToast("Ingresa horas por riego o define horas base para todos los bloques");
    return;
  }
  const plans = targetBlocks.map((block) => automaticIrrigationBlockPlan({
    block,
    daysInMonth,
    historicalMap: historicalEvaporationMap,
    historicalTotal: historicalEvaporationTotal,
    hoursPerEvent: irrigationBaseHours(block, hoursPerEvent),
    targetRepos,
    skipDays,
    startDay
  }));
  plans.forEach((plan) => {
    if (plan.error) return;
    const block = plan.block;
    const blockHours = irrigationBaseHours(block, hoursPerEvent);
    for (let index = 1; index <= daysInMonth; index += 1) {
      const date = `${monthPrefix}-${String(index).padStart(2, "0")}`;
      const key = irrigationKey(block.id, date);
      if (plan.days.includes(index)) {
        irrigationProgramHours[key] = blockHours;
        setIrrigationCellAudit("program", block.id, date);
        scheduleIrrigationProgramCellSave(block.id, date, blockHours);
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

function irrigationProgramHistoricalTotal(month, daysInMonth) {
  const historicalMap = historicalEvaporationByMonthDay(month);
  const total = Array.from({ length: daysInMonth }, (_, index) => {
    const day = String(index + 1).padStart(2, "0");
    return Number(historicalMap.get(day)) || 0;
  }).reduce((sum, value) => sum + value, 0);
  return { historicalMap, total };
}

function writeIrrigationProgramPlanForMonth({ block, daysInMonth, monthPrefix, hoursPerEvent, plan }) {
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
}

function setAnnualProgramLoading(active, message = "Creando programa anual...") {
  const dialog = document.getElementById("irrigationProgramDialog");
  const overlay = document.getElementById("programAnnualLoading");
  if (overlay) {
    overlay.hidden = !active;
    const label = overlay.querySelector("strong");
    if (label) label.textContent = message;
  }
  dialog?.querySelectorAll("button, input, select").forEach((element) => {
    if (active) {
      if (element.dataset.wasDisabled === undefined) element.dataset.wasDisabled = element.disabled ? "true" : "false";
      element.disabled = true;
    } else if (element.dataset.wasDisabled !== "true") {
      element.disabled = false;
      delete element.dataset.wasDisabled;
    } else {
      delete element.dataset.wasDisabled;
    }
  });
}

async function applyAutomaticIrrigationProgramAnnual() {
  const year = String(document.getElementById("programAnnualYear")?.value || irrigationYear).trim();
  const hoursPerEvent = Number(document.getElementById("programAnnualHours")?.value);
  const startDay = Number(document.getElementById("programAnnualStartDay")?.value);
  const skipText = String(document.getElementById("programAnnualSkipDays")?.value || "").trim();
  const skipDays = skipText === "" ? NaN : Number(skipText);
  const months = [...document.querySelectorAll("[data-program-annual-month]:checked")].map((input) => input.dataset.programAnnualMonth);
  const blockRows = [...document.querySelectorAll("[data-program-annual-block]:checked")].map((input) => {
    const targetInput = document.querySelector(`[data-program-annual-repos="${CSS.escape(input.dataset.programAnnualBlock)}"]`);
    return {
      block: state.blocks.find((item) => item.id === input.dataset.programAnnualBlock),
      targetRepos: Number(targetInput?.value)
    };
  }).filter((row) => row.block);

  if (!/^\d{4}$/.test(year) || Number(year) < 1900 || Number(year) > 2100) {
    showToast("Ingresa un ano valido para el programa anual");
    return;
  }
  if (!Number.isInteger(startDay) || startDay < 1 || startDay > 31) {
    showToast("Ingresa un dia de inicio mensual valido");
    return;
  }
  if (!months.length) {
    showToast("Selecciona al menos un mes del programa anual");
    return;
  }
  if (!blockRows.length) {
    showToast("Selecciona al menos un bloque para el programa anual");
    return;
  }
  const invalidTargets = blockRows.filter((row) => !Number.isFinite(row.targetRepos) || row.targetRepos <= 0);
  if (invalidTargets.length) {
    showToast("Cada bloque seleccionado debe tener reposicion objetivo");
    return;
  }
  if (blockRows.some(({ block }) => irrigationBaseHours(block, hoursPerEvent) <= 0)) {
    showToast("Ingresa horas por riego o define horas base para todos los bloques seleccionados");
    return;
  }

  const cellEstimate = months.reduce((sum, month) => {
    const daysInMonth = new Date(Number(year), Number(month), 0).getDate();
    return sum + daysInMonth * blockRows.length;
  }, 0);
  if (!confirm(`Crear programa anual ${year} para ${blockRows.length} bloques y ${months.length} meses? Se reemplazaran ${cellEstimate} celdas del programa seleccionado.`)) return;

  const warnings = [];
  let plannedCells = 0;
  let processed = 0;
  const totalTasks = blockRows.length * months.length;
  setAnnualProgramLoading(true, `Preparando ${totalTasks} combinaciones...`);
  await new Promise((resolve) => requestAnimationFrame(resolve));

  try {
    for (const { block, targetRepos } of blockRows) {
      const blockHours = irrigationBaseHours(block, hoursPerEvent);
      for (const month of months) {
        processed += 1;
        if (processed === 1 || processed % 8 === 0 || processed === totalTasks) {
          setAnnualProgramLoading(true, `Procesando ${processed} de ${totalTasks}...`);
          await new Promise((resolve) => setTimeout(resolve, 0));
        }
        const daysInMonth = new Date(Number(year), Number(month), 0).getDate();
        const monthPrefix = `${year}-${month}`;
        const effectiveStartDay = Math.min(startDay, daysInMonth);
        const { historicalMap, total: historicalTotal } = irrigationProgramHistoricalTotal(month, daysInMonth);
        const plan = automaticIrrigationBlockPlan({
          block,
          daysInMonth,
          historicalMap,
          historicalTotal,
          hoursPerEvent: blockHours,
          targetRepos,
          skipDays,
          startDay: effectiveStartDay
        });
        if (plan.error || plan.warning) {
          const monthLabel = monthOptions().find((item) => item.value === month)?.label || month;
          warnings.push(`${potreroLabel(block.potrero)} bloque ${block.block || "-"} - ${monthLabel}: ${plan.error || plan.warning}`);
        }
        if (plan.error) continue;
        plannedCells += plan.days.length;
        writeIrrigationProgramPlanForMonth({ block, daysInMonth, monthPrefix, hoursPerEvent: blockHours, plan });
      }
    }

    setAnnualProgramLoading(true, "Guardando cambios locales y sincronizando...");
    await new Promise((resolve) => setTimeout(resolve, 0));
    saveIrrigationProgramHours();
    saveIrrigationProgramAudit();
    document.getElementById("irrigationProgramDialog")?.close();
    renderIrrigation();
    showToast(warnings.length ? `Programa anual creado con ${warnings.length} alertas` : `Programa anual creado con ${plannedCells} riegos`);
    if (warnings.length) setTimeout(() => window.alert(`Alertas del programa anual\n\n${warnings.slice(0, 18).join("\n\n")}${warnings.length > 18 ? `\n\n+${warnings.length - 18} alertas mas.` : ""}`), 0);
  } finally {
    setAnnualProgramLoading(false);
  }
}

function irrigationVisibleBlocksForProgramDialog() {
  return [...state.blocks]
    .filter((block) => block.active !== false)
    .filter((block) => irrigationSpeciesFilter === "Todas" || block.crop === irrigationSpeciesFilter)
    .filter((block) => irrigationVarietyFilter === "Todas" || (block.variety || "Sin variedad") === irrigationVarietyFilter)
    .sort(blockSort);
}

function irrigationProgramVarietyOptions(blocks) {
  return [...new Set(blocks.map((block) => block.variety || "Sin variedad"))]
    .sort((a, b) => a.localeCompare(b, "es", { numeric: true }))
    .map((variety) => `<option value="${htmlAttr(variety)}">${escapeHtml(variety)}</option>`)
    .join("");
}

function renderProgramDialogBlockOptions(blocks, selectedPotrero) {
  const filtered = blocks.filter((block) => block.potrero === selectedPotrero);
  return filtered.map((block) => `
    <label class="program-block-chip" title="${htmlAttr(`${potreroLabel(block.potrero)} bloque ${block.block}`)}">
      <input type="checkbox" data-program-auto-block="${htmlAttr(block.id)}" checked>
      <span>${escapeHtml(block.block || "-")}</span>
      <small>${number(block.hectares)} ha</small>
      <em>${escapeHtml(irrigationBaseHoursLabel(block))}</em>
    </label>
  `).join("") || `<span class="empty">Sin bloques para este potrero.</span>`;
}

function annualProgramBlocksForSelectedVariety() {
  const variety = document.getElementById("programAnnualVariety")?.value || "";
  return irrigationVisibleBlocksForProgramDialog().filter((block) => (block.variety || "Sin variedad") === variety);
}

function renderAnnualProgramMonthChecklist() {
  return monthOptions().map((month) => `
    <label class="program-annual-month">
      <input type="checkbox" data-program-annual-month="${month.value}" checked>
      <span>${month.label.slice(0, 3)}</span>
    </label>
  `).join("");
}

function renderAnnualProgramBlockRows(blocks) {
  return blocks.map((block) => `
    <label class="program-annual-block-row">
      <input type="checkbox" data-program-annual-block="${htmlAttr(block.id)}" checked>
      <span class="program-annual-block-main">
        <strong>${escapeHtml(potreroLabel(block.potrero))} / Bloque ${escapeHtml(block.block || "-")}</strong>
        <small>${escapeHtml(block.crop || "-")} · ${escapeHtml(block.variety || "Sin variedad")} · ${number(block.hectares)} ha · ${escapeHtml(irrigationBaseHoursLabel(block))}</small>
      </span>
      <span class="program-annual-block-meta">Precip. ${number(block.precipitation || 0, 1)}</span>
      <input type="number" min="0" step="1" inputmode="decimal" value="100" data-program-annual-repos="${htmlAttr(block.id)}" aria-label="Reposicion objetivo bloque ${htmlAttr(block.block || "")}">
    </label>
  `).join("") || `<div class="empty">No hay bloques para esta variedad.</div>`;
}

function updateAnnualProgramDialogBlocks() {
  const container = document.getElementById("programAnnualBlocks");
  if (!container) return;
  container.innerHTML = renderAnnualProgramBlockRows(annualProgramBlocksForSelectedVariety());
  updateAnnualProgramDialogPreview();
}

function fillAnnualProgramReposition() {
  const value = Number(document.getElementById("programAnnualBulkRepos")?.value);
  if (!Number.isFinite(value) || value <= 0) {
    showToast("Ingresa una reposicion valida para copiar");
    return;
  }
  document.querySelectorAll("[data-program-annual-repos]").forEach((input) => {
    input.value = String(value);
  });
  updateAnnualProgramDialogPreview();
}

function updateAnnualProgramDialogPreview() {
  const preview = document.getElementById("programAnnualPreview");
  if (!preview) return;
  const year = String(document.getElementById("programAnnualYear")?.value || irrigationYear).trim();
  const hours = Number(document.getElementById("programAnnualHours")?.value);
  const startDay = Number(document.getElementById("programAnnualStartDay")?.value);
  const skipText = String(document.getElementById("programAnnualSkipDays")?.value || "").trim();
  const skipDays = skipText === "" ? NaN : Number(skipText);
  const months = [...document.querySelectorAll("[data-program-annual-month]:checked")].map((input) => input.dataset.programAnnualMonth);
  const blocks = [...document.querySelectorAll("[data-program-annual-block]:checked")]
    .map((input) => state.blocks.find((block) => block.id === input.dataset.programAnnualBlock))
    .filter(Boolean);
  const sampleMonth = months[0];
  if (!/^\d{4}$/.test(year) || Number(year) < 1900 || Number(year) > 2100 || !Number.isInteger(startDay) || !months.length || !blocks.length || blocks.some((block) => irrigationBaseHours(block, hours) <= 0)) {
    preview.innerHTML = `<span>Selecciona variedad, meses, bloques y reposicion para previsualizar el programa anual.</span>`;
    return;
  }
  const daysInMonth = new Date(Number(year), Number(sampleMonth), 0).getDate();
  const { historicalMap, total: historicalTotal } = irrigationProgramHistoricalTotal(sampleMonth, daysInMonth);
  const rows = blocks.slice(0, 4).map((block) => {
    const targetRepos = Number(document.querySelector(`[data-program-annual-repos="${CSS.escape(block.id)}"]`)?.value);
    const blockHours = irrigationBaseHours(block, hours);
    if (!Number.isFinite(targetRepos) || targetRepos <= 0) return `<span class="is-warning">${escapeHtml(potreroLabel(block.potrero))} bloque ${escapeHtml(block.block || "-")}: falta reposicion.</span>`;
    const plan = automaticIrrigationBlockPlan({
      block,
      daysInMonth,
      historicalMap,
      historicalTotal,
      hoursPerEvent: blockHours,
      targetRepos,
      skipDays,
      startDay: Math.min(startDay, daysInMonth)
    });
    if (plan.error) return `<span class="is-warning">${escapeHtml(potreroLabel(block.potrero))} bloque ${escapeHtml(block.block || "-")}: ${escapeHtml(plan.error)}</span>`;
    return `<span class="${plan.warning ? "is-warning" : ""}"><strong>${escapeHtml(potreroLabel(block.potrero))} / ${escapeHtml(block.block || "-")}</strong> · ${number(blockHours, 1)} h/riego · ${year} · ${months.length} meses · muestra ${sampleMonth}: dias ${plan.days.join(", ")} · ${number(plan.achievedRepos, 1)}%</span>`;
  });
  const extra = blocks.length > 4 ? `<span>+${blocks.length - 4} bloques mas.</span>` : "";
  preview.innerHTML = `${rows.join("")}${extra}`;
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
  const selectedVariety = [...new Set(blocks.map((block) => block.variety || "Sin variedad"))]
    .sort((a, b) => a.localeCompare(b, "es", { numeric: true }))[0] || "";
  const annualBlocks = blocks.filter((block) => (block.variety || "Sin variedad") === selectedVariety);
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
        <span>Si un bloque tiene horas base, el programa usa esas horas. El campo horas respaldo solo se usa en bloques sin horas base.</span>
      </div>
      <div class="irrigation-program-tool-controls">
        <label>Potrero
          <select id="programAutoPotrero">
            ${potreros.map((potrero) => `<option value="${htmlAttr(potrero)}" ${potrero === selectedPotrero ? "selected" : ""}>${escapeHtml(potreroLabel(potrero))}</option>`).join("")}
          </select>
        </label>
        <label>Fecha de inicio
          <input id="programAutoStartDate" type="date" min="${firstDate}" max="${lastDate}" value="${firstDate}">
        </label>
        <label>Horas respaldo
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
      <section class="program-annual-section">
        <div class="program-annual-head">
          <div>
            <strong>Programa anual</strong>
            <span>Usa horas base por bloque, meses por checklist y reposicion individual.</span>
          </div>
          <span>Plan anual</span>
        </div>
        <div class="irrigation-program-tool-controls program-annual-controls">
          <label>Variedad
            <select id="programAnnualVariety">
              ${irrigationProgramVarietyOptions(blocks)}
            </select>
          </label>
          <label>Ano programa
            <input id="programAnnualYear" type="number" min="1900" max="2100" step="1" inputmode="numeric" value="${htmlAttr(irrigationYear)}">
          </label>
          <label>Horas respaldo
            <input id="programAnnualHours" type="number" min="0" step="0.5" inputmode="decimal" value="5">
          </label>
          <label>Dia inicio mensual
            <input id="programAnnualStartDay" type="number" min="1" max="31" step="1" inputmode="numeric" value="1">
          </label>
          <label>Dias a saltar
            <input id="programAnnualSkipDays" type="number" min="0" step="1" inputmode="numeric" placeholder="Auto">
          </label>
        </div>
        <div class="program-annual-months" aria-label="Meses del programa anual">
          ${renderAnnualProgramMonthChecklist()}
        </div>
        <div class="program-annual-bulk">
          <label>Reposicion para copiar
            <input id="programAnnualBulkRepos" type="number" min="0" step="1" inputmode="decimal" value="100">
          </label>
          <button class="secondary-button" type="button" data-action="fill-program-annual-reposition">Copiar a bloques</button>
        </div>
        <div id="programAnnualBlocks" class="program-annual-blocks">
          ${renderAnnualProgramBlockRows(annualBlocks)}
        </div>
        <div id="programAnnualPreview" class="program-auto-preview program-annual-preview">
          <span>Selecciona variedad, meses, bloques y reposicion para previsualizar el programa anual.</span>
        </div>
        <div id="programAnnualLoading" class="program-annual-loading" hidden>
          <span class="program-annual-spinner"></span>
          <strong>Creando programa anual...</strong>
          <small>Esto puede tardar unos segundos si hay muchos bloques y meses.</small>
        </div>
      </section>
      <div class="dialog-actions">
        <button class="secondary-button" type="button" data-action="close-dialog">Cancelar</button>
        <button class="secondary-button" type="button" data-action="apply-irrigation-program-annual">Aplicar anual</button>
        <button class="primary-button" type="button" data-action="apply-irrigation-program-auto">Aplicar programa</button>
      </div>
    </form>
  `;
  dialog.showModal();
  updateIrrigationProgramDialogPreview();
  updateAnnualProgramDialogPreview();
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
  if (!Number.isFinite(targetRepos) || targetRepos <= 0 || !blocks.length || historicalTotal <= 0 || !startDate.startsWith(`${monthPrefix}-`) || !Number.isInteger(startDay) || blocks.some((block) => irrigationBaseHours(block, hours) <= 0)) {
    preview.innerHTML = `<span>Completa horas, reposicion y bloques para ver la distribucion.</span>`;
    return;
  }
  const rows = blocks.slice(0, 4).map((block) => {
    const blockHours = irrigationBaseHours(block, hours);
    const plan = automaticIrrigationBlockPlan({
      block,
      daysInMonth,
      historicalMap,
      historicalTotal,
      hoursPerEvent: blockHours,
      targetRepos,
      skipDays,
      startDay
    });
    if (plan.error) return `<span class="is-warning">Bloque ${escapeHtml(block.block || "-")}: ${escapeHtml(plan.error)}</span>`;
    return `<span class="${plan.warning ? "is-warning" : ""}"><strong>Bloque ${escapeHtml(block.block || "-")}</strong> · ${number(blockHours, 1)} h/riego · dias ${plan.days.join(", ") || "-"} · repos. ${number(plan.achievedRepos, 1)}%${plan.adjustedEvents ? ` · ${plan.adjustedEvents} ajuste${plan.adjustedEvents === 1 ? "" : "s"} por evaporacion` : ""}</span>`;
  });
  const extra = blocks.length > 4 ? `<span>+${blocks.length - 4} bloques mas con el mismo criterio</span>` : "";
  preview.innerHTML = `${rows.join("")}${extra}`;
}

function irrigationBaseHoursVisibleBlocks() {
  return [...state.blocks]
    .filter((block) => block.active !== false)
    .filter((block) => irrigationSpeciesFilter === "Todas" || block.crop === irrigationSpeciesFilter)
    .filter((block) => irrigationVarietyFilter === "Todas" || (block.variety || "Sin variedad") === irrigationVarietyFilter)
    .filter((block) => irrigationPotreroFilter === "Todos" || block.potrero === irrigationPotreroFilter)
    .sort(blockSort);
}

function openIrrigationBaseHoursDialog() {
  const dialog = document.getElementById("irrigationBaseHoursDialog");
  if (!dialog) return;
  const blocks = irrigationBaseHoursVisibleBlocks();
  dialog.innerHTML = `
    <form method="dialog" class="dialog-card irrigation-base-hours-dialog">
      <div class="dialog-header">
        <div>
          <h3>Horas base de riego</h3>
          <p>Dato maestro por potrero y bloque. Se guarda en public.campos.</p>
        </div>
        <button class="icon-button" type="button" data-action="close-dialog">x</button>
      </div>
      <div class="program-dialog-summary">
        <span>Estas horas se usan como prioridad al crear programas. El campo Horas por riego queda como respaldo para bloques sin horas base.</span>
      </div>
      <div class="irrigation-base-hours-list">
        ${blocks.map((block) => `
          <label class="irrigation-base-hours-row">
            <span>
              <strong>Potrero ${escapeHtml(potreroLabel(block.potrero))} / Bloque ${escapeHtml(block.block || "-")}</strong>
              <small>${escapeHtml(block.crop || "-")} · ${escapeHtml(block.variety || "Sin variedad")} · ${number(block.hectares)} ha · ${irrigationBaseHoursLabel(block)}</small>
            </span>
            <input type="number" min="0" step="0.5" inputmode="decimal" value="${Number(block.baseHours) > 0 ? htmlAttr(String(Number(block.baseHours))) : ""}" placeholder="Ej. 3" data-base-hours-block="${htmlAttr(block.id)}">
          </label>
        `).join("") || `<div class="empty">No hay bloques para los filtros actuales.</div>`}
      </div>
      <div class="dialog-actions">
        <button class="secondary-button" type="button" data-action="close-dialog">Cancelar</button>
        <button class="primary-button" type="button" data-action="save-irrigation-base-hours" ${blocks.length ? "" : "disabled"}>Guardar horas base</button>
      </div>
    </form>
  `;
  dialog.showModal();
}

async function saveIrrigationBaseHours() {
  if (!supabaseSession) {
    showToast("No se guardaron horas base: no hay sesion activa");
    return;
  }
  const rows = [...document.querySelectorAll("[data-base-hours-block]")].map((input) => ({
    blockId: input.dataset.baseHoursBlock,
    value: String(input.value || "").trim()
  }));
  const updates = rows.map((row) => {
    const block = state.blocks.find((item) => item.id === row.blockId);
    const value = row.value === "" ? null : Number(row.value.replace(",", "."));
    return { block, value };
  }).filter((row) => row.block);
  const invalid = updates.find((row) => row.value !== null && (!Number.isFinite(row.value) || row.value < 0));
  if (invalid) {
    showToast("Revisa las horas base: deben ser numeros positivos o vacio");
    return;
  }
  const button = document.querySelector('[data-action="save-irrigation-base-hours"]');
  if (button) {
    button.disabled = true;
    button.textContent = "Guardando...";
  }
  try {
    for (const { block, value } of updates) {
      await sbFetch(`/rest/v1/campos?id=eq.${encodeURIComponent(block.id)}`, {
        method: "PATCH",
        prefer: "return=minimal",
        body: JSON.stringify({ horas_riego_base: value })
      });
      block.baseHours = value;
    }
    document.getElementById("irrigationBaseHoursDialog")?.close();
    renderIrrigation();
    showToast("Horas base guardadas en campos");
  } catch (error) {
    showToast(`No se guardaron horas base: ${error.message}. Ejecuta supabase_campos_horas_riego_base.sql si falta la columna.`);
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = "Guardar horas base";
    }
  }
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

function irrigationBandejaYear(value) {
  const year = Number(String(value || "").slice(0, 4));
  return Number.isInteger(year) ? year : null;
}

function irrigationBandejaDataYears() {
  return [...new Set([
    ...(state.irrigationEvaporation || []).map((item) => item.date),
    ...(state.weatherStationDaily || []).map((item) => item.date)
  ]
    .map((date) => irrigationBandejaYear(date))
    .filter((year) => Number.isInteger(year) && year >= 1900 && year <= 2100))]
    .sort((a, b) => a - b);
}

function irrigationBandejaVisibleYears(focusYear) {
  const dataYears = irrigationBandejaDataYears();
  const focus = Math.min(2100, Math.max(1900, Number(focusYear) || new Date().getFullYear()));
  if (!dataYears.length) return [focus - 1, focus, focus + 1].filter((year) => year >= 1900 && year <= 2100);
  let first = Math.min(dataYears[0], focus - 1);
  let last = Math.max(dataYears.at(-1), focus + 1);
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

function irrigationBandejaMonthMatrix(month, years, evaporationMap, rainMap) {
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
  const rainTotals = new Map(years.map((year) => [year, 0]));
  const rows = Array.from({ length: maxDays }, (_, index) => {
    const day = index + 1;
    const dayText = String(day).padStart(2, "0");
    const historical = historicalDays.get(dayText);
    const yearCells = years.map((year) => {
      const validDay = day <= new Date(year, Number(month), 0).getDate();
      if (!validDay) {
        return `<td class="bandeja-date is-unavailable">-</td><td class="bandeja-value is-unavailable">-</td><td class="bandeja-accum is-unavailable">-</td><td class="bandeja-rain is-unavailable">-</td>`;
      }
      const date = `${year}-${month}-${dayText}`;
      const rawValue = evaporationMap.get(date)?.evaporation;
      const hasValue = rawValue !== null && rawValue !== undefined && Number.isFinite(Number(rawValue));
      const rawRain = rainMap.get(date);
      const hasRain = rawRain !== null && rawRain !== undefined && Number.isFinite(Number(rawRain)) && Number(rawRain) > 0;
      if (hasValue) {
        accumulators.set(year, accumulators.get(year) + Number(rawValue));
        totals.set(year, totals.get(year) + Number(rawValue));
        counts.set(year, counts.get(year) + 1);
        hasStarted.add(year);
      }
      if (hasRain) {
        rainTotals.set(year, rainTotals.get(year) + Number(rawRain));
      }
      const focusClass = String(year) === String(irrigationYear) ? " is-focus-year" : "";
      const carriedClass = !hasValue && hasStarted.has(year) ? " is-carried" : "";
      return `
        <td class="bandeja-date${focusClass}">${dayText}-${month}-${String(year).slice(-2)}</td>
        <td class="bandeja-value${focusClass} ${hasValue ? "has-value" : ""}">${hasValue ? irrigationBandejaLabel(rawValue) : "-"}</td>
        <td class="bandeja-accum${focusClass}${carriedClass}">${hasStarted.has(year) ? irrigationBandejaLabel(accumulators.get(year)) : "-"}</td>
        <td class="bandeja-rain${focusClass} ${hasRain ? "has-rain" : ""}" title="${date} lluvia ${hasRain ? irrigationBandejaLabel(rawRain) : "0"} mm">${hasRain ? irrigationBandejaLabel(rawRain) : "-"}</td>
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
    return `<td class="bandeja-date${focusClass}">Total mes</td><td class="bandeja-value${focusClass}" title="Promedio de ${count} dia${count === 1 ? "" : "s"}">${count ? irrigationBandejaLabel(average) : "-"}</td><td class="bandeja-accum${focusClass}">${count ? irrigationBandejaLabel(total) : "-"}</td><td class="bandeja-rain${focusClass}" title="Lluvia acumulada del mes">${irrigationBandejaLabel(rainTotals.get(year))}</td>`;
  }).join("");
  return `
    <section class="irrigation-bandeja-month" data-bandeja-month="${month}">
      <table class="irrigation-bandeja-matrix-table" style="--bandeja-years:${years.length}">
        <colgroup>
          <col class="bandeja-col-day">
          ${years.map(() => '<col class="bandeja-col-date"><col class="bandeja-col-value"><col class="bandeja-col-accum"><col class="bandeja-col-rain">').join("")}
          <col class="bandeja-col-historical">
        </colgroup>
        <thead>
          <tr class="bandeja-month-heading">
            <th class="bandeja-month-fixed" colspan="5"><div><strong>${monthName}</strong><span>Prom. hist. mes ${historicalMonth === null ? "-" : irrigationBandejaLabel(historicalMonth)}</span></div></th>
            <th class="bandeja-month-fill" colspan="${Math.max(1, years.length * 4 - 3)}" aria-hidden="true"></th>
          </tr>
          <tr class="bandeja-year-heading">
            <th rowspan="2" class="bandeja-day">Dia</th>
            ${years.map((year) => `<th colspan="4" data-bandeja-year="${year}" class="${String(year) === String(irrigationYear) ? "is-focus-year" : ""}">${year}</th>`).join("")}
            <th rowspan="2" class="bandeja-historical">Prom. hist.<small>por dia</small></th>
          </tr>
          <tr class="bandeja-fields-heading">
            ${years.map((year) => {
              const focusClass = String(year) === String(irrigationYear) ? " class=\"is-focus-year\"" : "";
              return `<th${focusClass}>Fecha</th><th${focusClass}>Evap.</th><th${focusClass}>Acum.</th><th${focusClass}>Lluvia</th>`;
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
  const rainMap = weatherRainByDateMap();
  const dates = [...new Set([...evaporationMap.keys(), ...rainMap.keys()])].sort();
  const rainDates = [...rainMap.entries()]
    .filter(([, value]) => Number(value) > 0)
    .map(([date]) => date)
    .sort();
  const rangeLabel = dates.length ? `${dates[0]} a ${dates.at(-1)}` : "Sin registros";
  return `
    <div class="irrigation-subpanel irrigation-bandeja-history-panel">
      <section class="panel irrigation-bandeja-entry-panel">
        <div class="irrigation-bandeja-entry-row">
          <div>
            <strong>Datos diarios</strong>
            <span>Bandeja y lluvia se registran por fecha.</span>
          </div>
          <button class="primary-button" type="button" data-action="open-irrigation-bandeja-dialog">Agregar dato</button>
        </div>
      </section>
      <div class="irrigation-bandeja-summary">
        <span><strong>${number(evaporationMap.size, 0)}</strong> dias registrados</span>
        <span><strong>${number(rainDates.length, 0)}</strong> dias con lluvia</span>
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
            ${monthOptions().map((item) => irrigationBandejaMonthMatrix(item.value, years, evaporationMap, rainMap)).join("")}
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
  const left = yearHeader ? Math.max(0, yearHeader.offsetLeft - 64) : scroller.scrollLeft;
  const top = monthSection ? Math.max(0, monthSection.offsetTop - 4) : scroller.scrollTop;
  scroller.scrollTo({ left, top, behavior });
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
          <button class="irrigation-balance-potrero-bar ${active ? "active" : ""}" type="button" data-action="select-irrigation-balance-potrero" data-potrero="${htmlAttr(row.potrero)}" title="${htmlAttr(`${potreroLabel(row.potrero)}: real ${irrigationVolumeLabel(row.realVolume)} / programa ${irrigationVolumeLabel(row.programVolume)}. Ctrl+clic permite seleccionar varios.`)}">
            <div>
              <i class="program" style="height:${programHeight}%"><em>${number(row.programVolume, 0)}</em></i>
              <i class="real" style="height:${realHeight}%"><em>${number(row.realVolume, 0)}</em></i>
            </div>
            <strong>${escapeHtml(potreroLabel(row.potrero))}</strong>
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
              <strong>${escapeHtml(potreroLabel(row.block.potrero))} / Bloque ${escapeHtml(row.block.block || "-")}</strong>
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

function irrigationBalanceAnnualPotreroChart(rows, selectedPotreros) {
  const max = Math.max(...rows.flatMap((row) => [row.programVolume, row.realVolume]), 1);
  return `
    <div class="irrigation-annual-balance-chart" aria-label="Resumen anual de volumen real contra programa por potrero">
      ${rows.map((row) => {
        const active = selectedPotreros.has(row.potrero);
        const programWidth = Math.max(2, row.programVolume / max * 100);
        const realWidth = Math.max(2, row.realVolume / max * 100);
        return `
          <button class="irrigation-annual-potrero-row ${active ? "active" : ""}" type="button" data-action="select-irrigation-balance-potrero" data-potrero="${htmlAttr(row.potrero)}" title="${htmlAttr(`${potreroLabel(row.potrero)}: real ${irrigationVolumeLabel(row.realVolume)} / programa ${irrigationVolumeLabel(row.programVolume)}. Ctrl+clic permite seleccionar varios.`)}">
            <div class="irrigation-annual-potrero-name">
              <strong>${escapeHtml(potreroLabel(row.potrero))}</strong>
              <span>${row.blocks} bloque${row.blocks === 1 ? "" : "s"} - ${irrigationDifferenceLabel(row.differencePercent)}</span>
            </div>
            <div class="irrigation-annual-bars">
              <span>
                <em>Programa</em>
                <i class="program" style="width:${programWidth}%"></i>
                <b>${irrigationVolumeLabel(row.programVolume)}</b>
              </span>
              <span>
                <em>Real</em>
                <i class="real" style="width:${realWidth}%"></i>
                <b>${irrigationVolumeLabel(row.realVolume)}</b>
              </span>
            </div>
          </button>
        `;
      }).join("") || `<div class="empty">Sin datos anuales para el filtro seleccionado.</div>`}
    </div>
    <div class="irrigation-chart-legend">
      <span><i class="program"></i> Programa anual</span>
      <span><i class="real"></i> Real anual</span>
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
            <strong>${escapeHtml(potreroLabel(row.block.potrero))} / ${escapeHtml(row.block.block || "-")}</strong>
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
  const annualBlockRows = irrigationBalanceAnnualBlockRows(blockRows.map((row) => row.block), year);
  const annualPotreroRows = irrigationBalancePotreroRows(annualBlockRows);
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
  const annualTotals = annualBlockRows.reduce((acc, row) => {
    acc.programVolume += row.programVolume;
    acc.realVolume += row.realVolume;
    acc.programHours += row.programHours;
    acc.realHours += row.realHours;
    return acc;
  }, { programVolume: 0, realVolume: 0, programHours: 0, realHours: 0 });
  annualTotals.difference = annualTotals.realVolume - annualTotals.programVolume;
  annualTotals.differencePercent = irrigationDifferencePercent(annualTotals.realVolume, annualTotals.programVolume);
  return `
    <div class="irrigation-subpanel">
      <div class="irrigation-balance-toolbar">
        <div>
          <strong>Balance hidrico</strong>
          <span>${monthLabel} ${year}</span>
        </div>
        <label>Potrero detalle
          <select id="irrigationBalancePotreroFilter">
            ${potreroOptions.map((item) => `<option value="${htmlAttr(item)}" ${item === irrigationBalancePotreroFilter ? "selected" : ""}>${escapeHtml(potreroLabel(item))}</option>`).join("")}
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
      <section class="panel chart-panel irrigation-annual-balance-panel">
        <div class="panel-header">
          <div>
            <h2>Resumen anual por potrero</h2>
            <p>${year} - programa ${irrigationVolumeLabel(annualTotals.programVolume)} - real ${irrigationVolumeLabel(annualTotals.realVolume)} - diferencia ${irrigationDifferenceLabel(annualTotals.differencePercent)}</p>
          </div>
        </div>
        ${irrigationBalanceAnnualPotreroChart(annualPotreroRows, selectedPotreros)}
      </section>
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

function irrigationSatelliteDateValue(date) {
  const safeDate = date instanceof Date && !Number.isNaN(date.getTime()) ? date : new Date();
  return [
    safeDate.getFullYear(),
    String(safeDate.getMonth() + 1).padStart(2, "0"),
    String(safeDate.getDate()).padStart(2, "0")
  ].join("-");
}

function ensureIrrigationSatelliteRange(monthPrefix) {
  if (irrigationSatelliteDateFrom && irrigationSatelliteDateTo) return;
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 60);
  irrigationSatelliteDateFrom = irrigationSatelliteDateValue(start);
  irrigationSatelliteDateTo = irrigationSatelliteDateValue(end);
}

function irrigationSatelliteQueryKey(blocks) {
  const blockKey = blocks
    .map((block) => fieldIdentityKey(block.potrero, block.block))
    .sort()
    .join("|");
  return [
    irrigationSatelliteDateFrom,
    irrigationSatelliteDateTo,
    irrigationSatelliteCloudMax,
    irrigationSatelliteLimit,
    blockKey
  ].join("::");
}

function irrigationSatelliteTileQueryKey() {
  return [
    "aoi-mask-v2",
    irrigationSatelliteProcessingStatus.providerType,
    irrigationPlanetMosaic,
    irrigationSatelliteIndex,
    irrigationSatelliteLayerStyle,
    irrigationSatelliteLayerStrength,
    irrigationSatellitePaintedLayer ? "painted" : "raw",
    irrigationSatelliteTileRevision,
    irrigationSatelliteDateFrom,
    irrigationSatelliteDateTo,
    irrigationSatelliteCloudMax
  ].join("::");
}

function irrigationSatelliteIndexDefinition(index = irrigationSatelliteIndex) {
  return IRRIGATION_SATELLITE_INDEX_DEFINITIONS[index] || IRRIGATION_SATELLITE_INDEX_DEFINITIONS.NDVI;
}

function irrigationSatelliteMapTypeOptions() {
  return Object.values(IRRIGATION_SATELLITE_INDEX_DEFINITIONS)
    .map((item) => `<option value="${htmlAttr(item.name)}" ${item.name === irrigationSatelliteIndex ? "selected" : ""}>${escapeHtml(`${item.name} - ${item.use}`)}</option>`)
    .join("");
}

function irrigationSatelliteLayerStyleOptions() {
  return Object.entries(IRRIGATION_SATELLITE_LAYER_STYLES)
    .map(([key, item]) => `<option value="${htmlAttr(key)}" ${key === irrigationSatelliteLayerStyle ? "selected" : ""}>${escapeHtml(`${item.name} - ${item.use}`)}</option>`)
    .join("");
}

function irrigationSatelliteLayerStrengthOptions() {
  return Object.entries(IRRIGATION_SATELLITE_LAYER_STRENGTHS)
    .map(([key, item]) => `<option value="${htmlAttr(key)}" ${key === irrigationSatelliteLayerStrength ? "selected" : ""}>${escapeHtml(`${item.name} - ${item.layers} capa${item.layers === 1 ? "" : "s"}`)}</option>`)
    .join("");
}

function irrigationSatelliteProviderLabel() {
  const providerType = irrigationSatelliteProcessingStatus.providerType;
  if (providerType === "planet") return "Planet";
  if (providerType === "sentinel") return "Sentinel Hub";
  return "Sin proveedor";
}

function irrigationSatelliteProviderSummary() {
  const providerType = irrigationSatelliteProcessingStatus.providerType;
  if (providerType === "planet") return "Mosaics Surface Reflectance";
  if (providerType === "sentinel") return "Sentinel-2 L2A Process API";
  return "Configurar credenciales";
}

function irrigationPlanetMosaicLabel(mosaic) {
  const name = String(mosaic?.name || mosaic?.id || "");
  const label = String(mosaic?.title || name);
  const date = String(mosaic?.lastAcquired || mosaic?.firstAcquired || mosaic?.intervalEnd || "").slice(0, 10);
  return date ? `${label} - ${date}` : label;
}

function irrigationPlanetMosaicQueryKey() {
  return [
    irrigationSatelliteDateFrom,
    irrigationSatelliteDateTo
  ].join("::");
}

function irrigationSatelliteProcessingWarning() {
  if (irrigationSatelliteProcessingStatus.checking) return "";
  if (!irrigationSatelliteProcessingStatus.configured) {
    const message = irrigationSatelliteProcessingStatus.message || "";
    if (/credencial|credential|token|invalid|401/i.test(message)) {
      return "No se pudo activar la capa satelital. Revisa las credenciales del proveedor en Netlify.";
    }
    return "";
  }
  if (irrigationSatelliteProcessingStatus.providerType === "sentinel") {
    const supportedIndexes = irrigationSatelliteProcessingStatus.supportedIndexes || [];
    if (supportedIndexes.length && !supportedIndexes.includes(irrigationSatelliteIndex)) {
      return `El proxy Sentinel activo no soporta ${escapeHtml(irrigationSatelliteIndex)}. Reinicia el servidor local o despliega la funcion actualizada.`;
    }
    if (!supportedIndexes.length && irrigationSatelliteIndex !== "NDVI") {
      return "El proxy Sentinel activo no informa version ni indices soportados. Puede estar usando una version antigua y devolver NDVI aunque selecciones otro mapa.";
    }
  }
  if (irrigationSatelliteProcessingStatus.providerType !== "planet") return "";
  const definition = irrigationSatelliteIndexDefinition();
  if (!definition.planetProc) {
    return `${escapeHtml(irrigationSatelliteIndex)} no esta disponible en Planet Mosaics. Usa NDVI, NDWI, MSAVI2, VARI, MTVI2 o TGI.`;
  }
  if (irrigationPlanetMosaicsLoading) return "";
  if (irrigationPlanetMosaicsError) return escapeHtml(irrigationPlanetMosaicsError);
  if (!irrigationPlanetMosaic) {
    return "Planet respondio, pero no hay mosaicos Surface Reflectance disponibles para este rango o para esta cuenta.";
  }
  return "";
}

function irrigationSatelliteRingsBbox(rings) {
  const points = rings.flat();
  if (!points.length) return null;
  const lngs = points.map((point) => Number(point[0])).filter(Number.isFinite);
  const lats = points.map((point) => Number(point[1])).filter(Number.isFinite);
  if (!lngs.length || !lats.length) return null;
  const minLng = Math.min(...lngs);
  const minLat = Math.min(...lats);
  const maxLng = Math.max(...lngs);
  const maxLat = Math.max(...lats);
  return {
    bbox: [minLng, minLat, maxLng, maxLat],
    center: { lng: (minLng + maxLng) / 2, lat: (minLat + maxLat) / 2 }
  };
}

function bboxesIntersect(a, b) {
  if (!a || !b) return true;
  return a[0] <= b[2] && a[2] >= b[0] && a[1] <= b[3] && a[3] >= b[1];
}

async function loadIrrigationSatelliteAoi() {
  if (irrigationSatelliteAoi) return irrigationSatelliteAoi;
  if (irrigationSatelliteAoiLoading) return irrigationSatelliteAoiLoading;
  irrigationSatelliteAoiLoading = fetch(IRRIGATION_SATELLITE_AOI_URL, { cache: "force-cache" })
    .then((response) => (response.ok ? response.json() : null))
    .then((geojson) => {
      const rings = geoFeaturesToRings(geojson?.features || []);
      const points = rings.flatMap((item) => item.rings.flat());
      const bounds = points.length ? geoBounds(points) : null;
      irrigationSatelliteAoi = geojson && bounds ? {
        geojson,
        rings,
        bbox: [bounds.minX, bounds.minY, bounds.maxX, bounds.maxY]
      } : null;
      return irrigationSatelliteAoi;
    })
    .catch(() => null)
    .finally(() => { irrigationSatelliteAoiLoading = null; });
  return irrigationSatelliteAoiLoading;
}

function tileToLonLatBbox(x, y, z) {
  const scale = 2 ** z;
  const lonLeft = x / scale * 360 - 180;
  const lonRight = (x + 1) / scale * 360 - 180;
  const latTop = Math.atan(Math.sinh(Math.PI * (1 - 2 * y / scale))) * 180 / Math.PI;
  const latBottom = Math.atan(Math.sinh(Math.PI * (1 - 2 * (y + 1) / scale))) * 180 / Math.PI;
  return [lonLeft, latBottom, lonRight, latTop];
}

function irrigationSatelliteTileOutsideAoi(x, y, z) {
  return Boolean(irrigationSatelliteAoi?.bbox && !bboxesIntersect(tileToLonLatBbox(x, y, z), irrigationSatelliteAoi.bbox));
}

function irrigationSatelliteGeoMeta(blocks, layers) {
  const visibleKeys = new Set(blocks.map((block) => fieldIdentityKey(block.potrero, block.block)));
  const blockRings = geoFeaturesToRings(layers?.bloques?.features || []);
  const potreroRings = geoFeaturesToRings(layers?.potreros?.features || []);
  const matchedBlocks = blockRings.filter((item) => {
    const field = geoJsonFeatureField(item.feature);
    return visibleKeys.has(fieldIdentityKey(field.potrero, field.block));
  });
  const matchedPotreros = potreroRings.filter((item) => {
    const potrero = potreroFeatureName(item.feature);
    return blocks.some((block) => normalizePotreroOrderName(block.potrero) === normalizePotreroOrderName(potrero));
  });
  const sourceRings = matchedBlocks.length ? matchedBlocks : matchedPotreros.length ? matchedPotreros : blockRings.length ? blockRings : potreroRings;
  const bbox = irrigationSatelliteRingsBbox(sourceRings.flatMap((item) => item.rings));
  if (bbox) {
    return {
      ...bbox,
      source: matchedBlocks.length ? `${matchedBlocks.length} bloques del GeoJSON` : matchedPotreros.length ? `${matchedPotreros.length} potreros del GeoJSON` : "GeoJSON completo",
      blocks: blocks.length
    };
  }
  const [minLng, minLat, maxLng, maxLat] = IRRIGATION_SATELLITE_DEFAULT_BBOX;
  return {
    bbox: IRRIGATION_SATELLITE_DEFAULT_BBOX,
    center: { lng: (minLng + maxLng) / 2, lat: (minLat + maxLat) / 2 },
    source: "Area Canelillo aproximada",
    blocks: blocks.length
  };
}

function irrigationSatelliteSceneDate(scene) {
  return String(scene?.properties?.datetime || scene?.properties?.created || "").slice(0, 10);
}

function irrigationSatelliteDateLabel(value) {
  const date = String(value || "").slice(0, 10);
  const [year, month, day] = date.split("-");
  if (!year || !month || !day) return "-";
  const monthLabel = monthOptions().find((item) => item.value === month)?.label || month;
  return `${Number(day)} ${monthLabel.slice(0, 3)} ${year}`;
}

function irrigationSatelliteCloud(scene) {
  const cloud = Number(scene?.properties?.["eo:cloud_cover"]);
  return Number.isFinite(cloud) ? cloud : null;
}

function irrigationSatelliteAsset(scene, key) {
  return scene?.assets?.[key]?.href || "";
}

function irrigationSatelliteAssetLinks(scene) {
  const links = [
    ["B04 rojo", "red"],
    ["B08 NIR", "nir"],
    ["B05 red edge", "rededge1"],
    ["B06 red edge", "rededge2"],
    ["B07 red edge", "rededge3"],
    ["B11 SWIR", "swir16"],
    ["B12 SWIR", "swir22"]
  ];
  return links
    .filter(([, key]) => irrigationSatelliteAsset(scene, key))
    .map(([label, key]) => `<a href="${htmlAttr(irrigationSatelliteAsset(scene, key))}" target="_blank" rel="noreferrer">${label}</a>`)
    .join("");
}

function irrigationSatelliteQuality(cloud) {
  if (cloud === null) return { label: "Sin nubosidad", className: "unknown", color: "#6b7280" };
  if (cloud <= 10) return { label: "Muy buena", className: "good", color: "#1f7a4d" };
  if (cloud <= 25) return { label: "Usable", className: "medium", color: "#d99a1c" };
  return { label: "Revisar nubes", className: "high", color: "#c44536" };
}

function irrigationSatelliteCopernicusUrl(meta, scene) {
  const date = irrigationSatelliteSceneDate(scene) || irrigationSatelliteDateTo;
  const params = new URLSearchParams({
    lat: String((meta?.center?.lat ?? -32.81).toFixed(5)),
    lng: String((meta?.center?.lng ?? -71.26).toFixed(5)),
    zoom: "14",
    fromTime: `${date}T00:00:00.000Z`,
    toTime: `${date}T23:59:59.999Z`
  });
  return `https://browser.dataspace.copernicus.eu/?${params.toString()}`;
}

function irrigationSatelliteIndexCards(scene = null) {
  const providerType = irrigationSatelliteProcessingStatus.providerType;
  return Object.values(IRRIGATION_SATELLITE_INDEX_DEFINITIONS).map((item) => {
    const supportedByProvider = providerType !== "planet" || Boolean(item.planetProc);
    const ready = providerType === "planet"
      ? supportedByProvider && Boolean(irrigationPlanetMosaic)
      : scene && item.bands.every((band) => irrigationSatelliteAsset(scene, band));
    const status = providerType === "planet" && !supportedByProvider
      ? "Requiere Sentinel"
      : ready ? "Listo para mapa" : scene ? "Faltan bandas" : "Esperando imagen";
    return `
    <button class="satellite-index-card ${ready ? "is-ready" : ""} ${supportedByProvider ? "" : "is-provider-disabled"} ${item.name === irrigationSatelliteIndex ? "is-selected" : ""}" type="button" data-action="select-satellite-index" data-index="${htmlAttr(item.name)}">
      <div class="satellite-index-card-head">
        <strong>${item.name}</strong>
        <span>${status}</span>
      </div>
      <code>${escapeHtml(item.formula)}</code>
      <span>${escapeHtml(item.use)}</span>
    </button>`;
  }).join("");
}

function irrigationSatellitePaletteColors(definition) {
  const paletteGroup = IRRIGATION_SATELLITE_PALETTES[definition.palette || "vegetation"] || IRRIGATION_SATELLITE_PALETTES.vegetation;
  const paletteKey = irrigationSatelliteLayerStyle === "native" ? "standard" : irrigationSatelliteLayerStyle;
  return paletteGroup[paletteKey] || paletteGroup.standard || paletteGroup.contrast || IRRIGATION_SATELLITE_PALETTES.vegetation.standard;
}

function irrigationSatelliteLegendColor(definition, rowIndex, rowCount) {
  const colors = irrigationSatellitePaletteColors(definition);
  if (!colors.length) return definition.legend?.[rowIndex]?.[0] || "#1f7a4d";
  if (rowCount <= 1) return colors[Math.floor(colors.length / 2)];
  const position = rowIndex / Math.max(1, rowCount - 1);
  const colorIndex = Math.round(position * (colors.length - 1));
  return colors[Math.max(0, Math.min(colors.length - 1, colorIndex))];
}

function irrigationSatelliteIndexLegend(index = irrigationSatelliteIndex) {
  const definition = irrigationSatelliteIndexDefinition(index);
  const style = IRRIGATION_SATELLITE_LAYER_STYLES[irrigationSatelliteLayerStyle] || IRRIGATION_SATELLITE_LAYER_STYLES.contrast;
  const legendRows = definition.legend || [];
  return `
    <div class="satellite-decision-legend">
      <strong>${escapeHtml(definition.name)} - ${escapeHtml(style.name)}</strong>
      <div>
        ${legendRows.map(([, label, range], index) => `
          <span><i style="background:${htmlAttr(irrigationSatelliteLegendColor(definition, index, legendRows.length))}"></i><b>${escapeHtml(label)}</b><em>${escapeHtml(range)}</em></span>
        `).join("")}
      </div>
    </div>
  `;
}

function irrigationSatelliteSceneCard(scene) {
  const cloud = irrigationSatelliteCloud(scene);
  const quality = irrigationSatelliteQuality(cloud);
  const date = irrigationSatelliteSceneDate(scene);
  const thumbnail = irrigationSatelliteAsset(scene, "thumbnail") || irrigationSatelliteAsset(scene, "overview");
  const selected = scene.id === irrigationSatelliteScenes[0]?.id;
  const vegetation = Number(scene.properties?.["s2:vegetation_percentage"]);
  const water = Number(scene.properties?.["s2:water_percentage"]);
  return `
    <article class="satellite-scene-card ${selected ? "selected" : ""}">
      ${thumbnail ? `<img src="${htmlAttr(thumbnail)}" alt="Vista previa satelital ${htmlAttr(date)}" loading="lazy">` : `<div class="satellite-scene-thumb">Sin vista previa</div>`}
      <div class="satellite-scene-body">
        <div class="satellite-scene-title">
          <strong>${escapeHtml(irrigationSatelliteDateLabel(date))}</strong>
          <span class="satellite-quality ${quality.className}">${quality.label}</span>
        </div>
        <div class="satellite-scene-meta">
          <span>Nubes ${cloud === null ? "-" : `${number(cloud, 1)}%`}</span>
          ${Number.isFinite(vegetation) ? `<span>Vegetacion tile ${number(vegetation, 1)}%</span>` : ""}
          ${Number.isFinite(water) ? `<span>Agua tile ${number(water, 1)}%</span>` : ""}
          <span>${escapeHtml(scene.properties?.platform || scene.collection || "Sentinel-2")}</span>
          <span>Tile ${escapeHtml(scene.properties?.["mgrs:utm_zone"] ? `${scene.properties["mgrs:utm_zone"]}${scene.properties["mgrs:latitude_band"] || ""}${scene.properties["mgrs:grid_square"] || ""}` : scene.id || "-")}</span>
        </div>
        <div class="satellite-band-links">${irrigationSatelliteAssetLinks(scene) || "<span>Bandas no disponibles</span>"}</div>
        <div class="satellite-scene-actions">
          <a class="secondary-button" href="${htmlAttr(irrigationSatelliteCopernicusUrl(irrigationSatelliteQueryMeta, scene))}" target="_blank" rel="noreferrer">Abrir mapa</a>
          <a class="ghost-button" href="${htmlAttr(scene.links?.find((link) => link.rel === "self")?.href || "#")}" target="_blank" rel="noreferrer">STAC</a>
        </div>
      </div>
    </article>
  `;
}

function renderIrrigationSatellitePanel({ filteredBlocks, monthPrefix, monthLabel, year }) {
  ensureIrrigationSatelliteRange(monthPrefix);
  const providerLabel = irrigationSatelliteProviderLabel();
  const providerSummary = irrigationSatelliteProviderSummary();
  const planetActive = irrigationSatelliteProcessingStatus.providerType === "planet";
  const activeDefinition = irrigationSatelliteIndexDefinition();
  const processingWarning = irrigationSatelliteProcessingWarning();
  return `
    <div class="irrigation-subpanel satellite-panel">
      <div class="satellite-toolbar">
        <div>
          <strong>Indices satelitales</strong>
          <span>${escapeHtml(providerLabel)} - ${escapeHtml(providerSummary)} - ${irrigationSatelliteDateFrom} a ${irrigationSatelliteDateTo}</span>
        </div>
        <div class="satellite-controls">
          <label>Desde
            <input id="irrigationSatelliteDateFrom" type="date" value="${htmlAttr(irrigationSatelliteDateFrom)}">
          </label>
          <label>Hasta
            <input id="irrigationSatelliteDateTo" type="date" value="${htmlAttr(irrigationSatelliteDateTo)}">
          </label>
          <label>Nubes max.
            <input id="irrigationSatelliteCloudMax" type="number" min="0" max="100" step="1" value="${htmlAttr(irrigationSatelliteCloudMax)}">
          </label>
          <label class="satellite-map-type-control">Tipo de mapa
            <select id="irrigationSatelliteIndex">
              ${irrigationSatelliteMapTypeOptions()}
            </select>
          </label>
          <label class="satellite-layer-style-control">Color capa
            <select id="irrigationSatelliteLayerStyle">
              ${irrigationSatelliteLayerStyleOptions()}
            </select>
          </label>
          ${planetActive ? `
          <label class="satellite-mosaic-control">Mosaico
            <select id="irrigationPlanetMosaic" ${irrigationPlanetMosaicsLoading ? "disabled" : ""}>
              ${irrigationPlanetMosaics.length
                ? irrigationPlanetMosaics.map((item) => `<option value="${htmlAttr(item.name)}" ${item.name === irrigationPlanetMosaic ? "selected" : ""}>${escapeHtml(irrigationPlanetMosaicLabel(item))}</option>`).join("")
                : `<option value="">${irrigationPlanetMosaicsLoading ? "Cargando..." : "Sin mosaicos"}</option>`}
            </select>
          </label>` : ""}
          <label>Opacidad
            <input id="irrigationSatelliteOpacity" type="range" min="20" max="95" step="5" value="${htmlAttr(irrigationSatelliteLayerOpacity)}">
          </label>
          <label>Refuerzo
            <select id="irrigationSatelliteLayerStrength">
              ${irrigationSatelliteLayerStrengthOptions()}
            </select>
          </label>
          <button class="primary-button" type="button" id="irrigationSatelliteSearch">Buscar</button>
          <div class="satellite-layer-toggles" aria-label="Capas satelitales">
            <label><input id="irrigationSatelliteShowIndexLayer" type="checkbox" ${irrigationSatelliteShowIndexLayer ? "checked" : ""}>Indice</label>
            <label><input id="irrigationSatellitePaintedLayer" type="checkbox" ${irrigationSatellitePaintedLayer ? "checked" : ""}>Pintado</label>
            <label><input id="irrigationSatelliteShowBlocks" type="checkbox" ${irrigationSatelliteShowBlocks ? "checked" : ""}>Bloques</label>
            <label><input id="irrigationSatelliteShowPotreros" type="checkbox" ${irrigationSatelliteShowPotreros ? "checked" : ""}>Potreros</label>
            <label><input id="irrigationSatelliteShowLabels" type="checkbox" ${irrigationSatelliteShowLabels ? "checked" : ""}>Etiquetas</label>
          </div>
        </div>
        <div class="satellite-use-chip">
          <strong>${escapeHtml(activeDefinition.name)}</strong>
          <span>${escapeHtml(activeDefinition.use)}</span>
          <code>${escapeHtml(activeDefinition.formula)}</code>
        </div>
      </div>

      <div class="satellite-layout satellite-layout-map-only">
        <section class="panel satellite-map-panel">
          <div class="panel-header">
            <div>
              <h2>Area satelital</h2>
              <p>${escapeHtml(activeDefinition.name)} procesado sobre los poligonos filtrados.</p>
            </div>
          </div>
          <div class="satellite-map-wrap">
            <div id="irrigationSatelliteMap" class="geo-map harvest-map satellite-map ${irrigationSatellitePaintedLayer ? "satellite-map-painted" : ""}"><span>Cargando mapa satelital...</span></div>
            <div class="satellite-map-legend">
              <span><i class="good"></i> Bloque filtrado</span>
              <span><i class="medium"></i> Potrero</span>
              <span><i class="high"></i> Revisar capa</span>
            </div>
            ${irrigationSatelliteIndexLegend(irrigationSatelliteIndex)}
            ${processingWarning ? `
              <div class="satellite-processing-warning">
                <strong>Capa procesada no disponible</strong>
                <span>${processingWarning}</span>
              </div>` : ""}
          </div>
        </section>
      </div>
    </div>
  `;
}

async function loadIrrigationSatelliteScenes(blocks, force = false) {
  ensureIrrigationSatelliteRange(`${irrigationYear}-${irrigationMonth}`);
  const queryKey = irrigationSatelliteQueryKey(blocks);
  if (!force && irrigationSatelliteLoading) return;
  if (!force && irrigationSatelliteLastQueryKey === queryKey) return;
  const requestId = Date.now();
  loadIrrigationSatelliteScenes.lastRequestId = requestId;
  irrigationSatelliteLoading = true;
  irrigationSatelliteError = "";
  if (currentView === "irrigation" && irrigationTab === "satellite") renderIrrigation();
  try {
    geoJsonCache ||= await loadGeoJson();
    irrigationSatelliteQueryMeta = irrigationSatelliteGeoMeta(blocks, geoJsonCache);
    const from = irrigationSatelliteDateFrom || `${irrigationYear}-${irrigationMonth}-01`;
    const to = irrigationSatelliteDateTo || from;
    const cloudMax = Math.min(100, Math.max(0, Number(irrigationSatelliteCloudMax) || 35));
    const limit = Math.min(30, Math.max(1, Number(irrigationSatelliteLimit) || 10));
    const response = await fetch(IRRIGATION_SATELLITE_STAC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        collections: [IRRIGATION_SATELLITE_COLLECTION],
        bbox: irrigationSatelliteQueryMeta.bbox.map((value) => Number(value.toFixed(6))),
        datetime: `${from}T00:00:00Z/${to}T23:59:59Z`,
        limit,
        query: {
          "eo:cloud_cover": { lt: cloudMax }
        }
      })
    });
    if (!response.ok) throw new Error(`Earth Search respondio ${response.status}`);
    const payload = await response.json();
    if (loadIrrigationSatelliteScenes.lastRequestId !== requestId) return;
    irrigationSatelliteScenes = (payload.features || [])
      .sort((a, b) => String(b.properties?.datetime || "").localeCompare(String(a.properties?.datetime || "")));
    irrigationSatelliteLastQueryKey = queryKey;
  } catch (error) {
    if (loadIrrigationSatelliteScenes.lastRequestId !== requestId) return;
    irrigationSatelliteScenes = [];
    irrigationSatelliteLastQueryKey = queryKey;
    irrigationSatelliteError = error.message || "Consulta satelital no disponible";
  } finally {
    if (loadIrrigationSatelliteScenes.lastRequestId === requestId) {
      irrigationSatelliteLoading = false;
      if (currentView === "irrigation" && irrigationTab === "satellite") renderIrrigation();
    }
  }
}

async function loadIrrigationPlanetMosaics(force = false) {
  if (irrigationSatelliteProcessingStatus.providerType !== "planet" || !irrigationSatelliteProxyBase) return;
  const queryKey = irrigationPlanetMosaicQueryKey();
  if (!force && irrigationPlanetMosaicsLoading) return;
  if (!force && irrigationPlanetMosaicsLastQueryKey === queryKey) return;
  const requestId = Date.now();
  loadIrrigationPlanetMosaics.lastRequestId = requestId;
  irrigationPlanetMosaicsLoading = true;
  irrigationPlanetMosaicsError = "";
  if (currentView === "irrigation" && irrigationTab === "satellite") renderIrrigation();
  try {
    const params = new URLSearchParams({
      from: irrigationSatelliteDateFrom,
      to: irrigationSatelliteDateTo
    });
    const response = await fetch(`${irrigationSatelliteProxyBase}/mosaics?${params.toString()}`, { cache: "no-store" });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.message || `Planet respondio ${response.status}`);
    if (loadIrrigationPlanetMosaics.lastRequestId !== requestId) return;
    irrigationPlanetMosaics = Array.isArray(payload.mosaics) ? payload.mosaics : [];
    irrigationPlanetMosaicsError = !irrigationPlanetMosaics.length && payload.message ? String(payload.message) : "";
    if (!irrigationPlanetMosaics.some((item) => item.name === irrigationPlanetMosaic)) {
      irrigationPlanetMosaic = irrigationPlanetMosaics[0]?.name || "";
    }
    irrigationPlanetMosaicsLastQueryKey = queryKey;
  } catch (error) {
    if (loadIrrigationPlanetMosaics.lastRequestId !== requestId) return;
    irrigationPlanetMosaics = [];
    irrigationPlanetMosaic = "";
    irrigationPlanetMosaicsLastQueryKey = queryKey;
    irrigationPlanetMosaicsError = error.message || "No se pudo cargar mosaicos Planet";
  } finally {
    if (loadIrrigationPlanetMosaics.lastRequestId === requestId) {
      irrigationPlanetMosaicsLoading = false;
      if (currentView === "irrigation" && irrigationTab === "satellite") renderIrrigation();
    }
  }
}

async function checkIrrigationSatelliteProcessing(force = false) {
  if (irrigationSatelliteProcessingStatus.checking) return;
  if (!force && irrigationSatelliteProcessingStatus.checked) return;
  irrigationSatelliteProcessingStatus = { checked: false, checking: true, configured: false, providerType: "", message: "Revisando proveedores satelitales", build: "", supportedIndexes: [] };
  if (currentView === "irrigation" && irrigationTab === "satellite") renderIrrigation();
  const isLocalHost = ["127.0.0.1", "localhost"].includes(window.location.hostname);
  const endpoints = isLocalHost
    ? [
        { type: "planet", base: IRRIGATION_PLANET_PROXY_LOCAL },
        { type: "sentinel", base: IRRIGATION_SATELLITE_PROXY_LOCAL, requireSupportedIndexes: true },
        { type: "sentinel", base: IRRIGATION_SATELLITE_PROXY_REMOTE, requireSupportedIndexes: true }
      ]
    : [
        { type: "planet", base: IRRIGATION_PLANET_PROXY_SUPABASE },
        { type: "sentinel", base: IRRIGATION_SATELLITE_PROXY_SUPABASE }
      ];
  let lastMessage = "No se encontro proxy satelital";
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${endpoint.base}/status`, { cache: "no-store" });
      if (!response.ok) {
        lastMessage = isLocalHost && response.status === 404
          ? `Reinicia el servidor local para cargar ${endpoint.base}`
          : `${endpoint.base} respondio ${response.status}`;
        continue;
      }
      const payload = await response.json();
      if (payload.configured) {
        const supportedIndexes = Array.isArray(payload.supportedIndexes) ? payload.supportedIndexes : [];
        if (endpoint.requireSupportedIndexes && endpoint.type === "sentinel" && !supportedIndexes.length) {
          lastMessage = `${endpoint.base} usa una version antigua del proxy Sentinel`;
          continue;
        }
        irrigationSatelliteProxyBase = endpoint.base;
        irrigationSatelliteProcessingStatus = {
          checked: true,
          checking: false,
          configured: true,
          providerType: endpoint.type,
          message: payload.provider || (endpoint.type === "planet" ? "Planet activo" : "Sentinel Hub activo"),
          build: payload.build || "",
          supportedIndexes
        };
        if (endpoint.type === "planet") loadIrrigationPlanetMosaics();
        if (currentView === "irrigation" && irrigationTab === "satellite") renderIrrigation();
        return;
      }
      lastMessage = payload.message || `Faltan credenciales en ${endpoint.base}`;
    } catch (error) {
      lastMessage = error.message || lastMessage;
    }
  }
  irrigationSatelliteProxyBase = "";
  irrigationSatelliteProcessingStatus = {
    checked: true,
    checking: false,
    configured: false,
    providerType: "",
    message: lastMessage,
    build: "",
    supportedIndexes: []
  };
  if (currentView === "irrigation" && irrigationTab === "satellite") renderIrrigation();
}

function irrigationSatelliteTileUrl(coord, zoom) {
  if (!irrigationSatelliteProcessingStatus.configured || !irrigationSatelliteProxyBase) return "";
  const providerType = irrigationSatelliteProcessingStatus.providerType;
  const definition = irrigationSatelliteIndexDefinition();
  if (providerType === "planet" && (!definition.planetProc || !irrigationPlanetMosaic)) return "";
  const scale = 2 ** zoom;
  const x = ((coord.x % scale) + scale) % scale;
  if (coord.y < 0 || coord.y >= scale) return "";
  if (irrigationSatelliteTileOutsideAoi(x, coord.y, zoom)) return IRRIGATION_SATELLITE_TRANSPARENT_TILE;
  if (providerType === "planet") {
    const params = new URLSearchParams({
      z: String(zoom),
      x: String(x),
      y: String(coord.y),
      mosaic: irrigationPlanetMosaic,
      proc: definition.planetProc,
      v: irrigationSatelliteTileQueryKey()
    });
    return `${irrigationSatelliteProxyBase}/tile?${params.toString()}`;
  }
  const params = new URLSearchParams({
    z: String(zoom),
    x: String(x),
    y: String(coord.y),
    index: irrigationSatelliteIndex,
    style: irrigationSatelliteLayerStyle,
    smooth: irrigationSatellitePaintedLayer ? "1" : "0",
    from: irrigationSatelliteDateFrom,
    to: irrigationSatelliteDateTo,
    maxCloud: String(irrigationSatelliteCloudMax),
    rev: String(irrigationSatelliteTileRevision),
    v: irrigationSatelliteTileQueryKey()
  });
  return `${irrigationSatelliteProxyBase}/tile?${params.toString()}`;
}

function invalidateIrrigationSatelliteTiles() {
  irrigationSatelliteTileRevision += 1;
  clearIrrigationSatelliteTileOverlay();
}

function clearIrrigationSatelliteTileOverlay() {
  if (!irrigationSatelliteMap || !irrigationSatelliteTileOverlays.length) return;
  const overlays = irrigationSatelliteMap.overlayMapTypes;
  for (let index = overlays.getLength() - 1; index >= 0; index -= 1) {
    if (irrigationSatelliteTileOverlays.includes(overlays.getAt(index))) overlays.removeAt(index);
  }
  irrigationSatelliteTileOverlays = [];
}

function irrigationSatelliteOverlayOpacity() {
  const strength = IRRIGATION_SATELLITE_LAYER_STRENGTHS[irrigationSatelliteLayerStrength] || IRRIGATION_SATELLITE_LAYER_STRENGTHS.reinforced;
  const baseOpacity = Math.max(0, Math.min(1, Number(irrigationSatelliteLayerOpacity) / 100));
  if (strength.layers <= 1) return baseOpacity;
  return Math.max(0.18, Math.min(0.78, baseOpacity * strength.factor));
}

function applyIrrigationSatelliteTileOverlay(maps) {
  if (!irrigationSatelliteMap || !maps) return;
  clearIrrigationSatelliteTileOverlay();
  if (!irrigationSatelliteShowIndexLayer) return;
  if (!irrigationSatelliteProcessingStatus.configured) return;
  if (irrigationSatelliteProcessingStatus.providerType === "planet") {
    const definition = irrigationSatelliteIndexDefinition();
    if (!definition.planetProc || !irrigationPlanetMosaic) return;
  }
  const strength = IRRIGATION_SATELLITE_LAYER_STRENGTHS[irrigationSatelliteLayerStrength] || IRRIGATION_SATELLITE_LAYER_STRENGTHS.reinforced;
  const opacity = irrigationSatelliteOverlayOpacity();
  irrigationSatelliteTileOverlays = Array.from({ length: strength.layers }, (_, index) => new maps.ImageMapType({
    getTileUrl: irrigationSatelliteTileUrl,
    tileSize: new maps.Size(256, 256),
    minZoom: 10,
    maxZoom: 19,
    name: `${irrigationSatelliteIndex} ${strength.name} ${index + 1}`,
    opacity
  }));
  irrigationSatelliteTileOverlays.forEach((overlay) => {
    irrigationSatelliteMap.overlayMapTypes.insertAt(0, overlay);
  });
}

async function renderIrrigationSatelliteMap(blocks) {
  const el = document.getElementById("irrigationSatelliteMap");
  if (!el) return;
  try {
    geoJsonCache ||= await loadGeoJson();
    const aoi = await loadIrrigationSatelliteAoi();
    const maps = await loadGoogleMaps();
    const blockRings = geoFeaturesToRings(geoJsonCache?.bloques?.features || []);
    const potreroRings = geoFeaturesToRings(geoJsonCache?.potreros?.features || []);
    if (!blockRings.length && !potreroRings.length) {
      el.innerHTML = `<span>Falta GeoJSON de potreros o bloques para dibujar el area satelital.</span>`;
      return;
    }
    const visibleKeys = new Set(blocks.map((block) => fieldIdentityKey(block.potrero, block.block)));
    const visiblePotreros = new Set(blocks.map((block) => normalizePotreroOrderName(block.potrero)));
    const planetActive = irrigationSatelliteProcessingStatus.providerType === "planet";
    const activeMosaic = irrigationPlanetMosaics.find((item) => item.name === irrigationPlanetMosaic);
    const activeDefinition = irrigationSatelliteIndexDefinition();
    const layerLabel = irrigationSatelliteProcessingStatus.configured ? "Capa activa" : "Sin capa";
    const activeFillColor = irrigationSatelliteProcessingStatus.configured ? "#1f7a4d" : "#6b7280";
    const indexLayerActive = irrigationSatelliteShowIndexLayer && irrigationSatelliteProcessingStatus.configured;

    irrigationSatelliteOverlays.forEach((overlay) => overlay.setMap?.(null));
    irrigationSatelliteOverlays = [];
    if (irrigationSatelliteMapElement !== el) {
      irrigationSatelliteMap = null;
      irrigationSatelliteMapElement = el;
    }
    if (!irrigationSatelliteMap) {
      irrigationSatelliteMap = new maps.Map(el, {
        mapTypeId: "satellite",
        disableDefaultUI: false,
        streetViewControl: false,
        fullscreenControl: true,
        mapTypeControl: true,
        gestureHandling: "greedy",
        scrollwheel: true,
        tilt: 0
      });
    }
    irrigationSatelliteMap.setOptions({ gestureHandling: "greedy", scrollwheel: true, draggable: true, keyboardShortcuts: true });
    maps.event.trigger(irrigationSatelliteMap, "resize");

    const activeBounds = new maps.LatLngBounds();
    const baseBounds = new maps.LatLngBounds();
    const blockPalette = ["#d4a017", "#297f8f", "#7c5bc2"];
    const potreroPalette = ["#1f6f4a", "#a85c1f", "#3759a8", "#8b3fa8"];
    if (aoi?.rings?.length) {
      aoi.rings.forEach((item) => {
        item.rings.forEach((ring) => {
          const polygon = new maps.Polygon({
            paths: ring.map(([lng, lat]) => ({ lat, lng })),
            strokeColor: "#fbc02d",
            strokeOpacity: 1,
            strokeWeight: 4,
            fillColor: "#fef3c7",
            fillOpacity: 0.04,
            zIndex: 12,
            clickable: false
          });
          polygon.setMap(irrigationSatelliteMap);
          irrigationSatelliteOverlays.push(polygon);
          ring.forEach(([lng, lat]) => baseBounds.extend({ lat, lng }));
        });
      });
    }
    blockRings.forEach((item, index) => {
      const field = geoJsonFeatureField(item.feature);
      const potreroMatches = visiblePotreros.has(normalizePotreroOrderName(field.potrero));
      const active = visibleKeys.has(fieldIdentityKey(field.potrero, field.block)) || potreroMatches;
      const fillColor = active ? activeFillColor : "#dfe8dc";
      const strokeColor = active ? "#ffffff" : blockPalette[index % blockPalette.length];
      item.rings.forEach((ring) => {
        if (irrigationSatelliteShowBlocks) {
          const polygon = new maps.Polygon({
            paths: ring.map(([lng, lat]) => ({ lat, lng })),
            strokeColor,
            strokeOpacity: active ? 1 : 0.9,
            strokeWeight: active ? 3.2 : 2.1,
            fillColor,
            fillOpacity: indexLayerActive ? active ? 0.04 : 0.01 : active ? 0.34 : 0.14,
            zIndex: active ? 8 : 5
          });
          polygon.addListener("click", () => {
            irrigationSatelliteInfoWindow ||= new maps.InfoWindow({ maxWidth: 300 });
            irrigationSatelliteInfoWindow.setContent(`
              <div class="harvest-map-info satellite-map-info">
                <div class="harvest-map-info-head">
                  <strong>${escapeHtml(potreroLabel(field.potrero))} - Bloque ${escapeHtml(field.block || "-")}</strong>
                  <span>${escapeHtml(irrigationSatelliteProviderLabel())}</span>
                </div>
                <div class="harvest-map-info-grid">
                  ${harvestInfoField("Mapa", activeDefinition.name)}
                  ${harvestInfoField("Uso", activeDefinition.use)}
                  ${harvestInfoField("Rango", `${irrigationSatelliteDateFrom} / ${irrigationSatelliteDateTo}`)}
                  ${harvestInfoField("Capa", `${IRRIGATION_SATELLITE_LAYER_STYLES[irrigationSatelliteLayerStyle]?.name || "Alto contraste"} / ${IRRIGATION_SATELLITE_LAYER_STRENGTHS[irrigationSatelliteLayerStrength]?.name || "Reforzada"}${irrigationSatellitePaintedLayer ? " / Pintado" : ""}`)}
                  ${harvestInfoField("Estado", planetActive && activeMosaic ? irrigationPlanetMosaicLabel(activeMosaic) : layerLabel)}
                </div>
              </div>
            `);
            irrigationSatelliteInfoWindow.setPosition(geoLatLngCenter(item.rings));
            irrigationSatelliteInfoWindow.open({ map: irrigationSatelliteMap });
          });
          polygon.setMap(irrigationSatelliteMap);
          irrigationSatelliteOverlays.push(polygon);
        }
        ring.forEach(([lng, lat]) => {
          baseBounds.extend({ lat, lng });
          if (active) activeBounds.extend({ lat, lng });
        });
      });
      if (irrigationSatelliteShowLabels) {
        const label = createMapLabelOverlay(maps, geoLatLngCenter(item.rings), `B${blockFeatureName(item.feature)}`, "map-label-block-google");
        label.setMap(irrigationSatelliteMap);
        irrigationSatelliteOverlays.push(label);
      }
    });

    potreroRings.forEach((item, index) => {
      item.rings.forEach((ring) => {
        if (irrigationSatelliteShowPotreros) {
          const polygon = new maps.Polygon({
            paths: ring.map(([lng, lat]) => ({ lat, lng })),
            strokeColor: potreroPalette[index % potreroPalette.length],
            strokeOpacity: 1,
            strokeWeight: 3.4,
            fillOpacity: 0,
            zIndex: 10
          });
          polygon.setMap(irrigationSatelliteMap);
          irrigationSatelliteOverlays.push(polygon);
        }
        ring.forEach(([lng, lat]) => baseBounds.extend({ lat, lng }));
      });
      if (irrigationSatelliteShowLabels) {
        const label = createMapLabelOverlay(maps, shiftLatLng(geoLatLngCenter(item.rings), index, 34), potreroLabel(potreroFeatureName(item.feature)), "map-label-potrero-google");
        label.setMap(irrigationSatelliteMap);
        irrigationSatelliteOverlays.push(label);
      }
    });

    const bounds = activeBounds.isEmpty() ? baseBounds : activeBounds;
    applyIrrigationSatelliteTileOverlay(maps);
    if (!bounds.isEmpty()) {
      requestAnimationFrame(() => {
        maps.event.trigger(irrigationSatelliteMap, "resize");
        irrigationSatelliteMap.fitBounds(bounds, 24);
      });
    }
  } catch (error) {
    el.innerHTML = `<span>No se pudo cargar el mapa satelital.</span>`;
  }
}

function wireIrrigationSatellitePanel(blocks, monthPrefix) {
  ensureIrrigationSatelliteRange(monthPrefix);
  const syncControl = (id, setter) => {
    const control = document.getElementById(id);
    control?.addEventListener("change", (event) => {
      setter(event.target.value);
      invalidateIrrigationSatelliteTiles();
      irrigationSatelliteLastQueryKey = "";
      irrigationPlanetMosaicsLastQueryKey = "";
      renderIrrigation();
    });
  };
  syncControl("irrigationSatelliteDateFrom", (value) => { irrigationSatelliteDateFrom = value; });
  syncControl("irrigationSatelliteDateTo", (value) => { irrigationSatelliteDateTo = value; });
  syncControl("irrigationSatelliteCloudMax", (value) => { irrigationSatelliteCloudMax = Math.min(100, Math.max(0, Number(value) || 35)); });
  document.getElementById("irrigationSatelliteIndex")?.addEventListener("change", (event) => {
    const value = event.target.value || "NDVI";
    irrigationSatelliteIndex = IRRIGATION_SATELLITE_INDEX_DEFINITIONS[value] ? value : "NDVI";
    invalidateIrrigationSatelliteTiles();
    renderIrrigation();
  });
  document.getElementById("irrigationSatelliteLayerStyle")?.addEventListener("change", (event) => {
    const value = event.target.value || "contrast";
    irrigationSatelliteLayerStyle = IRRIGATION_SATELLITE_LAYER_STYLES[value] ? value : "contrast";
    invalidateIrrigationSatelliteTiles();
    renderIrrigation();
  });
  document.getElementById("irrigationSatelliteLayerStrength")?.addEventListener("change", (event) => {
    const value = event.target.value || "reinforced";
    irrigationSatelliteLayerStrength = IRRIGATION_SATELLITE_LAYER_STRENGTHS[value] ? value : "reinforced";
    renderIrrigation();
  });
  document.getElementById("irrigationPlanetMosaic")?.addEventListener("change", (event) => {
    irrigationPlanetMosaic = event.target.value || "";
    invalidateIrrigationSatelliteTiles();
    renderIrrigation();
  });
  const syncLayerToggle = (id, setter) => {
    document.getElementById(id)?.addEventListener("change", (event) => {
      setter(Boolean(event.target.checked));
      invalidateIrrigationSatelliteTiles();
      renderIrrigation();
    });
  };
  syncLayerToggle("irrigationSatelliteShowIndexLayer", (value) => { irrigationSatelliteShowIndexLayer = value; });
  syncLayerToggle("irrigationSatellitePaintedLayer", (value) => { irrigationSatellitePaintedLayer = value; });
  syncLayerToggle("irrigationSatelliteShowBlocks", (value) => { irrigationSatelliteShowBlocks = value; });
  syncLayerToggle("irrigationSatelliteShowPotreros", (value) => { irrigationSatelliteShowPotreros = value; });
  syncLayerToggle("irrigationSatelliteShowLabels", (value) => { irrigationSatelliteShowLabels = value; });
  const opacityControl = document.getElementById("irrigationSatelliteOpacity");
  opacityControl?.addEventListener("input", (event) => {
    irrigationSatelliteLayerOpacity = Math.min(95, Math.max(20, Number(event.target.value) || 68));
    const opacity = irrigationSatelliteOverlayOpacity();
    irrigationSatelliteTileOverlays.forEach((overlay) => overlay.setOpacity(opacity));
  });
  document.getElementById("irrigationSatelliteSearch")?.addEventListener("click", () => {
    irrigationSatelliteLastQueryKey = "";
    irrigationPlanetMosaicsLastQueryKey = "";
    loadIrrigationPlanetMosaics(true);
    renderIrrigation();
  });
  checkIrrigationSatelliteProcessing();
  if (irrigationSatelliteProcessingStatus.providerType === "planet") loadIrrigationPlanetMosaics();
  renderIrrigationSatelliteMap(blocks);
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
        <div class="irrigation-calicata-map-controls">
          <label>Bloque
            <select id="irrigationCalicataBlockFilter">
              ${options.map((item) => `<option value="${htmlAttr(item.key)}" ${item.key === irrigationCalicataBlockFilter ? "selected" : ""}>${escapeHtml(item.label)}</option>`).join("")}
            </select>
          </label>
          <label class="irrigation-map-toggle">
            <input id="irrigationCalicataPotreroLabels" type="checkbox" ${irrigationCalicataShowPotreroLabels ? "checked" : ""}>
            <span>Nombres potreros</span>
          </label>
        </div>
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
              <strong>${escapeHtml(potreroLabel(item.potrero))} · bloque ${escapeHtml(item.block || "-")}</strong>
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

function normalizeHarvestBinIdentifier(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[._-]/g, "");
}

function harvestBinIdentifierKeys(record) {
  const keys = new Set();
  [record.localCode, record.numBin].forEach((value) => {
    const normalized = normalizeHarvestBinIdentifier(value);
    if (!normalized) return;
    keys.add(`bin:${normalized}`);
    const digits = normalized.replace(/\D/g, "");
    if (digits.length >= 3) keys.add(`bin:${digits}`);
  });
  if (!keys.size && record.id) keys.add(`row:${record.id}`);
  return [...keys];
}

function harvestRecordSortValue(record) {
  const date = String(record.scanDate || record.createdAt || record.harvestDate || "");
  const timestamp = Date.parse(date);
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function preferredHarvestRecord(records) {
  return [...records].sort((a, b) => {
    const coordA = Number.isFinite(a.latitude) && Number.isFinite(a.longitude) ? 1 : 0;
    const coordB = Number.isFinite(b.latitude) && Number.isFinite(b.longitude) ? 1 : 0;
    return harvestRecordSortValue(b) - harvestRecordSortValue(a)
      || coordB - coordA
      || String(b.id || "").localeCompare(String(a.id || ""), "es", { numeric: true });
  })[0];
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
  const groups = new Map();
  const keyToGroup = new Map();
  let fallbackIndex = 0;
  records.forEach((record) => {
    const keys = harvestBinIdentifierKeys(record);
    if (!keys.length) keys.push(`fallback:${fallbackIndex++}`);
    const matchedGroups = [...new Set(keys.map((key) => keyToGroup.get(key)).filter(Boolean))];
    const groupKey = matchedGroups[0] || keys[0];
    if (!groups.has(groupKey)) groups.set(groupKey, []);
    matchedGroups.slice(1).forEach((matchedKey) => {
      const merged = groups.get(matchedKey) || [];
      groups.get(groupKey).push(...merged);
      groups.delete(matchedKey);
      keyToGroup.forEach((value, key) => {
        if (value === matchedKey) keyToGroup.set(key, groupKey);
      });
    });
    groups.get(groupKey).push(record);
    keys.forEach((key) => keyToGroup.set(key, groupKey));
  });
  const unique = [...groups.values()].map(preferredHarvestRecord).filter(Boolean);
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
  const hectares = Number(order.hectares) || 0;
  if (hectares > 0) return productHaFromDose(order, recipeLine) * hectares;
  return productQuantityForLine(plannedLiters(order), recipeLine, 0);
}

function productQuantityFromWater(waterLiters, dosePer100Liters) {
  return ((Number(waterLiters) || 0) / 100) * ((Number(dosePer100Liters) || 0) / 1000);
}

function productQuantityForLine(waterLiters, recipeLine, hectares = 0) {
  const dose = Number(recipeLine?.dose ?? recipeLine?.dose100) || 0;
  const divisor = Number(recipeLine?.divisor) || 1;
  if (recipeLine?.doseBasis === "per_ha") return dose / divisor * (Number(hectares) || 0);
  if (recipeLine?.doseBasis === "per_liter") return (Number(waterLiters) || 0) * dose / divisor;
  return productQuantityFromWater(waterLiters, dose);
}

function productHaFromDose(order, recipeLine) {
  if (recipeLine?.doseBasis === "per_ha") return (Number(recipeLine.dose ?? recipeLine.dose100) || 0) / (Number(recipeLine.divisor) || 1);
  return productQuantityForLine(order.waterHa, recipeLine, 1);
}

function dispatchProductQuantity(order, recipeLine, liters) {
  const waterHa = Number(order.waterHa) || 0;
  const productHa = productHaFromDose(order, recipeLine);
  if (waterHa > 0) return (Number(liters) || 0) / waterHa * productHa;
  return productQuantityForLine(liters, recipeLine, 0);
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

function setButtonBusy(button, busy, label = "") {
  if (!button) return;
  if (busy) {
    button.dataset.defaultText ||= button.textContent;
    button.disabled = true;
    button.classList.add("is-loading");
    if (label) button.textContent = label;
  } else {
    button.disabled = false;
    button.classList.remove("is-loading");
    if (button.dataset.defaultText) button.textContent = button.dataset.defaultText;
  }
}

function passwordScore(password = "") {
  const value = String(password || "");
  return {
    length: value.length >= 8,
    case: /[a-z]/.test(value) && /[A-Z]/.test(value),
    number: /\d/.test(value),
    symbol: /[^A-Za-z0-9]/.test(value)
  };
}

function isStrongPassword(password = "") {
  const score = passwordScore(password);
  return score.length && score.case && score.number;
}

function updatePasswordRuleIndicators(scope = document) {
  const resetPassword = String(document.querySelector('#gateResetPasswordForm [name="newPassword"]')?.value || "");
  const registerPassword = String(document.querySelector('#gateRegisterForm [name="registerPassword"]')?.value || "");
  const resetScore = passwordScore(resetPassword);
  const registerScore = passwordScore(registerPassword);
  [
    ["length", resetScore.length],
    ["case", resetScore.case],
    ["number", resetScore.number],
    ["register-length", registerScore.length],
    ["register-case", registerScore.case],
    ["register-number", registerScore.number]
  ].forEach(([rule, active]) => {
    scope.querySelector(`[data-password-rule="${rule}"]`)?.classList.toggle("is-valid", Boolean(active));
  });
}

function enhanceAuthGate() {
  const card = document.querySelector("#authGate .auth-card");
  if (!card || card.dataset.enhanced === "true") return;
  card.dataset.enhanced = "true";
  const setLabelText = (selector, text) => {
    const field = document.querySelector(selector);
    const label = field?.closest("label");
    if (label?.firstChild?.nodeType === Node.TEXT_NODE) label.firstChild.textContent = text;
  };
  const brand = card.querySelector(".auth-brand");
  if (brand) {
    brand.querySelector("span") && (brand.querySelector("span").textContent = "Acceso seguro Supabase");
    const hero = document.createElement("div");
    hero.className = "auth-copy";
    hero.innerHTML = `
      <div class="auth-module-grid" aria-label="Modulos AgroCore">
        <span class="auth-module-chip">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 16h16M6 16l2-8h8l2 8M9 8V5h6v3M8 19h.01M16 19h.01"/></svg>
          <strong>Cosecha</strong>
        </span>
        <span class="auth-module-chip">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3s6 6.1 6 11a6 6 0 0 1-12 0c0-4.9 6-11 6-11Z"/><path d="M9.5 15.5c1.2 1.1 3.8 1.1 5 0"/></svg>
          <strong>Riego</strong>
        </span>
        <span class="auth-module-chip">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4h6M10 4v5l-4 7a3 3 0 0 0 2.6 4.5h6.8A3 3 0 0 0 18 16l-4-7V4"/><path d="M8 16h8"/></svg>
          <strong>Fertilizante</strong>
        </span>
        <span class="auth-module-chip">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v14H4z"/><path d="M8 9h8M8 13h5"/></svg>
          <strong>Aplicaciones</strong>
        </span>
        <span class="auth-module-chip">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v2M12 18v2M4 12h2M18 12h2M6.6 6.6 8 8M16 16l1.4 1.4M17.4 6.6 16 8M8 16l-1.4 1.4"/><circle cx="12" cy="12" r="4"/></svg>
          <strong>Clima</strong>
        </span>
      </div>`;
    brand.after(hero);
  }
  const loginButton = document.getElementById("gateLoginButton");
  if (loginButton) loginButton.textContent = "Entrar a AgroCore";
  const recoverButton = document.querySelector('[data-action="gate-tab"][data-tab="recover"]');
  if (recoverButton) recoverButton.textContent = "Recuperar contrasena";
  const loginEmail = document.querySelector('#gateLoginForm [name="email"]');
  const loginPassword = document.querySelector('#gateLoginForm [name="password"]');
  setLabelText('#gateLoginForm [name="password"]', "Contrasena");
  setLabelText('#gateResetPasswordForm [name="newPassword"]', "Nueva contrasena");
  setLabelText('#gateResetPasswordForm [name="newPassword2"]', "Repetir contrasena");
  setLabelText('#gateRegisterForm [name="registerPassword"]', "Contrasena");
  setLabelText('#gateRegisterForm [name="registerPassword2"]', "Repetir contrasena");
  if (loginEmail) loginEmail.placeholder = "usuario@canelillo.cl";
  if (loginPassword) loginPassword.placeholder = "Tu contrasena";
  const privacyLink = card.querySelector(".auth-privacy .link-button");
  if (privacyLink) privacyLink.textContent = "Politicas de privacidad";
  const privacyText = card.querySelector(".auth-privacy span");
  if (privacyText) privacyText.textContent = "Uso de datos en AgroCore y aplicaciones vinculadas.";
  document.getElementById("gateLoginForm")?.insertAdjacentHTML("afterbegin", `<div class="auth-pane-head auth-pane-head-login"><strong>Ingresar a AgroCore</strong><span>Cuenta autorizada del equipo Canelillo.</span></div>`);
  const recoverForm = document.getElementById("gateRecoverForm");
  if (recoverForm && !recoverForm.querySelector(".auth-pane-head")) {
    recoverForm.insertAdjacentHTML("afterbegin", `<div class="auth-pane-head"><strong>Recuperar acceso</strong><span>Enlace seguro al correo registrado.</span></div>`);
  }
  const resetForm = document.getElementById("gateResetPasswordForm");
  if (resetForm && !resetForm.querySelector(".auth-pane-head")) {
    resetForm.insertAdjacentHTML("afterbegin", `<div class="auth-pane-head"><strong>Nueva contrasena</strong><span>Define una clave segura.</span></div>`);
  }
  if (resetForm && !resetForm.querySelector(".password-rules")) {
    resetForm.querySelector('[name="newPassword2"]')?.closest("label")?.insertAdjacentHTML("afterend", `
      <div class="password-rules">
        <span data-password-rule="length">8+ caracteres</span>
        <span data-password-rule="case">Mayuscula y minuscula</span>
        <span data-password-rule="number">Numero</span>
      </div>`);
  }
  const registerForm = document.getElementById("gateRegisterForm");
  if (registerForm && !registerForm.querySelector(".password-rules")) {
    registerForm.querySelector('[name="registerPassword2"]')?.closest("label")?.insertAdjacentHTML("afterend", `
      <div class="password-rules">
        <span data-password-rule="register-length">8+ caracteres</span>
        <span data-password-rule="register-case">Mayuscula y minuscula</span>
        <span data-password-rule="register-number">Numero</span>
      </div>`);
  }
  card.querySelectorAll('input[type="password"]').forEach((input) => {
    input.addEventListener("input", () => updatePasswordRuleIndicators(card));
  });
  updatePasswordRuleIndicators(card);
}

function showGateTab(tab) {
  enhanceAuthGate();
  document.querySelectorAll("#authGate .auth-tabs button").forEach((button) => button.classList.toggle("active", button.dataset.tab === tab));
  ["login", "register", "recover", "resetPassword"].forEach((name) => {
    document.getElementById(`gate${name[0].toUpperCase()}${name.slice(1)}Form`)?.classList.toggle("active-auth-pane", tab === name);
  });
  updatePasswordRuleIndicators(document);
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
  if (dialog?.open) dialog.close();
  if (supabaseSession) {
    const displayName = currentProfile?.full_name || currentProfile?.nombre_completo || "Usuario Canelillo";
    const userEmail = supabaseSession.user?.email || currentProfile?.email || "";
    const userRut = currentProfile?.rut || "";
    dialog.innerHTML = `
      <div class="modal-body account-dialog">
        <div class="modal-head">
          <div>
            <span class="account-dialog-eyebrow">Mi cuenta</span>
            <h2>Informacion de la cuenta</h2>
          </div>
          <button class="icon-button" type="button" data-action="close-dialog" title="Cerrar">x</button>
        </div>
        <div class="account-identity">
          <span class="account-avatar" aria-hidden="true">${escapeHtml(accountInitials(displayName))}</span>
          <div><strong>${escapeHtml(displayName)}</strong><span>${escapeHtml(userEmail)}</span></div>
          <em>${escapeHtml(roleLabel(currentProfile?.rol || currentProfile?.role))}</em>
        </div>
        <div class="account-dialog-grid">
          <form id="accountProfileForm" class="account-section">
            <div class="account-section-head"><strong>Datos personales</strong><span>Los cambios se comparten con las aplicaciones Canelillo.</span></div>
            <div class="account-form-grid">
              <label>Nombre completo<input name="fullName" autocomplete="name" maxlength="120" value="${htmlAttr(displayName)}" required></label>
              <label>RUT<input name="rut" maxlength="20" value="${htmlAttr(userRut)}" placeholder="12.345.678-9" required></label>
              <label>Correo<input type="email" value="${htmlAttr(userEmail)}" readonly></label>
              <label>Rol<input value="${htmlAttr(roleLabel(currentProfile?.rol || currentProfile?.role))}" readonly></label>
              <label class="full">Area de acceso<input value="${htmlAttr(areaLabel(currentProfile?.area))}" readonly></label>
            </div>
            <button class="primary-button account-save-button" type="button" data-action="save-account-profile">Guardar informacion</button>
          </form>
          <form id="accountPasswordForm" class="account-section account-security-section">
            <div class="account-section-head"><strong>Cambiar contrasena</strong><span>Confirma tu clave actual antes de definir una nueva.</span></div>
            <label>Contrasena actual<input name="currentPassword" type="password" autocomplete="current-password" required></label>
            <label>Nueva contrasena<input name="newPassword" type="password" autocomplete="new-password" required></label>
            <label>Repetir nueva contrasena<input name="newPassword2" type="password" autocomplete="new-password" required></label>
            <button class="secondary-button account-save-button" type="button" data-action="save-account-password">Actualizar contrasena</button>
          </form>
        </div>
        <div class="modal-actions">
          <button class="secondary-button" type="button" data-action="close-dialog">Cerrar</button>
          <button class="danger-button" type="button" data-action="logout">Cerrar sesion</button>
        </div>
      </div>
    `;
    setUserMenuOpen(false);
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

async function updateAuthUserMetadata(metadata = {}) {
  const session = await ensureSupabaseSession(false);
  if (!session?.access_token) return;
  const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    method: "PUT",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ data: metadata })
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "No se pudo sincronizar el perfil de acceso");
  }
}

async function saveAccountProfile() {
  const form = document.getElementById("accountProfileForm");
  const button = form?.querySelector('[data-action="save-account-profile"]');
  if (!form || !form.reportValidity() || !supabaseSession?.user?.id) return;
  const data = Object.fromEntries(new FormData(form));
  const fullName = String(data.fullName || "").trim();
  const rut = normalizeRutValue(data.rut);
  if (fullName.length < 3 || !rut) {
    showToast("Revisa el nombre y RUT");
    return;
  }
  try {
    setButtonBusy(button, true, "Guardando...");
    await sbFetch(`/rest/v1/usuarios?id=eq.${supabaseSession.user.id}`, {
      method: "PATCH",
      prefer: "return=minimal",
      body: JSON.stringify({ nombre_completo: fullName, rut })
    });
    try {
      await updateAuthUserMetadata({
        ...(supabaseSession.user?.user_metadata || {}),
        full_name: fullName,
        nombre_completo: fullName,
        rut
      });
    } catch (metadataError) {
      console.warn("El perfil publico se guardo, pero no se actualizo metadata de Auth", metadataError);
    }
    currentProfile = { ...currentProfile, nombre_completo: fullName, full_name: fullName, rut };
    updateAuthenticatedUserUi();
    openAuthDialog();
    showToast("Informacion de cuenta actualizada");
  } catch (error) {
    showToast(`No se actualizo la cuenta: ${error.message}`);
  } finally {
    setButtonBusy(button, false);
  }
}

async function saveAccountPassword() {
  const form = document.getElementById("accountPasswordForm");
  const button = form?.querySelector('[data-action="save-account-password"]');
  if (!form || !form.reportValidity()) return;
  const data = Object.fromEntries(new FormData(form));
  const currentPassword = String(data.currentPassword || "");
  const password = String(data.newPassword || "");
  const password2 = String(data.newPassword2 || "");
  const email = normalizeEmailValue(supabaseSession?.user?.email);
  if (password !== password2) {
    showToast("Las contrasenas nuevas no coinciden");
    return;
  }
  if (!isStrongPassword(password)) {
    showToast("Usa 8 caracteres, mayuscula, minuscula y numero");
    return;
  }
  if (password === currentPassword) {
    showToast("La nueva contrasena debe ser distinta");
    return;
  }
  try {
    setButtonBusy(button, true, "Actualizando...");
    const freshSession = await sbAuthPassword(email, currentPassword);
    await sbUpdatePassword(freshSession.access_token, password);
    saveSession(freshSession);
    form.reset();
    showToast("Contrasena actualizada");
  } catch (error) {
    showToast(`No se cambio la contrasena: ${error.message}`);
  } finally {
    setButtonBusy(button, false);
  }
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
    await reloadCurrentCloudModules();
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

function authRedirectUrl() {
  const url = new URL(window.location.href);
  url.hash = "";
  url.searchParams.set("auth", "reset-password");
  return url.toString();
}

async function loginSupabase() {
  const form = document.getElementById("authForm") || document.getElementById("gateLoginForm");
  const data = Object.fromEntries(new FormData(form));
  const email = normalizeEmailValue(data.email);
  const password = String(data.password || "");
  const button = document.getElementById("loginButton") || document.getElementById("gateLoginButton");
  if (!email || !password) {
    setGateStatus("Ingresa correo y contrasena.", "error");
    showToast("Ingresa correo y contrasena");
    return;
  }
  try {
    setButtonBusy(button, true, "Verificando...");
    setGateStatus("Verificando credenciales...", "info");
    const session = await sbAuthPassword(email, password);
    saveSession(session);
    setGateStatus("Entrando a AgroCore...", "info");
    await loadCloudProfile();
    document.getElementById("authDialog")?.close();
    setGateStatus("", "info");
    showAuthenticatedShell("Cargando inicio desde Supabase...");
    loadCloudDataInBackground();
    showToast("Sesion Supabase iniciada");
  } catch (error) {
    setGateStatus(`No se pudo ingresar: ${error.message}`, "error");
    showToast(`Login fallido: ${error.message}`);
  } finally {
    setButtonBusy(button, false);
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
  const button = document.getElementById("registerButton") || document.getElementById("gateRegisterButton");
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
    setGateStatus("Las contrasenas no coinciden.", "error");
    showToast("Las contrasenas no coinciden");
    return;
  }
  if (!isStrongPassword(password)) {
    setGateStatus("La contrasena debe tener al menos 8 caracteres, mayuscula, minuscula y numero.", "error");
    showToast("Contrasena debil");
    return;
  }
  try {
    setButtonBusy(button, true, "Creando...");
    setGateStatus("Creando cuenta en Supabase...", "info");
    const signup = await sbSignUp(email, password, userRegistrationMetadata(fullName, rut, role, area));
    if (signup?.access_token) await createProfileWithSession(signup, fullName, rut, role, area);
    clearRegistrationForm();
    showGateTab("login");
    setGateStatus(signup?.access_token
      ? "Cuenta creada exitosamente. Ahora ingresa con tu correo y contrasena."
      : "Cuenta creada. Revisa el correo si Supabase pide confirmacion; luego ingresa.",
      "success"
    );
    showToast("Cuenta creada exitosamente");
  } catch (error) {
    setGateStatus(`Registro fallido: ${error.message}`, "error");
    showToast(`Registro fallido: ${error.message}`);
  } finally {
    setButtonBusy(button, false);
  }
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
      redirect_to: authRedirectUrl()
    })
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) throw new Error(data?.error_description || data?.msg || data?.message || text || "No se pudo enviar recuperacion");
  return data;
}

function readRecoverySessionFromUrl() {
  const sources = [
    new URLSearchParams(window.location.hash.replace(/^#/, "")),
    new URLSearchParams(window.location.search)
  ];
  const errorParams = sources.find((params) => params.get("error") || params.get("error_description"));
  if (errorParams) {
    setTimeout(() => setGateStatus(`No se pudo recuperar: ${errorParams.get("error_description") || errorParams.get("error")}`, "error"), 0);
    return null;
  }
  const params = sources.find((item) => item.get("access_token") && (!item.get("type") || item.get("type") === "recovery"));
  if (!params) return null;
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
  const button = document.getElementById("gateRecoverButton");
  if (!email || !isValidEmail(email)) {
    setGateStatus("Ingresa un correo valido para recuperar.", "error");
    showToast("Correo invalido");
    return;
  }
  try {
    setButtonBusy(button, true, "Enviando...");
    setGateStatus("Enviando enlace de recuperacion...", "info");
    await sbRecoverPassword(email);
    showGateTab("login");
    setGateStatus("Si el correo existe, Supabase enviara un enlace para crear una nueva contrasena. Revisa tambien spam o correo no deseado.", "success");
    showToast("Revisa tu correo");
  } catch (error) {
    setGateStatus(`No se pudo enviar recuperacion: ${error.message}`, "error");
    showToast("No se pudo enviar recuperacion");
  } finally {
    setButtonBusy(button, false);
  }
}

async function resetSupabasePassword() {
  const form = document.getElementById("gateResetPasswordForm");
  const data = Object.fromEntries(new FormData(form));
  const password = String(data.newPassword || "");
  const password2 = String(data.newPassword2 || "");
  const button = document.getElementById("gateResetPasswordButton");
  if (!passwordRecoverySession?.access_token) {
    setGateStatus("El enlace de recuperacion no es valido o expiro.", "error");
    return;
  }
  if (password !== password2) {
    setGateStatus("Las contrasenas no coinciden.", "error");
    return;
  }
  if (!isStrongPassword(password)) {
    setGateStatus("La contrasena debe tener al menos 8 caracteres, mayuscula, minuscula y numero.", "error");
    return;
  }
  try {
    setButtonBusy(button, true, "Actualizando...");
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
  } finally {
    setButtonBusy(button, false);
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
  resetCloudModuleCache();

  document.querySelectorAll("dialog[open]").forEach((dialog) => dialog.close());
  document.querySelectorAll(".nav-item").forEach((button) => button.classList.toggle("active", button.dataset.view === currentView));
  Object.entries(views).forEach(([key, element]) => element.classList.toggle("active-view", key === currentView));

  applyRoleNavigation();
  render();

  updateAuthenticatedUserUi();

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
  const neededModules = [...new Set(cloudModulesForView(view))];
  const shouldLoad = neededModules.some((module) => shouldLoadCloudModule(module));
  if (supabaseSession && shouldLoad && views[view]) {
    views[view].innerHTML = cloudModuleLoadingHtml(view);
    ensureCloudDataForView(view).catch((error) => {
      console.error("No se pudo cargar modulo", view, error);
      views[view].innerHTML = `<section class="panel"><div class="empty-state"><strong>No se pudo cargar ${escapeHtml(titles[view] || view)}</strong><p>${escapeHtml(error.message)}</p></div></section>`;
      showToast(`No se pudo cargar ${titles[view] || view}: ${error.message}`);
    });
    return;
  }
  render();
  ensureCloudDataForView(view).catch((error) => console.warn("No se pudo refrescar modulo", view, error));
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
    harvestExport: renderHarvestExport,
    harvestAnalysis: renderHarvestAnalysis,
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

function weatherStationExportButton() {
  return `<button class="secondary-button weather-export-button" type="button" data-action="export-weather-station">Exportar Excel</button>`;
}

function weatherStationSortedRows() {
  return [...(state.weatherStationDaily || [])].sort((a, b) => String(a.date).localeCompare(String(b.date)));
}

function currentWeatherStationRows() {
  return weatherStationSortedRows().filter((row) => {
    const yearMatches = String(row.date || "").startsWith(`${weatherStationYear}-`);
    const monthMatches = weatherStationMonth === "Todos" || String(row.date || "").slice(5, 7) === weatherStationMonth;
    return yearMatches && monthMatches;
  });
}

function renderDashboard() {
  const dailyRows = weatherStationSortedRows();
  const years = [...new Set(dailyRows.map((row) => String(row.date || "").slice(0, 4)).filter(Boolean))].sort();
  if (years.length && !years.includes(weatherStationYear)) weatherStationYear = years.at(-1);
  const rows = currentWeatherStationRows();

  if (!dailyRows.length) {
    const loadingContent = `
      <div class="weather-import-loading" role="status" aria-live="polite">
        <span class="weather-import-spinner" aria-hidden="true"></span>
        <strong>Cargando estacion climatica</strong>
        <small>Sincronizando mediciones desde Supabase...</small>
      </div>
    `;
    views.dashboard.innerHTML = `
      <section class="panel weather-station-empty">
        <div class="panel-header">
          <div>
            <span class="weather-eyebrow">Estacion climatica</span>
            <h2>Monitoreo meteorologico</h2>
          </div>
          ${weatherStationImportButton()}
        </div>
        ${cloudInitialLoadInProgress ? loadingContent : `<div class="empty-state">
          <strong>${weatherStationCloudAvailable ? "Sin mediciones disponibles" : "Estacion pendiente de configurar"}</strong>
          <p>Ejecuta <code>supabase_estacion_climatica.sql</code> y luego <code>supabase_estacion_climatica_import.sql</code> en Supabase.</p>
        </div>`}
      </section>
    `;
    return;
  }

  const degreeSeasonRows = weatherStationDegreeSeasonRows(dailyRows, weatherStationYear);
  const degreeSeason = weatherStationDegreeSeason(weatherStationYear);
  const summary = weatherStationSummary(rows, degreeSeasonRows);
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
          <h2>Condiciones climaticas</h2>
          <p>${number(summary.records, 0)} registros · cobertura ${number(summary.completeness, 1)}%</p>
        </div>
        <div class="weather-station-header-actions">
          ${weatherStationViewSwitch()}
          ${weatherStationImportButton()}
          ${weatherStationExportButton()}
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
        ${weatherStationKpi("Precipitacion acumulada", summary.hasRows ? `${number(summary.precipitationTotal, 1)} mm` : "-", "Lluvia acumulada del periodo", "rain")}
        ${weatherStationKpi("Humedad promedio", summary.hasHumidity ? `${number(summary.humidityAverage * 100, 1)}%` : "-", "Promedio del periodo", "humidity")}
        ${weatherStationKpi("Viento promedio", summary.hasWind ? `${number(summary.windAverage, 1)}` : "-", "Velocidad media del periodo", "wind")}
        ${weatherStationKpi("Grados-dia base 7 °C", degreeSeasonRows.length ? `${number(summary.degreeDays, 1)} °C-dia` : "-", degreeSeason.label, "degree")}
        ${weatherStationKpi("Dias con helada", summary.hasRows ? number(summary.frostDays, 0) : "-", summary.hasRows ? `${number(summary.totalFrostHours, 1)} h bajo 0 °C` : "", "frost")}
      </div>

      ${weatherStationView === "lluvia" ? renderWeatherRainDashboard(rows, summary) : renderWeatherFrostDashboard(rows, summary)}
    </section>
  `;

  document.querySelectorAll("[data-weather-station-view]").forEach((button) => {
    button.addEventListener("click", () => {
      weatherStationView = button.dataset.weatherStationView || "heladas";
      renderDashboard();
    });
  });
  document.getElementById("weatherStationYearFilter")?.addEventListener("change", (event) => {
    weatherStationYear = event.target.value;
    renderDashboard();
  });
  document.getElementById("weatherStationMonthFilter")?.addEventListener("change", (event) => {
    weatherStationMonth = event.target.value;
    renderDashboard();
  });
}

function weatherStationViewSwitch() {
  const options = [
    ["heladas", "Heladas"],
    ["lluvia", "Lluvia"]
  ];
  return `
    <div class="weather-view-switch" aria-label="Vista de estacion climatica">
      ${options.map(([value, label]) => `
        <button type="button" data-weather-station-view="${value}" class="${weatherStationView === value ? "active" : ""}">${label}</button>
      `).join("")}
    </div>
  `;
}

function renderWeatherFrostDashboard(rows, summary) {
  return `
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
  `;
}

function renderWeatherRainDashboard(rows, summary) {
  return `
    <div class="weather-dashboard-grid">
      <section class="panel weather-rain-panel">
        <div class="weather-panel-title">
          <div><h3>Lluvia del periodo</h3><p>Precipitacion diaria y acumulada</p></div>
          <span>${weatherStationPeriodLabel()}</span>
        </div>
        ${weatherRainChart(rows)}
      </section>

      <section class="panel weather-rain-panel">
        <div class="weather-panel-title">
          <div><h3>Resumen de lluvia</h3><p>Dias con lluvia por intensidad</p></div>
        </div>
        ${weatherRainSummaryCard(rows, summary)}
        ${weatherRainBands(rows)}
      </section>
    </div>

    <section class="panel weather-frost-history weather-rain-history">
      <div class="weather-panel-title">
        <div><h3>Dias con lluvia</h3><p>Solo fechas con precipitacion registrada</p></div>
      </div>
      ${weatherRainTable(rows)}
    </section>
  `;
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
        <span>Columnas requeridas: FECHA, HORA, TEMP OUT, HI TEMP y LOW TEMP. Opcionales: HUMEDAD %, Velocidad del viento y Precipitacion.</span>
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

function stationExcelNumber(value, options = {}) {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(String(value).trim().replace("%", "").replace(/\s+/g, "").replace(",", "."));
  if (!Number.isFinite(parsed)) return null;
  const minimum = options.minimum ?? -Infinity;
  const maximum = options.maximum ?? Infinity;
  return parsed >= minimum && parsed <= maximum ? parsed : null;
}

function stationExcelHumidity(value) {
  const parsed = stationExcelNumber(value, { minimum: 0, maximum: 100 });
  if (parsed === null) return null;
  return parsed > 1 ? parsed / 100 : parsed;
}

function stationExcelHeaderIndex(headers, aliases) {
  return aliases.map((alias) => headers.indexOf(alias)).find((index) => index >= 0) ?? -1;
}

function parseWeatherStationExcelRows(matrix) {
  if (!Array.isArray(matrix) || !matrix.length) throw new Error("El Excel no contiene filas");
  const headers = matrix[0].map(stationExcelHeader);
  const expected = {
    fecha: headers.indexOf("fecha"),
    hora: headers.indexOf("hora"),
    tempOut: headers.indexOf("tempout"),
    hiTemp: headers.indexOf("hitemp"),
    lowTemp: headers.indexOf("lowtemp"),
    humidity: stationExcelHeaderIndex(headers, ["humedad", "humedadporcentaje", "humedadpct", "humidity", "humiditypct", "humiditypercent"]),
    windSpeed: stationExcelHeaderIndex(headers, ["velocidaddelviento", "viento", "windspeed", "wind"]),
    precipitation: stationExcelHeaderIndex(headers, ["precipitacion", "precipitacionmm", "lluvia", "rain", "rainfall"])
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
    const humidity = expected.humidity >= 0 ? stationExcelHumidity(row[expected.humidity]) : null;
    const windSpeed = expected.windSpeed >= 0 ? stationExcelNumber(row[expected.windSpeed], { minimum: 0, maximum: 300 }) : null;
    const precipitation = expected.precipitation >= 0 ? stationExcelNumber(row[expected.precipitation], { minimum: 0, maximum: 1000 }) : null;
    const errors = [];
    if (!date) errors.push("fecha");
    if (!time) errors.push("hora");
    if (tempOut === null) errors.push("temp out");
    if (hiTemp === null) errors.push("hi temp");
    if (lowTemp === null) errors.push("low temp");
    if (expected.humidity >= 0 && humidity === null) errors.push("humedad");
    if (expected.windSpeed >= 0 && windSpeed === null) errors.push("velocidad viento");
    if (expected.precipitation >= 0 && precipitation === null) errors.push("precipitacion");
    if (hiTemp !== null && lowTemp !== null && hiTemp < lowTemp) errors.push("maxima menor que minima");
    if (errors.length) {
      if (invalidSamples.length < 5) invalidSamples.push({ row: index + 2, reason: errors.join(", ") });
      return;
    }
    validRows += 1;
    const key = `${date}|${time}`;
    if (unique.has(key)) duplicateRows += 1;
    const reading = {
      fecha: date,
      hora: time,
      temp_out: tempOut,
      hi_temp: hiTemp,
      low_temp: lowTemp,
      fuente: "excel_estacion"
    };
    if (expected.humidity >= 0) reading.humedad = humidity;
    if (expected.windSpeed >= 0) reading.velocidad_viento = windSpeed;
    if (expected.precipitation >= 0) reading.precipitacion = precipitation;
    unique.set(key, reading);
  });
  return {
    spreadsheetRows,
    validRows,
    duplicateRows,
    invalidRows: spreadsheetRows - validRows,
    invalidSamples,
    hasMeteoColumns: expected.humidity >= 0 || expected.windSpeed >= 0 || expected.precipitation >= 0,
    uniqueRows: [...unique.values()].sort((a, b) => `${a.fecha} ${a.hora}`.localeCompare(`${b.fecha} ${b.hora}`))
  };
}

function weatherStationReadingKey(row) {
  const date = stationExcelDate(row?.fecha) || String(row?.fecha || "").slice(0, 10);
  const time = stationExcelTime(row?.hora) || String(row?.hora || "").slice(0, 8);
  return date && time ? `${date}|${time}` : "";
}

async function loadManualRainRowsForRange(firstDate, lastDate) {
  if (!firstDate || !lastDate) return [];
  return sbSelectAll(
    "estacion_climatica",
    `select=fecha,hora,temp_out,hi_temp,low_temp,humedad,velocidad_viento,precipitacion,fuente&fecha=gte.${firstDate}&fecha=lte.${lastDate}&fuente=eq.bandeja_lluvia_manual&order=fecha.asc,hora.asc`
  );
}

function protectWeatherImportManualRainRows(rows, manualRows) {
  const manualKeys = new Set((manualRows || []).map(weatherStationReadingKey).filter(Boolean));
  if (!manualKeys.size) return { rows, skipped: 0 };
  const protectedRows = rows.filter((row) => !manualKeys.has(weatherStationReadingKey(row)));
  return {
    rows: protectedRows,
    skipped: rows.length - protectedRows.length
  };
}

async function restoreManualRainRows(manualRows) {
  const rows = (manualRows || [])
    .filter((row) => weatherStationReadingKey(row))
    .map((row) => ({
      fecha: stationExcelDate(row.fecha) || String(row.fecha).slice(0, 10),
      hora: stationExcelTime(row.hora) || String(row.hora).slice(0, 8),
      temp_out: row.temp_out,
      hi_temp: row.hi_temp,
      low_temp: row.low_temp,
      humedad: row.humedad,
      velocidad_viento: row.velocidad_viento,
      precipitacion: row.precipitacion,
      fuente: "bandeja_lluvia_manual"
    }));
  if (!rows.length) return;
  const batchSize = 200;
  for (let index = 0; index < rows.length; index += batchSize) {
    await sbFetch("/rest/v1/estacion_climatica?on_conflict=fecha%2Chora", {
      method: "POST",
      prefer: "resolution=merge-duplicates,return=minimal",
      body: JSON.stringify(rows.slice(index, index + batchSize))
    });
  }
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
    const importRows = parsed.hasMeteoColumns ? parsed.uniqueRows : newRows;
    weatherStationImportPreview = {
      ...parsed,
      fileName: file.name,
      sheetName,
      firstDate,
      lastDate,
      existingRows: parsed.uniqueRows.length - newRows.length,
      newRows,
      importRows,
      importMode: parsed.hasMeteoColumns ? "upsert-meteo" : "insert-new"
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
  const updateExistingRows = Math.max(0, preview.importRows.length - preview.newRows.length);
  const canImport = preview.importRows.length > 0;
  const actionLabel = preview.importMode === "upsert-meteo"
    ? `Actualizar ${number(preview.importRows.length, 0)} lecturas`
    : `Insertar ${number(preview.newRows.length, 0)} nuevas`;
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
        <article class="is-warning"><span>Actualizar meteo</span><strong>${number(updateExistingRows, 0)}</strong></article>
      </div>
      <div class="weather-import-note">
        <strong>${preview.importMode === "upsert-meteo" ? "Se insertaran nuevas lecturas y se actualizaran humedad, viento y lluvia en las existentes." : "Solo se insertaran las lecturas nuevas."}</strong>
        <span>Los registros se comparan mediante FECHA + HORA. Omitidas: ${number(preview.invalidRows + preview.duplicateRows, 0)}.</span>
      </div>
      ${invalidDetail}
      ${weatherStationImportFileInput()}
      <div class="modal-actions">
        <button class="secondary-button" type="button" data-action="choose-weather-station-excel">Cambiar archivo</button>
        <button class="primary-button" type="button" data-action="import-weather-station-excel" ${canImport ? "" : "disabled"}>${actionLabel}</button>
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
  const rowsToImport = preview?.importRows || preview?.newRows || [];
  if (!rowsToImport.length || !hasRole("admin")) return;
  let manualRainRows = [];
  let protectedRowsToImport = rowsToImport;
  let protectedManualCount = 0;
  try {
    manualRainRows = await loadManualRainRowsForRange(preview.firstDate, preview.lastDate);
    const protectedImport = protectWeatherImportManualRainRows(rowsToImport, manualRainRows);
    protectedRowsToImport = protectedImport.rows;
    protectedManualCount = protectedImport.skipped;
  } catch (error) {
    showToast(`No se pudo revisar lluvia manual: ${error.message}`);
    return;
  }
  if (!protectedRowsToImport.length) {
    showToast("No hay lecturas para importar sin tocar lluvia manual");
    return;
  }
  const protectedMessage = protectedManualCount
    ? `\n\nSe mantendran sin cambios ${protectedManualCount} lecturas de lluvia manual.`
    : "";
  const confirmation = preview.importMode === "upsert-meteo"
    ? `Actualizar ${protectedRowsToImport.length} lecturas en estacion_climatica? Esto rellenara humedad, viento y precipitacion en registros existentes.${protectedMessage}`
    : `Insertar ${protectedRowsToImport.length} lecturas nuevas en estacion_climatica?${protectedMessage}`;
  if (!confirm(confirmation)) return;
  const dialog = document.getElementById("weatherStationImportDialog");
  const loadingText = preview.importMode === "upsert-meteo" ? "Actualizando lecturas climaticas..." : "Insertando lecturas nuevas...";
  dialog.innerHTML = `
    <div class="modal-body weather-import-modal-body">
      <div class="modal-head"><div><h2>Actualizando base de datos</h2><p>${escapeHtml(preview.fileName)}</p></div></div>
      <div class="weather-import-loading" role="status" aria-live="polite"><span class="weather-import-spinner"></span><strong>${loadingText}</strong></div>
      <div class="weather-import-progress" id="weatherStationImportProgress"><div><i></i></div><strong>0 de ${number(protectedRowsToImport.length, 0)}</strong></div>
    </div>
  `;
  const batchSize = 500;
  let inserted = 0;
  try {
    for (let index = 0; index < protectedRowsToImport.length; index += batchSize) {
      const batch = protectedRowsToImport.slice(index, index + batchSize);
      await sbFetch("/rest/v1/estacion_climatica?on_conflict=fecha%2Chora", {
        method: "POST",
        prefer: `${preview.importMode === "upsert-meteo" ? "resolution=merge-duplicates" : "resolution=ignore-duplicates"},return=minimal`,
        body: JSON.stringify(batch)
      });
      inserted += batch.length;
      updateWeatherStationImportProgress(inserted, protectedRowsToImport.length);
    }
    await restoreManualRainRows(manualRainRows);
    weatherStationImportPreview = null;
    if (preview.lastDate) {
      weatherStationYear = preview.lastDate.slice(0, 4);
      weatherStationMonth = preview.lastDate.slice(5, 7) || "Todos";
    }
    await reloadCurrentCloudModules();
    dialog.close();
    if (currentView === "dashboard") renderDashboard();
    const protectedToast = protectedManualCount ? `; ${protectedManualCount} lluvias manuales protegidas` : "";
    showToast(preview.importMode === "upsert-meteo"
      ? `${inserted} lecturas actualizadas en la base de datos${protectedToast}`
      : `${inserted} lecturas nuevas agregadas a la base de datos${protectedToast}`);
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

function weatherStationDegreeSeason(year) {
  const endYear = Number(year) || new Date().getFullYear();
  return {
    start: `${endYear - 1}-10-01`,
    end: `${endYear}-10-31`,
    label: `Octubre ${endYear - 1} a octubre ${endYear}`
  };
}

function weatherStationDegreeSeasonRows(rows, year) {
  const season = weatherStationDegreeSeason(year);
  return rows.filter((row) => String(row.date || "") >= season.start && String(row.date || "") <= season.end);
}

function weatherWeightedAverage(rows, field) {
  const total = rows.reduce((acc, row) => {
    const value = Number(row[field]);
    const records = Number(row.records || 0);
    if (!Number.isFinite(value) || !records) return acc;
    acc.weighted += value * records;
    acc.records += records;
    return acc;
  }, { weighted: 0, records: 0 });
  return total.records ? total.weighted / total.records : null;
}

function weatherStationSummary(rows, degreeRows = rows) {
  if (!rows.length) {
    return { hasRows: false, records: 0, completeness: 0, degreeDays: 0, frostDays: 0, totalFrostHours: 0, frost0ToMinus1: 0, frostMinus1ToMinus2: 0, frostBelowMinus2: 0, precipitationTotal: 0, humidityAverage: null, windAverage: null, hasHumidity: false, hasWind: false };
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
  const humidityAverage = weatherWeightedAverage(rows, "humidityAverage");
  const windAverage = weatherWeightedAverage(rows, "windAverage");
  return {
    hasRows: true,
    records,
    completeness: records / (calendarDays * 96) * 100,
    minimum: Number(minimumRow.minimum),
    minimumDate: minimumRow.date,
    maximum: Number(maximumRow.maximum),
    maximumDate: maximumRow.date,
    degreeDays: degreeRows.reduce((sum, row) => sum + Number(row.degreeDays || 0), 0),
    precipitationTotal: rows.reduce((sum, row) => sum + Number(row.precipitationTotal || 0), 0),
    humidityAverage,
    windAverage,
    hasHumidity: humidityAverage !== null,
    hasWind: windAverage !== null,
    frostDays: rows.filter((row) => Number(row.minimum) <= 0).length,
    frost0ToMinus1,
    frostMinus1ToMinus2,
    frostBelowMinus2,
    totalFrostHours: frost0ToMinus1 + frostMinus1ToMinus2 + frostBelowMinus2
  };
}

function weatherFrostTotal(row) {
  return Number(row.frost0ToMinus1 || 0) + Number(row.frostMinus1ToMinus2 || 0) + Number(row.frostBelowMinus2 || 0);
}

function weatherStationFrostExportRows(rows) {
  const frostRows = rows.filter((row) => Number(row.minimum) <= 0).sort((a, b) => String(b.date).localeCompare(String(a.date)));
  if (!frostRows.length) return [{ Fecha: "Sin heladas registradas en el periodo" }];
  return frostRows.map((row) => ({
    Fecha: weatherStationDateLabel(row.date, { day: true }),
    Minima: `${number(row.minimum, 1)} C`,
    "Inicio - termino": weatherFrostWindowLabel(row),
    "0 a -1 C": `${number(row.frost0ToMinus1, 2)} h`,
    "-1 a -2 C": `${number(row.frostMinus1ToMinus2, 2)} h`,
    "<= -2 C": `${number(row.frostBelowMinus2, 2)} h`,
    Total: `${number(weatherFrostTotal(row), 2)} h`
  }));
}

function weatherStationRainExportRows(rows) {
  let accumulated = 0;
  const chronologicalAccum = new Map([...rows]
    .sort((a, b) => String(a.date).localeCompare(String(b.date)))
    .map((row) => {
      accumulated += Number(row.precipitationTotal || 0);
      return [row.date, accumulated];
    }));
  const rainRows = rows
    .filter((row) => Number(row.precipitationTotal || 0) > 0)
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));
  if (!rainRows.length) return [{ Fecha: "Sin lluvia registrada en el periodo" }];
  return rainRows.map((row) => ({
    Fecha: weatherStationDateLabel(row.date, { day: true }),
    Lluvia: `${number(row.precipitationTotal, 1)} mm`,
    "Acum periodo": `${number(chronologicalAccum.get(row.date) || 0, 1)} mm`
  }));
}

function exportWeatherStationWorkbook() {
  if (!window.XLSX) {
    showToast("No se pudo cargar el exportador Excel");
    return;
  }
  const rows = currentWeatherStationRows();
  if (!rows.length) {
    showToast("No hay datos climaticos para exportar en este periodo");
    return;
  }
  const workbook = window.XLSX.utils.book_new();
  const frostSheet = window.XLSX.utils.json_to_sheet(weatherStationFrostExportRows(rows));
  frostSheet["!cols"] = [{ wch: 18 }, { wch: 12 }, { wch: 28 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }];
  const rainSheet = window.XLSX.utils.json_to_sheet(weatherStationRainExportRows(rows));
  rainSheet["!cols"] = [{ wch: 18 }, { wch: 12 }, { wch: 14 }];
  window.XLSX.utils.book_append_sheet(workbook, frostSheet, "Heladas");
  window.XLSX.utils.book_append_sheet(workbook, rainSheet, "Lluvia");
  const period = weatherStationMonth === "Todos" ? "anio" : weatherStationMonth;
  window.XLSX.writeFile(workbook, `heladas_lluvias_${weatherStationYear}_${period}.xlsx`);
  showToast("Excel de heladas y lluvias exportado");
}

function weatherStationDateKey(value) {
  return String(value || "").slice(0, 10);
}

function weatherStationDailyDate(row) {
  return weatherStationDateKey(row?.fecha || row?.date);
}

function weatherStationLatestDailyDate(rows = []) {
  return rows.reduce((latest, row) => {
    const date = weatherStationDailyDate(row);
    return date && date > latest ? date : latest;
  }, "");
}

function roundWeatherValue(value, decimals = 2) {
  const factor = 10 ** decimals;
  return Math.round((Number(value) || 0) * factor) / factor;
}

function weatherStationDailyRowsFromReadings(readings = []) {
  const grouped = new Map();
  readings.forEach((reading) => {
    const date = weatherStationDateKey(reading.fecha);
    if (!date) return;
    const tempOut = Number(reading.temp_out);
    const hiTemp = Number(reading.hi_temp);
    const lowTemp = Number(reading.low_temp);
    const humidity = Number(reading.humedad);
    const windSpeed = Number(reading.velocidad_viento);
    const precipitation = Number(reading.precipitacion);
    if (![tempOut, hiTemp, lowTemp].every(Number.isFinite)) return;
    const bucket = grouped.get(date) || {
      fecha: date,
      registros: 0,
      tempSum: 0,
      humiditySum: 0,
      humidityCount: 0,
      windSum: 0,
      windCount: 0,
      precipitationTotal: 0,
      minLow: Infinity,
      maxHigh: -Infinity,
      above7: 0,
      frost0ToMinus1: 0,
      frostMinus1ToMinus2: 0,
      frostBelowMinus2: 0,
      frostReadings: []
    };
    bucket.registros += 1;
    bucket.tempSum += tempOut;
    if (Number.isFinite(humidity)) {
      bucket.humiditySum += humidity;
      bucket.humidityCount += 1;
    }
    if (Number.isFinite(windSpeed)) {
      bucket.windSum += windSpeed;
      bucket.windCount += 1;
    }
    if (Number.isFinite(precipitation)) bucket.precipitationTotal += precipitation;
    bucket.minLow = Math.min(bucket.minLow, lowTemp);
    bucket.maxHigh = Math.max(bucket.maxHigh, hiTemp);
    if (tempOut > 7) bucket.above7 += 1;
    if (tempOut <= 0 && tempOut > -1) bucket.frost0ToMinus1 += 1;
    if (tempOut <= -1 && tempOut > -2) bucket.frostMinus1ToMinus2 += 1;
    if (tempOut <= -2) bucket.frostBelowMinus2 += 1;
    if (tempOut <= 0) bucket.frostReadings.push(reading);
    grouped.set(date, bucket);
  });

  const frostWindowsByDate = weatherStationFrostWindowsByDate(readings);
  return [...grouped.values()].map((bucket) => {
    const degreeDays = Math.max(((bucket.maxHigh + bucket.minLow) / 2) - 7, 0);
    const frostWindow = frostWindowsByDate.get(bucket.fecha);
    return {
      fecha: bucket.fecha,
      registros: bucket.registros,
      temperatura_promedio: roundWeatherValue(bucket.tempSum / bucket.registros, 2),
      temperatura_minima: roundWeatherValue(bucket.minLow, 2),
      temperatura_maxima: roundWeatherValue(bucket.maxHigh, 2),
      humedad_promedio: bucket.humidityCount ? roundWeatherValue(bucket.humiditySum / bucket.humidityCount, 4) : null,
      velocidad_viento_promedio: bucket.windCount ? roundWeatherValue(bucket.windSum / bucket.windCount, 2) : null,
      precipitacion_acumulada: roundWeatherValue(bucket.precipitationTotal, 2),
      horas_sobre_7: roundWeatherValue(bucket.above7 * 0.25, 2),
      grados_dia_base_7: roundWeatherValue(degreeDays, 3),
      helada_0_menos_1: roundWeatherValue(bucket.frost0ToMinus1 * 0.25, 2),
      helada_menos_1_menos_2: roundWeatherValue(bucket.frostMinus1ToMinus2 * 0.25, 2),
      helada_menor_igual_menos_2: roundWeatherValue(bucket.frostBelowMinus2 * 0.25, 2),
      helada_inicio: frostWindow?.start || null,
      helada_termino: frostWindow?.end || null
    };
  }).sort((a, b) => String(a.fecha).localeCompare(String(b.fecha)));
}

function mergeWeatherStationDailyRows(viewRows = [], rawRows = []) {
  const byDate = new Map();
  viewRows.forEach((row) => {
    const date = weatherStationDailyDate(row);
    if (date) byDate.set(date, row);
  });
  rawRows.forEach((row) => {
    const date = weatherStationDailyDate(row);
    if (date) byDate.set(date, row);
  });
  return [...byDate.values()].sort((a, b) => weatherStationDailyDate(a).localeCompare(weatherStationDailyDate(b)));
}

async function completeWeatherStationDailyRows(viewRows = [], latestRows = []) {
  const latestRawDate = weatherStationDateKey(latestRows?.[0]?.fecha);
  const latestViewDate = weatherStationLatestDailyDate(viewRows);
  if (!latestRawDate || (latestViewDate && latestRawDate < latestViewDate)) return viewRows;

  const startDate = latestViewDate || `${latestRawDate.slice(0, 4)}-01-01`;
  try {
    const rawReadings = await sbSelectAll(
      "estacion_climatica",
      `select=fecha,hora,temp_out,hi_temp,low_temp,humedad,velocidad_viento,precipitacion&fecha=gte.${startDate}&order=fecha.asc,hora.asc`
    ).catch((error) => {
      if (!isMissingSupabaseColumn(error, ["humedad", "velocidad_viento", "precipitacion"])) throw error;
      return sbSelectAll(
        "estacion_climatica",
        `select=fecha,hora,temp_out,hi_temp,low_temp&fecha=gte.${startDate}&order=fecha.asc,hora.asc`
      );
    });
    const rawDailyRows = weatherStationDailyRowsFromReadings(rawReadings);
    return mergeWeatherStationDailyRows(viewRows, rawDailyRows);
  } catch (error) {
    console.warn("No se pudo completar el resumen diario desde estacion_climatica", error);
    return viewRows;
  }
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

function weatherRainSeries(rows) {
  if (weatherStationMonth !== "Todos") {
    return rows.map((row) => ({
      label: String(row.date).slice(8, 10),
      value: Number(row.precipitationTotal || 0),
      date: row.date
    }));
  }
  const months = new Map();
  rows.forEach((row) => {
    const key = String(row.date).slice(0, 7);
    const bucket = months.get(key) || { key, value: 0 };
    bucket.value += Number(row.precipitationTotal || 0);
    months.set(key, bucket);
  });
  return [...months.values()].map((bucket) => ({
    label: weatherStationDateLabel(`${bucket.key}-01`).split(" ")[0],
    value: bucket.value,
    date: `${bucket.key}-01`
  }));
}

function weatherRainChart(rows) {
  const series = weatherRainSeries(rows);
  if (!series.length) return '<div class="empty-state compact-empty"><strong>Sin datos para el periodo.</strong></div>';
  const maximum = Math.max(1, ...series.map((item) => Number(item.value || 0)));
  let accumulated = 0;
  return `
    <div class="weather-rain-chart">
      <div class="weather-rain-scroll">
        <div class="weather-rain-columns" style="--weather-rain-columns:${series.length}">
          ${series.map((item) => {
            const value = Number(item.value || 0);
            accumulated += value;
            const height = value > 0 ? Math.max(4, value / maximum * 100) : 1;
            return `<div class="weather-rain-column" title="${item.label}: lluvia ${number(value, 1)} mm, acum ${number(accumulated, 1)} mm">
              <span>${value > 0 ? number(value, 1) : "0"}</span>
              <div class="weather-rain-track"><i style="height:${height}%"></i></div>
              <strong>${item.label}</strong>
              <small>${number(accumulated, 0)}</small>
            </div>`;
          }).join("")}
        </div>
      </div>
    </div>`;
}

function weatherRainSummary(rows) {
  const rainRows = rows.filter((row) => Number(row.precipitationTotal || 0) > 0);
  const maxRow = rows.reduce((best, row) => Number(row.precipitationTotal || 0) > Number(best?.precipitationTotal || 0) ? row : best, rows[0] || null);
  return {
    rainDays: rainRows.length,
    total: rows.reduce((sum, row) => sum + Number(row.precipitationTotal || 0), 0),
    maxDaily: Number(maxRow?.precipitationTotal || 0),
    maxDate: maxRow?.date || "",
    averageRainDay: rainRows.length ? rainRows.reduce((sum, row) => sum + Number(row.precipitationTotal || 0), 0) / rainRows.length : 0
  };
}

function weatherRainSummaryCard(rows, summary) {
  const rain = weatherRainSummary(rows);
  return `
    <div class="weather-rain-summary">
      <div><span>Total periodo</span><strong>${number(summary.precipitationTotal, 1)} mm</strong></div>
      <div><span>Dias con lluvia</span><strong>${number(rain.rainDays, 0)}</strong></div>
      <div><span>Mayor dia</span><strong>${number(rain.maxDaily, 1)} mm</strong><small>${rain.maxDate ? weatherStationDateLabel(rain.maxDate, { day: true }) : "-"}</small></div>
      <div><span>Promedio dia lluvia</span><strong>${number(rain.averageRainDay, 1)} mm</strong></div>
    </div>`;
}

function weatherRainBands(rows) {
  const bands = [
    { label: "0,1 a 20 mm", value: rows.filter((row) => Number(row.precipitationTotal || 0) > 0 && Number(row.precipitationTotal || 0) <= 20).length, tone: "light" },
    { label: "Sobre 20 mm", value: rows.filter((row) => Number(row.precipitationTotal || 0) > 20).length, tone: "severe" }
  ];
  const maximum = Math.max(1, ...bands.map((band) => band.value));
  return `<div class="weather-frost-bands weather-rain-bands">${bands.map((band) => `
    <article class="weather-frost-band weather-rain-${band.tone}">
      <div><span>${band.label}</span><strong>${number(band.value, 0)} dias</strong></div>
      <div class="weather-frost-progress"><i style="width:${band.value / maximum * 100}%"></i></div>
    </article>`).join("")}</div>`;
}

function weatherRainTable(rows) {
  const allRows = rows
    .map((row) => ({ ...row, rain: Number(row.precipitationTotal || 0) }))
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));
  const visibleRows = allRows.filter((row) => row.rain > 0);
  if (!visibleRows.length) return '<div class="empty-state compact-empty"><strong>Sin lluvia registrada en el periodo.</strong></div>';
  let accumulated = 0;
  const chronologicalAccum = new Map([...allRows].reverse().map((row) => {
    accumulated += row.rain;
    return [row.date, accumulated];
  }));
  return `<div class="table-wrap weather-frost-table weather-rain-table"><table>
    <thead><tr><th>Fecha</th><th>Lluvia</th><th>Acum periodo</th><th>Humedad prom.</th><th>Viento prom.</th><th>Temp prom.</th></tr></thead>
    <tbody>${visibleRows.map((row) => `
      <tr>
        <td data-label="Fecha">${weatherStationDateLabel(row.date, { day: true })}</td>
        <td data-label="Lluvia"><strong>${number(row.rain, 1)} mm</strong></td>
        <td data-label="Acum periodo">${number(chronologicalAccum.get(row.date) || 0, 1)} mm</td>
        <td data-label="Humedad prom.">${row.humidityAverage === null || row.humidityAverage === undefined ? "-" : `${number(Number(row.humidityAverage) * 100, 1)}%`}</td>
        <td data-label="Viento prom.">${row.windAverage === null || row.windAverage === undefined ? "-" : number(row.windAverage, 1)}</td>
        <td data-label="Temp prom.">${number(row.average, 1)} °C</td>
      </tr>`).join("")}</tbody>
  </table></div>`;
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
  const varieties = ["Todas", ...new Set(speciesScoped.map((block) => block.variety || "Sin variedad").filter(Boolean))]
    .sort((a, b) => a === "Todas" ? -1 : b === "Todas" ? 1 : a.localeCompare(b, "es", { numeric: true }));
  if (irrigationVarietyFilter !== "Todas" && !varieties.includes(irrigationVarietyFilter)) irrigationVarietyFilter = "Todas";
  const varietyScoped = speciesScoped.filter((block) => irrigationVarietyFilter === "Todas" || (block.variety || "Sin variedad") === irrigationVarietyFilter);
  const potreros = ["Todos", ...new Set(varietyScoped.map((block) => block.potrero).filter(Boolean))].sort((a, b) => a === "Todos" ? -1 : b === "Todos" ? 1 : comparePotrero(a, b));
  if (irrigationPotreroFilter !== "Todos" && !potreros.includes(irrigationPotreroFilter)) irrigationPotreroFilter = "Todos";
  const filteredBlocks = varietyScoped
    .filter((block) => irrigationPotreroFilter === "Todos" || block.potrero === irrigationPotreroFilter)
    .sort(blockSort);
  const daysInMonth = new Date(Number(irrigationYear), Number(irrigationMonth), 0).getDate();
  const monthLabel = monthOptions().find((item) => item.value === irrigationMonth)?.label || irrigationMonth;
  const monthPrefix = `${irrigationYear}-${irrigationMonth}`;
  const monthDates = irrigationMonthDates(monthPrefix, daysInMonth);
  const dayClassMap = new Map(monthDates.map((date) => [date, irrigationDayClass(date)]));
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
  const calicataIndex = buildIrrigationGanttCalicataIndex(filteredBlocks, monthPrefix);
  const programMonthTotals = irrigationMonthTotals(irrigationProgramHours, filteredBlocks, monthPrefix, daysInMonth);
  const realMonthTotals = irrigationMonthTotals(irrigationHours, filteredBlocks, monthPrefix, daysInMonth);
  const bandejaRows = irrigationBandejaRows(monthPrefix, daysInMonth, bandejaEvaporationMap, bandejaHistoricalEvaporationMap);
  const balanceBlockRows = irrigationBalanceBlockRows(filteredBlocks, monthPrefix, daysInMonth);
  const showIrrigationFilterDrawer = irrigationTab !== "satellite";
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
      <label>Variedad
        <select id="irrigationVarietyFilter">${varieties.map((item) => `<option value="${htmlAttr(item)}" ${item === irrigationVarietyFilter ? "selected" : ""}>${escapeHtml(item)}</option>`).join("")}</select>
      </label>
      <label>Potrero
        <select id="irrigationPotreroFilter">${potreros.map((item) => `<option value="${htmlAttr(item)}" ${item === irrigationPotreroFilter ? "selected" : ""}>${escapeHtml(potreroLabel(item))}</option>`).join("")}</select>
      </label>
      <label>Mes
        <select id="irrigationMonthFilter">${monthOptions().map((month) => `<option value="${month.value}" ${month.value === irrigationMonth ? "selected" : ""}>${month.label}</option>`).join("")}</select>
      </label>
      <label>Ano
        <input id="irrigationYearFilter" type="number" min="2020" max="2100" step="1" value="${irrigationYear}">
      </label>
      ${irrigationTab === "gantt" ? `
        <button class="secondary-button" type="button" data-action="open-irrigation-base-hours-dialog">Horas base</button>
        <button class="primary-button" type="button" data-action="open-irrigation-program-dialog">Editar programa</button>
        <button class="secondary-button" type="button" data-action="open-selected-irrigation-observation" title="Selecciona una celda y usa Alt + O">Observacion</button>
        <button class="secondary-button" type="button" data-action="clear-irrigation-hours">Limpiar</button>` : ""}
    </div>`;

  views.irrigation.innerHTML = `
    <section class="panel irrigation-panel ${irrigationTab === "gantt" ? "irrigation-panel-gantt" : ""} ${irrigationTab === "satellite" ? "irrigation-panel-satellite" : ""}">
      ${showIrrigationFilterDrawer ? `
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
      ` : ""}
      ${irrigationTab === "bandejas" ? renderIrrigationBandejasPanel({
        year: irrigationYear
      }) : irrigationTab === "balance" ? renderIrrigationBalancePanel({
        blockRows: balanceBlockRows,
        monthPrefix,
        daysInMonth,
        monthLabel,
        year: irrigationYear
      }) : irrigationTab === "satellite" ? renderIrrigationSatellitePanel({
        filteredBlocks,
        monthPrefix,
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
          </div>
          ${blockGroups.map((group) => `
            <div class="irrigation-potrero-group irrigation-potrero-group-compact">
              <strong>Potrero ${escapeHtml(potreroLabel(group.potrero))}</strong>
              <span>${group.blocks.length} bloque${group.blocks.length === 1 ? "" : "s"}</span>
            </div>
            ${group.blocks.map((block) => {
              const programmedValues = Array.from({ length: daysInMonth }, (_, index) => {
                const date = `${monthPrefix}-${String(index + 1).padStart(2, "0")}`;
                return irrigationProgramHours[irrigationKey(block.id, date)] ?? "";
              });
              const programTotal = programMonthTotals.get(block.id) || 0;
              const programReposition = irrigationReposicion(programTotal, block.precipitation, historicalEvaporationTotal);
              const calicataKey = calicataBlockKey(block.potrero, block.block);
              const expanded = expandedCalicataKeys.has(calicataKey);
              const rowIndex = blockRowIndexMap.get(block.id) ?? 0;
              const blockCropLabel = `${block.crop || "-"}${block.variety ? ` - ${block.variety}` : ""}`;
              return `
                <div class="irrigation-row irrigation-program-row">
                  <div class="irrigation-block-label">
                    <strong>${block.block}</strong>
                    <span>${number(block.hectares)} ha</span>
                    <div class="irrigation-block-data">
                      <small class="irrigation-crop-variety" title="${htmlAttr(blockCropLabel)}">${escapeHtml(blockCropLabel)}</small>
                      <small class="irrigation-block-metric">
                        <span>Presipitacion ${irrigationBandejaLabel(block.precipitation)}</span>
                        <span>Caudal ${irrigationBandejaLabel(block.flow)}</span>
                        <span>${irrigationBaseHoursLabel(block)}</span>
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
                </div>
                <div class="irrigation-row calicata-row irrigation-program-spacer-row">
                  <div class="irrigation-block-label calicata-label">
                    <strong>Calicatas</strong>
                    <span>Referencia real</span>
                  </div>
                  <div class="irrigation-days calicata-days">
                    ${Array.from({ length: daysInMonth }, (_, index) => {
                      const date = `${monthPrefix}-${String(index + 1).padStart(2, "0")}`;
                      return `<span class="calicata-day-cell ${dayClassMap.get(date) || ""}"></span>`;
                    }).join("")}
                  </div>
                  <div class="irrigation-total calicata-label"></div>
                  <div class="irrigation-reposition calicata-label"></div>
                </div>
                ${expanded ? renderIrrigationProgramCalicataDetailRows(calicataKey, monthDates, dayClassMap) : ""}
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
            <strong>Potrero ${escapeHtml(potreroLabel(group.potrero))}</strong>
            <span>${group.blocks.length} bloque${group.blocks.length === 1 ? "" : "s"}</span>
          </div>
          ${group.blocks.map((block) => {
          const blockTotal = realMonthTotals.get(block.id) || 0;
          const programTotal = programMonthTotals.get(block.id) || 0;
          const programReposition = irrigationReposicion(programTotal, block.precipitation, historicalEvaporationTotal);
          const reposition = irrigationReposicion(blockTotal, block.precipitation, monthEvaporationTotal);
          const hoursDiff = irrigationDifferencePercent(blockTotal, programTotal);
          const repositionDiff = irrigationDifferencePercent(reposition, programReposition);
          const calicataKey = calicataBlockKey(block.potrero, block.block);
          const calicatas = calicataIndex.byBlock.get(calicataKey) || [];
          const calicata = calicataIndex.summaryByBlock.get(calicataKey) || EMPTY_CALICATA_SUMMARY;
          const expanded = expandedCalicataKeys.has(calicataKey);
          const rowIndex = blockRowIndexMap.get(block.id) ?? 0;
          const blockCropLabel = `${block.crop || "-"}${block.variety ? ` - ${block.variety}` : ""}`;
          return `
            <div class="irrigation-row">
              <div class="irrigation-block-label">
                <strong>${block.block}</strong>
                <span>${number(block.hectares)} ha</span>
                <div class="irrigation-block-data">
                  <small class="irrigation-crop-variety" title="${htmlAttr(blockCropLabel)}">${escapeHtml(blockCropLabel)}</small>
                  <small class="irrigation-block-metric">
                    <span>Presipitacion ${irrigationBandejaLabel(block.precipitation)}</span>
                    <span>Caudal ${irrigationBandejaLabel(block.flow)}</span>
                    <span>${irrigationBaseHoursLabel(block)}</span>
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
                  const dayKey = irrigationCalicataDayKey(calicataKey, date);
                  const dayCalicatas = calicataIndex.byDay.get(dayKey) || [];
                  if (!dayCalicatas.length) return `<span class="calicata-day-cell ${dayClassMap.get(date) || ""}"></span>`;
                  const daySummary = calicataIndex.summaryByDay.get(dayKey) || EMPTY_CALICATA_SUMMARY;
                  const label = daySummary.general === null ? dayCalicatas.length : number(daySummary.general);
                  const style = daySummary.general === null ? "" : ` style="${htmlAttr(calicataColorStyle(daySummary.general))}"`;
                  return `<span class="calicata-day-cell ${dayClassMap.get(date) || ""} has-calicata"${style} title="${dayCalicatas.length} calicata(s) · promedio ${daySummary.general === null ? "-" : number(daySummary.general)}">${label}</span>`;
                }).join("")}
              </div>
              <button class="icon-button calicata-toggle" type="button" data-action="toggle-calicatas" data-key="${htmlAttr(calicataKey)}" aria-expanded="${expanded}" title="${expanded ? "Ocultar calicatas" : "Ver calicatas"}">${expanded ? "^" : "v"}</button>
              <div class="irrigation-reposition calicata-label"></div>
              <div class="irrigation-difference irrigation-difference-hours calicata-label"></div>
              <div class="irrigation-difference irrigation-difference-reposition calicata-label"></div>
            </div>
            ${expanded ? renderIrrigationRealCalicataDetailRows(calicataKey, monthDates, dayClassMap, calicataIndex) : ""}
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
    irrigationVarietyFilter = "Todas";
    irrigationPotreroFilter = "Todos";
    irrigationBalancePotreroFilter = "Todos";
    irrigationBalanceSelectedPotreros = new Set();
    renderIrrigation();
  });
  document.getElementById("irrigationVarietyFilter")?.addEventListener("change", (event) => {
    irrigationVarietyFilter = event.target.value;
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
    if (irrigationTab === "satellite") {
      irrigationSatelliteDateFrom = "";
      irrigationSatelliteDateTo = "";
      irrigationSatelliteLastQueryKey = "";
    }
    renderIrrigation();
  });
  document.getElementById("irrigationYearFilter")?.addEventListener("change", (event) => {
    irrigationYear = String(event.target.value || new Date().getFullYear());
    if (irrigationTab === "bandejas") irrigationBandejaFocusPending = true;
    if (irrigationTab === "satellite") {
      irrigationSatelliteDateFrom = "";
      irrigationSatelliteDateTo = "";
      irrigationSatelliteLastQueryKey = "";
    }
    renderIrrigation();
  });
  const blocksById = new Map(filteredBlocks.map((block) => [block.id, block]));
  const hydrateCellFromEvent = (event) => {
    const input = event.target.closest?.(irrigationCellSelector());
    if (!input || !views.irrigation.contains(input)) return null;
    const context = irrigationInputContext(input);
    hydrateIrrigationInputTitle(input, context, blocksById.get(context?.blockId));
    return input;
  };
  views.irrigation.onmouseover = hydrateCellFromEvent;
  views.irrigation.onfocusin = (event) => {
    const input = hydrateCellFromEvent(event);
    if (input) selectIrrigationObservationCell(input);
  };
  views.irrigation.onclick = (event) => {
    const input = hydrateCellFromEvent(event);
    if (!input) return;
    selectIrrigationObservationCell(input);
    if (!isIrrigationCellEditor(input)) activateIrrigationCell(input);
  };
  views.irrigation.onfocusout = (event) => {
    const input = event.target.closest?.(irrigationCellSelector());
    if (!input || !views.irrigation.contains(input) || !isIrrigationCellEditor(input)) return;
    createIrrigationCellFromEditor(input);
  };
  views.irrigation.onkeydown = (event) => {
    const input = event.target.closest?.(irrigationCellSelector());
    if (!input || !views.irrigation.contains(input)) return;
    const context = irrigationInputContext(input);
    hydrateIrrigationInputTitle(input, context, blocksById.get(context?.blockId));
    if ((event.altKey && event.key.toLowerCase() === "o") || (event.shiftKey && event.key === "F2")) {
      selectIrrigationObservationCell(input);
      openIrrigationObservationForInput(input);
      event.preventDefault();
      return;
    }
    if (!isIrrigationCellEditor(input)) {
      const editableKey = /^[0-9.,]$/.test(event.key);
      if (event.key === "Enter" || event.key === "F2") {
        activateIrrigationCell(input);
        event.preventDefault();
        return;
      }
      if (event.key === "Backspace" || event.key === "Delete" || editableKey) {
        const editor = activateIrrigationCell(input, false);
        editor.value = editableKey ? event.key.replace(",", ".") : "";
        editor.dispatchEvent(new Event("input", { bubbles: true }));
        editor.select?.();
        event.preventDefault();
        return;
      }
    }
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
    if (focusIrrigationCellFromKeyboard(input, event.key)) event.preventDefault();
  };
  views.irrigation.oninput = (event) => {
    const target = event.target.closest?.(irrigationCellSelector());
    if (!target || !views.irrigation.contains(target)) return;
    const context = irrigationInputContext(target);
    if (!context) return;
    const block = blocksById.get(context.blockId) || state.blocks.find((item) => item.id === context.blockId);
    const value = Number(irrigationCellValue(target));
    const key = irrigationKey(context.blockId, context.date);
    if (context.kind === "program") {
      if (irrigationCellValue(target) === "" || value <= 0) {
        delete irrigationProgramHours[key];
        clearIrrigationCellAudit("program", context.blockId, context.date);
      } else {
        irrigationProgramHours[key] = value;
        setIrrigationCellAudit("program", context.blockId, context.date);
      }
      delete target.dataset.titleSignature;
      hydrateIrrigationInputTitle(target, context, block);
      target.classList.toggle("has-hours", Boolean(irrigationProgramHours[key]));
      target.classList.toggle("has-audit", Boolean(irrigationProgramAudit[key]));
      scheduleIrrigationLocalSave("program");
      const programTotal = Array.from({ length: daysInMonth }, (_, index) => {
        const date = `${monthPrefix}-${String(index + 1).padStart(2, "0")}`;
        return Number(irrigationProgramHours[irrigationKey(context.blockId, date)]) || 0;
      }).reduce((sum, item) => sum + item, 0);
      const reposition = irrigationReposicion(programTotal, block?.precipitation, historicalEvaporationTotal);
      const totalCell = views.irrigation.querySelector(`[data-program-total="${CSS.escape(context.blockId)}"]`);
      const repositionCell = views.irrigation.querySelector(`[data-program-reposition="${CSS.escape(context.blockId)}"]`);
      if (totalCell) totalCell.textContent = number(programTotal);
      if (repositionCell) repositionCell.textContent = irrigationReposicionLabel(reposition);
      updateIrrigationComparisonCells(context.blockId, daysInMonth, monthPrefix, historicalEvaporationTotal, monthEvaporationTotal);
      scheduleIrrigationProgramCellSave(context.blockId, context.date, irrigationCellValue(target));
      return;
    }
    if (irrigationCellValue(target) === "" || value <= 0) {
      delete irrigationHours[key];
      clearIrrigationCellAudit("real", context.blockId, context.date);
    } else {
      irrigationHours[key] = value;
      setIrrigationCellAudit("real", context.blockId, context.date);
    }
    delete target.dataset.titleSignature;
    hydrateIrrigationInputTitle(target, context, block);
    target.classList.toggle("has-hours", Boolean(irrigationHours[key]));
    target.classList.toggle("has-audit", Boolean(irrigationAudit[key]));
    scheduleIrrigationLocalSave("real");
    scheduleIrrigationCellSave(context.blockId, context.date, irrigationCellValue(target));
    const blockTotal = Array.from({ length: daysInMonth }, (_, index) => {
      const date = `${monthPrefix}-${String(index + 1).padStart(2, "0")}`;
      return Number(irrigationHours[irrigationKey(context.blockId, date)]) || 0;
    }).reduce((sum, item) => sum + item, 0);
    const totalCell = views.irrigation.querySelector(`[data-block-total="${CSS.escape(context.blockId)}"]`);
    if (totalCell) totalCell.textContent = number(blockTotal);
    const reposition = irrigationReposicion(blockTotal, block?.precipitation, monthEvaporationTotal);
    const repositionCell = views.irrigation.querySelector(`[data-block-reposition="${CSS.escape(context.blockId)}"]`);
    if (repositionCell) repositionCell.textContent = irrigationReposicionLabel(reposition);
    updateIrrigationComparisonCells(context.blockId, daysInMonth, monthPrefix, historicalEvaporationTotal, monthEvaporationTotal);
  };
  if (irrigationTab === "bandejas") wireIrrigationBandejaMatrix();
  if (irrigationTab === "satellite") wireIrrigationSatellitePanel(filteredBlocks, monthPrefix);
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
            <select id="calicataPotreroFilter">${potreros.map((item) => `<option value="${htmlAttr(item)}" ${item === calicataPotreroFilter ? "selected" : ""}>${escapeHtml(potreroLabel(item))}</option>`).join("")}</select>
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
  document.getElementById("irrigationCalicataPotreroLabels")?.addEventListener("change", (event) => {
    irrigationCalicataShowPotreroLabels = event.target.checked;
    renderIrrigationCalicatasMap(filteredBlocks, monthPrefix);
  });
  if (currentView === "calicatas") renderIrrigationCalicatasMap(filteredBlocks, monthPrefix);
}

function syncIrrigationGanttScroll() {
  const program = views.irrigation.querySelector(".irrigation-gantt-program");
  const real = views.irrigation.querySelector(".irrigation-gantt-real");
  if (!program || !real) return;
  let syncing = false;
  let frame = 0;
  const maxScrollTop = (element) => Math.max(0, element.scrollHeight - element.clientHeight);
  const syncedTop = (source, target) => {
    const sourceMax = maxScrollTop(source);
    const targetMax = maxScrollTop(target);
    if (!sourceMax || !targetMax) return source.scrollTop;
    return (source.scrollTop / sourceMax) * targetMax;
  };
  const applySync = (source, target, immediate = false) => {
    if (syncing) return;
    cancelAnimationFrame(frame);
    const run = () => {
      syncing = true;
      const nextTop = syncedTop(source, target);
      if (target.scrollLeft !== source.scrollLeft) target.scrollLeft = source.scrollLeft;
      if (Math.abs(target.scrollTop - nextTop) > 1) target.scrollTop = nextTop;
      requestAnimationFrame(() => { syncing = false; });
    };
    if (immediate) run();
    else frame = requestAnimationFrame(run);
  };
  const syncFromScroll = (source, target) => applySync(source, target);
  const syncWheel = (source, target, event) => {
    if (!event.deltaY && !event.deltaX) return;
    const sourceTopBefore = source.scrollTop;
    const sourceLeftBefore = source.scrollLeft;
    source.scrollTop += event.deltaY;
    source.scrollLeft += event.deltaX;
    const consumed = source.scrollTop !== sourceTopBefore || source.scrollLeft !== sourceLeftBefore;
    if (!consumed) return;
    event.preventDefault();
    applySync(source, target, true);
  };
  program.addEventListener("scroll", () => syncFromScroll(program, real), { passive: true });
  real.addEventListener("scroll", () => syncFromScroll(real, program), { passive: true });
  program.addEventListener("wheel", (event) => syncWheel(program, real, event), { passive: false });
  real.addEventListener("wheel", (event) => syncWheel(real, program, event), { passive: false });
}

function irrigationGanttScrollSnapshot() {
  const program = views.irrigation?.querySelector(".irrigation-gantt-program");
  const real = views.irrigation?.querySelector(".irrigation-gantt-real");
  const ratio = (element) => {
    if (!element) return 0;
    const max = Math.max(0, element.scrollHeight - element.clientHeight);
    return max ? element.scrollTop / max : 0;
  };
  return {
    programLeft: program?.scrollLeft || 0,
    programTop: program?.scrollTop || 0,
    programRatio: ratio(program),
    realLeft: real?.scrollLeft || 0,
    realTop: real?.scrollTop || 0,
    realRatio: ratio(real)
  };
}

function irrigationGanttAnchorSnapshot(target) {
  const element = target?.closest?.(".irrigation-gantt");
  if (!target || !element) return null;
  const targetRect = target.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();
  return {
    selector: `[data-action="toggle-calicatas"][data-key="${CSS.escape(target.dataset.key || "")}"]`,
    ganttClass: element.classList.contains("irrigation-gantt-program") ? "irrigation-gantt-program" : "irrigation-gantt-real",
    offsetTop: targetRect.top - elementRect.top,
    scrollTop: element.scrollTop,
    scrollLeft: element.scrollLeft
  };
}

function restoreIrrigationGanttAnchor(snapshot) {
  if (!snapshot) return;
  requestAnimationFrame(() => requestAnimationFrame(() => {
    const element = views.irrigation?.querySelector(`.${snapshot.ganttClass}`);
    const target = element?.querySelector(snapshot.selector);
    if (!element || !target) return;
    element.scrollLeft = snapshot.scrollLeft || 0;
    const elementRect = element.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    element.scrollTop += (targetRect.top - elementRect.top) - snapshot.offsetTop;
  }));
}

function restoreIrrigationGanttScroll(snapshot) {
  if (!snapshot) return;
  requestAnimationFrame(() => requestAnimationFrame(() => {
    const program = views.irrigation?.querySelector(".irrigation-gantt-program");
    const real = views.irrigation?.querySelector(".irrigation-gantt-real");
    const apply = (element, left, top, ratio) => {
      if (!element) return;
      const max = Math.max(0, element.scrollHeight - element.clientHeight);
      element.scrollLeft = left || 0;
      element.scrollTop = Number.isFinite(top) ? Math.min(top, max) : max * (ratio || 0);
    };
    apply(program, snapshot.programLeft, snapshot.programTop, snapshot.programRatio);
    apply(real, snapshot.realLeft, snapshot.realTop, snapshot.realRatio);
  }));
}

function normalizeFertilizerTankRow(row) {
  const rawPotreros = Array.isArray(row.potreros)
    ? row.potreros
    : Array.isArray(row.potreros_json)
      ? row.potreros_json.map((item) => item?.potrero)
      : String(row.potreros || "").split(",");
  const potreros = [...new Set(rawPotreros.map((item) => String(item || "").trim()).filter(Boolean))]
    .sort(comparePotrero);
  const maxLiters = Number(row.volumen_maximo_litros) || 0;
  const currentLiters = Math.max(0, Number(row.litros_actuales) || 0);
  return {
    id: row.id || `${row.caseta_key || row.caseta}-${row.estanque_key || row.numero_estanque}-${row.fip_key || row.fip}-${maxLiters}`,
    caseta: row.caseta || "Sin caseta",
    casetaKey: row.caseta_key || row.caseta || "",
    numeroEstanque: row.numero_estanque || row.numeroEstanque || "Sin estanque",
    fip: row.fip || "Sin FIP",
    volumenMaximoLitros: maxLiters,
    litrosActuales: currentLiters,
    litrosPreparados: Number(row.litros_preparados) || 0,
    litrosAplicados: Number(row.litros_aplicados) || 0,
    ultimaPreparacion: row.ultima_preparacion || "",
    ultimaAplicacion: row.ultima_aplicacion || "",
    potreros
  };
}

function normalizeFertilizerProduct(row) {
  return {
    id: row.id,
    name: row.nombre_comercial || row.nombre_normalizado || "Producto",
    key: fertilizerReportKey(row.nombre_normalizado || row.nombre_comercial),
    unit: String(row.unidad || "").toUpperCase() || "KG"
  };
}

function normalizeFertilizerCaseta(row) {
  return {
    id: row.id,
    name: row.nombre || row.nombre_normalizado || "Sin caseta",
    key: fertilizerReportKey(row.nombre_normalizado || row.nombre)
  };
}

function fertilizerStockKey(casetaId, productId) {
  return `${casetaId || ""}|${productId || ""}`;
}

function computeFertilizerStockRows({ lots = [], preparations = [], products = [], casetas = [], tanks = [] } = {}) {
  const productsById = new Map(products.map((product) => [product.id, product]));
  const productsByKey = new Map(products.map((product) => [product.key, product]));
  const casetasById = new Map(casetas.map((caseta) => [caseta.id, caseta]));
  const tanksById = new Map(tanks.map((tank) => [tank.id, tank]));
  const rows = new Map();
  const ensureRow = (casetaId, productId) => {
    const product = productsById.get(productId);
    const caseta = casetasById.get(casetaId);
    const key = fertilizerStockKey(casetaId, productId);
    if (!rows.has(key)) {
      rows.set(key, {
        key,
        casetaId,
        caseta: caseta?.name || "Sin caseta",
        productId,
        product: product?.name || "Producto sin maestro",
        unit: product?.unit || "KG",
        initial: 0,
        consumed: 0,
        available: 0,
        lots: [],
        folios: []
      });
    }
    return rows.get(key);
  };

  lots.forEach((lot) => {
    const casetaId = lot.caseta_id || "";
    const productId = lot.producto_id || "";
    if (!casetaId || !productId) return;
    const row = ensureRow(casetaId, productId);
    const quantity = Number(lot.cantidad_total) || 0;
    row.initial += quantity;
    if (lot.lote) row.lots.push(String(lot.lote));
    if (lot.folio) row.folios.push(String(lot.folio));
  });

  preparations.forEach((preparation) => {
    const tank = tanksById.get(preparation.estanque_id);
    const casetaId = tank?.caseta_id || "";
    if (!casetaId) return;
    let product = productsById.get(preparation.producto_id);
    if (!product) product = productsByKey.get(fertilizerReportKey(preparation.producto || preparation.producto_nombre || preparation.nombre_producto));
    if (!product?.id) return;
    const row = ensureRow(casetaId, product.id);
    row.consumed += Number(preparation.producto_cantidad) || 0;
  });

  return [...rows.values()].map((row) => ({
    ...row,
    available: row.initial - row.consumed,
    lots: [...new Set(row.lots)].slice(0, 4),
    folios: [...new Set(row.folios)].slice(0, 4)
  })).sort((a, b) =>
    a.caseta.localeCompare(b.caseta, "es", { numeric: true })
    || a.product.localeCompare(b.product, "es", { numeric: true })
  );
}

async function loadFertilizerPreparationsForModule() {
  return sbSelectAll("fertilizante_preparaciones", "select=*&order=fecha.desc,creado_en.desc", 5000);
}

async function loadFertilizerApplicationsForModule() {
  return sbSelectAll("fertilizante_aplicaciones", "select=*&order=fecha.desc,creado_en.desc", 5000);
}

async function loadFertilizerUserNamesForHistory(rows = []) {
  const ids = [...new Set(rows.flatMap((row) => [row.responsable_id, row.creado_por, row.modificado_por]).filter(Boolean))];
  const names = new Map();
  if (currentProfile?.id && currentProfile?.full_name) names.set(currentProfile.id, currentProfile.full_name);
  if (supabaseSession?.user?.id) names.set(
    supabaseSession.user.id,
    currentProfile?.full_name || currentProfile?.nombre_completo || supabaseSession.user.email || ""
  );
  if (!ids.length) return names;
  try {
    const users = await sbSelectAll("usuarios", `select=id,nombre_completo&id=in.(${ids.join(",")})`, 1000);
    users.forEach((user) => {
      if (user.id) names.set(user.id, user.nombre_completo || "");
    });
  } catch (error) {
    console.warn("No se pudieron cargar nombres de usuarios para fertilizantes", error);
  }
  return names;
}

async function loadFertilizerRowsFromSupabase() {
  fertilizerStockError = "";
  fertilizerHistoryLoadError = "";
  const historyErrors = [];
  const [rows, productsRaw, casetasRaw, tanksRaw, fieldsRaw, preparationsRaw, applicationsRaw, lotsRaw] = await Promise.all([
    sbSelectAll(
      "v_fertilizante_estado_estanques",
      "select=id,caseta,caseta_key,numero_estanque,estanque_key,fip,fip_key,volumen_maximo_litros,litros_actuales,litros_preparados,litros_aplicados,ultima_preparacion,ultima_aplicacion,potreros,potreros_json,activo&activo=eq.true&order=caseta.asc,numero_estanque.asc,fip.asc",
      1000
    ),
    sbSelectAll("fertilizante_productos", "select=id,nombre_comercial,nombre_normalizado,unidad&activo=eq.true&order=nombre_comercial.asc", 1000).catch(() => []),
    sbSelectAll("fertilizante_casetas", "select=id,nombre,nombre_normalizado&activo=eq.true&order=nombre.asc", 1000).catch(() => []),
    sbSelectAll("fertilizante_estanques", "select=id,caseta_id,numero_estanque,fip,volumen_maximo_litros&activo=eq.true&order=numero_estanque.asc,fip.asc", 1000).catch(() => []),
    sbSelectAll("campos", "select=id,potrero,bloque,especie,variedad,hectareas,activo&activo=eq.true&order=potrero.asc,bloque.asc", 5000).catch(() => []),
    loadFertilizerPreparationsForModule().catch((error) => {
      console.warn("No se pudo cargar el historial de preparaciones", error);
      historyErrors.push(`Preparaciones: ${error.message || "error de lectura"}`);
      return [];
    }),
    loadFertilizerApplicationsForModule().catch((error) => {
      console.warn("No se pudo cargar el historial de aplicaciones", error);
      historyErrors.push(`Aplicaciones: ${error.message || "error de lectura"}`);
      return [];
    }),
    sbSelectAll("fertilizante_lotes", "select=id,caseta_id,producto_id,fecha,folio,lote,unidad,cantidad_total,observacion,creado_en&activo=eq.true&order=fecha.desc,creado_en.desc", 5000).catch((error) => {
      if (!isMissingSupabaseRelation(error, ["fertilizante_lotes"])) throw error;
      fertilizerStockError = "Ejecuta supabase_fertilizacion_lotes.sql para activar el inventario por caseta.";
      return [];
    })
  ]);
  if (!rows.length) throw new Error("Sin estanques de fertilizacion en Supabase");
  fertilizerProducts = productsRaw.map(normalizeFertilizerProduct);
  fertilizerCasetas = casetasRaw.map(normalizeFertilizerCaseta);
  fertilizerTanks = tanksRaw;
  fertilizerFields = fieldsRaw.map((field) => ({
    id: field.id,
    potrero: field.potrero || "",
    block: field.bloque || "",
    crop: field.especie || "",
    variety: field.variedad || "",
    hectares: Number(field.hectareas) || 0
  })).sort((a, b) => comparePotrero(a.potrero, b.potrero) || String(a.block).localeCompare(String(b.block), "es", { numeric: true }));
  fertilizerStockLots = lotsRaw;
  fertilizerPreparationHistory = preparationsRaw;
  fertilizerApplicationHistory = applicationsRaw;
  fertilizerHistoryLoadError = historyErrors.join(" | ");
  fertilizerUserNames = await loadFertilizerUserNamesForHistory([...preparationsRaw, ...applicationsRaw]);
  fertilizerStockRows = computeFertilizerStockRows({
    lots: lotsRaw,
    preparations: preparationsRaw,
    products: fertilizerProducts,
    casetas: fertilizerCasetas,
    tanks: tanksRaw
  });
  fertilizerDataSource = "Supabase";
  return rows.map(normalizeFertilizerTankRow);
}

async function loadFertilizerRowsFromLocalBackup() {
  const response = await fetch("outputs/fertilizacion_estanques.json?v=3", { cache: "force-cache" });
  if (!response.ok) throw new Error(`No se pudo cargar fertilizacion (${response.status})`);
  const collection = await response.json();
  fertilizerStockRows = [];
  fertilizerStockLots = [];
  fertilizerProducts = [];
  fertilizerCasetas = [];
  fertilizerTanks = [];
  fertilizerFields = [];
  fertilizerPreparationHistory = [];
  fertilizerApplicationHistory = [];
  fertilizerUserNames = new Map();
  fertilizerHistoryLoadError = "El historial requiere conexion con Supabase.";
  fertilizerStockError = "Inventario por caseta disponible solo con Supabase.";
  fertilizerDataSource = "Respaldo local";
  return (collection.records || []).map(normalizeFertilizerTankRow);
}

async function loadFertilizerRows() {
  if (fertilizerRows) return fertilizerRows;
  if (fertilizerLoadPromise) return fertilizerLoadPromise;
  fertilizerLoadPromise = (async () => {
    try {
      fertilizerRows = await loadFertilizerRowsFromSupabase();
    } catch (error) {
      console.warn("Fertilizantes usa respaldo local", error);
      fertilizerRows = await loadFertilizerRowsFromLocalBackup();
    }
    fertilizerRows.sort((a, b) =>
      a.caseta.localeCompare(b.caseta, "es", { numeric: true })
      || a.numeroEstanque.localeCompare(b.numeroEstanque, "es", { numeric: true })
      || a.fip.localeCompare(b.fip, "es", { numeric: true })
    );
    fertilizerLoadError = "";
    return fertilizerRows;
  })().catch((error) => {
    fertilizerLoadError = error.message || "No se pudo cargar fertilizantes";
    throw error;
  }).finally(() => { fertilizerLoadPromise = null; });
  return fertilizerLoadPromise;
}

function fertilizerTankStatus(row) {
  if (!row.volumenMaximoLitros) return "sin-capacidad";
  const ratio = row.litrosActuales / row.volumenMaximoLitros;
  if (row.litrosActuales <= 0) return "vacio";
  if (ratio <= 0.15) return "critico";
  if (ratio <= 0.35) return "bajo";
  if (ratio >= 0.95) return "lleno";
  return "operativo";
}

function fertilizerFilteredRows() {
  return (fertilizerRows || []).filter((row) => {
    if (fertilizerCasetaFilter !== "Todas" && row.caseta !== fertilizerCasetaFilter) return false;
    if (fertilizerPotreroFilter !== "Todos" && !row.potreros.includes(fertilizerPotreroFilter)) return false;
    if (fertilizerStatusFilter !== "Todos" && fertilizerTankStatus(row) !== fertilizerStatusFilter) return false;
    return true;
  });
}

const FERTILIZER_NUTRIENTS = ["n", "p", "k", "b", "zn", "mg", "ca", "ah", "af"];

function fertilizerReportKey(value = "") {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ")
    .toUpperCase();
}

function fertilizerReportDateTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString("es-CL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function fertilizerReportNumber(value, digits = 3) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 0;
  const factor = 10 ** digits;
  return Math.round(numeric * factor) / factor;
}

function formatFertilizerReportSheet(sheet) {
  if (!sheet?.["!ref"] || !window.XLSX?.utils?.decode_range) return;
  const range = window.XLSX.utils.decode_range(sheet["!ref"]);
  const headers = new Map();
  for (let column = range.s.c; column <= range.e.c; column += 1) {
    const address = window.XLSX.utils.encode_cell({ r: 0, c: column });
    const value = sheet[address]?.v;
    if (value) headers.set(String(value), column);
  }
  const formats = {
    "LITROS AGUA PREPARACION": "0.###",
    "CANTIDAD PRODUCTO APLICADO": "0.###",
    "DISOLUCION": "0.####",
    "HECTAREAS": "0.0",
    "LITROS APLICADOS": "0.###",
    "KG APLICADOS": "0.###",
    "KG/HA APLICADOS": "0.###",
    ...Object.fromEntries(FERTILIZER_NUTRIENTS.map((nutrient) => [`APORTE ${nutrient.toUpperCase()}`, "0.###"]))
  };
  Object.entries(formats).forEach(([header, format]) => {
    const column = headers.get(header);
    if (column === undefined) return;
    for (let row = 1; row <= range.e.r; row += 1) {
      const address = window.XLSX.utils.encode_cell({ r: row, c: column });
      if (!sheet[address]) continue;
      sheet[address].t = "n";
      sheet[address].z = format;
    }
  });
}

function fertilizerPreparationTime(row) {
  const date = new Date(row.fecha || row.creado_en || "");
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function fertilizerApplicationTime(row) {
  const date = new Date(row.fecha || row.creado_en || "");
  return Number.isNaN(date.getTime()) ? Date.now() : date.getTime();
}

function fertilizerProductForRecord(record, productsById, productsByKey) {
  if (!record) return null;
  if (record.producto_id && productsById.has(record.producto_id)) return productsById.get(record.producto_id);
  const productKey = fertilizerReportKey(record.producto || record.producto_nombre || record.nombre_producto);
  return productsByKey.get(productKey) || null;
}

function fertilizerPreparationBatch(application, preparations) {
  if (!preparations?.length) return [];
  const appTime = fertilizerApplicationTime(application);
  const eligible = preparations.filter((prep) => fertilizerPreparationTime(prep) <= appTime);
  const anchor = (eligible.length ? eligible : preparations).at(-1);
  const anchorTime = fertilizerPreparationTime(anchor);
  const batchWindowMs = 5 * 60 * 1000;
  return preparations.filter((prep) => Math.abs(fertilizerPreparationTime(prep) - anchorTime) <= batchWindowMs);
}

async function loadFertilizerReportRows() {
  if (!supabaseSession?.access_token) throw new Error("Inicia sesion para descargar el informe desde Supabase");
  if (!fertilizerRows) await loadFertilizerRows();
  const visibleRows = fertilizerFilteredRows();
  const activeFilter = fertilizerCasetaFilter !== "Todas" || fertilizerPotreroFilter !== "Todos" || fertilizerStatusFilter !== "Todos";
  const visibleTankIds = new Set(visibleRows.map((row) => row.id));
  const visibleTankKeys = new Set(visibleRows.map((row) =>
    `${fertilizerReportKey(row.caseta)}|${fertilizerReportKey(row.numeroEstanque)}|${fertilizerReportKey(row.fip)}|${Number(row.volumenMaximoLitros) || 0}`
  ));
  const [applications, preparations, products, tanks, casetas, campos] = await Promise.all([
    sbSelectAll("fertilizante_aplicaciones", "select=*&order=fecha.desc", 5000),
    sbSelectAll("fertilizante_preparaciones", "select=*&order=fecha.asc", 5000),
    sbSelectAll("fertilizante_productos", "select=*&activo=eq.true&order=nombre_comercial.asc", 1000),
    sbSelectAll("fertilizante_estanques", "select=id,caseta_id,numero_estanque,fip,volumen_maximo_litros&activo=eq.true", 1000),
    sbSelectAll("fertilizante_casetas", "select=id,nombre,nombre_normalizado&activo=eq.true", 1000),
    sbSelectAll("campos", "select=id,potrero,bloque,hectareas", 5000)
  ]);

  const tanksById = new Map(tanks.map((tank) => [tank.id, tank]));
  const casetasById = new Map(casetas.map((caseta) => [caseta.id, caseta]));
  const productsById = new Map(products.map((product) => [product.id, product]));
  const productsByKey = new Map(products.map((product) => [fertilizerReportKey(product.nombre_normalizado || product.nombre_comercial), product]));
  const camposById = new Map(campos.map((campo) => [campo.id, campo]));
  const camposByPotreroBloque = new Map(campos.map((campo) => [`${fertilizerReportKey(campo.potrero)}|${fertilizerReportKey(campo.bloque)}`, campo]));
  const preparationsByTank = new Map();
  preparations.forEach((prep) => {
    if (!preparationsByTank.has(prep.estanque_id)) preparationsByTank.set(prep.estanque_id, []);
    preparationsByTank.get(prep.estanque_id).push(prep);
  });
  preparationsByTank.forEach((items) => items.sort((a, b) => fertilizerPreparationTime(a) - fertilizerPreparationTime(b)));

  const tankVisibleByApplication = (application) => {
    if (!activeFilter) return true;
    if (visibleTankIds.has(application.estanque_id)) return true;
    const tank = tanksById.get(application.estanque_id);
    const caseta = casetasById.get(tank?.caseta_id);
    const key = `${fertilizerReportKey(caseta?.nombre)}|${fertilizerReportKey(tank?.numero_estanque)}|${fertilizerReportKey(tank?.fip)}|${Number(tank?.volumen_maximo_litros) || 0}`;
    return visibleTankKeys.has(key);
  };
  const filteredApplications = applications.filter(tankVisibleByApplication);
  const rows = [];
  filteredApplications.forEach((application) => {
    const tank = tanksById.get(application.estanque_id) || {};
    const caseta = casetasById.get(tank.caseta_id) || {};
    const campo = camposById.get(application.campo_id)
      || camposByPotreroBloque.get(`${fertilizerReportKey(application.potrero)}|${fertilizerReportKey(application.bloque)}`)
      || {};
    const batch = fertilizerPreparationBatch(application, preparationsByTank.get(application.estanque_id));
    const lines = batch.length ? batch : [null];
    const appliedLiters = Number(application.cantidad_litros) || 0;
    const hectares = Number(campo.hectareas ?? application.hectareas) || 0;

    lines.forEach((preparation) => {
      const product = fertilizerProductForRecord(preparation, productsById, productsByKey);
      const preparationWater = Number(preparation?.cantidad_litros) || 0;
      const productApplied = Number(preparation?.producto_cantidad) || 0;
      const dissolution = preparationWater > 0 ? productApplied / preparationWater : 0;
      const unit = String(preparation?.producto_unidad || product?.unidad || "").toUpperCase();
      const kgApplied = appliedLiters * dissolution;
      const kgHaApplied = hectares > 0 ? kgApplied / hectares : 0;
      const row = {
        "FECHA PREPARACION": fertilizerReportDateTime(preparation?.fecha || preparation?.creado_en),
        "FECHA APLICACION": fertilizerReportDateTime(application.fecha || application.creado_en),
        "CASETA": caseta.nombre || "",
        "NRO ESTANQUE": tank.numero_estanque || "",
        "PRODUCTO": product?.nombre_comercial || preparation?.producto || "",
        "LITROS AGUA PREPARACION": fertilizerReportNumber(preparationWater),
        "CANTIDAD PRODUCTO APLICADO": fertilizerReportNumber(productApplied),
        "UNIDAD": unit,
        "DISOLUCION": fertilizerReportNumber(dissolution, 4),
        "POTRERO": application.potrero || campo.potrero || "",
        "BLOQUE": application.bloque || campo.bloque || "",
        "HECTAREAS": fertilizerReportNumber(hectares, 1),
        "LITROS APLICADOS": fertilizerReportNumber(appliedLiters),
        "KG APLICADOS": fertilizerReportNumber(kgApplied),
        "KG/HA APLICADOS": fertilizerReportNumber(kgHaApplied),
        "OBSERVACION PREPARACION": preparation?.observacion || ""
      };
      FERTILIZER_NUTRIENTS.forEach((nutrient) => {
        row[`APORTE ${nutrient.toUpperCase()}`] = fertilizerReportNumber(kgHaApplied * (Number(product?.[nutrient]) || 0));
      });
      rows.push(row);
    });
  });
  return rows;
}

async function exportFertilizerReportWorkbook() {
  if (fertilizerReportExporting) return;
  if (!window.XLSX) {
    showToast("No se pudo cargar el exportador Excel");
    return;
  }
  fertilizerReportExporting = true;
  if (currentView === "fertilizers") renderFertilizers();
  try {
    const rows = await loadFertilizerReportRows();
    if (!rows.length) {
      showToast("No hay aplicaciones de fertilizante para exportar");
      return;
    }
    const workbook = window.XLSX.utils.book_new();
    const sheet = window.XLSX.utils.json_to_sheet(rows);
    formatFertilizerReportSheet(sheet);
    sheet["!cols"] = [
      { wch: 22 }, { wch: 22 }, { wch: 14 }, { wch: 16 }, { wch: 30 }, { wch: 22 },
      { wch: 24 }, { wch: 10 }, { wch: 12 }, { wch: 16 }, { wch: 12 }, { wch: 12 },
      { wch: 16 }, { wch: 14 }, { wch: 16 }, { wch: 30 },
      ...FERTILIZER_NUTRIENTS.map(() => ({ wch: 12 }))
    ];
    window.XLSX.utils.book_append_sheet(workbook, sheet, "Aplicaciones");
    window.XLSX.writeFile(workbook, `informe-fertilizantes-${new Date().toISOString().slice(0, 10)}.xlsx`);
    showToast("Informe de fertilizantes descargado");
  } catch (error) {
    console.error("No se pudo exportar fertilizantes", error);
    showToast(`No se pudo exportar fertilizantes: ${error.message}`);
  } finally {
    fertilizerReportExporting = false;
    if (currentView === "fertilizers") renderFertilizers();
  }
}

function fertilizerKpis(rows) {
  const casetas = new Set(rows.map((row) => row.caseta)).size;
  const maxLiters = rows.reduce((sum, row) => sum + row.volumenMaximoLitros, 0);
  const currentLiters = rows.reduce((sum, row) => sum + row.litrosActuales, 0);
  const activeTanks = rows.filter((row) => row.litrosActuales > 0).length;
  return `
    ${kpi("Casetas", casetas, `${rows.length} estanques/FIP`)}
    ${kpi("Capacidad total", `${number(maxLiters, 0)} L`, "Volumen maximo")}
    ${kpi("Volumen actual", `${number(currentLiters, 0)} L`, fertilizerDataSource)}
    ${kpi("Estanques activos", activeTanks, "Con litros disponibles")}
  `;
}

function fertilizerStockPanelRows() {
  return (fertilizerStockRows || []).filter((row) => {
    if (fertilizerCasetaFilter !== "Todas" && row.caseta !== fertilizerCasetaFilter) return false;
    return true;
  });
}

function renderFertilizerStockPanel() {
  const rows = fertilizerStockPanelRows();
  const totalInitial = rows.reduce((sum, row) => sum + Math.max(0, Number(row.initial) || 0), 0);
  const totalConsumed = rows.reduce((sum, row) => sum + Math.max(0, Number(row.consumed) || 0), 0);
  return `
    <section class="panel fertilizer-stock-panel">
      <div class="panel-header fertilizer-stock-header">
        <div>
          <h2>Ingresar kilos/litros totales del lote</h2>
          <p>Stock disponible por caseta y producto. Las preparaciones descuentan automaticamente la cantidad de producto usada.</p>
        </div>
        <div class="fertilizer-stock-actions">
          <div>
            <strong>${number(totalInitial)} total</strong>
            <span>${number(totalConsumed)} usado</span>
          </div>
          <button class="primary-button" type="button" data-action="open-fertilizer-lot-dialog">Ingresar lote</button>
        </div>
      </div>
      ${fertilizerStockError ? `<div class="inline-warning">${escapeHtml(fertilizerStockError)}</div>` : ""}
      <div class="fertilizer-stock-grid">
        ${rows.map((row) => {
          const available = Number(row.available) || 0;
          const status = available < 0 ? "negative" : available <= 0 ? "empty" : "ok";
          const unit = row.unit || "KG";
          return `
            <article class="fertilizer-stock-card status-${status}">
              <div class="fertilizer-stock-card-head">
                <strong>${escapeHtml(row.product)}</strong>
                <span>${escapeHtml(row.caseta)}</span>
              </div>
              <div class="fertilizer-stock-available">
                <strong>${number(available)} ${escapeHtml(unit)}</strong>
                <span>disponibles</span>
              </div>
              <div class="fertilizer-stock-metrics">
                <span>Ingresado <b>${number(row.initial)} ${escapeHtml(unit)}</b></span>
                <span>Preparado <b>${number(row.consumed)} ${escapeHtml(unit)}</b></span>
              </div>
              <div class="fertilizer-stock-foot">
                ${row.folios.length ? `<span>Folio ${escapeHtml(row.folios.join(", "))}</span>` : `<span>Sin folio</span>`}
                ${row.lots.length ? `<span>Lote ${escapeHtml(row.lots.join(", "))}</span>` : ""}
              </div>
            </article>
          `;
        }).join("") || `
          <div class="empty-state fertilizer-stock-empty">
            <strong>Sin lotes ingresados</strong>
            <p>Ingresa el primer lote para ver disponibilidad por caseta y producto.</p>
          </div>
        `}
      </div>
    </section>
  `;
}

function fertilizerCurrentUserPayload() {
  return {
    id: currentProfile?.id || supabaseSession?.user?.id || null,
    name: currentProfile?.full_name || currentProfile?.nombre_completo || "Usuario"
  };
}

function fertilizerTankById(id) {
  return (fertilizerRows || []).find((row) => row.id === id) || null;
}

function fertilizerRawTankById(id) {
  return (fertilizerTanks || []).find((row) => row.id === id) || null;
}

function fertilizerTankOptionLabel(row) {
  return `${row.caseta} / Estanque ${row.numeroEstanque} / ${row.fip}`;
}

function fertilizerProductById(id) {
  return (fertilizerProducts || []).find((row) => row.id === id) || null;
}

function fertilizerAvailableProductAmount(caseta, productId) {
  const row = (fertilizerStockRows || []).find((item) => item.caseta === caseta && item.productId === productId);
  return Number(row?.available) || 0;
}

function fertilizerCasetaOptions() {
  return [...new Set((fertilizerRows || []).map((row) => row.caseta).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, "es", { numeric: true }));
}

function fertilizerTanksForCaseta(caseta) {
  return (fertilizerRows || [])
    .filter((row) => !caseta || row.caseta === caseta)
    .sort((a, b) =>
      String(a.numeroEstanque).localeCompare(String(b.numeroEstanque), "es", { numeric: true })
      || String(a.fip).localeCompare(String(b.fip), "es", { numeric: true })
    );
}

function fertilizerPotreroOptions(tank = null) {
  const tankPotreros = new Set((tank?.potreros || []).map(fertilizerReportKey));
  return [...new Set((fertilizerFields || [])
    .filter((field) => !tankPotreros.size || tankPotreros.has(fertilizerReportKey(field.potrero)))
    .map((field) => field.potrero)
    .filter(Boolean))]
    .sort(comparePotrero);
}

function fertilizerFieldsForPotrero(potrero) {
  return (fertilizerFields || [])
    .filter((field) => !potrero || field.potrero === potrero)
    .sort((a, b) => String(a.block).localeCompare(String(b.block), "es", { numeric: true }));
}

function renderFertilizerTankOptions(caseta, selectedId = "") {
  const tanks = fertilizerTanksForCaseta(caseta);
  return `<option value="">Seleccionar estanque</option>${tanks.map((row) => `
    <option value="${htmlAttr(row.id)}" ${row.id === selectedId ? "selected" : ""}>${escapeHtml(`Estanque ${row.numeroEstanque} / ${row.fip} - ${number(row.litrosActuales, 0)} L`)}</option>
  `).join("")}`;
}

function renderFertilizerPotreroOptions(tank = null, selectedPotrero = "") {
  const potreros = fertilizerPotreroOptions(tank);
  return `<option value="">Seleccionar potrero</option>${potreros.map((potrero) => `
    <option value="${htmlAttr(potrero)}" ${potrero === selectedPotrero ? "selected" : ""}>${escapeHtml(potreroLabel(potrero))}</option>
  `).join("")}`;
}

function renderFertilizerBlockChecklist(potrero, selectedIds = [], litersByField = new Map()) {
  const selected = new Set(selectedIds);
  const fields = fertilizerFieldsForPotrero(potrero);
  if (!potrero) return `<div class="fertilizer-block-empty">Selecciona un potrero para ver sus bloques.</div>`;
  if (!fields.length) return `<div class="fertilizer-block-empty">Este potrero no tiene bloques activos.</div>`;
  return `
    <div class="fertilizer-block-table-head" aria-hidden="true">
      <span>Sel.</span>
      <span>Bloque</span>
      <span>Variedad</span>
      <span>Ha</span>
      <span>Litros aplicados</span>
    </div>
    ${fields.map((field) => {
      const checked = selected.has(field.id);
      const liters = litersByField.get(field.id) || "";
      return `
        <label class="fertilizer-block-check">
          <span class="fertilizer-block-select">
            <input type="checkbox" name="fieldIds" value="${htmlAttr(field.id)}" ${checked ? "checked" : ""}>
          </span>
          <strong>Bloque ${escapeHtml(field.block || "-")}</strong>
          <em>${escapeHtml(field.variety || field.crop || "Sin variedad")}</em>
          <small>${number(field.hectares)} ha</small>
          <input class="fertilizer-block-liters" type="number" min="0.001" step="0.001" inputmode="decimal" data-field-liters="${htmlAttr(field.id)}" value="${htmlAttr(liters)}" placeholder="Litros" aria-label="Litros aplicados bloque ${htmlAttr(field.block || "")}" ${checked ? "" : "disabled"}>
        </label>
      `;
    }).join("")}
  `;
}
function resetFertilizerLoadedState() {
  fertilizerRows = null;
  fertilizerStockRows = [];
  fertilizerStockLots = [];
  fertilizerPreparationHistory = [];
  fertilizerApplicationHistory = [];
  fertilizerUserNames = new Map();
  fertilizerHistoryLoadError = "";
  fertilizerStockError = "";
}

function nextFertilizerLotNumber() {
  const used = (fertilizerStockLots || [])
    .map((lot) => Number(String(lot.lote || "").trim()))
    .filter((value) => Number.isFinite(value) && value > 0);
  return used.length ? Math.max(...used) + 1 : 1;
}

function fertilizerStatusLabel(status) {
  return {
    "sin-capacidad": "Sin capacidad",
    vacio: "Vacio",
    critico: "Critico",
    bajo: "Bajo",
    lleno: "Lleno",
    operativo: "Operativo"
  }[status] || status;
}

function fertilizerHistoryUser(row) {
  const idName = fertilizerUserNames.get(row?.modificado_por) || fertilizerUserNames.get(row?.responsable_id) || fertilizerUserNames.get(row?.creado_por);
  const rawName = idName || row?.modificado_por_nombre || row?.actualizado_por_nombre || row?.creado_por_nombre || row?.responsable_nombre || "";
  if (!rawName) return "Sin usuario registrado";
  const cleaned = String(rawName).trim();
  if (!cleaned.includes("@")) return cleaned;
  return cleaned.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function fertilizerDateMs(value) {
  const date = new Date(value || "");
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function fertilizerTankMetaForHistory(row) {
  const tank = fertilizerTankById(row?.estanque_id);
  const rawTank = fertilizerRawTankById(row?.estanque_id);
  const caseta = fertilizerCasetas.find((item) => item.id === rawTank?.caseta_id);
  return {
    caseta: tank?.caseta || caseta?.name || "Sin caseta",
    estanque: tank?.numeroEstanque || rawTank?.numero_estanque || "Sin estanque",
    fip: tank?.fip || rawTank?.fip || ""
  };
}

function fertilizerProductNameForHistory(row) {
  return row?.producto || fertilizerProductById(row?.producto_id)?.name || "Sin producto";
}

function fertilizerTankAlerts(rows) {
  const now = Date.now();
  const alerts = [];
  rows.forEach((row) => {
    const status = fertilizerTankStatus(row);
    const percent = row.volumenMaximoLitros ? row.litrosActuales / row.volumenMaximoLitros * 100 : 0;
    if (["vacio", "critico", "bajo"].includes(status)) {
      alerts.push({
        type: status === "vacio" ? "vacio" : status === "critico" ? "critico" : "bajo",
        title: status === "vacio" ? "Vacio" : status === "critico" ? "Critico" : "Bajo",
        caseta: row.caseta,
        estanque: row.numeroEstanque,
        value: `${number(row.litrosActuales, 0)} L (${number(percent, 0)}%)`,
        date: row.ultimaAplicacion || row.ultimaPreparacion || "",
        priority: status === "vacio" ? 0 : status === "critico" ? 1 : 2
      });
    }
    const lastPrepMs = fertilizerDateMs(row.ultimaPreparacion);
    const lastAppMs = fertilizerDateMs(row.ultimaAplicacion);
    const lastMovementMs = Math.max(lastPrepMs, lastAppMs);
    const days = lastMovementMs ? Math.floor((now - lastMovementMs) / 86400000) : 0;
    if (row.litrosActuales > 0 && lastMovementMs && days >= 3) {
      alerts.push({
        type: "sin-movimiento",
        title: "Sin aplicar +3 dias",
        caseta: row.caseta,
        estanque: row.numeroEstanque,
        value: `${days} dias con ${number(row.litrosActuales, 0)} L`,
        date: new Date(lastMovementMs).toISOString(),
        priority: 3
      });
    }
  });
  return alerts.sort((a, b) => a.priority - b.priority || fertilizerDateMs(b.date) - fertilizerDateMs(a.date)).slice(0, 24);
}

function renderFertilizerAlertsPanel(rows) {
  const alerts = fertilizerTankAlerts(rows);
  return `
    <section class="panel fertilizer-alerts-panel">
      <div class="panel-header fertilizer-alerts-header">
        <div>
          <h2>Historial de alertas</h2>
          <p>Estanques bajos, vacios o con producto detenido mas de 3 dias.</p>
        </div>
        <span>${alerts.length} alertas</span>
      </div>
      <div class="fertilizer-alerts-list">
        ${alerts.length ? alerts.map((alert) => `
          <article class="fertilizer-alert-card alert-${alert.type}">
            <div>
              <strong>${escapeHtml(alert.caseta)}</strong>
              <span>Estanque ${escapeHtml(alert.estanque)}</span>
            </div>
            <div>
              <b>${escapeHtml(alert.title)}</b>
              <small>${escapeHtml(alert.value)}</small>
            </div>
          </article>
        `).join("") : `<div class="empty-state compact"><strong>Sin alertas para el filtro actual.</strong></div>`}
      </div>
    </section>
  `;
}

function renderFertilizerPreparationHistoryTable(rows) {
  const recent = [...rows].sort((a, b) => fertilizerDateMs(b.fecha || b.creado_en) - fertilizerDateMs(a.fecha || a.creado_en)).slice(0, 80);
  if (!recent.length) return `<div class="empty-state compact"><strong>Sin preparaciones registradas.</strong></div>`;
  return `
    <div class="fertilizer-table-wrap fertilizer-history-table-wrap">
      <table class="fertilizer-table fertilizer-history-table">
        <thead><tr><th>Fecha</th><th>Caseta</th><th>Estanque</th><th>Producto</th><th>Agua</th><th>Cantidad</th><th>Usuario</th></tr></thead>
        <tbody>
          ${recent.map((row) => {
            const tank = fertilizerTankMetaForHistory(row);
            return `
              <tr>
                <td>${escapeHtml(fertilizerReportDateTime(row.fecha))}</td>
                <td>${escapeHtml(tank.caseta)}</td>
                <td>${escapeHtml(tank.estanque)}<br><small>${escapeHtml(tank.fip)}</small></td>
                <td class="fertilizer-table-fip">${escapeHtml(fertilizerProductNameForHistory(row))}</td>
                <td>${number(row.cantidad_litros, 0)} L</td>
                <td>${number(row.producto_cantidad)} ${escapeHtml(row.producto_unidad || fertilizerProductById(row.producto_id)?.unit || "")}</td>
                <td>${escapeHtml(fertilizerHistoryUser(row))}</td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderFertilizerApplicationHistoryTable(rows) {
  const recent = [...rows].sort((a, b) => fertilizerDateMs(b.fecha || b.creado_en) - fertilizerDateMs(a.fecha || a.creado_en)).slice(0, 120);
  if (!recent.length) return `<div class="empty-state compact"><strong>Sin aplicaciones registradas.</strong></div>`;
  return `
    <div class="fertilizer-table-wrap fertilizer-history-table-wrap">
      <table class="fertilizer-table fertilizer-history-table">
        <thead><tr><th>Fecha</th><th>Caseta</th><th>Estanque</th><th>Potrero</th><th>Bloque</th><th>Litros</th><th>Usuario</th></tr></thead>
        <tbody>
          ${recent.map((row) => {
            const tank = fertilizerTankMetaForHistory(row);
            return `
              <tr>
                <td>${escapeHtml(fertilizerReportDateTime(row.fecha))}</td>
                <td>${escapeHtml(tank.caseta)}</td>
                <td>${escapeHtml(tank.estanque)}<br><small>${escapeHtml(tank.fip)}</small></td>
                <td>${escapeHtml(potreroLabel(row.potrero || ""))}</td>
                <td>${escapeHtml(row.bloque || "-")}</td>
                <td><strong>${number(row.cantidad_litros, 0)} L</strong></td>
                <td>${escapeHtml(fertilizerHistoryUser(row))}</td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderFertilizerOperationsHistory() {
  const preparationRows = fertilizerHistoryRowsForMode("preparations");
  const applicationRows = fertilizerHistoryRowsForMode("applications");
  return `
    <section class="fertilizer-operations-history">
      <article class="panel fertilizer-history-panel">
        <div class="panel-header">
          <div><h2>Historial de preparacion</h2><p>Ultimos registros con usuario responsable.</p></div>
        </div>
        ${renderFertilizerPreparationHistoryTable(preparationRows)}
      </article>
      <article class="panel fertilizer-history-panel">
        <div class="panel-header">
          <div><h2>Historial de aplicaciones</h2><p>Litros fertilizados por potrero y bloque.</p></div>
        </div>
        ${renderFertilizerApplicationHistoryTable(applicationRows)}
      </article>
    </section>
  `;
}

function fertilizerHistoryRowsForMode(mode = "applications") {
  const sourceRows = mode === "preparations" ? fertilizerPreparationHistory : fertilizerApplicationHistory;
  const hasActiveFilter = fertilizerCasetaFilter !== "Todas" || fertilizerPotreroFilter !== "Todos" || fertilizerStatusFilter !== "Todos";
  if (!hasActiveFilter) return sourceRows || [];
  const visibleTankIds = new Set(fertilizerFilteredRows().map((row) => row.id));
  return (sourceRows || []).filter((row) => visibleTankIds.has(row.estanque_id));
}

function renderFertilizerHistoryDialogContent(mode = "applications") {
  const activeMode = mode === "preparations" ? "preparations" : "applications";
  const applicationsCount = fertilizerHistoryRowsForMode("applications").length;
  const preparationsCount = fertilizerHistoryRowsForMode("preparations").length;
  return `
    ${fertilizerHistoryLoadError ? `<div class="empty-state compact fertilizer-history-error"><strong>No se pudo cargar todo el historial.</strong><p>${escapeHtml(fertilizerHistoryLoadError)}</p></div>` : ""}
    <div class="fertilizer-history-tabs">
      <button type="button" data-action="set-fertilizer-history-mode" data-mode="applications" class="${activeMode === "applications" ? "active" : ""}">Aplicaciones <span>${number(applicationsCount, 0)}</span></button>
      <button type="button" data-action="set-fertilizer-history-mode" data-mode="preparations" class="${activeMode === "preparations" ? "active" : ""}">Preparacion <span>${number(preparationsCount, 0)}</span></button>
    </div>
    <div class="fertilizer-history-dialog-table">
      ${activeMode === "preparations"
        ? renderFertilizerPreparationHistoryTable(fertilizerHistoryRowsForMode(activeMode))
        : renderFertilizerApplicationHistoryTable(fertilizerHistoryRowsForMode(activeMode))}
    </div>
  `;
}

function openFertilizerHistoryDialog(initialMode = "applications") {
  const dialog = document.getElementById("purchaseDialog");
  const activeMode = initialMode === "preparations" ? "preparations" : "applications";
  dialog.classList.add("fertilizer-history-modal");
  dialog.addEventListener("close", () => dialog.classList.remove("fertilizer-history-modal"), { once: true });
  dialog.innerHTML = `
    <form method="dialog" class="modal-body fertilizer-history-dialog" id="fertilizerHistoryDialog">
      <div class="modal-head">
        <div>
          <h2>Historiales</h2>
          <p>Registros filtrados por la vista actual de fertilizantes.</p>
        </div>
        <button class="icon-button" type="button" data-action="close-dialog" title="Cerrar">x</button>
      </div>
      <div id="fertilizerHistoryDialogContent">
        ${renderFertilizerHistoryDialogContent(activeMode)}
      </div>
      <div class="modal-actions">
        <button class="secondary-button" type="button" data-action="close-dialog">Cerrar</button>
      </div>
    </form>
  `;
  dialog.showModal();
  const content = document.getElementById("fertilizerHistoryDialogContent");
  content?.addEventListener("click", (event) => {
    const button = event.target.closest?.("[data-action='set-fertilizer-history-mode']");
    if (!button) return;
    content.innerHTML = renderFertilizerHistoryDialogContent(button.dataset.mode);
  });
}

function renderFertilizerTankCard(row) {
  const status = fertilizerTankStatus(row);
  const percent = row.volumenMaximoLitros ? Math.min(100, row.litrosActuales / row.volumenMaximoLitros * 100) : 0;
  const levelTone = percent <= 15 ? "red" : percent <= 35 ? "orange" : percent <= 65 ? "yellow" : "green";
  return `
    <article class="fertilizer-tank-card fertilizer-estanque-card status-${status} tank-level-${levelTone}">
      <div
        class="fertilizer-tank-visual"
        role="img"
        aria-label="${escapeHtml(row.numeroEstanque)} al ${number(percent, 0)} por ciento"
        style="--tank-level:${Math.max(0, percent)}%"
      >
        <div class="fertilizer-tank-shell">
          <div class="fertilizer-tank-liquid"><span></span></div>
          <div class="fertilizer-tank-shine"></div>
        </div>
        <strong>${number(percent, 0)}%</strong>
      </div>
      <div class="fertilizer-tank-description">
        <span class="fertilizer-tank-number">${escapeHtml(row.numeroEstanque)}</span>
        <strong class="fertilizer-fip-text">${escapeHtml(row.fip)}</strong>
        <div class="fertilizer-tank-liters">
          <strong>${number(row.litrosActuales, 0)} L</strong>
          <span>de ${number(row.volumenMaximoLitros, 0)} L</span>
        </div>
      </div>
    </article>
  `;
}

function renderFertilizerCasetaGroup(caseta, rows) {
  const potreros = [...new Set(rows.flatMap((row) => row.potreros))].sort(comparePotrero);
  const maxLiters = rows.reduce((sum, row) => sum + row.volumenMaximoLitros, 0);
  const currentLiters = rows.reduce((sum, row) => sum + row.litrosActuales, 0);
  return `
    <section class="panel fertilizer-caseta-card">
      <div class="panel-header fertilizer-caseta-header">
        <div>
          <h2>${escapeHtml(caseta)}</h2>
          <p>${potreros.map((potrero) => escapeHtml(potreroLabel(potrero))).join(" · ")}</p>
        </div>
        <div class="fertilizer-caseta-total">
          <strong>${number(currentLiters, 0)} L</strong>
          <span>${number(maxLiters, 0)} L max.</span>
        </div>
      </div>
      <div class="fertilizer-tank-grid">
        ${rows.map(renderFertilizerTankCard).join("")}
      </div>
    </section>
  `;
}

function fertilizerWarehouseUnit(row) {
  const rawUnit = String(row?.unit || "KG").trim().toUpperCase();
  return /^(L|LT|LTS|LITRO|LITROS)$/.test(rawUnit) ? "LT" : "KG";
}

function fertilizerWarehouseUnitCount(total) {
  const quantity = Math.max(0, Number(total) || 0);
  if (quantity <= 0) return 1;
  if (quantity <= 50) return 2;
  if (quantity <= 200) return 3;
  if (quantity <= 500) return 4;
  if (quantity <= 1000) return 5;
  return 6;
}

function renderFertilizerWarehouseUnits(row) {
  const initial = Math.max(0, Number(row.initial) || 0);
  const consumed = Math.max(0, Number(row.consumed) || 0);
  const available = Math.max(0, Number(row.available) || 0);
  const unit = fertilizerWarehouseUnit(row);
  const iconCount = fertilizerWarehouseUnitCount(initial);
  const usedRatio = initial > 0 ? Math.min(1, consumed / initial) : 0;
  const usedIcons = Math.min(iconCount, Math.round(iconCount * usedRatio));
  const availableIcons = initial > 0 ? Math.max(0, iconCount - usedIcons) : 0;
  const icons = Array.from({ length: iconCount }, (_, index) => {
    const state = index < availableIcons ? "available" : initial > 0 ? "used" : "empty";
    return `<span class="fertilizer-stock-unit ${state}" aria-hidden="true"><i></i></span>`;
  }).join("");
  return `
    <div class="fertilizer-stock-visual stock-${unit === "LT" ? "can" : "sack"}" role="img" aria-label="${number(available)} ${unit} disponibles y ${number(consumed)} ${unit} usados">
      <div class="fertilizer-stock-unit-stack">${icons}</div>
      <span class="fertilizer-stock-unit-label">${unit === "LT" ? "Bidones" : "Sacos"} · ${unit}</span>
    </div>
  `;
}

function renderFertilizerWarehouseProductCard(row) {
  const available = Number(row.available) || 0;
  const initial = Number(row.initial) || 0;
  const consumed = Number(row.consumed) || 0;
  const percent = initial > 0 ? Math.max(0, Math.min(100, available / initial * 100)) : 0;
  const status = available < 0 ? "critico" : available <= 0 ? "vacio" : percent <= 20 ? "bajo" : "operativo";
  const unit = fertilizerWarehouseUnit(row);
  return `
    <article class="fertilizer-tank-card fertilizer-warehouse-card status-${status}">
      ${renderFertilizerWarehouseUnits(row)}
      <div class="fertilizer-warehouse-product-info">
        <div class="fertilizer-warehouse-product-head">
          <strong>${escapeHtml(row.product)}</strong>
          <span>${escapeHtml(unit)}</span>
        </div>
        <div class="fertilizer-warehouse-metrics">
          <div class="available">
            <span>Disponible</span>
            <strong>${number(Math.max(0, available))} ${escapeHtml(unit)}</strong>
          </div>
          <div class="used">
            <span>Usado</span>
            <strong>${number(Math.max(0, consumed))} ${escapeHtml(unit)}</strong>
          </div>
        </div>
        <div class="fertilizer-warehouse-total">
          <span>Ingresado</span>
          <strong>${number(Math.max(0, initial))} ${escapeHtml(unit)}</strong>
        </div>
      </div>
    </article>
  `;
}

function renderFertilizerWarehouseGroup(caseta, rows) {
  const totals = rows.reduce((summary, row) => {
    const unit = fertilizerWarehouseUnit(row);
    summary[unit].available += Math.max(0, Number(row.available) || 0);
    summary[unit].consumed += Math.max(0, Number(row.consumed) || 0);
    return summary;
  }, { KG: { available: 0, consumed: 0 }, LT: { available: 0, consumed: 0 } });
  const visibleTotals = Object.entries(totals).filter(([, values]) => values.available > 0 || values.consumed > 0);
  return `
    <section class="panel fertilizer-caseta-card fertilizer-warehouse-group">
      <div class="panel-header fertilizer-caseta-header fertilizer-warehouse-house-header">
        <div class="fertilizer-warehouse-house-title">
          <span class="fertilizer-warehouse-house-icon" aria-hidden="true"><i></i></span>
          <div>
            <h2>${escapeHtml(caseta)}</h2>
            <p>${rows.length} ${rows.length === 1 ? "producto" : "productos"} en bodega</p>
          </div>
        </div>
        <div class="fertilizer-warehouse-group-totals">
          ${visibleTotals.map(([unit, values]) => `
            <div>
              <span>${escapeHtml(unit)} disponibles</span>
              <strong>${number(values.available)} ${escapeHtml(unit)}</strong>
              <small>${number(values.consumed)} ${escapeHtml(unit)} usados</small>
            </div>
          `).join("") || `<div><span>Inventario</span><strong>0</strong><small>Sin movimientos</small></div>`}
        </div>
      </div>
      <div class="fertilizer-tank-grid">
        ${rows.map(renderFertilizerWarehouseProductCard).join("")}
      </div>
    </section>
  `;
}

function renderFertilizerWarehouseGroups(rows) {
  const grouped = new Map();
  rows.forEach((row) => {
    if (!grouped.has(row.caseta)) grouped.set(row.caseta, []);
    grouped.get(row.caseta).push(row);
  });
  return [...grouped.entries()].map(([caseta, items]) => renderFertilizerWarehouseGroup(caseta, items)).join("")
    || `<div class="empty-state"><strong>Sin productos en bodega para el filtro.</strong></div>`;
}

function renderFertilizerWarehouseDetailTable(rows) {
  if (!rows.length) return `<div class="empty-state compact"><strong>Sin productos de bodega para el filtro.</strong></div>`;
  return `
    <div class="fertilizer-table-wrap">
      <table class="fertilizer-table">
        <thead><tr><th>Caseta</th><th>Producto</th><th>Unidad</th><th>Ingresado</th><th>Preparado</th><th>Disponible</th><th>Folio</th><th>Lote</th></tr></thead>
        <tbody>
          ${rows.map((row) => `
            <tr>
              <td>${escapeHtml(row.caseta)}</td>
              <td class="fertilizer-table-fip">${escapeHtml(row.product)}</td>
              <td>${escapeHtml(row.unit || "KG")}</td>
              <td>${number(row.initial)}</td>
              <td>${number(row.consumed)}</td>
              <td><strong>${number(row.available)}</strong></td>
              <td>${escapeHtml(row.folios.join(", ") || "-")}</td>
              <td>${escapeHtml(row.lots.join(", ") || "-")}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderFertilizerDetailTable(rows) {
  if (!rows.length) return `<div class="empty-state compact"><strong>Sin estanques para el filtro.</strong></div>`;
  return `
    <div class="fertilizer-table-wrap">
      <table class="fertilizer-table">
        <thead><tr><th>Caseta</th><th>Estanque</th><th>Nombre estanque</th><th>Potreros</th><th>Max. L</th><th>Actual L</th><th>Preparado</th><th>Aplicado</th><th>Estado</th></tr></thead>
        <tbody>
          ${rows.map((row) => {
            const status = fertilizerTankStatus(row);
            return `<tr>
              <td><strong>${escapeHtml(row.caseta)}</strong></td>
              <td>${escapeHtml(row.numeroEstanque)}</td>
              <td class="fertilizer-table-fip">${escapeHtml(row.fip)}</td>
              <td>${row.potreros.map((potrero) => `<span class="fertilizer-potrero-chip">${escapeHtml(potreroLabel(potrero))}</span>`).join("")}</td>
              <td>${number(row.volumenMaximoLitros, 0)}</td>
              <td><strong>${number(row.litrosActuales, 0)}</strong></td>
              <td>${number(row.litrosPreparados, 0)}</td>
              <td>${number(row.litrosAplicados, 0)}</td>
              <td><span class="fertilizer-status-pill status-${status}">${fertilizerStatusLabel(status)}</span></td>
            </tr>`;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderFertilizers() {
  if (!fertilizerRows) {
    views.fertilizers.innerHTML = `
      <section class="panel fertilizer-loading-state">
        <div class="loading-spinner" aria-hidden="true"></div>
        <strong>${fertilizerLoadError ? "No se pudo cargar fertilizantes" : "Cargando fertilizantes"}</strong>
        <span>${escapeHtml(fertilizerLoadError || "Preparando casetas, estanques y FIP en litros")}</span>
        ${fertilizerLoadError ? `<button class="secondary-button" type="button" data-action="retry-fertilizers">Reintentar</button>` : ""}
      </section>`;
    if (!fertilizerLoadError) loadFertilizerRows().then(() => {
      if (currentView === "fertilizers") renderFertilizers();
    }).catch(() => {
      if (currentView === "fertilizers") renderFertilizers();
    });
    return;
  }
  const casetas = [...new Set(fertilizerRows.map((row) => row.caseta))].sort((a, b) => a.localeCompare(b, "es", { numeric: true }));
  const potreros = [...new Set(fertilizerRows.flatMap((row) => row.potreros))].sort(comparePotrero);
  if (fertilizerCasetaFilter !== "Todas" && !casetas.includes(fertilizerCasetaFilter)) fertilizerCasetaFilter = "Todas";
  if (fertilizerPotreroFilter !== "Todos" && !potreros.includes(fertilizerPotreroFilter)) fertilizerPotreroFilter = "Todos";
  if (!["estanques", "bodega"].includes(fertilizerStorageView)) fertilizerStorageView = "estanques";
  const rows = fertilizerFilteredRows();
  const warehouseRows = fertilizerStockPanelRows();
  const grouped = new Map();
  rows.forEach((row) => {
    if (!grouped.has(row.caseta)) grouped.set(row.caseta, []);
    grouped.get(row.caseta).push(row);
  });
  views.fertilizers.innerHTML = `
    <section class="fertilizer-shell">
      <div class="fertilizer-toolbar">
        <h2 class="fertilizer-toolbar-title">Fertirriego</h2>
        <div class="fertilizer-toolbar-body">
          <div class="fertilizer-filters">
            <label>Caseta<select data-fertilizer-filter="caseta"><option>Todas</option>${casetas.map((item) => `<option value="${htmlAttr(item)}" ${item === fertilizerCasetaFilter ? "selected" : ""}>${escapeHtml(item)}</option>`).join("")}</select></label>
            <label>Potrero<select data-fertilizer-filter="potrero"><option>Todos</option>${potreros.map((item) => `<option value="${htmlAttr(item)}" ${item === fertilizerPotreroFilter ? "selected" : ""}>${escapeHtml(potreroLabel(item))}</option>`).join("")}</select></label>
            <label>Estado<select data-fertilizer-filter="status">
              <option value="Todos" ${fertilizerStatusFilter === "Todos" ? "selected" : ""}>Todos</option>
              <option value="vacio" ${fertilizerStatusFilter === "vacio" ? "selected" : ""}>Vacio</option>
              <option value="critico" ${fertilizerStatusFilter === "critico" ? "selected" : ""}>Critico</option>
              <option value="bajo" ${fertilizerStatusFilter === "bajo" ? "selected" : ""}>Bajo</option>
              <option value="operativo" ${fertilizerStatusFilter === "operativo" ? "selected" : ""}>Operativo</option>
              <option value="lleno" ${fertilizerStatusFilter === "lleno" ? "selected" : ""}>Lleno</option>
            </select></label>
          </div>
          <div class="fertilizer-actions">
            <button class="fertilizer-action-button action-refresh" type="button" data-action="reload-fertilizers">Actualizar</button>
            <button class="fertilizer-action-button action-prepare" type="button" data-action="open-fertilizer-preparation-dialog">Preparar</button>
            <button class="fertilizer-action-button action-apply" type="button" data-action="open-fertilizer-application-dialog">Aplicar</button>
            <button class="fertilizer-action-button action-lot" type="button" data-action="open-fertilizer-lot-dialog">Ingresar lote</button>
            <button class="fertilizer-action-button action-history" type="button" data-action="open-fertilizer-history-dialog">Historiales</button>
            <button class="fertilizer-action-button action-export fertilizer-export-button" type="button" data-action="export-fertilizer-report" ${fertilizerReportExporting ? "disabled" : ""}>${fertilizerReportExporting ? "Generando..." : "Descargar Excel"}</button>
          </div>
        </div>
      </div>
      <div class="fertilizer-source-note">
        <span>${escapeHtml(fertilizerDataSource)}</span>
        <span>Unidad: litros</span>
      </div>
      <div class="fertilizer-workspace">
        <div class="fertilizer-main-column">
          <div class="section-title fertilizer-section-title">
            <div>
              <h2>${fertilizerStorageView === "bodega" ? "Bodega" : "Estanques"}</h2>
              <p>${fertilizerStorageView === "bodega" ? "Kilos y litros almacenados por caseta y producto." : "Estado actual de casetas, FIP y litros preparados disponibles."}</p>
            </div>
            <div class="segmented-control fertilizer-storage-toggle" role="tablist" aria-label="Vista fertilizante">
              <button type="button" role="tab" aria-selected="${fertilizerStorageView === "estanques"}" data-action="set-fertilizer-storage-view" data-view-mode="estanques" class="${fertilizerStorageView === "estanques" ? "active" : ""}">Estanques</button>
              <button type="button" role="tab" aria-selected="${fertilizerStorageView === "bodega"}" data-action="set-fertilizer-storage-view" data-view-mode="bodega" class="${fertilizerStorageView === "bodega" ? "active" : ""}">Bodega</button>
            </div>
          </div>
          <div class="fertilizer-caseta-grid">
            ${fertilizerStorageView === "bodega"
              ? renderFertilizerWarehouseGroups(warehouseRows)
              : [...grouped.entries()].map(([caseta, items]) => renderFertilizerCasetaGroup(caseta, items)).join("") || `<div class="empty-state"><strong>Sin casetas para el filtro.</strong></div>`}
          </div>
        </div>
        ${renderFertilizerAlertsPanel(rows)}
      </div>
    </section>
  `;
  views.fertilizers.querySelectorAll("[data-fertilizer-filter]").forEach((control) => {
    control.addEventListener("change", () => {
      const filter = control.dataset.fertilizerFilter;
      if (filter === "caseta") fertilizerCasetaFilter = control.value;
      if (filter === "potrero") fertilizerPotreroFilter = control.value;
      if (filter === "status") fertilizerStatusFilter = control.value;
      renderFertilizers();
    });
  });
}

function harvestFilterControls() {
  const crews = ["Todas", ...new Set(uniqueHarvestRecords().map(harvestCrewValue))].sort((a, b) => a === "Todas" ? -1 : b === "Todas" ? 1 : a.localeCompare(b, "es", { numeric: true }));
  const sdps = ["Todos", ...new Set(uniqueHarvestRecords().map((record) => record.sdp || "Sin SDP"))].sort((a, b) => a === "Todos" ? -1 : b === "Todos" ? 1 : a.localeCompare(b, "es", { numeric: true }));
  if (harvestCrewFilter !== "Todas" && !crews.includes(harvestCrewFilter)) harvestCrewFilter = "Todas";
  if (harvestSdpFilter !== "Todos" && !sdps.includes(harvestSdpFilter)) harvestSdpFilter = "Todos";
  return `
    <div class="harvest-filter-shell harvest-operational-filters">
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
  return normalizePestMonitoringField({
    date: row.fecha || "",
    pest: row.tipo_plaga || "",
    species: row.especie || "",
    variety: row.variedad || "",
    potrero: row.potrero || "Sin potrero",
    canonicalPotrero: row.potrero || "Sin potrero",
    potreroNormalized: Boolean(row.campo_normalizado),
    excelBlock: row.bloque || "",
    block: row.bloque || "",
    tree: String(row.numero_arbol ?? ""),
    monitoringOrder: String(row.orden_monitoreo ?? ""),
    foundAt: row.encontrado_en || "",
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
  });
}

function normalizePestMonitoringField(record) {
  const potrero = String(record?.potrero || record?.canonicalPotrero || "").trim();
  if (potrero.toLocaleLowerCase("es") !== "sin potrero") return record;
  return {
    ...record,
    potrero: "5",
    canonicalPotrero: "5",
    potreroNormalized: true,
    excelBlock: "1",
    block: "1",
    sourceBlock: "1",
    mapBlock: "1"
  };
}

async function loadPestMonitoringFromSupabase() {
  if (!supabaseSession) throw new Error("Se requiere una sesion de Supabase");
  const select = [
    "fecha", "tipo_plaga", "potrero", "bloque", "especie", "variedad", "campo_normalizado", "numero_arbol",
    "orden_monitoreo", "encontrado_en", "total_calculado", "huevos", "ninfas_1",
    "ninfas_2", "ninfas_3", "adultos", "larvas", "pupas", "longitud", "latitud", "id"
  ].join(",");
  const rows = await sbSelectAll(
    "v_monitoreo_plagas",
    `select=${select}&order=fecha.asc.nullslast,id.asc`,
    1000
  );
  if (!rows.length) throw new Error("La tabla monitoreo_plagas aun no contiene registros");
  pestMonitoringDataSource = "Supabase";
  return rows.map(mapSupabasePestMonitoringRecord);
}

async function loadPestMonitoringFromLocalBackup() {
  const response = await fetch("outputs/plagas_monitoreo.compact.json?v=5", { cache: "force-cache" });
  if (!response.ok) throw new Error(`No se pudo cargar el respaldo del monitoreo (${response.status})`);
  const collection = await response.json();
  const dictionaries = collection.dictionaries || {};
  pestMonitoringDataSource = "Respaldo local";
  return (collection.records || []).map((row) => normalizePestMonitoringField({
        date: dictionaries.dates?.[row[0]] || "",
        pest: dictionaries.pests?.[row[1]] || "",
        species: "",
        variety: "",
        potrero: dictionaries.potreros?.[row[2]] || "Sin potrero",
        canonicalPotrero: dictionaries.potreros?.[row[2]] || "Sin potrero",
        potreroNormalized: Boolean(row[3]),
        excelBlock: dictionaries.blocks?.[row[8]] || dictionaries.blocks?.[row[6]] || "",
        block: dictionaries.blocks?.[row[8]] || dictionaries.blocks?.[row[6]] || "",
        tree: String(row[9] ?? ""),
        monitoringOrder: String(row[10] ?? ""),
        foundAt: dictionaries.foundAt?.[row[11]] || "",
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

function enrichPestMonitoringFields(records) {
  const fields = new Map((state.blocks || []).map((field) => [fieldIdentityKey(field.potrero, field.block), field]));
  records.forEach((record) => {
    const field = fields.get(pestMonitoringBlockKey(record));
    record.species = record.species || field?.crop || "Sin especie";
    record.variety = record.variety || field?.variety || "";
  });
  return records;
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
    pestMonitoringRecords = enrichPestMonitoringFields(pestMonitoringRecords.filter((record) =>
      Number.isFinite(record.latitude) && Number.isFinite(record.longitude)
    ));
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
    if (pestMonitoringSpecies !== "Todas" && record.species !== pestMonitoringSpecies) return false;
    if (pestMonitoringPotrero !== "Todos" && record.potrero !== pestMonitoringPotrero) return false;
    if (pestMonitoringBlock !== "Todos" && String(record.excelBlock || "") !== pestMonitoringBlock) return false;
    return true;
  });
}

function pestMonitoringBlockKey(recordOrProperties) {
  if (recordOrProperties?.["Potrero_Alias:"] !== undefined || recordOrProperties?.Potrero_Alias !== undefined) {
    const field = geoJsonFeatureField({ properties: recordOrProperties });
    return fieldIdentityKey(field.potrero, field.block);
  }
  return fieldIdentityKey(
    recordOrProperties.potrero || recordOrProperties.canonicalPotrero,
    recordOrProperties.block || recordOrProperties.excelBlock
  );
}

function pestMonitoringBlockSummaries(records) {
  const summaries = new Map();
  records.forEach((record) => {
    const key = pestMonitoringBlockKey(record);
    const summary = summaries.get(key) || {
      key,
      potrero: record.potrero || "Sin potrero",
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
    minimum: positives[0] || 0,
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
    return `<strong>${escapeHtml(pestMonitoringPest)} · sin presencia</strong><div><span style="background:${PEST_RISK_COLORS[0]}"></span>0 · monitoreado sin individuos</div>`;
  }
  const [veryLow, low, medium, high] = scale.thresholds;
  const items = [
    [PEST_RISK_COLORS[0], "0 · monitoreado sin presencia"],
    [PEST_RISK_COLORS[1], `Muy baja · ${number(scale.minimum, 1)} a ${number(veryLow, 1)}`],
    [PEST_RISK_COLORS[2], `Baja · ${number(veryLow, 1)} a ${number(low, 1)}`],
    [PEST_RISK_COLORS[3], `Media · ${number(low, 1)} a ${number(medium, 1)}`],
    [PEST_RISK_COLORS[4], `Alta · ${number(medium, 1)} a ${number(high, 1)}`],
    [PEST_RISK_COLORS[5], `Muy alta · ${number(high, 1)} a ${number(scale.maximum, 1)}`]
  ];
  return `<strong>${escapeHtml(pestMonitoringPest)} · mín. ${number(scale.minimum, 1)} · máx. ${number(scale.maximum, 1)}</strong>${items.map(([color, label]) => `<div><span style="background:${color}"></span>${label}</div>`).join("")}`;
}

function pestMonitoringHeatColor(ratio) {
  const stops = [
    [20, 125, 100],
    [120, 201, 139],
    [184, 217, 107],
    [240, 207, 74],
    [238, 150, 56],
    [217, 54, 43]
  ];
  const position = Math.max(0, Math.min(1, ratio)) * (stops.length - 1);
  const lower = Math.floor(position);
  const upper = Math.min(stops.length - 1, Math.ceil(position));
  const amount = position - lower;
  return stops[lower].map((channel, index) => Math.round(channel + (stops[upper][index] - channel) * amount));
}

function createPestMonitoringHeatOverlay(maps, map, maskRings = []) {
  class PestCanvasHeatOverlay extends maps.OverlayView {
    constructor() {
      super();
      this.container = null;
      this.canvas = null;
      this.points = [];
      this.maskRings = maskRings;
      this.scale = { thresholds: [0, 0, 0, 0], minimum: 0, maximum: 0, positives: 0 };
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

      const gridSize = 7;
      const gridWidth = Math.max(1, Math.ceil(width / gridSize));
      const gridHeight = Math.max(1, Math.ceil(height / gridSize));
      const density = new Float32Array(gridWidth * gridHeight);
      const radiusPixels = Math.max(54, Math.min(92, width / 13));
      const radius = Math.ceil(radiusPixels / gridSize);
      const sigma = radius / 2.15;
      const scaleRange = Math.max(1, this.scale.maximum - this.scale.minimum);
      const sources = new Map();
      this.points.forEach((point) => {
        const pixel = projection.fromLatLngToDivPixel(new maps.LatLng(point.lat, point.lng));
        const x = pixel.x - southWest.x;
        const y = pixel.y - northEast.y;
        if (x < -radiusPixels || x > width + radiusPixels || y < -radiusPixels || y > height + radiusPixels) return;
        const centerX = Math.round(x / gridSize);
        const centerY = Math.round(y / gridSize);
        const normalizedWeight = point.weight <= 0
          ? 0.07
          : 0.28 + 0.72 * Math.max(0, Math.min(1, (point.weight - this.scale.minimum) / scaleRange));
        const sourceKey = `${centerX}:${centerY}`;
        const source = sources.get(sourceKey) || { centerX, centerY, total: 0, count: 0 };
        source.total += normalizedWeight;
        source.count += 1;
        sources.set(sourceKey, source);
      });
      sources.forEach((source) => {
        const { centerX, centerY } = source;
        const normalizedWeight = source.total / source.count;
        const minX = Math.max(0, centerX - radius);
        const maxX = Math.min(gridWidth - 1, centerX + radius);
        const minY = Math.max(0, centerY - radius);
        const maxY = Math.min(gridHeight - 1, centerY + radius);
        for (let gridY = minY; gridY <= maxY; gridY += 1) {
          for (let gridX = minX; gridX <= maxX; gridX += 1) {
            const deltaX = gridX - centerX;
            const deltaY = gridY - centerY;
            const distanceSquared = deltaX * deltaX + deltaY * deltaY;
            if (distanceSquared > radius * radius) continue;
            density[gridY * gridWidth + gridX] += normalizedWeight * Math.exp(-distanceSquared / (2 * sigma * sigma));
          }
        }
      });
      const populated = [...density].filter((value) => value > 0.02).sort((a, b) => a - b);
      if (!populated.length) return;
      const densityCap = pestMonitoringQuantile(populated, 0.96) || populated.at(-1) || 1;
      const surface = document.createElement("canvas");
      surface.width = gridWidth;
      surface.height = gridHeight;
      const surfaceContext = surface.getContext("2d");
      const image = surfaceContext.createImageData(gridWidth, gridHeight);
      density.forEach((value, index) => {
        if (value <= 0.025) return;
        const ratio = Math.max(0, Math.min(1, value / densityCap));
        const [red, green, blue] = pestMonitoringHeatColor(ratio);
        const pixelIndex = index * 4;
        image.data[pixelIndex] = red;
        image.data[pixelIndex + 1] = green;
        image.data[pixelIndex + 2] = blue;
        image.data[pixelIndex + 3] = Math.round(82 + ratio * 166);
      });
      surfaceContext.putImageData(image, 0, 0);
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      if (this.maskRings.length) {
        context.save();
        context.beginPath();
        this.maskRings.forEach((ring) => {
          ring.forEach(([lng, lat], index) => {
            const pixel = projection.fromLatLngToDivPixel(new maps.LatLng(lat, lng));
            const x = pixel.x - southWest.x;
            const y = pixel.y - northEast.y;
            if (index === 0) context.moveTo(x, y);
            else context.lineTo(x, y);
          });
          context.closePath();
        });
        context.clip("evenodd");
      }
      context.drawImage(surface, 0, 0, gridWidth, gridHeight, 0, 0, width, height);
      if (this.maskRings.length) context.restore();
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
      <td><button type="button" data-pest-block-key="${htmlAttr(summary.key)}">${escapeHtml(potreroLabel(summary.potrero))} <span>B${escapeHtml(summary.block || "-")}</span></button></td>
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

function pestMonitoringLatestPotreroRows(records) {
  const grouped = new Map();
  records.forEach((record) => {
    if (!record.date || !record.potrero) return;
    const key = fieldIdentityKey(record.potrero, "");
    const summary = grouped.get(key) || {
      potrero: record.potrero,
      latestDate: "",
      latestSamples: 0,
      latestBlocks: new Set()
    };
    if (record.date > summary.latestDate) {
      summary.latestDate = record.date;
      summary.latestSamples = 1;
      summary.latestBlocks = new Set(record.excelBlock ? [String(record.excelBlock)] : []);
    } else if (record.date === summary.latestDate) {
      summary.latestSamples += 1;
      if (record.excelBlock) summary.latestBlocks.add(String(record.excelBlock));
    }
    grouped.set(key, summary);
  });
  return [...grouped.values()].sort((a, b) => comparePotrero(a.potrero, b.potrero));
}

function renderPestMonitoringLatestPotreroTable(records) {
  const rows = pestMonitoringLatestPotreroRows(records);
  if (!rows.length) {
    return `<div class="empty-state compact"><strong>Sin monitoreos para esta plaga</strong><span>Ajusta los filtros para revisar otros potreros.</span></div>`;
  }
  return `
    <div class="pest-latest-potrero-meta">
      <span>Plaga <strong>${escapeHtml(pestMonitoringPest)}</strong></span>
      <span>${number(rows.length, 0)} ${rows.length === 1 ? "potrero" : "potreros"}</span>
    </div>
    <div class="pest-latest-potrero-wrap">
      <table class="pest-latest-potrero-table">
        <thead><tr><th>Potrero</th><th>Último monitoreo</th><th>Bloques de la visita</th><th>Registros</th></tr></thead>
        <tbody>${rows.map((row) => {
          const blocks = [...row.latestBlocks].sort((a, b) => a.localeCompare(b, "es", { numeric: true }));
          return `<tr>
            <td><strong>${escapeHtml(potreroLabel(row.potrero))}</strong></td>
            <td><time datetime="${htmlAttr(row.latestDate)}">${escapeHtml(printDate(row.latestDate))}</time></td>
            <td>${blocks.length ? blocks.map((block) => `<span>B${escapeHtml(block)}</span>`).join("") : "-"}</td>
            <td>${number(row.latestSamples, 0)}</td>
          </tr>`;
        }).join("")}</tbody>
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
  const species = [...new Set(pestMonitoringRecords.map((record) => record.species).filter(Boolean))].sort((a, b) => a.localeCompare(b, "es"));
  const potreros = [...new Set(pestMonitoringRecords.map((record) => record.potrero).filter(Boolean))].sort(comparePotrero);
  views.pestMonitoring.innerHTML = `
    <section class="pest-monitoring-shell">
      <div class="pest-filter-bar">
        <label>Desde<input type="date" value="${htmlAttr(pestMonitoringDateFrom)}" data-pest-filter="from"></label>
        <label>Hasta<input type="date" value="${htmlAttr(pestMonitoringDateTo)}" data-pest-filter="to"></label>
        <label>Plaga<select data-pest-filter="pest">${pests.map((pest) => `<option value="${htmlAttr(pest)}" ${pest === pestMonitoringPest ? "selected" : ""}>${escapeHtml(pest)}</option>`).join("")}</select></label>
        <label>Especie<select data-pest-filter="species"><option>Todas</option>${species.map((item) => `<option value="${htmlAttr(item)}" ${item === pestMonitoringSpecies ? "selected" : ""}>${escapeHtml(item)}</option>`).join("")}</select></label>
        <label>Potrero<select data-pest-filter="potrero"><option>Todos</option>${potreros.map((potrero) => `<option value="${htmlAttr(potrero)}" ${potrero === pestMonitoringPotrero ? "selected" : ""}>${escapeHtml(potreroLabel(potrero))}</option>`).join("")}</select></label>
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
          <div class="pest-coverage-explainer">
            <span><strong>Cobertura</strong> = registros del bloque respecto del total filtrado.</span>
            <span><strong>Presencia</strong> = monitoreos con individuos respecto de los realizados en ese bloque.</span>
          </div>
          <div class="pest-coverage-wrap">
            <table class="pest-coverage-table">
              <thead><tr><th>Potrero / bloque</th><th>Reg.</th><th>% cobertura</th><th>% presencia</th></tr></thead>
              <tbody id="pestMonitoringCoverage"></tbody>
            </table>
          </div>
          <div class="pest-data-note" id="pestMonitoringDataNote"></div>
        </aside>
      </div>
      <section class="panel pest-monthly-panel">
        <div class="panel-header"><div><h2>Último monitoreo por potrero</h2><p>Fecha más reciente para la plaga seleccionada en los filtros.</p></div></div>
        <div id="pestMonitoringLatestPotrero"></div>
        <div class="pest-monthly-subhead"><h3>Resumen mensual por plaga</h3><span>Etapas observadas por mes.</span></div>
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
      if (filter === "species") {
        pestMonitoringSpecies = control.value;
        pestMonitoringPotrero = "Todos";
        pestMonitoringBlock = "Todos";
        const potreroControl = views.pestMonitoring.querySelector('[data-pest-filter="potrero"]');
        if (potreroControl) potreroControl.value = "Todos";
      }
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
      .filter((record) => pestMonitoringSpecies === "Todas" || record.species === pestMonitoringSpecies)
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
  const latestPotrero = document.getElementById("pestMonitoringLatestPotrero");
  if (latestPotrero) latestPotrero.innerHTML = renderPestMonitoringLatestPotreroTable(records);
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
      pestMonitoringBaseOverlays.forEach((overlay) => overlay.setMap?.(null));
      pestMonitoringMap = null;
      pestMonitoringMapElement = element;
      pestMonitoringPolygons = [];
      pestMonitoringBaseOverlays = [];
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
        gestureHandling: "greedy",
        scrollwheel: true,
        tilt: 0
      });
      const blockRings = geoFeaturesToRings(layers?.bloques?.features || []);
      const blockGroups = new Map();
      blockRings.forEach((item) => {
        const sourceKey = pestMonitoringBlockKey(item.feature.properties || {});
        const field = geoJsonFeatureField(item.feature);
        const group = blockGroups.get(sourceKey) || { rings: [], label: field.block || blockFeatureName(item.feature) };
        group.rings.push(...item.rings);
        blockGroups.set(sourceKey, group);
        item.rings.forEach((ring) => {
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
      blockGroups.forEach((group) => {
        const label = createMapLabelOverlay(maps, geoLatLngCenter(group.rings), group.label, "map-label-block-google");
        label.setMap(pestMonitoringMap);
        pestMonitoringBaseOverlays.push(label);
      });
      const potreroGroups = new Map();
      geoFeaturesToRings(layers?.potreros?.features || []).forEach((item) => {
        const name = potreroFeatureName(item.feature);
        const group = potreroGroups.get(name) || { rings: [] };
        group.rings.push(...item.rings);
        potreroGroups.set(name, group);
      });
      const potreroPalette = ["#20d49a", "#f5b942", "#67a8ff", "#d58cff", "#52d5dd"];
      [...potreroGroups.entries()].forEach(([name, group], index) => {
        group.rings.forEach((ring) => {
          const boundary = new maps.Polygon({
            paths: ring.map(([lng, lat]) => ({ lat, lng })),
            strokeColor: potreroPalette[index % potreroPalette.length],
            strokeOpacity: 0.95,
            strokeWeight: 2.8,
            fillOpacity: 0,
            clickable: false,
            zIndex: 4
          });
          boundary.setMap(pestMonitoringMap);
          pestMonitoringBaseOverlays.push(boundary);
        });
        const label = createMapLabelOverlay(
          maps,
          shiftLatLng(geoLatLngCenter(group.rings), index, 34),
          potreroLabel(name),
          "map-label-potrero-google"
        );
        label.setMap(pestMonitoringMap);
        pestMonitoringBaseOverlays.push(label);
      });
      pestMonitoringHeatOverlay = createPestMonitoringHeatOverlay(
        maps,
        pestMonitoringMap,
        blockRings.flatMap((item) => item.rings)
      );
    }
    pestMonitoringMap.setOptions({ gestureHandling: "greedy", scrollwheel: true, draggable: true, keyboardShortcuts: true });
    pestMonitoringPolygons.forEach((entry) => {
      const block = summaries.get(entry.key);
      const value = block?.intensity || 0;
      const level = block ? pestMonitoringRiskLevel(value, scale) : 0;
      entry.polygon.setOptions({
        fillColor: block ? pestMonitoringRiskColor(value, scale) : "#6e8f83",
        fillOpacity: block ? 0.3 + level * 0.055 : 0.045,
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
      <strong>${escapeHtml(potreroLabel(summary.potrero))} / Bloque ${escapeHtml(summary.block || "-")}</strong>
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
        <h2>Mapa de bines</h2>
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
        <h2>Informacion de cosecha</h2>
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

function harvestCleanValue(value, fallback = "Sin dato") {
  const text = String(value ?? "").trim();
  return text && text.toLowerCase() !== "null" && text.toLowerCase() !== "nan" ? text : fallback;
}

function harvestDisplaySpecies(value) {
  const text = harvestCleanValue(value, "Sin especie").toLocaleUpperCase("es");
  if (["PALTOS", "PALTO", "PALTAS"].includes(text)) return "PALTA";
  return text;
}

function harvestDisplayVariety(value) {
  return harvestCleanValue(value, "Sin variedad").toLocaleUpperCase("es");
}

function harvestNumericValue(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function harvestExportPercentRatio(value) {
  const numeric = harvestNumericValue(value);
  return numeric > 1 ? numeric / 100 : numeric;
}

function harvestHasExportPercent(row) {
  return Boolean(row?.hasExportPercent) || harvestNumericValue(row?.exportPercent) > 0;
}

function harvestJsonObject(value) {
  if (!value) return {};
  if (typeof value === "object" && !Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(String(value));
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function harvestRatioLabel(value, digits = 1) {
  const ratio = harvestNumericValue(value);
  return `${number(ratio * 100, digits)}%`;
}

function harvestOptionValues(rows, getValue, allLabel = "Todos") {
  const values = [...new Set(rows.map(getValue).map((value) => harvestCleanValue(value, "")).filter(Boolean))]
    .sort((a, b) => comparePotrero(a, b));
  return [allLabel, ...values];
}

const HARVEST_EXCEL_SYNC_CONFIG = {
  harvest: {
    table: "cosecha_analisis",
    title: "Actualizar Cosecha Analisis",
    sheetName: "BD COSECHA SUPA",
    defaultSourceName: "COSECHA SUPA.xlsx",
    currentRows: () => harvestAnalysisDbRows,
    columns: [
      "fecha", "anio", "semana", "especie", "variedad", "potrero_excel", "bloque_formula",
      "bloque_excel", "potrero_normalizado", "bloque_normalizado", "contratista", "cuadrilla",
      "jornales", "bins_nac", "bins_expo", "total_bins", "kg_nac", "kg_exp", "kg_totales",
      "archivo_origen", "fila_excel", "campo_id"
    ],
    compareColumns: [
      "fecha", "anio", "semana", "especie", "variedad", "potrero_excel", "bloque_formula",
      "bloque_excel", "potrero_normalizado", "bloque_normalizado", "contratista", "cuadrilla",
      "jornales", "bins_nac", "bins_expo", "total_bins", "kg_nac", "kg_exp", "kg_totales"
    ]
  },
  export: {
    table: "exportacion_analisis",
    title: "Actualizar Exportacion",
    sheetName: "BD EXPORTACION SUPA",
    defaultSourceName: "cosecha supabase.xlsx",
    currentRows: () => harvestExportDbRows,
    columns: [
      "fecha", "anio", "especie", "variedad", "potrero_excel", "potrero_normalizado",
      "cant_bins", "enviados_kg", "recepcionados_kg", "diferencia_kg", "bins_por_confirmar",
      "kg_en_proceso", "kg_por_procesar", "exportados_kg", "descarte_kg", "precalibre_kg",
      "desecho_kg", "merma_kg", "x_kg", "porcentaje_expo", "calibres_kg", "calibres_cajas",
      "calibres_kg_total", "calibres_cajas_total", "archivo_origen", "fila_excel", "campo_ids"
    ],
    compareColumns: [
      "fecha", "anio", "especie", "variedad", "potrero_excel", "potrero_normalizado",
      "cant_bins", "enviados_kg", "recepcionados_kg", "diferencia_kg", "bins_por_confirmar",
      "kg_en_proceso", "kg_por_procesar", "exportados_kg", "descarte_kg", "precalibre_kg",
      "desecho_kg", "merma_kg", "x_kg", "porcentaje_expo", "calibres_kg", "calibres_cajas",
      "calibres_kg_total", "calibres_cajas_total"
    ]
  }
};

const HARVEST_EXCEL_FIELD_LABELS = {
  fecha: "Fecha",
  anio: "Ano",
  semana: "Semana",
  especie: "Especie",
  variedad: "Variedad",
  potrero_excel: "Potrero",
  bloque_formula: "Bloque formula",
  bloque_excel: "Bloque Excel",
  potrero_normalizado: "Potrero normalizado",
  bloque_normalizado: "Bloque normalizado",
  contratista: "Contratista",
  cuadrilla: "Cuadrilla",
  jornales: "Jornales",
  bins_nac: "Bins nac",
  bins_expo: "Bins expo",
  total_bins: "Total bins",
  kg_nac: "Kg nac",
  kg_exp: "Kg exp",
  kg_totales: "Kg totales",
  cant_bins: "Bins",
  enviados_kg: "Enviados kg",
  recepcionados_kg: "Recepcionados kg",
  diferencia_kg: "Dif kg",
  bins_por_confirmar: "Bins por confirmar",
  kg_en_proceso: "Kg procesados",
  kg_por_procesar: "Por procesar",
  exportados_kg: "Real exportado",
  descarte_kg: "Descarte",
  precalibre_kg: "Precalibre",
  desecho_kg: "Desecho",
  merma_kg: "Merma",
  x_kg: "X",
  porcentaje_expo: "% exportacion",
  calibres_kg: "Calibres kg",
  calibres_cajas: "Cajas",
  calibres_kg_total: "Total calibres kg",
  calibres_cajas_total: "Total cajas"
};

const HARVEST_EXCEL_NUMERIC_COMPARE_DIGITS = {
  jornales: 2,
  bins_nac: 3,
  bins_expo: 3,
  total_bins: 3,
  kg_nac: 0,
  kg_exp: 0,
  kg_totales: 0,
  cant_bins: 0,
  enviados_kg: 0,
  recepcionados_kg: 0,
  diferencia_kg: 0,
  bins_por_confirmar: 0,
  kg_en_proceso: 0,
  kg_por_procesar: 0,
  exportados_kg: 0,
  descarte_kg: 0,
  precalibre_kg: 0,
  desecho_kg: 0,
  merma_kg: 0,
  x_kg: 0,
  porcentaje_expo: 6,
  calibres_kg_total: 0,
  calibres_cajas_total: 0
};

function harvestSyncCompareDigits(column) {
  if (Object.prototype.hasOwnProperty.call(HARVEST_EXCEL_NUMERIC_COMPARE_DIGITS, column)) {
    return HARVEST_EXCEL_NUMERIC_COMPARE_DIGITS[column];
  }
  if (column === "calibres_kg") return 0;
  if (column === "calibres_cajas") return 0;
  return 6;
}

function harvestSyncRoundNumber(value, column) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 0;
  const digits = harvestSyncCompareDigits(column);
  const factor = 10 ** digits;
  return Math.round((numeric + Number.EPSILON) * factor) / factor;
}

function harvestSyncCleanText(value) {
  if (value === null || value === undefined) return "";
  if (typeof value === "number" && Number.isInteger(value)) return String(value);
  return String(value).trim();
}

function harvestSyncNormalizeHeader(value) {
  return harvestSyncCleanText(value)
    .replace(/\u00a0/g, " ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function harvestSyncNormalizeLabel(value) {
  return harvestSyncCleanText(value).replace(/\s+/g, " ").trim().toLocaleUpperCase("es");
}

function harvestSyncNormalizePotrero(value) {
  return harvestSyncCleanText(value).replace(/\s+/g, " ").trim();
}

function harvestFieldCatalog() {
  return state.harvestFields?.length ? state.harvestFields : state.blocks || [];
}

function harvestSyncHeaderIndex(row = []) {
  const index = {};
  row.forEach((cell, cellIndex) => {
    const key = harvestSyncNormalizeHeader(cell);
    if (key) index[key] = cellIndex;
  });
  return index;
}

function harvestSyncFindIndex(headerIndex, ...aliases) {
  for (const alias of aliases) {
    const key = harvestSyncNormalizeHeader(alias);
    if (Object.prototype.hasOwnProperty.call(headerIndex, key)) return headerIndex[key];
  }
  throw new Error(`No se encontro la columna ${aliases.join(" / ")}`);
}

function harvestSyncValue(row, index) {
  return index >= 0 && index < row.length ? row[index] : null;
}

function harvestSyncParseNumber(value, defaultValue = 0) {
  if (value === null || value === undefined || value === "") return defaultValue;
  if (typeof value === "number") return Number.isFinite(value) ? value : defaultValue;
  let text = String(value).trim();
  if (!text) return defaultValue;
  const isPercent = text.includes("%");
  text = text.replace("%", "").replace(/\s+/g, "");
  if (text.includes(",") && text.includes(".")) {
    text = text.lastIndexOf(",") > text.lastIndexOf(".")
      ? text.replace(/\./g, "").replace(",", ".")
      : text.replace(/,/g, "");
  } else if (text.includes(",")) {
    text = text.replace(",", ".");
  }
  const match = text.match(/-?\d+(?:\.\d+)?/);
  if (!match) return defaultValue;
  const numberValue = Number(match[0]);
  if (!Number.isFinite(numberValue)) return defaultValue;
  return isPercent ? numberValue / 100 : numberValue;
}

function harvestSyncParseInt(value) {
  const numberValue = harvestSyncParseNumber(value, null);
  return numberValue === null ? null : Math.trunc(numberValue);
}

function harvestSyncDateFromExcelSerial(value) {
  const days = Number(value);
  if (!Number.isFinite(days) || days < 1) return null;
  const date = new Date(Date.UTC(1899, 11, 30) + Math.round(days) * 86400000);
  return date.toISOString().slice(0, 10);
}

function harvestSyncParseDate(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString().slice(0, 10);
  if (typeof value === "number") return harvestSyncDateFromExcelSerial(value);
  const text = harvestSyncCleanText(value);
  if (!text) return null;
  const clean = text.slice(0, 10);
  const isoMatch = clean.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
  if (isoMatch) return `${isoMatch[1]}-${isoMatch[2].padStart(2, "0")}-${isoMatch[3].padStart(2, "0")}`;
  const clMatch = clean.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (clMatch) return `${clMatch[3]}-${clMatch[2].padStart(2, "0")}-${clMatch[1].padStart(2, "0")}`;
  return null;
}

function harvestSyncCalculatedExportPercent(exportedKg, kgEnProceso) {
  const denominator = harvestSyncParseNumber(kgEnProceso, 0);
  if (!denominator) return null;
  return harvestSyncParseNumber(exportedKg, 0) / denominator;
}

function harvestSyncCalibreLabel(header, isCaja = false) {
  let text = harvestSyncCleanText(header).replace(/\s+/g, " ").trim().toLocaleUpperCase("es");
  if (isCaja) {
    text = text.replace(/^(CAJAS?|CAJ)\s+/, "");
    text = text.replace(/^CAT\s+(\d+)/, "$1");
    text = text.replace(/^C(\d+)$/, "$1");
  }
  return text;
}

function harvestSyncFindSheetRows(workbook, sheetName, requiredAliases) {
  const worksheet = workbook.Sheets[sheetName]
    || workbook.Sheets[workbook.SheetNames.find((name) => harvestSyncNormalizeHeader(name) === harvestSyncNormalizeHeader(sheetName))]
    || null;
  if (!worksheet) throw new Error(`El Excel no tiene la hoja ${sheetName}`);
  const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: true, defval: null });
  const headerRowIndex = rows.findIndex((row) => {
    const index = harvestSyncHeaderIndex(row);
    return requiredAliases.every((alias) => Object.prototype.hasOwnProperty.call(index, harvestSyncNormalizeHeader(alias)));
  });
  if (headerRowIndex < 0) throw new Error(`No se encontro encabezado valido en ${sheetName}`);
  return { rows, headerRowIndex, headerIndex: harvestSyncHeaderIndex(rows[headerRowIndex]) };
}

function harvestSyncReadCosechaWorkbook(workbook, sourceName, options = {}) {
  let sheet;
  try {
    sheet = harvestSyncFindSheetRows(workbook, "BD COSECHA SUPA", ["Especie", "Variedad", "Potrero", "FECHA COSECHA"]);
  } catch (error) {
    if (options.optional) return [];
    throw error;
  }
  const idx = {
    especie: harvestSyncFindIndex(sheet.headerIndex, "Especie"),
    variedad: harvestSyncFindIndex(sheet.headerIndex, "Variedad"),
    potrero: harvestSyncFindIndex(sheet.headerIndex, "Potrero"),
    bloque_formula: harvestSyncFindIndex(sheet.headerIndex, "Bloque Formula"),
    bloque: harvestSyncFindIndex(sheet.headerIndex, "Bloque"),
    fecha: harvestSyncFindIndex(sheet.headerIndex, "FECHA COSECHA"),
    semana: harvestSyncFindIndex(sheet.headerIndex, "Semana"),
    contratista: harvestSyncFindIndex(sheet.headerIndex, "CONTRATISTA"),
    cuadrilla: harvestSyncFindIndex(sheet.headerIndex, "CUADRILLA"),
    jornales: harvestSyncFindIndex(sheet.headerIndex, "JORNALES"),
    bins_nac: harvestSyncFindIndex(sheet.headerIndex, "BINS NAC"),
    bins_expo: harvestSyncFindIndex(sheet.headerIndex, "BINS EXPO"),
    total_bins: harvestSyncFindIndex(sheet.headerIndex, "Total Bins"),
    kg_nac: harvestSyncFindIndex(sheet.headerIndex, "KG NAC"),
    kg_exp: harvestSyncFindIndex(sheet.headerIndex, "KG EXP"),
    kg_totales: harvestSyncFindIndex(sheet.headerIndex, "KG TOTALES")
  };
  const records = [];
  sheet.rows.slice(sheet.headerRowIndex + 1).forEach((row, offset) => {
    const filaExcel = sheet.headerRowIndex + 2 + offset;
    const fecha = harvestSyncParseDate(harvestSyncValue(row, idx.fecha));
    const especie = harvestSyncNormalizeLabel(harvestSyncValue(row, idx.especie));
    const variedad = harvestSyncNormalizeLabel(harvestSyncValue(row, idx.variedad));
    const potrero = harvestSyncNormalizePotrero(harvestSyncValue(row, idx.potrero));
    if (!fecha || !variedad || !potrero) return;
    const bloqueFormula = harvestSyncNormalizePotrero(harvestSyncValue(row, idx.bloque_formula));
    const bloqueExcel = harvestSyncNormalizePotrero(harvestSyncValue(row, idx.bloque));
    const record = {
      fecha,
      anio: Number(fecha.slice(0, 4)),
      semana: harvestSyncParseInt(harvestSyncValue(row, idx.semana)),
      especie,
      variedad,
      potrero_excel: potrero,
      bloque_formula: bloqueFormula || null,
      bloque_excel: bloqueExcel || null,
      potrero_normalizado: potrero,
      bloque_normalizado: bloqueExcel || bloqueFormula || null,
      contratista: harvestSyncNormalizePotrero(harvestSyncValue(row, idx.contratista)) || null,
      cuadrilla: harvestSyncNormalizePotrero(harvestSyncValue(row, idx.cuadrilla)) || null,
      jornales: harvestSyncParseNumber(harvestSyncValue(row, idx.jornales), 0),
      bins_nac: harvestSyncParseNumber(harvestSyncValue(row, idx.bins_nac), 0),
      bins_expo: harvestSyncParseNumber(harvestSyncValue(row, idx.bins_expo), 0),
      total_bins: harvestSyncParseNumber(harvestSyncValue(row, idx.total_bins), 0),
      kg_nac: harvestSyncParseNumber(harvestSyncValue(row, idx.kg_nac), 0),
      kg_exp: harvestSyncParseNumber(harvestSyncValue(row, idx.kg_exp), 0),
      kg_totales: harvestSyncParseNumber(harvestSyncValue(row, idx.kg_totales), 0),
      archivo_origen: sourceName,
      fila_excel: filaExcel
    };
    record.campo_id = harvestSyncFindCosechaFieldId(record);
    records.push(record);
  });
  return records;
}

function harvestSyncSpeciesByVariety(cosechaRecords = []) {
  const counts = new Map();
  cosechaRecords.forEach((row) => {
    if (!row.variedad || !row.especie) return;
    const bySpecies = counts.get(row.variedad) || new Map();
    bySpecies.set(row.especie, (bySpecies.get(row.especie) || 0) + 1);
    counts.set(row.variedad, bySpecies);
  });
  (state.harvestAnalysisRecords || []).forEach((row) => {
    const variety = harvestDisplayVariety(row.variety);
    const species = harvestDisplaySpecies(row.species);
    if (!variety || !species) return;
    const bySpecies = counts.get(variety) || new Map();
    bySpecies.set(species, (bySpecies.get(species) || 0) + 1);
    counts.set(variety, bySpecies);
  });
  const mapping = new Map();
  counts.forEach((speciesCounts, variety) => {
    const [species] = [...speciesCounts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "es"))[0] || [];
    if (species) mapping.set(variety, species);
  });
  mapping.set("BARNFIELD", mapping.get("BARNFIELD") || "NARANJA");
  return mapping;
}

function harvestSyncReadExportWorkbook(workbook, sourceName, speciesByVariety) {
  const sheet = harvestSyncFindSheetRows(workbook, "BD EXPORTACION SUPA", ["VARIEDAD", "Fecha", "Potrero"]);
  const idx = {
    variedad: harvestSyncFindIndex(sheet.headerIndex, "VARIEDAD"),
    anio: harvestSyncFindIndex(sheet.headerIndex, "ANO", "AÑO", "AÃ‘O"),
    fecha: harvestSyncFindIndex(sheet.headerIndex, "Fecha"),
    potrero: harvestSyncFindIndex(sheet.headerIndex, "Potrero"),
    cant_bins: harvestSyncFindIndex(sheet.headerIndex, "Cant Bins"),
    enviados_kg: harvestSyncFindIndex(sheet.headerIndex, "Enviados Kg"),
    recepcionados_kg: harvestSyncFindIndex(sheet.headerIndex, "Recepcionados"),
    diferencia_kg: harvestSyncFindIndex(sheet.headerIndex, "dif"),
    bins_por_confirmar: harvestSyncFindIndex(sheet.headerIndex, "Bins por confirmar"),
    kg_en_proceso: harvestSyncFindIndex(sheet.headerIndex, "Kg. I Proceso"),
    kg_por_procesar: harvestSyncFindIndex(sheet.headerIndex, "Kg. X Procesar", "Kg. X  Procesar"),
    exportados_kg: harvestSyncFindIndex(sheet.headerIndex, "exportados"),
    descarte_kg: harvestSyncFindIndex(sheet.headerIndex, "descarte"),
    precalibre_kg: harvestSyncFindIndex(sheet.headerIndex, "precalibre"),
    desecho_kg: harvestSyncFindIndex(sheet.headerIndex, "Desecho"),
    merma_kg: harvestSyncFindIndex(sheet.headerIndex, "merma"),
    x_kg: harvestSyncFindIndex(sheet.headerIndex, "x."),
    porcentaje_expo: harvestSyncFindIndex(sheet.headerIndex, "% Expo"),
    cajas: harvestSyncFindIndex(sheet.headerIndex, "cajas")
  };
  const headerRow = sheet.rows[sheet.headerRowIndex] || [];
  const kgCols = Array.from({ length: Math.max(0, idx.cajas - idx.porcentaje_expo - 1) }, (_, index) => idx.porcentaje_expo + 1 + index);
  const cajaCols = Array.from({ length: Math.max(0, headerRow.length - idx.cajas - 1) }, (_, index) => idx.cajas + 1 + index);
  const records = [];
  sheet.rows.slice(sheet.headerRowIndex + 1).forEach((row, offset) => {
    const filaExcel = sheet.headerRowIndex + 2 + offset;
    const variedad = harvestSyncNormalizeLabel(harvestSyncValue(row, idx.variedad));
    const fecha = harvestSyncParseDate(harvestSyncValue(row, idx.fecha));
    const potrero = harvestSyncNormalizePotrero(harvestSyncValue(row, idx.potrero));
    if (!variedad || !fecha || !potrero) return;
    const calibresKg = {};
    const calibresCajas = {};
    kgCols.forEach((col) => {
      const amount = harvestSyncParseNumber(harvestSyncValue(row, col), 0);
      const label = harvestSyncCalibreLabel(headerRow[col], false);
      if (label && amount) calibresKg[label] = (calibresKg[label] || 0) + amount;
    });
    cajaCols.forEach((col) => {
      const amount = harvestSyncParseNumber(harvestSyncValue(row, col), 0);
      const label = harvestSyncCalibreLabel(headerRow[col], true);
      if (label && amount) calibresCajas[label] = (calibresCajas[label] || 0) + amount;
    });
    const kgEnProceso = harvestSyncParseNumber(harvestSyncValue(row, idx.kg_en_proceso), 0);
    const exportadosKg = harvestSyncParseNumber(harvestSyncValue(row, idx.exportados_kg), 0);
    const record = {
      fecha,
      anio: harvestSyncParseInt(harvestSyncValue(row, idx.anio)) || Number(fecha.slice(0, 4)),
      especie: speciesByVariety.get(variedad) || "SIN ESPECIE",
      variedad,
      potrero_excel: potrero,
      potrero_normalizado: potrero,
      cant_bins: harvestSyncParseNumber(harvestSyncValue(row, idx.cant_bins), 0),
      enviados_kg: harvestSyncParseNumber(harvestSyncValue(row, idx.enviados_kg), 0),
      recepcionados_kg: harvestSyncParseNumber(harvestSyncValue(row, idx.recepcionados_kg), 0),
      diferencia_kg: harvestSyncParseNumber(harvestSyncValue(row, idx.diferencia_kg), 0),
      bins_por_confirmar: harvestSyncParseNumber(harvestSyncValue(row, idx.bins_por_confirmar), 0),
      kg_en_proceso: kgEnProceso,
      kg_por_procesar: harvestSyncParseNumber(harvestSyncValue(row, idx.kg_por_procesar), 0),
      exportados_kg: exportadosKg,
      descarte_kg: harvestSyncParseNumber(harvestSyncValue(row, idx.descarte_kg), 0),
      precalibre_kg: harvestSyncParseNumber(harvestSyncValue(row, idx.precalibre_kg), 0),
      desecho_kg: harvestSyncParseNumber(harvestSyncValue(row, idx.desecho_kg), 0),
      merma_kg: harvestSyncParseNumber(harvestSyncValue(row, idx.merma_kg), 0),
      x_kg: harvestSyncParseNumber(harvestSyncValue(row, idx.x_kg), 0),
      porcentaje_expo: harvestSyncCalculatedExportPercent(exportadosKg, kgEnProceso),
      calibres_kg: calibresKg,
      calibres_cajas: calibresCajas,
      calibres_kg_total: Object.values(calibresKg).reduce((sum, value) => sum + value, 0),
      calibres_cajas_total: Object.values(calibresCajas).reduce((sum, value) => sum + value, 0),
      archivo_origen: sourceName,
      fila_excel: filaExcel
    };
    record.campo_ids = harvestSyncFindExportFieldIds(record);
    records.push(record);
  });
  return records;
}

function harvestSyncFieldNorm(value) {
  return harvestAnalysisNormalizeFieldToken(value, { potrero: true, block: true });
}

function harvestSyncFindCosechaFieldId(record) {
  const match = harvestAnalysisFieldForRow(record);
  return match?.id || null;
}

function harvestSyncFindExportFieldIds(record) {
  const ids = harvestExportFieldsForRecord(record)
    .map((field) => field.id)
    .filter(Boolean);
  return ids.length ? ids : null;
}

function harvestSyncRecordKey(source, rowNumber) {
  return `${String(source || "").trim()}|${Number(rowNumber) || 0}`;
}

function harvestSyncSourceSignature(value) {
  return harvestSyncNormalizeHeader(value)
    .replace(/\.(xlsx|xls)$/i, "")
    .replace(/\s*\(\d+\)$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function harvestSyncMostCommonSource(rows = [], fallback = "") {
  const counts = new Map();
  rows.forEach((row) => {
    const source = harvestSyncCleanText(row.archivo_origen);
    if (!source) return;
    counts.set(source, (counts.get(source) || 0) + 1);
  });
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "es"))[0]?.[0] || fallback;
}

function harvestSyncCanonicalSourceName(module, fileName) {
  const config = HARVEST_EXCEL_SYNC_CONFIG[module];
  const rows = config?.currentRows?.() || [];
  const fallback = config?.defaultSourceName || fileName || "";
  const uploadedSignature = harvestSyncSourceSignature(fileName);
  const sources = [...new Set(rows.map((row) => harvestSyncCleanText(row.archivo_origen)).filter(Boolean))];
  const exactSignatureSource = sources.find((source) => harvestSyncSourceSignature(source) === uploadedSignature);
  if (exactSignatureSource) return exactSignatureSource;
  if (uploadedSignature.includes("cosecha")) return harvestSyncMostCommonSource(rows, fallback);
  return harvestSyncMostCommonSource(rows, fallback) || fallback;
}

function harvestSyncFindExisting(record, rows) {
  const exact = new Map();
  rows.forEach((row) => {
    const fila = Number(row.fila_excel) || 0;
    if (!fila) return;
    exact.set(harvestSyncRecordKey(row.archivo_origen, fila), row);
  });
  return exact.get(harvestSyncRecordKey(record.archivo_origen, record.fila_excel)) || null;
}

function harvestSyncComparableValue(value, column = "") {
  if (value === null || value === undefined || value === "") return null;
  if (Array.isArray(value)) return value.map(String).sort();
  if (typeof value === "object") {
    return Object.fromEntries(Object.entries(value)
      .map(([key, entryValue]) => [key, harvestSyncRoundNumber(harvestSyncParseNumber(entryValue, 0), column)])
      .filter(([, entryValue]) => entryValue !== 0)
      .sort(([a], [b]) => a.localeCompare(b, "es", { numeric: true })));
  }
  if (typeof value === "number") return harvestSyncRoundNumber(value, column);
  if (HARVEST_EXCEL_NUMERIC_COMPARE_DIGITS[column] !== undefined) return harvestSyncRoundNumber(harvestSyncParseNumber(value, 0), column);
  return String(value).trim();
}

function harvestSyncValuesEqual(a, b, column = "") {
  const left = harvestSyncComparableValue(a, column);
  const right = harvestSyncComparableValue(b, column);
  if (typeof left === "number" || typeof right === "number") {
    const leftNumber = Number(left || 0);
    const rightNumber = Number(right || 0);
    return Math.abs(leftNumber - rightNumber) < 0.000001;
  }
  return JSON.stringify(left) === JSON.stringify(right);
}

function harvestSyncDisplayValue(value, column = "") {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "object") {
    const entries = Object.entries(value || {}).filter(([, entryValue]) => harvestSyncParseNumber(entryValue, 0) !== 0);
    if (!entries.length) return "{}";
    const digits = harvestSyncCompareDigits(column);
    return entries.slice(0, 4).map(([key, entryValue]) => `${key}: ${number(harvestSyncRoundNumber(entryValue, column), digits)}`).join(", ");
  }
  if (typeof value === "number") return number(harvestSyncRoundNumber(value, column), harvestSyncCompareDigits(column));
  if (/^\d{4}-\d{2}-\d{2}$/.test(String(value))) return printDate(value);
  if (HARVEST_EXCEL_NUMERIC_COMPARE_DIGITS[column] !== undefined) {
    return number(harvestSyncRoundNumber(harvestSyncParseNumber(value, 0), column), harvestSyncCompareDigits(column));
  }
  return String(value);
}

function harvestSyncBuildChanges(module, records) {
  const config = HARVEST_EXCEL_SYNC_CONFIG[module];
  const currentRows = config.currentRows() || [];
  const changes = [];
  let identical = 0;
  records.forEach((record) => {
    const existing = harvestSyncFindExisting(record, currentRows);
    if (existing?.archivo_origen) record.archivo_origen = existing.archivo_origen;
    const payload = Object.fromEntries(config.columns.map((column) => [column, record[column] ?? null]));
    if (!existing) {
      changes.push({
        id: `${module}:new:${record.archivo_origen}:${record.fila_excel}`,
        module,
        type: "new",
        table: config.table,
        payload,
        existing: null,
        diffs: []
      });
      return;
    }
    const diffs = config.compareColumns
      .filter((column) => !harvestSyncValuesEqual(existing[column], payload[column], column))
      .map((column) => ({
        column,
        before: existing[column],
        after: payload[column]
      }));
    if (!diffs.length) {
      identical += 1;
      return;
    }
    changes.push({
      id: `${module}:mod:${existing.id || record.archivo_origen}:${record.fila_excel}`,
      module,
      type: "modified",
      table: config.table,
      rowId: existing.id,
      payload,
      existing,
      diffs
    });
  });
  return { changes, identical };
}

function harvestSyncRecordTitle(change) {
  const row = change.payload || {};
  if (change.module === "export") {
    return `${row.anio || ""} | ${row.variedad || "Sin variedad"} | ${potreroLabel(row.potrero_excel || row.potrero_normalizado || "")}`;
  }
  return `${printDate(row.fecha)} | ${row.variedad || "Sin variedad"} | ${potreroLabel(row.potrero_excel || row.potrero_normalizado || "")} ${row.bloque_excel || row.bloque_normalizado || ""}`.trim();
}

function renderHarvestExcelSyncButton(module) {
  return `<button class="secondary-button harvest-sync-open-button" type="button" data-action="open-harvest-excel-sync" data-sync-module="${htmlAttr(module)}">Actualizar Excel</button>`;
}

function renderHarvestExcelSyncEmpty(module, title, detail) {
  return `
    <section class="panel">
      <div class="empty-state">
        <strong>${escapeHtml(title)}</strong>
        <p>${escapeHtml(detail)}</p>
        <button class="primary" type="button" data-action="open-harvest-excel-sync" data-sync-module="${htmlAttr(module)}">Actualizar desde Excel</button>
      </div>
    </section>`;
}

function openHarvestExcelSyncDialog(module = "harvest") {
  const config = HARVEST_EXCEL_SYNC_CONFIG[module];
  if (!config) return;
  const dialog = document.getElementById("purchaseDialog");
  if (!dialog) return;
  harvestExcelSyncState = {
    module,
    fileName: "",
    sourceName: "",
    parsed: 0,
    changes: [],
    identical: 0,
    accepted: new Set(),
    error: ""
  };
  dialog.innerHTML = `
    <div class="modal-body harvest-sync-dialog">
      <div class="modal-head">
        <div>
          <h2>${escapeHtml(config.title)}</h2>
          <p>Sube el Excel, revisa nuevos y modificaciones, y guarda solo lo aprobado.</p>
        </div>
        <button class="icon-button" type="button" data-action="close-dialog" aria-label="Cerrar">x</button>
      </div>
      <div class="harvest-sync-upload-card">
        <input id="harvestExcelSyncFile" type="file" accept=".xlsx,.xls" hidden>
        <div>
          <strong>Archivo Excel</strong>
          <span>Hojas requeridas: ${escapeHtml(config.sheetName)}${module === "export" ? " y BD COSECHA SUPA para reconocer especie" : ""}</span>
        </div>
        <button class="secondary-button" type="button" data-action="choose-harvest-excel-sync">Seleccionar archivo</button>
      </div>
      <div id="harvestExcelSyncPreview" class="harvest-sync-preview">
        <div class="empty">Selecciona un archivo para comparar contra Supabase.</div>
      </div>
      <div class="modal-actions">
        <button class="secondary-button" type="button" data-action="close-dialog">Cancelar</button>
        <button class="primary" type="button" data-action="save-harvest-excel-sync" disabled>Guardar seleccionados</button>
      </div>
    </div>`;
  if (dialog.open) dialog.close();
  dialog.showModal();
}

function renderHarvestExcelSyncPreview() {
  const container = document.getElementById("harvestExcelSyncPreview");
  if (!container || !harvestExcelSyncState) return;
  const stateSync = harvestExcelSyncState;
  const changes = stateSync.changes || [];
  const selectedCount = changes.filter((change) => stateSync.accepted.has(change.id)).length;
  const newCount = changes.filter((change) => change.type === "new").length;
  const modifiedCount = changes.filter((change) => change.type === "modified").length;
  const saveButton = document.querySelector("[data-action='save-harvest-excel-sync']");
  if (saveButton) {
    saveButton.disabled = !selectedCount || harvestExcelSyncSaving;
    saveButton.textContent = harvestExcelSyncSaving ? "Guardando..." : "Guardar seleccionados";
  }
  if (stateSync.error) {
    container.innerHTML = `<div class="empty-state compact-error"><strong>No se pudo leer el Excel</strong><p>${escapeHtml(stateSync.error)}</p></div>`;
    return;
  }
  if (!stateSync.fileName) {
    container.innerHTML = `<div class="empty">Selecciona un archivo para comparar contra Supabase.</div>`;
    return;
  }
  container.innerHTML = `
    ${harvestExcelSyncSaving ? `
      <div class="harvest-sync-saving" role="status" aria-live="polite">
        <span class="weather-import-spinner" aria-hidden="true"></span>
        <div><strong>Guardando seleccionados</strong><small>Actualizando Supabase y recargando cosecha.</small></div>
      </div>` : ""}
    <div class="harvest-sync-summary">
      <span><strong>${number(stateSync.parsed, 0)}</strong> filas leidas</span>
      <span><strong>${number(newCount, 0)}</strong> nuevas</span>
      <span><strong>${number(modifiedCount, 0)}</strong> con cambios</span>
      <span><strong>${number(stateSync.identical, 0)}</strong> iguales</span>
      <span><strong>${number(selectedCount, 0)}</strong> seleccionadas</span>
    </div>
    <div class="harvest-sync-actions">
      <strong title="${htmlAttr(`Archivo: ${stateSync.fileName} | Origen BD: ${stateSync.sourceName || stateSync.fileName}`)}">${escapeHtml(stateSync.fileName)}</strong>
      <span>Origen BD: ${escapeHtml(stateSync.sourceName || stateSync.fileName)}</span>
      <button class="secondary-button" type="button" data-action="accept-all-harvest-excel-sync" ${harvestExcelSyncSaving ? "disabled" : ""}>Si a todo</button>
      <button class="secondary-button" type="button" data-action="clear-harvest-excel-sync-selection" ${harvestExcelSyncSaving ? "disabled" : ""}>Limpiar seleccion</button>
    </div>
    <div class="harvest-sync-change-list">
      ${changes.map((change) => `
        <label class="harvest-sync-change ${change.type}">
          <input type="checkbox" data-harvest-sync-accept="${htmlAttr(change.id)}" ${stateSync.accepted.has(change.id) ? "checked" : ""} ${harvestExcelSyncSaving ? "disabled" : ""}>
          <span class="harvest-sync-change-main">
            <b>${change.type === "new" ? "Nuevo" : "Cambio"}</b>
            <strong>${escapeHtml(harvestSyncRecordTitle(change))}</strong>
            <small>Fila Excel ${escapeHtml(change.payload.fila_excel)} · ${escapeHtml(change.payload.archivo_origen)}</small>
          </span>
          <span class="harvest-sync-diffs">
            ${change.type === "new"
              ? "Se insertara como nuevo registro."
              : change.diffs.slice(0, 5).map((diff) => `<em>${escapeHtml(HARVEST_EXCEL_FIELD_LABELS[diff.column] || diff.column)}: ${escapeHtml(harvestSyncDisplayValue(diff.before, diff.column))} -> ${escapeHtml(harvestSyncDisplayValue(diff.after, diff.column))}</em>`).join("")}
            ${change.diffs.length > 5 ? `<em>+${change.diffs.length - 5} campos mas</em>` : ""}
          </span>
        </label>`).join("") || `<div class="empty">No hay registros nuevos ni modificaciones.</div>`}
    </div>`;
}

async function handleHarvestExcelSyncFile(file) {
  if (!harvestExcelSyncState || !file) return;
  if (!window.XLSX) {
    harvestExcelSyncState.error = "No se cargo el lector de Excel. Recarga la pagina.";
    renderHarvestExcelSyncPreview();
    return;
  }
  const sourceName = harvestSyncCanonicalSourceName(harvestExcelSyncState.module, file.name);
  harvestExcelSyncState.fileName = file.name;
  harvestExcelSyncState.sourceName = sourceName;
  harvestExcelSyncState.error = "";
  harvestExcelSyncState.changes = [];
  harvestExcelSyncState.accepted = new Set();
  renderHarvestExcelSyncPreview();
  const container = document.getElementById("harvestExcelSyncPreview");
  if (container) {
    container.innerHTML = `
      <div class="weather-import-loading" role="status">
        <span class="weather-import-spinner" aria-hidden="true"></span>
        <strong>Comparando Excel con Supabase</strong>
        <small>Esto no guarda nada todavia.</small>
      </div>`;
  }
  try {
    const workbook = XLSX.read(await file.arrayBuffer(), { type: "array", cellDates: true });
    const cosechaRows = harvestSyncReadCosechaWorkbook(workbook, sourceName, { optional: harvestExcelSyncState.module === "export" });
    const speciesByVariety = harvestSyncSpeciesByVariety(cosechaRows);
    const records = harvestExcelSyncState.module === "export"
      ? harvestSyncReadExportWorkbook(workbook, sourceName, speciesByVariety)
      : cosechaRows;
    const result = harvestSyncBuildChanges(harvestExcelSyncState.module, records);
    harvestExcelSyncState.parsed = records.length;
    harvestExcelSyncState.changes = result.changes;
    harvestExcelSyncState.identical = result.identical;
    harvestExcelSyncState.accepted = new Set(result.changes.filter((change) => change.type === "new").map((change) => change.id));
    renderHarvestExcelSyncPreview();
  } catch (error) {
    harvestExcelSyncState.error = error.message || "Error leyendo archivo";
    renderHarvestExcelSyncPreview();
  }
}

async function saveHarvestExcelSyncAccepted() {
  if (!supabaseSession?.access_token) {
    showToast("Inicia sesion para actualizar cosecha");
    return;
  }
  if (!harvestExcelSyncState || harvestExcelSyncSaving) return;
  const accepted = (harvestExcelSyncState.changes || []).filter((change) => harvestExcelSyncState.accepted.has(change.id));
  if (!accepted.length) {
    showToast("No hay cambios seleccionados");
    return;
  }
  harvestExcelSyncSaving = true;
  renderHarvestExcelSyncPreview();
  try {
    const byTable = new Map();
    accepted.forEach((change) => {
      const rows = byTable.get(change.table) || { inserts: [], updates: [] };
      const payload = { ...change.payload };
      if (change.type === "modified" && change.rowId) rows.updates.push({ id: change.rowId, payload });
      else rows.inserts.push(payload);
      byTable.set(change.table, rows);
    });
    for (const [table, batches] of byTable.entries()) {
      for (let start = 0; start < batches.inserts.length; start += 200) {
        const chunk = batches.inserts.slice(start, start + 200);
        if (chunk.length) {
          await sbFetch(`/rest/v1/${table}?on_conflict=archivo_origen,fila_excel`, {
            method: "POST",
            prefer: "resolution=merge-duplicates,return=minimal",
            body: JSON.stringify(chunk)
          });
        }
      }
      for (const update of batches.updates) {
        await sbFetch(`/rest/v1/${table}?id=eq.${encodeURIComponent(update.id)}`, {
          method: "PATCH",
          prefer: "return=minimal",
          body: JSON.stringify(update.payload)
        });
      }
    }
    const updatedModules = [...byTable.keys()].map((table) => table === "cosecha_analisis" ? "harvestAnalysis" : "harvestExport");
    invalidateCloudModules(updatedModules);
    await loadCloudData({ modules: updatedModules, force: true, render: false });
    render();
    document.getElementById("purchaseDialog")?.close();
    showToast(`Actualizacion aplicada: ${accepted.length} registros`);
  } catch (error) {
    showToast(`No se guardo la actualizacion: ${error.message}`);
  } finally {
    harvestExcelSyncSaving = false;
    renderHarvestExcelSyncPreview();
  }
}

function harvestSelectOptions(values, selected, formatter = (value) => value) {
  return values.map((value) => `<option value="${htmlAttr(value)}" ${value === selected ? "selected" : ""}>${escapeHtml(formatter(value))}</option>`).join("");
}

function harvestExportFilteredRows() {
  return (state.harvestExportRecords || []).filter((row) => {
    if (harvestExportYearFilter !== "Todos" && String(row.year) !== harvestExportYearFilter) return false;
    if (harvestExportSpeciesFilter !== "Todas" && row.species !== harvestExportSpeciesFilter) return false;
    if (harvestExportVarietyFilter !== "Todas" && row.variety !== harvestExportVarietyFilter) return false;
    if (harvestExportPotreroFilter !== "Todos" && row.potrero !== harvestExportPotreroFilter) return false;
    return true;
  });
}

function harvestExportSummary(rows) {
  const sentKg = rows.reduce((sum, row) => sum + harvestNumericValue(row.sentKg), 0);
  const receivedKg = rows.reduce((sum, row) => sum + harvestNumericValue(row.receivedKg), 0);
  const toProcessKg = rows.reduce((sum, row) => sum + harvestNumericValue(row.toProcessKg), 0);
  const exportedKg = rows.reduce((sum, row) => sum + harvestNumericValue(row.exportedKg), 0);
  const exportPercentRows = rows.filter(harvestHasExportPercent);
  return {
    rows: rows.length,
    bins: rows.reduce((sum, row) => sum + harvestNumericValue(row.bins), 0),
    sentKg,
    receivedKg,
    toProcessKg,
    exportedKg,
    exportPercent: exportPercentRows.length
      ? exportPercentRows.reduce((sum, row) => sum + harvestExportPercentRatio(row.exportPercent), 0) / exportPercentRows.length
      : 0
  };
}

function harvestAggregateRows(rows, getKey, getValue, getDetail) {
  const map = new Map();
  rows.forEach((row) => {
    const label = harvestCleanValue(getKey(row));
    const current = map.get(label) || { label, value: 0, detail: "" };
    current.value += harvestNumericValue(getValue(row));
    current.detail = getDetail ? getDetail(row, current) : current.detail;
    map.set(label, current);
  });
  return [...map.values()].sort((a, b) => b.value - a.value || a.label.localeCompare(b.label, "es", { numeric: true }));
}

function harvestAnalyticsBars(title, rows, options = {}) {
  const top = rows.slice(0, options.limit || 14);
  const max = Math.max(1, ...top.map((row) => harvestNumericValue(row.value)));
  const unit = options.unit || "";
  const decimals = options.decimals ?? 0;
  return `
    <article class="panel harvest-analytics-card">
      <div class="panel-header">
        <div><h2>${escapeHtml(title)}</h2></div>
        ${options.badge ? `<span class="badge">${escapeHtml(options.badge)}</span>` : ""}
      </div>
      <div class="harvest-analytics-bars">
        ${top.map((row) => {
          const width = Math.max(3, harvestNumericValue(row.value) / max * 100);
          const active = options.activeValue && row.label === options.activeValue ? " active" : "";
          const body = `
            <span title="${htmlAttr(row.detail || row.label)}">${escapeHtml(options.labelFormatter ? options.labelFormatter(row.label) : row.label)}</span>
            <div><i style="width:${width}%"></i></div>
            <strong>${number(row.value, decimals)}${unit}</strong>`;
          if (!options.action) return `<div class="harvest-analytics-bar${active}">${body}</div>`;
          return `<button class="harvest-analytics-bar${active}" type="button" data-action="${htmlAttr(options.action)}" data-value="${htmlAttr(row.label)}">${body}</button>`;
        }).join("") || `<div class="empty">Sin datos para mostrar.</div>`}
      </div>
    </article>`;
}

function harvestExportCalibreEntries(rows, key = "calibresKg") {
  const totals = new Map();
  rows.forEach((row) => {
    Object.entries(row[key] || {}).forEach(([calibre, value]) => {
      const numeric = harvestNumericValue(value);
      if (!numeric) return;
      totals.set(calibre, (totals.get(calibre) || 0) + numeric);
    });
  });
  return [...totals.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label, "es", { numeric: true }));
}

function harvestExportCalibreDistribution(rows) {
  const entries = harvestExportCalibreEntries(rows, "calibresKg");
  const total = entries.reduce((sum, row) => sum + row.value, 0);
  return harvestAnalyticsBars("Calibres kg", entries.map((row) => ({
    ...row,
    detail: `${number(total ? row.value / total * 100 : 0, 1)}% del total de calibres`
  })), { unit: " kg", decimals: 0, badge: total ? `${number(total, 0)} kg` : "" });
}

function harvestExportCalibreByVariety(rows) {
  const groups = new Map();
  rows.forEach((row) => {
    const variety = row.variety || "Sin variedad";
    const potrero = row.potrero || "Sin potrero";
    const key = `${variety}|||${potrero}`;
    if (!groups.has(key)) groups.set(key, { variety, potrero, rows: [] });
    groups.get(key).rows.push(row);
  });
  const tableRows = [...groups.values()].map((group) => {
    const scoped = group.rows;
    const entries = harvestExportCalibreEntries(scoped, "calibresKg");
    const total = entries.reduce((sum, row) => sum + row.value, 0);
    const top = entries.slice(0, 6);
    return { variety: group.variety, potrero: group.potrero, total, top };
  }).filter((row) => row.total > 0)
    .sort((a, b) => b.total - a.total || a.variety.localeCompare(b.variety, "es", { numeric: true }) || a.potrero.localeCompare(b.potrero, "es", { numeric: true }));
  return `
    <article class="panel harvest-analytics-card harvest-calibre-table-card">
      <div class="panel-header"><div><h2>Calibres por variedad y potrero</h2></div></div>
      <div class="table-wrap harvest-analytics-table">
        <table>
          <thead><tr><th>Variedad</th><th>Potrero</th><th>Total calibre kg</th><th>Principales calibres</th></tr></thead>
          <tbody>${tableRows.map((row) => `
            <tr>
              <td data-label="Variedad"><strong>${escapeHtml(row.variety)}</strong></td>
              <td data-label="Potrero">${escapeHtml(potreroLabel(row.potrero))}</td>
              <td data-label="Total calibre kg">${number(row.total, 0)} kg</td>
              <td data-label="Principales calibres">
                <div class="harvest-calibre-chips">
                  ${row.top.map((item) => `<span>${escapeHtml(item.label)} <b>${number(row.total ? item.value / row.total * 100 : 0, 1)}%</b></span>`).join("")}
                </div>
              </td>
            </tr>`).join("") || `<tr><td colspan="4">Sin calibres para el filtro.</td></tr>`}
          </tbody>
        </table>
      </div>
    </article>`;
}

function renderHarvestExport() {
  const allRows = state.harvestExportRecords || [];
  if (!allRows.length) {
    views.harvestExport.innerHTML = `
      <section class="panel">
        <div class="empty-state">
          <strong>Sin datos de exportacion</strong>
          <p>Ejecuta supabase_cosecha_analisis.sql y luego carga los datos de COSECHA SUPA.xlsx.</p>
        </div>
      </section>`;
    return;
  }
  const years = ["Todos", ...new Set(allRows.map((row) => String(row.year || "")).filter(Boolean))].sort((a, b) => a === "Todos" ? -1 : b === "Todos" ? 1 : Number(b) - Number(a));
  const species = harvestOptionValues(allRows, (row) => row.species, "Todas");
  const scopedForVarieties = allRows.filter((row) => harvestExportSpeciesFilter === "Todas" || row.species === harvestExportSpeciesFilter);
  const varieties = harvestOptionValues(scopedForVarieties, (row) => row.variety, "Todas");
  const potreros = harvestOptionValues(scopedForVarieties, (row) => row.potrero, "Todos");
  if (!years.includes(harvestExportYearFilter)) harvestExportYearFilter = "Todos";
  if (!species.includes(harvestExportSpeciesFilter)) harvestExportSpeciesFilter = "Todas";
  if (!varieties.includes(harvestExportVarietyFilter)) harvestExportVarietyFilter = "Todas";
  if (!potreros.includes(harvestExportPotreroFilter)) harvestExportPotreroFilter = "Todos";
  const rows = harvestExportFilteredRows();
  const summary = harvestExportSummary(rows);
  const byPotrero = harvestAggregateRows(rows, (row) => row.potrero, (row) => row.receivedKg, (row, current) => `${number(current.value, 0)} kg recepcionados`);
  const byVariety = harvestAggregateRows(rows, (row) => row.variety, (row) => row.exportedKg || row.receivedKg);
  views.harvestExport.innerHTML = `
      ${kpi("Enviados kg", number(summary.sentKg, 0), `${number(summary.bins, 0)} bins`)}
      ${kpi("Recepcionados kg", number(summary.receivedKg, 0), `${number(summary.rows, 0)} registros`)}
      ${kpi("Kg por procesar", number(summary.toProcessKg, 0), "Pendiente de proceso")}
      ${kpi("% Expo", harvestRatioLabel(summary.exportPercent), "Columna % expo")}
    </div>
    <section class="panel harvest-analytics-panel">
      <div class="panel-header">
        <div><h2>Exportacion</h2><p>Analisis por potrero, variedad y calibre.</p></div>
      </div>
      <div class="program-filters harvest-analytics-filters">
        <label>Año<select data-harvest-export-filter="year">${harvestSelectOptions(years, harvestExportYearFilter)}</select></label>
        <label>Especie<select data-harvest-export-filter="species">${harvestSelectOptions(species, harvestExportSpeciesFilter)}</select></label>
        <label>Variedad<select data-harvest-export-filter="variety">${harvestSelectOptions(varieties, harvestExportVarietyFilter)}</select></label>
        <label>Potrero<select data-harvest-export-filter="potrero">${harvestSelectOptions(potreros, harvestExportPotreroFilter, potreroLabel)}</select></label>
        <button class="secondary-button" type="button" data-action="clear-harvest-export-filters">Limpiar</button>
      </div>
      <div class="harvest-analytics-grid">
        ${harvestAnalyticsBars("Recepcionados por potrero", byPotrero, { unit: " kg", decimals: 0, labelFormatter: potreroLabel })}
        ${harvestAnalyticsBars("Exportacion por variedad", byVariety, { unit: " kg", decimals: 0 })}
        ${harvestExportCalibreDistribution(rows)}
        ${harvestExportCalibreByVariety(rows)}
      </div>
      ${renderHarvestExportTable(rows)}
    </section>`;
  wireHarvestExportFilters();
}

function renderHarvestExportTable(rows) {
  const grouped = harvestAggregateExportRows(rows);
  return `
    <section class="panel harvest-analytics-card harvest-full-width">
      <div class="panel-header"><div><h2>Resumen exportacion</h2></div></div>
      <div class="table-wrap harvest-analytics-table">
        <table>
          <thead><tr><th>Año</th><th>Potrero</th><th>Especie</th><th>Variedad</th><th>Enviados</th><th>Recepcionados</th><th>Por procesar</th><th>% Expo</th></tr></thead>
          <tbody>${grouped.map((row) => `
            <tr>
              <td data-label="Año">${escapeHtml(row.year)}</td>
              <td data-label="Potrero"><strong>${escapeHtml(potreroLabel(row.potrero))}</strong></td>
              <td data-label="Especie">${escapeHtml(row.species)}</td>
              <td data-label="Variedad">${escapeHtml(row.variety)}</td>
              <td data-label="Enviados">${number(row.sentKg, 0)} kg</td>
              <td data-label="Recepcionados">${number(row.receivedKg, 0)} kg</td>
              <td data-label="Por procesar">${number(row.toProcessKg, 0)} kg</td>
              <td data-label="% Expo">${harvestRatioLabel(row.exportPercent)}</td>
            </tr>`).join("") || `<tr><td colspan="8">Sin datos para el filtro.</td></tr>`}
          </tbody>
        </table>
      </div>
    </section>`;
}

function harvestAggregateExportRows(rows) {
  const map = new Map();
  rows.forEach((row) => {
    const key = `${row.year}|${row.potrero}|${row.species}|${row.variety}`;
    const current = map.get(key) || {
      year: row.year || "",
      potrero: row.potrero || "Sin potrero",
      species: row.species || "Sin especie",
      variety: row.variety || "Sin variedad",
      sentKg: 0,
      receivedKg: 0,
      inProcessKg: 0,
      toProcessKg: 0,
      exportedKg: 0,
      wasteKg: 0,
      exportPercentSum: 0,
      exportPercentCount: 0
    };
    current.sentKg += harvestNumericValue(row.sentKg);
    current.receivedKg += harvestNumericValue(row.receivedKg);
    current.inProcessKg += harvestNumericValue(row.inProcessKg);
    current.toProcessKg += harvestNumericValue(row.toProcessKg);
    current.exportedKg += harvestNumericValue(row.exportedKg);
    current.wasteKg += harvestNumericValue(row.wasteKg);
    if (harvestHasExportPercent(row)) {
      current.exportPercentSum += harvestExportPercentRatio(row.exportPercent);
      current.exportPercentCount += 1;
    }
    map.set(key, current);
  });
  return [...map.values()].map((row) => ({
    ...row,
    exportPercent: harvestExportPercentFromTotals(row.exportedKg, row.inProcessKg, row.exportPercentSum, row.exportPercentCount)
  })).sort((a, b) => String(b.year).localeCompare(String(a.year)) || comparePotrero(a.potrero, b.potrero) || a.variety.localeCompare(b.variety, "es", { numeric: true }));
}

function wireHarvestExportFilters() {
  document.querySelectorAll("[data-harvest-export-filter]").forEach((control) => {
    control.addEventListener("change", (event) => {
      const target = event.target;
      if (target.dataset.harvestExportFilter === "year") harvestExportYearFilter = target.value;
      if (target.dataset.harvestExportFilter === "species") {
        harvestExportSpeciesFilter = target.value;
        harvestExportVarietyFilter = "Todas";
        harvestExportPotreroFilter = "Todos";
      }
      if (target.dataset.harvestExportFilter === "variety") harvestExportVarietyFilter = target.value;
      if (target.dataset.harvestExportFilter === "potrero") harvestExportPotreroFilter = target.value;
      renderHarvestExport();
    });
  });
}

function harvestExportYears(rows = state.harvestExportRecords || []) {
  return [...new Set(rows.map((row) => String(row.year || "")).filter(Boolean))].sort((a, b) => Number(a) - Number(b));
}

function ensureHarvestExportYearSelection(rows = state.harvestExportRecords || []) {
  const available = harvestExportYears(rows);
  harvestExportSelectedYears = new Set([...harvestExportSelectedYears].filter((year) => available.includes(year)));
  if (!harvestExportSelectedYears.size && available.length) {
    harvestExportSelectedYears = new Set([available.includes("2026") ? "2026" : available[available.length - 1]]);
  }
}

function harvestExportFilteredRows() {
  ensureHarvestExportYearSelection();
  return (state.harvestExportRecords || []).filter((row) => {
    if (harvestExportSelectedYears.size && !harvestExportSelectedYears.has(String(row.year))) return false;
    if (harvestExportSpeciesFilter !== "Todas" && row.species !== harvestExportSpeciesFilter) return false;
    if (harvestExportVarietyFilter !== "Todas" && row.variety !== harvestExportVarietyFilter) return false;
    if (harvestExportPotreroFilter !== "Todos" && row.potrero !== harvestExportPotreroFilter) return false;
    return true;
  });
}

function harvestParseCalibreLabel(value) {
  const text = String(value || "").trim().replace(/\s+/g, " ").replace(/^(CAJ|CAJA|CAJAS)\s+/i, "");
  const match = text.match(/^(.+?)\s+(CAT\s*1|CAT\s*2)$/i);
  if (!match) return { calibre: text, category: "" };
  return {
    calibre: match[1].trim(),
    category: match[2].replace(/\s+/g, "").toUpperCase()
  };
}

function harvestAggregateExportRows(rows) {
  const map = new Map();
  rows.forEach((row) => {
    const key = `${row.year}|${row.species}|${row.variety}|${row.potrero}`;
    const current = map.get(key) || {
      year: row.year || "",
      species: row.species || "Sin especie",
      variety: row.variety || "Sin variedad",
      potrero: row.potrero || "Sin potrero",
      bins: 0,
      sentKg: 0,
      receivedKg: 0,
      differenceKg: 0,
      inProcessKg: 0,
      toProcessKg: 0,
      exportedKg: 0,
      discardKg: 0,
      precalibreKg: 0,
      wasteKg: 0,
      shrinkKg: 0,
      exportPercentSum: 0,
      exportPercentCount: 0
    };
    current.bins += harvestNumericValue(row.bins);
    current.sentKg += harvestNumericValue(row.sentKg);
    current.receivedKg += harvestNumericValue(row.receivedKg);
    current.differenceKg += harvestNumericValue(row.differenceKg);
    current.inProcessKg += harvestNumericValue(row.inProcessKg);
    current.toProcessKg += harvestNumericValue(row.toProcessKg);
    current.exportedKg += harvestNumericValue(row.exportedKg);
    current.discardKg += harvestNumericValue(row.discardKg);
    current.precalibreKg += harvestNumericValue(row.precalibreKg);
    current.wasteKg += harvestNumericValue(row.wasteKg);
    current.shrinkKg += harvestNumericValue(row.shrinkKg);
    if (harvestHasExportPercent(row)) {
      current.exportPercentSum += harvestExportPercentRatio(row.exportPercent);
      current.exportPercentCount += 1;
    }
    map.set(key, current);
  });
  return [...map.values()].map((row) => ({
    ...row,
    exportPercent: harvestExportPercentFromTotals(row.exportedKg, row.inProcessKg, row.exportPercentSum, row.exportPercentCount)
  })).sort((a, b) =>
    String(b.year).localeCompare(String(a.year), "es", { numeric: true })
    || a.species.localeCompare(b.species, "es", { numeric: true })
    || a.variety.localeCompare(b.variety, "es", { numeric: true })
    || comparePotrero(a.potrero, b.potrero)
  );
}

function harvestExportComparisonRows(rows) {
  const years = [...harvestExportSelectedYears].sort((a, b) => Number(a) - Number(b));
  const groups = new Map();
  rows.forEach((row) => {
    const label = `${row.variety || "Sin variedad"} / ${potreroLabel(row.potrero || "Sin potrero")}`;
    const key = `${row.species || "Sin especie"}|${label}`;
    if (!groups.has(key)) groups.set(key, { label, species: row.species || "Sin especie", values: new Map(), total: 0 });
    const value = harvestNumericValue(row.exportedKg);
    groups.get(key).values.set(String(row.year), (groups.get(key).values.get(String(row.year)) || 0) + value);
    groups.get(key).total += value;
  });
  return [...groups.values()]
    .filter((row) => row.total)
    .sort((a, b) => a.species.localeCompare(b.species, "es", { numeric: true }) || b.total - a.total || a.label.localeCompare(b.label, "es", { numeric: true }))
    .slice(0, 18)
    .map((group) => ({
      ...group,
      bars: years.map((year, index) => ({
        year,
        value: group.values.get(year) || 0,
        color: harvestYearColor(index)
      }))
    }));
}

function harvestExportPercentFromTotals(exportedKg, inProcessKg, percentSum = 0, percentCount = 0) {
  const process = harvestNumericValue(inProcessKg);
  if (process) return harvestNumericValue(exportedKg) / process;
  return percentCount ? percentSum / percentCount : 0;
}

function harvestExportYearPercentRows(rows) {
  const byYear = new Map();
  rows.forEach((row) => {
    const year = String(row.year || "");
    if (!year) return;
    const current = byYear.get(year) || {
      year,
      inProcessKg: 0,
      receivedKg: 0,
      exportedKg: 0,
      bins: 0,
      rows: 0,
      percentSum: 0,
      percentCount: 0
    };
    current.inProcessKg += harvestNumericValue(row.inProcessKg);
    current.receivedKg += harvestNumericValue(row.receivedKg);
    current.exportedKg += harvestNumericValue(row.exportedKg);
    current.bins += harvestNumericValue(row.bins);
    current.rows += 1;
    if (harvestHasExportPercent(row)) {
      current.percentSum += harvestExportPercentRatio(row.exportPercent);
      current.percentCount += 1;
    }
    byYear.set(year, current);
  });
  const items = [...byYear.values()]
    .map((row) => ({
      ...row,
      percent: harvestExportPercentFromTotals(row.exportedKg, row.inProcessKg, row.percentSum, row.percentCount)
    }))
    .sort((a, b) => Number(a.year) - Number(b.year));
  const yearsWithPercent = items.filter((row) => row.percentCount);
  return {
    items,
    average: yearsWithPercent.length ? yearsWithPercent.reduce((sum, row) => sum + row.percent, 0) / yearsWithPercent.length : 0
  };
}

function harvestExportVarietyPercentRows(rows) {
  const byVarietyYear = new Map();
  rows.forEach((row) => {
    const year = String(row.year || "");
    const variety = row.variety || "Sin variedad";
    if (!year || !variety) return;
    const key = `${year}|${row.species || "Sin especie"}|${variety}`;
    const current = byVarietyYear.get(key) || {
      year,
      species: row.species || "Sin especie",
      variety,
      inProcessKg: 0,
      exportedKg: 0,
      percentSum: 0,
      percentCount: 0
    };
    current.inProcessKg += harvestNumericValue(row.inProcessKg);
    current.exportedKg += harvestNumericValue(row.exportedKg);
    if (harvestHasExportPercent(row)) {
      current.percentSum += harvestExportPercentRatio(row.exportPercent);
      current.percentCount += 1;
    }
    byVarietyYear.set(key, current);
  });
  return [...byVarietyYear.values()]
    .map((row) => ({
      ...row,
      percent: harvestExportPercentFromTotals(row.exportedKg, row.inProcessKg, row.percentSum, row.percentCount)
    }))
    .filter((row) => row.inProcessKg || row.exportedKg || row.percentCount)
    .sort((a, b) =>
      a.species.localeCompare(b.species, "es", { numeric: true })
      || a.variety.localeCompare(b.variety, "es", { numeric: true })
      || Number(a.year) - Number(b.year)
    );
}

function renderHarvestExportPercentSummary(rows) {
  const { items, average } = harvestExportYearPercentRows(rows);
  const maxPercent = Math.max(0.01, ...items.map((row) => row.percent));
  return `
    <article class="panel harvest-analytics-card harvest-full-width harvest-export-percent-summary">
      <div class="panel-header">
        <div>
          <h2>% exportacion promedio por a&ntilde;o</h2>
          <p>Exportados sobre kg en proceso.</p>
        </div>
        <span>${harvestRatioLabel(average)}</span>
      </div>
      <div class="harvest-export-percent-list">
        ${items.map((row, index) => {
          const diff = row.percent - average;
          const diffClass = Math.abs(diff) < 0.0001 ? "neutral" : diff > 0 ? "positive" : "negative";
          const diffLabel = `${diff > 0 ? "+" : ""}${number(diff * 100, 1)} pts`;
          return `<section class="harvest-export-percent-card">
            <header>
              <strong>A&ntilde;o ${escapeHtml(row.year)}</strong>
              <b>${harvestRatioLabel(row.percent)}</b>
            </header>
            <div><i style="width:${Math.max(3, row.percent / maxPercent * 100)}%; --bar-color:${htmlAttr(harvestYearColor(index))}"></i></div>
            <footer>
              <small>${number(row.exportedKg, 0)} / ${number(row.inProcessKg, 0)} kg</small>
              <em class="${diffClass}">${escapeHtml(diffLabel)}</em>
            </footer>
          </section>`;
        }).join("") || `<div class="empty">Sin datos de porcentaje para el filtro.</div>`}
      </div>
    </article>`;
}

function renderHarvestExportVarietyPercentSummary(rows) {
  const items = harvestExportVarietyPercentRows(rows);
  const maxPercent = Math.max(0.01, ...items.map((row) => row.percent));
  return `
    <article class="panel harvest-analytics-card harvest-full-width harvest-export-percent-summary harvest-export-variety-percent-summary">
      <div class="panel-header">
        <div>
          <h2>% exportacion por variedad y a&ntilde;o</h2>
          <p>Exportados sobre kg en proceso por variedad.</p>
        </div>
        <span>${items.length} grupos</span>
      </div>
      <div class="harvest-export-percent-list harvest-export-variety-percent-list">
        ${items.map((row) => {
          return `<section class="harvest-export-percent-card harvest-export-variety-percent-card">
          <header>
            <strong>${escapeHtml(row.variety)}</strong>
            <b>${harvestRatioLabel(row.percent)}</b>
          </header>
          <div><i style="width:${Math.max(3, row.percent / maxPercent * 100)}%; --bar-color:${htmlAttr(harvestVarietyColor(row.variety))}"></i></div>
          <footer>
            <small>${escapeHtml(row.species)} · ${escapeHtml(row.year)}</small>
            <em class="neutral">${number(row.exportedKg, 0)} / ${number(row.inProcessKg, 0)} kg</em>
          </footer>
        </section>`;
        }).join("") || `<div class="empty">Sin datos por variedad para el filtro.</div>`}
      </div>
    </article>`;
}

function renderHarvestExportVarietyPercentSummaryByYear(rows) {
  const items = harvestExportVarietyPercentRows(rows);
  const maxPercent = Math.max(0.01, ...items.map((row) => row.percent));
  const yearGroups = new Map();
  items.forEach((row) => {
    const year = String(row.year || "Sin ano");
    if (!yearGroups.has(year)) yearGroups.set(year, []);
    yearGroups.get(year).push(row);
  });
  const orderedYears = [...yearGroups.entries()].sort((a, b) => String(b[0]).localeCompare(String(a[0]), "es", { numeric: true }));
  return `
    <article class="panel harvest-analytics-card harvest-full-width harvest-export-percent-summary harvest-export-variety-percent-summary">
      <div class="panel-header">
        <div>
          <h2>% exportacion por variedad y a&ntilde;o</h2>
          <p>Exportados sobre kg en proceso por variedad.</p>
        </div>
        <span>${items.length} grupos</span>
      </div>
      <div class="harvest-export-variety-year-stack">
        ${orderedYears.map(([year, yearRows]) => {
          const yearExported = yearRows.reduce((sum, row) => sum + harvestNumericValue(row.exportedKg), 0);
          const yearInProcess = yearRows.reduce((sum, row) => sum + harvestNumericValue(row.inProcessKg), 0);
          const yearPercent = harvestExportPercentFromTotals(yearExported, yearInProcess);
          return `<section class="harvest-export-variety-year-block">
            <header>
              <div>
                <strong>A&ntilde;o ${escapeHtml(year)}</strong>
                <small>${yearRows.length} variedades</small>
              </div>
              <b>${harvestRatioLabel(yearPercent)}</b>
              <span>${number(yearExported, 0)} / ${number(yearInProcess, 0)} kg</span>
            </header>
            <div class="harvest-export-percent-list harvest-export-variety-percent-list">
              ${yearRows.map((row) => `<section class="harvest-export-percent-card harvest-export-variety-percent-card">
                <header>
                  <strong>${escapeHtml(row.variety)}</strong>
                  <b>${harvestRatioLabel(row.percent)}</b>
                </header>
                <div><i style="width:${Math.max(3, row.percent / maxPercent * 100)}%; --bar-color:${htmlAttr(harvestVarietyColor(row.variety))}"></i></div>
                <footer>
                  <small>${escapeHtml(row.species)}</small>
                  <em class="neutral">${number(row.exportedKg, 0)} / ${number(row.inProcessKg, 0)} kg</em>
                </footer>
              </section>`).join("")}
            </div>
          </section>`;
        }).join("") || `<div class="empty">Sin datos por variedad para el filtro.</div>`}
      </div>
    </article>`;
}

function harvestExportYearTotals(yearRows) {
  const totals = yearRows.reduce((acc, row) => {
    acc.bins += harvestNumericValue(row.bins);
    acc.sentKg += harvestNumericValue(row.sentKg);
    acc.receivedKg += harvestNumericValue(row.receivedKg);
    acc.differenceKg += harvestNumericValue(row.differenceKg);
    acc.inProcessKg += harvestNumericValue(row.inProcessKg);
    acc.toProcessKg += harvestNumericValue(row.toProcessKg);
    acc.exportedKg += harvestNumericValue(row.exportedKg);
    acc.discardKg += harvestNumericValue(row.discardKg);
    acc.precalibreKg += harvestNumericValue(row.precalibreKg);
    acc.wasteKg += harvestNumericValue(row.wasteKg);
    acc.shrinkKg += harvestNumericValue(row.shrinkKg);
    return acc;
  }, {
    bins: 0,
    sentKg: 0,
    receivedKg: 0,
    differenceKg: 0,
    inProcessKg: 0,
    toProcessKg: 0,
    exportedKg: 0,
    discardKg: 0,
    precalibreKg: 0,
    wasteKg: 0,
    shrinkKg: 0
  });
  return {
    ...totals,
    exportPercent: harvestExportPercentFromTotals(totals.exportedKg, totals.inProcessKg)
  };
}

function renderHarvestExportTableByYear(rows) {
  const grouped = harvestAggregateExportRows(rows);
  const yearGroups = new Map();
  grouped.forEach((row) => {
    const year = String(row.year || "Sin ano");
    if (!yearGroups.has(year)) yearGroups.set(year, []);
    yearGroups.get(year).push(row);
  });
  const orderedYears = [...yearGroups.entries()].sort((a, b) => String(b[0]).localeCompare(String(a[0]), "es", { numeric: true }));
  return `
    <section class="panel harvest-analytics-card harvest-full-width harvest-export-summary-panel">
      <div class="panel-header"><div><h2>Resumen exportacion</h2><p>Datos agregados por ano, especie, variedad y potrero.</p></div></div>
      <div class="table-wrap harvest-analytics-table harvest-export-table-wrap">
        <table class="harvest-export-main-table">
          <thead><tr><th>Ano</th><th>Variedad</th><th>Potrero</th><th>Bins</th><th>Enviados</th><th>Recep.</th><th>Dif.</th><th>Proces.</th><th>P/proc.</th><th>Export.</th><th>Desc.</th><th>Precal.</th><th>Desecho</th><th>Merma</th><th>%</th></tr></thead>
          <tbody>${orderedYears.map(([year, yearRows]) => {
            let currentSpecies = "";
            const totals = harvestExportYearTotals(yearRows);
            return `<tr class="harvest-export-year-row">
              <td colspan="15"><div><strong>A&ntilde;o ${escapeHtml(year)}</strong><span>${yearRows.length} grupos</span><b>${number(totals.exportedKg, 0)} kg exportados</b></div></td>
            </tr>${yearRows.map((row) => {
              const header = row.species !== currentSpecies ? `<tr class="harvest-species-row"><td colspan="15">${escapeHtml(row.species)}</td></tr>` : "";
              currentSpecies = row.species;
              return `${header}<tr>
                <td data-label="Ano">${escapeHtml(row.year)}</td>
                <td data-label="VARIEDAD"><strong>${escapeHtml(row.variety)}</strong></td>
                <td data-label="Potrero">${escapeHtml(potreroLabel(row.potrero))}</td>
                <td data-label="Nro Bins.">${number(row.bins, 1)}</td>
                <td data-label="Enviados Kg.">${number(row.sentKg, 0)}</td>
                <td data-label="Kg Recepcionados.">${number(row.receivedKg, 0)}</td>
                <td data-label="Dif Kg">${number(row.differenceKg, 0)}</td>
                <td data-label="Kg Procesados.">${number(row.inProcessKg, 0)}</td>
                <td data-label="Por Procesar.">${number(row.toProcessKg, 0)}</td>
                <td data-label="Real Exportado.">${number(row.exportedKg, 0)}</td>
                <td data-label="Descarte.">${number(row.discardKg, 0)}</td>
                <td data-label="Precalibre.">${number(row.precalibreKg, 0)}</td>
                <td data-label="Desecho.">${number(row.wasteKg, 0)}</td>
                <td data-label="Merma.">${number(row.shrinkKg, 0)}</td>
                <td data-label="Porcentaje %.">${harvestRatioLabel(row.exportPercent)}</td>
              </tr>`;
            }).join("")}<tr class="harvest-export-year-total-row">
              <td data-label="Ano"><strong>${escapeHtml(year)}</strong></td>
              <td data-label="VARIEDAD" colspan="2"><strong>Total a&ntilde;o ${escapeHtml(year)}</strong></td>
              <td data-label="Nro Bins."><strong>${number(totals.bins, 1)}</strong></td>
              <td data-label="Enviados Kg."><strong>${number(totals.sentKg, 0)}</strong></td>
              <td data-label="Kg Recepcionados."><strong>${number(totals.receivedKg, 0)}</strong></td>
              <td data-label="Dif Kg"><strong>${number(totals.differenceKg, 0)}</strong></td>
              <td data-label="Kg Procesados."><strong>${number(totals.inProcessKg, 0)}</strong></td>
              <td data-label="Por Procesar."><strong>${number(totals.toProcessKg, 0)}</strong></td>
              <td data-label="Real Exportado."><strong>${number(totals.exportedKg, 0)}</strong></td>
              <td data-label="Descarte."><strong>${number(totals.discardKg, 0)}</strong></td>
              <td data-label="Precalibre."><strong>${number(totals.precalibreKg, 0)}</strong></td>
              <td data-label="Desecho."><strong>${number(totals.wasteKg, 0)}</strong></td>
              <td data-label="Merma."><strong>${number(totals.shrinkKg, 0)}</strong></td>
              <td data-label="Porcentaje %."><strong>${harvestRatioLabel(totals.exportPercent)}</strong></td>
            </tr>`;
          }).join("") || `<tr><td colspan="15">Sin datos para el filtro.</td></tr>`}
          </tbody>
        </table>
      </div>
    </section>`;
}

function renderHarvestExportComparison(rows) {
  const items = harvestExportComparisonRows(rows);
  const max = Math.max(1, ...items.flatMap((item) => item.bars.map((bar) => bar.value)));
  return `
    <article class="panel harvest-analytics-card harvest-full-width harvest-export-comparison-card">
      <div class="panel-header"><div><h2>Comparacion anual de real exportado</h2><p>Por variedad y potrero.</p></div></div>
      <div class="harvest-variety-year-legend">
        ${[...harvestExportSelectedYears].sort((a, b) => Number(a) - Number(b)).map((year, index) => `<span><i style="--bar-color:${htmlAttr(harvestYearColor(index))}"></i>${escapeHtml(year)}</span>`).join("")}
      </div>
      <div class="harvest-export-comparison-list">
        ${items.map((item) => `<section class="harvest-export-comparison-row">
          <strong>${escapeHtml(item.label)}</strong>
          <small>${escapeHtml(item.species)}</small>
          <div>${item.bars.map((bar) => {
            const height = bar.value ? Math.max(5, bar.value / max * 100) : 0;
            return `<span title="${htmlAttr(`${item.label} ${bar.year}: ${number(bar.value, 0)} kg`)}"><b>${number(bar.value, 0)}</b><i style="height:${height}%; --bar-color:${htmlAttr(bar.color)}"></i><em>${escapeHtml(bar.year)}</em></span>`;
          }).join("")}</div>
        </section>`).join("") || `<div class="empty">Sin datos para comparar.</div>`}
      </div>
    </article>`;
}

function renderHarvestExportTable(rows) {
  const grouped = harvestAggregateExportRows(rows);
  let currentSpecies = "";
  return `
    <section class="panel harvest-analytics-card harvest-full-width harvest-export-summary-panel">
      <div class="panel-header"><div><h2>Resumen exportacion</h2><p>Datos agregados por ano, especie, variedad y potrero.</p></div></div>
      <div class="table-wrap harvest-analytics-table harvest-export-table-wrap">
        <table class="harvest-export-main-table">
          <thead><tr><th>Ano</th><th>Variedad</th><th>Potrero</th><th>Bins</th><th>Enviados</th><th>Recep.</th><th>Dif.</th><th>Proces.</th><th>P/proc.</th><th>Export.</th><th>Desc.</th><th>Precal.</th><th>Desecho</th><th>Merma</th><th>%</th></tr></thead>
          <tbody>${grouped.map((row) => {
            const header = row.species !== currentSpecies ? `<tr class="harvest-species-row"><td colspan="15">${escapeHtml(row.species)}</td></tr>` : "";
            currentSpecies = row.species;
            return `${header}<tr>
              <td data-label="Ano">${escapeHtml(row.year)}</td>
              <td data-label="VARIEDAD"><strong>${escapeHtml(row.variety)}</strong></td>
              <td data-label="Potrero">${escapeHtml(potreroLabel(row.potrero))}</td>
              <td data-label="Nro Bins.">${number(row.bins, 1)}</td>
              <td data-label="Enviados Kg.">${number(row.sentKg, 0)}</td>
              <td data-label="Kg Recepcionados.">${number(row.receivedKg, 0)}</td>
              <td data-label="Dif Kg">${number(row.differenceKg, 0)}</td>
              <td data-label="Kg Procesados.">${number(row.inProcessKg, 0)}</td>
              <td data-label="Por Procesar.">${number(row.toProcessKg, 0)}</td>
              <td data-label="Real Exportado.">${number(row.exportedKg, 0)}</td>
              <td data-label="Descarte.">${number(row.discardKg, 0)}</td>
              <td data-label="Precalibre.">${number(row.precalibreKg, 0)}</td>
              <td data-label="Desecho.">${number(row.wasteKg, 0)}</td>
              <td data-label="Merma.">${number(row.shrinkKg, 0)}</td>
              <td data-label="Porcentaje %.">${harvestRatioLabel(row.exportPercent)}</td>
            </tr>`;
          }).join("") || `<tr><td colspan="15">Sin datos para el filtro.</td></tr>`}
          </tbody>
        </table>
      </div>
  </section>`;
}

function harvestExportCalibreRows(rows, valueKey = "calibresKg") {
  const pivot = new Map();
  rows.forEach((row) => {
    const groupKey = `${row.year}|${row.species}|${row.variety}|${row.potrero}`;
    Object.entries(row[valueKey] || {}).forEach(([label, value]) => {
      const numeric = harvestNumericValue(value);
      if (!numeric) return;
      const parsed = harvestParseCalibreLabel(label);
      const category = parsed.category || "General";
      const key = `${groupKey}|${category}`;
      const current = pivot.get(key) || {
        year: row.year || "",
        species: row.species || "Sin especie",
        variety: row.variety || "Sin variedad",
        potrero: row.potrero || "Sin potrero",
        category,
        calibres: new Map(),
        total: 0
      };
      current.calibres.set(parsed.calibre, (current.calibres.get(parsed.calibre) || 0) + numeric);
      current.total += numeric;
      pivot.set(key, current);
    });
  });
  const rowsOut = [...pivot.values()].sort((a, b) =>
    String(b.year).localeCompare(String(a.year), "es", { numeric: true })
    || a.species.localeCompare(b.species, "es", { numeric: true })
    || a.variety.localeCompare(b.variety, "es", { numeric: true })
    || comparePotrero(a.potrero, b.potrero)
    || a.category.localeCompare(b.category, "es", { numeric: true })
  );
  return { rows: rowsOut };
}

function renderHarvestExportCalibreTable(rows, options = {}) {
  const valueKey = options.valueKey || "calibresKg";
  const title = options.title || "Calibres kg por especie, variedad y potrero";
  const subtitle = options.subtitle || "Cada especie muestra solo los calibres con datos en el filtro.";
  const totalLabel = options.totalLabel || "Total kg";
  const unitLabel = options.unitLabel || "kg";
  const modeValue = options.modeValue || "kg";
  const { rows: calibreRows } = harvestExportCalibreRows(rows, valueKey);
  const yearGroups = new Map();
  calibreRows.forEach((row) => {
    const year = String(row.year || "Sin ano");
    if (!yearGroups.has(year)) yearGroups.set(year, []);
    yearGroups.get(year).push(row);
  });
  const grandTotal = calibreRows.reduce((sum, row) => sum + harvestNumericValue(row.total), 0);
  const orderedYears = [...yearGroups.entries()].sort((a, b) => String(b[0]).localeCompare(String(a[0]), "es", { numeric: true }));
  return `
    <section class="panel harvest-analytics-card harvest-full-width harvest-export-calibre-menu harvest-export-calibre-panel">
      <div class="harvest-export-calibre-header">
        <div>
          <h2>${escapeHtml(title)}</h2>
          <p>${escapeHtml(subtitle)}</p>
        </div>
        <label>
          Vista
          <select data-harvest-export-calibre-mode>
            <option value="kg" ${modeValue === "kg" ? "selected" : ""}>Calibres por kg</option>
            <option value="cajas" ${modeValue === "cajas" ? "selected" : ""}>Cajas</option>
          </select>
        </label>
        <strong>${escapeHtml(totalLabel)}: ${number(grandTotal, 0)}</strong>
      </div>
      <div class="harvest-calibre-year-stack">
        ${orderedYears.map(([year, yearRows]) => {
          const yearTotal = yearRows.reduce((sum, row) => sum + harvestNumericValue(row.total), 0);
          const speciesGroups = new Map();
          yearRows.forEach((row) => {
            if (!speciesGroups.has(row.species)) speciesGroups.set(row.species, []);
            speciesGroups.get(row.species).push(row);
          });
          return `<section class="harvest-calibre-year-block">
            <header>
              <strong>A&ntilde;o ${escapeHtml(year)}</strong>
              <span>${escapeHtml(totalLabel)}: ${number(yearTotal, 0)} ${escapeHtml(unitLabel)}</span>
            </header>
            <div class="harvest-calibre-species-stack">
              ${[...speciesGroups.entries()].map(([species, speciesRows]) => {
                const speciesTotal = speciesRows.reduce((sum, row) => sum + harvestNumericValue(row.total), 0);
                const calibres = [...new Set(speciesRows.flatMap((row) => [...row.calibres.keys()]))]
                  .sort((a, b) => String(a).localeCompare(String(b), "es", { numeric: true }));
                const colSpan = 3 + calibres.length + 2;
                return `<article class="harvest-calibre-species-block">
                  <h3><span>${escapeHtml(species)}</span><b>${escapeHtml(totalLabel)}: ${number(speciesTotal, 0)}</b></h3>
                  <div class="table-wrap harvest-analytics-table harvest-calibre-table-wrap">
                    <table class="harvest-export-calibre-table">
                      <thead><tr><th>Var.</th><th>Pot.</th><th>Cat.</th>${calibres.map((calibre) => `<th>${escapeHtml(calibre)}</th>`).join("")}<th>${escapeHtml(totalLabel)}</th><th>%</th></tr></thead>
                      <tbody>${speciesRows.map((row) => `<tr>
                        <td data-label="Variedad"><strong>${escapeHtml(row.variety)}</strong></td>
                        <td data-label="Potrero">${escapeHtml(potreroLabel(row.potrero))}</td>
                        <td data-label="Categoria">${escapeHtml(row.category)}</td>
                        ${calibres.map((calibre) => {
                          const value = row.calibres.get(calibre) || 0;
                          const percent = row.total ? value / row.total : 0;
                          return `<td data-label="${htmlAttr(calibre)}">${value ? `<strong>${number(value, 0)}</strong><small>${harvestRatioLabel(percent)}</small>` : ""}</td>`;
                        }).join("")}
                        <td data-label="${htmlAttr(totalLabel)}"><strong>${number(row.total, 0)}</strong></td>
                        <td data-label="%"><strong>100%</strong><small>${escapeHtml(unitLabel)}</small></td>
                      </tr>`).join("") || `<tr><td colspan="${colSpan}">Sin datos para esta especie.</td></tr>`}
                      </tbody>
                    </table>
                  </div>
                </article>`;
              }).join("")}
            </div>
          </section>`;
        }).join("") || `<div class="empty">Sin datos para el filtro.</div>`}
      </div>
    </section>`;
}

function renderHarvestExport() {
  const allRows = state.harvestExportRecords || [];
  if (!allRows.length) {
    views.harvestExport.innerHTML = renderHarvestExcelSyncEmpty(
      "export",
      "Sin datos de exportacion",
      "Carga el Excel de cosecha/exportacion para crear o actualizar los registros."
    );
    return;
  }
  ensureHarvestExportYearSelection(allRows);
  const years = harvestExportYears(allRows);
  const species = harvestOptionValues(allRows, (row) => row.species, "Todas");
  const scopedForVarieties = allRows.filter((row) => harvestExportSpeciesFilter === "Todas" || row.species === harvestExportSpeciesFilter);
  const varieties = harvestOptionValues(scopedForVarieties, (row) => row.variety, "Todas");
  const potreros = harvestOptionValues(scopedForVarieties, (row) => row.potrero, "Todos");
  if (!species.includes(harvestExportSpeciesFilter)) harvestExportSpeciesFilter = "Todas";
  if (!varieties.includes(harvestExportVarietyFilter)) harvestExportVarietyFilter = "Todas";
  if (!potreros.includes(harvestExportPotreroFilter)) harvestExportPotreroFilter = "Todos";
  const rows = harvestExportFilteredRows();
  const calibreMode = harvestExportCalibreMode === "cajas" ? "cajas" : "kg";
  const calibreConfig = calibreMode === "cajas"
    ? {
      valueKey: "calibresCajas",
      title: "Cajas por calibre",
      subtitle: "Datos CAJ agrupados por calibre y categoria.",
      totalLabel: "Total cajas",
      unitLabel: "cajas",
      modeValue: "cajas"
    }
    : {
      valueKey: "calibresKg",
      title: "Calibres por kg",
      subtitle: "Distribucion de kilos por calibre y categoria.",
      totalLabel: "Total kg",
      unitLabel: "kg",
      modeValue: "kg"
    };
  views.harvestExport.innerHTML = `
    <section class="panel harvest-analytics-panel">
      <div class="panel-header">
        <h2>Exportacion</h2>
        <div class="top-actions">${renderHarvestExcelSyncButton("export")}</div>
      </div>
      <div class="harvest-export-filter-panel">
        <div class="harvest-export-filter-grid">
          <label>Especie<select data-harvest-export-filter="species">${harvestSelectOptions(species, harvestExportSpeciesFilter)}</select></label>
          <label>Variedad<select data-harvest-export-filter="variety">${harvestSelectOptions(varieties, harvestExportVarietyFilter)}</select></label>
          <label>Potrero<select data-harvest-export-filter="potrero">${harvestSelectOptions(potreros, harvestExportPotreroFilter, potreroLabel)}</select></label>
          <div class="harvest-export-years-field">
            <span>A&ntilde;os</span>
            <div class="harvest-year-checks" aria-label="Anos exportacion">
              ${years.map((year) => `<label><input data-harvest-export-year="${htmlAttr(year)}" type="checkbox" ${harvestExportSelectedYears.has(year) ? "checked" : ""}>${escapeHtml(year)}</label>`).join("")}
            </div>
          </div>
          <button class="secondary-button" type="button" data-action="clear-harvest-export-filters">Limpiar</button>
        </div>
      </div>
      ${renderHarvestExportPercentSummary(rows)}
      ${renderHarvestExportVarietyPercentSummaryByYear(rows)}
      <div class="harvest-analytics-grid">
        ${renderHarvestExportComparison(rows)}
      </div>
      ${renderHarvestExportTableByYear(rows)}
      ${renderHarvestExportCalibreTable(rows, calibreConfig)}
    </section>`;
  wireHarvestExportFilters();
}

function wireHarvestExportFilters() {
  document.querySelectorAll("[data-harvest-export-filter]").forEach((control) => {
    control.addEventListener("change", (event) => {
      const target = event.target;
      if (target.dataset.harvestExportFilter === "species") {
        harvestExportSpeciesFilter = target.value;
        harvestExportVarietyFilter = "Todas";
        harvestExportPotreroFilter = "Todos";
      }
      if (target.dataset.harvestExportFilter === "variety") harvestExportVarietyFilter = target.value;
      if (target.dataset.harvestExportFilter === "potrero") harvestExportPotreroFilter = target.value;
      renderHarvestExport();
    });
  });
  document.querySelectorAll("[data-harvest-export-year]").forEach((control) => {
    control.addEventListener("change", (event) => {
      const year = event.target.dataset.harvestExportYear;
      if (event.target.checked) harvestExportSelectedYears.add(year);
      else if (harvestExportSelectedYears.size > 1) harvestExportSelectedYears.delete(year);
      else {
        event.target.checked = true;
        showToast("Manten al menos un ano seleccionado");
        return;
      }
      renderHarvestExport();
    });
  });
  document.querySelectorAll("[data-harvest-export-calibre-mode]").forEach((control) => {
    control.addEventListener("change", (event) => {
      harvestExportCalibreMode = event.target.value === "cajas" ? "cajas" : "kg";
      renderHarvestExport();
    });
  });
}

function harvestAnalysisYears(rows = state.harvestAnalysisRecords || []) {
  return [...new Set(rows.map((row) => String(row.year || "")).filter(Boolean))].sort((a, b) => Number(a) - Number(b));
}

function ensureHarvestAnalysisYearSelection(rows = state.harvestAnalysisRecords || []) {
  const available = harvestAnalysisYears(rows);
  harvestAnalysisSelectedYears = new Set([...harvestAnalysisSelectedYears].filter((year) => available.includes(year)));
  if (!harvestAnalysisSelectedYears.size) harvestAnalysisSelectedYears = new Set(available);
}

function harvestAnalysisFilteredRows() {
  ensureHarvestAnalysisYearSelection();
  return (state.harvestAnalysisRecords || []).filter((row) => {
    if (harvestAnalysisSelectedYears.size && !harvestAnalysisSelectedYears.has(String(row.year))) return false;
    if (harvestAnalysisSpeciesFilter !== "Todas" && row.species !== harvestAnalysisSpeciesFilter) return false;
    if (harvestAnalysisVarietyFilter !== "Todas" && row.variety !== harvestAnalysisVarietyFilter) return false;
    if (harvestAnalysisPotreroFilter !== "Todos" && harvestAnalysisDisplayPotrero(row) !== harvestAnalysisPotreroFilter) return false;
    return true;
  });
}

function harvestAnalysisMetricValue(row) {
  return harvestAnalysisMetric === "bins" ? harvestNumericValue(row.totalBins) : harvestNumericValue(row.kgTotal);
}

function harvestAnalysisMetricUnit() {
  return harvestAnalysisMetric === "bins" ? " bins" : " kg";
}

function harvestAnalysisMetricLabel() {
  return harvestAnalysisMetric === "bins" ? "Bins" : "Kg";
}

function harvestAnalysisMetricDecimals() {
  return harvestAnalysisMetric === "bins" ? 1 : 0;
}

function harvestAnalysisSummary(rows) {
  const kg = rows.reduce((sum, row) => sum + harvestNumericValue(row.kgTotal), 0);
  const bins = rows.reduce((sum, row) => sum + harvestNumericValue(row.totalBins), 0);
  return {
    kg,
    bins,
    kgPerBin: bins ? kg / bins : 0,
    years: new Set(rows.map((row) => row.year).filter(Boolean)).size
  };
}

function harvestAnalysisNormalizeFieldToken(value, options = {}) {
  let text = String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\u00a0/g, " ")
    .trim()
    .toLocaleLowerCase("es");
  text = text
    .replace(/^potrero\s+/, "")
    .replace(/^bloque\s+/, "")
    .replace(/^cuartel\s+/, "")
    .replace(/\s+/g, " ");
  if (options.potrero) {
    text = text.replace(/^p\s*(?=\d)/, "");
  }
  if (options.block) {
    text = text.replace(/^b\s*(?=\d)/, "");
  }
  return text.trim();
}

function harvestAnalysisBlockCandidates(row) {
  const rowPotrero = harvestAnalysisNormalizeFieldToken(row?.potrero || row?.potrero_normalizado || row?.excelPotrero || row?.potrero_excel, { potrero: true });
  const sources = [
    { value: row?.excelBlock || row?.bloque_excel, priority: 300 },
    { value: row?.block || row?.bloque_normalizado, priority: 250 },
    { value: row?.formulaBlock || row?.bloque_formula, priority: 200 }
  ];
  const candidates = new Map();
  const addCandidate = (value, priority) => {
    const normalized = harvestAnalysisNormalizeFieldToken(value, { block: true });
    if (!normalized) return;
    candidates.set(normalized, Math.max(priority, candidates.get(normalized) || 0));
  };

  sources.forEach(({ value, priority }) => {
    const normalized = harvestAnalysisNormalizeFieldToken(value, { block: true });
    addCandidate(normalized, priority);
    if (rowPotrero && normalized.startsWith(rowPotrero) && normalized.length > rowPotrero.length) {
      addCandidate(normalized.slice(rowPotrero.length).replace(/^[-/\s]+/, ""), priority - 20);
    }
  });
  return [...candidates.entries()].map(([value, priority]) => ({ value, priority }));
}

const harvestAnalysisFieldMetaCache = new WeakMap();
const harvestAnalysisDisplayPotreroCache = new WeakMap();

function harvestAnalysisFieldMeta(field) {
  if (!field || typeof field !== "object") return { potrero: "", block: "", variety: "", species: "" };
  const cached = harvestAnalysisFieldMetaCache.get(field);
  if (cached) return cached;
  const meta = {
    potrero: harvestAnalysisNormalizeFieldToken(field.potrero, { potrero: true }),
    block: harvestAnalysisNormalizeFieldToken(field.block, { block: true }),
    variety: harvestAnalysisNormalizeFieldToken(field.variety),
    species: harvestAnalysisNormalizeFieldToken(field.crop)
  };
  harvestAnalysisFieldMetaCache.set(field, meta);
  return meta;
}

function harvestAnalysisFieldMatchScore(row, field) {
  const rowPotrero = harvestAnalysisNormalizeFieldToken(row?.potrero || row?.potrero_normalizado || row?.excelPotrero || row?.potrero_excel, { potrero: true });
  const rowBlocks = harvestAnalysisBlockCandidates(row);
  const rowFormulaBlock = harvestAnalysisNormalizeFieldToken(row?.formulaBlock || row?.bloque_formula, { block: true });
  const fieldMeta = harvestAnalysisFieldMeta(field);
  const fieldPotrero = fieldMeta.potrero;
  const fieldBlock = fieldMeta.block;
  const rowVariety = harvestAnalysisNormalizeFieldToken(row?.variety || row?.variedad);
  const rowSpecies = harvestAnalysisNormalizeFieldToken(row?.species || row?.especie);
  const fieldVariety = fieldMeta.variety;
  const fieldSpecies = fieldMeta.species;
  if (!rowPotrero || !rowBlocks.length || !fieldPotrero || !fieldBlock) return 0;

  let score = 0;
  rowBlocks.forEach(({ value: rowBlock, priority }) => {
    if (rowPotrero === fieldPotrero && rowBlock === fieldBlock) score = Math.max(score, priority);

    const splitBlock = rowBlock.match(/^([a-z])\s*0*([0-9]+)$/i);
    if (rowPotrero === "26" && splitBlock && fieldPotrero === splitBlock[1].toLocaleLowerCase("es")) {
      const numericBlock = String(Number(splitBlock[2]));
      if (fieldBlock === rowBlock || fieldBlock === numericBlock) score = Math.max(score, priority - 5);
    }

    if (rowPotrero === "27" && rowBlock === fieldBlock) {
      const expectedPotrero = rowFormulaBlock.startsWith("oo")
        ? "27 imp"
        : rowFormulaBlock.startsWith("o")
          ? "27 grav"
          : "";
      if (expectedPotrero && fieldPotrero === expectedPotrero) score = Math.max(score, priority + 5);
      else if (!expectedPotrero && fieldPotrero.startsWith("27")) score = Math.max(score, priority - 10);
    }

    const splitFieldBlock = fieldBlock.match(/^0*([0-9]+)[a-z]$/i);
    if (rowPotrero === fieldPotrero && /^0*[0-9]+$/.test(rowBlock) && splitFieldBlock && String(Number(rowBlock)) === String(Number(splitFieldBlock[1]))) {
      score = Math.max(score, priority - 15);
    }
  });

  if (!score) return 0;
  if (rowVariety && fieldVariety && rowVariety === fieldVariety) score += 8;
  if (rowSpecies && fieldSpecies && rowSpecies === fieldSpecies) score += 3;
  return score;
}

function harvestAnalysisFieldsForRow(row) {
  const fields = harvestFieldCatalog();
  const blockCandidates = harvestAnalysisBlockCandidates(row);
  const linkedId = row?.fieldId || row?.campo_id;
  if (linkedId) {
    if (harvestAnalysisFieldIndexSource !== fields) {
      harvestAnalysisFieldIndexSource = fields;
      harvestAnalysisFieldIndex = new Map(fields.filter((field) => field?.id).map((field) => [String(field.id), field]));
    }
    const linkedField = harvestAnalysisFieldIndex.get(String(linkedId));
    if (linkedField) {
      if (!blockCandidates.length || harvestAnalysisFieldMatchScore(row, linkedField) > 0) return [linkedField];
    }
  }
  const scored = fields
    .map((field) => ({ field, score: harvestAnalysisFieldMatchScore(row, field) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || comparePotrero(a.field.potrero, b.field.potrero) || String(a.field.block).localeCompare(String(b.field.block), "es", { numeric: true }));
  if (scored.length) {
    const bestScore = scored[0].score;
    return scored.filter((item) => item.score === bestScore).map((item) => item.field);
  }

  if (blockCandidates.length) return [];
  const rowPotrero = harvestAnalysisNormalizeFieldToken(row?.potrero || row?.potrero_normalizado || row?.excelPotrero || row?.potrero_excel, { potrero: true });
  const rowVariety = harvestAnalysisNormalizeFieldToken(row?.variety || row?.variedad);
  if (!rowPotrero || !rowVariety) return [];
  return fields.filter((field) => {
    const fieldMeta = harvestAnalysisFieldMeta(field);
    const fieldPotrero = fieldMeta.potrero;
    const fieldVariety = fieldMeta.variety;
    if (fieldVariety !== rowVariety) return false;
    if (fieldPotrero === rowPotrero) return true;
    if (rowPotrero === "26") return ["d", "e", "f", "g", "h", "i", "j"].includes(fieldPotrero);
    if (rowPotrero === "27") return fieldPotrero.startsWith("27");
    return false;
  });
}

function harvestAnalysisFieldForRow(row) {
  return harvestAnalysisFieldsForRow(row)[0] || null;
}

function harvestAnalysisDisplayPotrero(row) {
  if (row && typeof row === "object" && harvestAnalysisDisplayPotreroCache.has(row)) {
    return harvestAnalysisDisplayPotreroCache.get(row);
  }
  const linkedField = harvestAnalysisFieldForRow(row);
  const potrero = linkedField?.potrero
    ? linkedField.potrero
    : harvestCleanValue(row?.potrero || row?.potrero_normalizado || row?.excelPotrero || row?.potrero_excel, "Sin potrero");
  if (row && typeof row === "object") harvestAnalysisDisplayPotreroCache.set(row, potrero);
  return potrero;
}

function harvestExportFieldsForRecord(row) {
  const fields = harvestFieldCatalog();
  const rowIds = Array.isArray(row?.fieldIds) ? row.fieldIds : Array.isArray(row?.campo_ids) ? row.campo_ids : [];
  const byId = rowIds.map((id) => fields.find((field) => field.id === id)).filter(Boolean);
  if (byId.length) return byId;

  const rowPotrero = harvestAnalysisNormalizeFieldToken(row?.potrero || row?.potrero_normalizado || row?.excelPotrero || row?.potrero_excel, { potrero: true });
  const rowVariety = harvestAnalysisNormalizeFieldToken(row?.variety || row?.variedad);
  const rowSpecies = harvestAnalysisNormalizeFieldToken(row?.species || row?.especie);
  if (!rowPotrero || !rowVariety) return [];

  return fields
    .map((field) => {
      const fieldMeta = harvestAnalysisFieldMeta(field);
      const fieldPotrero = fieldMeta.potrero;
      const fieldVariety = fieldMeta.variety;
      const fieldSpecies = fieldMeta.species;
      if (fieldVariety !== rowVariety) return { field, score: 0 };
      let score = 0;
      if (fieldPotrero === rowPotrero) score = 100;
      else if (rowPotrero === "27" && fieldPotrero.startsWith("27")) score = 90;
      else if (rowPotrero === "26" && ["d", "e", "f", "g", "h", "i", "j"].includes(fieldPotrero)) score = 85;
      if (!score) return { field, score: 0 };
      if (rowSpecies && fieldSpecies && rowSpecies === fieldSpecies) score += 3;
      return { field, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || comparePotrero(a.field.potrero, b.field.potrero) || String(a.field.block).localeCompare(String(b.field.block), "es", { numeric: true }))
    .map((item) => item.field);
}

function harvestAnalysisFieldStats(row) {
  const fields = harvestAnalysisFieldsForRow(row);
  if (!fields.length) return null;
  return fields.map((field) => {
    const hectares = harvestNumericValue(field.hectares);
    const plants = harvestNumericValue(field.plants) || (hectares && harvestNumericValue(field.plantsPerHa) ? hectares * harvestNumericValue(field.plantsPerHa) : 0);
    return {
      key: field.id || fieldIdentityKey(field.potrero, field.block),
      hectares,
      plants
    };
  });
}

function harvestAnalysisEmptyYearStats() {
  return {
    value: 0,
    kg: 0,
    hectares: 0,
    plants: 0,
    fields: new Set()
  };
}

function harvestAnalysisProductivityLabel(yearEntry) {
  const kg = harvestNumericValue(yearEntry?.kg);
  const kgHa = yearEntry?.hectares ? kg / yearEntry.hectares : 0;
  const kgPlant = yearEntry?.plants ? kg / yearEntry.plants : 0;
  return {
    kg,
    kgHa,
    kgPlant,
    hectares: harvestNumericValue(yearEntry?.hectares),
    plants: harvestNumericValue(yearEntry?.plants)
  };
}

const HARVEST_YEAR_COLORS = [
  "#0f766e",
  "#2563eb",
  "#d97706",
  "#7c3aed",
  "#dc2626",
  "#059669",
  "#0891b2",
  "#be123c"
];

const HARVEST_VARIETY_COLORS = [
  "#0057b8",
  "#d1495b",
  "#0a7f3f",
  "#f28c00",
  "#6f2dbd",
  "#009c9a",
  "#c44500",
  "#7a5c00",
  "#c2185b",
  "#2f4858",
  "#8f2d56",
  "#4d908e",
  "#bc3908",
  "#3a0ca3",
  "#2a9d8f",
  "#9d0208",
  "#4361ee",
  "#5f6f00"
];

function harvestYearColor(index) {
  return HARVEST_YEAR_COLORS[index % HARVEST_YEAR_COLORS.length];
}

function harvestStablePaletteColor(value, palette, fallbackIndex = 0) {
  const text = String(value || "");
  const hash = [...text].reduce((acc, char) => ((acc * 31) + char.charCodeAt(0)) >>> 0, fallbackIndex);
  return palette[hash % palette.length];
}

function harvestVarietyColor(variety) {
  return harvestStablePaletteColor(variety || "Sin variedad", HARVEST_VARIETY_COLORS);
}

function harvestMonthDayValue(dateValue) {
  const match = String(dateValue || "").slice(0, 10).match(/^\d{4}-(\d{2})-(\d{2})$/);
  if (!match) return null;
  return Number(match[1]) * 100 + Number(match[2]);
}

function harvestTodayDayMonthLabel() {
  const today = todayChileIso();
  const match = today.match(/^\d{4}-(\d{2})-(\d{2})$/);
  return match ? `${match[2]}-${match[1]}` : "hoy";
}

function harvestAnalysisRowInComparison(row, year, untilToday = false) {
  if (String(row.year) !== String(year)) return false;
  if (!untilToday) return true;
  const todayMonthDay = harvestMonthDayValue(todayChileIso());
  const monthDay = harvestMonthDayValue(row.date);
  return monthDay !== null && monthDay <= todayMonthDay;
}

function harvestComparisonDifference(current, previousValues = []) {
  const validPrevious = previousValues.filter((value) => Number.isFinite(Number(value)));
  if (!validPrevious.length) return null;
  const baseline = validPrevious.reduce((sum, value) => sum + Number(value || 0), 0) / validPrevious.length;
  const diff = Number(current || 0) - baseline;
  const percent = baseline ? diff / baseline * 100 : null;
  return { baseline, diff, percent };
}

function harvestDifferenceClass(diff) {
  if (!diff || Math.abs(diff.diff) < 0.0001) return "neutral";
  return diff.diff > 0 ? "positive" : "negative";
}

function harvestDifferenceLabel(diff, unit, decimals) {
  if (!diff) return "";
  const sign = diff.diff > 0 ? "+" : "";
  const percent = diff.percent === null ? "" : ` (${sign}${number(diff.percent, 1)}%)`;
  return `Dif. ${sign}${number(diff.diff, decimals)}${unit}${percent}`;
}

const HARVEST_ANALYSIS_SECTION_META = {
  annual: { code: "Σ", title: "Comparacion anual", summary: "Totales por especie, variedad y ano." },
  progress: { code: "↗", title: "Avance a la fecha", summary: "Compara cada temporada hasta el mismo dia calendario." },
  start: { code: "01", title: "Inicio de cosecha", summary: "Campana principal, termino y duracion por variedad." },
  productivity: { code: "ha", title: "Productividad por potrero", summary: "Kg, kg/ha y kg/planta agrupados por especie y variedad." },
  contractors: { code: "#", title: "Ranking de contratistas", summary: "Los tres mejores primero; el resto queda disponible bajo demanda." }
};

function harvestAnalysisCacheKey(sectionKey, extra = "") {
  const years = [...harvestAnalysisSelectedYears].sort((a, b) => Number(a) - Number(b)).join(",");
  return [sectionKey, harvestAnalysisSpeciesFilter, harvestAnalysisVarietyFilter, harvestAnalysisPotreroFilter, harvestAnalysisMetric, years, todayChileIso(), extra].join("|");
}

function harvestAnalysisCachedMarkup(sectionKey, renderer, extra = "") {
  const source = state.harvestAnalysisRecords || [];
  const fields = state.harvestFields || state.blocks || [];
  if (harvestAnalysisRenderCacheSource !== source || harvestAnalysisRenderCacheFields !== fields) {
    harvestAnalysisRenderCacheSource = source;
    harvestAnalysisRenderCacheFields = fields;
    harvestAnalysisRenderCache = new Map();
  }
  const key = harvestAnalysisCacheKey(sectionKey, extra);
  if (harvestAnalysisRenderCache.has(key)) {
    const cached = harvestAnalysisRenderCache.get(key);
    harvestAnalysisRenderCache.delete(key);
    harvestAnalysisRenderCache.set(key, cached);
    return cached;
  }
  const markup = renderer();
  harvestAnalysisRenderCache.set(key, markup);
  if (harvestAnalysisRenderCache.size > HARVEST_ANALYSIS_RENDER_CACHE_MAX) {
    harvestAnalysisRenderCache.delete(harvestAnalysisRenderCache.keys().next().value);
  }
  return markup;
}

function renderHarvestAnalysisSection(sectionKey, renderer, options = {}) {
  const meta = HARVEST_ANALYSIS_SECTION_META[sectionKey];
  const open = harvestAnalysisOpenSections.has(sectionKey);
  if (!open) {
    return `
      <article class="panel harvest-full-width harvest-analysis-fold-card" data-harvest-analysis-section="${htmlAttr(sectionKey)}">
        <button type="button" class="harvest-analysis-fold-trigger" data-action="toggle-harvest-analysis-section" data-section="${htmlAttr(sectionKey)}" aria-expanded="false">
          <span class="harvest-analysis-fold-code" aria-hidden="true">${escapeHtml(meta.code)}</span>
          <span class="harvest-analysis-fold-copy"><strong>${escapeHtml(meta.title)}</strong><small>${escapeHtml(meta.summary)}</small></span>
          <span class="harvest-analysis-fold-state" aria-hidden="true">+</span>
        </button>
      </article>`;
  }
  const markup = options.cache === false ? renderer() : harvestAnalysisCachedMarkup(sectionKey, renderer, options.cacheExtra || "");
  return `
    <div class="harvest-full-width harvest-analysis-open-section" data-harvest-analysis-section="${htmlAttr(sectionKey)}">
      <button type="button" class="harvest-analysis-collapse-button" data-action="toggle-harvest-analysis-section" data-section="${htmlAttr(sectionKey)}" aria-expanded="true" title="Ocultar ${htmlAttr(meta.title)}">
        <span aria-hidden="true">−</span><span>Ocultar</span>
      </button>
      ${markup}
    </div>`;
}

function renderHarvestVarietyYearComparison(title, rows, options = {}) {
  const years = [...harvestAnalysisSelectedYears].sort((a, b) => Number(a) - Number(b));
  const values = new Map();
  const varietyTotalsBySpecies = new Map();
  const valueKey = (speciesName, variety, year) => `${speciesName}\u001f${variety}\u001f${year}`;
  rows.forEach((row) => {
    const speciesName = harvestCleanValue(row.species, "Sin especie");
    const variety = harvestCleanValue(row.variety, "Sin variedad");
    const varietyTotals = varietyTotalsBySpecies.get(speciesName) || new Map();
    varietyTotals.set(variety, (varietyTotals.get(variety) || 0) + harvestAnalysisMetricValue(row));
    varietyTotalsBySpecies.set(speciesName, varietyTotals);
    const year = String(row.year || "");
    if (!years.includes(year) || !harvestAnalysisRowInComparison(row, year, options.untilToday)) return;
    const key = valueKey(speciesName, variety, year);
    values.set(key, (values.get(key) || 0) + harvestAnalysisMetricValue(row));
  });
  const species = [...varietyTotalsBySpecies.keys()].sort((a, b) => a.localeCompare(b, "es", { numeric: true, sensitivity: "base" }));
  const varietiesBySpecies = new Map(species.map((speciesName) => [
    speciesName,
    [...(varietyTotalsBySpecies.get(speciesName) || new Map()).entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "es", { numeric: true, sensitivity: "base" }))
      .map(([variety]) => variety)
  ]));
  const max = Math.max(1, ...values.values());
  const decimals = harvestAnalysisMetricDecimals();
  const unit = harvestAnalysisMetricUnit();
  const totalsByYear = years.map((year) => ({
    year,
    value: species.reduce((speciesSum, speciesName) => speciesSum + (varietiesBySpecies.get(speciesName) || [])
      .reduce((sum, variety) => sum + (values.get(valueKey(speciesName, variety, year)) || 0), 0), 0)
  }));
  const selectedTotal = totalsByYear.reduce((sum, row) => sum + row.value, 0);
  const latestYear = years[years.length - 1];
  const previousYears = years.slice(0, -1);
  const latestTotal = totalsByYear.find((row) => row.year === latestYear)?.value || 0;
  const totalDiff = options.showDifference
    ? harvestComparisonDifference(latestTotal, previousYears.map((year) => totalsByYear.find((row) => row.year === year)?.value || 0))
    : null;
  return `
    <article class="panel harvest-analytics-card harvest-full-width harvest-variety-year-card">
      <div class="panel-header">
        <div>
          <h2>${escapeHtml(title)}</h2>
          ${options.subtitle ? `<p>${escapeHtml(options.subtitle)}</p>` : ""}
        </div>
      </div>
      <div class="harvest-variety-year-totals">
        <span class="harvest-total-selected"><b>Total seleccionados</b>${number(selectedTotal, decimals)}${unit}</span>
        ${totalsByYear.map((row) => `<span><b>${escapeHtml(row.year)}</b>${number(row.value, decimals)}${unit}</span>`).join("")}
        ${totalDiff ? `<em class="${harvestDifferenceClass(totalDiff)}">${escapeHtml(harvestDifferenceLabel(totalDiff, unit, decimals))}</em>` : ""}
      </div>
      <div class="harvest-variety-year-legend">
        ${years.map((year, index) => `<span><i style="--bar-color:${htmlAttr(harvestYearColor(index))}"></i>${escapeHtml(year)}</span>`).join("")}
      </div>
      <div class="harvest-comparison-species-stack">
        ${species.map((speciesName) => {
          const varieties = varietiesBySpecies.get(speciesName) || [];
          const speciesTotals = years.map((year) => ({
            year,
            value: varieties.reduce((sum, variety) => sum + (values.get(valueKey(speciesName, variety, year)) || 0), 0)
          }));
          const speciesTotal = speciesTotals.reduce((sum, item) => sum + item.value, 0);
          return `<section class="harvest-comparison-species">
            <header class="harvest-comparison-species-head">
              <div><strong>${escapeHtml(speciesName)}</strong><span>${varieties.length} variedades</span></div>
              <div class="harvest-comparison-species-totals">
                ${speciesTotals.map((item) => `<span><b>${escapeHtml(item.year)}</b>${number(item.value, decimals)}${unit}</span>`).join("")}
                <strong>${number(speciesTotal, decimals)}${unit}</strong>
              </div>
            </header>
            <div class="harvest-variety-year-groups">
              ${varieties.map((variety) => {
                const total = years.reduce((sum, year) => sum + (values.get(valueKey(speciesName, variety, year)) || 0), 0);
                const latestValue = values.get(valueKey(speciesName, variety, latestYear)) || 0;
                const varietyDiff = options.showDifference
                  ? harvestComparisonDifference(latestValue, previousYears.map((year) => values.get(valueKey(speciesName, variety, year)) || 0))
                  : null;
                const rankByYear = new Map(years
                  .map((year) => ({ year, value: values.get(valueKey(speciesName, variety, year)) || 0 }))
                  .filter((item) => item.value > 0)
                  .sort((a, b) => b.value - a.value || Number(a.year) - Number(b.year))
                  .slice(0, 3)
                  .map((item, index) => [item.year, index + 1]));
                return `<section class="harvest-variety-year-group">
                  <header>
                    <div>
                      <strong>${escapeHtml(variety)}</strong>
                      ${varietyDiff ? `<em class="${harvestDifferenceClass(varietyDiff)}">${escapeHtml(harvestDifferenceLabel(varietyDiff, unit, decimals))}</em>` : ""}
                    </div>
                    <span>${number(total, decimals)}${unit}</span>
                  </header>
                  <div class="harvest-variety-year-bars">
                    ${years.map((year, index) => {
                      const value = values.get(valueKey(speciesName, variety, year)) || 0;
                      const height = value > 0 ? Math.max(4, value / max * 100) : 0;
                      const rank = rankByYear.get(year);
                      return `<div class="harvest-variety-year-bar" title="${htmlAttr(`${speciesName} - ${variety} - ${year}: ${number(value, decimals)}${unit}`)}">
                        <strong>${number(value, decimals)}</strong>
                        <div>
                          ${rank ? `<em class="harvest-bar-medal rank-${rank}" title="${rank === 1 ? "1 dorado" : rank === 2 ? "2 plata" : "3 bronce"}">${rank}</em>` : ""}
                          <i style="height:${height}%; --bar-color:${htmlAttr(harvestYearColor(index))}"></i>
                        </div>
                        <span>${escapeHtml(year)}</span>
                      </div>`;
                    }).join("")}
                  </div>
                </section>`;
              }).join("") || `<div class="empty">Sin variedades para comparar.</div>`}
            </div>
          </section>`;
        }).join("") || `<div class="empty">Sin especies para comparar.</div>`}
      </div>
    </article>`;
}

function harvestUniqueValues(rows, getValue) {
  return [...new Set(rows.map(getValue).map((value) => harvestCleanValue(value, "")).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, "es", { numeric: true, sensitivity: "base" }));
}

function renderHarvestContractorRanking(rows = []) {
  const visibleLimit = 3;
  const grouped = new Map();
  rows.forEach((row) => {
    const contractor = harvestCleanValue(row.contractor, "Sin contratista");
    if (contractor === "Sin contratista") return;
    const species = harvestCleanValue(row.species, "Sin especie");
    const variety = harvestCleanValue(row.variety, "Sin variedad");
    const year = String(row.year || "");
    if (!year) return;
    const key = `${species}|${variety}|${year}|${contractor}`;
    const current = grouped.get(key) || { species, variety, year, contractor, kg: 0, bins: 0 };
    current.kg += harvestNumericValue(row.kgTotal);
    current.bins += harvestNumericValue(row.totalBins);
    grouped.set(key, current);
  });

  const speciesGroups = new Map();
  [...grouped.values()].forEach((entry) => {
    const speciesEntry = speciesGroups.get(entry.species) || new Map();
    const varietyEntry = speciesEntry.get(entry.variety) || new Map();
    const yearRows = varietyEntry.get(entry.year) || [];
    yearRows.push(entry);
    varietyEntry.set(entry.year, yearRows);
    speciesEntry.set(entry.variety, varietyEntry);
    speciesGroups.set(entry.species, speciesEntry);
  });

  const sections = [...speciesGroups.entries()]
    .sort(([a], [b]) => a.localeCompare(b, "es", { numeric: true, sensitivity: "base" }))
    .map(([species, varieties]) => `
      <section class="harvest-contractor-species">
        <header><div><strong>${escapeHtml(species)}</strong><span>${varieties.size} variedades</span></div></header>
        <div class="harvest-contractor-variety-grid">
          ${[...varieties.entries()]
            .sort(([a], [b]) => a.localeCompare(b, "es", { numeric: true, sensitivity: "base" }))
            .map(([variety, years]) => `
              <article class="harvest-contractor-variety-card">
                <h3>${escapeHtml(variety)}</h3>
                <div class="harvest-contractor-years">
                  ${[...years.entries()]
                    .sort(([a], [b]) => Number(b) - Number(a))
                    .map(([year, contractorRows]) => {
                      const ranked = contractorRows.sort((a, b) => b.kg - a.kg || a.contractor.localeCompare(b.contractor, "es"));
                      const expandKey = `${species}|${variety}|${year}`;
                      const expanded = harvestContractorExpandedKeys.has(expandKey);
                      const hiddenCount = Math.max(0, ranked.length - visibleLimit);
                      const visibleRows = expanded ? ranked : ranked.slice(0, visibleLimit);
                      const yearTotal = contractorRows.reduce((sum, item) => sum + item.kg, 0);
                      const yearMax = Math.max(1, ...ranked.map((item) => item.kg));
                      return `<section class="harvest-contractor-year">
                        <header><b>${escapeHtml(year)}</b><span>${number(yearTotal, 0)} kg</span></header>
                        <div class="harvest-contractor-bars">${visibleRows.map((item, index) => {
                          const participation = yearTotal ? item.kg / yearTotal * 100 : 0;
                          const width = item.kg > 0 ? Math.max(2, item.kg / yearMax * 100) : 0;
                          const color = harvestStablePaletteColor(item.contractor, HARVEST_VARIETY_COLORS);
                          const rank = index + 1;
                          return `<div class="harvest-contractor-bar-row" title="${htmlAttr(`${item.contractor}: ${number(item.kg, 0)} kg, ${number(item.bins, 0)} bins, ${number(participation, 1)}%`)}">
                            <span class="harvest-contractor-position ${rank <= 3 ? `rank-${rank}` : ""}" title="${rank <= 3 ? `Puesto ${rank}` : "Posicion en el ranking"}">${rank}</span>
                            <strong>${escapeHtml(item.contractor)}</strong>
                            <span class="harvest-contractor-bar-track"><i style="width:${width}%; --bar-color:${htmlAttr(color)}"></i></span>
                            <span class="harvest-contractor-bar-value"><b>${number(item.kg, 0)} kg</b><small>${number(item.bins, 0)} bins</small></span>
                            <em>${number(participation, 1)}%</em>
                          </div>`;
                        }).join("")}</div>
                        ${hiddenCount ? `<button class="harvest-show-more-button" type="button" data-action="toggle-harvest-contractors" data-key="${htmlAttr(expandKey)}">${expanded ? "Mostrar menos" : `Mostrar ${hiddenCount} mas`}</button>` : ""}
                      </section>`;
                    }).join("")}
                </div>
              </article>`).join("")}
        </div>
      </section>`).join("");

  return `
    <article class="panel harvest-analytics-card harvest-full-width harvest-contractor-ranking-panel">
      <div class="panel-header"><h2>Contratistas por especie, variedad y ano</h2></div>
      <div class="harvest-contractor-stack">${sections || `<div class="empty">Sin contratistas para el filtro seleccionado.</div>`}</div>
    </article>`;
}

function harvestStartDateKey(year, species, variety) {
  return `${year || ""}|${harvestDisplaySpecies(species)}|${harvestDisplayVariety(variety)}`;
}

const HARVEST_CONTINUITY_MAX_GAP_DAYS = 10;
const HARVEST_CONTINUITY_MIN_ACTIVE_DAYS = 3;
const HARVEST_CONTINUITY_WINDOW_DAYS = 14;
const HARVEST_CONTINUITY_MIN_ACTIVITY_RATIO = 0.1;
const HARVEST_CAMPAIGN_MAX_GAP_DAYS = 14;

function harvestDateOrdinal(dateValue) {
  const match = String(dateValue || "").slice(0, 10).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  return Math.floor(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])) / 86400000);
}

function harvestActivityClusters(days = []) {
  const clusters = [];
  days.forEach((day) => {
    const previous = clusters[clusters.length - 1];
    const previousDay = previous?.days?.[previous.days.length - 1];
    const gap = previousDay ? day.ordinal - previousDay.ordinal : null;
    if (!previous || gap > HARVEST_CONTINUITY_MAX_GAP_DAYS) {
      clusters.push({ days: [day], kg: day.kg, bins: day.bins });
      return;
    }
    previous.days.push(day);
    previous.kg += day.kg;
    previous.bins += day.bins;
  });
  return clusters.map((cluster) => ({
    ...cluster,
    start: cluster.days[0].date,
    end: cluster.days[cluster.days.length - 1].date,
    activeDays: cluster.days.length,
    spanDays: cluster.days[cluster.days.length - 1].ordinal - cluster.days[0].ordinal + 1,
    activity: cluster.kg > 0 ? cluster.kg : cluster.bins
  }));
}

function harvestSustainedSeason(days = []) {
  if (!days.length) return null;
  const clusters = harvestActivityClusters(days);
  const windows = days.map((day, index) => {
    const windowDays = [];
    for (let cursor = index; cursor < days.length; cursor += 1) {
      if (days[cursor].ordinal - day.ordinal >= HARVEST_CONTINUITY_WINDOW_DAYS) break;
      windowDays.push(days[cursor]);
    }
    const kg = windowDays.reduce((sum, item) => sum + item.kg, 0);
    const bins = windowDays.reduce((sum, item) => sum + item.bins, 0);
    return {
      days: windowDays,
      activeDays: windowDays.length,
      activity: kg > 0 ? kg : bins,
      start: windowDays[0]?.date || "",
      end: windowDays[windowDays.length - 1]?.date || ""
    };
  }).filter((window) => window.activeDays >= HARVEST_CONTINUITY_MIN_ACTIVE_DAYS);
  const maxWindowActivity = Math.max(1, ...windows.map((window) => window.activity));
  const sustainedWindows = windows.filter((window) => (
    window.activity >= maxWindowActivity * HARVEST_CONTINUITY_MIN_ACTIVITY_RATIO
  ));
  const fallback = clusters.slice().sort((a, b) => b.activeDays - a.activeDays || b.activity - a.activity || a.start.localeCompare(b.start))[0];
  const campaigns = [];
  sustainedWindows.forEach((window) => {
    const startOrdinal = harvestDateOrdinal(window.start);
    const endOrdinal = harvestDateOrdinal(window.end);
    const previous = campaigns[campaigns.length - 1];
    if (!previous || startOrdinal - previous.endOrdinal > HARVEST_CAMPAIGN_MAX_GAP_DAYS) {
      campaigns.push({ start: window.start, end: window.end, startOrdinal, endOrdinal });
      return;
    }
    if (endOrdinal > previous.endOrdinal) {
      previous.end = window.end;
      previous.endOrdinal = endOrdinal;
    }
  });
  const dominantCampaign = campaigns.map((campaign) => {
    const campaignDays = days.filter((day) => day.ordinal >= campaign.startOrdinal && day.ordinal <= campaign.endOrdinal);
    const kg = campaignDays.reduce((sum, day) => sum + day.kg, 0);
    const bins = campaignDays.reduce((sum, day) => sum + day.bins, 0);
    return {
      ...campaign,
      activeDays: campaignDays.length,
      activity: kg > 0 ? kg : bins
    };
  }).sort((a, b) => b.activity - a.activity || b.activeDays - a.activeDays || b.start.localeCompare(a.start))[0];
  const start = dominantCampaign?.start || fallback.start;
  const end = dominantCampaign?.end || fallback.end;
  const startOrdinal = harvestDateOrdinal(start);
  const endOrdinal = harvestDateOrdinal(end);
  const activeDays = days.filter((day) => day.ordinal >= startOrdinal && day.ordinal <= endOrdinal).length;
  return {
    start,
    end,
    activeDays,
    consolidated: Boolean(dominantCampaign),
    ignoredEarlyDays: days.filter((day) => day.ordinal < startOrdinal).length,
    ignoredLateDays: days.filter((day) => day.ordinal > endOrdinal).length
  };
}

function harvestStartDateRows(rows = []) {
  const groups = new Map();
  rows.forEach((row) => {
    const date = String(row.date || "").slice(0, 10);
    const ordinal = harvestDateOrdinal(date);
    const kg = harvestNumericValue(row.kgTotal);
    const bins = harvestNumericValue(row.totalBins);
    if (!row.year || !row.species || !row.variety || ordinal === null || (kg <= 0 && bins <= 0)) return;
    const key = harvestStartDateKey(row.year, row.species, row.variety);
    const entry = groups.get(key) || {
      key,
      year: Number(row.year) || row.year,
      species: row.species,
      variety: row.variety,
      detectedStart: "",
      detectedEnd: "",
      activeDays: 0,
      consolidated: false,
      ignoredEarlyDays: 0,
      ignoredLateDays: 0,
      daily: new Map(),
      kg: 0,
      bins: 0
    };
    const daily = entry.daily.get(date) || { date, ordinal, kg: 0, bins: 0 };
    daily.kg += kg;
    daily.bins += bins;
    entry.daily.set(date, daily);
    entry.kg += kg;
    entry.bins += bins;
    groups.set(key, entry);
  });

  return [...groups.values()].map((entry) => {
    const season = harvestSustainedSeason([...entry.daily.values()].sort((a, b) => a.ordinal - b.ordinal));
    return {
      ...entry,
      daily: undefined,
      detectedStart: season?.start || "",
      detectedEnd: season?.end || "",
      activeDays: season?.activeDays || 0,
      consolidated: Boolean(season?.consolidated),
      ignoredEarlyDays: season?.ignoredEarlyDays || 0,
      ignoredLateDays: season?.ignoredLateDays || 0
    };
  }).sort((a, b) => {
    const yearDiff = Number(b.year) - Number(a.year);
    if (yearDiff) return yearDiff;
    const speciesDiff = a.species.localeCompare(b.species, "es", { numeric: true, sensitivity: "base" });
    if (speciesDiff) return speciesDiff;
    return a.variety.localeCompare(b.variety, "es", { numeric: true, sensitivity: "base" });
  });
}

function harvestDaysBetween(startDate, endDate) {
  if (!startDate || !endDate) return null;
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime())) return null;
  const diff = Math.round((end.getTime() - start.getTime()) / 86400000);
  return diff >= 0 ? diff + 1 : null;
}

function harvestDurationLabel(startDate, endDate) {
  const days = harvestDaysBetween(startDate, endDate);
  if (!days) return "-";
  return `${days} ${days === 1 ? "dia" : "dias"}`;
}

function harvestStartDiffClass(days) {
  if (days === null) return "empty";
  if (days === 0) return "same";
  return days > 0 ? "late" : "early";
}

function harvestStartDiffLabel(days) {
  if (days === null) return "-";
  if (days === 0) return "Misma fecha";
  return days > 0 ? `${days} dias despues` : `${Math.abs(days)} dias antes`;
}

function harvestStartDateMatrixRows(startRows = []) {
  const matrix = new Map();
  startRows.forEach((row) => {
    const key = `${row.species}|${row.variety}`;
    const entry = matrix.get(key) || {
      key,
      species: row.species,
      variety: row.variety,
      years: new Map()
    };
    entry.years.set(String(row.year), row);
    matrix.set(key, entry);
  });
  return [...matrix.values()].sort((a, b) => {
    const speciesDiff = a.species.localeCompare(b.species, "es", { numeric: true, sensitivity: "base" });
    if (speciesDiff) return speciesDiff;
    return a.variety.localeCompare(b.variety, "es", { numeric: true, sensitivity: "base" });
  });
}

function renderHarvestStartDatesPanel(rows, allRows, years) {
  const startRows = harvestStartDateRows(rows);
  const yearOptions = [...new Set(years.map(String))].sort((a, b) => Number(b) - Number(a));
  const visibleYears = [...(harvestAnalysisSelectedYears.size ? harvestAnalysisSelectedYears : new Set(yearOptions))]
    .map(String)
    .sort((a, b) => Number(b) - Number(a));
  const matrixRows = harvestStartDateMatrixRows(startRows);
  return `
    <article class="panel harvest-analytics-card harvest-full-width harvest-start-card">
      <div class="panel-header"><h2>Inicio de cosecha</h2></div>
      <div class="harvest-start-matrix-wrap">
        <div class="harvest-start-matrix" style="--harvest-start-years:${Math.max(1, visibleYears.length)}">
          <div class="harvest-start-matrix-head">
            <strong>Variedad</strong>
            ${visibleYears.map((year) => `<span>A&ntilde;o ${escapeHtml(year)}</span>`).join("")}
          </div>
          ${matrixRows.map((entry) => `
            <div class="harvest-start-matrix-row">
              <div class="harvest-start-variety">
                <div><strong>${escapeHtml(entry.species)}</strong><span>${escapeHtml(entry.variety)}</span></div>
              </div>
              ${visibleYears.map((year) => {
                const row = entry.years.get(String(year)) || { year, species: entry.species, variety: entry.variety, detectedStart: "" };
                const displayDate = row.detectedStart || "";
                const endDate = row.detectedEnd || "";
                const durationLabel = harvestDurationLabel(displayDate, endDate);
                const activityLabel = row.activeDays ? `${row.activeDays} ${row.activeDays === 1 ? "jornada" : "jornadas"}` : "";
                const omittedDays = harvestNumericValue(row.ignoredEarlyDays) + harvestNumericValue(row.ignoredLateDays);
                const cellTitle = displayDate
                  ? `${entry.species} ${entry.variety} ${year} | Inicio consolidado: ${printDate(displayDate)} | Termino: ${printDate(endDate)} | Duracion: ${durationLabel} | ${activityLabel}${omittedDays ? ` | ${omittedDays} jornadas aisladas omitidas` : ""}${row.consolidated ? "" : " | Tramo disponible con pocos registros"}`
                  : `${entry.species} ${entry.variety} ${year}`;
                return `<div class="harvest-start-cell ${displayDate ? "is-detected" : "is-empty"} ${displayDate && !row.consolidated ? "is-estimated" : ""}" title="${htmlAttr(cellTitle)}">
                  <b>${escapeHtml(year)}</b>
                  <strong>${displayDate ? `Fecha de inicio: ${printDate(displayDate)}` : "-"}</strong>
                  <em>${displayDate ? `Duracion: ${durationLabel}${activityLabel ? ` - ${activityLabel}` : ""}` : ""}</em>
                  <small>${displayDate ? `Termino: ${printDate(endDate)} - ${number(row.kg, 0)} kg` : "Sin registro"}</small>
                </div>`;
              }).join("")}
            </div>`).join("") || `<div class="empty">Sin datos para el filtro seleccionado.</div>`}
        </div>
      </div>
    </article>`;
}

function renderHarvestAnalysis() {
  const allRows = state.harvestAnalysisRecords || [];
  if (!allRows.length) {
    views.harvestAnalysis.innerHTML = renderHarvestExcelSyncEmpty(
      "harvest",
      "Sin datos de cosecha analisis",
      "Carga el Excel de cosecha/exportacion para crear o actualizar los registros."
    );
    return;
  }
  ensureHarvestAnalysisYearSelection(allRows);
  const years = harvestAnalysisYears(allRows);
  const species = harvestOptionValues(allRows, (row) => row.species, "Todas");
  const scopedForVarieties = allRows.filter((row) => harvestAnalysisSpeciesFilter === "Todas" || row.species === harvestAnalysisSpeciesFilter);
  const varieties = harvestOptionValues(scopedForVarieties, (row) => row.variety, "Todas");
  const potreros = harvestOptionValues(scopedForVarieties, harvestAnalysisDisplayPotrero, "Todos");
  if (!species.includes(harvestAnalysisSpeciesFilter)) harvestAnalysisSpeciesFilter = "Todas";
  if (!varieties.includes(harvestAnalysisVarietyFilter)) harvestAnalysisVarietyFilter = "Todas";
  if (!potreros.includes(harvestAnalysisPotreroFilter)) harvestAnalysisPotreroFilter = "Todos";
  const rows = harvestAnalysisFilteredRows();
  views.harvestAnalysis.innerHTML = `
    <section class="panel harvest-analytics-panel">
      <div class="panel-header">
        <h2>Cosecha Analisis</h2>
        <div class="top-actions">${renderHarvestExcelSyncButton("harvest")}</div>
      </div>
      <div class="harvest-filter-shell harvest-analysis-filters">
        <label>Especie<select data-harvest-analysis-filter="species">${harvestSelectOptions(species, harvestAnalysisSpeciesFilter)}</select></label>
        <label>Variedad<select data-harvest-analysis-filter="variety">${harvestSelectOptions(varieties, harvestAnalysisVarietyFilter)}</select></label>
        <label>Potrero<select data-harvest-analysis-filter="potrero">${harvestSelectOptions(potreros, harvestAnalysisPotreroFilter, potreroLabel)}</select></label>
        <label>Medida<select data-harvest-analysis-filter="metric">
          <option value="kg" ${harvestAnalysisMetric === "kg" ? "selected" : ""}>Kg totales</option>
          <option value="bins" ${harvestAnalysisMetric === "bins" ? "selected" : ""}>Bins</option>
        </select></label>
        <div class="harvest-year-checks" aria-label="Años">
          ${years.map((year) => `<label><input data-harvest-analysis-year="${htmlAttr(year)}" type="checkbox" ${harvestAnalysisSelectedYears.has(year) ? "checked" : ""}>${escapeHtml(year)}</label>`).join("")}
        </div>
        <button class="secondary-button" type="button" data-action="clear-harvest-analysis-filters">Limpiar</button>
      </div>
      <div class="harvest-analytics-grid">
        ${renderHarvestAnalysisSection("annual", () => renderHarvestVarietyYearComparison(`Comparacion por variedad - total anual - ${harvestAnalysisMetricLabel()}`, rows, { subtitle: "Suma completa de cada ano seleccionado" }))}
        ${renderHarvestAnalysisSection("progress", () => renderHarvestVarietyYearComparison(`Comparacion por variedad - avance al ${harvestTodayDayMonthLabel()} - ${harvestAnalysisMetricLabel()}`, rows, { untilToday: true, showDifference: true, subtitle: "Suma hasta la misma fecha calendario de cada ano" }))}
        ${renderHarvestAnalysisSection("start", () => renderHarvestStartDatesPanel(rows, allRows, years))}
        ${renderHarvestAnalysisSection("productivity", () => renderHarvestPotreroBlockSummary(rows))}
        ${renderHarvestAnalysisSection("contractors", () => renderHarvestContractorRanking(rows), { cache: false })}
      </div>
    </section>`;
  wireHarvestAnalysisFilters();
}

function renderHarvestPotreroBlockSummary(rows) {
  const years = [...harvestAnalysisSelectedYears].sort((a, b) => Number(a) - Number(b));
  const decimals = harvestAnalysisMetricDecimals();
  const unit = harvestAnalysisMetricUnit();
  const showProductivity = harvestAnalysisMetric === "kg";
  const speciesGroups = new Map();
  rows.forEach((row) => {
    const year = String(row.year || "");
    if (!year || (years.length && !years.includes(year))) return;
    const species = harvestCleanValue(row.species, "Sin especie");
    const variety = harvestCleanValue(row.variety, "Sin variedad");
    const potrero = harvestAnalysisDisplayPotrero(row);
    const value = harvestAnalysisMetricValue(row);
    const kg = harvestNumericValue(row.kgTotal);
    const fieldStats = harvestAnalysisFieldStats(row);
    const speciesEntry = speciesGroups.get(species) || { species, total: 0, varieties: new Map() };
    const varietyEntry = speciesEntry.varieties.get(variety) || { variety, total: 0, potreros: new Map() };
    const potreroEntry = varietyEntry.potreros.get(potrero) || { potrero, total: 0, years: new Map() };
    const yearEntry = potreroEntry.years.get(year) || harvestAnalysisEmptyYearStats();
    yearEntry.value += value;
    yearEntry.kg += kg;
    (fieldStats || []).forEach((fieldStat) => {
      if (!fieldStat.key || yearEntry.fields.has(fieldStat.key)) return;
      yearEntry.fields.add(fieldStat.key);
      yearEntry.hectares += harvestNumericValue(fieldStat.hectares);
      yearEntry.plants += harvestNumericValue(fieldStat.plants);
    });
    potreroEntry.years.set(year, yearEntry);
    potreroEntry.total += value;
    varietyEntry.total += value;
    speciesEntry.total += value;
    varietyEntry.potreros.set(potrero, potreroEntry);
    speciesEntry.varieties.set(variety, varietyEntry);
    speciesGroups.set(species, speciesEntry);
  });
  const sections = [...speciesGroups.values()]
    .sort((a, b) => a.species.localeCompare(b.species, "es", { numeric: true, sensitivity: "base" }))
    .map((speciesEntry) => {
      const cards = [...speciesEntry.varieties.values()]
        .sort((a, b) => b.total - a.total || a.variety.localeCompare(b.variety, "es", { numeric: true }))
        .map((entry) => {
          const potreros = [...entry.potreros.values()].sort((a, b) => b.total - a.total || comparePotrero(a.potrero, b.potrero));
          const potreroRanks = new Map(potreros.filter((potrero) => potrero.total > 0).slice(0, 3).map((potrero, index) => [potrero.potrero, index + 1]));
          const max = Math.max(1, ...potreros.flatMap((potrero) => years.map((year) => harvestNumericValue(potrero.years.get(year)?.value))));
          return `
            <section class="harvest-potrero-variety-card harvest-productivity-variety-card">
              <header>
                <div>
                  <strong>${escapeHtml(entry.variety)}</strong>
                  <span>${potreros.length} potreros</span>
                </div>
                <b>${number(entry.total, decimals)}${unit}</b>
              </header>
              <div class="harvest-productivity-list">
                ${potreros.map((potrero) => `
                  <div class="harvest-productivity-potrero-row">
                    <div class="harvest-productivity-potrero-head">
                      <strong title="${htmlAttr(potreroLabel(potrero.potrero))}">${potreroRanks.has(potrero.potrero) ? `<span class="harvest-rank-medal rank-${potreroRanks.get(potrero.potrero)}" aria-label="Puesto ${potreroRanks.get(potrero.potrero)}">${potreroRanks.get(potrero.potrero)}</span>` : ""}${escapeHtml(potreroLabel(potrero.potrero))}</strong>
                      <span>${number(potrero.total, decimals)}${unit}</span>
                    </div>
                    <div class="harvest-productivity-years">
                      ${years.map((year, index) => {
                        const yearEntry = potrero.years.get(year) || harvestAnalysisEmptyYearStats();
                        const value = harvestNumericValue(yearEntry.value);
                        const productivity = harvestAnalysisProductivityLabel(yearEntry);
                        const kgHa = yearEntry.hectares ? yearEntry.kg / yearEntry.hectares : 0;
                        const kgPlant = yearEntry.plants ? yearEntry.kg / yearEntry.plants : 0;
                        const kgHaLabel = productivity.hectares ? number(kgHa, 0) : "-";
                        const kgPlantLabel = productivity.plants ? number(kgPlant, 0) : "-";
                        const width = value > 0 ? Math.max(3, value / max * 100) : 0;
                        return `<article class="harvest-productivity-year-card" title="${htmlAttr(`${speciesEntry.species} - ${entry.variety} - ${potreroLabel(potrero.potrero)} - ${year}: ${number(value, decimals)}${unit}${showProductivity ? ` | ${kgHaLabel} kg/ha | ${kgPlantLabel} kg/planta` : ""}`)}">
                          <header>
                            <b>${escapeHtml(year)}</b>
                            <i><em style="width:${width}%; --bar-color:${htmlAttr(harvestYearColor(index))}"></em></i>
                          </header>
                          <div class="harvest-productivity-metrics">
                            <span><small>${harvestAnalysisMetric === "kg" ? "Kg" : "Bins"}</small><strong>${number(value, decimals)}</strong></span>
                            ${showProductivity ? `<span><small>Kg/ha</small><strong>${productivity.hectares ? number(productivity.kgHa, 0) : "-"}</strong></span>
                            <span><small>Kg/planta</small><strong>${productivity.plants ? number(productivity.kgPlant, 0) : "-"}</strong></span>` : ""}
                          </div>
                        </article>`;
                      }).join("")}
                    </div>
                  </div>`).join("")}
              </div>
            </section>`;
        });
      return `
        <section class="harvest-potrero-species-section">
          <header>
            <div>
              <strong>${escapeHtml(speciesEntry.species)}</strong>
              <span>${speciesEntry.varieties.size} variedades</span>
            </div>
            <b>${number(speciesEntry.total, decimals)}${unit}</b>
          </header>
          <div class="harvest-potrero-variety-masonry">
            ${cards.join("")}
          </div>
        </section>`;
    });
  return `
    <article class="panel harvest-analytics-card harvest-full-width harvest-potrero-summary-card">
      <div class="panel-header">
        <div>
          <h2>${showProductivity ? "Productividad por especie, variedad y potrero" : "Resumen por especie, variedad y potrero"}</h2>
          <p>${showProductivity ? "Kg, Kg/ha y Kg/planta por potrero y ano." : "Barras por ano, sin separar por bloque."}</p>
        </div>
      </div>
      <div class="harvest-variety-year-legend">
        ${years.map((year, index) => `<span><i style="--bar-color:${htmlAttr(harvestYearColor(index))}"></i>${escapeHtml(year)}</span>`).join("")}
      </div>
      <div class="harvest-potrero-species-stack">
        ${sections.join("") || `<div class="empty">Sin datos para el filtro.</div>`}
      </div>
    </article>`;
}

function wireHarvestAnalysisFilters() {
  document.querySelectorAll("[data-harvest-analysis-filter]").forEach((control) => {
    control.addEventListener("change", (event) => {
      const target = event.target;
      if (target.dataset.harvestAnalysisFilter === "species") {
        harvestAnalysisSpeciesFilter = target.value;
        harvestAnalysisVarietyFilter = "Todas";
        harvestAnalysisPotreroFilter = "Todos";
        harvestAnalysisSelectedSpecies = target.value === "Todas" ? "Todas" : target.value;
      }
      if (target.dataset.harvestAnalysisFilter === "variety") harvestAnalysisVarietyFilter = target.value;
      if (target.dataset.harvestAnalysisFilter === "potrero") harvestAnalysisPotreroFilter = target.value;
      if (target.dataset.harvestAnalysisFilter === "metric") harvestAnalysisMetric = target.value;
      renderHarvestAnalysis();
    });
  });
  document.querySelectorAll("[data-harvest-analysis-year]").forEach((control) => {
    control.addEventListener("change", (event) => {
      const year = event.target.dataset.harvestAnalysisYear;
      if (event.target.checked) harvestAnalysisSelectedYears.add(year);
      else if (harvestAnalysisSelectedYears.size > 1) harvestAnalysisSelectedYears.delete(year);
      else {
        event.target.checked = true;
        showToast("Mantén al menos un año seleccionado");
        return;
      }
      renderHarvestAnalysis();
    });
  });
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

function officialProgramSeasonLabel(program) {
  return state.seasons.find((season) => season.id === program.seasonId)?.name || program.seasonName || "Temporada sin sincronizar";
}

function officialDoseLabel(line) {
  if (line.dose === null || line.dose === undefined) return "Dosis pendiente";
  return `${number(line.dose)} ${line.unit || ""}`.trim();
}

function officialProductHa(line, waterHa) {
  return productHaFromDose({ waterHa }, {
    dose: line.dose,
    dose100: line.dose,
    doseBasis: line.basis,
    divisor: line.divisor
  });
}

function renderProgram() {
  const catalog = officialPrograms();
  const seasons = [...new Map(catalog.map((program) => [program.seasonId, officialProgramSeasonLabel(program)])).entries()];
  const seasonScoped = catalog.filter((program) => programFilters.seasonId === "Todas" || program.seasonId === programFilters.seasonId);
  const species = ["Todas", ...new Set(seasonScoped.map((program) => program.crop).filter(Boolean))];
  const numbers = ["Todos", ...new Set(seasonScoped.map((program) => String(program.code || program.number)))];
  const types = ["Todos", ...new Set(seasonScoped.flatMap((program) => programProductsFor(program.id).map((line) => line.type)).filter(Boolean))].sort();
  const search = normalizeCatalogText(programFilters.search);
  const filtered = catalog.filter((program) => {
    const lines = programProductsFor(program.id);
    const haystack = normalizeCatalogText([program.code, program.crop, program.epoch, program.stage, program.objective, ...lines.map((line) => `${line.name} ${line.type}`)].join(" "));
    return (programFilters.seasonId === "Todas" || program.seasonId === programFilters.seasonId)
      && (programFilters.species === "Todas" || program.crop === programFilters.species)
      && (programFilters.number === "Todos" || String(program.code || program.number) === programFilters.number)
      && (programFilters.type === "Todos" || lines.some((line) => line.type === programFilters.type))
      && (programFilters.status === "Todos" || (programFilters.status === "Completo" ? !program.incomplete : program.incomplete))
      && (!search || haystack.includes(search));
  }).sort((a, b) => officialProgramSeasonLabel(b).localeCompare(officialProgramSeasonLabel(a)) || a.crop.localeCompare(b.crop) || a.number - b.number || String(a.code).localeCompare(String(b.code)));
  const productLines = filtered.flatMap((program) => programProductsFor(program.id));
  const linkedOrders = state.orders.filter((order) => filtered.some((program) => String(order.programId) === String(program.id)
    || (order.seasonId === program.seasonId && normalizeCatalogText(order.crop) === normalizeCatalogText(program.crop) && String(order.programNumber) === String(program.number))));
  const cloudReady = catalog.some((program) => program.cloudReady);

  views.program.innerHTML = `
    <section class="panel official-program-panel">
      <div class="panel-header official-program-head">
        <div>
          <span class="section-kicker">Catálogo oficial</span>
          <h2>Programa Fitosanitario</h2>
        </div>
        <button class="primary-button" data-action="new-order">Nueva orden</button>
      </div>
      ${cloudReady ? "" : `<div class="program-sync-notice"><strong>Catálogo local activo</strong><span>Ejecuta supabase_programa_fitosanitario.sql para crear órdenes desde este programa y sincronizarlo en Supabase.</span></div>`}
      <div class="program-filters official-program-filters">
        <label>Temporada<select id="programSeasonFilterInput"><option value="Todas">Todas</option>${seasons.map(([id, label]) => `<option value="${htmlAttr(id)}" ${id === programFilters.seasonId ? "selected" : ""}>${escapeHtml(label)}</option>`).join("")}</select></label>
        <label>Especie<select id="speciesFilterInput">${species.map((item) => `<option value="${htmlAttr(item)}" ${item === programFilters.species ? "selected" : ""}>${escapeHtml(item)}</option>`).join("")}</select></label>
        <label>Aplicación<select id="programNumberFilterInput">${numbers.map((item) => `<option value="${htmlAttr(item)}" ${item === programFilters.number ? "selected" : ""}>${item === "Todos" ? item : `N° ${escapeHtml(item)}`}</option>`).join("")}</select></label>
        <label>Tipo<select id="programTypeFilterInput">${types.map((item) => `<option value="${htmlAttr(item)}" ${item === programFilters.type ? "selected" : ""}>${escapeHtml(item)}</option>`).join("")}</select></label>
        <label>Estado<select id="programStatusFilterInput"><option ${programFilters.status === "Todos" ? "selected" : ""}>Todos</option><option ${programFilters.status === "Completo" ? "selected" : ""}>Completo</option><option ${programFilters.status === "Por revisar" ? "selected" : ""}>Por revisar</option></select></label>
        <label class="program-search">Buscar<input id="programSearchInput" value="${htmlAttr(programFilters.search)}" placeholder="Objetivo, etapa o producto"></label>
        <button class="secondary-button" data-action="clear-program-filter">Limpiar</button>
      </div>
      <div class="official-program-summary" aria-label="Resumen del programa">
        <span><strong>${filtered.length}</strong> aplicaciones</span>
        <span><strong>${productLines.length}</strong> productos programados</span>
        <span><strong>${linkedOrders.length}</strong> órdenes vinculadas</span>
        <span class="${productLines.some((line) => line.incomplete) ? "has-warning" : ""}"><strong>${productLines.filter((line) => line.incomplete).length}</strong> líneas por revisar</span>
      </div>
      <div class="official-program-list">
        ${filtered.map((program) => {
          const lines = programProductsFor(program.id);
          const orderCount = state.orders.filter((order) => String(order.programId) === String(program.id)
            || (order.seasonId === program.seasonId && normalizeCatalogText(order.crop) === normalizeCatalogText(program.crop) && String(order.programNumber) === String(program.number))).length;
          return `
            <details class="official-program-item">
              <summary>
                <span class="official-program-number">${escapeHtml(program.code || program.number)}</span>
                <span class="official-program-title"><strong>${escapeHtml(program.crop)}</strong><small>${escapeHtml(program.stage || program.epoch || "Etapa sin definir")}</small></span>
                <span class="official-program-objective">${escapeHtml(program.objective || "Sin objetivo")}</span>
                <span class="official-program-meta"><strong>${lines.length}</strong> productos<small>${program.waterHa ? `${number(program.waterHa, 0)} L/ha` : "Mojamiento por definir"}</small></span>
                <span class="official-program-state ${program.incomplete ? "needs-review" : "is-complete"}">${program.incomplete ? "Revisar" : "Completo"}</span>
              </summary>
              <div class="official-program-detail">
                <div class="official-program-facts">
                  <span><small>Temporada</small><strong>${escapeHtml(officialProgramSeasonLabel(program))}</strong></span>
                  <span><small>Época</small><strong>${escapeHtml(program.epoch || "-")}</strong></span>
                  <span><small>Etapa</small><strong>${escapeHtml(program.stage || "-")}</strong></span>
                  <span><small>Carencia</small><strong>${escapeHtml(program.carency || "-")}</strong></span>
                  <span><small>Órdenes</small><strong>${orderCount}</strong></span>
                </div>
                <div class="table-wrap compact-table official-products-table">
                  <table><thead><tr><th>Producto</th><th>Tipo</th><th>Dosis oficial</th><th>Base</th><th>Gasto / ha</th><th>Estado</th></tr></thead>
                  <tbody>${lines.map((line) => `<tr><td><strong>${escapeHtml(line.name)}</strong></td><td>${escapeHtml(line.type || "-")}</td><td>${escapeHtml(officialDoseLabel(line))}</td><td>${line.basis === "per_100l" ? "Por 100 L" : line.basis === "per_liter" ? "Por litro" : line.basis === "per_ha" ? "Por ha" : "Revisar"}</td><td>${line.incomplete || line.dose === null ? "-" : `${number(officialProductHa(line, program.waterHa))} ${escapeHtml(line.outputUnit || "kg/L")}/ha`}</td><td><span class="official-line-state ${line.incomplete ? "needs-review" : "is-complete"}">${line.incomplete ? "Pendiente" : "Validada"}</span></td></tr>`).join("")}</tbody></table>
                </div>
                ${program.observations ? `<div class="official-program-notes"><strong>Observaciones</strong><p>${escapeHtml(program.observations).replace(/\n/g, "<br>")}</p></div>` : ""}
                <div class="official-program-actions"><button class="primary-button" data-action="new-order-from-program" data-program-id="${htmlAttr(program.id)}" ${program.cloudReady ? "" : "disabled title=\"Sincroniza primero el catálogo con Supabase\""}>Crear orden desde esta aplicación</button></div>
              </div>
            </details>`;
        }).join("") || `<div class="empty">No hay aplicaciones oficiales para los filtros seleccionados.</div>`}
      </div>
    </section>`;

  const rerenderOnChange = (id, key) => document.getElementById(id)?.addEventListener("change", (event) => { programFilters[key] = event.target.value; renderProgram(); });
  document.getElementById("programSeasonFilterInput")?.addEventListener("change", (event) => {
    programFilters.seasonId = event.target.value;
    programFilters.species = "Todas";
    programFilters.number = "Todos";
    programFilters.type = "Todos";
    renderProgram();
  });
  rerenderOnChange("speciesFilterInput", "species");
  rerenderOnChange("programNumberFilterInput", "number");
  rerenderOnChange("programTypeFilterInput", "type");
  rerenderOnChange("programStatusFilterInput", "status");
  document.getElementById("programSearchInput")?.addEventListener("input", (event) => {
    programFilters.search = event.target.value;
    clearTimeout(programSearchTimer);
    programSearchTimer = setTimeout(renderProgram, 220);
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
    const status = effectiveOrderStatus(order);
    return `
      <article class="order-card manager-order-card" data-order-status="${htmlAttr(status)}">
        <div class="order-card-head">
          <div class="manager-order-identity">
            <span class="manager-order-number"><small>Orden</small><strong>#${escapeHtml(order.number)}</strong></span>
            <div>
              <h3>${escapeHtml(potreroListLabel(order.potrero))} <span>Bloques ${escapeHtml(order.blocks?.join(", ") || "-")}</span></h3>
              <p>${escapeHtml(programLabel(order))} · ${escapeHtml(orderStartDate(order) || "-")} al ${escapeHtml(orderEndDate(order) || "-")}</p>
            </div>
          </div>
          <span class="badge ${statusClass(status)}">${escapeHtml(ganttState(order).label)}</span>
        </div>
        <div class="manager-order-summary">
          <span class="manager-order-objective"><small>Objetivo</small><strong>${escapeHtml(order.objective || "Sin objetivo")}</strong></span>
          <span><small>Superficie</small><strong>${number(order.hectares)} ha</strong></span>
          <span><small>Mojamiento</small><strong>${number(order.waterHa, 0)} L/ha</strong></span>
          <span><small>Total autorizado</small><strong>${number(total, 0)} L</strong></span>
        </div>
        <div class="progress-box">
          <div><strong>${number(dispatched, 0)} L</strong><span>salidos de ${number(total, 0)} L autorizados</span><b class="order-progress-percent">${number(pct, 0)}%</b></div>
          <div class="progress"><i style="width:${pct}%"></i></div>
        </div>
        <div class="recipe-list manager-recipe-list">
          ${order.recipe.map((line) => {
            const product = getProduct(line.productId);
            return `<span><strong>${escapeHtml(product?.name || "Producto")}</strong>${number(productHaFromDose(order, line))} ${escapeHtml(product?.unit || "")}/ha · ${number(plannedProduct(order, line))} total</span>`;
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
      <div class="gantt-panel ${managerGanttMobileOpen ? "mobile-gantt-open" : ""} ${managerGanttFiltersOpen ? "gantt-filters-open" : "gantt-filters-closed"}">
        <div class="gantt-mobile-gate">
          <div>
            <strong>Carta Gantt aplicaciones</strong>
            <span>Para verla mejor en celular, toca el botón y gira el teléfono en horizontal.</span>
          </div>
          <button class="primary-button" type="button" data-action="toggle-mobile-gantt" aria-expanded="${managerGanttMobileOpen ? "true" : "false"}">${managerGanttMobileOpen ? "Ocultar Gantt" : "Ver Gantt"}</button>
        </div>
        <div class="gantt-head">
          <div class="gantt-heading">
            <h3>CARTA GANTT APLICACIONES</h3>
            <span class="gantt-filter-summary">${escapeHtml(potreroLabel(managerPotreroFilter))} · ${managerGanttMode === "month" ? monthOptions().find((item) => item.value === managerMonth)?.label : "Año completo"} ${managerYear} · ${escapeHtml(managerStatusFilter === "all" ? "Todos los estados" : statusLabel(managerStatusFilter).replace(/^[^\p{L}\p{N}]+/u, ""))}</span>
          </div>
          <button class="icon-button gantt-filter-toggle" type="button" data-action="toggle-manager-gantt-filters" aria-expanded="${managerGanttFiltersOpen ? "true" : "false"}" title="${managerGanttFiltersOpen ? "Ocultar filtros" : "Mostrar filtros"}" aria-label="${managerGanttFiltersOpen ? "Ocultar filtros" : "Mostrar filtros"}"><span aria-hidden="true">${managerGanttFiltersOpen ? "&gt;" : "&lt;"}</span></button>
          <div class="gantt-controls" ${managerGanttFiltersOpen ? "" : "hidden"}>
            <label>Potrero
              <select id="managerPotreroFilter">${managerPotreros.map((potrero) => `<option value="${htmlAttr(potrero)}" ${potrero === managerPotreroFilter ? "selected" : ""}>${escapeHtml(potreroLabel(potrero))}</option>`).join("")}</select>
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
            <span><strong>${escapeHtml(potreroListLabel(group.potrero))}</strong><small>${group.species} · Ordenes ${group.orders.map((order) => `#${order.number}`).join(", ")}</small></span>
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
            <span><strong>${escapeHtml(potreroListLabel(group.potrero))}</strong><small>${group.species} · Ordenes ${group.orders.map((order) => `#${order.number}`).join(", ")}</small></span>
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
        <h3>Orden #${order.number} - ${escapeHtml(potreroListLabel(order.potrero))}</h3>
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
  await loadCloudProfile();
  const role = currentUserRole();
  const canSeePlanning = ["admin", "supervisor"].includes(role);
  const requestedModules = new Set(options.modules || ["all"]);
  const loadAll = requestedModules.has("all");
  const wantsModule = (...modules) => loadAll || modules.some((module) => requestedModules.has(module));
  const loadFields = wantsModule("fields", "applications", "irrigation", "calicatas", "pestMonitoring", "harvest");
  const loadApplications = wantsModule("applications");
  const loadPlanning = canSeePlanning && loadApplications;
  const loadIrrigation = wantsModule("irrigation");
  const loadCalicatas = wantsModule("calicatas");
  const loadWeather = wantsModule("weather");
  const loadHarvest = wantsModule("harvest");
  const loadHarvestAnalysis = wantsModule("harvestAnalysis");
  const loadHarvestExport = wantsModule("harvestExport");
  const loadHarvestFields = loadHarvestAnalysis || loadHarvestExport;
  const irrigationMonthPrefix = options.irrigationMonthPrefix || "";
  const irrigationDateQuery = loadIrrigation ? irrigationMonthFilterQuery(irrigationMonthPrefix) : "";

  // Cargar solo las tablas que el rol necesita. Esto evita que un bodeguero
  // pierda Bodega/Stock porque RLS bloquee modulos que no debe ver.
  const [seasons, programs, programProductRows, fields, harvestFieldRows, products, orders, orderProducts, dispatches, dispatchProducts, stockMovements, vehicles, calicatas, irrigationRows, irrigationProgramRows, irrigationObservationRows, evaporationRows, weatherDailyRowsRaw, weatherFrostRows, weatherLatestRows, harvestRecords, harvestCrewSchedule, harvestJornales, harvestAnalysisRows, harvestExportRows] = await Promise.all([
    loadPlanning ? sbSelect("temporadas", "select=*&order=anio_inicio.desc") : Promise.resolve(null),
    loadPlanning ? sbSelect("programas", "select=*&order=numero_programa.asc") : Promise.resolve(null),
    loadPlanning ? sbSelect("programa_productos", "select=*&order=programa_id.asc,orden.asc").catch((error) => {
      console.warn("Tabla programa_productos no disponible. Ejecuta supabase_programa_fitosanitario.sql", error);
      return [];
    }) : Promise.resolve(null),
    loadFields ? sbSelect("campos", "select=*&activo=eq.true&order=potrero.asc,bloque.asc") : Promise.resolve(null),
    loadHarvestFields ? sbSelectAll("campos", "select=*&order=potrero.asc,bloque.asc", 5000).catch((error) => {
      console.warn("No se pudo cargar campos completos para analisis de cosecha", error);
      return null;
    }) : Promise.resolve(null),
    loadApplications ? sbSelect("productos", "select=*&activo=eq.true&order=nombre.asc") : Promise.resolve(null),
    loadApplications ? sbSelect("ordenes_aplicacion", "select=*&order=creado_en.desc,fecha_planificada.desc,numero_orden.desc") : Promise.resolve(null),
    loadApplications ? sbSelect("orden_productos", "select=*") : Promise.resolve(null),
    loadApplications ? sbSelect("despachos", "select=*&order=fecha.asc") : Promise.resolve(null),
    loadApplications ? sbSelect("despacho_productos", "select=*") : Promise.resolve(null),
    loadApplications ? sbSelect("movimientos_stock", "select=*&order=fecha.asc") : Promise.resolve(null),
    loadApplications ? sbSelect("vehiculos", "select=*&order=codigo.asc").catch((error) => {
      console.warn("Tabla vehiculos no disponible. Ejecuta supabase_vehiculos.sql", error);
      return [];
    }) : Promise.resolve(null),
    loadCalicatas ? sbSelect("calicatas", "select=*&order=created_at.desc").catch((error) => {
      console.warn("No se pudieron cargar calicatas", error);
      return [];
    }) : Promise.resolve(null),
    loadIrrigation ? sbSelectAll("riego", `select=id,campo_id,fecha,horas_riego,volumen,creado_por_nombre,modificado_por_nombre,modificado_en,actualizado_en,updated_at${irrigationDateQuery}&order=fecha.asc,campo_id.asc`)
      .catch((error) => {
        if (!isMissingSupabaseColumn(error, ["creado_por_nombre", "modificado_por_nombre", "modificado_en", "actualizado_en", "updated_at"])) throw error;
        return sbSelectAll("riego", `select=id,campo_id,fecha,horas_riego,volumen${irrigationDateQuery}&order=fecha.asc,campo_id.asc`);
      })
      .then((rows) => {
        irrigationCloudAvailable = true;
        return rows;
      })
      .catch((error) => {
        console.warn("No se pudieron cargar registros de riego", error);
        irrigationCloudAvailable = !String(error?.message || "").toLowerCase().includes("could not find the table");
        return null;
      }) : Promise.resolve(null),
    loadIrrigation ? sbSelectAll("programa_riego", `select=id,campo_id,fecha,horas_programadas,volumen_programado,creado_por_nombre,modificado_por_nombre,modificado_en,actualizado_en${irrigationDateQuery}&order=fecha.asc,campo_id.asc`)
      .catch((error) => {
        if (!isMissingSupabaseColumn(error, ["creado_por_nombre", "modificado_por_nombre", "modificado_en", "actualizado_en"])) throw error;
        return sbSelectAll("programa_riego", `select=id,campo_id,fecha,horas_programadas,volumen_programado${irrigationDateQuery}&order=fecha.asc,campo_id.asc`);
      })
      .then((rows) => {
        irrigationProgramCloudAvailable = true;
        return rows;
      })
      .catch((error) => {
        console.warn("No se pudo cargar programa de riego", error);
        irrigationProgramCloudAvailable = !String(error?.message || "").toLowerCase().includes("could not find the table");
        return null;
      }) : Promise.resolve(null),
    loadIrrigation ? sbSelectAll("observaciones_riego", `select=id,tipo,campo_id,fecha,observacion,creado_por,creado_por_nombre,actualizado_por,actualizado_por_nombre,creado_en,actualizado_en${irrigationDateQuery}&order=fecha.asc`)
      .catch((error) => {
        console.warn("No se pudieron cargar observaciones de riego", error);
        const message = String(error?.message || "").toLowerCase();
        irrigationObservationsCloudAvailable = !message.includes("could not find the table") && !message.includes("schema cache");
        return null;
      }) : Promise.resolve(null),
    loadIrrigation ? sbSelectAll("evaporacion_bandeja", "select=fecha,evaporacion,estacion&order=fecha.asc")
      .then((rows) => rows?.length ? rows : sbSelectAllPublic("evaporacion_bandeja", "select=fecha,evaporacion,estacion&order=fecha.asc"))
      .catch((error) => {
        console.warn("No se pudo cargar evaporacion de bandeja con sesion, probando lectura publica", error);
        return sbSelectAllPublic("evaporacion_bandeja", "select=fecha,evaporacion,estacion&order=fecha.asc").catch((publicError) => {
          console.warn("No se pudo cargar evaporacion de bandeja", publicError);
          return [];
        });
      }) : Promise.resolve(null),
    loadWeather ? sbSelectAll("v_estacion_climatica_diaria", "select=fecha,registros,temperatura_promedio,temperatura_minima,temperatura_maxima,humedad_promedio,velocidad_viento_promedio,precipitacion_acumulada,horas_sobre_7,grados_dia_base_7,helada_0_menos_1,helada_menos_1_menos_2,helada_menor_igual_menos_2,helada_inicio,helada_termino&order=fecha.asc")
      .catch((error) => {
        if (!isMissingSupabaseColumn(error, ["humedad_promedio", "velocidad_viento_promedio", "precipitacion_acumulada", "helada_inicio", "helada_termino"])) throw error;
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
      }) : Promise.resolve(null),
    loadWeather ? sbSelectAll("estacion_climatica", "select=fecha,hora,temp_out&temp_out=lte.0&order=fecha.asc,hora.asc")
      .catch((error) => {
        console.warn("No se pudieron cargar los horarios de helada", error);
        return [];
      }) : Promise.resolve(null),
    loadWeather ? sbSelect("estacion_climatica", "select=fecha,hora,temp_out,hi_temp,low_temp,humedad,velocidad_viento,precipitacion&order=fecha.desc,hora.desc&limit=1")
      .catch((error) => {
        if (!isMissingSupabaseColumn(error, ["humedad", "velocidad_viento", "precipitacion"])) throw error;
        return sbSelect("estacion_climatica", "select=fecha,hora,temp_out,hi_temp,low_temp&order=fecha.desc,hora.desc&limit=1");
      })
      .catch((error) => {
        console.warn("No se pudo cargar la ultima lectura de la estacion climatica", error);
        return [];
      }) : Promise.resolve(null),
    loadHarvest ? sbSelectAll("registros_trazabilidad", "select=id,tipo_registro,num_bin,codigo_local,contratista,cuadrilla,cuartel,bloque,cuartel_sdp,bloque_sdp,sdp,especie,variedad,fecha_cosecha,fecha_escaneo,patente,conductor_nombre,fecha_despacho_camion,latitud,longitud,fecha_sincronizacion,ultima_sincronizacion&order=id.desc").catch((error) => {
      console.warn("No se pudieron cargar registros de cosecha", error);
      return [];
    }) : Promise.resolve(null),
    loadHarvest ? sbSelect("v_programacion_cuadrillas_dia", "select=*").catch((error) => {
      console.warn("No se pudo cargar programacion de cuadrillas", error);
      return [];
    }) : Promise.resolve(null),
    loadHarvest ? sbSelect("v_jornales_cuadrilla_dia", "select=*").catch((error) => {
      console.warn("No se pudieron cargar jornales de cosecha", error);
      return [];
    }) : Promise.resolve(null),
    loadHarvestAnalysis ? sbSelectAll("cosecha_analisis", "select=id,campo_id,fecha,anio,semana,especie,variedad,potrero_excel,bloque_formula,bloque_excel,potrero_normalizado,bloque_normalizado,contratista,cuadrilla,jornales,bins_nac,bins_expo,total_bins,kg_nac,kg_exp,kg_totales,archivo_origen,fila_excel&order=fecha.asc,id.asc").catch((error) => {
      console.warn("No se pudo cargar cosecha_analisis", error);
      return [];
    }) : Promise.resolve(null),
    loadHarvestExport ? sbSelectAll("exportacion_analisis", "select=id,campo_ids,fecha,anio,especie,variedad,potrero_excel,potrero_normalizado,cant_bins,enviados_kg,recepcionados_kg,diferencia_kg,bins_por_confirmar,kg_en_proceso,kg_por_procesar,exportados_kg,descarte_kg,precalibre_kg,desecho_kg,merma_kg,x_kg,porcentaje_expo,calibres_kg,calibres_cajas,calibres_kg_total,calibres_cajas_total,archivo_origen,fila_excel&order=fecha.asc,id.asc").catch((error) => {
      console.warn("No se pudo cargar exportacion_analisis", error);
      return [];
    }) : Promise.resolve(null)
  ]);
  const weatherDailyRows = Array.isArray(weatherDailyRowsRaw)
    ? await completeWeatherStationDailyRows(weatherDailyRowsRaw || [], weatherLatestRows || [])
    : null;
  if (Array.isArray(seasons)) {
    state.seasons = seasons.map((season) => ({
      id: season.id,
      name: season.nombre,
      startYear: season.anio_inicio,
      endYear: season.anio_fin,
      status: season.estado
    }));
    state.settings.currentSeasonId = state.seasons[0]?.id || "";
    state.settings.season = state.seasons[0]?.name || state.settings.season;
  }
  if (Array.isArray(programs)) {
    state.programs = programs.map((program) => ({
      id: program.id,
      sourceKey: program.clave_fuente || "",
      seasonId: program.temporada_id,
      number: program.numero_programa,
      code: program.codigo_aplicacion || String(program.numero_programa || ""),
      name: program.nombre,
      crop: program.cultivo,
      sourceSpecies: program.especie_fuente || program.cultivo || "",
      objective: program.objetivo,
      epoch: program.epoca || "",
      stage: program.etapa || "",
      carency: program.carencia || "",
      observations: program.observaciones || program.notas || "",
      source: program.fuente || "manual",
      active: program.activo !== false,
      incomplete: Boolean(program.incompleto),
      official: program.fuente === "PROGRAMA.xlsx" || program.nombre === "Programa Fitosanitario",
      cloudReady: true,
      startDate: program.fecha_inicio || "",
      endDate: program.fecha_termino || "",
      waterHa: Number(program.agua_por_ha) || 0
    }));
  }
  if (Array.isArray(programProductRows)) {
    state.programProducts = programProductRows.map((line) => ({
      id: line.id,
      programId: line.programa_id,
      productId: line.producto_id || "",
      name: line.nombre_producto_oficial || "",
      type: line.tipo_producto || "",
      dose: line.dosis === null || line.dosis === undefined ? null : Number(line.dosis),
      unit: line.unidad_dosis || "",
      basis: line.base_dosis || "unknown",
      outputUnit: line.unidad_resultado || "kg/L",
      divisor: Number(line.divisor_conversion) || 1,
      order: Number(line.orden) || 1,
      excelRow: Number(line.fila_excel) || null,
      incomplete: Boolean(line.incompleto)
    }));
  }
  const mapFieldRow = (field) => ({
    id: field.id,
    potrero: field.potrero,
    block: field.bloque,
    crop: field.especie || field.cultivo,
    variety: field.variedad,
    hectares: Number(field.hectareas) || 0,
    precipitation: field.precipitacion === null || field.precipitacion === undefined ? null : Number(field.precipitacion),
    flow: field.caudal === null || field.caudal === undefined ? null : Number(field.caudal),
    baseHours: field.horas_riego_base === null || field.horas_riego_base === undefined ? null : Number(field.horas_riego_base),
    active: field.activo !== false,
    plants: Number(field.plantas) || 0,
    plantsPerHa: Number(field.plantas_por_ha) || 0
  });
  if (Array.isArray(fields)) {
    state.blocks = fields.map(mapFieldRow);
  }
  if (Array.isArray(harvestFieldRows)) {
    state.harvestFields = harvestFieldRows.map(mapFieldRow);
  } else if (Array.isArray(fields)) {
    state.harvestFields = state.blocks;
  }
  if (Array.isArray(calicatas)) {
    state.calicatas = calicatas.map((item) => ({
      id: item.id,
      workerId: item.trabajador_id || "",
      workerName: item.trabajador_nombre || "",
      potrero: item.potrero || "",
      block: item.bloque || "",
      depth20: calicataDepthNumber(item.profundidad_20),
      depth40: calicataDepthNumber(item.profundidad_40),
      depth60: calicataDepthNumber(item.profundidad_60),
      depth80: calicataDepthNumber(item.profundidad_80),
      latitude: item.latitud,
      longitude: item.longitud,
      photoUrl: item.foto_url || "",
      createdAt: item.created_at || "",
      empty: Boolean(item.vacio),
      observation: item.observacion || ""
    }));
  }
  if (Array.isArray(irrigationRows)) applyIrrigationRecords(irrigationRows, { monthPrefix: irrigationMonthPrefix });
  if (Array.isArray(irrigationProgramRows)) applyIrrigationProgramRecords(irrigationProgramRows, { monthPrefix: irrigationMonthPrefix });
  if (Array.isArray(irrigationObservationRows)) applyIrrigationObservationRecords(irrigationObservationRows, { monthPrefix: irrigationMonthPrefix });
  if (Array.isArray(evaporationRows)) state.irrigationEvaporation = mapEvaporationRows(evaporationRows);
  if (Array.isArray(weatherDailyRows)) {
    const frostWindowsByDate = weatherStationFrostWindowsByDate(weatherFrostRows || []);
    state.weatherStationDaily = (weatherDailyRows || []).map((item) => ({
      date: item.fecha || "",
      records: Number(item.registros) || 0,
      average: Number(item.temperatura_promedio) || 0,
      minimum: Number(item.temperatura_minima),
      maximum: Number(item.temperatura_maxima),
      humidityAverage: item.humedad_promedio === null || item.humedad_promedio === undefined ? null : Number(item.humedad_promedio),
      windAverage: item.velocidad_viento_promedio === null || item.velocidad_viento_promedio === undefined ? null : Number(item.velocidad_viento_promedio),
      precipitationTotal: Number(item.precipitacion_acumulada) || 0,
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
      lowTemp: Number(latestWeather.low_temp),
      humidity: latestWeather.humedad === null || latestWeather.humedad === undefined ? null : Number(latestWeather.humedad),
      windSpeed: latestWeather.velocidad_viento === null || latestWeather.velocidad_viento === undefined ? null : Number(latestWeather.velocidad_viento),
      precipitation: latestWeather.precipitacion === null || latestWeather.precipitacion === undefined ? null : Number(latestWeather.precipitacion)
    } : null;
  }
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
  if (Array.isArray(harvestRecords)) {
    state.harvestRecords = harvestRecords.map((item) => mapHarvestRecord(item, "operativo"));
    state.harvestOfficialRecords = [];
  }
  if (Array.isArray(harvestCrewSchedule)) {
    state.harvestCrewSchedule = harvestCrewSchedule.map((item) => ({
      date: item.fecha || item.fecha_cosecha || "",
      contractor: item.nombre_empresa || item.contratista || "",
      crew: item.codigo_cuadrilla || item.cuadrilla || ""
    }));
  }
  if (Array.isArray(harvestJornales)) {
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
  }
  if (Array.isArray(harvestAnalysisRows)) {
    harvestAnalysisDbRows = harvestAnalysisRows;
    state.harvestAnalysisRecords = harvestAnalysisRows.map((item) => ({
      id: item.id,
      fieldId: item.campo_id || "",
      sourceFile: item.archivo_origen || "",
      excelRow: Number(item.fila_excel) || null,
      date: item.fecha || "",
      year: Number(item.anio) || Number(String(item.fecha || "").slice(0, 4)) || "",
      week: Number(item.semana) || null,
      species: harvestDisplaySpecies(item.especie),
      variety: harvestDisplayVariety(item.variedad),
      excelPotrero: harvestCleanValue(item.potrero_excel, ""),
      potrero: harvestCleanValue(item.potrero_normalizado || item.potrero_excel, "Sin potrero"),
      formulaBlock: harvestCleanValue(item.bloque_formula, ""),
      excelBlock: harvestCleanValue(item.bloque_excel, ""),
      block: harvestCleanValue(item.bloque_normalizado || item.bloque_excel, ""),
      contractor: harvestCleanValue(item.contratista, "Sin contratista"),
      crew: harvestCleanValue(item.cuadrilla, "Sin cuadrilla"),
      jornales: harvestNumericValue(item.jornales),
      binsNac: harvestNumericValue(item.bins_nac),
      binsExpo: harvestNumericValue(item.bins_expo),
      totalBins: harvestNumericValue(item.total_bins),
      kgNac: harvestNumericValue(item.kg_nac),
      kgExp: harvestNumericValue(item.kg_exp),
      kgTotal: harvestNumericValue(item.kg_totales)
    }));
  }
  if (Array.isArray(harvestExportRows)) {
    harvestExportDbRows = harvestExportRows;
    state.harvestExportRecords = harvestExportRows.map((item) => {
      const record = {
        id: item.id,
        fieldIds: Array.isArray(item.campo_ids) ? item.campo_ids.filter(Boolean) : [],
        sourceFile: item.archivo_origen || "",
        excelRow: Number(item.fila_excel) || null,
        date: item.fecha || "",
        year: Number(item.anio) || Number(String(item.fecha || "").slice(0, 4)) || "",
        species: harvestDisplaySpecies(item.especie),
        variety: harvestDisplayVariety(item.variedad),
        excelPotrero: harvestCleanValue(item.potrero_excel, ""),
        potrero: harvestCleanValue(item.potrero_normalizado || item.potrero_excel, "Sin potrero"),
        bins: harvestNumericValue(item.cant_bins),
        sentKg: harvestNumericValue(item.enviados_kg),
        receivedKg: harvestNumericValue(item.recepcionados_kg),
        differenceKg: harvestNumericValue(item.diferencia_kg),
        binsToConfirm: harvestNumericValue(item.bins_por_confirmar),
        inProcessKg: harvestNumericValue(item.kg_en_proceso),
        toProcessKg: harvestNumericValue(item.kg_por_procesar),
        exportedKg: harvestNumericValue(item.exportados_kg),
        discardKg: harvestNumericValue(item.descarte_kg),
        precalibreKg: harvestNumericValue(item.precalibre_kg),
        wasteKg: harvestNumericValue(item.desecho_kg),
        shrinkKg: harvestNumericValue(item.merma_kg),
        xKg: harvestNumericValue(item.x_kg),
        exportPercent: harvestExportPercentRatio(item.porcentaje_expo),
        hasExportPercent: item.porcentaje_expo !== null && item.porcentaje_expo !== undefined && String(item.porcentaje_expo).trim() !== "",
        calibresKg: harvestJsonObject(item.calibres_kg),
        calibresCajas: harvestJsonObject(item.calibres_cajas),
        calibresKgTotal: harvestNumericValue(item.calibres_kg_total),
        calibresCajasTotal: harvestNumericValue(item.calibres_cajas_total)
      };
      if (!record.fieldIds.length) {
        record.fieldIds = harvestExportFieldsForRecord(record).map((field) => field.id).filter(Boolean);
      }
      return record;
    });
  }
  if (Array.isArray(products)) {
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
  }
  if (loadPlanning && (Array.isArray(programs) || Array.isArray(programProductRows) || Array.isArray(products)) && (!officialPrograms().length || !state.programProducts.length)) {
    const fallback = await loadOfficialProgramFallback();
    const productsByName = new Map(state.products.map((product) => [normalizeCatalogText(product.name), product.id]));
    const seasonsByName = new Map(state.seasons.map((season) => [normalizeCatalogText(season.name), season.id]));
    (fallback.programs || []).forEach((item, index) => {
      const cloudProgram = state.programs.find((program) => program.official && program.sourceKey === item.sourceKey);
      const fallbackId = cloudProgram?.id || `catalog-program-${index + 1}`;
      if (!cloudProgram) {
        state.programs.push({
          id: fallbackId,
          sourceKey: item.sourceKey,
          seasonId: seasonsByName.get(normalizeCatalogText(item.seasonName)) || `catalog-season-${item.startYear}-${item.endYear}`,
          seasonName: item.seasonName,
          number: item.number,
          code: item.code,
          name: item.name,
          crop: item.crop,
          sourceSpecies: item.sourceSpecies,
          objective: item.objective,
          epoch: item.epoch,
          stage: item.stage,
          carency: item.carency,
          observations: item.observations,
          source: item.source,
          active: item.active !== false,
          incomplete: Boolean(item.incomplete),
          official: true,
          cloudReady: false,
          startDate: item.startDate || "",
          endDate: item.endDate || "",
          waterHa: Number(item.waterHa) || 0
        });
      }
      if (!state.programProducts.some((line) => String(line.programId) === String(fallbackId))) {
        state.programProducts.push(...(item.products || []).map((line) => ({
          id: `catalog-line-${index + 1}-${line.order}`,
          programId: fallbackId,
          productId: productsByName.get(normalizeCatalogText(line.name)) || "",
          name: line.name,
          type: line.type,
          dose: line.dose,
          unit: line.unit,
          basis: line.basis,
          outputUnit: line.outputUnit,
          divisor: Number(line.divisor) || 1,
          order: Number(line.order) || 1,
          excelRow: line.excelRow || null,
          incomplete: Boolean(line.incomplete)
        })));
      }
    });
  }
  if (Array.isArray(vehicles)) {
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
  }
  const productsByOrder = groupBy(orderProducts || [], "orden_id");
  const dispatchProductsByDispatch = groupBy(dispatchProducts || [], "despacho_id");
  const dispatchesByOrder = groupBy(dispatches || [], "orden_id");
  if (Array.isArray(orders)) state.orders = sortOrdersNewestFirst(orders.map((order) => ({
    id: order.id,
    number: order.numero_orden,
    seasonId: order.temporada_id,
    programId: order.programa_id || "",
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
      programProductId: line.programa_producto_id || "",
      programNumber: line.numero_programa || order.numero_programa || "",
      dose100: Number(line.dosis ?? line.dosis_por_100) || 0,
      dose: Number(line.dosis ?? line.dosis_por_100) || 0,
      doseUnit: line.unidad_dosis || "",
      doseBasis: line.base_dosis || "per_100l",
      outputUnit: line.unidad_resultado || "",
      divisor: Number(line.divisor_conversion) || 1000,
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
  if (Array.isArray(stockMovements)) {
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
  }
  state = normalizeState(state);
  const isRealtimeLoad = options.source === "realtime";
  const loadedModules = [];
  if (loadWeather) loadedModules.push("weather");
  if (loadFields) loadedModules.push("fields");
  if (loadApplications) loadedModules.push("applications");
  if (loadIrrigation) loadedModules.push("irrigation");
  if (loadCalicatas) loadedModules.push("calicatas");
  if (loadHarvest) loadedModules.push("harvest");
  if (loadHarvestAnalysis) loadedModules.push("harvestAnalysis");
  if (loadHarvestExport) loadedModules.push("harvestExport");
  if (loadIrrigation && irrigationMonthPrefix) irrigationCloudLoadedMonths.add(irrigationMonthPrefix);
  markCloudModulesLoaded(loadedModules);
  if (!isRealtimeLoad) {
    if (loadPlanning) await reconcileCloudOrderStatuses();
    applyRoleNavigation();
    saveState();
  }
  if (shouldRenderAfterCloudLoad(options)) render();
  if (!isRealtimeLoad) {
    updateAuthenticatedUserUi();
    document.getElementById("storageStatus").textContent = `Supabase conectado ${new Date().toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}`;
    setAuthGate(false);
  }
}

function shouldRenderAfterCloudLoad(options = {}) {
  return options.render !== false && options.source !== "realtime";
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

function cloudModulesForRealtimeTable(table = "") {
  if (table === "campos") return ["fields"];
  if (["riego", "programa_riego", "observaciones_riego", "evaporacion_bandeja"].includes(table)) return ["fields", "irrigation"];
  if (table === "estacion_climatica") return ["weather"];
  if (table === "calicatas") return ["fields", "calicatas"];
  if (table === "registros_trazabilidad") return ["harvest"];
  if (table === "cosecha_analisis") return ["harvestAnalysis"];
  if (table === "exportacion_analisis") return ["harvestExport"];
  if (["fertilizante_casetas", "fertilizante_estanques", "fertilizante_estanque_potreros", "fertilizante_productos", "fertilizante_preparaciones", "fertilizante_aplicaciones", "fertilizante_lotes"].includes(table)) return ["fertilizers"];
  if (["ordenes_aplicacion", "orden_productos", "despachos", "despacho_productos", "movimientos_stock", "productos", "programas", "programa_productos", "vehiculos"].includes(table)) return ["fields", "applications"];
  return cloudModulesForView(currentView);
}

function scheduleRealtimeCloudReload(reason = "cambio remoto") {
  if (!supabaseSession || document.hidden || hasOpenModal()) return;
  clearTimeout(cloudRealtimeReloadTimer);
  cloudRealtimeReloadTimer = setTimeout(async () => {
    if (!supabaseSession || cloudSyncInProgress || document.hidden || hasOpenModal()) return;
    const affectedModules = [...new Set(cloudModulesForRealtimeTable(reason))];
    const modules = affectedModules
      .filter((module) => cloudLoadedModules.has(module) || cloudModulesForView(currentView).includes(module));
    invalidateCloudModules(affectedModules);
    if (!modules.length) return;
    cloudSyncInProgress = true;
    try {
      await loadCloudData({ source: "realtime", modules, render: false, force: true });
      if (modules.some((module) => cloudModulesForView(currentView).includes(module))) render();
      document.getElementById("storageStatus").textContent = `Supabase sincronizado por ${reason} ${new Date().toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}`;
    } catch (error) {
      console.warn("No se pudo sincronizar Supabase Realtime", error);
    } finally {
      cloudSyncInProgress = false;
    }
  }, 2500);
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
    "fertilizante_casetas",
    "fertilizante_estanques",
    "fertilizante_estanque_potreros",
    "fertilizante_productos",
    "fertilizante_preparaciones",
    "fertilizante_aplicaciones",
    "fertilizante_lotes",
    "registros_trazabilidad",
    "cosecha_analisis",
    "exportacion_analisis",
    "ordenes_aplicacion",
    "orden_productos",
    "despachos",
    "despacho_productos",
    "movimientos_stock",
    "productos",
    "programas",
    "programa_productos",
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
          if (table.startsWith("fertilizante_")) {
            fertilizerRows = null;
            fertilizerStockRows = [];
            fertilizerStockLots = [];
            fertilizerLoadError = "";
            fertilizerStockError = "";
            fertilizerDataSource = "";
            if (currentView === "fertilizers") renderFertilizers();
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
    nombre_programa: programDefinition?.name || order.program || null,
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
        programa_producto_id: isUuid(line.programProductId) ? line.programProductId : null,
        numero_programa: line.programNumber || order.programNumbers?.[0] || order.programNumber || null,
        dosis_por_100: line.dose100 || 0,
        dosis: line.dose ?? line.dose100 ?? 0,
        unidad_dosis: line.doseUnit || null,
        base_dosis: line.doseBasis || "per_100l",
        unidad_resultado: line.outputUnit || null,
        divisor_conversion: line.divisor || 1,
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
      if (!isMissingSupabaseColumn(error, ["numero_programa", "programa_producto_id", "dosis", "unidad_dosis", "base_dosis", "unidad_resultado", "divisor_conversion"])) throw error;
      await sbFetch("/rest/v1/orden_productos", {
        method: "POST",
        prefer: "return=minimal",
        body: JSON.stringify(recipeRows.map(({ programa_producto_id, dosis, unidad_dosis, base_dosis, unidad_resultado, divisor_conversion, ...row }) => row))
      });
      showToast("Receta guardada con compatibilidad. Ejecuta la migración del Programa Fitosanitario para conservar la dosis oficial completa");
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
          <h3>${escapeHtml(potreroListLabel(order.potrero))} - ${escapeHtml(order.crop)}</h3>
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
            <strong>Orden #${order.number} - ${escapeHtml(potreroListLabel(order.potrero))}</strong>
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
        const expected = dispatchProductQuantity(order, line, dispatch.liters);
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
        <span>${escapeHtml(potreroListLabel(alert.order.potrero))} / bloques ${escapeHtml(alert.order.blocks?.join(", ") || "-")} - ${escapeHtml(alert.detail)}</span>
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
      gestureHandling: "greedy",
      scrollwheel: true,
      tilt: 0
    });
  }
  dashboardMap.setOptions({ gestureHandling: "greedy", scrollwheel: true, draggable: true, keyboardShortcuts: true });
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
      gestureHandling: "greedy",
      scrollwheel: true,
      tilt: 0
    });
  }
  harvestMap.setOptions({ gestureHandling: "greedy", scrollwheel: true, draggable: true, keyboardShortcuts: true });
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
      const label = createMapLabelOverlay(maps, shiftLatLng(geoLatLngCenter(item.rings), index, 34), potreroLabel(potreroFeatureName(item.feature)), "map-label-potrero-google");
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
  return String(record.crew || "S/C").trim() || "S/C";
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
        ${harvestInfoField("Potrero SDP", potreroLabel(record.sdpField || "Sin potrero SDP"))}
        ${harvestInfoField("Bloque SDP", record.sdpBlock || "Sin bloque SDP")}
        ${harvestInfoField("Potrero real", potreroLabel(record.realField || "Sin potrero real"))}
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

function irrigationCalicataBlockColor(key, index = 0) {
  const palette = [
    "#2dd4bf",
    "#60a5fa",
    "#a78bfa",
    "#f59e0b",
    "#34d399",
    "#fb7185",
    "#38bdf8",
    "#c084fc",
    "#facc15",
    "#4ade80",
    "#f97316",
    "#22c55e"
  ];
  const text = String(key || "");
  const hash = [...text].reduce((acc, char) => ((acc * 31) + char.charCodeAt(0)) >>> 0, index);
  return palette[hash % palette.length];
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
        gestureHandling: "greedy",
        scrollwheel: true,
        tilt: 0
      });
    }
    irrigationCalicataMap.setOptions({ gestureHandling: "greedy", scrollwheel: true, draggable: true, keyboardShortcuts: true });
    const bounds = new maps.LatLngBounds();
    const visibleKeys = new Set(blocks.map((block) => `${block.potrero}:${block.block}`));
    const blockRings = geoFeaturesToRings(geoJsonCache?.bloques?.features || []);
    const potreroRings = geoFeaturesToRings(geoJsonCache?.potreros?.features || []);
    blockRings.forEach((item, index) => {
      const key = blockFeatureKey(item.feature);
      const active = visibleKeys.has(key);
      const color = irrigationCalicataBlockColor(key, index);
      item.rings.forEach((ring) => {
        const polygon = new maps.Polygon({
          paths: ring.map(([lng, lat]) => ({ lat, lng })),
          strokeColor: active ? "#ffffff" : "#cbd5ce",
          strokeOpacity: active ? 0.98 : 0.65,
          strokeWeight: active ? 2.8 : 1.4,
          fillColor: active ? color : "#dfe8dc",
          fillOpacity: active ? 0.46 : 0.10,
          zIndex: active ? 5 : 1
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
          strokeColor: ["#073b2c", "#7c2d12", "#1e3a8a", "#581c87"][index % 4],
          strokeOpacity: 1,
          strokeWeight: 3.4,
          fillOpacity: 0,
          zIndex: 8
        });
        polygon.setMap(irrigationCalicataMap);
        irrigationCalicataOverlays.push(polygon);
      });
      if (irrigationCalicataShowPotreroLabels) {
        const label = createMapLabelOverlay(maps, shiftLatLng(geoLatLngCenter(item.rings), index, 34), potreroLabel(potreroFeatureName(item.feature)), "map-label-potrero-google");
        label.setMap(irrigationCalicataMap);
        irrigationCalicataOverlays.push(label);
      }
    });
    records.forEach((item) => {
      const position = { lat: Number(item.latitude), lng: Number(item.longitude) };
      const averageValue = calicataAverageValue(item);
      const icon = irrigationCalicataMarkerIcon(maps, calicataValueColor(averageValue));
      const marker = new maps.Marker({
        position,
        map: irrigationCalicataMap,
        icon,
        title: `Calicata ${potreroLabel(item.potrero)} bloque ${item.block || "-"} · promedio ${averageValue === null ? "-" : number(averageValue)}`
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
  irrigationCalicataInfoWindow ||= new maps.InfoWindow({ maxWidth: 310, disableAutoPan: true });
  const averageValue = calicataAverageValue(item);
  irrigationCalicataInfoWindow.setContent(`
    <div class="harvest-map-info irrigation-calicata-info">
      <div class="harvest-map-info-head">
        <strong>${escapeHtml(potreroLabel(item.potrero))} · Bloque ${escapeHtml(item.block || "-")}</strong>
        <span>${escapeHtml(calicataDate(item) || "Sin fecha")}</span>
      </div>
      ${item.photoUrl ? `<img class="irrigation-calicata-photo" src="${htmlAttr(item.photoUrl)}" alt="Foto calicata" loading="lazy">` : ""}
      <div class="harvest-map-info-grid">
        ${harvestInfoField("Trabajador", item.workerName || "Sin trabajador")}
        ${harvestInfoField("20 cm", calicataDepthLabel(item.depth20))}
        ${harvestInfoField("40 cm", calicataDepthLabel(item.depth40))}
        ${harvestInfoField("60 cm", calicataDepthLabel(item.depth60))}
        ${harvestInfoField("80 cm", calicataDepthLabel(item.depth80))}
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
    return `<text class="map-label map-label-potrero" x="${center[0].toFixed(1)}" y="${y.toFixed(1)}">${escapeHtml(potreroLabel(potreroFeatureName(item.feature)))}</text>`;
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

const GEOJSON_FIELD_ALIASES = Object.freeze({
  "casa verde": "28",
  "el parque 1": "El parque 1",
  "el peumo": "29",
  "los pinos": "10",
  "los pinos 80": "Los pinos Paltos",
  "los pinos 2004": "Los pinos Paltos",
  "parque 2": "El parque 2",
  "parque 3": "El parque 3",
  "p1": "1",
  "p19": "19",
  "p20": "20",
  "p20a": "20A",
  "p21": "21",
  "p22": "22",
  "p23": "23",
  "p24": "24",
  "p25": "25",
  "p27 c": "27 IMP",
  "p27 r": "27 GRAV",
  "p2b4": "2",
  "p2b5": "2",
  "p30 4,5": "30",
  "p30 6,7": "30",
  "p30 barnfield": "30",
  "p5": "5",
  "p6": "6",
  "p7": "7",
  "unidad d": "D",
  "unidad e": "E",
  "unidad f": "F",
  "unidad g": "G",
  "unidad h": "H",
  "unidad i": "I",
  "unidad j": "J"
});

function geoJsonFieldAlias(value) {
  const clean = String(value || "").trim();
  return GEOJSON_FIELD_ALIASES[clean.toLocaleLowerCase("es")] || clean;
}

function geoJsonFeatureField(feature) {
  const properties = feature?.properties || {};
  let rawPotrero = String(
    properties["Potrero_Alias:"] || properties.Potrero_Alias
    || properties["Alias:"] || properties.Alias || properties.alias
    || properties.potrero || properties.Potrero || properties.POTRERO
    || properties.Nombre || ""
  ).trim();
  if (!rawPotrero && !String(properties.bloque || properties.Bloque || properties.BLOQUE || properties.block || properties.BLOCK || "").trim()) {
    return { potrero: "5", block: "1" };
  }
  if (!rawPotrero && Number(properties.fid) === 125) rawPotrero = "Unidad E";
  const potrero = geoJsonFieldAlias(rawPotrero);
  const rawBlock = String(properties.bloque || properties.Bloque || properties.BLOQUE || properties.block || properties.BLOCK || "").trim();
  let block = /^[D-J]$/i.test(potrero) && rawBlock && !rawBlock.toLocaleUpperCase("es").startsWith(potrero.toLocaleUpperCase("es"))
    ? `${potrero}${rawBlock}`
    : rawBlock;
  const blockOverride = {
    "29:2A": "2",
    "29:2B": "2",
    "29:5A": "5",
    "29:5B": "5",
    "19:1": "4",
    "6:1": "3"
  }[`${potrero}:${block.toLocaleUpperCase("es")}`];
  if (blockOverride) block = blockOverride;
  return { potrero, block };
}

function fieldIdentityKey(potrero, block) {
  return `${String(potrero || "").trim().toLocaleLowerCase("es")}:${String(block || "").trim().toLocaleUpperCase("es")}`;
}

function potreroFeatureName(feature) {
  return geoJsonFeatureField(feature).potrero;
}

function blockFeatureName(feature) {
  return geoJsonFeatureField(feature).block;
}

function blockFeatureKey(feature) {
  const field = geoJsonFeatureField(feature);
  return `${field.potrero}:${field.block}`;
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
          <h3>${escapeHtml(potreroListLabel(order.potrero))} - ${escapeHtml(order.crop)}</h3>
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
        <h3>${escapeHtml(potreroListLabel(order.potrero))} ${order.blocks?.length ? `bloques ${escapeHtml(order.blocks.join(", "))}` : ""}</h3>
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
          const qty = dispatchProductQuantity(order, line, tankLiters);
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
    .map((row) => ({ ...row, label: potreroListLabel(row.label), productHa: row.hectares ? row.product / row.hectares : 0 }))
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
    const key = `${potreroListLabel(order.potrero)} / ${order.blocks?.join(", ") || "-"}`;
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
      const fieldKey = `${potreroListLabel(order.potrero)} / ${order.blocks?.join(", ") || "-"}`;
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
      const expected = dispatchProductQuantity(order, line, liters);
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
            <tbody>${state.blocks.map((block) => `<tr><td>${escapeHtml(potreroLabel(block.potrero))}</td><td>${escapeHtml(block.block)}</td><td>${escapeHtml(block.crop)}</td><td>${escapeHtml(block.variety)}</td><td>${number(block.hectares)}</td></tr>`).join("")}</tbody>
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

function openOrderDialog(orderId, presetProgramId = "") {
  const dialog = document.getElementById("orderDialog");
  const order = orderId ? state.orders.find((item) => item.id === orderId) : null;
  const nextNumber = Math.max(0, ...state.orders.map((item) => Number(item.number) || 0)) + 1;
  const selectedRecipe = order?.recipe || [];
  const potreros = uniquePotreros();
  const selectedOfficialProgram = state.programs.find((program) => String(program.id) === String(presetProgramId || order?.programId || ""));
  const selectedPrograms = selectedOfficialProgram
    ? [selectedOfficialProgram.number]
    : order?.programNumbers?.length ? order.programNumbers : [order?.programNumber].filter(Boolean);
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
        <div class="program-picker official-order-program-picker full">
          <input type="hidden" name="programNumbers" value="${selectedPrograms.join(", ")}">
          <input type="hidden" name="programId" value="${selectedOfficialProgram?.id || order?.programId || ""}">
          <div class="block-picker-head">
            <label>Programa Fitosanitario
              <select id="officialProgramSelect">
                <option value="">Seleccionar aplicación oficial</option>
                ${officialProgramOrderOptions(selectedOfficialProgram?.id || "")}
              </select>
            </label>
            <button type="button" class="secondary-button" id="applyOfficialProgram">Cargar programa</button>
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
            ${potreros.map((potrero) => `<option value="${htmlAttr(potrero)}" ${potrero === initialPotrero ? "selected" : ""}>${escapeHtml(potreroLabel(potrero))}</option>`).join("")}
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
            <strong>Dosis oficial</strong>
            <strong>Gasto por producto / ha</strong>
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
  document.getElementById("applyOfficialProgram").addEventListener("click", applyOfficialProgramToOrder);
  document.getElementById("addRecipeLine").addEventListener("click", () => {
    document.getElementById("recipeLines").insertAdjacentHTML("beforeend", recipeLineHtml({ productId: state.products[0].id, dose100: state.products[0].dose100 }, selectedOrderPrograms()));
    updateOrderRecipeCalculations();
  });
  document.querySelector('[name="waterHa"]').addEventListener("input", updateOrderRecipeCalculations);
  document.getElementById("recipeLines").addEventListener("input", (event) => {
    if (event.target.matches('[name="dose100"]')) updateOrderRecipeCalculations();
  });
  dialog.addEventListener("click", removeRecipeLine);
  dialog.addEventListener("click", removeOrderBlock);
  dialog.addEventListener("click", removeOrderProgram);
  document.getElementById("saveOrder").addEventListener("click", () => saveOrder(order?.id));
  if (presetProgramId && !order) applyOfficialProgramToOrder(presetProgramId);
  updateOrderRecipeCalculations();
}

function officialProgramOrderOptions(selectedId = "") {
  const programs = officialPrograms().filter((program) => program.cloudReady).sort((a, b) => officialProgramSeasonLabel(b).localeCompare(officialProgramSeasonLabel(a)) || a.crop.localeCompare(b.crop) || a.number - b.number);
  const grouped = programs.reduce((acc, program) => {
    const label = `${officialProgramSeasonLabel(program)} · ${program.crop}`;
    acc[label] ||= [];
    acc[label].push(program);
    return acc;
  }, {});
  return Object.entries(grouped).map(([label, items]) => `<optgroup label="${htmlAttr(label)}">${items.map((program) => `<option value="${htmlAttr(program.id)}" ${String(program.id) === String(selectedId) ? "selected" : ""}>N° ${escapeHtml(program.code || program.number)} · ${escapeHtml(program.stage || program.epoch || program.objective)}</option>`).join("")}</optgroup>`).join("");
}

function applyOfficialProgramToOrder(programId = "") {
  const form = document.getElementById("orderForm");
  if (!form) return;
  const selectedId = typeof programId === "string" && programId ? programId : document.getElementById("officialProgramSelect")?.value;
  const program = state.programs.find((item) => String(item.id) === String(selectedId));
  if (!program?.official || !program.cloudReady) {
    showToast("Selecciona una aplicación oficial sincronizada con Supabase");
    return;
  }
  const lines = programProductsFor(program.id);
  form.programId.value = program.id;
  form.seasonId.value = program.seasonId;
  form.programNumbers.value = String(program.number);
  form.objective.value = program.objective || "";
  if (program.waterHa) form.waterHa.value = program.waterHa;
  renderOrderProgramPicker([program.number]);
  const recipeContainer = document.getElementById("recipeLines");
  recipeContainer.querySelectorAll(".recipe-line:not(.recipe-line-head)").forEach((line) => line.remove());
  const missingProducts = lines.filter((line) => !line.productId).length;
  const recipeLines = [...new Map(lines
    .filter((line) => line.productId && !line.incomplete && Number(line.dose) > 0)
    .map((line) => [line.productId, line])).values()];
  recipeLines.forEach((line) => {
    if (!line.productId) {
      return;
    }
    recipeContainer.insertAdjacentHTML("beforeend", recipeLineHtml({
      productId: line.productId,
      programProductId: line.id,
      programNumber: program.number,
      dose100: line.dose ?? 0,
      dose: line.dose,
      doseUnit: line.unit,
      doseBasis: line.basis,
      outputUnit: line.outputUnit,
      divisor: line.divisor,
      incomplete: line.incomplete
    }, [program.number]));
  });
  updateOrderRecipeCalculations();
  const warnings = [];
  if (missingProducts) warnings.push(`${missingProducts} producto(s) sin vínculo al maestro`);
  if (lines.some((line) => line.incomplete)) warnings.push("las líneas incompletas quedaron fuera de la receta");
  if (warnings.length) showToast(warnings.join("; "));
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
  return parsed.potrero ? `${potreroLabel(parsed.potrero)} / Bloque ${parsed.block}` : `Bloque ${parsed.block}`;
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
      <strong>${escapeHtml(potreroLabel(potrero))}</strong>
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
    ? `<option value="__all__">Agregar todos los bloques de ${escapeHtml(potreroLabel(potrero))}</option><option value="">Seleccionar bloque</option>${pickerAvailable
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
  const doseValue = line.dose ?? line.dose100 ?? 0;
  const basis = line.doseBasis || "per_100l";
  const unit = line.doseUnit || (basis === "per_100l" ? "kg/L por 100 L" : "");
  return `
    <div class="recipe-line ${line.incomplete ? "recipe-line-incomplete" : ""}">
      <input type="hidden" name="programProductId" value="${htmlAttr(line.programProductId || "")}">
      <input type="hidden" name="doseBasis" value="${htmlAttr(basis)}">
      <input type="hidden" name="doseUnit" value="${htmlAttr(unit)}">
      <input type="hidden" name="outputUnit" value="${htmlAttr(line.outputUnit || "")}">
      <input type="hidden" name="doseDivisor" value="${Number(line.divisor) || (basis === "per_100l" ? 1000 : 1)}">
      <select name="productId">${state.products.map((product) => `<option value="${product.id}" ${product.id === line.productId ? "selected" : ""}>${product.name}</option>`).join("")}</select>
      <select name="lineProgramNumber">${programOptions(programs, line.programNumber || programs[0] || "")}</select>
      <label class="recipe-dose-control"><input name="dose100" type="number" step="0.01" value="${doseValue}" aria-label="Dosis oficial"><small>${escapeHtml(unit || "Unidad pendiente")}</small></label>
      <label class="recipe-result-control"><input name="productHaProgram" type="number" step="0.001" value="" aria-label="Gasto por producto y hectarea" title="Calculado desde la base de dosis oficial" readonly><small>${escapeHtml(line.outputUnit || getProduct(line.productId)?.unit || "kg/L")}/ha</small></label>
      <button type="button" class="icon-button" data-action="remove-recipe" title="Quitar">x</button>
    </div>
  `;
}

function updateOrderRecipeCalculations() {
  const form = document.getElementById("orderForm");
  if (!form) return;
  const waterHa = Number(form.elements.waterHa?.value) || 0;
  form.querySelectorAll(".recipe-line").forEach((line) => {
    const doseInput = line.querySelector('[name="dose100"]');
    const productHaInput = line.querySelector('[name="productHaProgram"]');
    if (!doseInput || !productHaInput) return;
    productHaInput.value = productHaFromDose({ waterHa }, {
      dose: doseInput.value,
      dose100: doseInput.value,
      doseBasis: line.querySelector('[name="doseBasis"]')?.value || "per_100l",
      divisor: Number(line.querySelector('[name="doseDivisor"]')?.value) || 1
    }).toFixed(3);
  });
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
  const selectedOfficialProgram = state.programs.find((program) => String(program.id) === String(data.programId || ""));
  if (selectedOfficialProgram && !normalizeCatalogText(data.crop).split(",").map((item) => item.trim()).includes(normalizeCatalogText(selectedOfficialProgram.crop))) {
    showToast(`La aplicación seleccionada corresponde a ${selectedOfficialProgram.crop}; revisa los bloques de la orden`);
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
    programProductId: line.querySelector('[name="programProductId"]')?.value || "",
    programNumber: Number(line.querySelector('[name="lineProgramNumber"]').value) || selectedPrograms[0],
    dose100: Number(line.querySelector('[name="dose100"]').value),
    dose: Number(line.querySelector('[name="dose100"]').value),
    doseUnit: line.querySelector('[name="doseUnit"]')?.value || "",
    doseBasis: line.querySelector('[name="doseBasis"]')?.value || "per_100l",
    outputUnit: line.querySelector('[name="outputUnit"]')?.value || "",
    divisor: Number(line.querySelector('[name="doseDivisor"]')?.value) || 1,
    productHaProgram: Number(line.querySelector('[name="productHaProgram"]').value) || 0
  })).filter((line) => line.productId && line.dose100 > 0);

  if (!recipe.length) {
    showToast("La orden necesita al menos un producto con dosis válida");
    return;
  }

  recipe.forEach((line) => {
    line.productHaProgram = productHaFromDose({ waterHa: data.waterHa }, line);
    line.totalProgram = line.productHaProgram * (Number(data.hectares) || 0);
  });

  const payload = {
    number: Number(data.number),
    seasonId: data.seasonId,
    programId: data.programId || "",
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
      await reloadCurrentCloudModules();
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
          const planned = dispatchProductQuantity(order, line, defaultLiters);
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
      await reloadCurrentCloudModules();
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
      await reloadCurrentCloudModules();
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
          <p>${escapeHtml(potreroListLabel(order.potrero))} · ${escapeHtml(programLabel(order))} · ${escapeHtml(order.objective || "Sin objetivo")}</p>
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

function dispatchProductCalculatorRow(order, line, value, manual = false) {
  const product = getProduct(line.productId) || {};
  const productHa = productHaFromDose(order, line);
  return `
    <div class="dispatch-product-calc-row ${manual ? "is-manual" : ""}" data-dispatch-product-row="${htmlAttr(line.productId)}">
      <div class="dispatch-product-identity">
        <strong>${escapeHtml(product.name || "Producto")}</strong>
        <span>Producto / ha: <b>${number(productHa)} ${escapeHtml(product.unit || line.outputUnit || "kg/L")}/ha</b></span>
      </div>
      <div class="dispatch-product-formula">
        <small>Cálculo sugerido</small>
        <strong data-dispatch-formula="${htmlAttr(line.productId)}">-</strong>
      </div>
      <label class="dispatch-product-total">Total producto
        <span class="dispatch-product-input-wrap">
          <input name="product-${htmlAttr(line.productId)}" data-product-input="${htmlAttr(line.productId)}" data-manual-override="${manual ? "true" : "false"}" type="number" min="0" step="0.001" value="${Number(value || 0).toFixed(3)}" required>
          <b>${escapeHtml(product.unit || line.outputUnit || "kg/L")}</b>
        </span>
      </label>
      <button type="button" class="secondary-button dispatch-use-calculation" data-use-dispatch-calculation="${htmlAttr(line.productId)}">Usar cálculo</button>
    </div>`;
}

function refreshDispatchProductCalculator(orderId, form, force = false) {
  const order = state.orders.find((item) => item.id === orderId);
  if (!order || !form || form.dataset.dispatchType === "devolucion") return;
  const liters = Number(form.elements.liters?.value) || 0;
  const equivalentHa = Number(order.waterHa) ? liters / Number(order.waterHa) : 0;
  order.recipe.forEach((line) => {
    const product = getProduct(line.productId) || {};
    const input = form.querySelector(`[data-product-input="${line.productId}"]`);
    const row = form.querySelector(`[data-dispatch-product-row="${line.productId}"]`);
    const formula = form.querySelector(`[data-dispatch-formula="${line.productId}"]`);
    if (!input) return;
    const productHa = productHaFromDose(order, line);
    const qty = dispatchProductQuantity(order, line, liters);
    input.dataset.suggestedValue = qty.toFixed(3);
    if (formula) formula.textContent = `${number(liters, 0)} L / ${number(order.waterHa, 0)} L/ha × ${number(productHa)} ${product.unit || line.outputUnit || "kg/L"}/ha = ${number(qty, 3)} ${product.unit || line.outputUnit || "kg/L"}`;
    if (force || input.dataset.manualOverride !== "true") {
      input.value = qty.toFixed(3);
      input.dataset.manualOverride = "false";
      row?.classList.remove("is-manual");
    }
  });
  form.querySelectorAll("[data-equivalent-hectares]").forEach((element) => {
    element.textContent = `${number(equivalentHa, 3)} ha`;
  });
}

function bindDispatchProductCalculator(orderId, form, preserveValues = false) {
  if (!form || form.dataset.dispatchType === "devolucion") return;
  form.querySelectorAll("[data-product-input]").forEach((input) => {
    input.dataset.manualOverride = preserveValues ? "true" : "false";
    input.addEventListener("input", () => {
      input.dataset.manualOverride = "true";
      input.closest("[data-dispatch-product-row]")?.classList.add("is-manual");
    });
  });
  form.querySelectorAll("[data-use-dispatch-calculation]").forEach((button) => {
    button.addEventListener("click", () => {
      const input = form.querySelector(`[data-product-input="${button.dataset.useDispatchCalculation}"]`);
      if (!input) return;
      input.dataset.manualOverride = "false";
      refreshDispatchProductCalculator(orderId, form, false);
    });
  });
  form.querySelector("[data-recalculate-dispatch-products]")?.addEventListener("click", () => {
    form.querySelectorAll("[data-product-input]").forEach((input) => { input.dataset.manualOverride = "false"; });
    refreshDispatchProductCalculator(orderId, form, true);
  });
  form.elements.liters?.addEventListener("input", () => refreshDispatchProductCalculator(orderId, form, false));
  refreshDispatchProductCalculator(orderId, form, !preserveValues);
}

function openEditDispatchDialog(orderId, dispatchId) {
  const order = state.orders.find((item) => item.id === orderId);
  const dispatch = order?.dispatches?.find((item) => String(item.id) === String(dispatchId));
  if (!order || !dispatch) return;

  const dialog = document.getElementById(dispatch.type === "devolucion" ? "returnDialog" : "dispatchDialog");
  dialog.innerHTML = `
    <form method="dialog" class="modal-body" id="editDispatchForm" data-dispatch-type="${dispatch.type}">
      <div class="modal-head">
        <h2>Modificar ${dispatch.type === "devolucion" ? "devolucion" : "salida"} - Orden #${order.number}</h2>
        <button class="icon-button" type="button" data-action="close-dialog" title="Cerrar">x</button>
      </div>
      <div class="form-grid">
        <label>Fecha<input name="date" type="date" value="${dispatch.date || new Date().toISOString().slice(0, 10)}" required></label>
        <label>Hora salida<input name="time" type="time" value="${dispatchDisplayTime(dispatch) !== "-" ? dispatchDisplayTime(dispatch) : currentTimeValue()}" required></label>
        <label>Mojamiento ${dispatch.type === "devolucion" ? "devuelto" : "salida"} L<input name="liters" type="number" step="1" value="${dispatch.liters || 0}" required></label>
        <label class="locked-field">Potrero<input value="${htmlAttr(potreroListLabel(order.potrero))}" disabled><small>No editable por bodega</small></label>
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
      <div class="recipe-editor dispatch-product-calculator">
        <div class="dispatch-product-calculator-head"><h3>Productos ${dispatch.type === "devolucion" ? "devueltos" : "entregados"}</h3>${dispatch.type === "salida" ? `<button type="button" class="secondary-button" data-recalculate-dispatch-products>Recalcular todos</button>` : ""}</div>
        ${order.recipe.map((line) => {
          const qty = dispatch.products?.[line.productId] ?? 0;
          return dispatch.type === "salida"
            ? dispatchProductCalculatorRow(order, line, qty, true)
            : `<label>${escapeHtml(getProduct(line.productId)?.name || "Producto")}<input name="product-${line.productId}" data-product-input="${line.productId}" type="number" min="0" step="0.001" value="${Number(qty || 0).toFixed(3)}" required><span>${escapeHtml(getProduct(line.productId)?.unit || "")}</span></label>`;
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
  bindDispatchProductCalculator(orderId, document.getElementById("editDispatchForm"), true);
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
  refreshDispatchProductCalculator(orderId, form, false);
  const preview = document.getElementById("editDispatchCalcPreview");
  if (preview) {
    preview.innerHTML = form.dataset.dispatchType === "devolucion" ? `
      <span>Devolución: <strong>ingresa manualmente las cantidades recibidas</strong></span>
      <span>Mojamiento devuelto: <strong>${number(liters, 0)} L</strong></span>
    ` : `
      <span>Hectáreas equivalentes: <strong data-equivalent-hectares>${number(equivalentHa, 3)} ha</strong></span>
      <span>Fórmula: <strong>mojamiento salida / mojamiento L/ha × producto kg/L por ha</strong></span>
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
      await reloadCurrentCloudModules();
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
      await reloadCurrentCloudModules();
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
    <form method="dialog" class="modal-body" id="dispatchForm" data-dispatch-type="${type}">
      <div class="modal-head">
        <h2>${type === "devolucion" ? "Devolucion de sobrante" : "Orden de salida"} - #${order.number}</h2>
        <button class="icon-button" type="button" data-action="close-dialog" title="Cerrar">x</button>
      </div>
      <div class="form-grid">
        <label>Fecha<input name="date" type="date" value="${new Date().toISOString().slice(0, 10)}" required></label>
        <label>Hora salida<input name="time" type="time" value="${currentTimeValue()}" required></label>
        <label>Mojamiento ${type === "devolucion" ? "devuelto" : "salida"} L<input name="liters" type="number" step="1" value="${defaultLiters}" required></label>
        <label class="locked-field">Potrero<input value="${htmlAttr(potreroListLabel(order.potrero))}" disabled><small>No editable por bodega</small></label>
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
      <div class="recipe-editor dispatch-product-calculator">
        <div class="dispatch-product-calculator-head"><h3>${type === "devolucion" ? "Productos devueltos" : "Productos a entregar"}</h3>${type === "salida" ? `<button type="button" class="secondary-button" data-recalculate-dispatch-products>Recalcular todos</button>` : ""}</div>
        ${order.recipe.map((line) => {
          const product = getProduct(line.productId);
          const qty = dispatchProductQuantity(order, line, defaultLiters);
          return type === "salida"
            ? dispatchProductCalculatorRow(order, line, qty, false)
            : `<label>${escapeHtml(product?.name || "Producto")}<input name="product-${line.productId}" data-product-input="${line.productId}" type="number" min="0" step="0.001" value="${number(qty, 3).replaceAll(".", "").replace(",", ".")}" required><span>${escapeHtml(product?.unit || "")}</span></label>`;
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
  bindDispatchProductCalculator(orderId, document.getElementById("dispatchForm"), false);
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
  refreshDispatchProductCalculator(orderId, form, false);
  const preview = document.getElementById("dispatchCalcPreview");
  if (preview) {
    preview.innerHTML = form.dataset.dispatchType === "devolucion" ? `
      <span>Devolución: <strong>ingresa manualmente las cantidades recibidas</strong></span>
      <span>Mojamiento devuelto: <strong>${number(liters, 0)} L</strong></span>
    ` : `
      <span>Hectáreas equivalentes: <strong data-equivalent-hectares>${number(equivalentHa, 3)} ha</strong></span>
      <span>Fórmula: <strong>mojamiento salida / mojamiento L/ha × producto kg/L por ha</strong></span>
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
      await reloadCurrentCloudModules();
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

function printDate(value) {
  if (!value) return "-";
  const [year, month, day] = String(value).slice(0, 10).split("-");
  return year && month && day ? `${day}/${month}/${year}` : String(value);
}

function orderViableHarvestDate(order) {
  const maxDays = Math.max(0, ...(order.recipe || []).map((line) => Number(getProduct(line.productId)?.carencyDays) || 0));
  const base = orderStartDate(order);
  if (!base || !maxDays) return "Sin restricción registrada";
  const date = new Date(`${base}T12:00:00`);
  date.setDate(date.getDate() + maxDays);
  return printDate(date.toISOString().slice(0, 10));
}

function pdfSafeText(value) {
  return String(value ?? "")
    .replace(/[–—]/g, "-")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/·/g, "-")
    .replace(/[^\x20-\xFF]/g, "?");
}

function pdfTextLines(font, value, size, maxWidth, maxLines = 2) {
  const text = pdfSafeText(value).trim();
  if (!text) return [""];
  const lines = [];
  const words = text.split(/\s+/);
  let current = "";
  words.forEach((word) => {
    const candidate = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
      current = candidate;
      return;
    }
    if (current) lines.push(current);
    current = word;
  });
  if (current) lines.push(current);
  if (lines.length > maxLines) {
    lines.length = maxLines;
    let last = lines[maxLines - 1];
    while (last && font.widthOfTextAtSize(`${last}...`, size) > maxWidth) last = last.slice(0, -1);
    lines[maxLines - 1] = `${last}...`;
  }
  return lines;
}

function pdfDrawCell(page, options) {
  const { x, top, width, height, text = "", font, boldFont, size = 7, fill, border, align = "left", bold = false, maxLines = 2, padding = 3 } = options;
  const y = top - height;
  page.drawRectangle({ x, y, width, height, color: fill, borderColor: border, borderWidth: 0.55 });
  const activeFont = bold ? boldFont : font;
  const lines = pdfTextLines(activeFont, text, size, Math.max(2, width - padding * 2), maxLines);
  const lineHeight = size + 1;
  const blockHeight = lines.length * lineHeight;
  const firstY = y + Math.max(padding, (height + blockHeight) / 2 - lineHeight);
  lines.forEach((line, index) => {
    const lineWidth = activeFont.widthOfTextAtSize(line, size);
    const tx = align === "center" ? x + Math.max(padding, (width - lineWidth) / 2) : align === "right" ? x + width - padding - lineWidth : x + padding;
    page.drawText(line, { x: tx, y: firstY - index * lineHeight, size, font: activeFont, color: PDFLib.rgb(0.08, 0.15, 0.12) });
  });
}

function pdfDrawTable(page, top, widths, headers, rows, style) {
  const xStart = style.x;
  let x = xStart;
  headers.forEach((header, index) => {
    pdfDrawCell(page, { x, top, width: widths[index], height: style.headerHeight, text: header, font: style.font, boldFont: style.boldFont, size: style.headerSize || 6.5, fill: style.headerFill, border: style.border, align: "center", bold: true, maxLines: 2 });
    x += widths[index];
  });
  let rowTop = top - style.headerHeight;
  rows.forEach((row) => {
    x = xStart;
    row.forEach((cell, index) => {
      const cellInfo = typeof cell === "object" ? cell : { text: cell };
      pdfDrawCell(page, { x, top: rowTop, width: widths[index], height: style.rowHeight, text: cellInfo.text, font: style.font, boldFont: style.boldFont, size: cellInfo.size || style.rowSize || 6.5, fill: style.bodyFill, border: style.border, align: cellInfo.align || (index ? "center" : "left"), bold: Boolean(cellInfo.bold), maxLines: cellInfo.maxLines || 2 });
      x += widths[index];
    });
    rowTop -= style.rowHeight;
  });
  return rowTop;
}

function pdfDrawCheckList(page, x, top, width, height, title, items, font, boldFont, colors) {
  page.drawRectangle({ x, y: top - height, width, height, color: colors.white, borderColor: colors.border, borderWidth: 0.55 });
  page.drawText(pdfSafeText(title).toUpperCase(), { x: x + 5, y: top - 11, size: 6.5, font: boldFont, color: colors.green });
  items.slice(0, 5).forEach((item, index) => {
    const cy = top - 22 - index * 9;
    page.drawRectangle({ x: x + 5, y: cy - 1, width: 6, height: 6, borderColor: colors.ink, borderWidth: 0.6 });
    if (item.checked) {
      page.drawLine({ start: { x: x + 6, y: cy + 1 }, end: { x: x + 8, y: cy - 0.5 }, thickness: 0.8, color: colors.green });
      page.drawLine({ start: { x: x + 8, y: cy - 0.5 }, end: { x: x + 10, y: cy + 4 }, thickness: 0.8, color: colors.green });
    }
    page.drawText(pdfSafeText(item.label), { x: x + 14, y: cy - 0.5, size: 6.2, font, color: colors.ink });
  });
}

async function downloadApplicationOrderPdf(orderId) {
  const order = state.orders.find((item) => item.id === orderId);
  if (!order) return;
  if (!window.PDFLib?.PDFDocument) {
    showToast("No se pudo cargar el generador PDF. Recarga la página e inténtalo nuevamente");
    return;
  }
  showToast(`Generando PDF de la orden ${order.number}...`);
  try {
    const { PDFDocument, StandardFonts, rgb } = window.PDFLib;
    const pdfDoc = await PDFDocument.create();
    pdfDoc.setTitle(`Orden ${order.number} - Aplicación de Fitosanitarios y Fertilizantes`);
    pdfDoc.setAuthor("Canelillo AgroCore");
    pdfDoc.setSubject(pdfSafeText(order.objective || "Orden de aplicación"));
    const page = pdfDoc.addPage([841.89, 595.28]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const colors = {
      green: rgb(0.08, 0.42, 0.31),
      darkGreen: rgb(0.06, 0.23, 0.17),
      paleGreen: rgb(0.87, 0.94, 0.91),
      softGreen: rgb(0.95, 0.98, 0.96),
      border: rgb(0.57, 0.65, 0.61),
      ink: rgb(0.08, 0.15, 0.12),
      muted: rgb(0.35, 0.43, 0.39),
      white: rgb(1, 1, 1)
    };
    const margin = 18;
    const contentWidth = page.getWidth() - margin * 2;
    let top = page.getHeight() - margin;
    const program = getProgramDefinition(order);
    const latest = latestDispatch(order);
    const emittedBy = currentProfile?.full_name || currentProfile?.nombre_completo || supabaseSession?.user?.email || "Supervisor encargado";
    const blocks = order.blocks?.join(", ") || "-";
    const method = String(order.classification || "").toUpperCase();

    page.drawLine({ start: { x: margin, y: top - 40 }, end: { x: margin + contentWidth, y: top - 40 }, thickness: 3, color: colors.green });
    page.drawText("AGRICOLA EL CANELILLO", { x: margin + 5, y: top - 18, size: 10, font: boldFont, color: colors.green });
    page.drawText("Gestion agricola en linea", { x: margin + 5, y: top - 29, size: 6.5, font, color: colors.muted });
    const title = "Orden de aplicacion de Fitosanitarios y Fertilizantes";
    const titleWidth = boldFont.widthOfTextAtSize(title, 14);
    page.drawText(title, { x: margin + (contentWidth - titleWidth) / 2, y: top - 17, size: 14, font: boldFont, color: colors.darkGreen });
    const subtitle = pdfSafeText(program?.name || "Programa Fitosanitario");
    const subtitleWidth = boldFont.widthOfTextAtSize(subtitle, 7);
    page.drawText(subtitle, { x: margin + (contentWidth - subtitleWidth) / 2, y: top - 29, size: 7, font: boldFont, color: colors.green });
    const orderBoxWidth = 94;
    page.drawRectangle({ x: margin + contentWidth - orderBoxWidth, y: top - 39, width: orderBoxWidth, height: 37, color: colors.paleGreen, borderColor: colors.green, borderWidth: 1.3 });
    page.drawText("ORDEN N°", { x: margin + contentWidth - orderBoxWidth + 8, y: top - 13, size: 6.5, font: boldFont, color: colors.muted });
    const orderNumber = pdfSafeText(order.number);
    const orderNumberWidth = boldFont.widthOfTextAtSize(orderNumber, 19);
    page.drawText(orderNumber, { x: margin + contentWidth - 8 - orderNumberWidth, y: top - 29, size: 19, font: boldFont, color: colors.darkGreen });
    top -= 46;

    const fieldWidths = [70, 125, 100, 90, 150, 65, 85, 120];
    const fieldValues = [
      ["Fecha", printDate(orderStartDate(order))], ["Para", emittedBy], ["Potrero / Cuartel", potreroListLabel(order.potrero)], ["Bloque(s)", blocks],
      ["Especie / Variedad", [order.crop, order.variety].filter(Boolean).join(" / ") || "-"], ["Hectareas", `${number(order.hectares)} ha`],
      ["Total litros", `${number(plannedLiters(order), 0)} L`], ["Programa N°", program?.code || programNumbersLabel(order)]
    ];
    let fx = margin;
    fieldValues.forEach(([label, value], index) => {
      const width = fieldWidths[index];
      page.drawRectangle({ x: fx, y: top - 36, width, height: 36, color: colors.white, borderColor: colors.border, borderWidth: 0.55 });
      page.drawText(pdfSafeText(label).toUpperCase(), { x: fx + 4, y: top - 10, size: 5.5, font: boldFont, color: colors.muted });
      const lines = pdfTextLines(boldFont, value, 7, width - 8, 2);
      lines.forEach((line, lineIndex) => page.drawText(line, { x: fx + 4, y: top - 23 - lineIndex * 8, size: 7, font: boldFont, color: colors.ink }));
      fx += width;
    });
    top -= 42;

    const recipeRows = (order.recipe || []).map((line) => {
      const product = getProduct(line.productId) || {};
      const dose = Number(line.dose ?? line.dose100) || 0;
      const doseUnit = line.doseUnit || (line.doseBasis === "per_ha" ? `${product.unit || "kg/L"}/ha` : `${product.unit || "kg/L"}/100 L`);
      return [
        { text: product.name || "Producto", bold: true }, `${number(dose)} ${doseUnit}`, `${number(productHaFromDose(order, line))} ${line.outputUnit || product.unit || "kg/L"}/ha`,
        String(Number(product.reentryHours) || "-"), String(Number(product.carencyDays) || "NC"), Number(product.carencyDays) ? orderViableHarvestDate(order) : "NC",
        `${number(order.waterHa, 0)} L/ha`, order.objective || program?.objective || "-", `${number(plannedProduct(order, line))} ${product.unit || line.outputUnit || "kg/L"}`
      ];
    });
    const recipeCount = Math.max(6, recipeRows.length);
    while (recipeRows.length < recipeCount) recipeRows.push(Array(9).fill(""));
    const productRowHeight = recipeCount > 8 ? Math.max(9, Math.min(13, 112 / recipeCount)) : 15;
    top = pdfDrawTable(page, top, [100, 72, 72, 48, 48, 58, 70, 265, 72], ["Producto", "Dosis oficial", "Producto / ha", "Reingreso hrs", "Carencia etiqueta", "Fecha viable", "Mojamiento / ha", "Objetivo", "Total producto"], recipeRows, {
      x: margin, headerHeight: 24, rowHeight: productRowHeight, headerSize: 6.1, rowSize: recipeCount > 8 ? 5.7 : 6.3,
      font, boldFont, headerFill: colors.paleGreen, bodyFill: colors.white, border: colors.border
    });
    top -= 5;

    const signatureHeight = 40;
    const signatureWidths = [165, 475, 165];
    let sx = margin;
    signatureWidths.forEach((width, index) => {
      page.drawRectangle({ x: sx, y: top - signatureHeight, width, height: signatureHeight, color: index === 1 ? colors.softGreen : colors.white, borderColor: colors.border, borderWidth: 0.55 });
      sx += width;
    });
    page.drawText("EMITE", { x: margin + 7, y: top - 10, size: 5.8, font: boldFont, color: colors.muted });
    page.drawText(pdfSafeText(emittedBy), { x: margin + 7, y: top - 21, size: 6.5, font: boldFont, color: colors.ink });
    page.drawLine({ start: { x: margin + 30, y: top - 32 }, end: { x: margin + 135, y: top - 32 }, thickness: 0.6, color: colors.muted });
    const safetyTitle = "OBSERVACIONES OBLIGATORIAS";
    page.drawText(safetyTitle, { x: margin + 165 + (475 - boldFont.widthOfTextAtSize(safetyTitle, 7)) / 2, y: top - 12, size: 7, font: boldFont, color: colors.green });
    page.drawText("Leer la etiqueta de cada producto. Usar el Equipo de Proteccion Personal indicado.", { x: margin + 207, y: top - 24, size: 6.3, font, color: colors.ink });
    if (order.notes) {
      const noteLines = pdfTextLines(boldFont, order.notes, 5.8, 445, 1);
      page.drawText(noteLines[0], { x: margin + 180, y: top - 34, size: 5.8, font: boldFont, color: rgb(0.5, 0.3, 0) });
    }
    page.drawText("TOMO CONOCIMIENTO", { x: margin + 650, y: top - 10, size: 5.8, font: boldFont, color: colors.muted });
    page.drawLine({ start: { x: margin + 670, y: top - 32 }, end: { x: margin + 785, y: top - 32 }, thickness: 0.6, color: colors.muted });
    top -= signatureHeight + 5;

    const equipmentHeight = 60;
    pdfDrawCheckList(page, margin, top, 105, equipmentHeight, "Maquinaria", [
      { label: "Tractor", checked: Boolean(order.tractorCode || latest.tractorCode) }, { label: "Pulverizadora", checked: method === "P" },
      { label: "Nebulizadora", checked: method === "N" }, { label: "Maquina espalda", checked: method === "ME" }, { label: "Aereo", checked: method === "VD" }
    ], font, boldFont, colors);
    pdfDrawCheckList(page, margin + 105, top, 110, equipmentHeight, "Metodo", [
      { label: "Pulverizacion", checked: method === "P" }, { label: "Via riego", checked: method === "VR" }, { label: "Nebulizacion", checked: method === "N" },
      { label: "Manual", checked: method === "M" }, { label: "Grench", checked: method === "G" }
    ], font, boldFont, colors);
    pdfDrawCheckList(page, margin + 215, top, 155, equipmentHeight, "Equipo de Proteccion Personal", [
      { label: "Traje", checked: true }, { label: "Botas", checked: true }, { label: "Guantes", checked: true }, { label: "Respirador", checked: true }, { label: "Antiparras", checked: true }
    ], font, boldFont, colors);
    const paramsX = margin + 370;
    page.drawRectangle({ x: paramsX, y: top - equipmentHeight, width: 435, height: equipmentHeight, color: colors.white, borderColor: colors.border, borderWidth: 0.55 });
    page.drawText("PARAMETROS DE APLICACION", { x: paramsX + 7, y: top - 11, size: 6.5, font: boldFont, color: colors.green });
    const params = [
      ["Tractor", order.tractorCode || latest.tractorCode || "-"], ["Maquina", order.machineCode || latest.machineCode || "-"], ["Boquilla", order.nozzle || "-"],
      ["Presion", `${order.pressure || "-"} bar`], ["Velocidad", `${order.speed || "-"} km/h`], ["Dosificador", order.dosifier || "-"]
    ];
    params.forEach(([label, value], index) => {
      const col = index % 3;
      const row = Math.floor(index / 3);
      const px = paramsX + 7 + col * 141;
      const py = top - 27 - row * 20;
      page.drawText(pdfSafeText(label).toUpperCase(), { x: px, y: py + 7, size: 5, font: boldFont, color: colors.muted });
      page.drawText(pdfTextLines(boldFont, value, 6.3, 130, 1)[0], { x: px, y: py - 1, size: 6.3, font: boldFont, color: colors.ink });
    });
    top -= equipmentHeight + 5;

    const operationCount = Math.max(5, (order.dispatches || []).length, (order.tanks || []).length);
    const operationRows = Array.from({ length: operationCount }, (_, index) => {
      const dispatch = order.dispatches?.[index];
      const tank = order.tanks?.[index];
      const appliedDate = tank?.appliedAt ? String(tank.appliedAt).slice(0, 10) : "";
      return [dispatch ? String(index + 1) : "", dispatch ? printDate(dispatch.date) : "", dispatch ? dispatchDisplayTime(dispatch) : "", dispatch ? `${potreroListLabel(order.potrero)} / ${blocks}` : "", dispatch ? `${dispatch.type === "devolucion" ? "-" : ""}${number(dispatch.liters || 0, 0)}` : "",
        appliedDate ? printDate(appliedDate) : "", tank?.appliedAt ? extractTimeValue(tank.appliedAt) : "", tank ? `${potreroListLabel(order.potrero)} / ${blocks}` : "", tank ? number(tank.liters || 0, 0) : "", dispatch?.operatorId ? getOperator(dispatch.operatorId) : "", [tank?.tractorCode || dispatch?.tractorCode, tank?.machineCode || dispatch?.machineCode].filter(Boolean).join(" / ")];
    });
    const operationRowHeight = operationCount > 6 ? Math.max(8, Math.min(11, 65 / operationCount)) : 12;
    top = pdfDrawTable(page, top, [28, 55, 42, 130, 55, 55, 48, 130, 55, 110, 97], ["Folio", "Fecha bodega", "Hora", "Potrero / Bloque", "Litros entregados", "Fecha terreno", "Hora termino", "Potrero / Bloque", "Litros aplicados", "Aplicador", "Maquinas"], operationRows, {
      x: margin, headerHeight: 24, rowHeight: operationRowHeight, headerSize: 5.5, rowSize: operationCount > 6 ? 5.2 : 5.8,
      font, boldFont, headerFill: colors.paleGreen, bodyFill: colors.white, border: colors.border
    });
    top -= 5;
    page.drawLine({ start: { x: margin, y: top }, end: { x: margin + contentWidth, y: top }, thickness: 2, color: colors.green });
    page.drawText("FECHA VIABLE DE COSECHA:", { x: margin + 5, y: top - 12, size: 6.3, font: boldFont, color: colors.muted });
    page.drawText(pdfSafeText(orderViableHarvestDate(order)), { x: margin + 150, y: top - 12, size: 7, font: boldFont, color: colors.ink });
    const footer = "Orden generada desde Canelillo AgroCore";
    page.drawText(footer, { x: margin + contentWidth - font.widthOfTextAtSize(footer, 5.5) - 5, y: top - 12, size: 5.5, font, color: colors.muted });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Orden-${order.number}-${orderStartDate(order) || "sin-fecha"}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    showToast(`PDF de la orden ${order.number} descargado`);
  } catch (error) {
    console.error("No se pudo generar el PDF de la orden", error);
    showToast(`No se pudo generar el PDF: ${error.message}`);
  }
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

async function openFertilizerPreparationDialog() {
  if (!supabaseSession?.access_token) {
    showToast("Inicia sesion para preparar fertilizante");
    return;
  }
  if (!fertilizerRows) await loadFertilizerRows();
  const casetas = fertilizerCasetaOptions();
  const initialCaseta = casetas[0] || "";
  const dialog = document.getElementById("purchaseDialog");
  dialog.innerHTML = `
    <form method="dialog" class="modal-body fertilizer-operation-form fertilizer-preparation-form" id="fertilizerPreparationForm">
      <div class="modal-head">
        <div>
          <h2>Preparar fertilizante</h2>
          <p>Registra agua preparada y producto usado por estanque.</p>
        </div>
        <button class="icon-button" type="button" data-action="close-dialog" title="Cerrar">x</button>
      </div>
      <div class="form-grid">
        <label>Fecha y hora<input name="date" type="datetime-local" value="${currentDateTimeLocalValue()}" required></label>
        <label>Caseta<select name="caseta" required>
          <option value="">Seleccionar caseta</option>
          ${casetas.map((caseta) => `<option value="${htmlAttr(caseta)}" ${caseta === initialCaseta ? "selected" : ""}>${escapeHtml(caseta)}</option>`).join("")}
        </select></label>
        <label class="full">Estanque<select name="tankId" required>
          ${renderFertilizerTankOptions(initialCaseta)}
        </select></label>
        <label class="full">Producto<select name="productId" required>
          <option value="">Seleccionar</option>
          ${(fertilizerProducts || []).map((product) => `<option value="${htmlAttr(product.id)}">${escapeHtml(product.name)} (${escapeHtml(product.unit)})</option>`).join("")}
        </select></label>
        <label>Litros de agua<input name="waterLiters" type="number" min="0.001" step="0.001" required></label>
        <label>Cantidad producto<input name="productQuantity" type="number" min="0.001" step="0.001" required></label>
        <label>Unidad<input name="unit" readonly placeholder="Segun producto"></label>
        <label class="full">Observacion<input name="note" placeholder="Preparacion, folio, responsable o detalle"></label>
      </div>
      <div class="calc-preview" id="fertilizerPreparationPreview"></div>
      <div class="modal-actions">
        <button class="secondary-button" type="button" data-action="close-dialog">Cancelar</button>
        <button class="primary-button" type="button" id="saveFertilizerPreparation">Guardar preparacion</button>
      </div>
    </form>
  `;
  dialog.showModal();
  const form = document.getElementById("fertilizerPreparationForm");
  const update = () => {
    const tank = fertilizerTankById(form.tankId.value);
    const product = fertilizerProductById(form.productId.value);
    const water = Number(form.waterLiters.value) || 0;
    const productQuantity = Number(form.productQuantity.value) || 0;
    const dissolution = water > 0 ? productQuantity / water : 0;
    const available = tank && product ? fertilizerAvailableProductAmount(tank.caseta, product.id) : 0;
    form.unit.value = product?.unit || "";
    document.getElementById("fertilizerPreparationPreview").innerHTML = `
      <span>Disponible bodega: <strong>${number(available)} ${escapeHtml(product?.unit || "")}</strong></span>
      <span>Disolucion: <strong>${number(dissolution, 4)}</strong></span>
      <span>Quedaria: <strong>${number(available - productQuantity)} ${escapeHtml(product?.unit || "")}</strong></span>
    `;
  };
  form.caseta.addEventListener("change", () => {
    form.tankId.innerHTML = renderFertilizerTankOptions(form.caseta.value);
    update();
  });
  form.addEventListener("input", update);
  form.addEventListener("change", update);
  update();
  document.getElementById("saveFertilizerPreparation").addEventListener("click", saveFertilizerPreparation);
}

async function saveFertilizerPreparation() {
  const form = document.getElementById("fertilizerPreparationForm");
  if (!form?.reportValidity()) return;
  const data = Object.fromEntries(new FormData(form));
  const tank = fertilizerTankById(data.tankId);
  const product = fertilizerProductById(data.productId);
  const water = Number(data.waterLiters) || 0;
  const productQuantity = Number(data.productQuantity) || 0;
  if (!tank || !product || water <= 0 || productQuantity <= 0) {
    showToast("Completa estanque, producto y cantidades positivas");
    return;
  }
  const available = fertilizerAvailableProductAmount(tank.caseta, product.id);
  if (available && productQuantity > available && !confirm(`La preparacion supera el disponible de bodega (${number(available)} ${product.unit}). Guardar de todas formas?`)) return;
  const user = fertilizerCurrentUserPayload();
  const payload = {
    estanque_id: tank.id,
    fecha: data.date || new Date().toISOString(),
    producto_id: product.id,
    producto: product.name,
    producto_unidad: product.unit,
    producto_cantidad: productQuantity,
    cantidad_litros: water,
    responsable_id: user.id,
    responsable_nombre: user.name,
    observacion: String(data.note || "").trim() || null,
    creado_por: user.id,
    creado_por_nombre: user.name
  };
  try {
    await sbFetch("/rest/v1/fertilizante_preparaciones", {
      method: "POST",
      prefer: "return=minimal",
      body: JSON.stringify(payload)
    });
    resetFertilizerLoadedState();
    document.getElementById("purchaseDialog")?.close();
    await loadFertilizerRows();
    if (currentView === "fertilizers") renderFertilizers();
    showToast("Preparacion registrada");
  } catch (error) {
    showToast(`No se guardo la preparacion: ${error.message}`);
  }
}

async function openFertilizerApplicationDialog() {
  if (!supabaseSession?.access_token) {
    showToast("Inicia sesion para aplicar fertilizante");
    return;
  }
  if (!fertilizerRows) await loadFertilizerRows();
  const casetas = fertilizerCasetaOptions();
  const initialCaseta = casetas[0] || "";
  const dialog = document.getElementById("purchaseDialog");
  dialog.classList.add("fertilizer-application-modal");
  dialog.addEventListener("close", () => dialog.classList.remove("fertilizer-application-modal"), { once: true });
  dialog.innerHTML = `
    <form method="dialog" class="modal-body fertilizer-operation-form fertilizer-application-form" id="fertilizerApplicationForm">
      <div class="modal-head">
        <div>
          <h2>Aplicar fertilizante</h2>
          <p>Registra litros aplicados desde un estanque hacia uno o varios bloques.</p>
        </div>
        <button class="icon-button" type="button" data-action="close-dialog" title="Cerrar">x</button>
      </div>
      <div class="form-grid">
        <label>Fecha y hora<input name="date" type="datetime-local" value="${currentDateTimeLocalValue()}" required></label>
        <label>Caseta<select name="caseta" required>
          <option value="">Seleccionar caseta</option>
          ${casetas.map((caseta) => `<option value="${htmlAttr(caseta)}" ${caseta === initialCaseta ? "selected" : ""}>${escapeHtml(caseta)}</option>`).join("")}
        </select></label>
        <label class="full">Estanque<select name="tankId" required>
          ${renderFertilizerTankOptions(initialCaseta)}
        </select></label>
        <label>Potrero<select name="potrero" required>
          ${renderFertilizerPotreroOptions()}
        </select></label>
        <label>Litros para seleccionados<input name="bulkLiters" type="number" min="0.001" step="0.001" placeholder="Opcional"></label>
        <button class="secondary-button fertilizer-apply-liters-button" type="button" data-action="fertilizer-apply-liters-to-selected">Aplicar litros a seleccionados</button>
        <div class="fertilizer-block-picker full">
          <div class="fertilizer-block-picker-head">
            <div>
              <strong>Bloques y litros aplicados</strong>
              <span>Define el volumen individual de cada bloque seleccionado.</span>
            </div>
            <div>
              <button class="mini-button" type="button" data-action="fertilizer-select-all-blocks">Seleccionar todos</button>
              <button class="mini-button" type="button" data-action="fertilizer-clear-blocks">Limpiar</button>
            </div>
          </div>
          <div class="fertilizer-block-checklist" id="fertilizerApplicationBlocks">
            ${renderFertilizerBlockChecklist("")}
          </div>
        </div>
        <label class="full">Observacion<input name="note" placeholder="Turno, operador, sector o detalle"></label>
      </div>
      <div class="calc-preview" id="fertilizerApplicationPreview"></div>
      <div class="modal-actions">
        <button class="secondary-button" type="button" data-action="close-dialog">Cancelar</button>
        <button class="primary-button" type="button" id="saveFertilizerApplication">Guardar aplicacion</button>
      </div>
    </form>
  `;
  dialog.showModal();
  const form = document.getElementById("fertilizerApplicationForm");
  const blocksContainer = document.getElementById("fertilizerApplicationBlocks");
  const selectedFieldIds = () => [...form.querySelectorAll('input[name="fieldIds"]:checked')].map((input) => input.value);
  const fieldLitersInput = (id) => [...form.querySelectorAll("[data-field-liters]")].find((input) => input.dataset.fieldLiters === id) || null;
  const blockLitersById = () => new Map([...form.querySelectorAll("[data-field-liters]")]
    .map((input) => [input.dataset.fieldLiters, input.value])
    .filter(([id]) => id));
  const selectedFieldEntries = () => selectedFieldIds()
    .map((id) => ({
      field: fertilizerFields.find((item) => item.id === id),
      liters: Number(fieldLitersInput(id)?.value) || 0
    }))
    .filter((entry) => entry.field);
  const syncBlockLiters = () => {
    form.querySelectorAll('input[name="fieldIds"]').forEach((checkbox) => {
      const input = fieldLitersInput(checkbox.value);
      if (!input) return;
      input.disabled = !checkbox.checked;
      input.required = checkbox.checked;
      if (!checkbox.checked) input.classList.remove("is-invalid");
    });
  };
  const renderBlocks = (selected = selectedFieldIds(), litersByField = blockLitersById()) => {
    blocksContainer.innerHTML = renderFertilizerBlockChecklist(form.potrero.value, selected, litersByField);
    syncBlockLiters();
  };
  const syncPotreroOptions = (selectedPotrero = form.potrero.value) => {
    const tank = fertilizerTankById(form.tankId.value);
    form.potrero.innerHTML = renderFertilizerPotreroOptions(tank, selectedPotrero);
    if (selectedPotrero && form.potrero.value !== selectedPotrero) form.potrero.value = "";
  };
  const update = () => {
    const currentTankId = form.tankId.value;
    form.tankId.innerHTML = renderFertilizerTankOptions(form.caseta.value, currentTankId);
    if (currentTankId && !form.tankId.value) form.tankId.value = "";
    const tank = fertilizerTankById(form.tankId.value);
    syncBlockLiters();
    const entries = selectedFieldEntries();
    const hectares = entries.reduce((sum, entry) => sum + (Number(entry.field.hectares) || 0), 0);
    const totalLiters = entries.reduce((sum, entry) => sum + Math.max(0, Number(entry.liters) || 0), 0);
    const missingLiters = entries.filter((entry) => entry.liters <= 0).length;
    document.getElementById("fertilizerApplicationPreview").innerHTML = `
      <span>Disponible estanque: <strong>${number(tank?.litrosActuales || 0, 0)} L</strong></span>
      <span>Bloques seleccionados: <strong>${number(entries.length, 0)}</strong></span>
      <span>Sin litros: <strong>${number(missingLiters, 0)}</strong></span>
      <span>Total aplicacion: <strong>${number(totalLiters, 0)} L</strong></span>
      <span>Hectareas: <strong>${number(hectares)} ha</strong></span>
    `;
  };
  form.caseta.addEventListener("change", () => {
    form.tankId.innerHTML = renderFertilizerTankOptions(form.caseta.value);
    syncPotreroOptions("");
    renderBlocks([]);
    update();
  });
  form.tankId.addEventListener("change", () => {
    syncPotreroOptions("");
    renderBlocks([]);
    update();
  });
  form.potrero.addEventListener("change", () => {
    renderBlocks([]);
    update();
  });
  blocksContainer.addEventListener("change", update);
  form.addEventListener("input", update);
  form.addEventListener("change", (event) => {
    if (event.target.name !== "caseta" && event.target.name !== "potrero") update();
  });
  form.querySelector('[data-action="fertilizer-select-all-blocks"]')?.addEventListener("click", () => {
    form.querySelectorAll('input[name="fieldIds"]').forEach((input) => { input.checked = true; });
    update();
  });
  form.querySelector('[data-action="fertilizer-clear-blocks"]')?.addEventListener("click", () => {
    form.querySelectorAll('input[name="fieldIds"]').forEach((input) => { input.checked = false; });
    update();
  });
  form.querySelector('[data-action="fertilizer-apply-liters-to-selected"]')?.addEventListener("click", () => {
    const liters = Number(form.bulkLiters.value) || 0;
    if (liters <= 0) {
      showToast("Ingresa litros para aplicar a los bloques seleccionados");
      return;
    }
    const selected = selectedFieldIds();
    if (!selected.length) {
      showToast("Selecciona al menos un bloque");
      return;
    }
    selected.forEach((id) => {
      const input = fieldLitersInput(id);
      if (input) input.value = String(liters);
    });
    update();
  });
  update();
  document.getElementById("saveFertilizerApplication").addEventListener("click", saveFertilizerApplication);
}

async function saveFertilizerApplication() {
  const form = document.getElementById("fertilizerApplicationForm");
  if (!form?.reportValidity()) return;
  const data = Object.fromEntries(new FormData(form));
  const tank = fertilizerTankById(data.tankId);
  const selectedFieldIds = [...form.querySelectorAll('input[name="fieldIds"]:checked')].map((input) => input.value);
  const applications = selectedFieldIds
    .map((id) => {
      const field = fertilizerFields.find((item) => item.id === id);
      const litersInput = [...form.querySelectorAll("[data-field-liters]")].find((input) => input.dataset.fieldLiters === id);
      return { field, liters: Number(litersInput?.value) || 0, input: litersInput };
    })
    .filter((entry) => entry.field);
  const invalid = applications.filter((entry) => entry.liters <= 0);
  form.querySelectorAll("[data-field-liters]").forEach((input) => input.classList.remove("is-invalid"));
  invalid.forEach((entry) => entry.input?.classList.add("is-invalid"));
  if (!tank || !applications.length || invalid.length) {
    showToast("Completa caseta, estanque, bloques y litros positivos");
    return;
  }
  const totalLiters = applications.reduce((sum, entry) => sum + entry.liters, 0);
  if (totalLiters > Number(tank.litrosActuales || 0) && !confirm(`La aplicacion total supera los litros disponibles del estanque (${number(tank.litrosActuales, 0)} L). Se registraran ${number(totalLiters, 0)} L en ${applications.length} bloques. Guardar de todas formas?`)) return;
  const user = fertilizerCurrentUserPayload();
  const payload = applications.map(({ field, liters }) => ({
    estanque_id: tank.id,
    campo_id: field.id,
    fecha: data.date || new Date().toISOString(),
    potrero: field.potrero,
    bloque: field.block,
    cantidad_litros: liters,
    responsable_id: user.id,
    responsable_nombre: user.name,
    observacion: String(data.note || "").trim() || null,
    creado_por: user.id,
    creado_por_nombre: user.name
  }));
  try {
    await sbFetch("/rest/v1/fertilizante_aplicaciones", {
      method: "POST",
      prefer: "return=minimal",
      body: JSON.stringify(payload)
    });
    resetFertilizerLoadedState();
    document.getElementById("purchaseDialog")?.close();
    await loadFertilizerRows();
    if (currentView === "fertilizers") renderFertilizers();
    showToast(`Aplicacion registrada en ${applications.length} bloque${applications.length === 1 ? "" : "s"}`);
  } catch (error) {
    showToast(`No se guardo la aplicacion: ${error.message}`);
  }
}

function openFertilizerLotDialog() {
  if (!supabaseSession?.access_token) {
    showToast("Inicia sesion para ingresar lotes de fertilizante");
    return;
  }
  if (fertilizerStockError) {
    showToast(fertilizerStockError);
  }
  const dialog = document.getElementById("purchaseDialog");
  const products = fertilizerProducts.length ? fertilizerProducts : [];
  const casetas = fertilizerCasetas.length ? fertilizerCasetas : [];
  const nextLot = nextFertilizerLotNumber();
  dialog.innerHTML = `
    <form method="dialog" class="modal-body fertilizer-lot-form" id="fertilizerLotForm">
      <div class="modal-head">
        <div>
          <h2>Ingresar lote de fertilizante</h2>
          <p>Kilos o litros totales disponibles por caseta y folio.</p>
        </div>
        <button class="icon-button" type="button" data-action="close-dialog" title="Cerrar">x</button>
      </div>
      <div class="form-grid">
        <label>Fecha<input name="date" type="date" value="${new Date().toISOString().slice(0, 10)}" required></label>
        <label>Caseta<select name="casetaId" required>
          <option value="">Seleccionar</option>
          ${casetas.map((caseta) => `<option value="${htmlAttr(caseta.id)}">${escapeHtml(caseta.name)}</option>`).join("")}
        </select></label>
        <label class="full">Producto<select name="productId" required>
          <option value="">Seleccionar</option>
          ${products.map((product) => `<option value="${htmlAttr(product.id)}" data-unit="${htmlAttr(product.unit)}">${escapeHtml(product.name)} (${escapeHtml(product.unit)})</option>`).join("")}
        </select></label>
        <label>Folio<input name="folio" placeholder="Folio o guia" required></label>
        <label>Lote correlativo<input name="lot" value="${nextLot}" readonly></label>
        <label>Cantidad total<input name="quantity" type="number" step="0.001" min="0.001" required></label>
        <label>Unidad<input name="unit" value="" readonly placeholder="Segun producto"></label>
      </div>
      <div class="calc-preview" id="fertilizerLotPreview"></div>
      <div class="modal-actions">
        <button class="secondary-button" type="button" data-action="close-dialog">Cancelar</button>
        <button class="primary-button" type="button" id="saveFertilizerLot" ${fertilizerLotSaving ? "disabled" : ""}>Guardar lote</button>
      </div>
    </form>
  `;
  dialog.showModal();
  const form = document.getElementById("fertilizerLotForm");
  const update = () => {
    const product = products.find((item) => item.id === form.productId.value);
    const caseta = casetas.find((item) => item.id === form.casetaId.value);
    const quantity = Number(form.quantity.value) || 0;
    form.unit.value = product?.unit || "";
    const current = fertilizerStockRows.find((row) => row.productId === product?.id && row.casetaId === caseta?.id);
    const currentAvailable = Number(current?.available) || 0;
    document.getElementById("fertilizerLotPreview").innerHTML = `
      <span>Actual disponible: <strong>${number(currentAvailable)} ${escapeHtml(product?.unit || "")}</strong></span>
      <span>Ingreso nuevo: <strong>${number(quantity)} ${escapeHtml(product?.unit || "")}</strong></span>
      <span>Disponible estimado: <strong>${number(currentAvailable + quantity)} ${escapeHtml(product?.unit || "")}</strong></span>
    `;
  };
  form.addEventListener("input", update);
  form.addEventListener("change", update);
  update();
  document.getElementById("saveFertilizerLot").addEventListener("click", saveFertilizerLot);
}

async function saveFertilizerLot() {
  const form = document.getElementById("fertilizerLotForm");
  if (!form?.reportValidity()) return;
  const data = Object.fromEntries(new FormData(form));
  const product = fertilizerProducts.find((item) => item.id === data.productId);
  const caseta = fertilizerCasetas.find((item) => item.id === data.casetaId);
  const quantity = Number(data.quantity) || 0;
  if (!product || !caseta || quantity <= 0) {
    showToast("Completa caseta, producto y cantidad positiva");
    return;
  }
  fertilizerLotSaving = true;
  const payload = {
    caseta_id: caseta.id,
    producto_id: product.id,
    fecha: data.date || new Date().toISOString().slice(0, 10),
    folio: String(data.folio || "").trim(),
    lote: String(data.lot || "").trim() || null,
    unidad: product.unit,
    cantidad_total: quantity,
    creado_por: currentProfile?.id || supabaseSession?.user?.id || null,
    creado_por_nombre: currentProfile?.full_name || currentProfile?.nombre_completo || supabaseSession?.user?.email || null
  };
  try {
    await sbFetch("/rest/v1/fertilizante_lotes", {
      method: "POST",
      prefer: "return=minimal",
      body: JSON.stringify(payload)
    });
    fertilizerRows = null;
    fertilizerStockRows = [];
    fertilizerStockLots = [];
    fertilizerStockError = "";
    document.getElementById("purchaseDialog")?.close();
    await loadFertilizerRows();
    if (currentView === "fertilizers") renderFertilizers();
    showToast("Lote de fertilizante ingresado");
  } catch (error) {
    showToast(`No se guardo el lote: ${error.message}`);
  } finally {
    fertilizerLotSaving = false;
  }
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
      await reloadCurrentCloudModules();
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
      await reloadCurrentCloudModules();
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
      await reloadCurrentCloudModules();
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
    await reloadCurrentCloudModules();
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
  if (!event.target.closest?.(".user-menu")) setUserMenuOpen(false);
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
  if (action === "open-account-info") {
    openAuthDialog();
  }
  if (action === "save-account-profile") {
    await saveAccountProfile();
  }
  if (action === "save-account-password") {
    await saveAccountPassword();
  }
  if (action === "open-weather-station-import") {
    openWeatherStationImportDialog();
  }
  if (action === "choose-weather-station-excel") {
    document.getElementById("weatherStationExcelInput")?.click();
  }
  if (action === "export-weather-station") {
    exportWeatherStationWorkbook();
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
  if (action === "clear-harvest-export-filters") {
    harvestExportSelectedYears = new Set();
    harvestExportSpeciesFilter = "Todas";
    harvestExportVarietyFilter = "Todas";
    harvestExportPotreroFilter = "Todos";
    harvestExportCalibreMode = "kg";
    renderHarvestExport();
  }
  if (action === "clear-harvest-analysis-filters") {
    harvestAnalysisSpeciesFilter = "Todas";
    harvestAnalysisVarietyFilter = "Todas";
    harvestAnalysisPotreroFilter = "Todos";
    harvestAnalysisSelectedSpecies = "Todas";
    harvestAnalysisSelectedYears = new Set(harvestAnalysisYears());
    harvestAnalysisMetric = "kg";
    renderHarvestAnalysis();
  }
  if (action === "open-harvest-excel-sync") {
    openHarvestExcelSyncDialog(actionTarget.dataset.syncModule || "harvest");
  }
  if (action === "choose-harvest-excel-sync") {
    document.getElementById("harvestExcelSyncFile")?.click();
  }
  if (action === "accept-all-harvest-excel-sync") {
    if (!harvestExcelSyncState) return;
    harvestExcelSyncState.accepted = new Set((harvestExcelSyncState.changes || []).map((change) => change.id));
    renderHarvestExcelSyncPreview();
  }
  if (action === "clear-harvest-excel-sync-selection") {
    if (!harvestExcelSyncState) return;
    harvestExcelSyncState.accepted = new Set();
    renderHarvestExcelSyncPreview();
  }
  if (action === "save-harvest-excel-sync") {
    await saveHarvestExcelSyncAccepted();
  }
  if (action === "select-harvest-analysis-species") {
    harvestAnalysisSelectedSpecies = actionTarget.dataset.value || "Todas";
    renderHarvestAnalysis();
  }
  if (action === "toggle-harvest-analysis-section") {
    const section = actionTarget.dataset.section || "";
    if (harvestAnalysisOpenSections.has(section)) harvestAnalysisOpenSections.delete(section);
    else harvestAnalysisOpenSections.add(section);
    renderHarvestAnalysis();
  }
  if (action === "toggle-harvest-contractors") {
    const key = actionTarget.dataset.key || "";
    if (harvestContractorExpandedKeys.has(key)) harvestContractorExpandedKeys.delete(key);
    else harvestContractorExpandedKeys.add(key);
    renderHarvestAnalysis();
  }
  if (action === "select-gantt-order") {
    selectedGanttOrderId = id;
    renderManager();
  }
  if (action === "toggle-mobile-gantt") {
    managerGanttMobileOpen = !managerGanttMobileOpen;
    renderManager();
  }
  if (action === "toggle-manager-gantt-filters") {
    managerGanttFiltersOpen = !managerGanttFiltersOpen;
    const panel = views.manager.querySelector(".gantt-panel");
    const controls = views.manager.querySelector(".gantt-controls");
    panel?.classList.toggle("gantt-filters-open", managerGanttFiltersOpen);
    panel?.classList.toggle("gantt-filters-closed", !managerGanttFiltersOpen);
    if (controls) controls.hidden = !managerGanttFiltersOpen;
    actionTarget.setAttribute("aria-expanded", String(managerGanttFiltersOpen));
    actionTarget.setAttribute("aria-label", managerGanttFiltersOpen ? "Ocultar filtros" : "Mostrar filtros");
    actionTarget.setAttribute("title", managerGanttFiltersOpen ? "Ocultar filtros" : "Mostrar filtros");
    const icon = actionTarget.querySelector("span");
    if (icon) icon.textContent = managerGanttFiltersOpen ? ">" : "<";
  }
  if (action === "new-order") openOrderDialog();
  if (action === "new-order-from-program") openOrderDialog(null, actionTarget.dataset.programId || "");
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
    programFilters = { seasonId: "Todas", search: "", species: "Todas", number: "Todos", type: "Todos", status: "Todos" };
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
  if (action === "retry-fertilizers" || action === "reload-fertilizers") {
    fertilizerLoadError = "";
    fertilizerRows = null;
    fertilizerStockRows = [];
    fertilizerStockLots = [];
    fertilizerStockError = "";
    renderFertilizers();
  }
  if (action === "open-fertilizer-lot-dialog") {
    openFertilizerLotDialog();
  }
  if (action === "open-fertilizer-preparation-dialog") {
    await openFertilizerPreparationDialog();
  }
  if (action === "open-fertilizer-application-dialog") {
    await openFertilizerApplicationDialog();
  }
  if (action === "open-fertilizer-history-dialog") {
    openFertilizerHistoryDialog("applications");
  }
  if (action === "set-fertilizer-storage-view") {
    fertilizerStorageView = actionTarget.dataset.viewMode === "bodega" ? "bodega" : "estanques";
    renderFertilizers();
  }
  if (action === "export-fertilizer-report") {
    await exportFertilizerReportWorkbook();
  }
  if (action === "clear-pest-filters") {
    const dates = (pestMonitoringRecords || []).map((record) => record.date).filter(Boolean).sort();
    pestMonitoringDateFrom = dates[0] || "";
    pestMonitoringDateTo = dates.at(-1) || "";
    pestMonitoringPest = "Chanchito blanco";
    pestMonitoringSpecies = "Todas";
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
      .filter((block) => irrigationVarietyFilter === "Todas" || (block.variety || "Sin variedad") === irrigationVarietyFilter)
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
  if (action === "open-irrigation-base-hours-dialog") {
    setIrrigationFiltersOpen(false);
    openIrrigationBaseHoursDialog();
  }
  if (action === "save-irrigation-base-hours") {
    await saveIrrigationBaseHours();
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
  if (action === "fill-program-annual-reposition") {
    fillAnnualProgramReposition();
  }
  if (action === "apply-irrigation-program-annual") {
    await applyAutomaticIrrigationProgramAnnual();
  }
  if (action === "save-irrigation-bandeja") {
    await saveIrrigationBandejaRecord();
  }
  if (action === "delete-irrigation-bandeja") {
    await deleteIrrigationBandejaRecord();
  }
  if (action === "open-irrigation-bandeja-dialog") {
    openIrrigationBandejaDialog();
  }
  if (action === "save-irrigation-rain") {
    await saveIrrigationRainRecord();
  }
  if (action === "delete-irrigation-rain") {
    await deleteIrrigationRainRecord();
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
    event.preventDefault();
    const key = actionTarget.dataset.key;
    const scrollState = irrigationGanttScrollSnapshot();
    const anchorState = irrigationGanttAnchorSnapshot(actionTarget);
    const expanded = !expandedCalicataKeys.has(key);
    if (expanded) expandedCalicataKeys.add(key);
    else expandedCalicataKeys.delete(key);
    actionTarget.blur?.();
    renderIrrigation();
    restoreIrrigationGanttScroll(scrollState);
    restoreIrrigationGanttAnchor(anchorState);
    return;
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
  if (action === "select-satellite-index") {
    const index = actionTarget.dataset.index || "NDVI";
    irrigationSatelliteIndex = IRRIGATION_SATELLITE_INDEX_DEFINITIONS[index] ? index : "NDVI";
    renderIrrigation();
  }
  if (action === "clear-warehouse-filter") {
    warehouseStatusFilter = "in_progress";
    warehouseDateFromFilter = "";
    warehouseDateToFilter = "";
    renderWarehouse();
  }
  if (action === "export-excel") exportExcel();
  if (action === "print-order") await downloadApplicationOrderPdf(id);
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
          await reloadCurrentCloudModules();
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
  if (event.target?.id === "harvestExcelSyncFile") {
    await handleHarvestExcelSyncFile(event.target.files?.[0] || null);
    event.target.value = "";
    return;
  }
  if (event.target?.matches?.("[data-harvest-sync-accept]")) {
    if (!harvestExcelSyncState) return;
    const changeId = event.target.dataset.harvestSyncAccept;
    if (event.target.checked) harvestExcelSyncState.accepted.add(changeId);
    else harvestExcelSyncState.accepted.delete(changeId);
    renderHarvestExcelSyncPreview();
    return;
  }
  if (event.target?.id === "programAutoPotrero") {
    updateIrrigationProgramDialogBlocks();
    return;
  }
  if (event.target?.id === "programAutoStartDate") {
    updateIrrigationProgramDialogPreview();
    return;
  }
  if (event.target?.id === "programAnnualVariety") {
    updateAnnualProgramDialogBlocks();
    return;
  }
  if (event.target?.matches?.("[data-program-annual-month], [data-program-annual-block]")) {
    updateAnnualProgramDialogPreview();
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
      await reloadCurrentCloudModules();
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
  if (["programAnnualYear", "programAnnualHours", "programAnnualStartDay", "programAnnualSkipDays", "programAnnualBulkRepos"].includes(event.target?.id) || event.target?.matches?.("[data-program-annual-repos]")) {
    updateAnnualProgramDialogPreview();
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
document.getElementById("authButton").addEventListener("click", (event) => {
  event.stopPropagation();
  toggleUserMenu();
});
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
  enhanceAuthGate();
  hydrateCloudLoadedModulesFromCache();
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
      await ensureSupabaseSession(false);
      await loadCloudProfile();
      showAuthenticatedShell("Cargando inicio desde Supabase...");
      loadCloudDataInBackground({ toastOnSuccess: true });
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
