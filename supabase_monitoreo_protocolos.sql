-- Canelillo AgroCore - monitoreo protocolizado de plagas.
-- Migracion aditiva y compatible con monitoreo_plagas historico.
-- Ejecutar despues de supabase_monitoreo_plagas_movil.sql.

begin;

-- Preflight: se detiene antes de modificar si el esquema base no es compatible.
do $$
declare
  tabla text;
  columna record;
begin
  foreach tabla in array array[
    'campos', 'usuarios', 'monitoreo_arboles', 'monitoreo_plagas',
    'monitoreo_plagas_catalogo'
  ] loop
    if to_regclass(format('public.%I', tabla)) is null then
      raise exception 'Falta la tabla requerida public.%', tabla;
    end if;
  end loop;

  for columna in
    select * from (values
      ('campos', 'id', 'uuid'),
      ('usuarios', 'id', 'uuid'),
      ('monitoreo_arboles', 'id', 'uuid'),
      ('monitoreo_arboles', 'campo_id', 'uuid'),
      ('monitoreo_plagas', 'id', 'uuid'),
      ('monitoreo_plagas', 'campo_id', 'uuid'),
      ('monitoreo_plagas', 'arbol_id', 'uuid'),
      ('monitoreo_plagas', 'id_operacion_cliente', 'uuid')
    ) as esperado(tabla, columna, udt)
  loop
    if not exists (
      select 1
      from information_schema.columns c
      where c.table_schema = 'public'
        and c.table_name = columna.tabla
        and c.column_name = columna.columna
        and c.udt_name = columna.udt
    ) then
      raise exception 'Columna incompatible: public.%.% debe ser %',
        columna.tabla, columna.columna, columna.udt;
    end if;
  end loop;

  for columna in
    select * from (values
      ('monitoreo_plagas', 'plaga_id', 'uuid'),
      ('monitoreo_plagas', 'visita_id', 'uuid'),
      ('monitoreo_plagas', 'protocolo_id', 'uuid'),
      ('monitoreo_plagas', 'protocolo_version', 'int4'),
      ('monitoreo_plagas', 'fenologia', 'text'),
      ('monitoreo_plagas', 'estado_registro', 'text'),
      ('monitoreo_plagas', 'observaciones', 'text'),
      ('monitoreo_plagas', 'finalizado_en', 'timestamptz')
    ) as esperado(tabla, columna, udt)
  loop
    if exists (
      select 1
      from information_schema.columns c
      where c.table_schema = 'public'
        and c.table_name = columna.tabla
        and c.column_name = columna.columna
        and c.udt_name <> columna.udt
    ) then
      raise exception 'Columna existente incompatible: public.%.% debe ser %',
        columna.tabla, columna.columna, columna.udt;
    end if;
  end loop;
end;
$$;

create or replace function public.monitoreo_normalizar_texto(valor text)
returns text
language sql
immutable
parallel safe
as $$
  select regexp_replace(
    translate(lower(trim(coalesce(valor, ''))),
      'áéíóúüñ', 'aeiouun'),
    '[^a-z0-9]+', '', 'g'
  );
$$;

create or replace function public.monitoreo_actualizar_timestamp()
returns trigger
language plpgsql
as $$
begin
  new.actualizado_en := now();
  return new;
end;
$$;

create or replace function public.monitoreo_usuario_tiene_rol(roles_permitidos text[])
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select exists (
    select 1
    from public.usuarios u
    where u.id = auth.uid()
      and lower(coalesce(u.rol::text, '')) = any(roles_permitidos)
      and coalesce(u.activo, true)
  );
$$;

revoke all on function public.monitoreo_usuario_tiene_rol(text[]) from public;
grant execute on function public.monitoreo_usuario_tiene_rol(text[]) to authenticated;

create table if not exists public.plagas (
  id uuid primary key default gen_random_uuid(),
  nombre_comun text not null,
  nombre_normalizado text generated always as (
    public.monitoreo_normalizar_texto(nombre_comun)
  ) stored,
  nombre_cientifico text null,
  descripcion text null,
  activo boolean not null default true,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  constraint plagas_nombre_chk check (length(trim(nombre_comun)) > 0),
  constraint plagas_nombre_normalizado_unq unique (nombre_normalizado)
);

create table if not exists public.estructuras_vegetales (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  nombre_normalizado text generated always as (
    public.monitoreo_normalizar_texto(nombre)
  ) stored,
  activo boolean not null default true,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  constraint estructuras_vegetales_nombre_chk check (length(trim(nombre)) > 0),
  constraint estructuras_vegetales_nombre_unq unique (nombre_normalizado)
);

create table if not exists public.estados_biologicos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  nombre_normalizado text generated always as (
    public.monitoreo_normalizar_texto(nombre)
  ) stored,
  activo boolean not null default true,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  constraint estados_biologicos_nombre_chk check (length(trim(nombre)) > 0),
  constraint estados_biologicos_nombre_unq unique (nombre_normalizado)
);

create table if not exists public.tipos_dano (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  nombre_normalizado text generated always as (
    public.monitoreo_normalizar_texto(nombre)
  ) stored,
  activo boolean not null default true,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  constraint tipos_dano_nombre_chk check (length(trim(nombre)) > 0),
  constraint tipos_dano_nombre_unq unique (nombre_normalizado)
);

create table if not exists public.enemigos_naturales (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  nombre_normalizado text generated always as (
    public.monitoreo_normalizar_texto(nombre)
  ) stored,
  descripcion text null,
  activo boolean not null default true,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  constraint enemigos_naturales_nombre_chk check (length(trim(nombre)) > 0),
  constraint enemigos_naturales_nombre_unq unique (nombre_normalizado)
);

create table if not exists public.fenologias (
  codigo text primary key,
  nombre text not null,
  orden smallint not null default 0,
  activo boolean not null default true,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  constraint fenologias_codigo_chk check (codigo ~ '^[a-z0-9_]+$'),
  constraint fenologias_nombre_unq unique (nombre)
);

