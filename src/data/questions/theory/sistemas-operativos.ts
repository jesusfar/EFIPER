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
]);
