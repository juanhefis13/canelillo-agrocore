-- Procesamiento seguro de BD FITOSANITARIO.xlsx.
-- Fuentes: ORDEN para ordenes/recetas, SALIDA para litros y APLICACION solo como puente.
-- No crea productos por similitud. Solo usa alias confirmados o una coincidencia exacta unica.

begin;

delete from importacion.fitosanitario_excepciones
where archivo_origen = 'BD FITOSANITARIO.xlsx'
  and tipo in (
    'PRODUCTO_SIN_MAESTRO', 'PRODUCTO_MAESTRO_AMBIGUO', 'PROGRAMA_SIN_MAESTRO_UNICO',
    'SECTOR_SIN_CAMPO_EXACTO', 'TRACTOR_SIN_MAESTRO', 'MAQUINARIA_SIN_MAESTRO'
  );

-- Diagnostico de productos. Un alias confirmado tiene prioridad sobre el nombre.
with source_products as (
  select distinct op.producto_clave, op.producto_nombre, min(op.fila_excel_inicio) as fila_excel
  from importacion.fitosanitario_orden_productos op
  group by op.producto_clave, op.producto_nombre
), matches as (
  select s.*,
         a.producto_id as alias_id,
         count(p.id) as exact_count,
         (array_agg(p.nombre order by p.nombre) filter (where p.id is not null))[1:8] as exact_names
  from source_products s
  left join importacion.fitosanitario_producto_alias a on a.origen_clave = s.producto_clave
  left join public.productos p
    on regexp_replace(upper(coalesce(p.nombre_normalizado, p.nombre)), '[^A-Z0-9]', '', 'g') = s.producto_clave
  group by s.producto_clave, s.producto_nombre, s.fila_excel, a.producto_id
)
insert into importacion.fitosanitario_excepciones
  (archivo_origen, hoja_origen, fila_excel, tipo, detalle, datos)
select
  'BD FITOSANITARIO.xlsx', 'ORDEN', fila_excel,
  case when exact_count = 0 then 'PRODUCTO_SIN_MAESTRO' else 'PRODUCTO_MAESTRO_AMBIGUO' end,
  case when exact_count = 0
       then 'El nombre comercial no tiene una equivalencia exacta confirmada en public.productos.'
       else 'El nombre comercial coincide con mas de un producto maestro y requiere elegir el canonico.' end,
  jsonb_build_object('nombre_origen', producto_nombre, 'clave', producto_clave, 'candidatos', coalesce(to_jsonb(exact_names), '[]'::jsonb))
from matches
where alias_id is null and exact_count <> 1;

-- Completa atributos historicos solo en el producto maestro resuelto sin ambiguedad.
with source_matches as (
  select s.*,
         coalesce(
           a.producto_id,
           case when count(p.id) = 1 then (array_agg(p.id order by p.creado_en))[1] end
         ) as producto_id
  from importacion.fitosanitario_productos s
  left join importacion.fitosanitario_producto_alias a on a.origen_clave = s.nombre_clave
  left join public.productos p
    on regexp_replace(upper(coalesce(p.nombre_normalizado, p.nombre)), '[^A-Z0-9]', '', 'g') = s.nombre_clave
  group by s.clave_fuente, s.archivo_origen, s.fila_excel, s.nombre, s.nombre_normalizado,
           s.nombre_clave, s.ingrediente_activo, s.unidad, s.dosis_por_100,
           s.horas_reingreso, s.carencia_etiqueta, s.carencia_agenda_pesticidas,
           s.objetivo_operacional, s.incompleto, a.producto_id
)
update public.productos p
set ingrediente_activo = coalesce(nullif(s.ingrediente_activo, ''), p.ingrediente_activo),
    dosis_por_100 = case when s.dosis_por_100 > 0 then s.dosis_por_100 else p.dosis_por_100 end,
    horas_reingreso = case when s.horas_reingreso > 0 then s.horas_reingreso else p.horas_reingreso end,
    carencia_etiqueta = coalesce(nullif(s.carencia_etiqueta, ''), p.carencia_etiqueta),
    carencia_agenda_pesticidas = coalesce(nullif(s.carencia_agenda_pesticidas, ''), p.carencia_agenda_pesticidas),
    objetivo_operacional = coalesce(nullif(s.objetivo_operacional, ''), p.objetivo_operacional),
    fuente_operacional = s.archivo_origen,
    incompleto_operacional = p.incompleto_operacional and s.incompleto
