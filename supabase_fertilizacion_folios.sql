-- Trazabilidad exacta: aplicacion -> preparacion -> folio.
-- Ejecutar despues de supabase_fertilizacion.sql,
-- supabase_fertilizacion_historial_usuario.sql y supabase_fertilizacion_lotes.sql.

begin;

alter table public.fertilizante_preparaciones
  add column if not exists lote_id uuid null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'fertilizante_preparaciones_lote_fk'
      and conrelid = 'public.fertilizante_preparaciones'::regclass
  ) then
    alter table public.fertilizante_preparaciones
      add constraint fertilizante_preparaciones_lote_fk
      foreign key (lote_id)
      references public.fertilizante_lotes(id)
      on update cascade
      on delete restrict;
  end if;
end;
$$;

create index if not exists fertilizante_preparaciones_lote_fecha_idx
  on public.fertilizante_preparaciones (lote_id, fecha desc)
  where lote_id is not null;

create table if not exists public.fertilizante_aplicacion_consumos (
  id uuid primary key default gen_random_uuid(),
  aplicacion_id uuid not null references public.fertilizante_aplicaciones(id) on update cascade on delete cascade,
  preparacion_id uuid not null references public.fertilizante_preparaciones(id) on update cascade on delete restrict,
  litros_consumidos numeric(14, 3) not null,
  disolucion numeric(18, 8) not null default 0,
  producto_consumido numeric(14, 6) not null default 0,
  creado_en timestamptz not null default now(),
  constraint fertilizante_aplicacion_consumos_litros_chk check (litros_consumidos > 0),
  constraint fertilizante_aplicacion_consumos_producto_chk check (producto_consumido >= 0),
  constraint fertilizante_aplicacion_consumos_unq unique (aplicacion_id, preparacion_id)
);

create index if not exists fertilizante_consumos_aplicacion_idx
  on public.fertilizante_aplicacion_consumos (aplicacion_id);

create index if not exists fertilizante_consumos_preparacion_idx
  on public.fertilizante_aplicacion_consumos (preparacion_id);

alter table public.fertilizante_aplicacion_consumos enable row level security;

drop policy if exists fertilizante_consumos_lectura on public.fertilizante_aplicacion_consumos;
create policy fertilizante_consumos_lectura
  on public.fertilizante_aplicacion_consumos
  for select
  to authenticated
  using (true);

create or replace function public.validar_fertilizante_preparacion_lote()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_lote_caseta uuid;
  v_lote_producto uuid;
  v_lote_total numeric;
  v_estanque_caseta uuid;
  v_preparado numeric;
  v_litros_consumidos numeric;
begin
  if new.lote_id is null then
    return new;
  end if;

  select caseta_id, producto_id, cantidad_total
  into v_lote_caseta, v_lote_producto, v_lote_total
  from public.fertilizante_lotes
  where id = new.lote_id
    and activo
  for update;

  if not found then
    raise exception 'El lote o folio seleccionado no existe o esta inactivo';
  end if;

  select caseta_id
  into v_estanque_caseta
  from public.fertilizante_estanques
  where id = new.estanque_id;

  if v_lote_caseta is distinct from v_estanque_caseta then
    raise exception 'El folio no pertenece a la caseta del estanque';
  end if;

  if new.producto_id is null or v_lote_producto is distinct from new.producto_id then
    raise exception 'El folio no pertenece al producto de la preparacion';
  end if;

  select coalesce(sum(producto_cantidad), 0)
  into v_preparado
  from public.fertilizante_preparaciones
  where lote_id = new.lote_id
    and id is distinct from new.id;

  if coalesce(new.producto_cantidad, 0) > v_lote_total - v_preparado then
    raise exception 'La cantidad supera el saldo del folio disponible para preparar';
  end if;

  if tg_op = 'UPDATE' then
    select coalesce(sum(litros_consumidos), 0)
    into v_litros_consumidos
    from public.fertilizante_aplicacion_consumos
    where preparacion_id = new.id;

    if coalesce(new.cantidad_litros, 0) < v_litros_consumidos then
      raise exception 'La preparacion ya tiene % litros aplicados y no puede reducirse', v_litros_consumidos;
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists fertilizante_preparaciones_validar_lote_trg
  on public.fertilizante_preparaciones;
