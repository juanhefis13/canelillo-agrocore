alter table public.dispatches add column if not exists tractor_code text;
alter table public.dispatches add column if not exists machine_code text;
alter table public.dispatches add column if not exists operator_id text;