create table if not exists public.atributos_monitoreo (
  id uuid primary key default gen_random_uuid(),
  codigo text not null unique,
  nombre text not null,
  tipo_respuesta text not null,
  opciones jsonb not null default '[]'::jsonb,
  activo boolean not null default true,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  constraint atributos_monitoreo_codigo_chk check (codigo ~ '^[a-z0-9_]+$'),
  constraint atributos_monitoreo_tipo_chk check (
    tipo_respuesta in ('booleano', 'opcion', 'numero', 'texto')
  ),
  constraint atributos_monitoreo_opciones_chk check (jsonb_typeof(opciones) = 'array')
);

create table if not exists public.plaga_estados_biologicos (
  plaga_id uuid not null references public.plagas(id) on update cascade on delete cascade,
  estado_biologico_id uuid not null references public.estados_biologicos(id)
    on update cascade on delete restrict,
  orden smallint not null default 0,
  activo boolean not null default true,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  primary key (plaga_id, estado_biologico_id)
);

create table if not exists public.protocolos_monitoreo (
  id uuid primary key default gen_random_uuid(),
  plaga_id uuid not null references public.plagas(id) on update cascade on delete restrict,
  cultivo_referencia text not null,
  nombre text not null,
  descripcion text null,
  version integer not null default 1,
  requiere_lupa boolean not null default false,
  instrucciones text null,
  frecuencia_dias integer null,
  activo boolean not null default true,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  constraint protocolos_monitoreo_cultivo_chk check (
    cultivo_referencia in ('CITRICO', 'PALTO')
  ),
  constraint protocolos_monitoreo_nombre_chk check (length(trim(nombre)) > 0),
  constraint protocolos_monitoreo_version_chk check (version > 0),
  constraint protocolos_monitoreo_frecuencia_chk check (
    frecuencia_dias is null or frecuencia_dias > 0
  ),
  constraint protocolos_monitoreo_version_unq unique (
    plaga_id, cultivo_referencia, nombre, version
  )
);

create table if not exists public.protocolo_estructuras (
  id uuid primary key default gen_random_uuid(),
  protocolo_id uuid not null references public.protocolos_monitoreo(id)
    on update cascade on delete cascade,
  estructura_id uuid not null references public.estructuras_vegetales(id)
    on update cascade on delete restrict,
  cantidad_revisar integer not null,
  orden smallint not null default 0,
  obligatorio boolean not null default true,
  instrucciones text null,
  activo boolean not null default true,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  constraint protocolo_estructuras_cantidad_chk check (cantidad_revisar > 0),
  constraint protocolo_estructuras_unq unique (protocolo_id, estructura_id)
);

create table if not exists public.protocolo_atributos (
  id uuid primary key default gen_random_uuid(),
  protocolo_id uuid not null references public.protocolos_monitoreo(id)
    on update cascade on delete cascade,
  estructura_id uuid null references public.estructuras_vegetales(id)
    on update cascade on delete restrict,
  atributo_id uuid not null references public.atributos_monitoreo(id)
    on update cascade on delete restrict,
  obligatorio boolean not null default false,
  orden smallint not null default 0,
  activo boolean not null default true,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

create unique index if not exists protocolo_atributos_unq
  on public.protocolo_atributos (
    protocolo_id, coalesce(estructura_id, '00000000-0000-0000-0000-000000000000'::uuid),
    atributo_id
  );

create table if not exists public.visitas_monitoreo (
  id uuid primary key default gen_random_uuid(),
  campo_id uuid not null references public.campos(id) on update cascade on delete restrict,
  fecha_hora_inicio timestamptz not null default now(),
  fecha_hora_fin timestamptz null,
  fenologia text null references public.fenologias(codigo) on update cascade on delete restrict,
  estado text not null default 'borrador',
  arboles_programados integer null,
  id_operacion_cliente uuid null,
  dispositivo_id text null,
  creado_por uuid null references public.usuarios(id) on delete set null,
  observaciones text null,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  constraint visitas_monitoreo_estado_chk check (estado in (
    'borrador', 'en_progreso', 'completado',
    'pendiente_sincronizacion', 'error_sincronizacion'
  )),
  constraint visitas_monitoreo_fechas_chk check (
    fecha_hora_fin is null or fecha_hora_fin >= fecha_hora_inicio
  ),
  constraint visitas_monitoreo_arboles_chk check (
    arboles_programados is null or arboles_programados >= 0
  )
);

create unique index if not exists visitas_monitoreo_operacion_cliente_unq
  on public.visitas_monitoreo (id_operacion_cliente)
  where id_operacion_cliente is not null;

alter table public.monitoreo_plagas
  add column if not exists plaga_id uuid null,
  add column if not exists visita_id uuid null,
  add column if not exists protocolo_id uuid null,
  add column if not exists protocolo_version integer null,
  add column if not exists fenologia text null,
  add column if not exists estado_registro text null,
  add column if not exists observaciones text null,
  add column if not exists finalizado_en timestamptz null;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.monitoreo_plagas'::regclass
      and conname = 'monitoreo_plagas_plaga_fk'
  ) then
    alter table public.monitoreo_plagas
      add constraint monitoreo_plagas_plaga_fk
      foreign key (plaga_id) references public.plagas(id)
      on update cascade on delete restrict not valid;
  end if;

  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.monitoreo_plagas'::regclass
      and conname = 'monitoreo_plagas_visita_fk'
  ) then
    alter table public.monitoreo_plagas
      add constraint monitoreo_plagas_visita_fk
      foreign key (visita_id) references public.visitas_monitoreo(id)
      on update cascade on delete cascade not valid;
  end if;

  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.monitoreo_plagas'::regclass
      and conname = 'monitoreo_plagas_protocolo_fk'
  ) then
    alter table public.monitoreo_plagas
      add constraint monitoreo_plagas_protocolo_fk
      foreign key (protocolo_id) references public.protocolos_monitoreo(id)
      on update cascade on delete restrict not valid;
  end if;

  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.monitoreo_plagas'::regclass
      and conname = 'monitoreo_plagas_fenologia_fk'
  ) then
    alter table public.monitoreo_plagas
      add constraint monitoreo_plagas_fenologia_fk
      foreign key (fenologia) references public.fenologias(codigo)
      on update cascade on delete restrict not valid;
  end if;

  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.monitoreo_plagas'::regclass
      and conname = 'monitoreo_plagas_estado_registro_chk'
  ) then
    alter table public.monitoreo_plagas
      add constraint monitoreo_plagas_estado_registro_chk check (
        estado_registro is null or estado_registro in (
          'borrador', 'en_progreso', 'completado',
          'pendiente_sincronizacion', 'error_sincronizacion',
          'pendiente_identificacion'
        )
      ) not valid;
  end if;
