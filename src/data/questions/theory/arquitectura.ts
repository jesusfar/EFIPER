import { mc, ms, tf, withTopic } from '../builder';

// Banco TEÓRICO (a mano) — Arquitectura de Computadoras.
// Razonamiento y cálculo: representación de la información, CPU, jerarquía de
// memoria, caché, buses, arquitecturas y rendimiento.
export const arquitecturaTheory = withTopic('arquitectura_computadoras', [
  mc('arq-t-001', 'Representación', 3,
    'En complemento a 2 con 8 bits, ¿qué número decimal representa 10000000?',
    [
      '−128',
      '128',
      '−0',
      '−127',
    ], 0,
    'En complemento a 2, el bit más significativo pesa negativo: 10000000 = −2⁷ = −128, el valor más negativo representable con 8 bits.'),

  mc('arq-t-002', 'Representación', 3,
    '¿Cuál es el rango de enteros representables con n bits en complemento a 2?',
    [
      '−2^(n−1) a 2^(n−1)−1',
      '0 a 2^n − 1',
      '−2^n a 2^n',
      '−2^(n−1)−1 a 2^(n−1)',
    ], 0,
    'Un bit se usa para el signo: el rango es −2^(n−1) a 2^(n−1)−1. Con 8 bits: −128 a 127.'),

  tf('arq-t-003', 'Representación', 3,
    'El complemento a 2 permite representar negativos y realizar sumas/restas con el mismo circuito sumador, sin un "−0" separado.',
    true,
    'Verdadero. Por eso es la representación estándar de enteros con signo: simplifica el hardware y tiene una única representación del cero.'),

  mc('arq-t-004', 'Representación', 3,
    '¿Cuál es la representación binaria (8 bits) del número hexadecimal 0x2F?',
    [
      '00101111',
      '00101110',
      '00111111',
      '00100111',
    ], 0,
    'Cada dígito hex son 4 bits: 2 = 0010 y F = 1111 ⇒ 0x2F = 00101111 (que es 47 en decimal).'),

  tf('arq-t-005', 'Representación', 2,
    'El estándar IEEE 754 representa un número de punto flotante con tres campos: signo, exponente y mantisa.',
    true,
    'Verdadero. IEEE 754 codifica el flotante en signo (1 bit), exponente (con sesgo) y mantisa/fracción, permitiendo un rango amplio con precisión finita.'),

  ms('arq-t-006', 'Representación', 3,
    'Seleccioná TODAS las afirmaciones correctas sobre representación de la información:',
    [
      'Con n bits sin signo se representan 2^n valores distintos (0 a 2^n−1)',
      'El complemento a 2 representa números negativos',
      'IEEE 754 se usa para números de punto flotante',
      'En complemento a 2, el bit más significativo indica el signo',
      'Con n bits se representan 2^n − 1 valores distintos',
      'El código ASCII se usa para representar números de punto flotante',
    ], [0, 1, 2, 3],
    'n bits → 2^n combinaciones; c2 maneja negativos (con el MSB de signo); IEEE 754 es para flotantes. Las falsas: son 2^n valores (no 2^n−1) y ASCII codifica caracteres, no flotantes.'),

  mc('arq-t-007', 'Unidades', 2,
    '¿Cuántos bytes hay en 2 KiB (convención binaria)?',
    [
      '2048 bytes',
      '2000 bytes',
      '1024 bytes',
      '16384 bytes',
    ], 0,
    '1 KiB = 2¹⁰ = 1024 bytes ⇒ 2 KiB = 2 × 1024 = 2048 bytes. (16384 sería la cantidad de BITS).'),

  mc('arq-t-008', 'Unidades', 3,
    'Un archivo de 1 MB (1 MB = 2²⁰ bytes), ¿cuántos bits tiene?',
    [
      '8.388.608 bits',
      '1.048.576 bits',
      '1.000.000 bits',
      '8.000.000 bits',
    ], 0,
    '1 MB = 2²⁰ = 1.048.576 bytes. Cada byte son 8 bits ⇒ 1.048.576 × 8 = 8.388.608 bits (= 2²³).'),

  mc('arq-t-009', 'CPU', 2,
    '¿Cuál es la función de la Unidad de Control (UC)?',
    [
      'Decodificar las instrucciones y generar las señales que coordinan la ALU, los registros y los buses',
      'Realizar las operaciones aritméticas y lógicas',
      'Almacenar datos de forma permanente',
      'Conectar la CPU con los periféricos de E/S',
    ], 0,
    'La UC interpreta cada instrucción y emite las señales de control que dirigen al resto de la CPU. Las operaciones las ejecuta la ALU.'),

  mc('arq-t-010', 'CPU', 2,
    'La ALU (Unidad Aritmético-Lógica)…',
    [
      'Realiza las operaciones aritméticas (suma, resta) y lógicas (AND, OR, NOT)',
      'Decodifica las instrucciones del programa',
      'Guarda el programa de forma permanente',
      'Gestiona la memoria virtual',
    ], 0,
    'La ALU es el "calculador" de la CPU: ejecuta operaciones aritméticas y lógicas sobre los datos que le entrega la unidad de control.'),

  mc('arq-t-011', 'CPU', 2,
    '¿Cuál es el orden correcto del ciclo de instrucción?',
    [
      'Búsqueda (fetch) → Decodificación (decode) → Ejecución (execute)',
      'Ejecución → Búsqueda → Decodificación',
      'Decodificación → Ejecución → Búsqueda',
      'Búsqueda → Ejecución → Decodificación',
    ], 0,
    'Fetch (traer la instrucción de memoria) → Decode (interpretarla) → Execute (ejecutarla), y se repite para la siguiente instrucción.'),

  mc('arq-t-012', 'CPU', 3,
    'El Contador de Programa (PC, Program Counter)…',
    [
      'Guarda la dirección de la próxima instrucción a ejecutar',
      'Almacena el resultado de la última operación de la ALU',
      'Decodifica la instrucción actual',
      'Es la memoria caché de nivel 1',
    ], 0,
    'El PC apunta a la siguiente instrucción; tras cada fetch se incrementa (o se modifica en un salto). Es un registro de propósito específico.'),

  ms('arq-t-013', 'CPU', 3,
    'Seleccioná TODAS las afirmaciones correctas sobre los registros de la CPU:',
    [
      'El Contador de Programa (PC) apunta a la próxima instrucción',
      'El Registro de Instrucción (IR) contiene la instrucción que se está ejecutando',
      'El MAR guarda la dirección de memoria a la que se va a acceder',
      'El acumulador suele guardar resultados de la ALU',
      'El PC es un registro de propósito general para datos del usuario',
      'Los registros son más lentos que la memoria RAM',
    ], [0, 1, 2, 3],
    'PC, IR, MAR y acumulador son registros con funciones definidas. El PC es de propósito específico (no para datos del usuario) y los registros son la memoria MÁS rápida, no más lenta que la RAM.'),

  mc('arq-t-014', 'Memoria', 3,
    'Ordená de MÁS RÁPIDA a MÁS LENTA (tiempo de acceso) la jerarquía de memoria:',
    [
      'Registros → Caché → RAM → Disco',
      'RAM → Registros → Caché → Disco',
      'Caché → RAM → Registros → Disco',
      'Disco → RAM → Caché → Registros',
    ], 0,
    'Cuanto más cerca de la ALU, más rápida (y más cara y de menor capacidad): registros < caché < RAM < disco en tiempo de acceso.'),

  tf('arq-t-015', 'Memoria', 2,
    'En la jerarquía de memoria, cuanto más rápida es una memoria, suele ser más cara y de menor capacidad.',
    true,
    'Verdadero. Por eso se usa una jerarquía: poca memoria rápida y cara cerca de la CPU, y mucha memoria lenta y barata más lejos (disco).'),

  mc('arq-t-016', 'Caché', 2,
    'Un "cache miss" (fallo de caché) ocurre cuando…',
    [
      'El dato buscado NO está en la caché y hay que traerlo de un nivel más lento (RAM/disco)',
      'El dato buscado SÍ está en la caché',
      'La caché se borra por completo',
      'La memoria RAM se llena',
    ], 0,
    'El "miss" obliga a buscar el dato en un nivel inferior (más lento). El "hit" es cuando el dato sí está en la caché (acceso rápido).'),

  mc('arq-t-017', 'Caché', 3,
    'La memoria caché mejora el rendimiento aprovechando…',
    [
      'La localidad de referencia (temporal y espacial) de los accesos a memoria',
      'La velocidad de rotación del disco',
      'La fragmentación de la memoria',
      'El ancho del bus de direcciones',
    ], 0,
    'Como los programas reutilizan datos recientes (temporal) y cercanos (espacial), guardarlos en la caché evita accesos lentos a la RAM.'),

  mc('arq-t-018', 'Buses', 3,
    'El bus de direcciones es unidireccional porque…',
    [
      'La CPU emite las direcciones hacia la memoria, pero no recibe direcciones de vuelta',
      'Transporta datos en ambos sentidos',
      'Funciona a muy baja velocidad',
      'Solo se conecta con la ALU',
    ], 0,
    'La CPU coloca la dirección a acceder; la memoria nunca le envía direcciones. El bus de DATOS, en cambio, sí es bidireccional.'),

  mc('arq-t-019', 'Buses', 3,
    'Si el bus de direcciones tiene 16 líneas, ¿cuántas posiciones de memoria distintas puede direccionar?',
    [
      '65.536',
      '16.384',
      '32.768',
      '16',
    ], 0,
    'Con 16 líneas hay 2¹⁶ = 65.536 combinaciones, por lo tanto 65.536 direcciones distintas (64 KiB si cada posición es un byte).'),

  tf('arq-t-020', 'Buses', 2,
    'El ancho del bus de datos determina cuántos bits puede transferir la CPU en una sola operación.',
    true,
    'Verdadero. Un bus de datos de 64 bits mueve 64 bits por transferencia; influye directamente en el rendimiento del acceso a memoria.'),

  ms('arq-t-021', 'Buses', 3,
    'Seleccioná TODAS las afirmaciones correctas sobre los buses:',
    [
      'El bus de direcciones es unidireccional (CPU → memoria)',
      'El bus de datos es bidireccional',
      'El bus de control transporta señales de coordinación (lectura/escritura, reloj)',
      'El ancho del bus de direcciones determina la memoria máxima direccionable',
      'El bus de datos es unidireccional',
      'El bus de direcciones transporta los datos a procesar',
    ], [0, 1, 2, 3],
    'Direcciones = unidireccional, datos = bidireccional, control = señales, y el ancho del bus de direcciones fija la memoria máxima. Las dos falsas confunden el bus de datos con el de direcciones.'),

  mc('arq-t-022', 'Memoria', 2,
    '¿Cuál afirmación sobre RAM y ROM es correcta?',
    [
      'La RAM es volátil (pierde los datos al apagar); la ROM es no volátil (conserva el firmware)',
      'La RAM es no volátil y conserva los datos sin energía',
      'La ROM es más rápida que los registros de la CPU',
      'La ROM se borra al apagar el equipo',
    ], 0,
    'La RAM pierde su contenido sin energía (volátil); la ROM lo conserva (no volátil), por eso aloja el firmware/BIOS-UEFI.'),

  tf('arq-t-023', 'CPU', 2,
    'Los registros de la CPU son la memoria más rápida del sistema, pero de muy poca capacidad.',
    true,
    'Verdadero. Los registros están dentro de la CPU y son los más veloces; por eso son pocos y pequeños (almacenan los datos en uso inmediato).'),

  mc('arq-t-024', 'Arquitecturas', 3,
    '¿Cuál es la diferencia central entre la arquitectura Von Neumann y la Harvard?',
    [
      'Harvard separa la memoria y el bus de datos del de instrucciones; Von Neumann los comparte',
      'Von Neumann separa datos e instrucciones en memorias distintas',
      'Harvard no utiliza memoria',
      'Son arquitecturas idénticas',
    ], 0,
    'En Harvard hay memorias y buses separados para datos e instrucciones (permite acceso simultáneo); en Von Neumann ambos comparten la misma memoria y bus.'),

  tf('arq-t-025', 'Arquitecturas', 3,
    'En la arquitectura Von Neumann, compartir un único bus para datos e instrucciones puede generar un cuello de botella (Von Neumann bottleneck).',
    true,
    'Verdadero. Como datos e instrucciones viajan por el mismo bus, no se pueden traer a la vez, limitando el rendimiento; Harvard mitiga esto con buses separados.'),

  mc('arq-t-026', 'Rendimiento', 3,
    'El pipelining mejora el rendimiento del procesador porque…',
    [
      'Solapa las etapas (fetch, decode, execute) de varias instrucciones, aumentando el throughput',
      'Reduce la cantidad de instrucciones del programa',
      'Elimina la necesidad de memoria caché',
      'Aumenta automáticamente la frecuencia del reloj',
    ], 0,
    'El pipeline procesa distintas etapas de varias instrucciones a la vez. No baja la latencia de una instrucción, pero eleva las instrucciones completadas por unidad de tiempo.'),

  mc('arq-t-027', 'Rendimiento', 3,
    'Una CPU de 2 GHz ejecuta una instrucción que requiere 4 ciclos de reloj. ¿Cuánto tarda esa instrucción?',
    [
      '2 ns',
      '4 ns',
      '8 ns',
      '0,5 ns',
    ], 0,
    'Un ciclo a 2 GHz dura 1 / 2×10⁹ = 0,5 ns. Cuatro ciclos = 4 × 0,5 = 2 ns.'),

  ms('arq-t-028', 'Rendimiento', 3,
    'Seleccioná TODAS las afirmaciones correctas sobre CPU y rendimiento:',
    [
      'El pipelining aumenta el throughput solapando etapas',
      'Más núcleos permiten ejecutar hilos en paralelo real',
      'El CPI son los ciclos por instrucción',
      'Tiempo de CPU = (instrucciones × CPI) / frecuencia',
      'Aumentar solo la frecuencia (GHz) siempre garantiza mejor rendimiento',
      'Un único núcleo ejecuta varios hilos en paralelo físico real',
    ], [0, 1, 2, 3],
    'Pipeline (throughput), núcleos (paralelismo real), CPI y la fórmula del tiempo de CPU son correctas. Más GHz no siempre mejora (depende de arquitectura/CPI) y un núcleo no da paralelismo físico real.'),

  mc('arq-t-029', 'Interrupciones', 3,
    'Una interrupción permite que…',
    [
      'Un dispositivo avise a la CPU de un evento sin que ésta tenga que consultarlo constantemente (evita el polling)',
      'La CPU ejecute siempre las instrucciones en orden estricto',
      'Se borren todos los registros de la CPU',
      'El programa se compile más rápido',
    ], 0,
    'La interrupción evita el "polling" (consulta continua): el dispositivo interrumpe a la CPU cuando ocurre el evento, liberándola para otras tareas mientras tanto.'),

  mc('arq-t-030', 'Almacenamiento', 2,
    'Una ventaja del SSD frente al HDD es que…',
    [
      'No tiene partes mecánicas móviles: es más rápido, silencioso y resistente a golpes',
      'Siempre ofrece más capacidad por el mismo precio',
      'Es volátil y pierde los datos al apagarse',
      'Usa platos magnéticos giratorios',
    ], 0,
    'El SSD usa memoria flash (sin partes móviles): más veloz, silencioso y resistente. El HDD sí tiene platos giratorios y cabezales mecánicos.'),
]);
