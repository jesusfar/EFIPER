import type { Question, Topic } from '../../types';
import { mc, tf, withTopic } from './builder';

// ── Generadores de preguntas (cálculo / aplicación) ──
// Enumeran espacios de parámetros grandes e INTERCALAN varias plantillas, de
// modo que cada eje ofrece cientos de preguntas únicas y variadas. La opción
// correcta queda primera acá; el banco (index.ts) baraja las opciones.

type Q = Omit<Question, 'topic'>;

/** Intercala varias listas en round-robin para mezclar plantillas al cortar. */
function interleave(...lists: Q[][]): Q[] {
  const out: Q[] = [];
  const max = Math.max(0, ...lists.map((l) => l.length));
  for (let i = 0; i < max; i++) for (const l of lists) if (i < l.length) out.push(l[i]);
  return out;
}

/** 4 opciones numéricas únicas: la correcta + 3 distractores cercanos. */
function num4(correct: number, d: number[]): string[] {
  const set = [String(correct)];
  for (const x of d) { const s = String(x); if (!set.includes(s) && Number(x) >= 0) set.push(s); if (set.length === 4) break; }
  let k = 1;
  while (set.length < 4) { const s = String(correct + k); if (!set.includes(s)) set.push(s); k++; }
  return set;
}

// ────────────────────────── REDES ──────────────────────────

function genRedes(): Question[] {
  const bin: Q[] = [];
  for (let o = 1; o <= 150; o++) {
    const b = o.toString(2).padStart(8, '0');
    bin.push(mc(`gen-red-bin-${o}`, 'Direccionamiento binario', 2,
      `¿Cuál es la representación binaria (8 bits) del octeto ${o}?`,
      [b, (o ^ 1).toString(2).padStart(8, '0'), (o ^ 2).toString(2).padStart(8, '0'), (o ^ 4).toString(2).padStart(8, '0')], 0,
      `${o} en binario de 8 bits es ${b}. Verificá sumando las potencias de 2 con bit en 1.`));
  }
  const hosts: Q[] = [];
  for (let p = 22; p <= 30; p++) {
    const hb = 32 - p, usable = 2 ** hb - 2;
    hosts.push(mc(`gen-red-host-${p}`, 'Subnetting', 2,
      `¿Cuántas direcciones de host UTILIZABLES tiene una subred /${p}?`,
      num4(usable, [2 ** hb, 2 ** hb - 1, 2 ** (hb - 1) - 2]), 0,
      `/${p} deja ${hb} bits de host ⇒ 2^${hb} = ${2 ** hb}, menos red y broadcast = ${usable} utilizables.`));
  }
  const subs: Q[] = [];
  for (let b = 1; b <= 10; b++) {
    subs.push(mc(`gen-red-sub-${b}`, 'Subnetting', 2,
      `Si tomás prestados ${b} bits de host para crear subredes, ¿cuántas subredes obtenés?`,
      num4(2 ** b, [2 ** b - 1, 2 ** (b + 1), 2 ** (b - 1)]), 0,
      `Con ${b} bits prestados ⇒ 2^${b} = ${2 ** b} subredes.`));
  }
  const maskMap: Record<number, string> = {
    8: '255.0.0.0', 16: '255.255.0.0', 24: '255.255.255.0', 25: '255.255.255.128',
    26: '255.255.255.192', 27: '255.255.255.224', 28: '255.255.255.240', 29: '255.255.255.248', 30: '255.255.255.252',
  };
  const maskPool = ['255.0.0.0', '255.255.0.0', '255.255.255.0', '255.255.255.128', '255.255.255.192', '255.255.255.224', '255.255.255.240', '255.255.255.248', '255.255.255.252', '255.255.255.255'];
  const m2c: Q[] = [], c2m: Q[] = [];
  for (const p of Object.keys(maskMap).map(Number)) {
    const mask = maskMap[p];
    m2c.push(mc(`gen-red-m2c-${p}`, 'Direccionamiento', 2,
      `La máscara ${mask} en notación CIDR equivale a…`,
      [`/${p}`, `/${p + 1}`, `/${p - 1}`, `/${p + 2}`], 0,
      `${mask} tiene ${p} bits en 1 ⇒ /${p}.`));
    c2m.push(mc(`gen-red-c2m-${p}`, 'Direccionamiento', 2,
      `¿Cuál es la máscara decimal correspondiente al prefijo /${p}?`,
      [mask, ...maskPool.filter((m) => m !== mask).slice(0, 3)], 0,
      `/${p} ⇒ ${p} bits en 1 ⇒ ${mask}.`));
  }
  const tput: Q[] = [];
  let ti = 0;
  for (const mb of [10, 20, 50, 100, 200, 500]) for (const mbps of [10, 20, 50, 100]) {
    ti++;
    const s = Math.round((mb * 8 / mbps) * 10) / 10;
    tput.push(mc(`gen-red-tput-${ti}`, 'Rendimiento', 3,
      `¿Cuánto tarda en transferirse un archivo de ${mb} MB por un enlace de ${mbps} Mbps (ideal, sin overhead)?`,
      num4(s, [s * 2, s / 2, mb / mbps]).map((o) => `${o} s`), 0,
      `${mb} MB = ${mb * 8} Mb. Tiempo = ${mb * 8} Mb / ${mbps} Mbps = ${s} s (MB→Mb multiplica por 8).`));
  }
  const cls: Q[] = [];
  const classOf = (o: number) => o < 128 ? 'A' : o < 192 ? 'B' : o < 224 ? 'C' : o < 240 ? 'D' : 'E';
  for (let o = 1; o <= 239; o += 7) {
    const c = classOf(o);
    cls.push(mc(`gen-red-cls-${o}`, 'Clases IP', 2,
      `Una IP cuyo primer octeto es ${o} pertenece a la clase…`,
      ['A', 'B', 'C', 'D'].includes(c) ? ['A', 'B', 'C', 'D'] : ['A', 'B', 'C', 'E'],
      ['A', 'B', 'C', 'D'].includes(c) ? ['A', 'B', 'C', 'D'].indexOf(c) : ['A', 'B', 'C', 'E'].indexOf(c),
      `Clase A: 1-126 · B: 128-191 · C: 192-223 · D: 224-239 · E: 240-255. Primer octeto ${o} ⇒ clase ${c}.`));
  }
  return withTopic('redes_comunicaciones', interleave(hosts, subs, m2c, c2m, tput, cls, bin));
}

