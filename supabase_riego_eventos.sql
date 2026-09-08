-- Eventos que afectan o impiden el riego por bloque y fecha.
-- Ejecutar una vez en Supabase SQL Editor.

begin;

create table if not exists public.riego_eventos (
  id uuid primary key default gen_random_uuid(),
  fecha date not null,
  campo_id uuid not null references public.campos(id) on delete cascade,
  potrero text not null,
  bloque text not null,
  tipo_evento text not null check (
    tipo_evento in ('matriz', 'terreno', 'bomba', 'energia', 'valvula', 'mantencion', 'otro')
  ),
  descripcion text not null check (char_length(btrim(descripcion)) between 1 and 800),
  estado text not null default 'activo' check (estado in ('activo', 'resuelto')),
  fecha_resolucion timestamptz,
  creado_por uuid,
  creado_por_nombre text,
  actualizado_por uuid,
  actualizado_por_nombre text,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

create index if not exists riego_eventos_fecha_idx
  on public.riego_eventos (fecha desc);

create index if not exists riego_eventos_campo_fecha_idx
  on public.riego_eventos (campo_id, fecha desc);

create index if not exists riego_eventos_estado_fecha_idx
  on public.riego_eventos (estado, fecha desc);

create or replace function public.set_riego_evento_actualizado()
returns trigger
language plpgsql
as $$
begin
  new.actualizado_en = now();
  return new;
end;
$$;

drop trigger if exists trg_riego_eventos_actualizado_en on public.riego_eventos;
create trigger trg_riego_eventos_actualizado_en
before update on public.riego_eventos
for each row execute function public.set_riego_evento_actualizado();

alter table public.riego_eventos enable row level security;

drop policy if exists riego_eventos_authenticated_all on public.riego_eventos;
create policy riego_eventos_authenticated_all
on public.riego_eventos
for all
to authenticated
using (true)
with check (true);

grant select, insert, update, delete on public.riego_eventos to authenticated;

commit;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'riego_eventos'
  ) then
    alter publication supabase_realtime add table public.riego_eventos;
  end if;
end;
$$;
