-- Reversion auditada de preparaciones y aplicaciones de fertilizante.
-- Ejecutar una vez despues de supabase_fertilizacion_folios.sql.

begin;

alter table public.fertilizante_preparaciones
  add column if not exists revertida boolean not null default false,
  add column if not exists revertida_en timestamptz null,
  add column if not exists revertida_por uuid null,
  add column if not exists revertida_por_nombre text null,
  add column if not exists motivo_reversion text null;

alter table public.fertilizante_aplicaciones
  add column if not exists revertida boolean not null default false,
  add column if not exists revertida_en timestamptz null,
  add column if not exists revertida_por uuid null,
  add column if not exists revertida_por_nombre text null,
  add column if not exists motivo_reversion text null;

create index if not exists fertilizante_preparaciones_activas_estanque_fecha_idx
  on public.fertilizante_preparaciones (estanque_id, fecha desc)
  where not revertida;

create index if not exists fertilizante_aplicaciones_activas_estanque_fecha_idx
  on public.fertilizante_aplicaciones (estanque_id, fecha desc)
  where not revertida;

create or replace function public.proteger_fertilizante_reversion()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if current_setting('app.fertilizer_reversal', true) = '1' then
    return new;
  end if;

  if old.revertida then
    raise exception 'Una operacion revertida no puede volver a modificarse';
  end if;

  if new.revertida is distinct from old.revertida
     or new.revertida_en is distinct from old.revertida_en
     or new.revertida_por is distinct from old.revertida_por
     or new.revertida_por_nombre is distinct from old.revertida_por_nombre
     or new.motivo_reversion is distinct from old.motivo_reversion then
    raise exception 'Usa revertir_fertilizante_operacion para revertir el registro';
  end if;

  return new;
end;
$$;

drop trigger if exists fertilizante_preparaciones_proteger_reversion_trg
  on public.fertilizante_preparaciones;
create trigger fertilizante_preparaciones_proteger_reversion_trg
before update on public.fertilizante_preparaciones
for each row execute function public.proteger_fertilizante_reversion();

drop trigger if exists fertilizante_aplicaciones_proteger_reversion_trg
  on public.fertilizante_aplicaciones;
create trigger fertilizante_aplicaciones_proteger_reversion_trg
before update on public.fertilizante_aplicaciones
for each row execute function public.proteger_fertilizante_reversion();

