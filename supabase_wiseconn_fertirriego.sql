-- Conserva el detalle compacto de los FIP/fertirrigaciones programados por WiseConn.
-- Ejecutar una vez en Supabase SQL Editor.

begin;

alter table public.wiseconn_riegos_programados
  add column if not exists fertirriego_programado jsonb not null default '[]'::jsonb;

grant select, insert, update on public.wiseconn_riegos_programados to authenticated;

commit;

notify pgrst, 'reload schema';

select
  count(*) as riegos_programados,
  count(*) filter (
    where jsonb_typeof(fertirriego_programado) = 'array'
      and jsonb_array_length(fertirriego_programado) > 0
  ) as riegos_con_fertirriego
from public.wiseconn_riegos_programados;
