-- Tipos de orden para separar el flujo normal del flujo Herbicida/Foliar.
-- Ejecutar una vez en Supabase SQL Editor antes de crear la primera orden especial.

begin;

alter table public.ordenes_aplicacion
  add column if not exists tipo_orden text not null default 'normal';

update public.ordenes_aplicacion
set tipo_orden = 'normal'
where tipo_orden is null
   or tipo_orden not in ('normal', 'herbicida_foliar');

alter table public.ordenes_aplicacion
  drop constraint if exists ordenes_aplicacion_tipo_orden_check;

alter table public.ordenes_aplicacion
  add constraint ordenes_aplicacion_tipo_orden_check
  check (tipo_orden in ('normal', 'herbicida_foliar'));

create index if not exists ordenes_aplicacion_tipo_orden_idx
  on public.ordenes_aplicacion (tipo_orden, fecha_planificada desc);

comment on column public.ordenes_aplicacion.tipo_orden is
  'normal: usa programa y totales planificados. herbicida_foliar: acumula cantidades reales desde las salidas y usa a Angel Rangel como encargado.';

commit;

notify pgrst, 'reload schema';

select tipo_orden, count(*) as ordenes
from public.ordenes_aplicacion
group by tipo_orden
order by tipo_orden;
