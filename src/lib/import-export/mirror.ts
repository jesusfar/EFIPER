import { db, loadProgress } from '../storage/db';
import { exportBackup, importData } from './backup';
import type { BackupFile } from '../../types';

const KEY = 'efiper:mirror';

export async function saveMirror(): Promise<void> {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(KEY, JSON.stringify(await exportBackup()));
  } catch { /* almacenamiento no disponible */ }
}

// Si IndexedDB está vacío pero hay un espejo con datos, lo restaura.
export async function restoreFromMirrorIfNeeded(): Promise<void> {
  try {
    if (typeof localStorage === 'undefined') return;
    const raw = localStorage.getItem(KEY);
    if (!raw) return;
    const mirror = JSON.parse(raw) as BackupFile;
    const progress = await loadProgress();
    const attempts = await db.attempts.count();
    const empty = attempts === 0 && progress.xp === 0 && !progress.examDate;
    const hasData = (mirror.attempts?.length ?? 0) > 0 || (mirror.progress?.xp ?? 0) > 0 || !!mirror.progress?.examDate;
    if (empty && hasData) await importData(mirror);
  } catch { /* ignore */ }
}
