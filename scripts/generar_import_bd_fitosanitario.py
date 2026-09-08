from __future__ import annotations

import argparse
import hashlib
import json
import math
import re
import unicodedata
from collections import Counter
from datetime import date, datetime, time
from pathlib import Path
from typing import Any, Iterable

import pandas as pd


SOURCE_NAME = "BD FITOSANITARIO.xlsx"


def text_value(value: Any) -> str | None:
    if value is None or (not isinstance(value, (list, tuple, dict)) and pd.isna(value)):
        return None
    value = str(value).strip()
    if not value or value.lower() in {"0", "0.0", "nan", "nat", "null", "none"}:
        return None
    return re.sub(r"\s+", " ", value)


def normalized(value: Any) -> str:
    value = text_value(value) or ""
    value = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode()
    value = re.sub(r"[^A-Za-z0-9]+", " ", value).upper()
    return re.sub(r"\s+", " ", value).strip()


def product_key(value: Any) -> str:
    return re.sub(r"[^A-Z0-9]", "", normalized(value))


def number_value(value: Any, positive: bool = False) -> float | None:
    if value is None or (not isinstance(value, (list, tuple, dict)) and pd.isna(value)):
        return None
    if isinstance(value, str):
        value = value.strip()
        if "," in value and "." in value:
            value = value.replace(".", "").replace(",", ".")
        elif "," in value:
            value = value.replace(",", ".")
        if not value or value == "00:00:00":
            return None
    try:
        result = float(value)
    except (TypeError, ValueError):
        return None
    if positive and result <= 0:
        return None
    return result


def integer_value(value: Any, positive: bool = False) -> int | None:
    result = number_value(value, positive=positive)
    if result is None or not float(result).is_integer():
        return None
    return int(result)


def date_value(value: Any) -> date | None:
    if value is None or (not isinstance(value, (list, tuple, dict)) and pd.isna(value)):
        return None
    if isinstance(value, datetime):
        return value.date() if value.year >= 2000 else None
    if isinstance(value, date):
        return value if value.year >= 2000 else None
    if isinstance(value, time):
        return None
    if isinstance(value, (int, float)) and value > 20000:
        parsed = pd.Timestamp("1899-12-30") + pd.to_timedelta(float(value), unit="D")
    else:
        raw = str(value).strip()
        if not raw or re.fullmatch(r"\d{1,2}:\d{2}(:\d{2})?", raw):
            return None
        parsed = pd.to_datetime(raw, errors="coerce", dayfirst=True)
    if pd.isna(parsed) or parsed.year < 2000:
        return None
    return parsed.date()


def time_value(value: Any) -> str | None:
    if value is None or (not isinstance(value, (list, tuple, dict)) and pd.isna(value)):
        return None
    if isinstance(value, datetime):
        value = value.time()
    if isinstance(value, time):
        return value.replace(microsecond=0).isoformat()
    raw = str(value).strip()
    if not raw or raw in {"0", "00:00:00"}:
        return None
    parsed = pd.to_datetime(raw, errors="coerce")
    if pd.isna(parsed):
        return None
    return parsed.time().replace(microsecond=0).isoformat()


def mode(values: Iterable[Any]) -> Any:
    cleaned = []
    for value in values:
        if value in (None, "", 0, 0.0):
            continue
        if not isinstance(value, (list, tuple, dict)) and pd.isna(value):
            continue
        cleaned.append(value)
    if not cleaned:
        return None
    return Counter(cleaned).most_common(1)[0][0]


def max_positive(values: Iterable[Any]) -> float | None:
    cleaned = [number_value(value, positive=True) for value in values]
    cleaned = [value for value in cleaned if value is not None]
    return max(cleaned) if cleaned else None


def season_for(value: date) -> tuple[str, int, int]:
    start = value.year if value.month >= 8 else value.year - 1
    end = start + 1
    return f"APLICACIONES HISTORICAS {start}-{end}", start, end


def block_values(value: Any) -> list[str]:
    raw = text_value(value)
    if not raw:
        return []
    raw = raw.upper().replace("BLOQUES", "").replace("BLOQUE", "").strip()
    range_match = re.fullmatch(r"(\d+)\s+AL\s+(\d+)", raw)
    if range_match:
        start, end = map(int, range_match.groups())
        return [str(item) for item in range(min(start, end), max(start, end) + 1)]
    compact_range = re.fullmatch(r"(\d+)\s*-\s*(\d+)", raw)
    if compact_range:
        start, end = map(int, compact_range.groups())
        if start <= end and end - start <= 15:
            return [str(item) for item in range(start, end + 1)]
    values = [item for item in re.split(r"\s*[-,;/]+\s*", raw) if item]
    return list(dict.fromkeys(values))


def source_key(kind: str, *parts: Any) -> str:
    raw = "|".join(normalized(part) for part in parts)
    digest = hashlib.sha256(raw.encode("utf-8")).hexdigest()[:20]
    return f"BD_FITOSANITARIO|{kind}|{digest}"


def json_default(value: Any) -> Any:
    if isinstance(value, (date, datetime)):
        return value.isoformat()
    raise TypeError(f"Unsupported JSON value: {type(value)!r}")


def recordset_insert(
    table: str,
    rows: list[dict[str, Any]],
    columns: list[tuple[str, str]],
    conflict: str,
    batch_size: int = 250,
) -> str:
    if not rows:
        return f"-- No hay filas para {table}.\n"
    result: list[str] = []
    names = ", ".join(name for name, _ in columns)
    signature = ",\n  ".join(f"{name} {sql_type}" for name, sql_type in columns)
    update_columns = [name for name, _ in columns if name not in {"clave_fuente", "archivo_origen"}]
    updates = ",\n  ".join(f"{name} = excluded.{name}" for name in update_columns)
    for batch_index in range(0, len(rows), batch_size):
        batch = rows[batch_index : batch_index + batch_size]
        payload = json.dumps(
            batch, ensure_ascii=False, separators=(",", ":"), default=json_default, allow_nan=False
        )
        tag = f"data_{table.replace('.', '_')}_{batch_index // batch_size + 1}"
        result.append(
            f"insert into {table} ({names})\n"
            f"select {names}\n"
            f"from jsonb_to_recordset(${tag}${payload}${tag}$::jsonb) as x(\n  {signature}\n)\n"
            f"on conflict ({conflict}) do update set\n  {updates};\n"
        )
    return "\n".join(result)


def load_workbook(path: Path) -> dict[str, pd.DataFrame]:
    return {
        "programa": pd.read_excel(path, sheet_name="PROGRAMA", header=2, dtype=object),
        "productos": pd.read_excel(path, sheet_name="PRODUCTOS", header=0, dtype=object),
        "orden": pd.read_excel(path, sheet_name="ORDEN", header=1, dtype=object),
        "salida": pd.read_excel(path, sheet_name="SALIDA", header=1, dtype=object),
        "aplicacion": pd.read_excel(path, sheet_name="APLICACION", header=1, dtype=object),
    }


