import { useEffect, useRef, useState } from 'react';

export function Timer({ seconds, running, onExpire }: { seconds: number; running: boolean; onExpire?: () => void }) {
  const [left, setLeft] = useState(seconds);
  const ref = useRef<number | null>(null);

  useEffect(() => { setLeft(seconds); }, [seconds]);

  useEffect(() => {
    if (!running) { if (ref.current) window.clearInterval(ref.current); return; }
    ref.current = window.setInterval(() => {
      setLeft((l) => {
        if (l <= 1) { window.clearInterval(ref.current!); onExpire?.(); return 0; }
        return l - 1;
      });
    }, 1000);
    return () => { if (ref.current) window.clearInterval(ref.current); };
  }, [running, onExpire]);

  const m = Math.floor(left / 60).toString().padStart(2, '0');
  const s = (left % 60).toString().padStart(2, '0');
  const danger = left <= 60;
  return (
    <div className={`font-mono text-2xl font-bold tabular-nums ${danger ? 'text-danger animate-pulse' : 'text-stud'}`}>
      {m}:{s}
    </div>
  );
}