end;
$$;

create table if not exists public.monitoreo_estructuras (
  id uuid primary key default gen_random_uuid(),
  monitoreo_plaga_id uuid not null references public.monitoreo_plagas(id)
    on update cascade on delete cascade,
  estructura_id uuid not null references public.estructuras_vegetales(id)
    on update cascade on delete restrict,
  cantidad_programada integer not null,
  cantidad_revisada integer not null default 0,
  cantidad_positiva integer not null default 0,
  incidencia_porcentaje numeric(7, 3) generated always as (
    case
      when no_evaluable or cantidad_revisada = 0 then null
      else round(cantidad_positiva::numeric * 100 / cantidad_revisada, 3)
    end
  ) stored,
  no_evaluable boolean not null default false,
  motivo_no_evaluable text null,
  estructura_nombre_snapshot text not null,
  instrucciones_snapshot text null,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  constraint monitoreo_estructuras_cantidades_chk check (
    cantidad_programada > 0
    and cantidad_revisada >= 0
    and cantidad_positiva >= 0
    and cantidad_positiva <= cantidad_revisada
    and cantidad_revisada <= cantidad_programada
  ),
  constraint monitoreo_estructuras_no_evaluable_chk check (
    (not no_evaluable)
    or (
      cantidad_revisada = 0
      and cantidad_positiva = 0
      and nullif(trim(motivo_no_evaluable), '') is not null
    )
  ),
  constraint monitoreo_estructuras_unq unique (monitoreo_plaga_id, estructura_id)
);

create table if not exists public.monitoreo_unidades (
  id uuid primary key default gen_random_uuid(),
  monitoreo_estructura_id uuid not null references public.monitoreo_estructuras(id)
    on update cascade on delete cascade,
  numero_unidad integer not null,
  positivo boolean not null default false,
  abundancia_categoria text null,
  severidad text null,
  observaciones text null,
  id_operacion_cliente uuid null,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  constraint monitoreo_unidades_numero_chk check (numero_unidad > 0),
  constraint monitoreo_unidades_severidad_chk check (
    severidad is null or severidad in ('sin_dano', 'leve', 'medio', 'alto')
  ),
  constraint monitoreo_unidades_unq unique (monitoreo_estructura_id, numero_unidad)
);

create unique index if not exists monitoreo_unidades_operacion_cliente_unq
  on public.monitoreo_unidades (id_operacion_cliente)
  where id_operacion_cliente is not null;

create table if not exists public.monitoreo_unidad_estados (
  unidad_id uuid not null references public.monitoreo_unidades(id)
    on update cascade on delete cascade,
  estado_biologico_id uuid not null references public.estados_biologicos(id)
    on update cascade on delete restrict,
  cantidad numeric(12, 3) null,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  primary key (unidad_id, estado_biologico_id),
  constraint monitoreo_unidad_estados_cantidad_chk check (
    cantidad is null or cantidad >= 0
  )
);

create table if not exists public.monitoreo_unidad_danos (
  unidad_id uuid not null references public.monitoreo_unidades(id)
    on update cascade on delete cascade,
  tipo_dano_id uuid not null references public.tipos_dano(id)
    on update cascade on delete restrict,
  severidad text not null default 'leve',
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  primary key (unidad_id, tipo_dano_id),
  constraint monitoreo_unidad_danos_severidad_chk check (
    severidad in ('sin_dano', 'leve', 'medio', 'alto')
  )
);

create table if not exists public.monitoreo_unidad_enemigos (
  unidad_id uuid not null references public.monitoreo_unidades(id)
    on update cascade on delete cascade,
  enemigo_natural_id uuid not null references public.enemigos_naturales(id)
    on update cascade on delete restrict,
  presente boolean not null default true,
  cantidad numeric(12, 3) null,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  primary key (unidad_id, enemigo_natural_id),
  constraint monitoreo_unidad_enemigos_cantidad_chk check (
    cantidad is null or cantidad >= 0
  )
);

create table if not exists public.monitoreo_atributos (
  id uuid primary key default gen_random_uuid(),
  monitoreo_plaga_id uuid not null references public.monitoreo_plagas(id)
    on update cascade on delete cascade,
  monitoreo_estructura_id uuid null references public.monitoreo_estructuras(id)
    on update cascade on delete cascade,
  unidad_id uuid null references public.monitoreo_unidades(id)
    on update cascade on delete cascade,
  atributo_id uuid not null references public.atributos_monitoreo(id)
    on update cascade on delete restrict,
  valor jsonb not null,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  constraint monitoreo_atributos_alcance_chk check (
    unidad_id is null or monitoreo_estructura_id is not null
  )
);

create unique index if not exists monitoreo_atributos_unq
  on public.monitoreo_atributos (
    monitoreo_plaga_id,
    coalesce(monitoreo_estructura_id, '00000000-0000-0000-0000-000000000000'::uuid),
    coalesce(unidad_id, '00000000-0000-0000-0000-000000000000'::uuid),
    atributo_id
  );

