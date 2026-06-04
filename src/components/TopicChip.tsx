import { TOPIC_LABELS } from '../store/useStore';
import { TOPIC_THEME } from '../lib/theme/topicTheme';
import type { Topic } from '../types';

// Etiqueta del eje temático con su color identitario. Se usa en todas las
// secciones para que cada eje se reconozca siempre por el mismo color.
export function TopicChip({ topic, subtopic, className = '' }: { topic: Topic; subtopic?: string; className?: string }) {
  const th = TOPIC_THEME[topic];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-display font-bold uppercase tracking-[0.12em] ${className}`}
      style={{ color: th.color, background: th.soft, border: `1px solid ${th.border}` }}
    >
      <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: th.color }} />
      {TOPIC_LABELS[topic]}
      {subtopic ? <span className="font-body normal-case tracking-normal opacity-75">· {subtopic}</span> : null}
    </span>
  );
}
