alter table public.programs add column if not exists start_date date;
alter table public.programs add column if not exists end_date date;
alter table public.programs add column if not exists water_ha numeric(12,2);

alter table public.application_orders add column if not exists finished_by_manager boolean not null default false;
alter table public.application_orders add column if not exists planned_end_date date;
update public.application_orders
set planned_end_date = planned_date
where planned_end_date is null;
