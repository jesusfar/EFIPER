export function ProgressBar({ value, max = 100 }: { value: number; max?: number }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="h-2 w-full rounded-full bg-panel-2 overflow-hidden border border-accent/40">
      <div className="h-full bg-[linear-gradient(90deg,#009F92,#008400)] transition-all duration-500" style={{ width: `${pct}%` }} />
    </div>
  );
}
