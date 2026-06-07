import { useRef, useState } from 'react';
import { playSfx } from '../lib/audio/soundManager';

export type Shape = 'rect' | 'ellipse' | 'actor' | 'cloud';

export interface PaletteItem {
  label: string;
  shape: Shape;
}

interface DNode {
  id: string;
  x: number;
  y: number;
  label: string;
  shape: Shape;
}
interface DEdge {
  id: string;
  from: string;
  to: string;
  label?: string;
}
interface Scene {
  nodes: DNode[];
  edges: DEdge[];
}

const W = 820;
const H = 520;
const SIGLO = {
  ink: '#1D544F',
  panel: '#ffffff',
  surface: '#eef4f2',
  line: '#626E7B',
  active: '#008400',
  turquoise: '#009F92',
  dark: '#003F3A',
};

function parseScene(json: string): Scene {
  try {
    const s = JSON.parse(json) as Scene;
    if (s && Array.isArray(s.nodes) && Array.isArray(s.edges)) return s;
  } catch {
    /* vacío */
  }
  return { nodes: [], edges: [] };
}

// Texto del diagrama (para la corrección por reglas): etiquetas de nodos + de conexiones.
export function sceneToText(json: string): string {
  const s = parseScene(json);
  const nodes = new Map(s.nodes.map((n) => [n.id, n.label]));
  const edges = s.edges.map((e) => {
    const from = nodes.get(e.from) ?? '';
    const to = nodes.get(e.to) ?? '';
    return `${from} --> ${to} ${e.label ?? ''}`;
  });
  return [...s.nodes.map((n) => n.label), ...edges].join('\n');
}

const uid = () => Math.random().toString(36).slice(2, 9);

function dims(shape: Shape) {
  if (shape === 'actor') return { w: 64, h: 86 };
  if (shape === 'ellipse') return { w: 140, h: 66 };
  return { w: 150, h: 50 };
}

