-- Fix puntual para que Bodega pueda guardar y mostrar trazabilidad de salidas.
-- Ejecuta este SQL si en tu tabla despachos no existen estas columnas.

alter table public.despachos add column if not exists hora_salida time;
alter table public.despachos add column if not exists codigo_tractor text;
alter table public.despachos add column if not exists codigo_maquina text;
alter table public.despachos add column if not exists aplicador_id text;

-- Compatibilidad opcional si en alguna versión antigua de la app se usaron nombres simples.
alter table public.despachos add column if not exists tractor text;
alter table public.despachos add column if not exists maquina text;
alter table public.despachos add column if not exists aplicador text;

-- Copiar datos entre nombres, sin sobrescribir lo que ya exista.
update public.despachos
set codigo_tractor = coalesce(codigo_tractor, tractor),
    codigo_maquina = coalesce(codigo_maquina, maquina),
    aplicador_id = coalesce(aplicador_id, aplicador)
where codigo_tractor is null
   or codigo_maquina is null
   or aplicador_id is null;

-- Verificación rápida.
select id, fecha, hora_salida, codigo_tractor, codigo_maquina, aplicador_id, tractor, maquina, aplicador
from public.despachos
order by id desc
limit 20;