def build_records(frames: dict[str, pd.DataFrame]) -> dict[str, list[dict[str, Any]]]:
    program_frame = frames["programa"]
    program_frame = program_frame.loc[:, ~program_frame.columns.astype(str).str.startswith("Unnamed")]
    program_frame = program_frame.iloc[:, :15].dropna(how="all").copy()
    unit_votes: dict[str, list[str]] = {}
    for _, program_row in program_frame.iterrows():
        name = text_value(program_row.iloc[8])
        unit = normalized(program_row.iloc[12])
        if not name or not unit:
            continue
        if any(token in unit for token in ("CC", "LTS", "LITRO")):
            inferred = "L"
        elif any(token in unit for token in ("GR", "KG", "PASTILLA", "TABLETA")):
            inferred = "kg"
        else:
            continue
        unit_votes.setdefault(product_key(name), []).append(inferred)

    def inferred_unit(name: str) -> str:
        votes = unit_votes.get(product_key(name), [])
        if votes:
            return Counter(votes).most_common(1)[0][0]
        normalized_name = normalized(name)
        if re.search(r"(?:EC|SC|SL|EW|CS|OD|ME)$", normalized_name.replace(" ", "")):
            return "L"
        return "kg"

    products_frame = frames["productos"].iloc[:, :7].dropna(how="all").copy()
    products_frame["_excel_row"] = products_frame.index + 2
    orders = frames["orden"].iloc[:, :22].dropna(how="all").copy()
    orders["_excel_row"] = orders.index + 3
    outputs = frames["salida"].iloc[:, :10].dropna(how="all").copy()
    outputs["_excel_row"] = outputs.index + 3
    bridge = frames["aplicacion"].iloc[:, :32].dropna(how="all").copy()
    bridge["_excel_row"] = bridge.index + 3

    exceptions: list[dict[str, Any]] = []
    product_catalog: dict[str, dict[str, Any]] = {}
    for _, row in products_frame.iterrows():
        name = text_value(row.iloc[1])
        if not name:
            continue
        normalized_name = normalized(name)
        key = product_key(name)
        reentry = integer_value(re.search(r"\d+", text_value(row.iloc[3]) or "").group() if re.search(r"\d+", text_value(row.iloc[3]) or "") else None)
        label = text_value(row.iloc[4])
        agenda = text_value(row.iloc[5])
        product_catalog[key] = {
            "archivo_origen": SOURCE_NAME,
            "clave_fuente": source_key("PRODUCTO", key),
            "fila_excel": int(row["_excel_row"]),
            "nombre": name,
            "nombre_normalizado": normalized_name,
            "nombre_clave": key,
            "ingrediente_activo": text_value(row.iloc[2]),
            "unidad": inferred_unit(name),
            "dosis_por_100": number_value(row.iloc[6]) or 0,
            "horas_reingreso": reentry or 24,
            "carencia_etiqueta": label,
            "carencia_agenda_pesticidas": agenda,
            "objetivo_operacional": text_value(row.iloc[0]),
            "incompleto": False,
        }

    # ORDEN is authoritative for orders, sectors and recipes. APLICACION is only
    # used later as a bridge between the internal output id and order number.
    orders["_order"] = orders.iloc[:, 0].map(lambda value: integer_value(value, positive=True))
    orders["_order_date"] = orders.iloc[:, 1].map(date_value)
    orders["_order_run"] = orders["_order"].ne(orders["_order"].shift()).cumsum()
    run_dates: dict[int, set[date]] = {}
    for _, row in orders[orders["_order_date"].notna()].iterrows():
        run_dates.setdefault(int(row["_order_run"]), set()).add(row["_order_date"])
    date_candidates: dict[int, set[date]] = {}
    for _, row in orders[orders["_order"].notna() & orders["_order_date"].notna()].iterrows():
        date_candidates.setdefault(int(row["_order"]), set()).add(row["_order_date"])
    bridge_date_candidates: dict[int, set[date]] = {}
    for _, bridge_row in bridge.iterrows():
        business_order = integer_value(bridge_row.iloc[10], positive=True)
        bridge_date = date_value(bridge_row.iloc[11]) or date_value(bridge_row.iloc[4])
        if business_order and bridge_date:
            bridge_date_candidates.setdefault(business_order, set()).add(bridge_date)
    for index, row in orders.iterrows():
        if row["_order_date"] or pd.isna(row["_order"]):
            continue
        current_run_dates = run_dates.get(int(row["_order_run"]), set())
        if len(current_run_dates) == 1:
            orders.at[index, "_order_date"] = next(iter(current_run_dates))
            continue
        candidates = date_candidates.get(int(row["_order"]), set())
        if len(candidates) == 1:
            orders.at[index, "_order_date"] = next(iter(candidates))
            continue
        bridge_candidates = bridge_date_candidates.get(int(row["_order"]), set())
        bridge_seasons = {season_for(value) for value in bridge_candidates}
        if len(bridge_seasons) == 1:
            orders.at[index, "_order_date"] = min(bridge_candidates)
    orders["_season"] = orders["_order_date"].map(lambda value: season_for(value) if value else None)

    valid = orders[orders["_order"].notna() & orders["_season"].notna()].copy()
    invalid = orders[orders["_order"].notna() & orders["_season"].isna()]
    for _, row in invalid.iterrows():
        exceptions.append(
            {
                "archivo_origen": SOURCE_NAME,
                "hoja_origen": "ORDEN",
                "fila_excel": int(row["_excel_row"]),
                "tipo": "ORDEN_SIN_TEMPORADA",
                "detalle": "No existe una fecha valida para determinar la temporada de la orden.",
                "datos": {"numero_orden": row["_order"]},
            }
        )

    valid["_season_name"] = valid["_season"].map(lambda value: value[0])
    valid["_season_start"] = valid["_season"].map(lambda value: value[1])
    valid["_season_end"] = valid["_season"].map(lambda value: value[2])
    valid["_order_key"] = valid.apply(lambda row: (row["_season_name"], int(row["_order"])), axis=1)

    # Add historical names to staging, but never create them automatically in the
    # operational master. The processing SQL only accepts a unique exact match.
    for _, row in valid.iterrows():
        name = text_value(row.iloc[11])
        if not name:
            continue
        normalized_name = normalized(name)
        key = product_key(name)
        existing = product_catalog.get(key)
        if existing:
            continue
        reentry = integer_value(row.iloc[13], positive=True) or 24
        product_catalog[key] = {
            "archivo_origen": SOURCE_NAME,
            "clave_fuente": source_key("PRODUCTO", key),
            "fila_excel": int(row["_excel_row"]),
            "nombre": name,
            "nombre_normalizado": normalized_name,
            "nombre_clave": key,
            "ingrediente_activo": None,
            "unidad": inferred_unit(name),
            "dosis_por_100": number_value(row.iloc[12], positive=True) or 0,
            "horas_reingreso": reentry,
            "carencia_etiqueta": text_value(row.iloc[14]),
            "carencia_agenda_pesticidas": text_value(row.iloc[15]),
            "objetivo_operacional": None,
            "incompleto": True,
        }

    sector_rows: list[dict[str, Any]] = []
    sector_lookup: dict[tuple[Any, ...], str] = {}
    valid["_potrero"] = valid.iloc[:, 3].map(text_value)
    valid["_bloque"] = valid.iloc[:, 4].map(text_value)
    valid["_hectareas"] = valid.iloc[:, 5].map(lambda value: number_value(value, positive=True))
    valid["_especie"] = valid.iloc[:, 6].map(text_value)
    valid["_variedad"] = valid.iloc[:, 7].map(text_value)

    grouped_sectors = valid.groupby(
        ["_season_name", "_order", "_potrero", "_bloque", "_hectareas", "_especie", "_variedad"],
        dropna=False,
        sort=False,
    )
    for key, group in grouped_sectors:
        season_name, order_number, potrero, block_text, hectares, species, variety = key
        potrero = None if pd.isna(potrero) else potrero
        block_text = None if pd.isna(block_text) else block_text
        hectares = None if pd.isna(hectares) else float(hectares)
        species = None if pd.isna(species) else species
        variety = None if pd.isna(variety) else variety
        blocks = block_values(block_text)
        stable_key = source_key(
            "SECTOR", season_name, order_number, potrero, block_text, hectares, species, variety
        )
        lookup_key = (season_name, int(order_number), potrero, block_text, hectares, species, variety)
        sector_lookup[lookup_key] = stable_key
        dates = [value for value in group["_order_date"] if value]
        sector_rows.append(
            {
                "archivo_origen": SOURCE_NAME,
                "clave_fuente": stable_key,
                "fila_excel_inicio": int(group["_excel_row"].min()),
                "temporada": season_name,
                "numero_orden": int(order_number),
                "fecha_orden": min(dates).isoformat() if dates else None,
                "potrero": potrero,
                "bloque_origen": block_text,
                "bloques": blocks,
                "hectareas": hectares or 0,
                "especie": species,
                "variedad": variety,
                "litros_planificados": max_positive(group.iloc[:, 8]) or 0,
                "metodo_aplicacion": mode(group.iloc[:, 9].map(text_value)),
                "mojamiento_l_ha": max_positive(group.iloc[:, 10]) or 0,
                "velocidad": max_positive(group.iloc[:, 16]),
                "marcha": mode(group.iloc[:, 17].map(text_value)),
                "cantidad_boquillas": integer_value(mode(group.iloc[:, 18]), positive=True),
                "tipo_boquilla": mode(group.iloc[:, 19].map(text_value)),
                "color_boquilla": mode(group.iloc[:, 20].map(text_value)),
                "presion_bar": max_positive(group.iloc[:, 21]),
            }
        )

    order_rows: list[dict[str, Any]] = []
    for (season_name, order_number), group in valid.groupby("_order_key", sort=False):
        season_start = int(group["_season_start"].iloc[0])
        season_end = int(group["_season_end"].iloc[0])
        group_sectors = [row for row in sector_rows if row["temporada"] == season_name and row["numero_orden"] == order_number]
        dates = [value for value in group["_order_date"] if value]
        program_numbers = sorted(
            set(filter(None, (integer_value(value, positive=True) for value in group.iloc[:, 2])))
        )
        representative = next((item for item in group_sectors if item["potrero"]), None)
        if representative is None:
            representative = group_sectors[0] if group_sectors else None
        order_rows.append(
            {
                "archivo_origen": SOURCE_NAME,
                "clave_fuente": source_key("ORDEN", season_name, order_number),
                "temporada": season_name,
                "anio_inicio": season_start,
                "anio_fin": season_end,
                "numero_orden": int(order_number),
                "fecha": min(dates).isoformat(),
                "numero_programa": program_numbers[0] if len(program_numbers) == 1 else None,
                "numeros_programa": program_numbers,
                "programa_origen": mode(group.iloc[:, 2].map(text_value)),
                "especie": mode(group["_especie"]),
                "variedad": mode(group["_variedad"]),
                "potrero_cabecera": representative["potrero"] if representative and representative["potrero"] else "NO INFORMADO",
                "bloques_cabecera": representative["bloques"] if representative else [],
                "hectareas": round(sum(item["hectareas"] for item in group_sectors), 3),
                "agua_por_ha": max((item["mojamiento_l_ha"] for item in group_sectors), default=0),
                "metodo_aplicacion": mode(item["metodo_aplicacion"] for item in group_sectors),
                "multisector": len(group_sectors) > 1,
            }
        )

    order_product_rows: list[dict[str, Any]] = []
    product_valid = valid[valid.iloc[:, 11].map(text_value).notna()].copy()
    product_valid["_product_name"] = product_valid.iloc[:, 11].map(text_value)
    product_valid["_product_norm"] = product_valid["_product_name"].map(normalized)
    product_valid["_product_key"] = product_valid["_product_name"].map(product_key)
    product_valid["_program_number"] = product_valid.iloc[:, 2].map(
        lambda value: integer_value(value, positive=True)
    )
    for key, group in product_valid.groupby(
        ["_season_name", "_order", "_product_key", "_program_number"],
        sort=False,
        dropna=False,
    ):
        season_name, order_number, compact_product_key, program_number = key
        doses = [number_value(value, positive=True) for value in group.iloc[:, 12]]
        doses = [value for value in doses if value is not None]
        program_number = None if pd.isna(program_number) else int(program_number)
        order_product_rows.append(
            {
                "archivo_origen": SOURCE_NAME,
                "clave_fuente": source_key(
                    "ORDEN_PRODUCTO", season_name, order_number, compact_product_key, program_number
                ),
                "fila_excel_inicio": int(group["_excel_row"].min()),
                "temporada": season_name,
                "numero_orden": int(order_number),
                "producto_nombre": mode(group["_product_name"]),
                "producto_normalizado": mode(group["_product_norm"]),
                "producto_clave": compact_product_key,
                "numero_programa": program_number,
                "dosis_por_100": mode(doses) or 0,
                "periodo_reingreso": mode(group.iloc[:, 13].map(text_value)),
                "carencia_etiqueta": mode(group.iloc[:, 14].map(text_value)),
                "carencia_agenda_pesticidas": mode(group.iloc[:, 15].map(text_value)),
            }
        )

    # Bridge internal ids from APLICACION to the authoritative order key.
    valid_order_keys = {
        (row["temporada"], row["numero_orden"]): row for row in order_rows
    }
    order_keys_by_number: dict[int, list[tuple[str, int]]] = {}
    for order_key in valid_order_keys:
        order_keys_by_number.setdefault(order_key[1], []).append(order_key)
    bridge_links: dict[int, set[tuple[str, int]]] = {}
    bridge_ids: set[int] = set()
    for _, row in bridge.iterrows():
        internal_id = integer_value(row.iloc[0], positive=True)
        business_order = integer_value(row.iloc[10], positive=True)
        if not internal_id:
            continue
        bridge_ids.add(internal_id)
        if not business_order:
            continue
        candidates = order_keys_by_number.get(business_order, [])
        bridge_date = date_value(row.iloc[11]) or date_value(row.iloc[4])
        if bridge_date:
            expected_season = season_for(bridge_date)[0]
            dated = [candidate for candidate in candidates if candidate[0] == expected_season]
            if dated:
                candidates = dated
        for candidate in candidates:
            bridge_links.setdefault(internal_id, set()).add(candidate)

    order_date_lookup = {
        (row["temporada"], row["numero_orden"]): date.fromisoformat(row["fecha"])
        for row in order_rows
    }
    dispatch_rows: list[dict[str, Any]] = []
    zero_output_rows: list[int] = []
    output_ids: set[int] = set()
    for _, row in outputs.iterrows():
        internal_id = integer_value(row.iloc[0], positive=True)
        excel_row = int(row["_excel_row"])
        if not internal_id:
            zero_output_rows.append(excel_row)
            continue
        output_ids.add(internal_id)
        linked_orders = bridge_links.get(internal_id, set())
        if len(linked_orders) != 1:
            exceptions.append(
                {
                    "archivo_origen": SOURCE_NAME,
                    "hoja_origen": "SALIDA",
                    "fila_excel": excel_row,
                    "tipo": "SALIDA_SIN_ORDEN_UNICA",
                    "detalle": "El correlativo interno no se pudo asociar a una sola orden operacional.",
                    "datos": {
                        "id_orden": internal_id,
                        "ordenes_candidatas": sorted(f"{season}|{order}" for season, order in linked_orders),
                    },
                }
            )
            continue
        season_name, order_number = next(iter(linked_orders))
        order_date = order_date_lookup[(season_name, order_number)]
        dispatch_date = date_value(row.iloc[4]) or order_date
        finish_date = date_value(row.iloc[7])
        start_time = time_value(row.iloc[5])
        finish_time = time_value(row.iloc[8])
        dispatch_rows.append(
            {
                "archivo_origen": SOURCE_NAME,
                "clave_fuente": source_key("DESPACHO", internal_id, excel_row),
                "fila_excel_inicio": excel_row,
                "filas_excel": [excel_row],
                "temporada": season_name,
                "numero_orden": order_number,
                "folio_origen": str(internal_id),
                "fecha": dispatch_date.isoformat(),
                "hora_salida": start_time,
                "litros_salida": number_value(row.iloc[6], positive=True) or 0,
                "fecha_termino": finish_date.isoformat() if finish_date else None,
                "hora_termino": finish_time,
                "litros_aplicados": number_value(row.iloc[9], positive=True) or 0,
                "aplicador": text_value(row.iloc[1]),
                "codigo_tractor": text_value(row.iloc[2]),
                "codigo_maquinaria": text_value(row.iloc[3]),
            }
        )
    if zero_output_rows:
        exceptions.append(
            {
                "archivo_origen": SOURCE_NAME,
                "hoja_origen": "SALIDA",
                "fila_excel": None,
                "tipo": "SALIDAS_SIN_CORRELATIVO",
                "detalle": "Las salidas con ID ORDEN 0 o vacio no se importan porque no se pueden enlazar de forma segura.",
                "datos": {"total": len(zero_output_rows), "filas_muestra": zero_output_rows[:30]},
            }
        )
    orphan_bridge_ids = sorted(bridge_ids - output_ids)
    if orphan_bridge_ids:
        exceptions.append(
            {
                "archivo_origen": SOURCE_NAME,
                "hoja_origen": "APLICACION",
                "fila_excel": None,
                "tipo": "CORRELATIVOS_SIN_SALIDA",
                "detalle": "Hay correlativos en APLICACION que no existen en la hoja SALIDA.",
                "datos": {"ids": orphan_bridge_ids},
            }
        )

    return {
        "productos": sorted(product_catalog.values(), key=lambda row: row["nombre_normalizado"]),
        "ordenes": sorted(order_rows, key=lambda row: (row["temporada"], row["numero_orden"])),
        "sectores": sorted(sector_rows, key=lambda row: (row["temporada"], row["numero_orden"], row["clave_fuente"])),
        "orden_productos": sorted(
            order_product_rows, key=lambda row: (row["temporada"], row["numero_orden"], row["producto_clave"])
        ),
        "despachos": sorted(dispatch_rows, key=lambda row: (row["temporada"], row["numero_orden"], row["fecha"])),
        "excepciones": exceptions,
    }


