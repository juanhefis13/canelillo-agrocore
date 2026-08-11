-- Historial y auditoria de usuario para preparaciones y aplicaciones de fertilizante.
-- Ejecutar una vez en Supabase despues del modulo base de fertilizacion.

begin;

alter table public.fertilizante_preparaciones
  add column if not exists producto_id uuid null references public.fertilizante_productos(id) on update cascade on delete set null,
  add column if not exists producto_unidad text null,
  add column if not exists producto_cantidad numeric(12, 3) null,
  add column if not exists actualizado_en timestamptz not null default now(),
  add column if not exists modificado_por uuid null,
  add column if not exists modificado_por_nombre text null;

alter table public.fertilizante_aplicaciones
  add column if not exists actualizado_en timestamptz not null default now(),
  add column if not exists modificado_por uuid null,
  add column if not exists modificado_por_nombre text null;

update public.fertilizante_preparaciones
set
  creado_por = coalesce(creado_por, responsable_id),
  creado_por_nombre = coalesce(nullif(btrim(creado_por_nombre), ''), nullif(btrim(responsable_nombre), ''))
where creado_por is null
   or nullif(btrim(creado_por_nombre), '') is null;

update public.fertilizante_aplicaciones
set
  creado_por = coalesce(creado_por, responsable_id),
  creado_por_nombre = coalesce(nullif(btrim(creado_por_nombre), ''), nullif(btrim(responsable_nombre), ''))
where creado_por is null
   or nullif(btrim(creado_por_nombre), '') is null;

update public.fertilizante_preparaciones p
set creado_por_nombre = u.nombre_completo
from public.usuarios u
where p.creado_por = u.id
  and nullif(btrim(p.creado_por_nombre), '') is null;

update public.fertilizante_aplicaciones a
set creado_por_nombre = u.nombre_completo
from public.usuarios u
where a.creado_por = u.id
  and nullif(btrim(a.creado_por_nombre), '') is null;

create or replace function public.fertilizante_operacion_actualizado_en()
returns trigger
language plpgsql
as $$
begin
  new.actualizado_en = now();
  return new;
end;
$$;

drop trigger if exists fertilizante_preparaciones_actualizado_en_trg on public.fertilizante_preparaciones;
create trigger fertilizante_preparaciones_actualizado_en_trg
before update on public.fertilizante_preparaciones
for each row
execute function public.fertilizante_operacion_actualizado_en();

drop trigger if exists fertilizante_aplicaciones_actualizado_en_trg on public.fertilizante_aplicaciones;
create trigger fertilizante_aplicaciones_actualizado_en_trg
before update on public.fertilizante_aplicaciones
for each row
execute function public.fertilizante_operacion_actualizado_en();

drop policy if exists fertilizante_preparaciones_actualizacion on public.fertilizante_preparaciones;
create policy fertilizante_preparaciones_actualizacion
on public.fertilizante_preparaciones
for update
to authenticated
using (true)
with check (true);

drop policy if exists fertilizante_aplicaciones_actualizacion on public.fertilizante_aplicaciones;
create policy fertilizante_aplicaciones_actualizacion
on public.fertilizante_aplicaciones
for update
to authenticated
using (true)
with check (true);

grant select, insert, update on public.fertilizante_preparaciones to authenticated;
grant select, insert, update on public.fertilizante_aplicaciones to authenticated;

commit;