create trigger fertilizante_preparaciones_validar_lote_trg
before insert or update of lote_id, producto_id, producto_cantidad, cantidad_litros, estanque_id
on public.fertilizante_preparaciones
for each row
execute function public.validar_fertilizante_preparacion_lote();

create or replace function public.sincronizar_fertilizante_consumo_producto()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.fertilizante_aplicacion_consumos
  set
    disolucion = case when new.cantidad_litros > 0 then coalesce(new.producto_cantidad, 0) / new.cantidad_litros else 0 end,
    producto_consumido = case when new.cantidad_litros > 0 then litros_consumidos * coalesce(new.producto_cantidad, 0) / new.cantidad_litros else 0 end
  where preparacion_id = new.id;
  return new;
end;
$$;

drop trigger if exists fertilizante_preparaciones_sync_consumo_trg
  on public.fertilizante_preparaciones;
create trigger fertilizante_preparaciones_sync_consumo_trg
after update of producto_cantidad, cantidad_litros
on public.fertilizante_preparaciones
for each row
execute function public.sincronizar_fertilizante_consumo_producto();

create or replace function public.asignar_fertilizante_consumo_aplicacion(p_aplicacion_id uuid, p_estricto boolean default true)
returns numeric
language plpgsql
security definer
set search_path = public
as $$
declare
  v_aplicacion public.fertilizante_aplicaciones%rowtype;
  v_preparacion record;
  v_restante numeric;
  v_ya_consumido numeric;
  v_disponible numeric;
  v_asignado numeric;
  v_disolucion numeric;
begin
  select *
  into v_aplicacion
  from public.fertilizante_aplicaciones
  where id = p_aplicacion_id;

  if not found then
    raise exception 'No existe la aplicacion de fertilizante %', p_aplicacion_id;
  end if;

  if exists (
    select 1
    from public.fertilizante_aplicacion_consumos
    where aplicacion_id = p_aplicacion_id
  ) then
    return 0;
  end if;

  v_restante := v_aplicacion.cantidad_litros;

  for v_preparacion in
    select p.id, p.cantidad_litros, p.producto_cantidad
    from public.fertilizante_preparaciones p
    where p.estanque_id = v_aplicacion.estanque_id
      and p.fecha <= v_aplicacion.fecha
      and p.lote_id is not null
    order by p.fecha, p.creado_en, p.id
    for update
  loop
    select coalesce(sum(c.litros_consumidos), 0)
    into v_ya_consumido
    from public.fertilizante_aplicacion_consumos c
    where c.preparacion_id = v_preparacion.id;

    v_disponible := greatest(0, v_preparacion.cantidad_litros - v_ya_consumido);
    if v_disponible <= 0 then
      continue;
    end if;

    v_asignado := least(v_restante, v_disponible);
    v_disolucion := case
      when v_preparacion.cantidad_litros > 0
        then coalesce(v_preparacion.producto_cantidad, 0) / v_preparacion.cantidad_litros
      else 0
    end;

    insert into public.fertilizante_aplicacion_consumos (
      aplicacion_id,
      preparacion_id,
      litros_consumidos,
      disolucion,
      producto_consumido
    ) values (
      v_aplicacion.id,
      v_preparacion.id,
      v_asignado,
      v_disolucion,
      v_asignado * v_disolucion
    );

    v_restante := v_restante - v_asignado;
    exit when v_restante <= 0.000001;
  end loop;

  if v_restante > 0.000001 and p_estricto then
    raise exception 'La aplicacion supera en % L el saldo de las preparaciones del estanque', v_restante;
  end if;

  return greatest(0, v_restante);
end;
$$;

create or replace function public.trazar_fertilizante_aplicacion()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'UPDATE' then
    delete from public.fertilizante_aplicacion_consumos
    where aplicacion_id = new.id;
  end if;

  perform public.asignar_fertilizante_consumo_aplicacion(new.id, true);
  return new;
end;
$$;

drop trigger if exists fertilizante_aplicaciones_trazabilidad_trg
  on public.fertilizante_aplicaciones;
