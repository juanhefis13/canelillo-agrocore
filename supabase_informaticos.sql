begin;

create extension if not exists pgcrypto;

create table if not exists public.informaticos_personas (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid null references auth.users(id) on delete set null,
  nombre text not null,
  activo boolean not null default true,
  creado_por uuid null references auth.users(id) on delete set null,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  constraint informaticos_personas_nombre_chk check (length(btrim(nombre)) >= 3)
);

create unique index if not exists informaticos_personas_nombre_uidx
  on public.informaticos_personas (lower(btrim(nombre)));

create table if not exists public.informaticos_labores (
  id uuid primary key default gen_random_uuid(),
  informatico_id uuid not null references public.informaticos_personas(id) on delete restrict,
  labor text not null,
  estado text not null default 'pendiente',
  fecha_inicio date not null,
  fecha_resuelta date null,
  creado_por uuid null references auth.users(id) on delete set null,
  creado_por_nombre text null,
  creado_en timestamptz not null default now(),
  actualizado_por uuid null references auth.users(id) on delete set null,
  actualizado_por_nombre text null,
  actualizado_en timestamptz not null default now(),
  constraint informaticos_labores_labor_chk check (length(btrim(labor)) >= 3),
  constraint informaticos_labores_estado_chk check (estado in ('pendiente', 'resuelta')),
  constraint informaticos_labores_fecha_resuelta_chk check (
    (estado = 'pendiente' and fecha_resuelta is null)
    or (estado = 'resuelta' and fecha_resuelta is not null and fecha_resuelta >= fecha_inicio)
  )
);

create index if not exists informaticos_labores_informatico_idx
  on public.informaticos_labores (informatico_id, estado, fecha_inicio desc);

create table if not exists public.informaticos_labor_registros (
  id uuid primary key default gen_random_uuid(),
  labor_id uuid not null references public.informaticos_labores(id) on delete cascade,
  fecha date not null,
  hora_inicio time not null,
  hora_fin time not null,
  detalle text null,
  creado_por uuid null references auth.users(id) on delete set null,
  creado_por_nombre text null,
  creado_en timestamptz not null default now(),
  actualizado_por uuid null references auth.users(id) on delete set null,
  actualizado_por_nombre text null,
  actualizado_en timestamptz not null default now(),
  constraint informaticos_labor_registros_horas_chk check (hora_fin > hora_inicio)
);

create index if not exists informaticos_labor_registros_fecha_idx
  on public.informaticos_labor_registros (fecha desc, hora_inicio asc);

create index if not exists informaticos_labor_registros_labor_idx
  on public.informaticos_labor_registros (labor_id, fecha asc, hora_inicio asc);

create or replace function public.informaticos_crear_labor(
  p_informatico_id uuid,
  p_labor text,
  p_fecha date,
  p_hora_inicio time,
  p_hora_fin time,
  p_detalle text,
  p_estado text,
  p_usuario_nombre text
)
returns jsonb
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_labor_id uuid;
  v_registro_id uuid;
  v_estado text := case when p_estado = 'resuelta' then 'resuelta' else 'pendiente' end;
begin
  if p_hora_fin <= p_hora_inicio then
    raise exception 'La hora de término debe ser posterior a la hora de inicio';
  end if;

  insert into public.informaticos_labores (
    informatico_id, labor, estado, fecha_inicio, fecha_resuelta,
    creado_por, creado_por_nombre, actualizado_por, actualizado_por_nombre
  ) values (
    p_informatico_id, btrim(p_labor), v_estado, p_fecha,
    case when v_estado = 'resuelta' then p_fecha else null end,
    auth.uid(), nullif(btrim(p_usuario_nombre), ''), auth.uid(), nullif(btrim(p_usuario_nombre), '')
  ) returning id into v_labor_id;

  insert into public.informaticos_labor_registros (
    labor_id, fecha, hora_inicio, hora_fin, detalle,
    creado_por, creado_por_nombre, actualizado_por, actualizado_por_nombre
  ) values (
    v_labor_id, p_fecha, p_hora_inicio, p_hora_fin, nullif(btrim(p_detalle), ''),
    auth.uid(), nullif(btrim(p_usuario_nombre), ''), auth.uid(), nullif(btrim(p_usuario_nombre), '')
  ) returning id into v_registro_id;

  return jsonb_build_object('labor_id', v_labor_id, 'registro_id', v_registro_id);
end;
$$;

create or replace function public.informaticos_agregar_jornada(
  p_labor_id uuid,
  p_fecha date,
  p_hora_inicio time,
  p_hora_fin time,
  p_detalle text,
  p_estado text,
  p_usuario_nombre text
)
returns uuid
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_registro_id uuid;
  v_estado text := case when p_estado = 'resuelta' then 'resuelta' else 'pendiente' end;
  v_fecha_inicio date;
  v_ultima_fecha date;
