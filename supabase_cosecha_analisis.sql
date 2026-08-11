-- Modulo Cosecha > Exportacion y Cosecha Analisis.
-- Ejecutar primero este archivo en Supabase SQL Editor.

begin;

create or replace function public.agrocore_normalizar_texto(valor text)
returns text
language sql
immutable
as $$
  select nullif(
    trim(
      regexp_replace(
        lower(translate(coalesce(valor, ''), 'áéíóúüñÁÉÍÓÚÜÑ', 'aeiouunAEIOUUN')),
        '\s+',
        ' ',
        'g'
      )
    ),
    ''
  );
$$;

create table if not exists public.cosecha_analisis (
  id uuid primary key default gen_random_uuid(),
  campo_id uuid null references public.campos(id) on update cascade on delete set null,
  fecha date not null,
  anio integer not null,
  semana integer null,
  especie text not null,
  variedad text not null,
  potrero_excel text not null,
  bloque_formula text null,
  bloque_excel text null,
  potrero_normalizado text null,
  bloque_normalizado text null,
  contratista text null,
  cuadrilla text null,
  jornales numeric(12, 3) not null default 0,
  bins_nac numeric(12, 3) not null default 0,
  bins_expo numeric(12, 3) not null default 0,
  total_bins numeric(12, 3) not null default 0,
  kg_nac numeric(14, 3) not null default 0,
  kg_exp numeric(14, 3) not null default 0,
  kg_totales numeric(14, 3) not null default 0,
  archivo_origen text not null default 'COSECHA SUPA.xlsx',
  fila_excel integer not null,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  constraint cosecha_analisis_origen_fila_key unique (archivo_origen, fila_excel),
  constraint cosecha_analisis_anio_chk check (anio between 2000 and 2100)
);

create table if not exists public.exportacion_analisis (
  id uuid primary key default gen_random_uuid(),
  campo_ids uuid[] null,
  fecha date null,
  anio integer null,
  especie text null,
  variedad text not null,
  potrero_excel text not null,
  potrero_normalizado text null,
  cant_bins numeric(12, 3) not null default 0,
  enviados_kg numeric(14, 3) not null default 0,
  recepcionados_kg numeric(14, 3) not null default 0,
  diferencia_kg numeric(14, 3) not null default 0,
  bins_por_confirmar numeric(12, 3) not null default 0,
  kg_en_proceso numeric(14, 3) not null default 0,
  kg_por_procesar numeric(14, 3) not null default 0,
  exportados_kg numeric(14, 3) not null default 0,
  descarte_kg numeric(14, 3) not null default 0,
  precalibre_kg numeric(14, 3) not null default 0,
  desecho_kg numeric(14, 3) not null default 0,
  merma_kg numeric(14, 3) not null default 0,
  x_kg numeric(14, 3) not null default 0,
  porcentaje_expo numeric(8, 6) null,
  calibres_kg jsonb not null default '{}'::jsonb,
  calibres_cajas jsonb not null default '{}'::jsonb,
  calibres_kg_total numeric(14, 3) not null default 0,
  calibres_cajas_total numeric(14, 3) not null default 0,
  archivo_origen text not null default 'COSECHA SUPA.xlsx',
  fila_excel integer not null,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  constraint exportacion_analisis_origen_fila_key unique (archivo_origen, fila_excel),
  constraint exportacion_analisis_anio_chk check (anio is null or anio between 2000 and 2100)
);

alter table public.exportacion_analisis
  add column if not exists desecho_kg numeric(14, 3) not null default 0;

alter table public.cosecha_analisis
  drop constraint if exists cosecha_analisis_valores_chk;

alter table public.exportacion_analisis
  drop constraint if exists exportacion_analisis_valores_chk;

create index if not exists cosecha_analisis_fecha_idx on public.cosecha_analisis (fecha);
create index if not exists cosecha_analisis_anio_especie_idx on public.cosecha_analisis (anio, especie, variedad);
create index if not exists cosecha_analisis_campo_idx on public.cosecha_analisis (campo_id);
create index if not exists cosecha_analisis_potrero_bloque_idx on public.cosecha_analisis (potrero_normalizado, bloque_normalizado);

create index if not exists exportacion_analisis_fecha_idx on public.exportacion_analisis (fecha);
create index if not exists exportacion_analisis_anio_variedad_idx on public.exportacion_analisis (anio, variedad);
create index if not exists exportacion_analisis_potrero_idx on public.exportacion_analisis (potrero_normalizado);
create index if not exists exportacion_analisis_calibres_kg_gin on public.exportacion_analisis using gin (calibres_kg);
create index if not exists exportacion_analisis_calibres_cajas_gin on public.exportacion_analisis using gin (calibres_cajas);

create or replace view public.v_exportacion_analisis_calibres
with (security_invoker = true)
as
select
  ea.id,
  ea.fecha,
  ea.anio,
  ea.especie,
  ea.variedad,
  ea.potrero_excel,
  ea.potrero_normalizado,
  'kg'::text as unidad,
  item.key as calibre,
  (item.value)::numeric as cantidad
from public.exportacion_analisis ea
cross join lateral jsonb_each_text(ea.calibres_kg) as item
where (item.value)::numeric <> 0
union all
select
  ea.id,
  ea.fecha,
  ea.anio,
  ea.especie,
  ea.variedad,
  ea.potrero_excel,
  ea.potrero_normalizado,
  'cajas'::text as unidad,
  item.key as calibre,
  (item.value)::numeric as cantidad
from public.exportacion_analisis ea
cross join lateral jsonb_each_text(ea.calibres_cajas) as item
where (item.value)::numeric <> 0;

create or replace function public.set_cosecha_analisis_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.actualizado_en = now();
  return new;
end;
$$;

drop trigger if exists trg_cosecha_analisis_updated_at on public.cosecha_analisis;
create trigger trg_cosecha_analisis_updated_at
before update on public.cosecha_analisis
for each row
execute function public.set_cosecha_analisis_updated_at();

drop trigger if exists trg_exportacion_analisis_updated_at on public.exportacion_analisis;
create trigger trg_exportacion_analisis_updated_at
before update on public.exportacion_analisis
for each row
execute function public.set_cosecha_analisis_updated_at();

alter table public.cosecha_analisis enable row level security;
alter table public.exportacion_analisis enable row level security;

drop policy if exists cosecha_analisis_select on public.cosecha_analisis;
create policy cosecha_analisis_select on public.cosecha_analisis
for select to authenticated using (true);

drop policy if exists cosecha_analisis_write on public.cosecha_analisis;
create policy cosecha_analisis_write on public.cosecha_analisis
for all to authenticated using (true) with check (true);

drop policy if exists exportacion_analisis_select on public.exportacion_analisis;
create policy exportacion_analisis_select on public.exportacion_analisis
for select to authenticated using (true);

drop policy if exists exportacion_analisis_write on public.exportacion_analisis;
create policy exportacion_analisis_write on public.exportacion_analisis
for all to authenticated using (true) with check (true);

grant select, insert, update, delete on public.cosecha_analisis to authenticated;
grant select, insert, update, delete on public.exportacion_analisis to authenticated;
grant select on public.v_exportacion_analisis_calibres to authenticated;

commit;
