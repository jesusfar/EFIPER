import Dexie, { type Table } from 'dexie';
import type {
  Attempt,
  CaseSubmission,
  ReviewItem,
  UserProgress,
} from '../../types';

// Base de datos local (IndexedDB). Todo el progreso vive en el dispositivo.
export class EfiperDB extends Dexie {
  attempts!: Table<Attempt, number>;
  reviews!: Table<ReviewItem, string>;
  submissions!: Table<CaseSubmission, string>;
  progress!: Table<UserProgress, string>;

  constructor() {
    super('efiper');
    this.version(1).stores({
      attempts: '++id, refId, refType, topic, timestamp',
      reviews: 'id, refType, topic, nextReviewAt, status',
      submissions: 'id, caseId, createdAt',
      progress: 'id',
    });
  }
}

export const db = new EfiperDB();

export const DEFAULT_PROGRESS: UserProgress = {
  id: 'progress',
  examDate: null,
  streak: 0,
  lastStreakDay: null,
  xp: 0,
  level: 1,
  topicStats: {},
  dailyMissionDone: false,
  dailyMissionDay: null,
  lastSessionAt: null,
  settings: { soundEnabled: true, volume: 0.6, noPressure: false },
};

export async function loadProgress(): Promise<UserProgress> {
  const existing = await db.progress.get('progress');
  if (existing) return { ...DEFAULT_PROGRESS, ...existing, settings: { ...DEFAULT_PROGRESS.settings, ...existing.settings } };
  await db.progress.put(DEFAULT_PROGRESS);
  return DEFAULT_PROGRESS;
}

export async function saveProgress(p: UserProgress): Promise<void> {
  await db.progress.put(p);
}

// Reseteo único: la primera vez que se abre esta versión, deja el sistema
// limpio para un usuario nuevo (borra progreso, racha, intentos y repaso, y
// el espejo de respaldo). Luego corre una sola vez y la app sigue normal.
const FRESH_START_KEY = 'efiper:fresh-start:v2';

export async function ensureFreshStart(): Promise<void> {
  try {
    if (typeof localStorage === 'undefined') return;
    if (localStorage.getItem(FRESH_START_KEY)) return;
    await db.attempts.clear();
    await db.reviews.clear();
    await db.submissions.clear();
    await db.progress.clear();
    localStorage.removeItem('efiper:mirror');
    localStorage.setItem(FRESH_START_KEY, new Date().toISOString());
  } catch { /* almacenamiento no disponible */ }
}
