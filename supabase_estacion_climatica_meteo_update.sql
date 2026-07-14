begin;

alter table public.estacion_climatica
  add column if not exists humedad numeric(6, 4),
  add column if not exists velocidad_viento numeric(8, 2),
  add column if not exists precipitacion numeric(8, 2) default 0;

comment on column public.estacion_climatica.humedad is
  'Humedad relativa guardada como decimal. Ejemplo: 67% = 0.67.';
comment on column public.estacion_climatica.velocidad_viento is
  'Velocidad del viento segun unidad de origen de la estacion.';
comment on column public.estacion_climatica.precipitacion is
  'Precipitacion o lluvia del intervalo. Se acumula por dia.';

with ranked as (
  select
    id,
    fecha,
    hora,
    temp_out,
    hi_temp,
    low_temp,
    humedad,
    velocidad_viento,
    precipitacion,
    fuente,
    creado_en,
    row_number() over (
      partition by fecha, hora
      order by
        ((humedad is not null)::integer + (velocidad_viento is not null)::integer + (precipitacion is not null)::integer) desc,
        creado_en desc,
        id desc
    ) as row_rank
  from public.estacion_climatica
),
merged as (
  select
    fecha,
    hora,
    (array_agg(id order by row_rank asc))[1] as keep_id,
    (array_agg(temp_out order by creado_en desc, id desc))[1] as temp_out,
    (array_agg(hi_temp order by creado_en desc, id desc))[1] as hi_temp,
    (array_agg(low_temp order by creado_en desc, id desc))[1] as low_temp,
    (array_agg(humedad order by (humedad is not null) desc, creado_en desc, id desc))[1] as humedad,
    (array_agg(velocidad_viento order by (velocidad_viento is not null) desc, creado_en desc, id desc))[1] as velocidad_viento,
    (array_agg(precipitacion order by (precipitacion is not null) desc, creado_en desc, id desc))[1] as precipitacion,
    (array_agg(fuente order by creado_en desc, id desc))[1] as fuente
  from ranked
  group by fecha, hora
  having count(*) > 1
)
update public.estacion_climatica e
set
  temp_out = m.temp_out,
  hi_temp = m.hi_temp,
  low_temp = m.low_temp,
  humedad = m.humedad,
  velocidad_viento = m.velocidad_viento,
  precipitacion = coalesce(m.precipitacion, 0),
  fuente = coalesce(m.fuente, e.fuente)
from merged m
where e.id = m.keep_id;

with duplicates as (
  select
    id,
    row_number() over (
      partition by fecha, hora
      order by
        ((humedad is not null)::integer + (velocidad_viento is not null)::integer + (precipitacion is not null)::integer) desc,
        creado_en desc,
        id desc
    ) as row_rank
  from public.estacion_climatica
)
delete from public.estacion_climatica e
using duplicates d
where e.id = d.id
  and d.row_rank > 1;

create unique index if not exists estacion_climatica_fecha_hora_uidx
  on public.estacion_climatica (fecha, hora);

create or replace view public.v_estacion_climatica_diaria
with (security_invoker = true)
as
select
  fecha,
  count(*)::integer as registros,
  round(avg(temp_out), 2) as temperatura_promedio,
  min(low_temp) as temperatura_minima,
  max(hi_temp) as temperatura_maxima,
  round((count(*) filter (where temp_out > 7) * 0.25)::numeric, 2) as horas_sobre_7,
  round(greatest(((max(hi_temp) + min(low_temp)) / 2) - 7, 0)::numeric, 3) as grados_dia_base_7,
  round((count(*) filter (where temp_out <= 0 and temp_out > -1) * 0.25)::numeric, 2) as helada_0_menos_1,
  round((count(*) filter (where temp_out <= -1 and temp_out > -2) * 0.25)::numeric, 2) as helada_menos_1_menos_2,
  round((count(*) filter (where temp_out <= -2) * 0.25)::numeric, 2) as helada_menor_igual_menos_2,
  min(
    case when temp_out <= 0 then
      case when hora >= time '12:00' then hora - interval '12 hours' else hora end
    end
  ) as helada_inicio,
  case when count(*) filter (where temp_out <= 0) > 0 then
    (
      max(
        case when temp_out <= 0 then
          case when hora >= time '12:00' then hora - interval '12 hours' else hora end
        end
      ) + interval '15 minutes'
    )::time
  end as helada_termino,
  round(avg(humedad), 4) as humedad_promedio,
  round(avg(velocidad_viento), 2) as velocidad_viento_promedio,
  round(sum(coalesce(precipitacion, 0)), 2) as precipitacion_acumulada
from public.estacion_climatica
group by fecha;

comment on column public.v_estacion_climatica_diaria.humedad_promedio is
  'Promedio diario de humedad relativa en decimal. En la app se muestra como porcentaje.';
comment on column public.v_estacion_climatica_diaria.velocidad_viento_promedio is
  'Promedio diario de velocidad de viento.';
comment on column public.v_estacion_climatica_diaria.precipitacion_acumulada is
  'Suma diaria de precipitacion o lluvia.';
comment on column public.v_estacion_climatica_diaria.grados_dia_base_7 is
  'Grados-dia diarios: max(((temperatura maxima + temperatura minima) / 2) - 7, 0).';

grant select on public.v_estacion_climatica_diaria to authenticated;
grant insert, update, delete on public.estacion_climatica to authenticated;

notify pgrst, 'reload schema';

commit;
