import { MermaidView } from '../../components/MermaidView';

export const DIFFICULTY_LABELS = { 1: 'Basico', 2: 'Medio', 3: 'Avanzado' } as const;

export function shuffled<T>(items: T[], seed: number): T[] {
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

export function RichAnswer({ text }: { text: string }) {
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
