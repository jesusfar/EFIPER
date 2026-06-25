import type { BackupFile } from '../../types';

export interface CloudUser {
  id: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
}

interface ApiResult<T> {
  data: T | null;
  error: string | null;
}

async function api<T>(path: string, init: RequestInit = {}): Promise<ApiResult<T>> {
  try {
    const res = await fetch(`/api/${path}`, {
      ...init,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(init.headers ?? {}),
      },
    });
    const contentType = res.headers.get('Content-Type') || '';
    if (!contentType.includes('application/json')) {
      return { data: null, error: 'EFIPER Cloud no respondio como API. Revisa el deploy de Cloudflare.' };
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { data: null, error: data.error || 'No se pudo completar la operacion.' };
    return { data: data as T, error: null };
  } catch {
    return { data: null, error: 'No hay conexion con EFIPER Cloud.' };
  }
}

export async function getCloudUser(): Promise<ApiResult<{ user: CloudUser }>> {
  return api('auth/me');
}

export async function registerCloudAccount(input: { email: string; password: string; displayName: string; remember?: boolean }): Promise<ApiResult<{ user: CloudUser }>> {
  return api('auth/register', { method: 'POST', body: JSON.stringify(input) });
}

export async function loginCloudAccount(input: { email: string; password: string; remember?: boolean }): Promise<ApiResult<{ user: CloudUser }>> {
  return api('auth/login', { method: 'POST', body: JSON.stringify(input) });
}

export async function logoutCloudAccount(): Promise<ApiResult<{ ok: true }>> {
  return api('auth/logout', { method: 'POST', body: '{}' });
}

export async function pullCloudSnapshot(): Promise<ApiResult<{ snapshot: BackupFile | null; exportedAt?: number; updatedAt?: number }>> {
  return api('sync/pull');
}

export async function pushCloudSnapshot(snapshot: BackupFile): Promise<ApiResult<{ ok: true; exportedAt: number; updatedAt: number }>> {
  return api('sync/push', { method: 'POST', body: JSON.stringify({ snapshot }) });
}
