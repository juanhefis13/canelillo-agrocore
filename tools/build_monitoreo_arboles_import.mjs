import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";

const projectRoot = path.resolve(import.meta.dirname, "..");
const sourcePath = process.argv[2] || "C:/Users/PC/Desktop/geojson/Arboles monitoreo.geojson";
const fieldsPath = process.argv[3] || "C:/Users/PC/Downloads/campos_rows (1).csv";
const outputSqlPath = path.join(projectRoot, "supabase_monitoreo_arboles_import.sql");
const outputJsonPath = path.join(projectRoot, "outputs", "monitoreo_arboles.json");
const outputReportPath = path.join(projectRoot, "reports", "monitoreo_arboles_sin_campo.md");
const chunkSize = 250;

const FIELD_ALIASES = Object.freeze({
  "casa verde": "28",
  "el peumo": "29",
  "los pinos": "10",
  "los pinos 80": "Los pinos Paltos",
  "los pinos 2004": "Los pinos Paltos",
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
  "p7": "7"
});

function normalize(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLocaleLowerCase("es");
}

function parseCsvLine(line) {
  const values = [];
  let current = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"') {
      if (quoted && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else quoted = !quoted;
    } else if (character === "," && !quoted) {
      values.push(current);
      current = "";
    } else current += character;
  }
  values.push(current);
  return values;
}

function canonicalField(potreroValue, blockValue) {
  const sourcePotrero = String(potreroValue ?? "").trim();
  const canonicalPotrero = FIELD_ALIASES[normalize(sourcePotrero)] || sourcePotrero;
  let canonicalBlock = String(blockValue ?? "").trim();
  const override = {
    "29:2A": "2",
    "29:2B": "2",
    "29:5A": "5",
    "29:5B": "5",
    "19:1": "4",
    "6:1": "3"
  }[`${canonicalPotrero}:${canonicalBlock.toLocaleUpperCase("es")}`];
  if (override) canonicalBlock = override;
  if (/^[D-J]$/i.test(canonicalPotrero)
    && canonicalBlock
    && !canonicalBlock.toLocaleUpperCase("es").startsWith(canonicalPotrero.toLocaleUpperCase("es"))) {
    canonicalBlock = `${canonicalPotrero}${canonicalBlock}`;
  }
  return { potrero: canonicalPotrero, block: canonicalBlock };
}

function stableUuid(fid) {
  const hash = createHash("md5").update(`monitoreo-arbol:${fid}`).digest("hex");
  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-${hash.slice(12, 16)}-${hash.slice(16, 20)}-${hash.slice(20)}`;
}

function sqlText(value) {
  if (value === null || value === undefined || String(value).trim() === "") return "null";
  return `'${String(value).replaceAll("'", "''")}'`;
}

function sqlNumber(value) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? String(numericValue) : "null";
}

const csvText = (await fs.readFile(fieldsPath, "utf8")).replace(/^\uFEFF/, "").trim();
const csvLines = csvText.split(/\r?\n/);
const headers = parseCsvLine(csvLines.shift()).map((value) => value.trim());
const fields = csvLines.map((line) => {
  const values = parseCsvLine(line);
  return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
});
const fieldsByKey = new Map(fields.map((field) => [
  `${normalize(field.potrero)}:${String(field.bloque || "").trim().toLocaleUpperCase("es")}`,
  field
]));

const sourceCollection = JSON.parse(await fs.readFile(sourcePath, "utf8"));
if (sourceCollection.type !== "FeatureCollection") throw new Error("El archivo de arboles no es un FeatureCollection");

const records = (sourceCollection.features || []).map((feature, index) => {
  const properties = feature.properties || {};
  const fid = Number(properties.fid);
  const longitude = Number(properties.X);
  const latitude = Number(properties.y);
  if (!Number.isFinite(fid)) throw new Error(`fid invalido en el punto ${index + 1}`);
  if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) throw new Error(`Coordenadas invalidas en fid ${fid}`);
  const canonical = canonicalField(properties.Potrero, properties.Bloques);
  const field = fieldsByKey.get(`${normalize(canonical.potrero)}:${canonical.block.toLocaleUpperCase("es")}`) || null;
  return {
    id: stableUuid(fid),
    sourceFid: fid,
    fieldId: field?.id || null,
    date: String(properties.Fecha || "").slice(0, 10) || null,
    tree: String(properties["Numero del arbol"] ?? "").trim(),
    row: String(properties.Hilera ?? "").trim(),
    monitoringSector: String(properties.SectorMonitoreo ?? "").trim(),
    sourcePotrero: String(properties.Potrero ?? "").trim(),
    sourceBlock: String(properties.Bloques ?? "").trim(),
    potrero: field?.potrero || canonical.potrero,
    block: field?.bloque || canonical.block,
    species: field?.especie || "",
    variety: field?.variedad || "",
    longitude,
    latitude,
    normalized: Boolean(field)
  };
});

