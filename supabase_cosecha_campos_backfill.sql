-- Relaciona cosecha_analisis y exportacion_analisis con public.campos.
-- Es seguro de ejecutar varias veces: solo recalcula campo_id/campo_ids segun potrero, bloque y variedad.

begin;

create or replace function public.agrocore_normalizar_campo_ref(valor text, tipo text default 'general')
returns text
language sql
immutable
as $$
  with base as (
    select trim(
      regexp_replace(
        regexp_replace(
          regexp_replace(lower(coalesce(valor, '')), '\s+', ' ', 'g'),
          '^(potrero|bloque|cuartel)\s+',
          '',
          'g'
        ),
        '\s+',
        ' ',
        'g'
      )
    ) as texto
  )
  select nullif(
    case
      when tipo = 'potrero' then regexp_replace(texto, '^p\s*([0-9])', '\1', 'g')
      when tipo = 'bloque' then regexp_replace(texto, '^b\s*([0-9])', '\1', 'g')
      else texto
    end,
    ''
  )
  from base;
$$;

-- Cosecha con potrero + bloque exacto.
update public.cosecha_analisis ca
set campo_id = c.id,
    potrero_normalizado = c.potrero,
    bloque_normalizado = c.bloque
from public.campos c
where public.agrocore_normalizar_campo_ref(c.potrero, 'potrero') = public.agrocore_normalizar_campo_ref(coalesce(ca.potrero_normalizado, ca.potrero_excel), 'potrero')
  and public.agrocore_normalizar_campo_ref(c.bloque, 'bloque') = public.agrocore_normalizar_campo_ref(coalesce(ca.bloque_excel, ca.bloque_normalizado, ca.bloque_formula), 'bloque');

-- Caso potrero 26: el bloque I5/J3 se cruza contra potrero I/J y acepta bloque I5/J3 o 5/3.
with matches as (
  select
    ca.id as cosecha_id,
    c.id as campo_id,
    c.potrero,
    c.bloque
  from public.cosecha_analisis ca
  join public.campos c
    on public.agrocore_normalizar_campo_ref(coalesce(ca.potrero_normalizado, ca.potrero_excel), 'potrero') = '26'
   and public.agrocore_normalizar_campo_ref(c.potrero, 'potrero') = lower(substring(public.agrocore_normalizar_campo_ref(coalesce(ca.bloque_excel, ca.bloque_normalizado, ca.bloque_formula), 'bloque') from '^([a-z])\s*0*[0-9]+$'))
   and (
        public.agrocore_normalizar_campo_ref(c.bloque, 'bloque') = public.agrocore_normalizar_campo_ref(coalesce(ca.bloque_excel, ca.bloque_normalizado, ca.bloque_formula), 'bloque')
        or public.agrocore_normalizar_campo_ref(c.bloque, 'bloque') = regexp_replace(public.agrocore_normalizar_campo_ref(coalesce(ca.bloque_excel, ca.bloque_normalizado, ca.bloque_formula), 'bloque'), '^[a-z]\s*0*([0-9]+)$', '\1')
      )
)
update public.cosecha_analisis ca
set campo_id = m.campo_id,
    potrero_normalizado = m.potrero,
    bloque_normalizado = m.bloque
from matches m
where ca.id = m.cosecha_id;

-- Caso potrero 27 resumido: O = 27 GRAV y OO = 27 IMP.
with matches as (
  select
    ca.id as cosecha_id,
    (array_agg(c.id order by c.id::text))[1] as campo_id,
    (array_agg(c.potrero order by c.id::text))[1] as potrero,
    (array_agg(c.bloque order by c.id::text))[1] as bloque,
    count(*) as coincidencias
  from public.cosecha_analisis ca
  join public.campos c
    on (
        public.agrocore_normalizar_campo_ref(ca.potrero_excel, 'potrero') = '27'
        or public.agrocore_normalizar_campo_ref(ca.potrero_normalizado, 'potrero') = '27'
      )
   and public.agrocore_normalizar_campo_ref(c.potrero, 'potrero') like '27%'
   and public.agrocore_normalizar_campo_ref(c.bloque, 'bloque') = public.agrocore_normalizar_campo_ref(coalesce(ca.bloque_excel, ca.bloque_normalizado, ca.bloque_formula), 'bloque')
   and public.agrocore_normalizar_campo_ref(c.variedad) = public.agrocore_normalizar_campo_ref(ca.variedad)
   and (
        (
          public.agrocore_normalizar_campo_ref(ca.bloque_formula, 'bloque') like 'oo%'
          and public.agrocore_normalizar_campo_ref(c.potrero, 'potrero') = '27 imp'
        )
        or (
          public.agrocore_normalizar_campo_ref(ca.bloque_formula, 'bloque') like 'o%'
          and public.agrocore_normalizar_campo_ref(ca.bloque_formula, 'bloque') not like 'oo%'
          and public.agrocore_normalizar_campo_ref(c.potrero, 'potrero') = '27 grav'
        )
      )
  group by ca.id
  having count(*) = 1
)
update public.cosecha_analisis ca
set campo_id = m.campo_id,
    potrero_normalizado = m.potrero,
    bloque_normalizado = m.bloque
from matches m
where ca.id = m.cosecha_id;

-- Exportacion no trae bloque: vincula todos los bloques del potrero y variedad.
with matches as (
  select
    ea.id as exportacion_id,
    array_agg(c.id order by c.potrero, c.bloque) as campo_ids,
    string_agg(distinct c.especie, ' / ' order by c.especie) as especie_match
  from public.exportacion_analisis ea
  join public.campos c
    on public.agrocore_normalizar_campo_ref(c.variedad) = public.agrocore_normalizar_campo_ref(ea.variedad)
   and (
        public.agrocore_normalizar_campo_ref(c.potrero, 'potrero') = public.agrocore_normalizar_campo_ref(coalesce(ea.potrero_normalizado, ea.potrero_excel), 'potrero')
        or (
          public.agrocore_normalizar_campo_ref(coalesce(ea.potrero_normalizado, ea.potrero_excel), 'potrero') = '27'
          and public.agrocore_normalizar_campo_ref(c.potrero, 'potrero') like '27%'
        )
        or (
          public.agrocore_normalizar_campo_ref(coalesce(ea.potrero_normalizado, ea.potrero_excel), 'potrero') = '26'
          and public.agrocore_normalizar_campo_ref(c.potrero, 'potrero') in ('d','e','f','g','h','i','j')
        )
      )
  group by ea.id
)
update public.exportacion_analisis ea
set campo_ids = m.campo_ids,
    especie = coalesce(nullif(ea.especie, ''), m.especie_match)
from matches m
where ea.id = m.exportacion_id;

commit;
