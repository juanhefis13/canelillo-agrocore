-- Agrega cuadrillas nuevas al maestro de contratistas.
-- Ejecutar en Supabase SQL Editor.

begin;

insert into public.contratista (nombre_empresa, codigo_empresa)
values
  ('JOSE DIAZ SAAVEDRA', 'JD'),
  ('PRESTC SERV APAZA SPA', 'LA')
on conflict (upper(trim(nombre_empresa))) do update set
  codigo_empresa = excluded.codigo_empresa;

insert into public.contratista_cuadrillas (contratista_id, codigo_cuadrilla, activo)
select c.id_contratista, v.codigo_cuadrilla, true
from (
  values
    ('JOSE DIAZ SAAVEDRA', 'JD3'),
    ('PRESTC SERV APAZA SPA', 'LA4')
) as v(nombre_empresa, codigo_cuadrilla)
join public.contratista c
  on upper(trim(c.nombre_empresa)) = upper(trim(v.nombre_empresa))
on conflict (contratista_id, upper(trim(codigo_cuadrilla))) do update set
  activo = true;

commit;

select
  c.nombre_empresa,
  c.codigo_empresa,
  cc.codigo_cuadrilla,
  cc.activo
from public.contratista c
join public.contratista_cuadrillas cc
  on cc.contratista_id = c.id_contratista
where (
    upper(trim(c.nombre_empresa)) = 'JOSE DIAZ SAAVEDRA'
    and upper(trim(cc.codigo_cuadrilla)) = 'JD3'
  )
  or (
    upper(trim(c.nombre_empresa)) = 'PRESTC SERV APAZA SPA'
    and upper(trim(cc.codigo_cuadrilla)) = 'LA4'
  )
order by c.nombre_empresa, cc.codigo_cuadrilla;
