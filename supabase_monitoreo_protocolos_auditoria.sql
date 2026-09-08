-- Canelillo Monitoreo - auditoria de solo lectura previa a protocolos.
-- Este archivo no crea, actualiza ni elimina datos.

begin;
set transaction read only;

-- 1. Tablas actuales y tablas propuestas que ya pudieran existir.
select
  expected.table_name,
  to_regclass(format('public.%I', expected.table_name)) is not null as existe
from (values
  ('campos'),
  ('usuarios'),
  ('monitoreo_arboles'),
  ('monitoreo_plagas'),
  ('monitoreo_plagas_catalogo'),
  ('visitas_monitoreo'),
  ('plagas'),
  ('estructuras_vegetales'),
  ('protocolos_monitoreo'),
  ('protocolo_estructuras'),
  ('monitoreo_estructuras'),
  ('monitoreo_unidades'),
  ('estados_biologicos'),
  ('plaga_estados_biologicos'),
  ('monitoreo_unidad_estados'),
  ('tipos_dano'),
  ('monitoreo_unidad_danos'),
  ('enemigos_naturales')
) as expected(table_name)
order by expected.table_name;

-- 2. Columnas y tipos reales de las tablas que condicionan la migracion.
select
  c.table_name,
  c.ordinal_position,
  c.column_name,
  c.data_type,
  c.udt_name,
  c.is_nullable,
  c.column_default,
  c.is_generated,
  c.generation_expression
from information_schema.columns c
where c.table_schema = 'public'
  and c.table_name in (
    'campos', 'usuarios', 'monitoreo_arboles', 'monitoreo_plagas',
    'monitoreo_plagas_catalogo', 'visitas_monitoreo', 'plagas',
    'estructuras_vegetales', 'protocolos_monitoreo',
    'protocolo_estructuras', 'monitoreo_estructuras',
    'monitoreo_unidades', 'estados_biologicos',
    'plaga_estados_biologicos', 'monitoreo_unidad_estados',
    'tipos_dano', 'monitoreo_unidad_danos', 'enemigos_naturales'
  )
order by c.table_name, c.ordinal_position;

-- 3. Primary keys, foreign keys, uniques y checks actuales.
select
  rel.relname as table_name,
  con.conname as constraint_name,
  con.contype as constraint_type,
  pg_get_constraintdef(con.oid, true) as definition
from pg_constraint con
join pg_class rel on rel.oid = con.conrelid
join pg_namespace nsp on nsp.oid = rel.relnamespace
where nsp.nspname = 'public'
  and rel.relname in (
    'campos', 'usuarios', 'monitoreo_arboles', 'monitoreo_plagas',
    'monitoreo_plagas_catalogo', 'visitas_monitoreo', 'plagas',
    'estructuras_vegetales', 'protocolos_monitoreo',
    'protocolo_estructuras', 'monitoreo_estructuras',
    'monitoreo_unidades', 'estados_biologicos',
    'plaga_estados_biologicos', 'monitoreo_unidad_estados',
    'tipos_dano', 'monitoreo_unidad_danos', 'enemigos_naturales'
  )
order by rel.relname, con.contype, con.conname;

-- 4. Indices actuales.
select tablename, indexname, indexdef
from pg_indexes
where schemaname = 'public'
  and tablename in (
    'campos', 'usuarios', 'monitoreo_arboles', 'monitoreo_plagas',
    'monitoreo_plagas_catalogo', 'visitas_monitoreo', 'plagas',
    'estructuras_vegetales', 'protocolos_monitoreo',
    'protocolo_estructuras', 'monitoreo_estructuras',
    'monitoreo_unidades', 'estados_biologicos',
    'plaga_estados_biologicos', 'monitoreo_unidad_estados',
    'tipos_dano', 'monitoreo_unidad_danos', 'enemigos_naturales'
  )
order by tablename, indexname;

-- 5. Triggers actuales.
select
  event_object_table as table_name,
  trigger_name,
  action_timing,
  event_manipulation,
  action_statement
from information_schema.triggers
where trigger_schema = 'public'
  and event_object_table in (
    'campos', 'usuarios', 'monitoreo_arboles', 'monitoreo_plagas',
    'monitoreo_plagas_catalogo'
  )
order by event_object_table, trigger_name, event_manipulation;

