import { mc, ms, tf, withTopic } from '../builder';

// Banco TEÓRICO (a mano) — Bases de Datos.
// Razonamiento: claves, SQL (filtrado/agrupamiento/JOINs), integridad,
// normalización y transacciones ACID.
export const basesDatosTheory = withTopic('base_de_datos', [
  mc('bd-t-001', 'Claves', 2,
    '¿Cuál de estas afirmaciones sobre la clave primaria (PK) es correcta?',
    [
      'Es única, no admite valores nulos e identifica cada fila de la tabla',
      'Puede repetirse mientras no sea nula',
      'Siempre es un número entero autoincremental',
      'Referencia la clave primaria de otra tabla',
    ], 0,
    'La PK identifica unívocamente cada fila: debe ser única y no nula. La que referencia la PK de otra tabla es la clave foránea.'),

  mc('bd-t-002', 'Claves', 2,
    'Una clave foránea (FK)…',
    [
      'Es un atributo que referencia la PK de otra tabla y garantiza la integridad referencial',
      'Identifica unívocamente cada fila de su propia tabla',
      'Nunca puede tomar el valor nulo',
      'Siempre coincide con la PK de su propia tabla',
    ], 0,
    'La FK apunta a la PK de otra tabla, manteniendo la integridad referencial. Puede ser nula (si se permite) y no es la que identifica su propia tabla.'),

  mc('bd-t-003', 'Claves', 3,
    'Una clave candidata es…',
    [
      'Cualquier atributo o conjunto mínimo de atributos que podría servir como clave primaria',
      'Un atributo cuyos valores se repiten',
      'La clave foránea de la tabla',
      'Un índice secundario sin relación con la identidad',
    ], 0,
    'Las claves candidatas identifican unívocamente las filas; de entre ellas se elige una como PK y las demás quedan como claves alternativas.'),

  mc('bd-t-004', 'Claves', 3,
    'Una clave primaria compuesta…',
    [
      'Está formada por dos o más atributos que, juntos, identifican unívocamente cada fila',
      'Es una PK que admite valores nulos',
      'Es lo mismo que una clave foránea',
      'Es una clave cuyos valores pueden repetirse',
    ], 0,
    'La PK compuesta combina varios atributos para lograr unicidad; es típica de las tablas intermedias de relaciones N:M (ej. id_alumno + id_materia).'),

  ms('bd-t-005', 'Claves', 3,
    'Seleccioná TODAS las afirmaciones correctas sobre claves:',
    [
      'La clave primaria es única y no admite nulos',
      'La clave foránea referencia la PK de otra tabla',
      'Una tabla puede tener varias claves candidatas',
      'Las claves candidatas no elegidas como PK quedan como claves alternativas',
      'La clave primaria puede contener valores nulos',
      'Una tabla puede tener varias claves primarias a la vez',
    ], [0, 1, 2, 3],
    'PK única y no nula; FK referencia otra PK; puede haber varias candidatas (una es PK, el resto alternativas). Una PK no admite nulos y hay una sola PK por tabla.'),

  mc('bd-t-006', 'SQL', 2,
    '¿Qué devuelve "SELECT nombre FROM Cliente WHERE ciudad = \'Córdoba\';"?',
    [
      'Los nombres de los clientes cuya ciudad es Córdoba',
      'Todos los clientes de la tabla',
      'La cantidad de clientes de Córdoba',
      'Las ciudades distintas de los clientes',
    ], 0,
    'El SELECT proyecta la columna nombre y el WHERE filtra las filas cuya ciudad sea Córdoba.'),

  mc('bd-t-007', 'SQL', 3,
    '¿Cuál es la diferencia entre WHERE y HAVING?',
    [
      'WHERE filtra filas antes de agrupar; HAVING filtra grupos después de GROUP BY (puede usar agregados)',
      'Son sinónimos intercambiables',
      'HAVING filtra antes de agrupar y WHERE después',
      'WHERE solo funciona con funciones de agregado',
    ], 0,
    'WHERE actúa fila por fila ANTES del agrupamiento; HAVING filtra los grupos ya formados y admite agregados como COUNT o SUM.'),

  mc('bd-t-008', 'SQL', 3,
    '¿Qué devuelve "SELECT ciudad, COUNT(*) FROM Cliente GROUP BY ciudad;"?',
    [
      'La cantidad de clientes por cada ciudad',
      'Todos los clientes ordenados por ciudad',
      'Un único número con el total de clientes',
      'Las ciudades sin contar nada',
    ], 0,
    'GROUP BY ciudad agrupa las filas por ciudad y COUNT(*) cuenta cuántos clientes hay en cada grupo.'),

  mc('bd-t-009', 'JOIN', 3,
    'Un INNER JOIN entre A y B devuelve…',
    [
      'Solo las filas que tienen coincidencia en ambas tablas',
      'Todas las filas de A, coincidan o no con B',
      'Todas las filas de B, coincidan o no con A',
      'El producto cartesiano completo de A y B',
    ], 0,
    'El INNER JOIN devuelve únicamente las combinaciones donde la condición de unión se cumple en ambas tablas; las filas sin pareja se descartan.'),

  mc('bd-t-010', 'JOIN', 3,
    'Un LEFT JOIN entre A y B devuelve…',
    [
      'Todas las filas de A y las coincidentes de B (con NULL donde no hay coincidencia)',
      'Solo las filas con coincidencia en ambas',
      'Todas las filas de B y las coincidentes de A',
      'El producto cartesiano de A y B',
    ], 0,
    'El LEFT JOIN conserva TODAS las filas de la tabla izquierda (A); donde no hay match en B, las columnas de B quedan en NULL.'),

  ms('bd-t-011', 'JOIN', 3,
    'Seleccioná TODAS las afirmaciones correctas sobre las uniones (JOIN):',
    [
      'INNER JOIN devuelve solo las filas con coincidencia en ambas tablas',
      'LEFT JOIN conserva todas las filas de la tabla izquierda',
      'El producto cartesiano combina cada fila de A con cada fila de B',
      'FULL OUTER JOIN conserva las filas no coincidentes de ambas tablas',
      'INNER JOIN conserva también las filas sin coincidencia',
      'LEFT JOIN descarta las filas de la izquierda que no tienen coincidencia',
    ], [0, 1, 2, 3],
    'INNER = solo coincidencias; LEFT = todas las izquierdas; producto cartesiano = todas las combinaciones; FULL OUTER = ambas con sus no coincidentes. Las dos falsas contradicen INNER y LEFT.'),

  mc('bd-t-012', 'Transacciones', 3,
    'La propiedad de Atomicidad (ACID) garantiza que…',
    [
      'Una transacción se ejecute completamente o no se ejecute en absoluto (todo o nada)',
      'Los datos cumplan las reglas de integridad',
      'Las transacciones concurrentes no se interfieran',
      'Los cambios persistan tras un fallo',
    ], 0,
    'Atomicidad = todo o nada: si una parte falla, se deshace (rollback) toda la transacción. Es la A de ACID.'),

  tf('bd-t-013', 'Transacciones', 3,
    'La propiedad de Consistencia (ACID) garantiza que una transacción lleve la base de datos de un estado válido a otro estado válido, respetando todas las reglas e integridades.',
    true,
    'Verdadero. La Consistencia asegura que, al confirmar, no se violen las restricciones (claves, checks, integridad referencial): de estado válido a estado válido.'),

  mc('bd-t-014', 'Transacciones', 3,
    'La propiedad de Aislamiento (Isolation) garantiza que…',
    [
      'Las transacciones concurrentes no interfieran entre sí (el resultado es como si se ejecutaran en serie)',
      'La transacción se ejecute completa o nada',
      'Se cumplan las reglas de integridad',
      'Los cambios persistan tras un fallo del sistema',
    ], 0,
    'El Aislamiento controla la concurrencia: cada transacción se ejecuta como si estuviera sola, evitando que los cambios intermedios de una afecten a otra.'),

  mc('bd-t-015', 'Transacciones', 3,
    'La propiedad de Durabilidad (ACID) garantiza que…',
    [
      'Una vez confirmada (commit), los cambios persisten aunque ocurra un fallo del sistema',
      'La transacción se ejecute completa o nada',
      'Las transacciones no se interfieran',
      'La base pase de un estado válido a otro válido',
    ], 0,
    'La Durabilidad asegura que lo confirmado quede grabado de forma permanente (en disco/log), sobreviviendo a cortes de energía o caídas.'),

  ms('bd-t-016', 'Transacciones', 3,
    'Seleccioná TODAS las afirmaciones correctas sobre ACID:',
    [
      'Atomicidad: la transacción se ejecuta completa o no se ejecuta',
      'Consistencia: lleva la base de un estado válido a otro válido',
      'Aislamiento: las transacciones concurrentes no interfieren entre sí',
      'Durabilidad: los cambios confirmados persisten ante fallos',
      'Atomicidad significa que los datos persisten tras un fallo',
      'Durabilidad significa "todo o nada"',
    ], [0, 1, 2, 3],
    'A=todo o nada; C=estado válido a válido; I=concurrencia sin interferencia; D=persistencia tras commit. Las dos falsas intercambian Atomicidad y Durabilidad.'),

  tf('bd-t-017', 'Transacciones', 2,
    'Si una transacción falla a la mitad, se realiza un ROLLBACK para deshacer todos sus cambios y preservar la atomicidad.',
    true,
    'Verdadero. El rollback revierte la transacción incompleta, dejando la base como si nunca hubiera empezado: así se cumple el "todo o nada".'),

  tf('bd-t-018', 'Integridad', 3,
    'La integridad referencial impide insertar en una tabla hija un valor de clave foránea que no exista como clave primaria en la tabla padre.',
    true,
    'Verdadero. No se puede referenciar algo inexistente: la FK debe apuntar a una PK existente (o ser NULL, si la columna lo permite).'),

  mc('bd-t-019', 'Normalización', 3,
    'Una tabla Pedido con columnas (id, cliente, producto1, producto2, producto3) viola…',
    [
      'La 1FN, por tener grupos repetitivos (los productos repartidos en columnas)',
      'Únicamente la 3FN',
      'Ninguna forma normal',
      'La integridad referencial',
    ], 0,
    'Repetir un mismo concepto en columnas (producto1, producto2…) es un grupo repetitivo: viola la 1FN. Se corrige con una tabla de detalle (un producto por fila).'),

  mc('bd-t-020', 'SQL', 2,
    '¿Qué devuelve "SELECT DISTINCT ciudad FROM Cliente;"?',
    [
      'Las ciudades sin repetir (valores únicos)',
      'Todas las filas, incluyendo ciudades repetidas',
      'La cantidad de ciudades',
      'Los clientes ordenados por ciudad',
    ], 0,
    'DISTINCT elimina duplicados del resultado: devuelve cada ciudad una sola vez.'),

  mc('bd-t-021', 'SQL', 2,
    'La cláusula ORDER BY se utiliza para…',
    [
      'Ordenar el resultado por una o más columnas (ascendente o descendente)',
      'Filtrar las filas según una condición',
      'Agrupar las filas por un campo',
      'Unir dos tablas',
    ], 0,
    'ORDER BY ordena el conjunto de resultados (ASC por defecto, o DESC). No filtra (eso es WHERE) ni agrupa (eso es GROUP BY).'),

  mc('bd-t-022', 'SQL', 2,
    '¿Cuál función de agregación devuelve el promedio de los valores de una columna?',
    [
      'AVG()',
      'SUM()',
      'COUNT()',
      'MAX()',
    ], 0,
    'AVG() calcula el promedio. SUM() suma, COUNT() cuenta filas y MAX() devuelve el valor máximo.'),

  ms('bd-t-023', 'SQL', 3,
    'Seleccioná TODAS las afirmaciones correctas sobre las cláusulas SQL:',
    [
      'WHERE filtra filas (antes de agrupar)',
      'GROUP BY agrupa las filas por uno o más campos',
      'HAVING filtra grupos (después de GROUP BY)',
      'ORDER BY ordena el resultado final',
      'HAVING filtra filas individuales antes de agrupar',
      'WHERE se usa para ordenar el resultado',
    ], [0, 1, 2, 3],
    'WHERE filtra filas, GROUP BY agrupa, HAVING filtra grupos y ORDER BY ordena. HAVING no filtra filas pre-agrupamiento (eso es WHERE) y WHERE no ordena (eso es ORDER BY).'),

  mc('bd-t-024', 'SQL', 3,
    'En SQL, comparar un valor con NULL usando "columna = NULL"…',
    [
      'No funciona como se espera; hay que usar IS NULL / IS NOT NULL',
      'Devuelve siempre verdadero',
      'Es la forma correcta y recomendada',
      'Convierte el NULL en cero automáticamente',
    ], 0,
    'NULL representa "desconocido": cualquier comparación con = NULL da UNKNOWN, no TRUE. Para evaluar nulos se usa IS NULL o IS NOT NULL.'),

  tf('bd-t-025', 'Integridad', 2,
    'Una restricción UNIQUE impide que se repitan valores en una columna, aunque (según el motor) puede permitir un valor NULL.',
    true,
    'Verdadero. UNIQUE garantiza unicidad de valores; a diferencia de la PK, suele admitir un NULL (que no se considera duplicado de otro NULL en varios motores).'),

  mc('bd-t-026', 'Índices', 3,
    'Un índice en una base de datos sirve principalmente para…',
    [
      'Acelerar las búsquedas/consultas, a costa de espacio extra y escrituras más lentas',
      'Reducir el tamaño total de la tabla',
      'Cifrar los datos almacenados',
      'Garantizar la atomicidad de las transacciones',
    ], 0,
    'El índice acelera SELECT/WHERE/JOIN, pero ocupa espacio y agrega trabajo a INSERT/UPDATE/DELETE, que deben mantenerlo actualizado.'),

  tf('bd-t-027', 'Índices', 3,
    'Un índice acelera las lecturas, pero ralentiza los INSERT/UPDATE/DELETE porque debe mantenerse actualizado en cada cambio.',
    true,
    'Verdadero. Cada escritura debe actualizar también el índice; por eso indexar de más perjudica el rendimiento de las operaciones de modificación.'),

  mc('bd-t-028', 'Vistas', 2,
    'Una vista (VIEW) en SQL es…',
    [
      'Una tabla virtual definida por una consulta; no almacena datos propios (salvo que sea materializada)',
      'Una copia física de una tabla',
      'Un tipo especial de índice',
      'Un respaldo (backup) de la base de datos',
    ], 0,
    'La vista es una consulta almacenada que se comporta como una tabla: al consultarla, obtiene los datos en el momento (las materializadas sí guardan el resultado).'),

  mc('bd-t-029', 'SQL', 3,
    'Una subconsulta (subquery)…',
    [
      'Es una consulta anidada dentro de otra, cuyo resultado utiliza la consulta externa',
      'Es un tipo de índice',
      'Es una restricción de integridad',
      'Es una transacción',
    ], 0,
    'La subconsulta se ejecuta dentro de otra (en el WHERE, FROM o SELECT) y su resultado alimenta a la consulta externa, p. ej. para filtrar por un valor calculado.'),

  mc('bd-t-030', 'SQL', 2,
    '¿Qué devuelve "SELECT COUNT(*) FROM Venta WHERE total > 1000;"?',
    [
      'La cantidad de ventas cuyo total supera 1000',
      'La suma de todos los totales',
      'Todas las ventas mayores a 1000',
      'El promedio de los totales',
    ], 0,
    'El WHERE filtra las ventas con total > 1000 y COUNT(*) cuenta cuántas filas quedan: la cantidad de esas ventas.'),
]);
