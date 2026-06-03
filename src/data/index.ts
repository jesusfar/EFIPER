import questionsJson from './questions/sample.json';
import oralEfip700Json from './oral/efip-700.json';
import casesJson from './cases/sample.json';
import type { CaseStudy, OralQuestion, Question } from '../types';

// Carga del contenido estático. Para ampliar el banco, agregá más archivos
// JSON y concatenalos acá; el núcleo no necesita cambios.
export const QUESTIONS = questionsJson as Question[];
export const ORAL_QUESTIONS = oralEfip700Json as OralQuestion[];
export const CASES = casesJson as CaseStudy[];

export function questionsByTopic(topic?: string): Question[] {
  const active = QUESTIONS.filter((q) => q.active);
  return topic ? active.filter((q) => q.topic === topic) : active;
}

export function getOral(id: string): OralQuestion | undefined {
  return ORAL_QUESTIONS.find((o) => o.id === id);
}

export function getCase(id: string): CaseStudy | undefined {
  return CASES.find((c) => c.id === id);
}
