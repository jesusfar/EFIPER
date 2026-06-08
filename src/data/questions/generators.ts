import type { Question, Topic } from '../../types';
import { mc, tf, withTopic } from './builder';

// ── Generadores de preguntas (cálculo / aplicación) ──
// Enumeran espacios de parámetros grandes e INTERCALAN varias plantillas. Las
// preguntas están pensadas para OBLIGAR A RAZONAR: la respuesta "obvia" o de un
// solo paso suele quedar como distractor-trampa. La opción correcta queda
// primera acá; el banco (index.ts) baraja las opciones.

type Q = Omit<Question, 'topic'>;

/** Intercala varias listas en round-robin para mezclar plantillas al cortar. */
function interleave(...lists: Q[][]): Q[] {
  const out: Q[] = [];
  const max = Math.max(0, ...lists.map((l) => l.length));
  for (let i = 0; i < max; i++) for (const l of lists) if (i < l.length) out.push(l[i]);
  return out;
}

/** 4 opciones numéricas únicas y NO NEGATIVAS: correcta + distractores. */
function num4(correct: number, d: number[]): string[] {
  const set = [String(correct)];
  for (const x of d) { const s = String(x); if (!set.includes(s) && Number(x) >= 0) set.push(s); if (set.length === 4) break; }
  let k = 1;
  while (set.length < 4) { const s = String(correct + k); if (!set.includes(s)) set.push(s); k++; }
  return set;
}

/** 4 opciones únicas a partir de candidatos arbitrarios (admite negativos/strings). */
function opts4(correct: number | string, cands: Array<number | string>): string[] {
  const set = [String(correct)];
  for (const c of cands) { const s = String(c); if (!set.includes(s)) set.push(s); if (set.length === 4) break; }
  let k = 1;
  while (set.length < 4) { const s = String(Number(correct) + k * 7); if (!set.includes(s)) set.push(s); k++; }
  return set;
}

const clog2 = (n: number) => Math.ceil(Math.log2(n));

// ────────────────────────── REDES ──────────────────────────
// Razonamiento de subnetting: cálculos inversos (bits prestados) y dirección de
// red de un host. La trampa es responder el número dado o saltear el ⌈log₂⌉.