create table if not exists public.monitoreo_fotografias (
  id uuid primary key default gen_random_uuid(),
  visita_id uuid null references public.visitas_monitoreo(id)
    on update cascade on delete cascade,
  monitoreo_plaga_id uuid null references public.monitoreo_plagas(id)
    on update cascade on delete cascade,
  monitoreo_estructura_id uuid null references public.monitoreo_estructuras(id)
    on update cascade on delete cascade,
  unidad_id uuid null references public.monitoreo_unidades(id)
    on update cascade on delete cascade,
  ruta_storage text null,
  ruta_local text null,
  mime_type text null,
  tamano_bytes bigint null,
  estado_sincronizacion text not null default 'pendiente',
  id_operacion_cliente uuid null,
  creado_por uuid null references public.usuarios(id) on delete set null,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  constraint monitoreo_fotografias_padre_chk check (
    visita_id is not null or monitoreo_plaga_id is not null
    or monitoreo_estructura_id is not null or unidad_id is not null
  ),
  constraint monitoreo_fotografias_ruta_chk check (
    nullif(trim(coalesce(ruta_storage, '')), '') is not null
    or nullif(trim(coalesce(ruta_local, '')), '') is not null
  ),
  constraint monitoreo_fotografias_estado_chk check (
    estado_sincronizacion in ('pendiente', 'sincronizando', 'sincronizado', 'error')
  ),
  constraint monitoreo_fotografias_tamano_chk check (
    tamano_bytes is null or tamano_bytes >= 0
  )
);

create unique index if not exists monitoreo_fotografias_operacion_cliente_unq
  on public.monitoreo_fotografias (id_operacion_cliente)
  where id_operacion_cliente is not null;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'monitoreo-fotografias',
  'monitoreo-fotografias',
  false,
  10485760,
  array['image/jpeg', 'image/png', 'image/heic']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create index if not exists visitas_monitoreo_campo_fecha_idx
  on public.visitas_monitoreo (campo_id, fecha_hora_inicio desc);
create index if not exists visitas_monitoreo_creado_por_fecha_idx
  on public.visitas_monitoreo (creado_por, fecha_hora_inicio desc);
create index if not exists visitas_monitoreo_estado_idx
  on public.visitas_monitoreo (estado, fecha_hora_inicio desc);
create index if not exists monitoreo_plagas_visita_idx
  on public.monitoreo_plagas (visita_id, fecha desc);
create index if not exists monitoreo_plagas_plaga_fecha_idx
  on public.monitoreo_plagas (plaga_id, fecha desc);
create index if not exists monitoreo_plagas_protocolo_idx
  on public.monitoreo_plagas (protocolo_id, protocolo_version);
create index if not exists monitoreo_estructuras_monitoreo_idx
  on public.monitoreo_estructuras (monitoreo_plaga_id);
create index if not exists monitoreo_estructuras_estructura_idx
  on public.monitoreo_estructuras (estructura_id);
create index if not exists monitoreo_unidades_estructura_idx
  on public.monitoreo_unidades (monitoreo_estructura_id, numero_unidad);
create index if not exists monitoreo_fotografias_visita_idx
  on public.monitoreo_fotografias (visita_id, creado_en);

create or replace function public.validar_monitoreo_plaga_movil()
returns trigger
language plpgsql
as $$
declare
  config public.monitoreo_plagas_catalogo%rowtype;
  protocolo record;
  arbol_campo uuid;
  visita_campo uuid;
  total_observado numeric;
begin
  new.actualizado_en := now();

  if tg_op = 'UPDATE'
    and old.protocolo_id is not null
    and new.protocolo_id is distinct from old.protocolo_id
    and exists (
      select 1 from public.monitoreo_estructuras me
      where me.monitoreo_plaga_id = old.id
    ) then
    raise exception 'No se puede cambiar el protocolo despues de iniciar el muestreo';
  end if;

  if new.protocolo_id is not null then
    select pr.plaga_id, pr.version, p.nombre_comun
    into protocolo
    from public.protocolos_monitoreo pr
    join public.plagas p on p.id = pr.plaga_id
    where pr.id = new.protocolo_id
      and (tg_op = 'UPDATE' or pr.activo);

    if not found then
      raise exception 'El protocolo seleccionado no existe';
    end if;

    if new.plaga_id is not null and new.plaga_id <> protocolo.plaga_id then
      raise exception 'La plaga no corresponde al protocolo seleccionado';
    end if;

    if new.protocolo_version is not null
      and new.protocolo_version <> protocolo.version then
      raise exception 'La version no corresponde al protocolo seleccionado';
    end if;

    new.plaga_id := protocolo.plaga_id;
    new.protocolo_version := protocolo.version;
    new.tipo_plaga := protocolo.nombre_comun;
    new.estado_registro := coalesce(new.estado_registro, 'borrador');
  elsif new.id_operacion_cliente is not null
    and (
      tg_op = 'INSERT'
      or row(
        new.tipo_plaga, new.encontrada, new.huevos, new.ninfas_1,
        new.ninfas_2, new.ninfas_3, new.adultos, new.larvas, new.pupas
      ) is distinct from row(
        old.tipo_plaga, old.encontrada, old.huevos, old.ninfas_1,
        old.ninfas_2, old.ninfas_3, old.adultos, old.larvas, old.pupas
      )
    ) then
    select * into config
    from public.monitoreo_plagas_catalogo
    where tipo_plaga = new.tipo_plaga and activo;

    if not found then
      raise exception 'La plaga % no esta configurada para captura movil', new.tipo_plaga;
    end if;

    if not new.encontrada then
      new.huevos := 0;
      new.ninfas_1 := 0;
      new.ninfas_2 := 0;
      new.ninfas_3 := 0;
      new.adultos := 0;
      new.larvas := 0;
      new.pupas := 0;
      new.encontrado_en := 'Sin presencia';
    else
      if (not config.usa_huevos and new.huevos <> 0)
        or (not config.usa_ninfas_1 and new.ninfas_1 <> 0)
        or (not config.usa_ninfas_2 and new.ninfas_2 <> 0)
        or (not config.usa_ninfas_3 and new.ninfas_3 <> 0)
        or (not config.usa_adultos and new.adultos <> 0)
        or (not config.usa_larvas and new.larvas <> 0)
        or (not config.usa_pupas and new.pupas <> 0) then
        raise exception 'Se ingreso una etapa que no corresponde a %', new.tipo_plaga;
      end if;

      if greatest(new.huevos, new.ninfas_1, new.ninfas_2, new.ninfas_3,
        new.adultos, new.larvas, new.pupas) > config.maximo_captura then
        raise exception 'Cada conteo debe estar entre 0 y %', config.maximo_captura;
      end if;

      total_observado := new.huevos + new.ninfas_1 + new.ninfas_2
        + new.ninfas_3 + new.adultos + new.larvas + new.pupas;
      if total_observado <= 0 then
        raise exception 'Marca No encontrada o registra al menos una presencia';
      end if;
    end if;
  end if;

  if new.arbol_id is not null then
    select
      ma.campo_id,
      coalesce(nullif(new.numero_arbol, ''), ma.numero_arbol),
      ma.latitud,
      ma.longitud
    into arbol_campo, new.numero_arbol, new.latitud, new.longitud
    from public.monitoreo_arboles ma
    where ma.id = new.arbol_id and ma.activo;

    if not found then
      raise exception 'El arbol seleccionado no existe o esta inactivo';
    end if;

    if new.protocolo_id is not null
      and new.campo_id is not null
      and arbol_campo is not null
      and new.campo_id <> arbol_campo then
      raise exception 'El arbol no pertenece al campo seleccionado';
    end if;

    new.campo_id := case
      when new.protocolo_id is not null then coalesce(arbol_campo, new.campo_id)
      else coalesce(new.campo_id, arbol_campo)
    end;
  end if;

  if new.visita_id is not null then
    select v.campo_id into visita_campo
    from public.visitas_monitoreo v
    where v.id = new.visita_id;

    if not found then
      raise exception 'La visita seleccionada no existe';
    end if;

    if new.campo_id is not null and new.campo_id <> visita_campo then
      raise exception 'La visita, el arbol y el campo deben corresponder al mismo bloque';
    end if;

    new.campo_id := coalesce(new.campo_id, visita_campo);
  end if;

  if new.campo_id is not null then
    select c.potrero, c.bloque
    into new.potrero_excel, new.bloque_excel
    from public.campos c
    where c.id = new.campo_id;
  end if;

  new.creado_por := coalesce(new.creado_por, auth.uid());
  return new;
