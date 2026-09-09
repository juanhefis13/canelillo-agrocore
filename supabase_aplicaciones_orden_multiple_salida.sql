-- Soporte para ordenes con varios programas/potreros y trazabilidad de bodega.
-- Ejecutar una vez en Supabase SQL Editor.

begin;

alter table public.ordenes_aplicacion
  add column if not exists numeros_programa integer[] not null default '{}',
  add column if not exists fecha_fin_planificada date,
  add column if not exists clasificacion text,
  add column if not exists observaciones text;

alter table public.despachos
  add column if not exists hora_salida time,
  add column if not exists hora_termino time,
  add column if not exists codigo_tractor text,
  add column if not exists codigo_maquina text,
  add column if not exists aplicador_id text,
  add column if not exists aplicador_nombre_origen text;

update public.ordenes_aplicacion
set numeros_programa = array[numero_programa]
where numero_programa is not null
  and coalesce(cardinality(numeros_programa), 0) = 0;

update public.ordenes_aplicacion
set numeros_programa = '{}'
where numeros_programa is null;

alter table public.ordenes_aplicacion
  alter column numeros_programa set default '{}',
  alter column numeros_programa set not null;

create index if not exists ordenes_aplicacion_numeros_programa_gin_idx
  on public.ordenes_aplicacion using gin (numeros_programa);

create index if not exists despachos_orden_fecha_idx
  on public.despachos (orden_id, fecha desc);

comment on column public.ordenes_aplicacion.numeros_programa is
  'Programas oficiales incluidos en una misma orden de aplicacion.';

comment on column public.ordenes_aplicacion.bloques is
  'Bloques de la orden. Las nuevas ordenes multipotrero usan el formato POTRERO:BLOQUE.';

comment on column public.despachos.aplicador_nombre_origen is
  'Nombre del aplicador guardado al registrar la salida para conservar la trazabilidad historica.';

commit;

notify pgrst, 'reload schema';

-- Verificacion rapida.
select
  o.numero_orden,
  o.numeros_programa,
  o.potrero,
  o.bloques,
  count(d.id) as salidas
from public.ordenes_aplicacion o
left join public.despachos d on d.orden_id = o.id
group by o.id, o.numero_orden, o.numeros_programa, o.potrero, o.bloques
order by o.numero_orden desc
limit 20;