function genRedes(): Question[] {
  // Bits a pedir prestados para obtener AL MENOS N subredes ⇒ ⌈log₂(N)⌉.
  const borrowSub: Q[] = [];
  for (let n = 3; n <= 160; n++) {
    const bits = clog2(n);
    borrowSub.push(mc(`gen-red-bsub-${n}`, 'Subnetting', 3,
      `Necesitás dividir una red en AL MENOS ${n} subredes. ¿Cuántos bits hay que pedirle prestados a la porción de host?`,
      num4(bits, [n, bits - 1, bits + 1]), 0,
      `Con b bits prestados se obtienen 2^b subredes; hace falta 2^b ≥ ${n} ⇒ b = ⌈log₂(${n})⌉ = ${bits} (2^${bits} = ${2 ** bits}).`));
  }
  // Bits de host necesarios para alojar AL MENOS H hosts utilizables ⇒ ⌈log₂(H+2)⌉.
  const borrowHost: Q[] = [];
  for (let h = 2; h <= 160; h++) {
    const bits = clog2(h + 2);
    borrowHost.push(mc(`gen-red-bhost-${h}`, 'Subnetting', 3,
      `Cada subred debe alojar AL MENOS ${h} hosts utilizables. ¿Cuántos bits de host se necesitan como mínimo?`,
      num4(bits, [clog2(h), h, bits + 1]), 0,
      `Con b bits de host hay 2^b − 2 direcciones utilizables; se necesita 2^b − 2 ≥ ${h} ⇒ 2^b ≥ ${h + 2} ⇒ b = ⌈log₂(${h + 2})⌉ = ${bits} (2^${bits} − 2 = ${2 ** bits - 2} utilizables).`));
  }
  // Cuántas subredes /X salen de una red /Y ⇒ 2^(X−Y).
  const subnetsIn: Q[] = [];
  let si = 0;
  for (const y of [8, 16, 22, 24]) for (let x = y + 1; x <= y + 8 && x <= 30; x++) {
    si++;
    const n = 2 ** (x - y);
    subnetsIn.push(mc(`gen-red-subin-${si}`, 'Subnetting', 3,
      `¿Cuántas subredes /${x} se pueden crear a partir de una red /${y}?`,
      num4(n, [x - y, 2 ** (x - y + 1), x + y]), 0,
      `De /${y} a /${x} se prestan X−Y = ${x}−${y} = ${x - y} bits del host, y con ${x - y} bits hay 2^${x - y} = ${n} subredes.`));
  }
  // Dirección de RED de un host dado su prefijo (bloque dentro del último octeto).
  const netAddr: Q[] = [];
  let na = 0;
  for (const p of [25, 26, 27, 28]) {
    const block = 2 ** (32 - p);
    for (let host = 1; host <= 254 && na < 90; host++) {
      if (host % block === 0 || host % block === block - 1) continue; // host interior
      na++;
      const net = Math.floor(host / block) * block;
      const bcast = net + block - 1;
      const other = net + block <= 255 ? net + block : net - block;
      netAddr.push(mc(`gen-red-net-${p}-${host}`, 'Subnetting', 3,
        `El host 192.168.10.${host} usa la máscara /${p}. ¿Cuál es su dirección de RED (subred)?`,
        [`192.168.10.${net}`, `192.168.10.${host}`, `192.168.10.${bcast}`, `192.168.10.${other}`], 0,
        `/${p} crea bloques de ${block} direcciones. ${host} cae en el bloque que arranca en ⌊${host}/${block}⌋×${block} = ${net}, así que la red es 192.168.10.${net} (y el broadcast .${bcast}).`));
    }
  }
  // Tiempo de transferencia (la trampa: olvidar el ×8 de MB→Mb).
  const tput: Q[] = [];
  let ti = 0;
  for (const mb of [10, 20, 50, 100, 200, 500]) for (const mbps of [10, 20, 50, 100]) {
    ti++;
    const s = Math.round((mb * 8 / mbps) * 10) / 10;
    tput.push(mc(`gen-red-tput-${ti}`, 'Rendimiento', 3,
      `¿Cuánto tarda en transferirse un archivo de ${mb} MB por un enlace de ${mbps} Mbps (ideal)?`,
      num4(s, [mb / mbps, s * 2, s / 2]).map((o) => `${o} s`), 0,
      `Primero se pasa de bytes a bits: ${mb} MB = ${mb * 8} Mb (×8). Tiempo = ${mb * 8} Mb / ${mbps} Mbps = ${s} s.`));
  }
  return withTopic('redes_comunicaciones', interleave(borrowSub, borrowHost, subnetsIn, netAddr, tput));
}

// ──────────────────────── ARQUITECTURA ────────────────────────
// Complemento a 2 (trampa: leer sin signo), líneas de dirección para N celdas
// (⌈log₂⌉ inverso), tiempo de CPU y capacidad en bytes (trampa: bits vs bytes).

