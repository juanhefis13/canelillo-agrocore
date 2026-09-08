-- Canelillo AgroCore - catalogos y protocolos iniciales.
-- Ejecutar despues de supabase_monitoreo_protocolos.sql.

begin;

insert into public.fenologias (codigo, nombre, orden)
values
  ('brotacion', 'Brotacion', 10),
  ('floracion', 'Floracion', 20),
  ('cuaja', 'Cuaja', 30),
  ('fruto_pequeno', 'Fruto pequeno', 40),
  ('crecimiento_fruto', 'Crecimiento de fruto', 50),
  ('maduracion', 'Maduracion', 60),
  ('cosecha', 'Cosecha', 70),
  ('postcosecha', 'Postcosecha', 80)
on conflict (codigo) do update
set nombre = excluded.nombre,
    orden = excluded.orden,
    activo = true;

insert into public.estructuras_vegetales (nombre)
values
  ('Hoja'), ('Fruto'), ('Brote'), ('Ramilla'), ('Tronco'),
  ('Flor'), ('Inflorescencia'), ('Refugio'), ('Otra')
on conflict (nombre_normalizado) do update set activo = true;

insert into public.estados_biologicos (nombre)
values
  ('Huevo'), ('Ovisaco'), ('Juvenil'), ('Ninfa'), ('Adulto'),
  ('Movil'), ('Larva'), ('Pupa'), ('Inmaduro'), ('Alado'),
  ('No determinado')
on conflict (nombre_normalizado) do update set activo = true;

insert into public.tipos_dano (nombre)
values
  ('Russet'), ('Bronceado'), ('Fumagina'), ('Mielecilla'),
  ('Enrollamiento'), ('Cicatriz'), ('Dano cosmetico'),
  ('Deformacion'), ('Otro')
on conflict (nombre_normalizado) do update set activo = true;

insert into public.enemigos_naturales (nombre)
values
  ('No identificado'), ('Coccinelidos'), ('Crisopidos'),
  ('Acaros depredadores'), ('Parasitoides'), ('Otros')
on conflict (nombre_normalizado) do update set activo = true;

insert into public.atributos_monitoreo (
  codigo, nombre, tipo_respuesta, opciones
)
values
  ('hormigas', 'Hormigas', 'booleano', '[]'::jsonb),
  ('enemigos_naturales', 'Enemigos naturales', 'booleano', '[]'::jsonb),
  ('fumagina', 'Fumagina', 'booleano', '[]'::jsonb),
  ('mielecilla', 'Mielecilla', 'booleano', '[]'::jsonb),
  ('parasitismo', 'Parasitismo', 'booleano', '[]'::jsonb),
  ('refugios', 'Refugios', 'booleano', '[]'::jsonb),
  ('condicion_individuo', 'Condicion', 'opcion',
    '["vivo", "muerto", "parasitado"]'::jsonb),
  ('nivel_colonia', 'Nivel de colonia', 'opcion',
    '["sin_colonia", "baja", "media", "alta"]'::jsonb),
  ('especie_escama', 'Especie de escama', 'opcion',
    '["escama_roja", "escama_morada", "escama_blanca", "hemiberlesia_lataniae", "hemiberlesia_rapax", "aspidiotus_nerii", "otra", "no_determinada"]'::jsonb)
on conflict (codigo) do update
set nombre = excluded.nombre,
    tipo_respuesta = excluded.tipo_respuesta,
    opciones = excluded.opciones,
    activo = true;

-- Primero conserva cada nombre historico como entrada maestra normalizada.
insert into public.plagas (nombre_comun)
select distinct trim(mp.tipo_plaga)
from public.monitoreo_plagas mp
where nullif(trim(mp.tipo_plaga), '') is not null
on conflict (nombre_normalizado) do nothing;

-- Catalogo minimo requerido por los protocolos nuevos.
insert into public.plagas (
  nombre_comun, nombre_cientifico, descripcion
)
values
  ('Chanchito blanco', 'Pseudococcidae spp.',
    'Plaga maestra compartida entre citricos y paltos.'),
  ('Falsa aranita roja', 'Brevipalpus chilensis', null),
  ('Aranita roja', null,
    'La especie de referencia se conserva en cada protocolo de cultivo.'),
  ('Conchuela negra', 'Saissetia oleae', null),
  ('Escama', 'Diaspididae spp.',
    'Catalogo maestro para escamas; la especie se registra como atributo.'),
  ('Mosquita blanca', 'Aleurothrixus floccosus', null),
  ('Pulgon', 'Aphididae spp.', null),
  ('Trips', 'Heliothrips haemorrhoidalis', null),
  ('Organismo / plaga no identificada', null,
    'Registro temporal pendiente de clasificacion administrativa.')
