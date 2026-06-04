import type { TheoryModule } from './modules';

export const OPERATING_SYSTEMS_THEORY_MODULE: TheoryModule = {
  topic: 'sistemas_operativos',
  title: 'Sistemas Operativos',
  sections: [
    {
      title: 'Sistema operativo desde cero',
      paragraphs: [
        'Un sistema operativo es el software base que se ubica entre las aplicaciones y el hardware. Su trabajo no es simplemente "encender la computadora": administra CPU, memoria, archivos, dispositivos, usuarios, permisos y servicios para que varios programas puedan ejecutarse sin pisarse entre si.',
        'La idea clave para el EFIP es verlo como administrador y arbitro. Abstrae el hardware con interfaces simples, protege a los procesos entre si, decide quien usa la CPU, traduce direcciones de memoria, organiza archivos persistentes y atiende entrada/salida mediante drivers e interrupciones.',
      ],
      visuals: [
        {
          type: 'stack',
          title: 'Capas de un sistema operativo',
          items: [
            { label: 'Usuario', detail: 'Interactua con aplicaciones y solicita tareas.' },
            { label: 'Aplicaciones', detail: 'Navegador, IDE, base de datos, juegos o servicios.' },
            { label: 'API / llamadas al sistema', detail: 'Puente controlado para pedir archivos, memoria, red o procesos.' },
            { label: 'Kernel', detail: 'Nucleo privilegiado que administra recursos y seguridad.' },
            { label: 'Hardware', detail: 'CPU, RAM, disco, red, teclado, pantalla y perifericos.' },
          ],
        },
        {
          type: 'compare',
          title: 'Funciones centrales del SO',
          columns: ['Funcion', 'Que administra', 'Ejemplo EFIP'],
          rows: [
            ['Procesos', 'Creacion, estados, planificacion y finalizacion', 'Ejecutar Java, MySQL y navegador a la vez'],
            ['Memoria', 'RAM, memoria virtual, paginas y swap', 'Traducir direcciones virtuales a fisicas'],
            ['Archivos', 'Directorios, metadatos, permisos y journaling', 'NTFS, ext4, FAT'],
            ['E/S', 'Drivers, buffers, colas, DMA e interrupciones', 'Disco, impresora o placa de red'],
            ['Seguridad', 'Usuarios, privilegios y aislamiento', 'Modo usuario y modo kernel'],
          ],
        },
      ],
    },
    {
      title: 'Kernel, modos y tipos de nucleo',
      paragraphs: [
        'El kernel es el nucleo del sistema operativo. Se ejecuta en modo privilegiado porque necesita controlar hardware, memoria, interrupciones y planificacion. Las aplicaciones comunes corren en modo usuario, con acceso limitado, para evitar que un error de una app rompa todo el sistema.',
        'Cuando una aplicacion necesita una operacion sensible, como abrir un archivo o enviar datos por red, realiza una llamada al sistema. La CPU cambia controladamente a modo kernel, el SO valida permisos, ejecuta la rutina y vuelve al modo usuario.',
        'Los nucleos monoliticos concentran muchos servicios en espacio kernel y suelen rendir muy bien. Los microkernel dejan en kernel solo lo esencial y mueven servicios a procesos separados, ganando aislamiento a cambio de mas comunicacion. Los hibridos combinan ambas ideas.',
      ],
      visuals: [
        {
          type: 'flow',
          title: 'Secuencia de una llamada al sistema',
          steps: ['Aplicacion pide abrir archivo', 'CPU genera trap o interrupcion controlada', 'Kernel valida permisos y parametros', 'Driver o sistema de archivos ejecuta la operacion', 'Kernel devuelve resultado a la aplicacion'],
        },
        {
          type: 'compare',
          title: 'Modo usuario vs modo kernel',
          columns: ['Modo', 'Acceso', 'Uso', 'Riesgo'],
          rows: [
            ['Usuario', 'Limitado', 'Aplicaciones y librerias', 'Un fallo suele afectar solo al proceso'],
            ['Kernel', 'Completo', 'Kernel y drivers', 'Un fallo puede comprometer todo el sistema'],
          ],
        },
        {
          type: 'compare',
          title: 'Monolitico, microkernel e hibrido',
          columns: ['Tipo', 'Ventaja', 'Desventaja', 'Ejemplos'],
          rows: [
            ['Monolitico modular', 'Alto rendimiento y llamadas directas', 'Un fallo en kernel puede ser grave', 'Linux, Unix clasicos'],
            ['Microkernel', 'Mejor aislamiento de servicios', 'Mayor costo de IPC', 'MINIX, QNX, L4'],
            ['Hibrido', 'Equilibra rendimiento y aislamiento', 'Diseno mas complejo', 'Windows NT, macOS XNU'],
          ],
        },
      ],
    },
    {
      title: 'Procesos, hilos y cambio de contexto',
      paragraphs: [
        'Un programa es codigo pasivo guardado en disco. Un proceso es ese programa en ejecucion, con memoria, archivos abiertos, registros, estado y recursos asignados. Dos ventanas de la misma aplicacion pueden ser procesos distintos.',
        'Un hilo es una unidad de ejecucion dentro de un proceso. Los hilos comparten memoria y recursos del proceso, pero cada uno tiene su propia pila, registros y contador de programa. Por eso permiten concurrencia mas liviana, aunque exigen sincronizacion cuando comparten datos.',
        'La conmutacion de contexto ocurre cuando el SO detiene una tarea y continua otra. Guarda registros y estado del proceso saliente en su PCB, elige otro con el planificador y restaura su contexto. Es necesaria para multitarea, pero no produce trabajo util de usuario: demasiado cambio de contexto genera overhead.',
      ],
      visuals: [
        {
          type: 'flow',
          title: 'Estados de un proceso',
          steps: ['Nuevo: se crea', 'Listo: espera CPU', 'Ejecucion: usa CPU', 'Bloqueado: espera E/S o evento', 'Listo: el evento termina', 'Terminado: libera recursos'],
        },
        {
          type: 'compare',
          title: 'Programa, proceso e hilo',
          columns: ['Concepto', 'Definicion', 'Dato clave'],
          rows: [
            ['Programa', 'Codigo almacenado', 'No ejecuta por si solo'],
            ['Proceso', 'Instancia en ejecucion', 'Tiene espacio de memoria propio'],
            ['Hilo', 'Flujo dentro de un proceso', 'Comparte memoria con otros hilos del proceso'],
            ['PCB / BCP', 'Bloque de control', 'Guarda PID, estado, registros, prioridad y recursos'],
          ],
        },
        {
          type: 'compare',
          title: 'KLT vs ULT',
          columns: ['Criterio', 'KLT', 'ULT'],
          rows: [
            ['Gestion', 'Kernel administra cada hilo', 'Biblioteca de usuario administra hilos'],
            ['Bloqueo', 'Puede bloquear solo el hilo afectado', 'Una syscall bloqueante puede bloquear todo el proceso'],
            ['Paralelismo real', 'Si, en multiples nucleos', 'No si el kernel ve un solo proceso'],
            ['Costo', 'Mayor overhead', 'Cambio muy rapido'],
          ],
        },
      ],
    },
    {
      title: 'Planificacion de CPU',
      paragraphs: [
        'El planificador decide que proceso o hilo obtiene la CPU. La eleccion depende del tipo de sistema: en sistemas batch se busca rendimiento global; en sistemas interactivos se busca buena respuesta; en tiempo real importan plazos.',
        'FCFS atiende por orden de llegada y es simple, pero puede sufrir efecto convoy. SJF elige la rafaga mas corta y reduce espera promedio si se conocen rafagas. SRTF es la version apropiativa de menor tiempo restante. Round Robin usa un quantum circular y es comun en sistemas interactivos. Prioridades permiten reglas flexibles, pero pueden causar inanicion si no hay envejecimiento.',
        'Para ejercicios, calculas tiempo de espera como inicio menos llegada, o finalizacion menos llegada menos rafaga. El tiempo de retorno es finalizacion menos llegada. En oral, conviene explicar no solo la formula, sino el criterio del algoritmo.',
      ],
      visuals: [
        {
          type: 'compare',
          title: 'Algoritmos de planificacion',
          columns: ['Algoritmo', 'Apropiativo', 'Ventaja', 'Riesgo'],
          rows: [
            ['FCFS / FIFO', 'No', 'Muy simple', 'Efecto convoy'],
            ['SJF', 'No', 'Baja espera promedio', 'Inanicion de procesos largos'],
            ['SRTF', 'Si', 'Reacciona a rafagas cortas nuevas', 'Mas overhead'],
            ['Round Robin', 'Si', 'Buena respuesta interactiva', 'Quantum mal elegido degrada rendimiento'],
            ['Prioridades', 'Puede ser', 'Flexible', 'Inanicion sin aging'],
            ['HRN', 'No', 'Equilibra espera y duracion', 'Requiere mas calculo'],
          ],
        },
        {
          type: 'formulaGrid',
          title: 'Formulas de planificacion',
          items: [
            { label: 'Retorno', formula: 'Tretorno = Tfinalizacion - Tllegada', example: 'Si llega en 2 y termina en 14, retorno = 12' },
            { label: 'Espera', formula: 'Tespera = Tretorno - Trafaga', example: 'Si retorno = 12 y rafaga = 5, espera = 7' },
            { label: 'HRN', formula: '(espera + servicio) / servicio', example: 'Mayor valor tiene prioridad' },
            { label: 'Quantum', formula: 'RR cambia al vencer el quantum', example: 'Quantum chico mejora respuesta pero sube overhead' },
          ],
        },
      ],
    },
    {
      title: 'Memoria, paginacion y reemplazo',
      paragraphs: [
        'La memoria fisica es limitada, por eso el SO ofrece memoria virtual: cada proceso cree tener un espacio propio y continuo, mientras el sistema traduce direcciones virtuales a marcos fisicos. Esto mejora aislamiento, seguridad y administracion.',
        'La paginacion divide memoria virtual en paginas y memoria fisica en marcos del mismo tamano. Una direccion virtual se separa en numero de pagina y desplazamiento. La tabla de paginas indica en que marco esta cada pagina. Si no esta en RAM ocurre un page fault y se trae desde disco.',
        'La segmentacion divide segun unidades logicas como codigo, datos y pila. Es mas semantica, pero puede generar fragmentacion externa. La paginacion evita fragmentacion externa, aunque puede tener fragmentacion interna en la ultima pagina.',
        'Cuando no hay marcos libres, se aplica reemplazo de paginas: FIFO, LRU, Optimo o variantes. Si hay demasiados page faults aparece thrashing: el sistema pasa mas tiempo moviendo paginas que ejecutando procesos.',
      ],
      visuals: [
        {
          type: 'compare',
          title: 'Paginacion vs segmentacion',
          columns: ['Criterio', 'Paginacion', 'Segmentacion'],
          rows: [
            ['Unidad', 'Paginas de tamano fijo', 'Segmentos de tamano variable'],
            ['Vision', 'Fisica/administrativa', 'Logica: codigo, datos, pila'],
            ['Fragmentacion', 'Interna posible', 'Externa posible'],
            ['Traduccion', 'Pagina + desplazamiento', 'Segmento + desplazamiento'],
          ],
        },
        {
          type: 'formulaGrid',
          title: 'Calculos tipicos de memoria',
          items: [
            { label: 'Cantidad de paginas', formula: 'tamano proceso / tamano pagina', example: '64 KB / 4 KB = 16 paginas' },
            { label: 'Cantidad de marcos', formula: 'RAM / tamano pagina', example: '1 GB / 4 KB = 262144 marcos' },
            { label: 'Offset', formula: 'bits offset = log2(tamano pagina)', example: '4 KB = 4096 = 2^12, offset 12 bits' },
            { label: 'Numero de pagina', formula: 'bits direccion - bits offset', example: '32 bits - 12 = 20 bits para pagina' },
          ],
        },
        {
          type: 'compare',
          title: 'Reemplazo de paginas',
          columns: ['Algoritmo', 'Criterio', 'Observacion'],
          rows: [
            ['FIFO', 'Saca la pagina mas antigua', 'Simple, puede sufrir anomalia de Belady'],
            ['LRU', 'Saca la menos usada recientemente', 'Aprovecha localidad temporal'],
            ['Optimo', 'Saca la que se usara mas tarde', 'Ideal teorico para comparar'],
            ['Clock', 'Aproxima LRU con bit de referencia', 'Usado por eficiencia'],
          ],
        },
      ],
    },
    {
      title: 'Archivos, concurrencia y deadlocks',
      paragraphs: [
        'El sistema de archivos organiza datos persistentes en archivos y directorios. Tambien administra metadatos: propietario, permisos, fechas, tamano, ubicacion y atributos. El journaling registra operaciones antes de aplicarlas para mejorar recuperacion ante cortes o fallos.',
        'La concurrencia aparece cuando varias tareas avanzan de forma intercalada. Si comparten datos sin control puede haber condiciones de carrera. Para proteger regiones criticas se usan mutex, semaforos, monitores y locks de lectura/escritura.',
        'Un deadlock ocurre cuando procesos quedan bloqueados esperando recursos que otros retienen. Las condiciones de Coffman son exclusion mutua, retencion y espera, no expropiacion y espera circular. Para tratarlo se puede prevenir, evitar, detectar y recuperar.',
      ],
      visuals: [
        {
          type: 'compare',
          title: 'Mecanismos de sincronizacion',
          columns: ['Mecanismo', 'Uso', 'Riesgo si se usa mal'],
          rows: [
            ['Mutex', 'Exclusion mutua simple', 'Olvidar liberar el lock'],
            ['Semaforo', 'Controlar cantidad de accesos', 'Contadores mal inicializados'],
            ['Monitor', 'Encapsular estado y sincronizacion', 'Bloqueos internos complejos'],
            ['Read/Write lock', 'Muchos lectores o un escritor', 'Inanicion de escritores'],
          ],
        },
        {
          type: 'cards',
          title: 'Condiciones de Coffman',
          items: [
            { label: 'Exclusion mutua', text: 'Al menos un recurso no puede compartirse simultaneamente.' },
            { label: 'Retencion y espera', text: 'Un proceso retiene recursos mientras espera otros.' },
            { label: 'No expropiacion', text: 'El SO no puede quitarle el recurso por la fuerza.' },
            { label: 'Espera circular', text: 'P1 espera a P2, P2 espera a P3 y P3 espera a P1.' },
          ],
        },
        {
          type: 'compare',
          title: 'Estrategias ante deadlock',
          columns: ['Estrategia', 'Idea', 'Ejemplo'],
          rows: [
            ['Prevencion', 'Romper una condicion de Coffman', 'Imponer orden global de recursos'],
            ['Evitacion', 'No entrar en estados inseguros', 'Algoritmo del banquero'],
            ['Deteccion', 'Permitir y luego buscar ciclos', 'Grafo de asignacion de recursos'],
            ['Recuperacion', 'Salir del bloqueo', 'Abortar proceso o liberar recurso'],
          ],
        },
      ],
    },
  ],
};

