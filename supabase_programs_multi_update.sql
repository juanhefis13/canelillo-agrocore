alter table public.application_orders add column if not exists program_numbers int[] not null default '{}';
update public.application_orders
set program_numbers = array[program_number]
where (program_numbers is null or cardinality(program_numbers) = 0)
  and program_number is not null;

alter table public.application_order_products add column if not exists program_number int;
update public.application_order_products aop
set program_number = ao.program_number
from public.application_orders ao
where aop.order_id = ao.id
  and aop.program_number is null;