create trigger fertilizante_aplicaciones_trazabilidad_trg
after insert or update of estanque_id, fecha, cantidad_litros
on public.fertilizante_aplicaciones
for each row
execute function public.trazar_fertilizante_aplicacion();

-- Vincula registros historicos solamente cuando existe preparacion suficiente.
do $$
declare
  v_aplicacion record;
begin
  for v_aplicacion in
    select a.id
    from public.fertilizante_aplicaciones a
    where not exists (
      select 1
      from public.fertilizante_aplicacion_consumos c
      where c.aplicacion_id = a.id
    )
    order by a.fecha, a.creado_en, a.id
  loop
    begin
      perform public.asignar_fertilizante_consumo_aplicacion(v_aplicacion.id, true);
    exception when others then
      raise notice 'Aplicacion historica % pendiente de trazabilidad: %', v_aplicacion.id, sqlerrm;
    end;
  end loop;
end;
$$;

drop view if exists public.v_fertilizante_folios;
create view public.v_fertilizante_folios as
select
  l.id,
  l.fecha,
  l.caseta_id,
  c.nombre as caseta,
  l.producto_id,
  p.nombre_comercial as producto,
  l.folio,
  l.lote,
  l.unidad,
  l.cantidad_total,
  coalesce(prep.cantidad_preparada, 0) as cantidad_preparada,
  coalesce(cons.cantidad_aplicada, 0) as cantidad_aplicada,
  greatest(0, coalesce(prep.cantidad_preparada, 0) - coalesce(cons.cantidad_aplicada, 0)) as cantidad_en_preparaciones,
  l.cantidad_total - coalesce(prep.cantidad_preparada, 0) as cantidad_disponible_preparar,
  l.cantidad_total - coalesce(cons.cantidad_aplicada, 0) as cantidad_no_aplicada,
  cons.ultima_aplicacion,
  coalesce(cons.aplicaciones, 0) as aplicaciones,
  l.creado_por,
  l.creado_por_nombre,
  l.creado_en
from public.fertilizante_lotes l
join public.fertilizante_casetas c on c.id = l.caseta_id
join public.fertilizante_productos p on p.id = l.producto_id
left join lateral (
  select sum(pr.producto_cantidad) as cantidad_preparada
  from public.fertilizante_preparaciones pr
  where pr.lote_id = l.id
) prep on true
left join lateral (
  select
    sum(ac.producto_consumido) as cantidad_aplicada,
    max(a.fecha) as ultima_aplicacion,
    count(distinct a.id) as aplicaciones
  from public.fertilizante_preparaciones pr
  join public.fertilizante_aplicacion_consumos ac on ac.preparacion_id = pr.id
  join public.fertilizante_aplicaciones a on a.id = ac.aplicacion_id
  where pr.lote_id = l.id
) cons on true
where l.activo;

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
), aplicaciones as (
  select
    fe.caseta_id,
    fp.producto_id,
    sum(coalesce(fc.producto_consumido, 0)) as cantidad_aplicada
  from public.fertilizante_aplicacion_consumos fc
  join public.fertilizante_preparaciones fp on fp.id = fc.preparacion_id
  join public.fertilizante_estanques fe on fe.id = fp.estanque_id
  group by fe.caseta_id, fp.producto_id
)
select
  c.id as caseta_id,
  c.nombre as caseta,
  p.id as producto_id,
  p.nombre_comercial as producto,
  coalesce(i.unidad, p.unidad) as unidad,
  coalesce(i.cantidad_ingresada, 0) as cantidad_ingresada,
  coalesce(ap.cantidad_aplicada, 0) as cantidad_preparada,
  coalesce(i.cantidad_ingresada, 0) - coalesce(ap.cantidad_aplicada, 0) as cantidad_disponible,
  coalesce(i.folios, '') as folios,
  coalesce(i.lotes, '') as lotes
from public.fertilizante_casetas c
join ingresos i on i.caseta_id = c.id
join public.fertilizante_productos p on p.id = i.producto_id
left join aplicaciones ap on ap.caseta_id = c.id and ap.producto_id = p.id
where c.activo and p.activo;

grant select on public.fertilizante_aplicacion_consumos, public.v_fertilizante_folios to authenticated;
grant select, insert, update on public.fertilizante_preparaciones to authenticated;

commit;
