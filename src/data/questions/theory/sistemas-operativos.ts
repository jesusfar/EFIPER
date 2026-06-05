import { mc, ms, tf, withTopic } from '../builder';

// Banco TEÓRICO (a mano) — Sistemas Operativos.
// Preguntas de razonamiento ancladas en las notas: planificación, concurrencia,
// memoria (paginación/segmentación/swapping/reemplazo), procesos e hilos.
export const sistemasOperativosTheory = withTopic('sistemas_operativos', [
  mc('so-t-001', 'Procesos e hilos', 3,
    '¿Cuál es la diferencia fundamental entre un proceso y un hilo (thread)?',
    [
      'Los hilos de un mismo proceso comparten el espacio de memoria (código, datos, heap); cada proceso tiene un espacio aislado',
      'Los procesos comparten memoria entre sí y los hilos no',
      'Un proceso no puede contener más de un hilo',
      'Los hilos son más pesados de crear que los procesos',
    ], 0,
    'Los hilos comparten la memoria del proceso, por eso son más livianos y se comunican fácil (pero requieren sincronización). Cada proceso, en cambio, tiene su propio espacio de direcciones aislado.'),

  tf('so-t-002', 'Procesos e hilos', 2,
    'Como los hilos de un proceso comparten memoria, comunicarse entre ellos es más liviano que entre procesos, pero requiere sincronización para evitar condiciones de carrera.',
    true,
    'Verdadero. Compartir memoria facilita la comunicación, pero el acceso concurrente al mismo dato exige sincronización (semáforos, mutex) para no corromperlo.'),

  mc('so-t-003', 'Planificación', 3,
    '¿Cuál afirmación sobre la planificación FIFO (First In First Out) es correcta?',
    [
      'Es no apropiativa y puede hacer que procesos cortos esperen detrás de uno largo (efecto convoy)',
      'Ejecuta primero el proceso de menor ráfaga de CPU',
      'Es ideal para sistemas interactivos de tiempo compartido',
      'Expulsa al proceso en ejecución cuando llega otro más corto',
    ], 0,
    'FIFO atiende por orden de llegada y es no apropiativa: un proceso largo bloquea a los que llegaron después (efecto convoy). Por eso no sirve para entornos interactivos.'),

  mc('so-t-004', 'Planificación', 3,
    'Sobre el tamaño del quantum en Round Robin, ¿cuál afirmación es correcta?',
    [
      'Si el quantum es muy grande, RR tiende a comportarse como FIFO; si es muy chico, domina el overhead de los cambios de contexto',
      'Cuanto más chico sea el quantum, mejor es siempre el rendimiento',
      'El tamaño del quantum no afecta el rendimiento del sistema',
      'Un quantum grande elimina por completo los cambios de contexto',
    ], 0,
    'Un quantum grande hace que los procesos terminen antes de agotarlo (se parece a FIFO); uno muy chico gasta demasiado tiempo en cambios de contexto. Hay que equilibrar.'),

  tf('so-t-005', 'Planificación', 2,
    'Round Robin es un algoritmo apropiativo (expropiativo): si un proceso agota su quantum sin terminar, se lo expulsa y pasa al final de la cola de listos.',
    true,
    'Verdadero. Una interrupción de reloj marca el fin del quantum; el dispatcher expropia el proceso y lo reencola, repartiendo la CPU de forma equitativa.'),

  ms('so-t-006', 'Planificación', 3,
    'Seleccioná TODAS las afirmaciones correctas sobre los algoritmos de planificación:',
    [
      'FIFO es no apropiativo: un proceso largo puede hacer esperar a los cortos',
      'Round Robin reparte la CPU por quantum y es apropiativo',
      'SJF minimiza el tiempo de espera/finalización promedio',
      'SRTF es la variante apropiativa de SJF',
      'FIFO es apropiativo y expulsa procesos al vencer un quantum',
      'Round Robin siempre ejecuta primero el proceso más corto',
    ], [0, 1, 2, 3],
    'FIFO=no apropiativo; RR=apropiativo por quantum; SJF minimiza la espera promedio; SRTF=SJF apropiativo. Las dos últimas confunden FIFO con RR y RR con SJF.'),

  mc('so-t-007', 'Planificación', 3,
    'El algoritmo SJF (Shortest Job First) se caracteriza por…',
    [
      'Elegir la ráfaga de menor duración, lo que minimiza el tiempo de espera promedio',
      'Repartir la CPU entre todos los procesos por turnos (quantum)',
      'Ejecutar primero el proceso que más tiempo lleva esperando',
      'Ser apropiativo por naturaleza',
    ], 0,
    'SJF selecciona la ráfaga más corta disponible; eso minimiza el tiempo de espera promedio. Es no apropiativo (su versión apropiativa es SRTF) y se usa en entornos batch.'),

  mc('so-t-008', 'Planificación', 3,
    '¿Cuál es el principal problema de SJF?',
    [
      'La inanición (starvation) de los procesos largos si llegan continuamente procesos cortos',
      'Que maximiza el tiempo de espera promedio',
      'Que es imposible de implementar en entornos batch',
      'Que no funciona sin una interrupción de reloj',
    ], 0,
    'Al priorizar siempre lo más corto, un proceso largo puede no ejecutarse nunca si no dejan de llegar cortos: sufre inanición. Además, requiere estimar la duración de las ráfagas.'),

  mc('so-t-009', 'Planificación', 3,
    '¿En qué se diferencia SRTF de SJF?',
    [
      'SRTF es apropiativo: si llega un proceso con menor tiempo restante que el actual, lo expropia',
      'SRTF es no apropiativo y SJF es apropiativo',
      'SRTF ejecuta primero la ráfaga de mayor duración',
      'Son idénticos en su comportamiento',
    ], 0,
    'SRTF (Shortest Remaining Time First) es la versión apropiativa de SJF: ante un nuevo proceso más corto que lo que resta del actual, lo expulsa para ejecutar el más corto.'),

  mc('so-t-010', 'Planificación', 3,
    'En HRN (Highest Response Ratio Next), la prioridad de un proceso se calcula como…',
    [
      '(tiempo de espera + tiempo de servicio) / tiempo de servicio',
      'tiempo de servicio / tiempo de espera',
      'tiempo de espera × tiempo de servicio',
      '1 / tiempo de servicio',
    ], 0,
    'HRN usa prioridad = (espera + servicio) / servicio. El servicio en el denominador favorece a los cortos; la espera en el numerador rescata a los largos que esperaron mucho.'),

  tf('so-t-011', 'Planificación', 3,
    'HRN corrige el favoritismo de SJF: como el tiempo de espera está en el numerador, los procesos largos que esperaron mucho también ganan prioridad.',
    true,
    'Verdadero. HRN evita la inanición de SJF: a mayor espera, mayor prioridad, equilibrando el trato entre procesos cortos y largos.'),

  mc('so-t-012', 'Concurrencia', 3,
    'Un interbloqueo (deadlock) es una situación en la que…',
    [
      'Dos o más procesos se bloquean mutuamente, cada uno esperando un recurso que el otro retiene',
      'Un proceso consume el 100% de la CPU indefinidamente',
      'El sistema operativo se queda sin memoria física',
      'Un proceso nunca se ejecuta por tener siempre baja prioridad',
    ], 0,
    'En el deadlock hay espera circular: P1 espera un recurso que tiene P2 y viceversa, y ninguno avanza. Que un proceso nunca se ejecute por prioridad es inanición, no deadlock.'),

  ms('so-t-013', 'Concurrencia', 3,
    'Seleccioná TODAS las condiciones necesarias para que ocurra un interbloqueo (condiciones de Coffman):',
    [
      'Exclusión mutua',
      'Retención y espera (hold and wait)',
      'No apropiación de los recursos',
      'Espera circular',
      'Expropiación de recursos por parte del SO',
      'Reparto equitativo de la CPU mediante quantum',
    ], [0, 1, 2, 3],
    'Las cuatro condiciones de Coffman son exclusión mutua, retención y espera, NO apropiación y espera circular. Permitir la expropiación justamente ROMPE el deadlock; el quantum no tiene relación.'),

  mc('so-t-014', 'Concurrencia', 3,
    'Un semáforo se utiliza para…',
    [
      'Sincronizar el acceso a recursos compartidos mediante operaciones wait (P) y signal (V)',
      'Acelerar el acceso de lectura al disco',
      'Planificar la CPU según la prioridad de cada proceso',
      'Traducir direcciones virtuales a físicas',
    ], 0,
    'El semáforo es un mecanismo de sincronización: wait/P decrementa (y bloquea si no hay recurso) y signal/V incrementa (y libera). Protege la sección crítica.'),

  tf('so-t-015', 'Concurrencia', 3,
    'Una condición de carrera (race condition) ocurre cuando el resultado depende del orden de ejecución de procesos/hilos que acceden a un recurso compartido sin la debida sincronización.',
    true,
    'Verdadero. Sin sincronizar la sección crítica, el entrelazado de operaciones produce resultados impredecibles según quién llegue primero.'),

  mc('so-t-016', 'Concurrencia', 3,
    'La "sección crítica" de un proceso es…',
    [
      'El fragmento de código donde accede a un recurso compartido y que debe ejecutarse con exclusión mutua',
      'La parte del programa que más tarda en ejecutarse',
      'El código que pertenece al kernel del sistema',
      'La rutina que atiende las interrupciones de hardware',
    ], 0,
    'La sección crítica accede a datos compartidos; para evitar condiciones de carrera, solo un proceso/hilo debe estar dentro a la vez (exclusión mutua).'),

  mc('so-t-017', 'Memoria', 3,
    '¿Cuál es la diferencia entre paginación y segmentación?',
    [
      'La paginación divide la memoria en bloques de tamaño FIJO (páginas); la segmentación en bloques de tamaño VARIABLE (segmentos)',
      'La paginación usa bloques variables y la segmentación bloques fijos',
      'Ambas usan exclusivamente bloques de tamaño fijo',
      'Ninguna de las dos divide la memoria en bloques',
    ], 0,
    'Las páginas son de tamaño fijo e iguales; los segmentos, de tamaño variable según la parte lógica del proceso (código, datos, pila).'),

  tf('so-t-018', 'Memoria', 3,
    'La paginación genera fragmentación INTERNA: la última página de un proceso suele quedar parcialmente usada, desperdiciando el resto del marco.',
    true,
    'Verdadero. Como las páginas son de tamaño fijo, lo que no llena la última página se pierde dentro del marco: eso es fragmentación interna.'),

  mc('so-t-019', 'Memoria', 3,
    'Según las notas, la segmentación, frente a la paginación, …',
    [
      'Reduce la fragmentación interna al usar bloques de tamaño variable ajustados a cada parte del proceso',
      'Aumenta la fragmentación interna respecto de la paginación',
      'Usa páginas de tamaño fijo igual que la paginación',
      'Impide implementar memoria virtual',
    ], 0,
    'Al asignar bloques de tamaño variable (un segmento por parte lógica), la segmentación reduce la fragmentación interna que provoca la paginación de tamaño fijo.'),

  ms('so-t-020', 'Memoria', 3,
    'Seleccioná TODAS las afirmaciones correctas sobre la memoria virtual:',
    [
      'Permite ejecutar procesos más grandes que la memoria física, usando el disco como extensión',
      'Suele implementarse con paginación por demanda',
      'Un fallo de página (page fault) trae desde el disco la página faltante',
      'El thrashing aparece cuando hay demasiados fallos de página',
      'Aumenta la velocidad física de la memoria RAM',
      'Elimina por completo la necesidad de usar el disco',
    ], [0, 1, 2, 3],
    'La memoria virtual usa el disco para simular más RAM (paginación por demanda, page faults, thrashing si hay demasiados). No acelera la RAM física ni elimina el uso del disco (al contrario, lo usa).'),

  mc('so-t-021', 'Memoria', 3,
    'Un "fallo de página" (page fault) ocurre cuando…',
    [
      'El proceso referencia una página que no está en memoria física y el SO debe traerla del disco',
      'Una página tiene un error de paridad en la RAM',
      'Se llena por completo la tabla de páginas',
      'El proceso termina su ejecución de forma normal',
    ], 0,
    'El page fault se dispara al acceder a una página ausente en RAM; el SO la trae del disco (swap-in), operación costosa que, si es muy frecuente, lleva al thrashing.'),

  mc('so-t-022', 'Memoria', 3,
    'Según las notas, el swapping…',
    [
      'Mueve programas entre la memoria principal y el disco (swap-out hacia el disco, swap-in hacia la memoria), gestionado por el swapper',
      'Cifra los programas mientras están en memoria',
      'Reemplaza la CPU por el disco para ejecutar procesos',
      'Es otro nombre para la fragmentación interna',
    ], 0,
    'El swapping intercambia programas entre RAM y disco para controlar la multiprogramación; el swapper administra los swap-out (a disco) y swap-in (a memoria).'),

  tf('so-t-023', 'Memoria', 2,
    'En el swapping, escribir un programa de la memoria al disco se llama swap-out, y traerlo del disco a la memoria, swap-in.',
    true,
    'Verdadero. swap-out = sacar a disco; swap-in = traer a memoria. Es la base del intercambio que permite gestionar más procesos que los que caben en RAM.'),

  mc('so-t-024', 'Memoria', 3,
    'El algoritmo de reemplazo de páginas LRU descarta…',
    [
      'La página que hace más tiempo que no se utiliza (Least Recently Used)',
      'La página utilizada más recientemente',
      'La primera página que se cargó en memoria',
      'Una página elegida completamente al azar',
    ], 0,
    'LRU descarta la página menos recientemente usada, apostando a que lo que no se usó hace rato tampoco se usará pronto. Descartar la primera cargada es FIFO.'),

  mc('so-t-025', 'Memoria', 3,
    '¿Cuál afirmación sobre los algoritmos de reemplazo de páginas es correcta?',
    [
      'El algoritmo óptimo reemplaza la página que tardará más en volver a usarse, pero no es implementable porque requeriría conocer el futuro',
      'FIFO siempre produce menos fallos de página que LRU',
      'LRU reemplaza la página recién cargada en memoria',
      'El algoritmo óptimo se usa en todos los sistemas operativos reales',
    ], 0,
    'El óptimo es una referencia teórica (necesita ver el futuro). FIFO incluso puede empeorar al darle más marcos (anomalía de Belady). LRU descarta la menos usada recientemente, no la recién cargada.'),

  tf('so-t-026', 'Memoria', 3,
    'La hiperpaginación (thrashing) ocurre cuando el sistema pasa más tiempo intercambiando páginas (swap) que ejecutando procesos, y el rendimiento se desploma.',
    true,
    'Verdadero. Con demasiados fallos de página, el SO se la pasa haciendo swap-in/out y casi no avanza el trabajo útil: el rendimiento cae abruptamente.'),

  mc('so-t-027', 'Kernel', 2,
    'El kernel del sistema operativo…',
    [
      'Se ejecuta en modo privilegiado (modo kernel), con acceso total al hardware',
      'Se ejecuta en modo usuario, igual que cualquier aplicación',
      'Es un programa de usuario más, sin privilegios especiales',
      'No puede acceder directamente al hardware',
    ], 0,
    'El kernel corre en modo privilegiado y controla el hardware. Las aplicaciones corren en modo usuario y le piden servicios mediante llamadas al sistema.'),

  mc('so-t-028', 'Kernel', 3,
    'Una llamada al sistema (system call) es…',
    [
      'La interfaz por la que un programa en modo usuario solicita un servicio al kernel',
      'Una función interna y privada de la aplicación',
      'Una interrupción generada por el hardware',
      'Un algoritmo de planificación de la CPU',
    ], 0,
    'La syscall es el punto de entrada controlado al kernel: el programa pide abrir un archivo, crear un proceso, etc., y el kernel lo ejecuta con sus privilegios.'),

  ms('so-t-029', 'Estados', 3,
    'Seleccioná TODAS las transiciones de estado de un proceso que son válidas:',
    [
      'listo → ejecutando: cuando el planificador le asigna la CPU',
      'ejecutando → bloqueado: cuando el proceso solicita una operación de E/S',
      'ejecutando → listo: cuando se agota su quantum y es expropiado',
      'bloqueado → listo: cuando ocurre el evento que estaba esperando',
      'bloqueado → ejecutando: de forma directa, sin pasar por el estado listo',
      'listo → bloqueado: sin haberse ejecutado en ningún momento',
    ], [0, 1, 2, 3],
    'Las cuatro primeras son transiciones válidas. Un proceso bloqueado primero pasa a listo (no salta directo a ejecutando), y desde listo no se va a bloqueado sin antes ejecutarse.'),

  mc('so-t-030', 'Tipos de SO', 2,
    'Un sistema operativo de tiempo real (RTOS) se caracteriza por…',
    [
      'Garantizar tiempos de respuesta dentro de plazos estrictos (deadlines), donde llegar tarde se considera un fallo',
      'Maximizar el throughput de procesamiento por lotes sin interacción del usuario',
      'Priorizar el uso interactivo de muchos usuarios simultáneos',
      'Funcionar sin ningún tipo de planificación de la CPU',
    ], 0,
    'Un RTOS prioriza el cumplimiento de plazos deterministas (control industrial, aviónica). Una respuesta correcta pero tardía es, en este contexto, un fallo.'),

  mc('so-t-031', 'Planificación', 3,
    'Según las notas, la planificación de plazo fijo (deadline) es compleja porque…',
    [
      'Requiere conocer por adelantado las necesidades de recursos y cumplir el plazo sin degradar el servicio a los demás procesos',
      'Ejecuta siempre el proceso de menor ráfaga',
      'No necesita planificar el uso de recursos',
      'Es el algoritmo más simple de implementar',
    ], 0,
    'Cumplir un plazo fijo exige planificar con cuidado los recursos por adelantado (información rara vez disponible) sin perjudicar al resto; por eso es costosa y compleja.'),

  mc('so-t-032', 'Planificación', 3,
    'La planificación "por el comportamiento" busca…',
    [
      'Garantizar a cada usuario cierta prestación (por ejemplo 1/n de la CPU), comparando lo consumido con lo prometido',
      'Ejecutar siempre la ráfaga de mayor duración',
      'Darle toda la CPU al primer proceso que llega hasta que termine',
      'Eliminar la multiprogramación del sistema',
    ], 0,
    'Con n usuarios, se garantiza a cada uno ~1/n del procesador; la prioridad surge del cociente entre lo que consumió y lo que se le prometió consumir.'),

  tf('so-t-033', 'Planificación', 3,
    'En la planificación por comportamiento, si la proporción consumido/prometido es 0,5 el proceso usó la mitad de lo que tenía derecho; si es 2, consumió el doble.',
    true,
    'Verdadero. Ese cociente mide cuánto se desvió del reparto prometido: <1 consumió de menos (más prioridad), >1 consumió de más (menos prioridad).'),

  mc('so-t-034', 'Concurrencia', 3,
    '¿Cuál es la diferencia entre un mutex y un semáforo?',
    [
      'El mutex es un mecanismo de exclusión mutua binario con "dueño" (lock/unlock); el semáforo puede contar varios recursos disponibles',
      'El mutex cuenta múltiples recursos y el semáforo es siempre binario',
      'Son exactamente el mismo mecanismo',
      'El mutex se encarga de planificar la CPU',
    ], 0,
    'El mutex protege un recurso con propiedad (lo libera quien lo tomó). El semáforo contador puede permitir N accesos simultáneos a un conjunto de recursos.'),

  ms('so-t-035', 'Concurrencia', 3,
    'Seleccioná TODOS los que son problemas clásicos de sincronización:',
    [
      'Productor-consumidor (buffer acotado)',
      'Lectores-escritores',
      'La cena de los filósofos',
      'El problema del viajante (TSP)',
      'El ordenamiento de burbuja',
      'El recorrido de un árbol binario',
    ], [0, 1, 2],
    'Productor-consumidor, lectores-escritores y filósofos son problemas clásicos de concurrencia. El viajante es de optimización en grafos, y los otros dos son de algoritmos, no de sincronización.'),

  mc('so-t-036', 'Concurrencia', 3,
    'En el problema productor-consumidor, ¿qué hay que evitar?',
    [
      'Que el productor escriba en un buffer lleno o el consumidor lea de uno vacío, y el acceso concurrente sin sincronizar',
      'Que ambos procesos finalicen su ejecución',
      'Que el buffer tenga un tamaño fijo',
      'Que exista un único productor',
    ], 0,
    'Hay que sincronizar el acceso al buffer compartido y bloquear al productor si está lleno y al consumidor si está vacío, evitando condiciones de carrera.'),

  mc('so-t-037', 'Concurrencia', 3,
    'El problema de la cena de los filósofos ilustra principalmente…',
    [
      'El riesgo de deadlock cuando varios procesos compiten por recursos compartidos (los tenedores)',
      'El funcionamiento de la planificación Round Robin',
      'La fragmentación de la memoria',
      'El algoritmo de reemplazo de páginas',
    ], 0,
    'Si cada filósofo toma un tenedor y espera el otro, se produce espera circular y deadlock. Ilustra la necesidad de prevenir/evitar el interbloqueo.'),

  mc('so-t-038', 'Concurrencia', 3,
    'Para PREVENIR un deadlock se puede…',
    [
      'Negar al menos una de las cuatro condiciones de Coffman (por ejemplo, permitir la expropiación o exigir pedir todos los recursos a la vez)',
      'Aumentar el quantum de la planificación',
      'Usar paginación en lugar de segmentación',
      'Eliminar todos los semáforos del sistema',
    ], 0,
    'Si se rompe alguna de las cuatro condiciones necesarias (exclusión mutua, retención y espera, no apropiación, espera circular), el deadlock no puede ocurrir.'),

  mc('so-t-039', 'Concurrencia', 3,
    'El algoritmo del Banquero sirve para…',
    [
      'Evitar deadlocks: concede un recurso solo si, tras hacerlo, el sistema permanece en un estado seguro',
      'Planificar la CPU según la prioridad',
      'Elegir qué página reemplazar en memoria',
      'Cifrar los archivos del usuario',
    ], 0,
    'El Banquero simula la asignación: solo otorga el recurso si queda una secuencia segura en la que todos los procesos pueden terminar. Si no, espera.'),

  tf('so-t-040', 'Concurrencia', 3,
    'La evitación de deadlock (como el algoritmo del Banquero) decide en tiempo de ejecución si conceder un recurso para no caer en un estado inseguro, a diferencia de la prevención, que elimina alguna condición de antemano.',
    true,
    'Verdadero. Prevención = diseñar el sistema para que una condición nunca se cumpla; evitación = decidir dinámicamente según el estado; detección = permitirlo y luego resolverlo.'),

  ms('so-t-041', 'Sistemas de archivos', 3,
    'Seleccioná TODAS las afirmaciones correctas sobre sistemas de archivos:',
    [
      'NTFS soporta journaling y permisos a nivel de archivo',
      'FAT32 tiene un límite de 4 GB por archivo individual',
      'ext4 es un sistema de archivos típico de Linux',
      'El journaling ayuda a recuperar la consistencia tras un corte de energía',
      'FAT32 admite archivos individuales de cualquier tamaño',
      'NTFS no maneja permisos de acceso a los archivos',
    ], [0, 1, 2, 3],
    'NTFS (journaling y permisos), FAT32 (límite de 4 GB) y ext4 (Linux) son correctas, igual que el rol del journaling. Las dos últimas contradicen esas mismas propiedades.'),

  mc('so-t-042', 'Sistemas de archivos', 3,
    'En los sistemas de archivos tipo UNIX, un inodo (inode) almacena…',
    [
      'Los metadatos del archivo (permisos, dueño, tamaño, punteros a los bloques de datos), pero no su nombre',
      'El contenido completo del archivo',
      'Únicamente el nombre del archivo',
      'La tabla de procesos del sistema',
    ], 0,
    'El inodo guarda metadatos y la ubicación de los bloques; el nombre del archivo vive en la entrada del directorio, que apunta al inodo.'),

  tf('so-t-043', 'Sistemas de archivos', 3,
    'El journaling registra las operaciones en un diario antes de aplicarlas, lo que permite restaurar el sistema de archivos a un estado consistente tras una falla.',
    true,
    'Verdadero. Si se corta la energía a mitad de una operación, el diario permite rehacer o deshacer cambios para no dejar el sistema de archivos corrupto.'),

  mc('so-t-044', 'Almacenamiento', 3,
    '¿Cuál es la diferencia entre RAID 0 y RAID 1?',
    [
      'RAID 0 hace striping (más rendimiento, sin redundancia); RAID 1 hace mirroring (redundancia, tolera el fallo de un disco)',
      'RAID 0 hace mirroring y RAID 1 hace striping',
      'Ambos ofrecen redundancia total de los datos',
      'Ninguno de los dos mejora el rendimiento',
    ], 0,
    'RAID 0 reparte datos en varios discos para velocidad pero sin tolerancia a fallos; RAID 1 duplica (espejo) los datos, soportando la pérdida de un disco.'),

  ms('so-t-045', 'Almacenamiento', 3,
    'Marcá TODAS las afirmaciones correctas sobre RAID:',
    [
      'RAID 0 (striping) mejora el rendimiento pero no aporta redundancia',
      'RAID 1 (mirroring) duplica los datos en dos discos',
      'RAID 5 usa paridad distribuida y tolera el fallo de un disco',
      'RAID 0 tolera el fallo de un disco sin perder datos',
      'RAID 1 no aporta ninguna redundancia',
      'RAID 5 puede funcionar con un solo disco',
    ], [0, 1, 2],
    'RAID 0 = velocidad sin redundancia; RAID 1 = espejo; RAID 5 = paridad distribuida (tolera 1 disco, necesita al menos 3). Las tres últimas contradicen esas definiciones.'),

  mc('so-t-046', 'Kernel', 3,
    '¿Cuál es la diferencia entre un kernel monolítico y un microkernel?',
    [
      'El monolítico ejecuta la mayoría de los servicios en el espacio del kernel; el microkernel deja muchos servicios en espacio de usuario',
      'El microkernel coloca absolutamente todo dentro del kernel',
      'El monolítico no utiliza el modo privilegiado',
      'Son arquitecturas idénticas',
    ], 0,
    'El monolítico integra drivers y servicios en el kernel (rápido pero más acoplado); el microkernel mantiene un núcleo mínimo y mueve servicios a procesos de usuario (modular).'),

  tf('so-t-047', 'Kernel', 3,
    'Un microkernel es más modular y robusto (si un servicio falla no se cae todo el sistema), pero puede tener más overhead por la comunicación entre procesos.',
    true,
    'Verdadero. Aislar servicios en espacio de usuario mejora la robustez, pero cada interacción con el núcleo implica mensajes/IPC, lo que agrega sobrecarga.'),

  mc('so-t-048', 'Multiprogramación', 3,
    '¿Cuál afirmación es correcta?',
    [
      'El multiprocesamiento implica varias CPU/núcleos ejecutando en paralelo; la multiprogramación/multitarea reparten una CPU entre varios procesos',
      'La multiprogramación requiere obligatoriamente varias CPU',
      'El multiprocesamiento funciona con una sola CPU',
      'Multiprogramación y multiprocesamiento son sinónimos exactos',
    ], 0,
    'Multiprogramación/multitarea intercalan procesos sobre una CPU (concurrencia); multiprocesamiento usa varios núcleos para ejecución realmente paralela.'),

  tf('so-t-049', 'Multiprogramación', 3,
    'La concurrencia es gestionar varias tareas que progresan intercaladas (puede ser en una sola CPU); el paralelismo es ejecutarlas realmente a la vez, lo que requiere varios núcleos.',
    true,
    'Verdadero. Concurrencia es una propiedad de diseño (tareas en progreso simultáneo lógico); paralelismo es ejecución física simultánea, que necesita varios núcleos.'),

  mc('so-t-050', 'Procesos e hilos', 3,
    'Un cambio de contexto (context switch) implica…',
    [
      'Guardar el estado (registros, contador de programa) del proceso saliente y cargar el del proceso entrante',
      'Borrar por completo la memoria del proceso saliente',
      'Cambiar el sistema de archivos en uso',
      'Reiniciar la CPU',
    ], 0,
    'El cambio de contexto salva y restaura el estado de los procesos. Es overhead (no hace trabajo útil), por eso un quantum demasiado chico lo vuelve costoso.'),

  mc('so-t-051', 'Procesos e hilos', 3,
    'El Bloque de Control de Proceso (PCB) almacena…',
    [
      'La información del proceso: estado, contador de programa, registros, prioridad y recursos asignados',
      'El código fuente del programa',
      'El contenido de la memoria caché',
      'La tabla de archivos de todo el sistema',
    ], 0,
    'El PCB es la estructura donde el SO guarda todo lo necesario para gestionar y reanudar un proceso tras un cambio de contexto.'),

  ms('so-t-052', 'Concurrencia', 3,
    'Seleccioná TODOS los que son mecanismos de comunicación entre procesos (IPC):',
    [
      'Memoria compartida',
      'Paso de mensajes (message passing)',
      'Tuberías (pipes)',
      'Sockets',
      'El quantum de planificación',
      'El inodo del sistema de archivos',
    ], [0, 1, 2, 3],
    'Memoria compartida, mensajes, pipes y sockets son formas de IPC. El quantum es de planificación y el inodo es del sistema de archivos: no son mecanismos de comunicación entre procesos.'),

  tf('so-t-053', 'Concurrencia', 2,
    'Para que ocurra un deadlock deben cumplirse simultáneamente las cuatro condiciones de Coffman; si se rompe al menos una, no hay interbloqueo.',
    true,
    'Verdadero. Las cuatro condiciones son necesarias en conjunto; las estrategias de prevención se basan justamente en impedir que alguna se cumpla.'),

  mc('so-t-054', 'Concurrencia', 3,
    '¿Cuál es la diferencia entre inanición (starvation) y deadlock?',
    [
      'En el deadlock los procesos se bloquean mutuamente y ninguno avanza; en la inanición un proceso no progresa porque otros tienen siempre prioridad, aunque el sistema sí avanza',
      'Son exactamente el mismo fenómeno',
      'La inanición bloquea por completo todo el sistema',
      'El deadlock siempre se resuelve por sí solo',
    ], 0,
    'En el deadlock nadie del grupo avanza (espera circular). En la inanición el sistema progresa, pero un proceso concreto queda postergado indefinidamente por baja prioridad.'),

  mc('so-t-055', 'E/S', 3,
    'El spooling (por ejemplo, de impresión) consiste en…',
    [
      'Encolar los trabajos en un buffer/disco para que un dispositivo lento los procese a su ritmo, liberando al proceso que los generó',
      'Cifrar los trabajos antes de imprimirlos',
      'Planificar la CPU según prioridad',
      'Reemplazar páginas de memoria',
    ], 0,
    'El spooling desacopla al proceso del dispositivo lento: los trabajos se acumulan en una cola y se procesan cuando el dispositivo puede, sin bloquear al proceso.'),

  tf('so-t-056', 'Memoria', 3,
    'En la paginación por demanda, una página se carga en memoria solo cuando el proceso la referencia, no toda al inicio.',
    true,
    'Verdadero. Se cargan páginas a medida que se necesitan (provocando page faults la primera vez), lo que ahorra memoria al no traer lo que no se usa.'),

  mc('so-t-057', 'Memoria', 3,
    'La TLB (Translation Lookaside Buffer) sirve para…',
    [
      'Acelerar la traducción de direcciones virtuales a físicas, cacheando las entradas más usadas de la tabla de páginas',
      'Planificar los procesos por prioridad',
      'Almacenar el sistema de archivos',
      'Detectar interbloqueos',
    ], 0,
    'La TLB es una caché de traducciones de página: evita consultar la tabla de páginas en memoria en cada acceso, acelerando la traducción de direcciones.'),

  ms('so-t-058', 'Concurrencia', 3,
    'Marcá TODAS las prácticas que ayudan a evitar problemas de concurrencia:',
    [
      'Proteger la sección crítica con exclusión mutua (mutex/semáforo)',
      'Minimizar el tiempo que un hilo permanece dentro de la sección crítica',
      'Adquirir los recursos siempre en el mismo orden para evitar la espera circular',
      'Dejar el recurso compartido sin ninguna protección para ir más rápido',
      'Que cada hilo tome los locks en un orden distinto',
      'Mantener el lock tomado el mayor tiempo posible',
    ], [0, 1, 2],
    'Exclusión mutua, secciones críticas cortas y un orden de adquisición consistente previenen carreras y deadlocks. Las tres falsas son justamente las causas de esos problemas.'),

  mc('so-t-059', 'Concurrencia', 3,
    'Dos hilos toman los locks A y B en orden inverso y se traban mutuamente. ¿Qué cambio elimina el deadlock?',
    [
      'Que ambos hilos adquieran los locks siempre en el mismo orden (rompe la espera circular)',
      'Aumentar la prioridad de uno de los hilos',
      'Asignarle más tiempo de CPU a ambos hilos',
      'Usar páginas de memoria más grandes',
    ], 0,
    'Imponer un orden global de adquisición de locks rompe la condición de espera circular, una de las cuatro de Coffman, y así elimina la posibilidad de ese deadlock.'),

  mc('so-t-060', 'Planificación', 3,
    '¿Cuál es la diferencia entre el planificador (scheduler) y el despachador (dispatcher)?',
    [
      'El scheduler decide QUÉ proceso ejecutar; el dispatcher realiza el cambio de contexto y le entrega físicamente la CPU',
      'El dispatcher decide la política y el scheduler no hace nada',
      'Son exactamente el mismo componente',
      'El scheduler se encarga de administrar la memoria',
    ], 0,
    'El scheduler aplica la política de selección (a quién darle la CPU); el dispatcher ejecuta esa decisión: cambia el contexto y cede el control al proceso elegido.'),
]);
