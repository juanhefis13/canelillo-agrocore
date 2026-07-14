import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";

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

function sourceUuid(layer, fid) {
  const hash = createHash("md5").update(`${layer}:${fid}`).digest("hex");
  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-${hash.slice(12, 16)}-${hash.slice(16, 20)}-${hash.slice(20)}`;
}

function canonicalFieldBlock(potrero, block) {
  const cleanPotrero = String(potrero || "").trim();
  const cleanBlock = String(block || "").trim();
  const override = {
    "29:2A": "2",
    "29:2B": "2",
    "29:5A": "5",
    "29:5B": "5",
    "19:1": "4",
    "6:1": "3"
  }[`${cleanPotrero}:${cleanBlock.toUpperCase()}`];
  if (override) return override;
  if (/^[D-J]$/i.test(cleanPotrero) && cleanBlock && !cleanBlock.toUpperCase().startsWith(cleanPotrero.toUpperCase())) {
    return `${cleanPotrero}${cleanBlock}`;
  }
  return cleanBlock;
}

function normalizedPestField(record) {
  if (normalized(record.potrero) === "sin potrero") {
    return { potrero: "5", block: "1", hasField: true };
  }
  const hasField = Boolean(record.normalizedField);
  return {
    potrero: hasField ? record.potrero : "",
    block: hasField ? canonicalFieldBlock(record.potrero, record.mapBlock || record.excelBlock) : "",
    hasField
  };
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
    let geoBlock = String(properties.Bloque ?? "").trim();
    if (!geoAlias && !geoBlock) geoBlock = "1";
    if (geoAlias !== record.sourceAlias || geoBlock !== record.sourceBlock) {
      throw new Error(`${layer.file}: el orden de atributos no coincide en fid ${fid}`);
    }
    record.originLayer = layer.layer;
    record.originFid = fid;
    record.id = sourceUuid(layer.layer, fid);
  });
}

const sourceColumns = [
  "id", "fecha", "tipo_plaga", "potrero_canonico", "bloque_canonico",
  "numero_arbol", "orden_monitoreo", "encontrado_en", "huevos", "ninfas_1",
  "ninfas_2", "ninfas_3", "adultos", "larvas", "pupas", "longitud", "latitud"
];

function recordValues(record) {
  const field = normalizedPestField(record);
  return `(${[
    sqlText(record.id), sqlText(record.date), sqlText(record.pest), sqlText(field.potrero), sqlText(field.block),
    sqlText(record.tree), sqlText(record.monitoringOrder), sqlText(record.foundAt), sqlNumber(record.eggs),
    sqlNumber(record.nymph1), sqlNumber(record.nymph2), sqlNumber(record.nymph3), sqlNumber(record.adults),
    sqlNumber(record.larvae), sqlNumber(record.pupae), sqlNumber(record.longitude), sqlNumber(record.latitude)
  ].join(", ")})`;
}

function importStatement(records) {
  return `with source_values(${sourceColumns.join(", ")}) as (values
  ${records.map(recordValues).join(",\n  ")}
), upserted as (
  insert into public.monitoreo_plagas (
    id, campo_id, fecha, tipo_plaga, potrero_excel, bloque_excel, numero_arbol,
    orden_monitoreo, encontrado_en, huevos, ninfas_1, ninfas_2, ninfas_3,
    adultos, larvas, pupas, longitud, latitud
  )
  select
    v.id::uuid, c.id, v.fecha::date, v.tipo_plaga, c.potrero, c.bloque,
    v.numero_arbol, v.orden_monitoreo, v.encontrado_en, v.huevos, v.ninfas_1,
    v.ninfas_2, v.ninfas_3, v.adultos, v.larvas, v.pupas, v.longitud, v.latitud
  from source_values v
  left join lateral (
    select campos.id, campos.potrero, campos.bloque
    from public.campos
    where lower(trim(campos.potrero)) = lower(trim(v.potrero_canonico))
      and upper(trim(campos.bloque)) = upper(trim(v.bloque_canonico))
    order by campos.activo desc, campos.id
    limit 1
  ) c on true
  on conflict (id) do update
set
  campo_id = excluded.campo_id,
  fecha = excluded.fecha,
  tipo_plaga = excluded.tipo_plaga,
  potrero_excel = excluded.potrero_excel,
  bloque_excel = excluded.bloque_excel,
  numero_arbol = excluded.numero_arbol,
  orden_monitoreo = excluded.orden_monitoreo,
  encontrado_en = excluded.encontrado_en,
  huevos = excluded.huevos,
  ninfas_1 = excluded.ninfas_1,
  ninfas_2 = excluded.ninfas_2,
  ninfas_3 = excluded.ninfas_3,
  adultos = excluded.adultos,
  larvas = excluded.larvas,
  pupas = excluded.pupas,
  longitud = excluded.longitud,
  latitud = excluded.latitud
  returning id
)
insert into tmp_monitoreo_plagas_import_ids (id)
select id from upserted
on conflict (id) do nothing;`;
}

const statements = [];
for (let index = 0; index < decoded.length; index += chunkSize) {
  statements.push(importStatement(decoded.slice(index, index + chunkSize)));
}

const sql = `set statement_timeout = '120min';
-- Generado por tools/build_plagas_supabase_import.mjs.
-- Fuente: plagas qgis.xlsx + capas GeoJSON; public.campos es el catalogo canonico.
-- Ejecutar despues de supabase_monitoreo_plagas.sql.
begin;

create temporary table tmp_monitoreo_plagas_import_ids (
  id uuid primary key
) on commit drop;

${statements.join("\n\n")}

do $$
declare
  imported_count bigint;
begin
  select count(*) into imported_count
  from tmp_monitoreo_plagas_import_ids;
  if imported_count <> ${decoded.length} then
    raise exception 'Import incompleto: se esperaban ${decoded.length} registros y se procesaron %', imported_count;
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
  count(*) as registros
from public.monitoreo_plagas
where campo_id is null
group by potrero_excel, bloque_excel
order by registros desc;
`;

await fs.writeFile(outputPath, sql, "utf8");
console.log(JSON.stringify({
  records: decoded.length,
  statements: statements.length,
  outputPath,
  bytes: Buffer.byteLength(sql),
}, null, 2));
