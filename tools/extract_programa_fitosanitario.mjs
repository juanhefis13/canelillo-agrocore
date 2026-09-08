import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const sourcePath = process.argv[2];
const outputPath = process.argv[3] || path.resolve(import.meta.dirname, "..", "work", "programa_rows.json");
if (!sourcePath || !fs.existsSync(sourcePath)) {
  throw new Error("Uso: node tools/extract_programa_fitosanitario.mjs <archivo.xlsx> [salida.json]");
}

const require = createRequire(import.meta.url);
const XLSX = require("../vendor/xlsx.full.min.js");
const workbook = XLSX.read(fs.readFileSync(sourcePath), { type: "buffer", cellDates: false, cellFormula: true });
const worksheet = workbook.Sheets.PROGRAMA;
if (!worksheet) throw new Error("El Excel no contiene la hoja PROGRAMA");

const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: null, raw: true });
const records = rows.slice(3).map((row, index) => ({
  excelRow: index + 4,
  temporada: row[0],
  especie: row[1],
  numeroAplicacion: row[2],
  epoca: row[3],
  etapa: row[4],
  fechaInicio: row[5],
  fechaTermino: row[6],
  objetivo: row[7],
  producto: row[8],
  tipo: row[9],
  litrosHa: row[10],
  dosis: row[11],
  unidad: row[12],
  carencia: row[13],
  observaciones: row[14]
})).filter((row) => [
  row.temporada, row.especie, row.numeroAplicacion, row.producto, row.objetivo
].some((value) => value !== null && value !== undefined && String(value).trim()));

fs.mkdirSync(path.dirname(path.resolve(outputPath)), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(records, null, 2)}\n`);
console.log(JSON.stringify({ sheet: "PROGRAMA", rows: records.length, output: path.resolve(outputPath) }, null, 2));
