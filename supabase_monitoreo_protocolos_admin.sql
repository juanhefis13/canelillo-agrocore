-- Consola administrativa y versionado atomico de protocolos de monitoreo.
-- Ejecutar despues de supabase_monitoreo_protocolos.sql.

create or replace function public.crear_version_protocolo_monitoreo(
  p_protocolo_origen_id uuid,
  p_plaga_id uuid,
  p_cultivo_referencia text,
  p_nombre text,
  p_descripcion text,
  p_requiere_lupa boolean,
  p_instrucciones text,
  p_frecuencia_dias integer,
  p_estructuras jsonb
)
returns uuid
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
declare
  origen public.protocolos_monitoreo%rowtype;
  nuevo_id uuid;
  nueva_version integer;
  plaga_final uuid;
  cultivo_final text;
  nombre_final text;
begin
  if not public.monitoreo_usuario_tiene_rol(array['admin']) then
    raise exception 'Solo un administrador puede versionar protocolos';
  end if;

  if p_estructuras is null
    or jsonb_typeof(p_estructuras) <> 'array'
    or jsonb_array_length(p_estructuras) = 0 then
    raise exception 'El protocolo requiere al menos una estructura';
  end if;

  if p_frecuencia_dias is not null and p_frecuencia_dias <= 0 then
    raise exception 'La frecuencia debe ser mayor que cero';
  end if;

  if p_protocolo_origen_id is not null then
    select * into origen
    from public.protocolos_monitoreo
    where id = p_protocolo_origen_id
    for update;
    if not found then
      raise exception 'El protocolo de origen no existe';
    end if;
    plaga_final := origen.plaga_id;
    cultivo_final := origen.cultivo_referencia;
    nombre_final := origen.nombre;
  else
    plaga_final := p_plaga_id;
    cultivo_final := upper(trim(p_cultivo_referencia));
    nombre_final := trim(p_nombre);
  end if;

  if plaga_final is null or nombre_final = '' then
    raise exception 'Plaga y nombre son obligatorios';
  end if;
  if cultivo_final not in ('CITRICO', 'PALTO') then
    raise exception 'Cultivo no permitido: %', cultivo_final;
  end if;

  perform pg_advisory_xact_lock(
    hashtext(plaga_final::text || '|' || cultivo_final || '|' || nombre_final)
  );

  select coalesce(max(version), 0) + 1 into nueva_version
  from public.protocolos_monitoreo
  where plaga_id = plaga_final
    and cultivo_referencia = cultivo_final
    and nombre = nombre_final;

  update public.protocolos_monitoreo
  set activo = false,
      actualizado_en = now()
  where plaga_id = plaga_final
    and cultivo_referencia = cultivo_final
    and nombre = nombre_final
    and activo;

  insert into public.protocolos_monitoreo (
    plaga_id, cultivo_referencia, nombre, descripcion, version,
    requiere_lupa, instrucciones, frecuencia_dias, activo
  ) values (
    plaga_final,
    cultivo_final,
    nombre_final,
    nullif(trim(p_descripcion), ''),
    nueva_version,
    coalesce(p_requiere_lupa, false),
    nullif(trim(p_instrucciones), ''),
    p_frecuencia_dias,
    true
  ) returning id into nuevo_id;

  insert into public.protocolo_estructuras (
    protocolo_id, estructura_id, cantidad_revisar, orden,
    obligatorio, instrucciones, activo
  )
  select
    nuevo_id,
    item.estructura_id,
    item.cantidad_revisar,
    item.orden,
    coalesce(item.obligatorio, true),
    nullif(trim(item.instrucciones), ''),
    true
  from jsonb_to_recordset(p_estructuras) as item(
    estructura_id uuid,
    cantidad_revisar integer,
    orden smallint,
    obligatorio boolean,
    instrucciones text
  )
  where item.estructura_id is not null
    and item.cantidad_revisar > 0;

  if not found then
    raise exception 'Ninguna estructura valida fue recibida';
  end if;

  if p_protocolo_origen_id is not null then
    insert into public.protocolo_atributos (
      protocolo_id, estructura_id, atributo_id, obligatorio, orden, activo
    )
    select
      nuevo_id, estructura_id, atributo_id, obligatorio, orden, activo
    from public.protocolo_atributos
    where protocolo_id = p_protocolo_origen_id
      and activo;
  end if;

  return nuevo_id;
end;
$$;

revoke all on function public.crear_version_protocolo_monitoreo(
  uuid, uuid, text, text, text, boolean, text, integer, jsonb
) from public;

grant execute on function public.crear_version_protocolo_monitoreo(
  uuid, uuid, text, text, text, boolean, text, integer, jsonb
) to authenticated;

comment on function public.crear_version_protocolo_monitoreo(
  uuid, uuid, text, text, text, boolean, text, integer, jsonb
) is 'Crea una nueva version activa sin modificar el snapshot historico del protocolo anterior.';

create or replace function public.establecer_protocolo_monitoreo_activo(
  p_protocolo_id uuid,
  p_activo boolean
)
returns void
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
declare
  objetivo public.protocolos_monitoreo%rowtype;
begin
  if not public.monitoreo_usuario_tiene_rol(array['admin']) then
    raise exception 'Solo un administrador puede cambiar el protocolo activo';
  end if;

  select * into objetivo
  from public.protocolos_monitoreo
  where id = p_protocolo_id
  for update;
  if not found then
    raise exception 'El protocolo no existe';
  end if;

  perform pg_advisory_xact_lock(
    hashtext(
      objetivo.plaga_id::text || '|' || objetivo.cultivo_referencia || '|' ||
      objetivo.nombre
    )
  );

  if coalesce(p_activo, false) then
    update public.protocolos_monitoreo
    set activo = (id = p_protocolo_id),
        actualizado_en = now()
    where plaga_id = objetivo.plaga_id
      and cultivo_referencia = objetivo.cultivo_referencia
      and nombre = objetivo.nombre;
  else
    update public.protocolos_monitoreo
    set activo = false,
        actualizado_en = now()
    where id = p_protocolo_id;
  end if;
end;
$$;

revoke all on function public.establecer_protocolo_monitoreo_activo(
  uuid, boolean
) from public;

grant execute on function public.establecer_protocolo_monitoreo_activo(
  uuid, boolean
) to authenticated;
