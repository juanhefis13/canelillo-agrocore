-- Gestión y trazabilidad de alertas automáticas y eventos externos de riego.
-- Ejecutar una vez en Supabase SQL Editor.

begin;

alter table public.riego_eventos
  add column if not exists origen text not null default 'manual',
  add column if not exists alerta_clave text,
  add column if not exists prioridad text,
  add column if not exists titulo_alerta text,
  add column if not exists detalle_problema text,
  add column if not exists solucion text,
  add column if not exists porcentaje_diferencia numeric,
  add column if not exists valor_programado numeric,
  add column if not exists valor_real numeric,
  add column if not exists volumen_programado numeric,
  add column if not exists volumen_real numeric,
  add column if not exists unidad text;

alter table public.riego_eventos
  drop constraint if exists riego_eventos_estado_check,
  drop constraint if exists riego_eventos_origen_check,
  drop constraint if exists riego_eventos_prioridad_check,
  drop constraint if exists riego_eventos_detalle_problema_check,
  drop constraint if exists riego_eventos_solucion_check;

alter table public.riego_eventos
  add constraint riego_eventos_estado_check
    check (estado in ('activo', 'en_revision', 'resuelto')),
  add constraint riego_eventos_origen_check
    check (origen in ('manual', 'wiseconn_riego', 'wiseconn_fertilizante')),
  add constraint riego_eventos_prioridad_check
    check (prioridad is null or prioridad in ('P1', 'P2', 'P3')),
  add constraint riego_eventos_detalle_problema_check
    check (detalle_problema is null or char_length(btrim(detalle_problema)) <= 1600),
  add constraint riego_eventos_solucion_check
    check (solucion is null or char_length(btrim(solucion)) <= 1600);

create unique index if not exists riego_eventos_alerta_clave_uidx
  on public.riego_eventos (alerta_clave);

create index if not exists riego_eventos_origen_estado_fecha_idx
  on public.riego_eventos (origen, estado, fecha desc);

create index if not exists riego_eventos_prioridad_estado_fecha_idx
  on public.riego_eventos (prioridad, estado, fecha desc);

comment on column public.riego_eventos.origen is
  'manual, wiseconn_riego o wiseconn_fertilizante';
comment on column public.riego_eventos.alerta_clave is
  'Identificador estable de la alerta automática para impedir duplicados';
comment on column public.riego_eventos.detalle_problema is
  'Antecedentes agregados por el responsable durante la revisión';
comment on column public.riego_eventos.solucion is
  'Acción correctiva registrada antes de cerrar el caso';

commit;

notify pgrst, 'reload schema';
