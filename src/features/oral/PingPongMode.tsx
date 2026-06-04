import { useMemo, useState } from 'react';
import { TOPIC_LABELS } from '../../store/useStore';
import { ORAL_QUESTIONS } from '../../data';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { TopicChip } from '../../components/TopicChip';
import { BuddyAvatar, AVATAR_PALETTE, AVATAR_SLOTS } from '../../components/BuddyAvatar';
import { TOPIC_THEME } from '../../lib/theme/topicTheme';
import { playSfx } from '../../lib/audio/soundManager';
import { RichAnswer, DIFFICULTY_LABELS, shuffled } from './RichAnswer';
import type { Topic } from '../../types';

type Verdict = 'good' | 'mid' | 'bad';
type Phase = 'setup' | 'playing' | 'results';

interface TopicTally { good: number; mid: number; bad: number }
interface Stats {
  name: string;
  color: typeof AVATAR_SLOTS[number];
  answered: number;
  good: number;
  mid: number;
  bad: number;
  byTopic: Partial<Record<Topic, TopicTally>>;
}

const MIN_P = 2;

function domainOf(good: number, total: number): number {
  return total > 0 ? Math.round((good / total) * 100) : 0;
}

// Un eje es área débil si: hay más "no la sabía" que "la sabía", hay varias
// "más o menos" (>=2), o el dominio del eje es menor al 60%.
function weakTopics(s: Stats): Topic[] {
  const weak: { topic: Topic; dom: number }[] = [];
  for (const [t, c] of Object.entries(s.byTopic) as [Topic, TopicTally][]) {
    const total = c.good + c.mid + c.bad;
    if (total < 1) continue;
    const dom = domainOf(c.good, total);
    if (c.bad > c.good || c.mid >= 2 || dom < 60) weak.push({ topic: t, dom });
  }
  return weak.sort((a, b) => a.dom - b.dom).map((w) => w.topic);
}

