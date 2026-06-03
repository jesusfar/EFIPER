import type { RubricKind } from '../../types';

// ── Corrección por reglas (sin IA). Ver spec v0.2, sección 9. ──
// Cada función recibe el texto del estudiante y devuelve checks cumplidos.

export interface CheckResult {
  label: string;
  passed: boolean;
  hint?: string;
}

export interface RubricReport {
  kind: RubricKind;
  checks: CheckResult[];
  score: number; // 0..100
}

function pct(checks: CheckResult[]): number {
  if (!checks.length) return 0;
  const ok = checks.filter((c) => c.passed).length;
  return Math.round((ok / checks.length) * 100);
}

const lines = (t: string) =>
  t.split('\n').map((l) => l.trim()).filter(Boolean);

// Requerimientos funcionales
export function checkRF(text: string): RubricReport {
  const ls = lines(text);
  const startsWell = ls.filter((l) => /^el sistema debe (permitir|registrar|generar|calcular|mostrar)/i.test(l));
  const hasTech = ls.some((l) => /(react|java|mysql|servidor|api|rápid|segur|2 ?segundos)/i.test(l));
  const checks: CheckResult[] = [
    { label: 'Al menos 3 requerimientos', passed: ls.length >= 3, hint: 'El examen pide mínimo 3; cuantos más, mejor.' },
    { label: 'Redactados como acción del sistema ("El sistema debe permitir…")', passed: startsWell.length >= Math.max(1, Math.floor(ls.length * 0.6)) },
    { label: 'Incluyen un objeto del dominio (verificables)', passed: ls.some((l) => l.split(' ').length >= 6) },
    { label: 'No describen tecnología, rendimiento ni seguridad (eso es RNF)', passed: !hasTech, hint: 'Mover métricas/tecnología a los RNF.' },
  ];
  return { kind: 'rf', checks, score: pct(checks) };
}

// Requerimientos no funcionales
export function checkRNF(text: string): RubricReport {
  const ls = lines(text);
  const hasMetric = ls.filter((l) => /(\d+\s?(s|seg|segundos|ms|%|registros|usuarios|horas))|disponib|escalab|usab|portab|manten|segur/i.test(l));
  const checks: CheckResult[] = [
    { label: 'Al menos 3 requerimientos no funcionales', passed: ls.length >= 3 },
    { label: 'Describen calidad / restricción / condición técnica', passed: hasMetric.length >= 1 },
    { label: 'Tienen métrica verificable (ej. "< 2 s con 10.000 registros")', passed: ls.some((l) => /\d/.test(l)), hint: 'Agregá números medibles.' },
    { label: 'No son acciones funcionales del usuario', passed: !ls.some((l) => /^el sistema debe permitir/i.test(l)) },
  ];
  return { kind: 'rnf', checks, score: pct(checks) };
}

// Diagrama de casos de uso (texto Mermaid o lista)
export function checkUseCases(text: string): RubricReport {
  const t = text.toLowerCase();
  const checks: CheckResult[] = [
    { label: 'Hay actores definidos', passed: /actor|usuario|cliente|administrador|empleado/.test(t) },
    { label: 'Casos de uso en infinitivo (registrar, consultar…)', passed: /(registrar|consultar|gestionar|generar|emitir|listar|modificar|eliminar)/.test(t) },
    { label: 'Usa include (comportamiento obligatorio)', passed: /include/.test(t), hint: 'include = se ejecuta siempre.' },
    { label: 'Usa extend (comportamiento opcional)', passed: /extend/.test(t), hint: 'extend = opcional/condicional.' },
  ];
  return { kind: 'use_cases', checks, score: pct(checks) };
}

// Diagrama de clases (convención del examen)
export function checkClasses(text: string): RubricReport {
  const checks: CheckResult[] = [
    { label: 'Nombres de CLASE en mayúsculas', passed: /\b[A-ZÁÉÍÓÚÑ]{3,}\b/.test(text) },
    { label: 'Atributos/métodos con + y camelCase', passed: /\+\s?[a-z][a-zA-Z]+/.test(text) },
    { label: 'Métodos terminan en ()', passed: /\)\s*$/m.test(text) || /\(\)/.test(text), hint: 'Ej: +agregarSocio()' },
    { label: 'Hay relaciones entre clases', passed: /(--|<\|--|\*--|o--|-->)/.test(text) || /relacion|asociaci/i.test(text) },
  ];
  return { kind: 'classes', checks, score: pct(checks) };
}

// DER
export function checkDER(text: string): RubricReport {
  const t = text.toLowerCase();
  const checks: CheckResult[] = [
    { label: 'Entidades definidas', passed: /entidad|tabla|table/.test(t) || /\b[A-Z][a-z]+\b/.test(text) },
    { label: 'Clave primaria (PK)', passed: /pk|clave primaria|primary key/.test(t) },
    { label: 'Clave foránea (FK)', passed: /fk|clave for|foreign key/.test(t) },
    { label: 'Cardinalidades / relaciones N:M resueltas', passed: /1:n|n:m|1:1|cardinal|\|\||\}o|\}\|/.test(t) },
  ];
  return { kind: 'der', checks, score: pct(checks) };
}

// Diagrama de red (alto peso). Ver spec v0.2, sección 9.6.
export function checkNetwork(text: string): RubricReport {
  const t = text.toLowerCase();
  const checks: CheckResult[] = [
    { label: 'Internet como red externa', passed: /internet/.test(t) },
    { label: 'Firewall entre Internet y la red interna', passed: /firewall|cortafuego/.test(t) },
    { label: 'Router etiquetado Capa 3', passed: /router/.test(t) && /capa 3|layer 3|nivel 3/.test(t), hint: 'El router opera en capa 3 (red).' },
    { label: 'Switch etiquetado Capa 2', passed: /switch/.test(t) && /capa 2|layer 2|nivel 2/.test(t), hint: 'El switch opera en capa 2 (enlace).' },
    { label: 'Servidores (app/web y base de datos)', passed: /servidor/.test(t) },
    { label: 'IPs privadas con máscara (ej. 192.168.1.0/24)', passed: /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(\/\d{1,2})?/.test(t) },
    { label: 'Justificación de seguridad', passed: /segur|proteg|filtr|dmz/.test(t) },
  ];
  return { kind: 'network', checks, score: pct(checks) };
}

export const RUBRIC_FNS: Record<RubricKind, (text: string) => RubricReport> = {
  rf: checkRF,
  rnf: checkRNF,
  use_cases: checkUseCases,
  classes: checkClasses,
  der: checkDER,
  network: checkNetwork,
};
