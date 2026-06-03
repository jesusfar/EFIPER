import type { LeitnerBox, RefType, ReviewItem, ReviewStatus, Topic } from '../../types';

// Sistema Leitner de 5 cajas. Intervalos en días por caja.
export const BOX_INTERVAL_DAYS: Record<LeitnerBox, number> = {
  1: 1,
  2: 2,
  3: 4,
  4: 7,
  5: 14,
};

const DAY = 24 * 60 * 60 * 1000;

function statusForBox(box: LeitnerBox): ReviewStatus {
  if (box >= 5) return 'mastered';
  if (box >= 3) return 'review';
  return 'learning';
}

export function newReviewItem(
  refId: string,
  refType: RefType,
  topic: Topic,
  now = Date.now(),
): ReviewItem {
  return {
    id: `${refType}:${refId}`,
    refId,
    refType,
    topic,
    box: 1,
    nextReviewAt: now,
    failures: 0,
    successes: 0,
    status: 'new',
  };
}

// Aplica el resultado de un repaso y devuelve el item actualizado.
export function grade(item: ReviewItem, correct: boolean, now = Date.now()): ReviewItem {
  let box = item.box;
  if (correct) {
    box = Math.min(5, box + 1) as LeitnerBox;
  } else {
    box = 1;
  }
  return {
    ...item,
    box,
    successes: item.successes + (correct ? 1 : 0),
    failures: item.failures + (correct ? 0 : 1),
    status: correct ? statusForBox(box) : 'learning',
    nextReviewAt: now + BOX_INTERVAL_DAYS[box] * DAY,
  };
}

export function isDue(item: ReviewItem, now = Date.now()): boolean {
  return item.status !== 'mastered' && item.nextReviewAt <= now;
}

// Ordena la cola de repaso: primero lo más vencido y lo que más se falla.
export function sortQueue(items: ReviewItem[], now = Date.now()): ReviewItem[] {
  return [...items].sort((a, b) => {
    const overdueA = now - a.nextReviewAt;
    const overdueB = now - b.nextReviewAt;
    if (overdueB !== overdueA) return overdueB - overdueA;
    return b.failures - a.failures;
  });
}