end;
$$;

drop trigger if exists validar_monitoreo_plaga_movil_trg
  on public.monitoreo_plagas;
create trigger validar_monitoreo_plaga_movil_trg
before insert or update on public.monitoreo_plagas
for each row execute function public.validar_monitoreo_plaga_movil();

create or replace function public.monitoreo_preparar_estructura()
returns trigger
language plpgsql
as $$
declare
  contexto record;
begin
  select
    mp.protocolo_id,
    pe.cantidad_revisar,
    pe.instrucciones,
    ev.nombre
  into contexto
  from public.monitoreo_plagas mp
  join public.protocolo_estructuras pe
    on pe.protocolo_id = mp.protocolo_id
   and pe.estructura_id = new.estructura_id
   and pe.activo
  join public.estructuras_vegetales ev on ev.id = pe.estructura_id
  where mp.id = new.monitoreo_plaga_id;

  if not found then
    raise exception 'La estructura no pertenece al protocolo del monitoreo';
  end if;

  if tg_op = 'UPDATE' then
    if new.monitoreo_plaga_id is distinct from old.monitoreo_plaga_id
      or new.estructura_id is distinct from old.estructura_id
      or new.cantidad_programada is distinct from old.cantidad_programada then
      raise exception 'No se puede cambiar la identidad ni el snapshot de una estructura';
    end if;

    new.estructura_nombre_snapshot := old.estructura_nombre_snapshot;
    new.instrucciones_snapshot := old.instrucciones_snapshot;
  elsif new.cantidad_programada <> contexto.cantidad_revisar then
    raise exception 'La cantidad programada debe respetar el snapshot del protocolo (%)',
      contexto.cantidad_revisar;
  else
    new.estructura_nombre_snapshot := contexto.nombre;
    new.instrucciones_snapshot := coalesce(
      new.instrucciones_snapshot, contexto.instrucciones
    );
  end if;
  new.actualizado_en := now();
  return new;
end;
$$;

create or replace function public.monitoreo_bloquear_protocolo_usado()
returns trigger
language plpgsql
as $$
declare
  protocolo uuid;
begin
  if tg_table_name = 'protocolos_monitoreo' then
    protocolo := coalesce(new.id, old.id);

    if tg_op = 'UPDATE'
      and (to_jsonb(new) - 'activo' - 'actualizado_en')
        = (to_jsonb(old) - 'activo' - 'actualizado_en') then
      return new;
    end if;
  else
    protocolo := coalesce(new.protocolo_id, old.protocolo_id);
  end if;

  if exists (
    select 1
    from public.monitoreo_plagas mp
    where mp.protocolo_id = protocolo
  ) then
    raise exception 'El protocolo ya fue utilizado; crea una nueva version';
  end if;

  return coalesce(new, old);
end;
$$;

drop trigger if exists protocolos_monitoreo_inmutable_trg
  on public.protocolos_monitoreo;
create trigger protocolos_monitoreo_inmutable_trg
before update or delete on public.protocolos_monitoreo
for each row execute function public.monitoreo_bloquear_protocolo_usado();

drop trigger if exists protocolo_estructuras_inmutable_trg
  on public.protocolo_estructuras;
create trigger protocolo_estructuras_inmutable_trg
before insert or update or delete on public.protocolo_estructuras
for each row execute function public.monitoreo_bloquear_protocolo_usado();

drop trigger if exists protocolo_atributos_inmutable_trg
  on public.protocolo_atributos;
create trigger protocolo_atributos_inmutable_trg
before insert or update or delete on public.protocolo_atributos
for each row execute function public.monitoreo_bloquear_protocolo_usado();

drop trigger if exists monitoreo_preparar_estructura_trg
  on public.monitoreo_estructuras;