from source_matches s
where s.producto_id = p.id;

-- Reutiliza la temporada existente por anos; solo crea la que realmente falta.
insert into public.temporadas (nombre, anio_inicio, anio_fin, estado)
select min(s.temporada), s.anio_inicio, s.anio_fin, 'cerrada'
from importacion.fitosanitario_ordenes s
where not exists (
  select 1 from public.temporadas t
  where t.anio_inicio = s.anio_inicio and t.anio_fin = s.anio_fin
)
group by s.anio_inicio, s.anio_fin
on conflict (nombre) do update set
  anio_inicio = excluded.anio_inicio,
  anio_fin = excluded.anio_fin;

-- Si numero + especie + temporada no identifican un programa unico, se conserva
-- el numero de programa en la orden pero programa_id queda nulo.
with program_matches as (
  select s.clave_fuente, s.numero_programa, s.especie, s.anio_inicio, s.anio_fin,
         count(p.id) as total,
         (array_agg(p.id order by p.creado_en desc))[1] as programa_id
  from importacion.fitosanitario_ordenes s
  left join public.programas p
    on p.numero_programa = s.numero_programa
   and upper(trim(coalesce(p.cultivo, ''))) = upper(trim(coalesce(s.especie, '')))
   and exists (
     select 1 from public.temporadas pt
     where pt.id = p.temporada_id
       and pt.anio_inicio = s.anio_inicio and pt.anio_fin = s.anio_fin
   )
  where s.numero_programa is not null
  group by s.clave_fuente, s.numero_programa, s.especie, s.anio_inicio, s.anio_fin
)
insert into importacion.fitosanitario_excepciones
  (archivo_origen, hoja_origen, fila_excel, tipo, detalle, datos)
select 'BD FITOSANITARIO.xlsx', 'ORDEN', null, 'PROGRAMA_SIN_MAESTRO_UNICO',
       'Numero, especie y temporada no identifican un unico programa maestro.',
       jsonb_build_object('clave_orden', clave_fuente, 'numero_programa', numero_programa,
                          'especie', especie, 'coincidencias', total)
from program_matches
where total <> 1;

with resolved_orders as (
  select s.*,
         t.id as temporada_id,
         (
           select case when count(p.id) = 1 then (array_agg(p.id order by p.creado_en desc))[1] end
           from public.programas p
           join public.temporadas pt on pt.id = p.temporada_id
           where p.numero_programa = s.numero_programa
             and upper(trim(coalesce(p.cultivo, ''))) = upper(trim(coalesce(s.especie, '')))
             and pt.anio_inicio = s.anio_inicio and pt.anio_fin = s.anio_fin
         ) as programa_id_resuelto
  from importacion.fitosanitario_ordenes s
  join lateral (
    select season.id
    from public.temporadas season
    where season.anio_inicio = s.anio_inicio and season.anio_fin = s.anio_fin
    order by (upper(season.nombre) like 'CITRICOS%') desc, season.creado_en
    limit 1
  ) t on true
)
update public.ordenes_aplicacion oa
set programa_id = coalesce(s.programa_id_resuelto, oa.programa_id),
    numero_programa = s.numero_programa,
    numeros_programa = s.numeros_programa,
    nombre_programa = case when s.numero_programa is not null then 'Programa ' || s.numero_programa else s.programa_origen end,
    fecha = s.fecha,
    fecha_planificada = s.fecha,
    cultivo = s.especie,
    variedad = s.variedad,
    potrero = s.potrero_cabecera,
    bloques = s.bloques_cabecera,
    hectareas = s.hectareas,
    agua_por_ha = s.agua_por_ha,
    clave_fuente = coalesce(oa.clave_fuente, s.clave_fuente),
    archivo_origen = s.archivo_origen,
    importado = true,
    multisector = s.multisector,
    metodo_aplicacion = s.metodo_aplicacion,
    programa_origen = s.programa_origen
from resolved_orders s
where oa.clave_fuente = s.clave_fuente
   or (oa.temporada_id = s.temporada_id and oa.numero_orden = s.numero_orden);

