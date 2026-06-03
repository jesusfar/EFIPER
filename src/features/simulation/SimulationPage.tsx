import { Link } from 'react-router-dom';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';

// Simulacro: encadena las tres instancias del examen real.
// (Scaffold: la orquestación con reporte unificado es el primer P1 a completar.)
const PHASES = [
  { n: 1, title: '20 preguntas mixtas', desc: 'Teoría de los 5 ejes, contrarreloj.', to: '/test', cta: 'Iniciar teoría' },
  { n: 2, title: '1 caso práctico (60 min)', desc: 'RF/RNF + casos de uso + clases + DER + red.', to: '/caso/case-001', cta: 'Iniciar caso' },
  { n: 3, title: '5 preguntas orales', desc: 'Defensa frente al tribunal.', to: '/oral', cta: 'Iniciar defensa' },
];

export function SimulationPage() {
  return (
    <div className="space-y-6 animate-rise max-w-2xl">
      <div>
        <div className="label">Simulacro final</div>
        <h1 className="font-display text-2xl font-black mt-1">Examen completo</h1>
        <p className="text-muted text-sm mt-2">Reproduce la estructura real del EFIP I: oral grupal → escrito → defensa.</p>
      </div>
      {PHASES.map((p) => (
        <Card key={p.n} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0">
            <div className="label">Fase {p.n}</div>
            <h3 className="font-semibold mt-0.5">{p.title}</h3>
            <p className="text-xs text-muted mt-1">{p.desc}</p>
          </div>
          <Link to={p.to} className="w-full sm:w-auto"><Button variant="primary" className="w-full sm:w-auto">{p.cta}</Button></Link>
        </Card>
      ))}
      <Card>
        <p className="text-xs text-muted">
          Próximo paso del backlog (P1): orquestar las tres fases en una sola sesión con nota estimada
          y reporte de debilidades unificado.
        </p>
      </Card>
    </div>
  );
}
