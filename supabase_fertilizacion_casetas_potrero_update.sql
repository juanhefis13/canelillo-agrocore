-- Actualiza casetas, estanques y potreros desde "Base de datos Casetas x Potrero.xlsx".
-- Hoja fuente: "Estanques x potrero". Ejecutar completo en Supabase SQL Editor.
-- Los bloques se heredan desde public.campos filtrando por potrero.

begin;

drop table if exists tmp_fert_estanques_potrero;
create temporary table tmp_fert_estanques_potrero (
  excel_row int not null,
  potrero text not null,
  caseta text not null,
  caseta_key text not null,
  numero_estanque text not null,
  numero_estanque_normalizado text not null,
  fip text not null,
  fip_normalizado text not null,
  volumen_maximo_litros numeric(12, 3) not null,
  volumen_origen text null,
  centro_fertilizacion text null
) on commit drop;

insert into tmp_fert_estanques_potrero (excel_row, potrero, caseta, caseta_key, numero_estanque, numero_estanque_normalizado, fip, fip_normalizado, volumen_maximo_litros, volumen_origen, centro_fertilizacion)
values
  (2, '1', 'CASETA 1', 'CASETA-1', '1', 'ESTANQUE-1', 'FIP 1', 'FIP-1', 5000, '5000', 'CENTRO 1 CITRICOS'),
  (3, '1', 'CASETA 1', 'CASETA-1', '2', 'ESTANQUE-2', 'FIP 2', 'FIP-2', 5000, '5000', 'CENTRO 1 CITRICOS'),
  (4, '1', 'CASETA 1', 'CASETA-1', '3', 'ESTANQUE-3', 'FIP 3', 'FIP-3', 1000, '1000', 'CENTRO 1 CITRICOS'),
  (5, '2', 'CASETA 1', 'CASETA-1', '1', 'ESTANQUE-1', 'FIP 1', 'FIP-1', 5000, '5000', 'CENTRO 1 CITRICOS'),
  (6, '2', 'CASETA 1', 'CASETA-1', '2', 'ESTANQUE-2', 'FIP 2', 'FIP-2', 5000, '5000', 'CENTRO 1 CITRICOS'),
  (7, '2', 'CASETA 1', 'CASETA-1', '3', 'ESTANQUE-3', 'FIP 3', 'FIP-3', 1000, '1000', 'CENTRO 1 CITRICOS'),
  (8, 'Mirador 1', 'CASETA 1', 'CASETA-1', '4', 'ESTANQUE-4', 'FIP 1', 'FIP-1', 3000, '3000', 'CENTRO 2 M1'),
  (9, 'Mirador 1', 'CASETA 1', 'CASETA-1', '5', 'ESTANQUE-5', 'FIP 2', 'FIP-2', 2000, '2000', 'CENTRO 2 M1'),
  (10, 'Mirador 1', 'CASETA 1', 'CASETA-1', '6', 'ESTANQUE-6', 'FIP 3', 'FIP-3', 3000, '3000', 'CENTRO 2 M1'),
  (11, '30', 'CASETA 10', 'CASETA-10', '1', 'ESTANQUE-1', 'FIP 1', 'FIP-1', 3000, '3000', 'CENTRO LA VEGA'),
  (12, '30', 'CASETA 10', 'CASETA-10', '2', 'ESTANQUE-2', 'FIP 2', 'FIP-2', 2000, '2000', 'CENTRO LA VEGA'),
  (13, '30', 'CASETA 10', 'CASETA-10', '3', 'ESTANQUE-3', 'FIP 3', 'FIP-3', 3000, '3000', 'CENTRO LA VEGA'),
  (14, '30', 'CASETA 10', 'CASETA-10', '4', 'ESTANQUE-4', 'FIP 4', 'FIP-4', 3000, '3000', 'CENTRO LA VEGA'),
  (15, '10', 'CASETA 11', 'CASETA-11', 'MANUAL', 'ESTANQUE-MANUAL', 'MANUAL', 'MANUAL', 200, '200', 'APLICACIÓN MANUAL'),
  (16, 'Los pinos Paltos', 'CASETA 11', 'CASETA-11', 'MANUAL', 'ESTANQUE-MANUAL', 'MANUAL', 'MANUAL', 200, '200', 'APLICACIÓN MANUAL'),
  (17, 'El parque 1', 'CASETA 12', 'CASETA-12', '1', 'ESTANQUE-1', 'FIP 1', 'FIP-1', 5000, '5000', 'CENTRO 1 PARQUE'),
  (18, 'El parque 1', 'CASETA 12', 'CASETA-12', '2', 'ESTANQUE-2', 'FIP 2', 'FIP-2', 5000, '5000', 'CENTRO 1 PARQUE'),
  (19, 'El parque 1', 'CASETA 12', 'CASETA-12', '3', 'ESTANQUE-3', 'FIP 3', 'FIP-3', 5000, '5000', 'CENTRO 1 PARQUE'),
  (20, 'El parque 1', 'CASETA 12', 'CASETA-12', '4', 'ESTANQUE-4', 'FIP 4', 'FIP-4', 2000, '2000', 'CENTRO 1 PARQUE'),
  (21, 'El parque 2', 'CASETA 12', 'CASETA-12', '1', 'ESTANQUE-1', 'FIP 1', 'FIP-1', 5000, '5000', 'CENTRO 2 PARQUE'),
  (22, 'El parque 2', 'CASETA 12', 'CASETA-12', '2', 'ESTANQUE-2', 'FIP 2', 'FIP-2', 5000, '5000', 'CENTRO 2 PARQUE'),
  (23, 'El parque 2', 'CASETA 12', 'CASETA-12', '3', 'ESTANQUE-3', 'FIP 3', 'FIP-3', 5000, '5000', 'CENTRO 2 PARQUE'),
  (24, 'El parque 2', 'CASETA 12', 'CASETA-12', '4', 'ESTANQUE-4', 'FIP 4', 'FIP-4', 2000, '2000', 'CENTRO 2 PARQUE'),
  (25, 'El parque 3', 'CASETA 12', 'CASETA-12', '1', 'ESTANQUE-1', 'FIP 1', 'FIP-1', 5000, '5000', 'CENTRO 3 PARQUE'),
  (26, 'El parque 3', 'CASETA 12', 'CASETA-12', '2', 'ESTANQUE-2', 'FIP 2', 'FIP-2', 5000, '5000', 'CENTRO 3 PARQUE'),
  (27, 'El parque 3', 'CASETA 12', 'CASETA-12', '3', 'ESTANQUE-3', 'FIP 3', 'FIP-3', 5000, '5000', 'CENTRO 3 PARQUE'),
  (28, 'El parque 3', 'CASETA 12', 'CASETA-12', '4', 'ESTANQUE-4', 'FIP 4', 'FIP-4', 2000, '2000', 'CENTRO 3 PARQUE'),
  (29, 'El parque 4', 'CASETA 12', 'CASETA-12', '1', 'ESTANQUE-1', 'FIP 1', 'FIP-1', 5000, '5000', 'CENTRO 4 PARQUE IMP'),
  (30, 'El parque 4', 'CASETA 12', 'CASETA-12', '2', 'ESTANQUE-2', 'FIP 2', 'FIP-2', 5000, '5000', 'CENTRO 4 PARQUE IMP'),
  (31, 'El parque 4', 'CASETA 12', 'CASETA-12', '3', 'ESTANQUE-3', 'FIP 3', 'FIP-3', 5000, '5000', 'CENTRO 4 PARQUE IMP'),
  (32, 'El parque 4', 'CASETA 12', 'CASETA-12', '4', 'ESTANQUE-4', 'FIP 4', 'FIP-4', 2000, '2000', 'CENTRO 4 PARQUE IMP'),
  (33, '20', 'CASETA 2', 'CASETA-2', '2', 'ESTANQUE-2', 'FIP 1', 'FIP-1', 5000, '5000', 'CENTRO 3 P21 P20 P24'),
  (34, '20', 'CASETA 2', 'CASETA-2', '1', 'ESTANQUE-1', 'FIP 2', 'FIP-2', 5000, '5000', 'CENTRO 3 P21 P20 P24'),
  (35, '20', 'CASETA 2', 'CASETA-2', '6', 'ESTANQUE-6', 'FIP 3', 'FIP-3', 5000, '5000', 'CENTRO 3 P21 P20 P24'),
  (36, '20', 'CASETA 2', 'CASETA-2', '7', 'ESTANQUE-7', 'FIP 4', 'FIP-4', 5000, '5000', 'CENTRO 3 P21 P20 P24'),
  (37, '21', 'CASETA 2', 'CASETA-2', '2', 'ESTANQUE-2', 'FIP 1', 'FIP-1', 5000, '5000', 'CENTRO 3 P21 P20 P24'),
  (38, '21', 'CASETA 2', 'CASETA-2', '1', 'ESTANQUE-1', 'FIP 2', 'FIP-2', 5000, '5000', 'CENTRO 3 P21 P20 P24'),
  (39, '21', 'CASETA 2', 'CASETA-2', '6', 'ESTANQUE-6', 'FIP 3', 'FIP-3', 5000, '5000', 'CENTRO 3 P21 P20 P24'),
  (40, '21', 'CASETA 2', 'CASETA-2', '7', 'ESTANQUE-7', 'FIP 4', 'FIP-4', 5000, '5000', 'CENTRO 3 P21 P20 P24'),
  (41, '22', 'CASETA 2', 'CASETA-2', '4', 'ESTANQUE-4', 'FIP 1', 'FIP-1', 3000, '3000', 'CENTRO 1 P22 LN LS'),
  (42, '22', 'CASETA 2', 'CASETA-2', '12', 'ESTANQUE-12', 'FIP 2', 'FIP-2', 5000, '5000', 'CENTRO 1 P22 LN LS'),
  (43, '22', 'CASETA 2', 'CASETA-2', '11', 'ESTANQUE-11', 'FIP 3', 'FIP-3', 3000, '3000', 'CENTRO 1 P22 LN LS'),
  (44, '22', 'CASETA 2', 'CASETA-2', '8', 'ESTANQUE-8', 'FIP 4', 'FIP-4', 3000, '3000', 'CENTRO 1 P22 LN LS'),
  (45, '23', 'CASETA 2', 'CASETA-2', '4', 'ESTANQUE-4', 'FIP 1', 'FIP-1', 3000, '3000', 'CENTRO 1 P22 LN LS'),
  (46, '23', 'CASETA 2', 'CASETA-2', '12', 'ESTANQUE-12', 'FIP 2', 'FIP-2', 5000, '5000', 'CENTRO 1 P22 LN LS'),
  (47, '23', 'CASETA 2', 'CASETA-2', '11', 'ESTANQUE-11', 'FIP 3', 'FIP-3', 3000, '3000', 'CENTRO 1 P22 LN LS'),
  (48, '23', 'CASETA 2', 'CASETA-2', '8', 'ESTANQUE-8', 'FIP 4', 'FIP-4', 3000, '3000', 'CENTRO 1 P22 LN LS'),
  (49, '24', 'CASETA 2', 'CASETA-2', '2', 'ESTANQUE-2', 'FIP 1', 'FIP-1', 5000, '5000', 'CENTRO 3 P21 P20 P24'),
  (50, '24', 'CASETA 2', 'CASETA-2', '1', 'ESTANQUE-1', 'FIP 2', 'FIP-2', 5000, '5000', 'CENTRO 3 P21 P20 P24'),
  (51, '24', 'CASETA 2', 'CASETA-2', '6', 'ESTANQUE-6', 'FIP 3', 'FIP-3', 5000, '5000', 'CENTRO 3 P21 P20 P24'),
  (52, '24', 'CASETA 2', 'CASETA-2', '7', 'ESTANQUE-7', 'FIP 4', 'FIP-4', 5000, '5000', 'CENTRO 3 P21 P20 P24'),
  (53, '25', 'CASETA 2', 'CASETA-2', '2', 'ESTANQUE-2', 'FIP 1', 'FIP-1', 5000, '5000', 'CENTRO 2 P25'),
  (54, '25', 'CASETA 2', 'CASETA-2', '1', 'ESTANQUE-1', 'FIP 2', 'FIP-2', 5000, '5000', 'CENTRO 2 P25'),
  (55, '25', 'CASETA 2', 'CASETA-2', '6', 'ESTANQUE-6', 'FIP 3', 'FIP-3', 5000, '5000', 'CENTRO 2 P25'),
  (56, '25', 'CASETA 2', 'CASETA-2', '7', 'ESTANQUE-7', 'FIP 4', 'FIP-4', 5000, '5000', 'CENTRO 2 P25'),
  (57, '20A', 'CASETA 2', 'CASETA-2', '2', 'ESTANQUE-2', 'FIP 1', 'FIP-1', 5000, '5000', 'CENTRO 3 P21 P20 P24'),
  (58, '20A', 'CASETA 2', 'CASETA-2', '1', 'ESTANQUE-1', 'FIP 2', 'FIP-2', 5000, '5000', 'CENTRO 3 P21 P20 P24'),
  (59, '20A', 'CASETA 2', 'CASETA-2', '6', 'ESTANQUE-6', 'FIP 3', 'FIP-3', 5000, '5000', 'CENTRO 3 P21 P20 P24'),
  (60, '20A', 'CASETA 2', 'CASETA-2', '7', 'ESTANQUE-7', 'FIP 4', 'FIP-4', 5000, '5000', 'CENTRO 3 P21 P20 P24'),
  (61, '20B', 'CASETA 2', 'CASETA-2', '2', 'ESTANQUE-2', 'FIP 1', 'FIP-1', 5000, '5000', 'CENTRO 3 P21 P20 P24'),
  (62, '20B', 'CASETA 2', 'CASETA-2', '1', 'ESTANQUE-1', 'FIP 2', 'FIP-2', 5000, '5000', 'CENTRO 3 P21 P20 P24'),
  (63, '20B', 'CASETA 2', 'CASETA-2', '6', 'ESTANQUE-6', 'FIP 3', 'FIP-3', 5000, '5000', 'CENTRO 3 P21 P20 P24'),
  (64, '20B', 'CASETA 2', 'CASETA-2', '7', 'ESTANQUE-7', 'FIP 4', 'FIP-4', 5000, '5000', 'CENTRO 3 P21 P20 P24'),
  (65, 'D', 'CASETA 2', 'CASETA-2', '3', 'ESTANQUE-3', 'FIP 1', 'FIP-1', 3000, '3000', 'CENTRO 4 P26'),
  (66, 'D', 'CASETA 2', 'CASETA-2', '9', 'ESTANQUE-9', 'FIP 2', 'FIP-2', 5000, '5000 - 5000', 'CENTRO 4 P26'),
  (67, 'D', 'CASETA 2', 'CASETA-2', '5', 'ESTANQUE-5', 'FIP 3', 'FIP-3', 2000, '2000', 'CENTRO 4 P26'),
  (68, 'E', 'CASETA 2', 'CASETA-2', '3', 'ESTANQUE-3', 'FIP 1', 'FIP-1', 3000, '3000', 'CENTRO 4 P26'),
  (69, 'E', 'CASETA 2', 'CASETA-2', '9', 'ESTANQUE-9', 'FIP 2', 'FIP-2', 5000, '5000 - 5000', 'CENTRO 4 P26'),
  (70, 'E', 'CASETA 2', 'CASETA-2', '5', 'ESTANQUE-5', 'FIP 3', 'FIP-3', 2000, '2000', 'CENTRO 4 P26'),
  (71, 'F', 'CASETA 2', 'CASETA-2', '3', 'ESTANQUE-3', 'FIP 1', 'FIP-1', 3000, '3000', 'CENTRO 4 P26'),
  (72, 'F', 'CASETA 2', 'CASETA-2', '9', 'ESTANQUE-9', 'FIP 2', 'FIP-2', 5000, '5000 - 5000', 'CENTRO 4 P26'),
  (73, 'F', 'CASETA 2', 'CASETA-2', '5', 'ESTANQUE-5', 'FIP 3', 'FIP-3', 2000, '2000', 'CENTRO 4 P26'),
  (74, 'G', 'CASETA 2', 'CASETA-2', '3', 'ESTANQUE-3', 'FIP 1', 'FIP-1', 3000, '3000', 'CENTRO 4 P26'),
  (75, 'G', 'CASETA 2', 'CASETA-2', '9', 'ESTANQUE-9', 'FIP 2', 'FIP-2', 5000, '5000 - 5000', 'CENTRO 4 P26'),
  (76, 'G', 'CASETA 2', 'CASETA-2', '5', 'ESTANQUE-5', 'FIP 3', 'FIP-3', 2000, '2000', 'CENTRO 4 P26'),
  (77, 'H', 'CASETA 3', 'CASETA-3', '1', 'ESTANQUE-1', 'FIP 1', 'FIP-1', 5000, '5000', 'CENTRO 1 T3'),
  (78, 'H', 'CASETA 3', 'CASETA-3', '2', 'ESTANQUE-2', 'FIP 2', 'FIP-2', 4000, '4000', 'CENTRO 1 T3'),
  (79, 'H', 'CASETA 3', 'CASETA-3', '3', 'ESTANQUE-3', 'FIP 3', 'FIP-3', 8000, '8000', 'CENTRO 1 T3'),
  (80, 'I', 'CASETA 3', 'CASETA-3', '1', 'ESTANQUE-1', 'FIP 1', 'FIP-1', 5000, '5000', 'CENTRO 1 T3'),
  (81, 'I', 'CASETA 3', 'CASETA-3', '2', 'ESTANQUE-2', 'FIP 2', 'FIP-2', 4000, '4000', 'CENTRO 1 T3'),
  (82, 'I', 'CASETA 3', 'CASETA-3', '3', 'ESTANQUE-3', 'FIP 3', 'FIP-3', 8000, '8000', 'CENTRO 1 T3'),
  (83, 'J', 'CASETA 3', 'CASETA-3', '1', 'ESTANQUE-1', 'FIP 1', 'FIP-1', 5000, '5000', 'CENTRO 1 T3'),
  (84, 'J', 'CASETA 3', 'CASETA-3', '2', 'ESTANQUE-2', 'FIP 2', 'FIP-2', 4000, '4000', 'CENTRO 1 T3'),
  (85, 'J', 'CASETA 3', 'CASETA-3', '3', 'ESTANQUE-3', 'FIP 3', 'FIP-3', 8000, '8000', 'CENTRO 1 T3'),
  (86, '27 GRAV', 'CASETA 4', 'CASETA-4', '1', 'ESTANQUE-1', 'FIP1 G', 'FIP1-G', 2000, '2000', 'CENTRO GRAV'),
  (87, '27 GRAV', 'CASETA 4', 'CASETA-4', '2', 'ESTANQUE-2', 'FIP2 G', 'FIP2-G', 5000, '5000', 'CENTRO GRAV'),
  (88, '27 GRAV', 'CASETA 4', 'CASETA-4', '3', 'ESTANQUE-3', 'FIP 3 G', 'FIP-3-G', 5000, '5000', 'CENTRO GRAV'),
  (89, '27 GRAV', 'CASETA 4', 'CASETA-4', '4', 'ESTANQUE-4', 'FIP4 G', 'FIP4-G', 2400, '2400', 'CENTRO GRAV'),
  (90, '27 IMP', 'CASETA 4', 'CASETA-4', '1', 'ESTANQUE-1', 'FIP1 I', 'FIP1-I', 2000, '2000', 'CENTRO IMP'),
  (91, '27 IMP', 'CASETA 4', 'CASETA-4', '2', 'ESTANQUE-2', 'FIP2 I', 'FIP2-I', 5000, '5000', 'CENTRO IMP'),
  (92, '27 IMP', 'CASETA 4', 'CASETA-4', '3', 'ESTANQUE-3', 'FIP 3 I', 'FIP-3-I', 5000, '5000', 'CENTRO IMP'),
  (93, '27 IMP', 'CASETA 4', 'CASETA-4', '4', 'ESTANQUE-4', 'FIP4 I', 'FIP4-I', 2400, '2400', 'CENTRO IMP'),
  (94, '5', 'CASETA 5', 'CASETA-5', 'MANUAL', 'ESTANQUE-MANUAL', 'MANUAL', 'MANUAL', 1000, '1000', 'APLICACIÓN MANUAL'),
  (95, '6', 'CASETA 5', 'CASETA-5', 'MANUAL', 'ESTANQUE-MANUAL', 'MANUAL', 'MANUAL', 1000, '1000', 'APLICACIÓN MANUAL'),
  (96, '19', 'CASETA 5', 'CASETA-5', 'MANUAL', 'ESTANQUE-MANUAL', 'MANUAL', 'MANUAL', 1000, '1000', 'APLICACIÓN MANUAL'),
  (97, 'Mirador 2', 'CASETA 6', 'CASETA-6', '1', 'ESTANQUE-1', 'FIP 1', 'FIP-1', 2000, '2000', 'CENTRO 1 M2'),
  (98, 'Mirador 2', 'CASETA 6', 'CASETA-6', '2', 'ESTANQUE-2', 'FIP 2', 'FIP-2', 5000, '5000', 'CENTRO 1 M2'),
  (99, 'Mirador 2', 'CASETA 6', 'CASETA-6', '3', 'ESTANQUE-3', 'FIP 3', 'FIP-3', 5000, '5000', 'CENTRO 1 M2'),
  (100, '7', 'CASETA 7', 'CASETA-7', '1', 'ESTANQUE-1', 'FIP 1', 'FIP-1', 3000, '3000', 'CENTRO P7'),
  (101, '7', 'CASETA 7', 'CASETA-7', '2', 'ESTANQUE-2', 'FIP 2', 'FIP-2', 3000, '3000', 'CENTRO P7'),
  (102, '7', 'CASETA 7', 'CASETA-7', '3', 'ESTANQUE-3', 'FIP 3', 'FIP-3', 5000, '5000', 'CENTRO P7'),
  (103, '29', 'CASETA 8', 'CASETA-8', '1', 'ESTANQUE-1', 'FIP 1', 'FIP-1', 1000, '1000', 'CENTRO P29 PEUMO'),
  (104, '29', 'CASETA 8', 'CASETA-8', '2', 'ESTANQUE-2', 'FIP 2', 'FIP-2', 3000, '3000', 'CENTRO P29 PEUMO'),
  (105, '29', 'CASETA 8', 'CASETA-8', '3', 'ESTANQUE-3', 'FIP 3', 'FIP-3', 3000, '3000', 'CENTRO P29 PEUMO'),
  (106, '28', 'CASETA 9', 'CASETA-9', '1', 'ESTANQUE-1', 'FIP 1', 'FIP-1', 3000, '3000', 'CENTRO CV'),
  (107, '28', 'CASETA 9', 'CASETA-9', '2', 'ESTANQUE-2', 'FIP 2', 'FIP-2', 3000, '3000', 'CENTRO CV'),
  (108, '28', 'CASETA 9', 'CASETA-9', '3', 'ESTANQUE-3', 'FIP 3', 'FIP-3', 1000, '1000', 'CENTRO CV');

