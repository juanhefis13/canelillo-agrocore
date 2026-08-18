-- LIMPIEZA OPERATIVA PARA INICIAR LA MARCHA OFICIAL.
-- Conserva casetas, estanques, relaciones con potreros, productos, dosis y programa.
-- Elimina permanentemente lotes, preparaciones, aplicaciones y sus consumos.

begin;

delete from public.fertilizante_aplicacion_consumos;
delete from public.fertilizante_aplicaciones;
delete from public.fertilizante_preparaciones;
delete from public.fertilizante_lotes;

commit;

select
  (select count(*) from public.fertilizante_lotes) as lotes,
  (select count(*) from public.fertilizante_preparaciones) as preparaciones,
  (select count(*) from public.fertilizante_aplicaciones) as aplicaciones,
  (select count(*) from public.fertilizante_aplicacion_consumos) as consumos;