create trigger monitoreo_preparar_estructura_trg
before insert or update on public.monitoreo_estructuras
for each row execute function public.monitoreo_preparar_estructura();

create or replace function public.monitoreo_refrescar_resultado()
returns trigger
language plpgsql
as $$
declare
  monitoreo_id uuid;
begin
  monitoreo_id := coalesce(new.monitoreo_plaga_id, old.monitoreo_plaga_id);

  update public.monitoreo_plagas mp
  set encontrada = exists (
      select 1
      from public.monitoreo_estructuras me
      where me.monitoreo_plaga_id = monitoreo_id
        and not me.no_evaluable
        and me.cantidad_positiva > 0
    ),
    actualizado_en = now()
  where mp.id = monitoreo_id;

  return coalesce(new, old);
end;
$$;

drop trigger if exists monitoreo_refrescar_resultado_trg
  on public.monitoreo_estructuras;
create trigger monitoreo_refrescar_resultado_trg
after insert or update or delete on public.monitoreo_estructuras
for each row execute function public.monitoreo_refrescar_resultado();

create or replace function public.monitoreo_validar_unidad()
returns trigger
language plpgsql
as $$
declare
  maximo integer;
begin
  select cantidad_programada into maximo
  from public.monitoreo_estructuras
  where id = new.monitoreo_estructura_id;

  if new.numero_unidad > maximo then
    raise exception 'La unidad % supera las % unidades programadas',
      new.numero_unidad, maximo;
  end if;

  if not new.positivo then
    new.abundancia_categoria := null;
    new.severidad := null;
  end if;

  new.actualizado_en := now();
  return new;
end;
$$;

drop trigger if exists monitoreo_validar_unidad_trg on public.monitoreo_unidades;
create trigger monitoreo_validar_unidad_trg
before insert or update on public.monitoreo_unidades
for each row execute function public.monitoreo_validar_unidad();

create or replace function public.monitoreo_refrescar_estructura_desde_unidades()
returns trigger
language plpgsql
as $$
declare
  v_estructura_id uuid;
begin
  v_estructura_id := coalesce(
    new.monitoreo_estructura_id, old.monitoreo_estructura_id
  );

  update public.monitoreo_estructuras me
  set cantidad_revisada = resumen.revisadas,
      cantidad_positiva = resumen.positivas,
      actualizado_en = now()
  from (
    select count(*)::integer as revisadas,
      count(*) filter (where mu.positivo)::integer as positivas
    from public.monitoreo_unidades mu
    where mu.monitoreo_estructura_id = v_estructura_id
  ) resumen
  where me.id = v_estructura_id
    and not me.no_evaluable;

  return coalesce(new, old);
end;
$$;

drop trigger if exists monitoreo_refrescar_estructura_unidades_trg
  on public.monitoreo_unidades;
create trigger monitoreo_refrescar_estructura_unidades_trg
after insert or update or delete on public.monitoreo_unidades
for each row execute function public.monitoreo_refrescar_estructura_desde_unidades();

create or replace function public.monitoreo_validar_estado_unidad()
returns trigger
language plpgsql
as $$
declare
  plaga uuid;
  unidad_positiva boolean;
begin
  select mp.plaga_id, mu.positivo
  into plaga, unidad_positiva
  from public.monitoreo_unidades mu
  join public.monitoreo_estructuras me on me.id = mu.monitoreo_estructura_id
  join public.monitoreo_plagas mp on mp.id = me.monitoreo_plaga_id
  where mu.id = new.unidad_id;

  if not unidad_positiva then
    raise exception 'Solo una unidad positiva puede registrar estados biologicos';
  end if;

  if not exists (
    select 1
    from public.plaga_estados_biologicos peb
    where peb.plaga_id = plaga
      and peb.estado_biologico_id = new.estado_biologico_id
      and peb.activo
  ) then
    raise exception 'El estado biologico no esta permitido para la plaga';
  end if;

  new.actualizado_en := now();
  return new;
end;
$$;

drop trigger if exists monitoreo_validar_estado_unidad_trg
  on public.monitoreo_unidad_estados;
create trigger monitoreo_validar_estado_unidad_trg
before insert or update on public.monitoreo_unidad_estados
for each row execute function public.monitoreo_validar_estado_unidad();

create or replace function public.monitoreo_validar_finalizacion()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'INSERT' and new.estado_registro = 'completado' then
    raise exception 'Primero guarda las estructuras y luego finaliza el monitoreo';
  end if;

  if new.estado_registro = 'completado'
    and old.estado_registro is distinct from new.estado_registro then
    if new.protocolo_id is null or new.visita_id is null or new.arbol_id is null then
      raise exception 'Un monitoreo completado requiere visita, arbol y protocolo';
    end if;

    if exists (
      select 1
      from public.protocolo_estructuras pe
      where pe.protocolo_id = new.protocolo_id
        and pe.activo
        and pe.obligatorio
        and not exists (
          select 1
          from public.monitoreo_estructuras me
          where me.monitoreo_plaga_id = new.id
            and me.estructura_id = pe.estructura_id
            and (
              me.no_evaluable
              or me.cantidad_revisada = me.cantidad_programada
            )
        )
    ) then
      raise exception 'Faltan estructuras obligatorias por completar';
    end if;

    new.finalizado_en := coalesce(new.finalizado_en, now());
  end if;

  return new;
end;
$$;

drop trigger if exists z_monitoreo_validar_finalizacion_trg
  on public.monitoreo_plagas;
create trigger z_monitoreo_validar_finalizacion_trg
before insert or update on public.monitoreo_plagas
for each row execute function public.monitoreo_validar_finalizacion();

