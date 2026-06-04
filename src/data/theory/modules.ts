import type { Topic } from '../../types';
import { ARCHITECTURE_THEORY_MODULE } from './architecture';
import { EXPANDED_THEORY_MODULES } from './expandedModules';

export interface TheorySection {
  title: string;
  paragraphs: string[];
  visuals?: TheoryVisual[];
}

export type TheoryVisual =
  | { type: 'cards'; title: string; items: Array<{ label: string; text: string }> }
  | { type: 'formulaGrid'; title: string; items: Array<{ label: string; formula: string; example: string }> }
  | { type: 'flow'; title: string; steps: string[] }
  | { type: 'stack'; title: string; items: Array<{ label: string; detail: string }> }
  | { type: 'compare'; title: string; columns: string[]; rows: string[][] }
  | { type: 'bus'; title: string; items: Array<{ label: string; text: string }> }
  | { type: 'raid'; title: string; items: Array<{ level: string; capacity: string; tolerance: string; text: string }> };

export interface TheoryModule {
  topic: Topic;
  title: string;
  sections: TheorySection[];
}

const BASE_THEORY_MODULES = {
  arquitectura_computadoras: {
    topic: 'arquitectura_computadoras',
    title: 'Arquitectura de Computadoras',
    sections: [
      {
        title: 'Para qué sirve estudiar arquitectura',
        paragraphs: [
          'Arquitectura de computadoras explica cómo una máquina representa información, ejecuta instrucciones y coordina sus componentes físicos. En el EFIP no alcanza con nombrar piezas: hay que poder justificar por qué una decisión técnica mejora rendimiento, disponibilidad, costo o seguridad.',
          'Pensá la computadora como un sistema de capas: datos representados en binario, instrucciones ejecutadas por la CPU, memoria que alimenta al procesador, almacenamiento persistente, buses que comunican componentes y dispositivos de entrada/salida controlados por el sistema operativo.',
        ],
      },
      {
        title: 'Representación de datos desde cero',
        paragraphs: [
          'Todo dato digital se representa con bits. Un bit puede valer 0 o 1; con grupos de bits se representan números, caracteres, direcciones de memoria, colores, instrucciones y estados. Un byte son 8 bits y suele ser la unidad básica para medir memoria y almacenamiento.',
          'Los números enteros pueden representarse con signo mediante complemento a dos, que permite sumar y restar con el mismo circuito. Los caracteres se codifican con tablas como ASCII o Unicode. La idea central para responder bien es que la computadora no entiende letras ni dibujos: interpreta patrones binarios según una codificación.',
        ],
      },
      {
        title: 'CPU, instrucciones y ciclo de ejecución',
        paragraphs: [
          'La CPU ejecuta programas mediante un ciclo repetido: buscar la instrucción en memoria, decodificarla, ejecutarla y guardar resultados. La unidad de control coordina el proceso; la ALU realiza operaciones aritméticas y lógicas; los registros guardan datos inmediatos de alta velocidad.',
          'Cuando te pregunten por rendimiento, no respondas solo “más GHz”. Importan la cantidad de núcleos, la arquitectura, la memoria caché, el paralelismo, el conjunto de instrucciones y el cuello de botella real. Una CPU rápida no compensa una memoria lenta o un disco saturado.',
        ],
      },
      {
        title: 'Jerarquía de memoria',
        paragraphs: [
          'La memoria se organiza por velocidad, costo y capacidad. Registros y caché son muy rápidos pero pequeños; RAM es más grande y volátil; SSD y HDD son persistentes pero más lentos. La jerarquía existe porque no sería viable que toda la información estuviera en memoria ultrarrápida.',
          'La caché aprovecha localidad temporal y espacial: si un dato se usó recientemente, probablemente vuelva a usarse; si se leyó una dirección, probablemente se lean direcciones cercanas. Esta idea aparece en preguntas de rendimiento y también en algoritmos.',
        ],
      },
      {
        title: 'Almacenamiento: HDD, SSD y RAID',
        paragraphs: [
          'Un HDD usa platos magnéticos y cabezales mecánicos; su latencia depende del movimiento físico. Un SSD usa memoria flash, no tiene partes móviles y ofrece mejor latencia. Por eso un SSD mejora arranque, carga de programas y acceso aleatorio, aunque puede ser más caro por GB.',
          'RAID combina discos para mejorar rendimiento o tolerancia a fallos. RAID 0 distribuye datos y mejora velocidad, pero no tolera fallos. RAID 1 espeja datos. RAID 5 y 6 usan paridad. RAID 10 combina espejado y distribución. En casos prácticos, justificá la elección según continuidad, costo y criticidad.',
        ],
      },
      {
        title: 'Buses, periféricos e interrupciones',
        paragraphs: [
          'Los buses comunican CPU, memoria y dispositivos. Pueden transportar datos, direcciones y señales de control. Los periféricos no trabajan al mismo ritmo que la CPU, por eso se usan controladores, buffers, DMA e interrupciones para coordinar entrada/salida sin desperdiciar procesamiento.',
          'Una interrupción avisa a la CPU que un evento requiere atención: terminó una operación de disco, llegó un paquete de red o se presionó una tecla. Es fundamental para explicar cómo el hardware y el sistema operativo cooperan.',
        ],
      },
      {
        title: 'Cómo aplicar esto en el EFIP',
        paragraphs: [
          'En preguntas de test, identificá la diferencia esencial: volátil contra persistente, mecánico contra electrónico, rendimiento contra disponibilidad. En oral, definí el concepto y después explicá una consecuencia práctica. En casos, elegí arquitectura pensando en carga, respaldo, escalabilidad y presupuesto.',
          'Error típico: responder con marcas o preferencias personales. Mejor respuesta: “Para un servidor de base de datos con muchas lecturas aleatorias conviene SSD por baja latencia; si además se requiere disponibilidad, se combina con RAID o replicación y backups, porque RAID no reemplaza copias de seguridad”.',
        ],
      },
    ],
  },

  sistemas_operativos: {
    topic: 'sistemas_operativos',
    title: 'Sistemas Operativos',
    sections: [
      {
        title: 'Qué es un sistema operativo',
        paragraphs: [
          'Un sistema operativo es el software base que administra hardware y ofrece servicios a las aplicaciones. Actúa como intermediario entre programas, usuarios y recursos físicos: CPU, memoria, archivos, red y periféricos.',
          'Su propósito es doble: abstraer la complejidad del hardware y asignar recursos de forma ordenada. Sin sistema operativo, cada programa debería saber manejar discos, memoria, teclado, pantalla y red por sí mismo.',
        ],
      },
      {
        title: 'Procesos, hilos y planificación',
        paragraphs: [
          'Un proceso es un programa en ejecución con su propio espacio de memoria y recursos. Un hilo es una unidad de ejecución dentro de un proceso; varios hilos pueden compartir memoria del mismo proceso. Esta diferencia es clave para explicar concurrencia.',
          'El planificador decide qué proceso o hilo usa la CPU. Algoritmos como FCFS, Round Robin o prioridades buscan equilibrar justicia, respuesta y eficiencia. En oral, conviene mencionar que el cambio de contexto tiene costo porque el SO guarda y restaura estado.',
        ],
      },
      {
        title: 'Concurrencia y sincronización',
        paragraphs: [
          'Cuando varias tareas acceden a recursos compartidos pueden aparecer condiciones de carrera: el resultado depende del orden exacto de ejecución. Para evitarlo se usan mecanismos como mutex, semáforos, monitores y secciones críticas.',
          'Un deadlock ocurre cuando procesos quedan esperando recursos entre sí y ninguno puede avanzar. Las condiciones clásicas son exclusión mutua, retención y espera, no expropiación y espera circular. Para responder bien, nombrá el problema y una estrategia: prevención, detección o recuperación.',
        ],
      },
      {
        title: 'Memoria principal y memoria virtual',
        paragraphs: [
          'La RAM guarda programas y datos mientras se ejecutan. Como la memoria física es limitada, el sistema operativo usa memoria virtual: cada proceso cree tener un espacio propio, y el SO traduce direcciones virtuales a físicas mediante tablas de páginas.',
          'La paginación divide memoria en bloques de tamaño fijo. Si una página no está en RAM se produce un page fault y se trae desde disco. Si hay demasiados fallos, aparece thrashing: el sistema pasa más tiempo moviendo páginas que ejecutando procesos.',
        ],
      },
      {
        title: 'Archivos, permisos y sistemas de archivos',
        paragraphs: [
          'El sistema de archivos organiza datos persistentes en archivos y directorios. Además administra metadatos: nombre, tamaño, fechas, permisos, propietario y ubicación física o lógica. NTFS, ext4 y FAT son ejemplos con características distintas.',
          'Los permisos controlan quién puede leer, escribir o ejecutar. En casos, esto se conecta con seguridad: no todos los usuarios deben tener acceso administrativo, y los archivos críticos requieren permisos mínimos necesarios.',
        ],
      },
      {
        title: 'Entrada/salida y drivers',
        paragraphs: [
          'Los dispositivos son heterogéneos: impresoras, discos, placas de red y pantallas tienen comportamientos distintos. El sistema operativo usa drivers para comunicarse con cada dispositivo mediante una interfaz uniforme para las aplicaciones.',
          'Buffers, colas de E/S e interrupciones evitan que la CPU quede bloqueada esperando dispositivos lentos. Esta explicación suele diferenciar una respuesta básica de una respuesta sólida en oral.',
        ],
      },
      {
        title: 'Cómo aplicar esto en el EFIP',
        paragraphs: [
          'En test, distinguí proceso de hilo, RAM de disco, bloqueo de deadlock y archivo de directorio. En oral, explicá con causa y efecto. En casos, usá sistemas operativos como parte de una arquitectura: servidores Linux, permisos, servicios, logs, backups y usuarios.',
          'Error típico: decir que el sistema operativo “solo permite usar la computadora”. Respuesta fuerte: “Administra recursos, abstrae hardware, protege procesos entre sí, organiza archivos, controla E/S y permite que varias tareas convivan de forma segura y eficiente”.',
        ],
      },
    ],
  },

  redes_comunicaciones: {
    topic: 'redes_comunicaciones',
    title: 'Comunicaciones y Redes',
    sections: [
      {
        title: 'Qué es una red',
        paragraphs: [
          'Una red es un conjunto de dispositivos conectados para intercambiar datos y compartir recursos. Puede incluir computadoras, servidores, routers, switches, firewalls, impresoras, teléfonos y servicios en la nube.',
          'Para que dos equipos se comuniquen no alcanza con el cable o el Wi-Fi: necesitan reglas. Esas reglas son protocolos, y definen formato de mensajes, direcciones, control de errores, orden de comunicación y responsabilidades de cada parte.',
        ],
      },
      {
        title: 'Modelo OSI y TCP/IP',
        paragraphs: [
          'El modelo OSI divide la comunicación en siete capas: física, enlace, red, transporte, sesión, presentación y aplicación. Sirve para estudiar responsabilidades. TCP/IP simplifica la pila usada en Internet: acceso a red, Internet, transporte y aplicación.',
          'En examen, lo importante es ubicar conceptos: IP trabaja en red, TCP y UDP en transporte, HTTP/DNS/SMTP en aplicación, Ethernet en enlace, cables y señales en física. Esta ubicación ayuda a diagnosticar problemas.',
        ],
      },
      {
        title: 'Direcciones, puertos y nombres',
        paragraphs: [
          'Una dirección IP identifica un host en una red lógica. Una dirección MAC identifica una interfaz de red en el enlace local. Un puerto identifica una aplicación o servicio dentro de un host, como HTTP en 80 o HTTPS en 443.',
          'DNS traduce nombres legibles a direcciones IP. Si una web no abre, puede fallar DNS, conectividad IP, puerto, firewall, servidor o aplicación. Una respuesta profesional separa cada capa en vez de decir simplemente “no hay Internet”.',
        ],
      },
      {
        title: 'Switches, routers y firewalls',
        paragraphs: [
          'Un switch conecta dispositivos dentro de una LAN y decide usando direcciones MAC. Un router conecta redes distintas y decide usando direcciones IP. Un firewall filtra tráfico según reglas: origen, destino, puerto, protocolo o estado de conexión.',
          'En casos, la diferencia importa. Si se necesita segmentar una red interna, se piensa en VLANs, switches administrables y routers. Si se necesita controlar acceso externo, se piensa en firewall, DMZ, VPN y reglas explícitas.',
        ],
      },
      {
        title: 'TCP, UDP y confiabilidad',
        paragraphs: [
          'TCP es orientado a conexión y ofrece confiabilidad: ordena segmentos, confirma recepción y retransmite pérdidas. UDP no garantiza entrega ni orden, pero tiene menor sobrecarga. Se usa donde importa la velocidad o la aplicación controla la pérdida, como streaming, voz o DNS.',
          'No digas que UDP es “malo” o TCP “bueno”. Son herramientas distintas. La elección depende del requisito: transferencia de archivos y web suelen preferir TCP; audio en tiempo real puede tolerar pérdidas pequeñas para evitar latencia.',
        ],
      },
      {
        title: 'Seguridad de red: DMZ, VPN y ataques',
        paragraphs: [
          'Una DMZ es una zona intermedia donde se ubican servicios expuestos, como web o correo, separados de la red interna. Si un atacante compromete un servidor público, no debería acceder directamente a bases internas o estaciones de trabajo.',
          'Una VPN crea un túnel cifrado para acceso remoto seguro. Ataques frecuentes incluyen spoofing, fuerza bruta, denegación de servicio y man-in-the-middle. En el EFIP, vinculá cada riesgo con una medida: firewall, segmentación, autenticación fuerte, cifrado y monitoreo.',
        ],
      },
      {
        title: 'Cómo aplicar esto en el EFIP',
        paragraphs: [
          'En test, ubicá protocolo y dispositivo por capa. En oral, explicá el recorrido de un dato desde una app hasta otra. En casos, dibujá redes con usuario, Internet, firewall, DMZ, servidor de aplicación, base de datos y backups cuando corresponda.',
          'Error típico: poner la base de datos expuesta a Internet. Mejor planteo: usuarios acceden al servidor web o aplicación; la aplicación consulta la base en red interna; el firewall limita puertos; la administración remota usa VPN.',
        ],
      },
    ],
  },

  base_de_datos: {
    topic: 'base_de_datos',
    title: 'Bases de Datos',
    sections: [
      {
        title: 'Qué problema resuelve una base de datos',
        paragraphs: [
          'Una base de datos organiza información para almacenarla, consultarla y modificarla de forma confiable. No es solo un archivo grande: aporta estructura, reglas de integridad, concurrencia, seguridad, consultas y recuperación ante fallos.',
          'Un SGBD como PostgreSQL, MySQL, SQL Server u Oracle administra datos y permite que muchas aplicaciones o usuarios trabajen sin corromper la información. En el EFIP, la clave es unir modelo, SQL, normalización e integridad.',
        ],
      },
      {
        title: 'Modelo relacional',
        paragraphs: [
          'El modelo relacional organiza datos en tablas. Cada tabla representa una entidad o relación relevante; cada fila representa un registro; cada columna representa un atributo. La clave primaria identifica de forma única cada fila.',
          'Las claves foráneas conectan tablas y preservan integridad referencial. Por ejemplo, una venta puede tener un cliente_id que referencia a Cliente. Si no existe ese cliente, la base debe impedir o controlar la operación.',
        ],
      },
      {
        title: 'DER y paso a tablas',
        paragraphs: [
          'Un DER representa entidades, atributos y relaciones. Sirve para pensar antes de programar. Entidades típicas son Cliente, Producto, Pedido, Pago o Usuario. Las relaciones indican cómo se vinculan: uno a uno, uno a muchos o muchos a muchos.',
          'Una relación muchos a muchos se transforma en una tabla intermedia. Por ejemplo, Pedido y Producto generan DetallePedido, con pedido_id, producto_id, cantidad y precio. Esta tabla suele ser clave en casos prácticos.',
        ],
      },
      {
        title: 'Normalización',
        paragraphs: [
          'Normalizar busca reducir redundancia y anomalías. En primera forma normal, los campos deben ser atómicos. En segunda, los atributos dependen de toda la clave. En tercera, no deben depender de otros atributos no clave.',
          'La normalización evita problemas como actualizar un dato en varias filas, borrar información accidentalmente o insertar registros incompletos. En examen, no hace falta recitar de memoria: explicá qué anomalía evita cada decisión.',
        ],
      },
      {
        title: 'SQL esencial',
        paragraphs: [
          'SQL permite definir, consultar y modificar datos. SELECT consulta; INSERT agrega; UPDATE modifica; DELETE elimina. WHERE filtra; JOIN combina tablas; GROUP BY agrupa; HAVING filtra grupos; ORDER BY ordena.',
          'Un JOIN correcto se basa en claves relacionadas. Error típico: hacer productos cartesianos por olvidar la condición de unión. Otro error grave: DELETE o UPDATE sin WHERE, que afecta toda la tabla.',
        ],
      },
      {
        title: 'Transacciones y ACID',
        paragraphs: [
          'Una transacción agrupa operaciones que deben completarse como una unidad. ACID significa atomicidad, consistencia, aislamiento y durabilidad. Si una transferencia bancaria descuenta dinero pero no acredita destino, el sistema queda inconsistente.',
          'COMMIT confirma cambios; ROLLBACK deshace. En casos con ventas, pagos, stock o reservas, mencioná transacciones para asegurar que el estado final sea correcto incluso si hay errores o concurrencia.',
        ],
      },
      {
        title: 'Cómo aplicar esto en el EFIP',
        paragraphs: [
          'En test, identificá claves, cardinalidades, JOINs y comandos SQL. En oral, explicá por qué se normaliza y cómo se preserva integridad. En casos, proponé tablas con claves primarias, foráneas y restricciones.',
          'Respuesta fuerte para un caso: “Cliente realiza Pedido; Pedido tiene muchos DetallePedido; cada detalle referencia Producto. Stock se actualiza dentro de una transacción. Las claves foráneas evitan ventas con productos inexistentes”.',
        ],
      },
    ],
  },

  algoritmos_estructuras: {
    topic: 'algoritmos_estructuras',
    title: 'Algoritmos y Estructuras de Datos',
    sections: [
      {
        title: 'Qué es un algoritmo',
        paragraphs: [
          'Un algoritmo es una secuencia finita y ordenada de pasos para resolver un problema. Debe tener entradas, proceso, salida y terminar. En informática se evalúa no solo si funciona, sino cuánto tiempo y memoria consume.',
          'Una estructura de datos es una forma de organizar información para operar eficientemente. La estructura elegida cambia el costo de buscar, insertar, eliminar o recorrer datos.',
        ],
      },
      {
        title: 'Complejidad y Big O',
        paragraphs: [
          'Big O describe cómo crece el costo cuando aumenta el tamaño de entrada. O(1) es constante, O(log n) crece lentamente, O(n) es lineal, O(n log n) aparece en ordenamientos eficientes, O(n²) suele aparecer en dobles bucles.',
          'No se trata de calcular milisegundos exactos. Se trata de comparar crecimiento. Un algoritmo O(n²) puede andar bien con 10 elementos y colapsar con 1 millón. En oral, explicá la idea con un ejemplo simple.',
        ],
      },
      {
        title: 'Arreglos, listas, pilas y colas',
        paragraphs: [
          'Un arreglo permite acceso rápido por índice, pero insertar en el medio puede requerir desplazar elementos. Una lista enlazada facilita inserciones si ya se conoce el nodo, pero acceder por posición requiere recorrer.',
          'Una pila es LIFO: último en entrar, primero en salir. Se usa en deshacer, llamadas de funciones y evaluación de expresiones. Una cola es FIFO: primero en entrar, primero en salir. Se usa en turnos, impresión, procesos y buffers.',
        ],
      },
      {
        title: 'Árboles y búsquedas',
        paragraphs: [
          'Un árbol organiza datos jerárquicamente. En un árbol binario de búsqueda, los menores suelen ir a la izquierda y los mayores a la derecha. Si está balanceado, buscar puede ser O(log n); si se degenera, puede ser O(n).',
          'Los árboles aparecen en índices, expresiones, sistemas de archivos y estructuras de decisión. Para el EFIP, conviene poder recorrer preorden, inorden y postorden y explicar por qué el balanceo importa.',
        ],
      },
      {
        title: 'Grafos',
        paragraphs: [
          'Un grafo tiene vértices y aristas. Puede ser dirigido o no dirigido, ponderado o no ponderado. Modela redes, rutas, dependencias, mapas, relaciones sociales y conexiones entre sistemas.',
          'BFS recorre por niveles y sirve para caminos mínimos sin peso. DFS profundiza y sirve para explorar componentes o dependencias. Dijkstra calcula caminos mínimos con pesos no negativos. Kruskal y Prim construyen árboles de expansión mínima.',
        ],
      },
      {
        title: 'Ordenamiento y búsqueda',
        paragraphs: [
          'Búsqueda lineal revisa elemento por elemento: O(n). Búsqueda binaria requiere datos ordenados y reduce el espacio a la mitad: O(log n). Esta diferencia suele ser preguntada porque muestra cómo una precondición mejora el algoritmo.',
          'Ordenamientos como bubble sort son simples pero O(n²). Merge sort y quicksort suelen ser O(n log n) en promedio o garantizado según el caso. No memorices solo nombres: explicá la idea de dividir, comparar e intercambiar.',
        ],
      },
      {
        title: 'Cómo aplicar esto en el EFIP',
        paragraphs: [
          'En test, identificá estructura adecuada y complejidad. En oral, compará alternativas: “ArrayList conviene para acceso por índice; LinkedList para inserciones conocidas; pila para retroceso; cola para orden de llegada”.',
          'En casos, elegí estructura por necesidad. Si hay que atender solicitudes por orden, cola. Si hay que buscar productos por código, mapa o índice. Si hay rutas entre nodos, grafo. Justificar la elección es más importante que nombrarla.',
        ],
      },
    ],
  },

  paradigmas_lenguajes: {
    topic: 'paradigmas_lenguajes',
    title: 'Paradigmas y Lenguajes (Java)',
    sections: [
      {
        title: 'Qué es un paradigma',
        paragraphs: [
          'Un paradigma de programación es una forma de pensar y organizar soluciones. El paradigma estructurado separa en procedimientos; el orientado a objetos modela entidades con estado y comportamiento; el funcional enfatiza funciones y datos inmutables.',
          'Java se apoya fuertemente en programación orientada a objetos. En el EFIP, conviene explicar no solo sintaxis, sino cómo la POO ayuda a diseñar sistemas mantenibles.',
        ],
      },
      {
        title: 'Clases, objetos y responsabilidades',
        paragraphs: [
          'Una clase es un molde que define atributos y métodos. Un objeto es una instancia concreta de una clase. Los atributos representan estado; los métodos representan comportamiento.',
          'Una buena clase tiene responsabilidad clara. Si una clase Usuario también calcula stock, envía emails, valida pagos y genera reportes, tiene baja cohesión. Para casos y diagramas, pensá clases como conceptos del dominio con responsabilidades acotadas.',
        ],
      },
      {
        title: 'Encapsulamiento',
        paragraphs: [
          'Encapsular significa proteger el estado interno y exponer operaciones controladas. En Java se usan modificadores como private, public y protected. Lo habitual es dejar atributos privados y métodos públicos necesarios.',
          'No es solo “poner getters y setters”. Es impedir estados inválidos. Por ejemplo, una cuenta no debería permitir saldo negativo si la regla de negocio lo prohíbe; el método retirar debe validar antes de modificar.',
        ],
      },
      {
        title: 'Herencia y composición',
        paragraphs: [
          'La herencia permite que una clase especializada reutilice o extienda comportamiento de otra. Debe usarse cuando existe una relación “es un”. Por ejemplo, EmpleadoAdministrativo es un Empleado.',
          'La composición modela “tiene un” y suele ser más flexible. Pedido tiene DetallePedido; Auto tiene Motor. En diseño profesional, no fuerces herencia si la relación real es de pertenencia o colaboración.',
        ],
      },
      {
        title: 'Polimorfismo e interfaces',
        paragraphs: [
          'Polimorfismo permite tratar objetos distintos mediante una interfaz común. Si Tarjeta, Transferencia y Efectivo implementan un método pagar, el sistema puede procesar pagos sin depender de una clase concreta.',
          'Una interfaz define contrato. En casos, esto ayuda a separar lo que el sistema necesita de cómo se implementa. También mejora testabilidad y reduce acoplamiento.',
        ],
      },
      {
        title: 'Excepciones y JDBC',
        paragraphs: [
          'Las excepciones representan errores o situaciones anómalas. En Java, try/catch/finally permite manejar fallos sin romper todo el flujo. Una buena respuesta distingue error esperado, validación y excepción técnica.',
          'JDBC permite conectar Java con bases de datos. PreparedStatement es preferible a Statement porque parametriza consultas, ayuda a evitar inyección SQL y mejora claridad. Siempre cerrá recursos o usá try-with-resources.',
        ],
      },
      {
        title: 'Cómo aplicar esto en el EFIP',
        paragraphs: [
          'En test, reconocé pilares de POO: abstracción, encapsulamiento, herencia y polimorfismo. En oral, explicá con ejemplos. En casos, diseñá clases con atributos, métodos y relaciones coherentes con el dominio.',
          'Error típico: creer que todo debe heredar. Respuesta fuerte: “Uso herencia cuando hay especialización real; uso composición cuando una clase contiene o colabora con otra; uso interfaces para desacoplar comportamientos variables”.',
        ],
      },
    ],
  },

  analisis_diseno: {
    topic: 'analisis_diseno',
    title: 'Análisis y Diseño de Sistemas (UML)',
    sections: [
      {
        title: 'Qué significa analizar y diseñar',
        paragraphs: [
          'Analizar es entender el problema, los actores, las reglas y las necesidades. Diseñar es proponer una solución estructurada antes de construirla. En el EFIP, esta materia conecta requisitos, casos de uso, clases, datos y arquitectura.',
          'Una buena solución no empieza dibujando UML al azar. Primero identifica objetivos del sistema, usuarios, procesos, información importante, restricciones y riesgos. Después se eligen modelos para comunicar la solución.',
        ],
      },
      {
        title: 'Requerimientos funcionales y no funcionales',
        paragraphs: [
          'Un requerimiento funcional describe qué debe hacer el sistema: registrar venta, emitir reporte, autenticar usuario, calcular stock. Debe escribirse como comportamiento observable del sistema.',
          'Un requerimiento no funcional describe cualidades o restricciones: seguridad, disponibilidad, rendimiento, tecnología, usabilidad, respaldo, compatibilidad. Error típico: escribir “usar MySQL” como funcional. Eso es una restricción técnica, no una función del usuario.',
        ],
      },
      {
        title: 'Actores y casos de uso',
        paragraphs: [
          'Un actor es un rol externo que interactúa con el sistema: Cliente, Administrador, Operador, Sistema de Pago. No siempre es una persona; puede ser otro sistema.',
          'Un caso de uso representa un objetivo que el actor logra usando el sistema. Debe nombrarse con verbo y objeto: Registrar venta, Consultar stock, Aprobar solicitud. No conviene poner acciones internas demasiado pequeñas si no representan valor para el actor.',
        ],
      },
      {
        title: 'Include, extend y generalización',
        paragraphs: [
          'Include se usa cuando un caso siempre reutiliza otro comportamiento obligatorio. Por ejemplo, Comprar producto incluye Validar pago si siempre ocurre dentro del flujo.',
          'Extend se usa para comportamiento opcional o condicional. Por ejemplo, Aplicar descuento extiende Registrar venta si existe promoción. Generalización expresa especialización entre actores o casos de uso.',
        ],
      },
      {
        title: 'Diagrama de clases',
        paragraphs: [
          'Un diagrama de clases muestra estructura estática: clases, atributos, métodos y relaciones. Sirve para diseñar el modelo del sistema. Relaciones comunes: asociación, dependencia, agregación, composición y herencia.',
          'Composición implica pertenencia fuerte: la parte no tiene sentido sin el todo, como DetallePedido dentro de Pedido. Agregación es pertenencia débil: Departamento tiene Empleados, pero un empleado puede existir fuera del departamento.',
        ],
      },
      {
        title: 'Del caso al diseño',
        paragraphs: [
          'Para resolver un caso, primero subrayá sustantivos y verbos. Sustantivos candidatos a clases: Cliente, Producto, Venta, Pago. Verbos candidatos a métodos o casos de uso: registrar, cancelar, consultar, aprobar.',
          'Después validá cardinalidades. Un cliente puede hacer muchas ventas; una venta puede tener muchos productos mediante detalle; un pago pertenece a una venta. Este razonamiento conecta UML con base de datos y programación.',
        ],
      },
      {
        title: 'Cómo aplicar esto en el EFIP',
        paragraphs: [
          'En test, distinguí tipos de relaciones y elementos UML. En oral, explicá la intención de cada diagrama. En casos, presentá requisitos claros, actores correctos, casos de uso con relaciones justificadas y clases con responsabilidades coherentes.',
          'Respuesta profesional: “El actor Administrador aprueba usuarios; el Operador registra movimientos; el sistema calcula stock. Registrar movimiento incluye validar datos. Generar alerta extiende registrar movimiento si el stock queda bajo mínimo”.',
        ],
      },
    ],
  },
} satisfies Record<Topic, TheoryModule>;

export const THEORY_MODULES = {
  ...BASE_THEORY_MODULES,
  ...EXPANDED_THEORY_MODULES,
  arquitectura_computadoras: ARCHITECTURE_THEORY_MODULE,
} satisfies Record<Topic, TheoryModule>;
