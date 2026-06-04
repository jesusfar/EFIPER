import { Link } from 'react-router-dom';
import { useStore, TOPIC_LABELS } from '../../store/useStore';
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

const LEVEL_NAMES = [
  'Sobreviviente EFIP', 'Aprendiz de Requerimientos', 'Analista Junior', 'Modelador UML',
  'Guerrero de Redes', 'Defensor Oral', 'Candidato Aprobado', 'EFIPER Pro',
];

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

  return (
    <div className="space-y-6 animate-rise">
      <header className="flex items-end justify-between flex-wrap gap-3 rounded-2xl p-5 text-white bg-[linear-gradient(135deg,#005E50,#009F92_55%,#008400)] shadow-stud">
        <div>
          <div className="label text-white/80">Dashboard de urgencia</div>
          <h1 className="font-display text-3xl font-black tracking-tight mt-1">
            {days === null ? 'Configurá tu fecha' : days === 0 ? 'Es hoy. A defender.' : `Faltan ${days} días`}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={progress.examDate ?? ''}
            onChange={(e) => setExamDate(e.target.value)}
            className="bg-white/95 text-ink border border-white/40 rounded-lg px-3 py-2 text-sm font-mono shadow-sm"
          />
        </div>
      </header>

      <Siggy />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Racha" value={`${progress.streak} 🔥`} accent />
        <Stat label="XP" value={progress.xp} accent />
        <Stat label="Nivel" value={progress.level} />
        <Stat label="A repasar" value={dueCount} />
      </div>

      <Card>
        <div className="flex items-center justify-between mb-2">
          <span className="label">{LEVEL_NAMES[Math.min(progress.level - 1, LEVEL_NAMES.length - 1)]}</span>
          <span className="text-xs text-muted font-mono">Nivel {progress.level}</span>
        </div>
        <ProgressBar value={progress.xp % 200} max={200} />
        <p className="mt-3 text-sm text-muted">
          Tema más débil:{' '}
          <span className="font-semibold" style={weakest ? { color: TOPIC_THEME[weakest].color } : undefined}>
            {weakest ? TOPIC_LABELS[weakest] : 'aún sin datos suficientes'}
          </span>
        </p>
      </Card>

      <div>
        <div className="label mb-2">Misión de hoy {progress.dailyMissionDone ? '✓' : ''}</div>
        <p className="text-sm text-muted mb-3">10 preguntas · 1 bloque de caso · 5 preguntas orales.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <Link to="/teoria"><Button variant="missionTheory" className="w-full">Ver teoría</Button></Link>
          <Link to="/test"><Button variant="missionTest" className="w-full">Test rápido</Button></Link>
          <Link to="/oral"><Button variant="missionOral" className="w-full">Defensa oral</Button></Link>
          <Link to="/caso/case-001"><Button variant="missionCase" className="w-full">Resolver caso</Button></Link>
          <Link to="/repaso"><Button variant="missionReview" className="w-full">Repasar errores ({dueCount})</Button></Link>
        </div>
      </div>

      <Card className="flex items-center justify-between flex-wrap gap-3">
        <span className="text-sm text-muted">Respaldá tu progreso (queda solo en este dispositivo).</span>
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
