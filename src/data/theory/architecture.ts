import type { TheoryModule } from './modules';

export const ARCHITECTURE_THEORY_MODULE: TheoryModule = {
  topic: 'arquitectura_computadoras',
  title: 'Arquitectura de Computadoras',
  sections: [
    {
      title: 'Mapa general del eje',
      paragraphs: [
        'Arquitectura de Computadoras estudia como una maquina representa informacion, procesa instrucciones, mueve datos entre componentes y conserva resultados. No es una lista de piezas: es entender por que CPU, memoria, buses, perifericos y almacenamiento se organizan de cierta forma.',
        'Para el EFIP tenes que poder explicar desde cero el recorrido de un dato: nace como bits, puede representar un numero o caracter, viaja por buses, entra en registros, se opera en la ALU, se guarda en memoria o almacenamiento y puede salir por un dispositivo de entrada/salida.',
        'La respuesta profesional conecta concepto con consecuencia: una cache reduce latencia, un SSD mejora acceso aleatorio, RAID mejora disponibilidad o rendimiento segun nivel, DMA evita que la CPU copie byte por byte, y el ancho de bus limita cuanta informacion puede moverse por ciclo.',
      ],
      visuals: [
        { type: 'flow', title: 'Recorrido conceptual de la informacion', steps: ['Bits y codificacion', 'Circuitos logicos', 'CPU y registros', 'Cache/RAM', 'Buses e E/S', 'Almacenamiento'] },
        {
          type: 'cards',
          title: 'Bloques que siempre tenes que ubicar',
          items: [
            { label: 'Representacion', text: 'Bit, byte, binario, hexadecimal, BCD, ASCII/Unicode y complemento a 2.' },
            { label: 'Procesamiento', text: 'CPU, unidad de control, ALU, registros, ciclo de instruccion y rendimiento.' },
            { label: 'Movimiento', text: 'Buses de datos, direcciones y control; interfaces, interrupciones y DMA.' },
            { label: 'Persistencia', text: 'RAM, cache, ROM, Flash, HDD, SSD, sistemas de archivos y RAID.' },
          ],
        },
      ],
    },
    {
      title: 'Sistemas de numeracion y codificacion',
      paragraphs: [
        'Una computadora trabaja con estados discretos. Fisicamente esos estados pueden interpretarse como presencia o ausencia de tension; logicamente se representan como 0 y 1. Un bit es la unidad minima, un nibble son 4 bits y un byte son 8 bits.',
        'El sistema binario es natural para el hardware, pero en estudio se usan tambien octal y hexadecimal porque compactan grupos de bits. Un digito hexadecimal equivale a 4 bits; por eso direcciones de memoria, colores y volcados de memoria se expresan de forma mas legible en base 16.',
        'Para convertir binario a decimal se multiplican los digitos por potencias de 2. Para convertir decimal a binario se divide sucesivamente por 2 y se leen los restos desde abajo hacia arriba. Para pasar de binario a hexadecimal se agrupa de a 4 bits desde la derecha.',
        'Los caracteres no son letras para la maquina: son codigos. ASCII usa 7 bits para 128 simbolos basicos; ASCII extendido usa 8 bits; Unicode permite representar alfabetos y simbolos de multiples idiomas. BCD, en cambio, codifica cada digito decimal por separado usando 4 bits.',
      ],
      visuals: [
        {
          type: 'formulaGrid',
          title: 'Formulas base de representacion',
          items: [
            { label: 'Valor posicional', formula: 'N = dn*b^n + ... + d1*b + d0', example: '1011_2 = 8 + 0 + 2 + 1 = 11_10' },
            { label: 'Combinaciones', formula: '2^n', example: '8 bits = 256 combinaciones' },
            { label: 'Bits necesarios', formula: 'ceil(log2(M))', example: '10 simbolos decimales necesitan 4 bits' },
            { label: 'Hexadecimal', formula: '1 digito hex = 4 bits', example: 'A_16 = 1010_2' },
          ],
        },
        {
          type: 'compare',
          title: 'Bases mas usadas',
          columns: ['Base', 'Simbolos', 'Uso tipico'],
          rows: [
            ['2 Binario', '0, 1', 'Representacion interna del hardware'],
            ['8 Octal', '0 a 7', 'Agrupar bits de a 3'],
            ['10 Decimal', '0 a 9', 'Uso humano cotidiano'],
            ['16 Hexadecimal', '0 a 9, A a F', 'Memoria, direcciones, colores y depuracion'],
          ],
        },
      ],
    },
    {
      title: 'Logica digital y circuitos',
      paragraphs: [
        'Los circuitos digitales se construyen combinando compuertas logicas. Las compuertas implementan operaciones booleanas: NOT invierte, AND exige que todas las entradas sean 1, OR acepta que al menos una entrada sea 1, XOR vale 1 cuando las entradas son distintas.',
        'Un circuito combinacional produce salidas que dependen solo de las entradas actuales. Un medio sumador, por ejemplo, suma dos bits: la suma se obtiene con XOR y el acarreo con AND. Un sumador completo agrega un acarreo de entrada y permite construir sumadores de varios bits.',
        'Un circuito secuencial, en cambio, tiene memoria: su salida depende de entradas actuales y estado previo. Flip-flops, registros y contadores pertenecen a esta familia. Esta diferencia conecta compuertas con registros, memoria y CPU.',
      ],
      visuals: [
        {
          type: 'compare',
          title: 'Tabla de verdad esencial',
          columns: ['A', 'B', 'AND', 'OR', 'XOR', 'NAND', 'NOR'],
          rows: [
            ['0', '0', '0', '0', '0', '1', '1'],
            ['0', '1', '0', '1', '1', '1', '0'],
            ['1', '0', '0', '1', '1', '1', '0'],
            ['1', '1', '1', '1', '0', '0', '0'],
          ],
        },
        {
          type: 'cards',
          title: 'Medio sumador dibujado en bloques',
          items: [
            { label: 'Entrada A + B', text: 'Dos bits entran al circuito al mismo tiempo.' },
            { label: 'XOR -> Suma', text: 'La salida S vale 1 si A y B son distintos.' },
            { label: 'AND -> Carry', text: 'El acarreo C vale 1 solo si A y B son 1.' },
            { label: 'Base de la ALU', text: 'Sumadores encadenados permiten operar palabras de 8, 16, 32 o 64 bits.' },
          ],
        },
      ],
    },
    {
      title: 'Von Neumann, CPU y ciclo de instruccion',
      paragraphs: [
        'El modelo Von Neumann se basa en el concepto de programa almacenado: datos e instrucciones viven en la misma memoria principal. La CPU no se rediseña para cada tarea; cambia el programa cargado en memoria.',
        'La CPU se compone de unidad de control, ALU y registros. La unidad de control interpreta instrucciones y emite señales; la ALU realiza operaciones aritmeticas y logicas; los registros guardan operandos, direcciones, instrucciones y resultados inmediatos.',
        'El ciclo de instruccion se repite miles de millones de veces: buscar la instruccion en memoria, cargarla en el registro de instruccion, decodificarla, buscar operandos, ejecutar, guardar resultado y revisar interrupciones. PC, IR, MAR, MBR y flags son registros clasicos que ayudan a explicar ese recorrido.',
        'Para rendimiento, no respondas solo con GHz. El tiempo depende de instrucciones ejecutadas, CPI, frecuencia, cache, pipeline, nucleos, memoria y cuellos de botella. Una CPU rapida puede estar esperando RAM, disco o red.',
      ],
      visuals: [
        {
          type: 'bus',
          title: 'Modelo Von Neumann profesional',
          items: [
            { label: 'CPU', text: 'UC + ALU + registros ejecutan instrucciones.' },
            { label: 'Memoria principal', text: 'Contiene datos e instrucciones del programa.' },
            { label: 'Entrada/Salida', text: 'Conecta perifericos y almacenamiento externo.' },
            { label: 'Buses', text: 'Datos, direcciones y control unen los bloques.' },
          ],
        },
        { type: 'flow', title: 'Ciclo fetch-decode-execute', steps: ['PC apunta', 'Fetch en memoria', 'IR recibe instruccion', 'UC decodifica', 'ALU ejecuta', 'Writeback', 'Interrupciones'] },
        {
          type: 'formulaGrid',
          title: 'Rendimiento de CPU',
          items: [
            { label: 'Periodo', formula: 'T = 1 / f', example: '3 GHz -> 0,333 ns por ciclo' },
            { label: 'Ciclos', formula: 'ciclos = instrucciones * CPI', example: '100 M instr * 2 CPI = 200 M ciclos' },
            { label: 'Tiempo', formula: 'tiempo = ciclos / frecuencia', example: '200 M / 2 GHz = 0,1 s' },
            { label: 'Pipeline ideal', formula: 'ciclos = etapas + instrucciones - 1', example: '5 etapas, 10 instr -> 14 ciclos' },
          ],
        },
      ],
    },
    {
      title: 'Jerarquia de memoria, RAM y cache',
      paragraphs: [
        'La memoria se organiza por velocidad, costo y capacidad. Arriba estan registros y cache: son muy rapidos, caros y pequeños. Abajo aparecen RAM, SSD y HDD: aumentan capacidad, bajan costo por GB y sube la latencia.',
        'SRAM suele usarse en cache porque es rapida y no necesita refresco, pero ocupa mas transistores. DRAM se usa como memoria principal porque ofrece mucha mas densidad, aunque necesita refresco periodico. ROM, EEPROM y Flash son no volatiles: conservan informacion sin energia.',
        'La cache aprovecha localidad temporal y espacial. Localidad temporal significa que un dato usado recientemente probablemente vuelva a usarse. Localidad espacial significa que, si se accede a una direccion, probablemente se acceda a direcciones cercanas.',
        'Para calcular tiempo medio de acceso se usa AMAT: tiempo de acierto mas tasa de fallos por penalizacion de fallo. Si la tasa de fallos sube, la CPU pierde tiempo esperando memoria principal.',
      ],
      visuals: [
        {
          type: 'stack',
          title: 'Jerarquia de memoria',
          items: [
            { label: 'Registros CPU', detail: 'Maxima velocidad, minima capacidad' },
            { label: 'Cache L1', detail: 'Muy rapida, pegada al nucleo' },
            { label: 'Cache L2/L3', detail: 'Mas capacidad, algo mas lenta' },
            { label: 'RAM', detail: 'Volatil, memoria principal de ejecucion' },
            { label: 'SSD', detail: 'Persistente, baja latencia frente a HDD' },
            { label: 'HDD/opticos/nube', detail: 'Gran capacidad, mayor latencia' },
          ],
        },
        {
          type: 'compare',
          title: 'SRAM contra DRAM',
          columns: ['Criterio', 'SRAM', 'DRAM'],
          rows: [
            ['Celda', 'Flip-flop', 'Capacitor + transistor'],
            ['Refresco', 'No necesita', 'Necesita refresco'],
            ['Velocidad', 'Muy alta', 'Media/alta'],
            ['Densidad', 'Menor', 'Mayor'],
            ['Uso tipico', 'Cache', 'RAM principal'],
          ],
        },
        {
          type: 'formulaGrid',
          title: 'Cache en calculos de examen',
          items: [
            { label: 'Miss rate', formula: 'fallos / accesos', example: '30 fallos / 1000 accesos = 3%' },
            { label: 'Hit rate', formula: '1 - miss rate', example: '3% fallos -> 97% aciertos' },
            { label: 'AMAT', formula: 'hit time + miss rate * penalty', example: '1 ns + 0,03*100 ns = 4 ns' },
            { label: 'Lineas', formula: 'tam_cache / tam_linea', example: '16 KiB / 32 B = 512 lineas' },
          ],
        },
      ],
    },
    {
      title: 'Motherboard, buses, interfaces y entrada/salida',
      paragraphs: [
        'La motherboard conecta CPU, RAM, almacenamiento, placa de video, red, audio y perifericos. En placas modernas muchas funciones que antes estaban en northbridge/southbridge se integran en CPU o chipset/PCH, pero la idea sigue siendo coordinar comunicacion entre componentes.',
        'Un bus es un conjunto de lineas que transporta informacion. El bus de datos lleva valores; el bus de direcciones indica ubicaciones; el bus de control coordina lectura, escritura, interrupciones, reloj y permisos de uso.',
        'Los perifericos son mas lentos que la CPU. Para no desperdiciar ciclos, se usan controladores de E/S, buffers, interrupciones y DMA. Con interrupciones, el dispositivo avisa cuando necesita atencion. Con DMA, un controlador transfiere bloques entre memoria y periferico sin que la CPU copie cada byte.',
        'Tambien tenes que reconocer interfaces: USB para perifericos generales, SATA/SAS para almacenamiento, PCIe para expansion de alta velocidad, y buses historicos como IDE/ATA, SCSI, Centronics o RS-232 para contexto.',
      ],
      visuals: [
        {
          type: 'bus',
          title: 'Tres buses, tres responsabilidades',
          items: [
            { label: 'Datos', text: 'Transporta el contenido que se lee o escribe.' },
            { label: 'Direcciones', text: 'Indica que posicion de memoria o dispositivo se accede.' },
            { label: 'Control', text: 'Sincroniza lectura, escritura, interrupciones y estados.' },
            { label: 'Ancho + frecuencia', text: 'Determinan el ancho de banda teorico.' },
          ],
        },
        {
          type: 'formulaGrid',
          title: 'Transferencia y direccionamiento',
          items: [
            { label: 'Ancho de banda', formula: 'BW = frecuencia * ancho * transferencias', example: '64 bits, 400 MHz DDR -> 6,4 GB/s' },
            { label: 'Bits a bytes', formula: 'bytes/s = bits/s / 8', example: '6 Gbit/s -> 750 MB/s bruto' },
            { label: 'Direccionable', formula: '2^bits_direccion * palabra', example: '32 bits byte-addressable -> 4 GiB' },
            { label: 'DMA', formula: 'CPU configura + controlador transfiere', example: 'Ideal para disco, red y audio/video' },
          ],
        },
      ],
    },
    {
      title: 'Almacenamiento, archivos, HDD, SSD y RAID',
      paragraphs: [
        'Un sistema de archivos organiza archivos, directorios, metadatos y bloques fisicos o logicos. El disco se divide en sectores; el sistema de archivos suele agrupar sectores en clusteres. Si un archivo no ocupa completo el ultimo cluster aparece slack, que es espacio asignado pero no usado por el contenido real.',
        'Un HDD usa platos magneticos, pistas, sectores, cabezales y movimiento mecanico. Su tiempo de acceso incluye busqueda, latencia rotacional y transferencia. Un SSD usa memoria Flash NAND, no tiene partes moviles y mejora mucho el acceso aleatorio, aunque tiene limites de ciclos de escritura y depende del controlador.',
        'RAID combina discos. RAID 0 distribuye datos y mejora rendimiento, pero si falla un disco se pierde el conjunto. RAID 1 espeja. RAID 5 usa paridad distribuida y tolera un fallo. RAID 6 usa doble paridad y tolera dos fallos. RAID 10 combina espejado y striping.',
        'En un caso real, RAID no reemplaza backups. RAID ayuda a disponibilidad; el backup protege ante borrado, corrupcion, ransomware o desastre fisico.',
      ],
      visuals: [
        {
          type: 'formulaGrid',
          title: 'Calculos clasicos de almacenamiento',
          items: [
            { label: 'Clusteres', formula: 'ceil(tam_archivo / tam_cluster)', example: '25.000 B / 8192 B -> 4 clusteres' },
            { label: 'Slack', formula: 'asignado - tam_archivo', example: '32.768 - 25.000 = 7.768 B' },
            { label: 'Vuelta HDD', formula: '60 / RPM', example: '7200 RPM -> 8,33 ms' },
            { label: 'Latencia media', formula: '(60 / RPM) / 2', example: '7200 RPM -> 4,17 ms' },
          ],
        },
        {
          type: 'raid',
          title: 'RAID en una mirada',
          items: [
            { level: 'RAID 0', capacity: 'N*C', tolerance: '0 discos', text: 'Striping. Rendimiento, sin redundancia.' },
            { level: 'RAID 1', capacity: 'C', tolerance: '1 disco por espejo', text: 'Mirroring. Prioriza continuidad.' },
            { level: 'RAID 5', capacity: '(N-1)*C', tolerance: '1 disco', text: 'Paridad distribuida.' },
            { level: 'RAID 6', capacity: '(N-2)*C', tolerance: '2 discos', text: 'Doble paridad.' },
            { level: 'RAID 10', capacity: '(N/2)*C', tolerance: 'segun pares', text: 'Espejo + striping.' },
          ],
        },
      ],
    },
    {
      title: 'Microprocesador, pipeline, RISC/CISC y paralelismo',
      paragraphs: [
        'El microprocesador integra unidades de ejecucion, registros, cache y logica de control. Puede incluir FPU para punto flotante, SIMD para operar muchos datos iguales en paralelo, MMU para traduccion de direcciones y mecanismos de prediccion o ejecucion fuera de orden segun arquitectura.',
        'El pipeline divide la ejecucion de instrucciones en etapas. No hace que una instruccion individual sea magicamente instantanea; aumenta el throughput porque varias instrucciones avanzan por distintas etapas al mismo tiempo. Sus riesgos son estructurales, de datos y de control.',
        'CISC usa instrucciones mas complejas y variadas, muchas veces de longitud variable; historicamente busca que una instruccion haga bastante trabajo. RISC usa instrucciones simples, regulares y de estilo load/store, lo que facilita pipeline, decodificacion y optimizacion.',
        'Nucleos fisicos e hilos logicos no son lo mismo. SMT o Hyper-Threading permite que un nucleo mantenga mas de un hilo logico para aprovechar unidades ociosas, pero esos hilos comparten recursos del nucleo.',
      ],
      visuals: [
        { type: 'flow', title: 'Pipeline de 5 etapas', steps: ['IF buscar', 'ID decodificar', 'EX ejecutar', 'MEM acceder', 'WB escribir'] },
        {
          type: 'compare',
          title: 'RISC vs CISC',
          columns: ['Criterio', 'RISC', 'CISC'],
          rows: [
            ['Instrucciones', 'Simples y regulares', 'Amplias y complejas'],
            ['Memoria', 'Load/store', 'Mas modos de direccionamiento'],
            ['Pipeline', 'Mas facil de optimizar', 'Decodificacion mas costosa'],
            ['Ejemplo conceptual', 'ARM/RISC-V', 'x86 como familia historica CISC'],
          ],
        },
      ],
    },
    {
      title: 'Conversion analogico-digital, audio, imagen y video',
      paragraphs: [
        'La conversion analogico-digital transforma una señal continua en datos discretos. Primero se toma una muestra a intervalos regulares, luego se cuantifica asignando niveles y finalmente se codifica en bits.',
        'Nyquist indica que para reconstruir una señal, la frecuencia de muestreo debe ser al menos el doble de la maxima frecuencia presente. Para audio humano hasta 20 kHz, por eso se usan frecuencias superiores a 40 kHz, como 44,1 kHz.',
        'En imagen digital, el tamaño sin compresion depende de ancho, alto y bits por pixel. En video, ademas se multiplica por frames por segundo. Estos calculos explican por que se usan codecs y compresion: video sin comprimir consume enormes tasas de datos.',
      ],
      visuals: [
        { type: 'flow', title: 'Cadena A/D', steps: ['Señal analogica', 'Muestreo', 'Cuantificacion', 'Codificacion binaria', 'Datos digitales'] },
        {
          type: 'formulaGrid',
          title: 'Multimedia en formulas',
          items: [
            { label: 'Nyquist', formula: 'fs >= 2*fmax', example: '20 kHz -> al menos 40 kHz' },
            { label: 'Niveles', formula: 'N = 2^n', example: '8 bits -> 256 niveles' },
            { label: 'Audio', formula: 'fs * bits * canales', example: '44.100*16*2 = 1.411.200 bps' },
            { label: 'Imagen', formula: 'ancho * alto * bpp / 8', example: '1920*1080*24/8 = 6.220.800 B' },
          ],
        },
      ],
    },
    {
      title: 'Complemento a 2, BCD, fracciones y codigos',
      paragraphs: [
        'Los enteros sin signo representan valores desde 0 hasta 2^n - 1. Con 8 bits unsigned, el rango es 0 a 255. Para representar negativos se usa con frecuencia complemento a 2, porque permite sumar y restar con el mismo circuito aritmetico.',
        'En complemento a 2 de n bits, el rango es -2^(n-1) hasta 2^(n-1)-1. Con 8 bits, el rango es -128 a 127. Para representar un numero negativo, se escribe el positivo, se invierten los bits y se suma 1. Ejemplo: +85 = 01010101; invertir = 10101010; +1 = 10101011; entonces -85 = 10101011.',
        'El overflow ocurre cuando el resultado real no entra en el rango disponible. En complemento a 2, sumar dos positivos y obtener signo negativo indica overflow; sumar dos negativos y obtener signo positivo tambien. No alcanza con mirar solo el acarreo final.',
        'BCD codifica cada digito decimal por separado. En BCD 8421, 15 se representa como 0001 0101, no como 1111 binario puro. Exceso 3 suma 3 a cada digito antes de codificarlo. Aiken 2421 usa pesos 2-4-2-1 y suele trabajarse con complemento a 9 para los digitos desde 5.',
        'Las fracciones binarias usan potencias negativas: 0,101_2 = 1*2^-1 + 0*2^-2 + 1*2^-3 = 0,5 + 0 + 0,125 = 0,625. Esta idea ayuda a entender por que algunos decimales no se representan exactamente en binario.',
      ],
      visuals: [
        {
          type: 'formulaGrid',
          title: 'Enteros y codificacion',
          items: [
            { label: 'Unsigned', formula: '0 a 2^n - 1', example: '8 bits -> 0 a 255' },
            { label: 'Complemento a 2', formula: '-2^(n-1) a 2^(n-1)-1', example: '8 bits -> -128 a 127' },
            { label: 'BCD 8421', formula: '1 digito decimal = 4 bits', example: '15 -> 0001 0101' },
            { label: 'Fraccion binaria', formula: 'bits despues de coma = 2^-1, 2^-2...', example: '0,101_2 = 0,625' },
          ],
        },
        {
          type: 'compare',
          title: 'BCD principales',
          columns: ['Codigo', 'Regla', 'Ejemplo con 5'],
          rows: [
            ['BCD 8421', 'Pesos 8-4-2-1', '0101'],
            ['Exceso 3', 'Sumar 3 al digito', '5+3=8 -> 1000'],
            ['Aiken 2421', 'Pesos 2-4-2-1', '1011'],
          ],
        },
      ],
    },
    {
      title: 'Algebra de Boole, sumador completo y registros',
      paragraphs: [
        'El algebra de Boole permite simplificar circuitos logicos. Las leyes mas usadas son identidad, dominacion, idempotencia, complemento, doble negacion y De Morgan. De Morgan es clave: negar una AND equivale a OR de negados; negar una OR equivale a AND de negados.',
        'Para armar una tabla de verdad completa se listan todas las combinaciones posibles de entradas. Con n variables hay 2^n filas. Luego se calculan columnas intermedias hasta llegar a la salida. Esta tecnica sirve tanto para ejercicios como para explicar circuitos en oral.',
        'El sumador completo suma A, B y Cin. Su salida de suma es A XOR B XOR Cin. El acarreo de salida es (A AND B) OR (Cin AND (A XOR B)). Encadenando sumadores completos se suman palabras binarias de varios bits.',
        'Los flip-flops son circuitos secuenciales que almacenan estado. Un registro agrupa varios flip-flops para guardar una palabra. Asi se conectan las compuertas con elementos reales de CPU: registros, contadores, acumuladores y buffers internos.',
      ],
      visuals: [
        {
          type: 'compare',
          title: 'Leyes booleanas utiles',
          columns: ['Ley', 'Expresion', 'Idea'],
          rows: [
            ['Identidad', 'A*1=A / A+0=A', 'El neutro no cambia el valor'],
            ['Dominacion', 'A*0=0 / A+1=1', 'Un valor domina la operacion'],
            ['Complemento', 'A+not A=1 / A*not A=0', 'Una variable y su opuesto cubren todos los casos'],
            ['De Morgan', 'not(A*B)=not A + not B', 'Cambiar AND por OR al negar'],
          ],
        },
        {
          type: 'cards',
          title: 'Sumador completo',
          items: [
            { label: 'Entradas', text: 'A, B y Cin representan dos bits y el acarreo entrante.' },
            { label: 'Suma', text: 'S = A XOR B XOR Cin.' },
            { label: 'Carry out', text: 'Cout = (A AND B) OR (Cin AND (A XOR B)).' },
            { label: 'Uso', text: 'Varios sumadores completos forman un sumador de palabras binarias.' },
          ],
        },
      ],
    },
    {
      title: 'Registros, direccionamiento y unidad de control',
      paragraphs: [
        'Los registros permiten que la CPU trabaje sin ir a memoria principal en cada paso. PC guarda la direccion de la proxima instruccion; IR guarda la instruccion actual; MAR guarda la direccion de memoria a acceder; MBR o MDR guarda el dato que entra o sale de memoria; el registro de estado conserva flags como cero, signo, carry y overflow.',
        'Los modos de direccionamiento describen como una instruccion localiza sus operandos. Inmediato usa un valor dentro de la instruccion; directo usa una direccion; indirecto usa una direccion que apunta a otra; por registro usa un registro; indexado combina base e indice.',
        'La unidad de control coordina microoperaciones: cargar registros, habilitar buses, ordenar lectura/escritura, seleccionar operacion de ALU y manejar saltos o interrupciones. Puede ser cableada, con logica fija rapida, o microprogramada, con microinstrucciones mas flexibles.',
      ],
      visuals: [
        {
          type: 'compare',
          title: 'Registros clasicos',
          columns: ['Registro', 'Nombre', 'Funcion'],
          rows: [
            ['PC', 'Program Counter', 'Direccion de la proxima instruccion'],
            ['IR', 'Instruction Register', 'Instruccion actualmente cargada'],
            ['MAR', 'Memory Address Register', 'Direccion de memoria a leer o escribir'],
            ['MBR/MDR', 'Memory Buffer/Data Register', 'Dato que entra o sale de memoria'],
            ['Flags', 'Estado', 'Cero, signo, carry, overflow e interrupciones'],
          ],
        },
        {
          type: 'compare',
          title: 'Modos de direccionamiento',
          columns: ['Modo', 'Como obtiene el operando', 'Ejemplo conceptual'],
          rows: [
            ['Inmediato', 'El valor esta en la instruccion', 'MOV R1, #5'],
            ['Directo', 'La instruccion trae una direccion', 'Leer memoria[1000]'],
            ['Indirecto', 'La direccion apunta a otra direccion', 'Leer memoria[memoria[1000]]'],
            ['Registro', 'El operando esta en un registro', 'ADD R1, R2'],
            ['Indexado', 'Base + desplazamiento', 'vector[i]'],
          ],
        },
      ],
    },
    {
      title: 'Cache avanzada: mapeo, politicas y campos',
      paragraphs: [
        'Una cache se organiza en lineas que guardan bloques de memoria. En mapeo directo, cada bloque de memoria solo puede ir a una linea concreta; es simple y rapido, pero puede generar conflictos. En asociativa total, un bloque puede ir a cualquier linea; reduce conflictos pero exige busqueda mas costosa. En asociativa por conjuntos, cada bloque va a un conjunto y dentro de ese conjunto puede ocupar varias vias.',
        'Una direccion de memoria se divide en tag, indice y offset. El offset selecciona el byte dentro del bloque; el indice selecciona linea o conjunto; el tag identifica que bloque real esta cargado. En una cache directa de 16 KiB, bloque de 32 B y direccion de 32 bits: lineas = 16384/32 = 512; indice = 9 bits; offset = 5 bits; tag = 32 - 9 - 5 = 18 bits.',
        'Las politicas de reemplazo deciden que linea sacar cuando no hay lugar. FIFO saca la mas antigua; LRU saca la menos usada recientemente; LFU saca la menos frecuente. Las politicas de escritura definen cuando se actualiza RAM: write-through escribe cache y memoria; write-back escribe primero cache y luego baja a memoria cuando corresponde.',
        'Las politicas de asignacion responden que hacer ante un fallo de escritura. Write-allocate carga el bloque en cache y escribe; no-write-allocate escribe directamente en memoria sin cargar. Estas decisiones afectan rendimiento, coherencia y trafico de memoria.',
      ],
      visuals: [
        {
          type: 'formulaGrid',
          title: 'Campos de cache',
          items: [
            { label: 'Offset', formula: 'log2(tam_bloque)', example: '32 B -> 5 bits' },
            { label: 'Lineas', formula: 'tam_cache / tam_bloque', example: '16 KiB / 32 B = 512' },
            { label: 'Indice', formula: 'log2(lineas o conjuntos)', example: '512 lineas -> 9 bits' },
            { label: 'Tag', formula: 'bits_direccion - indice - offset', example: '32 - 9 - 5 = 18 bits' },
          ],
        },
        {
          type: 'compare',
          title: 'Organizacion de cache',
          columns: ['Tipo', 'Ventaja', 'Costo/riesgo'],
          rows: [
            ['Directa', 'Rapida y simple', 'Mas conflictos'],
            ['Asociativa total', 'Menos conflictos', 'Busqueda mas cara'],
            ['Por conjuntos', 'Equilibrio practico', 'Requiere politica de reemplazo'],
          ],
        },
        {
          type: 'compare',
          title: 'Politicas de escritura',
          columns: ['Politica', 'Que hace', 'Consecuencia'],
          rows: [
            ['Write-through', 'Escribe cache y RAM', 'Mas trafico, coherencia simple'],
            ['Write-back', 'Escribe cache y difiere RAM', 'Menos trafico, requiere bit dirty'],
            ['Write-allocate', 'Carga bloque ante fallo de escritura', 'Bueno si habra reutilizacion'],
            ['No-write-allocate', 'Escribe sin cargar', 'Evita contaminar cache'],
          ],
        },
      ],
    },
    {
      title: 'Speedup, Ley de Amdahl y riesgos del pipeline',
      paragraphs: [
        'El speedup mide cuantas veces mejora una solucion respecto de otra: speedup = tiempo_original / tiempo_nuevo. Si un programa baja de 10 segundos a 4 segundos, el speedup es 2,5x.',
        'La Ley de Amdahl recuerda que el paralelismo esta limitado por la parte que no se puede paralelizar. Si una fraccion del trabajo sigue siendo secuencial, agregar nucleos no mejora indefinidamente. Es una respuesta excelente cuando preguntan por rendimiento real y no solo por hardware mas potente.',
        'El pipeline tiene tres riesgos principales. Riesgo estructural: dos etapas necesitan el mismo recurso. Riesgo de datos: una instruccion depende del resultado de otra anterior. Riesgo de control: saltos y bifurcaciones hacen incierto cual sera la proxima instruccion.',
      ],
      visuals: [
        {
          type: 'formulaGrid',
          title: 'Paralelismo y rendimiento',
          items: [
            { label: 'Speedup', formula: 'S = T_original / T_nuevo', example: '10 s / 4 s = 2,5x' },
            { label: 'Amdahl', formula: 'S = 1 / (f + (1-f)/p)', example: 'f secuencial limita el maximo' },
            { label: 'Pipeline ideal', formula: 'etapas + instrucciones - 1', example: '5 etapas y 10 instr = 14 ciclos' },
            { label: 'Sin pipeline', formula: 'instrucciones * etapas', example: '10*5 = 50 ciclos' },
          ],
        },
        {
          type: 'cards',
          title: 'Riesgos del pipeline',
          items: [
            { label: 'Estructural', text: 'Dos instrucciones compiten por el mismo recurso fisico.' },
            { label: 'Datos', text: 'Una instruccion necesita un resultado que aun no esta listo.' },
            { label: 'Control', text: 'Un salto cambia el flujo y la CPU no sabe que traer.' },
            { label: 'Mitigacion', text: 'Stalls, forwarding, prediccion de saltos y mejor planificacion.' },
          ],
        },
      ],
    },
    {
      title: 'BIOS/UEFI, chipset, PCIe e interfaces',
      paragraphs: [
        'La motherboard es el sistema de interconexion fisica y logica. Sus componentes principales incluyen socket de CPU, slots de RAM, chipset o PCH, conectores de almacenamiento, slots PCIe, firmware BIOS/UEFI, reloj, regulacion de energia y puertos externos.',
        'BIOS/UEFI inicializa hardware, ejecuta POST, permite configuracion y arranca el sistema operativo. CMOS suele asociarse a configuracion persistente y reloj, tradicionalmente mantenidos por bateria. UEFI es mas moderno que BIOS clasico y soporta funciones como arranque seguro y discos grandes.',
        'Northbridge y southbridge son una division clasica: northbridge conectaba CPU con RAM y graficos; southbridge conectaba dispositivos mas lentos como SATA, USB, audio y red. En arquitecturas modernas, varias funciones se integran en la CPU y el chipset/PCH.',
        'PCIe usa enlaces punto a punto por lanes. Una placa puede usar x1, x4, x8 o x16 segun cantidad de carriles. A diferencia de buses compartidos antiguos, PCIe escala agregando lanes y versiones con mayor transferencia.',
        'Simplex transmite en un solo sentido; half-duplex transmite en ambos sentidos pero no simultaneamente; full-duplex transmite y recibe al mismo tiempo. Esta distincion aparece en comunicacion entre dispositivos y redes.',
      ],
      visuals: [
        {
          type: 'compare',
          title: 'Interfaces importantes',
          columns: ['Interfaz', 'Uso', 'Idea clave'],
          rows: [
            ['USB', 'Perifericos generales', 'Plug and play, energia y datos'],
            ['SATA', 'Discos HDD/SSD', 'Serie, mas moderno que IDE/ATA'],
            ['SAS', 'Almacenamiento servidor', 'Mas robusto, entorno empresarial'],
            ['PCIe', 'GPU, NVMe, red', 'Lanes punto a punto de alta velocidad'],
            ['RS-232/Centronics', 'Historicas', 'Serie/paralelo tradicionales'],
          ],
        },
        {
          type: 'compare',
          title: 'Simplex, half-duplex y full-duplex',
          columns: ['Modo', 'Direccion', 'Ejemplo conceptual'],
          rows: [
            ['Simplex', 'Solo un sentido', 'Emision sin retorno'],
            ['Half-duplex', 'Dos sentidos no simultaneos', 'Walkie-talkie'],
            ['Full-duplex', 'Dos sentidos simultaneos', 'Llamada telefonica'],
          ],
        },
      ],
    },
    {
      title: 'Sistemas de archivos: FAT, NTFS y capas',
      paragraphs: [
        'El almacenamiento se organiza por capas: dispositivo fisico, particion o volumen, sistema de archivos, directorios, archivos y metadatos. El usuario ve archivos, pero el sistema administra bloques, ubicaciones, permisos, fechas y estructuras internas.',
        'Una particion divide logicamente un disco. Un sector es una unidad fisica/logica minima de lectura o escritura. Una pista es una circunferencia en un plato de HDD. Un cilindro agrupa pistas alineadas en varias superficies. Un cluster es la unidad de asignacion que usa el sistema de archivos.',
        'FAT es simple y muy compatible, pero limitada en seguridad, journaling y manejo moderno. NTFS soporta permisos, journaling, archivos grandes, compresion/cifrado segun configuracion y mejor recuperacion. En examen, FAT suele asociarse a compatibilidad; NTFS a robustez y administracion avanzada.',
      ],
      visuals: [
        { type: 'flow', title: 'Capas del almacenamiento', steps: ['Disco fisico', 'Particion/volumen', 'Sistema de archivos', 'Directorios', 'Archivos', 'Metadatos'] },
        {
          type: 'compare',
          title: 'FAT vs NTFS',
          columns: ['Criterio', 'FAT', 'NTFS'],
          rows: [
            ['Compatibilidad', 'Muy alta', 'Alta en Windows'],
            ['Permisos', 'Limitados', 'Avanzados'],
            ['Journaling', 'No', 'Si'],
            ['Archivos grandes', 'Limitado segun version', 'Mejor soporte'],
            ['Uso tipico', 'Pendrives/compatibilidad', 'Discos de sistema Windows'],
          ],
        },
      ],
    },
    {
      title: 'SSD, HDD, medios opticos e IOPS',
      paragraphs: [
        'Un HDD tiene latencia mecanica: mover cabezal, esperar que gire el plato y transferir. Por eso su rendimiento cae mucho en acceso aleatorio. Un SSD usa memoria flash NAND, controlador, canales internos y gestion de bloques; su latencia es mucho menor, especialmente en lecturas aleatorias.',
        'IOPS significa operaciones de entrada/salida por segundo. Es clave para cargas con muchos accesos pequeños, como bases de datos, sistemas operativos y servidores. Un disco puede tener buena transferencia secuencial pero malos IOPS, o al reves segun tecnologia.',
        'Los medios opticos como CD, DVD y Blu-ray usan laser y superficies opticas. Son no volatiles y removibles, pero mas lentos y menos usados como almacenamiento principal actual. Siguen siendo importantes para entender tecnologias de almacenamiento masivo.',
      ],
      visuals: [
        {
          type: 'compare',
          title: 'RAM, SSD y HDD',
          columns: ['Criterio', 'RAM', 'SSD', 'HDD'],
          rows: [
            ['Volatil', 'Si', 'No', 'No'],
            ['Tecnologia', 'Semiconductora', 'Flash NAND', 'Magnetica mecanica'],
            ['Latencia', 'Nanosegundos', 'Micro/ms bajo', 'Milisegundos'],
            ['Fortaleza', 'Ejecucion', 'Acceso aleatorio', 'Costo por GB'],
          ],
        },
        {
          type: 'formulaGrid',
          title: 'HDD y transferencia',
          items: [
            { label: 'Tiempo de vuelta', formula: '60 / RPM', example: '5400 RPM -> 11,11 ms' },
            { label: 'Latencia media', formula: '(60/RPM)/2', example: '5400 RPM -> 5,56 ms' },
            { label: 'Transferencia', formula: 'tamano / velocidad', example: '512 B / 100 MB/s = 0,005 ms' },
            { label: 'Acceso HDD', formula: 'seek + latencia + transferencia', example: '9 + 4,17 + 1 = 14,17 ms' },
          ],
        },
      ],
    },
    {
      title: 'Multimedia avanzada: PCM, SNR, video y pantallas',
      paragraphs: [
        'PCM representa audio digital mediante muestras, cuantificacion y codificacion binaria. La frecuencia de muestreo indica cuantas muestras por segundo se toman. La profundidad de bits indica cuantos niveles de amplitud hay. Mas bits reducen ruido de cuantificacion, pero aumentan tamaño.',
        'La relacion señal/ruido ideal aproximada para cuantificacion uniforme se calcula como SNR(dB) = 6,02*n + 1,76. Con 16 bits, SNR aproximada = 98,08 dB. El tamaño del paso de cuantificacion es delta = (Vmax - Vmin) / 2^n.',
        'En imagen, un pixel es el punto minimo de una imagen raster. La resolucion es ancho por alto. La profundidad de color indica bits por pixel. El tamaño sin compresion es ancho * alto * bits por pixel / 8. En video se multiplica por fps.',
        'La relacion de aspecto se simplifica como ancho:alto. 1920x1080 equivale a 16:9. PPI mide densidad de pixeles: diagonal en pixeles dividida por pulgadas de pantalla. La tasa de refresco indica cuantas veces por segundo se actualiza la imagen; 144 Hz implica unos 6,94 ms por frame.',
      ],
      visuals: [
        {
          type: 'formulaGrid',
          title: 'Audio y cuantificacion',
          items: [
            { label: 'Paso delta', formula: '(Vmax - Vmin) / 2^n', example: '-10 a +10 V, 8 bits -> 20/256' },
            { label: 'SNR ideal', formula: '6,02*n + 1,76', example: '16 bits -> 98,08 dB' },
            { label: 'Bitrate audio', formula: 'fs * bits * canales', example: '48k*24*2 = 2.304.000 bps' },
            { label: 'Tamano audio', formula: 'bytes/s * segundos', example: '5 min a 48k/24/st = 86,4 MB' },
          ],
        },
        {
          type: 'formulaGrid',
          title: 'Imagen, video y pantalla',
          items: [
            { label: 'Imagen', formula: 'ancho * alto * bpp / 8', example: '4K 24 bpp -> 24.883.200 B' },
            { label: 'Video', formula: 'tam_frame * fps', example: '4K 60 fps -> 1,493 GB/s' },
            { label: 'PPI', formula: 'sqrt(w^2+h^2)/pulgadas', example: 'Full HD 24in -> 91,8 PPI' },
            { label: 'Frame time', formula: '1 / Hz', example: '144 Hz -> 6,94 ms' },
          ],
        },
        {
          type: 'compare',
          title: 'Resoluciones frecuentes',
          columns: ['Resolucion', 'Pixeles', 'Relacion'],
          rows: [
            ['1280x720', '921.600', '16:9 HD'],
            ['1920x1080', '2.073.600', '16:9 Full HD'],
            ['2560x1440', '3.686.400', '16:9 QHD'],
            ['3840x2160', '8.294.400', '16:9 4K UHD'],
          ],
        },
      ],
    },
    {
      title: 'Tablas finales para memorizar',
      paragraphs: [
        'Estas comparaciones son muy utiles para test y oral porque separan conceptos que suelen confundirse. La clave no es memorizar de forma aislada, sino poder justificar la diferencia practica.',
      ],
      visuals: [
        {
          type: 'compare',
          title: 'Volatil vs no volatil',
          columns: ['Volatil', 'No volatil', 'Idea'],
          rows: [
            ['Registros', 'ROM', 'Se pierde o no al apagar'],
            ['Cache', 'EEPROM', 'Velocidad contra persistencia'],
            ['RAM/SRAM/DRAM', 'Flash', 'Ejecucion contra almacenamiento'],
            ['Buffers temporales', 'SSD/HDD/opticos', 'Trabajo activo contra archivo permanente'],
          ],
        },
        {
          type: 'compare',
          title: 'CPU vs GPU',
          columns: ['Criterio', 'CPU', 'GPU'],
          rows: [
            ['Enfoque', 'Baja latencia y control general', 'Alto paralelismo de datos'],
            ['Nucleos', 'Menos y mas complejos', 'Muchos y mas simples'],
            ['Uso', 'SO, logica, control', 'Graficos, IA, calculo masivo'],
            ['Fortaleza', 'Tareas variadas', 'Operaciones repetitivas masivas'],
          ],
        },
      ],
    },
    {
      title: 'Banco de ejercicios resueltos',
      paragraphs: [
        'Convertir 2026_10: por potencias, 2026 = 1024 + 512 + 256 + 128 + 64 + 32 + 8 + 2. Por lo tanto 2026_10 = 11111101010_2. Agrupando en hexadecimal: 0111 1110 1010 = 7EA_16. Agrupando en octal: 011 111 101 010 = 3752_8.',
        'Convertir AF3_16 a decimal: A*16^2 + F*16 + 3 = 10*256 + 15*16 + 3 = 2803_10. Rango de 12 bits: unsigned es 0 a 4095; en complemento a 2 es -2048 a 2047.',
        'Representar -42 en complemento a 2 de 8 bits: 42 = 00101010; invertir = 11010101; sumar 1 = 11010110. Para -85: 85 = 01010101; invertir = 10101010; +1 = 10101011.',
        'Capacidad direccionable con 36 lineas y direccionamiento por byte: 2^36 B = 64 GiB. Bus de 128 bits, 200 MHz, una transferencia por ciclo: (128/8)*200.000.000 = 3,2 GB/s decimal.',
        'Tiempo de CPU: 500 millones de instrucciones, CPI 2, frecuencia 2,5 GHz. Ciclos = 1.000 millones. Tiempo = 1.000.000.000 / 2.500.000.000 = 0,4 s.',
        'Pipeline ideal: 10 instrucciones, 5 etapas. Sin pipeline = 50 ciclos. Con pipeline = 5 + 10 - 1 = 14 ciclos. Speedup = 50/14 = 3,57x.',
        'Cache directa: cache 16 KiB, bloque 32 B, direccion 32 bits. Lineas = 512, indice = 9 bits, offset = 5 bits, tag = 18 bits. AMAT: hit 1 ns, miss 3%, penalty 100 ns -> 4 ns.',
        'Slack: cluster 8 KiB, archivo 25.000 B. Clusteres = ceil(25000/8192)=4; asignado = 32768 B; slack = 7768 B. RAID 5 con 6 discos de 4 TB: 20 TB utiles. RAID 6 con 8 discos de 2 TB: 12 TB utiles.',
        'Audio estereo 48 kHz, 24 bits, 5 min: bitrate = 48000*24*2 = 2.304.000 bps; bytes/s = 288.000; tamaño = 86.400.000 B. Imagen 4K RGB 24 bits: 24.883.200 bytes. Video 4K 60 fps sin compresion: 1.492.992.000 B/s.',
      ],
      visuals: [
        {
          type: 'cards',
          title: 'Ejercicios que mas se repiten',
          items: [
            { label: 'Conversiones', text: 'Decimal, binario, octal, hexadecimal, BCD y complemento a 2.' },
            { label: 'Memoria/cache', text: 'Lineas, tag, indice, offset, AMAT y capacidad direccionable.' },
            { label: 'Rendimiento', text: 'CPI, frecuencia, ciclos, tiempo, pipeline y speedup.' },
            { label: 'Almacenamiento', text: 'Slack, HDD, RAID, audio, video y PPI.' },
          ],
        },
      ],
    },
    {
      title: 'Checklist extremo de dominio',
      paragraphs: [
        'Numeracion: converti decimal/binario/octal/hexadecimal, distingue binario puro de BCD, calcula 2^n, log2, rangos unsigned y complemento a 2, y detecta overflow.',
        'Circuitos: domina NOT, AND, OR, XOR, NAND, NOR, tablas de verdad, combinacional contra secuencial, medio sumador, sumador completo, flip-flops y registros.',
        'Arquitectura: dibuja Von Neumann, explica programa almacenado, ciclo fetch-decode-execute, PC, IR, MAR, MBR, flags, ALU, UC, memoria, buses y E/S.',
        'Memoria: ordena jerarquia por velocidad/costo/capacidad, diferencia SRAM/DRAM/RAM/ROM/EEPROM/Flash, calcula capacidad de chips y lineas de direccion.',
        'Motherboard y E/S: explica chipset/PCH, BIOS/UEFI, clock, buses, PCIe, interfaces, controladores, buffers, interrupciones y DMA.',
        'CPU/cache: calcula CPI, tiempo, pipeline, speedup, Amdahl, AMAT, tag/indice/offset, mapeos, reemplazo y politicas de escritura.',
        'Almacenamiento/multimedia: calcula slack, latencia rotacional, transferencia, RAID, Nyquist, cuantificacion, audio, imagen, video, relacion de aspecto y PPI.',
      ],
      visuals: [
        {
          type: 'cards',
          title: 'Mini simulacro final',
          items: [
            { label: 'Teoria corta', text: 'Explica binario, Von Neumann, RAM/ROM/cache, unidad de control, RISC/CISC y A/D.' },
            { label: 'Calculos', text: '345_10 a binario/hex, -42 en Ca2, bus 64 bits DDR, AMAT, RAID 5 y audio.' },
            { label: 'Oral', text: 'Define, dibuja mentalmente, explica funcionamiento y da consecuencia practica.' },
            { label: 'Caso', text: 'Justifica SSD, RAID, backups, ancho de banda, memoria y cuello de botella.' },
          ],
        },
      ],
    },
    {
      title: 'Como responder Arquitectura en el EFIP',
      paragraphs: [
        'En test, busca la diferencia esencial: bit contra byte, RAM contra ROM, SRAM contra DRAM, bus de datos contra bus de direcciones, HDD contra SSD, RAID 0 contra RAID 1, muestreo contra cuantificacion.',
        'En oral, usa una estructura fija: definicion, componentes, funcionamiento y consecuencia practica. Por ejemplo: La cache es una memoria pequeña y rapida entre CPU y RAM; guarda datos recientes o cercanos; aprovecha localidad temporal y espacial; reduce el tiempo medio de acceso cuando hay aciertos.',
        'En casos, justifica segun requisito. Para un servidor con muchas lecturas aleatorias conviene SSD por baja latencia; si se requiere continuidad, se combina con RAID, replicacion y backups; si hay transferencia grande, revisa ancho de bus, red y almacenamiento.',
        'Errores que cuestan puntos: decir que mas GHz siempre gana, que RAID 0 protege datos, que 1 KB siempre son 1000 bytes, que cache guarda todo, que ROM nunca se puede reprogramar, o confundir muestreo con cuantificacion.',
      ],
      visuals: [
        {
          type: 'cards',
          title: 'Plantillas de respuesta oral',
          items: [
            { label: 'Von Neumann', text: 'Programa almacenado: datos e instrucciones en memoria; CPU ejecuta ciclo fetch-decode-execute usando buses.' },
            { label: 'ALU', text: 'Unidad aritmetico-logica: suma, resta, AND, OR, XOR, comparaciones y flags.' },
            { label: 'DMA', text: 'Controlador transfiere bloques entre periferico y memoria; CPU configura y recibe interrupcion final.' },
            { label: 'Cache', text: 'Memoria rapida que explota localidad temporal y espacial para bajar AMAT.' },
          ],
        },
      ],
    },
  ],
};