function genArquitectura(): Question[] {
  // Complemento a 2: patrón con MSB=1 ⇒ negativo. Trampa: el valor sin signo.
  const tc: Q[] = [];
  for (let n = 129; n <= 255; n++) {
    const b = n.toString(2).padStart(8, '0');
    const signed = n - 256;
    tc.push(mc(`gen-arq-tc-${n}`, 'Representación', 3,
      `El patrón binario ${b} (8 bits) interpretado en COMPLEMENTO A 2, ¿qué número decimal representa?`,
      opts4(signed, [n, n - 128, 256 - n]), 0,
      `El bit más significativo es 1, así que en complemento a 2 el número es negativo: ${b} = ${n} − 256 = ${signed}.`));
  }
  // Líneas de dirección para AL MENOS N celdas ⇒ ⌈log₂(N)⌉. Trampa: N o sin ⌈⌉.
  const addrFor: Q[] = [];
  let ai = 0;
  for (let n = 100; n <= 2100; n += 9) {
    ai++;
    const bits = clog2(n);
    addrFor.push(mc(`gen-arq-addr-${ai}`, 'Memoria', 3,
      `¿Cuántas líneas de dirección se necesitan para poder direccionar AL MENOS ${n} celdas de memoria?`,
      num4(bits, [bits - 1, n, bits + 1]), 0,
      `Con k líneas se direccionan 2^k celdas; hace falta 2^k ≥ ${n} ⇒ k = ⌈log₂(${n})⌉ = ${bits}, ya que 2^${bits} = ${2 ** bits} ≥ ${n}.`));
  }
  // Tiempo de CPU = (instrucciones × CPI) / frecuencia.
  const cpu: Q[] = [];
  let ci = 0;
  for (const mips of [2, 3, 4, 5, 6, 8]) for (const cpi of [1, 2, 3, 4]) for (const ghz of [1, 2, 4]) {
    ci++;
    const ms = Math.round((mips * 1e6 * cpi / (ghz * 1e9)) * 1000 * 100) / 100;
    cpu.push(mc(`gen-arq-cpu-${ci}`, 'Rendimiento de CPU', 3,
      `Un programa ejecuta ${mips} millones de instrucciones con CPI=${cpi} en una CPU de ${ghz} GHz. ¿Tiempo de CPU?`,
      num4(ms, [Math.round((mips / ghz) * 100) / 100, ms * 2, ms / 2]).map((o) => `${o} ms`), 0,
      `Tiempo = (Instrucciones × CPI) / Frecuencia = (${mips}M × ${cpi}) / ${ghz}GHz = ${ms} ms.`));
  }
  // Capacidad en BYTES = (2^K × W) / 8. Trampa: dar bits, o ignorar el ancho.
  const cap: Q[] = [];
  let pi = 0;
  for (let k = 8; k <= 16; k++) for (const w of [8, 16, 32]) {
    pi++;
    const cells = 2 ** k;
    const bytes = cells * w / 8;
    cap.push(mc(`gen-arq-cap-${pi}`, 'Memoria', 3,
      `Una memoria tiene ${k} líneas de dirección y palabras de ${w} bits. ¿Cuál es su capacidad en BYTES?`,
      num4(bytes, [cells, cells * w, bytes * 2]), 0,
      `Celdas = 2^${k} = ${cells.toLocaleString('es')}; cada una guarda ${w} bits = ${w / 8} byte(s). Capacidad = ${cells.toLocaleString('es')} × ${w}/8 = ${bytes.toLocaleString('es')} bytes.`));
  }
  return withTopic('arquitectura_computadoras', interleave(tc, addrFor, cpu, cap));
}

// ──────────────────────── ALGORITMOS ────────────────────────
// Comparaciones de búsqueda binaria (directo e inverso), comparaciones de
// BubbleSort (trampa n²), altura mínima de un árbol y complejidad de bucles.

function genAlgoritmos(): Question[] {
  // Búsqueda binaria: comparaciones en el peor caso ⇒ ⌈log₂(n+1)⌉. Trampa n/2.
  const bs: Q[] = [];
  for (let n = 8; n <= 250; n++) {
    const c = clog2(n + 1);
    bs.push(mc(`gen-alg-bs-${n}`, 'Complejidad', 3,
      `¿Cuántas comparaciones hace en el PEOR caso una búsqueda binaria sobre ${n} elementos ordenados?`,
      num4(c, [Math.ceil(n / 2), c + 1, c - 1]), 0,
      `Cada comparación descarta la mitad de los elementos restantes ⇒ peor caso ⌈log₂(${n}+1)⌉ = ${c} comparaciones.`));
  }
  // Inverso: con k comparaciones, ¿cuántos elementos como máximo? ⇒ 2^k − 1.
  const inv: Q[] = [];
  for (let k = 3; k <= 16; k++) {
    const n = 2 ** k - 1;
    inv.push(mc(`gen-alg-inv-${k}`, 'Complejidad', 3,
      `Con ${k} comparaciones, ¿sobre cuántos elementos como máximo garantiza una búsqueda binaria encontrar (o descartar) el dato?`,
      num4(n, [2 ** k, k * k, 2 ** (k - 1)]), 0,
      `Con k comparaciones se puede cubrir un arreglo de hasta 2^k − 1 elementos ⇒ 2^${k} − 1 = ${n}.`));
  }
  // BubbleSort: comparaciones en el peor caso ⇒ n(n−1)/2. Trampa: n².
  const bub: Q[] = [];
  for (let n = 4; n <= 44; n++) {
    const comp = n * (n - 1) / 2;
    bub.push(mc(`gen-alg-bub-${n}`, 'Ordenamiento', 3,
      `¿Cuántas comparaciones realiza BubbleSort en el PEOR caso sobre ${n} elementos?`,
      num4(comp, [n * n, n * (n - 1), n], ), 0,
      `BubbleSort compara cada par de elementos: n(n−1)/2 = ${n}×${n - 1}/2 = ${comp} comparaciones (del orden de O(n²)).`));
  }
  // Altura MÍNIMA de un árbol binario con n nodos ⇒ ⌈log₂(n+1)⌉ − 1.
  const minH: Q[] = [];
  for (let n = 3; n <= 63; n++) {
    const h = clog2(n + 1) - 1;
    minH.push(mc(`gen-alg-minh-${n}`, 'Árboles', 3,
      `¿Cuál es la altura MÍNIMA posible de un árbol binario con ${n} nodos (raíz en altura 0)?`,
      num4(h, [h + 1, n, n - 1]), 0,
      `Un árbol lo más balanceado posible tiene altura ⌈log₂(n+1)⌉ − 1 = ⌈log₂(${n + 1})⌉ − 1 = ${h}.`));
  }
  // Complejidad de patrones de bucles (conceptual).
  const bigo: Q[] = [];
  const cases: [string, string, string][] = [
    ['un bucle simple sobre n', 'O(n)', 'Un único recorrido lineal.'],
    ['dos bucles anidados sobre n', 'O(n²)', 'Cada anidamiento multiplica por n.'],
    ['tres bucles anidados sobre n', 'O(n³)', 'Tres anidamientos.'],
    ['un bucle que en cada paso divide n a la mitad', 'O(log n)', 'Reducción a la mitad ⇒ logarítmico.'],
    ['un bucle externo de n que adentro divide el rango a la mitad', 'O(n log n)', 'Trabajo lineal por nivel logarítmico.'],
  ];
  const pool = ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)', 'O(n³)'];
  cases.forEach(([desc, ans, exp], k) => {
    const o = [ans, ...pool.filter((x) => x !== ans)].slice(0, 4);
    bigo.push(mc(`gen-alg-bigo-${k}`, 'Complejidad', 2,
      `¿Cuál es la complejidad temporal de un algoritmo con ${desc}?`, o, 0, exp));
  });
  return withTopic('algoritmos_estructuras', interleave(bs, inv, bub, minH, bigo));
}

