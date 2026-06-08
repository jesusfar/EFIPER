import { mc, ms, tf, withTopic } from '../builder';

// Banco TEÓRICO (a mano) — Paradigmas y Lenguajes (Java).
// Razonamiento: pilares de la POO, clases/objetos/constructores, static/final,
// sobrecarga vs sobrescritura, clase abstracta vs interfaz.
export const paradigmasTheory = withTopic('paradigmas_lenguajes', [
  mc('par-t-001', 'POO', 2,
    'Los cuatro pilares de la Programación Orientada a Objetos son…',
    [
      'Abstracción, encapsulamiento, herencia y polimorfismo',
      'Clases, objetos, métodos y atributos',
      'Variables, bucles, funciones y condicionales',
      'Compilación, ejecución, depuración y prueba',
    ], 0,
    'Los pilares de la POO son abstracción (modelar lo esencial), encapsulamiento (ocultar el estado), herencia (reutilizar) y polimorfismo (muchas formas).'),

  mc('par-t-002', 'POO', 2,
    'El encapsulamiento consiste en…',
    [
      'Ocultar el estado interno de un objeto y exponerlo solo mediante métodos',
      'Heredar atributos de una clase padre',
      'Que un método tome varias formas según el objeto',
      'Crear objetos a partir de una clase',
    ], 0,
    'El encapsulamiento protege los datos internos (atributos privados) y los expone de forma controlada vía getters/setters, preservando la integridad del objeto.'),

  mc('par-t-003', 'POO', 2,
    'La abstracción consiste en…',
    [
      'Modelar lo esencial de un objeto, ignorando los detalles irrelevantes al contexto',
      'Ocultar exclusivamente los atributos privados',
      'Crear muchas instancias de una clase',
      'Convertir un tipo de dato en otro',
    ], 0,
    'La abstracción se enfoca en las características esenciales relevantes al problema (el "qué hace"), dejando de lado la complejidad de la implementación.'),

  mc('par-t-004', 'POO', 2,
    'La herencia permite…',
    [
      'Que una subclase reutilice y extienda atributos y métodos de su superclase (relación "es-un")',
      'Que dos objetos no se relacionen entre sí',
      'Ocultar el estado interno de un objeto',
      'Crear constructores automáticamente',
    ], 0,
    'La herencia establece una relación "es-un" (un Gato ES UN Animal): la subclase hereda y puede extender o especializar el comportamiento de la superclase.'),

  mc('par-t-005', 'POO', 2,
    'El polimorfismo permite…',
    [
      'Que objetos de distintas clases respondan al mismo mensaje (método) de forma específica',
      'Que una clase tenga varios constructores',
      'Que un atributo sea privado',
      'Que una clase herede de varias clases a la vez',
    ], 0,
    'El polimorfismo ("muchas formas") permite que un mismo método se comporte distinto según la clase real del objeto que lo recibe (vía sobrescritura).'),

  ms('par-t-006', 'POO', 3,
    'Seleccioná TODAS las afirmaciones correctas sobre los pilares de la POO:',
    [
      'El encapsulamiento oculta el estado interno y lo expone vía métodos',
      'La abstracción modela lo esencial, ignorando detalles irrelevantes',
      'La herencia permite reutilizar y extender (relación "es-un")',
      'El polimorfismo permite responder al mismo mensaje de forma específica',
      'La herencia consiste en ocultar el estado interno del objeto',
      'El polimorfismo es el mecanismo para crear objetos a partir de una clase',
    ], [0, 1, 2, 3],
    'Encapsulamiento (oculta estado), abstracción (lo esencial), herencia (reutiliza) y polimorfismo (muchas formas) son correctas. Ocultar el estado es encapsulamiento y crear objetos es instanciar, no polimorfismo.'),

  mc('par-t-007', 'Clases y objetos', 2,
    '¿Cuál es la diferencia entre una clase y un objeto?',
    [
      'La clase es la plantilla/molde; el objeto es una instancia concreta de esa clase',
      'El objeto es la plantilla y la clase la instancia',
      'Son exactamente lo mismo',
      'La clase tiene estado propio y el objeto no',
    ], 0,
    'La clase define la estructura y el comportamiento (atributos y métodos); el objeto es una instancia concreta con su propio estado, creada a partir de la clase.'),

  mc('par-t-008', 'Constructores', 2,
    'Un constructor es…',
    [
      'Un método especial que inicializa el objeto al instanciarlo (con new); lleva el nombre de la clase y no declara tipo de retorno',
      'Un método que destruye el objeto al final',
      'Un atributo privado de la clase',
      'Una interfaz que la clase implementa',
    ], 0,
    'El constructor inicializa el objeto al crearlo con new. Tiene el mismo nombre que la clase y no devuelve nada (ni siquiera void).'),

  tf('par-t-009', 'Constructores', 2,
    'En Java, un constructor lleva el mismo nombre que la clase y no declara ningún tipo de retorno (ni siquiera void).',
    true,
    'Verdadero. El constructor no especifica tipo de retorno: si se le pusiera void, dejaría de ser un constructor y pasaría a ser un método común con ese nombre.'),

  mc('par-t-010', 'Constructores', 3,
    'Si una clase no define ningún constructor, Java…',
    [
      'Provee automáticamente un constructor por defecto (sin parámetros)',
      'No permite instanciar la clase',
      'Genera un error de compilación',
      'Crea dos constructores distintos',
    ], 0,
    'El compilador agrega un constructor por defecto sin parámetros. Pero si definís al menos uno (con parámetros), ese por defecto ya no se genera automáticamente.'),

  mc('par-t-011', 'static y final', 3,
    'En Java, un atributo static…',
    [
      'Pertenece a la clase (es compartido por todas las instancias), no a cada objeto',
      'Es siempre una constante inmutable',
      'Es siempre privado',
      'No puede modificarse nunca',
    ], 0,
    'Un atributo static tiene una única copia compartida por todas las instancias; se accede mediante la clase (Clase.atributo), sin necesidad de un objeto.'),

  mc('par-t-012', 'static y final', 2,
    'En Java, la palabra clave final aplicada a una variable…',
    [
      'Hace que su valor no pueda modificarse una vez asignado (constante)',
      'La convierte en estática',
      'La hace privada',
      'Le permite tomar el valor null obligatoriamente',
    ], 0,
    'Una variable final se asigna una sola vez y luego es constante. (final en un método impide sobrescribirlo; en una clase, impide heredarla).'),

  ms('par-t-013', 'static y final', 3,
    'Seleccioná TODAS las afirmaciones correctas sobre static y final:',
    [
      'static: el miembro pertenece a la clase y se comparte entre instancias',
      'final en una variable: su valor no puede cambiar (constante)',
      'final en un método: no se puede sobrescribir (override)',
      'final en una clase: no se puede heredar de ella',
      'static crea una copia del atributo por cada instancia',
      'final convierte el atributo en privado',
    ], [0, 1, 2, 3],
    'static (compartido por la clase), final en variable (constante), final en método (no override) y final en clase (no herencia) son correctas. static comparte una sola copia y final no afecta la visibilidad.'),

  mc('par-t-014', 'Sobrecarga y sobrescritura', 3,
    'La sobrecarga de métodos (overloading) consiste en…',
    [
      'Tener varios métodos con el mismo nombre pero distinta lista de parámetros',
      'Redefinir un método heredado en la subclase con la misma firma',
      'Declarar un método como abstracto',
      'Llamar a un método de forma recursiva',
    ], 0,
    'El overloading define varios métodos de igual nombre y firma distinta (cantidad/tipo de parámetros). Se resuelve en tiempo de compilación.'),

  mc('par-t-015', 'Sobrecarga y sobrescritura', 3,
    'La sobrescritura de métodos (overriding) consiste en…',
    [
      'Redefinir en la subclase un método de la superclase con la misma firma',
      'Tener varios métodos con distinta cantidad de parámetros',
      'Crear un constructor en la subclase',
      'Declarar el método como static',
    ], 0,
    'El overriding redefine en la subclase un método heredado, conservando la firma, para cambiar su comportamiento. Es la base del polimorfismo (enlace dinámico).'),

  tf('par-t-016', 'Sobrecarga y sobrescritura', 3,
    'La sobrecarga (overloading) redefine un método heredado con la misma firma, mientras que la sobrescritura (overriding) usa una lista de parámetros distinta.',
    false,
    'Falso. Está invertido: el OVERLOADING usa el mismo nombre con DISTINTA firma (en la misma clase); el OVERRIDING redefine en la subclase un método heredado con la MISMA firma.'),

  ms('par-t-017', 'Sobrecarga y sobrescritura', 3,
    'Seleccioná TODAS las afirmaciones correctas sobre overloading y overriding:',
    [
      'La sobrecarga (overloading): mismo nombre, distinta lista de parámetros',
      'La sobrescritura (overriding): misma firma, redefinida en la subclase',
      'La sobrescritura es la base del polimorfismo',
      'La sobrecarga se resuelve en tiempo de compilación',
      'La sobrescritura (overriding) usa una lista de parámetros distinta',
      'La sobrecarga (overloading) redefine un método heredado de la superclase',
    ], [0, 1, 2, 3],
    'Overloading (distinta firma, compilación) y overriding (misma firma, subclase, polimorfismo) son correctas. Las dos falsas intercambian las definiciones de ambos conceptos.'),

  mc('par-t-018', 'Referencias', 2,
    'En Java, la palabra clave this…',
    [
      'Referencia a la instancia actual del objeto',
      'Referencia a la superclase',
      'Crea un objeto nuevo',
      'Es un tipo de dato primitivo',
    ], 0,
    'this apunta al objeto actual; se usa para distinguir atributos de parámetros con el mismo nombre o para invocar otro constructor de la misma clase.'),

  mc('par-t-019', 'Referencias', 3,
    'En Java, la palabra clave super se usa para…',
    [
      'Acceder a miembros (métodos o constructor) de la superclase',
      'Crear un objeto completamente nuevo',
      'Declarar un método como estático',
      'Ocultar los atributos de la clase',
    ], 0,
    'super permite invocar el constructor de la superclase (super(...)) o un método sobrescrito de la superclase desde la subclase.'),

  tf('par-t-020', 'Herencia', 2,
    'En Java, una clase puede heredar (extends) de varias clases a la vez.',
    false,
    'Falso. Java NO admite herencia múltiple de clases (para evitar el problema del diamante). Sí permite implementar múltiples interfaces.'),

  mc('par-t-021', 'Encapsulamiento', 2,
    'Los métodos getter y setter sirven para…',
    [
      'Acceder y modificar atributos privados de forma controlada (apoyan el encapsulamiento)',
      'Crear objetos a partir de la clase',
      'Heredar de una superclase',
      'Sobrecargar los constructores',
    ], 0,
    'Los getters/setters dan acceso regulado a los atributos privados: el setter puede validar antes de asignar, protegiendo la integridad del objeto.'),

  tf('par-t-022', 'Abstracción', 3,
    'En Java, una clase abstracta se puede instanciar directamente con new.',
    false,
    'Falso. Una clase abstracta NO se puede instanciar con new; sirve como base para subclases concretas. Puede contener métodos abstractos (sin cuerpo) y métodos concretos.'),

  mc('par-t-023', 'Abstracción', 3,
    'Una interfaz (en Java clásico) define…',
    [
      'Un contrato: los métodos que las clases que la implementan deben proveer',
      'Atributos con estado mutable propio',
      'Un constructor para crear instancias',
      'Una instancia concreta de un objeto',
    ], 0,
    'La interfaz declara un conjunto de métodos (el contrato) sin implementarlos (en su forma clásica); las clases que la implementan deben definir esos métodos.'),

  mc('par-t-024', 'Abstracción', 3,
    'La diferencia entre una clase abstracta y una interfaz (Java clásico) es que…',
    [
      'La clase abstracta puede tener estado y métodos implementados; la interfaz (clásica) solo define el contrato',
      'La interfaz puede instanciarse con new',
      'La clase abstracta no puede tener métodos',
      'Una clase puede heredar de varias clases abstractas a la vez',
    ], 0,
    'La clase abstracta puede tener atributos y métodos concretos; la interfaz clásica solo declara el contrato. Una clase hereda de UNA sola clase pero implementa VARIAS interfaces.'),

  ms('par-t-025', 'Abstracción', 3,
    'Seleccioná TODAS las afirmaciones correctas sobre clases abstractas e interfaces:',
    [
      'Una clase abstracta no puede instanciarse directamente',
      'Una interfaz define un contrato de métodos a implementar',
      'Una clase puede implementar varias interfaces',
      'Una clase solo puede heredar (extends) de una única clase',
      'Una clase abstracta se puede instanciar con new',
      'Una clase puede heredar (extends) de varias clases a la vez',
    ], [0, 1, 2, 3],
    'Clase abstracta no instanciable, interfaz = contrato, varias interfaces y una sola superclase son correctas. Las falsas: la abstracta no se instancia y Java no tiene herencia múltiple de clases.'),

  mc('par-t-026', 'Java', 3,
    'En Java, la diferencia entre "==" y ".equals()" al comparar objetos es que…',
    [
      '"==" compara referencias (si son el mismo objeto); ".equals()" compara contenido si está sobrescrito',
      'Son equivalentes en todos los casos',
      '".equals()" compara referencias y "==" el contenido',
      '"==" no funciona con objetos',
    ], 0,
    '"==" verifica si dos referencias apuntan al mismo objeto en memoria; ".equals()" (bien sobrescrito) compara el contenido/valor lógico de los objetos.'),

  tf('par-t-027', 'Java', 3,
    'En Java, los tipos primitivos (int, double, boolean) no son objetos; para tratarlos como objetos se usan sus clases envoltorio (Integer, Double, Boolean).',
    true,
    'Verdadero. Los primitivos son tipos básicos (no objetos); los wrappers (Integer, Double, Boolean…) los "envuelven" como objetos cuando se necesita, por ejemplo en colecciones genéricas.'),

  mc('par-t-028', 'Encapsulamiento', 3,
    'Una ventaja del encapsulamiento es…',
    [
      'Proteger la integridad del objeto: el estado interno solo cambia mediante métodos controlados (con validación)',
      'Permitir la herencia múltiple de clases',
      'Hacer que el código se ejecute más lento',
      'Eliminar la necesidad de usar clases',
    ], 0,
    'Al exponer el estado solo mediante métodos, se puede validar y controlar cada cambio, evitando que el objeto quede en un estado inválido.'),

  tf('par-t-029', 'Polimorfismo', 3,
    'El polimorfismo (vía overriding) permite que, usando una referencia de la superclase, se ejecute el método de la subclase real en tiempo de ejecución (enlace dinámico).',
    true,
    'Verdadero. El enlace dinámico resuelve en ejecución qué versión del método llamar según el tipo REAL del objeto, no según el tipo de la referencia.'),

  ms('par-t-030', 'POO', 3,
    'Repaso: seleccioná TODAS las afirmaciones correctas sobre POO:',
    [
      'Un objeto es una instancia concreta de una clase',
      'El constructor inicializa el objeto al crearlo',
      'El encapsulamiento protege el estado interno del objeto',
      'El polimorfismo se apoya en la sobrescritura de métodos',
      'Una clase es una instancia de un objeto',
      'Java admite herencia múltiple de clases con extends',
    ], [0, 1, 2, 3],
    'Objeto = instancia, constructor inicializa, encapsulamiento protege y polimorfismo usa overriding son correctas. La clase NO es instancia del objeto (es al revés) y Java no tiene herencia múltiple de clases.'),

  mc('par-t-031', 'Tipos y operadores', 2,
    '¿Cuál de los siguientes es un tipo primitivo en Java?',
    [
      'int',
      'String',
      'Integer',
      'ArrayList',
    ], 0,
    'int es un tipo primitivo. String, Integer (wrapper) y ArrayList son clases (objetos), no primitivos.'),

  mc('par-t-032', 'Tipos y operadores', 2,
    'En Java, ¿cuál es el resultado de la expresión "7 / 2" si ambos operandos son int?',
    [
      '3',
      '3.5',
      '4',
      '3.0',
    ], 0,
    'La división entre dos int es entera: descarta la parte decimal. 7 / 2 = 3. Para obtener 3.5 habría que usar double.'),

  mc('par-t-033', 'Tipos y operadores', 2,
    'En Java, ¿cuál es el resultado de "17 % 5"?',
    [
      '2',
      '3',
      '3.4',
      '12',
    ], 0,
    'El operador % devuelve el resto de la división entera: 17 = 3×5 + 2, por lo tanto 17 % 5 = 2.'),

  mc('par-t-034', 'Tipos y operadores', 3,
    'Para obtener el resultado decimal de 7 dividido 2 en Java, hay que…',
    [
      'Castear a double: (double) 7 / 2 da 3.5',
      'Usar 7 % 2',
      'No es posible obtener decimales en Java',
      'Usar siempre tipos int',
    ], 0,
    'Si al menos un operando es double, la división es real: (double) 7 / 2 = 3.5. Con ambos int, el resultado se trunca a 3.'),

  tf('par-t-035', 'Tipos y operadores', 3,
    'En Java, asignar un valor double a una variable int se hace automáticamente, sin necesidad de un cast.',
    false,
    'Falso. Pasar de double a int es una conversión ESTRECHA (puede perder datos), así que requiere un cast explícito: (int). De int a double sí es automático (ampliación).'),

  mc('par-t-036', 'Tipos y operadores', 3,
    'La conversión de int a double en Java…',
    [
      'Es automática (ampliación/widening), sin pérdida de información',
      'Requiere un cast y pierde datos',
      'No es posible',
      'Es idéntica a convertir de double a int',
    ], 0,
    'int → double es una ampliación: cabe sin perder datos y el compilador la hace sola. El sentido inverso (double → int) sí necesita cast y puede truncar.'),

  mc('par-t-037', 'Tipos y operadores', 3,
    'En Java, ¿qué valor produce la expresión "(int) \'A\'"?',
    [
      '65 (su código en la tabla ASCII/Unicode)',
      "El carácter 'A'",
      '1',
      '0',
    ], 0,
    "El carácter 'A' tiene código 65; al castearlo a int se obtiene ese valor numérico. Los char se pueden tratar como enteros en operaciones aritméticas.",
  ),

  ms('par-t-038', 'Tipos y operadores', 3,
    'Seleccioná TODAS las afirmaciones correctas sobre tipos y operadores en Java:',
    [
      'La división entre dos int es entera (descarta el decimal)',
      'El operador % devuelve el resto de la división',
      'La conversión de int a double es automática',
      'La conversión de double a int requiere un cast explícito',
      '"7 / 2" da 3.5 cuando ambos operandos son int',
      'La conversión de double a int es automática',
    ], [0, 1, 2, 3],
    'División int entera, % resto, int→double automático y double→int con cast son correctas. 7/2 con int da 3 (no 3.5) y double→int NO es automático.'),

  mc('par-t-039', 'Operadores', 3,
    'En Java, el operador && (AND lógico)…',
    [
      'Es de cortocircuito: si el primer operando es false, no evalúa el segundo',
      'Siempre evalúa ambos operandos',
      'Es un operador a nivel de bits',
      'Devuelve un número entero',
    ], 0,
    'El && cortocircuita: si el primer operando ya determina el resultado (false), no evalúa el segundo. Esto evita errores (ej. comprobar null antes de acceder a un método).'),

  mc('par-t-040', 'Control de flujo', 3,
    'En Java, si en un switch se omite el break en un caso…',
    [
      'La ejecución "cae" (fall-through) y continúa con el siguiente caso',
      'Salta automáticamente al final del switch',
      'Se produce un error de compilación',
      'Se repite el mismo caso',
    ], 0,
    'Sin break, la ejecución continúa en los casos siguientes (fall-through) hasta encontrar un break o el final del switch. A veces se usa a propósito, pero suele ser un error.'),

  mc('par-t-041', 'Control de flujo', 2,
    '¿Cuántas veces se ejecuta el cuerpo de "for (int i = 0; i < 5; i++)"?',
    [
      '5',
      '4',
      '6',
      'Infinitas',
    ], 0,
    'i toma los valores 0, 1, 2, 3 y 4 (mientras i < 5): el cuerpo se ejecuta 5 veces.'),

  tf('par-t-042', 'Control de flujo', 3,
    'Un bucle do-while ejecuta su cuerpo al menos una vez, ya que evalúa la condición DESPUÉS de ejecutarlo (a diferencia del while).',
    true,
    'Verdadero. El do-while ejecuta el cuerpo primero y luego evalúa la condición; el while la evalúa antes y, si es falsa, puede no ejecutarse ninguna vez.'),

  mc('par-t-043', 'String', 2,
    'En Java, los objetos String son…',
    [
      'Inmutables: no se pueden modificar después de creados',
      'Mutables: se pueden cambiar en su lugar',
      'Tipos primitivos',
      'Siempre null por defecto',
    ], 0,
    'Una vez creado, un String no cambia: cualquier "modificación" (concatenar, reemplazar) genera un nuevo objeto String. Por eso son seguros para compartir.'),

  mc('par-t-044', 'String', 3,
    'Cada concatenación de String con el operador "+"…',
    [
      'Crea un nuevo objeto String (por la inmutabilidad); para muchas concatenaciones conviene StringBuilder',
      'Modifica el String original en su lugar',
      'No consume memoria adicional',
      'Es más rápida que StringBuilder dentro de un bucle',
    ], 0,
    'Como String es inmutable, cada "+" crea un objeto nuevo; en un bucle eso genera muchos objetos temporales. StringBuilder modifica un buffer mutable, mucho más eficiente.'),

  mc('par-t-045', 'String', 3,
    'En Java, para comparar el CONTENIDO de dos String conviene usar…',
    [
      '.equals() (== compara referencias, no el contenido)',
      '== en todos los casos',
      'Los operadores > y <',
      'El operador +',
    ], 0,
    '.equals() compara los caracteres (el contenido); == compara si son el mismo objeto en memoria, lo que puede dar false aunque el texto sea igual.'),

  tf('par-t-046', 'String', 3,
    'En Java, comparar dos String con == siempre devuelve true si tienen el mismo contenido.',
    false,
    'Falso. == compara REFERENCIAS, no contenido: dos String con igual texto pero distintos objetos dan false. Para comparar el contenido se usa .equals().'),

  ms('par-t-047', 'String', 3,
    'Seleccioná TODAS las afirmaciones correctas sobre String en Java:',
    [
      'String es inmutable (no cambia tras crearse)',
      '.equals() compara el contenido de los String',
      '== compara referencias (si son el mismo objeto)',
      'StringBuilder conviene para concatenar muchas veces (ej. en un bucle)',
      'String es mutable y se puede modificar en su lugar',
      '== compara el contenido de dos String',
    ], [0, 1, 2, 3],
    'String inmutable, .equals() (contenido), == (referencias) y StringBuilder (muchas concatenaciones) son correctas. String NO es mutable y == NO compara contenido.'),

  mc('par-t-048', 'Arrays', 2,
    'En Java, un arreglo (array)…',
    [
      'Tiene un tamaño fijo definido al crearse y se accede por índice desde 0',
      'Crece dinámicamente sin ningún límite',
      'No tiene índices',
      'Es exactamente lo mismo que un ArrayList',
    ], 0,
    'El array reserva un tamaño fijo al crearse (new int[n]) y se indexa desde 0 hasta n−1. Para colecciones que crecen se usa ArrayList.'),

  mc('par-t-049', 'Arrays', 3,
    'Acceder a un índice fuera del rango de un array en Java…',
    [
      'Lanza una excepción ArrayIndexOutOfBoundsException en tiempo de ejecución',
      'Devuelve null',
      'Devuelve 0',
      'Produce un error de compilación',
    ], 0,
    'Java verifica los límites en ejecución: acceder fuera de rango (ej. índice n en un array de tamaño n) lanza ArrayIndexOutOfBoundsException.'),

  mc('par-t-050', 'Arrays', 3,
    '¿Cuál es la diferencia entre un array y un ArrayList?',
    [
      'El array es de tamaño fijo; el ArrayList crece dinámicamente y ofrece métodos (add, remove, size)',
      'El ArrayList es de tamaño fijo y el array dinámico',
      'El array crece dinámicamente al agregar elementos',
      'Son estructuras idénticas',
    ], 0,
    'El array tiene tamaño fijo y es más eficiente; el ArrayList (del framework de colecciones) redimensiona solo y trae métodos cómodos, a costa de algo de overhead.'),

  tf('par-t-051', 'Arrays', 3,
    'En Java, los arreglos (arrays) tienen un tamaño fijo definido al crearse y no pueden cambiarlo después.',
    true,
    'Verdadero. El tamaño del array es fijo. Para una colección que crece o se achica dinámicamente se usa ArrayList u otra estructura del framework de colecciones.'),

  mc('par-t-052', 'Excepciones', 2,
    'En Java, el bloque try-catch sirve para…',
    [
      'Capturar y manejar excepciones que pueden ocurrir durante la ejecución',
      'Declarar variables locales',
      'Definir una nueva clase',
      'Crear un bucle de repetición',
    ], 0,
    'El código que puede fallar va en el try; si lanza una excepción, el catch correspondiente la captura y la maneja, evitando que el programa se detenga abruptamente.'),

  mc('par-t-053', 'Excepciones', 3,
    'El bloque finally en un try-catch…',
    [
      'Se ejecuta siempre, ocurra o no una excepción (ideal para liberar recursos)',
      'Solo se ejecuta si ocurre una excepción',
      'Solo se ejecuta si NO ocurre ninguna excepción',
      'Nunca se ejecuta',
    ], 0,
    'El finally corre pase lo que pase (haya excepción o no, e incluso con un return en el try), por eso es ideal para cerrar archivos, conexiones u otros recursos.'),

  mc('par-t-054', 'Excepciones', 3,
    '¿Cuál es la diferencia entre las excepciones checked y unchecked?',
    [
      'Las checked deben declararse o capturarse (el compilador lo exige); las unchecked (RuntimeException) no',
      'Las unchecked deben declararse obligatoriamente',
      'Son exactamente lo mismo',
      'Las checked solo ocurren en tiempo de compilación',
    ], 0,
    'Las checked (ej. IOException) obligan a manejarlas (try-catch o throws); las unchecked (RuntimeException, ej. NullPointer) no lo exigen, suelen ser errores de programación.'),

  mc('par-t-055', 'Excepciones', 3,
    'NullPointerException y ArrayIndexOutOfBoundsException son ejemplos de…',
    [
      'Excepciones unchecked (heredan de RuntimeException)',
      'Excepciones checked',
      'Errores de compilación',
      'Advertencias (warnings) del compilador',
    ], 0,
    'Ambas son RuntimeException (unchecked): el compilador no obliga a capturarlas; suelen indicar errores de lógica que conviene prevenir con validaciones.'),

  tf('par-t-056', 'Excepciones', 3,
    'El bloque finally solo se ejecuta cuando NO se lanzó ninguna excepción en el try.',
    false,
    'Falso. El finally se ejecuta SIEMPRE: haya o no excepción, e incluso si el try tiene un return. Por eso es el lugar ideal para liberar recursos.'),

  ms('par-t-057', 'Excepciones', 3,
    'Seleccioná TODAS las afirmaciones correctas sobre el manejo de excepciones:',
    [
      'try-catch captura y maneja excepciones en tiempo de ejecución',
      'El bloque finally se ejecuta siempre, ocurra o no una excepción',
      'Las excepciones checked deben declararse o capturarse',
      'Las excepciones unchecked heredan de RuntimeException',
      'El bloque finally solo se ejecuta si ocurrió una excepción',
      'Las excepciones unchecked deben declararse obligatoriamente',
    ], [0, 1, 2, 3],
    'try-catch (captura), finally (siempre), checked (obligan a manejar) y unchecked (RuntimeException) son correctas. El finally corre siempre y las unchecked NO obligan a declararse.'),

  mc('par-t-058', 'Tipos y operadores', 3,
    'El autoboxing en Java es…',
    [
      'La conversión automática entre un primitivo (int) y su clase envoltorio (Integer)',
      'Convertir un objeto en primitivo manualmente con un cast',
      'La creación de un arreglo de objetos',
      'El lanzamiento de una excepción',
    ], 0,
    'El autoboxing convierte automáticamente un primitivo a su wrapper (int → Integer) y el unboxing al revés, lo que permite usar primitivos en colecciones genéricas (que guardan objetos).'),

  tf('par-t-059', 'Tipos y operadores', 3,
    'El autoboxing permite que un int se convierta automáticamente a Integer (y el unboxing al revés), lo que resulta útil al usar colecciones genéricas que solo aceptan objetos.',
    true,
    'Verdadero. Gracias al autoboxing/unboxing se pueden guardar primitivos en estructuras como ArrayList<Integer>, ya que las colecciones genéricas almacenan objetos, no primitivos.'),

  ms('par-t-060', 'Repaso', 3,
    'Repaso: seleccioná TODAS las afirmaciones correctas:',
    [
      'La división entre dos int trunca el decimal',
      'String es inmutable en Java',
      'El bloque finally se ejecuta siempre',
      'Los arrays tienen un tamaño fijo definido al crearse',
      '== compara el contenido de dos String',
      'Los arrays crecen dinámicamente al agregar elementos',
    ], [0, 1, 2, 3],
    'División int trunca, String inmutable, finally siempre y arrays de tamaño fijo son correctas. == compara referencias (no contenido) y los arrays NO crecen (eso es ArrayList).'),
]);
