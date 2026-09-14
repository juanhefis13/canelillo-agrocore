-- Corrige y conserva horas programadas WiseConn separadas del programa AgroCore.
-- Ejecutar una vez en Supabase SQL Editor.

begin;

alter table public.wiseconn_riegos_reales
  add column if not exists scheduled_irrigation_id bigint;

create index if not exists wiseconn_riegos_reales_scheduled_idx
  on public.wiseconn_riegos_reales (scheduled_irrigation_id)
  where scheduled_irrigation_id is not null;

create table if not exists public.wiseconn_riegos_programados (
  scheduled_id bigint primary key,
  farm_id bigint not null references public.wiseconn_campos(farm_id) on delete cascade,
  zone_id bigint not null,
  pump_system_id bigint,
  inicio timestamptz not null,
  termino timestamptz not null,
  estado text,
  tipo_riego text,
  tipo_programacion text,
  horas_programadas numeric(12, 3),
  volumen_programado_m3 numeric(16, 3),
  caudal_teorico_m3_h numeric(14, 3),
  programado_por text,
  sincronizado_en timestamptz not null default now(),
  constraint wiseconn_programado_periodo_ck check (termino >= inicio)
);

create index if not exists wiseconn_riegos_programados_zone_inicio_idx
  on public.wiseconn_riegos_programados (farm_id, zone_id, inicio);

alter table public.wiseconn_riegos_programados enable row level security;

drop policy if exists wiseconn_riegos_programados_select on public.wiseconn_riegos_programados;
create policy wiseconn_riegos_programados_select on public.wiseconn_riegos_programados
for select to authenticated using (true);

drop policy if exists wiseconn_riegos_programados_insert on public.wiseconn_riegos_programados;
create policy wiseconn_riegos_programados_insert on public.wiseconn_riegos_programados
for insert to authenticated with check (true);

drop policy if exists wiseconn_riegos_programados_update on public.wiseconn_riegos_programados;
create policy wiseconn_riegos_programados_update on public.wiseconn_riegos_programados
for update to authenticated using (true) with check (true);

grant select, insert, update on public.wiseconn_riegos_programados to authenticated;

alter table public.riego
  add column if not exists wiseconn_duracion_real_horas numeric(12, 3),
  add column if not exists wiseconn_horas_programadas numeric(12, 3),
  add column if not exists wiseconn_volumen_programado_m3 numeric(16, 3),
  add column if not exists wiseconn_caudal_teorico_m3_h numeric(14, 3),
  add column if not exists wiseconn_programaciones integer;

drop function if exists public.sincronizar_riego_wiseconn(jsonb);
drop function if exists public.sincronizar_riego_wiseconn(jsonb, date, date);

create function public.sincronizar_riego_wiseconn(
  p_registros jsonb,
  p_desde date default null,
  p_hasta date default null
)
returns jsonb
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_procesados integer := 0;
  v_manuales_preservados integer := 0;
  v_automaticos_eliminados integer := 0;
