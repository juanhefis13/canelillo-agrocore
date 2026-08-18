begin;

create table if not exists public.monitoreo_arboles (
  id uuid primary key default gen_random_uuid(),
  origen_fid bigint not null,
  campo_id uuid null references public.campos(id) on update cascade on delete set null,
  fecha_referencia date null,
  numero_arbol text not null,
  hilera text null,
  sector_monitoreo text null,
  potrero_origen text null,
  bloque_origen text null,
  longitud double precision not null,
  latitud double precision not null,
  activo boolean not null default true,

  constraint monitoreo_arboles_origen_fid_unq unique (origen_fid),
  constraint monitoreo_arboles_numero_chk check (length(trim(numero_arbol)) > 0),
  constraint monitoreo_arboles_latitud_chk check (latitud between -90 and 90),
  constraint monitoreo_arboles_longitud_chk check (longitud between -180 and 180)
);

create index if not exists monitoreo_arboles_campo_idx
  on public.monitoreo_arboles (campo_id, numero_arbol);
create index if not exists monitoreo_arboles_fecha_idx
  on public.monitoreo_arboles (fecha_referencia desc);
create index if not exists monitoreo_arboles_ubicacion_idx
  on public.monitoreo_arboles (latitud, longitud);

create or replace view public.v_monitoreo_arboles
with (security_invoker = true)
as
select
  ma.id,
  ma.origen_fid,
  ma.campo_id,
  ma.fecha_referencia,
  ma.numero_arbol,
  ma.hilera,
  ma.sector_monitoreo,
  coalesce(c.potrero, ma.potrero_origen, 'Sin potrero') as potrero,
  coalesce(c.bloque, ma.bloque_origen) as bloque,
  c.especie,
  c.variedad,
  c.hectareas,
  (ma.campo_id is not null) as campo_normalizado,
  ma.potrero_origen,
  ma.bloque_origen,
  ma.longitud,
  ma.latitud,
  ma.activo
from public.monitoreo_arboles ma
left join public.campos c on c.id = ma.campo_id;

alter table public.monitoreo_arboles enable row level security;

drop policy if exists monitoreo_arboles_lectura on public.monitoreo_arboles;
create policy monitoreo_arboles_lectura
  on public.monitoreo_arboles
  for select
  to authenticated
  using (true);

drop policy if exists monitoreo_arboles_escritura on public.monitoreo_arboles;
create policy monitoreo_arboles_escritura
  on public.monitoreo_arboles
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

drop policy if exists monitoreo_arboles_actualizacion on public.monitoreo_arboles;
create policy monitoreo_arboles_actualizacion
  on public.monitoreo_arboles
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

drop policy if exists monitoreo_arboles_eliminacion on public.monitoreo_arboles;
create policy monitoreo_arboles_eliminacion
  on public.monitoreo_arboles
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

grant select on public.monitoreo_arboles to authenticated;
grant select on public.v_monitoreo_arboles to authenticated;
grant insert, update, delete on public.monitoreo_arboles to authenticated;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'monitoreo_arboles'
  ) then
    alter publication supabase_realtime add table public.monitoreo_arboles;
  end if;
end $$;

notify pgrst, 'reload schema';

commit;
