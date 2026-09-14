-- Mejora incremental WiseConn -> Carta Gantt.
-- Ejecutar una vez en Supabase SQL Editor antes de publicar esta version.

begin;

alter table public.riego
  add column if not exists wiseconn_caudal_medido_m3_h numeric(14, 3),
  add column if not exists modificado_por uuid,
  add column if not exists modificado_por_nombre text,
  add column if not exists wiseconn_ajuste_manual boolean not null default false;

update public.riego
set
  wiseconn_ajuste_manual = coalesce(wiseconn_ajuste_manual, false)
    or (
      (modificado_por is not null or nullif(btrim(coalesce(modificado_por_nombre, '')), '') is not null)
      and abs(coalesce(horas_riego, 0) - coalesce(wiseconn_horas_calculadas, horas_riego, 0)) > 0.005
    ),
  origen = 'wiseconn'
where coalesce(wiseconn_volumen_m3, 0) > 0
   or wiseconn_horas_calculadas is not null;

create or replace function public.preservar_origen_riego_wiseconn()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if coalesce(new.wiseconn_volumen_m3, 0) > 0
     or new.wiseconn_horas_calculadas is not null then
    new.origen := 'wiseconn';
    if new.wiseconn_horas_calculadas is not null
       and abs(coalesce(new.horas_riego, 0) - new.wiseconn_horas_calculadas) > 0.005
       and (tg_op = 'INSERT' or new.horas_riego is distinct from old.horas_riego) then
      new.wiseconn_ajuste_manual := true;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_preservar_origen_riego_wiseconn on public.riego;
create trigger trg_preservar_origen_riego_wiseconn
before insert or update on public.riego
for each row execute function public.preservar_origen_riego_wiseconn();

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
    join public.riego r
      on r.campo_id = e.campo_id
     and r.fecha = e.fecha
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
      wiseconn_horas_calculadas, wiseconn_eventos,
      wiseconn_sincronizado_en, potrero, bloque, especie,
      variedad, hectareas, precipitacion, caudal
    )
    select
      e.campo_id, e.fecha, e.horas, e.volumen_m3, 'wiseconn', false,
      e.volumen_m3, e.caudal_medido_m3_h, e.horas, e.eventos,
      now(), e.potrero, e.bloque, e.especie, e.variedad,
      e.hectareas, e.precipitacion, e.caudal
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
