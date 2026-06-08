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

  mc('alg-t-031', 'Árboles', 2,
    'Un árbol binario es una estructura donde cada nodo tiene…',
    [
      'A lo sumo dos hijos (un hijo izquierdo y uno derecho)',
      'Exactamente dos hijos, siempre',
      'Cualquier cantidad de hijos',
      'Como máximo un hijo',
    ], 0,
    'En un árbol binario cada nodo tiene 0, 1 o 2 hijos (izquierdo y/o derecho). "A lo sumo dos" es la clave; no está obligado a tener exactamente dos.'),

  mc('alg-t-032', 'Árboles', 3,
    'En un Árbol Binario de Búsqueda (BST), para cada nodo…',
    [
      'Los nodos del subárbol izquierdo son menores y los del derecho mayores',
      'Los nodos del subárbol izquierdo son mayores y los del derecho menores',
      'No existe ningún orden entre los nodos',
      'Todos los hijos tienen el mismo valor que el padre',
    ], 0,
    'La propiedad del BST (izquierda < nodo < derecha) permite buscar descartando mitades, de forma similar a la búsqueda binaria.'),

  mc('alg-t-033', 'Árboles', 3,
    'En un BST balanceado, la búsqueda tiene complejidad…',
    [
      'O(log n)',
      'O(n)',
      'O(1)',
      'O(n²)',
    ], 0,
    'En un BST balanceado la altura es ~log n, así que cada búsqueda descarta la mitad del árbol en cada nivel ⇒ O(log n).'),

  tf('alg-t-034', 'Árboles', 3,
    'Un BST garantiza siempre búsquedas en O(log n), sin importar el orden en que se inserten los elementos.',
    false,
    'Falso. Si se insertan los elementos ya ordenados, el BST degenera en una lista y la búsqueda pasa a O(n). Solo un BST BALANCEADO (AVL, rojo-negro) garantiza O(log n).'),

  mc('alg-t-035', 'Árboles', 3,
    'Un árbol AVL es…',
    [
      'Un BST auto-balanceado que mantiene la altura en O(log n) mediante rotaciones',
      'Un árbol sin ningún orden entre sus nodos',
      'Una lista enlazada doble',
      'Un grafo con ciclos',
    ], 0,
    'El AVL es un BST que, tras cada inserción/eliminación, se rebalancea con rotaciones para evitar degenerar, manteniendo las operaciones en O(log n).'),

  tf('alg-t-036', 'Árboles', 3,
    'El balanceo de un árbol (por ejemplo, AVL o rojo-negro) evita que degenere en una lista, manteniendo las operaciones en O(log n).',
    true,
    'Verdadero. Las rotaciones de rebalanceo controlan la altura del árbol; así la búsqueda, inserción y borrado se mantienen logarítmicas aun en el peor caso.'),

  mc('alg-t-037', 'Árboles', 3,
    'El recorrido EN-ORDEN (inorder) de un BST visita los nodos…',
    [
      'En orden ascendente (izquierdo → raíz → derecho)',
      'En orden descendente',
      'Por niveles, de arriba hacia abajo',
      'Sin ningún orden definido',
    ], 0,
    'Por la propiedad del BST, recorrer izquierdo → raíz → derecho devuelve los valores ordenados de menor a mayor.'),

  mc('alg-t-038', 'Árboles', 3,
    '¿Cuál es el orden del recorrido PREORDEN (preorder)?',
    [
      'Raíz → izquierdo → derecho',
      'Izquierdo → raíz → derecho',
      'Izquierdo → derecho → raíz',
      'Por niveles',
    ], 0,
    'El preorden visita primero la raíz y luego los subárboles izquierdo y derecho. (Inorden = izq, raíz, der; postorden = izq, der, raíz).'),

  ms('alg-t-039', 'Árboles', 3,
    'Seleccioná TODAS las afirmaciones correctas sobre los recorridos de árboles:',
    [
      'Inorden: izquierdo → raíz → derecho (da orden ascendente en un BST)',
      'Preorden: raíz → izquierdo → derecho',
      'Postorden: izquierdo → derecho → raíz',
      'El recorrido por niveles (BFS) usa una cola',
      'El inorden de un BST produce los elementos en orden descendente',
      'El preorden visita la raíz al final del recorrido',
    ], [0, 1, 2, 3],
    'Inorden (ascendente), preorden (raíz primero), postorden (raíz al final) y niveles (con cola) son correctas. El inorden da orden ASCENDENTE y el preorden visita la raíz PRIMERO.'),

  mc('alg-t-040', 'Heaps', 3,
    'Un heap (montículo) binario es…',
    [
      'Un árbol binario completo donde cada padre cumple una relación de orden con sus hijos (en un max-heap, padre ≥ hijos)',
      'Un árbol sin ningún orden',
      'Una lista totalmente ordenada',
      'Un grafo con ciclos',
    ], 0,
    'El heap es un árbol binario completo con propiedad de orden parcial (max-heap: cada padre ≥ sus hijos; min-heap: ≤). No está totalmente ordenado como un BST.'),

  mc('alg-t-041', 'Heaps', 3,
    'Un heap es la estructura típica para implementar…',
    [
      'Una cola de prioridad (extraer el máximo/mínimo de forma eficiente)',
      'Una pila LIFO',
      'Una tabla hash',
      'Un grafo dirigido',
    ], 0,
    'El heap permite obtener el elemento de mayor (o menor) prioridad en la raíz y reorganizarse en O(log n), ideal para una cola de prioridad.'),

  mc('alg-t-042', 'Heaps', 3,
    'En un heap binario, insertar un elemento o extraer el máximo tiene complejidad…',
    [
      'O(log n)',
      'O(1)',
      'O(n)',
      'O(n log n)',
    ], 0,
    'Tras insertar o extraer la raíz, el heap se "reordena" subiendo/bajando el elemento a través de la altura del árbol (log n) ⇒ O(log n).'),

  mc('alg-t-043', 'Tablas hash', 3,
    'Una tabla hash ofrece, en promedio, búsqueda e inserción con complejidad…',
    [
      'O(1)',
      'O(n)',
      'O(log n)',
      'O(n²)',
    ], 0,
    'Con una buena función hash y pocas colisiones, el índice se calcula directamente: acceso promedio en tiempo constante O(1).'),

  mc('alg-t-044', 'Tablas hash', 3,
    'Una colisión en una tabla hash ocurre cuando…',
    [
      'Dos claves distintas producen el mismo índice (mismo valor de hash)',
      'La tabla se queda sin espacio',
      'No se define ninguna función hash',
      'Dos claves son exactamente iguales',
    ], 0,
    'La función hash mapea muchas claves a un rango finito de cubetas; cuando dos claves distintas caen en la misma posición, hay colisión.'),

  mc('alg-t-045', 'Tablas hash', 3,
    'Una técnica para resolver colisiones en una tabla hash es…',
    [
      'El encadenamiento (chaining): guardar en cada cubeta una lista de los elementos que colisionan',
      'Borrar la clave que estaba antes',
      'Ordenar toda la tabla en cada inserción',
      'Convertir la tabla en un árbol AVL completo',
    ], 0,
    'El encadenamiento guarda una lista por cubeta; el direccionamiento abierto (sondeo lineal/cuadrático) busca otra posición libre. Ambas resuelven colisiones.'),

  tf('alg-t-046', 'Tablas hash', 3,
    'En el peor caso, la búsqueda en una tabla hash con muchas colisiones puede degradar de O(1) a O(n).',
    true,
    'Verdadero. En PROMEDIO es O(1), pero si la función hash es mala o la tabla está saturada, muchos elementos caen en la misma cubeta y la búsqueda recorre esa lista: O(n).'),

  ms('alg-t-047', 'Estructuras', 3,
    'Seleccioná TODAS las afirmaciones correctas sobre tablas hash y heaps:',
    [
      'La tabla hash ofrece O(1) en promedio para búsqueda/inserción',
      'Las colisiones se resuelven con encadenamiento o direccionamiento abierto',
      'Un heap binario es un árbol binario completo',
      'Extraer el máximo de un max-heap es O(log n)',
      'La tabla hash garantiza O(1) en el peor caso, siempre',
      'Un heap mantiene todos sus elementos totalmente ordenados como un BST',
    ], [0, 1, 2, 3],
    'Hash O(1) promedio, colisiones por chaining/open addressing, heap = árbol completo y extraer máx O(log n) son correctas. El hash no garantiza O(1) en el peor caso y el heap no está totalmente ordenado.'),

  mc('alg-t-048', 'Grafos', 2,
    'Un grafo es…',
    [
      'Un conjunto de nodos (vértices) conectados por aristas',
      'Un árbol que nunca tiene ciclos',
      'Una lista enlazada circular',
      'Una tabla hash con colisiones',
    ], 0,
    'El grafo modela relaciones: vértices unidos por aristas (dirigidas o no). A diferencia del árbol, puede tener ciclos y múltiples caminos entre nodos.'),

  mc('alg-t-049', 'Grafos', 3,
    'Dos formas habituales de representar un grafo son…',
    [
      'Matriz de adyacencia y lista de adyacencia',
      'Pila y cola',
      'Heap y tabla hash',
      'Únicamente arreglos de enteros',
    ], 0,
    'La matriz de adyacencia (V×V) y la lista de adyacencia (vecinos por vértice) son las dos representaciones clásicas, con distinto compromiso espacio/tiempo.'),

  mc('alg-t-050', 'Grafos', 3,
    'La matriz de adyacencia es eficiente para…',
    [
      'Consultar en O(1) si existe una arista entre dos nodos, pero usa O(V²) de espacio',
      'Representar grafos muy dispersos ahorrando memoria',
      'Recorrer los vecinos de un nodo sin usar espacio extra',
      'Almacenar grafos enormes con poca memoria',
    ], 0,
    'La matriz responde "¿hay arista u→v?" en O(1), pero ocupa O(V²) aunque haya pocas aristas; para grafos dispersos conviene la lista de adyacencia.'),

  mc('alg-t-051', 'Grafos', 3,
    'El recorrido en anchura (BFS) de un grafo usa…',
    [
      'Una cola, y explora el grafo por niveles',
      'Una pila',
      'Un heap',
      'Una tabla hash',
    ], 0,
    'BFS usa una cola (FIFO): visita primero todos los vecinos del nodo actual (un nivel) antes de avanzar al siguiente. Útil para el camino más corto en aristas.'),

  mc('alg-t-052', 'Grafos', 3,
    'El recorrido en profundidad (DFS) usa…',
    [
      'Una pila (o recursión), explorando lo más profundo posible antes de retroceder',
      'Una cola',
      'Un heap binario',
      'Una matriz de adyacencia',
    ], 0,
    'DFS avanza por un camino hasta el final y retrocede (backtracking); se implementa con una pila explícita o con la pila de recursión.'),

  tf('alg-t-053', 'Grafos', 3,
    'El recorrido en anchura (BFS) utiliza una pila para explorar el grafo.',
    false,
    'Falso. BFS usa una COLA (FIFO) y explora por niveles. La pila (o la recursión) es la que utiliza el recorrido en profundidad (DFS).'),

  ms('alg-t-054', 'Grafos', 3,
    'Seleccioná TODAS las afirmaciones correctas sobre grafos:',
    [
      'Un grafo está formado por vértices y aristas',
      'Se puede representar con matriz o lista de adyacencia',
      'BFS (anchura) usa una cola y explora por niveles',
      'DFS (profundidad) usa una pila o recursión',
      'BFS utiliza una pila para explorar',
      'La matriz de adyacencia es la opción más eficiente en memoria para grafos muy dispersos',
    ], [0, 1, 2, 3],
    'Vértices/aristas, matriz o lista, BFS con cola y DFS con pila son correctas. BFS no usa pila (eso es DFS) y para grafos dispersos conviene la LISTA de adyacencia, no la matriz.'),

  mc('alg-t-055', 'Ordenamiento', 3,
    'QuickSort tiene complejidad promedio…',
    [
      'O(n log n)',
      'O(n²)',
      'O(n)',
      'O(log n)',
    ], 0,
    'En promedio, QuickSort particiona en mitades equilibradas, dando O(n log n). Su rendimiento real suele ser excelente por sus constantes bajas.'),

  mc('alg-t-056', 'Ordenamiento', 3,
    'El PEOR caso de QuickSort es…',
    [
      'O(n²), cuando el pivote se elige mal (p. ej. siempre el menor/mayor sobre datos ya ordenados)',
      'O(n log n)',
      'O(n)',
      'O(1)',
    ], 0,
    'Si el pivote deja particiones muy desbalanceadas (una vacía y otra con n−1), la recursión degenera y el costo sube a O(n²).'),

  tf('alg-t-057', 'Ordenamiento', 3,
    'QuickSort garantiza O(n log n) en todos los casos, igual que MergeSort.',
    false,
    'Falso. QuickSort es O(n log n) en PROMEDIO, pero su peor caso es O(n²). El que garantiza O(n log n) incluso en el peor caso es MergeSort.'),

  tf('alg-t-058', 'Ordenamiento', 3,
    'Un algoritmo de ordenamiento estable mantiene el orden relativo de los elementos que tienen claves iguales.',
    true,
    'Verdadero. La estabilidad importa al ordenar por una clave conservando un orden previo (ej. ordenar por apellido manteniendo el orden por nombre de los homónimos).'),

  mc('alg-t-059', 'Ordenamiento', 3,
    'Un algoritmo de ordenamiento "in-place"…',
    [
      'Ordena usando una cantidad de memoria adicional constante O(1)',
      'Requiere O(n) de memoria extra para una copia',
      'No modifica el arreglo original',
      'Es siempre estable',
    ], 0,
    'In-place significa que reordena dentro del propio arreglo con memoria extra constante (ej. QuickSort). MergeSort, en cambio, necesita O(n) extra y no es in-place.'),

  ms('alg-t-060', 'Ordenamiento', 3,
    'Seleccioná TODAS las afirmaciones correctas sobre ordenamiento avanzado:',
    [
      'QuickSort es O(n log n) en promedio y O(n²) en el peor caso',
      'MergeSort garantiza O(n log n) incluso en el peor caso',
      'MergeSort es un algoritmo estable',
      'QuickSort suele implementarse in-place (poca memoria extra)',
      'QuickSort garantiza O(n log n) en todos los casos',
      'MergeSort ordena sin requerir memoria adicional',
    ], [0, 1, 2, 3],
    'QuickSort (promedio n log n, peor n², in-place) y MergeSort (n log n garantizado, estable) son correctas. QuickSort no garantiza n log n siempre y MergeSort sí necesita O(n) de memoria extra.'),
]);
