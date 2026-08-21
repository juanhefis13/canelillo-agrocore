-- Importacion de C:\Users\PC\Documents\BD.xls
-- Hojas: VECHICULO, BOQUILLAS y TRACTORISTAS.
-- Es idempotente: se puede ejecutar nuevamente sin duplicar datos.

begin;

do $$
begin
  if to_regclass('public.vehiculos') is null then
    raise exception 'No existe public.vehiculos. Ejecuta primero supabase_vehiculos.sql.';
  end if;

  if to_regclass('public.trabajador') is null then
    raise exception 'No existe public.trabajador. Verifica el nombre de la tabla antes de importar tractoristas.';
  end if;
end
$$;

-- Vehiculos y maquinaria de aplicacion. "Sin marca" conserva el NOT NULL
-- de public.vehiculos cuando el Excel no informa fabricante.
insert into public.vehiculos (
  clasificacion,
  tipo_vehiculo,
  marca,
  modelo,
  numero_serie,
  anio,
  codigo
)
values
  ('APLICACIÓN', 'maquinaria aplicación', 'Sin marca', 'Nebulizadora Parada 1500 lts', null, null, '206'),
  ('APLICACIÓN', 'maquinaria aplicación', 'Sin marca', 'Nebulizador jacto arbus', null, null, '207'),
  ('APLICACIÓN', 'maquinaria aplicación', 'Sin marca', 'Nebulizador Futura P20', null, null, '208'),
  ('APLICACIÓN', 'maquinaria aplicación', 'Sin marca', 'Pulverizadora Rautop', null, null, '209'),
  ('APLICACIÓN', 'maquinaria aplicación', 'Sin marca', 'Pulverizadora parada 600 lts', null, null, '210'),
  ('APLICACIÓN', 'maquinaria aplicación', 'Sin marca', 'Pulverizadora parada 600 lts', null, null, '211'),
  ('APLICACIÓN', 'maquinaria aplicación', 'Sin marca', 'Nebulizadora Parada 2000 lts.', null, null, '241'),
  ('APLICACIÓN', 'maquinaria aplicación', 'Sin marca', 'Nebulizadora Parada 2000 lts.', null, null, '244'),
  ('APLICACIÓN', 'maquinaria aplicación', 'Sin marca', 'Nebulizadora Parada 1500 lts Pitón', null, null, '255'),
  ('APLICACIÓN', 'maquinaria aplicación', 'Sin marca', 'Nebulizadora Lerpain 1500 lts', null, null, '256')
on conflict (codigo) do update set
  clasificacion = excluded.clasificacion,
  tipo_vehiculo = excluded.tipo_vehiculo,
  marca = excluded.marca,
  modelo = excluded.modelo,
  numero_serie = excluded.numero_serie,
  anio = excluded.anio;

-- Catalogo independiente de boquillas para aplicaciones.
create table if not exists public.boquillas (
  id uuid primary key default gen_random_uuid(),
  modo text not null,
  modelo text not null,
  tipo text not null,
  especificacion text not null,
  uso text,
  activo boolean not null default true,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  constraint boquillas_catalogo_unq unique (modo, modelo, tipo, especificacion)
);

create index if not exists boquillas_modo_modelo_idx
  on public.boquillas (modo, modelo);

alter table public.boquillas enable row level security;

drop policy if exists "boquillas_select_authenticated" on public.boquillas;
create policy "boquillas_select_authenticated"
  on public.boquillas
  for select
  to authenticated
  using (true);

drop policy if exists "boquillas_admin_supervisor_write" on public.boquillas;
create policy "boquillas_admin_supervisor_write"
  on public.boquillas
  for all
  to authenticated
  using (
    exists (
      select 1
      from public.usuarios u
      where u.id = auth.uid()
        and lower(coalesce(u.rol::text, '')) in ('admin', 'supervisor')
    )
  )
  with check (
    exists (
      select 1
      from public.usuarios u
      where u.id = auth.uid()
        and lower(coalesce(u.rol::text, '')) in ('admin', 'supervisor')
    )
  );

grant select on public.boquillas to authenticated;
grant insert, update, delete on public.boquillas to authenticated;

insert into public.boquillas (modo, modelo, tipo, especificacion, uso)
values
  ('Nebulizado', 'ATF 80', 'Cono lleno', 'Café', 'Aplicaciones de volumen medio/alto'),
  ('Nebulizado', 'ATF 80', 'Cono lleno', 'Azul', 'Aplicaciones de volumen medio/bajo'),
  ('Pitón', 'Mitra', 'Cono lleno', '1 mm a 1,5 mm', 'Aplicaciones de volumen medio/bajo'),
  ('Pitón', 'Mitra', 'Cono lleno', '2 mm a 2,5 mm', 'Aplicaciones de alto volumen'),
  ('Pulverizado barra', 'AXI', 'Abanico', 'Amarilla', 'Aplicaciones de herbicidas entre hileras')
on conflict (modo, modelo, tipo, especificacion) do update set
  uso = excluded.uso,
  activo = true,
  actualizado_en = now();

