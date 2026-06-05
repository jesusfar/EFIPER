import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore, TOPIC_LABELS } from '../../store/useStore';
import { questionsByTopic } from '../../data';
import { isDue } from '../../lib/spaced-repetition/leitner';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { TopicChip } from '../../components/TopicChip';
import { TOPIC_THEME } from '../../lib/theme/topicTheme';
import { playSfx, playResult, stopResult } from '../../lib/audio/soundManager';
import type { Question, QuestionType, ReviewItem, Topic } from '../../types';

const norm = (s: string) => s.trim().toLowerCase();
const TEST_TYPES: QuestionType[] = ['multiple_choice', 'multiple_select', 'true_false'];
const MIN_PER_TEST_TYPE = 2;
const TOPICS = Object.keys(TOPIC_LABELS) as Topic[];
const DAY = 24 * 60 * 60 * 1000;

function isCorrect(q: Question, answer: string): boolean {
  return norm(answer) === norm(q.correctAnswer as string);
}

function isMultiCorrect(q: Question, selected: string[]): boolean {
  const correct = (q.correctAnswer as string[]).map(norm);
  if (selected.length !== correct.length) return false;
  const set = new Set(correct);
  return selected.every((s) => set.has(norm(s)));
}

interface AnswerLog {
  topic: Topic;
  correct: boolean;
}

