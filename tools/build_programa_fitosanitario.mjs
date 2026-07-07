import fs from "node:fs";
import path from "node:path";

const sourcePath = process.argv[2];
if (!sourcePath || !fs.existsSync(sourcePath)) {
  throw new Error("Uso: node tools/build_programa_fitosanitario.mjs <programa_rows.json>");
}

const root = path.resolve(import.meta.dirname, "..");
const cleanEncoding = (value) => {
  if (value === null || value === undefined) return "";
  const text = String(value);
  if (!/[ÃÂ]/.test(text)) return text;
  return Buffer.from(text, "latin1").toString("utf8");
};
const cleanText = (value) => cleanEncoding(value).replace(/\r/g, "").replace(/[ \t]+/g, " ").replace(/ *\n */g, "\n").trim();
const compactText = (value) => cleanText(value).replace(/\s+/g, " ");
const normalizedName = (value) => compactText(value).toLocaleUpperCase("es-CL");
const numberOrNull = (value) => value === "" || value === null || value === undefined || !Number.isFinite(Number(value)) ? null : Number(value);
const excelDate = (value) => {
  if (!value) return "";
  if (typeof value === "number") return new Date(Date.UTC(1899, 11, 30 + value)).toISOString().slice(0, 10);
  return compactText(value);
};
const seasonInfo = (value) => {
  const raw = compactText(value);
  const match = raw.match(/(20\d{2})\D+(20\d{2})/);
  const startYear = Number(match?.[1]) || 0;
  const endYear = Number(match?.[2]) || startYear + 1;
  return { name: `CITRICOS TEMPORADA ${startYear}-${endYear}`, startYear, endYear };
};
const doseMeta = (unitValue) => {
  const unit = normalizedName(unitValue).replace(/\./g, "");
  if (["CC", "GR", "GRS", "GRS+"].includes(unit)) return { basis: "per_100l", outputUnit: unit === "CC" ? "L" : "kg", divisor: 1000 };
  if (unit === "CC/LTS") return { basis: "per_liter", outputUnit: "L", divisor: 1000 };
  if (["LTS/HA"].includes(unit)) return { basis: "per_ha", outputUnit: "L", divisor: 1 };
  if (["KG", "KGS", "KG/HA", "KG/H"].includes(unit)) return { basis: "per_ha", outputUnit: "kg", divisor: 1 };
  if (["GR/HA", "GR IA / HA", "GRIA/HA", "GRS ING / HA"].includes(unit)) return { basis: "per_ha", outputUnit: "kg", divisor: 1000 };
  if (["TABLETAS/HA", "PASTILLAS/HA"].includes(unit)) return { basis: "per_ha", outputUnit: "unidad", divisor: 1 };
  return { basis: "unknown", outputUnit: "kg/L", divisor: 1 };
};
const sqlQuote = (value) => value === null || value === undefined ? "null" : `'${String(value).replace(/'/g, "''")}'`;

const rawRows = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
const rows = rawRows.map((raw) => {
  const sourceSpecies = normalizedName(raw.especie);
  const crop = sourceSpecies === "NARANJOS" ? "NARANJA" : sourceSpecies;
  const season = seasonInfo(raw.temporada);
  const isLateSet = [146, 147, 148].includes(Number(raw.excelRow));
  const appNumber = numberOrNull(raw.numeroAplicacion) ?? (isLateSet ? 7 : null);
  const code = isLateSet ? "7-TARDIA" : String(appNumber ?? `SIN-NUMERO-${raw.excelRow}`);
  const productName = compactText(raw.producto) || (Number(raw.excelRow) === 220 ? "UREA" : "");
  const unit = compactText(raw.unidad);
  const dose = numberOrNull(raw.dosis);
  const meta = doseMeta(unit);
  return {
    excelRow: Number(raw.excelRow), season, sourceSpecies, crop, appNumber, code,
    epoch: excelDate(raw.epoca), stage: cleanText(raw.etapa), startDate: excelDate(raw.fechaInicio), endDate: excelDate(raw.fechaTermino),
    objective: cleanText(raw.objetivo), productName, productType: compactText(raw.tipo), waterHa: numberOrNull(raw.litrosHa),
    dose, doseUnit: unit, doseBasis: meta.basis, outputUnit: meta.outputUnit, divisor: meta.divisor,
    carency: cleanText(raw.carencia), observations: cleanText(raw.observaciones),
    incomplete: !productName || dose === null || meta.basis === "unknown"
  };
}).filter((row) => row.appNumber !== null && row.productName);

