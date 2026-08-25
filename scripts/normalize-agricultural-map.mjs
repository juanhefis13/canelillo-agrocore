import fs from "node:fs/promises";
import path from "node:path";

const args = new Map();
for (let index = 2; index < process.argv.length; index += 2) {
  args.set(process.argv[index], process.argv[index + 1]);
}

const sourceDir = path.resolve(args.get("--source") || "");
const camposPath = path.resolve(args.get("--campos") || "");
const outputDir = path.resolve(args.get("--output") || "outputs");
const reportPath = path.resolve(args.get("--report") || path.join(outputDir, "mapa_normalizacion.json"));

if (!sourceDir || !camposPath) {
  throw new Error("Uso: node scripts/normalize-agricultural-map.mjs --source <carpeta> --campos <campos.json> --output <carpeta>");
}

const POTRERO_ALIASES = Object.freeze({
  "casa verde": "28",
  "cirrus": "CirrusAgro",
  "el parque 1": "El parque 1",
  "el peumo": "29",
  "los pinos": "10",
  "los pinos 80": "Los pinos Paltos",
  "los pinos 2004": "Los pinos Paltos",
  "parque 1": "El parque 1",
  "parque 2": "El parque 2",
  "parque 3": "El parque 3",
  "parque 4": "El parque 4",
  "p1": "1",
  "p19": "19",
  "p20": "20",
  "p20a": "20A",
  "p20b": "20B",
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

const BLOCK_OVERRIDES = Object.freeze({
  "5:1": "1A",
  "29:2A": "2",
  "29:2B": "3",
  "29:3": "4",
  "29:4": "5",
  "29:5A": "6",
  "29:5B": "7",
  "19:1": "4",
  "6:1": "3"
});

const SHARED_BLOCKS = Object.freeze({
  "5:1": ["1A", "1B"]
});

const BLOCK_POTRERO_FID_ALIASES = Object.freeze({
  125: "Unidad E"
});

function clean(value) {
  return String(value ?? "").trim();
}

function normalize(value) {
  return clean(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[_./-]+/g, " ")
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("es");
}

function identity(potrero, bloque = "") {
  return `${normalize(potrero)}:${normalize(bloque).toLocaleUpperCase("es")}`;
}

function numeric(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function unique(values) {
  return [...new Set(values.filter((value) => clean(value)))];
}

function sum(values) {
  return values.reduce((total, value) => total + (numeric(value) || 0), 0);
}

function readProperty(properties, candidates) {
  for (const key of candidates) {
    if (clean(properties?.[key])) return clean(properties[key]);
  }
  return "";
}

function utm19SouthToWgs84(easting, northing) {
  const a = 6378137;
  const eccentricitySquared = 0.00669438;
  const eccentricityPrimeSquared = eccentricitySquared / (1 - eccentricitySquared);
  const scale = 0.9996;
  const x = Number(easting) - 500000;
  const y = Number(northing) - 10000000;
  const meridionalArc = y / scale;
  const mu = meridionalArc / (a * (1 - eccentricitySquared / 4 - 3 * eccentricitySquared ** 2 / 64 - 5 * eccentricitySquared ** 3 / 256));
  const e1 = (1 - Math.sqrt(1 - eccentricitySquared)) / (1 + Math.sqrt(1 - eccentricitySquared));
  const phi1 = mu
    + (3 * e1 / 2 - 27 * e1 ** 3 / 32) * Math.sin(2 * mu)
    + (21 * e1 ** 2 / 16 - 55 * e1 ** 4 / 32) * Math.sin(4 * mu)
    + (151 * e1 ** 3 / 96) * Math.sin(6 * mu)
    + (1097 * e1 ** 4 / 512) * Math.sin(8 * mu);
  const sinPhi = Math.sin(phi1);
  const cosPhi = Math.cos(phi1);
  const tanPhi = Math.tan(phi1);
  const radiusPrime = a / Math.sqrt(1 - eccentricitySquared * sinPhi ** 2);
  const radiusMeridian = a * (1 - eccentricitySquared) / (1 - eccentricitySquared * sinPhi ** 2) ** 1.5;
  const tangentSquared = tanPhi ** 2;
  const curvature = eccentricityPrimeSquared * cosPhi ** 2;
  const d = x / (radiusPrime * scale);
  const latitude = phi1 - (radiusPrime * tanPhi / radiusMeridian) * (
    d ** 2 / 2
    - (5 + 3 * tangentSquared + 10 * curvature - 4 * curvature ** 2 - 9 * eccentricityPrimeSquared) * d ** 4 / 24
    + (61 + 90 * tangentSquared + 298 * curvature + 45 * tangentSquared ** 2 - 252 * eccentricityPrimeSquared - 3 * curvature ** 2) * d ** 6 / 720
  );
  const longitudeOrigin = -69 * Math.PI / 180;
  const longitude = longitudeOrigin + (
    d
    - (1 + 2 * tangentSquared + curvature) * d ** 3 / 6
    + (5 - 2 * curvature + 28 * tangentSquared - 3 * curvature ** 2 + 8 * eccentricityPrimeSquared + 24 * tangentSquared ** 2) * d ** 5 / 120
  ) / cosPhi;
  return [longitude * 180 / Math.PI, latitude * 180 / Math.PI];
}

function transformCoordinateTree(value, transform) {
  if (!Array.isArray(value)) return value;
  if (value.length >= 2 && Number.isFinite(Number(value[0])) && Number.isFinite(Number(value[1]))) {
    const [lng, lat] = transform(Number(value[0]), Number(value[1]));
    return [lng, lat, ...value.slice(2)];
  }
  return value.map((item) => transformCoordinateTree(item, transform));
}

function ensureWgs84(collection) {
  const sample = collection.features?.[0]?.geometry?.coordinates;
  let firstCoordinate = sample;
  while (Array.isArray(firstCoordinate) && Array.isArray(firstCoordinate[0])) firstCoordinate = firstCoordinate[0];
  const projected = Array.isArray(firstCoordinate) && (Math.abs(Number(firstCoordinate[0])) > 180 || Math.abs(Number(firstCoordinate[1])) > 90);
  if (!projected) return { collection, transformed: false, sourceCrs: "EPSG:4326" };
  return {
    transformed: true,
    sourceCrs: "EPSG:32719",
    collection: {
      ...collection,
      crs_original: "EPSG:32719",
      crs_normalizado: "EPSG:4326",
      features: collection.features.map((feature) => ({
        ...feature,
        geometry: {
          ...feature.geometry,
          coordinates: transformCoordinateTree(feature.geometry.coordinates, utm19SouthToWgs84)
        }
      }))
    }
  };
}

function resolvePotrero(rawAlias, rawName, officialByNormalized) {
  const inputs = unique([rawAlias, rawName]);
  for (const input of inputs) {
    const mapped = POTRERO_ALIASES[normalize(input)] || input;
    const official = officialByNormalized.get(normalize(mapped));
    if (official) {
      return {
        official,
        status: normalize(input) === normalize(official) ? "COINCIDENCIA_EXACTA" : "COINCIDENCIA_ALIAS",
        matchedFrom: input
      };
    }
  }
  return { official: rawAlias || rawName, status: "SIN_COINCIDENCIA", matchedFrom: "" };
}

function resolveBlock(potrero, rawBlock, officialFields) {
  let block = clean(rawBlock);
  if (/^[D-J]$/i.test(potrero) && block && !block.toLocaleUpperCase("es").startsWith(potrero.toLocaleUpperCase("es"))) {
    block = `${potrero}${block}`;
  }
  block = BLOCK_OVERRIDES[`${potrero}:${block.toLocaleUpperCase("es")}`] || block;
  const field = officialFields.get(identity(potrero, block));
  return { block, field, status: field ? "COINCIDENCIA" : "SIN_COINCIDENCIA" };
}

async function readGeoJson(fileName) {
  const value = JSON.parse(await fs.readFile(path.join(sourceDir, fileName), "utf8"));
  if (value?.type !== "FeatureCollection" || !Array.isArray(value.features)) {
    throw new Error(`${fileName} no es una FeatureCollection valida.`);
  }
  return value;
}

const campos = JSON.parse(await fs.readFile(camposPath, "utf8"));
const officialPotreros = unique(campos.map((row) => row.potrero));
const officialByNormalized = new Map(officialPotreros.map((potrero) => [normalize(potrero), potrero]));
const officialFields = new Map(campos.map((row) => [identity(row.potrero, row.bloque), row]));
const officialByPotrero = new Map();
for (const row of campos) {
  const rows = officialByPotrero.get(row.potrero) || [];
  rows.push(row);
  officialByPotrero.set(row.potrero, rows);
}

const [potrerosInput, bloquesInput, casetasInput, tranquesInput] = await Promise.all([
  readGeoJson("POTREROS.geojson"),
  readGeoJson("BLOQUES.geojson"),
  readGeoJson("CASETAS.geojson"),
  readGeoJson("TRANQUES.geojson")
]);
const coordinateResults = {
  potreros: ensureWgs84(potrerosInput),
  bloques: ensureWgs84(bloquesInput),
  casetas: ensureWgs84(casetasInput),
  tranques: ensureWgs84(tranquesInput)
};
const potrerosSource = coordinateResults.potreros.collection;
const bloquesSource = coordinateResults.bloques.collection;
const casetasSource = coordinateResults.casetas.collection;
const tranquesSource = coordinateResults.tranques.collection;

const potreroRows = [];
const normalizedPotreros = potrerosSource.features.map((feature, index) => {
  const properties = feature.properties || {};
  const rawName = readProperty(properties, ["Nombre", "nombre", "Potrero_Nombre"]);
  const rawAlias = readProperty(properties, ["Alias:", "Alias", "alias", "Potrero_Alias:", "Potrero_Alias"]);
  const match = resolvePotrero(rawAlias, rawName, officialByNormalized);
  const officialRows = officialByPotrero.get(match.official) || [];
  const officialSpecies = unique(officialRows.map((row) => row.especie));
  const officialVarieties = unique(officialRows.map((row) => row.variedad));
  const row = {
    geojson_fid: properties.fid ?? index + 1,
    potrero_geojson_nombre: rawName,
    potrero_geojson_alias: rawAlias,
    potrero_supabase: match.status === "SIN_COINCIDENCIA" ? "" : match.official,
    estado: match.status,
    coincidencia_desde: match.matchedFrom,
    especie_geojson: clean(properties.Especie),
    especie_supabase: officialSpecies.join(" / "),
    variedades_supabase: officialVarieties.join(" / "),
    bloques_supabase: officialRows.length,
    hectareas_geojson: numeric(properties.HAS),
    hectareas_supabase: officialRows.length ? sum(officialRows.map((item) => item.hectareas)) : null,
    diferencia_hectareas: officialRows.length ? (numeric(properties.HAS) || 0) - sum(officialRows.map((item) => item.hectareas)) : null,
    observacion: match.status === "SIN_COINCIDENCIA" ? "No existe un potrero equivalente unico en campos." : ""
  };
  potreroRows.push(row);
  return {
    ...feature,
    properties: {
      ...properties,
      "Nombre_GeoJSON": rawName,
      "Alias_GeoJSON": rawAlias,
      Nombre: match.official,
      "Alias:": match.official,
      potrero: match.official,
      potrero_oficial: match.status === "SIN_COINCIDENCIA" ? null : match.official,
      especie: officialSpecies.join(" / ") || clean(properties.Especie),
      variedades: officialVarieties.join(" / "),
      hectareas_supabase: row.hectareas_supabase,
      plantas_supabase: officialRows.length ? sum(officialRows.map((item) => item.plantas)) : null,
      normalizacion_estado: match.status
    }
  };
});

const blockRows = [];
const normalizedBlocks = bloquesSource.features.map((feature, index) => {
  const properties = feature.properties || {};
  const rawPotreroName = readProperty(properties, ["Potrero_Nombre", "Nombre", "potrero"]);
  const sourcePotreroAlias = readProperty(properties, ["Potrero_Alias:", "Potrero_Alias", "Alias:", "Alias", "alias"]);
  const rawPotreroAlias = sourcePotreroAlias || BLOCK_POTRERO_FID_ALIASES[Number(properties.fid)] || "";
  const rawBlock = readProperty(properties, ["Bloque", "bloque", "BLOQUE", "block"]);
  const potreroMatch = resolvePotrero(rawPotreroAlias, rawPotreroName, officialByNormalized);
  const sharedBlockNames = SHARED_BLOCKS[`${potreroMatch.official}:${clean(rawBlock).toLocaleUpperCase("es")}`] || [];
  const sharedFields = sharedBlockNames
    .map((block) => officialFields.get(identity(potreroMatch.official, block)))
    .filter(Boolean);
  const blockMatch = sharedFields.length === sharedBlockNames.length && sharedFields.length
    ? { status: "COINCIDENCIA", field: sharedFields[0], block: sharedFields[0].bloque }
    : resolveBlock(potreroMatch.official, rawBlock, officialFields);
  const status = potreroMatch.status === "SIN_COINCIDENCIA" ? "POTRERO_SIN_COINCIDENCIA" : blockMatch.status;
  const field = blockMatch.field;
  const row = {
    geojson_fid: properties.fid ?? index + 1,
    potrero_geojson_nombre: rawPotreroName,
    potrero_geojson_alias: rawPotreroAlias,
    bloque_geojson: rawBlock,
    potrero_supabase: field?.potrero || (potreroMatch.status === "SIN_COINCIDENCIA" ? "" : potreroMatch.official),
    bloque_supabase: field?.bloque || "",
    campo_id: field?.id || "",
    bloques_supabase_relacionados: sharedFields.map((item) => item.bloque).join(" / "),
    campo_ids_relacionados: sharedFields.map((item) => item.id).join(" / "),
    estado: status,
    especie_geojson: clean(properties.Potrero_Especie),
    especie_supabase: clean(field?.especie),
    variedad_geojson: clean(properties.Variedad),
    variedad_supabase: clean(field?.variedad),
    hectareas_geojson: numeric(properties.HAS),
    hectareas_supabase: numeric(field?.hectareas),
    diferencia_hectareas: field ? (numeric(properties.HAS) || 0) - (numeric(field.hectareas) || 0) : null,
    plantas_geojson: numeric(properties.Plantas),
    plantas_supabase: numeric(field?.plantas),
    observacion: sharedFields.length
      ? `Geometria compartida por los bloques ${sharedFields.map((item) => item.bloque).join(" / ")}.`
      : status === "COINCIDENCIA" ? "" : status === "POTRERO_SIN_COINCIDENCIA" ? "El potrero no existe en campos." : "El bloque no existe para este potrero en campos."
  };
  blockRows.push(row);
  const officialPotrero = field?.potrero || potreroMatch.official;
  const officialBlock = field?.bloque || blockMatch.block;
  return {
    ...feature,
    properties: {
      ...properties,
      Potrero_Nombre_GeoJSON: rawPotreroName,
      "Potrero_Alias_GeoJSON": rawPotreroAlias,
      Bloque_GeoJSON: rawBlock,
      Potrero_Nombre: officialPotrero,
      "Potrero_Alias:": officialPotrero,
      potrero: officialPotrero,
      Bloque: officialBlock,
      bloque: officialBlock,
      campo_id: field?.id || null,
      campo_ids: sharedFields.length ? sharedFields.map((item) => item.id) : (field?.id ? [field.id] : []),
      bloques_supabase: sharedFields.length ? sharedFields.map((item) => item.bloque) : (field?.bloque ? [field.bloque] : []),
      bloque_label: sharedFields.length ? sharedFields.map((item) => item.bloque).join(" / ") : officialBlock,
      especie: field?.especie || clean(properties.Potrero_Especie),
      variedad: field?.variedad || clean(properties.Variedad),
      hectareas: numeric(field?.hectareas) ?? numeric(properties.HAS),
      plantas_supabase: numeric(field?.plantas),
      precipitacion: numeric(field?.precipitacion),
      caudal: numeric(field?.caudal),
      normalizacion_estado: status
    }
  };
});

const normalizeInfrastructure = (collection, type) => ({
  ...collection,
  features: collection.features.map((feature, index) => {
    const properties = feature.properties || {};
    const name = type === "caseta"
      ? readProperty(properties, ["Alias", "Nombre", "nombre"]) || `Caseta ${properties.Numero ?? index + 1}`
      : readProperty(properties, ["Nombre_Tranque", "Nombre", "nombre"]) || `Tranque ${properties.numero_Tranque ?? index + 1}`;
    const number = type === "caseta" ? properties.Numero : properties.numero_Tranque;
    return { ...feature, properties: { ...properties, nombre: name, numero: number, tipo: type } };
  })
});

const normalizedCollections = {
  potreros: { ...potrerosSource, features: normalizedPotreros },
  bloques: { ...bloquesSource, features: normalizedBlocks },
  casetas: normalizeInfrastructure(casetasSource, "caseta"),
  tranques: normalizeInfrastructure(tranquesSource, "tranque")
};

const representedPotreros = new Set(potreroRows.map((row) => row.potrero_supabase).filter(Boolean));
const representedFields = new Set();
blockRows.forEach((row) => {
  if (row.campo_id) representedFields.add(identity(row.potrero_supabase, row.bloque_supabase));
  clean(row.bloques_supabase_relacionados).split("/").map((item) => clean(item)).filter(Boolean).forEach((block) => {
    representedFields.add(identity(row.potrero_supabase, block));
  });
});
const missingOfficialPotreros = officialPotreros.filter((potrero) => !representedPotreros.has(potrero)).map((potrero) => ({
  potrero_supabase: potrero,
  bloques_supabase: (officialByPotrero.get(potrero) || []).length,
  estado: "SIN_GEOMETRIA_GEOJSON",
  observacion: "Existe en campos, pero no tiene poligono relacionado en POTREROS.geojson."
}));
const missingOfficialBlocks = campos.filter((field) => !representedFields.has(identity(field.potrero, field.bloque))).map((field) => ({
  campo_id: field.id,
  potrero_supabase: field.potrero,
  bloque_supabase: field.bloque,
  especie_supabase: field.especie,
  variedad_supabase: field.variedad,
  hectareas_supabase: numeric(field.hectareas),
  estado: "SIN_GEOMETRIA_GEOJSON",
  observacion: "Existe en campos, pero no tiene poligono relacionado en BLOQUES.geojson."
}));

const duplicateBlockKeys = Object.entries(blockRows.reduce((acc, row) => {
  if (!row.campo_id) return acc;
  const key = identity(row.potrero_supabase, row.bloque_supabase);
  acc[key] = (acc[key] || 0) + 1;
  return acc;
}, {})).filter(([, count]) => count > 1).map(([key, count]) => ({ key, count }));

const report = {
  generated_at: new Date().toISOString(),
  source: {
    directory: sourceDir,
    campos: camposPath,
    authority: "Supabase public.campos"
  },
  summary: {
    campos_rows: campos.length,
    supabase_potreros: officialPotreros.length,
    geojson_potreros: potreroRows.length,
    geojson_bloques: blockRows.length,
    geojson_casetas: normalizedCollections.casetas.features.length,
    geojson_tranques: normalizedCollections.tranques.features.length,
    potreros_matched: potreroRows.filter((row) => row.estado !== "SIN_COINCIDENCIA").length,
    potreros_unmatched: potreroRows.filter((row) => row.estado === "SIN_COINCIDENCIA").length,
    bloques_matched: blockRows.filter((row) => row.estado === "COINCIDENCIA").length,
    bloques_unmatched: blockRows.filter((row) => row.estado !== "COINCIDENCIA").length,
    supabase_potreros_without_geometry: missingOfficialPotreros.length,
    supabase_blocks_without_geometry: missingOfficialBlocks.length,
    duplicate_block_geometries: duplicateBlockKeys.length
  },
  coordinate_systems: Object.fromEntries(Object.entries(coordinateResults).map(([name, value]) => [name, {
    source: value.sourceCrs,
    output: "EPSG:4326",
    transformed: value.transformed
  }])),
  potreros: potreroRows,
  bloques: blockRows,
  potreros_supabase_sin_geometria: missingOfficialPotreros,
  bloques_supabase_sin_geometria: missingOfficialBlocks,
  bloques_duplicados: duplicateBlockKeys,
  casetas: normalizedCollections.casetas.features.map((feature) => feature.properties),
  tranques: normalizedCollections.tranques.features.map((feature) => feature.properties)
};

await fs.mkdir(outputDir, { recursive: true });
await Promise.all([
  fs.writeFile(path.join(outputDir, "potreros.geojson"), JSON.stringify(normalizedCollections.potreros)),
  fs.writeFile(path.join(outputDir, "bloques.geojson"), JSON.stringify(normalizedCollections.bloques)),
  fs.writeFile(path.join(outputDir, "casetas.geojson"), JSON.stringify(normalizedCollections.casetas)),
  fs.writeFile(path.join(outputDir, "tranques.geojson"), JSON.stringify(normalizedCollections.tranques)),
  fs.writeFile(reportPath, JSON.stringify(report, null, 2))
]);

console.log(JSON.stringify(report.summary, null, 2));