// ──────────────────── SISTEMAS OPERATIVOS ────────────────────
// Marcos de página (⌈⌉ + fragmentación), planificación FIFO/SJF (con la trampa
// del orden) y fragmentación interna.

function genSistemasOperativos(): Question[] {
  const pages: Q[] = [];
  let pi = 0;
  for (let proc = 10; proc <= 300; proc += 10) for (const pg of [4, 8, 16]) {
    pi++;
    const n = Math.ceil(proc / pg);
    pages.push(mc(`gen-so-page-${pi}`, 'Memoria virtual', 3,
      `Un proceso de ${proc} KB se carga con páginas de ${pg} KB. ¿Cuántos marcos de página necesita?`,
      num4(n, [Math.floor(proc / pg), n + 1, n - 1]), 0,
      `Marcos = ⌈${proc}/${pg}⌉ = ${n}. Se redondea hacia arriba porque la última página, aunque quede parcialmente usada, ocupa un marco entero.`));
  }
  // Fragmentación interna = marcos×página − tamaño del proceso.
  const frag: Q[] = [];
  let fi = 0;
  for (let proc = 10; proc <= 250; proc += 9) for (const pg of [4, 8, 16]) {
    if (proc % pg === 0) continue; // sin fragmentación no es interesante
    fi++;
    const n = Math.ceil(proc / pg);
    const waste = n * pg - proc;
    frag.push(mc(`gen-so-frag-${fi}`, 'Memoria virtual', 3,
      `Un proceso de ${proc} KB usa páginas de ${pg} KB. ¿Cuánta memoria se desperdicia por fragmentación INTERNA en la última página?`,
      num4(waste, [0, pg, proc % pg]), 0,
      `Necesita ⌈${proc}/${pg}⌉ = ${n} marcos = ${n * pg} KB asignados; el proceso usa ${proc} KB ⇒ se desperdician ${n * pg} − ${proc} = ${waste} KB en la última página.`));
  }
  const fifoWait: Q[] = [], sjfWait: Q[] = [];
  let si = 0;
  for (const a of [2, 3, 4, 5, 6]) for (const b of [3, 4, 6, 8]) for (const c of [2, 5, 7]) {
    si++;
    // FIFO en el orden dado: esperas 0, a, a+b.
    const fAvg = Math.round(((0 + a + (a + b)) / 3) * 100) / 100;
    // SJF: ordenar ascendente y acumular.
    const [s1, s2] = [a, b, c].slice().sort((x, y) => x - y);
    const sAvg = Math.round(((0 + s1 + (s1 + s2)) / 3) * 100) / 100;
    fifoWait.push(mc(`gen-so-fifo-${si}`, 'Planificación', 3,
      `Con FIFO llegan en t=0 tres procesos con ráfagas ${a}, ${b} y ${c} ms (en ese orden). ¿Tiempo de espera PROMEDIO?`,
      num4(fAvg, [sAvg, fAvg + 1, fAvg - 1]).map((o) => `${o} ms`), 0,
      `FIFO respeta el orden de llegada: esperas 0, ${a}, ${a + b}. Promedio = (0+${a}+${a + b})/3 = ${fAvg} ms.`));
    sjfWait.push(mc(`gen-so-sjf-${si}`, 'Planificación', 3,
      `Con SJF (no apropiativo, los tres en t=0) y ráfagas ${a}, ${b} y ${c} ms, ¿tiempo de espera PROMEDIO?`,
      num4(sAvg, [fAvg, sAvg + 1, sAvg - 1]).map((o) => `${o} ms`), 0,
      `SJF ejecuta de menor a mayor ráfaga (${[a, b, c].slice().sort((x, y) => x - y).join(', ')}): esperas 0, ${s1}, ${s1 + s2}. Promedio = (0+${s1}+${s1 + s2})/3 = ${sAvg} ms.`));
  }
  return withTopic('sistemas_operativos', interleave(pages, frag, fifoWait, sjfWait));
}