// ──────────────────────── ARQUITECTURA ────────────────────────

function genArquitectura(): Question[] {
  const d2b: Q[] = [];
  for (let n = 16; n <= 170; n++) {
    const b = n.toString(2);
    d2b.push(mc(`gen-arq-d2b-${n}`, 'Sistemas de numeración', 2,
      `¿Cuál es la representación binaria de ${n} (decimal)?`,
      [b, (n + 1).toString(2), (n - 1).toString(2), (n ^ 4).toString(2)], 0,
      `${n} en binario es ${b}. Sumá las potencias de 2 con bit en 1 para verificar.`));
  }
  const h2d: Q[] = [];
  for (let n = 160; n <= 460; n += 5) {
    const hex = n.toString(16).toUpperCase();
    h2d.push(mc(`gen-arq-h2d-${n}`, 'Sistemas de numeración', 2,
      `¿Cuál es el valor decimal del hexadecimal 0x${hex}?`,
      num4(n, [n + 16, n - 1, n + 1]), 0,
      `0x${hex} = ${n}. Cada dígito vale dígito × 16^posición.`));
  }
  const d2h: Q[] = [];
  for (let n = 16; n <= 120; n++) {
    const hex = n.toString(16).toUpperCase();
    d2h.push(mc(`gen-arq-d2h-${n}`, 'Sistemas de numeración', 2,
      `¿Cuál es la representación hexadecimal de ${n} (decimal)?`,
      [hex, (n + 1).toString(16).toUpperCase(), (n - 1).toString(16).toUpperCase(), (n + 16).toString(16).toUpperCase()], 0,
      `${n} en hexadecimal es 0x${hex}.`));
  }
  const addr: Q[] = [];
  for (let bits = 4; bits <= 24; bits++) {
    const cells = 2 ** bits;
    addr.push(mc(`gen-arq-addr-${bits}`, 'Memoria', 2,
      `Si el bus de direcciones tiene ${bits} líneas, ¿cuántas celdas distintas puede direccionar?`,
      num4(cells, [2 ** (bits + 1), 2 ** (bits - 1), bits * 1024]), 0,
      `${bits} líneas ⇒ 2^${bits} = ${cells.toLocaleString('es')} celdas direccionables.`));
  }
  const cpu: Q[] = [];
  let ci = 0;
  for (const mips of [2, 3, 4, 5, 6, 8]) for (const cpi of [1, 2, 3, 4]) for (const ghz of [1, 2, 4]) {
    ci++;
    const ms = Math.round((mips * 1e6 * cpi / (ghz * 1e9)) * 1000 * 100) / 100;
    cpu.push(mc(`gen-arq-cpu-${ci}`, 'Rendimiento de CPU', 3,
      `Un programa ejecuta ${mips} millones de instrucciones con CPI=${cpi} en una CPU de ${ghz} GHz. ¿Tiempo de CPU?`,
      num4(ms, [ms * 2, ms / 2, ms + cpi]).map((o) => `${o} ms`), 0,
      `Tiempo = (Instrucciones × CPI) / Frecuencia = (${mips}M × ${cpi}) / ${ghz}GHz = ${ms} ms.`));
  }
  return withTopic('arquitectura_computadoras', interleave(addr, cpu, h2d, d2h, d2b));
}