begin
  if p_registros is null or jsonb_typeof(p_registros) <> 'array' then
    raise exception 'p_registros debe ser un arreglo JSON';
  end if;

  if (p_desde is null) <> (p_hasta is null) then
    raise exception 'p_desde y p_hasta deben enviarse juntos';
  end if;

  if p_desde is not null and p_hasta <= p_desde then
    raise exception 'El rango de sincronizacion WiseConn no es valido';
  end if;

  if p_desde is not null then
    delete from public.riego r
    where r.fecha >= greatest(p_desde, date '2026-01-01')
      and r.fecha < p_hasta
      and coalesce(nullif(r.origen, ''), 'manual') = 'wiseconn'
      and not coalesce(r.wiseconn_ajuste_manual, false)
      and not exists (
        select 1
        from jsonb_to_recordset(p_registros) as x(campo_id uuid, fecha date)
        where x.campo_id = r.campo_id
          and x.fecha = r.fecha
      );
    get diagnostics v_automaticos_eliminados = row_count;
  end if;

  with entrada as materialized (
    select distinct on (x.campo_id, x.fecha)
      x.campo_id,
      x.fecha,
      round(greatest(coalesce(x.horas, 0), 0)::numeric, 2) as horas,
      round(greatest(coalesce(x.volumen_m3, 0), 0)::numeric, 3) as volumen_m3,
      nullif(round(greatest(coalesce(x.caudal_medido_m3_h, 0), 0)::numeric, 3), 0) as caudal_medido_m3_h,
      nullif(round(greatest(coalesce(x.duracion_real_horas, 0), 0)::numeric, 3), 0) as duracion_real_horas,
      nullif(round(greatest(coalesce(x.horas_programadas, 0), 0)::numeric, 3), 0) as horas_programadas,
      nullif(round(greatest(coalesce(x.volumen_programado_m3, 0), 0)::numeric, 3), 0) as volumen_programado_m3,
      nullif(round(greatest(coalesce(x.caudal_teorico_m3_h, 0), 0)::numeric, 3), 0) as caudal_teorico_m3_h,
      greatest(coalesce(x.programaciones, 0), 0)::integer as programaciones,
      greatest(coalesce(x.eventos, 0), 0)::integer as eventos,
      c.potrero,
      c.bloque,
      c.especie,
      c.variedad,
      c.hectareas,
      c.precipitacion,
      c.caudal
    from jsonb_to_recordset(p_registros) as x(
      campo_id uuid,
      fecha date,
      horas numeric,
      volumen_m3 numeric,
      caudal_medido_m3_h numeric,
      duracion_real_horas numeric,
      horas_programadas numeric,
      volumen_programado_m3 numeric,
      caudal_teorico_m3_h numeric,
      programaciones integer,
      eventos integer
    )
    join public.campos c on c.id = x.campo_id
    where x.fecha >= date '2026-01-01'
      and coalesce(x.volumen_m3, 0) > 0
      and coalesce(x.horas, 0) >= 0
    order by x.campo_id, x.fecha
  ),
  manuales as (
    select count(*)::integer as total
    from entrada e
    join public.riego r on r.campo_id = e.campo_id and r.fecha = e.fecha
    where coalesce(r.wiseconn_ajuste_manual, false)
       or (
         coalesce(nullif(r.origen, ''), 'manual') <> 'wiseconn'
         and (r.modificado_por is not null or nullif(btrim(coalesce(r.modificado_por_nombre, '')), '') is not null)
         and abs(coalesce(r.horas_riego, 0) - e.horas) > 0.005
       )
  ),
  actualizados as (
    insert into public.riego (
      campo_id, fecha, horas_riego, volumen, origen, wiseconn_ajuste_manual,
      wiseconn_volumen_m3, wiseconn_caudal_medido_m3_h,
      wiseconn_horas_calculadas, wiseconn_duracion_real_horas,
      wiseconn_horas_programadas, wiseconn_volumen_programado_m3,
      wiseconn_caudal_teorico_m3_h, wiseconn_programaciones,
      wiseconn_eventos, wiseconn_sincronizado_en, potrero, bloque,
      especie, variedad, hectareas, precipitacion, caudal
    )
    select
      e.campo_id, e.fecha, e.horas, e.volumen_m3, 'wiseconn', false,
      e.volumen_m3, e.caudal_medido_m3_h, e.horas, e.duracion_real_horas,
      e.horas_programadas, e.volumen_programado_m3,
      e.caudal_teorico_m3_h, e.programaciones, e.eventos, now(),
      e.potrero, e.bloque, e.especie, e.variedad, e.hectareas,
      e.precipitacion, e.caudal
    from entrada e
    on conflict (campo_id, fecha) do update set
      horas_riego = case
        when coalesce(riego.wiseconn_ajuste_manual, false)
          or (
            coalesce(nullif(riego.origen, ''), 'manual') <> 'wiseconn'
            and (riego.modificado_por is not null or nullif(btrim(coalesce(riego.modificado_por_nombre, '')), '') is not null)
            and abs(coalesce(riego.horas_riego, 0) - excluded.horas_riego) > 0.005
          ) then riego.horas_riego
        else excluded.horas_riego
      end,
      volumen = excluded.volumen,
      origen = 'wiseconn',
      wiseconn_ajuste_manual = coalesce(riego.wiseconn_ajuste_manual, false)
        or (
          coalesce(nullif(riego.origen, ''), 'manual') <> 'wiseconn'
          and (riego.modificado_por is not null or nullif(btrim(coalesce(riego.modificado_por_nombre, '')), '') is not null)
          and abs(coalesce(riego.horas_riego, 0) - excluded.horas_riego) > 0.005
        ),
      wiseconn_volumen_m3 = excluded.wiseconn_volumen_m3,
      wiseconn_caudal_medido_m3_h = excluded.wiseconn_caudal_medido_m3_h,
      wiseconn_horas_calculadas = excluded.wiseconn_horas_calculadas,
      wiseconn_duracion_real_horas = excluded.wiseconn_duracion_real_horas,
      wiseconn_horas_programadas = excluded.wiseconn_horas_programadas,
      wiseconn_volumen_programado_m3 = excluded.wiseconn_volumen_programado_m3,
      wiseconn_caudal_teorico_m3_h = excluded.wiseconn_caudal_teorico_m3_h,
      wiseconn_programaciones = excluded.wiseconn_programaciones,
      wiseconn_eventos = excluded.wiseconn_eventos,
      wiseconn_sincronizado_en = excluded.wiseconn_sincronizado_en,
      potrero = excluded.potrero,
      bloque = excluded.bloque,
      especie = excluded.especie,
      variedad = excluded.variedad,
      hectareas = excluded.hectareas,
      precipitacion = excluded.precipitacion,
      caudal = excluded.caudal
    returning 1
  )
  select
    (select count(*)::integer from actualizados),
    (select total from manuales)
  into v_procesados, v_manuales_preservados;

  return jsonb_build_object(
    'procesados', v_procesados,
    'manuales_preservados', v_manuales_preservados,
    'automaticos_eliminados', v_automaticos_eliminados,
    'desde', '2026-01-01'
  );
end;
$$;

revoke all on function public.sincronizar_riego_wiseconn(jsonb, date, date) from public;
grant execute on function public.sincronizar_riego_wiseconn(jsonb, date, date) to authenticated;

commit;

notify pgrst, 'reload schema';