const groupMap = new Map();
for (const row of rows) {
  const key = `${row.season.name}|${row.crop}|${row.code}`;
  if (!groupMap.has(key)) groupMap.set(key, []);
  groupMap.get(key).push(row);
}
const distinct = (items) => [...new Set(items.filter(Boolean))];
const programs = [...groupMap.entries()].map(([sourceKey, group]) => {
  const first = group[0];
  const waterValues = group.map((row) => row.waterHa).filter((value) => value !== null);
  const waterHa = waterValues.length ? waterValues.sort((a, b) => a - b)[Math.floor(waterValues.length / 2)] : null;
  return {
    sourceKey,
    seasonName: first.season.name,
    startYear: first.season.startYear,
    endYear: first.season.endYear,
    number: first.appNumber,
    code: first.code,
    name: "Programa Fitosanitario",
    crop: first.crop,
    sourceSpecies: distinct(group.map((row) => row.sourceSpecies)).join(", "),
    epoch: distinct(group.map((row) => row.epoch)).join(" / "),
    stage: distinct(group.map((row) => row.stage)).join(" / "),
    startDate: first.startDate || "",
    endDate: first.endDate || "",
    objective: distinct(group.map((row) => row.objective)).join(" / "),
    waterHa,
    carency: distinct(group.map((row) => row.carency)).join(" / "),
    observations: distinct(group.map((row) => row.observations)).join("\n"),
    source: "PROGRAMA.xlsx",
    active: true,
    incomplete: group.some((row) => row.incomplete),
    products: group.map((row, index) => ({
      order: index + 1,
      excelRow: row.excelRow,
      name: row.productName,
      type: row.productType,
      dose: row.dose,
      unit: row.doseUnit,
      basis: row.doseBasis,
      outputUnit: row.outputUnit,
      divisor: row.divisor,
      incomplete: row.incomplete
    }))
  };
}).sort((a, b) => b.startYear - a.startYear || a.crop.localeCompare(b.crop) || a.number - b.number || a.code.localeCompare(b.code));

const catalog = {
  name: "Programa Fitosanitario",
  generatedAt: new Date().toISOString(),
  source: "PROGRAMA.xlsx",
  summary: {
    seasons: distinct(programs.map((item) => item.seasonName)).length,
    programs: programs.length,
    productLines: rows.length,
    uniqueProducts: distinct(rows.map((item) => normalizedName(item.productName))).length,
    incompleteLines: rows.filter((item) => item.incomplete).length
  },
  programs
};

fs.mkdirSync(path.join(root, "data"), { recursive: true });
fs.writeFileSync(path.join(root, "data", "programa_fitosanitario.json"), JSON.stringify(catalog, null, 2) + "\n");

const programRows = programs.map((program) => ({
  source_key: program.sourceKey,
  temporada: program.seasonName,
  anio_inicio: program.startYear,
  anio_fin: program.endYear,
  numero_programa: program.number,
  codigo_aplicacion: program.code,
  nombre: program.name,
  cultivo: program.crop,
  especie_fuente: program.sourceSpecies,
  epoca: program.epoch,
  etapa: program.stage,
  fecha_inicio: program.startDate || null,
  fecha_termino: program.endDate || null,
  objetivo: program.objective,
  agua_por_ha: program.waterHa,
  carencia: program.carency,
  observaciones: program.observations,
  fuente: program.source,
  incompleto: program.incomplete
}));
const productRows = programs.flatMap((program) => program.products.map((line) => ({
  source_key: program.sourceKey,
  orden: line.order,
  fila_excel: line.excelRow,
  nombre_producto: line.name,
  tipo_producto: line.type,
  dosis: line.dose,
  unidad_dosis: line.unit,
  base_dosis: line.basis,
  unidad_resultado: line.outputUnit,
  divisor_conversion: line.divisor,
  incompleto: line.incomplete
})));

