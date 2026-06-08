import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore, TOPIC_LABELS } from '../../store/useStore';
import { isDue, sortQueue, BOX_INTERVAL_DAYS } from '../../lib/spaced-repetition/leitner';
import { Card, Stat } from '../../components/Card';
import { Button } from '../../components/Button';
import { TOPIC_THEME } from '../../lib/theme/topicTheme';
import jevilReviewSfx from '../../assets/audio/jevil.mp3';
import type { LeitnerBox, ReviewItem, Topic } from '../../types';

const TOPICS = Object.keys(TOPIC_LABELS) as Topic[];

function boxLabel(box: LeitnerBox): string {
  if (box === 1) return 'Memoria fresca';
  if (box === 2) return 'Primer refuerzo';
  if (box === 3) return 'Consolidacion';
  if (box === 4) return 'Largo plazo';
  return 'Dominio';
}

function formatEstimate(count: number): string {
  if (count <= 0) return '0 min';
  if (count < 5) return 'menos de 3 min';
  const min = Math.max(3, Math.round(count * 0.45));
  const max = Math.max(min + 2, Math.round(count * 0.7));
  return `${min}-${max} min`;
}

function reviewModeLabel(item: ReviewItem): string {
  return item.refType === 'oral' ? 'Defensa oral' : 'Teoria';
}

function loopRegion(buffer: AudioBuffer): { start: number; end: number } {
  const threshold = 0.012;
  let first = 0;
  let last = buffer.length - 1;

  outerStart:
  for (let i = 0; i < buffer.length; i++) {
    for (let c = 0; c < buffer.numberOfChannels; c++) {
      if (Math.abs(buffer.getChannelData(c)[i]) > threshold) {
        first = i;
        break outerStart;
      }
    }
  }

  outerEnd:
  for (let i = buffer.length - 1; i >= first; i--) {
    for (let c = 0; c < buffer.numberOfChannels; c++) {
      if (Math.abs(buffer.getChannelData(c)[i]) > threshold) {
        last = i;
        break outerEnd;
      }
    }
  }

  return {
    start: first / buffer.sampleRate,
    end: Math.max((last + 1) / buffer.sampleRate, first / buffer.sampleRate + 0.2),
  };
}

