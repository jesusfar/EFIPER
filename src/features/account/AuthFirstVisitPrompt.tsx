import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '../../components/Button';
import { getCloudUser } from '../../lib/api/cloud';
import { CloudAuthPanel } from './CloudAuthPanel';
import siggySaludando from '../../assets/siggy/saludando.png';

export function AuthFirstVisitPrompt() {
  const location = useLocation();
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      if (location.pathname === '/cuenta' || dismissed) return;

      const res = await getCloudUser();
      if (cancelled) return;
      if (res.data?.user) {
        setShow(false);
        return;
      }
      setShow(true);
    }

    void check();
    return () => {
      cancelled = true;
    };
  }, [dismissed, location.pathname]);

  function close() {
    setDismissed(true);
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="auth-first-overlay" role="dialog" aria-modal="true" aria-labelledby="auth-first-title">
      <section className="auth-first-shell">
        <div className="auth-first-copy">
          <div className="auth-first-copy-text">
            <p className="label">EFIPER Cloud</p>
            <h2 id="auth-first-title" className="font-display text-2xl md:text-3xl text-ink mt-1">
              Guarda tu progreso desde el primer intento
            </h2>
            <p className="mt-2 text-sm text-ink/75">
              Inicia sesion o crea una cuenta para sincronizar tus respuestas, repasos y avances. Si ya iniciaste sesion, EFIPER no te va a sacar de tu cuenta.
            </p>
          </div>
          <div className="auth-first-siggy" aria-hidden="true">
            <img src={siggySaludando} alt="" />
          </div>
        </div>

        <CloudAuthPanel compact onAuthenticated={close} />

        <div className="auth-first-actions">
          <Button type="button" onClick={close}>Seguir sin cuenta por ahora</Button>
        </div>
      </section>
    </div>
  );
}
