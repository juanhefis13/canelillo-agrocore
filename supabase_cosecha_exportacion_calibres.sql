-- Soporte flexible para calibres y cajas de BD EXPORTACION SUPA.
-- Ejecutar una vez antes del archivo de actualizacion de datos.

begin;

alter table public.exportacion_analisis
  add column if not exists calibres_kg jsonb not null default '{}'::jsonb,
  add column if not exists calibres_cajas jsonb not null default '{}'::jsonb,
  add column if not exists calibres_kg_total numeric(14, 3) not null default 0,
  add column if not exists calibres_cajas_total numeric(14, 3) not null default 0;

create unique index if not exists exportacion_analisis_origen_fila_uidx
  on public.exportacion_analisis (archivo_origen, fila_excel);

create index if not exists exportacion_analisis_calibres_kg_gin
  on public.exportacion_analisis using gin (calibres_kg);

create index if not exists exportacion_analisis_calibres_cajas_gin
  on public.exportacion_analisis using gin (calibres_cajas);

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

grant select on public.v_exportacion_analisis_calibres to authenticated;

commit;

select
  count(*) as filas,
  count(*) filter (where calibres_kg <> '{}'::jsonb) as filas_con_calibres,
  count(*) filter (where calibres_cajas <> '{}'::jsonb) as filas_con_cajas
from public.exportacion_analisis;