with resolved_orders as (
  select s.*,
         t.id as temporada_id,
         (
           select case when count(p.id) = 1 then (array_agg(p.id order by p.creado_en desc))[1] end
           from public.programas p
           join public.temporadas pt on pt.id = p.temporada_id
           where p.numero_programa = s.numero_programa
             and upper(trim(coalesce(p.cultivo, ''))) = upper(trim(coalesce(s.especie, '')))
             and pt.anio_inicio = s.anio_inicio and pt.anio_fin = s.anio_fin
         ) as programa_id_resuelto
  from importacion.fitosanitario_ordenes s
  join lateral (
    select season.id
    from public.temporadas season
    where season.anio_inicio = s.anio_inicio and season.anio_fin = s.anio_fin
    order by (upper(season.nombre) like 'CITRICOS%') desc, season.creado_en
    limit 1
  ) t on true
)
insert into public.ordenes_aplicacion (
  temporada_id, programa_id, numero_orden, numero_programa, numeros_programa,
  nombre_programa, fecha, fecha_planificada, cultivo, variedad, potrero, bloques,
  hectareas, agua_por_ha, estado, clave_fuente, archivo_origen, importado,
  multisector, metodo_aplicacion, programa_origen
)
select
  s.temporada_id, s.programa_id_resuelto, s.numero_orden, s.numero_programa, s.numeros_programa,
  case when s.numero_programa is not null then 'Programa ' || s.numero_programa else s.programa_origen end,
  s.fecha, s.fecha, s.especie, s.variedad, s.potrero_cabecera, s.bloques_cabecera,
  s.hectareas, s.agua_por_ha, 'completada'::public.estado_orden, s.clave_fuente, s.archivo_origen, true,
  s.multisector, s.metodo_aplicacion, s.programa_origen
from resolved_orders s
where not exists (
  select 1 from public.ordenes_aplicacion oa
  where oa.clave_fuente = s.clave_fuente
     or (oa.temporada_id = s.temporada_id and oa.numero_orden = s.numero_orden)
);

-- Informa sectores que parecian apuntar a un solo bloque pero no existen en campos.
insert into importacion.fitosanitario_excepciones
  (archivo_origen, hoja_origen, fila_excel, tipo, detalle, datos)
select 'BD FITOSANITARIO.xlsx', 'ORDEN', s.fila_excel_inicio, 'SECTOR_SIN_CAMPO_EXACTO',
       'Potrero y bloque no tienen coincidencia exacta unica en public.campos.',
       jsonb_build_object('potrero', s.potrero, 'bloques', s.bloques,
                          'especie_origen', s.especie, 'variedad_origen', s.variedad)
from importacion.fitosanitario_sectores s
where cardinality(s.bloques) = 1
  and not exists (
    select 1 from public.campos c
    where upper(trim(c.potrero)) = upper(trim(s.potrero))
      and upper(trim(c.bloque)) = upper(trim(s.bloques[1]))
  );

with resolved_sectors as (
  select s.*, oa.id as orden_id,
         c.id as campo_id, c.hectareas as campo_hectareas,
         c.especie as campo_especie, c.variedad as campo_variedad
  from importacion.fitosanitario_sectores s
  join importacion.fitosanitario_ordenes so
    on so.temporada = s.temporada and so.numero_orden = s.numero_orden
  join public.ordenes_aplicacion oa on oa.clave_fuente = so.clave_fuente
  left join lateral (
    select field.id, field.hectareas, field.especie, field.variedad
    from public.campos field
    where cardinality(s.bloques) = 1
      and upper(trim(field.potrero)) = upper(trim(s.potrero))
      and upper(trim(field.bloque)) = upper(trim(s.bloques[1]))
    limit 1
  ) c on true
)
update public.orden_sectores os
set orden_id = s.orden_id,
    campo_id = s.campo_id,
    fecha_orden = s.fecha_orden,
    potrero = s.potrero,
    bloque_origen = s.bloque_origen,
    bloques = s.bloques,
    hectareas = coalesce(s.campo_hectareas, s.hectareas),
    especie = coalesce(s.campo_especie, s.especie),
    variedad = coalesce(s.campo_variedad, s.variedad),
    litros_planificados = s.litros_planificados,
    metodo_aplicacion = s.metodo_aplicacion,
    mojamiento_l_ha = s.mojamiento_l_ha,
    velocidad = s.velocidad,
    marcha = s.marcha,
    cantidad_boquillas = s.cantidad_boquillas,
    tipo_boquilla = s.tipo_boquilla,
    color_boquilla = s.color_boquilla,
    presion_bar = s.presion_bar,
    actualizado_en = now()