export const NETWORKS_THEORY_MODULE: TheoryModule = {
  topic: 'redes_comunicaciones',
  title: 'Comunicaciones y Redes',
  sections: [
    {
      title: 'Redes, protocolos y encapsulacion',
      paragraphs: [
        'Una red es un conjunto de dispositivos conectados para intercambiar informacion y compartir recursos. Los dispositivos pueden ser PCs, servidores, routers, switches, firewalls, impresoras, celulares o servicios cloud.',
        'El punto central es que comunicarse requiere reglas. Un protocolo define formato de mensajes, direcciones, orden, control de errores, confirmaciones y acciones ante fallas. Sin protocolos, dos equipos podrian estar conectados fisicamente y aun asi no entenderse.',
        'La encapsulacion explica como una aplicacion envia datos: HTTP genera datos, TCP agrega puertos y control de confiabilidad, IP agrega direcciones logicas, Ethernet agrega MAC y CRC, y la capa fisica convierte todo en bits por cable, fibra o radio.',
      ],
      visuals: [
        {
          type: 'flow',
          title: 'Encapsulacion de una solicitud web',
          steps: ['Datos HTTP de la aplicacion', 'Segmento TCP con puertos, secuencia y ACK', 'Paquete IP con origen, destino y TTL', 'Trama Ethernet/Wi-Fi con MAC y CRC', 'Bits por el medio fisico'],
        },
        {
          type: 'compare',
          title: 'Conceptos base',
          columns: ['Concepto', 'Definicion', 'Ejemplo'],
          rows: [
            ['Nodo', 'Dispositivo conectado', 'PC, celular, servidor'],
            ['Medio', 'Canal de transmision', 'UTP, fibra, Wi-Fi'],
            ['Protocolo', 'Reglas de comunicacion', 'TCP, IP, HTTP, Ethernet'],
            ['Trama/paquete', 'Unidad de datos', 'Trama Ethernet, paquete IP'],
          ],
        },
      ],
    },
    {
      title: 'Modelo OSI y TCP/IP',
      paragraphs: [
        'El modelo OSI divide la comunicacion en siete capas para estudiar responsabilidades. TCP/IP agrupa esas funciones en una pila mas cercana a Internet. En el EFIP, lo importante es ubicar conceptos por capa y usar eso para diagnosticar problemas.',
        'Si falla una web, puede ser un problema fisico, de enlace, IP, transporte, DNS, firewall o aplicacion. Una respuesta profesional separa capas en lugar de decir simplemente "no hay Internet".',
      ],
      visuals: [
        {
          type: 'compare',
          title: 'OSI vs TCP/IP',
          columns: ['OSI', 'Funcion', 'Unidad', 'TCP/IP', 'Ejemplos'],
          rows: [
            ['7 Aplicacion', 'Servicios para apps', 'Datos', 'Aplicacion', 'HTTP, DNS, SMTP'],
            ['6 Presentacion', 'Codificacion, compresion, cifrado', 'Datos', 'Aplicacion', 'TLS, JPEG, UTF-8'],
            ['5 Sesion', 'Dialogo y sesiones', 'Datos', 'Aplicacion', 'RPC, control de sesion'],
            ['4 Transporte', 'Extremo a extremo', 'Segmento/datagrama', 'Transporte', 'TCP, UDP'],
            ['3 Red', 'IP y enrutamiento', 'Paquete', 'Internet', 'IP, ICMP, OSPF'],
            ['2 Enlace', 'MAC, tramas y errores locales', 'Trama', 'Acceso a red', 'Ethernet, Wi-Fi'],
            ['1 Fisica', 'Senales y bits', 'Bits', 'Acceso a red', 'Cable, fibra, radio'],
          ],
        },
        {
          type: 'cards',
          title: 'Mapa mental de capa a concepto',
          items: [
            { label: 'IP', text: 'Capa de red: identifica hosts y permite enrutar paquetes.' },
            { label: 'TCP / UDP', text: 'Capa de transporte: puertos, confiabilidad o baja sobrecarga.' },
            { label: 'Ethernet / Wi-Fi', text: 'Capa de enlace: tramas, MAC y acceso local.' },
            { label: 'HTTP / DNS', text: 'Capa de aplicacion: servicios usados por programas.' },
          ],
        },
      ],
    },
    {
      title: 'Dispositivos, medios y dominios',
      paragraphs: [
        'Un hub repite senales a todos y pertenece a capa fisica. Un switch aprende direcciones MAC y reenvia tramas dentro de una LAN. Un router conecta redes distintas usando IP. Un firewall filtra trafico segun reglas y puede operar en capas 3, 4 o 7.',
        'Los dominios importan para diseno. Un switch separa dominios de colision por puerto, pero mantiene broadcast dentro de la misma VLAN. Un router separa dominios de broadcast y permite controlar el paso entre redes.',
        'El medio de transmision afecta distancia, ancho de banda, interferencia y costo. La fibra optica es la mas inmune a interferencia electromagnetica y se usa en backbone o largas distancias; UTP es comun por costo y simplicidad en LAN.',
      ],
      visuals: [
        {
          type: 'compare',
          title: 'Hub, switch, router, firewall y gateway',
          columns: ['Dispositivo', 'Capa', 'Que hace', 'Broadcast'],
          rows: [
            ['Hub', '1', 'Repite bits a todos', 'No separa'],
            ['Switch', '2', 'Reenvia por MAC', 'Mantiene dentro de VLAN'],
            ['Router', '3', 'Enruta por IP', 'Separa broadcasts'],
            ['Firewall', '3/4/7', 'Filtra trafico', 'Depende del diseno'],
            ['Gateway', 'Varias', 'Conecta o traduce redes/protocolos', 'Depende'],
          ],
        },
        {
          type: 'compare',
          title: 'Medios de transmision',
          columns: ['Medio', 'Senal', 'Distancia', 'Fortaleza'],
          rows: [
            ['UTP', 'Electrica', 'Aprox. 100 m', 'Barato y facil de instalar'],
            ['STP', 'Electrica blindada', 'Aprox. 100 m', 'Mejor ante interferencia'],
            ['Fibra optica', 'Luminosa', 'Kilometros', 'Muy alto ancho de banda e inmunidad EMI'],
            ['Coaxial', 'Electrica', 'Cientos de metros', 'Util en TV/CCTV y entornos especificos'],
          ],
        },
      ],
    },
    {
      title: 'Direccionamiento IP, NAT y subnetting',
      paragraphs: [
        'IPv4 tiene 32 bits divididos en cuatro octetos. Una IP identifica un host en una red logica; una MAC identifica una interfaz en el enlace local. Los puertos identifican servicios dentro de un host.',
        'Las IP privadas no se enrutan directamente en Internet: 10.0.0.0/8, 172.16.0.0/12 y 192.168.0.0/16. NAT permite que varias IP privadas salgan usando una o pocas IP publicas, manteniendo una tabla de traducciones.',
        'Subnetting divide una red en subredes. Para hosts usables se usa 2^h - 2 en IPv4 tradicional, porque se reserva red y broadcast. Para subredes se piden bits prestados a la parte de host.',
      ],
      visuals: [
        {
          type: 'formulaGrid',
          title: 'Formulas de subnetting',
          items: [
            { label: 'Hosts usables', formula: '2^h - 2', example: '/24 deja 8 bits host: 254 hosts' },
            { label: 'Subredes', formula: '2^s', example: 'Para 8 subredes se prestan 3 bits' },
            { label: 'Nuevo prefijo', formula: 'prefijo original + bits prestados', example: '/16 + 3 = /19' },
            { label: 'Tamano de bloque', formula: '256 - mascara del octeto interesante', example: 'Mascara 224: bloque 32' },
          ],
        },
        {
          type: 'compare',
          title: 'IP, MAC, puerto y DNS',
          columns: ['Elemento', 'Nivel', 'Funcion', 'Ejemplo'],
          rows: [
            ['IP', 'Red', 'Identifica host logico', '192.168.1.10'],
            ['MAC', 'Enlace', 'Identifica interfaz local', '00:1A:2B:...'],
            ['Puerto', 'Transporte', 'Identifica servicio', '443 HTTPS'],
            ['DNS', 'Aplicacion', 'Traduce nombre a IP', 'efiper.local -> IP'],
          ],
        },
      ],
    },
    {
      title: 'TCP, UDP, DMZ, VPN y MPLS',
      paragraphs: [
        'TCP es orientado a conexion y confiable: usa handshake, numeros de secuencia, ACK, retransmision y control de flujo. UDP no garantiza entrega ni orden, pero tiene menor sobrecarga. No es "malo": sirve para voz, streaming, DNS o juegos donde la latencia pesa mas que retransmitir todo.',
        'Una DMZ ubica servicios expuestos, como web o correo, en una zona intermedia separada de la LAN interna. Una VPN crea un tunel cifrado para acceso remoto o conexion entre sedes. MPLS permite transportar trafico con etiquetas y calidad de servicio, comun para voz o enlaces empresariales.',
      ],
      visuals: [
        {
          type: 'flow',
          title: 'Three-way handshake TCP',
          steps: ['Cliente envia SYN', 'Servidor responde SYN-ACK', 'Cliente confirma ACK', 'Conexion establecida', 'Comienzan los datos'],
        },
        {
          type: 'compare',
          title: 'TCP vs UDP',
          columns: ['Criterio', 'TCP', 'UDP'],
          rows: [
            ['Conexion', 'Orientado a conexion', 'Sin conexion'],
            ['Confiabilidad', 'ACK y retransmision', 'No garantiza entrega'],
            ['Orden', 'Ordena segmentos', 'Puede llegar desordenado'],
            ['Uso tipico', 'Web, archivos, correo', 'DNS, voz, streaming, juegos'],
            ['Costo', 'Mayor overhead', 'Menor latencia'],
          ],
        },
        {
          type: 'flow',
          title: 'Topologia profesional con DMZ y VPN',
          steps: ['Usuarios remotos ingresan por VPN', 'Internet llega al firewall perimetral', 'Servicios publicos viven en DMZ', 'Aplicacion consulta base de datos en red interna', 'Sucursales se enlazan por VPN/MPLS segun criticidad'],
        },
      ],
    },
    {
      title: 'Seguridad, Wi-Fi y cloud',
      paragraphs: [
        'La triada CIA resume objetivos de seguridad: confidencialidad, integridad y disponibilidad. El cifrado protege confidencialidad; el hash verifica integridad; la redundancia, backups y mitigacion DDoS ayudan a disponibilidad.',
        'El cifrado simetrico usa la misma clave para cifrar y descifrar, por eso es rapido pero exige compartir la clave de forma segura. El asimetrico usa clave publica y privada, facilita intercambio y firma digital, pero es mas costoso. En la practica se combinan.',
        'En Wi-Fi conviene WPA2/WPA3, contrasenas fuertes, desactivar WPS, segmentar invitados y evitar redes abiertas. En cloud, se distinguen IaaS, PaaS y SaaS; tambien nube publica, privada e hibrida.',
      ],
      visuals: [
        {
          type: 'cards',
          title: 'Triada CIA',
          items: [
            { label: 'Confidencialidad', text: 'Solo acceden quienes estan autorizados. Ejemplo: cifrado y permisos.' },
            { label: 'Integridad', text: 'La informacion no se altera sin autorizacion. Ejemplo: hash y firmas.' },
            { label: 'Disponibilidad', text: 'El servicio esta accesible cuando se necesita. Ejemplo: redundancia y backups.' },
          ],
        },
        {
          type: 'compare',
          title: 'Cifrado y hash',
          columns: ['Tecnica', 'Objetivo', 'Caracteristica'],
          rows: [
            ['Simetrico', 'Confidencialidad', 'Rapido, misma clave'],
            ['Asimetrico', 'Confidencialidad, intercambio y firma', 'Par publica/privada'],
            ['Hash', 'Integridad', 'Huella irreversible de longitud fija'],
            ['Firma digital', 'Autenticidad e integridad', 'Hash cifrado con clave privada'],
          ],
        },
        {
          type: 'compare',
          title: 'Modelos cloud',
          columns: ['Modelo', 'Proveedor gestiona', 'Usuario gestiona', 'Ejemplo'],
          rows: [
            ['IaaS', 'Infraestructura', 'SO, runtime y app', 'VMs'],
            ['PaaS', 'Infraestructura y plataforma', 'Codigo y datos', 'App service'],
            ['SaaS', 'Aplicacion completa', 'Configuracion y uso', 'Correo, CRM'],
          ],
        },
      ],
    },
  ],
};

