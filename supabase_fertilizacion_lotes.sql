-- Inventario de fertilizantes por caseta, producto, lote y folio.
-- El disponible se calcula como ingresos de lote menos producto usado en preparaciones.

begin;

create table if not exists public.fertilizante_lotes (
  id uuid primary key default gen_random_uuid(),
  caseta_id uuid not null references public.fertilizante_casetas(id) on update cascade on delete restrict,
  producto_id uuid not null references public.fertilizante_productos(id) on update cascade on delete restrict,
  fecha date not null default current_date,
  folio text not null,
  lote text null,
  unidad text not null,
  cantidad_total numeric(14, 3) not null,
  observacion text null,
  activo boolean not null default true,
  creado_por uuid null,
  creado_por_nombre text null,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  constraint fertilizante_lotes_cantidad_chk check (cantidad_total > 0),
  constraint fertilizante_lotes_unidad_chk check (unidad in ('KG', 'LT'))
);

create index if not exists fertilizante_lotes_caseta_producto_idx
  on public.fertilizante_lotes (caseta_id, producto_id, fecha desc);

create index if not exists fertilizante_lotes_folio_idx
  on public.fertilizante_lotes (folio);

create or replace view public.v_fertilizante_bodega_caseta as
with ingresos as (
  select
    fl.caseta_id,
    fl.producto_id,
    max(fl.unidad) as unidad,
    sum(fl.cantidad_total) as cantidad_ingresada,
    string_agg(distinct fl.folio, ', ' order by fl.folio) filter (where fl.folio is not null and fl.folio <> '') as folios,
    string_agg(distinct fl.lote, ', ' order by fl.lote) filter (where fl.lote is not null and fl.lote <> '') as lotes
  from public.fertilizante_lotes fl
  where fl.activo
  group by fl.caseta_id, fl.producto_id
), preparaciones as (
  select
    fe.caseta_id,
    fp.producto_id,
    sum(coalesce(fp.producto_cantidad, 0)) as cantidad_preparada
  from public.fertilizante_preparaciones fp
  join public.fertilizante_estanques fe on fe.id = fp.estanque_id
  where fp.producto_id is not null
  group by fe.caseta_id, fp.producto_id
)
select
  c.id as caseta_id,
  c.nombre as caseta,
  p.id as producto_id,
  p.nombre_comercial as producto,
  coalesce(i.unidad, p.unidad) as unidad,
  coalesce(i.cantidad_ingresada, 0) as cantidad_ingresada,
  coalesce(pr.cantidad_preparada, 0) as cantidad_preparada,
  coalesce(i.cantidad_ingresada, 0) - coalesce(pr.cantidad_preparada, 0) as cantidad_disponible,
  coalesce(i.folios, '') as folios,
  coalesce(i.lotes, '') as lotes
from public.fertilizante_casetas c
join ingresos i on i.caseta_id = c.id
join public.fertilizante_productos p on p.id = i.producto_id
left join preparaciones pr on pr.caseta_id = c.id and pr.producto_id = p.id
where c.activo and p.activo;

alter table public.fertilizante_lotes enable row level security;

drop policy if exists fertilizante_lotes_lectura on public.fertilizante_lotes;
create policy fertilizante_lotes_lectura
  on public.fertilizante_lotes
  for select
  to authenticated
  using (true);

drop policy if exists fertilizante_lotes_escritura on public.fertilizante_lotes;
create policy fertilizante_lotes_escritura
  on public.fertilizante_lotes
  for insert
  to authenticated
  with check (true);

drop policy if exists fertilizante_lotes_actualizar on public.fertilizante_lotes;
create policy fertilizante_lotes_actualizar
  on public.fertilizante_lotes
  for update
  to authenticated
  using (true)
  with check (true);

grant select, insert, update on public.fertilizante_lotes to authenticated;
grant select on public.v_fertilizante_bodega_caseta to authenticated;

commit;