def schema_sql() -> str:
    return """-- Extensiones y estructura para importar BD FITOSANITARIO.xlsx.
-- Ejecutar una vez antes de los archivos de datos y procesamiento.

begin;

create extension if not exists pgcrypto;
create schema if not exists importacion;

alter table public.productos
  add column if not exists nombre_normalizado text,
  add column if not exists carencia_etiqueta text,
  add column if not exists carencia_agenda_pesticidas text,
  add column if not exists objetivo_operacional text,
  add column if not exists fuente_operacional text,
  add column if not exists incompleto_operacional boolean not null default false;

alter table public.ordenes_aplicacion
  add column if not exists clave_fuente text,
  add column if not exists archivo_origen text,
  add column if not exists importado boolean not null default false,
  add column if not exists multisector boolean not null default false,
  add column if not exists metodo_aplicacion text,
  add column if not exists programa_origen text;

create unique index if not exists ordenes_aplicacion_clave_fuente_uidx
  on public.ordenes_aplicacion (clave_fuente) where clave_fuente is not null;

alter table public.orden_productos
  add column if not exists dosis numeric(14,4),
  add column if not exists unidad_dosis text,
  add column if not exists base_dosis text,
  add column if not exists unidad_resultado text,
  add column if not exists divisor_conversion numeric(14,4) not null default 1,
  add column if not exists clave_fuente text,
  add column if not exists archivo_origen text,
  add column if not exists fila_excel integer,
  add column if not exists nombre_producto_origen text,
  add column if not exists periodo_reingreso_origen text,
  add column if not exists carencia_etiqueta text,
  add column if not exists carencia_agenda_pesticidas text;

create unique index if not exists orden_productos_clave_fuente_uidx
  on public.orden_productos (clave_fuente) where clave_fuente is not null;

alter table public.despachos
  add column if not exists clave_fuente text,
  add column if not exists archivo_origen text,
  add column if not exists fila_excel integer,
  add column if not exists folio_origen text,
  add column if not exists fecha_termino date,
  add column if not exists hora_salida time,
  add column if not exists hora_termino time,
  add column if not exists litros_aplicados numeric(14,2) not null default 0,
  add column if not exists aplicador_nombre_origen text;

create unique index if not exists despachos_clave_fuente_uidx
  on public.despachos (clave_fuente) where clave_fuente is not null;

create table if not exists public.orden_sectores (
  id uuid primary key default gen_random_uuid(),
  orden_id uuid not null references public.ordenes_aplicacion(id) on delete cascade,
  campo_id uuid references public.campos(id) on update cascade on delete set null,
  clave_fuente text not null unique,
  archivo_origen text not null,
  fila_excel integer,
  fecha_orden date,
  potrero text,
  bloque_origen text,
  bloques text[] not null default '{}',
  hectareas numeric(14,3) not null default 0,
  especie text,
  variedad text,
  litros_planificados numeric(14,2) not null default 0,
  metodo_aplicacion text,
  mojamiento_l_ha numeric(14,2) not null default 0,
  velocidad numeric(14,3),
  marcha text,
  cantidad_boquillas integer,
  tipo_boquilla text,
  color_boquilla text,
  presion_bar numeric(14,3),
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

create index if not exists orden_sectores_orden_idx on public.orden_sectores (orden_id);
create index if not exists orden_sectores_campo_idx on public.orden_sectores (campo_id);
create index if not exists orden_sectores_potrero_idx on public.orden_sectores (potrero);

alter table public.orden_sectores enable row level security;
drop policy if exists "orden sectores lectura" on public.orden_sectores;
create policy "orden sectores lectura" on public.orden_sectores
  for select to authenticated using (true);
grant select on public.orden_sectores to authenticated;

create table if not exists importacion.fitosanitario_productos (
  clave_fuente text primary key,
  archivo_origen text not null,
  fila_excel integer,
  nombre text not null,
  nombre_normalizado text not null,
  nombre_clave text not null,
  ingrediente_activo text,
  unidad text not null,
  dosis_por_100 numeric(14,4) not null default 0,
  horas_reingreso integer not null default 24,
  carencia_etiqueta text,
  carencia_agenda_pesticidas text,
  objetivo_operacional text,
  incompleto boolean not null default false
);

create table if not exists importacion.fitosanitario_producto_alias (
  origen_clave text primary key,
  producto_id uuid not null references public.productos(id) on update cascade on delete restrict,
  observacion text,
  confirmado_en timestamptz not null default now()
);

create table if not exists importacion.fitosanitario_ordenes (
  clave_fuente text primary key,
  archivo_origen text not null,
  temporada text not null,
  anio_inicio integer not null,
  anio_fin integer not null,
  numero_orden numeric(12,2) not null,
  fecha date not null,
  numero_programa integer,
  numeros_programa integer[] not null default '{}',
  programa_origen text,
  especie text,
  variedad text,
  potrero_cabecera text not null,
  bloques_cabecera text[] not null default '{}',
  hectareas numeric(14,3) not null default 0,
  agua_por_ha numeric(14,2) not null default 0,
  metodo_aplicacion text,
  multisector boolean not null default false
);

create table if not exists importacion.fitosanitario_sectores (
  clave_fuente text primary key,
  archivo_origen text not null,
  fila_excel_inicio integer,
  temporada text not null,
  numero_orden numeric(12,2) not null,
  fecha_orden date,
  potrero text,
  bloque_origen text,
  bloques text[] not null default '{}',
  hectareas numeric(14,3) not null default 0,
  especie text,
  variedad text,
  litros_planificados numeric(14,2) not null default 0,
  metodo_aplicacion text,
  mojamiento_l_ha numeric(14,2) not null default 0,
  velocidad numeric(14,3),
  marcha text,
  cantidad_boquillas integer,
  tipo_boquilla text,
  color_boquilla text,
  presion_bar numeric(14,3)
);

create table if not exists importacion.fitosanitario_orden_productos (
  clave_fuente text primary key,
  archivo_origen text not null,
  fila_excel_inicio integer,
  temporada text not null,
  numero_orden numeric(12,2) not null,
  producto_nombre text not null,
  producto_normalizado text not null,
  producto_clave text not null,
  numero_programa integer,
  dosis_por_100 numeric(14,4) not null default 0,
  periodo_reingreso text,
  carencia_etiqueta text,
  carencia_agenda_pesticidas text
);

create table if not exists importacion.fitosanitario_despachos (
  clave_fuente text primary key,
  archivo_origen text not null,
  fila_excel_inicio integer,
  filas_excel integer[] not null default '{}',
  temporada text not null,
  numero_orden numeric(12,2) not null,
  folio_origen text,
  fecha date not null,
  hora_salida time,
  litros_salida numeric(14,2) not null default 0,
  fecha_termino date,
  hora_termino time,
  litros_aplicados numeric(14,2) not null default 0,
  aplicador text,
  codigo_tractor text,
  codigo_maquinaria text
);

create table if not exists importacion.fitosanitario_excepciones (
  id bigint generated always as identity primary key,
  archivo_origen text not null,
  hoja_origen text not null,
  fila_excel integer,
  tipo text not null,
  detalle text not null,
  datos jsonb not null default '{}'::jsonb,
  creado_en timestamptz not null default now()
);

commit;
"""


