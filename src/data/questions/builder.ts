import type { Question, Topic } from '../../types';

// ── Helpers para redactar preguntas de forma compacta y consistente ──
// El test rápido solo admite multiple_choice y true_false (nada de escribir).

type Difficulty = 1 | 2 | 3;

/**
 * Crea una pregunta de opción múltiple.
 * `correct` es el índice (0-based) de la opción correcta dentro de `options`.
 * Las opciones se barajan en runtime, así que el orden acá no importa.
 */
export function mc(
  id: string,
  subtopic: string,
  difficulty: Difficulty,
  statement: string,
  options: string[],
  correct: number,
  explanation: string,
): Omit<Question, 'topic'> {
  return {
    id,
    subtopic,
    type: 'multiple_choice',
    difficulty,
    statement,
    options,
    correctAnswer: options[correct],
    explanation,
    active: true,
  };
}

/** Crea una pregunta de Verdadero/Falso. */
export function tf(
  id: string,
  subtopic: string,
  difficulty: Difficulty,
  statement: string,
  isTrue: boolean,
  explanation: string,
): Omit<Question, 'topic'> {
  return {
    id,
    subtopic,
    type: 'true_false',
    difficulty,
    statement,
    correctAnswer: isTrue ? 'true' : 'false',
    explanation,
    active: true,
  };
}

/** Asigna el `topic` a un lote de preguntas creadas con mc()/tf(). */
export function withTopic(topic: Topic, qs: Omit<Question, 'topic'>[]): Question[] {
  return qs.map((q) => ({ ...q, topic }));
}
