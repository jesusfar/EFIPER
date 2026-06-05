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
]);
