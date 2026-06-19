import { importData } from '../import-export/backup';
import { saveMirror } from '../import-export/mirror';
import { exportBackup } from '../import-export/backup';
import { pullCloudSnapshot, pushCloudSnapshot } from '../api/cloud';

export interface SyncResult {
  ok: boolean;
  importedRemote: boolean;
  pushedLocal: boolean;
  message: string;
}

export async function syncWithCloud(): Promise<SyncResult> {
  const local = await exportBackup();
  const remote = await pullCloudSnapshot();
  if (remote.error) return { ok: false, importedRemote: false, pushedLocal: false, message: remote.error };

  const remoteSnapshot = remote.data?.snapshot ?? null;
  if (remoteSnapshot && (remoteSnapshot.exportedAt ?? 0) > local.exportedAt) {
    await importData(remoteSnapshot);
    await saveMirror();
    return { ok: true, importedRemote: true, pushedLocal: false, message: 'Progreso restaurado desde la nube.' };
  }

  const pushed = await pushCloudSnapshot(local);
  if (pushed.error) return { ok: false, importedRemote: false, pushedLocal: false, message: pushed.error };

  return { ok: true, importedRemote: false, pushedLocal: true, message: 'Progreso sincronizado en la nube.' };
}
