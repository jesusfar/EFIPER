import { useCallback, useEffect, useRef, useState } from 'react';
import { SIGGY_DIALOGUES, type SiggyDialogue } from './dialogues';
import { SIGGY_SPRITES } from './sprites';
import './siggy.css';

// Sprites de rotación general (sin Plomero ni el saludo inicial).
const GENERAL_SPRITES = [
  'Corriendo.png', 'DeathNote.png', 'Fumando.png', 'Furry.png', 'Hacker.png',
  'Jujutsu.png', 'Libreta.png', 'Profesor.png', 'Pulgares_Arriba.png', 'Siggyexe.png',
];

// Sprite exclusivo del saludo inicial (no entra en la rotación normal).
const GREETING_SPRITE = 'Saludo Inicial.png';
const GREETING_TEXT =
  '¡Hola! Soy Siggy, tu asistente académico. Veo que elegiste Siglo 21 e Informática… así que tranquilo: ya no puedo empeorar mucho más tu toma de decisiones. ¿Empezamos?';

const TYPE_MS = 32;   // velocidad de escritura por caracter
const HOLD_MS = 8000; // espera tras terminar de escribir antes de cambiar

// El saludo solo se muestra la primera vez por arranque del programa (recarga de página).
let greetingShownThisSession = false;

function pickDialogue(lastId: number | null): SiggyDialogue {
  const pool = SIGGY_DIALOGUES.filter((d) => d.id !== lastId);
  return pool[Math.floor(Math.random() * pool.length)];
}

function pickSprite(d: SiggyDialogue, lastSprite: string | null): string {
  const base = d.sprites && d.sprites.length ? d.sprites : GENERAL_SPRITES;
  // El sprite anterior no puede ser el siguiente.
  const filtered = base.filter((s) => s !== lastSprite);
  const pool = filtered.length ? filtered : base;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function Siggy() {
  const [sprite, setSprite] = useState(GREETING_SPRITE);
  const [fullText, setFullText] = useState('');
  const [shown, setShown] = useState('');
  const [tick, setTick] = useState(0); // fuerza re-animación de glitch/proyección

  const lastIdRef = useRef<number | null>(null);
  const lastSpriteRef = useRef<string | null>(null);
  const typingRef = useRef<number | null>(null);
  const holdRef = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    if (typingRef.current !== null) { window.clearInterval(typingRef.current); typingRef.current = null; }
    if (holdRef.current !== null) { window.clearTimeout(holdRef.current); holdRef.current = null; }
  }, []);

  const present = useCallback((text: string, spriteName: string) => {
    clearTimers();
    lastSpriteRef.current = spriteName;
    setSprite(spriteName);
    setFullText(text);
    setShown('');
    setTick((t) => t + 1);
  }, [clearTimers]);

  const advance = useCallback(() => {
    const d = pickDialogue(lastIdRef.current);
    lastIdRef.current = d.id;
    present(d.text, pickSprite(d, lastSpriteRef.current));
  }, [present]);

  // Al montar (entrar al Dashboard): saludo inicial o diálogo aleatorio.
  useEffect(() => {
    if (!greetingShownThisSession) {
      greetingShownThisSession = true;
      present(GREETING_TEXT, GREETING_SPRITE);
    } else {
      advance();
    }
    return () => clearTimers();
  }, [present, advance, clearTimers]);

  // Efecto máquina de escribir + espera de 5s al terminar.
  useEffect(() => {
    if (!fullText) return;
    let i = 0;
    typingRef.current = window.setInterval(() => {
      i += 1;
      setShown(fullText.slice(0, i));
      if (i >= fullText.length) {
        if (typingRef.current !== null) { window.clearInterval(typingRef.current); typingRef.current = null; }
        holdRef.current = window.setTimeout(advance, HOLD_MS);
      }
    }, TYPE_MS);
    return () => {
      if (typingRef.current !== null) { window.clearInterval(typingRef.current); typingRef.current = null; }
    };
  }, [fullText, advance]);

  const onClick = useCallback(() => {
    if (shown.length < fullText.length) {
      // Aún escribiendo → completar de golpe y arrancar la espera.
      if (typingRef.current !== null) { window.clearInterval(typingRef.current); typingRef.current = null; }
      setShown(fullText);
      if (holdRef.current !== null) window.clearTimeout(holdRef.current);
      holdRef.current = window.setTimeout(advance, HOLD_MS);
    } else {
      advance(); // ya terminó → siguiente diálogo
    }
  }, [shown, fullText, advance]);

  const typing = shown.length < fullText.length;

  // Panel inline dentro del Dashboard: tiene su propio espacio, no tapa botones.
  return (
    <div className="siggy-panel" onClick={onClick} role="button" tabIndex={0} aria-label="Siggy, asistente académico">
      <div className="siggy-sprite-wrap">
        <img key={`s${tick}`} src={SIGGY_SPRITES[sprite]} alt="Siggy" className="siggy-sprite" draggable={false} />
      </div>
      <div className="siggy-dialog-wrap">
        <div className="siggy-dialog siggy-project" key={`d${tick}`}>
          <span className="siggy-text">{shown}</span>
          {typing && <span className="siggy-caret" aria-hidden="true" />}
        </div>
      </div>
    </div>
  );
}