def processing_sql() -> str:
    return """-- Procesa el staging de BD FITOSANITARIO.xlsx hacia las tablas operacionales.
-- Es idempotente: vuelve a actualizar por clave de origen sin duplicar.

begin;

update public.productos p
set ingrediente_activo = coalesce(s.ingrediente_activo, p.ingrediente_activo),
    dosis_por_100 = case when s.dosis_por_100 > 0 then s.dosis_por_100 else p.dosis_por_100 end,
    horas_reingreso = case when s.horas_reingreso > 0 then s.horas_reingreso else p.horas_reingreso end,
    carencia_etiqueta = coalesce(s.carencia_etiqueta, p.carencia_etiqueta),
    carencia_agenda_pesticidas = coalesce(s.carencia_agenda_pesticidas, p.carencia_agenda_pesticidas),
    objetivo_operacional = coalesce(s.objetivo_operacional, p.objetivo_operacional),
    fuente_operacional = s.archivo_origen,
    incompleto_operacional = p.incompleto_operacional and s.incompleto
from importacion.fitosanitario_productos s
where regexp_replace(upper(coalesce(p.nombre_normalizado, p.nombre)), '[^A-Z0-9]', '', 'g') = s.nombre_clave;

insert into public.productos (
  nombre, nombre_normalizado, ingrediente_activo, unidad, dosis_por_100,
  horas_reingreso, dias_carencia, stock_minimo, stock_actual, costo_unitario,
  activo, carencia_etiqueta, carencia_agenda_pesticidas, objetivo_operacional,
  fuente_operacional, incompleto_operacional
)
select
  s.nombre, s.nombre_normalizado, s.ingrediente_activo, s.unidad, s.dosis_por_100,
  s.horas_reingreso,
  case when s.carencia_etiqueta ~ '^\\s*\\d+([.,]\\d+)?\\s*$'
       then replace(trim(s.carencia_etiqueta), ',', '.')::numeric::integer else 0 end,
  0, 0, 0, true, s.carencia_etiqueta, s.carencia_agenda_pesticidas,
  s.objetivo_operacional, s.archivo_origen, s.incompleto
from importacion.fitosanitario_productos s
where not exists (
  select 1 from public.productos p
  where regexp_replace(upper(coalesce(p.nombre_normalizado, p.nombre)), '[^A-Z0-9]', '', 'g') = s.nombre_clave
)
on conflict (nombre) do update set
  carencia_etiqueta = excluded.carencia_etiqueta,
  carencia_agenda_pesticidas = excluded.carencia_agenda_pesticidas,
  objetivo_operacional = excluded.objetivo_operacional,
  fuente_operacional = excluded.fuente_operacional;

insert into public.temporadas (nombre, anio_inicio, anio_fin, estado)
select distinct temporada, anio_inicio, anio_fin, 'cerrada'
from importacion.fitosanitario_ordenes
on conflict (nombre) do update set
  anio_inicio = excluded.anio_inicio,
  anio_fin = excluded.anio_fin;

update public.ordenes_aplicacion oa
set clave_fuente = coalesce(oa.clave_fuente, s.clave_fuente),
    archivo_origen = coalesce(oa.archivo_origen, s.archivo_origen),
    importado = true,
    multisector = s.multisector,
    metodo_aplicacion = coalesce(oa.metodo_aplicacion, s.metodo_aplicacion),
    programa_origen = coalesce(oa.programa_origen, s.programa_origen)
from importacion.fitosanitario_ordenes s
join public.temporadas t on t.nombre = s.temporada
where oa.temporada_id = t.id and oa.numero_orden = s.numero_orden;

insert into public.ordenes_aplicacion (
  temporada_id, programa_id, numero_orden, numero_programa, numeros_programa,
  nombre_programa, fecha, fecha_planificada, cultivo, variedad, potrero, bloques,
  hectareas, agua_por_ha, estado, clave_fuente, archivo_origen, importado,
  multisector, metodo_aplicacion, programa_origen
)
select
  t.id,
  (
    select p.id
    from public.programas p
    join public.temporadas pt on pt.id = p.temporada_id
    where p.numero_programa = s.numero_programa
      and upper(coalesce(p.cultivo, '')) = upper(coalesce(s.especie, ''))
      and pt.anio_inicio = s.anio_inicio and pt.anio_fin = s.anio_fin
    order by p.creado_en desc
    limit 1
  ),
  s.numero_orden, s.numero_programa, s.numeros_programa,
  case when s.numero_programa is not null then 'Programa ' || s.numero_programa else s.programa_origen end,
  s.fecha, s.fecha, s.especie, s.variedad, s.potrero_cabecera, s.bloques_cabecera,
  s.hectareas, s.agua_por_ha, 'completada'::public.estado_orden, s.clave_fuente, s.archivo_origen, true,
  s.multisector, s.metodo_aplicacion, s.programa_origen
from importacion.fitosanitario_ordenes s
join public.temporadas t on t.nombre = s.temporada
where not exists (
  select 1 from public.ordenes_aplicacion oa
  where oa.temporada_id = t.id and oa.numero_orden = s.numero_orden
);

update public.orden_sectores os
set fecha_orden = s.fecha_orden,
    potrero = s.potrero,
    bloque_origen = s.bloque_origen,
    bloques = s.bloques,
    hectareas = s.hectareas,
    especie = s.especie,
    variedad = s.variedad,
    litros_planificados = s.litros_planificados,
    metodo_aplicacion = s.metodo_aplicacion,
    mojamiento_l_ha = s.mojamiento_l_ha,
    velocidad = s.velocidad,
    marcha = s.marcha,
    cantidad_boquillas = s.cantidad_boquillas,
    tipo_boquilla = s.tipo_boquilla,
    color_boquilla = s.color_boquilla,
    presion_bar = s.presion_bar,
    actualizado_en = now()
from importacion.fitosanitario_sectores s
where os.clave_fuente = s.clave_fuente;

insert into public.orden_sectores (
  orden_id, campo_id, clave_fuente, archivo_origen, fila_excel, fecha_orden,
  potrero, bloque_origen, bloques, hectareas, especie, variedad, litros_planificados,
  metodo_aplicacion, mojamiento_l_ha, velocidad, marcha, cantidad_boquillas,
  tipo_boquilla, color_boquilla, presion_bar
)
select
  oa.id,
  case when cardinality(s.bloques) = 1 then (
    select c.id from public.campos c
    where upper(trim(c.potrero)) = upper(trim(s.potrero))
      and upper(trim(c.bloque)) = upper(trim(s.bloques[1]))
    limit 1
  ) else null end,
  s.clave_fuente, s.archivo_origen, s.fila_excel_inicio, s.fecha_orden,
  s.potrero, s.bloque_origen, s.bloques, s.hectareas, s.especie, s.variedad,
  s.litros_planificados, s.metodo_aplicacion, s.mojamiento_l_ha, s.velocidad,
  s.marcha, s.cantidad_boquillas, s.tipo_boquilla, s.color_boquilla, s.presion_bar
from importacion.fitosanitario_sectores s
join public.temporadas t on t.nombre = s.temporada
join public.ordenes_aplicacion oa
  on oa.temporada_id = t.id and oa.numero_orden = s.numero_orden
where not exists (
  select 1 from public.orden_sectores os where os.clave_fuente = s.clave_fuente
);

update public.orden_productos op
set dosis_por_100 = s.dosis_por_100,
    dosis = s.dosis_por_100,
    unidad_dosis = 'CC/GRS (origen)',
    base_dosis = 'per_100l',
    archivo_origen = s.archivo_origen,
    fila_excel = s.fila_excel_inicio,
    nombre_producto_origen = s.producto_nombre,
    periodo_reingreso_origen = s.periodo_reingreso,
    carencia_etiqueta = s.carencia_etiqueta,
    carencia_agenda_pesticidas = s.carencia_agenda_pesticidas
from importacion.fitosanitario_orden_productos s
where op.clave_fuente = s.clave_fuente;

update public.orden_productos op
set clave_fuente = s.clave_fuente,
    archivo_origen = s.archivo_origen,
    fila_excel = s.fila_excel_inicio,
    nombre_producto_origen = s.producto_nombre,
    periodo_reingreso_origen = s.periodo_reingreso,
    carencia_etiqueta = s.carencia_etiqueta,
    carencia_agenda_pesticidas = s.carencia_agenda_pesticidas
from importacion.fitosanitario_orden_productos s
join public.temporadas t on t.nombre = s.temporada
join public.ordenes_aplicacion oa
  on oa.temporada_id = t.id and oa.numero_orden = s.numero_orden
join lateral (
  select p.id
  from public.productos p
  where regexp_replace(upper(coalesce(p.nombre_normalizado, p.nombre)), '[^A-Z0-9]', '', 'g') = s.producto_clave
  order by (p.nombre_normalizado = s.producto_normalizado) desc, p.creado_en
  limit 1
) p on true
where op.orden_id = oa.id
  and op.producto_id = p.id
  and op.numero_programa is not distinct from s.numero_programa
  and op.clave_fuente is null;

insert into public.orden_productos (
  orden_id, producto_id, numero_programa, dosis_por_100,
  producto_por_ha_programa, total_programa, dosis, unidad_dosis, base_dosis,
  unidad_resultado, divisor_conversion, clave_fuente, archivo_origen, fila_excel,
  nombre_producto_origen, periodo_reingreso_origen, carencia_etiqueta,
  carencia_agenda_pesticidas
)
select
  oa.id, p.id, s.numero_programa, s.dosis_por_100,
  0, 0, s.dosis_por_100, 'CC/GRS (origen)', 'per_100l', p.unidad, 1,
  s.clave_fuente, s.archivo_origen, s.fila_excel_inicio, s.producto_nombre,
  s.periodo_reingreso, s.carencia_etiqueta, s.carencia_agenda_pesticidas
from importacion.fitosanitario_orden_productos s
join public.temporadas t on t.nombre = s.temporada
join public.ordenes_aplicacion oa
  on oa.temporada_id = t.id and oa.numero_orden = s.numero_orden
join lateral (
  select product.*
  from public.productos product
  where regexp_replace(upper(coalesce(product.nombre_normalizado, product.nombre)), '[^A-Z0-9]', '', 'g') = s.producto_clave
  order by (product.nombre_normalizado = s.producto_normalizado) desc, product.creado_en
  limit 1
) p on true
where not exists (
  select 1 from public.orden_productos op where op.clave_fuente = s.clave_fuente
)
and not exists (
  select 1 from public.orden_productos op
  where op.orden_id = oa.id and op.producto_id = p.id
    and op.numero_programa is not distinct from s.numero_programa
);

update public.despachos d
set fecha = s.fecha,
    hora_salida = s.hora_salida,
    litros = s.litros_salida,
    fecha_termino = s.fecha_termino,
    hora_termino = s.hora_termino,
    litros_aplicados = s.litros_aplicados,
    codigo_tractor = s.codigo_tractor,
    codigo_maquina = s.codigo_maquinaria,
    aplicador_id = s.aplicador,
    aplicador_nombre_origen = s.aplicador,
    folio_origen = s.folio_origen,
    fila_excel = s.fila_excel_inicio
from importacion.fitosanitario_despachos s
where d.clave_fuente = s.clave_fuente;

insert into public.despachos (
  orden_id, tipo, fecha, hora_salida, litros, fecha_termino, hora_termino,
  litros_aplicados, codigo_tractor, codigo_maquina, aplicador_id,
  aplicador_nombre_origen, folio_origen, clave_fuente, archivo_origen, fila_excel
)
select
  oa.id, 'salida', s.fecha, s.hora_salida, s.litros_salida, s.fecha_termino,
  s.hora_termino, s.litros_aplicados, s.codigo_tractor, s.codigo_maquinaria,
  s.aplicador, s.aplicador, s.folio_origen, s.clave_fuente, s.archivo_origen,
  s.fila_excel_inicio
from importacion.fitosanitario_despachos s
join public.temporadas t on t.nombre = s.temporada
join public.ordenes_aplicacion oa
  on oa.temporada_id = t.id and oa.numero_orden = s.numero_orden
where not exists (
  select 1 from public.despachos d where d.clave_fuente = s.clave_fuente
);

commit;

select 'productos staging' as concepto, count(*)::bigint as total
from importacion.fitosanitario_productos
union all select 'ordenes staging', count(*) from importacion.fitosanitario_ordenes
union all select 'sectores staging', count(*) from importacion.fitosanitario_sectores
union all select 'productos de orden staging', count(*) from importacion.fitosanitario_orden_productos
union all select 'despachos staging', count(*) from importacion.fitosanitario_despachos
union all select 'excepciones', count(*) from importacion.fitosanitario_excepciones
union all select 'ordenes importadas', count(*) from public.ordenes_aplicacion where archivo_origen = 'BD FITOSANITARIO.xlsx'
union all select 'sectores importados', count(*) from public.orden_sectores where archivo_origen = 'BD FITOSANITARIO.xlsx'
union all select 'despachos importados', count(*) from public.despachos where archivo_origen = 'BD FITOSANITARIO.xlsx';

select tipo, count(*) as total
from importacion.fitosanitario_excepciones
group by tipo
order by tipo;
"""


