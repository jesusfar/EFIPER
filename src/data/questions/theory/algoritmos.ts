import { mc, ms, tf, withTopic } from '../builder';

// Banco TEÓRICO (a mano) — Algoritmos y Estructuras de Datos.
// Razonamiento: complejidad/Big-O, estructuras lineales, recursividad,
// búsqueda y ordenamiento.
export const algoritmosTheory = withTopic('algoritmos_estructuras', [
  mc('alg-t-001', 'Complejidad', 3,
    'La notación Big-O describe…',
    [
      'El comportamiento asintótico (cota superior) del costo cuando n crece, ignorando constantes y términos menores',
      'El tiempo exacto en segundos que tarda el algoritmo',
      'La cantidad de líneas de código del algoritmo',
      'El uso de memoria, exclusivamente',
    ], 0,
    'Big-O expresa cómo escala el costo (tiempo o espacio) a medida que crece la entrada, en el peor caso, descartando constantes y términos de menor orden.'),

  mc('alg-t-002', 'Complejidad', 3,
    'Ordená de MENOR a MAYOR crecimiento estas complejidades:',
    [
      'O(1) < O(log n) < O(n) < O(n log n) < O(n²)',
      'O(n²) < O(n log n) < O(n) < O(log n) < O(1)',
      'O(log n) < O(1) < O(n) < O(n²) < O(n log n)',
      'O(n) < O(log n) < O(1) < O(n log n) < O(n²)',
    ], 0,
    'De más eficiente a menos: O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ). Para n grande, log n crece mucho más lento que n.'),

  tf('alg-t-003', 'Complejidad', 2,
    'Un algoritmo O(1) tiene tiempo de ejecución constante, independiente del tamaño de la entrada.',
    true,
    'Verdadero. O(1) significa tiempo constante: tarda lo mismo sin importar n (ej. acceder a un elemento de un arreglo por su índice).'),

  tf('alg-t-004', 'Complejidad', 3,
    'Un algoritmo que realiza 2n operaciones tiene la misma complejidad asintótica que uno O(n), porque en Big-O las constantes se ignoran.',
    true,
    'Verdadero. O(2n) = O(n): las constantes multiplicativas se descartan en Big-O. Ambos crecen linealmente con n.'),

  mc('alg-t-005', 'Complejidad', 3,
    'En Big-O, un algoritmo que ejecuta 3n + 5 operaciones es…',
    [
      'O(n)',
      'O(3n)',
      'O(n + 5)',
      'O(3n + 5)',
    ], 0,
    'Se ignoran las constantes (3) y los términos de menor orden (5): 3n + 5 ⇒ O(n).'),

  mc('alg-t-006', 'Complejidad', 3,
    'Un algoritmo con dos bucles anidados, cada uno de 1 a n, tiene complejidad…',
    [
      'O(n²)',
      'O(n)',
      'O(2n)',
      'O(log n)',
    ], 0,
    'El bucle interno se ejecuta n veces por cada una de las n iteraciones del externo: n × n = n² operaciones ⇒ O(n²).'),

  mc('alg-t-007', 'Complejidad', 3,
    'Un bucle que en cada iteración divide n a la mitad (n, n/2, n/4, …) tiene complejidad…',
    [
      'O(log n)',
      'O(n)',
      'O(n²)',
      'O(1)',
    ], 0,
    'Reducir a la mitad repetidamente da una cantidad logarítmica de pasos: ⇒ O(log n) (la misma idea que la búsqueda binaria).'),

  ms('alg-t-008', 'Complejidad', 3,
    'Seleccioná TODAS las afirmaciones correctas sobre complejidad:',
    [
      'Big-O describe la cota superior del crecimiento del costo',
      'En Big-O se ignoran las constantes y los términos de menor orden',
      'O(n log n) crece más rápido que O(n)',
      'O(1) representa tiempo constante',
      'O(2n) crece más rápido que O(n²)',
      'O(log n) crece más rápido que O(n)',
    ], [0, 1, 2, 3],
    'Big-O = cota superior, ignora constantes; O(n log n) > O(n) y O(1) es constante. Las falsas: O(2n)=O(n) (no supera a O(n²)) y O(log n) crece MÁS LENTO que O(n).'),

  mc('alg-t-009', 'Estructuras lineales', 2,
    'Una pila (stack) sigue la política…',
    [
      'LIFO: el último en entrar es el primero en salir',
      'FIFO: el primero en entrar es el primero en salir',
      'Acceso aleatorio por índice',
      'Ordenada por prioridad',
    ], 0,
    'La pila es LIFO: el último elemento apilado (push) es el primero en salir (pop). La cola, en cambio, es FIFO.'),

  mc('alg-t-010', 'Estructuras lineales', 2,
    'Una cola (queue) sigue la política…',
    [
      'FIFO: el primero en entrar es el primero en salir',
      'LIFO: el último en entrar es el primero en salir',
      'Acceso por clave hash',
      'Ordenada de mayor a menor',
    ], 0,
    'La cola es FIFO: el primero que entra (enqueue) es el primero que sale (dequeue), como una fila de personas.'),

  tf('alg-t-011', 'Estructuras lineales', 2,
    'En una pila (stack), el primer elemento que se agrega es el primero en salir (FIFO).',
    false,
    'Falso. La pila es LIFO: el ÚLTIMO en entrar (push) es el primero en salir (pop). FIFO es la política de la cola, no de la pila.'),

  mc('alg-t-012', 'Estructuras lineales', 2,
    'Una estructura ideal para implementar la función "deshacer" (undo) es…',
    [
      'Una pila (LIFO): la última acción realizada es la primera en deshacerse',
      'Una cola (FIFO)',
      'Un árbol binario',
      'Un grafo',
    ], 0,
    'El "deshacer" revierte primero la acción más reciente: ese comportamiento LIFO es exactamente el de una pila.'),

  mc('alg-t-013', 'Estructuras lineales', 2,
    'Una cola (FIFO) es ideal para…',
    [
      'Gestionar tareas en su orden de llegada (ej. una cola de impresión)',
      'Implementar la función deshacer/rehacer',
      'Buscar nodos en un árbol binario',
      'Acceder a elementos de forma aleatoria por índice',
    ], 0,
    'La cola atiende en orden de llegada (FIFO), ideal para colas de impresión, buffers o el recorrido en anchura (BFS).'),

  mc('alg-t-014', 'Estructuras lineales', 3,
    'En un arreglo, acceder a un elemento por su índice es…',
    [
      'O(1): la dirección se calcula como base + índice × tamaño',
      'O(n): hay que recorrer el arreglo',
      'O(log n)',
      'O(n²)',
    ], 0,
    'Como los elementos son contiguos, la dirección de cualquier índice se calcula directamente: acceso en tiempo constante O(1).'),

  mc('alg-t-015', 'Estructuras lineales', 3,
    'En una lista enlazada, insertar un elemento al inicio es…',
    [
      'O(1): solo se reasignan punteros, sin desplazar elementos',
      'O(n): hay que mover todos los elementos',
      'O(log n)',
      'O(n²)',
    ], 0,
    'Insertar al inicio de una lista enlazada solo crea un nodo y reasigna dos punteros: tiempo constante O(1).'),

  tf('alg-t-016', 'Estructuras lineales', 3,
    'Insertar un elemento al inicio de un arreglo es O(1), porque no hace falta mover los demás elementos.',
    false,
    'Falso. Insertar al INICIO de un arreglo es O(n): hay que desplazar todos los elementos una posición para hacer lugar. En una lista enlazada sí sería O(1).'),

  ms('alg-t-017', 'Estructuras lineales', 3,
    'Seleccioná TODAS las afirmaciones correctas sobre estructuras lineales:',
    [
      'La pila (stack) es LIFO',
      'La cola (queue) es FIFO',
      'El arreglo permite acceso O(1) por índice',
      'La lista enlazada inserta/elimina al inicio en O(1)',
      'La cola (queue) es LIFO',
      'El arreglo permite insertar al inicio en O(1)',
    ], [0, 1, 2, 3],
    'Pila LIFO, cola FIFO, arreglo O(1) por índice y lista enlazada O(1) al inicio son correctas. La cola NO es LIFO y el arreglo NO inserta al inicio en O(1) (es O(n)).'),

  ms('alg-t-018', 'Estructuras lineales', 3,
    'Seleccioná TODAS las ventajas del ARREGLO frente a la lista enlazada:',
    [
      'Acceso directo O(1) por índice',
      'Elementos contiguos en memoria (buena localidad de caché)',
      'Menor overhead de memoria (no almacena punteros)',
      'Insertar al inicio en O(1) sin desplazar elementos',
      'Crecer dinámicamente sin reservar un tamaño previo',
      'Eliminar del medio en O(1) sin recorrer la estructura',
    ], [0, 1, 2],
    'El arreglo gana en acceso por índice, localidad de caché y menor overhead. Las tres falsas son justamente ventajas de la LISTA ENLAZADA (inserción/eliminación y crecimiento dinámico).'),

  mc('alg-t-019', 'Recursividad', 2,
    'Una función recursiva debe tener obligatoriamente…',
    [
      'Un caso base que detenga la recursión',
      'Al menos dos parámetros',
      'Un bucle for interno',
      'Una variable global',
    ], 0,
    'Sin un caso base, las llamadas no terminan y se produce un desbordamiento de pila (stack overflow). El caso base corta la cadena de llamadas.'),

  tf('alg-t-020', 'Recursividad', 2,
    'La recursión usa la pila de llamadas; sin un caso base, se produce un desbordamiento de pila (stack overflow).',
    true,
    'Verdadero. Cada llamada recursiva apila un marco; si nunca se alcanza el caso base, la pila se llena y ocurre el stack overflow.'),

  mc('alg-t-021', 'Recursividad', 3,
    '¿Cuál es el caso base correcto de una función recursiva para calcular n! (factorial)?',
    [
      'Si n == 0 (o 1), devolver 1',
      'Si n == 0, devolver 0',
      'Si n < 0, devolver n',
      'No necesita caso base',
    ], 0,
    'Por definición 0! = 1 (y 1! = 1): ese es el caso base que detiene la recursión. Devolver 0 daría siempre 0, y sin caso base la recursión no terminaría.'),

  mc('alg-t-022', 'Recursividad', 3,
    '¿Qué afirmación sobre recursión e iteración es correcta?',
    [
      'Todo algoritmo recursivo puede expresarse de forma iterativa (usando una pila explícita si hace falta)',
      'La recursión siempre es más eficiente que la iteración',
      'La iteración no puede resolver problemas que se plantean recursivamente',
      'La recursión no consume memoria adicional',
    ], 0,
    'Recursión e iteración son equivalentes en poder de cómputo. La recursión es más expresiva en algunos casos, pero consume pila; la iteración suele ser más eficiente en memoria.'),

  mc('alg-t-023', 'Búsqueda', 2,
    'La búsqueda lineal tiene complejidad…',
    [
      'O(n) en el peor caso (recorre todos los elementos)',
      'O(log n)',
      'O(1)',
      'O(n²)',
    ], 0,
    'La búsqueda lineal compara uno a uno hasta encontrar el elemento o llegar al final: en el peor caso recorre los n elementos ⇒ O(n).'),

  mc('alg-t-024', 'Búsqueda', 2,
    'La búsqueda binaria requiere que el arreglo…',
    [
      'Esté ordenado',
      'Esté desordenado',
      'Tenga una cantidad par de elementos',
      'No contenga elementos duplicados',
    ], 0,
    'La búsqueda binaria descarta una mitad en cada paso comparando con el elemento central, lo que solo es válido si el arreglo está ordenado.'),

  mc('alg-t-025', 'Búsqueda', 3,
    'La complejidad de la búsqueda binaria es…',
    [
      'O(log n)',
      'O(n)',
      'O(n log n)',
      'O(1)',
    ], 0,
    'En cada comparación descarta la mitad de los elementos, por lo que la cantidad de pasos crece logarítmicamente ⇒ O(log n).'),

  mc('alg-t-026', 'Búsqueda', 3,
    '¿Cuántas comparaciones hace como máximo una búsqueda binaria sobre 1000 elementos ordenados?',
    [
      '10',
      '1000',
      '500',
      '100',
    ], 0,
    'Peor caso ≈ ⌈log₂(n)⌉. Como 2⁹ = 512 y 2¹⁰ = 1024, log₂(1000) ≈ 9,97 ⇒ 10 comparaciones.'),

  tf('alg-t-027', 'Búsqueda', 3,
    'La búsqueda binaria funciona correctamente sobre un arreglo desordenado, igual que la búsqueda lineal.',
    false,
    'Falso. La búsqueda binaria EXIGE que el arreglo esté ordenado (descarta mitades comparando con el central). La que funciona sobre datos desordenados es la búsqueda lineal.'),

  mc('alg-t-028', 'Ordenamiento', 2,
    'El BubbleSort tiene complejidad…',
    [
      'O(n²) en el peor caso',
      'O(n log n)',
      'O(log n)',
      'O(n)',
    ], 0,
    'BubbleSort compara e intercambia pares adyacentes en bucles anidados ⇒ O(n²). Es simple pero ineficiente para n grande.'),

  mc('alg-t-029', 'Ordenamiento', 3,
    'MergeSort se caracteriza por…',
    [
      'Usar "divide y vencerás" y garantizar O(n log n) incluso en el peor caso',
      'Tener complejidad O(n²) siempre',
      'No usar memoria adicional',
      'No poder ordenar números',
    ], 0,
    'MergeSort divide el arreglo en mitades, las ordena recursivamente y las combina (merge); garantiza O(n log n), a costa de O(n) de memoria extra.'),

  ms('alg-t-030', 'Ordenamiento', 3,
    'Seleccioná TODAS las afirmaciones correctas sobre búsqueda y ordenamiento:',
    [
      'La búsqueda lineal es O(n)',
      'La búsqueda binaria es O(log n) sobre datos ordenados',
      'MergeSort es O(n log n)',
      'BubbleSort es O(n²) en el peor caso',
      'La búsqueda binaria es O(n)',
      'BubbleSort es O(log n)',
    ], [0, 1, 2, 3],
    'Lineal O(n), binaria O(log n), MergeSort O(n log n) y BubbleSort O(n²) son correctas. Las dos falsas asignan complejidades equivocadas a la binaria y al BubbleSort.'),
]);