-- 1) Consolida la fuente: un estanque unico por caseta + numero.
drop table if exists tmp_fert_estanques_unicos;
create temporary table tmp_fert_estanques_unicos on commit drop as
select
  caseta_key,
  min(caseta) as caseta,
  numero_estanque_normalizado,
  min(numero_estanque) as numero_estanque,
  string_agg(distinct fip, ' / ' order by fip) as fip,
  string_agg(distinct fip_normalizado, '--' order by fip_normalizado) as fip_normalizado,
  max(volumen_maximo_litros) as volumen_maximo_litros,
  string_agg(distinct volumen_origen, ' / ' order by volumen_origen) as volumen_origen
from tmp_fert_estanques_potrero
group by caseta_key, numero_estanque_normalizado;

-- 2) Casetas maestras.
insert into public.fertilizante_casetas (nombre, nombre_normalizado, activo)
select distinct caseta, caseta_key, true
from tmp_fert_estanques_unicos
on conflict (nombre_normalizado) do update set
  nombre = excluded.nombre,
  activo = true,
  actualizado_en = now();

-- 3) Une estanques duplicados existentes y conserva sus preparaciones, aplicaciones y potreros.
drop table if exists tmp_fert_estanque_merge;
create temporary table tmp_fert_estanque_merge on commit drop as
with scored as (
  select
    e.id,
    e.caseta_id,
    e.numero_estanque_normalizado,
    e.creado_en,
    (
      (select count(*) from public.fertilizante_preparaciones p where p.estanque_id = e.id)
      + (select count(*) from public.fertilizante_aplicaciones a where a.estanque_id = e.id)
    ) as movimientos
  from public.fertilizante_estanques e
), ranked as (
  select
    id as old_id,
    first_value(id) over (
      partition by caseta_id, numero_estanque_normalizado
      order by movimientos desc, creado_en asc, id::text
    ) as keep_id
  from scored
)
select old_id, keep_id
from ranked
where old_id <> keep_id;