export const DATABASES_THEORY_MODULE: TheoryModule = {
  topic: 'base_de_datos',
  title: 'Bases de Datos',
  sections: [
    {
      title: 'Base de datos, SGBD y modelo relacional',
      paragraphs: [
        'Una base de datos es una coleccion organizada de datos relacionados. Un SGBD es el software que permite crear, consultar, modificar, proteger y recuperar esos datos. La diferencia con un archivo suelto es que el SGBD aporta estructura, restricciones, concurrencia, seguridad, transacciones y recuperacion.',
        'En el modelo relacional, los datos se organizan en tablas. Una fila o tupla representa un registro; una columna o atributo representa una propiedad; un dominio define valores permitidos; la clave primaria identifica univocamente cada fila; la clave foranea conecta tablas manteniendo integridad referencial.',
      ],
      visuals: [
        {
          type: 'compare',
          title: 'Conceptos del modelo relacional',
          columns: ['Concepto', 'Equivalente', 'Ejemplo'],
          rows: [
            ['Relacion', 'Tabla', 'Cliente'],
            ['Tupla', 'Fila', 'Cliente #10'],
            ['Atributo', 'Columna', 'email'],
            ['Dominio', 'Valores validos', 'edad 0..150'],
            ['Cardinalidad', 'Cantidad de filas', '500 clientes'],
            ['Grado', 'Cantidad de columnas', 'Cliente(id,nombre) grado 2'],
          ],
        },
        {
          type: 'compare',
          title: 'Claves e integridad',
          columns: ['Elemento', 'Regla', 'Ejemplo'],
          rows: [
            ['PK', 'Unica y no nula', 'Cliente.id_cliente'],
            ['FK', 'Referencia una PK existente', 'Pedido.id_cliente'],
            ['Candidata', 'Podria ser PK por unicidad minima', 'DNI o email unico'],
            ['Alternativa', 'Candidata no elegida', 'UNIQUE(email)'],
            ['Integridad de entidad', 'PK no nula', 'No existe cliente sin id'],
            ['Integridad referencial', 'FK valida o nula si se permite', 'Pedido no apunta a cliente inexistente'],
          ],
        },
      ],
    },
    {
      title: 'Algebra relacional, DER y pasaje a tablas',
      paragraphs: [
        'El algebra relacional es la base formal de SQL. Seleccion filtra filas; proyeccion elige columnas; union, interseccion y diferencia combinan relaciones compatibles; producto cartesiano genera combinaciones; join relaciona tablas por atributos.',
        'Un DER permite modelar antes de programar. Identifica entidades, atributos, relaciones, cardinalidades y participacion. El pasaje correcto a tablas evita redundancia y errores de integridad.',
      ],
      visuals: [
        {
          type: 'compare',
          title: 'Algebra relacional y SQL',
          columns: ['Operacion', 'Simbolo', 'SQL aproximado', 'Funcion'],
          rows: [
            ['Seleccion', 'sigma', 'WHERE', 'Filtra filas'],
            ['Proyeccion', 'pi', 'SELECT columnas', 'Elige columnas'],
            ['Union', 'U', 'UNION', 'Combina compatibles'],
            ['Interseccion', 'n', 'INTERSECT', 'Filas comunes'],
            ['Diferencia', '-', 'EXCEPT / MINUS', 'Filas de una que no estan en otra'],
            ['Producto', 'x', 'CROSS JOIN', 'Todas las combinaciones'],
            ['Join', 'join', 'JOIN', 'Combina por atributos relacionados'],
          ],
        },
        {
          type: 'compare',
          title: 'Pasaje DER a tablas',
          columns: ['Elemento DER', 'Transformacion relacional', 'Ejemplo'],
          rows: [
            ['Entidad fuerte', 'Tabla con PK', 'Cliente(id_cliente, nombre)'],
            ['Entidad debil', 'Tabla con PK compuesta incluyendo FK', 'Detalle dependiente de Pedido'],
            ['Relacion 1:N', 'FK en el lado N', 'Libro.id_editorial'],
            ['Relacion N:M', 'Tabla intermedia', 'Libro_Autor(ISBN, id_autor)'],
            ['Atributo multivaluado', 'Tabla separada', 'Telefonos_cliente'],
            ['Relacion 1:1', 'FK en una tabla, preferible participacion total', 'Persona - Pasaporte'],
          ],
        },
        {
          type: 'flow',
          title: 'DER biblioteca llevado a tablas',
          steps: ['Editorial publica muchos libros', 'Libro pertenece a una editorial por FK', 'Libro y Autor son N:M', 'Se crea Libro_Autor', 'Socio realiza Prestamo', 'Prestamo guarda fechas y referencia Socio y Libro'],
        },
      ],
    },
    {
      title: 'Normalizacion hasta BCNF',
      paragraphs: [
        'Normalizar busca reducir redundancia y anomalias de insercion, actualizacion y borrado. No es decorar tablas: es hacer que cada dato dependa de la clave correcta y que las dependencias funcionales esten bien ubicadas.',
        '1FN exige valores atomicos y sin grupos repetidos. 2FN elimina dependencias parciales respecto de claves compuestas. 3FN elimina dependencias transitivas. BCNF es mas estricta: todo determinante debe ser clave candidata.',
        'Cuando una tabla Pedido mezcla datos de cliente, producto y venta, aparecen problemas: cambiar el telefono del cliente obliga a tocar muchas filas, eliminar el ultimo pedido puede borrar informacion del producto, y cargar un producto sin pedido puede ser imposible. La solucion es separar entidades y relaciones.',
      ],
      visuals: [
        {
          type: 'compare',
          title: 'Formas normales',
          columns: ['Forma', 'Exige', 'Problema que evita'],
          rows: [
            ['1FN', 'Atributos atomicos', 'Listas dentro de una celda'],
            ['2FN', 'No dependencias parciales de clave compuesta', 'Datos que dependen solo de parte de la clave'],
            ['3FN', 'No dependencias transitivas', 'Atributos no clave determinando otros no clave'],
            ['BCNF', 'Todo determinante es clave candidata', 'Casos donde 3FN aun deja dependencias problematicas'],
          ],
        },
        {
          type: 'flow',
          title: 'Metodo para normalizar en examen',
          steps: ['Listar atributos', 'Detectar dependencias funcionales', 'Encontrar claves candidatas', 'Verificar 1FN, 2FN, 3FN y BCNF', 'Descomponer preservando informacion', 'Justificar que se reducen anomalias'],
        },
        {
          type: 'cards',
          title: 'Anomalias clasicas',
          items: [
            { label: 'Insercion', text: 'No puedo cargar un dato sin otro dato no relacionado.' },
            { label: 'Actualizacion', text: 'Debo modificar el mismo dato repetido en muchas filas.' },
            { label: 'Borrado', text: 'Al borrar una fila pierdo informacion que queria conservar.' },
          ],
        },
      ],
    },
    {
      title: 'SQL: DDL, DML, consultas y orden logico',
      paragraphs: [
        'SQL se divide en grupos: DDL define estructura, DML modifica datos, DQL consulta, DCL administra permisos y TCL controla transacciones. En casos practicos, conviene escribir primero tablas con PK/FK y luego consultas que unan correctamente.',
        'El orden logico de una consulta no es el orden escrito. Primero se resuelve FROM y JOIN, luego WHERE, GROUP BY, HAVING, SELECT, DISTINCT, ORDER BY y LIMIT. Entender eso evita errores con alias, filtros agregados y agrupamientos.',
        'WHERE filtra filas antes de agrupar; HAVING filtra grupos despues de agrupar. JOIN combina tablas: INNER trae coincidencias; LEFT conserva la izquierda aunque no haya coincidencia; RIGHT conserva la derecha; FULL conserva ambos lados.',
      ],
      visuals: [
        {
          type: 'compare',
          title: 'Clasificacion SQL',
          columns: ['Grupo', 'Comandos', 'Uso'],
          rows: [
            ['DDL', 'CREATE, ALTER, DROP', 'Definir estructura'],
            ['DML', 'INSERT, UPDATE, DELETE', 'Modificar datos'],
            ['DQL', 'SELECT', 'Consultar datos'],
            ['DCL', 'GRANT, REVOKE', 'Permisos'],
            ['TCL', 'COMMIT, ROLLBACK, SAVEPOINT', 'Transacciones'],
          ],
        },
        {
          type: 'flow',
          title: 'Orden logico de SELECT',
          steps: ['FROM y JOIN', 'WHERE', 'GROUP BY', 'HAVING', 'SELECT', 'DISTINCT', 'ORDER BY', 'LIMIT / FETCH'],
        },
        {
          type: 'compare',
          title: 'JOINs esenciales',
          columns: ['JOIN', 'Resultado', 'Caso de uso'],
          rows: [
            ['INNER JOIN', 'Solo coincidencias', 'Pedidos con cliente existente'],
            ['LEFT JOIN', 'Todo lo izquierdo y coincidencias', 'Clientes aunque no tengan pedidos'],
            ['RIGHT JOIN', 'Todo lo derecho y coincidencias', 'Menos usado, simetrico de LEFT'],
            ['FULL JOIN', 'Todo de ambos lados', 'Comparar conjuntos completos'],
            ['CROSS JOIN', 'Producto cartesiano', 'Combinaciones posibles'],
          ],
        },
      ],
    },
    {
      title: 'PL/SQL, triggers, procedimientos y cursores',
      paragraphs: [
        'PL/SQL agrega logica procedural al mundo SQL: variables, condiciones, bucles, excepciones, procedimientos, funciones, triggers y cursores. Sirve para encapsular reglas dentro de la base cuando corresponde.',
        'Un trigger se dispara ante eventos como INSERT, UPDATE o DELETE. Puede validar reglas, completar auditoria o impedir operaciones. Hay que usarlo con criterio: demasiada logica oculta complica mantenimiento.',
        'Un procedimiento ejecuta una accion; una funcion devuelve un valor. Un cursor permite recorrer fila por fila cuando una operacion set-based no alcanza, aunque en bases de datos suele preferirse resolver en conjuntos siempre que sea posible.',
      ],
      visuals: [
        {
          type: 'compare',
          title: 'Objetos PL/SQL',
          columns: ['Objeto', 'Devuelve valor', 'Uso tipico'],
          rows: [
            ['Procedimiento', 'No necesariamente', 'Registrar prestamo, actualizar estado'],
            ['Funcion', 'Si', 'Calcular multas o cantidad de prestamos'],
            ['Trigger', 'Se dispara por evento', 'Impedir mas de N prestamos activos'],
            ['Cursor', 'Recorre filas', 'Procesos fila a fila excepcionales'],
          ],
        },
        {
          type: 'flow',
          title: 'Trigger limite de prestamos',
          steps: ['Antes de insertar prestamo', 'Contar prestamos activos del socio', 'Si supera limite, lanzar error', 'Si no supera, permitir INSERT', 'Registrar auditoria si corresponde'],
        },
      ],
    },
    {
      title: 'Transacciones, ACID, indices y errores frecuentes',
      paragraphs: [
        'Una transaccion agrupa operaciones que deben confirmarse o deshacerse como unidad. ACID resume sus propiedades: atomicidad, consistencia, aislamiento y durabilidad. Es central en operaciones como transferencias, reservas o compras.',
        'Los indices aceleran busquedas y joins, pero tienen costo de mantenimiento en INSERT, UPDATE y DELETE. No se crean por ansiedad: se justifican por consultas frecuentes, selectividad y columnas usadas en filtros, joins u ordenamientos.',
        'Errores frecuentes en EFIP: olvidar PK/FK, poner una N:M sin tabla intermedia, confundir WHERE con HAVING, agrupar mal columnas, usar SELECT * en respuestas teoricas, creer que un indice siempre mejora todo o no proteger transacciones criticas.',
      ],
      visuals: [
        {
          type: 'cards',
          title: 'ACID',
          items: [
            { label: 'Atomicidad', text: 'Todo ocurre o nada ocurre.' },
            { label: 'Consistencia', text: 'La base pasa de un estado valido a otro valido.' },
            { label: 'Aislamiento', text: 'Transacciones concurrentes no deben interferir incorrectamente.' },
            { label: 'Durabilidad', text: 'Lo confirmado permanece aunque haya fallos.' },
          ],
        },
        {
          type: 'compare',
          title: 'Indices',
          columns: ['Tipo', 'Ventaja', 'Costo'],
          rows: [
            ['B-tree', 'Bueno para igualdad y rangos', 'Ocupa espacio y se actualiza'],
            ['Clustered', 'Orden fisico/logico principal', 'Generalmente uno por tabla'],
            ['Non-clustered', 'Estructura separada con punteros', 'Puede haber varios'],
            ['Compuesto', 'Varias columnas', 'Importa el orden de columnas'],
          ],
        },
        {
          type: 'cards',
          title: 'Checklist para responder BD',
          items: [
            { label: 'Modelo', text: 'Nombrar entidades, relaciones, cardinalidades y claves.' },
            { label: 'Normalizacion', text: 'Explicar dependencias y anomalias que se eliminan.' },
            { label: 'SQL', text: 'Separar DDL, DML, joins, filtros y agregaciones.' },
            { label: 'Operacion', text: 'Mencionar transacciones, indices, permisos y recuperacion.' },
          ],
        },
      ],
    },
  ],
};