// ──────────────────────── ALGORITMOS ────────────────────────

function genAlgoritmos(): Question[] {
  const bs: Q[] = [];
  for (let n = 8; n <= 250; n++) {
    const c = Math.ceil(Math.log2(n + 1));
    bs.push(mc(`gen-alg-bs-${n}`, 'Complejidad', 3,
      `¿Cuántas comparaciones hace en el PEOR caso una búsqueda binaria sobre ${n} elementos ordenados?`,
      num4(c, [c + 1, c - 1, Math.ceil(n / 2)]), 0,
      `Peor caso ≈ ⌈log₂(n+1)⌉ = ⌈log₂(${n + 1})⌉ = ${c} comparaciones.`));
  }
  const tree: Q[] = [];
  for (let h = 1; h <= 12; h++) {
    const nodes = 2 ** (h + 1) - 1;
    tree.push(mc(`gen-alg-tree-${h}`, 'Árboles', 3,
      `¿Cuántos nodos tiene como máximo un árbol binario de altura ${h} (raíz en altura 0)?`,
      num4(nodes, [2 ** h - 1, 2 ** (h + 1), nodes + 2]), 0,
      `Árbol binario lleno de altura ${h}: 2^(h+1)−1 = 2^${h + 1}−1 = ${nodes} nodos.`));
  }
  const heap: Q[] = [];
  for (let i = 0; i <= 40; i++) {
    heap.push(mc(`gen-alg-heap-${i}`, 'Heaps', 3,
      `En un heap representado con arreglo (base 0), ¿cuál es el índice del hijo IZQUIERDO del nodo en la posición ${i}?`,
      num4(2 * i + 1, [2 * i, 2 * i + 2, i + 1]), 0,
      `Hijo izquierdo de i = 2·i+1 = 2·${i}+1 = ${2 * i + 1}. (El derecho es 2·i+2).`));
  }
  const bigo: Q[] = [];
  const cases: [string, string, string][] = [
    ['un bucle simple sobre n', 'O(n)', 'Un único bucle recorre n elementos ⇒ O(n).'],
    ['dos bucles anidados sobre n', 'O(n²)', 'Cada nivel de anidamiento multiplica por n ⇒ O(n²).'],
    ['tres bucles anidados sobre n', 'O(n³)', 'Tres anidamientos ⇒ O(n³).'],
    ['dividir el problema a la mitad en cada paso', 'O(log n)', 'Reducir a la mitad repetidamente ⇒ O(log n).'],
    ['un bucle externo de n que en cada paso divide el rango a la mitad', 'O(n log n)', 'Trabajo lineal por nivel logarítmico ⇒ O(n log n).'],
  ];
  const optionPool = ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)', 'O(n³)'];
  cases.forEach(([desc, ans, exp], k) => {
    const opts = [ans, ...optionPool.filter((o) => o !== ans)].slice(0, 4);
    bigo.push(mc(`gen-alg-bigo-${k}`, 'Complejidad', 2,
      `¿Cuál es la complejidad temporal de un algoritmo con ${desc}?`, opts, 0, exp));
  });
  return withTopic('algoritmos_estructuras', interleave(tree, bigo, heap, bs));
}