update public.fertilizante_preparaciones p
set estanque_id = m.keep_id
from tmp_fert_estanque_merge m
where p.estanque_id = m.old_id;

update public.fertilizante_aplicaciones a
set estanque_id = m.keep_id
from tmp_fert_estanque_merge m
where a.estanque_id = m.old_id;

insert into public.fertilizante_estanque_potreros (estanque_id, campo_id, potrero, activo, creado_en)
select distinct on (m.keep_id, ep.potrero)
  m.keep_id,
  ep.campo_id,
  ep.potrero,
  ep.activo,
  ep.creado_en
from public.fertilizante_estanque_potreros ep
join tmp_fert_estanque_merge m on m.old_id = ep.estanque_id
order by m.keep_id, ep.potrero, ep.activo desc, ep.creado_en asc
on conflict (estanque_id, potrero) do update set
  campo_id = coalesce(excluded.campo_id, public.fertilizante_estanque_potreros.campo_id),
  activo = public.fertilizante_estanque_potreros.activo or excluded.activo;

delete from public.fertilizante_estanque_potreros ep
using tmp_fert_estanque_merge m
where ep.estanque_id = m.old_id;

delete from public.fertilizante_estanques e
using tmp_fert_estanque_merge m
where e.id = m.old_id;

alter table public.fertilizante_estanques
  drop constraint if exists fertilizante_estanques_unq;