const sql = `-- Programa Fitosanitario oficial generado desde PROGRAMA.xlsx.
-- Idempotente: puede ejecutarse nuevamente para actualizar el catalogo.
begin;

create extension if not exists pgcrypto;

alter table public.programas drop constraint if exists programas_temporada_id_numero_programa_key;
alter table public.programas drop constraint if exists programs_season_id_program_number_key;
alter table public.programas add column if not exists codigo_aplicacion text;
alter table public.programas add column if not exists clave_fuente text;
alter table public.programas add column if not exists epoca text;
alter table public.programas add column if not exists etapa text;
alter table public.programas add column if not exists carencia text;
alter table public.programas add column if not exists observaciones text;
alter table public.programas add column if not exists especie_fuente text;
alter table public.programas add column if not exists fuente text not null default 'manual';
alter table public.programas add column if not exists activo boolean not null default true;
alter table public.programas add column if not exists incompleto boolean not null default false;

create unique index if not exists programas_clave_fuente_uidx
  on public.programas (clave_fuente) where clave_fuente is not null;
create index if not exists programas_temporada_cultivo_numero_idx
  on public.programas (temporada_id, cultivo, numero_programa);

create table if not exists public.programa_productos (
  id uuid primary key default gen_random_uuid(),
  programa_id uuid not null references public.programas(id) on delete cascade,
  producto_id uuid references public.productos(id),
  nombre_producto_oficial text not null,
  tipo_producto text,
  dosis numeric(14,4),
  unidad_dosis text,
  base_dosis text not null default 'unknown' check (base_dosis in ('per_100l', 'per_liter', 'per_ha', 'unknown')),
  unidad_resultado text,
  divisor_conversion numeric(14,4) not null default 1,
  orden integer not null default 1,
  fila_excel integer,
  incompleto boolean not null default false,
  creado_en timestamptz not null default now(),
  unique (programa_id, orden)
);
create index if not exists programa_productos_programa_id_idx on public.programa_productos(programa_id);
create index if not exists programa_productos_producto_id_idx on public.programa_productos(producto_id);

alter table public.orden_productos add column if not exists programa_producto_id uuid references public.programa_productos(id);
alter table public.orden_productos add column if not exists dosis numeric(14,4);
alter table public.orden_productos add column if not exists unidad_dosis text;
alter table public.orden_productos add column if not exists base_dosis text;
alter table public.orden_productos add column if not exists unidad_resultado text;
alter table public.orden_productos add column if not exists divisor_conversion numeric(14,4) not null default 1;

create temporary table tmp_programas_fitosanitarios as
select * from jsonb_to_recordset($programas$${JSON.stringify(programRows)}$programas$::jsonb) as x(
  source_key text, temporada text, anio_inicio int, anio_fin int, numero_programa int,
  codigo_aplicacion text, nombre text, cultivo text, especie_fuente text, epoca text,
  etapa text, fecha_inicio date, fecha_termino date, objetivo text, agua_por_ha numeric,
  carencia text, observaciones text, fuente text, incompleto boolean
);

insert into public.temporadas (nombre, anio_inicio, anio_fin, estado)
select distinct temporada, anio_inicio, anio_fin, 'activa'
from tmp_programas_fitosanitarios
on conflict (nombre) do update set anio_inicio = excluded.anio_inicio, anio_fin = excluded.anio_fin;

with productos_fuente as (
  select p.*,
    lower(regexp_replace(trim(p.nombre_producto), '\\s+', ' ', 'g')) as nombre_normalizado
  from jsonb_to_recordset($productos$${JSON.stringify(productRows)}$productos$::jsonb) as p(
    source_key text, orden int, fila_excel int, nombre_producto text, tipo_producto text,
    dosis numeric, unidad_dosis text, base_dosis text, unidad_resultado text,
    divisor_conversion numeric, incompleto boolean
  )
), productos_unicos as (
  select distinct on (nombre_normalizado) *
  from productos_fuente
  order by nombre_normalizado, incompleto asc, fila_excel asc
)
insert into public.productos (nombre, unidad, dosis_por_100, horas_reingreso, dias_carencia, stock_minimo, stock_actual, costo_unitario, activo)
select p.nombre_producto,
  case when p.unidad_resultado = 'L' then 'L' when p.unidad_resultado = 'unidad' then 'unidad' else 'kg' end,
  coalesce(case when p.base_dosis = 'per_100l' then p.dosis end, 0), 24, 0, 0, 0, 0, true
from productos_unicos p
where not exists (
  select 1 from public.productos actual
  where lower(regexp_replace(trim(actual.nombre), '\\s+', ' ', 'g')) = lower(regexp_replace(trim(p.nombre_producto), '\\s+', ' ', 'g'))
);

insert into public.programas (
  temporada_id, numero_programa, codigo_aplicacion, clave_fuente, nombre, cultivo,
  especie_fuente, epoca, etapa, fecha_inicio, fecha_termino, objetivo, agua_por_ha,
  carencia, observaciones, fuente, activo, incompleto, notas
)
select t.id, x.numero_programa, x.codigo_aplicacion, x.source_key, x.nombre, x.cultivo,
  x.especie_fuente, x.epoca, x.etapa, x.fecha_inicio, x.fecha_termino, x.objetivo,
  x.agua_por_ha, x.carencia, x.observaciones, x.fuente, true, x.incompleto,
  'Importado desde PROGRAMA.xlsx'
from tmp_programas_fitosanitarios x
join public.temporadas t on t.nombre = x.temporada
on conflict (clave_fuente) where clave_fuente is not null do update set
  temporada_id = excluded.temporada_id,
  numero_programa = excluded.numero_programa,
  codigo_aplicacion = excluded.codigo_aplicacion,
  nombre = excluded.nombre,
  cultivo = excluded.cultivo,
  especie_fuente = excluded.especie_fuente,
  epoca = excluded.epoca,
  etapa = excluded.etapa,
  fecha_inicio = excluded.fecha_inicio,
  fecha_termino = excluded.fecha_termino,
  objetivo = excluded.objetivo,
  agua_por_ha = excluded.agua_por_ha,
  carencia = excluded.carencia,
  observaciones = excluded.observaciones,
  fuente = excluded.fuente,
  activo = true,
  incompleto = excluded.incompleto;

create temporary table tmp_programa_productos as
select * from jsonb_to_recordset($productos$${JSON.stringify(productRows)}$productos$::jsonb) as x(
  source_key text, orden int, fila_excel int, nombre_producto text, tipo_producto text,
  dosis numeric, unidad_dosis text, base_dosis text, unidad_resultado text,
  divisor_conversion numeric, incompleto boolean
);

delete from public.programa_productos pp
using public.programas pr
where pp.programa_id = pr.id
  and pr.fuente = 'PROGRAMA.xlsx';

insert into public.programa_productos (
  programa_id, producto_id, nombre_producto_oficial, tipo_producto, dosis,
  unidad_dosis, base_dosis, unidad_resultado, divisor_conversion, orden,
  fila_excel, incompleto
)
select pr.id, prod.id, x.nombre_producto, x.tipo_producto, x.dosis,
  x.unidad_dosis, x.base_dosis, x.unidad_resultado, x.divisor_conversion,
  x.orden, x.fila_excel, x.incompleto
from tmp_programa_productos x
join public.programas pr on pr.clave_fuente = x.source_key
left join public.productos prod
  on lower(regexp_replace(trim(prod.nombre), '\\s+', ' ', 'g')) = lower(regexp_replace(trim(x.nombre_producto), '\\s+', ' ', 'g'))
on conflict (programa_id, orden) do update set
  producto_id = excluded.producto_id,
  nombre_producto_oficial = excluded.nombre_producto_oficial,
  tipo_producto = excluded.tipo_producto,
  dosis = excluded.dosis,
  unidad_dosis = excluded.unidad_dosis,
  base_dosis = excluded.base_dosis,
  unidad_resultado = excluded.unidad_resultado,
  divisor_conversion = excluded.divisor_conversion,
  fila_excel = excluded.fila_excel,
  incompleto = excluded.incompleto;

alter table public.programa_productos enable row level security;
drop policy if exists "programa productos read roles" on public.programa_productos;
drop policy if exists "programa productos supervisor write" on public.programa_productos;
create policy "programa productos read roles" on public.programa_productos
for select using (public.current_app_role() in ('admin', 'supervisor', 'bodeguero'));
create policy "programa productos supervisor write" on public.programa_productos
for all using (public.current_app_role() in ('admin', 'supervisor'))
with check (public.current_app_role() in ('admin', 'supervisor'));

do $$ begin
  alter publication supabase_realtime add table public.programa_productos;
exception when duplicate_object then null;
end $$;

commit;

select
  (select count(*) from public.programas where fuente = 'PROGRAMA.xlsx') as programas_oficiales,
  (select count(*) from public.programa_productos pp join public.programas p on p.id = pp.programa_id where p.fuente = 'PROGRAMA.xlsx') as lineas_producto,
  (select count(*) from public.programa_productos pp join public.programas p on p.id = pp.programa_id where p.fuente = 'PROGRAMA.xlsx' and pp.incompleto) as lineas_por_revisar;
`;