from resolved_sectors s
where os.clave_fuente = s.clave_fuente;

with resolved_sectors as (
  select s.*, oa.id as orden_id,
         c.id as campo_id, c.hectareas as campo_hectareas,
         c.especie as campo_especie, c.variedad as campo_variedad
  from importacion.fitosanitario_sectores s
  join importacion.fitosanitario_ordenes so
    on so.temporada = s.temporada and so.numero_orden = s.numero_orden
  join public.ordenes_aplicacion oa on oa.clave_fuente = so.clave_fuente
  left join lateral (
    select field.id, field.hectareas, field.especie, field.variedad
    from public.campos field
    where cardinality(s.bloques) = 1
      and upper(trim(field.potrero)) = upper(trim(s.potrero))
      and upper(trim(field.bloque)) = upper(trim(s.bloques[1]))
    limit 1
  ) c on true
)
insert into public.orden_sectores (
  orden_id, campo_id, clave_fuente, archivo_origen, fila_excel, fecha_orden,
  potrero, bloque_origen, bloques, hectareas, especie, variedad, litros_planificados,
  metodo_aplicacion, mojamiento_l_ha, velocidad, marcha, cantidad_boquillas,
  tipo_boquilla, color_boquilla, presion_bar
)
select
  s.orden_id, s.campo_id, s.clave_fuente, s.archivo_origen, s.fila_excel_inicio, s.fecha_orden,
  s.potrero, s.bloque_origen, s.bloques, coalesce(s.campo_hectareas, s.hectareas),
  coalesce(s.campo_especie, s.especie), coalesce(s.campo_variedad, s.variedad),
  s.litros_planificados, s.metodo_aplicacion, s.mojamiento_l_ha, s.velocidad,
  s.marcha, s.cantidad_boquillas, s.tipo_boquilla, s.color_boquilla, s.presion_bar
from resolved_sectors s
where not exists (
  select 1 from public.orden_sectores os where os.clave_fuente = s.clave_fuente
);

-- Recipes only use a confirmed alias or a unique exact product master match.
with resolved_lines as (
  select s.*, oa.id as orden_id,
         coalesce(
           a.producto_id,
           case when count(p.id) = 1 then (array_agg(p.id order by p.creado_en))[1] end
         ) as producto_id,
         coalesce(
           (array_agg(p.unidad order by p.creado_en) filter (where p.id is not null))[1],
           'kg'
         ) as unidad_producto
  from importacion.fitosanitario_orden_productos s
  join importacion.fitosanitario_ordenes so
    on so.temporada = s.temporada and so.numero_orden = s.numero_orden
  join public.ordenes_aplicacion oa on oa.clave_fuente = so.clave_fuente
  left join importacion.fitosanitario_producto_alias a on a.origen_clave = s.producto_clave
  left join public.productos p
    on regexp_replace(upper(coalesce(p.nombre_normalizado, p.nombre)), '[^A-Z0-9]', '', 'g') = s.producto_clave
  group by s.clave_fuente, s.archivo_origen, s.fila_excel_inicio, s.temporada,
           s.numero_orden, s.producto_nombre, s.producto_normalizado, s.producto_clave,
           s.numero_programa, s.dosis_por_100, s.periodo_reingreso,
           s.carencia_etiqueta, s.carencia_agenda_pesticidas, oa.id, a.producto_id
)
update public.orden_productos op
set orden_id = s.orden_id,
    producto_id = s.producto_id,
    numero_programa = s.numero_programa,
    dosis_por_100 = s.dosis_por_100,
    dosis = s.dosis_por_100,
    unidad_dosis = 'CC/GRS (origen)',
    base_dosis = 'per_100l',
    unidad_resultado = s.unidad_producto,
    archivo_origen = s.archivo_origen,
    fila_excel = s.fila_excel_inicio,
    nombre_producto_origen = s.producto_nombre,
    periodo_reingreso_origen = s.periodo_reingreso,
    carencia_etiqueta = s.carencia_etiqueta,
    carencia_agenda_pesticidas = s.carencia_agenda_pesticidas
