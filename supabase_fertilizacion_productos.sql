-- Maestro de productos de fertilizacion.
-- Esta tabla es independiente de public.productos, que queda reservada para aplicaciones fitosanitarias.
-- Fuente: tabla enviada por imagen, unidad KG/LT y composicion.

begin;

create table if not exists public.fertilizante_productos (
  id uuid primary key default gen_random_uuid(),
  nombre_comercial text not null,
  nombre_normalizado text not null unique,
  unidad text not null,
  n numeric(12, 4) not null default 0,
  p numeric(12, 4) not null default 0,
  k numeric(12, 4) not null default 0,
  b numeric(12, 4) not null default 0,
  zn numeric(12, 4) not null default 0,
  mg numeric(12, 4) not null default 0,
  ca numeric(12, 4) not null default 0,
  ah numeric(12, 4) not null default 0,
  af numeric(12, 4) not null default 0,
  disolucion numeric(12, 4) not null default 0,
  kg_ha_recomendado numeric(12, 3) null,
  kg_ha_palto numeric(12, 3) null,
  kg_ha_mandarina numeric(12, 3) null,
  kg_ha_naranja numeric(12, 3) null,
  activo boolean not null default true,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  constraint fertilizante_productos_unidad_chk check (unidad in ('KG', 'LT')),
  constraint fertilizante_productos_kg_ha_recomendado_chk check (kg_ha_recomendado is null or kg_ha_recomendado >= 0),
  constraint fertilizante_productos_kg_ha_palto_chk check (kg_ha_palto is null or kg_ha_palto >= 0),
  constraint fertilizante_productos_kg_ha_mandarina_chk check (kg_ha_mandarina is null or kg_ha_mandarina >= 0),
  constraint fertilizante_productos_kg_ha_naranja_chk check (kg_ha_naranja is null or kg_ha_naranja >= 0)
);

alter table if exists public.fertilizante_preparaciones
  add column if not exists producto_id uuid null references public.fertilizante_productos(id) on update cascade on delete set null,
  add column if not exists producto_unidad text null,
  add column if not exists producto_cantidad numeric(12, 3) null;