fs.writeFileSync(path.join(root, "supabase_programa_fitosanitario.sql"), sql);

const report = `# Importacion Programa Fitosanitario\n\n- Programas oficiales: ${catalog.summary.programs}\n- Lineas de producto: ${catalog.summary.productLines}\n- Productos unicos: ${catalog.summary.uniqueProducts}\n- Lineas por revisar: ${catalog.summary.incompleteLines}\n\n## Criterios aplicados\n\n- \`NARANJOS\` se normaliza como \`NARANJA\`; el valor original queda en \`especie_fuente\`.\n- Las filas 146 a 148 sin numero se agrupan como aplicacion \`7-TARDIA\`, porque forman la etapa de cuaja tardia entre las aplicaciones 7 y 8.\n- La fila 220 se registra como \`UREA\`, indicada expresamente en el objetivo de esa fila.\n- Las dosis ausentes o unidades no interpretables quedan con \`incompleto = true\`; no se inventan cantidades.\n- Las fechas numericas de Excel se convierten a fecha ISO.\n\n## Filas por revisar\n\n- 68: GARLON sin dosis.\n- 81 y 84: PROTECTOR SOLAR sin dosis ni unidad.\n- 190: ENVIDOR con dosis, pero sin unidad.\n- 224 a 227: FOSTROL, FOSFIMAX4020, FOSFIMAX y BIOREND sin dosis.\n- 235: POLI MAGNESIO contiene \`200\` en la columna unidad.\n\nEstas lineas aparecen en el catalogo, pero no se copian a una orden hasta completar su dosis oficial.\n\n## Ejecucion\n\nEjecuta \`supabase_programa_fitosanitario.sql\` completo en Supabase SQL Editor. El bloque final informa cuantas filas quedaron cargadas.\n`;
fs.writeFileSync(path.join(root, "PROGRAMA_FITOSANITARIO_IMPORTACION.md"), report);

console.log(JSON.stringify(catalog.summary, null, 2));
