import { FormEvent, useEffect, useRef, useState } from 'react';
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
import gaspiImage from '../../assets/memorial/gaspi.png';
import oliverTreeImage from '../../assets/memorial/oliver-tree.png';
import gaspiBuenasSfx from '../../assets/memorial/audio/gaspi-buenas.mp3';
import gaspiFiumbaSfx from '../../assets/memorial/audio/gaspi-fiumba.mp3';
import oliverTreeSfx from '../../assets/memorial/audio/oliver-tree-rip.mp3';

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
  const [checkingUser, setCheckingUser] = useState(true);
  const memorialAudioRef = useRef<HTMLAudioElement | null>(null);

  function playMemorialAudio(urls: string[]) {
    const url = urls[Math.floor(Math.random() * urls.length)];
    try {
      memorialAudioRef.current?.pause();
      const audio = new Audio(url);
      audio.volume = 0.85;
      memorialAudioRef.current = audio;
      void audio.play();
    } catch {
      // El navegador puede bloquear audio hasta que exista una interaccion del usuario.
    }
  }

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
    return () => {
      memorialAudioRef.current?.pause();
      memorialAudioRef.current = null;
    };
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

      <section className="overflow-hidden rounded-2xl border border-accent/25 bg-white/90 shadow-soft">
        <div className="grid md:grid-cols-[0.8fr_1fr_0.8fr]">
          <div
            className="relative min-h-56 md:min-h-72 cursor-pointer overflow-hidden"
            onMouseEnter={() => playMemorialAudio([gaspiBuenasSfx, gaspiFiumbaSfx])}
            onFocus={() => playMemorialAudio([gaspiBuenasSfx, gaspiFiumbaSfx])}
            tabIndex={0}
            aria-label="Reproducir audio de Gaspar Gaspi Prim Diaz"
          >
            <img
              src={gaspiImage}
              alt="Gaspar Gaspi Prim Diaz"
              className="absolute inset-0 h-full w-full object-cover transition duration-300 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/35" />
          </div>

          <div className="flex flex-col items-center justify-center px-6 py-8 text-center">
            <p className="label">Homenaje</p>
            <h2 className="mt-3 font-display text-2xl md:text-3xl text-ink leading-tight">
              En memoria de Gaspar &quot;Gaspi&quot; Prim Díaz y Oliver Tree, que en paz descansen.
            </h2>
            <div className="mt-5 h-1 w-24 rounded-full bg-accent" />
          </div>

          <div
            className="relative min-h-56 md:min-h-72 cursor-pointer overflow-hidden"
            onMouseEnter={() => playMemorialAudio([oliverTreeSfx])}
            onFocus={() => playMemorialAudio([oliverTreeSfx])}
            tabIndex={0}
            aria-label="Reproducir audio de Oliver Tree"
          >
            <img
              src={oliverTreeImage}
              alt="Oliver Tree"
              className="absolute inset-0 h-full w-full object-cover transition duration-300 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white/35" />
          </div>
        </div>
      </section>
    </div>
  );
}