on conflict (nombre_normalizado) do update
set nombre_cientifico = coalesce(
      public.plagas.nombre_cientifico, excluded.nombre_cientifico
    ),
    descripcion = coalesce(public.plagas.descripcion, excluded.descripcion),
    activo = true;

-- Vinculo seguro: solo compara el nombre normalizado y no altera tipo_plaga.
update public.monitoreo_plagas mp
set plaga_id = p.id
from public.plagas p
where mp.plaga_id is null
  and p.nombre_normalizado = public.monitoreo_normalizar_texto(mp.tipo_plaga);

-- Estados biologicos permitidos por plaga.
with configuracion(plaga, estado, orden) as (
  values
    ('Chanchito blanco', 'Ovisaco', 10),
    ('Chanchito blanco', 'Juvenil', 20),
    ('Chanchito blanco', 'Adulto', 30),
    ('Falsa aranita roja', 'Huevo', 10),
    ('Falsa aranita roja', 'Movil', 20),
    ('Aranita roja', 'Huevo', 10),
    ('Aranita roja', 'Movil', 20),
    ('Conchuela negra', 'Juvenil', 10),
    ('Conchuela negra', 'Adulto', 20),
    ('Escama', 'Inmaduro', 10),
    ('Escama', 'Adulto', 20),
    ('Mosquita blanca', 'Huevo', 10),
    ('Mosquita blanca', 'Ninfa', 20),
    ('Mosquita blanca', 'Adulto', 30),
    ('Pulgon', 'Ninfa', 10),
    ('Pulgon', 'Adulto', 20),
    ('Pulgon', 'Alado', 30),
    ('Trips', 'Juvenil', 10),
    ('Trips', 'Adulto', 20),
    ('Organismo / plaga no identificada', 'No determinado', 10)
)
insert into public.plaga_estados_biologicos (
  plaga_id, estado_biologico_id, orden
)
select p.id, eb.id, cfg.orden
from configuracion cfg
join public.plagas p
  on p.nombre_normalizado = public.monitoreo_normalizar_texto(cfg.plaga)
join public.estados_biologicos eb
  on eb.nombre_normalizado = public.monitoreo_normalizar_texto(cfg.estado)
on conflict (plaga_id, estado_biologico_id) do update
set orden = excluded.orden,
    activo = true;

-- Los protocolos son filas versionadas. Una correccion futura crea version 2.
with semillas(
  plaga, cultivo, nombre, descripcion, version, requiere_lupa, instrucciones
) as (
  values
    ('Chanchito blanco', 'CITRICO', 'Chanchito blanco - citricos',
      'Revision estandar de frutos y brotes.', 1, false,
      'Registrar presencia, abundancia y evidencia cuando corresponda.'),
    ('Falsa aranita roja', 'CITRICO', 'Falsa aranita roja - citricos',
      'Referencia Brevipalpus chilensis.', 1, true,
      'Revisar grietas, inserciones, zonas protegidas y zona peduncular.'),
    ('Aranita roja', 'CITRICO', 'Aranita roja - citricos',
      'Referencia Panonychus citri.', 1, true,
      'Revisar ambas caras de las hojas y registrar dano.'),
    ('Conchuela negra', 'CITRICO', 'Conchuela negra - citricos',
      'Referencia Saissetia oleae.', 1, false,
      'Diferenciar condicion y parasitismo.'),
    ('Escama', 'CITRICO', 'Escamas - citricos',
      'Escama roja, morada, blanca u otra.', 1, true,
      'Identificar especie cuando sea posible.'),
    ('Mosquita blanca', 'CITRICO', 'Mosquita blanca - citricos',
      'Referencia Aleurothrixus floccosus.', 1, false,
      'Revisar especialmente el enves de las hojas.'),
    ('Pulgon', 'CITRICO', 'Pulgones - citricos',
      'Registro rapido por colonia.', 1, false,
      'Registrar presencia de colonia y nivel de abundancia.'),
    ('Trips', 'PALTO', 'Trips - palto',
      'Referencia Heliothrips haemorrhoidalis.', 1, false,
      'Separar presencia de plaga y dano en fruto.'),
    ('Aranita roja', 'PALTO', 'Aranita roja - palto',
      'Referencia Oligonychus yothersi.', 1, true,
      'Registrar huevos, moviles, bronceado y enemigos naturales.'),
    ('Chanchito blanco', 'PALTO', 'Chanchito blanco - palto',
      'Revision estandar de frutos y brotes.', 1, false,
      'Registrar hormigas, enemigos naturales y refugios.'),
    ('Escama', 'PALTO', 'Escamas blancas - palto',
      'Hemiberlesia lataniae, H. rapax, Aspidiotus nerii o no determinada.',
      1, true, 'Revisar ramillas y frutos.'),
    ('Conchuela negra', 'PALTO', 'Conchuela negra - palto',
      'Referencia Saissetia oleae.', 1, false,
      'Registrar condicion, parasitismo, fumagina y enemigos naturales.'),
    ('Organismo / plaga no identificada', 'CITRICO',
      'Organismo no identificado - citricos',
      'Registro temporal para clasificacion posterior.', 1, false,
      'Adjuntar fotografia, abundancia y observacion descriptiva.'),
    ('Organismo / plaga no identificada', 'PALTO',
      'Organismo no identificado - palto',
      'Registro temporal para clasificacion posterior.', 1, false,
      'Adjuntar fotografia, abundancia y observacion descriptiva.')
)
insert into public.protocolos_monitoreo (
  plaga_id, cultivo_referencia, nombre, descripcion, version,
  requiere_lupa, instrucciones
)
select
  p.id, s.cultivo, s.nombre, s.descripcion, s.version,
  s.requiere_lupa, s.instrucciones
