import { FormEvent, useState } from 'react';
import { Button } from '../../components/Button';
import {
  type CloudUser,
  loginCloudAccount,
  registerCloudAccount,
} from '../../lib/api/cloud';

type Mode = 'login' | 'register';

interface CloudAuthPanelProps {
  onAuthenticated: (user: CloudUser) => void;
  initialMessage?: string;
  compact?: boolean;
}

export function CloudAuthPanel({ onAuthenticated, initialMessage = '', compact = false }: CloudAuthPanelProps) {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [message, setMessage] = useState(initialMessage);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage('');
    const res = mode === 'login'
      ? await loginCloudAccount({ email, password, remember })
      : await registerCloudAccount({ email, password, displayName, remember });
    setBusy(false);
    if (res.error) {
      setMessage(res.error);
      return;
    }
    if (!res.data?.user) {
      setMessage('EFIPER Cloud respondio sin datos de usuario. Revisa el deploy de Cloudflare.');
      return;
    }
    setPassword('');
    setMessage('Sesion iniciada. Tu progreso local se puede subir a la nube.');
    onAuthenticated(res.data.user);
  }

  function continueWithGoogle() {
    const params = remember ? '?remember=1' : '';
    window.location.href = `/api/auth/oauth/google/start${params}`;
  }

  const wrapperClass = compact
    ? 'grid gap-4 md:grid-cols-[minmax(0,1.05fr)_minmax(260px,0.95fr)]'
    : 'grid lg:grid-cols-[1.08fr_0.92fr] gap-6';
  const panelClass = compact ? 'p-4' : 'p-5 sm:p-6';
  const formClass = compact ? 'space-y-3' : 'space-y-4';

  return (
    <div className={wrapperClass}>
      <div className={`panel auth-panel-primary ${panelClass}`}>
        <div className="flex gap-2 mb-5">
          <Button variant={mode === 'login' ? 'primary' : 'ghost'} onClick={() => setMode('login')}>Ingresar</Button>
          <Button variant={mode === 'register' ? 'primary' : 'ghost'} onClick={() => setMode('register')}>Crear cuenta</Button>
        </div>

        <form className={formClass} onSubmit={submit}>
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
          <label className="auth-check">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            <span>Mantener mi sesion iniciada</span>
          </label>
          <Button variant="primary" type="submit" disabled={busy} className="w-full sm:w-auto">
            {mode === 'login' ? 'Entrar' : 'Crear cuenta'}
          </Button>
        </form>
        {message && <p className="mt-4 rounded-lg bg-panel-2 border border-accent/30 px-4 py-3 text-sm text-ink/80">{message}</p>}
      </div>

      <div className={`panel auth-panel-social ${panelClass}`}>
        <p className="label">Opcional</p>
        <h2 className="font-display text-xl sm:text-2xl text-ink mt-1">Entrar con redes</h2>
        <p className="mt-2 text-sm text-ink/70">
          Si preferis no crear contrasena, podes usar tu cuenta de Google.
        </p>
        <div className={compact ? 'mt-4 grid gap-2.5' : 'mt-5 grid gap-3'}>
          <Button className="w-full auth-social-button" type="button" onClick={continueWithGoogle}>
            <span className="auth-social-mark google-mark">G</span>
            Continuar con Google
          </Button>
        </div>
      </div>
    </div>
  );
}
