// Gestor de sonido arcade ORIGINAL, sintetizado con Web Audio API.
// Timbre de glockenspiel/mazas + reverb (estilo menú LEGO). Sin samples con copyright.

export type Sfx = 'hover' | 'select' | 'confirm' | 'error' | 'collect' | 'levelUp' | 'streak' | 'modelAnswer';

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let reverb: ConvolverNode | null = null;
let enabled = true;
let volume = 0.6;
let unlockInstalled = false;
let warmingUp = false;
let keepAliveId: number | null = null;
let pendingSfx: Sfx | null = null;

// Samples MP3 incrustados (data URI) — funcionan también en build de archivo único / file://
import { SFX_SELECT, SFX_COLLECT, SFX_ERROR, SFX_LOGO1, SFX_LOGO2, SFX_LOGO3, SFX_LOGO4 } from './samples';
import akuAkuLogoSfx from '../../assets/audio/aku_aku.mp3';
import backButtonSfx from '../../assets/audio/back-button.mp3';
import bolivianoLogoSfx from '../../assets/audio/Boliviano.mp3';
import barbaNegraLogoSfx from '../../assets/audio/barba-negra.mp3';
import dekuLogoSfx from '../../assets/audio/oi-oi-oi-deku.mp3';
import jazwareLogoSfx from '../../assets/audio/lo-que-se-dano-fue-el-jazware.mp3';
import meowLogoSfx from '../../assets/audio/Meow.mp3';
import modelAnswerSfx from '../../assets/audio/Medio.mp3';
import levelCompleteSfx from '../../assets/audio/level-complete.mp3';
import levelFailedSfx from '../../assets/audio/level-failed.mp3';
import sapeeeLogoSfx from '../../assets/audio/sapeee-el-bananero.mp3';
import spiderman2099LogoSfx from '../../assets/audio/spiderman-2099-theme.mp3';
import uwuLogoSfx from '../../assets/audio/uwu_isolated_3db_boosted.mp3';
import specialLogoSfx from '../../assets/audio/you-are-my-special.mp3';

const themeHoverSfxs = Object.entries(
  import.meta.glob<string>('../../assets/audio/hover/*.mp3', { eager: true, query: '?url', import: 'default' })
);

const MP3_SFXS: Partial<Record<Sfx, string>> = {
  select: SFX_SELECT,
  collect: SFX_COLLECT,
  error: SFX_ERROR,
  modelAnswer: modelAnswerSfx,
};

// Sonidos que suenan al azar al hacer hover sobre el logo.
const LOGO_HOVER_SFXS: Array<{ url: string; volumeBoost?: number }> = [
  { url: SFX_LOGO1 },
  { url: SFX_LOGO2 },
  { url: SFX_LOGO3 },
  { url: SFX_LOGO4 },
  { url: akuAkuLogoSfx },
  { url: bolivianoLogoSfx },
  { url: uwuLogoSfx },
  { url: jazwareLogoSfx },
  { url: specialLogoSfx },
  { url: dekuLogoSfx },
  { url: sapeeeLogoSfx },
  { url: barbaNegraLogoSfx },
  { url: spiderman2099LogoSfx },
  { url: meowLogoSfx },
  ...themeHoverSfxs.map(([path, url]) => ({
    url,
    volumeBoost: path.endsWith('/plus-ultra.mp3') ? 1.65 : undefined,
  })),
];

function playMp3(url: string, volumeBoost = 1): void {
  try {
    const el = new Audio(url);
    el.volume = Math.max(0.05, Math.min(1, volume * volumeBoost));
    void el.play();
  } catch { /* audio no disponible */ }
}

// Reproduce uno de los sonidos del logo al azar, nunca el mismo que el anterior.
let lastLogoIdx = -1;
export function playLogoHover(): void {
  if (!enabled) return;
  const n = LOGO_HOVER_SFXS.length;
  let idx = Math.floor(Math.random() * n);
  if (n > 1 && idx === lastLogoIdx) idx = (idx + 1 + Math.floor(Math.random() * (n - 1))) % n;
  lastLogoIdx = idx;
  const sfx = LOGO_HOVER_SFXS[idx];
  playMp3(sfx.url, sfx.volumeBoost);
}

export function playBackButton(): void {
  if (!enabled) return;
  playMp3(backButtonSfx);
}

// Sonido de fin de test: se guarda la referencia para poder cortarlo si el
// usuario abandona la pantalla de resultados antes de que termine.
let resultAudio: HTMLAudioElement | null = null;

export function playResult(passed: boolean): void {
  stopResult();
  if (!enabled) return;
  try {
    const el = new Audio(passed ? levelCompleteSfx : levelFailedSfx);
    el.volume = Math.max(0.05, Math.min(1, volume));
    resultAudio = el;
    void el.play();
  } catch { /* audio no disponible */ }
}

