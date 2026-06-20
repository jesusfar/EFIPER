import { FormEvent, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import {
  type CloudUser,
  getCloudUser,
  loginCloudAccount,
  logoutCloudAccount,
  registerCloudAccount,
} from '../../lib/api/cloud';
import { syncWithCloud } from '../../lib/sync/cloudSync';
import { useStore } from '../../store/useStore';

type Mode = 'login' | 'register';

export function AccountPage() {
  const location = useLocation();
  const init = useStore((s) => s.init);
  const [user, setUser] = useState<CloudUser | null>(null);
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function refreshUser() {
    const res = await getCloudUser();
    setUser(res.data?.user ?? null);
    return res.data?.user ?? null;
  }

  useEffect(() => {
    void refreshUser();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('cloud') === 'connected') {
      setMessage('Cuenta conectada. Ya podes sincronizar tu progreso.');
      void refreshUser();
    }
    if (params.get('cloud') === 'oauth_error') {
      setMessage('No se pudo completar el login social.');
    }
  }, [location.search]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage('');
    const res = mode === 'login'
      ? await loginCloudAccount({ email, password })
      : await registerCloudAccount({ email, password, displayName });
    setBusy(false);
    if (res.error) {
      setMessage(res.error);
      return;
    }
    if (!res.data?.user) {
      setMessage('EFIPER Cloud respondio sin datos de usuario. Revisa el deploy de Cloudflare.');
      return;
    }
    setUser(res.data.user);
    setPassword('');
    setMessage('Sesion iniciada. Tu progreso local se puede subir a la nube.');
  }

  async function sync() {
    setBusy(true);
    setMessage('Sincronizando...');
    const result = await syncWithCloud();
    if (result.importedRemote) await init();
    setBusy(false);
    setMessage(result.message);
  }

  async function logout() {
    setBusy(true);
    await logoutCloudAccount();
    setBusy(false);
    setUser(null);
    setMessage('Sesion cerrada. EFIPER sigue guardando progreso local.');
  }

  return (
    <div className="space-y-6">
      <section className="panel panel-vibrant p-6">
        <p className="label">EFIPER Cloud</p>
        <h1 className="font-display text-3xl md:text-4xl text-ink mt-1">Cuenta y progreso online</h1>
        <p className="mt-3 text-sm md:text-base text-ink/75 max-w-2xl">
          Usa EFIPER desde el navegador sin descargar nada. Al iniciar sesion, podes guardar tu progreso en la nube y recuperarlo en otro dispositivo.
        </p>
      </section>

      {user ? (
        <Card className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              {user.avatarUrl && <img src={user.avatarUrl} alt="" className="h-12 w-12 rounded-full border border-accent/40" />}
              <div>
                <p className="label">Sesion activa</p>
                <h2 className="font-display text-2xl text-ink">{user.displayName || user.email}</h2>
                <p className="text-sm text-ink/70">{user.email}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="primary" onClick={sync} disabled={busy}>Sincronizar</Button>
              <Button onClick={logout} disabled={busy}>Salir</Button>
            </div>
          </div>
          {message && <p className="rounded-lg bg-panel-2 border border-accent/30 px-4 py-3 text-sm text-ink/80">{message}</p>}
        </Card>
      ) : (
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
          <Card>
            <div className="flex gap-2 mb-5">
              <Button variant={mode === 'login' ? 'primary' : 'ghost'} onClick={() => setMode('login')}>Ingresar</Button>
              <Button variant={mode === 'register' ? 'primary' : 'ghost'} onClick={() => setMode('register')}>Registrarme</Button>
            </div>

            <form className="space-y-4" onSubmit={submit}>
              {mode === 'register' && (
                <label className="block">
                  <span className="label">Nombre</span>
                  <input className="input mt-1" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Tu nombre" />
                </label>
              )}
              <label className="block">
                <span className="label">Email</span>
                <input className="input mt-1" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" required />
              </label>
              <label className="block">
                <span className="label">Contrasena</span>
                <input className="input mt-1" type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required />
              </label>
              <Button variant="primary" type="submit" disabled={busy}>{mode === 'login' ? 'Entrar' : 'Crear cuenta'}</Button>
            </form>
            {message && <p className="mt-4 rounded-lg bg-panel-2 border border-accent/30 px-4 py-3 text-sm text-ink/80">{message}</p>}
          </Card>

          <Card className="space-y-3">
            <p className="label">Login social</p>
            <h2 className="font-display text-2xl text-ink">Entrar con tu cuenta</h2>
            <Button className="w-full" type="button" onClick={() => { window.location.href = '/api/auth/oauth/google/start'; }}>
              Continuar con Google
            </Button>
            <Button className="w-full" type="button" onClick={() => { window.location.href = '/api/auth/oauth/facebook/start'; }}>
              Continuar con Facebook
            </Button>
            <p className="text-xs text-ink/65">
              En desarrollo local estos botones requieren configurar credenciales OAuth en Cloudflare.
            </p>
          </Card>
        </div>
      )}
    </div>
  );
}
