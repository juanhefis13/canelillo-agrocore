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

commit;

