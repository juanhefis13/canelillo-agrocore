begin;

-- Base para captura movil, sincronizacion offline e identificacion de arboles.
create table if not exists public.monitoreo_plagas_catalogo (
  tipo_plaga text primary key,
  usa_huevos boolean not null default false,
  usa_ninfas_1 boolean not null default false,
  usa_ninfas_2 boolean not null default false,
  usa_ninfas_3 boolean not null default false,
  usa_adultos boolean not null default false,
  usa_larvas boolean not null default false,
  usa_pupas boolean not null default false,
  maximo_captura numeric(12, 3) not null default 10 check (maximo_captura > 0),
  activo boolean not null default true
);

insert into public.monitoreo_plagas_catalogo (
  tipo_plaga, usa_huevos, usa_ninfas_1, usa_ninfas_2, usa_ninfas_3,
  usa_adultos, usa_larvas, usa_pupas
)
select distinct
  mp.tipo_plaga,
  case when lower(mp.tipo_plaga) like 'ara%' or lower(mp.tipo_plaga) like 'mosquita%'
    or lower(mp.tipo_plaga) like 'trips%' or lower(mp.tipo_plaga) like 'chanchito%' then true else false end,
  case when lower(mp.tipo_plaga) like 'ara%' or lower(mp.tipo_plaga) like 'pulg%'
    or lower(mp.tipo_plaga) like 'chanchito%' then true else false end,
  case when lower(mp.tipo_plaga) like 'conchuela%' then true else false end,
  false,
  true,
  case when lower(mp.tipo_plaga) like 'mosquita%' or lower(mp.tipo_plaga) like 'trips%' then true else false end,
  case when lower(mp.tipo_plaga) like 'mosquita%' or lower(mp.tipo_plaga) like 'trips%' then true else false end
from public.monitoreo_plagas mp
where nullif(trim(mp.tipo_plaga), '') is not null
on conflict (tipo_plaga) do nothing;

alter table public.monitoreo_arboles
  alter column origen_fid drop not null;

alter table public.monitoreo_arboles
  add column if not exists id_operacion_cliente uuid null,
  add column if not exists precision_metros numeric(10, 2) null,
  add column if not exists ubicacion_fuente text not null default 'importado',
  add column if not exists creado_por uuid null references public.usuarios(id) on delete set null,
  add column if not exists creado_en timestamptz not null default now(),
  add column if not exists actualizado_en timestamptz not null default now();

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'monitoreo_arboles_ubicacion_fuente_chk'
      and conrelid = 'public.monitoreo_arboles'::regclass
  ) then
    alter table public.monitoreo_arboles
      add constraint monitoreo_arboles_ubicacion_fuente_chk
      check (ubicacion_fuente in ('gps', 'manual', 'importado'));
  end if;
end $$;

create unique index if not exists monitoreo_arboles_operacion_cliente_unq
  on public.monitoreo_arboles (id_operacion_cliente)
  where id_operacion_cliente is not null;

create sequence if not exists public.monitoreo_plagas_correlativo_seq;

alter table public.monitoreo_plagas
  add column if not exists correlativo bigint null,
  add column if not exists arbol_id uuid null references public.monitoreo_arboles(id) on delete set null,
  add column if not exists encontrada boolean not null default true,
  add column if not exists id_operacion_cliente uuid null,
  add column if not exists dispositivo_id text null,
  add column if not exists precision_metros numeric(10, 2) null,
  add column if not exists ubicacion_fuente text not null default 'importado',
  add column if not exists creado_por uuid null references public.usuarios(id) on delete set null,
  add column if not exists creado_en timestamptz not null default now(),
  add column if not exists actualizado_en timestamptz not null default now();

alter table public.monitoreo_plagas
  alter column correlativo set default nextval('public.monitoreo_plagas_correlativo_seq');

update public.monitoreo_plagas
set correlativo = nextval('public.monitoreo_plagas_correlativo_seq')
where correlativo is null;

alter table public.monitoreo_plagas
  alter column correlativo set not null;

select setval(
  'public.monitoreo_plagas_correlativo_seq',
  greatest(coalesce((select max(correlativo) from public.monitoreo_plagas), 0), 1),
  true
);

update public.monitoreo_plagas
set encontrada = (
  huevos + ninfas_1 + ninfas_2 + ninfas_3 + adultos + larvas + pupas
) > 0;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'monitoreo_plagas_ubicacion_fuente_chk'
      and conrelid = 'public.monitoreo_plagas'::regclass
  ) then
    alter table public.monitoreo_plagas
      add constraint monitoreo_plagas_ubicacion_fuente_chk
      check (ubicacion_fuente in ('gps', 'manual', 'importado'));
  end if;
end $$;

create unique index if not exists monitoreo_plagas_correlativo_unq
  on public.monitoreo_plagas (correlativo);
create unique index if not exists monitoreo_plagas_operacion_cliente_unq
  on public.monitoreo_plagas (id_operacion_cliente)
  where id_operacion_cliente is not null;
