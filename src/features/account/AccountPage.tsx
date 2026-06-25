import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import {
  type CloudUser,
  getCloudUser,
  logoutCloudAccount,
} from '../../lib/api/cloud';
import { syncWithCloud } from '../../lib/sync/cloudSync';
import { useStore } from '../../store/useStore';
import { CloudAuthPanel } from './CloudAuthPanel';

export function AccountPage() {
  const location = useLocation();
  const init = useStore((s) => s.init);
  const [user, setUser] = useState<CloudUser | null>(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [checkingUser, setCheckingUser] = useState(true);

  async function refreshUser() {
    const res = await getCloudUser();
    setUser(res.data?.user ?? null);
    setCheckingUser(false);
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

      {checkingUser ? (
        <Card>
          <p className="label">Verificando sesion</p>
          <div className="mt-4 h-3 w-48 rounded-full bg-accent/15 overflow-hidden">
            <div className="h-full w-1/2 rounded-full bg-accent animate-pulse" />
          </div>
        </Card>
      ) : user ? (
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
        <CloudAuthPanel
          key={message}
          initialMessage={message}
          onAuthenticated={(nextUser) => {
            setUser(nextUser);
            setMessage('Sesion iniciada. Tu progreso local se puede subir a la nube.');
          }}
        />
      )}
    </div>
  );
}