begin
  if p_hora_fin <= p_hora_inicio then
    raise exception 'La hora de término debe ser posterior a la hora de inicio';
  end if;

  select fecha_inicio
  into v_fecha_inicio
  from public.informaticos_labores
  where id = p_labor_id
  for update;

  if not found then
    raise exception 'La labor informática indicada no existe';
  end if;

  select max(fecha)
  into v_ultima_fecha
  from public.informaticos_labor_registros
  where labor_id = p_labor_id;

  if v_estado = 'resuelta' and v_ultima_fecha is not null and p_fecha < v_ultima_fecha then
    raise exception 'La fecha de término no puede ser anterior al último avance registrado';
  end if;

  insert into public.informaticos_labor_registros (
    labor_id, fecha, hora_inicio, hora_fin, detalle,
    creado_por, creado_por_nombre, actualizado_por, actualizado_por_nombre
  ) values (
    p_labor_id, p_fecha, p_hora_inicio, p_hora_fin, nullif(btrim(p_detalle), ''),
    auth.uid(), nullif(btrim(p_usuario_nombre), ''), auth.uid(), nullif(btrim(p_usuario_nombre), '')
  ) returning id into v_registro_id;

  update public.informaticos_labores
  set estado = v_estado,
      fecha_inicio = least(v_fecha_inicio, p_fecha),
      fecha_resuelta = case when v_estado = 'resuelta' then p_fecha else null end,
      actualizado_por = auth.uid(),
      actualizado_por_nombre = nullif(btrim(p_usuario_nombre), '')
  where id = p_labor_id;

  return v_registro_id;
end;
$$;

create or replace function public.informaticos_set_actualizado_en()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.actualizado_en = now();
  return new;
end;
$$;

drop trigger if exists informaticos_personas_actualizado_en on public.informaticos_personas;
create trigger informaticos_personas_actualizado_en
before update on public.informaticos_personas
for each row execute function public.informaticos_set_actualizado_en();

drop trigger if exists informaticos_labores_actualizado_en on public.informaticos_labores;
create trigger informaticos_labores_actualizado_en
before update on public.informaticos_labores
for each row execute function public.informaticos_set_actualizado_en();

drop trigger if exists informaticos_labor_registros_actualizado_en on public.informaticos_labor_registros;
create trigger informaticos_labor_registros_actualizado_en
before update on public.informaticos_labor_registros
for each row execute function public.informaticos_set_actualizado_en();

alter table public.informaticos_personas enable row level security;
alter table public.informaticos_labores enable row level security;
alter table public.informaticos_labor_registros enable row level security;

drop policy if exists informaticos_personas_lectura on public.informaticos_personas;
create policy informaticos_personas_lectura
on public.informaticos_personas for select
to authenticated
using (true);

drop policy if exists informaticos_personas_gestion on public.informaticos_personas;
create policy informaticos_personas_gestion
on public.informaticos_personas for all
to authenticated
using (
  exists (
    select 1 from public.usuarios u
    where u.id = auth.uid() and lower(coalesce(u.rol::text, '')) in ('admin', 'supervisor')
  )
)
with check (
  exists (
    select 1 from public.usuarios u
    where u.id = auth.uid() and lower(coalesce(u.rol::text, '')) in ('admin', 'supervisor')
  )
);

drop policy if exists informaticos_labores_lectura on public.informaticos_labores;
create policy informaticos_labores_lectura
on public.informaticos_labores for select
to authenticated
using (true);

drop policy if exists informaticos_labores_escritura on public.informaticos_labores;
create policy informaticos_labores_escritura
on public.informaticos_labores for insert
to authenticated
with check (creado_por = auth.uid());

drop policy if exists informaticos_labores_actualizacion on public.informaticos_labores;
create policy informaticos_labores_actualizacion
on public.informaticos_labores for update
to authenticated
using (true)
with check (actualizado_por = auth.uid());

drop policy if exists informaticos_registros_lectura on public.informaticos_labor_registros;
create policy informaticos_registros_lectura
on public.informaticos_labor_registros for select
to authenticated
using (true);

drop policy if exists informaticos_registros_escritura on public.informaticos_labor_registros;
create policy informaticos_registros_escritura
on public.informaticos_labor_registros for insert
to authenticated
with check (creado_por = auth.uid());

drop policy if exists informaticos_registros_actualizacion on public.informaticos_labor_registros;
create policy informaticos_registros_actualizacion
on public.informaticos_labor_registros for update
to authenticated
using (true)
with check (actualizado_por = auth.uid());

grant select, insert, update on public.informaticos_labores to authenticated;
grant select, insert, update on public.informaticos_labor_registros to authenticated;
grant select, insert, update, delete on public.informaticos_personas to authenticated;
grant execute on function public.informaticos_crear_labor(uuid, text, date, time, time, text, text, text) to authenticated;
grant execute on function public.informaticos_agregar_jornada(uuid, date, time, time, text, text, text) to authenticated;

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'informaticos_personas'
    ) then
      alter publication supabase_realtime add table public.informaticos_personas;
    end if;
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'informaticos_labores'
    ) then
      alter publication supabase_realtime add table public.informaticos_labores;
    end if;
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'informaticos_labor_registros'
    ) then
      alter publication supabase_realtime add table public.informaticos_labor_registros;
    end if;
  end if;
end;
$$;

commit;

-- Después de ejecutar este archivo, agrega el catálogo inicial desde AgroCore:
-- Informáticos > Administrar informáticos.
