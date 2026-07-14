-- Importacion inicial de casetas y estanques de fertilizacion.
-- Fuente: C:\Users\PC\Documents\bd fertilizacion.xlsx
-- Ejecutar despues de supabase_fertilizacion.sql.

begin;

with source(nombre, nombre_normalizado) as (values
  ('CASETA 1', 'CASETA-1'),
  ('CASETA 10', 'CASETA-10'),
  ('CASETA 11', 'CASETA-11'),
  ('CASETA 12', 'CASETA-12'),
  ('CASETA 2', 'CASETA-2'),
  ('CASETA 3', 'CASETA-3'),
  ('CASETA 4', 'CASETA-4'),
  ('CASETA 5', 'CASETA-5'),
  ('CASETA 6', 'CASETA-6'),
  ('CASETA 7', 'CASETA-7'),
  ('CASETA 8', 'CASETA-8'),
  ('CASETA 9', 'CASETA-9')
)
insert into public.fertilizante_casetas (nombre, nombre_normalizado)
select nombre, nombre_normalizado from source
on conflict (nombre_normalizado) do update set nombre = excluded.nombre, activo = true, actualizado_en = now();

with source(caseta_key, numero_estanque, numero_estanque_normalizado, fip, fip_normalizado, volumen_maximo_litros, volumen_origen) as (values
  ('CASETA-1', 'Estanque 1', 'ESTANQUE-1', 'FIP 1', 'FIP-1', 3000, '3000'),
  ('CASETA-1', 'Estanque 1', 'ESTANQUE-1', 'FIP 1', 'FIP-1', 5000, '5000'),
  ('CASETA-1', 'Estanque 1', 'ESTANQUE-1', 'FIP 2', 'FIP-2', 2000, '2000'),
  ('CASETA-1', 'Estanque 1', 'ESTANQUE-1', 'FIP 3', 'FIP-3', 3000, '3000'),
  ('CASETA-1', 'Estanque 2', 'ESTANQUE-2', 'FIP 2', 'FIP-2', 5000, '5000'),
  ('CASETA-1', 'Estanque 3', 'ESTANQUE-3', 'FIP 3', 'FIP-3', 1000, '1000'),
  ('CASETA-10', 'Estanque 1', 'ESTANQUE-1', 'FIP 1', 'FIP-1', 3000, '3000'),
  ('CASETA-10', 'Estanque 2', 'ESTANQUE-2', 'FIP 2', 'FIP-2', 2000, '2000'),
  ('CASETA-10', 'Estanque 3', 'ESTANQUE-3', 'FIP 3', 'FIP-3', 3000, '3000'),
  ('CASETA-10', 'Estanque 4', 'ESTANQUE-4', 'FIP 4', 'FIP-4', 3000, '3000'),
  ('CASETA-11', 'Manual', 'MANUAL', 'MANUAL', 'MANUAL', 200, '200'),
  ('CASETA-12', 'Estanque 1', 'ESTANQUE-1', 'FIP 1', 'FIP-1', 5000, '5000'),
  ('CASETA-12', 'Estanque 2', 'ESTANQUE-2', 'FIP 2', 'FIP-2', 5000, '5000'),
  ('CASETA-12', 'Estanque 3', 'ESTANQUE-3', 'FIP 3', 'FIP-3', 5000, '5000'),
  ('CASETA-12', 'Estanque 4', 'ESTANQUE-4', 'FIP 4', 'FIP-4', 2000, '2000'),
  ('CASETA-2', 'Estanque 1', 'ESTANQUE-1', 'FIP 2', 'FIP-2', 5000, '5000'),
  ('CASETA-2', 'Estanque 11', 'ESTANQUE-11', 'FIP 3', 'FIP-3', 3000, '3000'),
  ('CASETA-2', 'Estanque 12', 'ESTANQUE-12', 'FIP 2', 'FIP-2', 5000, '5000'),
  ('CASETA-2', 'Estanque 2', 'ESTANQUE-2', 'FIP 1', 'FIP-1', 5000, '5000'),
  ('CASETA-2', 'Estanque 3', 'ESTANQUE-3', 'FIP 1', 'FIP-1', 3000, '3000'),
  ('CASETA-2', 'Estanque 4', 'ESTANQUE-4', 'FIP 1', 'FIP-1', 3000, '3000'),
  ('CASETA-2', 'Estanque 5', 'ESTANQUE-5', 'FIP 3', 'FIP-3', 2000, '2000'),
  ('CASETA-2', 'Estanque 6', 'ESTANQUE-6', 'FIP 3', 'FIP-3', 5000, '5000'),
  ('CASETA-2', 'Estanque 7', 'ESTANQUE-7', 'FIP 4', 'FIP-4', 5000, '5000'),
  ('CASETA-2', 'Estanque 8', 'ESTANQUE-8', 'FIP 4', 'FIP-4', 3000, '3000'),
  ('CASETA-2', 'Estanque 9-10', 'ESTANQUE-9-10', 'FIP 2', 'FIP-2', 10000, '5000 - 5000'),
  ('CASETA-3', 'Estanque 1', 'ESTANQUE-1', 'FIP 1', 'FIP-1', 5000, '5000'),
  ('CASETA-3', 'Estanque 2', 'ESTANQUE-2', 'FIP 2', 'FIP-2', 4000, '4000'),
  ('CASETA-3', 'Estanque 3', 'ESTANQUE-3', 'FIP 3', 'FIP-3', 8000, '8000'),
  ('CASETA-4', 'Estanque 1', 'ESTANQUE-1', 'FIP1 G', 'FIP1-G', 2000, '2000'),
  ('CASETA-4', 'Estanque 1', 'ESTANQUE-1', 'FIP1 I', 'FIP1-I', 2000, '2000'),
  ('CASETA-4', 'Estanque 2', 'ESTANQUE-2', 'FIP2 G', 'FIP2-G', 5000, '5000'),
  ('CASETA-4', 'Estanque 2', 'ESTANQUE-2', 'FIP2 I', 'FIP2-I', 5000, '5000'),
  ('CASETA-4', 'Estanque 3', 'ESTANQUE-3', 'FIP 3 G', 'FIP-3-G', 5000, '5000'),
  ('CASETA-4', 'Estanque 3', 'ESTANQUE-3', 'FIP 3 I', 'FIP-3-I', 5000, '5000'),
  ('CASETA-4', 'Estanque 4', 'ESTANQUE-4', 'FIP4 G', 'FIP4-G', 2400, '2400'),
  ('CASETA-4', 'Estanque 4', 'ESTANQUE-4', 'FIP4 I', 'FIP4-I', 2400, '2400'),
  ('CASETA-5', 'Manual', 'MANUAL', 'MANUAL', 'MANUAL', 1000, '1000'),
  ('CASETA-6', 'Estanque 1', 'ESTANQUE-1', 'FIP 1', 'FIP-1', 2000, '2000'),
  ('CASETA-6', 'Estanque 2', 'ESTANQUE-2', 'FIP 2', 'FIP-2', 5000, '5000'),
  ('CASETA-6', 'Estanque 3', 'ESTANQUE-3', 'FIP 3', 'FIP-3', 5000, '5000'),
  ('CASETA-7', 'Estanque 1', 'ESTANQUE-1', 'FIP 1', 'FIP-1', 3000, '3000'),
  ('CASETA-7', 'Estanque 2', 'ESTANQUE-2', 'FIP 2', 'FIP-2', 3000, '3000'),
  ('CASETA-7', 'Estanque 3', 'ESTANQUE-3', 'FIP 3', 'FIP-3', 5000, '5000'),
  ('CASETA-8', 'Estanque 1', 'ESTANQUE-1', 'FIP 1', 'FIP-1', 1000, '1000'),
  ('CASETA-8', 'Estanque 2', 'ESTANQUE-2', 'FIP 2', 'FIP-2', 3000, '3000'),
  ('CASETA-8', 'Estanque 3', 'ESTANQUE-3', 'FIP 3', 'FIP-3', 3000, '3000'),
  ('CASETA-9', 'Estanque 1', 'ESTANQUE-1', 'FIP 1', 'FIP-1', 3000, '3000'),
  ('CASETA-9', 'Estanque 2', 'ESTANQUE-2', 'FIP 2', 'FIP-2', 3000, '3000'),
  ('CASETA-9', 'Estanque 3', 'ESTANQUE-3', 'FIP 3', 'FIP-3', 1000, '1000')
)
insert into public.fertilizante_estanques (caseta_id, numero_estanque, numero_estanque_normalizado, fip, fip_normalizado, volumen_maximo_litros, volumen_origen)
select c.id, s.numero_estanque, s.numero_estanque_normalizado, s.fip, s.fip_normalizado, s.volumen_maximo_litros::numeric, s.volumen_origen
from source s
join public.fertilizante_casetas c on c.nombre_normalizado = s.caseta_key
on conflict (caseta_id, numero_estanque_normalizado, fip_normalizado, volumen_maximo_litros) do update set
  numero_estanque = excluded.numero_estanque,
  fip = excluded.fip,
  volumen_origen = excluded.volumen_origen,
  activo = true,
  actualizado_en = now();

