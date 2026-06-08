import { Link } from 'react-router-dom';
import { useStore, TOPIC_LABELS, rankForLevel, levelProgressForXp } from '../../store/useStore';
import { Card, Stat } from '../../components/Card';
import { Button } from '../../components/Button';
import { ProgressBar } from '../../components/ProgressBar';
import { downloadBackup, importBackup } from '../../lib/import-export/backup';
import { TOPIC_THEME } from '../../lib/theme/topicTheme';
import { Siggy } from './siggy/Siggy';
import type { Topic } from '../../types';

function daysUntil(iso: string | null): number | null {
  if (!iso) return null;
  const diff = new Date(iso).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (24 * 60 * 60 * 1000)));
}

const RANK_SABERS = [
  { from: '#38BDF8', to: '#22D3EE', glow: 'rgba(34,211,238,0.82)' },
  { from: '#A3E635', to: '#22C55E', glow: 'rgba(34,197,94,0.82)' },
  { from: '#FACC15', to: '#FB923C', glow: 'rgba(250,204,21,0.85)' },
  { from: '#F472B6', to: '#EC4899', glow: 'rgba(236,72,153,0.85)' },
  { from: '#A78BFA', to: '#7C3AED', glow: 'rgba(124,58,237,0.88)' },
  { from: '#FB7185', to: '#DC2626', glow: 'rgba(220,38,38,0.88)' },
  { from: '#60A5FA', to: '#2563EB', glow: 'rgba(37,99,235,0.9)' },
  { from: '#2DD4BF', to: '#00FF9D', glow: 'rgba(45,212,191,0.95)' },
];

function saberForLevel(level: number) {
  return RANK_SABERS[Math.min(Math.max(level, 1), RANK_SABERS.length) - 1];
}

export function DashboardPage() {
  const { progress, reviews, setExamDate } = useStore();
  if (!progress) return null;

  const days = daysUntil(progress.examDate);
  const dueCount = reviews.filter((r) => r.status !== 'mastered' && r.nextReviewAt <= Date.now()).length;

  let weakest: Topic | null = null;
  let worst = 1;
  for (const [t, s] of Object.entries(progress.topicStats)) {
    if (s.answered >= 2) {
      const ratio = s.correct / s.answered;
      if (ratio < worst) { worst = ratio; weakest = t as Topic; }
    }
  }
  const saber = saberForLevel(progress.level);
  const rankProgress = levelProgressForXp(progress.xp);

  return (
    <div className="space-y-6 animate-rise">
      <header className="flex items-end justify-between flex-wrap gap-3 rounded-2xl p-5 text-white bg-[linear-gradient(135deg,#005E50,#009F92_55%,#008400)] shadow-stud">
        <div>
          <div className="label text-white/80">Dashboard de urgencia</div>
          <h1 className="font-display text-3xl font-black tracking-tight mt-1">
            {days === null ? 'Configura tu fecha' : days === 0 ? 'Es hoy. A defender.' : `Faltan ${days} dias`}
          </h1>
        </div>
        <input
          type="date"
          value={progress.examDate ?? ''}
          onChange={(e) => setExamDate(e.target.value)}
          className="bg-white/95 text-ink border border-white/40 rounded-lg px-3 py-2 text-sm font-mono shadow-sm"
        />
      </header>

      <Siggy />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Racha" value={`${progress.streak} 🔥`} accent />
        <Stat label="XP" value={progress.xp} accent />
        <Stat label="Nivel" value={progress.level} />
        <Stat label="A repasar" value={dueCount} />
      </div>

      <Card className="relative overflow-hidden border-[#1f6f66]/70 bg-[radial-gradient(circle_at_14%_0%,rgba(0,159,146,0.28),transparent_34%),linear-gradient(135deg,#071715,#0b2420_52%,#06100f)] text-white shadow-[0_18px_42px_rgba(0,30,25,0.28)]">
        <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent" />
        <div className="relative flex items-start justify-between gap-4 mb-3">
          <div>
            <div className="text-[10px] font-display font-bold uppercase tracking-[0.2em] text-white/55">Tu Rango actual es:</div>
            <span className="mt-1 block font-display text-xl font-black uppercase tracking-[0.08em] text-white">{rankForLevel(progress.level)}</span>
          </div>
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white/70 font-mono">Nivel {progress.level}</span>
        </div>
        <ProgressBar
          value={rankProgress.value}
          max={rankProgress.max}
          className="h-3 border-white/15 bg-black/55 shadow-[inset_0_0_10px_rgba(0,0,0,0.85)]"
          barClassName="rounded-full"
          barStyle={{
            background: `linear-gradient(90deg, ${saber.from}, #ffffff 48%, ${saber.to})`,
            boxShadow: `0 0 8px ${saber.glow}, 0 0 18px ${saber.glow}, 0 0 34px ${saber.glow}`,
          }}
        />
        <p className="mt-3 text-sm text-white/68">
          Tema mas debil:{' '}
          <span
            className="font-bold"
            style={weakest ? {
              color: TOPIC_THEME[weakest].color,
              textShadow: `0 0 6px ${TOPIC_THEME[weakest].color}, 0 0 14px ${TOPIC_THEME[weakest].color}, 0 0 24px ${TOPIC_THEME[weakest].border}`,
            } : undefined}
          >
            {weakest ? TOPIC_LABELS[weakest] : 'aun sin datos suficientes'}
          </span>
        </p>
      </Card>

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <Link to="/teoria"><Button variant="missionTheory" className="w-full">Ver teoria</Button></Link>
        <Link to="/test"><Button variant="missionTest" className="w-full">Test rapido</Button></Link>
        <Link to="/oral"><Button variant="missionOral" className="w-full">Defensa oral</Button></Link>
        <Link to="/caso/case-001"><Button variant="missionCase" className="w-full">Resolver caso</Button></Link>
        <Link to="/repaso"><Button variant="missionReview" className="w-full">Repasar errores ({dueCount})</Button></Link>
      </div>

      <Card className="flex items-center justify-between flex-wrap gap-3">
        <span className="text-sm text-muted">Respalda tu progreso (queda solo en este dispositivo).</span>
        <div className="flex gap-2">
          <Button onClick={() => downloadBackup()}>Exportar</Button>
          <label className="px-4 py-2.5 rounded-xl font-semibold text-sm bg-panel-2 border border-line hover:border-stud/50 cursor-pointer transition">
            Importar
            <input type="file" accept="application/json" className="hidden"
              onChange={async (e) => { const f = e.target.files?.[0]; if (f) { await importBackup(f); location.reload(); } }} />
          </label>
        </div>
      </Card>
    </div>
  );
}