// ──────────────────── SISTEMAS OPERATIVOS ────────────────────

function genSistemasOperativos(): Question[] {
  const pages: Q[] = [];
  let pi = 0;
  for (let proc = 10; proc <= 300; proc += 10) for (const pg of [4, 8, 16]) {
    pi++;
    const n = Math.ceil(proc / pg);
    pages.push(mc(`gen-so-page-${pi}`, 'Memoria virtual', 3,
      `Un proceso de ${proc} KB se carga con páginas de ${pg} KB. ¿Cuántos marcos de página necesita?`,
      num4(n, [n - 1, n + 1, Math.floor(proc / pg)]), 0,
      `Marcos = ⌈${proc}/${pg}⌉ = ${n}. La última página puede quedar parcial (fragmentación interna).`));
  }
  const fifoWait: Q[] = [], fifoTurn: Q[] = [];
  let fi = 0;
  for (const a of [2, 3, 4, 5, 6]) for (const b of [3, 4, 6, 8]) for (const c of [2, 5, 7]) {
    fi++;
    const avgWait = Math.round(((0 + a + (a + b)) / 3) * 100) / 100;
    const avgTurn = Math.round(((a + (a + b) + (a + b + c)) / 3) * 100) / 100;
    fifoWait.push(mc(`gen-so-fifo-w-${fi}`, 'Planificación', 3,
      `Con FIFO llegan en t=0 tres procesos con ráfagas ${a}, ${b} y ${c} ms (en ese orden). ¿Tiempo de espera PROMEDIO?`,
      num4(avgWait, [avgTurn, avgWait + 1, avgWait - 1]).map((o) => `${o} ms`), 0,
      `Espera: P1=0, P2=${a}, P3=${a + b}. Promedio = (0+${a}+${a + b})/3 = ${avgWait} ms.`));
    fifoTurn.push(mc(`gen-so-fifo-t-${fi}`, 'Planificación', 3,
      `Con FIFO llegan en t=0 tres procesos con ráfagas ${a}, ${b} y ${c} ms (en ese orden). ¿Tiempo de RETORNO (turnaround) PROMEDIO?`,
      num4(avgTurn, [avgWait, avgTurn + 1, avgTurn - 1]).map((o) => `${o} ms`), 0,
      `Retorno: P1=${a}, P2=${a + b}, P3=${a + b + c}. Promedio = (${a}+${a + b}+${a + b + c})/3 = ${avgTurn} ms.`));
  }
  const offset: Q[] = [];
  for (const kb of [1, 2, 4, 8, 16, 32, 64]) {
    const bits = Math.log2(kb * 1024);
    offset.push(mc(`gen-so-off-${kb}`, 'Paginación', 3,
      `Si el tamaño de página es ${kb} KB, ¿cuántos bits del desplazamiento (offset) se necesitan dentro de la página?`,
      num4(bits, [bits + 1, bits - 1, bits + 2]), 0,
      `${kb} KB = ${kb * 1024} bytes = 2^${bits} ⇒ ${bits} bits de offset.`));
  }
  const frames: Q[] = [];
  let fr = 0;
  for (const memMB of [4, 8, 16, 32, 64, 128]) for (const pgKB of [4, 8, 16, 32]) {
    fr++;
    const n = (memMB * 1024) / pgKB;
    frames.push(mc(`gen-so-fr-${fr}`, 'Memoria', 3,
      `Una memoria física de ${memMB} MB con marcos de ${pgKB} KB, ¿en cuántos marcos se divide?`,
      num4(n, [n / 2, n * 2, n - 1]), 0,
      `Marcos = memoria / tamaño de marco = ${memMB} MB / ${pgKB} KB = ${memMB * 1024} KB / ${pgKB} KB = ${n}.`));
  }
  return withTopic('sistemas_operativos', interleave(pages, fifoWait, fifoTurn, frames, offset));
}

