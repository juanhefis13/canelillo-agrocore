-- 00_preparar_import.sql
-- Ejecutar primero.
alter table public.application_orders add column if not exists classification text;
alter table public.application_orders alter column order_number type numeric(12,2) using order_number::numeric;
alter table public.application_orders drop constraint if exists application_orders_classification_check;
alter table public.application_orders add constraint application_orders_classification_check check (classification is null or classification in ('N','P','VR','ME','VD','M'));
delete from public.stock_movements where note like 'Importado Excel%';
delete from public.dispatches where note like 'Importado Excel%';