-- Canelillo AgroCore - pruebas transaccionales del modelo protocolizado.
-- Requiere migracion y seed. Siempre termina con ROLLBACK.

begin;

do $$
<<prueba>>
declare
  campo uuid;
  arbol uuid := gen_random_uuid();
  plaga uuid;
  estado_huevo uuid;
  estado_adulto uuid;
  fruto uuid;
  brote uuid;
  protocolo_v1 uuid;
  protocolo_v2 uuid;
  visita_1 uuid := gen_random_uuid();
  visita_2 uuid := gen_random_uuid();
  visita_3 uuid := gen_random_uuid();
  operacion_repetida uuid := gen_random_uuid();
  monitoreo_1 uuid := gen_random_uuid();
  monitoreo_2 uuid := gen_random_uuid();
  monitoreo_3 uuid := gen_random_uuid();
  estructura_fruto_1 uuid := gen_random_uuid();
  estructura_brote_1 uuid := gen_random_uuid();
  estructura_fruto_2 uuid := gen_random_uuid();
  estructura_fruto_3 uuid := gen_random_uuid();
  unidad_positiva uuid;
  valor numeric;
  entero integer;
  version_guardada integer;
begin
  select id into campo from public.campos where activo order by id limit 1;
  if campo is null then
    raise exception 'TEST: se requiere al menos un campo activo';
  end if;

  select id into fruto
  from public.estructuras_vegetales
  where nombre_normalizado = public.monitoreo_normalizar_texto('Fruto');
  select id into brote
  from public.estructuras_vegetales
  where nombre_normalizado = public.monitoreo_normalizar_texto('Brote');
  select id into estado_huevo
  from public.estados_biologicos
  where nombre_normalizado = public.monitoreo_normalizar_texto('Huevo');
  select id into estado_adulto
  from public.estados_biologicos
  where nombre_normalizado = public.monitoreo_normalizar_texto('Adulto');

  insert into public.plagas (nombre_comun, descripcion)
  values ('__TEST_PROTOCOLO_MONITOREO__', 'Fila temporal de pruebas')
  returning id into plaga;

  insert into public.plaga_estados_biologicos (
    plaga_id, estado_biologico_id, orden
  ) values
    (plaga, estado_huevo, 10),
    (plaga, estado_adulto, 20);

  insert into public.protocolos_monitoreo (
    plaga_id, cultivo_referencia, nombre, version, activo
  ) values (
    plaga, 'CITRICO', '__TEST_PROTOCOLO__', 1, true
  ) returning id into protocolo_v1;

  insert into public.protocolo_estructuras (
    protocolo_id, estructura_id, cantidad_revisar, orden, obligatorio
  ) values
    (protocolo_v1, fruto, 10, 10, true),
    (protocolo_v1, brote, 10, 20, true);

  insert into public.protocolos_monitoreo (
    plaga_id, cultivo_referencia, nombre, version, activo
  ) values (
    plaga, 'CITRICO', '__TEST_PROTOCOLO__', 2, true
  ) returning id into protocolo_v2;

  insert into public.protocolo_estructuras (
    protocolo_id, estructura_id, cantidad_revisar, orden, obligatorio
  ) values (protocolo_v2, fruto, 20, 10, true);

  insert into public.monitoreo_arboles (
    id, campo_id, numero_arbol, longitud, latitud, activo,
    id_operacion_cliente, ubicacion_fuente
  ) values (
    arbol, campo, '__TEST_ARBOL__', -71.26, -32.80, true,
    gen_random_uuid(), 'manual'
  );

  insert into public.visitas_monitoreo (
    id, campo_id, estado, id_operacion_cliente
  ) values (
    visita_1, campo, 'en_progreso', operacion_repetida
  );

  begin
    insert into public.visitas_monitoreo (
      campo_id, estado, id_operacion_cliente
    ) values (campo, 'borrador', operacion_repetida);
    raise exception 'TEST: se permitio duplicar id_operacion_cliente';
  exception
    when unique_violation then null;
  end;

  insert into public.monitoreo_plagas (
    id, campo_id, fecha, tipo_plaga, latitud, longitud, arbol_id,
    encontrada, id_operacion_cliente, visita_id, protocolo_id,
    estado_registro
  ) values (
    monitoreo_1, campo, current_date, '__TEST__', -32.80, -71.26, arbol,
    false, gen_random_uuid(), visita_1, protocolo_v1, 'en_progreso'
  );

  insert into public.monitoreo_estructuras (
    id, monitoreo_plaga_id, estructura_id, cantidad_programada,
    estructura_nombre_snapshot
  ) values
    (estructura_fruto_1, monitoreo_1, fruto, 10, 'se completa por trigger'),
    (estructura_brote_1, monitoreo_1, brote, 10, 'se completa por trigger');

  for entero in 1..10 loop
    insert into public.monitoreo_unidades (
      monitoreo_estructura_id, numero_unidad, positivo
    ) values (estructura_fruto_1, entero, entero <= 4)
    returning id into unidad_positiva;

    if entero = 1 then
      insert into public.monitoreo_unidad_estados (
        unidad_id, estado_biologico_id
      ) values
        (unidad_positiva, estado_huevo),
        (unidad_positiva, estado_adulto);
    end if;

    insert into public.monitoreo_unidades (
      monitoreo_estructura_id, numero_unidad, positivo
    ) values (estructura_brote_1, entero, entero <= 2);
  end loop;

  select incidencia_porcentaje into valor
  from public.monitoreo_estructuras where id = estructura_fruto_1;
  if valor <> 40 then
    raise exception 'TEST: incidencia de frutos esperada 40, obtenida %', valor;
  end if;

  select incidencia_porcentaje into valor
  from public.monitoreo_estructuras where id = estructura_brote_1;
  if valor <> 20 then
    raise exception 'TEST: incidencia de brotes esperada 20, obtenida %', valor;
  end if;

  select cantidad_positiva into entero
  from public.monitoreo_estructuras where id = estructura_fruto_1;
  if entero <> 4 then
    raise exception 'TEST: dos estados de una unidad alteraron los positivos';
  end if;

  update public.monitoreo_plagas
  set estado_registro = 'completado'
  where id = monitoreo_1;

  select protocolo_version into version_guardada
  from public.monitoreo_plagas where id = monitoreo_1;
  if version_guardada <> 1 then
    raise exception 'TEST: snapshot de protocolo esperado 1, obtenido %',
      version_guardada;
  end if;

  insert into public.visitas_monitoreo (
    id, campo_id, estado, id_operacion_cliente
  ) values (
    visita_2, campo, 'en_progreso', gen_random_uuid()
  );

  insert into public.monitoreo_plagas (
    id, campo_id, fecha, tipo_plaga, latitud, longitud, arbol_id,
    encontrada, id_operacion_cliente, visita_id, protocolo_id,
    estado_registro
  ) values (
    monitoreo_2, campo, current_date, '__TEST__', -32.80, -71.26, arbol,
    false, gen_random_uuid(), visita_2, protocolo_v2, 'en_progreso'
  );

  insert into public.monitoreo_estructuras (
    id, monitoreo_plaga_id, estructura_id, cantidad_programada,
    estructura_nombre_snapshot
  ) values (
    estructura_fruto_2, monitoreo_2, fruto, 20, 'se completa por trigger'
  );

  for entero in 1..20 loop
    insert into public.monitoreo_unidades (
      monitoreo_estructura_id, numero_unidad, positivo
    ) values (estructura_fruto_2, entero, entero <= 2);
  end loop;

  update public.monitoreo_plagas
  set estado_registro = 'completado'
  where id = monitoreo_2;

  select incidencia_porcentaje into valor
  from public.v_monitoreo_resumen_estructura resumen
  where resumen.campo_id = prueba.campo
    and resumen.plaga_id = prueba.plaga
    and resumen.estructura_id = prueba.fruto;

  if valor <> 20 then
    raise exception 'TEST: agregacion ponderada esperada 20, obtenida %', valor;
  end if;

  select unidades_revisadas into entero
  from public.v_monitoreo_resumen_estructura resumen
  where resumen.campo_id = prueba.campo
    and resumen.plaga_id = prueba.plaga
    and resumen.estructura_id = prueba.fruto;

  if entero <> 30 then
    raise exception 'TEST: unidades agregadas esperadas 30, obtenidas %', entero;
  end if;

  insert into public.visitas_monitoreo (
    id, campo_id, estado, id_operacion_cliente
  ) values (
    visita_3, campo, 'en_progreso', gen_random_uuid()
  );

  insert into public.monitoreo_plagas (
    id, campo_id, fecha, tipo_plaga, latitud, longitud, arbol_id,
    encontrada, id_operacion_cliente, visita_id, protocolo_id,
    estado_registro
  ) values (
    monitoreo_3, campo, current_date, '__TEST__', -32.80, -71.26, arbol,
    false, gen_random_uuid(), visita_3, protocolo_v2, 'en_progreso'
  );

  insert into public.monitoreo_estructuras (
    id, monitoreo_plaga_id, estructura_id, cantidad_programada,
    estructura_nombre_snapshot
  ) values (
    estructura_fruto_3, monitoreo_3, fruto, 20, 'se completa por trigger'
  );

  select incidencia_porcentaje into valor
  from public.monitoreo_estructuras where id = estructura_fruto_3;
  if valor is not null then
    raise exception 'TEST: cero revisadas debe producir incidencia NULL';
  end if;

  begin
    update public.monitoreo_estructuras
    set cantidad_revisada = 1, cantidad_positiva = 2
    where id = estructura_fruto_3;
    raise exception 'TEST: se permitio positivas mayor que revisadas';
  exception
    when check_violation then null;
  end;

  begin
    update public.monitoreo_plagas
    set estado_registro = 'completado'
    where id = monitoreo_3;
    raise exception 'TEST: se finalizo una estructura obligatoria incompleta';
  exception
    when raise_exception then
      if sqlerrm = 'TEST: se finalizo una estructura obligatoria incompleta' then
        raise;
      end if;
  end;

  update public.monitoreo_estructuras
  set no_evaluable = true,
      motivo_no_evaluable = 'Sin frutos'
  where id = estructura_fruto_3;

  update public.monitoreo_plagas
  set estado_registro = 'completado'
  where id = monitoreo_3;

  if not exists (
    select 1 from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relname = 'visitas_monitoreo'
      and c.relrowsecurity
  ) then
    raise exception 'TEST: RLS no esta activo en visitas_monitoreo';
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'visitas_monitoreo'
      and cmd = 'INSERT'
  ) then
    raise exception 'TEST: falta politica INSERT de visitas_monitoreo';
  end if;

  raise notice 'OK: todas las pruebas de monitoreo protocolizado pasaron';
end;
$$;

rollback;

select 'OK - pruebas ejecutadas con ROLLBACK, sin datos persistidos' as resultado;
