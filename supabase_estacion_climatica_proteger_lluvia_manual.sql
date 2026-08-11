begin;

create or replace function public.proteger_lluvia_manual_estacion()
returns trigger
language plpgsql
as $$
begin
  if old.fuente = 'bandeja_lluvia_manual'
     and coalesce(new.fuente, '') <> 'bandeja_lluvia_manual' then
    new.precipitacion := old.precipitacion;
    new.fuente := old.fuente;
  end if;

  return new;
end;
$$;

drop trigger if exists estacion_climatica_proteger_lluvia_manual_trg
  on public.estacion_climatica;

create trigger estacion_climatica_proteger_lluvia_manual_trg
before update on public.estacion_climatica
for each row
execute function public.proteger_lluvia_manual_estacion();

comment on function public.proteger_lluvia_manual_estacion() is
  'Evita que una importacion de estacion climatica sobrescriba lluvia ingresada manualmente desde Riego > Bandeja.';

commit;