from semillas s
join public.plagas p
  on p.nombre_normalizado = public.monitoreo_normalizar_texto(s.plaga)
on conflict (plaga_id, cultivo_referencia, nombre, version) do nothing;

with semillas(protocolo, cultivo, estructura, cantidad, orden, obligatorio, instrucciones) as (
  values
    ('Chanchito blanco - citricos', 'CITRICO', 'Fruto', 10, 10, true, null),
    ('Chanchito blanco - citricos', 'CITRICO', 'Brote', 10, 20, true, null),
    ('Falsa aranita roja - citricos', 'CITRICO', 'Fruto', 10, 10, true,
      'Revisar zona peduncular y sectores protegidos.'),
    ('Falsa aranita roja - citricos', 'CITRICO', 'Ramilla', 5, 20, true,
      'Revisar grietas e inserciones.'),
    ('Aranita roja - citricos', 'CITRICO', 'Hoja', 10, 10, true, null),
    ('Conchuela negra - citricos', 'CITRICO', 'Ramilla', 5, 10, true, null),
    ('Escamas - citricos', 'CITRICO', 'Fruto', 10, 10, true, null),
    ('Escamas - citricos', 'CITRICO', 'Ramilla', 5, 20, true, null),
    ('Mosquita blanca - citricos', 'CITRICO', 'Hoja', 10, 10, true,
      'Revisar especialmente el enves.'),
    ('Pulgones - citricos', 'CITRICO', 'Brote', 10, 10, true, null),
    ('Trips - palto', 'PALTO', 'Hoja', 10, 10, true, null),
    ('Trips - palto', 'PALTO', 'Fruto', 10, 20, true, null),
    ('Aranita roja - palto', 'PALTO', 'Hoja', 10, 10, true, null),
    ('Chanchito blanco - palto', 'PALTO', 'Fruto', 10, 10, true, null),
    ('Chanchito blanco - palto', 'PALTO', 'Brote', 10, 20, true, null),
    ('Escamas blancas - palto', 'PALTO', 'Ramilla', 10, 10, true, null),
    ('Escamas blancas - palto', 'PALTO', 'Fruto', 10, 20, true, null),
    ('Conchuela negra - palto', 'PALTO', 'Ramilla', 10, 10, true, null),
    ('Organismo no identificado - citricos', 'CITRICO', 'Otra', 1, 10, true,
      'Registra la estructura observada en la nota y adjunta evidencia.'),
    ('Organismo no identificado - palto', 'PALTO', 'Otra', 1, 10, true,
      'Registra la estructura observada en la nota y adjunta evidencia.')
)
insert into public.protocolo_estructuras (
  protocolo_id, estructura_id, cantidad_revisar, orden, obligatorio, instrucciones
)
select
  pm.id, ev.id, s.cantidad, s.orden, s.obligatorio, s.instrucciones
