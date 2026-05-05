-- Verificar si la tabla despachos tiene columnas para trazabilidad de bodega
select column_name, data_type
from information_schema.columns
where table_schema = 'public'
  and table_name = 'despachos'
  and column_name in ('codigo_tractor','codigo_maquina','aplicador_id','tractor','maquina','aplicador','hora_salida')
order by column_name;

-- Opcion recomendada para este proyecto: columnas usadas por el codigo principal.
alter table public.despachos add column if not exists hora_salida time;
alter table public.despachos add column if not exists codigo_tractor text;
alter table public.despachos add column if not exists codigo_maquina text;
alter table public.despachos add column if not exists aplicador_id text;

-- Revisar ultimos registros guardados
select id, orden_id, fecha, hora_salida, codigo_tractor, codigo_maquina, aplicador_id,
       tractor, maquina, aplicador
from public.despachos
order by fecha desc, id desc
limit 20;
