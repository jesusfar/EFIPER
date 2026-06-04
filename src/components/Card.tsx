import { type CSSProperties, type ReactNode } from 'react';

export function Card({ children, className = '', style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return <div className={`panel p-5 ${className}`} style={style}>{children}</div>;
}

export function Stat({ label, value, accent = false }: { label: string; value: ReactNode; accent?: boolean }) {
  return (
    <div className="panel panel-vibrant p-4">
      <div className="label">{label}</div>
      <div className={`mt-1 text-2xl font-display font-bold ${accent ? 'text-stud-dim' : 'text-ink'}`}>{value}</div>
    </div>
  );
}