alter table public.fertilizante_estanques
  drop constraint if exists fertilizante_estanques_caseta_numero_unq;
alter table public.fertilizante_estanques
  add constraint fertilizante_estanques_caseta_numero_unq
  unique (caseta_id, numero_estanque_normalizado);

-- 4) Inserta o actualiza los 46 estanques unicos del Excel.
insert into public.fertilizante_estanques (
  caseta_id,
  numero_estanque,
  numero_estanque_normalizado,
  fip,
  fip_normalizado,
  volumen_maximo_litros,
  volumen_origen,
  activo
)
select
  c.id,
  s.numero_estanque,
  s.numero_estanque_normalizado,
  s.fip,
  s.fip_normalizado,
  s.volumen_maximo_litros,
  s.volumen_origen,
  true
from tmp_fert_estanques_unicos s
join public.fertilizante_casetas c on c.nombre_normalizado = s.caseta_key
on conflict (caseta_id, numero_estanque_normalizado) do update set
  numero_estanque = excluded.numero_estanque,
  fip = excluded.fip,
  fip_normalizado = excluded.fip_normalizado,
  volumen_maximo_litros = excluded.volumen_maximo_litros,
  volumen_origen = excluded.volumen_origen,
  activo = true,
  actualizado_en = now();

-- 5) Oculta estanques de estas casetas que ya no aparecen en el Excel.
update public.fertilizante_estanques e
set activo = false, actualizado_en = now()
from public.fertilizante_casetas c
where e.caseta_id = c.id
  and c.nombre_normalizado in (select distinct caseta_key from tmp_fert_estanques_unicos)
  and not exists (
    select 1
    from tmp_fert_estanques_unicos s
    where s.caseta_key = c.nombre_normalizado
      and s.numero_estanque_normalizado = e.numero_estanque_normalizado
  );