export function stopResult(): void {
  if (!resultAudio) return;
  try {
    resultAudio.pause();
    resultAudio.currentTime = 0;
  } catch { /* ignorar */ }
  resultAudio = null;
}

function init(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (ctx) return ctx;
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = volume;
  master.connect(ctx.destination);
  // Reverb: impulso sintético (ruido decreciente) para la cola "de campana".
  reverb = ctx.createConvolver();
  const len = Math.floor(ctx.sampleRate * 1.3);
  const ir = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = ir.getChannelData(c);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
  }
  reverb.buffer = ir;
  const revGain = ctx.createGain();
  revGain.gain.value = 0.85;
  reverb.connect(revGain).connect(master);
  return ctx;
}

async function resumeAudio(ac: AudioContext): Promise<boolean> {
  if (ac.state === 'closed') return false;
  if (ac.state === 'running') return true;
  try {
    await ac.resume();
    const state: string = ac.state;
    return state === 'running';
  } catch {
    return false;
  }
}

function startKeepAlive(ac: AudioContext): void {
  if (keepAliveId !== null || typeof window === 'undefined') return;
  keepAliveId = window.setInterval(() => {
    if (ac.state === 'closed') {
      if (keepAliveId !== null) window.clearInterval(keepAliveId);
      keepAliveId = null;
      return;
    }
    if (ac.state === 'running') warmUp(ac);
    else void unlockAudio();
  }, 12000);
}

function warmUp(ac: AudioContext): void {
  if (warmingUp || ac.state !== 'running') return;
  warmingUp = true;
  try {
    const start = ac.currentTime;
    const o = ac.createOscillator();
    const g = ac.createGain();
    g.gain.setValueAtTime(0.00001, start);
    g.gain.exponentialRampToValueAtTime(0.00001, start + 0.03);
    o.connect(g).connect(master!);
    o.start(start);
    o.stop(start + 0.035);
  } catch {
    // Solo prepara el motor de audio tras la primera interaccion del usuario.
  } finally {
    warmingUp = false;
  }
}

async function unlockAudio(): Promise<void> {
  const ac = init();
  if (!ac) return;
  const running = await resumeAudio(ac);
  if (running) {
    warmUp(ac);
    startKeepAlive(ac);
    if (pendingSfx && enabled) {
      const name = pendingSfx;
      pendingSfx = null;
      try { PATTERNS[name](ac); } catch { /* audio no disponible */ }
    }
  }
}

// Reproduce el sonido de "click" en CUALQUIER botón de la app (delegación global).
let buttonClickInstalled = false;
export function installButtonClickSound(): void {
  if (buttonClickInstalled || typeof window === 'undefined') return;
  buttonClickInstalled = true;
  window.addEventListener('click', (e) => {
    const el = e.target as Element | null;
    // Cualquier <button> o cualquier elemento marcado con .sfx-click (ej: links de navegación).
    const target = el?.closest?.('button, .sfx-click') as HTMLElement | null;
    if (!target || (target as HTMLButtonElement).disabled) return;
    // Los controles con sonido propio (respuesta correcta/incorrecta, etc.) se excluyen.
    if (target.closest('.sfx-mute')) return;
    playSfx('select');
  }, { capture: true });
}

export function installSoundUnlock(): void {
  if (unlockInstalled || typeof window === 'undefined') return;
  unlockInstalled = true;

  const unlock = () => { void unlockAudio(); };
  const options: AddEventListenerOptions = { capture: true, passive: true };
  window.addEventListener('pointerdown', unlock, options);
  window.addEventListener('pointermove', unlock, options);
  window.addEventListener('touchstart', unlock, options);
  window.addEventListener('keydown', unlock, options);
  window.addEventListener('mousedown', unlock, options);
  window.addEventListener('mousemove', unlock, options);
  window.addEventListener('mouseover', unlock, options);
  window.addEventListener('focus', unlock);
  window.addEventListener('pageshow', unlock);
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') unlock();
  });
}

export function configureSound(opts: { enabled?: boolean; volume?: number }): void {
  if (typeof opts.enabled === 'boolean') enabled = opts.enabled;
  if (typeof opts.volume === 'number') { volume = Math.max(0.55, Math.min(1, opts.volume)); if (master) master.gain.value = volume; }
}

