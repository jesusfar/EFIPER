import type { Question, Topic } from '../../types';
import { GENERATORS } from './generators';
import { arquitectura } from './banks/arquitectura';
import { sistemasOperativos } from './banks/sistemas-operativos';
import { redes } from './banks/redes';
import { basesDatos } from './banks/bases-datos';
import { algoritmos } from './banks/algoritmos';
import { paradigmas } from './banks/paradigmas';
import { analisisDiseno } from './banks/analisis-diseno';
import { THEORY, THEORY_TARGET_PER_TOPIC } from './theory';

// ── Banco de preguntas del Test rápido ──
// Cada eje se arma con: preguntas conceptuales escritas a mano (distractores
// creíbles, "de tribunal") + preguntas de cálculo/aplicación generadas por
// enumeración de plantillas. Objetivo: 250 por eje, solo opción múltiple y
// verdadero/falso (ninguna de escribir).

export const TARGET_PER_TOPIC = 250;

const HAND_AUTHORED: Record<Topic, Question[]> = {
  arquitectura_computadoras: arquitectura,
  sistemas_operativos: sistemasOperativos,
  redes_comunicaciones: redes,
  base_de_datos: basesDatos,
  algoritmos_estructuras: algoritmos,
  paradigmas_lenguajes: paradigmas,
  analisis_diseno: analisisDiseno,
};

const TOPICS = Object.keys(HAND_AUTHORED) as Topic[];

/** PRNG determinista para barajar opciones de forma estable entre recargas. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Baraja las opciones (MC y selección múltiple) sin perder las correctas (por valor). */
function shuffleOptions(q: Question, rand: () => number): Question {
  if ((q.type !== 'multiple_choice' && q.type !== 'multiple_select') || !q.options) return q;
  const opts = [...q.options];
  for (let i = opts.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [opts[i], opts[j]] = [opts[j], opts[i]];
  }
  return { ...q, options: opts };
}

/** Toma preguntas únicas (por enunciado + opciones) hasta `limit`, barajando opciones. */
function collect(qs: Question[], limit: number, rand: () => number): Question[] {
  const seen = new Set<string>();
  const out: Question[] = [];
  for (const q of qs) {
    if (out.length >= limit) break;
    const key = q.statement.trim().toLowerCase() + '||' + (q.options ? [...q.options].sort().join('~') : '');
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(shuffleOptions(q, rand));
  }
  return out;
}

/** Banco final por eje: (conceptuales+cálculo hasta TARGET) + (teóricas a mano hasta THEORY_TARGET). */
function buildBank(): Question[] {
  const rand = mulberry32(0x5eed);
  const all: Question[] = [];
  for (const topic of TOPICS) {
    // Bucket 1: conceptuales a mano + generadas de cálculo.
    const base = [...HAND_AUTHORED[topic]];
    if (base.length < TARGET_PER_TOPIC) base.push(...GENERATORS[topic]());
    all.push(...collect(base, TARGET_PER_TOPIC, rand));
    // Bucket 2: teóricas escritas a mano (selección múltiple, "cuál es incorrecta", etc.).
    all.push(...collect(THEORY[topic], THEORY_TARGET_PER_TOPIC, rand));
  }
  return all;
}

export const ALL_QUESTIONS: Question[] = buildBank();

/** Cantidad de preguntas por eje (para mostrar disponibilidad en la UI). */
export function countByTopic(): Record<Topic, number> {
  const counts = Object.fromEntries(TOPICS.map((t) => [t, 0])) as Record<Topic, number>;
  for (const q of ALL_QUESTIONS) counts[q.topic]++;
  return counts;
}
