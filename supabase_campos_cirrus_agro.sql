-- Alta de CirrusAgro basada en las capas QGIS de monitoreo.
-- Solo el bloque 3 informa superficie; los demas quedan en 0 hasta validacion.
insert into public.campos (potrero, bloque, especie, variedad, hectareas, activo)
values
  ('CirrusAgro', '1', 'MANDARINA', 'MURCOTT', 0, true),
  ('CirrusAgro', '2', 'MANDARINA', 'MURCOTT', 0, true),
  ('CirrusAgro', '3', 'MANDARINA', 'MURCOTT', 3.000, true),
  ('CirrusAgro', '4', 'MANDARINA', 'MURCOTT', 0, true),
  ('CirrusAgro', '5', 'MANDARINA', 'MURCOTT', 0, true)
on conflict (potrero, bloque) do update
set
  especie = excluded.especie,
  variedad = excluded.variedad,
  hectareas = case
    when excluded.hectareas > 0 then excluded.hectareas
    else public.campos.hectareas
  end,
  activo = true;

select potrero, bloque, especie, variedad, hectareas, activo
from public.campos
where potrero = 'CirrusAgro'
order by bloque;
