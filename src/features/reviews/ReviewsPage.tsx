import { Link } from 'react-router-dom';
import { useStore, TOPIC_LABELS } from '../../store/useStore';
import { isDue, BOX_INTERVAL_DAYS } from '../../lib/spaced-repetition/leitner';
import { Card, Stat } from '../../components/Card';
import { Button } from '../../components/Button';
import { TOPIC_THEME } from '../../lib/theme/topicTheme';
import type { LeitnerBox } from '../../types';

export function ReviewsPage() {
  const reviews = useStore((s) => s.reviews);
  const due = reviews.filter((r) => isDue(r));
  const mastered = reviews.filter((r) => r.status === 'mastered').length;

  const byBox = [1, 2, 3, 4, 5].map((b) => ({
    box: b as LeitnerBox,
    count: reviews.filter((r) => r.box === b).length,
  }));

  return (
    <div className="space-y-6 animate-rise">
      <div>
        <div className="label">Repaso inteligente</div>
        <h1 className="font-display text-2xl font-black mt-1">Cola de repaso (Leitner)</h1>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Stat label="Vencidas hoy" value={due.length} accent />
        <Stat label="En seguimiento" value={reviews.length - mastered} />
        <Stat label="Dominadas" value={mastered} />
      </div>

      <Card>
        <div className="label mb-3">Distribución por caja</div>
        <div className="grid grid-cols-5 gap-2">
          {byBox.map(({ box, count }) => (
            <div key={box} className="text-center">
              <div className="h-20 flex items-end justify-center">
                <div className="w-8 bg-stud/70 rounded-t" style={{ height: `${Math.min(100, count * 18 + 6)}%` }} />
              </div>
              <div className="text-xs font-mono mt-1">C{box}</div>
              <div className="text-[10px] text-muted">{BOX_INTERVAL_DAYS[box]}d · {count}</div>
            </div>
          ))}
        </div>
      </Card>

      {due.length > 0 ? (
        <Card>
          <p className="text-sm text-muted mb-3">Tenés {due.length} ítems vencidos. Repasalos en el modo correspondiente.</p>
          <div className="flex gap-2 flex-wrap">
            {due.some((r) => r.refType === 'question') && <Link to="/test"><Button variant="primary">Repasar teoría</Button></Link>}
            {due.some((r) => r.refType === 'oral') && <Link to="/oral"><Button variant="go">Repasar defensa oral</Button></Link>}
          </div>
          <div className="mt-4 space-y-1">
            {due.slice(0, 8).map((r) => (
              <div key={r.id} className="text-xs text-muted flex justify-between border-b border-line/50 py-1">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: TOPIC_THEME[r.topic].color }} />
                  <span style={{ color: TOPIC_THEME[r.topic].color }} className="font-semibold">{TOPIC_LABELS[r.topic]}</span>
                  <span>· {r.refType === 'oral' ? 'oral' : 'teoría'}</span>
                </span>
                <span className="font-mono">caja {r.box} · {r.failures} fallos</span>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <Card><p className="text-muted text-sm">No hay nada vencido. Hacé un test o una defensa para alimentar la cola.</p></Card>
      )}
    </div>
  );
}
