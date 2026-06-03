import { useMemo, useState } from 'react';
import { useStore, TOPIC_LABELS } from '../../store/useStore';
import { ORAL_QUESTIONS } from '../../data';
import { sortQueue, isDue } from '../../lib/spaced-repetition/leitner';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { playSfx } from '../../lib/audio/soundManager';
import type { OralQuestion } from '../../types';

const FREQ_ORDER = { recurrente: 0, frecuente: 1, posible: 2 } as const;

export function OralPage() {
  const { reviews, recordAnswer } = useStore();
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [startTs, setStartTs] = useState(Date.now());

  // Cola: primero los que están vencidos en repaso, luego por frecuencia (recurrentes primero).
  const queue = useMemo<OralQuestion[]>(() => {
    const due = reviews.filter((r) => r.refType === 'oral' && isDue(r));
    const dueIds = new Set(sortQueue(due).map((r) => r.refId));
    const dueQs = [...dueIds].map((id) => ORAL_QUESTIONS.find((o) => o.id === id)).filter(Boolean) as OralQuestion[];
    const rest = ORAL_QUESTIONS
      .filter((o) => !dueIds.has(o.id))
      .sort((a, b) => FREQ_ORDER[a.frequency] - FREQ_ORDER[b.frequency]);
    return [...dueQs, ...rest].slice(0, 10);
  }, [reviews]);

  const q = queue[idx];

  function gradeSelf(correct: boolean) {
    if (!q) return;
    playSfx(correct ? 'collect' : 'error');
    void recordAnswer({
      refId: q.id, refType: 'oral', userAnswer: revealed ? 'autoevaluado' : '', correct,
      timeSpent: Math.round((Date.now() - startTs) / 1000), topic: q.topic, mode: 'oral',
    });
    setRevealed(false); setStartTs(Date.now());
    setIdx((i) => i + 1);
  }

  if (!q || idx >= queue.length) {
    return (
      <div className="space-y-4 animate-pop-in max-w-xl">
        <h1 className="font-display text-2xl font-black">Defensa completada</h1>
        <p className="text-muted text-sm">Las que marcaste como flojas vuelven antes según el sistema Leitner.</p>
        <Button variant="primary" onClick={() => setIdx(0)}>Otra vuelta</Button>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-rise max-w-2xl">
      <div className="flex items-center justify-between">
        <span className="label">{TOPIC_LABELS[q.topic]} · {q.subtopic}</span>
        <span className={`pill ${q.frequency === 'recurrente' ? 'pill-active' : 'pill-muted'}`}>{q.frequency}</span>
      </div>

      <Card>
        <div className="label mb-2">El tribunal pregunta</div>
        <h2 className="text-xl font-semibold leading-snug">{q.question}</h2>

        {!revealed ? (
          <div className="mt-6">
            <p className="text-sm text-muted mb-3">Respondé en voz alta como si estuvieras frente al tribunal. Después revelá la respuesta modelo y autoevaluate con honestidad.</p>
            <Button variant="primary" className="sfx-mute" onClick={() => { playSfx('confirm'); setRevealed(true); }}>Revelar respuesta modelo</Button>
          </div>
        ) : (
          <div className="mt-5 animate-pop-in">
            <div className="rounded-xl border border-go/40 bg-go/10 p-4">
              <div className="label text-go mb-1">Respuesta modelo</div>
              <p className="text-sm leading-relaxed">{q.modelAnswer}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {q.keywords.map((k) => <span key={k} className="pill pill-muted">{k}</span>)}
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <Button variant="danger" className="sfx-mute" onClick={() => gradeSelf(false)}>No la sabía</Button>
              <Button className="sfx-mute" onClick={() => gradeSelf(false)}>Más o menos</Button>
              <Button variant="go" className="sfx-mute" onClick={() => gradeSelf(true)}>La sabía</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
