-- Folio y parametros reales utilizados en cada salida de bodega.
-- Ejecutar una vez en Supabase SQL Editor antes de usar el formulario actualizado.

begin;

alter table public.despachos
  add column if not exists folio text,
  add column if not exists presion numeric(10,2),
  add column if not exists velocidad numeric(10,2),
  add column if not exists boquilla text,
  add column if not exists especificacion_boquilla text;

alter table public.orden_productos
  add column if not exists carencia_agenda_pesticidas text;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'despachos'
      and column_name = 'folio_origen'
  ) then
    execute $sql$
      update public.despachos
      set folio = folio_origen
      where nullif(trim(folio), '') is null
        and nullif(trim(folio_origen), '') is not null
    $sql$;
  end if;
end
$$;

comment on column public.despachos.folio is
  'Numero de folio de bodega asociado a la salida.';
comment on column public.despachos.presion is
  'Presion real utilizada en la salida, expresada en bar.';
comment on column public.despachos.velocidad is
  'Velocidad real de aplicacion, expresada en km/h.';
comment on column public.despachos.boquilla is
  'Modelo de boquilla utilizado en la salida.';
comment on column public.despachos.especificacion_boquilla is
  'Especificacion tecnica de la boquilla utilizada en la salida.';
comment on column public.orden_productos.carencia_agenda_pesticidas is
  'Carencia definida por Agenda Pesticidas para mostrar junto a la carencia de etiqueta.';

commit;

notify pgrst, 'reload schema';

select
  folio,
  fecha,
  codigo_tractor,
  codigo_maquina,
  presion,
  velocidad,
  boquilla,
  especificacion_boquilla
from public.despachos
order by fecha desc nulls last, folio desc nulls last
limit 20;
