import fs from "node:fs/promises";
import path from "node:path";

const projectRoot = path.resolve(import.meta.dirname, "..");
const compactPath = path.join(projectRoot, "outputs", "plagas_monitoreo.compact.json");
const geoJsonDir = process.argv[2] || "C:/Users/PC/Desktop/geojson";
const outputPath = path.join(projectRoot, "supabase_monitoreo_plagas_import.sql");
const chunkSize = 750;

const layerByPest = new Map([
  ["aranita roja", { file: "AranitaRoja.geojson", layer: "AranitaRoja" }],
  ["conchuela blanca", { file: "ConchuelaBlanca.geojson", layer: "ConchuelaBlanca" }],
  ["escama", { file: "Escama.geojson", layer: "Escama" }],
  ["mosquita blanca", { file: "Mosquitablanca.geojson", layer: "Mosquitablanca" }],
  ["pulgon", { file: "Pulgon.geojson", layer: "Pulgon" }],
  ["trips", { file: "Trips.geojson", layer: "Trips" }],
  ["chanchito blanco", { file: "chanchitoblanco.geojson", layer: "chanchitoblanco" }],
]);

function normalized(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function sqlText(value) {
  if (value === null || value === undefined || String(value).trim() === "") return "null";
  return `'${String(value).replaceAll("'", "''")}'`;
}

function sqlNumber(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "0";
  return String(number);
}

const collection = JSON.parse(await fs.readFile(compactPath, "utf8"));
const dictionaries = collection.dictionaries || {};
const decoded = (collection.records || []).map((row) => ({
  date: dictionaries.dates?.[row[0]] || "",
  pest: dictionaries.pests?.[row[1]] || "",
  potrero: dictionaries.potreros?.[row[2]] || "",
  normalizedField: Boolean(row[3]),
  sourceAlias: dictionaries.aliases?.[row[4]] || "",
  sourceBlock: dictionaries.blocks?.[row[5]] || "",
  excelBlock: dictionaries.blocks?.[row[6]] || "",
  mapAlias: dictionaries.aliases?.[row[7]] || "",
  mapBlock: dictionaries.blocks?.[row[8]] || "",
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
  latitude: Number(row[24]),
}));

const featuresByPest = new Map();
for (const [pestKey, layer] of layerByPest) {
  const geoJson = JSON.parse(await fs.readFile(path.join(geoJsonDir, layer.file), "utf8"));
  featuresByPest.set(pestKey, geoJson.features || []);
}

const recordsByPest = new Map();
for (const record of decoded) {
  const key = normalized(record.pest);
  if (!recordsByPest.has(key)) recordsByPest.set(key, []);
  recordsByPest.get(key).push(record);
}

for (const [pestKey, records] of recordsByPest) {
  const features = featuresByPest.get(pestKey);
  if (!features) throw new Error(`No existe una capa GeoJSON configurada para ${pestKey}`);
  if (features.length !== records.length) {
    throw new Error(`${pestKey}: ${records.length} registros y ${features.length} geometrias`);
  }
  records.forEach((record, index) => {
    const layer = layerByPest.get(pestKey);
    const properties = features[index]?.properties || {};
    const fid = Number(properties.fid);
    if (!Number.isFinite(fid)) throw new Error(`${layer.file}: fid invalido en la posicion ${index + 1}`);
    const geoAliasKey = Object.keys(properties).find((key) => normalized(key).startsWith("potrero_alias"));
    const geoAlias = geoAliasKey ? String(properties[geoAliasKey] ?? "").trim() : "";
    const geoBlock = String(properties.Bloque ?? "").trim();
    if (geoAlias !== record.sourceAlias || geoBlock !== record.sourceBlock) {
      throw new Error(`${layer.file}: el orden de atributos no coincide en fid ${fid}`);
    }
    record.originLayer = layer.layer;
    record.originFid = fid;
  });
}

const sourceColumns = [
  "origen_capa", "origen_fid", "fecha", "tipo_plaga", "potrero_canonico",
  "bloque_canonico", "potrero_excel", "bloque_excel", "alias_geojson",
  "bloque_geojson", "alias_mapa", "bloque_mapa", "numero_arbol",
  "orden_monitoreo", "encontrado_en", "sector_monitoreo", "evidencia_foto",
  "total_origen", "total_calculado", "huevos", "ninfas_1", "ninfas_2",
  "ninfas_3", "adultos", "larvas", "pupas", "longitud", "latitud"
];

function recordValues(record) {
  const hasField = record.normalizedField && normalized(record.potrero) !== "sin potrero";
  const canonicalPotrero = hasField ? record.potrero : "";
  const canonicalBlock = hasField ? (record.mapBlock || record.excelBlock) : "";
  const excelPotrero = normalized(record.potrero) === "sin potrero" ? "" : record.potrero;
  return `(${[
    sqlText(record.originLayer), sqlNumber(record.originFid), sqlText(record.date), sqlText(record.pest),
    sqlText(canonicalPotrero), sqlText(canonicalBlock), sqlText(excelPotrero), sqlText(record.excelBlock),
    sqlText(record.sourceAlias), sqlText(record.sourceBlock), sqlText(record.mapAlias), sqlText(record.mapBlock),
    sqlText(record.tree), sqlText(record.monitoringOrder), sqlText(record.foundAt), sqlText(record.sector),
    sqlText(record.photoUrl), sqlNumber(record.sourceTotal), sqlNumber(record.stageTotal), sqlNumber(record.eggs),
    sqlNumber(record.nymph1), sqlNumber(record.nymph2), sqlNumber(record.nymph3), sqlNumber(record.adults),
    sqlNumber(record.larvae), sqlNumber(record.pupae), sqlNumber(record.longitude), sqlNumber(record.latitude)
  ].join(", ")})`;
}

function importStatement(records) {
  return `insert into public.monitoreo_plagas (
  origen_capa, origen_fid, campo_id, fecha, tipo_plaga, potrero_excel, bloque_excel,
  alias_geojson, bloque_geojson, alias_mapa, bloque_mapa, numero_arbol, orden_monitoreo,
  encontrado_en, sector_monitoreo, evidencia_foto, total_origen, total_calculado,
  huevos, ninfas_1, ninfas_2, ninfas_3, adultos, larvas, pupas, longitud, latitud
)
select
  v.origen_capa, v.origen_fid, c.id, v.fecha::date, v.tipo_plaga, v.potrero_excel,
  v.bloque_excel, v.alias_geojson, v.bloque_geojson, v.alias_mapa, v.bloque_mapa,
  v.numero_arbol, v.orden_monitoreo, v.encontrado_en, v.sector_monitoreo,
  v.evidencia_foto, v.total_origen, v.total_calculado, v.huevos, v.ninfas_1,
  v.ninfas_2, v.ninfas_3, v.adultos, v.larvas, v.pupas, v.longitud, v.latitud
from (values
  ${records.map(recordValues).join(",\n  ")}
) as v(${sourceColumns.join(", ")})
left join lateral (
  select campos.id
  from public.campos
  where lower(trim(campos.potrero)) = lower(trim(v.potrero_canonico))
    and trim(campos.bloque) = trim(v.bloque_canonico)
  order by campos.activo desc, campos.id
  limit 1
) c on true
on conflict (origen_capa, origen_fid) do update
set
  campo_id = excluded.campo_id,
  fecha = excluded.fecha,
  tipo_plaga = excluded.tipo_plaga,
  potrero_excel = excluded.potrero_excel,
  bloque_excel = excluded.bloque_excel,
  alias_geojson = excluded.alias_geojson,
  bloque_geojson = excluded.bloque_geojson,
  alias_mapa = excluded.alias_mapa,
  bloque_mapa = excluded.bloque_mapa,
  numero_arbol = excluded.numero_arbol,
  orden_monitoreo = excluded.orden_monitoreo,
  encontrado_en = excluded.encontrado_en,
  sector_monitoreo = excluded.sector_monitoreo,
  evidencia_foto = excluded.evidencia_foto,
  total_origen = excluded.total_origen,
  total_calculado = excluded.total_calculado,
  huevos = excluded.huevos,
  ninfas_1 = excluded.ninfas_1,
  ninfas_2 = excluded.ninfas_2,
  ninfas_3 = excluded.ninfas_3,
  adultos = excluded.adultos,
  larvas = excluded.larvas,
  pupas = excluded.pupas,
  longitud = excluded.longitud,
  latitud = excluded.latitud;`;
}

const statements = [];
for (let index = 0; index < decoded.length; index += chunkSize) {
  statements.push(importStatement(decoded.slice(index, index + chunkSize)));
}

const expectedLayers = [...layerByPest.values()].map(({ layer }) => sqlText(layer)).join(", ");
const sql = `-- Generado por tools/build_plagas_supabase_import.mjs.
-- Fuente: plagas qgis.xlsx + capas GeoJSON; public.campos es el catalogo canonico.
-- Ejecutar despues de supabase_monitoreo_plagas.sql.
begin;

${statements.join("\n\n")}

do $$
declare
  imported_count bigint;
begin
  select count(*) into imported_count
  from public.monitoreo_plagas
  where origen_capa in (${expectedLayers});
  if imported_count < ${decoded.length} then
    raise exception 'Import incompleto: se esperaban al menos ${decoded.length} registros y quedaron %', imported_count;
  end if;
end $$;

commit;

select
  count(*) as total_registros,
  count(campo_id) as asociados_a_campos,
  count(*) filter (where campo_id is null) as sin_asociar,
  min(fecha) as primera_fecha,
  max(fecha) as ultima_fecha
from public.monitoreo_plagas;

select tipo_plaga, count(*) as registros
from public.monitoreo_plagas
group by tipo_plaga
order by tipo_plaga;

select
  potrero_excel,
  bloque_excel,
  alias_geojson,
  bloque_geojson,
  count(*) as registros
from public.monitoreo_plagas
where campo_id is null
group by potrero_excel, bloque_excel, alias_geojson, bloque_geojson
order by registros desc;
`;

await fs.writeFile(outputPath, sql, "utf8");
console.log(JSON.stringify({
  records: decoded.length,
  statements: statements.length,
  outputPath,
  bytes: Buffer.byteLength(sql),
}, null, 2));
