import { type MouseEvent, type PointerEvent, type ReactNode, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { playSfx, playLogoHover } from '../lib/audio/soundManager';
import { useStore } from '../store/useStore';
import efiperLogo from '../assets/logo-efiper-cropped.webp';
import { AuthFirstVisitPrompt } from '../features/account/AuthFirstVisitPrompt';

const NAV = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/teoria', label: 'Teoría' },
  { to: '/test', label: 'Test' },
  { to: '/oral', label: 'Oral' },
  { to: '/caso/case-001', label: 'Caso' },
  { to: '/repaso', label: 'Repaso' },
  { to: '/simulacro', label: 'Simulacro' },
  { to: '/cuenta', label: 'Cuenta' },
];

export function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isTheoryReader = location.pathname.startsWith('/teoria/');
  const levelUpNotice = useStore((s) => s.levelUpNotice);
  const dismissLevelUpNotice = useStore((s) => s.dismissLevelUpNotice);
  const lastTouchLogoAt = useRef(0);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!levelUpNotice) return;
    const id = window.setTimeout(dismissLevelUpNotice, 6200);
    return () => window.clearTimeout(id);
  }, [dismissLevelUpNotice, levelUpNotice]);

  function handleLogoPointerDown(event: PointerEvent<HTMLAnchorElement>) {
    if (event.pointerType === 'mouse') return;
    lastTouchLogoAt.current = Date.now();
    playLogoHover();
  }

  function handleLogoMouseEnter() {
    if (Date.now() - lastTouchLogoAt.current < 800) return;
    playLogoHover();
  }

  function handleLogoClick(event: MouseEvent<HTMLAnchorElement>) {
    if (Date.now() - lastTouchLogoAt.current < 800) {
      event.preventDefault();
    }
  }

  return (
    <div className="min-h-full flex flex-col">
      <AuthFirstVisitPrompt />

      {levelUpNotice && (
        <div className="level-up-toast" role="status" aria-live="polite">
          <div className="level-up-orbit" aria-hidden="true" />
          <div className="level-up-copy">
            <span className="level-up-kicker">Subiste de nivel</span>
            <strong>Nivel {levelUpNotice.level}</strong>
            <span>Nuevo rango: {levelUpNotice.rank}</span>
          </div>
          <button className="level-up-close" type="button" aria-label="Cerrar aviso de nivel" onClick={dismissLevelUpNotice}>
            x
          </button>
        </div>
      )}

      {!isTheoryReader && (
        <header className="sticky top-0 z-20 backdrop-blur border-b border-accent/40 bg-[linear-gradient(135deg,#003F3A,#005E50_58%,#324A4D)] shadow-stud">
          <div className="max-w-5xl mx-auto px-4 py-2 lg:min-h-20 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 lg:gap-4">
            <NavLink
              to="/"
              className="brand-logo-link"
              aria-label="Reproducir sonido del logo de EFIPER"
              onPointerDown={handleLogoPointerDown}
              onMouseEnter={handleLogoMouseEnter}
              onClick={handleLogoClick}
            >
              <img src={efiperLogo} alt="EFIPER" className="brand-logo" />
              <span
                className="brand-logo-shine"
                aria-hidden="true"
                style={{ WebkitMaskImage: `url(${efiperLogo})`, maskImage: `url(${efiperLogo})` }}
              />
            </NavLink>
            <nav className="nav-strip flex w-full lg:w-auto items-center gap-1 overflow-x-auto pb-1 lg:pb-0">
              {NAV.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end={n.end}
                  onMouseEnter={() => playSfx('hover')}
                  className={({ isActive }) =>
                    `sfx-click shrink-0 px-3 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap transition ${
                      isActive ? 'bg-accent text-white shadow-stud' : 'text-white/75 hover:text-white hover:bg-white/10'
                    }`
                  }
                >
                  {n.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </header>
      )}

      <main className={`flex-1 w-full ${isTheoryReader ? '' : 'max-w-5xl mx-auto px-4 py-8'}`}>
        {children}
      </main>

      {!isTheoryReader && (
        <footer className="text-center text-xs text-white/75 py-6 border-t border-accent/30 bg-stud-dim">
          EFIPER · herramienta personal de estudio · online, offline y con progreso sincronizable
        </footer>
      )}
    </div>
  );
}
