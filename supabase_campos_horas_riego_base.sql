begin;

alter table public.campos
  add column if not exists horas_riego_base numeric(8, 2);

alter table public.campos
  drop constraint if exists campos_horas_riego_base_nonnegative;

alter table public.campos
  add constraint campos_horas_riego_base_nonnegative
  check (horas_riego_base is null or horas_riego_base >= 0);

comment on column public.campos.horas_riego_base is
  'Horas base habituales de riego por evento para el potrero/bloque. Se usa como dato maestro para programas de riego.';

notify pgrst, 'reload schema';

commit;