create index if not exists monitoreo_plagas_arbol_fecha_idx
  on public.monitoreo_plagas (arbol_id, fecha desc);

create or replace function public.validar_monitoreo_plaga_movil()
returns trigger
language plpgsql
as $$
declare
  config public.monitoreo_plagas_catalogo%rowtype;
  total_observado numeric;
begin
  new.actualizado_en := now();

  if new.id_operacion_cliente is null then
    return new;
  end if;

  select * into config
  from public.monitoreo_plagas_catalogo
  where tipo_plaga = new.tipo_plaga and activo;

  if not found then
    raise exception 'La plaga % no esta configurada para captura movil', new.tipo_plaga;
  end if;

  if not new.encontrada then
    new.huevos := 0;
    new.ninfas_1 := 0;
    new.ninfas_2 := 0;
    new.ninfas_3 := 0;
    new.adultos := 0;
    new.larvas := 0;
    new.pupas := 0;
    new.encontrado_en := 'Sin presencia';
  else
    if (not config.usa_huevos and new.huevos <> 0)
      or (not config.usa_ninfas_1 and new.ninfas_1 <> 0)
      or (not config.usa_ninfas_2 and new.ninfas_2 <> 0)
      or (not config.usa_ninfas_3 and new.ninfas_3 <> 0)
      or (not config.usa_adultos and new.adultos <> 0)
      or (not config.usa_larvas and new.larvas <> 0)
      or (not config.usa_pupas and new.pupas <> 0) then
      raise exception 'Se ingreso una etapa que no corresponde a %', new.tipo_plaga;
    end if;

    if greatest(new.huevos, new.ninfas_1, new.ninfas_2, new.ninfas_3,
      new.adultos, new.larvas, new.pupas) > config.maximo_captura then
      raise exception 'Cada conteo debe estar entre 0 y %', config.maximo_captura;
    end if;

    total_observado := new.huevos + new.ninfas_1 + new.ninfas_2 + new.ninfas_3
      + new.adultos + new.larvas + new.pupas;
    if total_observado <= 0 then
      raise exception 'Marca No encontrada o registra al menos una presencia';
    end if;
  end if;

  if new.arbol_id is not null then
    select
      coalesce(new.campo_id, ma.campo_id),
      coalesce(nullif(new.numero_arbol, ''), ma.numero_arbol),
      ma.latitud,
      ma.longitud
    into new.campo_id, new.numero_arbol, new.latitud, new.longitud
    from public.monitoreo_arboles ma
    where ma.id = new.arbol_id and ma.activo;
    if not found then
      raise exception 'El arbol seleccionado no existe o esta inactivo';
    end if;
  end if;

  if new.campo_id is not null then
    select c.potrero, c.bloque
    into new.potrero_excel, new.bloque_excel
    from public.campos c
    where c.id = new.campo_id;
  end if;

  new.creado_por := coalesce(new.creado_por, auth.uid());
  return new;
end;
$$;

drop trigger if exists validar_monitoreo_plaga_movil_trg on public.monitoreo_plagas;
create trigger validar_monitoreo_plaga_movil_trg
before insert or update on public.monitoreo_plagas
for each row execute function public.validar_monitoreo_plaga_movil();

create or replace function public.actualizar_monitoreo_arbol_movil()
returns trigger
language plpgsql
as $$
begin
  new.actualizado_en := now();
  new.creado_por := coalesce(new.creado_por, auth.uid());
  return new;
end;
$$;

drop trigger if exists actualizar_monitoreo_arbol_movil_trg on public.monitoreo_arboles;
create trigger actualizar_monitoreo_arbol_movil_trg
before insert or update on public.monitoreo_arboles
for each row execute function public.actualizar_monitoreo_arbol_movil();

alter table public.monitoreo_plagas_catalogo enable row level security;

drop policy if exists monitoreo_plagas_catalogo_lectura on public.monitoreo_plagas_catalogo;
create policy monitoreo_plagas_catalogo_lectura
  on public.monitoreo_plagas_catalogo for select to authenticated using (true);

drop policy if exists monitoreo_plagas_catalogo_admin on public.monitoreo_plagas_catalogo;
create policy monitoreo_plagas_catalogo_admin
  on public.monitoreo_plagas_catalogo for all to authenticated
  using (
    exists (select 1 from public.usuarios u where u.id = auth.uid()
      and lower(coalesce(u.rol::text, '')) = 'admin' and coalesce(u.activo, true))
  )
  with check (
    exists (select 1 from public.usuarios u where u.id = auth.uid()
      and lower(coalesce(u.rol::text, '')) = 'admin' and coalesce(u.activo, true))
  );

grant select on public.monitoreo_plagas_catalogo to authenticated;
grant usage, select on sequence public.monitoreo_plagas_correlativo_seq to authenticated;

notify pgrst, 'reload schema';

commit;
