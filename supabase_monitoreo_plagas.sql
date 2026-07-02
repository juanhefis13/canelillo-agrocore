begin;

-- CirrusAgro forma parte del catalogo de campos y debe existir antes del import.
insert into public.campos (potrero, bloque, especie, variedad, hectareas, activo)
values
  ('CirrusAgro', '1', 'MANDARINA', 'MURCOTT', 0, true),
  ('CirrusAgro', '2', 'MANDARINA', 'MURCOTT', 0, true),
  ('CirrusAgro', '3', 'MANDARINA', 'MURCOTT', 3.000, true),
  ('CirrusAgro', '4', 'MANDARINA', 'MURCOTT', 0, true),
  ('CirrusAgro', '5', 'MANDARINA', 'MURCOTT', 0, true)
on conflict (potrero, bloque) do update
set
  especie = excluded.especie,
  variedad = excluded.variedad,
  hectareas = case
    when excluded.hectareas > 0 then excluded.hectareas
    else public.campos.hectareas
  end,
  activo = true;

create table if not exists public.monitoreo_plagas (
  id uuid primary key default gen_random_uuid(),
  campo_id uuid null references public.campos(id) on update cascade on delete set null,
  fecha date null,
  tipo_plaga text not null,

  -- Copia sincronizada del nombre canonico de public.campos.
  potrero_excel text null,
  bloque_excel text null,
  huevos numeric(12, 3) not null default 0,
  ninfas_1 numeric(12, 3) not null default 0,
  ninfas_2 numeric(12, 3) not null default 0,
  ninfas_3 numeric(12, 3) not null default 0,
  adultos numeric(12, 3) not null default 0,
  larvas numeric(12, 3) not null default 0,
  pupas numeric(12, 3) not null default 0,
  numero_arbol text null,
  orden_monitoreo text null,
  encontrado_en text null,
  total_calculado numeric(12, 3) generated always as (
    huevos + ninfas_1 + ninfas_2 + ninfas_3
  ) stored,

  -- La geometria usa los mismos poligonos normalizados del modulo Calicatas.
  latitud double precision not null,
  longitud double precision not null,

  constraint monitoreo_plagas_tipo_chk check (length(trim(tipo_plaga)) > 0),
  constraint monitoreo_plagas_latitud_chk check (latitud between -90 and 90),
  constraint monitoreo_plagas_longitud_chk check (longitud between -180 and 180),
  constraint monitoreo_plagas_conteos_chk check (
    huevos >= 0 and ninfas_1 >= 0 and ninfas_2 >= 0 and ninfas_3 >= 0
    and adultos >= 0 and larvas >= 0 and pupas >= 0
  )
);

create index if not exists monitoreo_plagas_fecha_idx
  on public.monitoreo_plagas (fecha desc);
create index if not exists monitoreo_plagas_tipo_fecha_idx
  on public.monitoreo_plagas (tipo_plaga, fecha desc);
create index if not exists monitoreo_plagas_campo_fecha_idx
  on public.monitoreo_plagas (campo_id, fecha desc);
create index if not exists monitoreo_plagas_ubicacion_idx
  on public.monitoreo_plagas (latitud, longitud);
create index if not exists monitoreo_plagas_excel_fecha_idx
  on public.monitoreo_plagas (potrero_excel, bloque_excel, fecha desc);

create or replace view public.v_monitoreo_plagas
with (security_invoker = true)
as
select
  mp.id,
  mp.campo_id,
  mp.fecha,
  mp.tipo_plaga,
  coalesce(c.potrero, 'Sin potrero') as potrero,
  c.bloque,
  c.especie,
  c.variedad,
  c.hectareas,
  (mp.campo_id is not null) as campo_normalizado,
  mp.potrero_excel,
  mp.bloque_excel,
  mp.numero_arbol,
  mp.orden_monitoreo,
  mp.encontrado_en,
  mp.total_calculado,
  mp.huevos,
  mp.ninfas_1,
  mp.ninfas_2,
  mp.ninfas_3,
  mp.adultos,
  mp.larvas,
  mp.pupas,
  mp.longitud,
  mp.latitud,
  mp.total_calculado as total_huevos_ninfas,
  (
    mp.huevos + mp.ninfas_1 + mp.ninfas_2 + mp.ninfas_3
    + mp.adultos + mp.larvas + mp.pupas
  ) as carga_observada
from public.monitoreo_plagas mp
left join public.campos c on c.id = mp.campo_id;

alter table public.monitoreo_plagas enable row level security;

drop policy if exists monitoreo_plagas_lectura on public.monitoreo_plagas;
create policy monitoreo_plagas_lectura
  on public.monitoreo_plagas
  for select
  to authenticated
  using (true);

drop policy if exists monitoreo_plagas_escritura on public.monitoreo_plagas;
create policy monitoreo_plagas_escritura
  on public.monitoreo_plagas
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.usuarios u
      where u.id = auth.uid()
        and lower(coalesce(u.rol::text, '')) in ('admin', 'supervisor')
        and coalesce(u.activo, true)
    )
  );

drop policy if exists monitoreo_plagas_actualizacion on public.monitoreo_plagas;
create policy monitoreo_plagas_actualizacion
  on public.monitoreo_plagas
  for update
  to authenticated
  using (
    exists (
      select 1 from public.usuarios u
      where u.id = auth.uid()
        and lower(coalesce(u.rol::text, '')) in ('admin', 'supervisor')
        and coalesce(u.activo, true)
    )
  )
  with check (
    exists (
      select 1 from public.usuarios u
      where u.id = auth.uid()
        and lower(coalesce(u.rol::text, '')) in ('admin', 'supervisor')
        and coalesce(u.activo, true)
    )
  );

drop policy if exists monitoreo_plagas_eliminacion on public.monitoreo_plagas;
create policy monitoreo_plagas_eliminacion
  on public.monitoreo_plagas
  for delete
  to authenticated
  using (
    exists (
      select 1 from public.usuarios u
      where u.id = auth.uid()
        and lower(coalesce(u.rol::text, '')) = 'admin'
        and coalesce(u.activo, true)
    )
  );

grant select on public.monitoreo_plagas to authenticated;
grant select on public.v_monitoreo_plagas to authenticated;
grant insert, update, delete on public.monitoreo_plagas to authenticated;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'monitoreo_plagas'
  ) then
    alter publication supabase_realtime add table public.monitoreo_plagas;
  end if;
end $$;

notify pgrst, 'reload schema';

commit;

select
  count(*) as campos_cirrus,
  string_agg(bloque, ', ' order by bloque) as bloques
from public.campos
where lower(trim(potrero)) = lower('CirrusAgro');