with source(nombre_comercial, nombre_normalizado, unidad, n, p, k, b, zn, mg, ca, ah, af, disolucion) as (values
  ('UREA', 'UREA', 'KG', 0.46, 0, 0, 0, 0, 0, 0, 0, 0, 0.18),
  ('ULTRASOL E 34', 'ULTRASOL E 34', 'KG', 0.34, 0, 0, 0, 0, 0, 0, 0, 0, 0.18),
  ('ULTRASOL ESPECIAL 34', 'ULTRASOL ESPECIAL 34', 'KG', 0.34, 0, 0, 0, 0, 0, 0, 0, 0, 0.18),
  ('FERPAC N22', 'FERPAC N22', 'LT', 0.22, 0, 0, 0, 0, 0, 0, 0, 0, 0.18),
  ('FERPAC FLUID 22', 'FERPAC FLUID 22', 'LT', 0.22, 0, 0, 0, 0, 0, 0, 0, 0, 0.18),
  ('ULTRASOL K ACID', 'ULTRASOL K ACID', 'KG', 0.14, 0.02, 0.44, 0, 0, 0, 0, 0, 0, 0.15),
  ('MURIATO DE POTASIO', 'MURIATO DE POTASIO', 'KG', 0, 0, 0.60, 0, 0, 0, 0, 0, 0, 0.10),
  ('SULFATO DE POTASIO', 'SULFATO DE POTASIO', 'KG', 0, 0, 0.50, 0, 0, 0, 0, 0, 0, 0.10),
  ('TIOSULFATO DE POTASIO', 'TIOSULFATO DE POTASIO', 'LT', 0, 0, 0.37, 0, 0, 0, 0, 0, 0, 0.10),
  ('SULFATO DE ZINC', 'SULFATO DE ZINC', 'KG', 0, 0, 0, 0, 0.23, 0, 0, 0, 0, 0.15),
  ('SULFATO DE MAGNESIO', 'SULFATO DE MAGNESIO', 'KG', 0, 0, 0, 0, 0, 0.17, 0, 0, 0, 0.15),
  ('ULTRASOL PROP', 'ULTRASOL PROP', 'KG', 0.12, 0.58, 0.03, 0, 0, 0, 0, 0, 0, 0.10),
  ('ULTRASOL MAP', 'ULTRASOL MAP', 'KG', 0.12, 0.61, 0, 0, 0, 0, 0, 0, 0, 0.10),
  ('ULTRASOL CALCIUM', 'ULTRASOL CALCIUM', 'KG', 0.16, 0, 0, 0, 0, 0, 0.17, 0, 0, 0.15),
  ('CALCIO SPRINT', 'CALCIO SPRINT', 'LT', 0.05, 0, 0, 0, 0, 0, 0.08, 0, 0, 0.05),
  ('BIOAMINOL', 'BIOAMINOL', 'LT', 0.05, 0.01, 0.01, 0, 0, 0, 0, 0, 0, 0.02),
  ('ACIDO FULVICO', 'ACIDO FULVICO', 'LT', 0.02, 0, 0.03, 0, 0, 0, 0, 0.26, 0.26, 0.02),
  ('HIBER HUMUS 90PS', 'HIBER HUMUS 90PS', 'KG', 0, 0, 0.03, 0, 0, 0, 0, 0.88, 0, 0.02),
  ('ACIDO BORICO', 'ACIDO BORICO', 'KG', 0, 0, 0, 0.17, 0, 0, 0, 0, 0, 0.01),
  ('ULTRASOL K ACID + PROZN', 'ULTRASOL K ACID + PROZN', 'KG', 0.14, 0.02, 0.44, 0, 0.01, 0, 0, 0, 0, 0.025)
)
insert into public.fertilizante_productos (
  nombre_comercial, nombre_normalizado, unidad, n, p, k, b, zn, mg, ca, ah, af, disolucion
)
select nombre_comercial, nombre_normalizado, unidad, n, p, k, b, zn, mg, ca, ah, af, disolucion
from source
on conflict (nombre_normalizado) do update set
  nombre_comercial = excluded.nombre_comercial,
  unidad = excluded.unidad,
  n = excluded.n,
  p = excluded.p,
  k = excluded.k,
  b = excluded.b,
  zn = excluded.zn,
  mg = excluded.mg,
  ca = excluded.ca,
  ah = excluded.ah,
  af = excluded.af,
  disolucion = excluded.disolucion,
  activo = true,
  actualizado_en = now();

alter table public.fertilizante_productos enable row level security;

drop policy if exists fertilizante_productos_lectura on public.fertilizante_productos;
create policy fertilizante_productos_lectura
  on public.fertilizante_productos
  for select
  to authenticated
  using (true);

grant select on public.fertilizante_productos to authenticated;

drop policy if exists fertilizante_productos_actualizacion on public.fertilizante_productos;
create policy fertilizante_productos_actualizacion
  on public.fertilizante_productos
  for update
  to authenticated
  using (true)
  with check (
    (kg_ha_recomendado is null or kg_ha_recomendado >= 0)
    and (kg_ha_palto is null or kg_ha_palto >= 0)
    and (kg_ha_mandarina is null or kg_ha_mandarina >= 0)
    and (kg_ha_naranja is null or kg_ha_naranja >= 0)
  );

grant update (kg_ha_recomendado, kg_ha_palto, kg_ha_mandarina, kg_ha_naranja, actualizado_en)
on public.fertilizante_productos to authenticated;

commit;

select nombre_comercial, unidad, n, p, k, b, zn, mg, ca, ah, af, disolucion,
  kg_ha_recomendado, kg_ha_palto, kg_ha_mandarina, kg_ha_naranja
from public.fertilizante_productos
order by nombre_comercial;
