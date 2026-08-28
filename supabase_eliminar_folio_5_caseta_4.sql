-- Elimina de forma segura el folio 5 de la Caseta 4.
-- Se detiene si no existe, si hay mas de una coincidencia o si ya fue preparado.

begin;

do $$
declare
  v_lote_id uuid;
  v_coincidencias integer;
  v_preparaciones integer;
begin
  select count(*), min(fl.id::text)::uuid
  into v_coincidencias, v_lote_id
  from public.fertilizante_lotes fl
  join public.fertilizante_casetas fc on fc.id = fl.caseta_id
  where trim(fl.folio) = '5'
    and regexp_replace(coalesce(fc.nombre, ''), '[^0-9]', '', 'g') = '4';

  if v_coincidencias = 0 then
    raise exception 'No se encontro el folio 5 en la Caseta 4';
  end if;

  if v_coincidencias > 1 then
    raise exception 'Hay % registros con folio 5 en la Caseta 4. Identifica tambien el producto antes de borrar', v_coincidencias;
  end if;

  select count(*)
  into v_preparaciones
  from public.fertilizante_preparaciones
  where lote_id = v_lote_id;

  if v_preparaciones > 0 then
    raise exception 'El folio 5 tiene % preparaciones vinculadas y no se puede borrar sin romper la trazabilidad', v_preparaciones;
  end if;

  delete from public.fertilizante_lotes
  where id = v_lote_id;
end;
$$;

commit;