from resolved_lines s
where s.producto_id is not null and op.clave_fuente = s.clave_fuente;

with resolved_lines as (
  select s.*, oa.id as orden_id,
         coalesce(
           a.producto_id,
           case when count(p.id) = 1 then (array_agg(p.id order by p.creado_en))[1] end
         ) as producto_id,
         coalesce((array_agg(p.unidad order by p.creado_en) filter (where p.id is not null))[1], 'kg') as unidad_producto
  from importacion.fitosanitario_orden_productos s
  join importacion.fitosanitario_ordenes so
    on so.temporada = s.temporada and so.numero_orden = s.numero_orden
  join public.ordenes_aplicacion oa on oa.clave_fuente = so.clave_fuente
  left join importacion.fitosanitario_producto_alias a on a.origen_clave = s.producto_clave
  left join public.productos p
    on regexp_replace(upper(coalesce(p.nombre_normalizado, p.nombre)), '[^A-Z0-9]', '', 'g') = s.producto_clave
  group by s.clave_fuente, s.archivo_origen, s.fila_excel_inicio, s.temporada,
           s.numero_orden, s.producto_nombre, s.producto_normalizado, s.producto_clave,
           s.numero_programa, s.dosis_por_100, s.periodo_reingreso,
           s.carencia_etiqueta, s.carencia_agenda_pesticidas, oa.id, a.producto_id
)
insert into public.orden_productos (
  orden_id, producto_id, numero_programa, dosis_por_100,
  producto_por_ha_programa, total_programa, dosis, unidad_dosis, base_dosis,
  unidad_resultado, divisor_conversion, clave_fuente, archivo_origen, fila_excel,
  nombre_producto_origen, periodo_reingreso_origen, carencia_etiqueta,
  carencia_agenda_pesticidas
)
select
  s.orden_id, s.producto_id, s.numero_programa, s.dosis_por_100,
  0, 0, s.dosis_por_100, 'CC/GRS (origen)', 'per_100l', s.unidad_producto, 1,
  s.clave_fuente, s.archivo_origen, s.fila_excel_inicio, s.producto_nombre,
  s.periodo_reingreso, s.carencia_etiqueta, s.carencia_agenda_pesticidas
from resolved_lines s
where s.producto_id is not null
  and not exists (
    select 1 from public.orden_productos op where op.clave_fuente = s.clave_fuente
  )
  and not exists (
    select 1 from public.orden_productos op
    where op.orden_id = s.orden_id and op.producto_id = s.producto_id
      and op.numero_programa is not distinct from s.numero_programa
  );

-- Preserve old equipment codes but report which ones are not in the active master.
insert into importacion.fitosanitario_excepciones
  (archivo_origen, hoja_origen, fila_excel, tipo, detalle, datos)
select 'BD FITOSANITARIO.xlsx', 'SALIDA', min(s.fila_excel_inicio), 'TRACTOR_SIN_MAESTRO',
       'El codigo de tractor historico no existe en public.vehiculos.',
       jsonb_build_object('codigo', s.codigo_tractor)
from importacion.fitosanitario_despachos s
where s.codigo_tractor is not null
  and not exists (select 1 from public.vehiculos v where upper(trim(v.codigo)) = upper(trim(s.codigo_tractor)))
group by s.codigo_tractor;

insert into importacion.fitosanitario_excepciones
  (archivo_origen, hoja_origen, fila_excel, tipo, detalle, datos)
select 'BD FITOSANITARIO.xlsx', 'SALIDA', min(s.fila_excel_inicio), 'MAQUINARIA_SIN_MAESTRO',
       'El codigo de maquinaria historico no existe en public.vehiculos.',
       jsonb_build_object('codigo', s.codigo_maquinaria)
from importacion.fitosanitario_despachos s
where s.codigo_maquinaria is not null
  and not exists (select 1 from public.vehiculos v where upper(trim(v.codigo)) = upper(trim(s.codigo_maquinaria)))
group by s.codigo_maquinaria;