-- Si el supervisor indicado por el Excel no existe, se conserva la carga y
-- el supervisor queda NULL. La consulta de verificacion final lo informa.
with tractoristas (nombre, apellido, supervisor_id) as (
  values
    ('LUIS GUILLERMO', 'AGUILAR ANRIQUEZ', '586bd5e9-ddd4-44c8-a7fa-8d82ccc9c43f'::uuid),
    ('ELSA VIOLETA', 'ARANDA GALLEGUILLOS', '586bd5e9-ddd4-44c8-a7fa-8d82ccc9c43f'::uuid),
    ('ANTONIO ALEJANDRO', 'CARVALLO PARRA', '586bd5e9-ddd4-44c8-a7fa-8d82ccc9c43f'::uuid),
    ('RAFAEL ADOLFO', 'CODOCEO AVARIA', '586bd5e9-ddd4-44c8-a7fa-8d82ccc9c43f'::uuid),
    ('SAMUEL ANDRES', 'CORDOVA ORTIZ', '586bd5e9-ddd4-44c8-a7fa-8d82ccc9c43f'::uuid),
    ('LUIS HERIBERTO', 'CORTES URBINA', '586bd5e9-ddd4-44c8-a7fa-8d82ccc9c43f'::uuid),
    ('RODRIGO IGNACIO', 'DELGADO VILLALOBOS', '586bd5e9-ddd4-44c8-a7fa-8d82ccc9c43f'::uuid),
    ('MANUEL ENRIQUE', 'FAUNDEZ BUGUEÑO', '586bd5e9-ddd4-44c8-a7fa-8d82ccc9c43f'::uuid),
    ('JORGE ARMANDO', 'GODOY DIAZ', '586bd5e9-ddd4-44c8-a7fa-8d82ccc9c43f'::uuid),
    ('ANDRES', 'GONZALEZ HERRERA', '586bd5e9-ddd4-44c8-a7fa-8d82ccc9c43f'::uuid),
    ('JOSE ORLANDO', 'MELLA ROMAN', '586bd5e9-ddd4-44c8-a7fa-8d82ccc9c43f'::uuid),
    ('MARCO ANTONIO', 'PALMA GODOY', '586bd5e9-ddd4-44c8-a7fa-8d82ccc9c43f'::uuid),
    ('GUILLERMO FELIPE', 'ROMAN CARRASCO', '586bd5e9-ddd4-44c8-a7fa-8d82ccc9c43f'::uuid),
    ('MANUEL ANGEL', 'RUBILAR RUBILAR', '586bd5e9-ddd4-44c8-a7fa-8d82ccc9c43f'::uuid),
    ('CARLOS SAMUEL', 'SAAVEDRA FERNANDEZ', '586bd5e9-ddd4-44c8-a7fa-8d82ccc9c43f'::uuid),
    ('HUGO EUGENIO', 'SAAVEDRA ZUNIGA', '586bd5e9-ddd4-44c8-a7fa-8d82ccc9c43f'::uuid),
    ('SERGIO HERNAN', 'SILVA BELTRAN', '586bd5e9-ddd4-44c8-a7fa-8d82ccc9c43f'::uuid),
    ('JUAN JOSE', 'SOTO MADARIAGA', '586bd5e9-ddd4-44c8-a7fa-8d82ccc9c43f'::uuid),
    ('LUIS ALBERTO', 'TAPIA MELLA', '586bd5e9-ddd4-44c8-a7fa-8d82ccc9c43f'::uuid),
    ('CHRISTIAN HERNAN', 'VALDIVIA DIAZ', '586bd5e9-ddd4-44c8-a7fa-8d82ccc9c43f'::uuid),
    ('PATRICIO HERNAN', 'VARGAS PAEZ', '586bd5e9-ddd4-44c8-a7fa-8d82ccc9c43f'::uuid),
    ('DOMINGO ELEUTERIO', 'ZEPEDA IRIARTE', '586bd5e9-ddd4-44c8-a7fa-8d82ccc9c43f'::uuid),
    ('ANGEL', 'RANGEL', '586bd5e9-ddd4-44c8-a7fa-8d82ccc9c43f'::uuid)
), supervisor as (
  select id
  from public.trabajador
  where id = '586bd5e9-ddd4-44c8-a7fa-8d82ccc9c43f'::uuid
)
insert into public.trabajador (
  nombre,
  apellido,
  rut,
  correo,
  telefono,
  area,
  cargo,
  labor,
  supervisor_id
)
select
  t.nombre,
  t.apellido,
  null,
  null,
  null,
  'APLICACIONES',
  'APLICADOR',
  'TRACTORISTA',
  s.id
from tractoristas t
left join supervisor s on s.id = t.supervisor_id
where not exists (
  select 1
  from public.trabajador existente
  where regexp_replace(lower(trim(existente.nombre)), '[[:space:]]+', ' ', 'g')
          = regexp_replace(lower(trim(t.nombre)), '[[:space:]]+', ' ', 'g')
    and regexp_replace(lower(trim(coalesce(existente.apellido, ''))), '[[:space:]]+', ' ', 'g')
          = regexp_replace(lower(trim(t.apellido)), '[[:space:]]+', ' ', 'g')
);

commit;

-- Verificacion. Debe devolver 10 vehiculos, 5 boquillas y 23 tractoristas.
select count(*) as vehiculos_importados
from public.vehiculos
where codigo in ('206', '207', '208', '209', '210', '211', '241', '244', '255', '256');

select count(*) as boquillas_importadas
from public.boquillas
where activo = true;

select
  count(*) as tractoristas_importados,
  count(*) filter (where supervisor_id is null) as tractoristas_sin_supervisor
from public.trabajador
where upper(coalesce(labor, '')) = 'TRACTORISTA';
