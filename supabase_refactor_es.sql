-- Refactor de nombres Supabase/PostgreSQL a español.
-- Ejecutar una sola vez en Supabase SQL Editor.
-- No borra datos: renombra tablas/columnas y convierte enums conservando relaciones.

begin;

-- 1) Eliminar politicas RLS antiguas que dependen de tablas/tipos/funciones a renombrar.
drop policy if exists "profiles own or admin" on public.profiles;
drop policy if exists "profiles insert own" on public.profiles;
drop policy if exists "profiles select own or manager" on public.profiles;
drop policy if exists "profiles update own or admin" on public.profiles;
drop policy if exists "profiles select own" on public.profiles;
drop policy if exists "profiles update own" on public.profiles;

drop policy if exists "supervisor admin read all base" on public.seasons;
drop policy if exists "supervisor admin write seasons" on public.seasons;
drop policy if exists "seasons read roles" on public.seasons;
drop policy if exists "seasons supervisor write" on public.seasons;

drop policy if exists "programs readable" on public.programs;
drop policy if exists "programs supervisor write" on public.programs;
drop policy if exists "programs read roles" on public.programs;

drop policy if exists "fields readable" on public.fields;
drop policy if exists "fields supervisor write" on public.fields;
drop policy if exists "fields read roles" on public.fields;

drop policy if exists "products readable by supervisor bodega" on public.products;
drop policy if exists "products bodega write" on public.products;
drop policy if exists "products read roles" on public.products;

drop policy if exists "orders readable by supervisor bodega" on public.application_orders;
drop policy if exists "orders supervisor write" on public.application_orders;
drop policy if exists "orders read roles" on public.application_orders;

drop policy if exists "order products readable" on public.application_order_products;
drop policy if exists "order products supervisor write" on public.application_order_products;
drop policy if exists "order products read roles" on public.application_order_products;

drop policy if exists "dispatch readable by supervisor bodega" on public.dispatches;
drop policy if exists "dispatch bodega write" on public.dispatches;
drop policy if exists "dispatch read roles" on public.dispatches;

drop policy if exists "dispatch products readable" on public.dispatch_products;
drop policy if exists "dispatch products bodega write" on public.dispatch_products;
drop policy if exists "dispatch products read roles" on public.dispatch_products;

drop policy if exists "stock readable by supervisor bodega" on public.stock_movements;
drop policy if exists "stock bodega write" on public.stock_movements;
drop policy if exists "stock movements read roles" on public.stock_movements;
drop policy if exists "stock movements bodega write" on public.stock_movements;

drop function if exists public.current_app_role();

-- Compatibilidad con columnas agregadas durante el desarrollo de la app.
alter table public.programs add column if not exists start_date date;
alter table public.programs add column if not exists end_date date;
alter table public.programs add column if not exists water_ha numeric(12,2);

alter table public.application_orders add column if not exists classification text;
alter table public.application_orders add column if not exists program_numbers int[] not null default '{}';
alter table public.application_orders add column if not exists planned_end_date date;
alter table public.application_orders add column if not exists finished_by_manager boolean not null default false;
update public.application_orders
set program_numbers = array[program_number]
where (program_numbers is null or cardinality(program_numbers) = 0)
  and program_number is not null;
update public.application_orders
set planned_end_date = planned_date
where planned_end_date is null;

alter table public.application_order_products add column if not exists program_number int;
update public.application_order_products aop
set program_number = ao.program_number
from public.application_orders ao
where aop.order_id = ao.id
  and aop.program_number is null;

alter table public.dispatches add column if not exists tractor_code text;
alter table public.dispatches add column if not exists machine_code text;
alter table public.dispatches add column if not exists operator_id text;

-- 2) Convertir enums con valores finales en español.
do $$
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public' and t.typname = 'estado_orden'
  ) then
    create type public.estado_orden as enum ('planificada', 'en_proceso', 'completada', 'cancelada');
  end if;
end $$;

