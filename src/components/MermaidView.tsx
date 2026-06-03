import { useEffect, useId, useState } from 'react';

// Mermaid es pesado: se importa de forma diferida (code-splitting) para no
// inflar el bundle inicial. Solo se descarga al abrir un bloque de diagrama.
let mermaidMod: typeof import('mermaid').default | null = null;
async function getMermaid() {
  if (!mermaidMod) {
    const m = await import('mermaid');
    mermaidMod = m.default;
    mermaidMod.initialize({ startOnLoad: false, theme: 'default', securityLevel: 'loose' });
  }
  return mermaidMod;
}

export function MermaidView({ code }: { code: string }) {
  const id = useId().replace(/:/g, '_');
  const [svg, setSvg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const trimmed = code.trim();
    if (!trimmed) { setSvg(''); setError(''); return; }
    void (async () => {
      try {
        const mermaid = await getMermaid();
        const { svg } = await mermaid.render(`m_${id}`, trimmed);
        if (!cancelled) { setSvg(svg); setError(''); }
      } catch (e) {
        if (!cancelled) setError(String(e instanceof Error ? e.message : e));
      }
    })();
    return () => { cancelled = true; };
  }, [code, id]);

  if (error) return <div className="text-danger text-xs font-mono p-3 border border-danger/40 rounded-lg bg-danger/5">Diagrama inválido: {error}</div>;
  if (!svg) return <div className="text-muted text-sm p-3">La vista previa del diagrama aparecerá acá.</div>;
  return <div className="mermaid-host rounded-lg bg-panel-2 p-3 border border-line" dangerouslySetInnerHTML={{ __html: svg }} />;
}
