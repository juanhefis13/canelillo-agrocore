-- Programa mensual de fertilizacion 2026-2027.
-- Relaciona cada linea con campos, casetas y el maestro independiente de fertilizantes.

begin;

create table if not exists public.programa_fertilizante (
  id uuid primary key default gen_random_uuid(),
  campo_id uuid not null references public.campos(id) on update cascade on delete restrict,
  caseta_id uuid not null references public.fertilizante_casetas(id) on update cascade on delete restrict,
  producto_id uuid not null references public.fertilizante_productos(id) on update cascade on delete restrict,
  mes date not null,
  temporada text not null,
  dosis_por_ha numeric(14, 4) not null default 0,
  cantidad_programada numeric(14, 3) not null default 0,
  hectareas_programadas numeric(12, 3) not null default 0,
  archivo_origen text null,
  filas_excel text null,
  creado_por uuid null,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  constraint programa_fertilizante_mes_chk check (mes = date_trunc('month', mes)::date),
  constraint programa_fertilizante_dosis_chk check (dosis_por_ha >= 0),
  constraint programa_fertilizante_cantidad_chk check (cantidad_programada >= 0),
  constraint programa_fertilizante_hectareas_chk check (hectareas_programadas >= 0),
  constraint programa_fertilizante_unq unique (campo_id, caseta_id, producto_id, mes)
);

create index if not exists programa_fertilizante_mes_idx
  on public.programa_fertilizante (mes, campo_id);
create index if not exists programa_fertilizante_caseta_idx
  on public.programa_fertilizante (caseta_id, mes);
create index if not exists programa_fertilizante_producto_idx
  on public.programa_fertilizante (producto_id, mes);

create or replace view public.v_programa_fertilizante_analisis as
select
  pf.id,
  pf.campo_id,
  pf.caseta_id,
  pf.producto_id,
  pf.mes,
  pf.temporada,
  pf.dosis_por_ha,
  pf.cantidad_programada,
  pf.hectareas_programadas,
  pf.archivo_origen,
  pf.filas_excel,
  c.potrero,
  c.bloque,
  c.especie,
  c.variedad,
  c.hectareas,
  fc.nombre as caseta,
  fp.nombre_comercial as producto,
  fp.unidad,
  fp.n,
  fp.p,
  fp.k,
  fp.b,
  fp.zn,
  fp.mg,
  fp.ca,
  fp.ah,
  fp.af
from public.programa_fertilizante pf
join public.campos c on c.id = pf.campo_id
join public.fertilizante_casetas fc on fc.id = pf.caseta_id
join public.fertilizante_productos fp on fp.id = pf.producto_id;

alter table public.programa_fertilizante enable row level security;

drop policy if exists programa_fertilizante_lectura on public.programa_fertilizante;
create policy programa_fertilizante_lectura
  on public.programa_fertilizante for select to authenticated using (true);

drop policy if exists programa_fertilizante_escritura on public.programa_fertilizante;
create policy programa_fertilizante_escritura
  on public.programa_fertilizante for insert to authenticated with check (true);

drop policy if exists programa_fertilizante_actualizacion on public.programa_fertilizante;
create policy programa_fertilizante_actualizacion
  on public.programa_fertilizante for update to authenticated using (true) with check (true);

drop policy if exists programa_fertilizante_eliminacion on public.programa_fertilizante;
create policy programa_fertilizante_eliminacion
  on public.programa_fertilizante for delete to authenticated using (true);

grant select, insert, update, delete on public.programa_fertilizante to authenticated;
grant select on public.v_programa_fertilizante_analisis to authenticated;

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
     and not exists (
       select 1 from pg_publication_tables
       where pubname = 'supabase_realtime'
         and schemaname = 'public'
         and tablename = 'programa_fertilizante'
     ) then
    alter publication supabase_realtime add table public.programa_fertilizante;
  end if;
end $$;

commit;

select
  count(*) as filas_programa,
  min(mes) as primer_mes,
  max(mes) as ultimo_mes
from public.programa_fertilizante;
