import { db, loadProgress, saveProgress, DEFAULT_PROGRESS } from '../storage/db';
import type { BackupFile } from '../../types';

export async function exportBackup(): Promise<BackupFile> {
  const [progress, attempts, reviews, submissions] = await Promise.all([
    loadProgress(),
    db.attempts.toArray(),
    db.reviews.toArray(),
    db.submissions.toArray(),
  ]);
  return { app: 'EFIPER', version: '0.2.0', exportedAt: Date.now(), progress, attempts, reviews, submissions };
}

export async function downloadBackup(): Promise<void> {
  const data = await exportBackup();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `efiper-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function importData(data: BackupFile): Promise<void> {
  if (data.app !== 'EFIPER') throw new Error('Archivo no reconocido como respaldo de EFIPER.');
  await db.transaction('rw', db.attempts, db.reviews, db.submissions, db.progress, async () => {
    await Promise.all([db.attempts.clear(), db.reviews.clear(), db.submissions.clear()]);
    if (data.attempts?.length) await db.attempts.bulkAdd(data.attempts.map(({ id, ...rest }) => rest));
    if (data.reviews?.length) await db.reviews.bulkPut(data.reviews);
    if (data.submissions?.length) await db.submissions.bulkPut(data.submissions);
    await saveProgress({ ...DEFAULT_PROGRESS, ...(data.progress ?? {}) });
  });
}

export async function importBackup(file: File): Promise<void> {
  const text = await file.text();
  await importData(JSON.parse(text) as BackupFile);
}