function tallyByTopic(log: AnswerLog[]) {
  const map = new Map<Topic, { correct: number; wrong: number }>();
  for (const a of log) {
    const cur = map.get(a.topic) ?? { correct: 0, wrong: 0 };
    if (a.correct) cur.correct++; else cur.wrong++;
    map.set(a.topic, cur);
  }
  return map;
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function buildBalancedTestPool(
  selectedTopic: Topic | 'all',
  count: number,
  reviews: ReviewItem[],
  reviewMode: boolean,
): Question[] {
  const candidates = questionsByTopic(selectedTopic === 'all' ? undefined : selectedTopic)
    .filter((q) => TEST_TYPES.includes(q.type));
  const target = Math.min(count, candidates.length);
  const reviewByRef = new Map(
    reviews
      .filter((r) => r.refType === 'question')
      .map((r) => [r.refId, r]),
  );

  const selected = new Map<string, Question>();
  const now = Date.now();

  while (selected.size < target) {
    const best = pickBestCandidate(candidates, selected, reviewByRef, reviewMode, now, selectedTopic, target);
    if (!best) break;
    selected.set(best.id, best);
  }

  return shuffle([...selected.values()]);
}

function pickBestCandidate(
  candidates: Question[],
  selected: Map<string, Question>,
  reviewByRef: Map<string, ReviewItem>,
  reviewMode: boolean,
  now: number,
  selectedTopic: Topic | 'all',
  target: number,
): Question | undefined {
  const remaining = candidates.filter((q) => !selected.has(q.id));
  if (remaining.length === 0) return undefined;
  const selectedItems = [...selected.values()];
  const topicNeed = new Map<Topic, number>();
  const typeNeed = new Map<QuestionType, number>();

  if (selectedTopic === 'all' && target >= TOPICS.length) {
    for (const topic of TOPICS) {
      if (candidates.some((q) => q.topic === topic)) topicNeed.set(topic, 1);
    }
  }

  for (const type of TEST_TYPES) {
    const availableOfType = candidates.filter((q) => q.type === type).length;
    typeNeed.set(type, Math.min(MIN_PER_TEST_TYPE, availableOfType, target));
  }

  const topicCount = (topic: Topic) => selectedItems.filter((q) => q.topic === topic).length;
  const typeCount = (type: QuestionType) => selectedItems.filter((q) => q.type === type).length;
  const hasOpenDeficit = [...topicNeed].some(([topic, need]) => topicCount(topic) < need)
    || [...typeNeed].some(([type, need]) => typeCount(type) < need);

  return remaining
    .map((question) => {
      const topicDeficit = (topicNeed.get(question.topic) ?? 0) > topicCount(question.topic) ? 1 : 0;
      const typeDeficit = (typeNeed.get(question.type) ?? 0) > typeCount(question.type) ? 1 : 0;
      const deficitScore = topicDeficit * 1200 + typeDeficit * 1200;
      const allowed = !hasOpenDeficit || deficitScore > 0;
      return {
        question,
        allowed,
        score: deficitScore + scoreQuestion(question, reviewByRef, reviewMode, now),
      };
    })
    .filter((item) => item.allowed)
    .sort((a, b) => b.score - a.score)[0]?.question;
}

function scoreQuestion(
  question: Question,
  reviewByRef: Map<string, ReviewItem>,
  reviewMode: boolean,
  now: number,
): number {
  const review = reviewByRef.get(question.id);
  const random = Math.random() * 20;
  if (!reviewMode) return random;
  if (!review) return random - 12;

  const overdueDays = Math.max(0, (now - review.nextReviewAt) / DAY);
  const dueBoost = isDue(review, now) ? 140 : 0;
  const weaknessBoost = review.failures * 18 + (5 - review.box) * 6;
  return dueBoost + overdueDays * 12 + weaknessBoost + random;
}

export function TestPage() {
  const [searchParams] = useSearchParams();
  const reviewMode = searchParams.get('mode') === 'review';
  const recordAnswer = useStore((s) => s.recordAnswer);
  const reviews = useStore((s) => s.reviews);
  const [topic, setTopic] = useState<Topic | 'all'>('all');
  const [count, setCount] = useState(10);
  const [activePool, setActivePool] = useState<Question[]>([]);
  const [started, setStarted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [correctNow, setCorrectNow] = useState(false);
  const [right, setRight] = useState(0);
  const [log, setLog] = useState<AnswerLog[]>([]);
  const [startTs, setStartTs] = useState(Date.now());

  const available = questionsByTopic(topic === 'all' ? undefined : topic).filter((q) => TEST_TYPES.includes(q.type)).length;
  const q = activePool[idx];

  function submit(a: string) {
    if (revealed || !q) return;
    const ok = isCorrect(q, a);
    setAnswer(a);
    setCorrectNow(ok);
    setRevealed(true);
    setRight((r) => r + (ok ? 1 : 0));
    setLog((l) => [...l, { topic: q.topic, correct: ok }]);
    playSfx(ok ? 'collect' : 'error');
    void recordAnswer({
      refId: q.id, refType: 'question', userAnswer: a, correct: ok,
      timeSpent: Math.round((Date.now() - startTs) / 1000), topic: q.topic, mode: reviewMode ? 'review-test' : 'test',
    });
  }

  function submitMulti() {
    if (revealed || !q) return;
    const ok = isMultiCorrect(q, selected);
    const a = selected.join(' | ');
    setAnswer(a);
    setCorrectNow(ok);
    setRevealed(true);
    setRight((r) => r + (ok ? 1 : 0));
    setLog((l) => [...l, { topic: q.topic, correct: ok }]);
    playSfx(ok ? 'collect' : 'error');
    void recordAnswer({
      refId: q.id, refType: 'question', userAnswer: a, correct: ok,
      timeSpent: Math.round((Date.now() - startTs) / 1000), topic: q.topic, mode: reviewMode ? 'review-test' : 'test',
    });
  }

  function toggleSelected(opt: string) {
    if (revealed) return;
    setSelected((s) => s.includes(opt) ? s.filter((o) => o !== opt) : [...s, opt]);
  }

  function next() {
    setRevealed(false); setAnswer(''); setSelected([]); setStartTs(Date.now());
    setIdx((i) => i + 1);
  }

  function start() {
    setActivePool(buildBalancedTestPool(topic, count, reviews, reviewMode));
    setStarted(true);
    setStartTs(Date.now());
  }

  function restart() {
    setStarted(false); setIdx(0); setRight(0); setLog([]);
    setRevealed(false); setAnswer(''); setSelected([]); setActivePool([]);
  }

  if (!started) {
    return (
      <div className="space-y-5 animate-rise max-w-xl">
        <h1 className="font-display text-2xl font-black">{reviewMode ? 'Repaso de teoria' : 'Test rapido'}</h1>
        <p className="text-muted text-sm">
          {reviewMode
            ? 'Prioriza preguntas vencidas sin romper la mezcla de ejes ni tipos de pregunta.'
            : 'Opcion multiple, Verdadero/Falso y seleccion multiple (varias correctas). Elegi un tema o mezcla todo.'}
        </p>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setTopic('all')} className={`pill ${topic === 'all' ? 'pill-active' : 'pill-muted'}`}>Mixto EFIP</button>
          {TOPICS.map((t) => {
            const th = TOPIC_THEME[t];
            const active = topic === t;
            return (
              <button key={t} onClick={() => setTopic(t)} className="pill sfx-mute"
                style={active
                  ? { color: '#fff', background: th.gradient, border: `1px solid ${th.color}` }
                  : { color: th.color, background: th.soft, border: `1px solid ${th.border}` }}>
                {TOPIC_LABELS[t]}
              </button>
            );
          })}
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
            Disponibles en este filtro: {available}.{count > available ? ` Se usaran ${available} (el banco aun es chico).` : ''}
          </p>
        </div>
        <Button variant="primary" onClick={start}>Empezar ({Math.min(count, available)})</Button>
      </div>
    );
  }

  if (idx >= activePool.length || activePool.length === 0) {
    return <ResultsScreen total={activePool.length} right={right} log={log} onRestart={restart} />;
  }

  return (
    <div className="space-y-5 animate-rise max-w-2xl">
      <div className="flex items-center justify-between">
        <TopicChip topic={q.topic} subtopic={q.subtopic} />
        <span className="font-mono text-sm text-muted">{idx + 1}/{activePool.length}</span>
      </div>
      <Card>
        <h2 className="text-lg font-semibold mb-4">{q.statement}</h2>

        {q.type === 'multiple_choice' && (
          <div className="space-y-2">
            {q.options?.map((opt) => {
              const chosen = answer === opt;
              const correct = !Array.isArray(q.correctAnswer) && opt === q.correctAnswer;
              const cls = revealed
                ? correct ? 'border-go bg-go/15' : chosen ? 'border-[#DC2626] bg-[#DC2626]/15 text-[#DC2626]' : 'border-line opacity-60'
                : 'border-accent/40 bg-white/80 hover:border-accent';
              return (
                <button key={opt} disabled={revealed} onClick={() => submit(opt)}
                  className={`sfx-mute w-full text-left px-4 py-3 rounded-xl border transition ${cls}`}>{opt}</button>
              );
            })}
          </div>
        )}

        {q.type === 'true_false' && (
          <div className="flex gap-3">
            {(['true', 'false'] as const).map((val) => {
              const chosen = answer === val;
              const correct = q.correctAnswer === val;
              const base = val === 'true' ? 'Verdadero' : 'Falso';
              if (!revealed) {
                return (
                  <Button key={val} variant={val === 'true' ? 'go' : 'danger'} className="sfx-mute"
                    onClick={() => submit(val)}>{base}</Button>
                );
              }
              const cls = correct ? 'border-go bg-go/15 text-go'
                : chosen ? 'border-[#DC2626] bg-[#DC2626]/15 text-[#DC2626]' : 'border-line opacity-60';
              return (
                <span key={val} className={`px-4 py-2.5 rounded-xl font-semibold text-sm border ${cls}`}>{base}</span>
              );
            })}
          </div>
        )}

        {q.type === 'multiple_select' && (
          <div className="space-y-2">
            <p className="text-xs text-muted -mt-2 mb-1">
              Selecciona <strong>todas</strong> las correctas (puede haber 2, 3 o 4). Acertas solo si marcas exactamente las correctas.
            </p>
            {q.options?.map((opt) => {
              const chosen = selected.includes(opt);
              const correct = Array.isArray(q.correctAnswer) && q.correctAnswer.includes(opt);
              let cls: string;
              if (revealed) {
                cls = correct
                  ? 'border-go bg-go/15'
                  : chosen ? 'border-[#DC2626] bg-[#DC2626]/15 text-[#DC2626]' : 'border-line opacity-60';
              } else {
                cls = chosen ? 'border-accent bg-accent/10' : 'border-accent/40 bg-white/80 hover:border-accent';
              }
              const box = revealed
                ? (correct ? 'OK' : chosen ? 'X' : '-')
                : (chosen ? '[x]' : '[ ]');
              return (
                <button key={opt} disabled={revealed} onClick={() => toggleSelected(opt)}
                  className={`sfx-mute w-full text-left px-4 py-3 rounded-xl border transition flex items-start gap-3 ${cls}`}>
                  <span className="font-mono text-base leading-5 shrink-0">{box}</span>
                  <span>{opt}</span>
                </button>
              );
            })}
            {!revealed && (
              <Button variant="primary" className="sfx-mute mt-2" disabled={selected.length === 0}
                onClick={submitMulti}>Confirmar seleccion ({selected.length})</Button>
            )}
          </div>
        )}

        {revealed && (
          <div className="mt-5 animate-pop-in">
            <p className={`font-semibold ${correctNow ? 'text-go' : 'text-[#DC2626]'}`}>
              {correctNow ? 'Correcto' : 'Incorrecto'}
            </p>
            {q.type === 'multiple_select' && (
              <p className="text-xs text-muted mt-1">
                Correctas: {(q.correctAnswer as string[]).length} de {q.options?.length}. En verde las correctas; en rojo las que marcaste de mas.
              </p>
            )}
            <div className="mt-2 rounded-xl border border-line bg-panel-2 p-3">
              <p className="label mb-1">Justificacion</p>
              <p className="text-sm text-ink/90">{q.explanation}</p>
            </div>
            <Button variant="primary" className="mt-4" onClick={next}>
              {idx + 1 >= activePool.length ? 'Ver resultados' : 'Siguiente'}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}

function ResultsScreen({ total, right, log, onRestart }: {
  total: number; right: number; log: AnswerLog[]; onRestart: () => void;
}) {
  const tally = tallyByTopic(log);
  const rows = [...tally.entries()]
    .map(([topic, v]) => {
      const answered = v.correct + v.wrong;
      const pct = answered ? Math.round((v.correct / answered) * 100) : 0;
      return { topic, ...v, answered, pct };
    })
    .sort((a, b) => a.pct - b.pct);

  const toReview = rows.filter((r) => r.pct < 60).map((r) => r.topic);
  const overallPct = total ? Math.round((right / total) * 100) : 0;

  useEffect(() => {
    playResult(overallPct >= 70);
    return () => stopResult();
  }, [overallPct]);

  const msg = overallPct >= 80 ? 'Excelente! Estas muy bien parado.'
    : overallPct >= 60 ? 'Bien, pero hay ejes para reforzar.'
    : 'A repasar: enfocate en los ejes marcados.';

  return (
    <div className="space-y-5 animate-pop-in max-w-2xl">
      <h1 className="font-display text-2xl font-black">Resultado</h1>

      <Card>
        <div className="flex items-end gap-4">
          <p className="text-5xl font-display font-black text-stud">{right}/{total}</p>
          <p className="text-2xl font-display font-bold text-muted pb-1">{overallPct}%</p>
        </div>
        <p className="text-muted mt-2 text-sm">{msg} Los errores ya estan en tu cola de repaso.</p>
      </Card>

      <div>
        <div className="label mb-2">Desglose por eje</div>
        <div className="space-y-2">
          {rows.map((r) => {
            const th = TOPIC_THEME[r.topic];
            return (
              <div key={r.topic} className="panel p-3">
                <div className="flex items-center justify-between gap-3">
                  <TopicChip topic={r.topic} />
                  <span className="font-mono text-sm shrink-0">
                    <span className="text-go font-semibold">{r.correct} OK</span>
                    {' - '}
                    <span className="text-[#DC2626] font-semibold">{r.wrong} X</span>
                    {' - '}
                    <span className="text-muted">{r.pct}%</span>
                  </span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-line overflow-hidden">
                  <div className="h-full rounded-full transition-all"
                    style={{ width: `${r.pct}%`, background: th.gradient }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {toReview.length > 0 ? (
        <Card style={{ borderColor: 'rgba(220,38,38,0.4)' }}>
          <div className="label mb-2 text-[#DC2626]">Ejes que conviene repasar</div>
          <div className="flex flex-wrap gap-2">
            {toReview.map((t) => <TopicChip key={t} topic={t} />)}
          </div>
          <p className="text-xs text-muted mt-3">Menos del 60% de aciertos. Empeza un test filtrado por estos ejes.</p>
        </Card>
      ) : (
        <Card style={{ borderColor: 'rgba(0,132,0,0.4)' }}>
          <p className="text-sm text-go font-semibold">Sin ejes criticos: superaste el 60% en todos.</p>
        </Card>
      )}

      <Button variant="primary" onClick={onRestart}>Otra ronda</Button>
    </div>
  );
}
