import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { App } from './app/App';
import './styles/index.css';
import { installSoundUnlock, installButtonClickSound } from './lib/audio/soundManager';

installSoundUnlock();
installButtonClickSound();

// HashRouter: funciona en GitHub Pages sin configuración extra de rutas.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
);
