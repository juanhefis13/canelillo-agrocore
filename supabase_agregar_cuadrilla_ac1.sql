-- Agrega el contratista AGRICOLA CATALINA SPA y su cuadrilla AC1.

begin;

insert into public.contratista (nombre_empresa, codigo_empresa)
values ('AGRICOLA CATALINA SPA', 'AC')
on conflict (upper(trim(nombre_empresa))) do update set
  codigo_empresa = excluded.codigo_empresa;

insert into public.contratista_cuadrillas (contratista_id, codigo_cuadrilla, activo)
select id_contratista, 'AC1', true
from public.contratista
where upper(trim(nombre_empresa)) = 'AGRICOLA CATALINA SPA'
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
where upper(trim(c.nombre_empresa)) = 'AGRICOLA CATALINA SPA'
  and upper(trim(cc.codigo_cuadrilla)) = 'AC1';
