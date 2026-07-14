begin;

alter table public.estacion_climatica
  add column if not exists humedad numeric(6, 4),
  add column if not exists velocidad_viento numeric(8, 2),
  add column if not exists precipitacion numeric(8, 2) default 0;

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

comment on column public.v_estacion_climatica_diaria.grados_dia_base_7 is
  'Grados-dia diarios: max(((temperatura maxima + temperatura minima) / 2) - 7, 0).';

grant select on public.v_estacion_climatica_diaria to authenticated;

notify pgrst, 'reload schema';

commit;

select
  fecha,
  temperatura_maxima,
  temperatura_minima,
  grados_dia_base_7
from public.v_estacion_climatica_diaria
order by fecha desc
limit 10;