with resolved_dispatches as (
  select s.*, oa.id as orden_id,
         (
           select case when count(w.id) = 1 then (array_agg(w.id::text order by w.id::text))[1] end
           from public.trabajador w
           where regexp_replace(upper(trim(concat_ws(' ', w.nombre, w.apellido))), '[^A-Z0-9]', '', 'g')
               = regexp_replace(upper(trim(coalesce(s.aplicador, ''))), '[^A-Z0-9]', '', 'g')
         ) as aplicador_id_resuelto
  from importacion.fitosanitario_despachos s
  join importacion.fitosanitario_ordenes so
    on so.temporada = s.temporada and so.numero_orden = s.numero_orden
  join public.ordenes_aplicacion oa on oa.clave_fuente = so.clave_fuente
)
update public.despachos d
set orden_id = s.orden_id,
    fecha = s.fecha,
    hora_salida = s.hora_salida,
    litros = s.litros_salida,
    fecha_termino = s.fecha_termino,
    hora_termino = s.hora_termino,
    litros_aplicados = s.litros_aplicados,
    codigo_tractor = s.codigo_tractor,
    codigo_maquina = s.codigo_maquinaria,
    aplicador_id = s.aplicador_id_resuelto,
    aplicador_nombre_origen = s.aplicador,
    folio_origen = s.folio_origen,
    fila_excel = s.fila_excel_inicio
from resolved_dispatches s
where d.clave_fuente = s.clave_fuente;

with resolved_dispatches as (
  select s.*, oa.id as orden_id,
         (
           select case when count(w.id) = 1 then (array_agg(w.id::text order by w.id::text))[1] end
           from public.trabajador w
           where regexp_replace(upper(trim(concat_ws(' ', w.nombre, w.apellido))), '[^A-Z0-9]', '', 'g')
               = regexp_replace(upper(trim(coalesce(s.aplicador, ''))), '[^A-Z0-9]', '', 'g')
         ) as aplicador_id_resuelto
  from importacion.fitosanitario_despachos s
  join importacion.fitosanitario_ordenes so
    on so.temporada = s.temporada and so.numero_orden = s.numero_orden
  join public.ordenes_aplicacion oa on oa.clave_fuente = so.clave_fuente
)
insert into public.despachos (
  orden_id, tipo, fecha, hora_salida, litros, fecha_termino, hora_termino,
  litros_aplicados, codigo_tractor, codigo_maquina, aplicador_id,
  aplicador_nombre_origen, folio_origen, clave_fuente, archivo_origen, fila_excel
)
select
  s.orden_id, 'salida', s.fecha, s.hora_salida, s.litros_salida, s.fecha_termino,
  s.hora_termino, s.litros_aplicados, s.codigo_tractor, s.codigo_maquinaria,
  s.aplicador_id_resuelto, s.aplicador, s.folio_origen, s.clave_fuente,
  s.archivo_origen, s.fila_excel_inicio
from resolved_dispatches s
where not exists (
  select 1 from public.despachos d where d.clave_fuente = s.clave_fuente
);

commit;

select 'productos de orden staging' as concepto, count(*)::bigint as total
from importacion.fitosanitario_orden_productos
union all select 'ordenes staging', count(*) from importacion.fitosanitario_ordenes
union all select 'sectores staging', count(*) from importacion.fitosanitario_sectores
union all select 'despachos staging', count(*) from importacion.fitosanitario_despachos
union all select 'ordenes importadas', count(*) from public.ordenes_aplicacion where archivo_origen = 'BD FITOSANITARIO.xlsx'
union all select 'recetas importadas', count(*) from public.orden_productos where archivo_origen = 'BD FITOSANITARIO.xlsx'
union all select 'sectores importados', count(*) from public.orden_sectores where archivo_origen = 'BD FITOSANITARIO.xlsx'
union all select 'despachos importados', count(*) from public.despachos where archivo_origen = 'BD FITOSANITARIO.xlsx'
union all select 'excepciones', count(*) from importacion.fitosanitario_excepciones where archivo_origen = 'BD FITOSANITARIO.xlsx';

select tipo, count(*) as total
from importacion.fitosanitario_excepciones
where archivo_origen = 'BD FITOSANITARIO.xlsx'
group by tipo
order by tipo;
