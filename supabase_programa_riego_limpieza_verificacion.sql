-- Verificacion y limpieza controlada de public.programa_riego.
-- Ejecutar en Supabase SQL Editor.
-- Este archivo NO borra datos por defecto; el DELETE queda comentado para revisarlo antes.

-- 1) Ver resumen por mes y registros con datos de bloque incompletos.
select
  to_char(fecha, 'YYYY-MM') as mes,
  count(*) as registros,
  count(*) filter (
    where potrero is null
       or bloque is null
       or especie is null
       or hectareas is null
       or precipitacion is null
       or caudal is null
  ) as registros_con_snapshot_incompleto
from public.programa_riego
group by 1
order by 1;

-- 2) Reparar potrero, bloque, especie, variedad, hectareas, precipitacion y caudal
-- usando public.campos como fuente oficial.
update public.programa_riego pr
set
  potrero = c.potrero,
  bloque = c.bloque,
  especie = c.especie,
  variedad = c.variedad,
  hectareas = c.hectareas,
  precipitacion = c.precipitacion,
  caudal = c.caudal
from public.campos c
where pr.campo_id = c.id
  and (
    pr.potrero is null
    or pr.bloque is null
    or pr.especie is null
    or pr.variedad is null
    or pr.hectareas is null
    or pr.precipitacion is null
    or pr.caudal is null
  );

-- 3) Verificar registros que no encontraron match en campos.
select
  pr.id,
  pr.campo_id,
  pr.fecha,
  pr.horas_programadas,
  pr.potrero,
  pr.bloque,
  pr.especie
from public.programa_riego pr
left join public.campos c on c.id = pr.campo_id
where c.id is null
   or pr.potrero is null
   or pr.bloque is null
   or pr.especie is null
order by pr.fecha;

-- 4) OPCIONAL Y DESTRUCTIVO:
-- Si confirmas que solo quieres conservar junio 2026 en programa_riego,
-- descomenta este bloque. No lo ejecutes si necesitas meses futuros.
--
-- begin;
-- delete from public.programa_riego
-- where fecha < date '2026-06-01'
--    or fecha > date '2026-06-30';
-- commit;

