import type { Question, Topic } from '../../types';
import { GENERATORS } from './generators';
import { arquitectura } from './banks/arquitectura';
import { sistemasOperativos } from './banks/sistemas-operativos';
import { redes } from './banks/redes';
import { basesDatos } from './banks/bases-datos';
import { algoritmos } from './banks/algoritmos';
import { paradigmas } from './banks/paradigmas';
import { analisisDiseno } from './banks/analisis-diseno';

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

/** Baraja las opciones de una MC sin perder cuál es la correcta (por valor). */
function shuffleOptions(q: Question, rand: () => number): Question {
  if (q.type !== 'multiple_choice' || !q.options) return q;
  const opts = [...q.options];
  for (let i = opts.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [opts[i], opts[j]] = [opts[j], opts[i]];
  }
  return { ...q, options: opts };
}

/** Banco final por eje: a mano + generadas, sin enunciados repetidos, hasta el target. */
function buildBank(): Question[] {
  const rand = mulberry32(0x5eed);
  const all: Question[] = [];
  for (const topic of TOPICS) {
    const seen = new Set<string>();
    const bucket: Question[] = [];
    const push = (q: Question) => {
      const key = q.statement.trim().toLowerCase();
      if (seen.has(key) || bucket.length >= TARGET_PER_TOPIC) return;
      seen.add(key);
      bucket.push(shuffleOptions(q, rand));
    };
    HAND_AUTHORED[topic].forEach(push);
    if (bucket.length < TARGET_PER_TOPIC) GENERATORS[topic]().forEach(push);
    all.push(...bucket);
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