-- 6. RLS y politicas actuales.
select
  c.relname as table_name,
  c.relrowsecurity as rls_enabled,
  c.relforcerowsecurity as rls_forced
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relkind = 'r'
  and c.relname like 'monitoreo%'
order by c.relname;

select
  tablename,
  policyname,
  roles,
  cmd,
  qual,
  with_check
from pg_policies
where schemaname = 'public'
  and (tablename like 'monitoreo%' or tablename in ('plagas', 'protocolos_monitoreo'))
order by tablename, policyname;

-- 7. Tipos enum y roles disponibles.
select
  typ.typname as enum_name,
  enum.enumlabel as enum_value,
  enum.enumsortorder
from pg_type typ
join pg_enum enum on enum.enumtypid = typ.oid
join pg_namespace nsp on nsp.oid = typ.typnamespace
where nsp.nspname = 'public'
order by typ.typname, enum.enumsortorder;

select
  lower(coalesce(to_jsonb(u)->>'rol', 'sin_rol')) as rol,
  count(*) as usuarios,
  count(*) filter (
    where coalesce(nullif(to_jsonb(u)->>'activo', '')::boolean, true)
  ) as activos
from public.usuarios u
group by lower(coalesce(to_jsonb(u)->>'rol', 'sin_rol'))
order by rol;

-- 8. Calidad de relaciones y cobertura actual de arboles.
select
  count(*) as arboles_total,
  count(*) filter (where nullif(to_jsonb(ma)->>'campo_id', '') is not null) as con_campo,
  count(*) filter (where nullif(to_jsonb(ma)->>'campo_id', '') is null) as sin_campo,
  count(*) filter (
    where coalesce(nullif(to_jsonb(ma)->>'activo', '')::boolean, true)
  ) as activos,
  count(*) filter (where nullif(to_jsonb(ma)->>'id_operacion_cliente', '') is not null) as con_operacion_cliente,
  count(*) filter (where nullif(to_jsonb(ma)->>'precision_metros', '') is not null) as con_precision
from public.monitoreo_arboles ma;

select
  count(*) as monitoreos_total,
  count(*) filter (where nullif(to_jsonb(mp)->>'arbol_id', '') is not null) as con_arbol,
  count(*) filter (where nullif(to_jsonb(mp)->>'arbol_id', '') is null) as sin_arbol,
  count(*) filter (where nullif(to_jsonb(mp)->>'campo_id', '') is not null) as con_campo,
  count(*) filter (where nullif(to_jsonb(mp)->>'id_operacion_cliente', '') is not null) as con_operacion_cliente,
  count(*) filter (where nullif(to_jsonb(mp)->>'correlativo', '') is not null) as con_correlativo
from public.monitoreo_plagas mp;

-- 9. Posibles duplicados que afectarian upsert idempotente.
select
  to_jsonb(ma)->>'id_operacion_cliente' as id_operacion_cliente,
  count(*) as repeticiones
from public.monitoreo_arboles ma
where nullif(to_jsonb(ma)->>'id_operacion_cliente', '') is not null
group by to_jsonb(ma)->>'id_operacion_cliente'
having count(*) > 1
order by repeticiones desc, id_operacion_cliente;

select
  to_jsonb(mp)->>'id_operacion_cliente' as id_operacion_cliente,
  count(*) as repeticiones
from public.monitoreo_plagas mp
where nullif(to_jsonb(mp)->>'id_operacion_cliente', '') is not null
group by to_jsonb(mp)->>'id_operacion_cliente'
having count(*) > 1
order by repeticiones desc, id_operacion_cliente;

-- 10. Nombres historicos que deben mapearse al catalogo maestro sin duplicar.
select
  trim(to_jsonb(mp)->>'tipo_plaga') as tipo_plaga,
  count(*) as registros,
  min(nullif(to_jsonb(mp)->>'fecha', '')::date) as primera_fecha,
  max(nullif(to_jsonb(mp)->>'fecha', '')::date) as ultima_fecha
from public.monitoreo_plagas mp
where nullif(trim(to_jsonb(mp)->>'tipo_plaga'), '') is not null
group by trim(to_jsonb(mp)->>'tipo_plaga')
order by lower(trim(to_jsonb(mp)->>'tipo_plaga'));

-- 11. Vistas y funciones que consumen el modelo actual.
select schemaname, viewname
from pg_views
where schemaname = 'public'
  and definition ilike '%monitoreo_plagas%'
