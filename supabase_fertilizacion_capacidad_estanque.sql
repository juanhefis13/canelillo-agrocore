-- Evita preparar mas litros que la capacidad fisica del estanque.
-- Considera como un solo estanque los registros con igual caseta y numero normalizado.

begin;

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
  if tg_op = 'UPDATE' then
    v_old_id := old.id;
  end if;
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
  where e.activo
    and e.caseta_id = v_caseta_id
    and e.numero_estanque_normalizado = v_estanque_key;

  select coalesce(sum(p.cantidad_litros), 0)
  into v_preparado
  from public.fertilizante_preparaciones p
  join public.fertilizante_estanques e on e.id = p.estanque_id
  where e.activo
    and e.caseta_id = v_caseta_id
    and e.numero_estanque_normalizado = v_estanque_key
    and (v_old_id is null or p.id <> v_old_id);

  select coalesce(sum(a.cantidad_litros), 0)
  into v_aplicado
  from public.fertilizante_aplicaciones a
  join public.fertilizante_estanques e on e.id = a.estanque_id
  where e.activo
    and e.caseta_id = v_caseta_id
    and e.numero_estanque_normalizado = v_estanque_key;

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

drop trigger if exists fertilizante_preparaciones_validar_capacidad_trg on public.fertilizante_preparaciones;
create trigger fertilizante_preparaciones_validar_capacidad_trg
before insert or update of estanque_id, cantidad_litros
on public.fertilizante_preparaciones
for each row
execute function public.validar_capacidad_fertilizante_estanque();

commit;