do $$
begin
  if exists (
    select 1
    from unnest(array['planificada', 'en_proceso', 'completada', 'cancelada']) as required(value)
    where not exists (
      select 1
      from pg_enum e
      join pg_type t on t.oid = e.enumtypid
      join pg_namespace n on n.oid = t.typnamespace
      where n.nspname = 'public'
        and t.typname = 'estado_orden'
        and e.enumlabel = required.value
    )
  ) then
    raise exception 'El enum public.estado_orden existe, pero no contiene todos los valores esperados.';
  end if;
end $$;

alter table public.application_orders
alter column status drop default,
alter column status type public.estado_orden
using case status::text
  when 'planned' then 'planificada'::public.estado_orden
  when 'in_progress' then 'en_proceso'::public.estado_orden
  when 'closed' then 'completada'::public.estado_orden
  when 'completed' then 'completada'::public.estado_orden
  when 'cancelled' then 'cancelada'::public.estado_orden
  else 'planificada'::public.estado_orden
end,
alter column status set default 'planificada';

drop type if exists public.order_status;

do $$
begin
  if exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public' and t.typname = 'stock_movement_type'
  ) and not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public' and t.typname = 'tipo_movimiento_stock'
  ) then
    alter type public.stock_movement_type rename to tipo_movimiento_stock;
  elsif not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public' and t.typname = 'tipo_movimiento_stock'
  ) then
    create type public.tipo_movimiento_stock as enum ('ingreso', 'salida', 'devolucion', 'ajuste');
  end if;
end $$;

do $$
begin
  if exists (
    select 1
    from unnest(array['ingreso', 'salida', 'devolucion', 'ajuste']) as required(value)
    where not exists (
      select 1
      from pg_enum e
      join pg_type t on t.oid = e.enumtypid
      join pg_namespace n on n.oid = t.typnamespace
      where n.nspname = 'public'
        and t.typname = 'tipo_movimiento_stock'
        and e.enumlabel = required.value
    )
  ) then
    raise exception 'El enum public.tipo_movimiento_stock existe, pero no contiene todos los valores esperados.';
  end if;
end $$;

alter table public.dispatches
alter column type type public.tipo_movimiento_stock
using type::text::public.tipo_movimiento_stock;

alter table public.stock_movements
alter column type type public.tipo_movimiento_stock
using type::text::public.tipo_movimiento_stock;

drop type if exists public.stock_movement_type;

do $$
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public' and t.typname = 'rol_usuario'
  ) then
    create type public.rol_usuario as enum ('admin', 'supervisor', 'bodeguero');
  end if;
end $$;

do $$
begin
  if exists (
    select 1
    from unnest(array['admin', 'supervisor', 'bodeguero']) as required(value)
    where not exists (
      select 1
      from pg_enum e
      join pg_type t on t.oid = e.enumtypid
      join pg_namespace n on n.oid = t.typnamespace
      where n.nspname = 'public'
        and t.typname = 'rol_usuario'
        and e.enumlabel = required.value
    )
  ) then
    raise exception 'El enum public.rol_usuario existe, pero no contiene todos los valores esperados.';
  end if;
end $$;

alter table public.profiles
alter column role drop default,
alter column role type public.rol_usuario
using case role::text
  when 'admin' then 'admin'::public.rol_usuario
  when 'supervisor' then 'supervisor'::public.rol_usuario
  when 'bodeguero' then 'bodeguero'::public.rol_usuario
  when 'aplicador' then 'bodeguero'::public.rol_usuario
  else 'bodeguero'::public.rol_usuario
end,
alter column role set default 'bodeguero';

drop type if exists public.app_role;

-- 3) Renombrar tablas.
alter table if exists public.profiles rename to usuarios;
alter table if exists public.seasons rename to temporadas;
alter table if exists public.programs rename to programas;
alter table if exists public.fields rename to campos;
alter table if exists public.products rename to productos;
alter table if exists public.application_orders rename to ordenes_aplicacion;
alter table if exists public.application_order_products rename to orden_productos;
alter table if exists public.dispatches rename to despachos;
alter table if exists public.dispatch_products rename to despacho_productos;
alter table if exists public.stock_movements rename to movimientos_stock;

