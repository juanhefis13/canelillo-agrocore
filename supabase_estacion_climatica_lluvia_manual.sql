begin;

create index if not exists estacion_climatica_fecha_fuente_idx
  on public.estacion_climatica (fecha, fuente);

comment on index public.estacion_climatica_fecha_fuente_idx is
  'Acelera la busqueda de lluvia manual registrada desde Riego > Bandeja.';

-- Consulta para verificar lluvia manual guardada desde AgroCore:
-- select fecha, hora, precipitacion, fuente
-- from public.estacion_climatica
-- where fuente = 'bandeja_lluvia_manual'
-- order by fecha desc, hora desc;

-- Consulta para revisar lluvias antiguas que pudieron quedar sin marca manual:
-- select fecha, hora, precipitacion, fuente
-- from public.estacion_climatica
-- where coalesce(precipitacion, 0) > 0
--   and coalesce(fuente, '') <> 'bandeja_lluvia_manual'
-- order by fecha desc, hora desc;

commit;