order by viewname;

select
  n.nspname as schema_name,
  p.proname as function_name,
  pg_get_function_identity_arguments(p.oid) as arguments
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and case
    when p.prokind in ('f', 'p') then pg_get_functiondef(p.oid)
    else ''
  end ilike '%monitoreo_plagas%'
order by p.proname;

commit;

-- 12. Salida consolidada para descargar o copiar como un unico JSON.
with
expected_tables(table_name) as (
  values
    ('campos'), ('usuarios'), ('monitoreo_arboles'), ('monitoreo_plagas'),
    ('monitoreo_plagas_catalogo'), ('visitas_monitoreo'), ('plagas'),
    ('estructuras_vegetales'), ('protocolos_monitoreo'),
    ('protocolo_estructuras'), ('monitoreo_estructuras'),
    ('monitoreo_unidades'), ('estados_biologicos'),
    ('plaga_estados_biologicos'), ('monitoreo_unidad_estados'),
    ('tipos_dano'), ('monitoreo_unidad_danos'), ('enemigos_naturales')
),
table_inventory as (
  select table_name, to_regclass(format('public.%I', table_name)) is not null as existe
  from expected_tables
),
column_inventory as (
  select c.table_name, c.ordinal_position, c.column_name, c.data_type,
    c.udt_name, c.is_nullable, c.column_default, c.is_generated,
    c.generation_expression
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name in (select table_name from expected_tables)
),
constraint_inventory as (
  select rel.relname as table_name, con.conname as constraint_name,
    con.contype as constraint_type,
    pg_get_constraintdef(con.oid, true) as definition
  from pg_constraint con
  join pg_class rel on rel.oid = con.conrelid
  join pg_namespace nsp on nsp.oid = rel.relnamespace
  where nsp.nspname = 'public'
    and rel.relname in (select table_name from expected_tables)
),
index_inventory as (
  select tablename, indexname, indexdef
  from pg_indexes
  where schemaname = 'public'
    and tablename in (select table_name from expected_tables)
),
trigger_inventory as (
  select event_object_table as table_name, trigger_name, action_timing,
    event_manipulation, action_statement
  from information_schema.triggers
  where trigger_schema = 'public'
    and event_object_table in (select table_name from expected_tables)
),
policy_inventory as (
  select tablename, policyname, roles, cmd, qual, with_check
  from pg_policies
  where schemaname = 'public'
    and (tablename like 'monitoreo%' or tablename in ('plagas', 'protocolos_monitoreo'))
),
enum_inventory as (
  select typ.typname as enum_name, enum.enumlabel as enum_value,
    enum.enumsortorder
  from pg_type typ
  join pg_enum enum on enum.enumtypid = typ.oid
  join pg_namespace nsp on nsp.oid = typ.typnamespace
  where nsp.nspname = 'public'
),
role_inventory as (
  select lower(coalesce(to_jsonb(u)->>'rol', 'sin_rol')) as rol,
    count(*) as usuarios,
    count(*) filter (
      where coalesce(nullif(to_jsonb(u)->>'activo', '')::boolean, true)
    ) as activos
  from public.usuarios u
  group by lower(coalesce(to_jsonb(u)->>'rol', 'sin_rol'))
),
tree_quality as (
  select count(*) as total,
    count(*) filter (where nullif(to_jsonb(ma)->>'campo_id', '') is not null) as con_campo,
    count(*) filter (where nullif(to_jsonb(ma)->>'campo_id', '') is null) as sin_campo,
    count(*) filter (
      where coalesce(nullif(to_jsonb(ma)->>'activo', '')::boolean, true)
    ) as activos,
    count(*) filter (where nullif(to_jsonb(ma)->>'id_operacion_cliente', '') is not null) as con_operacion_cliente,
    count(*) filter (where nullif(to_jsonb(ma)->>'precision_metros', '') is not null) as con_precision
  from public.monitoreo_arboles ma
),
monitoring_quality as (
  select count(*) as total,
    count(*) filter (where nullif(to_jsonb(mp)->>'arbol_id', '') is not null) as con_arbol,
    count(*) filter (where nullif(to_jsonb(mp)->>'arbol_id', '') is null) as sin_arbol,
    count(*) filter (where nullif(to_jsonb(mp)->>'campo_id', '') is not null) as con_campo,
    count(*) filter (where nullif(to_jsonb(mp)->>'id_operacion_cliente', '') is not null) as con_operacion_cliente,
    count(*) filter (where nullif(to_jsonb(mp)->>'correlativo', '') is not null) as con_correlativo
  from public.monitoreo_plagas mp
),
tree_duplicates as (
  select to_jsonb(ma)->>'id_operacion_cliente' as id_operacion_cliente,
    count(*) as repeticiones
  from public.monitoreo_arboles ma
  where nullif(to_jsonb(ma)->>'id_operacion_cliente', '') is not null
  group by to_jsonb(ma)->>'id_operacion_cliente'
  having count(*) > 1
),
monitoring_duplicates as (
  select to_jsonb(mp)->>'id_operacion_cliente' as id_operacion_cliente,
    count(*) as repeticiones
  from public.monitoreo_plagas mp
  where nullif(to_jsonb(mp)->>'id_operacion_cliente', '') is not null
  group by to_jsonb(mp)->>'id_operacion_cliente'
  having count(*) > 1
),
pest_inventory as (
  select trim(to_jsonb(mp)->>'tipo_plaga') as tipo_plaga,
    count(*) as registros,
    min(nullif(to_jsonb(mp)->>'fecha', '')::date) as primera_fecha,
    max(nullif(to_jsonb(mp)->>'fecha', '')::date) as ultima_fecha
  from public.monitoreo_plagas mp
  where nullif(trim(to_jsonb(mp)->>'tipo_plaga'), '') is not null
  group by trim(to_jsonb(mp)->>'tipo_plaga')
),
view_inventory as (
  select schemaname, viewname
  from pg_views
  where schemaname = 'public' and definition ilike '%monitoreo_plagas%'
),
function_inventory as (
  select n.nspname as schema_name, p.proname as function_name,
    pg_get_function_identity_arguments(p.oid) as arguments
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public'
    and case
      when p.prokind in ('f', 'p') then pg_get_functiondef(p.oid)
      else ''
    end ilike '%monitoreo_plagas%'
)
select jsonb_pretty(jsonb_build_object(
  'generado_en', now(),
  'tablas', coalesce((select jsonb_agg(to_jsonb(t) order by t.table_name) from table_inventory t), '[]'::jsonb),
  'columnas', coalesce((select jsonb_agg(to_jsonb(c) order by c.table_name, c.ordinal_position) from column_inventory c), '[]'::jsonb),
  'restricciones', coalesce((select jsonb_agg(to_jsonb(c) order by c.table_name, c.constraint_name) from constraint_inventory c), '[]'::jsonb),
  'indices', coalesce((select jsonb_agg(to_jsonb(i) order by i.tablename, i.indexname) from index_inventory i), '[]'::jsonb),
  'triggers', coalesce((select jsonb_agg(to_jsonb(t) order by t.table_name, t.trigger_name) from trigger_inventory t), '[]'::jsonb),
  'politicas', coalesce((select jsonb_agg(to_jsonb(p) order by p.tablename, p.policyname) from policy_inventory p), '[]'::jsonb),
  'enums', coalesce((select jsonb_agg(to_jsonb(e) order by e.enum_name, e.enumsortorder) from enum_inventory e), '[]'::jsonb),
  'roles', coalesce((select jsonb_agg(to_jsonb(r) order by r.rol) from role_inventory r), '[]'::jsonb),
  'calidad_arboles', coalesce((select to_jsonb(q) from tree_quality q), '{}'::jsonb),
  'calidad_monitoreos', coalesce((select to_jsonb(q) from monitoring_quality q), '{}'::jsonb),
  'duplicados_arboles', coalesce((select jsonb_agg(to_jsonb(d)) from tree_duplicates d), '[]'::jsonb),
  'duplicados_monitoreos', coalesce((select jsonb_agg(to_jsonb(d)) from monitoring_duplicates d), '[]'::jsonb),
  'plagas_historicas', coalesce((select jsonb_agg(to_jsonb(p) order by lower(p.tipo_plaga)) from pest_inventory p), '[]'::jsonb),
  'vistas_consumidoras', coalesce((select jsonb_agg(to_jsonb(v) order by v.viewname) from view_inventory v), '[]'::jsonb),
  'funciones_consumidoras', coalesce((select jsonb_agg(to_jsonb(f) order by f.function_name) from function_inventory f), '[]'::jsonb)
)) as auditoria_monitoreo_json;