-- 4) Renombrar columnas.
alter table public.usuarios
  rename column full_name to nombre_completo;
alter table public.usuarios
  rename column role to rol;
alter table public.usuarios
  rename column active to activo;
alter table public.usuarios
  rename column created_at to creado_en;

alter table public.temporadas
  rename column name to nombre;
alter table public.temporadas
  rename column start_year to anio_inicio;
alter table public.temporadas
  rename column end_year to anio_fin;
alter table public.temporadas
  rename column status to estado;
alter table public.temporadas
  rename column created_at to creado_en;

alter table public.programas
  rename column season_id to temporada_id;
alter table public.programas
  rename column program_number to numero_programa;
alter table public.programas
  rename column name to nombre;
alter table public.programas
  rename column crop to cultivo;
alter table public.programas
  rename column objective to objetivo;
alter table public.programas
  rename column notes to notas;
alter table public.programas
  rename column start_date to fecha_inicio;
alter table public.programas
  rename column end_date to fecha_termino;
alter table public.programas
  rename column water_ha to agua_por_ha;
alter table public.programas
  rename column created_at to creado_en;

alter table public.campos
  rename column block to bloque;
alter table public.campos
  rename column crop to cultivo;
alter table public.campos
  rename column variety to variedad;
alter table public.campos
  rename column hectares to hectareas;
alter table public.campos
  rename column active to activo;

alter table public.productos
  rename column name to nombre;
alter table public.productos
  rename column ingredient to ingrediente_activo;
alter table public.productos
  rename column unit to unidad;
alter table public.productos
  rename column dose_100 to dosis_por_100;
alter table public.productos
  rename column reentry_hours to horas_reingreso;
alter table public.productos
  rename column carency_days to dias_carencia;
alter table public.productos
  rename column min_stock to stock_minimo;
alter table public.productos
  rename column current_stock to stock_actual;
alter table public.productos
  rename column unit_cost to costo_unitario;
alter table public.productos
  rename column sack_price to precio_saco;
alter table public.productos
  rename column kg_per_sack to kg_por_saco;
alter table public.productos
  rename column lot to lote;
alter table public.productos
  rename column expires_on to fecha_vencimiento;
alter table public.productos
  rename column active to activo;
alter table public.productos
  rename column created_at to creado_en;

alter table public.ordenes_aplicacion
  rename column season_id to temporada_id;
alter table public.ordenes_aplicacion
  rename column program_id to programa_id;
alter table public.ordenes_aplicacion
  rename column order_number to numero_orden;
alter table public.ordenes_aplicacion
  rename column program_number to numero_programa;
alter table public.ordenes_aplicacion
  rename column program_name to nombre_programa;
alter table public.ordenes_aplicacion
  rename column date to fecha;
alter table public.ordenes_aplicacion
  rename column planned_date to fecha_planificada;
alter table public.ordenes_aplicacion
  rename column planned_end_date to fecha_fin_planificada;
alter table public.ordenes_aplicacion
  rename column objective to objetivo;
alter table public.ordenes_aplicacion
  rename column crop to cultivo;
alter table public.ordenes_aplicacion
  rename column variety to variedad;
alter table public.ordenes_aplicacion
  rename column blocks to bloques;
alter table public.ordenes_aplicacion
  rename column hectares to hectareas;
alter table public.ordenes_aplicacion
  rename column water_ha to agua_por_ha;
alter table public.ordenes_aplicacion
  rename column pressure to presion;
alter table public.ordenes_aplicacion
  rename column nozzle to boquilla;
alter table public.ordenes_aplicacion
  rename column speed to velocidad;
alter table public.ordenes_aplicacion
  rename column tractor_code to codigo_tractor;
alter table public.ordenes_aplicacion
  rename column machine_code to codigo_maquina;
alter table public.ordenes_aplicacion
  rename column dosifier to dosificador;
alter table public.ordenes_aplicacion
  rename column status to estado;
