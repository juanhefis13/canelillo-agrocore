begin;

create table if not exists public.estacion_climatica (
  id bigint generated always as identity primary key,
  fecha date not null,
  hora time without time zone not null,
  temp_out numeric(5, 2) not null,
  hi_temp numeric(5, 2) not null,
  low_temp numeric(5, 2) not null,
  fuente text not null default 'estacion_canelillo',
  creado_en timestamptz not null default now(),
  constraint estacion_climatica_fecha_hora_key unique (fecha, hora)
);

create index if not exists estacion_climatica_fecha_idx
  on public.estacion_climatica (fecha desc, hora desc);

comment on table public.estacion_climatica is
  'Lecturas cada 15 minutos de la estacion climatica de Agricola El Canelillo.';
comment on column public.estacion_climatica.temp_out is 'Temperatura exterior medida en grados Celsius.';
comment on column public.estacion_climatica.hi_temp is 'Temperatura maxima registrada en el intervalo.';
comment on column public.estacion_climatica.low_temp is 'Temperatura minima registrada en el intervalo.';

create or replace view public.v_estacion_climatica_diaria
with (security_invoker = true)
as
select
  fecha,
  count(*)::integer as registros,
  round(avg(temp_out), 2) as temperatura_promedio,
  min(low_temp) as temperatura_minima,
  max(hi_temp) as temperatura_maxima,
  round((count(*) filter (where temp_out > 7) * 0.25)::numeric, 2) as horas_sobre_7,
  round((sum(greatest(temp_out - 7, 0)) * 0.25 / 24)::numeric, 3) as grados_dia_base_7,
  round((count(*) filter (where temp_out <= 0 and temp_out > -1) * 0.25)::numeric, 2) as helada_0_menos_1,
  round((count(*) filter (where temp_out <= -1 and temp_out > -2) * 0.25)::numeric, 2) as helada_menos_1_menos_2,
  round((count(*) filter (where temp_out <= -2) * 0.25)::numeric, 2) as helada_menor_igual_menos_2
from public.estacion_climatica
group by fecha;

alter table public.estacion_climatica enable row level security;

drop policy if exists estacion_climatica_lectura on public.estacion_climatica;
create policy estacion_climatica_lectura
  on public.estacion_climatica
  for select
  to authenticated
  using (true);

drop policy if exists estacion_climatica_admin on public.estacion_climatica;
create policy estacion_climatica_admin
  on public.estacion_climatica
  for all
  to authenticated
  using (
    exists (
      select 1
      from public.usuarios
      where usuarios.id = auth.uid()
        and lower(coalesce(usuarios.rol::text, '')) = 'admin'
        and coalesce(usuarios.activo, true)
    )
  )
  with check (
    exists (
      select 1
      from public.usuarios
      where usuarios.id = auth.uid()
        and lower(coalesce(usuarios.rol::text, '')) = 'admin'
        and coalesce(usuarios.activo, true)
    )
  );

grant select on public.estacion_climatica to authenticated;
grant select on public.v_estacion_climatica_diaria to authenticated;
grant insert, update, delete on public.estacion_climatica to authenticated;
grant usage, select on sequence public.estacion_climatica_id_seq to authenticated;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'estacion_climatica'
  ) then
    alter publication supabase_realtime add table public.estacion_climatica;
  end if;
end $$;

notify pgrst, 'reload schema';

commit;