export function ReviewsPage() {
  useEffect(() => {
    let cancelled = false;
    let ctx: AudioContext | null = null;
    let source: AudioBufferSourceNode | null = null;

    const startLoop = async () => {
      if (cancelled || source) return;
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      ctx = ctx ?? new AC();
      if (ctx.state !== 'running') await ctx.resume().catch(() => undefined);
      if (ctx.state !== 'running') return;

      const bytes = await fetch(jevilReviewSfx).then((r) => r.arrayBuffer());
      if (cancelled) return;
      const buffer = await ctx.decodeAudioData(bytes);
      if (cancelled) return;

      const region = loopRegion(buffer);
      const gain = ctx.createGain();
      gain.gain.value = 0.55;
      gain.connect(ctx.destination);

      source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.loopStart = region.start;
      source.loopEnd = region.end;
      source.connect(gain);
      source.start(0, region.start);
    };

    void startLoop();

    window.addEventListener('pointerdown', startLoop, { once: true });
    window.addEventListener('keydown', startLoop, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener('pointerdown', startLoop);
      window.removeEventListener('keydown', startLoop);
      try { source?.stop(); } catch { /* ya estaba detenido */ }
      source?.disconnect();
      void ctx?.close();
    };
  }, []);

  const reviews = useStore((s) => s.reviews);
  const due = sortQueue(reviews.filter((r) => isDue(r)));
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
  const dueByTopic = TOPICS.map((topic) => {
    const items = due.filter((r) => r.topic === topic);
    const questionCount = items.filter((r) => r.refType === 'question').length;
    const oralCount = items.filter((r) => r.refType === 'oral').length;
    const failures = items.reduce((sum, item) => sum + item.failures, 0);
    const minBox = items.reduce<LeitnerBox>((min, item) => (item.box < min ? item.box : min), 5);
    const critical = items.filter((item) => item.box === 1 || item.failures > 0).length;
    return {
      topic,
      items,
      count: items.length,
      questionCount,
      oralCount,
      failures,
      minBox,
      critical,
      priority: critical * 8 + failures * 3 + items.length + (6 - minBox) * 2,
    };
  })
    .filter((group) => group.count > 0)
    .sort((a, b) => b.priority - a.priority);
  const priorityGroup = dueByTopic[0];
  const totalFailures = due.reduce((sum, item) => sum + item.failures, 0);
  const criticalDue = due.filter((item) => item.box === 1 || item.failures > 0).length;

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
        <Card className="overflow-hidden">
          <div className="grid gap-5 xl:grid-cols-[0.9fr_1.6fr]">
            <div className="rounded-xl border border-accent/25 bg-[linear-gradient(135deg,rgba(0,94,80,0.12),rgba(255,255,255,0.92)_54%,rgba(0,159,146,0.14))] p-4">
              <div className="label">Vencido para repasar</div>
              <h2 className="mt-2 font-display text-2xl font-black text-ink">{due.length} repasos vencidos</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Prioridad alta: <span className="font-semibold text-ink">{priorityGroup ? TOPIC_LABELS[priorityGroup.topic] : 'sin prioridad'}</span>.
                Tiempo estimado: <span className="font-semibold text-ink">{formatEstimate(due.length)}</span>.
              </p>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="rounded-lg border border-line bg-white/80 px-3 py-2">
                  <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">Criticas</div>
                  <div className="font-display text-xl font-black text-ink">{criticalDue}</div>
                </div>
                <div className="rounded-lg border border-line bg-white/80 px-3 py-2">
                  <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">Fallos</div>
                  <div className="font-display text-xl font-black text-ink">{totalFailures}</div>
                </div>
                <div className="rounded-lg border border-line bg-white/80 px-3 py-2">
                  <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">Ejes</div>
                  <div className="font-display text-xl font-black text-ink">{dueByTopic.length}</div>
                </div>
              </div>

              <div className="mt-4 h-4 overflow-hidden rounded-full border border-line bg-panel-2">
                <div className="flex h-full w-full">
                  {dueByTopic.map((group) => (
                    <div
                      key={group.topic}
                      title={`${TOPIC_LABELS[group.topic]}: ${group.count}`}
                      style={{
                        width: `${(group.count / due.length) * 100}%`,
                        background: TOPIC_THEME[group.topic].gradient,
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {due.some((r) => r.refType === 'question') && (
                  <Link to="/repaso/teoria"><Button variant="primary">Repasar prioridad</Button></Link>
                )}
                {due.some((r) => r.refType === 'oral') && (
                  <Link to="/oral"><Button variant="go">Defensa oral</Button></Link>
                )}
              </div>
            </div>

            <div className="grid gap-3 lg:grid-cols-2">
              {dueByTopic.map((group) => {
                const th = TOPIC_THEME[group.topic];
                return (
                  <div
                    key={group.topic}
                    className="rounded-xl border bg-white/85 p-4 shadow-sm"
                    style={{ borderColor: th.border, background: `linear-gradient(135deg,${th.soft},rgba(255,255,255,0.92) 48%)` }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: th.color }} />
                          <h3 className="truncate font-display text-sm font-black text-ink">{TOPIC_LABELS[group.topic]}</h3>
                        </div>
                        <p className="mt-1 text-xs text-muted">
                          Caja mas baja: C{group.minBox} · {group.failures} fallos · {formatEstimate(group.count)}
                        </p>
                      </div>
                      <div className="rounded-lg px-3 py-1 text-right text-white shadow-sm" style={{ background: th.gradient }}>
                        <div className="font-display text-lg font-black leading-none">{group.count}</div>
                        <div className="text-[10px] font-semibold">vencidas</div>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[11px]">
                      <div className="rounded-lg border border-line bg-white/75 px-2 py-1.5">
                        <div className="font-mono font-black text-ink">{group.questionCount}</div>
                        <div className="text-muted">teoria</div>
                      </div>
                      <div className="rounded-lg border border-line bg-white/75 px-2 py-1.5">
                        <div className="font-mono font-black text-ink">{group.oralCount}</div>
                        <div className="text-muted">oral</div>
                      </div>
                      <div className="rounded-lg border border-line bg-white/75 px-2 py-1.5">
                        <div className="font-mono font-black text-ink">{group.critical}</div>
                        <div className="text-muted">criticas</div>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {group.questionCount > 0 && (
                        <Link to="/repaso/teoria"><Button variant="ghost" className="h-9 px-3 text-xs">Repasar teoria</Button></Link>
                      )}
                      {group.oralCount > 0 && (
                        <Link to="/oral"><Button variant="ghost" className="h-9 px-3 text-xs">Repasar oral</Button></Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <details className="mt-5 rounded-xl border border-line bg-panel-2/60 px-4 py-3">
            <summary className="cursor-pointer text-sm font-semibold text-stud">Ver detalle de la cola</summary>
            <div className="mt-3 space-y-1">
              {due.slice(0, 12).map((r) => (
                <div key={r.id} className="flex justify-between gap-3 border-b border-line/50 py-1.5 text-xs text-muted">
                  <span className="flex min-w-0 items-center gap-1.5">
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: TOPIC_THEME[r.topic].color }} />
                    <span style={{ color: TOPIC_THEME[r.topic].color }} className="truncate font-semibold">{TOPIC_LABELS[r.topic]}</span>
                    <span className="shrink-0">· {reviewModeLabel(r)}</span>
                  </span>
                  <span className="shrink-0 font-mono">C{r.box} · {r.failures} fallos</span>
                </div>
              ))}
              {due.length > 12 && <div className="pt-2 text-xs font-semibold text-muted">+ {due.length - 12} repasos mas</div>}
            </div>
          </details>
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
