begin;

insert into public.campos (potrero, bloque, especie, variedad, hectareas, activo)
values
  ('Mirador 3', '1', 'PALTOS', 'Hass', 3.410, true),
  ('Mirador 3', '2', 'PALTOS', 'Hass', 4.080, true),
  ('Mirador 3', '3', 'PALTOS', 'Hass', 4.020, true),
  ('Mirador 3', '4', 'PALTOS', 'Hass', 3.210, true),
  ('Mirador 3', '5', 'PALTOS', 'Hass', 3.460, true)
on conflict (potrero, bloque) do update
set especie = excluded.especie,
    variedad = excluded.variedad,
    hectareas = excluded.hectareas,
    activo = true;

commit;
