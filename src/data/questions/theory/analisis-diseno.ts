import { mc, ms, tf, withTopic } from '../builder';

// Banco TEÓRICO (a mano) — Análisis y Diseño de Sistemas (UML).
// Razonamiento anclado en las notas: RF/RNF de los casos, casos de uso
// (include/extend, actores), diagrama de clases y relaciones, multiplicidad.
export const analisisDisenoTheory = withTopic('analisis_diseno', [
  mc('ad-t-001', 'Requerimientos', 3,
    '"El sistema debe estar programado en el entorno de Python" es un requerimiento…',
    [
      'No funcional (es una restricción tecnológica/de implementación)',
      'Funcional',
      'Una regla de negocio',
      'Un caso de uso',
    ], 0,
    'Que imponga una tecnología/plataforma (lenguaje, base de datos, SO) es una restricción de calidad/implementación: un RNF, no una función que el sistema ejecuta.'),

  mc('ad-t-002', 'Requerimientos', 2,
    '"El sistema debe permitir aplicar un descuento a la venta" es un requerimiento…',
    [
      'Funcional (describe una acción que el sistema debe realizar)',
      'No funcional',
      'Una restricción de hardware',
      'Un actor del sistema',
    ], 0,
    'Es un RF: describe una función concreta que el sistema debe ofrecer (aplicar descuento). Los RNF describen cómo de bien lo hace o sobre qué plataforma.'),

  ms('ad-t-003', 'Requerimientos', 3,
    'Seleccioná TODOS los que son requerimientos NO funcionales:',
    [
      'El sistema debe ser una aplicación web',
      'El sistema debe soportar una base de datos MySQL',
      'El sistema debe ejecutarse sobre un SO basado en UNIX/Linux',
      'El sistema debe responder a cada operación en menos de 2 segundos',
      'El sistema debe permitir registrar la venta',
      'El sistema debe permitir anular la venta',
    ], [0, 1, 2, 3],
    'Plataforma (web), motor de base de datos, SO y tiempo de respuesta son RNF (restricciones/calidad). "Registrar" y "anular la venta" son acciones del sistema: RF.'),

  tf('ad-t-004', 'Requerimientos', 2,
    'Un requerimiento no funcional suele expresar una restricción o atributo de calidad (rendimiento, seguridad, plataforma), frecuentemente con una métrica.',
    true,
    'Verdadero. Los RNF definen cómo debe comportarse el sistema (rápido, seguro, disponible, sobre tal tecnología), a menudo medible, no qué función realiza.'),

  mc('ad-t-005', 'Requerimientos', 3,
    '¿En qué se diferencia una regla de negocio de un requerimiento funcional?',
    [
      'La regla de negocio es una política/restricción del dominio que existe independientemente del sistema (ej. "un socio moroso no puede pedir préstamos")',
      'La regla de negocio siempre es un RNF de rendimiento',
      'La regla de negocio describe el hardware del servidor',
      'Son exactamente lo mismo',
    ], 0,
    'La regla de negocio existe con o sin software (política del dominio); el RF es cómo el sistema la implementa/hace cumplir.'),

  mc('ad-t-006', 'Casos de uso', 2,
    'En un diagrama de casos de uso, un actor representa…',
    [
      'Un rol externo (persona, sistema u organización) que interactúa con el sistema',
      'Una función interna del sistema',
      'Una tabla de la base de datos',
      'Un atributo de una clase',
    ], 0,
    'El actor es una entidad EXTERNA que interactúa con el sistema. No es parte interna del software; puede ser una persona u otro sistema.'),

  mc('ad-t-007', 'Casos de uso', 3,
    'Según las notas, confundir lo que hace un "Administrador" con lo que hace un "Operador" produce errores que se hacen visibles sobre todo en…',
    [
      'El diagrama de casos de uso (mal reparto de funciones entre actores)',
      'El diagrama de despliegue',
      'El esquema físico de la base de datos',
      'El diagrama de red',
    ], 0,
    'Si se mezclan las responsabilidades de dos actores, el diagrama de casos de uso refleja ese error: casos asignados al actor equivocado.'),

  mc('ad-t-008', 'Casos de uso', 2,
    'En casos de uso, la relación «include» representa…',
    [
      'Comportamiento obligatorio que siempre se ejecuta como parte del caso base',
      'Comportamiento opcional o condicional',
      'Una herencia entre actores',
      'Una conexión con la base de datos',
    ], 0,
    '«include» = el caso base SIEMPRE ejecuta el incluido (obligatorio). Es la relación más preguntada del tribunal junto con «extend».'),

  mc('ad-t-009', 'Casos de uso', 2,
    'En casos de uso, la relación «extend» representa…',
    [
      'Comportamiento opcional/condicional que extiende al caso base bajo ciertas condiciones',
      'Comportamiento que siempre se ejecuta de forma obligatoria',
      'Una asociación directa con un actor',
      'Una clase abstracta',
    ], 0,
    '«extend» agrega comportamiento opcional/condicional al caso base; ocurre solo si se cumple cierta condición, a diferencia de «include» (siempre).'),

  tf('ad-t-010', 'Casos de uso', 2,
    '«include» representa comportamiento que siempre ocurre, mientras que «extend» representa comportamiento que ocurre solo bajo cierta condición.',
    true,
    'Verdadero. Es la distinción clave: include = obligatorio/siempre; extend = opcional/condicional.'),

  ms('ad-t-011', 'Casos de uso', 3,
    'Seleccioná TODAS las afirmaciones correctas sobre los casos de uso:',
    [
      'Describen qué hace el sistema desde la perspectiva del actor',
      'El flujo principal es el "camino feliz"',
      'Los flujos alternativos describen excepciones o desvíos',
      'Un actor puede participar en varios casos de uso',
      'Detallan el código interno y los algoritmos de implementación',
      'Un caso de uso es una clase con atributos y métodos',
    ], [0, 1, 2, 3],
    'Los casos de uso capturan el QUÉ desde el actor, con su flujo principal y alternativos. No detallan código ni son clases: describen funcionalidad, no implementación.'),

  mc('ad-t-012', 'Diagramas', 2,
    'El diagrama de clases es un diagrama de tipo…',
    [
      'Estructural (estático): muestra clases, atributos, métodos y relaciones',
      'De comportamiento (dinámico)',
      'De interacción temporal',
      'De despliegue físico',
    ], 0,
    'El diagrama de clases es estructural/estático: representa la estructura del sistema, no su comportamiento en el tiempo.'),

  mc('ad-t-013', 'Diagrama de clases', 3,
    'En UML, la herencia (generalización) se representa con…',
    [
      'Una línea con punta triangular HUECA apuntando a la superclase',
      'Un rombo relleno en un extremo',
      'Una línea punteada con flecha abierta',
      'Un rombo hueco en un extremo',
    ], 0,
    'La generalización usa una punta triangular hueca hacia la superclase. El rombo relleno es composición, el hueco es agregación y la línea punteada es dependencia/realización.'),

  mc('ad-t-014', 'Diagrama de clases', 3,
    'En UML, el rombo RELLENO (negro) en un extremo de una asociación indica…',
    [
      'Composición: relación todo-parte fuerte; la parte no vive sin el todo',
      'Agregación',
      'Herencia',
      'Dependencia',
    ], 0,
    'El rombo relleno = composición. Si se destruye el todo, se destruyen las partes (ej. una Factura y sus Líneas de detalle).'),

  mc('ad-t-015', 'Diagrama de clases', 3,
    'En UML, el rombo HUECO (blanco) en un extremo de una asociación indica…',
    [
      'Agregación: relación todo-parte débil; la parte puede existir sin el todo',
      'Composición',
      'Herencia',
      'Realización',
    ], 0,
    'El rombo hueco = agregación. La parte tiene vida propia (ej. un Equipo y sus Jugadores: el jugador existe aunque se disuelva el equipo).'),

  tf('ad-t-016', 'Diagrama de clases', 3,
    'En la composición, si se destruye el todo se destruyen las partes; en la agregación, las partes pueden seguir existiendo por su cuenta.',
    true,
    'Verdadero. Esa dependencia del ciclo de vida es lo que distingue la composición (fuerte) de la agregación (débil).'),

  ms('ad-t-017', 'Diagrama de clases', 3,
    'Marcá TODAS las afirmaciones correctas sobre las relaciones entre clases:',
    [
      'La herencia (generalización) modela una relación "es-un"',
      'La composición es una relación "todo-parte" fuerte',
      'Una asociación conecta dos clases que se relacionan/conocen',
      'La dependencia (línea punteada) indica un uso temporal de otra clase',
      'La herencia modela una relación "tiene-un"',
      'En la composición, la parte sobrevive a la destrucción del todo',
    ], [0, 1, 2, 3],
    'Herencia = "es-un"; composición = "todo-parte" fuerte; asociación = se conocen; dependencia = uso temporal. Las dos últimas confunden herencia con composición y rompen la regla del ciclo de vida.'),

  mc('ad-t-018', 'Diagrama de clases', 3,
    '"Un Auto ES UN Vehículo" y "Un Auto TIENE UN Motor". ¿Qué relaciones modelan, respectivamente?',
    [
      '"es-un" → herencia; "tiene-un" → composición/agregación',
      '"es-un" → composición; "tiene-un" → herencia',
      'Ambas son herencia',
      'Ambas son asociación simple sin semántica',
    ], 0,
    '"es-un" indica generalización/herencia (Auto hereda de Vehículo). "tiene-un" indica una relación todo-parte (composición/agregación) entre Auto y Motor.'),

  mc('ad-t-019', 'Cardinalidad', 2,
    'En UML, la multiplicidad "1..*" significa…',
    [
      'Uno o muchos (al menos uno)',
      'Cero o uno',
      'Exactamente uno',
      'Cero o muchos',
    ], 0,
    '"1..*" = mínimo uno y máximo muchos: es obligatorio que exista al menos una instancia asociada.'),

  mc('ad-t-020', 'Cardinalidad', 3,
    'Un Pedido debe tener al menos un ítem, y cada ítem pertenece a un único pedido. ¿Qué multiplicidades corresponden (Pedido — Ítem)?',
    [
      'Pedido 1 — Ítem 1..* (un pedido tiene uno o más ítems; cada ítem, un solo pedido)',
      'Pedido 0..1 — Ítem 0..*',
      'Pedido * — Ítem *',
      'Pedido 1..* — Ítem 1',
    ], 0,
    'Del lado del ítem hay "1..*" (un pedido tiene uno o más ítems) y del lado del pedido "1" (cada ítem pertenece a exactamente un pedido).'),

  tf('ad-t-021', 'Cardinalidad', 2,
    'La multiplicidad "0..*" (o simplemente "*") indica cero o muchas instancias asociadas: la relación es opcional y puede haber muchas.',
    true,
    'Verdadero. "0..*" admite que no haya ninguna o que haya muchas asociaciones; el límite inferior 0 la hace opcional.'),

  mc('ad-t-022', 'Diagrama de clases', 2,
    'En UML, el símbolo "-" antes de un atributo indica visibilidad…',
    [
      'Privada (solo accesible dentro de la propia clase)',
      'Pública',
      'Protegida',
      'De paquete',
    ], 0,
    'En UML: + público, - privado, # protegido, ~ paquete. El "-" marca lo privado, accesible solo desde la propia clase.'),

  ms('ad-t-023', 'Diagrama de clases', 3,
    'Seleccioná TODAS las asociaciones símbolo–visibilidad correctas en UML:',
    [
      '"+" indica visibilidad pública',
      '"-" indica visibilidad privada',
      '"#" indica visibilidad protegida',
      '"~" indica visibilidad de paquete',
      '"+" indica visibilidad privada',
      '"-" indica visibilidad pública',
    ], [0, 1, 2, 3],
    'Los símbolos correctos son + público, - privado, # protegido, ~ paquete. Las dos últimas invierten el significado de "+" y "-".'),

  mc('ad-t-024', 'Diagramas', 2,
    'El diagrama de secuencia se usa para…',
    [
      'Modelar la interacción entre objetos a lo largo del tiempo (el orden de los mensajes)',
      'Mostrar las clases y sus relaciones estáticas',
      'Representar el hardware donde corre el sistema',
      'Capturar los requerimientos no funcionales',
    ], 0,
    'El diagrama de secuencia muestra cómo colaboran los objetos en el tiempo: líneas de vida y mensajes en orden cronológico.'),

  mc('ad-t-025', 'Diagramas', 2,
    'Un diagrama de estados modela…',
    [
      'Los estados por los que pasa un objeto y las transiciones provocadas por eventos',
      'Las relaciones estáticas entre clases',
      'La distribución física del software en nodos',
      'Los actores del sistema',
    ], 0,
    'El diagrama de estados describe el ciclo de vida de un objeto (ej. Pedido: pendiente → pagado → enviado) y qué eventos disparan cada transición.'),

  ms('ad-t-026', 'Diagramas', 3,
    'Seleccioná TODOS los que son diagramas de COMPORTAMIENTO (dinámicos):',
    [
      'Diagrama de casos de uso',
      'Diagrama de secuencia',
      'Diagrama de estados',
      'Diagrama de actividades',
      'Diagrama de clases',
      'Diagrama de despliegue',
    ], [0, 1, 2, 3],
    'Casos de uso, secuencia, estados y actividades son de comportamiento (dinámicos). Clases y despliegue son estructurales (estáticos).'),

  mc('ad-t-027', 'Modelado', 3,
    'El propósito del modelo de dominio en análisis es…',
    [
      'Representar los conceptos del problema del mundo real y sus relaciones, sin detalles de implementación',
      'Definir las pantallas y la interfaz del sistema',
      'Especificar el código fuente de cada clase',
      'Diseñar la estructura física de la base de datos',
    ], 0,
    'El modelo de dominio captura los conceptos del negocio y sus relaciones (qué existe en el problema), sin entrar en tecnología ni implementación.'),

  tf('ad-t-028', 'Casos de uso', 2,
    'El diagrama de casos de uso describe QUÉ hace el sistema desde la perspectiva del usuario, no CÓMO lo hace internamente.',
    true,
    'Verdadero. Los casos de uso expresan la funcionalidad desde el actor (qué obtiene), sin detallar la lógica interna ni los algoritmos.'),

  mc('ad-t-029', 'Diagrama de clases', 3,
    'En una clase Empleado, un empleado supervisa a otros empleados. ¿Qué se modela en el diagrama de clases?',
    [
      'Una asociación reflexiva (una clase relacionada consigo misma)',
      'Una herencia múltiple',
      'Una composición con la base de datos',
      'Un caso de uso',
    ], 0,
    'Cuando una clase se relaciona consigo misma (supervisor/supervisado) se modela una asociación reflexiva, con sus respectivos roles y multiplicidades.'),

  mc('ad-t-030', 'Diagrama de clases', 3,
    'En UML, una clase abstracta…',
    [
      'Se escribe en cursiva (o con la marca {abstract}) y no puede instanciarse directamente',
      'Se representa con un rombo relleno',
      'Es lo mismo que un actor del sistema',
      'No puede declarar ningún método',
    ], 0,
    'La clase abstracta (en cursiva) define un concepto general que no se instancia: sirve como base para subclases concretas que la especializan.'),

  mc('ad-t-031', 'Modelo de datos', 2,
    'En un Diagrama Entidad-Relación (DER), una entidad representa…',
    [
      'Un objeto o concepto del dominio sobre el que se guarda información (ej. Cliente, Producto)',
      'Una acción que ejecuta el sistema',
      'Un atributo de otra entidad',
      'Una pantalla de la interfaz',
    ], 0,
    'La entidad modela algo del mundo real con identidad propia (Cliente, Producto, Venta) sobre lo que se almacenan datos. Sus características son los atributos.'),

  mc('ad-t-032', 'Modelo de datos', 2,
    'En el modelo relacional, la clave primaria…',
    [
      'Identifica de forma única cada fila y no admite valores nulos ni duplicados',
      'Puede repetirse entre distintas filas',
      'Debe ser siempre un campo de texto',
      'Siempre referencia a otra tabla',
    ], 0,
    'La PK identifica unívocamente cada fila: única y no nula. La que referencia otra tabla es la clave foránea (FK).'),

  mc('ad-t-033', 'Modelo de datos', 3,
    'Una relación N:M entre Alumno y Materia se implementa en tablas…',
    [
      'Con una tabla intermedia (asociativa) que toma las PK de ambas como claves foráneas',
      'Con una FK en cualquiera de las dos tablas',
      'Fusionando Alumno y Materia en una sola tabla',
      'No es posible representarla en el modelo relacional',
    ], 0,
    'Una N:M se resuelve con una tabla intermedia (ej. Inscripción) que combina las PK de Alumno y Materia, normalmente formando una PK compuesta.'),

  tf('ad-t-034', 'Modelo de datos', 3,
    'En una relación 1:N, la clave foránea se coloca en el lado "N" (el lado de los muchos).',
    true,
    'Verdadero. El lado "muchos" guarda la FK que apunta al lado "uno" (ej. cada Pedido guarda el id del Cliente al que pertenece).'),

  ms('ad-t-035', 'Modelo de datos', 3,
    'Seleccioná TODAS las afirmaciones correctas sobre el paso del DER al modelo relacional:',
    [
      'Cada entidad del DER se transforma en una tabla',
      'Los atributos de la entidad se transforman en columnas',
      'La clave primaria identifica unívocamente cada fila',
      'Una relación N:M genera una tabla intermedia/asociativa',
      'Una relación 1:N requiere una tabla intermedia',
      'En una relación 1:N la FK se coloca en el lado "1"',
    ], [0, 1, 2, 3],
    'Entidades→tablas, atributos→columnas, PK identifica filas y N:M→tabla intermedia. Una 1:N NO necesita tabla intermedia y la FK va en el lado "N", no en el "1".'),

  mc('ad-t-036', 'Modelo de datos', 3,
    'Un atributo multivaluado (por ejemplo, los varios teléfonos de un cliente) al pasar a tablas se resuelve…',
    [
      'Creando una tabla aparte relacionada con la entidad (un teléfono por fila)',
      'Guardando todos los valores en una sola celda separados por comas',
      'Eliminando el atributo del modelo',
      'Convirtiéndolo en la clave primaria de la entidad',
    ], 0,
    'La 1FN exige atributos atómicos: un atributo multivaluado se lleva a una tabla relacionada con una fila por valor, evitando listas dentro de una celda.'),

  mc('ad-t-037', 'Modelo de datos', 3,
    'En el caso de la biblioteca: un socio puede tener muchos préstamos y cada préstamo pertenece a un solo socio. ¿Qué cardinalidad corresponde?',
    [
      '1:N (Socio 1 — Préstamo N)',
      'N:M',
      '1:1',
      'N:1 con tabla intermedia obligatoria',
    ], 0,
    'Es 1:N: un socio tiene muchos préstamos, pero cada préstamo es de un único socio. La FK (id del socio) va en la tabla Préstamo.'),

  mc('ad-t-038', 'Diagramas', 3,
    'Un diagrama de actividades modela…',
    [
      'El flujo de acciones y decisiones de un proceso (puede mostrar ejecución en paralelo con fork/join)',
      'Las clases y sus atributos',
      'La distribución del hardware',
      'Únicamente los actores externos',
    ], 0,
    'El diagrama de actividades representa un flujo de trabajo: acciones, decisiones, bifurcaciones y sincronización de flujos paralelos.'),

  mc('ad-t-039', 'Diagramas', 3,
    'En un diagrama de actividades, una barra de fork/join sirve para…',
    [
      'Representar el inicio (fork) y la sincronización (join) de flujos que se ejecutan en paralelo',
      'Indicar una decisión condicional',
      'Marcar el fin del proceso',
      'Conectar la actividad con la base de datos',
    ], 0,
    'El fork divide el flujo en ramas concurrentes; el join las vuelve a unir esperando a que todas terminen (sincronización).'),

  mc('ad-t-040', 'Diagramas', 3,
    'En un diagrama de actividades, el rombo (nodo de decisión) representa…',
    [
      'Una bifurcación condicional: el flujo toma un camino u otro según una condición',
      'La ejecución de varias ramas en paralelo',
      'El estado inicial del proceso',
      'Una clase del sistema',
    ], 0,
    'El rombo de decisión evalúa una condición y dirige el flujo por una sola de las ramas (con sus guardas), a diferencia del fork que las activa todas.'),

  tf('ad-t-041', 'Diagramas', 3,
    'Un fork divide el flujo en ramas que se ejecutan en paralelo; una decisión (rombo) elige UNA sola rama según una condición.',
    true,
    'Verdadero. Es la distinción clave: el fork es concurrencia (todas las ramas), la decisión es selección (una rama según la guarda).'),

  mc('ad-t-042', 'Proceso', 2,
    'El modelo en cascada (waterfall) se caracteriza por…',
    [
      'Etapas secuenciales: cada una empieza cuando termina la anterior (análisis→diseño→implementación→pruebas→mantenimiento)',
      'Iteraciones cortas con entregas frecuentes',
      'No requerir ninguna documentación',
      'Empezar a programar sin etapa de análisis',
    ], 0,
    'El cascada es lineal: cada fase se completa antes de pasar a la siguiente. Su rigidez es su principal limitación.'),

  mc('ad-t-043', 'Proceso', 3,
    '¿Cuál es la principal crítica al modelo en cascada?',
    [
      'Su rigidez: los cambios tardíos son costosos y el cliente recién ve el producto al final',
      'Que entrega el producto demasiado rápido',
      'Que no permite documentar el proyecto',
      'Que no incluye una etapa de pruebas',
    ], 0,
    'Al ser secuencial, volver atrás es caro y el feedback del cliente llega tarde (al final), cuando corregir es más costoso.'),

  ms('ad-t-044', 'Proceso', 3,
    'Seleccioná TODAS las afirmaciones correctas sobre las metodologías ágiles (Scrum):',
    [
      'Entrega valor en iteraciones cortas (sprints)',
      'Busca feedback frecuente del cliente',
      'El Product Backlog lista los requerimientos priorizados',
      'Favorece responder al cambio por sobre seguir un plan rígido',
      'Realiza una única entrega al final del proyecto',
      'Evita todo contacto con el cliente durante el desarrollo',
    ], [0, 1, 2, 3],
    'Ágil = iterativo, incremental, con feedback frecuente y backlog priorizado, adaptándose al cambio. Las dos falsas describen justamente lo contrario (modelo cascada / sin cliente).'),

  tf('ad-t-045', 'Proceso', 2,
    'Las metodologías ágiles favorecen entregas incrementales e iterativas y adaptarse al cambio, frente a la entrega única y secuencial del modelo cascada.',
    true,
    'Verdadero. Ágil prioriza individuos, software funcionando, colaboración con el cliente y respuesta al cambio, en contraste con la rigidez del cascada.'),

  mc('ad-t-046', 'Proceso', 3,
    'En Scrum, el rol responsable de priorizar el backlog y representar la voz del cliente es…',
    [
      'El Product Owner',
      'El Scrum Master',
      'El equipo de desarrollo',
      'El tester',
    ], 0,
    'El Product Owner gestiona y prioriza el Product Backlog, maximizando el valor del producto y representando los intereses del cliente/negocio.'),

  mc('ad-t-047', 'Proceso', 3,
    'El Scrum Master…',
    [
      'Facilita el proceso, elimina impedimentos y vela por que se siga el marco Scrum',
      'Es el jefe que asigna tareas y da órdenes al equipo',
      'Prioriza el Product Backlog',
      'Programa la mayor parte del código',
    ], 0,
    'El Scrum Master es un facilitador/servidor: ayuda al equipo, quita obstáculos y promueve las prácticas de Scrum; no manda ni prioriza el backlog.'),

  mc('ad-t-048', 'Requerimientos', 3,
    '¿Cuál de las siguientes es una técnica de elicitación (relevamiento) de requerimientos?',
    [
      'Entrevistas, observación, cuestionarios y análisis de documentos con los interesados',
      'Escribir el código y ver qué resulta',
      'Diseñar directamente la base de datos física',
      'Comprar el hardware del servidor',
    ], 0,
    'La elicitación obtiene las necesidades de los interesados mediante entrevistas, observación, encuestas, talleres y análisis de documentación existente.'),

  ms('ad-t-049', 'Requerimientos', 3,
    'Marcá TODAS las cualidades que debe tener un buen requerimiento:',
    [
      'Claro y no ambiguo',
      'Verificable/medible (se puede comprobar si se cumple)',
      'Consistente: no contradice a otros requerimientos',
      'Completo dentro de su alcance',
      'Ambiguo, para dar flexibilidad de interpretación',
      'Imposible de verificar',
    ], [0, 1, 2, 3],
    'Un buen requerimiento es claro, verificable, consistente y completo. La ambigüedad y la imposibilidad de verificación son defectos, no cualidades.'),

  mc('ad-t-050', 'Requerimientos', 3,
    '¿Cuál es la diferencia entre un caso de uso y una historia de usuario?',
    [
      'La historia de usuario es una descripción breve e informal del valor para el usuario; el caso de uso detalla flujos e interacciones paso a paso',
      'Son exactamente lo mismo',
      'El caso de uso es más breve que la historia de usuario',
      'La historia de usuario describe el hardware del sistema',
    ], 0,
    'La historia de usuario es ligera ("Como X quiero Y para Z") y promueve la conversación; el caso de uso documenta flujos principal y alternativos con más detalle.'),

  tf('ad-t-051', 'Requerimientos', 2,
    'Una historia de usuario suele seguir el formato "Como [rol] quiero [funcionalidad] para [beneficio]".',
    true,
    'Verdadero. Ese formato centra la historia en quién la necesita, qué quiere y para qué, manteniendo el foco en el valor para el usuario.'),

  mc('ad-t-052', 'Diagramas', 3,
    'El diagrama de despliegue (deployment) muestra…',
    [
      'La distribución física del software en nodos de hardware (servidores, dispositivos) y sus conexiones',
      'Las clases del sistema y sus métodos',
      'El flujo de actividades de un proceso',
      'Los requerimientos no funcionales',
    ], 0,
    'El diagrama de despliegue representa la arquitectura física: en qué nodos (servidores, clientes) se ejecutan los artefactos y cómo se comunican.'),

  mc('ad-t-053', 'Diagramas', 3,
    'El diagrama de componentes muestra…',
    [
      'La organización del sistema en componentes/módulos de software y sus dependencias e interfaces',
      'El hardware físico donde corre el sistema',
      'Los estados por los que pasa un objeto',
      'Los actores externos del sistema',
    ], 0,
    'El diagrama de componentes describe las piezas de software (módulos, librerías, servicios), las interfaces que ofrecen/requieren y sus dependencias.'),

  ms('ad-t-054', 'Diagramas', 3,
    'Seleccioná TODOS los que son diagramas ESTRUCTURALES (estáticos):',
    [
      'Diagrama de clases',
      'Diagrama de componentes',
      'Diagrama de despliegue',
      'Diagrama de objetos',
      'Diagrama de secuencia',
      'Diagrama de estados',
    ], [0, 1, 2, 3],
    'Clases, componentes, despliegue y objetos son estructurales (describen la estructura). Secuencia y estados son de comportamiento (describen la dinámica).'),

  mc('ad-t-055', 'Requerimientos', 2,
    'En el caso de control de stock, "registrar el conteo de existencias" es un…',
    [
      'Requerimiento funcional (una acción que el sistema debe realizar)',
      'Requerimiento no funcional',
      'Actor del sistema',
      'Diagrama de clases',
    ], 0,
    'Es un RF: describe una función concreta del sistema (registrar el conteo). Los RNF de ese caso eran, por ejemplo, "ser una web" o "usar MySQL".'),

  mc('ad-t-056', 'Casos de uso', 2,
    'En el caso del sistema de ventas, ¿cuál sería un actor típico?',
    [
      'El Cajero/Vendedor (rol externo que interactúa con el sistema)',
      'La tabla Venta de la base de datos',
      'El método registrarVenta()',
      'El requerimiento RF01',
    ], 0,
    'El actor es un rol externo que usa el sistema (Cajero, Vendedor, Cliente). Una tabla, un método o un requerimiento son elementos internos, no actores.'),

  tf('ad-t-057', 'Requerimientos', 2,
    'Un requerimiento funcional bien redactado suele comenzar con "El sistema debe permitir…" seguido de una acción concreta.',
    true,
    'Verdadero. Esa forma deja explícita la función que el sistema ofrece (registrar, modificar, consultar), facilitando su verificación.'),

  mc('ad-t-058', 'Modelado', 3,
    '¿Cuál es la diferencia entre un diagrama de clases (UML) y un DER?',
    [
      'El diagrama de clases modela clases con atributos y métodos (comportamiento); el DER modela entidades y relaciones de datos para la base, sin métodos',
      'Son artefactos idénticos',
      'El DER incluye métodos y el de clases no',
      'El DER es un diagrama de comportamiento',
    ], 0,
    'El diagrama de clases incluye comportamiento (métodos) y es de diseño orientado a objetos; el DER se enfoca en los datos persistentes (entidades, atributos, relaciones), sin métodos.'),

  ms('ad-t-059', 'Modelado', 3,
    'Relacioná cada artefacto con su propósito. Marcá TODAS las correctas:',
    [
      'Casos de uso → funcionalidad desde la perspectiva del actor',
      'Diagrama de clases → estructura estática (clases, atributos, relaciones)',
      'DER → datos persistentes (entidades y relaciones para la BD)',
      'Diagrama de secuencia → interacción entre objetos en el tiempo',
      'El DER define las pantallas y la interfaz de usuario',
      'Los casos de uso definen el hardware del sistema',
    ], [0, 1, 2, 3],
    'Cada artefacto tiene su foco: casos de uso (funcionalidad), clases (estructura), DER (datos), secuencia (interacción temporal). El DER no define pantallas ni los casos de uso definen hardware.'),

  mc('ad-t-060', 'Requerimientos', 3,
    'La trazabilidad de requerimientos permite…',
    [
      'Seguir un requerimiento a lo largo del desarrollo: de dónde surge y dónde se diseña, implementa y prueba',
      'Cifrar los requerimientos para protegerlos',
      'Eliminar la documentación del proyecto',
      'Programar el sistema sin etapa de análisis',
    ], 0,
    'La trazabilidad vincula cada requerimiento con su origen y con los artefactos que lo realizan y verifican, facilitando el control de cambios y la cobertura.'),
]);
