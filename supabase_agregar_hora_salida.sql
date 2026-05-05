-- Opcional recomendado: permite guardar la hora exacta elegida en Nueva salida.
-- Si no ejecutas esto, la web igual funciona y mostrara la hora de creacion del registro.
alter table public.despachos
add column if not exists hora_salida time;