def processing_sql_safe() -> str:
    return """-- Procesamiento seguro de BD FITOSANITARIO.xlsx.
-- Fuentes: ORDEN para ordenes/recetas, SALIDA para litros y APLICACION solo como puente.
-- No crea productos por similitud. Solo usa alias confirmados o una coincidencia exacta unica.

begin;

delete from importacion.fitosanitario_excepciones
where archivo_origen = 'BD FITOSANITARIO.xlsx'
  and tipo in (
    'PRODUCTO_SIN_MAESTRO', 'PRODUCTO_MAESTRO_AMBIGUO', 'PROGRAMA_SIN_MAESTRO_UNICO',
    'SECTOR_SIN_CAMPO_EXACTO', 'TRACTOR_SIN_MAESTRO', 'MAQUINARIA_SIN_MAESTRO'
  );

-- Diagnostico de productos. Un alias confirmado tiene prioridad sobre el nombre.
with source_products as (
  select distinct op.producto_clave, op.producto_nombre, min(op.fila_excel_inicio) as fila_excel
  from importacion.fitosanitario_orden_productos op
  group by op.producto_clave, op.producto_nombre
), matches as (
  select s.*,
         a.producto_id as alias_id,
         count(p.id) as exact_count,
         (array_agg(p.nombre order by p.nombre) filter (where p.id is not null))[1:8] as exact_names
  from source_products s
  left join importacion.fitosanitario_producto_alias a on a.origen_clave = s.producto_clave
  left join public.productos p
    on regexp_replace(upper(coalesce(p.nombre_normalizado, p.nombre)), '[^A-Z0-9]', '', 'g') = s.producto_clave
  group by s.producto_clave, s.producto_nombre, s.fila_excel, a.producto_id
)
insert into importacion.fitosanitario_excepciones
  (archivo_origen, hoja_origen, fila_excel, tipo, detalle, datos)
select
  'BD FITOSANITARIO.xlsx', 'ORDEN', fila_excel,
  case when exact_count = 0 then 'PRODUCTO_SIN_MAESTRO' else 'PRODUCTO_MAESTRO_AMBIGUO' end,
  case when exact_count = 0
       then 'El nombre comercial no tiene una equivalencia exacta confirmada en public.productos.'
       else 'El nombre comercial coincide con mas de un producto maestro y requiere elegir el canonico.' end,
  jsonb_build_object('nombre_origen', producto_nombre, 'clave', producto_clave, 'candidatos', coalesce(to_jsonb(exact_names), '[]'::jsonb))
from matches
where alias_id is null and exact_count <> 1;

-- Completa atributos historicos solo en el producto maestro resuelto sin ambiguedad.
with source_matches as (
  select s.*,
         coalesce(
           a.producto_id,
           case when count(p.id) = 1 then (array_agg(p.id order by p.creado_en))[1] end
         ) as producto_id
  from importacion.fitosanitario_productos s
  left join importacion.fitosanitario_producto_alias a on a.origen_clave = s.nombre_clave
  left join public.productos p
    on regexp_replace(upper(coalesce(p.nombre_normalizado, p.nombre)), '[^A-Z0-9]', '', 'g') = s.nombre_clave
  group by s.clave_fuente, s.archivo_origen, s.fila_excel, s.nombre, s.nombre_normalizado,
           s.nombre_clave, s.ingrediente_activo, s.unidad, s.dosis_por_100,
           s.horas_reingreso, s.carencia_etiqueta, s.carencia_agenda_pesticidas,
           s.objetivo_operacional, s.incompleto, a.producto_id
)
update public.productos p
set ingrediente_activo = coalesce(nullif(s.ingrediente_activo, ''), p.ingrediente_activo),
    dosis_por_100 = case when s.dosis_por_100 > 0 then s.dosis_por_100 else p.dosis_por_100 end,
    horas_reingreso = case when s.horas_reingreso > 0 then s.horas_reingreso else p.horas_reingreso end,
    carencia_etiqueta = coalesce(nullif(s.carencia_etiqueta, ''), p.carencia_etiqueta),
    carencia_agenda_pesticidas = coalesce(nullif(s.carencia_agenda_pesticidas, ''), p.carencia_agenda_pesticidas),
    objetivo_operacional = coalesce(nullif(s.objetivo_operacional, ''), p.objetivo_operacional),
    fuente_operacional = s.archivo_origen,
    incompleto_operacional = p.incompleto_operacional and s.incompleto
from source_matches s
where s.producto_id = p.id;

-- Reutiliza la temporada existente por anos; solo crea la que realmente falta.
insert into public.temporadas (nombre, anio_inicio, anio_fin, estado)
select min(s.temporada), s.anio_inicio, s.anio_fin, 'cerrada'
from importacion.fitosanitario_ordenes s
where not exists (
  select 1 from public.temporadas t
  where t.anio_inicio = s.anio_inicio and t.anio_fin = s.anio_fin
)
group by s.anio_inicio, s.anio_fin
on conflict (nombre) do update set
  anio_inicio = excluded.anio_inicio,
  anio_fin = excluded.anio_fin;

-- Si numero + especie + temporada no identifican un programa unico, se conserva
-- el numero de programa en la orden pero programa_id queda nulo.
with program_matches as (
  select s.clave_fuente, s.numero_programa, s.especie, s.anio_inicio, s.anio_fin,
         count(p.id) as total,
         (array_agg(p.id order by p.creado_en desc))[1] as programa_id
  from importacion.fitosanitario_ordenes s
  left join public.programas p
    on p.numero_programa = s.numero_programa
   and upper(trim(coalesce(p.cultivo, ''))) = upper(trim(coalesce(s.especie, '')))
   and exists (
     select 1 from public.temporadas pt
     where pt.id = p.temporada_id
       and pt.anio_inicio = s.anio_inicio and pt.anio_fin = s.anio_fin
   )
  where s.numero_programa is not null
  group by s.clave_fuente, s.numero_programa, s.especie, s.anio_inicio, s.anio_fin
)
insert into importacion.fitosanitario_excepciones
  (archivo_origen, hoja_origen, fila_excel, tipo, detalle, datos)
select 'BD FITOSANITARIO.xlsx', 'ORDEN', null, 'PROGRAMA_SIN_MAESTRO_UNICO',
       'Numero, especie y temporada no identifican un unico programa maestro.',
       jsonb_build_object('clave_orden', clave_fuente, 'numero_programa', numero_programa,
                          'especie', especie, 'coincidencias', total)
from program_matches
where total <> 1;

with resolved_orders as (
  select s.*,
         t.id as temporada_id,
         (
           select case when count(p.id) = 1 then (array_agg(p.id order by p.creado_en desc))[1] end
           from public.programas p
           join public.temporadas pt on pt.id = p.temporada_id
           where p.numero_programa = s.numero_programa
             and upper(trim(coalesce(p.cultivo, ''))) = upper(trim(coalesce(s.especie, '')))
             and pt.anio_inicio = s.anio_inicio and pt.anio_fin = s.anio_fin
         ) as programa_id_resuelto
  from importacion.fitosanitario_ordenes s
  join lateral (
    select season.id
    from public.temporadas season
    where season.anio_inicio = s.anio_inicio and season.anio_fin = s.anio_fin
    order by (upper(season.nombre) like 'CITRICOS%') desc, season.creado_en
    limit 1
  ) t on true
)
update public.ordenes_aplicacion oa
set programa_id = coalesce(s.programa_id_resuelto, oa.programa_id),
    numero_programa = s.numero_programa,
    numeros_programa = s.numeros_programa,
    nombre_programa = case when s.numero_programa is not null then 'Programa ' || s.numero_programa else s.programa_origen end,
    fecha = s.fecha,
    fecha_planificada = s.fecha,
    cultivo = s.especie,
    variedad = s.variedad,
    potrero = s.potrero_cabecera,
    bloques = s.bloques_cabecera,
    hectareas = s.hectareas,
    agua_por_ha = s.agua_por_ha,
    clave_fuente = coalesce(oa.clave_fuente, s.clave_fuente),
    archivo_origen = s.archivo_origen,
    importado = true,
    multisector = s.multisector,
    metodo_aplicacion = s.metodo_aplicacion,
    programa_origen = s.programa_origen
from resolved_orders s
where oa.clave_fuente = s.clave_fuente
   or (oa.temporada_id = s.temporada_id and oa.numero_orden = s.numero_orden);

with resolved_orders as (
  select s.*,
         t.id as temporada_id,
         (
           select case when count(p.id) = 1 then (array_agg(p.id order by p.creado_en desc))[1] end
           from public.programas p
           join public.temporadas pt on pt.id = p.temporada_id
           where p.numero_programa = s.numero_programa
             and upper(trim(coalesce(p.cultivo, ''))) = upper(trim(coalesce(s.especie, '')))
             and pt.anio_inicio = s.anio_inicio and pt.anio_fin = s.anio_fin
         ) as programa_id_resuelto
  from importacion.fitosanitario_ordenes s
  join lateral (
    select season.id
    from public.temporadas season
    where season.anio_inicio = s.anio_inicio and season.anio_fin = s.anio_fin
    order by (upper(season.nombre) like 'CITRICOS%') desc, season.creado_en
    limit 1
  ) t on true
)
insert into public.ordenes_aplicacion (
  temporada_id, programa_id, numero_orden, numero_programa, numeros_programa,
  nombre_programa, fecha, fecha_planificada, cultivo, variedad, potrero, bloques,
  hectareas, agua_por_ha, estado, clave_fuente, archivo_origen, importado,
  multisector, metodo_aplicacion, programa_origen
)
select
  s.temporada_id, s.programa_id_resuelto, s.numero_orden, s.numero_programa, s.numeros_programa,
  case when s.numero_programa is not null then 'Programa ' || s.numero_programa else s.programa_origen end,
  s.fecha, s.fecha, s.especie, s.variedad, s.potrero_cabecera, s.bloques_cabecera,
  s.hectareas, s.agua_por_ha, 'completada'::public.estado_orden, s.clave_fuente, s.archivo_origen, true,
  s.multisector, s.metodo_aplicacion, s.programa_origen
from resolved_orders s
where not exists (
  select 1 from public.ordenes_aplicacion oa
  where oa.clave_fuente = s.clave_fuente
     or (oa.temporada_id = s.temporada_id and oa.numero_orden = s.numero_orden)
);

-- Informa sectores que parecian apuntar a un solo bloque pero no existen en campos.
insert into importacion.fitosanitario_excepciones
  (archivo_origen, hoja_origen, fila_excel, tipo, detalle, datos)
select 'BD FITOSANITARIO.xlsx', 'ORDEN', s.fila_excel_inicio, 'SECTOR_SIN_CAMPO_EXACTO',
       'Potrero y bloque no tienen coincidencia exacta unica en public.campos.',
       jsonb_build_object('potrero', s.potrero, 'bloques', s.bloques,
                          'especie_origen', s.especie, 'variedad_origen', s.variedad)
from importacion.fitosanitario_sectores s
where cardinality(s.bloques) = 1
  and not exists (
    select 1 from public.campos c
    where upper(trim(c.potrero)) = upper(trim(s.potrero))
      and upper(trim(c.bloque)) = upper(trim(s.bloques[1]))
  );

with resolved_sectors as (
  select s.*, oa.id as orden_id,
         c.id as campo_id, c.hectareas as campo_hectareas,
         c.especie as campo_especie, c.variedad as campo_variedad
  from importacion.fitosanitario_sectores s
  join importacion.fitosanitario_ordenes so
    on so.temporada = s.temporada and so.numero_orden = s.numero_orden
  join public.ordenes_aplicacion oa on oa.clave_fuente = so.clave_fuente
  left join lateral (
    select field.id, field.hectareas, field.especie, field.variedad
    from public.campos field
    where cardinality(s.bloques) = 1
      and upper(trim(field.potrero)) = upper(trim(s.potrero))
      and upper(trim(field.bloque)) = upper(trim(s.bloques[1]))
    limit 1
  ) c on true
)
update public.orden_sectores os
set orden_id = s.orden_id,
    campo_id = s.campo_id,
    fecha_orden = s.fecha_orden,
    potrero = s.potrero,
    bloque_origen = s.bloque_origen,
    bloques = s.bloques,
    hectareas = coalesce(s.campo_hectareas, s.hectareas),
    especie = coalesce(s.campo_especie, s.especie),
    variedad = coalesce(s.campo_variedad, s.variedad),
    litros_planificados = s.litros_planificados,
    metodo_aplicacion = s.metodo_aplicacion,
    mojamiento_l_ha = s.mojamiento_l_ha,
    velocidad = s.velocidad,
    marcha = s.marcha,
    cantidad_boquillas = s.cantidad_boquillas,
    tipo_boquilla = s.tipo_boquilla,
    color_boquilla = s.color_boquilla,
    presion_bar = s.presion_bar,
    actualizado_en = now()
from resolved_sectors s
where os.clave_fuente = s.clave_fuente;

with resolved_sectors as (
  select s.*, oa.id as orden_id,
         c.id as campo_id, c.hectareas as campo_hectareas,
         c.especie as campo_especie, c.variedad as campo_variedad
  from importacion.fitosanitario_sectores s
  join importacion.fitosanitario_ordenes so
    on so.temporada = s.temporada and so.numero_orden = s.numero_orden
  join public.ordenes_aplicacion oa on oa.clave_fuente = so.clave_fuente
  left join lateral (
    select field.id, field.hectareas, field.especie, field.variedad
    from public.campos field
    where cardinality(s.bloques) = 1
      and upper(trim(field.potrero)) = upper(trim(s.potrero))
      and upper(trim(field.bloque)) = upper(trim(s.bloques[1]))
    limit 1
  ) c on true
)
insert into public.orden_sectores (
  orden_id, campo_id, clave_fuente, archivo_origen, fila_excel, fecha_orden,
  potrero, bloque_origen, bloques, hectareas, especie, variedad, litros_planificados,
  metodo_aplicacion, mojamiento_l_ha, velocidad, marcha, cantidad_boquillas,
  tipo_boquilla, color_boquilla, presion_bar
)
select
  s.orden_id, s.campo_id, s.clave_fuente, s.archivo_origen, s.fila_excel_inicio, s.fecha_orden,
  s.potrero, s.bloque_origen, s.bloques, coalesce(s.campo_hectareas, s.hectareas),
  coalesce(s.campo_especie, s.especie), coalesce(s.campo_variedad, s.variedad),
  s.litros_planificados, s.metodo_aplicacion, s.mojamiento_l_ha, s.velocidad,
  s.marcha, s.cantidad_boquillas, s.tipo_boquilla, s.color_boquilla, s.presion_bar
from resolved_sectors s
where not exists (
  select 1 from public.orden_sectores os where os.clave_fuente = s.clave_fuente
);

-- Recipes only use a confirmed alias or a unique exact product master match.
with resolved_lines as (
  select s.*, oa.id as orden_id,
         coalesce(
           a.producto_id,
           case when count(p.id) = 1 then (array_agg(p.id order by p.creado_en))[1] end
         ) as producto_id,
         coalesce(
           (array_agg(p.unidad order by p.creado_en) filter (where p.id is not null))[1],
           'kg'
         ) as unidad_producto
  from importacion.fitosanitario_orden_productos s
  join importacion.fitosanitario_ordenes so
    on so.temporada = s.temporada and so.numero_orden = s.numero_orden
  join public.ordenes_aplicacion oa on oa.clave_fuente = so.clave_fuente
  left join importacion.fitosanitario_producto_alias a on a.origen_clave = s.producto_clave
  left join public.productos p
    on regexp_replace(upper(coalesce(p.nombre_normalizado, p.nombre)), '[^A-Z0-9]', '', 'g') = s.producto_clave
  group by s.clave_fuente, s.archivo_origen, s.fila_excel_inicio, s.temporada,
           s.numero_orden, s.producto_nombre, s.producto_normalizado, s.producto_clave,
           s.numero_programa, s.dosis_por_100, s.periodo_reingreso,
           s.carencia_etiqueta, s.carencia_agenda_pesticidas, oa.id, a.producto_id
)
update public.orden_productos op
set orden_id = s.orden_id,
    producto_id = s.producto_id,
    numero_programa = s.numero_programa,
    dosis_por_100 = s.dosis_por_100,
    dosis = s.dosis_por_100,
    unidad_dosis = 'CC/GRS (origen)',
    base_dosis = 'per_100l',
    unidad_resultado = s.unidad_producto,
    archivo_origen = s.archivo_origen,
    fila_excel = s.fila_excel_inicio,
    nombre_producto_origen = s.producto_nombre,
    periodo_reingreso_origen = s.periodo_reingreso,
    carencia_etiqueta = s.carencia_etiqueta,
    carencia_agenda_pesticidas = s.carencia_agenda_pesticidas
from resolved_lines s
where s.producto_id is not null and op.clave_fuente = s.clave_fuente;

with resolved_lines as (
  select s.*, oa.id as orden_id,
         coalesce(
           a.producto_id,
           case when count(p.id) = 1 then (array_agg(p.id order by p.creado_en))[1] end
         ) as producto_id,
         coalesce((array_agg(p.unidad order by p.creado_en) filter (where p.id is not null))[1], 'kg') as unidad_producto
  from importacion.fitosanitario_orden_productos s
  join importacion.fitosanitario_ordenes so
    on so.temporada = s.temporada and so.numero_orden = s.numero_orden
  join public.ordenes_aplicacion oa on oa.clave_fuente = so.clave_fuente
  left join importacion.fitosanitario_producto_alias a on a.origen_clave = s.producto_clave
  left join public.productos p
    on regexp_replace(upper(coalesce(p.nombre_normalizado, p.nombre)), '[^A-Z0-9]', '', 'g') = s.producto_clave
  group by s.clave_fuente, s.archivo_origen, s.fila_excel_inicio, s.temporada,
           s.numero_orden, s.producto_nombre, s.producto_normalizado, s.producto_clave,
           s.numero_programa, s.dosis_por_100, s.periodo_reingreso,
           s.carencia_etiqueta, s.carencia_agenda_pesticidas, oa.id, a.producto_id
)
insert into public.orden_productos (
  orden_id, producto_id, numero_programa, dosis_por_100,
  producto_por_ha_programa, total_programa, dosis, unidad_dosis, base_dosis,
  unidad_resultado, divisor_conversion, clave_fuente, archivo_origen, fila_excel,
  nombre_producto_origen, periodo_reingreso_origen, carencia_etiqueta,
  carencia_agenda_pesticidas
)
select
  s.orden_id, s.producto_id, s.numero_programa, s.dosis_por_100,
  0, 0, s.dosis_por_100, 'CC/GRS (origen)', 'per_100l', s.unidad_producto, 1,
  s.clave_fuente, s.archivo_origen, s.fila_excel_inicio, s.producto_nombre,
  s.periodo_reingreso, s.carencia_etiqueta, s.carencia_agenda_pesticidas
from resolved_lines s
where s.producto_id is not null
  and not exists (
    select 1 from public.orden_productos op where op.clave_fuente = s.clave_fuente
  )
  and not exists (
    select 1 from public.orden_productos op
    where op.orden_id = s.orden_id and op.producto_id = s.producto_id
      and op.numero_programa is not distinct from s.numero_programa
  );

-- Preserve old equipment codes but report which ones are not in the active master.
insert into importacion.fitosanitario_excepciones
  (archivo_origen, hoja_origen, fila_excel, tipo, detalle, datos)
select 'BD FITOSANITARIO.xlsx', 'SALIDA', min(s.fila_excel_inicio), 'TRACTOR_SIN_MAESTRO',
       'El codigo de tractor historico no existe en public.vehiculos.',
       jsonb_build_object('codigo', s.codigo_tractor)
from importacion.fitosanitario_despachos s
where s.codigo_tractor is not null
  and not exists (select 1 from public.vehiculos v where upper(trim(v.codigo)) = upper(trim(s.codigo_tractor)))
group by s.codigo_tractor;

insert into importacion.fitosanitario_excepciones
  (archivo_origen, hoja_origen, fila_excel, tipo, detalle, datos)
select 'BD FITOSANITARIO.xlsx', 'SALIDA', min(s.fila_excel_inicio), 'MAQUINARIA_SIN_MAESTRO',
       'El codigo de maquinaria historico no existe en public.vehiculos.',
       jsonb_build_object('codigo', s.codigo_maquinaria)
from importacion.fitosanitario_despachos s
where s.codigo_maquinaria is not null
  and not exists (select 1 from public.vehiculos v where upper(trim(v.codigo)) = upper(trim(s.codigo_maquinaria)))
group by s.codigo_maquinaria;

with resolved_dispatches as (
  select s.*, oa.id as orden_id,
         (
           select case when count(w.id) = 1 then (array_agg(w.id::text order by w.id::text))[1] end
           from public.trabajador w
           where regexp_replace(upper(trim(concat_ws(' ', w.nombre, w.apellido))), '[^A-Z0-9]', '', 'g')
               = regexp_replace(upper(trim(coalesce(s.aplicador, ''))), '[^A-Z0-9]', '', 'g')
         ) as aplicador_id_resuelto
  from importacion.fitosanitario_despachos s
  join importacion.fitosanitario_ordenes so
    on so.temporada = s.temporada and so.numero_orden = s.numero_orden
  join public.ordenes_aplicacion oa on oa.clave_fuente = so.clave_fuente
)
update public.despachos d
set orden_id = s.orden_id,
    fecha = s.fecha,
    hora_salida = s.hora_salida,
    litros = s.litros_salida,
    fecha_termino = s.fecha_termino,
    hora_termino = s.hora_termino,
    litros_aplicados = s.litros_aplicados,
    codigo_tractor = s.codigo_tractor,
    codigo_maquina = s.codigo_maquinaria,
    aplicador_id = s.aplicador_id_resuelto,
    aplicador_nombre_origen = s.aplicador,
    folio_origen = s.folio_origen,
    fila_excel = s.fila_excel_inicio
from resolved_dispatches s
where d.clave_fuente = s.clave_fuente;

with resolved_dispatches as (
  select s.*, oa.id as orden_id,
         (
           select case when count(w.id) = 1 then (array_agg(w.id::text order by w.id::text))[1] end
           from public.trabajador w
           where regexp_replace(upper(trim(concat_ws(' ', w.nombre, w.apellido))), '[^A-Z0-9]', '', 'g')
               = regexp_replace(upper(trim(coalesce(s.aplicador, ''))), '[^A-Z0-9]', '', 'g')
         ) as aplicador_id_resuelto
  from importacion.fitosanitario_despachos s
  join importacion.fitosanitario_ordenes so
    on so.temporada = s.temporada and so.numero_orden = s.numero_orden
  join public.ordenes_aplicacion oa on oa.clave_fuente = so.clave_fuente
)
insert into public.despachos (
  orden_id, tipo, fecha, hora_salida, litros, fecha_termino, hora_termino,
  litros_aplicados, codigo_tractor, codigo_maquina, aplicador_id,
  aplicador_nombre_origen, folio_origen, clave_fuente, archivo_origen, fila_excel
)
select
  s.orden_id, 'salida', s.fecha, s.hora_salida, s.litros_salida, s.fecha_termino,
  s.hora_termino, s.litros_aplicados, s.codigo_tractor, s.codigo_maquinaria,
  s.aplicador_id_resuelto, s.aplicador, s.folio_origen, s.clave_fuente,
  s.archivo_origen, s.fila_excel_inicio
from resolved_dispatches s
where not exists (
  select 1 from public.despachos d where d.clave_fuente = s.clave_fuente
);

commit;

select 'productos de orden staging' as concepto, count(*)::bigint as total
from importacion.fitosanitario_orden_productos
union all select 'ordenes staging', count(*) from importacion.fitosanitario_ordenes
union all select 'sectores staging', count(*) from importacion.fitosanitario_sectores
union all select 'despachos staging', count(*) from importacion.fitosanitario_despachos
union all select 'ordenes importadas', count(*) from public.ordenes_aplicacion where archivo_origen = 'BD FITOSANITARIO.xlsx'
union all select 'recetas importadas', count(*) from public.orden_productos where archivo_origen = 'BD FITOSANITARIO.xlsx'
union all select 'sectores importados', count(*) from public.orden_sectores where archivo_origen = 'BD FITOSANITARIO.xlsx'
union all select 'despachos importados', count(*) from public.despachos where archivo_origen = 'BD FITOSANITARIO.xlsx'
union all select 'excepciones', count(*) from importacion.fitosanitario_excepciones where archivo_origen = 'BD FITOSANITARIO.xlsx';

select tipo, count(*) as total
from importacion.fitosanitario_excepciones
where archivo_origen = 'BD FITOSANITARIO.xlsx'
group by tipo
order by tipo;
"""