// ──────────────────── PARADIGMAS / JAVA ────────────────────
// Trampas clásicas de Java: precedencia + división entera, orden de
// concatenación con String, post-incremento y 'char' + int (da int, no char).

function genParadigmas(): Question[] {
  // Precedencia: a + b / c evalúa b/c (entero) primero. Trampa: (a+b)/c o real.
  const prec: Q[] = [];
  let pi = 0;
  for (let a = 5; a <= 15; a++) for (let b = 7; b <= 19; b++) for (const c of [2, 3, 4]) {
    if (b % c === 0) continue; // que la división tenga decimal para que la trampa exista
    pi++;
    const res = a + Math.floor(b / c);
    prec.push(mc(`gen-par-prec-${pi}`, 'Operadores', 3,
      `En Java, ¿qué imprime System.out.println(${a} + ${b} / ${c})?`,
      num4(res, [Math.floor((a + b) / c), a + Math.round(b / c) + 1, res + 1]), 0,
      `Por precedencia, "/" se evalúa antes que "+": ${b} / ${c} con int trunca a ${Math.floor(b / c)}, y luego ${a} + ${Math.floor(b / c)} = ${res}.`));
  }
  // Orden de concatenación: a + b + "x" suma primero; "x" + a + b concatena.
  const concat: Q[] = [];
  let ci = 0;
  for (let a = 1; a <= 9; a++) for (let b = 1; b <= 9; b++) {
    ci++;
    concat.push(mc(`gen-par-cat-a-${ci}`, 'String', 3,
      `En Java, ¿qué imprime System.out.println(${a} + ${b} + "x")?`,
      opts4(`${a + b}x`, [`${a}${b}x`, `x${a + b}`, `${a}${b}`]), 0,
      `Se evalúa de izquierda a derecha: ${a} + ${b} (ambos int) suma a ${a + b}, y recién ahí se concatena con la "x" ⇒ "${a + b}x".`));
    concat.push(mc(`gen-par-cat-b-${ci}`, 'String', 3,
      `En Java, ¿qué imprime System.out.println("x" + ${a} + ${b})?`,
      opts4(`x${a}${b}`, [`x${a + b}`, `${a + b}x`, `${a}${b}x`]), 0,
      `Al empezar con el String "x", todo lo que sigue se CONCATENA: "x" + ${a} = "x${a}", y + ${b} = "x${a}${b}".`));
  }
  // Post-incremento en una expresión: x++ + x con x = a ⇒ a + (a+1) = 2a+1.
  const inc: Q[] = [];
  for (let a = 3; a <= 52; a++) {
    const res = a + (a + 1);
    inc.push(mc(`gen-par-inc-${a}`, 'Operadores', 3,
      `En Java: int x = ${a}; System.out.println(x++ + x); ¿Qué imprime?`,
      num4(res, [2 * a, 2 * a + 2, a], ), 0,
      `x++ usa el valor actual (${a}) y luego incrementa x a ${a + 1}; cuando se evalúa el segundo x, ya vale ${a + 1}. Resultado: ${a} + ${a + 1} = ${res}.`));
  }
  // 'char' + int da un int (su código), NO el carácter siguiente.
  const chr: Q[] = [];
  for (let n = 1; n <= 25; n++) {
    const code = 65 + n;
    chr.push(mc(`gen-par-char-${n}`, 'Tipos y operadores', 3,
      `En Java, ¿qué imprime System.out.println('A' + ${n})?`,
      opts4(`${code}`, [`'${String.fromCharCode(code)}'`, `${n}`, `A${n}`]), 0,
      `'A' + ${n} hace aritmética de ENTEROS: 'A' vale 65, así que la expresión da ${code} (un int). Para obtener un carácter habría que castear el resultado a char.`));
  }
  return withTopic('paradigmas_lenguajes', interleave(prec, concat, inc, chr));
}

