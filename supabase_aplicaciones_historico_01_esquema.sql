-- Extensiones y estructura para importar BD FITOSANITARIO.xlsx.
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