def review_sql() -> str:
    return """-- Revision posterior y resolucion manual de equivalencias.
-- Este archivo no modifica datos. Ejecutar despues de 03_procesar.sql.

select tipo, count(*) as total
from importacion.fitosanitario_excepciones
where archivo_origen = 'BD FITOSANITARIO.xlsx'
group by tipo
order by tipo;

select
  e.tipo,
  e.fila_excel,
  e.datos ->> 'nombre_origen' as nombre_origen,
  e.datos -> 'candidatos' as candidatos_exactos,
  e.detalle
from importacion.fitosanitario_excepciones e
where e.archivo_origen = 'BD FITOSANITARIO.xlsx'
  and e.tipo in ('PRODUCTO_SIN_MAESTRO', 'PRODUCTO_MAESTRO_AMBIGUO')
order by e.tipo, nombre_origen;

-- Duplicados ya existentes en el maestro, normalizados por nombre comercial.
select
  regexp_replace(upper(coalesce(nombre_normalizado, nombre)), '[^A-Z0-9]', '', 'g') as clave,
  array_agg(nombre order by nombre) as productos,
  array_agg(id order by nombre) as ids
from public.productos
group by regexp_replace(upper(coalesce(nombre_normalizado, nombre)), '[^A-Z0-9]', '', 'g')
having count(*) > 1
order by clave;

-- Ejemplo para confirmar una equivalencia despues de revisarla:
-- insert into importacion.fitosanitario_producto_alias (origen_clave, producto_id, observacion)
-- select 'DMA6', id, 'Confirmado contra nombre comercial maestro'
-- from public.productos where nombre = 'DMA-6'
-- on conflict (origen_clave) do update set
--   producto_id = excluded.producto_id,
--   observacion = excluded.observacion,
--   confirmado_en = now();

select tipo, fila_excel, datos, detalle
from importacion.fitosanitario_excepciones
where archivo_origen = 'BD FITOSANITARIO.xlsx'
  and tipo not in ('PRODUCTO_SIN_MAESTRO', 'PRODUCTO_MAESTRO_AMBIGUO')
order by tipo, fila_excel nulls last;
"""


