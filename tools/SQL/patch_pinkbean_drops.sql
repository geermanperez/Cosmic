-- EverleafMS / Cosmic v83: Pink Bean Drop Fix & Balancing Patch
-- Aplica los arreglos de drop para la batalla de Pink Bean en bases de datos MySQL activas.

-- 1. Eliminar drops asignados incorrectamente al trono invulnerable (8820000)
DELETE FROM drop_data WHERE dropperid = 8820000;

-- 2. Normalizar cantidades de Pink Bean Hat y Pink Bean Suit en Pink Bean vulnerable (8820001)
-- Antes: min 3, max 5 (generaba demasiados ítems al morir, sobrecargando el mapa)
-- Ahora: min 1, max 2
UPDATE drop_data 
SET minimum_quantity = 1, maximum_quantity = 2 
WHERE dropperid = 8820001 AND itemid IN (1002971, 1052202);

-- 3. Registrar Pink Bean Chair (Giant Pink Bean Cushion - 3010073) con 5% de probabilidad (50,000 / 1,000,000)
-- Se elimina primero si existía para garantizar idempotencia
DELETE FROM drop_data WHERE dropperid = 8820001 AND itemid = 3010073;
INSERT INTO drop_data (dropperid, itemid, minimum_quantity, maximum_quantity, questid, chance)
VALUES (8820001, 3010073, 1, 1, 0, 50000);
