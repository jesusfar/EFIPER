import { Link } from 'react-router-dom';
import { useStore, TOPIC_LABELS } from '../../store/useStore';
import { isDue, BOX_INTERVAL_DAYS } from '../../lib/spaced-repetition/leitner';
import { Card, Stat } from '../../components/Card';
import { Button } from '../../components/Button';
import { TOPIC_THEME } from '../../lib/theme/topicTheme';
import type { LeitnerBox, Topic } from '../../types';

const TOPICS = Object.keys(TOPIC_LABELS) as Topic[];

function boxLabel(box: LeitnerBox): string {
  if (box === 1) return 'Memoria fresca';
  if (box === 2) return 'Primer refuerzo';
  if (box === 3) return 'Consolidacion';
  if (box === 4) return 'Largo plazo';
  return 'Dominio';
}

export function ReviewsPage() {
  const reviews = useStore((s) => s.reviews);
  const due = reviews.filter((r) => isDue(r));
  const mastered = reviews.filter((r) => r.status === 'mastered').length;

  const byBox = [1, 2, 3, 4, 5].map((b) => ({
    box: b as LeitnerBox,
    count: reviews.filter((r) => r.box === b).length,
    topics: TOPICS.map((topic) => ({
      topic,
      count: reviews.filter((r) => r.box === b && r.topic === topic).length,
    })).filter((item) => item.count > 0),
  }));
  const totalTracked = reviews.length || 1;

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
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <div className="label">Distribucion por caja</div>
            <p className="mt-1 text-sm text-muted">Cada bloque muestra cuantas preguntas hay por caja y de que eje vienen.</p>
          </div>
          <span className="hidden rounded-full border border-accent/40 bg-panel-2 px-3 py-1 text-xs font-semibold text-stud sm:inline-flex">
            {reviews.length} en seguimiento
          </span>
        </div>

        <div className="grid gap-3 lg:grid-cols-5">
          {byBox.map(({ box, count, topics }) => (
            <div key={box} className="rounded-xl border border-line bg-white/80 p-3 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-display text-sm font-black text-stud">C{box}</div>
                  <div className="text-[11px] font-semibold text-muted">{boxLabel(box)}</div>
                </div>
                <div className="text-right">
                  <div className="font-display text-lg font-black text-ink">{count}</div>
                  <div className="text-[10px] text-muted">{BOX_INTERVAL_DAYS[box]}d</div>
                </div>
              </div>

              <div className="mt-3 h-3 overflow-hidden rounded-full border border-line bg-panel-2">
                {topics.length > 0 ? (
                  <div className="flex h-full w-full">
                    {topics.map(({ topic, count: topicCount }) => (
                      <div
                        key={topic}
                        title={`${TOPIC_LABELS[topic]}: ${topicCount}`}
                        style={{
                          width: `${(topicCount / count) * 100}%`,
                          background: TOPIC_THEME[topic].gradient,
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="h-full w-full bg-line/60" />
                )}
              </div>

              <div className="mt-3 space-y-1.5">
                {topics.length > 0 ? topics.map(({ topic, count: topicCount }) => (
                  <div key={topic} className="flex items-center justify-between gap-2 text-[11px]">
                    <span className="flex min-w-0 items-center gap-1.5">
                      <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: TOPIC_THEME[topic].color }} />
                      <span className="truncate text-muted">{TOPIC_LABELS[topic]}</span>
                    </span>
                    <span className="font-mono font-semibold text-ink">{topicCount}</span>
                  </div>
                )) : (
                  <div className="text-[11px] text-muted">Sin preguntas todavia</div>
                )}
              </div>

              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-panel-2">
                <div
                  className="h-full rounded-full bg-stud/70"
                  style={{ width: `${Math.max(6, Math.min(100, (count / totalTracked) * 100))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {due.length > 0 ? (
        <Card>
          <p className="text-sm text-muted mb-3">Tenes {due.length} items vencidos. Repasalos en el modo correspondiente.</p>
          <div className="flex gap-2 flex-wrap">
            {due.some((r) => r.refType === 'question') && <Link to="/test?mode=review"><Button variant="primary">Repasar teoria</Button></Link>}
            {due.some((r) => r.refType === 'oral') && <Link to="/oral"><Button variant="go">Repasar defensa oral</Button></Link>}
          </div>
          <div className="mt-4 space-y-1">
            {due.slice(0, 8).map((r) => (
              <div key={r.id} className="text-xs text-muted flex justify-between gap-3 border-b border-line/50 py-1">
                <span className="flex min-w-0 items-center gap-1.5">
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: TOPIC_THEME[r.topic].color }} />
                  <span style={{ color: TOPIC_THEME[r.topic].color }} className="truncate font-semibold">{TOPIC_LABELS[r.topic]}</span>
                  <span className="shrink-0">- {r.refType === 'oral' ? 'oral' : 'teoria'}</span>
                </span>
                <span className="shrink-0 font-mono">caja {r.box} - {r.failures} fallos</span>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <Card><p className="text-muted text-sm">No hay nada vencido. Hace un test o una defensa para alimentar la cola.</p></Card>
      )}

      <Card className="overflow-hidden">
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="label mb-2">Como funciona el sistema</div>
            <h2 className="font-display text-xl font-black text-ink">Leitner te muestra lo justo, cuando conviene verlo</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Cada pregunta vive en una caja. Si la respondes bien, avanza y tarda mas dias en volver.
              Si falla, baja y aparece antes. Asi el repaso se concentra en lo fragil sin hacerte repetir
              todo el temario desde cero.
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-5">
              {[1, 2, 3, 4, 5].map((box) => (
                <div key={box} className="rounded-lg border border-accent/25 bg-panel-2 px-3 py-2 text-center">
                  <div className="font-display text-sm font-black text-stud">C{box}</div>
                  <div className="text-[11px] font-semibold text-muted">{BOX_INTERVAL_DAYS[box as LeitnerBox]} dias</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-accent/30 bg-[linear-gradient(135deg,rgba(0,159,146,0.12),rgba(255,255,255,0.82)_48%,rgba(0,132,0,0.1))] p-4">
            <div className="label mb-2">Por que funciona</div>
            <div className="space-y-3 text-sm leading-relaxed text-muted">
              <p>
                La repeticion espaciada aprovecha el olvido: repasar justo antes de perder una idea obliga al cerebro
                a recuperarla, y esa recuperacion fortalece mucho mas que releer.
              </p>
              <p>
                En vez de medir esfuerzo por horas, mide memoria real. Lo que ya dominas se aleja; lo que cuesta vuelve
                pronto. Por eso es ideal para EFIP: mucho contenido, poco tiempo y necesidad de responder bajo presion.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