with source(caseta_key, numero_estanque, numero_estanque_normalizado, fip, fip_normalizado, volumen_maximo_litros, potrero) as (values
  ('CASETA-1', 'Estanque 1', 'ESTANQUE-1', 'FIP 1', 'FIP-1', 5000, '1'),
  ('CASETA-1', 'Estanque 2', 'ESTANQUE-2', 'FIP 2', 'FIP-2', 5000, '1'),
  ('CASETA-1', 'Estanque 3', 'ESTANQUE-3', 'FIP 3', 'FIP-3', 1000, '1'),
  ('CASETA-2', 'Estanque 2', 'ESTANQUE-2', 'FIP 1', 'FIP-1', 5000, '25'),
  ('CASETA-2', 'Estanque 1', 'ESTANQUE-1', 'FIP 2', 'FIP-2', 5000, '25'),
  ('CASETA-2', 'Estanque 6', 'ESTANQUE-6', 'FIP 3', 'FIP-3', 5000, '25'),
  ('CASETA-2', 'Estanque 7', 'ESTANQUE-7', 'FIP 4', 'FIP-4', 5000, '25'),
  ('CASETA-8', 'Estanque 1', 'ESTANQUE-1', 'FIP 1', 'FIP-1', 1000, '29'),
  ('CASETA-8', 'Estanque 2', 'ESTANQUE-2', 'FIP 2', 'FIP-2', 3000, '29'),
  ('CASETA-8', 'Estanque 3', 'ESTANQUE-3', 'FIP 3', 'FIP-3', 3000, '29'),
  ('CASETA-11', 'Manual', 'MANUAL', 'MANUAL', 'MANUAL', 200, '10'),
  ('CASETA-1', 'Estanque 1', 'ESTANQUE-1', 'FIP 1', 'FIP-1', 5000, '2'),
  ('CASETA-1', 'Estanque 2', 'ESTANQUE-2', 'FIP 2', 'FIP-2', 5000, '2'),
  ('CASETA-1', 'Estanque 3', 'ESTANQUE-3', 'FIP 3', 'FIP-3', 1000, '2'),
  ('CASETA-2', 'Estanque 2', 'ESTANQUE-2', 'FIP 1', 'FIP-1', 5000, '20'),
  ('CASETA-2', 'Estanque 1', 'ESTANQUE-1', 'FIP 2', 'FIP-2', 5000, '20'),
  ('CASETA-2', 'Estanque 6', 'ESTANQUE-6', 'FIP 3', 'FIP-3', 5000, '20'),
  ('CASETA-2', 'Estanque 7', 'ESTANQUE-7', 'FIP 4', 'FIP-4', 5000, '20'),
  ('CASETA-2', 'Estanque 2', 'ESTANQUE-2', 'FIP 1', 'FIP-1', 5000, '20A'),
  ('CASETA-2', 'Estanque 1', 'ESTANQUE-1', 'FIP 2', 'FIP-2', 5000, '20A'),
  ('CASETA-2', 'Estanque 6', 'ESTANQUE-6', 'FIP 3', 'FIP-3', 5000, '20A'),
  ('CASETA-2', 'Estanque 7', 'ESTANQUE-7', 'FIP 4', 'FIP-4', 5000, '20A'),
  ('CASETA-2', 'Estanque 2', 'ESTANQUE-2', 'FIP 1', 'FIP-1', 5000, '20B'),
  ('CASETA-2', 'Estanque 1', 'ESTANQUE-1', 'FIP 2', 'FIP-2', 5000, '20B'),
  ('CASETA-2', 'Estanque 6', 'ESTANQUE-6', 'FIP 3', 'FIP-3', 5000, '20B'),
  ('CASETA-2', 'Estanque 7', 'ESTANQUE-7', 'FIP 4', 'FIP-4', 5000, '20B'),
  ('CASETA-2', 'Estanque 2', 'ESTANQUE-2', 'FIP 1', 'FIP-1', 5000, '21'),
  ('CASETA-2', 'Estanque 1', 'ESTANQUE-1', 'FIP 2', 'FIP-2', 5000, '21'),
  ('CASETA-2', 'Estanque 6', 'ESTANQUE-6', 'FIP 3', 'FIP-3', 5000, '21'),
  ('CASETA-2', 'Estanque 7', 'ESTANQUE-7', 'FIP 4', 'FIP-4', 5000, '21'),
  ('CASETA-2', 'Estanque 4', 'ESTANQUE-4', 'FIP 1', 'FIP-1', 3000, '22'),
  ('CASETA-2', 'Estanque 12', 'ESTANQUE-12', 'FIP 2', 'FIP-2', 5000, '22'),
  ('CASETA-2', 'Estanque 11', 'ESTANQUE-11', 'FIP 3', 'FIP-3', 3000, '22'),
  ('CASETA-2', 'Estanque 8', 'ESTANQUE-8', 'FIP 4', 'FIP-4', 3000, '22'),
  ('CASETA-2', 'Estanque 2', 'ESTANQUE-2', 'FIP 1', 'FIP-1', 5000, '24'),
  ('CASETA-2', 'Estanque 1', 'ESTANQUE-1', 'FIP 2', 'FIP-2', 5000, '24'),
  ('CASETA-2', 'Estanque 6', 'ESTANQUE-6', 'FIP 3', 'FIP-3', 5000, '24'),
  ('CASETA-2', 'Estanque 7', 'ESTANQUE-7', 'FIP 4', 'FIP-4', 5000, '24'),
  ('CASETA-4', 'Estanque 1', 'ESTANQUE-1', 'FIP1 G', 'FIP1-G', 2000, '27 GRAV'),
  ('CASETA-4', 'Estanque 2', 'ESTANQUE-2', 'FIP2 G', 'FIP2-G', 5000, '27 GRAV'),
  ('CASETA-4', 'Estanque 3', 'ESTANQUE-3', 'FIP 3 G', 'FIP-3-G', 5000, '27 GRAV'),
  ('CASETA-4', 'Estanque 4', 'ESTANQUE-4', 'FIP4 G', 'FIP4-G', 2400, '27 GRAV'),
  ('CASETA-4', 'Estanque 1', 'ESTANQUE-1', 'FIP1 I', 'FIP1-I', 2000, '27 IMP'),
  ('CASETA-4', 'Estanque 2', 'ESTANQUE-2', 'FIP2 I', 'FIP2-I', 5000, '27 IMP'),
  ('CASETA-4', 'Estanque 3', 'ESTANQUE-3', 'FIP 3 I', 'FIP-3-I', 5000, '27 IMP'),
  ('CASETA-4', 'Estanque 4', 'ESTANQUE-4', 'FIP4 I', 'FIP4-I', 2400, '27 IMP'),
  ('CASETA-9', 'Estanque 1', 'ESTANQUE-1', 'FIP 1', 'FIP-1', 3000, '28'),
  ('CASETA-9', 'Estanque 2', 'ESTANQUE-2', 'FIP 2', 'FIP-2', 3000, '28'),
  ('CASETA-9', 'Estanque 3', 'ESTANQUE-3', 'FIP 3', 'FIP-3', 1000, '28'),
  ('CASETA-10', 'Estanque 1', 'ESTANQUE-1', 'FIP 1', 'FIP-1', 3000, '30'),
  ('CASETA-10', 'Estanque 2', 'ESTANQUE-2', 'FIP 2', 'FIP-2', 2000, '30'),
  ('CASETA-10', 'Estanque 3', 'ESTANQUE-3', 'FIP 3', 'FIP-3', 3000, '30'),
  ('CASETA-10', 'Estanque 4', 'ESTANQUE-4', 'FIP 4', 'FIP-4', 3000, '30'),
  ('CASETA-7', 'Estanque 1', 'ESTANQUE-1', 'FIP 1', 'FIP-1', 3000, '7'),
  ('CASETA-7', 'Estanque 2', 'ESTANQUE-2', 'FIP 2', 'FIP-2', 3000, '7'),
  ('CASETA-7', 'Estanque 3', 'ESTANQUE-3', 'FIP 3', 'FIP-3', 5000, '7'),
  ('CASETA-5', 'Manual', 'MANUAL', 'MANUAL', 'MANUAL', 1000, '19'),
  ('CASETA-2', 'Estanque 4', 'ESTANQUE-4', 'FIP 1', 'FIP-1', 3000, '23'),
  ('CASETA-2', 'Estanque 12', 'ESTANQUE-12', 'FIP 2', 'FIP-2', 5000, '23'),
  ('CASETA-2', 'Estanque 11', 'ESTANQUE-11', 'FIP 3', 'FIP-3', 3000, '23'),
  ('CASETA-2', 'Estanque 8', 'ESTANQUE-8', 'FIP 4', 'FIP-4', 3000, '23'),
  ('CASETA-5', 'Manual', 'MANUAL', 'MANUAL', 'MANUAL', 1000, '5'),
  ('CASETA-5', 'Manual', 'MANUAL', 'MANUAL', 'MANUAL', 1000, '6'),
  ('CASETA-2', 'Estanque 3', 'ESTANQUE-3', 'FIP 1', 'FIP-1', 3000, 'D'),
  ('CASETA-2', 'Estanque 9-10', 'ESTANQUE-9-10', 'FIP 2', 'FIP-2', 10000, 'D'),
  ('CASETA-2', 'Estanque 5', 'ESTANQUE-5', 'FIP 3', 'FIP-3', 2000, 'D'),
  ('CASETA-2', 'Estanque 3', 'ESTANQUE-3', 'FIP 1', 'FIP-1', 3000, 'E'),
  ('CASETA-2', 'Estanque 9-10', 'ESTANQUE-9-10', 'FIP 2', 'FIP-2', 10000, 'E'),
  ('CASETA-2', 'Estanque 5', 'ESTANQUE-5', 'FIP 3', 'FIP-3', 2000, 'E'),
  ('CASETA-2', 'Estanque 3', 'ESTANQUE-3', 'FIP 1', 'FIP-1', 3000, 'F'),
  ('CASETA-2', 'Estanque 9-10', 'ESTANQUE-9-10', 'FIP 2', 'FIP-2', 10000, 'F'),
  ('CASETA-2', 'Estanque 5', 'ESTANQUE-5', 'FIP 3', 'FIP-3', 2000, 'F'),
  ('CASETA-2', 'Estanque 3', 'ESTANQUE-3', 'FIP 1', 'FIP-1', 3000, 'G'),
  ('CASETA-2', 'Estanque 9-10', 'ESTANQUE-9-10', 'FIP 2', 'FIP-2', 10000, 'G'),
  ('CASETA-2', 'Estanque 5', 'ESTANQUE-5', 'FIP 3', 'FIP-3', 2000, 'G'),
  ('CASETA-3', 'Estanque 1', 'ESTANQUE-1', 'FIP 1', 'FIP-1', 5000, 'H'),
  ('CASETA-3', 'Estanque 2', 'ESTANQUE-2', 'FIP 2', 'FIP-2', 4000, 'H'),
  ('CASETA-3', 'Estanque 3', 'ESTANQUE-3', 'FIP 3', 'FIP-3', 8000, 'H'),
  ('CASETA-3', 'Estanque 1', 'ESTANQUE-1', 'FIP 1', 'FIP-1', 5000, 'I'),
  ('CASETA-3', 'Estanque 2', 'ESTANQUE-2', 'FIP 2', 'FIP-2', 4000, 'I'),
  ('CASETA-3', 'Estanque 3', 'ESTANQUE-3', 'FIP 3', 'FIP-3', 8000, 'I'),
  ('CASETA-3', 'Estanque 1', 'ESTANQUE-1', 'FIP 1', 'FIP-1', 5000, 'J'),
  ('CASETA-3', 'Estanque 2', 'ESTANQUE-2', 'FIP 2', 'FIP-2', 4000, 'J'),
  ('CASETA-3', 'Estanque 3', 'ESTANQUE-3', 'FIP 3', 'FIP-3', 8000, 'J'),
  ('CASETA-12', 'Estanque 1', 'ESTANQUE-1', 'FIP 1', 'FIP-1', 5000, 'El parque 1'),
  ('CASETA-12', 'Estanque 2', 'ESTANQUE-2', 'FIP 2', 'FIP-2', 5000, 'El parque 1'),
  ('CASETA-12', 'Estanque 3', 'ESTANQUE-3', 'FIP 3', 'FIP-3', 5000, 'El parque 1'),
  ('CASETA-12', 'Estanque 4', 'ESTANQUE-4', 'FIP 4', 'FIP-4', 2000, 'El parque 1'),
  ('CASETA-12', 'Estanque 1', 'ESTANQUE-1', 'FIP 1', 'FIP-1', 5000, 'El parque 2'),
  ('CASETA-12', 'Estanque 2', 'ESTANQUE-2', 'FIP 2', 'FIP-2', 5000, 'El parque 2'),
  ('CASETA-12', 'Estanque 3', 'ESTANQUE-3', 'FIP 3', 'FIP-3', 5000, 'El parque 2'),
  ('CASETA-12', 'Estanque 4', 'ESTANQUE-4', 'FIP 4', 'FIP-4', 2000, 'El parque 2'),
  ('CASETA-12', 'Estanque 1', 'ESTANQUE-1', 'FIP 1', 'FIP-1', 5000, 'El parque 3'),
  ('CASETA-12', 'Estanque 2', 'ESTANQUE-2', 'FIP 2', 'FIP-2', 5000, 'El parque 3'),
  ('CASETA-12', 'Estanque 3', 'ESTANQUE-3', 'FIP 3', 'FIP-3', 5000, 'El parque 3'),
  ('CASETA-12', 'Estanque 4', 'ESTANQUE-4', 'FIP 4', 'FIP-4', 2000, 'El parque 3'),
  ('CASETA-12', 'Estanque 1', 'ESTANQUE-1', 'FIP 1', 'FIP-1', 5000, 'El parque 4'),
  ('CASETA-12', 'Estanque 2', 'ESTANQUE-2', 'FIP 2', 'FIP-2', 5000, 'El parque 4'),
  ('CASETA-12', 'Estanque 3', 'ESTANQUE-3', 'FIP 3', 'FIP-3', 5000, 'El parque 4'),
  ('CASETA-12', 'Estanque 4', 'ESTANQUE-4', 'FIP 4', 'FIP-4', 2000, 'El parque 4'),
  ('CASETA-11', 'Manual', 'MANUAL', 'MANUAL', 'MANUAL', 200, 'Los pinos Paltos'),
  ('CASETA-1', 'Estanque 1', 'ESTANQUE-1', 'FIP 1', 'FIP-1', 3000, 'Mirador 1'),
  ('CASETA-1', 'Estanque 1', 'ESTANQUE-1', 'FIP 2', 'FIP-2', 2000, 'Mirador 1'),
  ('CASETA-1', 'Estanque 1', 'ESTANQUE-1', 'FIP 3', 'FIP-3', 3000, 'Mirador 1'),
  ('CASETA-6', 'Estanque 1', 'ESTANQUE-1', 'FIP 1', 'FIP-1', 2000, 'Mirador 2'),
  ('CASETA-6', 'Estanque 2', 'ESTANQUE-2', 'FIP 2', 'FIP-2', 5000, 'Mirador 2'),
  ('CASETA-6', 'Estanque 3', 'ESTANQUE-3', 'FIP 3', 'FIP-3', 5000, 'Mirador 2')
)
insert into public.fertilizante_estanque_potreros (estanque_id, campo_id, potrero)
select e.id, campos.id, s.potrero
from source s
join public.fertilizante_casetas c on c.nombre_normalizado = s.caseta_key
join public.fertilizante_estanques e
  on e.caseta_id = c.id
  and e.numero_estanque_normalizado = s.numero_estanque_normalizado
  and e.fip_normalizado = s.fip_normalizado
  and e.volumen_maximo_litros = s.volumen_maximo_litros::numeric
left join lateral (
  select id
  from public.campos
  where lower(trim(potrero)) = lower(trim(s.potrero))
  order by activo desc, id
  limit 1
) campos on true
on conflict (estanque_id, potrero) do update set campo_id = excluded.campo_id, activo = true;

commit;

select caseta, numero_estanque, fip, volumen_maximo_litros, litros_actuales, potreros
from public.v_fertilizante_estado_estanques
order by caseta, numero_estanque, fip;
