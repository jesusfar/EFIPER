import { useMemo, useState } from 'react';
import { useStore } from '../../store/useStore';
import { ORAL_QUESTIONS } from '../../data';
import { sortQueue, isDue } from '../../lib/spaced-repetition/leitner';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { TopicChip } from '../../components/TopicChip';
import { TOPIC_THEME } from '../../lib/theme/topicTheme';
import { playSfx } from '../../lib/audio/soundManager';
import { RichAnswer, DIFFICULTY_LABELS, shuffled } from './RichAnswer';
import { PingPongMode } from './PingPongMode';
import type { OralQuestion } from '../../types';

type Mode = 'menu' | 'solo' | 'pingpong';

// ── Modo individual: "Frente al tribunal" ──
function SoloMode({ onBack }: { onBack: () => void }) {
  const { reviews, recordAnswer } = useStore();
  const [finished, setFinished] = useState(false);
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [startTs, setStartTs] = useState(Date.now());
  const [roundSeed, setRoundSeed] = useState(() => Math.random());
  const [answered, setAnswered] = useState(0);
  const [right, setRight] = useState(0);

  const queue = useMemo<OralQuestion[]>(() => {
    const due = reviews.filter((r) => r.refType === 'oral' && isDue(r));
    const dueIds = new Set(sortQueue(due).map((r) => r.refId));
    const dueQs = [...dueIds].map((id) => ORAL_QUESTIONS.find((o) => o.id === id)).filter(Boolean) as OralQuestion[];
    const rest = ORAL_QUESTIONS.filter((o) => !dueIds.has(o.id));
    return [...dueQs, ...shuffled(rest, roundSeed)].slice(0, 10);
  }, [reviews, roundSeed]);

  const q = queue[idx];

  function beginRound() {
    setRoundSeed(Math.random());
    setIdx(0);
    setRevealed(false);
    setAnswered(0);
    setRight(0);
    setFinished(false);
    setStartTs(Date.now());
  }

  function gradeSelf(correct: boolean) {
    if (!q) return;
    playSfx(correct ? 'collect' : 'error');
    void recordAnswer({
      refId: q.id,
      refType: 'oral',
      userAnswer: revealed ? 'autoevaluado' : '',
      correct,
      timeSpent: Math.round((Date.now() - startTs) / 1000),
      topic: q.topic,
      mode: 'oral',
    });
    setAnswered((n) => n + 1);
    setRight((n) => n + (correct ? 1 : 0));
    setRevealed(false);
    setStartTs(Date.now());
    // La tanda no termina sola: al agotar la cola se regenera otra vuelta.
    setIdx((i) => {
      const next = i + 1;
      if (next >= queue.length) {
        setRoundSeed(Math.random());
        return 0;
      }
      return next;
    });
  }

  function finishRound() {
    playSfx('confirm');
    setRevealed(false);
    setFinished(true);
  }

  // Pantalla final: solo se llega presionando "Terminar".
  if (finished || !q) {
    return (
      <div className="space-y-4 animate-pop-in max-w-xl">
        <h1 className="font-display text-2xl font-black">Defensa terminada</h1>
        <p className="text-muted text-sm">
          {answered > 0
            ? `Autoevaluaste ${answered} ${answered === 1 ? 'pregunta' : 'preguntas'} · ${right} marcadas como sabidas. Las flojas vuelven antes segun el sistema Leitner.`
            : 'Las que marcaste como flojas vuelven antes segun el sistema Leitner.'}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="primary" onClick={beginRound}>Comenzar otra vez</Button>
          <Button variant="ghost" onClick={onBack}>Volver a Defensa oral</Button>
        </div>
      </div>
    );
  }

  const th = TOPIC_THEME[q.topic];

  return (
    <div className="space-y-5 animate-rise max-w-4xl">
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
            <p className="text-sm text-muted mb-3">Responde en voz alta como si estuvieras frente al tribunal. Despues revela la respuesta modelo y autoevaluate con honestidad.</p>
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
              <Button variant="selfBad" className="sfx-mute" onClick={() => gradeSelf(false)}>No la sabia</Button>
              <Button variant="selfMid" className="sfx-mute" onClick={() => gradeSelf(false)}>Mas o menos</Button>
              <Button variant="selfGood" className="sfx-mute" onClick={() => gradeSelf(true)}>La sabia</Button>
            </div>
          </div>
        )}
      </Card>

      <Button variant="ghost" className="w-full sfx-mute" onClick={finishRound}>Terminar</Button>
    </div>
  );
}

// ── Menú de modos de la Defensa oral ──
export function OralPage() {
  const [mode, setMode] = useState<Mode>('menu');

  if (mode === 'solo') return <SoloMode onBack={() => setMode('menu')} />;
  if (mode === 'pingpong') return <PingPongMode onBack={() => setMode('menu')} />;

  return (
    <div className="space-y-5 animate-rise max-w-2xl">
      <Card>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="label">Defensa oral</div>
            <h1 className="font-display text-2xl font-black mt-1">Frente al tribunal</h1>
          </div>
          <span className="text-3xl leading-none" aria-hidden>👨‍⚖️</span>
        </div>
        <p className="text-muted text-sm mt-2">
          Vas a responder preguntas en voz alta y autoevaluarte con honestidad. La tanda sigue hasta que vos
          decidas: presioná <span className="text-ink font-semibold">Terminar</span> cuando quieras cerrarla.
        </p>
        <Button variant="primary" className="mt-4" onClick={() => setMode('solo')}>Comenzar</Button>
      </Card>

      <Card>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="label">Modo grupal</div>
            <h1 className="font-display text-2xl font-black mt-1">Ping - Pong</h1>
          </div>
          <span className="text-3xl leading-none" aria-hidden>🏓</span>
        </div>
        <p className="text-muted text-sm mt-2">
          Practicá la defensa oral con hasta 4 participantes. Asigná nombres y avatares de colores, respondan
          preguntas por turnos y marquen cada respuesta como No la sabía, Más o menos o La sabía. Al finalizar,
          EFIPER muestra el rendimiento temporal de cada participante y sus áreas débiles por eje temático.
        </p>
        <Button variant="primary" className="mt-4" onClick={() => setMode('pingpong')}>Comenzar</Button>
      </Card>
    </div>
  );
}