create or replace function public.monitoreo_validar_visita()
returns trigger
language plpgsql
as $$
begin
  new.actualizado_en := now();
  new.creado_por := coalesce(new.creado_por, auth.uid());

  if new.estado = 'completado' and old.estado is distinct from new.estado then
    if not exists (
      select 1
      from public.monitoreo_plagas mp
      where mp.visita_id = new.id
    ) then
      raise exception 'No se puede completar una visita sin monitoreos';
    end if;

    if exists (
      select 1
      from public.monitoreo_plagas mp
      where mp.visita_id = new.id
        and mp.estado_registro not in (
          'completado', 'pendiente_identificacion'
        )
    ) then
      raise exception 'La visita contiene monitoreos sin completar';
    end if;
    new.fecha_hora_fin := coalesce(new.fecha_hora_fin, now());
  end if;

  return new;
end;
$$;

drop trigger if exists visitas_monitoreo_validacion_trg
  on public.visitas_monitoreo;
create trigger visitas_monitoreo_validacion_trg
before insert or update on public.visitas_monitoreo
for each row execute function public.monitoreo_validar_visita();

do $$
declare
  tabla text;
begin
  foreach tabla in array array[
    'plagas', 'estructuras_vegetales', 'estados_biologicos', 'tipos_dano',
    'enemigos_naturales', 'fenologias', 'atributos_monitoreo',
    'plaga_estados_biologicos', 'protocolos_monitoreo',
    'protocolo_estructuras', 'protocolo_atributos',
    'monitoreo_unidad_estados', 'monitoreo_unidad_danos',
    'monitoreo_unidad_enemigos', 'monitoreo_atributos',
    'monitoreo_fotografias'
  ] loop
    execute format('drop trigger if exists %I on public.%I',
      tabla || '_actualizado_trg', tabla);
    execute format(
      'create trigger %I before update on public.%I for each row execute function public.monitoreo_actualizar_timestamp()',
      tabla || '_actualizado_trg', tabla
    );
  end loop;
end;
$$;

create or replace view public.v_monitoreo_protocolizado
with (security_invoker = true)
as
select
  mp.id as monitoreo_plaga_id,
  mp.visita_id,
  mp.fecha,
  mp.campo_id,
  c.potrero,
  c.bloque,
  c.especie,
  c.variedad,
  mp.arbol_id,
  ma.numero_arbol,
  mp.plaga_id,
  p.nombre_comun as plaga,
  mp.protocolo_id,
  mp.protocolo_version,
  mp.estado_registro,
  mp.creado_por,
  u.nombre_completo as monitor,
  me.id as monitoreo_estructura_id,
  me.estructura_id,
  me.estructura_nombre_snapshot as estructura,
  me.cantidad_programada,
  me.cantidad_revisada,
  me.cantidad_positiva,
  me.incidencia_porcentaje,
  me.no_evaluable,
  me.motivo_no_evaluable,
  mp.latitud,
  mp.longitud
from public.monitoreo_plagas mp
join public.monitoreo_estructuras me on me.monitoreo_plaga_id = mp.id
left join public.campos c on c.id = mp.campo_id
left join public.monitoreo_arboles ma on ma.id = mp.arbol_id
left join public.plagas p on p.id = mp.plaga_id
left join public.usuarios u on u.id = mp.creado_por
where mp.protocolo_id is not null;

create or replace view public.v_monitoreo_resumen_estructura
with (security_invoker = true)
as
select
  base.fecha,
  base.campo_id,
  base.potrero,
  base.bloque,
  base.especie,
  base.variedad,
  base.plaga_id,
  base.plaga,
  base.estructura_id,
  base.estructura,
  count(distinct base.arbol_id) filter (
    where not base.no_evaluable
  ) as puntos_monitoreados,
  count(distinct base.arbol_id) filter (
    where not base.no_evaluable and base.cantidad_positiva > 0
  ) as puntos_positivos,
  round(
    count(distinct base.arbol_id) filter (
      where not base.no_evaluable and base.cantidad_positiva > 0
    )::numeric
      * 100 / nullif(
        count(distinct base.arbol_id) filter (where not base.no_evaluable), 0
      ),
    3
  ) as puntos_positivos_porcentaje,
  sum(base.cantidad_revisada) filter (where not base.no_evaluable) as unidades_revisadas,
  sum(base.cantidad_positiva) filter (where not base.no_evaluable) as unidades_positivas,
  round(
    sum(base.cantidad_positiva) filter (where not base.no_evaluable)::numeric
      * 100
      / nullif(sum(base.cantidad_revisada) filter (where not base.no_evaluable), 0),
    3
  ) as incidencia_porcentaje
from public.v_monitoreo_protocolizado base
where base.estado_registro = 'completado'
group by
  base.fecha, base.campo_id, base.potrero, base.bloque,
  base.especie, base.variedad,
  base.plaga_id, base.plaga, base.estructura_id, base.estructura;

do $$
declare
  tabla text;
begin
  foreach tabla in array array[
    'plagas', 'estructuras_vegetales', 'estados_biologicos', 'tipos_dano',
    'enemigos_naturales', 'fenologias', 'atributos_monitoreo',
    'plaga_estados_biologicos', 'protocolos_monitoreo',
    'protocolo_estructuras', 'protocolo_atributos', 'visitas_monitoreo',
    'monitoreo_estructuras', 'monitoreo_unidades',
    'monitoreo_unidad_estados', 'monitoreo_unidad_danos',
    'monitoreo_unidad_enemigos', 'monitoreo_atributos',
    'monitoreo_fotografias'
  ] loop
    execute format('alter table public.%I enable row level security', tabla);
  end loop;
end;
$$;

-- Catalogos: lectura autenticada y administracion exclusiva de admin.
do $$
declare
  tabla text;
begin
  foreach tabla in array array[
    'plagas', 'estructuras_vegetales', 'estados_biologicos', 'tipos_dano',
    'enemigos_naturales', 'fenologias', 'atributos_monitoreo',
    'plaga_estados_biologicos', 'protocolos_monitoreo',
    'protocolo_estructuras', 'protocolo_atributos'
  ] loop
    execute format('drop policy if exists %I on public.%I',
      tabla || '_lectura', tabla);
    execute format(
      'create policy %I on public.%I for select to authenticated using (true)',
      tabla || '_lectura', tabla
    );
    execute format('drop policy if exists %I on public.%I',
      tabla || '_admin', tabla);
    execute format(
      'create policy %I on public.%I for all to authenticated using (public.monitoreo_usuario_tiene_rol(array[''admin''])) with check (public.monitoreo_usuario_tiene_rol(array[''admin'']))',
      tabla || '_admin', tabla
    );
  end loop;
