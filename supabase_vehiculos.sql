-- Tabla de vehículos para Canelillo AgroCore
-- Ejecuta este archivo en Supabase SQL Editor antes de usar el selector de Código tractor.

create table if not exists public.vehiculos (
  id uuid primary key default gen_random_uuid(),
  clasificacion text not null,
  tipo_vehiculo text not null,
  marca text not null,
  modelo text not null,
  numero_serie text,
  anio integer,
  codigo text not null unique,
  activo boolean not null default true,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

create index if not exists vehiculos_clasificacion_tipo_idx
  on public.vehiculos (clasificacion, tipo_vehiculo);

create index if not exists vehiculos_codigo_idx
  on public.vehiculos (codigo);

alter table public.vehiculos enable row level security;

-- Lectura para usuarios autenticados de la app.
drop policy if exists "vehiculos_select_authenticated" on public.vehiculos;
create policy "vehiculos_select_authenticated"
  on public.vehiculos
  for select
  to authenticated
  using (true);

-- Administración para admin/supervisor registrados en public.usuarios.
drop policy if exists "vehiculos_admin_supervisor_write" on public.vehiculos;
create policy "vehiculos_admin_supervisor_write"
  on public.vehiculos
  for all
  to authenticated
  using (
    exists (
      select 1
      from public.usuarios u
      where u.id = auth.uid()
        and lower(coalesce(u.rol, '')) in ('admin', 'supervisor')
    )
  )
  with check (
    exists (
      select 1
      from public.usuarios u
      where u.id = auth.uid()
        and lower(coalesce(u.rol, '')) in ('admin', 'supervisor')
    )
  );

insert into public.vehiculos (clasificacion, tipo_vehiculo, marca, modelo, numero_serie, anio, codigo)
values
  ('Aplicación', 'Tractor', 'John Deere', 'M5BL4', '068221 CD', 1972, '254'),
  ('Aplicación', 'Tractor', 'Landini', 'Advantage DT 65 F', '7096E15028', 2000, '201'),
  ('Aplicación', 'Tractor', 'Landini', 'Advantage DT 65 F', '7096G28208', 2000, '250'),
  ('Aplicación', 'Tractor', 'Landini', 'REX 90F', 'PYKLA04857', 2015, '253'),
  ('Aplicación', 'Tractor', 'Kubota', 'M7040N-R', '98433', 2016, '240'),
  ('Aplicación', 'Tractor', 'Kubota', 'M7040N-R', '30860', 2016, '243'),
  ('Aplicación', 'Tractor', 'Mahindra', '8000 4wd', 'KNAE1518', 2017, '205'),
  ('Aplicación', 'Tractor', 'Kubota', 'M7040N-R', '30182', 2017, '242'),
  ('Aplicación', 'Tractor', 'Kubota', 'M8540N-O', '93112', 2019, '245'),
  ('Aplicación', 'Tractor', 'Kubota', 'M8540N-O', '93294', 2020, '246'),
  ('Aplicación', 'Tractor', 'Massey Ferguson', 'MF 3307 xtra', '9AGT0012LPC009726', 2023, '257')
on conflict (codigo) do update set
  clasificacion = excluded.clasificacion,
  tipo_vehiculo = excluded.tipo_vehiculo,
  marca = excluded.marca,
  modelo = excluded.modelo,
  numero_serie = excluded.numero_serie,
  anio = excluded.anio,
  activo = true,
  actualizado_en = now();
