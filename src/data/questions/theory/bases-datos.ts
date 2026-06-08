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

  mc('bd-t-031', 'Lenguajes SQL', 3,
    '¿Cuál de las siguientes clasificaciones de SQL es correcta?',
    [
      'DDL define la estructura (CREATE/ALTER/DROP); DML manipula datos (INSERT/UPDATE/DELETE/SELECT); DCL controla permisos (GRANT/REVOKE)',
      'DDL manipula los datos y DML define la estructura',
      'DCL se usa para crear tablas',
      'Todas las sentencias SQL son DML',
    ], 0,
    'DDL (definición), DML (manipulación de datos) y DCL (control de acceso) son las grandes categorías; COMMIT/ROLLBACK forman el TCL (control de transacciones).'),

  mc('bd-t-032', 'Lenguajes SQL', 2,
    'CREATE TABLE, ALTER TABLE y DROP TABLE son sentencias de tipo…',
    [
      'DDL (Data Definition Language)',
      'DML (Data Manipulation Language)',
      'DCL (Data Control Language)',
      'TCL (Transaction Control Language)',
    ], 0,
    'Definen o modifican la ESTRUCTURA de la base (tablas, columnas, restricciones): son DDL.'),

  tf('bd-t-033', 'Lenguajes SQL', 2,
    'INSERT, UPDATE y DELETE son sentencias DML (Lenguaje de Manipulación de Datos).',
    true,
    'Verdadero. El DML opera sobre los DATOS de las tablas (agregar, modificar, borrar y consultar), a diferencia del DDL que define la estructura.'),

  ms('bd-t-034', 'Lenguajes SQL', 3,
    'Seleccioná TODAS las clasificaciones correctas de sentencias SQL:',
    [
      'CREATE TABLE es una sentencia DDL',
      'INSERT es una sentencia DML',
      'GRANT es una sentencia DCL (control de permisos)',
      'COMMIT y ROLLBACK controlan transacciones (TCL)',
      'DROP TABLE es una sentencia DML',
      'SELECT es una sentencia DDL',
    ], [0, 1, 2, 3],
    'CREATE=DDL, INSERT=DML, GRANT=DCL, COMMIT/ROLLBACK=TCL. DROP es DDL (estructura), no DML, y SELECT es DML/DQL (consulta), no DDL.'),

  mc('bd-t-035', 'Lenguajes SQL', 3,
    '¿Cuál es la diferencia entre TRUNCATE y DELETE?',
    [
      'TRUNCATE borra todas las filas rápidamente y sin WHERE (no registra fila por fila); DELETE borra filas (admite WHERE y es transaccional)',
      'TRUNCATE elimina la estructura de la tabla',
      'DELETE elimina la estructura de la tabla',
      'Son operaciones idénticas',
    ], 0,
    'TRUNCATE vacía la tabla de forma masiva (se comporta como DDL); DELETE borra filas seleccionables con WHERE y puede deshacerse en una transacción. Ninguno borra la estructura (eso es DROP).'),

  tf('bd-t-036', 'Lenguajes SQL', 2,
    'GRANT otorga permisos y REVOKE los quita a los usuarios sobre los objetos de la base de datos.',
    true,
    'Verdadero. GRANT y REVOKE son sentencias DCL: administran qué puede hacer cada usuario (SELECT, INSERT, etc.) sobre tablas, vistas y demás objetos.'),

  mc('bd-t-037', 'Concurrencia', 3,
    'Un bloqueo (lock) en una base de datos sirve para…',
    [
      'Controlar el acceso concurrente a los datos, evitando que dos transacciones los modifiquen a la vez de forma inconsistente',
      'Cifrar los datos almacenados',
      'Acelerar las consultas de lectura',
      'Crear índices automáticamente',
    ], 0,
    'Los locks coordinan la concurrencia: aseguran que las transacciones no pisen los cambios de otras, manteniendo el aislamiento y la consistencia.'),

  mc('bd-t-038', 'Concurrencia', 3,
    'Un interbloqueo (deadlock) en una base de datos ocurre cuando…',
    [
      'Dos transacciones se bloquean mutuamente, cada una esperando un recurso que la otra tiene bloqueado',
      'Una consulta tarda demasiado en ejecutarse',
      'Se llena el espacio en disco',
      'Falta un índice en una tabla',
    ], 0,
    'En el deadlock T1 espera un recurso bloqueado por T2 y viceversa: espera circular. El motor detecta el ciclo y aborta una de las transacciones.'),

  tf('bd-t-039', 'Concurrencia', 3,
    'Cuando el motor detecta un deadlock, suele abortar una de las transacciones (la "víctima") y deshacer sus cambios para resolver el bloqueo.',
    true,
    'Verdadero. El gestor elige una víctima (normalmente la de menor costo de rollback), la revierte y la otra continúa; la víctima puede reintentarse.'),

  mc('bd-t-040', 'Concurrencia', 3,
    'Una "lectura sucia" (dirty read) ocurre cuando…',
    [
      'Una transacción lee datos modificados por otra que todavía no confirmó (y que podría hacer rollback)',
      'Una transacción lee solo datos ya confirmados',
      'Se elimina una tabla durante la lectura',
      'Dos transacciones leen exactamente el mismo dato a la vez',
    ], 0,
    'En la lectura sucia se lee un cambio aún no confirmado; si la otra transacción hace rollback, se habrá leído un dato que "nunca existió".'),

  mc('bd-t-041', 'Concurrencia', 3,
    'Una "lectura no repetible" (non-repeatable read) ocurre cuando…',
    [
      'Una transacción lee la misma fila dos veces y obtiene valores distintos, porque otra la modificó y confirmó entre ambas lecturas',
      'Aparecen filas nuevas que antes no estaban',
      'Se lee un dato no confirmado',
      'No se puede leer la fila',
    ], 0,
    'La fila existe en ambas lecturas, pero su valor cambió porque otra transacción la actualizó y confirmó en el medio: la relectura no coincide.'),

  mc('bd-t-042', 'Concurrencia', 3,
    'Una "lectura fantasma" (phantom read) ocurre cuando…',
    [
      'Una consulta con una condición devuelve un conjunto distinto de filas al repetirse, porque otra transacción insertó o eliminó filas que cumplen esa condición',
      'Se lee un valor cambiado de una fila existente',
      'Se lee un dato no confirmado',
      'Se bloquea toda la tabla',
    ], 0,
    'A diferencia de la no repetible (cambia un valor), en la fantasma cambia el CONJUNTO de filas: aparecen o desaparecen filas que cumplen la condición.'),

  ms('bd-t-043', 'Concurrencia', 3,
    'Seleccioná TODAS las afirmaciones correctas sobre los fenómenos de concurrencia:',
    [
      'La lectura sucia (dirty read) es leer datos no confirmados de otra transacción',
      'La lectura no repetible es releer una fila y obtener valores distintos',
      'La lectura fantasma es que aparezcan/desaparezcan filas entre dos consultas',
      'Subir el nivel de aislamiento reduce estos fenómenos pero baja la concurrencia',
      'La lectura sucia consiste en leer datos ya confirmados',
      'El nivel Serializable permite las lecturas sucias',
    ], [0, 1, 2, 3],
    'Dirty=no confirmado; non-repeatable=valor distinto; phantom=filas que aparecen/desaparecen; más aislamiento = menos fenómenos y menos concurrencia. Las dos falsas se contradicen (Serializable evita todo).'),

  mc('bd-t-044', 'Concurrencia', 3,
    'Ordená los niveles de aislamiento de MENOR a MAYOR aislamiento:',
    [
      'Read Uncommitted < Read Committed < Repeatable Read < Serializable',
      'Serializable < Repeatable Read < Read Committed < Read Uncommitted',
      'Read Committed < Read Uncommitted < Serializable < Repeatable Read',
      'Repeatable Read < Serializable < Read Committed < Read Uncommitted',
    ], 0,
    'De más permisivo a más estricto: Read Uncommitted (permite dirty), Read Committed, Repeatable Read y Serializable (evita todos los fenómenos).'),

  mc('bd-t-045', 'Concurrencia', 3,
    'El nivel de aislamiento Serializable…',
    [
      'Es el más estricto: evita dirty, non-repeatable y phantom reads, a costa de menor concurrencia',
      'Es el más permisivo de todos',
      'Permite las lecturas sucias',
      'No está definido por el estándar SQL',
    ], 0,
    'Serializable hace que las transacciones se comporten como si se ejecutaran en serie: máxima consistencia, pero más bloqueos y menor rendimiento concurrente.'),

  tf('bd-t-046', 'Concurrencia', 3,
    'A mayor nivel de aislamiento se obtiene mayor consistencia, pero menor concurrencia y rendimiento.',
    true,
    'Verdadero. Es un compromiso: más aislamiento evita anomalías pero exige más bloqueos, reduciendo cuántas transacciones avanzan en paralelo.'),

  mc('bd-t-047', 'SQL', 3,
    'El operador UNION en SQL…',
    [
      'Combina los resultados de dos consultas eliminando duplicados (UNION ALL los conserva)',
      'Une dos tablas relacionándolas por una columna',
      'Filtra filas según una condición',
      'Ordena el resultado de una consulta',
    ], 0,
    'UNION apila verticalmente los resultados de dos SELECT compatibles y quita duplicados; UNION ALL los mantiene. No es un JOIN (que combina columnas).'),

  mc('bd-t-048', 'SQL', 3,
    '¿Cuál es la diferencia entre UNION y JOIN?',
    [
      'UNION apila filas de dos consultas (verticalmente); JOIN combina columnas de dos tablas relacionadas (horizontalmente)',
      'UNION combina columnas y JOIN apila filas',
      'Son operaciones idénticas',
      'UNION ordena y JOIN filtra',
    ], 0,
    'UNION agrega filas de resultados con las mismas columnas; JOIN enlaza tablas por una condición y amplía las columnas del resultado.'),

  mc('bd-t-049', 'SQL', 3,
    'El operador IN dentro de un WHERE…',
    [
      'Verifica si un valor está dentro de un conjunto/lista o del resultado de una subconsulta',
      'Une dos tablas por una clave',
      'Ordena las filas del resultado',
      'Cuenta la cantidad de filas',
    ], 0,
    'IN comprueba pertenencia: "WHERE ciudad IN (\'Córdoba\',\'Rosario\')" o "IN (SELECT …)". Equivale a varios OR sobre el mismo campo.'),

  mc('bd-t-050', 'SQL', 3,
    'El operador EXISTS…',
    [
      'Devuelve verdadero si la subconsulta retorna al menos una fila',
      'Cuenta las filas de una tabla',
      'Ordena los resultados',
      'Une dos tablas',
    ], 0,
    'EXISTS evalúa la existencia de filas en una subconsulta correlacionada: en cuanto encuentra una, devuelve verdadero (suele ser eficiente).'),

  mc('bd-t-051', 'SQL', 3,
    'El operador LIKE con el patrón \'A%\' coincide con…',
    [
      'Los valores que empiezan con "A" (el % representa cualquier secuencia de caracteres)',
      'Solo el valor exacto "A%"',
      'Los valores que terminan en "A"',
      'Los valores de un solo carácter',
    ], 0,
    'LIKE busca por patrón: % = cualquier cantidad de caracteres, _ = un solo carácter. \'A%\' = empieza con A; \'%A\' = termina en A.'),

  ms('bd-t-052', 'SQL', 3,
    'Seleccioná TODAS las afirmaciones correctas sobre operadores SQL:',
    [
      'UNION combina los resultados de dos consultas, eliminando duplicados',
      'IN comprueba si un valor pertenece a un conjunto o subconsulta',
      'LIKE busca coincidencias por patrón (con % y _)',
      'HAVING filtra los grupos formados por GROUP BY',
      'UNION une dos tablas relacionándolas por una clave',
      'LIKE compara de forma exacta, sin comodines',
    ], [0, 1, 2, 3],
    'UNION combina resultados, IN comprueba pertenencia, LIKE busca por patrón y HAVING filtra grupos. UNION no es un JOIN y LIKE sí usa comodines.'),

  mc('bd-t-053', 'SQL', 3,
    '¿Qué devuelve "SELECT ciudad, COUNT(*) FROM Cliente GROUP BY ciudad HAVING COUNT(*) > 5;"?',
    [
      'Las ciudades que tienen más de 5 clientes (con su cantidad)',
      'Todas las ciudades, sin filtrar',
      'Los primeros 5 clientes',
      'Las ciudades con 5 clientes o menos',
    ], 0,
    'GROUP BY agrupa por ciudad, COUNT(*) cuenta por grupo y HAVING COUNT(*) > 5 conserva solo los grupos (ciudades) con más de 5 clientes.'),

  mc('bd-t-054', 'Programación BD', 3,
    'Un trigger (disparador) es…',
    [
      'Un bloque de código que se ejecuta automáticamente ante un evento (INSERT/UPDATE/DELETE) sobre una tabla',
      'Una consulta SELECT guardada',
      'Un índice especial',
      'Una restricción UNIQUE',
    ], 0,
    'El trigger reacciona a eventos de datos de forma automática (p. ej. auditar cambios o validar reglas), sin que la aplicación lo invoque explícitamente.'),

  mc('bd-t-055', 'Programación BD', 3,
    'Un procedimiento almacenado (stored procedure)…',
    [
      'Es un conjunto de instrucciones SQL guardado en el servidor que se invoca por su nombre y puede recibir parámetros',
      'Es una tabla temporal de trabajo',
      'Es un tipo de índice',
      'Es un trigger que se dispara solo',
    ], 0,
    'El procedimiento almacenado encapsula lógica en el servidor, reutilizable y parametrizable; se ejecuta explícitamente (CALL/EXEC), a diferencia del trigger.'),

  tf('bd-t-056', 'Programación BD', 3,
    'Un trigger se dispara automáticamente ante un evento sobre una tabla, mientras que un procedimiento almacenado se invoca explícitamente.',
    true,
    'Verdadero. El trigger es reactivo (evento → ejecución automática); el procedimiento es invocado a demanda por la aplicación o por otro código SQL.'),

  mc('bd-t-057', 'Álgebra relacional', 3,
    'En álgebra relacional, la operación de SELECCIÓN (σ)…',
    [
      'Filtra las FILAS (tuplas) que cumplen una condición',
      'Elige columnas (atributos)',
      'Combina dos relaciones',
      'Elimina los valores duplicados',
    ], 0,
    'La selección (σ) se queda con las tuplas que satisfacen un predicado (equivale al WHERE). Elegir columnas es la proyección (π).'),

  mc('bd-t-058', 'Álgebra relacional', 3,
    'La operación de PROYECCIÓN (π) en álgebra relacional…',
    [
      'Elige COLUMNAS (atributos) de una relación',
      'Filtra las filas según una condición',
      'Une dos relaciones',
      'Cuenta la cantidad de filas',
    ], 0,
    'La proyección (π) selecciona un subconjunto de atributos (columnas), equivalente a la lista de campos del SELECT. Filtrar filas es la selección (σ).'),

  ms('bd-t-059', 'Álgebra relacional', 3,
    'Seleccioná TODAS las afirmaciones correctas sobre el álgebra relacional:',
    [
      'La selección (σ) filtra las filas que cumplen una condición',
      'La proyección (π) elige columnas (atributos)',
      'El join combina tuplas de dos relaciones según una condición',
      'El producto cartesiano combina cada tupla de una relación con cada tupla de la otra',
      'La selección (σ) elige columnas de la relación',
      'La proyección (π) filtra las filas',
    ], [0, 1, 2, 3],
    'σ filtra filas, π elige columnas, el join combina por condición y el producto cartesiano combina todas con todas. Las dos últimas intercambian selección y proyección.'),

  mc('bd-t-060', 'SQL vs NoSQL', 3,
    '¿Cuál afirmación sobre bases SQL vs NoSQL es correcta?',
    [
      'Las SQL son relacionales con esquema fijo y ACID fuerte; las NoSQL son flexibles (documentos, clave-valor, grafos), escalan horizontalmente y a veces usan consistencia eventual',
      'Las bases NoSQL son siempre relacionales',
      'Las bases SQL no soportan transacciones',
      'NoSQL significa que no almacenan ningún dato',
    ], 0,
    'Las relacionales (SQL) priorizan esquema y ACID; las NoSQL ofrecen flexibilidad de esquema y escalado horizontal, a menudo relajando la consistencia (eventual) para ganar disponibilidad.'),
]);
