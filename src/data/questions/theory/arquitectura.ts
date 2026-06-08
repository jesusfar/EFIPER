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

  mc('arq-t-031', 'Representación', 2,
    '¿Cuál es la representación binaria del número 45 (decimal)?',
    [
      '101101',
      '101011',
      '110101',
      '101110',
    ], 0,
    '45 = 32 + 8 + 4 + 1 = 2⁵ + 2³ + 2² + 2⁰ ⇒ 101101.'),

  mc('arq-t-032', 'Representación', 2,
    '¿Cuál es el valor decimal del número binario 11010?',
    [
      '26',
      '24',
      '28',
      '22',
    ], 0,
    '11010 = 16 + 8 + 0 + 2 + 0 = 26 (sumando las potencias de 2 con bit en 1).'),

  mc('arq-t-033', 'Representación', 2,
    '¿Cuál es el valor decimal del número hexadecimal 0x1A?',
    [
      '26',
      '16',
      '32',
      '110',
    ], 0,
    '0x1A = 1×16 + 10 (A) = 16 + 10 = 26.'),

  mc('arq-t-034', 'Representación', 3,
    'El número octal 17 (base 8) equivale en decimal a…',
    [
      '15',
      '17',
      '23',
      '11',
    ], 0,
    '17 en octal = 1×8 + 7×1 = 8 + 7 = 15. (En octal cada posición vale una potencia de 8).'),

  mc('arq-t-035', 'Aritmética binaria', 3,
    '¿Cuál es el resultado de la suma binaria 1011 + 0110?',
    [
      '10001',
      '1111',
      '10000',
      '1001',
    ], 0,
    '1011 (11) + 0110 (6) = 17 = 10001. Se suma bit a bit propagando el acarreo.'),

  mc('arq-t-036', 'Aritmética binaria', 3,
    'En una suma en complemento a 2, ocurre OVERFLOW (desbordamiento) cuando…',
    [
      'El resultado excede el rango representable (ej. sumar dos positivos y obtener un negativo)',
      'Se produce acarreo del bit menos significativo',
      'El resultado es exactamente cero',
      'Se suman dos números de distinto signo',
    ], 0,
    'El overflow aparece al sumar dos operandos del mismo signo y obtener un resultado del signo contrario (fuera de rango). Sumar signos distintos nunca desborda.'),

  tf('arq-t-037', 'Aritmética binaria', 3,
    'El acarreo (carry) y el desbordamiento (overflow) son distintos: el carry es el bit que sale del bit más significativo, mientras que el overflow indica que el resultado con signo quedó incorrecto.',
    true,
    'Verdadero. En aritmética sin signo importa el carry; en complemento a 2 importa el overflow. Pueden darse de forma independiente.'),

  mc('arq-t-038', 'Códigos', 3,
    'El código BCD (Decimal Codificado en Binario) representa…',
    [
      'Cada dígito decimal por separado con 4 bits (ej. 25 = 0010 0101)',
      'El número completo en binario puro',
      'Caracteres de texto',
      'Números de punto flotante',
    ], 0,
    'BCD codifica dígito por dígito en grupos de 4 bits, lo que facilita mostrar decimales pero usa más bits que el binario puro.'),

  mc('arq-t-039', 'Códigos', 3,
    'En BCD, el número decimal 39 se representa como…',
    [
      '0011 1001',
      '00100111',
      '0011 1000',
      '0100 1001',
    ], 0,
    'En BCD cada dígito va en 4 bits: 3 = 0011 y 9 = 1001 ⇒ 0011 1001. (En binario PURO, 39 sería 100111.)'),

  mc('arq-t-040', 'Códigos', 2,
    'Un bit de paridad sirve para…',
    [
      'Detectar errores simples de transmisión (verifica que la cantidad de unos sea par o impar)',
      'Corregir cualquier error de transmisión',
      'Cifrar los datos transmitidos',
      'Aumentar la velocidad de transmisión',
    ], 0,
    'El bit de paridad ajusta el total de unos a par (o impar); si en la recepción no cuadra, hubo un error. Solo detecta, no corrige.'),

  tf('arq-t-041', 'Códigos', 3,
    'El bit de paridad detecta errores de un solo bit, pero no puede corregirlos ni detectar errores que afecten a una cantidad par de bits.',
    true,
    'Verdadero. Si se invierten dos bits, la paridad vuelve a cuadrar y el error pasa inadvertido; para corregir se necesitan códigos más potentes (ej. Hamming).'),

  mc('arq-t-042', 'Códigos', 3,
    'El código Gray se caracteriza por…',
    [
      'Que dos valores consecutivos difieren en un solo bit',
      'Representar cada dígito decimal con 4 bits',
      'Ser un código de cifrado',
      'Ser idéntico al binario puro',
    ], 0,
    'En Gray, pasar de un valor al siguiente cambia un único bit; esto reduce errores en sensores/encoders, donde varios bits cambiando a la vez podrían leerse mal.'),

  ms('arq-t-043', 'Códigos', 3,
    'Seleccioná TODAS las afirmaciones correctas sobre los códigos:',
    [
      'BCD codifica cada dígito decimal en 4 bits',
      'En el código Gray, valores consecutivos difieren en un solo bit',
      'El bit de paridad detecta errores de un solo bit',
      'ASCII codifica caracteres (letras, dígitos, símbolos)',
      'BCD representa el número completo en binario puro',
      'El bit de paridad puede corregir los errores que detecta',
    ], [0, 1, 2, 3],
    'BCD (4 bits/dígito), Gray (cambia 1 bit), paridad (detecta 1 bit) y ASCII (caracteres) son correctas. BCD no es binario puro y la paridad solo detecta, no corrige.'),

  mc('arq-t-044', 'Memoria', 3,
    '¿Cuál es la diferencia entre la RAM estática (SRAM) y la dinámica (DRAM)?',
    [
      'La SRAM es más rápida y no necesita refresco (usa flip-flops); la DRAM es más lenta, densa y barata, y requiere refresco periódico',
      'La DRAM es más rápida que la SRAM',
      'La SRAM necesita refresco constante de sus celdas',
      'Son tecnologías idénticas',
    ], 0,
    'La SRAM (rápida, cara) se usa en la caché; la DRAM (densa, barata, con refresco) se usa como memoria principal. El refresco de la DRAM es por sus condensadores.'),

  tf('arq-t-045', 'Memoria', 3,
    'La DRAM almacena cada bit en un condensador que pierde carga con el tiempo, por eso necesita refrescarse periódicamente.',
    true,
    'Verdadero. El condensador se descarga, así que la DRAM relee y reescribe sus celdas continuamente para no perder los datos; la SRAM (flip-flops) no lo necesita.'),

  mc('arq-t-046', 'Caché', 3,
    'En un mapeo de caché DIRECTO…',
    [
      'Cada bloque de memoria puede ubicarse en una única línea de caché determinada (por su dirección, módulo el nº de líneas)',
      'Cada bloque puede ir a cualquier línea de la caché',
      'No se utilizan líneas de caché',
      'Cada bloque va a un conjunto de líneas a elección',
    ], 0,
    'El mapeo directo es simple y rápido de buscar, pero como cada bloque tiene una sola línea posible, sufre fallos por conflicto cuando varios bloques compiten por la misma línea.'),

  mc('arq-t-047', 'Caché', 3,
    'En un mapeo de caché TOTALMENTE asociativo…',
    [
      'Un bloque de memoria puede ubicarse en CUALQUIER línea de la caché',
      'Un bloque va siempre a una única línea fija',
      'No existe memoria caché',
      'Solo cabe un bloque en toda la caché',
    ], 0,
    'El totalmente asociativo da máxima flexibilidad (menos fallos por conflicto), pero buscar un bloque exige comparar todas las líneas, lo que es más caro y lento.'),

  mc('arq-t-048', 'Caché', 3,
    'El mapeo asociativo por conjuntos (set-associative)…',
    [
      'Es un punto medio: un bloque va a un conjunto específico y, dentro de él, a cualquier línea',
      'Es idéntico al mapeo directo',
      'No utiliza conjuntos',
      'Permite un único bloque por toda la caché',
    ], 0,
    'El set-associative equilibra costo y flexibilidad: el bloque se restringe a un conjunto (como el directo) pero puede ir a cualquier vía dentro de él (como el asociativo).'),

  ms('arq-t-049', 'Caché', 3,
    'Seleccioná TODAS las afirmaciones correctas sobre el mapeo de caché:',
    [
      'El mapeo directo asigna cada bloque a una única línea fija',
      'El totalmente asociativo permite ubicar un bloque en cualquier línea',
      'El asociativo por conjuntos es un punto medio entre ambos',
      'Mayor asociatividad reduce los fallos por conflicto, pero encarece la búsqueda',
      'El mapeo directo permite ubicar un bloque en cualquier línea',
      'El totalmente asociativo asigna una línea fija por bloque',
    ], [0, 1, 2, 3],
    'Directo = línea fija; asociativo = cualquier línea; set-associative = intermedio; más asociatividad = menos conflictos pero más costo. Las dos falsas intercambian directo y asociativo.'),

  mc('arq-t-050', 'Caché', 3,
    '¿Cuál es la diferencia entre las políticas write-through y write-back en una caché?',
    [
      'Write-through escribe a la vez en caché y memoria; write-back escribe en memoria solo al desalojar la línea (más rápido, pero necesita un bit "sucio")',
      'Write-back escribe siempre en memoria de inmediato',
      'Write-through nunca escribe en la memoria principal',
      'Son políticas idénticas',
    ], 0,
    'Write-through mantiene memoria y caché siempre coherentes (más tráfico); write-back posterga la escritura a memoria hasta desalojar la línea modificada, reduciendo accesos.'),

  mc('arq-t-051', 'E/S', 2,
    'El sondeo (polling) en la entrada/salida consiste en…',
    [
      'Que la CPU consulte repetidamente el estado del dispositivo, desperdiciando ciclos mientras espera',
      'Que el dispositivo interrumpa a la CPU cuando termina',
      'Transferir datos sin intervención de la CPU',
      'Cifrar los datos antes de transferirlos',
    ], 0,
    'En polling la CPU pregunta una y otra vez "¿ya estás listo?", malgastando ciclos. Las interrupciones evitan esa espera activa.'),

  tf('arq-t-052', 'E/S', 3,
    'El DMA (Acceso Directo a Memoria) permite que un dispositivo transfiera datos a/desde la memoria sin la intervención continua de la CPU.',
    true,
    'Verdadero. El controlador de DMA realiza la transferencia y avisa a la CPU al terminar (interrupción), liberándola de copiar los datos byte por byte.'),

  ms('arq-t-053', 'E/S', 3,
    'Seleccioná TODAS las afirmaciones correctas sobre las técnicas de E/S:',
    [
      'El polling consulta repetidamente el dispositivo, desperdiciando ciclos de CPU',
      'Las interrupciones avisan a la CPU cuando ocurre el evento',
      'El DMA transfiere datos entre dispositivo y memoria sin la CPU',
      'El DMA libera a la CPU para otras tareas durante la transferencia',
      'El polling es más eficiente que el esquema por interrupciones',
      'El DMA requiere que la CPU copie byte por byte',
    ], [0, 1, 2, 3],
    'Polling = espera activa; interrupciones = aviso; DMA = transferencia sin CPU que la libera. Las dos falsas contradicen la eficiencia de las interrupciones y el propósito del DMA.'),

  mc('arq-t-054', 'CPU', 3,
    'El registro de banderas (flags / registro de estado) almacena…',
    [
      'Indicadores del resultado de las operaciones (cero, acarreo, signo, overflow)',
      'El programa completo en ejecución',
      'Los datos de propósito general del usuario',
      'El contenido de la memoria caché',
    ], 0,
    'Cada bandera refleja una condición del último resultado de la ALU; las instrucciones de salto condicional las consultan para decidir el flujo.'),

  tf('arq-t-055', 'CPU', 2,
    'La bandera Z (cero) se activa cuando el resultado de una operación es cero.',
    true,
    'Verdadero. La flag Z se pone en 1 si el resultado fue cero; se usa, por ejemplo, en saltos del tipo "salta si es igual" (JZ/JE).'),

  tf('arq-t-056', 'CPU', 3,
    'Las banderas de estado (zero, carry, sign, overflow) las usan las instrucciones de salto condicional para tomar decisiones.',
    true,
    'Verdadero. Una comparación deja su huella en las flags y el salto condicional las evalúa para bifurcar el programa (if/else, bucles, etc.).'),

  mc('arq-t-057', 'Memoria', 3,
    'Una memoria de "1K × 8" significa…',
    [
      '1024 posiciones, cada una de 8 bits (1 byte)',
      '1024 bits en total',
      '8 posiciones de 1024 bits cada una',
      '1 posición de 8 KB',
    ], 0,
    '"1K × 8" = 1024 palabras de 8 bits = 1024 bytes = 1 KiB. El primer número es la cantidad de posiciones y el segundo, el ancho de cada palabra.'),

  mc('arq-t-058', 'Memoria', 3,
    'Para direccionar una memoria de 1024 posiciones se necesitan…',
    [
      '10 líneas de dirección',
      '1024 líneas de dirección',
      '8 líneas de dirección',
      '11 líneas de dirección',
    ], 0,
    '2¹⁰ = 1024, por lo tanto se necesitan 10 líneas de dirección para distinguir las 1024 posiciones.'),

  mc('arq-t-059', 'Memoria', 3,
    'Una memoria con 12 líneas de dirección y palabras de 8 bits tiene una capacidad de…',
    [
      '4 KiB (4096 bytes)',
      '12 KiB',
      '96 bits',
      '2 KiB',
    ], 0,
    '12 líneas ⇒ 2¹² = 4096 posiciones; cada palabra es de 8 bits (1 byte) ⇒ 4096 × 1 byte = 4096 bytes = 4 KiB.'),

  ms('arq-t-060', 'Memoria', 3,
    'Seleccioná TODAS las afirmaciones correctas sobre la memoria:',
    [
      'Con k líneas de dirección se pueden direccionar 2^k posiciones',
      'La SRAM es más rápida que la DRAM',
      'La ROM es no volátil (conserva los datos sin energía)',
      'La memoria caché suele implementarse con SRAM',
      'La DRAM no necesita refresco periódico',
      'Con k líneas de dirección se direccionan k posiciones',
    ], [0, 1, 2, 3],
    'k líneas → 2^k posiciones; SRAM > DRAM en velocidad; ROM no volátil; caché con SRAM. Las falsas: la DRAM SÍ necesita refresco y k líneas dan 2^k (no k) posiciones.'),
]);