export const ALGORITHMS_THEORY_MODULE: TheoryModule = {
  topic: 'algoritmos_estructuras',
  title: 'Algoritmos y Estructuras de Datos',
  sections: [
    {
      title: 'Algoritmos, TDA y complejidad',
      paragraphs: [
        'Un algoritmo es una secuencia finita, ordenada y precisa de pasos para resolver un problema. Una estructura de datos organiza informacion para acceder, modificar o recorrer eficientemente. Un TDA define operaciones y comportamiento sin imponer una implementacion concreta.',
        'La complejidad mide recursos segun el tamano de entrada n. Big-O expresa una cota asintotica: ignora constantes y terminos menores para enfocarse en como crece el costo. En el EFIP no alcanza con nombrar O(n): hay que justificar de donde sale.',
      ],
      visuals: [
        {
          type: 'compare',
          title: 'Crecimiento de complejidades',
          columns: ['Notacion', 'Nombre', 'Ejemplo', 'Lectura'],
          rows: [
            ['O(1)', 'Constante', 'Acceso por indice', 'No depende de n'],
            ['O(log n)', 'Logaritmica', 'Busqueda binaria', 'Divide el problema'],
            ['O(n)', 'Lineal', 'Recorrer lista', 'Proporcional a n'],
            ['O(n log n)', 'Lineal-log', 'MergeSort', 'Muy comun en ordenamiento eficiente'],
            ['O(n^2)', 'Cuadratica', 'Doble bucle anidado', 'Mala para entradas grandes'],
            ['O(2^n)', 'Exponencial', 'Fuerza bruta combinatoria', 'Explota rapido'],
          ],
        },
        {
          type: 'formulaGrid',
          title: 'Patrones para calcular Big-O',
          items: [
            { label: 'Un bucle simple', formula: 'n iteraciones -> O(n)', example: 'for i = 0 hasta n' },
            { label: 'Dos bucles anidados', formula: 'n * n -> O(n^2)', example: 'Matriz n por n' },
            { label: 'Bucle que duplica', formula: 'i = i * 2 -> O(log n)', example: '1,2,4,8...' },
            { label: 'Divide y combina', formula: 'T(n)=2T(n/2)+n -> O(n log n)', example: 'MergeSort' },
          ],
        },
      ],
    },
    {
      title: 'Pilas y colas',
      paragraphs: [
        'Una pila sigue LIFO: el ultimo en entrar es el primero en salir. Sus operaciones tipicas son push, pop y peek. Se usa para deshacer acciones, evaluar expresiones, recorrer llamadas recursivas o validar parentesis.',
        'Una cola sigue FIFO: el primero en entrar es el primero en salir. Sus operaciones son enqueue, dequeue y front. Se usa para turnos, buffers, planificacion, impresion y procesamiento por llegada.',
        'La clave no es memorizar nombres en ingles, sino reconocer el comportamiento. Si el problema habla de "ultimo pendiente primero", pensas en pila. Si habla de "orden de llegada", pensas en cola.',
      ],
      visuals: [
        {
          type: 'compare',
          title: 'Stack vs Queue',
          columns: ['Estructura', 'Regla', 'Operaciones', 'Usos'],
          rows: [
            ['Pila', 'LIFO', 'push, pop, peek', 'Undo, recursion, parentesis'],
            ['Cola', 'FIFO', 'enqueue, dequeue, front', 'Turnos, buffers, planificacion'],
            ['Deque', 'Ambos extremos', 'add/remove first/last', 'Colas flexibles'],
            ['Cola prioridad', 'Sale por prioridad', 'insert, extractMax/Min', 'Dijkstra, planificador'],
          ],
        },
        {
          type: 'stack',
          title: 'Simulacion de pila',
          items: [
            { label: 'Tope', detail: 'Elemento 3: proximo en salir' },
            { label: 'Medio', detail: 'Elemento 2' },
            { label: 'Base', detail: 'Elemento 1: primero que entro' },
          ],
        },
        {
          type: 'flow',
          title: 'Simulacion de cola',
          steps: ['Entra A', 'Entra B', 'Entra C', 'Sale A', 'Sale B', 'Sale C'],
        },
      ],
    },
    {
      title: 'Listas enlazadas y arrays',
      paragraphs: [
        'Un array almacena elementos contiguos y permite acceso por indice en O(1), pero insertar o eliminar en el medio suele requerir desplazar elementos. Una lista enlazada usa nodos con referencias; facilita inserciones y eliminaciones conocidas, pero acceder por posicion requiere recorrer.',
        'Una lista simple apunta al siguiente nodo. Una lista doble apunta al anterior y al siguiente. Una lista circular conecta el ultimo con el primero y sirve para turnos ciclicos o recorridos repetitivos.',
      ],
      visuals: [
        {
          type: 'compare',
          title: 'Array vs lista enlazada',
          columns: ['Criterio', 'Array', 'Lista simple', 'Lista doble'],
          rows: [
            ['Acceso por indice', 'O(1)', 'O(n)', 'O(n)'],
            ['Insertar al inicio', 'O(n)', 'O(1)', 'O(1)'],
            ['Eliminar nodo conocido', 'O(n)', 'O(1) si tengo anterior', 'O(1)'],
            ['Memoria extra', 'Baja', 'Referencia next', 'Prev y next'],
            ['Localidad de cache', 'Buena', 'Peor', 'Peor'],
          ],
        },
        {
          type: 'flow',
          title: 'Insertar al final en lista simple',
          steps: ['Crear nuevo nodo', 'Si la lista esta vacia, head = nuevo', 'Si no, recorrer hasta nodo.next null', 'Asignar ultimo.next = nuevo', 'Mantener tail si existe para O(1)'],
        },
      ],
    },
    {
      title: 'Ordenamiento',
      paragraphs: [
        'Ordenar permite busquedas mas eficientes y presentacion consistente. Los algoritmos simples como burbuja e insercion son faciles de entender, pero suelen ser O(n^2). MergeSort y QuickSort explican estrategias divide and conquer.',
        'Burbuja compara vecinos e intercambia si estan desordenados. Insercion toma cada elemento y lo ubica en la parte ya ordenada. MergeSort divide, ordena mitades y fusiona. QuickSort elige pivote, particiona y ordena recursivamente.',
        'QuickSort promedio es O(n log n), pero puede caer a O(n^2) si el pivote produce particiones muy desbalanceadas, por ejemplo el ultimo elemento en una lista ya ordenada.',
      ],
      visuals: [
        {
          type: 'compare',
          title: 'Algoritmos de ordenamiento',
          columns: ['Algoritmo', 'Promedio', 'Peor caso', 'Estable', 'Idea'],
          rows: [
            ['Burbuja', 'O(n^2)', 'O(n^2)', 'Si', 'Intercambia vecinos'],
            ['Insercion', 'O(n^2)', 'O(n^2)', 'Si', 'Inserta en zona ordenada'],
            ['Seleccion', 'O(n^2)', 'O(n^2)', 'No tipicamente', 'Busca minimo y lo coloca'],
            ['MergeSort', 'O(n log n)', 'O(n log n)', 'Si', 'Divide y fusiona'],
            ['QuickSort', 'O(n log n)', 'O(n^2)', 'No tipicamente', 'Pivote y particion'],
          ],
        },
        {
          type: 'flow',
          title: 'MergeSort',
          steps: ['Dividir arreglo en dos mitades', 'Ordenar recursivamente izquierda', 'Ordenar recursivamente derecha', 'Fusionar manteniendo orden', 'Resultado ordenado'],
        },
        {
          type: 'flow',
          title: 'QuickSort',
          steps: ['Elegir pivote', 'Mover menores a la izquierda', 'Mover mayores a la derecha', 'Ordenar particiones', 'Unir resultado'],
        },
      ],
    },
    {
      title: 'Busqueda binaria y arbol de decision',
      paragraphs: [
        'La busqueda binaria solo funciona si la coleccion esta ordenada. Compara con el elemento medio y descarta la mitad que no puede contener el valor. Por eso su complejidad es O(log n). Si la lista no esta ordenada, primero habria que ordenar o usar otra estructura.',
        'Elegir estructura depende de las operaciones frecuentes. Si se accede mucho por indice, array. Si se inserta al inicio, lista. Si se procesa por turnos, cola. Si se necesita ultimo pendiente primero, pila. Si se necesita busqueda rapida por clave, mapa/hash.',
      ],
      visuals: [
        {
          type: 'flow',
          title: 'Busqueda binaria',
          steps: ['Verificar que esta ordenado', 'Tomar inicio, fin y medio', 'Comparar objetivo con medio', 'Descartar mitad izquierda o derecha', 'Repetir hasta encontrar o agotar rango'],
        },
        {
          type: 'compare',
          title: 'Elegir estructura de datos',
          columns: ['Necesidad', 'Estructura sugerida', 'Motivo'],
          rows: [
            ['Acceso por posicion', 'Array / ArrayList', 'Indice O(1)'],
            ['Inserciones frecuentes al inicio', 'Lista enlazada', 'No desplaza elementos'],
            ['Turnos por llegada', 'Cola', 'FIFO'],
            ['Deshacer o recursion', 'Pila', 'LIFO'],
            ['Buscar por clave', 'HashMap / diccionario', 'Promedio O(1)'],
            ['Orden y rangos', 'Arbol balanceado', 'Busqueda O(log n) y orden'],
          ],
        },
      ],
    },
    {
      title: 'Implementaciones y respuestas EFIP',
      paragraphs: [
        'En Java, una pila puede implementarse con arreglo y un indice tope. Push incrementa y guarda; pop devuelve y decrementa; peek consulta sin quitar. Hay que controlar overflow si el arreglo esta lleno y underflow si esta vacio.',
        'Una cola circular con array usa frente, fin y cantidad. Al avanzar indices se aplica modulo capacidad para reutilizar espacios. Es un ejercicio clasico porque muestra estructura, invariantes y manejo de limites.',
        'Para responder oralmente, conviene seguir esta secuencia: definir la estructura, decir regla de acceso, nombrar operaciones y complejidades, dar un uso real y justificar por que no elegirias otra estructura.',
      ],
      visuals: [
        {
          type: 'formulaGrid',
          title: 'Cola circular',
          items: [
            { label: 'Avanzar frente', formula: 'front = (front + 1) % capacidad', example: 'Si front=4 y capacidad=5, vuelve a 0' },
            { label: 'Avanzar fin', formula: 'rear = (rear + 1) % capacidad', example: 'Inserta reutilizando huecos' },
            { label: 'Vacia', formula: 'size == 0', example: 'No se puede dequeue' },
            { label: 'Llena', formula: 'size == capacidad', example: 'No se puede enqueue sin ampliar' },
          ],
        },
        {
          type: 'cards',
          title: 'Practica rapida',
          items: [
            { label: 'Doble bucle completo', text: 'Si ambos recorren n, normalmente O(n^2).' },
            { label: 'Bucle con i *= 2', text: 'Cantidad de iteraciones log2(n).' },
            { label: 'QuickSort peor caso', text: 'Pivotes malos y particiones desbalanceadas.' },
            { label: 'Lista circular', text: 'Util cuando el recorrido vuelve al inicio, como turnos rotativos.' },
          ],
        },
      ],
    },
  ],
};