alter table public.ordenes_aplicacion
  rename column created_by to creado_por;
alter table public.ordenes_aplicacion
  rename column created_at to creado_en;
alter table public.ordenes_aplicacion
  rename column classification to clasificacion;
alter table public.ordenes_aplicacion
  rename column program_numbers to numeros_programa;
alter table public.ordenes_aplicacion
  rename column finished_by_manager to finalizada_por_jefe;

alter table public.orden_productos
  rename column order_id to orden_id;
alter table public.orden_productos
  rename column product_id to producto_id;
alter table public.orden_productos
  rename column dose_100 to dosis_por_100;
alter table public.orden_productos
  rename column product_ha_program to producto_por_ha_programa;
alter table public.orden_productos
  rename column total_program to total_programa;
alter table public.orden_productos
  rename column program_number to numero_programa;

alter table public.despachos
  rename column order_id to orden_id;
alter table public.despachos
  rename column type to tipo;
alter table public.despachos
  rename column date to fecha;
alter table public.despachos
  rename column liters to litros;
alter table public.despachos
  rename column tractor_code to codigo_tractor;
alter table public.despachos
  rename column machine_code to codigo_maquina;
alter table public.despachos
  rename column operator_id to aplicador_id;
alter table public.despachos
  rename column note to nota;
alter table public.despachos
  rename column created_by to creado_por;
alter table public.despachos
  rename column created_at to creado_en;

alter table public.despacho_productos
  rename column dispatch_id to despacho_id;
alter table public.despacho_productos
  rename column product_id to producto_id;
alter table public.despacho_productos
  rename column quantity to cantidad;
alter table public.despacho_productos
  rename column unit_cost to costo_unitario;
alter table public.despacho_productos
  rename column lot to lote;

alter table public.movimientos_stock
  rename column product_id to producto_id;
alter table public.movimientos_stock
  rename column order_id to orden_id;
alter table public.movimientos_stock
  rename column dispatch_id to despacho_id;
alter table public.movimientos_stock
  rename column type to tipo;
alter table public.movimientos_stock
  rename column date to fecha;
alter table public.movimientos_stock
  rename column quantity to cantidad;
alter table public.movimientos_stock
  rename column unit_cost to costo_unitario;
alter table public.movimientos_stock
  rename column sacks to sacos;
alter table public.movimientos_stock
  rename column kg_per_sack to kg_por_saco;
alter table public.movimientos_stock
  rename column sack_price to precio_saco;
alter table public.movimientos_stock
  rename column lot to lote;
alter table public.movimientos_stock
  rename column note to nota;
alter table public.movimientos_stock
  rename column created_by to creado_por;
alter table public.movimientos_stock
  rename column created_at to creado_en;

-- 5) Renombrar constraints principales para que coincidan con el nuevo modelo.
do $$
declare
  r record;
