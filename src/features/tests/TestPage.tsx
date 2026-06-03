import { useMemo, useState } from 'react';
import { useStore, TOPIC_LABELS } from '../../store/useStore';
import { questionsByTopic } from '../../data';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { playSfx } from '../../lib/audio/soundManager';
import type { Question, Topic } from '../../types';

function isCorrect(q: Question, answer: string): boolean {
  const norm = (s: string) => s.trim().toLowerCase();
  if (Array.isArray(q.correctAnswer)) return q.correctAnswer.some((c) => norm(answer).includes(norm(c)) || norm(c).includes(norm(answer)));
  return norm(answer) === norm(q.correctAnswer);
}

export function TestPage() {
  const recordAnswer = useStore((s) => s.recordAnswer);
  const [topic, setTopic] = useState<Topic | 'all'>('all');
  const [count, setCount] = useState(10);
  const [started, setStarted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [correctNow, setCorrectNow] = useState(false);
  const [right, setRight] = useState(0);
  const [startTs, setStartTs] = useState(Date.now());

  const pool = useMemo(() => {
    const all = questionsByTopic(topic === 'all' ? undefined : topic);
    return [...all].sort(() => Math.random() - 0.5).slice(0, count);
  }, [topic, count, started]);

  const available = questionsByTopic(topic === 'all' ? undefined : topic).length;

  const q = pool[idx];

  function submit(a: string) {
    if (revealed || !q) return;
    const ok = isCorrect(q, a);
    setAnswer(a);
    setCorrectNow(ok);
    setRevealed(true);
    setRight((r) => r + (ok ? 1 : 0));
    playSfx(ok ? 'collect' : 'error');
    void recordAnswer({
      refId: q.id, refType: 'question', userAnswer: a, correct: ok,
      timeSpent: Math.round((Date.now() - startTs) / 1000), topic: q.topic, mode: 'test',
    });
  }

  function next() {
    setRevealed(false); setAnswer(''); setStartTs(Date.now());
    setIdx((i) => i + 1);
  }

  if (!started) {
    return (
      <div className="space-y-5 animate-rise max-w-xl">
        <h1 className="font-display text-2xl font-black">Test rápido</h1>
        <p className="text-muted text-sm">10 preguntas. Elegí un tema o mezclá todo.</p>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setTopic('all')} className={`pill ${topic === 'all' ? 'pill-active' : 'pill-muted'}`}>Mixto EFIP</button>
          {(Object.keys(TOPIC_LABELS) as Topic[]).map((t) => (
            <button key={t} onClick={() => setTopic(t)} className={`pill ${topic === t ? 'pill-active' : 'pill-muted'}`}>{TOPIC_LABELS[t]}</button>
          ))}
        </div>
        <div>
          <div className="label mb-2">Cantidad de preguntas</div>
          <div className="flex flex-wrap gap-2">
            {[10, 20, 50, 100].map((c) => (
              <button key={c} onClick={() => setCount(c)}
                className={`pill ${count === c ? 'pill-active' : 'pill-muted'}`}>{c}</button>
            ))}
          </div>
          <p className="text-xs text-muted mt-2">
            Disponibles en este filtro: {available}.{count > available ? ` Se usarán ${available} (el banco aún es chico).` : ''}
          </p>
        </div>
        <Button variant="primary" onClick={() => { setStarted(true); setStartTs(Date.now()); }}>Empezar ({Math.min(count, available)})</Button>
      </div>
    );
  }

  if (idx >= pool.length || pool.length === 0) {
    return (
      <div className="space-y-4 animate-pop-in max-w-xl">
        <h1 className="font-display text-2xl font-black">Resultado</h1>
        <Card>
          <p className="text-4xl font-display font-black text-stud">{right}/{pool.length}</p>
          <p className="text-muted mt-2 text-sm">Los errores ya están en tu cola de repaso.</p>
        </Card>
        <Button variant="primary" onClick={() => { setStarted(false); setIdx(0); setRight(0); }}>Otra ronda</Button>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-rise max-w-2xl">
      <div className="flex items-center justify-between">
        <span className="label">{TOPIC_LABELS[q.topic]} · {q.subtopic}</span>
        <span className="font-mono text-sm text-muted">{idx + 1}/{pool.length}</span>
      </div>
      <Card>
        <h2 className="text-lg font-semibold mb-4">{q.statement}</h2>

        {q.type === 'multiple_choice' && (
          <div className="space-y-2">
            {q.options?.map((opt) => {
              const chosen = answer === opt;
              const correct = !Array.isArray(q.correctAnswer) && opt === q.correctAnswer;
              const cls = revealed
                ? correct ? 'border-go bg-go/15' : chosen ? 'border-teal-card bg-teal-card/10' : 'border-line opacity-60'
                : 'border-accent/40 bg-white/80 hover:border-accent';
              return (
                <button key={opt} disabled={revealed} onClick={() => submit(opt)}
                  className={`sfx-mute w-full text-left px-4 py-3 rounded-xl border transition ${cls}`}>{opt}</button>
              );
            })}
          </div>
        )}

        {q.type === 'true_false' && !revealed && (
          <div className="flex gap-3">
            <Button variant="go" className="sfx-mute" onClick={() => submit('true')}>Verdadero</Button>
            <Button variant="danger" className="sfx-mute" onClick={() => submit('false')}>Falso</Button>
          </div>
        )}

        {(q.type === 'short_answer' || q.type === 'fill_blank') && !revealed && (
          <div className="flex gap-2">
            <input value={answer} onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit(answer)}
              placeholder="Tu respuesta…"
              className="flex-1 bg-panel-2 border border-line rounded-xl px-4 py-3 text-sm" />
            <Button variant="primary" className="sfx-mute" onClick={() => submit(answer)}>Responder</Button>
          </div>
        )}

        {revealed && (
          <div className="mt-5 animate-pop-in">
            <p className={`font-semibold ${correctNow ? 'text-go' : 'text-danger'}`}>
              {correctNow ? '✓ Correcto' : '✗ Incorrecto'}
            </p>
            <p className="text-sm text-muted mt-2">{q.explanation}</p>
            <Button variant="primary" className="mt-4" onClick={next}>Siguiente</Button>
          </div>
        )}
      </Card>
    </div>
  );
}
