import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '../../components/Button';
import { getCloudUser } from '../../lib/api/cloud';
import { CloudAuthPanel } from './CloudAuthPanel';

const PROMPT_SEEN_KEY = 'efiper.authPrompt.seen.v2';

export function AuthFirstVisitPrompt() {
  const location = useLocation();
  const [show, setShow] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      if (location.pathname === '/cuenta') return;
      if (window.localStorage.getItem(PROMPT_SEEN_KEY) === '1') return;

      const res = await Promise.race([
        getCloudUser(),
        new Promise<Awaited<ReturnType<typeof getCloudUser>>>((resolve) => {
          window.setTimeout(() => resolve({ data: null, error: 'timeout' }), 1500);
        }),
      ]);
      if (cancelled) return;
      if (res.data?.user) {
        window.localStorage.setItem(PROMPT_SEEN_KEY, '1');
        setShow(false);
        return;
      }
      setShow(true);
    }

    void check();
    return () => {
      cancelled = true;
    };
  }, [location.pathname]);

  function close() {
    window.localStorage.setItem(PROMPT_SEEN_KEY, '1');
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="auth-first-overlay" role="dialog" aria-modal="true" aria-labelledby="auth-first-title">
      <section className="auth-first-shell">
        <div className="auth-first-copy">
          <p className="label">EFIPER Cloud</p>
          <h2 id="auth-first-title" className="font-display text-3xl md:text-4xl text-ink mt-1">
            Guarda tu progreso desde el primer intento
          </h2>
          <p className="mt-3 text-sm md:text-base text-ink/75">
            Inicia sesion o crea una cuenta para sincronizar tus respuestas, repasos y avances. Si ya iniciaste sesion, EFIPER no te va a sacar de tu cuenta.
          </p>
        </div>

        <CloudAuthPanel compact onAuthenticated={close} />

        <div className="auth-first-actions">
          <Button type="button" onClick={close}>Seguir sin cuenta por ahora</Button>
        </div>
      </section>
    </div>
  );
}