export function DiagramCanvas({
  value,
  onChange,
  palette,
}: {
  value: string;
  onChange: (json: string) => void;
  palette: PaletteItem[];
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const scene = parseScene(value);
  const [selected, setSelected] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [connectFrom, setConnectFrom] = useState<string | null>(null);
  const drag = useRef<{ id: string; dx: number; dy: number } | null>(null);

  const commit = (next: Scene) => onChange(JSON.stringify(next));

  function toSvg(clientX: number, clientY: number) {
    const svg = svgRef.current!;
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: clientX, y: clientY };
    const p = pt.matrixTransform(ctm.inverse());
    return { x: p.x, y: p.y };
  }

  function addNode(item: PaletteItem) {
    const n = scene.nodes.length;
    const node: DNode = {
      id: uid(),
      x: 60 + (n % 5) * 150,
      y: 50 + Math.floor(n / 5) * 110,
      label: item.label,
      shape: item.shape,
    };
    commit({ ...scene, nodes: [...scene.nodes, node] });
  }

  function onNodePointerDown(e: React.PointerEvent, node: DNode) {
    e.stopPropagation();
    if (connecting) {
      if (!connectFrom) {
        setConnectFrom(node.id);
      } else if (connectFrom !== node.id) {
        const label = window.prompt('Etiqueta de la conexión (opcional, ej: include / extend / 1..*)', '') ?? '';
        commit({ ...scene, edges: [...scene.edges, { id: uid(), from: connectFrom, to: node.id, label: label.trim() || undefined }] });
        setConnectFrom(null);
        playSfx('confirm');
      }
      return;
    }
    setSelected(node.id);
    const p = toSvg(e.clientX, e.clientY);
    drag.current = { id: node.id, dx: p.x - node.x, dy: p.y - node.y };
    (e.target as Element).setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!drag.current) return;
    const p = toSvg(e.clientX, e.clientY);
    const { id, dx, dy } = drag.current;
    commit({
      ...scene,
      nodes: scene.nodes.map((nd) =>
        nd.id === id ? { ...nd, x: Math.max(0, Math.min(W, p.x - dx)), y: Math.max(0, Math.min(H, p.y - dy)) } : nd,
      ),
    });
  }

  function onPointerUp() {
    drag.current = null;
  }

  function editLabel(node: DNode) {
    const label = window.prompt('Texto:', node.label);
    if (label == null) return;
    commit({ ...scene, nodes: scene.nodes.map((n) => (n.id === node.id ? { ...n, label } : n)) });
  }

  function editEdge(edge: DEdge) {
    const label = window.prompt('Etiqueta de la conexión (vacío para quitar):', edge.label ?? '');
    if (label == null) return;
    commit({ ...scene, edges: scene.edges.map((e) => (e.id === edge.id ? { ...e, label: label.trim() || undefined } : e)) });
  }

  function removeSelected() {
    if (!selected) return;
    playSfx('error');
    commit({
      nodes: scene.nodes.filter((n) => n.id !== selected),
      edges: scene.edges.filter((e) => e.from !== selected && e.to !== selected),
    });
    setSelected(null);
  }

  const center = (n: DNode) => {
    const d = dims(n.shape);
    return { cx: n.x + d.w / 2, cy: n.y + d.h / 2 };
  };

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {palette.map((p) => (
          <button key={p.label} onClick={() => addNode(p)}
            className="pill pill-muted">+ {p.label}</button>
        ))}
        <button
          onClick={() => { setConnecting((c) => !c); setConnectFrom(null); }}
          className={`pill ${connecting ? 'pill-active' : 'pill-muted'}`}>
          {connecting ? '🔗 Conectando…' : '🔗 Conectar'}
        </button>
        <button onClick={removeSelected} disabled={!selected}
          className="sfx-mute pill border border-teal-card/50 bg-white/80 text-teal-card disabled:opacity-40">🗑 Eliminar</button>
        <button onClick={() => { commit({ nodes: [], edges: [] }); setSelected(null); }}
          className="pill pill-muted">Limpiar</button>
      </div>

      <p className="text-[11px] text-muted mb-2">
        Agregá figuras con la paleta, arrastralas para moverlas. <b>Conectar</b>: tocá una figura y luego otra.
        Doble clic en una figura para editar el texto; en una línea, para etiquetarla.
      </p>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full rounded-xl border border-line bg-panel-2 touch-none"
        style={{ aspectRatio: `${W} / ${H}` }}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onClick={() => setSelected(null)}
      >
        {/* conexiones */}
        {scene.edges.map((e) => {
          const a = scene.nodes.find((n) => n.id === e.from);
          const b = scene.nodes.find((n) => n.id === e.to);
          if (!a || !b) return null;
          const A = center(a);
          const B = center(b);
          return (
            <g key={e.id} onDoubleClick={() => editEdge(e)} style={{ cursor: 'pointer' }}>
              <line x1={A.cx} y1={A.cy} x2={B.cx} y2={B.cy} stroke={SIGLO.line} strokeWidth={2} />
              <line x1={A.cx} y1={A.cy} x2={B.cx} y2={B.cy} stroke="transparent" strokeWidth={14} />
              {e.label && (
                <text x={(A.cx + B.cx) / 2} y={(A.cy + B.cy) / 2 - 4} textAnchor="middle"
                  fontSize={12} fill={SIGLO.dark} fontWeight="600"
                  style={{ paintOrder: 'stroke', stroke: SIGLO.surface, strokeWidth: 4 }}>
                  «{e.label}»
                </text>
              )}
            </g>
          );
        })}

        {/* nodos */}
        {scene.nodes.map((n) => {
          const d = dims(n.shape);
          const isSel = selected === n.id;
          const isFrom = connectFrom === n.id;
          const stroke = isFrom ? SIGLO.active : isSel ? SIGLO.turquoise : SIGLO.line;
          const sw = isSel || isFrom ? 3 : 2;
          return (
            <g key={n.id}
              transform={`translate(${n.x},${n.y})`}
              onPointerDown={(e) => onNodePointerDown(e, n)}
              onDoubleClick={(e) => { e.stopPropagation(); editLabel(n); }}
              style={{ cursor: connecting ? 'crosshair' : 'grab' }}>
              {n.shape === 'ellipse' && (
                <ellipse cx={d.w / 2} cy={d.h / 2} rx={d.w / 2} ry={d.h / 2} fill={SIGLO.panel} stroke={stroke} strokeWidth={sw} />
              )}
              {n.shape === 'rect' && (
                <rect width={d.w} height={d.h} rx={8} fill={SIGLO.panel} stroke={stroke} strokeWidth={sw} />
              )}
              {n.shape === 'cloud' && (
                <rect width={d.w} height={d.h} rx={24} fill={SIGLO.surface} stroke={stroke} strokeWidth={sw} strokeDasharray="5 4" />
              )}
              {n.shape === 'actor' && (
                <g stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round">
                  <circle cx={d.w / 2} cy={14} r={10} fill={SIGLO.panel} />
                  <line x1={d.w / 2} y1={24} x2={d.w / 2} y2={50} />
                  <line x1={d.w / 2 - 16} y1={34} x2={d.w / 2 + 16} y2={34} />
                  <line x1={d.w / 2} y1={50} x2={d.w / 2 - 14} y2={68} />
                  <line x1={d.w / 2} y1={50} x2={d.w / 2 + 14} y2={68} />
                </g>
              )}
              <text
                x={d.w / 2}
                y={n.shape === 'actor' ? d.h - 4 : d.h / 2}
                textAnchor="middle"
                dominantBaseline={n.shape === 'actor' ? 'auto' : 'middle'}
                fontSize={12}
                fontWeight="600"
                fill={SIGLO.ink}
                style={{ pointerEvents: 'none' }}>
                {n.label.length > 22 ? n.label.slice(0, 21) + '…' : n.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