def data_sql(records: dict[str, list[dict[str, Any]]]) -> str:
    parts = [
        "-- Datos normalizados desde BD FITOSANITARIO.xlsx.\n-- Ejecutar despues del archivo de esquema.\n\nbegin;\n",
        "delete from importacion.fitosanitario_excepciones where archivo_origen = 'BD FITOSANITARIO.xlsx';\n"
        "delete from importacion.fitosanitario_despachos where archivo_origen = 'BD FITOSANITARIO.xlsx';\n"
        "delete from importacion.fitosanitario_orden_productos where archivo_origen = 'BD FITOSANITARIO.xlsx';\n"
        "delete from importacion.fitosanitario_sectores where archivo_origen = 'BD FITOSANITARIO.xlsx';\n"
        "delete from importacion.fitosanitario_ordenes where archivo_origen = 'BD FITOSANITARIO.xlsx';\n"
        "delete from importacion.fitosanitario_productos where archivo_origen = 'BD FITOSANITARIO.xlsx';\n",
    ]
    parts.append(
        recordset_insert(
            "importacion.fitosanitario_productos",
            records["productos"],
            [
                ("archivo_origen", "text"), ("clave_fuente", "text"), ("fila_excel", "integer"),
                ("nombre", "text"), ("nombre_normalizado", "text"), ("nombre_clave", "text"),
                ("ingrediente_activo", "text"),
                ("unidad", "text"), ("dosis_por_100", "numeric"), ("horas_reingreso", "integer"),
                ("carencia_etiqueta", "text"), ("carencia_agenda_pesticidas", "text"),
                ("objetivo_operacional", "text"), ("incompleto", "boolean"),
            ],
            "clave_fuente",
        )
    )
    parts.append(
        recordset_insert(
            "importacion.fitosanitario_ordenes",
            records["ordenes"],
            [
                ("archivo_origen", "text"), ("clave_fuente", "text"), ("temporada", "text"),
                ("anio_inicio", "integer"), ("anio_fin", "integer"), ("numero_orden", "numeric"),
                ("fecha", "date"), ("numero_programa", "integer"), ("numeros_programa", "integer[]"),
                ("programa_origen", "text"), ("especie", "text"), ("variedad", "text"),
                ("potrero_cabecera", "text"), ("bloques_cabecera", "text[]"),
                ("hectareas", "numeric"), ("agua_por_ha", "numeric"),
                ("metodo_aplicacion", "text"), ("multisector", "boolean"),
            ],
            "clave_fuente",
        )
    )
    parts.append(
        recordset_insert(
            "importacion.fitosanitario_sectores",
            records["sectores"],
            [
                ("archivo_origen", "text"), ("clave_fuente", "text"), ("fila_excel_inicio", "integer"),
                ("temporada", "text"), ("numero_orden", "numeric"), ("fecha_orden", "date"),
                ("potrero", "text"), ("bloque_origen", "text"), ("bloques", "text[]"),
                ("hectareas", "numeric"), ("especie", "text"), ("variedad", "text"),
                ("litros_planificados", "numeric"), ("metodo_aplicacion", "text"),
                ("mojamiento_l_ha", "numeric"), ("velocidad", "numeric"), ("marcha", "text"),
                ("cantidad_boquillas", "integer"), ("tipo_boquilla", "text"),
                ("color_boquilla", "text"), ("presion_bar", "numeric"),
            ],
            "clave_fuente",
        )
    )
    parts.append(
        recordset_insert(
            "importacion.fitosanitario_orden_productos",
            records["orden_productos"],
            [
                ("archivo_origen", "text"), ("clave_fuente", "text"), ("fila_excel_inicio", "integer"),
                ("temporada", "text"), ("numero_orden", "numeric"), ("producto_nombre", "text"),
                ("producto_normalizado", "text"), ("producto_clave", "text"),
                ("numero_programa", "integer"),
                ("dosis_por_100", "numeric"), ("periodo_reingreso", "text"),
                ("carencia_etiqueta", "text"), ("carencia_agenda_pesticidas", "text"),
            ],
            "clave_fuente",
        )
    )
    parts.append(
        recordset_insert(
            "importacion.fitosanitario_despachos",
            records["despachos"],
            [
                ("archivo_origen", "text"), ("clave_fuente", "text"), ("fila_excel_inicio", "integer"),
                ("filas_excel", "integer[]"), ("temporada", "text"), ("numero_orden", "numeric"),
                ("folio_origen", "text"), ("fecha", "date"), ("hora_salida", "time"),
                ("litros_salida", "numeric"), ("fecha_termino", "date"), ("hora_termino", "time"),
                ("litros_aplicados", "numeric"), ("aplicador", "text"),
                ("codigo_tractor", "text"), ("codigo_maquinaria", "text"),
            ],
            "clave_fuente",
        )
    )
    if records["excepciones"]:
        payload = json.dumps(
            records["excepciones"], ensure_ascii=False, separators=(",", ":"),
            default=json_default, allow_nan=False
        )
        parts.append(
            "insert into importacion.fitosanitario_excepciones "
            "(archivo_origen, hoja_origen, fila_excel, tipo, detalle, datos)\n"
            "select archivo_origen, hoja_origen, fila_excel, tipo, detalle, datos\n"
            f"from jsonb_to_recordset($exceptions${payload}$exceptions$::jsonb) as x(\n"
            "  archivo_origen text, hoja_origen text, fila_excel integer, tipo text, detalle text, datos jsonb\n"
            ");\n"
        )
    parts.append("commit;\n")
    return "\n".join(parts)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("workbook", type=Path)
    parser.add_argument("--output", type=Path, default=Path.cwd())
    args = parser.parse_args()

    if not args.workbook.exists():
        raise FileNotFoundError(args.workbook)
    args.output.mkdir(parents=True, exist_ok=True)
    records = build_records(load_workbook(args.workbook))

    outputs = {
        "supabase_aplicaciones_historico_01_esquema.sql": schema_sql(),
        "supabase_aplicaciones_historico_02_datos.sql": data_sql(records),
        "supabase_aplicaciones_historico_03_procesar.sql": processing_sql_safe(),
        "supabase_aplicaciones_historico_04_revisar.sql": review_sql(),
    }
    for name, content in outputs.items():
        (args.output / name).write_text(content, encoding="utf-8", newline="\n")

    summary = {name: len(rows) for name, rows in records.items()}
    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