export function PingPongMode({ onBack }: { onBack: () => void }) {
  const [phase, setPhase] = useState<Phase>('setup');
  const [count, setCount] = useState(2);
  const [names, setNames] = useState<string[]>(['', '', '', '']);

  // Tanda temporal (se descarta al cerrar resultados).
  const [order, setOrder] = useState<number[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [stats, setStats] = useState<Stats[]>([]);

  const total = ORAL_QUESTIONS.length;

  function resolvedName(i: number): string {
    return names[i].trim() || `Participante ${i + 1}`;
  }

  function begin() {
    const seed = Math.random();
    const idxs = shuffled(ORAL_QUESTIONS.map((_, i) => i), seed);
    setOrder(idxs);
    setQIndex(0);
    setRevealed(false);
    setStats(Array.from({ length: count }, (_, i) => ({
      name: resolvedName(i),
      color: AVATAR_SLOTS[i],
      answered: 0, good: 0, mid: 0, bad: 0, byTopic: {},
    })));
    setPhase('playing');
  }

  function answer(verdict: Verdict) {
    const pidx = qIndex % stats.length;
    const topic = ORAL_QUESTIONS[order[qIndex]].topic;
    playSfx(verdict === 'good' ? 'collect' : 'error');
    setStats((prev) => prev.map((s, i) => {
      if (i !== pidx) return s;
      const bt = s.byTopic[topic] ?? { good: 0, mid: 0, bad: 0 };
      return {
        ...s,
        answered: s.answered + 1,
        good: s.good + (verdict === 'good' ? 1 : 0),
        mid: s.mid + (verdict === 'mid' ? 1 : 0),
        bad: s.bad + (verdict === 'bad' ? 1 : 0),
        byTopic: { ...s.byTopic, [topic]: { ...bt, [verdict]: bt[verdict] + 1 } },
      };
    }));
    setRevealed(false);
    const next = qIndex + 1;
    if (next >= order.length) setPhase('results');
    setQIndex(next);
  }

  function finish() {
    playSfx('confirm');
    setRevealed(false);
    setPhase('results');
  }

  // Cierre de resultados: se borra todo el estado temporal de la tanda.
  function closeResults() {
    setOrder([]);
    setQIndex(0);
    setRevealed(false);
    setStats([]);
    setNames(['', '', '', '']);
    setCount(2);
    setPhase('setup');
  }

  // ── Configuración ──
  if (phase === 'setup') {
    return (
      <div className="space-y-5 animate-rise max-w-2xl">
        <div>
          <button onClick={onBack} className="text-xs text-muted hover:text-ink mb-2">← Volver a Defensa oral</button>
          <h1 className="font-display text-2xl font-black">Modo Ping Pong</h1>
          <p className="text-muted text-sm mt-1">
            Tanda oral grupal de 2 a 4 participantes. Las preguntas se reparten por turnos. El puntaje es
            temporal: no afecta tu progreso del Dashboard.
          </p>
        </div>

        <Card>
          <div className="label mb-2">¿Cuántos juegan?</div>
          <div className="flex gap-2">
            {[2, 3, 4].map((n) => (
              <button key={n} onClick={() => setCount(n)}
                className={`pill ${count === n ? 'pill-active' : 'pill-muted'}`}>{n} participantes</button>
            ))}
          </div>
        </Card>

        <Card className="space-y-3">
          <div className="label">Participantes</div>
          {Array.from({ length: count }, (_, i) => {
            const pal = AVATAR_PALETTE[AVATAR_SLOTS[i]];
            return (
              <div key={i} className="flex items-center gap-3">
                <BuddyAvatar color={AVATAR_SLOTS[i]} size={44} />
                <input
                  value={names[i]}
                  onChange={(e) => setNames((arr) => arr.map((v, j) => (j === i ? e.target.value : v)))}
                  placeholder={pal.label}
                  maxLength={20}
                  className="flex-1 bg-panel-2 border border-line rounded-xl px-4 py-2.5 text-sm"
                  style={{ borderColor: pal.base }}
                />
              </div>
            );
          })}
          <p className="text-xs text-muted">Si dejás un nombre vacío, se usa “Participante N”.</p>
        </Card>

        <Button variant="primary" disabled={count < MIN_P} onClick={begin}>Comenzar</Button>
      </div>
    );
  }

  // ── Resultados ──
  if (phase === 'results') {
    const ranked = [...stats].sort((a, b) => domainOf(b.good, b.answered) - domainOf(a.good, a.answered));
    return (
      <div className="space-y-5 animate-pop-in max-w-3xl">
        <div>
          <h1 className="font-display text-2xl font-black">Resultados de la tanda</h1>
          <p className="text-muted text-sm mt-1">Puntaje temporal · se borra al cerrar esta pantalla.</p>
        </div>

        <Card className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-muted">
                <th className="py-2 pr-3 font-display text-xs uppercase tracking-[0.12em]">Participante</th>
                <th className="py-2 px-2 font-mono text-xs">Resp.</th>
                <th className="py-2 px-2 font-mono text-xs" style={{ color: '#16A34A' }}>Sabía</th>
                <th className="py-2 px-2 font-mono text-xs" style={{ color: '#D97706' }}>+/−</th>
                <th className="py-2 px-2 font-mono text-xs" style={{ color: '#DC2626' }}>No</th>
                <th className="py-2 pl-2 font-mono text-xs">Dominio</th>
              </tr>
            </thead>
            <tbody>
              {ranked.map((s, i) => (
                <tr key={i} className="border-t border-line/60">
                  <td className="py-2 pr-3">
                    <span className="flex items-center gap-2">
                      <BuddyAvatar color={s.color} size={28} />
                      <span className="font-semibold" style={{ color: AVATAR_PALETTE[s.color].dark }}>{s.name}</span>
                    </span>
                  </td>
                  <td className="py-2 px-2 font-mono">{s.answered}</td>
                  <td className="py-2 px-2 font-mono">{s.good}</td>
                  <td className="py-2 px-2 font-mono">{s.mid}</td>
                  <td className="py-2 px-2 font-mono">{s.bad}</td>
                  <td className="py-2 pl-2 font-mono font-bold">{domainOf(s.good, s.answered)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {ranked.map((s, i) => {
          const weak = weakTopics(s);
          return (
            <Card key={i} className="space-y-2" style={{ borderColor: AVATAR_PALETTE[s.color].base }}>
              <div className="flex items-center gap-3">
                <BuddyAvatar color={s.color} size={40} ring />
                <div>
                  <div className="font-display font-bold" style={{ color: AVATAR_PALETTE[s.color].dark }}>{s.name}</div>
                  <div className="text-xs text-muted">
                    {s.answered} respondidas · {s.good} sabía · {s.mid} más o menos · {s.bad} no la sabía · dominio {domainOf(s.good, s.answered)}%
                  </div>
                </div>
              </div>
              {s.answered === 0 ? (
                <p className="text-sm text-muted">No hay datos suficientes.</p>
              ) : weak.length > 0 ? (
                <>
                  <div className="flex flex-wrap gap-1.5">
                    {weak.map((t) => <TopicChip key={t} topic={t} />)}
                  </div>
                  <p className="text-sm text-muted">
                    {s.name} debería reforzar principalmente {weak.map((t) => TOPIC_LABELS[t]).join(', ')}, ya que en
                    esos ejes acumuló más respuestas marcadas como “Más o menos” o “No la sabía”.
                  </p>
                </>
              ) : (
                <p className="text-sm text-go">¡Buen dominio general! No se detectaron áreas débiles.</p>
              )}
            </Card>
          );
        })}

        <Button variant="primary" onClick={closeResults}>Cerrar y borrar tanda</Button>
      </div>
    );
  }

  // ── Tanda en juego ──
  const q = ORAL_QUESTIONS[order[qIndex]];
  if (!q) return null;
  const pidx = qIndex % stats.length;
  const current = stats[pidx];
  const pal = AVATAR_PALETTE[current.color];
  const th = TOPIC_THEME[q.topic];

  return (
    <div className="space-y-5 animate-rise max-w-4xl">
      <div
        className="flex items-center justify-between gap-3 rounded-2xl border p-3"
        style={{ borderColor: pal.base, background: `${pal.base}14` }}
      >
        <span className="flex items-center gap-3">
          <BuddyAvatar color={current.color} size={48} ring />
          <span>
            <span className="block text-[11px] uppercase tracking-[0.16em] font-display font-bold" style={{ color: pal.dark }}>Turno de</span>
            <span className="block font-display text-lg font-black" style={{ color: pal.dark }}>{current.name}</span>
          </span>
        </span>
        <span className="font-mono text-sm text-muted">Pregunta {qIndex + 1} de {total}</span>
      </div>

      <div className="flex items-center justify-between gap-3">
        <TopicChip topic={q.topic} subtopic={q.subtopic} />
        <div className="flex flex-wrap justify-end gap-2">
          <span className="pill pill-muted">{DIFFICULTY_LABELS[q.difficulty]}</span>
          <span className={`pill ${q.frequency === 'recurrente' ? 'pill-active' : 'pill-muted'}`}>{q.frequency}</span>
        </div>
      </div>

      <Card>
        <div className="label mb-2" style={{ color: th.color }}>El tribunal pregunta</div>
        <h2 className="text-xl font-semibold leading-snug">{q.question}</h2>

        {!revealed ? (
          <div className="mt-6">
            <p className="text-sm text-muted mb-3">
              {current.name} responde en voz alta. Después revelen la respuesta modelo y autoevalúen con honestidad.
            </p>
            <Button variant="primary" className="sfx-mute" onClick={() => { playSfx('modelAnswer'); setRevealed(true); }}>Revelar respuesta modelo</Button>
          </div>
        ) : (
          <div className="mt-5 animate-pop-in">
            <div className="rounded-xl border p-4" style={{ borderColor: th.border, background: th.soft }}>
              <div className="label mb-1" style={{ color: th.color }}>Respuesta modelo</div>
              <RichAnswer text={q.modelAnswer} />
              <div className="mt-3 flex flex-wrap gap-1.5">
                {q.keywords.map((k) => <span key={k} className="pill pill-muted">{k}</span>)}
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <Button variant="selfBad" className="sfx-mute" onClick={() => answer('bad')}>No la sabía</Button>
              <Button variant="selfMid" className="sfx-mute" onClick={() => answer('mid')}>Más o menos</Button>
              <Button variant="selfGood" className="sfx-mute" onClick={() => answer('good')}>La sabía</Button>
            </div>
          </div>
        )}
      </Card>

      <Button variant="ghost" className="w-full sfx-mute" onClick={finish}>Terminar</Button>
    </div>
  );
}