// ──────────────────── BASES DE DATOS ────────────────────

function genBasesDatos(): Question[] {
  // T1 — Cardinalidad de un INNER JOIN por FK: la trampa es responder el
  // producto cartesiano (P×D) en lugar de D (la condición de join lo evita).
  const joinmult: Q[] = [];
  let i = 0;
  for (let p = 4; p <= 30; p++) for (const m of [2, 3, 4, 5]) {
    i++;
    const d = p * m;
    joinmult.push(mc(`gen-bd-jm-${i}`, 'JOIN', 3,
      `La tabla Pedido tiene ${p} filas y Detalle tiene ${d} filas (cada pedido tiene exactamente ${m} líneas de detalle, con su FK pedido_id). ¿Cuántas filas devuelve "Pedido INNER JOIN Detalle ON Detalle.pedido_id = Pedido.id"?`,
      num4(d, [p * d, p, p + d]), 0,
      `El JOIN empareja cada detalle con su único pedido a través de la FK: como hay ${d} detalles, el resultado tiene ${d} filas (la condición Detalle.pedido_id = Pedido.id une cada fila solo con la que coincide).`));
  }
  // T2 — GROUP BY colapsa en un grupo por valor distinto: la trampa es
  // responder la cantidad total de filas en vez de los grupos distintos.
  const groupby: Q[] = [];
  let g = 0;
  for (let v = 12; v <= 40; v++) for (const k of [3, 4, 5, 6]) {
    g++;
    const dist = Math.min(k, v);
    groupby.push(mc(`gen-bd-gb-${g}`, 'SQL', 3,
      `La tabla Venta tiene ${v} filas, con ventas realizadas por ${dist} vendedores distintos. ¿Cuántas filas devuelve "SELECT vendedor, COUNT(*) FROM Venta GROUP BY vendedor"?`,
      num4(dist, [v, v - dist, dist + 1]), 0,
      `GROUP BY produce una fila por cada valor DISTINTO del campo agrupado: hay ${dist} vendedores ⇒ ${dist} filas. Las ${v} filas originales se reparten dentro de cada grupo (eso es lo que cuenta COUNT(*)).`));
  }
  // T3 — LEFT JOIN: conserva las filas de la izquierda sin coincidencia. La
  // trampa es olvidar las filas sin match (o contar el producto cartesiano).
  const leftjoin: Q[] = [];
  let l = 0;
  for (let c = 6; c <= 24; c++) for (const sinPed of [1, 2]) for (const ppc of [2, 3]) {
    l++;
    const conPed = c - sinPed;
    const k = conPed * ppc;
    const total = k + sinPed;
    leftjoin.push(mc(`gen-bd-lj-${l}`, 'JOIN', 3,
      `Cliente tiene ${c} filas; ${sinPed} de esos clientes no tienen pedidos y los demás tienen ${ppc} pedidos cada uno. ¿Cuántas filas devuelve "Cliente LEFT JOIN Pedido"?`,
      num4(total, [k, c, c * ppc]), 0,
      `LEFT JOIN conserva a TODOS los clientes: los ${conPed} con pedidos aportan ${conPed}×${ppc}=${k} filas, y los ${sinPed} sin pedidos aportan 1 fila cada uno (con NULL en las columnas de Pedido). Total = ${k}+${sinPed} = ${total}.`));
  }
  // T4 — Grado de una proyección (concepto de "grado" = nº de columnas).
  const deg: Q[] = [];
  for (let a = 3; a <= 12; a++) for (const b of [2, 3, 4]) {
    deg.push(mc(`gen-bd-deg-${a}-${b}`, 'Modelo relacional', 2,
      `Una relación R tiene grado ${a} (atributos) y cardinalidad 50 (filas). Si se hace una proyección sobre ${b} atributos (sin eliminar duplicados), ¿cuál es el GRADO del resultado?`,
      num4(b, [a, 50, a - b]), 0,
      `El grado de una relación es su número de columnas; al proyectar sobre ${b} atributos, el resultado tiene grado ${b} (la cardinalidad, que es el número de filas, es un concepto aparte).`));
  }
  return withTopic('base_de_datos', interleave(joinmult, groupby, leftjoin, deg));
}

