import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCase } from '../../data';
import { useStore } from '../../store/useStore';
import { RUBRIC_FNS, type RubricReport } from '../../lib/scoring/rules';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Timer } from '../../components/Timer';
import { MermaidView } from '../../components/MermaidView';
import { DiagramCanvas, sceneToText, type PaletteItem } from '../../components/DiagramCanvas';
import { playSfx } from '../../lib/audio/soundManager';
import type { RubricKind } from '../../types';

interface Block {
  key: string;
  title: string;
  kind: RubricKind;
  diagram?: boolean;
  placeholder: string;
}

const BLOCKS: Block[] = [
  { key: 'rf', title: 'Requerimientos funcionales', kind: 'rf', placeholder: 'Uno por linea:\nEl sistema debe permitir registrar entradas de mercaderia.\nEl sistema debe permitir consultar el stock por deposito.' },
  { key: 'rnf', title: 'Requerimientos no funcionales', kind: 'rnf', placeholder: 'Uno por linea, con metrica:\nEl sistema debe responder consultas en menos de 2 s con 50.000 productos.' },
  { key: 'uc', title: 'Casos de uso', kind: 'use_cases', diagram: true, placeholder: 'graph LR\n  Empleado --> RegistrarEntrada\n  RegistrarEntrada -.->|include| Autenticar' },
  { key: 'cl', title: 'Diagrama de clases', kind: 'classes', diagram: true, placeholder: 'classDiagram\n  class PRODUCTO {\n    +codigo\n    +consultarStock()\n  }' },
  { key: 'der', title: 'DER / modelo de datos', kind: 'der', diagram: true, placeholder: 'erDiagram\n  PRODUCTO ||--o{ MOVIMIENTO : tiene' },
  { key: 'net', title: 'Diagrama de red', kind: 'network', diagram: true, placeholder: 'graph TD\n  Internet --> Firewall --> Router_Capa3 --> Switch_Capa2' },
];

const PALETTES: Record<RubricKind, PaletteItem[]> = {
  rf: [], rnf: [],
  use_cases: [
    { label: 'Actor', shape: 'actor' },
    { label: 'Caso de uso', shape: 'ellipse' },
  ],
  classes: [{ label: 'CLASE', shape: 'rect' }],
  der: [{ label: 'ENTIDAD', shape: 'rect' }],
  network: [
    { label: '\u{1F310} Internet', shape: 'cloud' },
    { label: '\u{1F9F1} Firewall', shape: 'rect' },
    { label: '\u{1F500} Router (Capa 3)', shape: 'rect' },
    { label: '\u{1F501} Switch (Capa 2)', shape: 'rect' },
    { label: '\u{1F5A5} Servidor App', shape: 'rect' },
    { label: '\u{1F5C4} Servidor BD', shape: 'rect' },
    { label: '\u{1F4BB} PC', shape: 'rect' },
    { label: '192.168.1.0/24', shape: 'rect' },
  ],
};

type Mode = 'draw' | 'write';

function weightedScore(reports: Record<string, RubricReport>, rubric: { kind: RubricKind; weight: number }[]): number {
  let sum = 0, wsum = 0;
  for (const item of rubric) {
    const r = reports[item.kind];
    if (r) { sum += r.score * item.weight; wsum += item.weight; }
  }
  return wsum ? Math.round(sum / wsum) : 0;
}