export const PROGRAMMING_THEORY_MODULE: TheoryModule = {
  topic: 'paradigmas_lenguajes',
  title: 'Paradigmas, POO y Java',
  sections: [
    {
      title: 'Programacion desde cero en Java',
      paragraphs: [
        'Programar es expresar soluciones con instrucciones precisas. En Java, una variable guarda un valor tipado; un operador transforma o compara valores; una estructura de control decide o repite; una funcion o metodo encapsula comportamiento reutilizable.',
        'Java es tipado estatico: el tipo se conoce en compilacion. Eso ayuda a detectar errores antes de ejecutar. Tambien es orientado a objetos, robusto, seguro, multihilo y multiplataforma mediante JVM.',
      ],
      visuals: [
        {
          type: 'compare',
          title: 'Tipos de datos Java',
          columns: ['Tipo', 'Tamano', 'Uso', 'Ejemplo'],
          rows: [
            ['byte', '8 bits', 'Enteros pequenos', 'byte b = 100'],
            ['short', '16 bits', 'Enteros chicos', 'short s = 500'],
            ['int', '32 bits', 'Enteros comunes', 'int edad = 25'],
            ['long', '64 bits', 'Enteros grandes', 'long id = 100L'],
            ['float', '32 bits', 'Decimal simple', 'float f = 3.14f'],
            ['double', '64 bits', 'Decimal doble', 'double pi = 3.14159'],
            ['char', '16 bits', 'Caracter Unicode', "char c = 'A'"],
            ['boolean', 'JVM-dependent', 'Verdadero/falso', 'boolean ok = true'],
            ['String', 'Referencia', 'Texto', 'String n = "Ana"'],
          ],
        },
        {
          type: 'compare',
          title: 'Operadores',
          columns: ['Tipo', 'Operadores', 'Uso'],
          rows: [
            ['Aritmeticos', '+ - * / %', 'Calculos'],
            ['Relacionales', '== != > < >= <=', 'Comparaciones'],
            ['Logicos', '&& || !', 'Combinar condiciones'],
            ['Asignacion', '= += -= *= /=', 'Guardar o modificar'],
            ['Ternario', 'cond ? a : b', 'Decision compacta'],
            ['Bits', '& | ^ ~ << >> >>>', 'Operaciones binarias'],
          ],
        },
        {
          type: 'flow',
          title: 'De codigo fuente a ejecucion',
          steps: ['Archivo .java', 'Compilador javac', 'Bytecode .class', 'JVM de cada plataforma', 'Ejecucion'],
        },
      ],
    },
    {
      title: 'Control de flujo y metodos',
      paragraphs: [
        'Las estructuras condicionales permiten tomar decisiones: if/else para condiciones booleanas y switch para multiples casos discretos. Los bucles permiten repetir: while cuando se repite mientras se cumpla una condicion, do-while cuando debe ejecutarse al menos una vez, for cuando hay patron de iteracion y for-each para recorrer colecciones.',
        'Un metodo agrupa comportamiento con nombre, parametros y valor de retorno. Reduce duplicacion, mejora legibilidad y permite probar partes del programa. En EFIP, explicar un algoritmo en Java implica hablar de datos, control de flujo y responsabilidades.',
      ],
      visuals: [
        {
          type: 'compare',
          title: 'Bucles en Java',
          columns: ['Bucle', 'Cuando usarlo', 'Ejemplo tipico'],
          rows: [
            ['while', 'No se sabe cuantas repeticiones', 'Pedir password hasta validar'],
            ['do-while', 'Debe ejecutarse al menos una vez', 'Menu interactivo'],
            ['for', 'Cantidad o patron conocido', 'Recorrer indices'],
            ['for-each', 'Recorrer coleccion completa', 'Lista de alumnos'],
          ],
        },
        {
          type: 'flow',
          title: 'Condicional',
          steps: ['Evaluar condicion', 'Si es verdadera ejecutar bloque if', 'Si es falsa ejecutar else', 'Continuar flujo comun'],
        },
      ],
    },
    {
      title: 'POO: clase, objeto y cuatro pilares',
      paragraphs: [
        'La programacion orientada a objetos modela el sistema mediante objetos que tienen estado y comportamiento. Una clase es el molde; un objeto es una instancia concreta. Los atributos representan estado y los metodos representan acciones.',
        'Los cuatro pilares son encapsulamiento, abstraccion, herencia y polimorfismo. Encapsular protege datos y expone operaciones controladas. Abstraer muestra lo esencial y oculta detalles. Heredar reutiliza y especializa. Polimorfismo permite tratar objetos distintos mediante una misma interfaz o supertipo.',
      ],
      visuals: [
        {
          type: 'cards',
          title: 'Cuatro pilares de POO',
          items: [
            { label: 'Encapsulamiento', text: 'Atributos privados y metodos publicos para controlar acceso.' },
            { label: 'Abstraccion', text: 'Modelo esencial sin exponer detalles innecesarios.' },
            { label: 'Herencia', text: 'Una clase especializa otra y reutiliza comportamiento.' },
            { label: 'Polimorfismo', text: 'La misma operacion se resuelve segun el objeto real.' },
          ],
        },
        {
          type: 'compare',
          title: 'Clase, objeto y miembros',
          columns: ['Elemento', 'Significado', 'Ejemplo'],
          rows: [
            ['Clase', 'Molde o tipo', 'class Auto'],
            ['Objeto', 'Instancia concreta', 'new Auto()'],
            ['Atributo', 'Estado', 'velocidad, marca'],
            ['Metodo', 'Comportamiento', 'acelerar()'],
            ['Constructor', 'Inicializacion', 'Auto(String marca)'],
          ],
        },
      ],
    },
    {
      title: 'Modificadores, this, super, sobrecarga y sobrescritura',
      paragraphs: [
        'Los modificadores de acceso controlan visibilidad. public permite acceso general, private restringe a la clase, protected permite clase, paquete y subclases, y el acceso default queda dentro del paquete.',
        'this referencia el objeto actual. super referencia la superclase, util para invocar constructores o metodos heredados. La sobrecarga consiste en varios metodos con el mismo nombre pero distinta firma. La sobrescritura redefine en una subclase un metodo heredado compatible.',
      ],
      visuals: [
        {
          type: 'compare',
          title: 'Modificadores de acceso',
          columns: ['Modificador', 'Misma clase', 'Paquete', 'Subclase', 'Exterior'],
          rows: [
            ['public', 'Si', 'Si', 'Si', 'Si'],
            ['protected', 'Si', 'Si', 'Si', 'No directo fuera'],
            ['default', 'Si', 'Si', 'No si otro paquete', 'No'],
            ['private', 'Si', 'No', 'No', 'No'],
          ],
        },
        {
          type: 'compare',
          title: 'Sobrecarga vs sobrescritura',
          columns: ['Concepto', 'Donde ocurre', 'Regla', 'Ejemplo'],
          rows: [
            ['Sobrecarga', 'Misma clase o herencia', 'Mismo nombre, parametros distintos', 'sumar(int,int) y sumar(double,double)'],
            ['Sobrescritura', 'Subclase', 'Misma firma compatible', 'toString() redefinido'],
            ['this', 'Objeto actual', 'Accede a miembros propios', 'this.nombre = nombre'],
            ['super', 'Superclase', 'Invoca constructor o metodo padre', 'super.mover()'],
          ],
        },
      ],
    },
    {
      title: 'Abstractas, interfaces y polimorfismo aplicado',
      paragraphs: [
        'Una clase abstracta no se instancia directamente y puede contener estado, constructores, metodos concretos y abstractos. Sirve cuando hay una base comun fuerte. Una interfaz define un contrato de comportamiento; una clase puede implementar varias interfaces.',
        'En Java moderno, las interfaces pueden tener metodos default y static, pero su sentido principal sigue siendo contrato. Si queres modelar "es un tipo de", pensas en herencia o clase abstracta. Si queres modelar "puede hacer", pensas en interfaz.',
      ],
      visuals: [
        {
          type: 'compare',
          title: 'Clase abstracta vs interface',
          columns: ['Criterio', 'Clase abstracta', 'Interface'],
          rows: [
            ['Estado', 'Puede tener atributos de instancia', 'Constantes y contrato principalmente'],
            ['Constructores', 'Si', 'No constructores de instancia'],
            ['Herencia multiple', 'No, una superclase', 'Si, multiples interfaces'],
            ['Uso', 'Base comun con comportamiento', 'Capacidad o contrato'],
            ['Ejemplo', 'Figura', 'Dibujable, Comparable'],
          ],
        },
        {
          type: 'flow',
          title: 'Polimorfismo con transporte',
          steps: ['Definir supertipo Transporte', 'Auto, Moto y Bicicleta sobrescriben mover()', 'Guardar objetos en List<Transporte>', 'Recorrer lista e invocar mover()', 'Java ejecuta la version real del objeto'],
        },
      ],
    },
    {
      title: 'Excepciones, archivos, String y serializacion',
      paragraphs: [
        'Una excepcion representa una situacion anormal durante la ejecucion. Java distingue excepciones checked, que deben declararse o capturarse, y unchecked, que derivan de RuntimeException. try-catch-finally permite manejar errores y liberar recursos.',
        'try-with-resources cierra automaticamente recursos como archivos o conexiones. Es preferible para evitar fugas. String es inmutable: operaciones como concat devuelven nuevos objetos; para muchas modificaciones conviene StringBuilder.',
        'La serializacion convierte objetos en una representacion persistente o transmisible. Debe usarse con cuidado por seguridad, compatibilidad y versionado.',
      ],
      visuals: [
        {
          type: 'stack',
          title: 'Jerarquia de excepciones',
          items: [
            { label: 'Throwable', detail: 'Raiz de errores y excepciones.' },
            { label: 'Exception', detail: 'Situaciones manejables por programa.' },
            { label: 'RuntimeException', detail: 'Unchecked: null, indice fuera de rango, conversion invalida.' },
            { label: 'IOException', detail: 'Checked: problemas de archivos, red o entrada/salida.' },
            { label: 'Error', detail: 'Problemas graves de la JVM, no suelen capturarse.' },
          ],
        },
        {
          type: 'compare',
          title: 'Recursos y texto',
          columns: ['Tema', 'Regla', 'Ejemplo'],
          rows: [
            ['try-catch', 'Captura y maneja excepciones', 'catch(IOException e)'],
            ['finally', 'Se ejecuta haya error o no', 'Cerrar recurso manual'],
            ['try-with-resources', 'Cierra automaticamente', 'try(BufferedReader br = ...)'],
            ['String', 'Inmutable', 'concat crea nuevo texto'],
            ['StringBuilder', 'Mutable', 'Construir texto en bucles'],
          ],
        },
      ],
    },
    {
      title: 'Collections, JDBC, MVC y MVP',
      paragraphs: [
        'Collections ofrece estructuras listas para usar. ArrayList permite acceso por indice y crecimiento dinamico; LinkedList facilita inserciones en extremos; HashMap asocia claves y valores; Set evita duplicados.',
        'JDBC permite conectar Java con bases de datos. Para consultas seguras se usa PreparedStatement, que separa SQL de parametros y reduce riesgo de inyeccion. Siempre hay que cerrar Connection, Statement y ResultSet o usar try-with-resources.',
        'MVC separa modelo, vista y controlador. El modelo contiene datos y reglas; la vista presenta; el controlador recibe eventos y coordina. MVP es similar, pero el presenter contiene mas logica de presentacion y la vista suele ser mas pasiva.',
      ],
      visuals: [
        {
          type: 'compare',
          title: 'Collections clave',
          columns: ['Coleccion', 'Fortaleza', 'Uso'],
          rows: [
            ['ArrayList', 'Acceso por indice rapido', 'Listas dinamicas comunes'],
            ['LinkedList', 'Inserciones en extremos', 'Colas o listas con nodos'],
            ['HashMap', 'Busqueda por clave promedio O(1)', 'Diccionarios'],
            ['HashSet', 'Evita duplicados', 'Conjuntos'],
            ['Queue', 'FIFO', 'Turnos y buffers'],
          ],
        },
        {
          type: 'flow',
          title: 'JDBC seguro',
          steps: ['Abrir Connection', 'Crear PreparedStatement', 'Setear parametros', 'Ejecutar query/update', 'Procesar ResultSet', 'Cerrar recursos automaticamente'],
        },
        {
          type: 'compare',
          title: 'MVC vs MVP',
          columns: ['Capa', 'MVC', 'MVP'],
          rows: [
            ['Vista', 'Puede observar modelo y enviar eventos', 'Mas pasiva'],
            ['Controlador/Presenter', 'Coordina entrada', 'Contiene logica de presentacion'],
            ['Modelo', 'Datos y reglas', 'Datos y reglas'],
            ['Ventaja', 'Separacion clasica', 'Testeo mas directo de presenter'],
          ],
        },
      ],
    },
  ],
};