begin
  for r in
    select * from (values
      ('usuarios', 'profiles_pkey', 'usuarios_pkey'),
      ('usuarios', 'profiles_id_fkey', 'usuarios_id_auth_users_fkey'),
      ('temporadas', 'seasons_pkey', 'temporadas_pkey'),
      ('temporadas', 'seasons_name_key', 'temporadas_nombre_key'),
      ('programas', 'programs_pkey', 'programas_pkey'),
      ('programas', 'programs_season_id_program_number_key', 'programas_temporada_id_numero_programa_key'),
      ('programas', 'programs_season_id_fkey', 'programas_temporada_id_fkey'),
      ('campos', 'fields_pkey', 'campos_pkey'),
      ('campos', 'fields_potrero_block_key', 'campos_potrero_bloque_key'),
      ('productos', 'products_pkey', 'productos_pkey'),
      ('productos', 'products_name_key', 'productos_nombre_key'),
      ('ordenes_aplicacion', 'application_orders_pkey', 'ordenes_aplicacion_pkey'),
      ('ordenes_aplicacion', 'application_orders_season_id_order_number_key', 'ordenes_aplicacion_temporada_id_numero_orden_key'),
      ('ordenes_aplicacion', 'application_orders_season_id_fkey', 'ordenes_aplicacion_temporada_id_fkey'),
      ('ordenes_aplicacion', 'application_orders_program_id_fkey', 'ordenes_aplicacion_programa_id_fkey'),
      ('ordenes_aplicacion', 'application_orders_created_by_fkey', 'ordenes_aplicacion_creado_por_fkey'),
      ('ordenes_aplicacion', 'application_orders_classification_check', 'ordenes_aplicacion_clasificacion_check'),
      ('orden_productos', 'application_order_products_pkey', 'orden_productos_pkey'),
      ('orden_productos', 'application_order_products_order_id_product_id_key', 'orden_productos_orden_id_producto_id_key'),
      ('orden_productos', 'application_order_products_order_id_fkey', 'orden_productos_orden_id_fkey'),
      ('orden_productos', 'application_order_products_product_id_fkey', 'orden_productos_producto_id_fkey'),
      ('despachos', 'dispatches_pkey', 'despachos_pkey'),
      ('despachos', 'dispatches_order_id_fkey', 'despachos_orden_id_fkey'),
      ('despachos', 'dispatches_created_by_fkey', 'despachos_creado_por_fkey'),
      ('despachos', 'dispatches_type_check', 'despachos_tipo_check'),
      ('despacho_productos', 'dispatch_products_pkey', 'despacho_productos_pkey'),
      ('despacho_productos', 'dispatch_products_dispatch_id_fkey', 'despacho_productos_despacho_id_fkey'),
      ('despacho_productos', 'dispatch_products_product_id_fkey', 'despacho_productos_producto_id_fkey'),
      ('movimientos_stock', 'stock_movements_pkey', 'movimientos_stock_pkey'),
      ('movimientos_stock', 'stock_movements_product_id_fkey', 'movimientos_stock_producto_id_fkey'),
      ('movimientos_stock', 'stock_movements_order_id_fkey', 'movimientos_stock_orden_id_fkey'),
      ('movimientos_stock', 'stock_movements_dispatch_id_fkey', 'movimientos_stock_despacho_id_fkey'),
      ('movimientos_stock', 'stock_movements_created_by_fkey', 'movimientos_stock_creado_por_fkey')
    ) as t(tabla, anterior, nuevo)
  loop
    if exists (
      select 1 from pg_constraint c
      join pg_class rel on rel.oid = c.conrelid
      join pg_namespace n on n.oid = rel.relnamespace
      where n.nspname = 'public' and rel.relname = r.tabla and c.conname = r.anterior
    ) then
      execute format('alter table public.%I rename constraint %I to %I', r.tabla, r.anterior, r.nuevo);
    end if;
  end loop;
end $$;

-- 6) Reaplicar checks con nombres nuevos donde corresponde.
alter table public.ordenes_aplicacion
drop constraint if exists ordenes_aplicacion_clasificacion_check;

alter table public.ordenes_aplicacion
add constraint ordenes_aplicacion_clasificacion_check
check (
  clasificacion is null
  or clasificacion in ('N', 'P', 'VR', 'ME', 'VD', 'M')
);

alter table public.orden_productos
drop constraint if exists orden_productos_orden_id_producto_id_key;

alter table public.orden_productos
add constraint orden_productos_orden_id_producto_id_numero_programa_key
unique (orden_id, producto_id, numero_programa);

alter table public.despachos
drop constraint if exists despachos_tipo_check;

alter table public.despachos
add constraint despachos_tipo_check
check (tipo in ('salida', 'devolucion'));

-- 7) Funcion de rol y politicas RLS con nombres finales.
create or replace function public.current_app_role()
returns public.rol_usuario
language plpgsql
security definer
set search_path = public
set row_security = off
stable
as $$
declare
  user_role public.rol_usuario;
begin
  select u.rol
    into user_role
  from public.usuarios u
  where u.id = auth.uid()
  limit 1;

  return user_role;
end;
$$;

grant execute on function public.current_app_role() to authenticated;
grant execute on function public.current_app_role() to anon;

