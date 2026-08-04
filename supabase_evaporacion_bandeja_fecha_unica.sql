begin;

-- Deja un solo registro por fecha, conservando el mas nuevo.
with duplicados as (
  select
    id,
    row_number() over (
      partition by fecha
      order by created_at desc nulls last, id desc
    ) as orden
  from public.evaporacion_bandeja
)
delete from public.evaporacion_bandeja e
using duplicados d
where e.id = d.id
  and d.orden > 1;

create unique index if not exists evaporacion_bandeja_fecha_uidx
  on public.evaporacion_bandeja (fecha);

drop policy if exists evaporacion_bandeja_update_auth on public.evaporacion_bandeja;
create policy evaporacion_bandeja_update_auth
on public.evaporacion_bandeja
for update
to authenticated
using (true)
with check (true);

drop policy if exists evaporacion_bandeja_delete_auth on public.evaporacion_bandeja;
create policy evaporacion_bandeja_delete_auth
on public.evaporacion_bandeja
for delete
to authenticated
using (true);

grant update on public.evaporacion_bandeja to authenticated;
grant delete on public.evaporacion_bandeja to authenticated;

commit;
