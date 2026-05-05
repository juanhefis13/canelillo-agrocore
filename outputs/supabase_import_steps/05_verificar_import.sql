-- 05_verificar_import.sql
select 'seasons' as tabla, count(*) from public.seasons;
select 'products' as tabla, count(*) from public.products;
select 'fields' as tabla, count(*) from public.fields;
select 'programs' as tabla, count(*) from public.programs;
select 'application_orders' as tabla, count(*) from public.application_orders;
select 'application_order_products' as tabla, count(*) from public.application_order_products;
select 'dispatches' as tabla, count(*) from public.dispatches;
select 'dispatch_products' as tabla, count(*) from public.dispatch_products;
select 'stock_movements' as tabla, count(*) from public.stock_movements;