alter table public.usuarios enable row level security;
alter table public.temporadas enable row level security;
alter table public.programas enable row level security;
alter table public.campos enable row level security;
alter table public.productos enable row level security;
alter table public.ordenes_aplicacion enable row level security;
alter table public.orden_productos enable row level security;
alter table public.despachos enable row level security;
alter table public.despacho_productos enable row level security;
alter table public.movimientos_stock enable row level security;

create policy "usuarios select own"
on public.usuarios for select
using (id = auth.uid());

create policy "usuarios insert own"
on public.usuarios for insert
with check (id = auth.uid());

create policy "usuarios update own"
on public.usuarios for update
using (id = auth.uid())
with check (id = auth.uid());

create policy "temporadas read roles" on public.temporadas
for select using (public.current_app_role() in ('admin', 'supervisor', 'bodeguero'));

create policy "temporadas supervisor write" on public.temporadas
for all using (public.current_app_role() in ('admin', 'supervisor'))
with check (public.current_app_role() in ('admin', 'supervisor'));

create policy "programas read roles" on public.programas
for select using (public.current_app_role() in ('admin', 'supervisor', 'bodeguero'));

create policy "programas supervisor write" on public.programas
for all using (public.current_app_role() in ('admin', 'supervisor'))
with check (public.current_app_role() in ('admin', 'supervisor'));

create policy "campos read roles" on public.campos
for select using (public.current_app_role() in ('admin', 'supervisor', 'bodeguero'));

create policy "campos supervisor write" on public.campos
for all using (public.current_app_role() in ('admin', 'supervisor'))
with check (public.current_app_role() in ('admin', 'supervisor'));

create policy "productos read roles" on public.productos
for select using (public.current_app_role() in ('admin', 'supervisor', 'bodeguero'));

create policy "productos bodega write" on public.productos
for all using (public.current_app_role() in ('admin', 'supervisor', 'bodeguero'))
with check (public.current_app_role() in ('admin', 'supervisor', 'bodeguero'));

create policy "ordenes read roles" on public.ordenes_aplicacion
for select using (public.current_app_role() in ('admin', 'supervisor', 'bodeguero'));

create policy "ordenes supervisor write" on public.ordenes_aplicacion
for all using (public.current_app_role() in ('admin', 'supervisor'))
with check (public.current_app_role() in ('admin', 'supervisor'));

create policy "ordenes bodega sync estado" on public.ordenes_aplicacion
for update using (public.current_app_role() in ('admin', 'bodeguero'))
with check (public.current_app_role() in ('admin', 'bodeguero'));

create policy "orden productos read roles" on public.orden_productos
for select using (public.current_app_role() in ('admin', 'supervisor', 'bodeguero'));

create policy "orden productos supervisor write" on public.orden_productos
for all using (public.current_app_role() in ('admin', 'supervisor'))
with check (public.current_app_role() in ('admin', 'supervisor'));

create policy "despachos read roles" on public.despachos
for select using (public.current_app_role() in ('admin', 'supervisor', 'bodeguero'));

create policy "despachos bodega write" on public.despachos
for all using (public.current_app_role() in ('admin', 'supervisor', 'bodeguero'))
with check (public.current_app_role() in ('admin', 'supervisor', 'bodeguero'));

create policy "despacho productos read roles" on public.despacho_productos
for select using (public.current_app_role() in ('admin', 'supervisor', 'bodeguero'));

create policy "despacho productos bodega write" on public.despacho_productos
for all using (public.current_app_role() in ('admin', 'supervisor', 'bodeguero'))
with check (public.current_app_role() in ('admin', 'supervisor', 'bodeguero'));

create policy "movimientos stock read roles" on public.movimientos_stock
for select using (public.current_app_role() in ('admin', 'supervisor', 'bodeguero'));

create policy "movimientos stock bodega write" on public.movimientos_stock
for all using (public.current_app_role() in ('admin', 'supervisor', 'bodeguero'))
with check (public.current_app_role() in ('admin', 'supervisor', 'bodeguero'));

commit;
