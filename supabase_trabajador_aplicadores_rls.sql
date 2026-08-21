-- Permite que usuarios autenticados vean los aplicadores usados en Bodega.
-- Ejecutar en Supabase SQL Editor si el selector Aplicador queda vacio.

alter table public.trabajador enable row level security;

grant select on public.trabajador to authenticated;

drop policy if exists "trabajador_select_aplicadores_aplicaciones" on public.trabajador;
create policy "trabajador_select_aplicadores_aplicaciones"
  on public.trabajador
  for select
  to authenticated
  using (
    (
      lower(coalesce(area, '')) like '%aplicacion%'
      and lower(coalesce(cargo, '')) like '%aplicador%'
    )
    or lower(coalesce(labor, '')) like '%tractorista%'
    or exists (
      select 1
      from public.usuarios u
      where u.id = auth.uid()
        and lower(coalesce(u.rol::text, '')) in ('admin', 'supervisor')
    )
  );

-- Verificacion esperada: debe devolver los aplicadores visibles para Bodega.
select id, nombre, apellido, area, cargo, labor
from public.trabajador
where (
  lower(coalesce(area, '')) like '%aplicacion%'
  and lower(coalesce(cargo, '')) like '%aplicador%'
)
or lower(coalesce(labor, '')) like '%tractorista%'
order by apellido, nombre;