-- 6) Relacion estanque -> todos los potreros beneficiados segun el Excel.
insert into public.fertilizante_estanque_potreros (estanque_id, campo_id, potrero, activo)
select distinct e.id, campos.id, s.potrero, true
from tmp_fert_estanques_potrero s
join public.fertilizante_casetas c on c.nombre_normalizado = s.caseta_key
join public.fertilizante_estanques e
  on e.caseta_id = c.id
  and e.numero_estanque_normalizado = s.numero_estanque_normalizado
left join lateral (
  select id
  from public.campos
  where lower(trim(potrero)) = lower(trim(s.potrero))
    and activo
  order by bloque asc, id
  limit 1
) campos on true
where e.activo
on conflict (estanque_id, potrero) do update set
  campo_id = excluded.campo_id,
  activo = true;

-- 7) Oculta relaciones antiguas que ya no aparecen en el Excel.
update public.fertilizante_estanque_potreros ep
set activo = false
from public.fertilizante_estanques e
join public.fertilizante_casetas c on c.id = e.caseta_id
where ep.estanque_id = e.id
  and c.nombre_normalizado in (select distinct caseta_key from tmp_fert_estanques_unicos)
  and not exists (
    select 1
    from tmp_fert_estanques_potrero s
    where s.caseta_key = c.nombre_normalizado
      and s.numero_estanque_normalizado = e.numero_estanque_normalizado
      and lower(trim(s.potrero)) = lower(trim(ep.potrero))
  );

