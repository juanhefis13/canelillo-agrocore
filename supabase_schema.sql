-- AgroAplicaciones - esquema base Supabase
-- Ejecutar en Supabase SQL Editor.

create extension if not exists "pgcrypto";

create type app_role as enum ('supervisor', 'bodeguero', 'aplicador', 'admin');
create type order_status as enum ('planned', 'in_progress', 'closed', 'cancelled');
create type stock_movement_type as enum ('ingreso', 'salida', 'devolucion', 'ajuste');

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  rut text,
  role app_role not null default 'bodeguero',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table seasons (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  start_year int not null,
  end_year int not null,
  status text not null default 'activa',
  created_at timestamptz not null default now()
);

create table programs (
  id uuid primary key default gen_random_uuid(),
  season_id uuid not null references seasons(id) on delete cascade,
  program_number int not null,
  name text not null,
  crop text,
  objective text,
  notes text,
  start_date date,
  end_date date,
  water_ha numeric(12,2),
  created_at timestamptz not null default now(),
  unique (season_id, program_number)
);

create table fields (
  id uuid primary key default gen_random_uuid(),
  potrero text not null,
  block text not null,
  crop text not null,
  variety text,
  hectares numeric(12,3) not null default 0,
  active boolean not null default true,
  unique (potrero, block)
);

create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  ingredient text,
  unit text not null default 'kg',
  dose_100 numeric(12,4) not null default 0,
  reentry_hours int not null default 24,
  carency_days int not null default 0,
  min_stock numeric(12,3) not null default 0,
  current_stock numeric(12,3) not null default 0,
  unit_cost numeric(14,2) not null default 0,
  sack_price numeric(14,2),
  kg_per_sack numeric(12,3),
  lot text,
  expires_on date,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table application_orders (
  id uuid primary key default gen_random_uuid(),
  season_id uuid not null references seasons(id),
  program_id uuid references programs(id),
  order_number numeric(12,2) not null,
  program_number int,
  program_numbers int[] not null default '{}',
  program_name text,
  classification text,
  date date not null,
  planned_date date not null,
  planned_end_date date,
  objective text,
  crop text,
  variety text,
  potrero text not null,
  blocks text[] not null default '{}',
  hectares numeric(12,3) not null default 0,
  water_ha numeric(12,2) not null default 0,
  pressure numeric(12,2),
  nozzle text,
  speed numeric(12,2),
  tractor_code text,
  machine_code text,
  dosifier text,
  status order_status not null default 'planned',
  finished_by_manager boolean not null default false,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  unique (season_id, order_number)
);

create table application_order_products (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references application_orders(id) on delete cascade,
  product_id uuid not null references products(id),
  program_number int,
  dose_100 numeric(12,4) not null default 0,
  product_ha_program numeric(12,4) not null default 0,
  total_program numeric(12,4) not null default 0,
  unique (order_id, product_id)
);

create table dispatches (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references application_orders(id) on delete cascade,
  type stock_movement_type not null check (type in ('salida', 'devolucion')),
  date date not null,
  liters numeric(12,2) not null default 0,
  tractor_code text,
  machine_code text,
  operator_id text,
  note text,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

create table dispatch_products (
  id uuid primary key default gen_random_uuid(),
  dispatch_id uuid not null references dispatches(id) on delete cascade,
  product_id uuid not null references products(id),
  quantity numeric(12,4) not null default 0,
  unit_cost numeric(14,2) not null default 0,
  lot text
);

create table stock_movements (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id),
  order_id uuid references application_orders(id),
  dispatch_id uuid references dispatches(id),
  type stock_movement_type not null,
  date date not null,
  quantity numeric(12,4) not null,
  unit_cost numeric(14,2) not null default 0,
  sacks numeric(12,2),
  kg_per_sack numeric(12,3),
  sack_price numeric(14,2),
  lot text,
  note text,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

create or replace function current_app_role()
returns app_role
language sql
stable
as $$
  select role from profiles where id = auth.uid()
$$;

alter table profiles enable row level security;
alter table seasons enable row level security;
alter table programs enable row level security;
alter table fields enable row level security;
alter table products enable row level security;
alter table application_orders enable row level security;
alter table application_order_products enable row level security;
alter table dispatches enable row level security;
alter table dispatch_products enable row level security;
alter table stock_movements enable row level security;

create policy "profiles own or admin" on profiles
for select using (id = auth.uid() or current_app_role() in ('admin', 'supervisor'));

create policy "profiles insert own" on profiles
for insert with check (id = auth.uid());

create policy "supervisor admin read all base" on seasons for select using (current_app_role() in ('admin', 'supervisor', 'bodeguero'));
create policy "supervisor admin write seasons" on seasons for all using (current_app_role() in ('admin', 'supervisor')) with check (current_app_role() in ('admin', 'supervisor'));

create policy "programs readable" on programs for select using (current_app_role() in ('admin', 'supervisor', 'bodeguero'));
create policy "programs supervisor write" on programs for all using (current_app_role() in ('admin', 'supervisor')) with check (current_app_role() in ('admin', 'supervisor'));

create policy "fields readable" on fields for select using (current_app_role() in ('admin', 'supervisor', 'bodeguero'));
create policy "fields supervisor write" on fields for all using (current_app_role() in ('admin', 'supervisor')) with check (current_app_role() in ('admin', 'supervisor'));

create policy "products readable by supervisor bodega" on products for select using (current_app_role() in ('admin', 'supervisor', 'bodeguero'));
create policy "products bodega write" on products for all using (current_app_role() in ('admin', 'supervisor', 'bodeguero')) with check (current_app_role() in ('admin', 'supervisor', 'bodeguero'));

create policy "orders readable by supervisor bodega" on application_orders for select using (current_app_role() in ('admin', 'supervisor', 'bodeguero'));
create policy "orders supervisor write" on application_orders for all using (current_app_role() in ('admin', 'supervisor')) with check (current_app_role() in ('admin', 'supervisor'));

create policy "order products readable" on application_order_products for select using (current_app_role() in ('admin', 'supervisor', 'bodeguero'));
create policy "order products supervisor write" on application_order_products for all using (current_app_role() in ('admin', 'supervisor')) with check (current_app_role() in ('admin', 'supervisor'));

create policy "dispatch readable by supervisor bodega" on dispatches for select using (current_app_role() in ('admin', 'supervisor', 'bodeguero'));
create policy "dispatch bodega write" on dispatches for all using (current_app_role() in ('admin', 'bodeguero')) with check (current_app_role() in ('admin', 'bodeguero'));

create policy "dispatch products readable" on dispatch_products for select using (current_app_role() in ('admin', 'supervisor', 'bodeguero'));
create policy "dispatch products bodega write" on dispatch_products for all using (current_app_role() in ('admin', 'bodeguero')) with check (current_app_role() in ('admin', 'bodeguero'));

create policy "stock readable by supervisor bodega" on stock_movements for select using (current_app_role() in ('admin', 'supervisor', 'bodeguero'));
create policy "stock bodega write" on stock_movements for all using (current_app_role() in ('admin', 'bodeguero')) with check (current_app_role() in ('admin', 'bodeguero'));