from semillas s
join public.protocolos_monitoreo pm
  on pm.nombre = s.protocolo
 and pm.cultivo_referencia = s.cultivo
 and pm.version = 1
join public.estructuras_vegetales ev
  on ev.nombre_normalizado = public.monitoreo_normalizar_texto(s.estructura)
where not exists (
  select 1
  from public.protocolo_estructuras pe
  where pe.protocolo_id = pm.id
    and pe.estructura_id = ev.id
);

with semillas(protocolo, cultivo, estructura, atributo, orden) as (
  values
    ('Chanchito blanco - citricos', 'CITRICO', null, 'hormigas', 10),
    ('Chanchito blanco - citricos', 'CITRICO', null, 'enemigos_naturales', 20),
    ('Chanchito blanco - citricos', 'CITRICO', null, 'fumagina', 30),
    ('Aranita roja - citricos', 'CITRICO', 'Hoja', 'enemigos_naturales', 10),
    ('Conchuela negra - citricos', 'CITRICO', 'Ramilla', 'condicion_individuo', 10),
    ('Conchuela negra - citricos', 'CITRICO', 'Ramilla', 'parasitismo', 20),
    ('Conchuela negra - citricos', 'CITRICO', 'Ramilla', 'fumagina', 30),
    ('Conchuela negra - citricos', 'CITRICO', 'Ramilla', 'enemigos_naturales', 40),
    ('Escamas - citricos', 'CITRICO', null, 'especie_escama', 10),
    ('Escamas - citricos', 'CITRICO', null, 'condicion_individuo', 20),
    ('Mosquita blanca - citricos', 'CITRICO', 'Hoja', 'mielecilla', 10),
    ('Mosquita blanca - citricos', 'CITRICO', 'Hoja', 'fumagina', 20),
    ('Mosquita blanca - citricos', 'CITRICO', 'Hoja', 'parasitismo', 30),
    ('Pulgones - citricos', 'CITRICO', 'Brote', 'nivel_colonia', 10),
    ('Trips - palto', 'PALTO', 'Fruto', 'enemigos_naturales', 10),
    ('Aranita roja - palto', 'PALTO', 'Hoja', 'enemigos_naturales', 10),
    ('Chanchito blanco - palto', 'PALTO', null, 'hormigas', 10),
    ('Chanchito blanco - palto', 'PALTO', null, 'enemigos_naturales', 20),
    ('Chanchito blanco - palto', 'PALTO', null, 'refugios', 30),
    ('Escamas blancas - palto', 'PALTO', null, 'especie_escama', 10),
    ('Conchuela negra - palto', 'PALTO', 'Ramilla', 'condicion_individuo', 10),
    ('Conchuela negra - palto', 'PALTO', 'Ramilla', 'parasitismo', 20),
    ('Conchuela negra - palto', 'PALTO', 'Ramilla', 'fumagina', 30),
    ('Conchuela negra - palto', 'PALTO', 'Ramilla', 'enemigos_naturales', 40)
)
insert into public.protocolo_atributos (
  protocolo_id, estructura_id, atributo_id, obligatorio, orden
)
select
  pm.id, ev.id, am.id, false, s.orden
from semillas s
join public.protocolos_monitoreo pm
  on pm.nombre = s.protocolo
 and pm.cultivo_referencia = s.cultivo
 and pm.version = 1
join public.atributos_monitoreo am on am.codigo = s.atributo
left join public.estructuras_vegetales ev
  on ev.nombre_normalizado = public.monitoreo_normalizar_texto(s.estructura)
where not exists (
  select 1
  from public.protocolo_atributos pa
  where pa.protocolo_id = pm.id
    and pa.estructura_id is not distinct from ev.id
    and pa.atributo_id = am.id
);

notify pgrst, 'reload schema';

commit;

select
  (select count(*) from public.plagas where activo) as plagas_activas,
  (select count(*) from public.protocolos_monitoreo where activo) as protocolos_activos,
  (select count(*) from public.protocolo_estructuras where activo) as estructuras_configuradas,
  (select count(*) from public.monitoreo_plagas where plaga_id is not null) as historicos_vinculados,
  (select count(*) from public.monitoreo_plagas where plaga_id is null) as historicos_sin_vinculo;