// ──────────────────── PARADIGMAS / JAVA ────────────────────

function genParadigmas(): Question[] {
  const div: Q[] = [], mod: Q[] = [];
  let di = 0;
  for (let a = 11; a <= 99; a += 1) {
    const b = (a % 8) + 2;
    di++;
    div.push(mc(`gen-par-div-${di}`, 'Tipos y operadores', 2,
      `En Java, ¿cuál es el resultado de \`${a} / ${b}\` si ambos son int?`,
      num4(Math.floor(a / b), [Math.floor(a / b) + 1, Math.ceil(a / b), Math.round(a / b) + 1]), 0,
      `La división entre int es entera (trunca): ${a} / ${b} = ${Math.floor(a / b)}. Para decimales habría que castear a double.`));
    mod.push(mc(`gen-par-mod-${di}`, 'Tipos y operadores', 2,
      `En Java, ¿cuál es el resultado de \`${a} % ${b}\`?`,
      num4(a % b, [(a % b) + 1, Math.floor(a / b), b - (a % b)]), 0,
      `El operador % devuelve el resto: ${a} % ${b} = ${a % b}.`));
  }
  const shift: Q[] = [];
  let si = 0;
  for (let x = 1; x <= 12; x++) for (const n of [1, 2, 3]) {
    si++;
    const r = x << n;
    shift.push(mc(`gen-par-shift-${si}`, 'Operadores de bits', 3,
      `En Java, ¿cuál es el resultado de \`${x} << ${n}\` (desplazamiento a la izquierda)?`,
      num4(r, [x << (n + 1), x << (n - 1 || 1), r + x]), 0,
      `\`x << n\` equivale a x × 2^n: ${x} × 2^${n} = ${r}.`));
  }
  const chr: Q[] = [];
  for (let n = 1; n <= 20; n++) {
    const ch = String.fromCharCode(65 + n);
    chr.push(mc(`gen-par-char-${n}`, 'Tipos y operadores', 3,
      `En Java, ¿qué carácter resulta de \`(char)('A' + ${n})\`?`,
      [ch, String.fromCharCode(65 + n + 1), String.fromCharCode(65 + n - 1), String.fromCharCode(97 + n)], 0,
      `'A' es 65 en ASCII. 65 + ${n} = ${65 + n} ⇒ '${ch}'.`));
  }
  return withTopic('paradigmas_lenguajes', interleave(div, mod, shift, chr));
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
      `El JOIN empareja cada detalle con su pedido por la FK: hay ${d} detalles ⇒ ${d} filas. NO es el producto cartesiano (${p}×${d}=${p * d}); la condición de join descarta las combinaciones que no coinciden.`));
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
      `GROUP BY produce una fila por cada valor DISTINTO del campo agrupado: hay ${dist} vendedores ⇒ ${dist} filas, no las ${v} filas originales (esas se cuentan dentro de cada grupo).`));
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
      `La proyección elige columnas: el grado (nº de columnas) pasa a ser ${b}. La cardinalidad (nº de filas) no es lo que se pregunta; el grado depende de los atributos proyectados.`));
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