// ──────────────────── ANÁLISIS Y DISEÑO ────────────────────

function genAnalisisDiseno(): Question[] {
  // RF vs RNF: la habilidad EFIP por excelencia. Generamos muchos enunciados
  // y alternamos la consigna ("¿es funcional?" / "¿es no funcional?") para
  // equilibrar las respuestas Verdadero/Falso.
  const actions = ['registrar', 'modificar', 'dar de baja', 'consultar', 'listar', 'buscar', 'reservar', 'exportar a PDF', 'imprimir el comprobante de', 'calcular el total de', 'autenticar', 'enviar una notificación al'];
  const entities = ['socios', 'libros', 'préstamos', 'facturas', 'productos', 'clientes', 'reservas', 'usuarios', 'pagos', 'turnos', 'proveedores', 'empleados', 'pedidos', 'cuentas'];
  const rfStmts: string[] = [];
  for (const a of actions) for (const e of entities) rfStmts.push(`El sistema debe permitir ${a} ${e}`);
  const rnfStmts: string[] = [];
  for (const n of [1, 2, 3, 5]) rnfStmts.push(`El sistema debe responder a cada consulta en menos de ${n} segundos`);
  for (const p of ['95', '99', '99,9']) rnfStmts.push(`El sistema debe estar disponible el ${p}% del tiempo`);
  for (const n of [100, 500, 1000, 5000]) rnfStmts.push(`El sistema debe soportar ${n} usuarios concurrentes`);
  for (const s of [
    'El sistema debe cifrar las contraseñas almacenadas', 'La interfaz debe poder usarse sin capacitación previa',
    'El sistema debe registrar un log de auditoría de cada operación', 'El sistema debe funcionar en los navegadores modernos',
    'El sistema debe realizar una copia de seguridad diaria automática', 'El tiempo de recuperación ante fallos no debe superar 1 hora',
    'La aplicación debe ser accesible para personas con discapacidad visual', 'El sistema debe soportar 10.000 transacciones por minuto',
  ]) rnfStmts.push(s);

  const rfrnf: Q[] = [];
  const buildClass = (stmt: string, isRF: boolean, key: string) => {
    // Alternamos consigna según el hash del key para equilibrar V/F.
    const askFunctional = (key.length + stmt.length) % 2 === 0;
    const isTrue = askFunctional ? isRF : !isRF;
    const kind = askFunctional ? 'FUNCIONAL (RF)' : 'NO FUNCIONAL (RNF)';
    rfrnf.push(tf(`gen-ad-${key}`, 'Requerimientos', 2,
      `«${stmt}» — ¿Es un requerimiento ${kind}?`, isTrue,
      isRF
        ? 'Es un requerimiento FUNCIONAL: describe una acción/función que el sistema debe hacer.'
        : 'Es un requerimiento NO FUNCIONAL: describe calidad o restricción (rendimiento, seguridad, disponibilidad, usabilidad), normalmente con una métrica.'));
  };
  rfStmts.forEach((s, i) => buildClass(s, true, `rf-${i}`));
  rnfStmts.forEach((s, i) => buildClass(s, false, `rnf-${i}`));

  const assoc: Q[] = [];
  for (let n = 3; n <= 25; n++) {
    const pairs = (n * (n - 1)) / 2;
    assoc.push(mc(`gen-ad-assoc-${n}`, 'Diagrama de clases', 3,
      `En un diagrama con ${n} clases, ¿cuántas asociaciones binarias DISTINTAS (sin dirección) podrían existir como máximo entre pares?`,
      num4(pairs, [n * (n - 1), pairs + n, n]), 0,
      `Combinaciones de ${n} de a 2: C(${n},2) = ${n}×${n - 1}/2 = ${pairs}.`));
  }
  const diag: Q[] = [];
  const scenes: [string, string][] = [
    ['modelar los estados por los que pasa un Pedido y sus transiciones', 'Diagrama de estados'],
    ['mostrar la secuencia temporal de mensajes entre objetos', 'Diagrama de secuencia'],
    ['representar las clases del sistema, sus atributos y relaciones', 'Diagrama de clases'],
    ['capturar la funcionalidad del sistema desde la perspectiva del usuario', 'Diagrama de casos de uso'],
    ['describir el flujo de actividades y decisiones de un proceso', 'Diagrama de actividades'],
    ['mostrar la distribución física del software en nodos de hardware', 'Diagrama de despliegue'],
  ];
  const diagOpts = ['Diagrama de clases', 'Diagrama de secuencia', 'Diagrama de casos de uso', 'Diagrama de estados', 'Diagrama de actividades', 'Diagrama de despliegue'];
  scenes.forEach(([sc, ans], k) => {
    const opts = [ans, ...diagOpts.filter((o) => o !== ans)].slice(0, 4);
    diag.push(mc(`gen-ad-diag-${k}`, 'Diagramas UML', 2,
      `¿Qué diagrama UML usarías para ${sc}?`, opts, 0,
      `Para ${sc} se usa el ${ans.toLowerCase()}.`));
  });
  // include vs extend: comportamiento obligatorio (include) u opcional (extend).
  const rels: Q[] = [];
  const inc = ['Validar credenciales al iniciar sesión', 'Registrar la operación en el log', 'Calcular el total antes de cobrar', 'Verificar stock al confirmar el pedido', 'Autenticar al usuario antes de operar', 'Generar el número de comprobante'];
  const ext = ['Aplicar un descuento si el cliente es VIP', 'Enviar un email de cortesía si hay demora', 'Imprimir un duplicado si se solicita', 'Ofrecer envoltorio para regalo', 'Mostrar publicidad si el plan es gratuito', 'Pedir confirmación si el monto es alto'];
  inc.forEach((s, i) => rels.push(tf(`gen-ad-inc-${i}`, 'Casos de uso', 2,
    `«${s}» siempre ocurre como parte del caso de uso base. ¿Corresponde a una relación «include»?`, true,
    '«include» = comportamiento OBLIGATORIO que siempre se ejecuta. «extend» sería opcional/condicional.')));
  ext.forEach((s, i) => rels.push(tf(`gen-ad-ext-${i}`, 'Casos de uso', 2,
    `«${s}» ocurre solo bajo cierta condición. ¿Corresponde a una relación «include»?`, false,
    'Es comportamiento OPCIONAL/condicional ⇒ «extend», no «include» (que es siempre obligatorio).')));
  // Multiplicidad UML.
  const mult: Q[] = [];
  const mults: [string, string][] = [
    ['0..*', 'Cero o muchos'], ['1..*', 'Uno o muchos (al menos uno)'], ['0..1', 'Cero o uno (opcional)'],
    ['1', 'Exactamente uno'], ['1..1', 'Exactamente uno'], ['2..*', 'Dos o más'],
  ];
  const multOpts = ['Cero o muchos', 'Uno o muchos (al menos uno)', 'Cero o uno (opcional)', 'Exactamente uno', 'Dos o más'];
  mults.forEach(([m, ans], k) => {
    const opts = [ans, ...multOpts.filter((o) => o !== ans)].slice(0, 4);
    mult.push(mc(`gen-ad-mult-${k}`, 'Cardinalidad', 2,
      `En UML, la multiplicidad "${m}" significa…`, opts, 0,
      `"${m}" se interpreta como: ${ans.toLowerCase()}.`));
  });
  return withTopic('analisis_diseno', interleave(assoc, diag, mult, rels, rfrnf));
}

/** Mapa de generadores por topic. Cada uno devuelve un pool grande; el banco corta. */
export const GENERATORS: Record<Topic, () => Question[]> = {
  redes_comunicaciones: genRedes,
  arquitectura_computadoras: genArquitectura,
  algoritmos_estructuras: genAlgoritmos,
  sistemas_operativos: genSistemasOperativos,
  paradigmas_lenguajes: genParadigmas,
  base_de_datos: genBasesDatos,
  analisis_diseno: genAnalisisDiseno,
};
