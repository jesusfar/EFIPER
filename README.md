# EFIPER — Entrenador EFIP I

PWA personal para preparar el **EFIP I** (Licenciatura en Informática, U. Siglo 21).
Offline, sin backend, sin costos. Tu progreso queda en el dispositivo.
Colores institucionales Siglo 21 (verde) y sonidos arcade originales (estilo glockenspiel).

---

## ▶ Abrir SIN terminal (la forma más simple)

1. Descomprimí el `.zip`.
2. **Doble clic en `EFIPER.html`** — se abre en tu navegador y funciona.
   - En Windows también podés usar **`Abrir EFIPER.bat`**.
   - En macOS, **`Abrir EFIPER.command`** (la primera vez: clic derecho → Abrir).

`EFIPER.html` es un único archivo autónomo (todo embebido). No instala nada, no necesita internet (salvo para las tipografías; sin conexión usa las del sistema).

> **Importante sobre tu progreso:** abriendo el archivo directamente, el navegador guarda el avance localmente, pero según el navegador puede borrarse al limpiar datos. Usá el botón **Exportar** del dashboard cada tanto para respaldar tu progreso en un `.json`. Para persistencia garantizada + instalación como app, usá la versión servida (ver abajo).

---

## 🛠 Desarrollo y versión "app" instalable (opcional, requiere Node.js 18+)

```bash
npm install
npm run dev        # desarrollo en http://localhost:5173/efiper/
npm run build      # build PWA (carpeta dist/) → instalable, offline real con service worker
npm run preview    # previsualizar el build
```

### Regenerar el archivo de doble clic
```bash
npm run build:single   # genera dist-single/index.html
# copialo a la raíz como EFIPER.html
```

### Deploy a GitHub Pages
1. Subí el repo (ej. `efiper`) y ajustá `base` en `vite.config.ts` al nombre del repo (`/efiper/`); para dominio propio usá `/`.
2. `npm run build` → publicá `dist/`. Usa HashRouter, así que funciona en Pages sin reglas extra.

---

## Colores (marca Siglo 21)
El verde institucional está centralizado en `tailwind.config.js`, token **`stud: '#009e8e'`**.
Si tenés el hex oficial del manual de marca, cambiá solo ese valor (y `stud-dim` para el verde oscuro).

## Sonido
Efectos **sintetizados en el navegador** (Web Audio API), con timbre de glockenspiel + reverb tipo menú LEGO. Sin samples con copyright. Silenciables con el ícono 🔊.

## Estructura
```
src/
├── app/                 # App, Layout, router
├── components/          # Button, Card, Timer, MermaidView, SoundToggle, ProgressBar
├── data/                # contenido estático (JSON) + loaders (questions/ oral/ cases/ rubrics/)
├── features/            # dashboard, tests, oral, cases, reviews, simulation
├── lib/
│   ├── storage/         # Dexie / IndexedDB
│   ├── spaced-repetition/  # Leitner (5 cajas)
│   ├── scoring/         # corrección por reglas (RF/RNF/UC/clases/DER/red)
│   ├── audio/           # sonidos glockenspiel (Web Audio, sin copyright)
│   └── import-export/   # respaldo JSON + espejo en localStorage
├── store/               # estado global (Zustand)
├── types/  └── styles/
```

## Ampliar el banco (sin tocar el núcleo)
Agregá objetos a `src/data/questions/sample.json`, `oral/sample.json` y `cases/sample.json`
(o nuevos archivos concatenados en `src/data/index.ts`). Cada ítem DEBE llevar `explanation`/`modelAnswer`.

## Estado de los módulos
- ✅ Dashboard, Test, Defensa oral (Leitner), Caso (timer + rúbricas + Mermaid), Repaso, Export/Import, Sonidos, PWA, archivo de doble clic.
- 🔜 (P1) Simulacro orquestado en una sola sesión con nota unificada; banco grande desde los materiales.
