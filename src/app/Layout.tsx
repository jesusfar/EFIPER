import { type ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { playSfx, playLogoHover } from '../lib/audio/soundManager';
import efiperLogo from '../assets/logo-efiper-cropped.png';

const NAV = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/teoria', label: 'Teoría' },
  { to: '/test', label: 'Test' },
  { to: '/oral', label: 'Oral' },
  { to: '/caso/case-001', label: 'Caso' },
  { to: '/repaso', label: 'Repaso' },
  { to: '/simulacro', label: 'Simulacro' },
];

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-full flex flex-col">
      <header className="sticky top-0 z-20 backdrop-blur border-b border-accent/40 bg-[linear-gradient(135deg,#003F3A,#005E50_58%,#324A4D)] shadow-stud">
        <div className="max-w-5xl mx-auto px-4 py-2 lg:min-h-20 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 lg:gap-4">
          <NavLink to="/" className="brand-logo-link" aria-label="Ir al inicio de EFIPER" onMouseEnter={playLogoHover}>
            <img src={efiperLogo} alt="EFIPER" className="brand-logo" />
            <span
              className="brand-logo-shine"
              aria-hidden="true"
              style={{ WebkitMaskImage: `url(${efiperLogo})`, maskImage: `url(${efiperLogo})` }}
            />
          </NavLink>
          <nav className="nav-strip flex w-full lg:w-auto items-center gap-1 overflow-x-auto pb-1 lg:pb-0">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.end} onMouseEnter={() => playSfx('hover')}
                className={({ isActive }) =>
                  `sfx-click shrink-0 px-3 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap transition ${
                    isActive ? 'bg-accent text-white shadow-stud' : 'text-white/75 hover:text-white hover:bg-white/10'
                  }`}>
                {n.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8">{children}</main>
      <footer className="text-center text-xs text-white/75 py-6 border-t border-accent/30 bg-stud-dim">
        EFIPER · herramienta personal de estudio · sin costo, offline, tu progreso queda en este dispositivo
      </footer>
    </div>
  );
}
