import type { RubricKind } from '../../types';

// Correccion por reglas locales. Cada funcion recibe la respuesta del estudiante
// y devuelve checks cumplidos sin usar IA.

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

const hasConnector = (text: string) => /(-->|---|--|<\|--|\*--|o--|\|\||\}o|\}\||\|o|-\.)/.test(text);

function emptyDiagram(kind: RubricKind, checks: CheckResult[]): RubricReport {
  return { kind, checks: checks.map((check) => ({ ...check, passed: false })), score: 0 };
}

// Requerimientos funcionales
export function checkRF(text: string): RubricReport {
  const ls = lines(text);
  const startsWell = ls.filter((l) => /^el sistema debe (permitir|registrar|generar|calcular|mostrar)/i.test(l));
  const hasTech = ls.some((l) => /(react|java|mysql|servidor|api|rapid|segur|2 ?segundos)/i.test(l));
  const checks: CheckResult[] = [
    { label: 'Al menos 3 requerimientos', passed: ls.length >= 3, hint: 'El examen pide minimo 3; cuantos mas, mejor.' },
    { label: 'Redactados como accion del sistema ("El sistema debe permitir...")', passed: startsWell.length >= Math.max(1, Math.floor(ls.length * 0.6)) },
    { label: 'Incluyen un objeto del dominio verificable', passed: ls.some((l) => l.split(' ').length >= 6) },
    { label: 'No describen tecnologia, rendimiento ni seguridad', passed: !hasTech, hint: 'Mover metricas/tecnologia a los RNF.' },
  ];
  return { kind: 'rf', checks, score: pct(checks) };
}

// Requerimientos no funcionales
export function checkRNF(text: string): RubricReport {
  const ls = lines(text);
  const hasMetric = ls.filter((l) => /(\d+\s?(s|seg|segundos|ms|%|registros|usuarios|horas))|disponib|escalab|usab|portab|manten|segur/i.test(l));
  const checks: CheckResult[] = [
    { label: 'Al menos 3 requerimientos no funcionales', passed: ls.length >= 3 },
    { label: 'Describen calidad, restriccion o condicion tecnica', passed: hasMetric.length >= 1 },
    { label: 'Tienen metrica verificable', passed: ls.some((l) => /\d/.test(l)), hint: 'Agrega numeros medibles.' },
    { label: 'No son acciones funcionales del usuario', passed: !ls.some((l) => /^el sistema debe permitir/i.test(l)) },
  ];
  return { kind: 'rnf', checks, score: pct(checks) };
}

// Diagrama de casos de uso
export function checkUseCases(text: string): RubricReport {
  const t = text.toLowerCase();
  const checks: CheckResult[] = [
    { label: 'Diagrama con actores, casos y conexiones', passed: hasConnector(text), hint: 'No alcanza con nombres sueltos: conecta actores con casos de uso.' },
    { label: 'Hay actores definidos', passed: /actor|usuario|cliente|administrador|empleado/.test(t) },
    { label: 'Casos de uso en infinitivo', passed: /(registrar|consultar|gestionar|generar|emitir|listar|modificar|eliminar)/.test(t) },
    { label: 'Usa include (comportamiento obligatorio)', passed: /include/.test(t), hint: 'include = se ejecuta siempre.' },
    { label: 'Usa extend (comportamiento opcional)', passed: /extend/.test(t), hint: 'extend = opcional/condicional.' },
  ];
  if (!hasConnector(text) || lines(text).join(' ').length < 20) return emptyDiagram('use_cases', checks);
  return { kind: 'use_cases', checks, score: pct(checks) };
}

// Diagrama de clases
export function checkClasses(text: string): RubricReport {
  const classNames = text.match(/\b[A-Z]{3,}\b/g) ?? [];
  const checks: CheckResult[] = [
    { label: 'Diagrama con al menos 2 clases relacionadas', passed: classNames.length >= 2 && hasConnector(text), hint: 'Agrega clases y relaciones entre ellas.' },
    { label: 'Nombres de CLASE en mayusculas', passed: classNames.length >= 2 },
    { label: 'Atributos/metodos con + y camelCase', passed: /\+\s?[a-z][a-zA-Z]+/.test(text) },
    { label: 'Metodos terminan en ()', passed: /\)\s*$/m.test(text) || /\(\)/.test(text), hint: 'Ej: +agregarSocio()' },
    { label: 'Hay relaciones entre clases', passed: /(--|<\|--|\*--|o--|-->)/.test(text) || /relacion|asociaci/i.test(text) },
  ];
  if (classNames.length < 2 || !hasConnector(text)) return emptyDiagram('classes', checks);
  return { kind: 'classes', checks, score: pct(checks) };
}

// DER / modelo de datos
export function checkDER(text: string): RubricReport {
  const t = text.toLowerCase();
  const entityNames = text.match(/\b[A-Z][A-Z0-9_]{2,}\b/g) ?? [];
  const checks: CheckResult[] = [
    { label: 'Modelo con entidades relacionadas', passed: entityNames.length >= 2 && hasConnector(text), hint: 'No alcanza con entidades aisladas: indica relaciones/cardinalidades.' },
    { label: 'Entidades definidas', passed: /entidad|tabla|table/.test(t) || entityNames.length >= 2 || /\b[A-Z][a-z]+\b/.test(text) },
    { label: 'Clave primaria (PK)', passed: /pk|clave primaria|primary key/.test(t) },
    { label: 'Clave foranea (FK)', passed: /fk|clave for|foreign key/.test(t) },
    { label: 'Cardinalidades / relaciones N:M resueltas', passed: /1:n|n:m|1:1|cardinal|\|\||\}o|\}\|/.test(t) },
  ];
  if (entityNames.length < 2 || !hasConnector(text)) return emptyDiagram('der', checks);
  return { kind: 'der', checks, score: pct(checks) };
}

// Diagrama de red
export function checkNetwork(text: string): RubricReport {
  const t = text.toLowerCase();
  const elementHits = ['internet', 'firewall', 'router', 'switch', 'servidor', 'pc'].filter((term) => t.includes(term)).length;
  const checks: CheckResult[] = [
    { label: 'Topologia conectada, no elementos sueltos', passed: elementHits >= 3 && hasConnector(text), hint: 'Conecta Internet, firewall, router/switch y servidores.' },
    { label: 'Internet como red externa', passed: /internet/.test(t) },
    { label: 'Firewall entre Internet y la red interna', passed: /firewall|cortafuego/.test(t) },
    { label: 'Router etiquetado Capa 3', passed: /router/.test(t) && /capa 3|layer 3|nivel 3/.test(t), hint: 'El router opera en capa 3 (red).' },
    { label: 'Switch etiquetado Capa 2', passed: /switch/.test(t) && /capa 2|layer 2|nivel 2/.test(t), hint: 'El switch opera en capa 2 (enlace).' },
    { label: 'Servidores (app/web y base de datos)', passed: /servidor/.test(t) },
    { label: 'IPs privadas con mascara', passed: /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(\/\d{1,2})?/.test(t) },
    { label: 'Justificacion de seguridad', passed: /segur|proteg|filtr|dmz/.test(t) },
  ];
  if (elementHits < 3 || !hasConnector(text)) return emptyDiagram('network', checks);
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
