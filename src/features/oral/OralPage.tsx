import { useMemo, useState } from 'react';
import { useStore, TOPIC_LABELS } from '../../store/useStore';
import { ORAL_QUESTIONS } from '../../data';
import { sortQueue, isDue } from '../../lib/spaced-repetition/leitner';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { MermaidView } from '../../components/MermaidView';
import { playSfx } from '../../lib/audio/soundManager';
import type { OralQuestion } from '../../types';

const DIFFICULTY_LABELS = { 1: 'Basico', 2: 'Medio', 3: 'Avanzado' } as const;

function shuffled<T>(items: T[], seed: number): T[] {
  const copy = [...items];
  let state = Math.max(1, Math.floor(seed * 2147483647));
  for (let i = copy.length - 1; i > 0; i -= 1) {
    state = (state * 48271) % 2147483647;
    const j = state % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function CodeBlock({ lang, code }: { lang: string; code: string }) {
  if (lang === 'mermaid') return <MermaidView code={code} />;

  return (
    <pre className="rich-code">
      <code data-lang={lang || 'texto'}>{code}</code>
    </pre>
  );
}

function isDiagramLine(line: string): boolean {
  return /[┌┐└┘│─▶◀▼▲●«»]/.test(line) || /^\s*(alt|else|loop|opt)\b/.test(line);
}

function DiagramBlock({ lines }: { lines: string[] }) {
  return (
    <pre className="rich-diagram" aria-label="Diagrama">
      {lines.join('\n')}
    </pre>
  );
}

function isGanttLine(line: string): boolean {
  return /\bGantt\b/i.test(line) && line.includes('|');
}

function GanttBlock({ line }: { line: string }) {
  const [, rawTitle = 'Gantt', rawBody = line] = line.match(/^(.*?Gantt[^:]*):?\s*(.*)$/i) ?? [];
  const segments = rawBody.split('|').map((item) => item.trim()).filter(Boolean);

  if (!segments.length) return <DiagramBlock lines={[line]} />;

  return (
    <div className="gantt-block">
      <div className="gantt-title">{rawTitle.trim()}</div>
      <div className="gantt-track">
        {segments.map((segment, idx) => (
          <div key={`${segment}-${idx}`} className="gantt-segment">{segment}</div>
        ))}
      </div>
    </div>
  );
}

function isTableSeparator(line: string): boolean {
  return /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line);
}

function isTableLine(line: string): boolean {
  return ((line.match(/\|/g) ?? []).length >= 2) && !isGanttLine(line);
}

function TableBlock({ rows }: { rows: string[] }) {
  const cells = rows.filter((row) => !isTableSeparator(row)).map((row) => {
    const normalized = row.trim().replace(/^[-•]\s*/, '').replace(/^\|/, '').replace(/\|$/, '');
    return normalized.split('|').map((cell) => cell.trim()).filter(Boolean);
  });
  const maxCols = Math.max(...cells.map((row) => row.length));
  const hasHeader = rows.some(isTableSeparator);
  const head = hasHeader ? cells[0] : Array.from({ length: maxCols }, (_, idx) => `Dato ${idx + 1}`);
  const body = hasHeader ? cells.slice(1) : cells;

  return (
    <div className="rich-table-wrap">
      <table className="rich-table">
        <thead>
          <tr>{head.map((cell) => <th key={cell}>{cell}</th>)}</tr>
        </thead>
        <tbody>
          {body.map((row, rowIdx) => (
            <tr key={rowIdx}>{row.map((cell, cellIdx) => <td key={`${rowIdx}-${cellIdx}`}>{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RichAnswer({ text }: { text: string }) {
  const blocks: JSX.Element[] = [];
  const lines = text.split('\n');
  let paragraph: string[] = [];
  let codeLang = '';
  let code: string[] = [];
  let table: string[] = [];
  let diagram: string[] = [];

  const flushParagraph = () => {
    const content = paragraph.join(' ').trim();
    if (content) blocks.push(<p key={`p-${blocks.length}`}>{content}</p>);
    paragraph = [];
  };

  const flushTable = () => {
    if (table.length >= 1) {
      flushParagraph();
      blocks.push(<TableBlock key={`t-${blocks.length}`} rows={table} />);
    } else {
      paragraph.push(...table);
    }
    table = [];
  };

  const flushDiagram = () => {
    if (diagram.length) blocks.push(<DiagramBlock key={`d-${blocks.length}`} lines={diagram} />);
    diagram = [];
  };

  lines.forEach((line) => {
    const fence = line.match(/^```(\w+)?\s*$/);
    if (fence) {
      if (codeLang) {
        blocks.push(<CodeBlock key={`c-${blocks.length}`} lang={codeLang} code={code.join('\n')} />);
        codeLang = '';
        code = [];
      } else {
        flushParagraph();
        codeLang = fence[1] ?? 'text';
      }
      return;
    }

    if (codeLang) {
      code.push(line);
      return;
    }

    if (isGanttLine(line)) {
      flushParagraph();
      flushTable();
      flushDiagram();
      blocks.push(<GanttBlock key={`g-${blocks.length}`} line={line} />);
      return;
    }

    if (isDiagramLine(line)) {
      flushParagraph();
      flushTable();
      diagram.push(line);
      return;
    }

    if (diagram.length) flushDiagram();

    if (isTableLine(line)) {
      table.push(line);
      return;
    }

    if (table.length) flushTable();

    if (!line.trim()) {
      flushParagraph();
      return;
    }

    paragraph.push(line.trim());
  });

  if (codeLang) blocks.push(<CodeBlock key={`c-${blocks.length}`} lang={codeLang} code={code.join('\n')} />);
  if (diagram.length) flushDiagram();
  if (table.length) flushTable();
  flushParagraph();

  return <div className="rich-answer">{blocks}</div>;
}

export function OralPage() {
  const { reviews, recordAnswer } = useStore();
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [startTs, setStartTs] = useState(Date.now());
  const [roundSeed, setRoundSeed] = useState(() => Math.random());

  const queue = useMemo<OralQuestion[]>(() => {
    const due = reviews.filter((r) => r.refType === 'oral' && isDue(r));
    const dueIds = new Set(sortQueue(due).map((r) => r.refId));
    const dueQs = [...dueIds].map((id) => ORAL_QUESTIONS.find((o) => o.id === id)).filter(Boolean) as OralQuestion[];
    const rest = ORAL_QUESTIONS.filter((o) => !dueIds.has(o.id));
    return [...dueQs, ...shuffled(rest, roundSeed)].slice(0, 10);
  }, [reviews, roundSeed]);

  const q = queue[idx];

  function gradeSelf(correct: boolean) {
    if (!q) return;
    playSfx(correct ? 'collect' : 'error');
    void recordAnswer({
      refId: q.id,
      refType: 'oral',
      userAnswer: revealed ? 'autoevaluado' : '',
      correct,
      timeSpent: Math.round((Date.now() - startTs) / 1000),
      topic: q.topic,
      mode: 'oral',
    });
    setRevealed(false);
    setStartTs(Date.now());
    setIdx((i) => i + 1);
  }

  function restartRound() {
    setRoundSeed(Math.random());
    setIdx(0);
    setRevealed(false);
    setStartTs(Date.now());
  }

  if (!q || idx >= queue.length) {
    return (
      <div className="space-y-4 animate-pop-in max-w-xl">
        <h1 className="font-display text-2xl font-black">Defensa completada</h1>
        <p className="text-muted text-sm">Las que marcaste como flojas vuelven antes segun el sistema Leitner.</p>
        <Button variant="primary" onClick={restartRound}>Otra vuelta</Button>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-rise max-w-4xl">
      <div className="flex items-center justify-between gap-3">
        <span className="label">{TOPIC_LABELS[q.topic]} · {q.subtopic}</span>
        <div className="flex flex-wrap justify-end gap-2">
          <span className="pill pill-muted">{DIFFICULTY_LABELS[q.difficulty]}</span>
          <span className={`pill ${q.frequency === 'recurrente' ? 'pill-active' : 'pill-muted'}`}>{q.frequency}</span>
        </div>
      </div>

      <Card>
        <div className="label mb-2">El tribunal pregunta</div>
        <h2 className="text-xl font-semibold leading-snug">{q.question}</h2>

        {!revealed ? (
          <div className="mt-6">
            <p className="text-sm text-muted mb-3">Responde en voz alta como si estuvieras frente al tribunal. Despues revela la respuesta modelo y autoevaluate con honestidad.</p>
            <Button variant="primary" className="sfx-mute" onClick={() => { playSfx('confirm'); setRevealed(true); }}>Revelar respuesta modelo</Button>
          </div>
        ) : (
          <div className="mt-5 animate-pop-in">
            <div className="rounded-xl border border-go/40 bg-go/10 p-4">
              <div className="label text-go mb-1">Respuesta modelo</div>
              <RichAnswer text={q.modelAnswer} />
              <div className="mt-3 flex flex-wrap gap-1.5">
                {q.keywords.map((k) => <span key={k} className="pill pill-muted">{k}</span>)}
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <Button variant="danger" className="sfx-mute" onClick={() => gradeSelf(false)}>No la sabia</Button>
              <Button className="sfx-mute" onClick={() => gradeSelf(false)}>Mas o menos</Button>
              <Button variant="go" className="sfx-mute" onClick={() => gradeSelf(true)}>La sabia</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