end;
$$;

-- Operacion: admin y supervisor escriben; solo admin elimina.
do $$
declare
  tabla text;
begin
  foreach tabla in array array[
    'visitas_monitoreo', 'monitoreo_estructuras', 'monitoreo_unidades',
    'monitoreo_unidad_estados', 'monitoreo_unidad_danos',
    'monitoreo_unidad_enemigos', 'monitoreo_atributos',
    'monitoreo_fotografias'
  ] loop
    execute format('drop policy if exists %I on public.%I',
      tabla || '_lectura', tabla);
    execute format(
      'create policy %I on public.%I for select to authenticated using (true)',
      tabla || '_lectura', tabla
    );
    execute format('drop policy if exists %I on public.%I',
      tabla || '_insertar', tabla);
    execute format(
      'create policy %I on public.%I for insert to authenticated with check (public.monitoreo_usuario_tiene_rol(array[''admin'', ''supervisor'']))',
      tabla || '_insertar', tabla
    );
    execute format('drop policy if exists %I on public.%I',
      tabla || '_actualizar', tabla);
    execute format(
      'create policy %I on public.%I for update to authenticated using (public.monitoreo_usuario_tiene_rol(array[''admin'', ''supervisor''])) with check (public.monitoreo_usuario_tiene_rol(array[''admin'', ''supervisor'']))',
      tabla || '_actualizar', tabla
    );
    execute format('drop policy if exists %I on public.%I',
      tabla || '_eliminar', tabla);
    execute format(
      'create policy %I on public.%I for delete to authenticated using (public.monitoreo_usuario_tiene_rol(array[''admin'']))',
      tabla || '_eliminar', tabla
    );
  end loop;
end;
$$;

drop policy if exists monitoreo_fotografias_storage_lectura
  on storage.objects;
create policy monitoreo_fotografias_storage_lectura
on storage.objects for select to authenticated
using (bucket_id = 'monitoreo-fotografias');

drop policy if exists monitoreo_fotografias_storage_insertar
  on storage.objects;
create policy monitoreo_fotografias_storage_insertar
on storage.objects for insert to authenticated
with check (
  bucket_id = 'monitoreo-fotografias'
  and public.monitoreo_usuario_tiene_rol(array['admin', 'supervisor'])
);

drop policy if exists monitoreo_fotografias_storage_actualizar
  on storage.objects;
create policy monitoreo_fotografias_storage_actualizar
on storage.objects for update to authenticated
using (
  bucket_id = 'monitoreo-fotografias'
  and public.monitoreo_usuario_tiene_rol(array['admin', 'supervisor'])
)
with check (
  bucket_id = 'monitoreo-fotografias'
  and public.monitoreo_usuario_tiene_rol(array['admin', 'supervisor'])
);

drop policy if exists monitoreo_fotografias_storage_eliminar
  on storage.objects;
create policy monitoreo_fotografias_storage_eliminar
on storage.objects for delete to authenticated
using (
  bucket_id = 'monitoreo-fotografias'
  and public.monitoreo_usuario_tiene_rol(array['admin'])
);

grant select on public.plagas, public.estructuras_vegetales,
  public.estados_biologicos, public.tipos_dano, public.enemigos_naturales,
  public.fenologias, public.atributos_monitoreo,
  public.plaga_estados_biologicos, public.protocolos_monitoreo,
  public.protocolo_estructuras, public.protocolo_atributos
to authenticated;

grant insert, update, delete on public.plagas, public.estructuras_vegetales,
  public.estados_biologicos, public.tipos_dano, public.enemigos_naturales,
  public.fenologias, public.atributos_monitoreo,
  public.plaga_estados_biologicos, public.protocolos_monitoreo,
  public.protocolo_estructuras, public.protocolo_atributos
to authenticated;

grant select, insert, update, delete on public.visitas_monitoreo,
  public.monitoreo_estructuras, public.monitoreo_unidades,
  public.monitoreo_unidad_estados, public.monitoreo_unidad_danos,
  public.monitoreo_unidad_enemigos, public.monitoreo_atributos,
  public.monitoreo_fotografias
to authenticated;

grant select on public.v_monitoreo_protocolizado,
  public.v_monitoreo_resumen_estructura
to authenticated;

do $$
declare
  tabla text;
begin
  foreach tabla in array array[
    'visitas_monitoreo', 'monitoreo_estructuras', 'monitoreo_unidades'
  ] loop
    if not exists (
      select 1
      from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = tabla
    ) then
      execute format(
        'alter publication supabase_realtime add table public.%I', tabla
      );
    end if;
  end loop;
end;
$$;

alter table public.monitoreo_plagas
  validate constraint monitoreo_plagas_plaga_fk;
alter table public.monitoreo_plagas
  validate constraint monitoreo_plagas_visita_fk;
alter table public.monitoreo_plagas
  validate constraint monitoreo_plagas_protocolo_fk;
alter table public.monitoreo_plagas
  validate constraint monitoreo_plagas_fenologia_fk;
alter table public.monitoreo_plagas
  validate constraint monitoreo_plagas_estado_registro_chk;

notify pgrst, 'reload schema';

commit;

select
  'supabase_monitoreo_protocolos.sql' as migracion,
  count(*) filter (where table_name = 'visitas_monitoreo') as visitas_lista,
  count(*) filter (where table_name = 'monitoreo_estructuras') as estructuras_lista,
  count(*) filter (where table_name = 'monitoreo_unidades') as unidades_lista
from information_schema.tables
where table_schema = 'public'
  and table_name in (
    'visitas_monitoreo', 'monitoreo_estructuras', 'monitoreo_unidades'
  );
