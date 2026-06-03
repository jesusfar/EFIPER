import { create } from 'zustand';
import type { Attempt, ReviewItem, Topic, UserProgress } from '../types';
import { db, loadProgress, saveProgress } from '../lib/storage/db';
import { newReviewItem, grade } from '../lib/spaced-repetition/leitner';
import { configureSound, playSfx } from '../lib/audio/soundManager';
import { saveMirror, restoreFromMirrorIfNeeded } from '../lib/import-export/mirror';

const LEVELS = [0, 200, 500, 1000, 1800, 3000, 5000, 8000];
function levelForXp(xp: number): number {
  let lvl = 1;
  for (let i = 0; i < LEVELS.length; i++) if (xp >= LEVELS[i]) lvl = i + 1;
  return lvl;
}
function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

interface State {
  progress: UserProgress | null;
  reviews: ReviewItem[];
  ready: boolean;
  init: () => Promise<void>;
  setExamDate: (iso: string) => Promise<void>;
  setVolume: (v: number) => Promise<void>;
  toggleNoPressure: () => Promise<void>;
  addXp: (amount: number) => Promise<void>;
  recordAnswer: (a: Omit<Attempt, 'timestamp'>) => Promise<void>;
  gradeReview: (refId: string, correct: boolean) => Promise<void>;
  reloadReviews: () => Promise<void>;
}

export const useStore = create<State>((set, get) => ({
  progress: null,
  reviews: [],
  ready: false,

  init: async () => {
    await restoreFromMirrorIfNeeded();
    const loadedProgress = await loadProgress();
    const shouldFixSound = !loadedProgress.settings.soundEnabled || loadedProgress.settings.volume < 0.55;
    const progress = shouldFixSound
      ? { ...loadedProgress, settings: { ...loadedProgress.settings, soundEnabled: true, volume: Math.max(0.6, loadedProgress.settings.volume) } }
      : loadedProgress;
    if (shouldFixSound) {
      await saveProgress(progress);
      void saveMirror();
    }
    configureSound({ enabled: true, volume: progress.settings.volume });
    const reviews = await db.reviews.toArray();
    set({ progress, reviews, ready: true });
  },

  setExamDate: async (iso) => {
    const p = get().progress!;
    const next = { ...p, examDate: iso };
    await saveProgress(next);
    set({ progress: next });
    void saveMirror();
  },

  setVolume: async (v) => {
    const p = get().progress!;
    const next = { ...p, settings: { ...p.settings, volume: v } };
    configureSound({ volume: v });
    await saveProgress(next);
    set({ progress: next });
  },

  toggleNoPressure: async () => {
    const p = get().progress!;
    const next = { ...p, settings: { ...p.settings, noPressure: !p.settings.noPressure } };
    await saveProgress(next);
    set({ progress: next });
  },

  addXp: async (amount) => {
    const p = get().progress!;
    const xp = p.xp + amount;
    const level = levelForXp(xp);
    if (level > p.level) playSfx('levelUp');
    const next = { ...p, xp, level };
    await saveProgress(next);
    set({ progress: next });
    void saveMirror();
  },

  recordAnswer: async ({ refId, refType, userAnswer, correct, timeSpent, topic, mode, confidence }) => {
    await db.attempts.add({
      refId, refType, userAnswer, correct, timeSpent, topic, mode, confidence,
      timestamp: Date.now(),
    });

    // Estadística por tema
    const p = get().progress!;
    const stat = p.topicStats[topic] ?? { answered: 0, correct: 0 };
    const topicStats = {
      ...p.topicStats,
      [topic]: { answered: stat.answered + 1, correct: stat.correct + (correct ? 1 : 0) },
    };

    // Racha + misión diaria
    const day = todayKey();
    let { streak, lastStreakDay, dailyMissionDone, dailyMissionDay } = p;
    if (dailyMissionDay !== day) { dailyMissionDone = false; dailyMissionDay = day; }
    if (!dailyMissionDone) {
      dailyMissionDone = true;
      if (lastStreakDay !== day) {
        streak = streak + 1;
        lastStreakDay = day;
        playSfx('streak');
      }
    }

    const next = { ...p, topicStats, streak, lastStreakDay, dailyMissionDone, dailyMissionDay, lastSessionAt: Date.now() };
    await saveProgress(next);
    set({ progress: next });

    // Cola de repaso: crear/actualizar item
    const id = `${refType}:${refId}`;
    let item = await db.reviews.get(id);
    if (!item) item = newReviewItem(refId, refType, topic);
    const updated = grade(item, correct);
    await db.reviews.put(updated);

    // XP
    await get().addXp(correct ? 10 : 0);
    await get().reloadReviews();
    void saveMirror();
  },

  gradeReview: async (refId, correct) => {
    const item = get().reviews.find((r) => r.refId === refId);
    if (!item) return;
    const updated = grade(item, correct);
    await db.reviews.put(updated);
    await get().reloadReviews();
    void saveMirror();
  },

  reloadReviews: async () => {
    const reviews = await db.reviews.toArray();
    set({ reviews });
  },
}));

export const TOPIC_LABELS: Record<Topic, string> = {
  analisis_diseno: 'Análisis y Diseño',
  poo_algoritmos: 'POO y Algoritmos',
  base_de_datos: 'Base de Datos',
  redes_comunicaciones: 'Redes y Comunicaciones',
  sistemas_operativos: 'Sistemas Operativos',
};