export function CasePage() {
  const { id } = useParams();
  const c = getCase(id ?? '');
  const noPressure = useStore((s) => s.progress?.settings.noPressure ?? false);
  const addXp = useStore((s) => s.addXp);

  const [active, setActive] = useState('rf');
  const [text, setText] = useState<Record<string, string>>({});
  const [drawings, setDrawings] = useState<Record<string, string>>({});
  const [mode, setMode] = useState<Record<string, Mode>>({});
  const [reports, setReports] = useState<Record<string, RubricReport> | null>(null);
  const [running, setRunning] = useState(!noPressure);

  const block = BLOCKS.find((b) => b.key === active)!;
  const blockMode: Mode = mode[active] ?? (block.diagram ? 'draw' : 'write');

  const total = useMemo(() => {
    if (!reports || !c) return null;
    return weightedScore(reports, c.rubric);
  }, [reports, c]);

  if (!c) return <p className="text-muted">Caso no encontrado. <Link className="text-stud-dim underline" to="/">Volver</Link></p>;

  function textForRubric(b: Block): string {
    const m = mode[b.key] ?? (b.diagram ? 'draw' : 'write');
    if (b.diagram && m === 'draw') return sceneToText(drawings[b.key] ?? '');
    return text[b.key] ?? '';
  }

  function correct() {
    const out: Record<string, RubricReport> = {};
    for (const b of BLOCKS) out[b.kind] = RUBRIC_FNS[b.kind](textForRubric(b));
    setReports(out);
    playSfx('confirm');
    if (c) {
      const xp = Math.round(weightedScore(out, c.rubric) * 1.5);
      if (xp > 0) void addXp(xp);
    }
  }

  return (
    <div className="space-y-5 animate-rise">
      <header className="case-hero rounded-2xl p-5 text-white shadow-stud flex items-start justify-between flex-wrap gap-3">
        <div className="min-w-0">
          <div className="label text-white/80">Modo caso EFIP</div>
          <h1 className="font-display text-2xl font-extrabold">{c.title}</h1>
          <p className="text-xs text-white/80 mt-1">{c.domain}</p>
        </div>
        {!noPressure && (
          <div className="rounded-xl border border-white/30 bg-white/95 px-4 py-2 text-center text-ink shadow-sm">
            <div className="label">Tiempo</div>
            <Timer seconds={60 * 60} running={running} onExpire={() => playSfx('error')} />
            <button className="text-xs text-muted underline mt-1" onClick={() => setRunning((r) => !r)}>{running ? 'pausar' : 'reanudar'}</button>
          </div>
        )}
      </header>

      <Card>
        <div className="label mb-1">Situacion problematica</div>
        <p className="text-sm leading-relaxed text-ink/90">{c.scenario}</p>
      </Card>

      <div className="flex flex-wrap gap-2">
        {BLOCKS.map((b) => (
          <button key={b.key} onClick={() => { setActive(b.key); }}
            className={`pill ${active === b.key ? 'pill-active' : 'pill-muted'}`}>
            {b.title}{reports?.[b.kind] ? ` \u00b7 ${reports[b.kind].score}%` : ''}
          </button>
        ))}
      </div>

      {block.diagram && (
        <div className="flex items-center gap-2">
          <span className="label">Modo</span>
          <button onClick={() => setMode((m) => ({ ...m, [active]: 'draw' }))}
            className={`pill ${blockMode === 'draw' ? 'pill-active' : 'pill-muted'}`}>\u270F\uFE0F Dibujar</button>
          <button onClick={() => setMode((m) => ({ ...m, [active]: 'write' }))}
            className={`pill ${blockMode === 'write' ? 'pill-active' : 'pill-muted'}`}>\u2328\uFE0F Escribir (Mermaid)</button>
        </div>
      )}

      {block.diagram && blockMode === 'draw' ? (
        <Card>
          <div className="label mb-2">{block.title} \u2014 dibujo</div>
          <DiagramCanvas
            value={drawings[active] ?? ''}
            onChange={(json) => setDrawings((d) => ({ ...d, [active]: json }))}
            palette={PALETTES[block.kind]}
          />
        </Card>
      ) : (
        <div className={`grid gap-4 ${block.diagram ? 'lg:grid-cols-2' : ''}`}>
          <Card>
            <div className="label mb-2">{block.title}{block.diagram ? ' (Mermaid)' : ''}</div>
            <textarea
              value={text[active] ?? ''}
              onChange={(e) => setText((t) => ({ ...t, [active]: e.target.value }))}
              placeholder={block.placeholder}
              className="w-full h-64 bg-panel-2 border border-line rounded-xl p-3 text-sm font-mono resize-y"
            />
          </Card>
          {block.diagram && (
            <Card>
              <div className="label mb-2">Vista previa</div>
              <MermaidView code={text[active] ?? ''} />
            </Card>
          )}
        </div>
      )}

      <div className="grid sm:flex sm:items-center gap-3">
        <Button variant="primary" className="sfx-mute" onClick={correct}>Corregir por rubrica</Button>
      </div>

      {reports && (
        <Card className="animate-pop-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-bold">Correccion</h3>
            <span className="font-display text-3xl font-extrabold text-stud-dim">{total}%</span>
          </div>
          <div className="space-y-4">
            {BLOCKS.map((b) => {
              const r = reports[b.kind];
              return (
                <div key={b.key}>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">{b.title}</span>
                    <span className="font-mono text-sm text-muted">{r.score}%</span>
                  </div>
                  <ul className="mt-1.5 space-y-1">
                    {r.checks.map((ch) => (
                      <li key={ch.label} className={`text-xs flex gap-2 ${ch.passed ? 'text-go' : 'text-muted'}`}>
                        <span>{ch.passed ? '\u2713' : '\u25CB'}</span>
                        <span>{ch.label}{!ch.passed && ch.hint ? ` \u2014 ${ch.hint}` : ''}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