// Voz de maza/glockenspiel: fundamental + parciales agudos, ataque rápido, cola con reverb.
function mallet(ac: AudioContext, freq: number, t0: number, dur: number, gain: number, glide = 0, wave: OscillatorType = 'sine', rev = 0.5) {
  const start = ac.currentTime + t0;
  const partials: [number, number][] = [[1, 1], [2, 0.5], [4, 0.22]];
  for (const [mult, amp] of partials) {
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = wave;
    const f = freq * mult;
    o.frequency.setValueAtTime(f, start);
    if (glide) o.frequency.exponentialRampToValueAtTime(f * glide, start + Math.min(dur, 0.12));
    const peak = Math.max(0.0001, gain * amp);
    const d = dur * (mult > 1 ? 0.7 : 1);
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(peak, start + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, start + d);
    o.connect(g);
    const dry = ac.createGain(); dry.gain.value = 1 - rev * 0.4; g.connect(dry).connect(master!);
    if (reverb) { const send = ac.createGain(); send.gain.value = rev; g.connect(send).connect(reverb); }
    o.start(start); o.stop(start + d + 0.05);
  }
}

function thunk(ac: AudioContext, t0: number, gain: number) {
  const start = ac.currentTime + t0;
  const o = ac.createOscillator(); const g = ac.createGain();
  o.type = 'triangle';
  o.frequency.setValueAtTime(150, start);
  o.frequency.exponentialRampToValueAtTime(70, start + 0.09);
  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(gain, start + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, start + 0.12);
  o.connect(g).connect(master!); o.start(start); o.stop(start + 0.16);
}

function woodblock(ac: AudioContext, freq: number, gain: number) {
  const start = ac.currentTime;
  const o = ac.createOscillator(); const g = ac.createGain();
  o.type = 'triangle'; o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(gain, start + 0.003);
  g.gain.exponentialRampToValueAtTime(0.0001, start + 0.07);
  o.connect(g).connect(master!); o.start(start); o.stop(start + 0.1);
}

function pad(ac: AudioContext, freqs: number[], dur: number, gain: number) {
  for (const f of freqs) {
    const start = ac.currentTime; const o = ac.createOscillator(); const g = ac.createGain();
    o.type = 'triangle'; o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(gain, start + 0.04);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    o.connect(g).connect(master!);
    if (reverb) { const s = ac.createGain(); s.gain.value = 0.6; g.connect(s).connect(reverb); }
    o.start(start); o.stop(start + dur + 0.05);
  }
}

const N = { C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99, A5: 880, C6: 1046.5, D6: 1174.7, E6: 1318.5, G6: 1568, A4: 440, E4: 329.63 };

const PATTERNS: Record<Sfx, (ac: AudioContext) => void> = {
  hover: (ac) => woodblock(ac, 720, 0.05),
  select: (ac) => { mallet(ac, N.E5, 0, 0.28, 0.5); mallet(ac, N.A5, 0.05, 0.3, 0.5); },
  confirm: (ac) => { thunk(ac, 0, 0.4); mallet(ac, N.C5, 0.02, 0.4, 0.5); mallet(ac, N.E5, 0.09, 0.42, 0.5); mallet(ac, N.G5, 0.16, 0.5, 0.55); },
  error: (ac) => { mallet(ac, N.A4, 0, 0.34, 0.45, 0, 'triangle'); mallet(ac, N.E4, 0.11, 0.42, 0.45, 0, 'triangle'); },
  collect: (ac) => { mallet(ac, N.D6, 0, 0.5, 0.55, 1.06, 'sine', 0.6); mallet(ac, N.D6 * 2, 0, 0.22, 0.18, 0, 'sine', 0.6); },
  streak: (ac) => { mallet(ac, N.G5, 0, 0.4, 0.5); mallet(ac, N.C6, 0.07, 0.5, 0.55); mallet(ac, N.E6, 0.14, 0.55, 0.45); },
  modelAnswer: () => {},
  levelUp: (ac) => {
    pad(ac, [N.C5, N.E5, N.G5], 1.2, 0.16);
    [N.C5, N.E5, N.G5, N.C6, N.E6].forEach((f, i) => mallet(ac, f, 0.05 + i * 0.09, 0.7, 0.5, 0, 'sine', 0.65));
    mallet(ac, N.G6, 0.6, 0.9, 0.5, 0, 'sine', 0.75);
  },
};

export function playSfx(name: Sfx): void {
  if (!enabled) return;
  // MP3 no depende del AudioContext — reproducir directo siempre
  const mp3 = MP3_SFXS[name];
  if (mp3) { playMp3(mp3); return; }
  // Sonidos sintetizados: necesitan AudioContext activo
  const ac = init();
  if (!ac) return;
  if (ac.state !== 'running') {
    pendingSfx = name;
    void unlockAudio();
    return;
  }
  startKeepAlive(ac);
  try { PATTERNS[name](ac); } catch { /* audio no disponible */ }
}