const duplicateIds = records.filter((record, index) => records.findIndex((item) => item.sourceFid === record.sourceFid) !== index);
if (duplicateIds.length) throw new Error(`Hay ${duplicateIds.length} fid duplicados en el GeoJSON`);

const sourceColumns = [
  "id", "origen_fid", "campo_id", "fecha_referencia", "numero_arbol", "hilera",
  "sector_monitoreo", "potrero_origen", "bloque_origen", "longitud", "latitud"
];

function valuesSql(record) {
  return `(${[
    sqlText(record.id), sqlNumber(record.sourceFid), sqlText(record.fieldId), sqlText(record.date),
    sqlText(record.tree), sqlText(record.row), sqlText(record.monitoringSector), sqlText(record.sourcePotrero),
    sqlText(record.sourceBlock), sqlNumber(record.longitude), sqlNumber(record.latitude)
  ].join(", ")})`;
}

const statements = [];
for (let index = 0; index < records.length; index += chunkSize) {
  const chunk = records.slice(index, index + chunkSize);
  statements.push(`insert into public.monitoreo_arboles (${sourceColumns.join(", ")})\nvalues\n  ${chunk.map(valuesSql).join(",\n  ")}\non conflict (id) do update set\n  campo_id = excluded.campo_id,\n  fecha_referencia = excluded.fecha_referencia,\n  numero_arbol = excluded.numero_arbol,\n  hilera = excluded.hilera,\n  sector_monitoreo = excluded.sector_monitoreo,\n  potrero_origen = excluded.potrero_origen,\n  bloque_origen = excluded.bloque_origen,\n  longitud = excluded.longitud,\n  latitud = excluded.latitud,\n  activo = true;`);
}

const importSql = `set statement_timeout = '30min';
-- Generado por tools/build_monitoreo_arboles_import.mjs.
-- Fuentes: Arboles monitoreo.geojson y export de public.campos.
-- Ejecutar despues de supabase_monitoreo_arboles.sql.
begin;

${statements.join("\n\n")}

commit;

select
  count(*) as total_arboles,
  count(campo_id) as asociados_a_campos,
  count(*) filter (where campo_id is null) as pendientes
from public.monitoreo_arboles
where activo;

select origen_fid, potrero_origen, bloque_origen, numero_arbol, longitud, latitud
from public.monitoreo_arboles
where activo and campo_id is null
order by potrero_origen, bloque_origen, origen_fid;
`;

const backup = {
  generatedAt: new Date().toISOString(),
  source: path.basename(sourcePath),
  summary: {
    records: records.length,
    normalized: records.filter((record) => record.normalized).length,
    pending: records.filter((record) => !record.normalized).length
  },
  records
};

const reportHeader = "| FID | Potrero origen | Bloque origen | Potrero propuesto | Bloque propuesto | Arbol | Longitud | Latitud | Motivo |\n|---:|---|---|---|---|---:|---:|---:|---|";
const reportRows = records.filter((record) => !record.normalized).map((record) => [
  record.sourceFid,
  record.sourcePotrero,
  record.sourceBlock,
  record.potrero,
  record.block,
  record.tree,
  record.longitude,
  record.latitude,
  "No existe coincidencia exacta de potrero y bloque en public.campos"
].map((value) => String(value ?? "").replaceAll("|", "\\|")).join(" | ")).map((row) => `| ${row} |`);

await fs.mkdir(path.dirname(outputJsonPath), { recursive: true });
await fs.mkdir(path.dirname(outputReportPath), { recursive: true });
await Promise.all([
  fs.writeFile(outputSqlPath, importSql, "utf8"),
  fs.writeFile(outputJsonPath, `${JSON.stringify(backup)}\n`, "utf8"),
  fs.writeFile(outputReportPath, `${[reportHeader, ...reportRows].join("\n")}\n`, "utf8")
]);

console.log(JSON.stringify({
  records: records.length,
  normalized: records.filter((record) => record.normalized).length,
  pending: records.filter((record) => !record.normalized).length,
  canonicalBlocks: new Set(records.filter((record) => record.normalized).map((record) => `${record.potrero}:${record.block}`)).size,
  outputSqlPath,
  outputJsonPath,
  outputReportPath
}, null, 2));
