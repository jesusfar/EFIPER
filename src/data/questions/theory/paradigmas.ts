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
]);