-- 8) Vista expandida: estanque -> potrero -> todos los bloques activos heredados desde public.campos.
create or replace view public.v_fertilizante_estanque_campos as
select
  e.id as estanque_id,
  e.caseta_id,
  cst.nombre as caseta,
  e.numero_estanque,
  e.numero_estanque_normalizado,
  e.fip,
  e.fip_normalizado,
  e.volumen_maximo_litros,
  ep.potrero,
  campos.id as campo_id,
  campos.bloque,
  campos.especie,
  campos.variedad,
  campos.hectareas,
  campos.plantas
from public.fertilizante_estanques e
join public.fertilizante_casetas cst on cst.id = e.caseta_id
join public.fertilizante_estanque_potreros ep on ep.estanque_id = e.id and ep.activo
join public.campos campos
  on lower(trim(campos.potrero)) = lower(trim(ep.potrero))
  and campos.activo
where e.activo;

grant select on public.v_fertilizante_estanque_campos to authenticated;

-- 9) Reporte de revision: estos potreros del Excel no tienen match en public.campos.
select distinct s.potrero as potrero_excel_sin_match_campos
from tmp_fert_estanques_potrero s
where not exists (
  select 1 from public.campos c
  where lower(trim(c.potrero)) = lower(trim(s.potrero))
    and c.activo
)
order by s.potrero;

-- 10) Reporte visual final: debe devolver 46 filas, una por caseta + numero de estanque.
select caseta, numero_estanque, fip, volumen_maximo_litros, litros_actuales, potreros
from public.v_fertilizante_estado_estanques
where activo
order by caseta, numero_estanque;

commit;