export const ANALYSIS_DESIGN_THEORY_MODULE: TheoryModule = {
  topic: 'analisis_diseno',
  title: 'Analisis y Diseno UML',
  sections: [
    {
      title: 'UML y lectura profesional de modelos',
      paragraphs: [
        'UML es un lenguaje de modelado visual para representar sistemas. No reemplaza al analisis: lo ordena. Permite comunicar estructura, comportamiento, despliegue y responsabilidades antes de programar.',
        'En EFIP suelen aparecer casos de uso, clases, secuencia y despliegue. Cada diagrama responde una pregunta distinta: que hace el sistema para actores externos, que clases lo componen, como colaboran en el tiempo y donde se ejecuta fisicamente.',
      ],
      visuals: [
        {
          type: 'cards',
          title: 'Familias UML',
          items: [
            { label: 'Estructura', text: 'Clases, componentes y despliegue: muestran partes estaticas.' },
            { label: 'Comportamiento', text: 'Casos de uso, actividad y estados: muestran funcionalidades y flujo.' },
            { label: 'Interaccion', text: 'Secuencia y comunicacion: muestran mensajes entre objetos.' },
            { label: 'Implementacion', text: 'Nodos, artefactos y protocolos: muestran instalacion real.' },
          ],
        },
        {
          type: 'compare',
          title: 'Que diagrama usar',
          columns: ['Pregunta', 'Diagrama', 'Respuesta'],
          rows: [
            ['Que funcionalidades ve un actor?', 'Casos de uso', 'Objetivos externos del sistema'],
            ['Que entidades y relaciones hay?', 'Clases', 'Estructura y responsabilidades'],
            ['Como ocurre una operacion?', 'Secuencia', 'Mensajes en orden temporal'],
            ['Donde corre el sistema?', 'Despliegue', 'Nodos, artefactos y conexiones'],
          ],
        },
      ],
    },
    {
      title: 'Casos de uso',
      paragraphs: [
        'Un caso de uso representa una funcionalidad observable desde el punto de vista de un actor externo. El actor no siempre es una persona: puede ser otro sistema, un servicio de pago o un administrador.',
        'include se usa cuando un comportamiento es obligatorio y reutilizable. extend se usa cuando un comportamiento es opcional o condicional. La generalizacion representa especializacion entre actores o casos.',
        'Para responder, no conviertas cada boton en caso de uso. Un caso de uso debe representar un objetivo con valor para el actor, como Comprar producto, Registrar usuario, Descargar archivo o Aprobar solicitud.',
      ],
      visuals: [
        {
          type: 'compare',
          title: 'Elementos de casos de uso',
          columns: ['Elemento', 'Significado', 'Ejemplo'],
          rows: [
            ['Actor', 'Rol externo que interactua', 'Visitante, Usuario, Administrador'],
            ['Caso de uso', 'Objetivo del actor', 'Subir mod'],
            ['Asociacion', 'Actor participa', 'Usuario -> Descargar mod'],
            ['include', 'Comportamiento obligatorio', 'Comprar incluye autenticar pago'],
            ['extend', 'Comportamiento opcional', 'Reportar extiende comentar'],
            ['Generalizacion', 'Especializacion', 'Admin es Usuario'],
          ],
        },
        {
          type: 'flow',
          title: 'Caso plataforma de mods',
          steps: ['Visitante se registra o descarga', 'Usuario inicia sesion', 'Usuario sube mod', 'Subir mod incluye validar archivo', 'Usuario comenta, califica o reporta', 'Admin aprueba/rechaza y puede banear'],
        },
      ],
    },
    {
      title: 'Diagrama de clases',
      paragraphs: [
        'Un diagrama de clases muestra clases, atributos, metodos y relaciones. Sirve para pasar del analisis al diseno: identifica responsabilidades, asociaciones y multiplicidades.',
        'Las relaciones principales son asociacion, agregacion, composicion, herencia, realizacion y dependencia. La multiplicidad indica cuantos objetos pueden participar: 1, 0..1, *, 1..*, etc.',
        'Composicion implica vida dependiente: si se destruye el todo, se destruyen las partes. Agregacion es una relacion todo-parte mas debil: la parte puede existir por separado.',
      ],
      visuals: [
        {
          type: 'compare',
          title: 'Relaciones UML de clases',
          columns: ['Relacion', 'Notacion conceptual', 'Significado', 'Ejemplo'],
          rows: [
            ['Asociacion', 'Linea continua', 'Relacion generica', 'Usuario publica Mod'],
            ['Agregacion', 'Rombo vacio', 'Parte existe sin el todo', 'Equipo contiene Integrantes'],
            ['Composicion', 'Rombo lleno', 'Parte depende del todo', 'Pedido contiene DetallePedido'],
            ['Herencia', 'Flecha triangulo', 'Especializacion', 'Admin hereda Usuario'],
            ['Realizacion', 'Clase implementa interfaz', 'Contrato', 'Repositorio implementa Crud'],
            ['Dependencia', 'Uso temporal', 'Una clase usa otra', 'Servicio usa EmailSender'],
          ],
        },
        {
          type: 'compare',
          title: 'Multiplicidades',
          columns: ['Notacion', 'Significado', 'Ejemplo'],
          rows: [
            ['1', 'Exactamente uno', 'Pedido pertenece a un cliente'],
            ['0..1', 'Opcional', 'Usuario puede tener perfil'],
            ['*', 'Cero o muchos', 'Categoria tiene muchos productos'],
            ['1..*', 'Uno o muchos', 'Pedido tiene al menos un detalle'],
            ['m..n', 'Rango', 'Curso admite 5..30 alumnos'],
          ],
        },
        {
          type: 'flow',
          title: 'Modelo repositorio de modelos 3D',
          steps: ['Usuario sube Modelo3D', 'Modelo pertenece a Categoria', 'Modelo tiene Archivo y Versiones', 'Usuario comenta y califica', 'Administrador modera reportes', 'Sistema registra auditoria'],
        },
      ],
    },
    {
      title: 'Diagrama de secuencia',
      paragraphs: [
        'Un diagrama de secuencia muestra objetos o participantes y los mensajes que intercambian en orden temporal. Es ideal para explicar una operacion concreta: login, compra, subir archivo, validar pago o registrar prestamo.',
        'Las lineas de vida representan participantes. Las cajas de activacion muestran cuando un participante esta ejecutando una operacion. Los mensajes pueden ser sincronicos, asincronicos, retornos o creaciones.',
        'Una buena secuencia evita mezclar demasiados escenarios. Si queres mostrar error y exito, usa fragmentos alt/opt o separa diagramas.',
      ],
      visuals: [
        {
          type: 'flow',
          title: 'Secuencia: subir mod',
          steps: ['Usuario envia archivo y metadatos', 'Controlador valida datos basicos', 'Servicio verifica extension, tamano y permisos', 'Repositorio guarda metadatos', 'Storage guarda archivo', 'Sistema notifica resultado'],
        },
        {
          type: 'compare',
          title: 'Elementos de secuencia',
          columns: ['Elemento', 'Uso', 'Ejemplo'],
          rows: [
            ['Lifeline', 'Participante en el tiempo', 'Usuario, UI, Servicio'],
            ['Mensaje sincronico', 'Llamada que espera respuesta', 'validarArchivo()'],
            ['Mensaje asincronico', 'No bloquea esperando', 'enviarNotificacion()'],
            ['Retorno', 'Respuesta de una llamada', 'ok / error'],
            ['alt', 'Alternativas', 'Archivo valido o invalido'],
            ['opt', 'Paso opcional', 'Enviar mail si corresponde'],
          ],
        },
      ],
    },
    {
      title: 'Diagrama de despliegue',
      paragraphs: [
        'El diagrama de despliegue muestra nodos fisicos o virtuales, artefactos de software y conexiones. Sirve para explicar donde vive cada parte: cliente, servidor web, servidor de aplicacion, base de datos, almacenamiento, firewall, nube o red interna.',
        'En un e-commerce profesional, el navegador o app consume HTTPS hacia un balanceador o servidor web. La aplicacion se comunica con la base de datos en una red protegida. Los archivos pueden ir a storage y los backups a otro destino. La administracion deberia usar VPN o canales restringidos.',
      ],
      visuals: [
        {
          type: 'flow',
          title: 'Despliegue e-commerce',
          steps: ['Cliente web/app', 'Internet por HTTPS', 'Firewall o balanceador', 'Servidor web/aplicacion', 'Base de datos en red interna', 'Storage de imagenes', 'Backups y monitoreo'],
        },
        {
          type: 'compare',
          title: 'Elementos de despliegue',
          columns: ['Elemento', 'Representa', 'Ejemplo'],
          rows: [
            ['Nodo', 'Recurso fisico o virtual', 'Servidor, VM, contenedor'],
            ['Artefacto', 'Software desplegado', 'app.jar, frontend build'],
            ['Conexion', 'Canal de comunicacion', 'HTTPS, JDBC, VPN'],
            ['Dispositivo', 'Infraestructura', 'Firewall, router, balanceador'],
            ['BD', 'Persistencia', 'PostgreSQL, MySQL'],
          ],
        },
      ],
    },
    {
      title: 'Como responder UML en EFIP',
      paragraphs: [
        'Para casos de uso, identifica actores externos y objetivos con valor. Para clases, deriva entidades, atributos, metodos y relaciones desde el dominio. Para secuencia, elige un caso de uso y muestra mensajes ordenados. Para despliegue, ubica componentes reales y justifica seguridad.',
        'El error comun es dibujar sin criterio: clases sin responsabilidades, casos de uso como botones, secuencias sin orden temporal o bases de datos expuestas a Internet. La respuesta fuerte explica decisiones y restricciones.',
      ],
      visuals: [
        {
          type: 'cards',
          title: 'Checklist UML',
          items: [
            { label: 'Casos de uso', text: 'Actor externo + objetivo visible + include/extend solo cuando corresponde.' },
            { label: 'Clases', text: 'Atributos, metodos, relaciones y multiplicidades coherentes.' },
            { label: 'Secuencia', text: 'Un escenario concreto, mensajes en orden y alternativas claras.' },
            { label: 'Despliegue', text: 'Nodos reales, conexiones, seguridad, BD protegida y backups.' },
          ],
        },
        {
          type: 'compare',
          title: 'Errores frecuentes',
          columns: ['Error', 'Por que esta mal', 'Correccion'],
          rows: [
            ['Caso de uso "click en boton"', 'No expresa objetivo del actor', 'Usar "Registrar pedido"'],
            ['N:M sin clase/tabla intermedia', 'Falta relacion con atributos', 'Crear entidad asociativa'],
            ['Secuencia generica', 'No muestra flujo temporal real', 'Elegir escenario puntual'],
            ['BD publica', 'Riesgo de seguridad', 'Ubicarla en red interna'],
          ],
        },
      ],
    },
  ],
};

export const EXPANDED_THEORY_MODULES = {
  sistemas_operativos: OPERATING_SYSTEMS_THEORY_MODULE,
  redes_comunicaciones: NETWORKS_THEORY_MODULE,
  base_de_datos: DATABASES_THEORY_MODULE,
  algoritmos_estructuras: ALGORITHMS_THEORY_MODULE,
  paradigmas_lenguajes: PROGRAMMING_THEORY_MODULE,
  analisis_diseno: ANALYSIS_DESIGN_THEORY_MODULE,
} satisfies Partial<Record<TheoryModule['topic'], TheoryModule>>;