create or replace function public.revertir_fertilizante_operacion(
  p_tipo text,
  p_id uuid,
  p_motivo text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tipo text := lower(btrim(coalesce(p_tipo, '')));
  v_motivo text := btrim(coalesce(p_motivo, ''));
  v_usuario uuid := auth.uid();
  v_usuario_nombre text;
  v_revertida boolean;
  v_consumos_activos integer;
  v_revertida_en timestamptz := now();
begin
  if v_usuario is null then
    raise exception 'Debes iniciar sesion para revertir operaciones';
  end if;

  if public.current_app_role()::text not in ('admin', 'supervisor', 'bodeguero') then
    raise exception 'Tu perfil no tiene permisos para revertir operaciones'
      using errcode = '42501';
  end if;

  if p_id is null then
    raise exception 'El identificador de la operacion es obligatorio';
  end if;

  if length(v_motivo) < 3 then
    raise exception 'El motivo de la reversa debe tener al menos 3 caracteres';
  end if;

  if length(v_motivo) > 500 then
    raise exception 'El motivo de la reversa no puede superar 500 caracteres';
  end if;

  select coalesce(nullif(btrim(u.nombre_completo), ''), auth.jwt() ->> 'email', 'Usuario')
  into v_usuario_nombre
  from public.usuarios u
  where u.id = v_usuario;

  v_usuario_nombre := coalesce(v_usuario_nombre, auth.jwt() ->> 'email', 'Usuario');
  perform set_config('app.fertilizer_reversal', '1', true);

  if v_tipo in ('aplicacion', 'application') then
    select a.revertida
    into v_revertida
    from public.fertilizante_aplicaciones a
    where a.id = p_id
    for update;

    if not found then
      raise exception 'No existe la aplicacion indicada';
    end if;
    if v_revertida then
      raise exception 'La aplicacion ya fue revertida';
    end if;

    update public.fertilizante_aplicaciones
    set
      revertida = true,
      revertida_en = v_revertida_en,
      revertida_por = v_usuario,
      revertida_por_nombre = v_usuario_nombre,
      motivo_reversion = v_motivo
    where id = p_id;

  elsif v_tipo in ('preparacion', 'preparation') then
    select p.revertida
    into v_revertida
    from public.fertilizante_preparaciones p
    where p.id = p_id
    for update;

    if not found then
      raise exception 'No existe la preparacion indicada';
    end if;
    if v_revertida then
      raise exception 'La preparacion ya fue revertida';
    end if;

    select count(*)
    into v_consumos_activos
    from public.fertilizante_aplicacion_consumos c
    join public.fertilizante_aplicaciones a on a.id = c.aplicacion_id
    where c.preparacion_id = p_id
      and not coalesce(a.revertida, false);

    if v_consumos_activos > 0 then
      raise exception 'La preparacion tiene aplicaciones activas. Revierte primero esas aplicaciones';
    end if;

    update public.fertilizante_preparaciones
    set
      revertida = true,
      revertida_en = v_revertida_en,
      revertida_por = v_usuario,
      revertida_por_nombre = v_usuario_nombre,
      motivo_reversion = v_motivo
    where id = p_id;
  else
    raise exception 'Tipo de operacion no valido: usa aplicacion o preparacion';
  end if;

  return jsonb_build_object(
    'id', p_id,
    'tipo', v_tipo,
    'revertida', true,
    'revertida_en', v_revertida_en,
    'revertida_por', v_usuario,
    'revertida_por_nombre', v_usuario_nombre
  );
end;
$$;

create or replace function public.validar_capacidad_fertilizante_estanque()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_caseta_id uuid;
  v_estanque_key text;
  v_capacidad numeric;
  v_preparado numeric;
  v_aplicado numeric;
  v_actual numeric;
  v_old_id uuid;
begin
  if tg_op = 'UPDATE' then v_old_id := old.id; end if;

  select e.caseta_id, e.numero_estanque_normalizado
  into v_caseta_id, v_estanque_key
  from public.fertilizante_estanques e
  where e.id = new.estanque_id and e.activo;

  if v_caseta_id is null then
    raise exception 'El estanque seleccionado no existe o esta inactivo';
  end if;

  perform pg_advisory_xact_lock(hashtext(v_caseta_id::text || '|' || v_estanque_key));

  select max(e.volumen_maximo_litros)
  into v_capacidad
  from public.fertilizante_estanques e
  where e.activo and e.caseta_id = v_caseta_id
    and e.numero_estanque_normalizado = v_estanque_key;

  select coalesce(sum(p.cantidad_litros), 0)
  into v_preparado
  from public.fertilizante_preparaciones p
  join public.fertilizante_estanques e on e.id = p.estanque_id
  where e.activo and e.caseta_id = v_caseta_id
    and e.numero_estanque_normalizado = v_estanque_key
    and not coalesce(p.revertida, false)
    and (v_old_id is null or p.id <> v_old_id);

  select coalesce(sum(a.cantidad_litros), 0)
  into v_aplicado
  from public.fertilizante_aplicaciones a
  join public.fertilizante_estanques e on e.id = a.estanque_id
  where e.activo and e.caseta_id = v_caseta_id
    and e.numero_estanque_normalizado = v_estanque_key
    and not coalesce(a.revertida, false);

  v_actual := greatest(0, v_preparado - v_aplicado);
  if coalesce(v_capacidad, 0) <= 0 then
    raise exception 'El estanque no tiene una capacidad maxima configurada';
  end if;
  if v_actual + new.cantidad_litros > v_capacidad + 0.000001 then
    raise exception 'La preparacion supera la capacidad del estanque. Disponible: % L de % L',
      greatest(0, v_capacidad - v_actual), v_capacidad;
  end if;
  return new;
end;
$$;

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
  if new.lote_id is null or coalesce(new.revertida, false) then return new; end if;

  select caseta_id, producto_id, cantidad_total
  into v_lote_caseta, v_lote_producto, v_lote_total
  from public.fertilizante_lotes
  where id = new.lote_id and activo
  for update;

  if not found then raise exception 'El lote o folio seleccionado no existe o esta inactivo'; end if;

  select caseta_id into v_estanque_caseta
  from public.fertilizante_estanques where id = new.estanque_id;

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
    and id is distinct from new.id
    and not coalesce(revertida, false);

  if coalesce(new.producto_cantidad, 0) > v_lote_total - v_preparado then
    raise exception 'La cantidad supera el saldo del folio disponible para preparar';
  end if;

  if tg_op = 'UPDATE' then
    select coalesce(sum(c.litros_consumidos), 0)
    into v_litros_consumidos
    from public.fertilizante_aplicacion_consumos c
    join public.fertilizante_aplicaciones a on a.id = c.aplicacion_id
    where c.preparacion_id = new.id
      and not coalesce(a.revertida, false);

    if coalesce(new.cantidad_litros, 0) < v_litros_consumidos then
      raise exception 'La preparacion ya tiene % litros aplicados y no puede reducirse', v_litros_consumidos;
    end if;
  end if;
  return new;
end;
$$;

create or replace function public.asignar_fertilizante_consumo_aplicacion(
  p_aplicacion_id uuid,
  p_estricto boolean default true
)
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
  select * into v_aplicacion
  from public.fertilizante_aplicaciones
  where id = p_aplicacion_id;

  if not found then raise exception 'No existe la aplicacion de fertilizante %', p_aplicacion_id; end if;
  if coalesce(v_aplicacion.revertida, false) then
    raise exception 'La aplicacion esta revertida y no puede volver a asignarse';
  end if;

  if exists (select 1 from public.fertilizante_aplicacion_consumos where aplicacion_id = p_aplicacion_id) then
    return 0;
  end if;

  v_restante := v_aplicacion.cantidad_litros;
  for v_preparacion in
    select p.id, p.cantidad_litros, p.producto_cantidad
    from public.fertilizante_preparaciones p
    where p.estanque_id = v_aplicacion.estanque_id
      and p.fecha <= v_aplicacion.fecha
      and p.lote_id is not null
      and not coalesce(p.revertida, false)
    order by p.fecha, p.creado_en, p.id
    for update
  loop
    select coalesce(sum(c.litros_consumidos), 0)
    into v_ya_consumido
    from public.fertilizante_aplicacion_consumos c
    join public.fertilizante_aplicaciones a on a.id = c.aplicacion_id
    where c.preparacion_id = v_preparacion.id
      and not coalesce(a.revertida, false);

    v_disponible := greatest(0, v_preparacion.cantidad_litros - v_ya_consumido);
    if v_disponible <= 0 then continue; end if;

    v_asignado := least(v_restante, v_disponible);
    v_disolucion := case when v_preparacion.cantidad_litros > 0
      then coalesce(v_preparacion.producto_cantidad, 0) / v_preparacion.cantidad_litros else 0 end;

    insert into public.fertilizante_aplicacion_consumos (
      aplicacion_id, preparacion_id, litros_consumidos, disolucion, producto_consumido
    ) values (
      v_aplicacion.id, v_preparacion.id, v_asignado, v_disolucion, v_asignado * v_disolucion
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

create or replace view public.v_fertilizante_estado_estanques as
with prep as (
  select estanque_id, sum(cantidad_litros) as litros_preparados, max(fecha) as ultima_preparacion
  from public.fertilizante_preparaciones
  where not coalesce(revertida, false)
  group by estanque_id
), apl as (
  select estanque_id, sum(cantidad_litros) as litros_aplicados, max(fecha) as ultima_aplicacion
  from public.fertilizante_aplicaciones
  where not coalesce(revertida, false)
  group by estanque_id
), potreros as (
  select ep.estanque_id,
    string_agg(distinct ep.potrero, ', ' order by ep.potrero) as potreros,
    jsonb_agg(distinct jsonb_build_object('potrero', ep.potrero, 'campo_id', ep.campo_id)) as potreros_json
  from public.fertilizante_estanque_potreros ep
  where ep.activo
  group by ep.estanque_id
)
select
  e.id, c.nombre as caseta, c.nombre_normalizado as caseta_key,
  e.numero_estanque, e.numero_estanque_normalizado as estanque_key,
  e.fip, e.fip_normalizado as fip_key, e.volumen_maximo_litros,
  greatest(0, coalesce(prep.litros_preparados, 0) - coalesce(apl.litros_aplicados, 0)) as litros_actuales,
  coalesce(prep.litros_preparados, 0) as litros_preparados,
  coalesce(apl.litros_aplicados, 0) as litros_aplicados,
  prep.ultima_preparacion, apl.ultima_aplicacion,
  coalesce(potreros.potreros, '') as potreros,
  coalesce(potreros.potreros_json, '[]'::jsonb) as potreros_json,
  e.activo
from public.fertilizante_estanques e
join public.fertilizante_casetas c on c.id = e.caseta_id
left join prep on prep.estanque_id = e.id
left join apl on apl.estanque_id = e.id
left join potreros on potreros.estanque_id = e.id;

create or replace view public.v_fertilizante_folios as
select
  l.id, l.fecha, l.caseta_id, c.nombre as caseta, l.producto_id,
  p.nombre_comercial as producto, l.folio, l.lote, l.unidad, l.cantidad_total,
  coalesce(prep.cantidad_preparada, 0) as cantidad_preparada,
  coalesce(cons.cantidad_aplicada, 0) as cantidad_aplicada,
  greatest(0, coalesce(prep.cantidad_preparada, 0) - coalesce(cons.cantidad_aplicada, 0)) as cantidad_en_preparaciones,
  l.cantidad_total - coalesce(prep.cantidad_preparada, 0) as cantidad_disponible_preparar,
  l.cantidad_total - coalesce(cons.cantidad_aplicada, 0) as cantidad_no_aplicada,
  cons.ultima_aplicacion, coalesce(cons.aplicaciones, 0) as aplicaciones,
  l.creado_por, l.creado_por_nombre, l.creado_en
from public.fertilizante_lotes l
join public.fertilizante_casetas c on c.id = l.caseta_id
join public.fertilizante_productos p on p.id = l.producto_id
left join lateral (
  select sum(pr.producto_cantidad) as cantidad_preparada
  from public.fertilizante_preparaciones pr
  where pr.lote_id = l.id and not coalesce(pr.revertida, false)
) prep on true
left join lateral (
  select sum(ac.producto_consumido) as cantidad_aplicada,
    max(a.fecha) as ultima_aplicacion, count(distinct a.id) as aplicaciones
  from public.fertilizante_preparaciones pr
  join public.fertilizante_aplicacion_consumos ac on ac.preparacion_id = pr.id
  join public.fertilizante_aplicaciones a on a.id = ac.aplicacion_id
  where pr.lote_id = l.id
    and not coalesce(pr.revertida, false)
    and not coalesce(a.revertida, false)
) cons on true
where l.activo;

create or replace view public.v_fertilizante_bodega_caseta as
with ingresos as (
  select fl.caseta_id, fl.producto_id, max(fl.unidad) as unidad,
    sum(fl.cantidad_total) as cantidad_ingresada,
    string_agg(distinct fl.folio, ', ' order by fl.folio) filter (where fl.folio is not null and fl.folio <> '') as folios,
    string_agg(distinct fl.lote, ', ' order by fl.lote) filter (where fl.lote is not null and fl.lote <> '') as lotes
  from public.fertilizante_lotes fl
  where fl.activo
  group by fl.caseta_id, fl.producto_id
), preparaciones as (
  select fe.caseta_id, fp.producto_id, sum(coalesce(fp.producto_cantidad, 0)) as cantidad_preparada
  from public.fertilizante_preparaciones fp
  join public.fertilizante_estanques fe on fe.id = fp.estanque_id
  where fp.producto_id is not null and not coalesce(fp.revertida, false)
  group by fe.caseta_id, fp.producto_id
)
select
  c.id as caseta_id, c.nombre as caseta, p.id as producto_id,
  p.nombre_comercial as producto, coalesce(i.unidad, p.unidad) as unidad,
  coalesce(i.cantidad_ingresada, 0) as cantidad_ingresada,
  coalesce(pr.cantidad_preparada, 0) as cantidad_preparada,
  coalesce(i.cantidad_ingresada, 0) - coalesce(pr.cantidad_preparada, 0) as cantidad_disponible,
  coalesce(i.folios, '') as folios, coalesce(i.lotes, '') as lotes
from public.fertilizante_casetas c
join ingresos i on i.caseta_id = c.id
join public.fertilizante_productos p on p.id = i.producto_id
left join preparaciones pr on pr.caseta_id = c.id and pr.producto_id = p.id
where c.activo and p.activo;

grant execute on function public.revertir_fertilizante_operacion(text, uuid, text) to authenticated;
grant select on public.v_fertilizante_estado_estanques, public.v_fertilizante_folios,
  public.v_fertilizante_bodega_caseta to authenticated;

commit;

-- Verificacion opcional despues de ejecutar:
-- select id, fecha, revertida, revertida_en, revertida_por_nombre, motivo_reversion
-- from public.fertilizante_aplicaciones order by fecha desc limit 20;
