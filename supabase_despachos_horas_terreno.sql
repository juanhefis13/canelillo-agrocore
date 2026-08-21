-- Horario operativo de cada salida de aplicacion.
-- hora_salida se conserva por compatibilidad y representa la hora de inicio.

alter table public.despachos
  add column if not exists hora_salida time,
  add column if not exists hora_termino time;

comment on column public.despachos.hora_salida is
  'Hora de inicio del proceso de aplicacion en terreno.';

comment on column public.despachos.hora_termino is
  'Hora de termino del proceso de aplicacion en terreno.';

select id, fecha as fecha_entrega, hora_salida as hora_inicio, hora_termino
from public.despachos
order by fecha desc, hora_salida desc
limit 20;
