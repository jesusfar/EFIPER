import { readFileSync } from 'node:fs';
import path from 'node:path';

const files = [
  path.join('src', 'data', 'oral', 'efip-700.json'),
  path.join('src', 'data', 'oral', 'efip-banco-130.json'),
];

function getArg(name, fallback = undefined) {
  const prefix = `--${name}=`;
  const raw = process.argv.find((arg) => arg.startsWith(prefix));
  return raw ? raw.slice(prefix.length) : fallback;
}

const limit = Number(getArg('limit', '50'));
const minScore = Number(getArg('min-score', '35'));
const asJson = process.argv.includes('--json');
const failOnIssues = process.argv.includes('--fail-on-issues');

const sectionTitle = /\b\d+\.\d+\s+\p{Lu}[^\n\r]*$/u;
const sectionLine = /(?:^|\n)\s*\d+\.\d+\s+\p{Lu}[^\n\r]*\s*$/u;
const practicalPrompt = /^\s*¿?\s*(dise(?:n|ñ)(?:a|á|ar)|dibuj(?:a|á|ar)|traz(?:a|á|ar)|cre(?:a|á|ar)|elabor(?:a|á|ar)|extend(?:e|é|er)|escrib(?:e|i|í|ir)|modela|program(?:a|á|ar)|implement(?:a|á|ar)|codific(?:a|á|ar))(?=\s|$|[.:;¿?])|\b(pseudoc[oó]digo|c[oó]digo\s+(jdbc|java|pl\/sql|sql))\b/i;
const theoreticalDiagram = /\b(diagrama|uml|casos de uso|clases|secuencia|despliegue|actividad|estados?)\b/i;
const isolatedBullet = /(?:^|\n)\s*•\s*(?=\n|$)/;
const smashedTable = /(SubredDirecci[oó]n|AspectoClase|Direcci[oó]n de redRango|Broadcast\s*\n\s*\d|Instanciaci[oó]nNo|CIDRHosts)/i;
const commonLowerStarters = /^(el|la|los|las|un|una|unos|unas|es|son|se|porque|cuando|para|en|si|no|al|del|con|por|hay|usar|utilizar|sirve|permite)\b/i;

function norm(value) {
  return String(value ?? '').trim().replace(/\s+/g, ' ');
}

function wordCount(value) {
  const clean = norm(value);
  return clean ? clean.split(/\s+/).length : 0;
}

function countMatches(value, pattern) {
  return [...String(value ?? '').matchAll(pattern)].length;
}

function lineForId(source, id) {
  const needle = `"id": "${id}"`;
  const index = source.indexOf(needle);
  if (index < 0) return 1;
  return source.slice(0, index).split(/\r?\n/).length;
}

function analyze(question) {
  const issues = [];
  const questionText = String(question.question ?? '');
  const answerText = String(question.modelAnswer ?? '');
  const answerWords = wordCount(answerText);
  const codeFenceCount = countMatches(answerText, /```/g);

  if (sectionTitle.test(questionText.trim())) {
    issues.push({
      kind: 'section_in_question',
      severity: 55,
      detail: 'El enunciado parece terminar con un titulo de temario pegado.',
    });
  }

  if (sectionLine.test(answerText.trim())) {
    issues.push({
      kind: 'section_in_answer',
      severity: 55,
      detail: 'La respuesta modelo parece terminar con un titulo de temario pegado.',
    });
  }

  if (practicalPrompt.test(questionText)) {
    const extra = theoreticalDiagram.test(questionText)
      ? ' Conviene reformularla como explicacion teorica de elementos, decisiones y relaciones.'
      : ' Conviene reformularla como explicacion teorica, sin pedir codigo ni pseudocodigo.';
    issues.push({
      kind: 'practical_prompt',
      severity: 65,
      detail: `La pregunta pide diagramar, programar o escribir una solucion.${extra}`,
    });
  }

  if (isolatedBullet.test(answerText)) {
    issues.push({
      kind: 'bullet_artifacts',
      severity: 20,
      detail: 'Hay bullets aislados o artefactos de copiado.',
    });
  }

  if (smashedTable.test(answerText)) {
    issues.push({
      kind: 'smashed_table',
      severity: 40,
      detail: 'La respuesta parece contener una tabla aplastada.',
    });
  }

  const start = answerText.trim();
  if (/^[a-záéíóúñ]/i.test(start) && /^[a-záéíóúñ]/.test(start) && !commonLowerStarters.test(start)) {
    issues.push({
      kind: 'maybe_truncated_start',
      severity: 25,
      detail: 'La respuesta arranca a mitad de frase o con minuscula sospechosa.',
    });
  }

  if (answerWords > 220) {
    issues.push({
      kind: 'long_answer',
      severity: answerWords > 320 ? 25 : 15,
      detail: `Respuesta extensa para oral: ${answerWords} palabras.`,
    });
  }

  if (codeFenceCount >= 2 || (codeFenceCount > 0 && answerWords > 170)) {
    issues.push({
      kind: 'code_heavy',
      severity: codeFenceCount >= 2 ? 30 : 15,
      detail: `Contiene ${codeFenceCount} bloque(s) de codigo; revisar si sigue siendo oral.`,
    });
  }

  return issues;
}

const questions = files.flatMap((file) => {
  const source = readFileSync(file, 'utf8');
  const parsed = JSON.parse(source);
  return parsed.map((question) => ({
    ...question,
    file,
    line: lineForId(source, question.id),
  }));
});

const allFindings = questions
  .map((question) => {
    const issues = analyze(question);
    return {
      ...question,
      issues,
      score: issues.reduce((sum, issue) => sum + issue.severity, 0),
    };
  })
  .filter((finding) => finding.score > 0)
  .sort((a, b) => b.score - a.score || a.file.localeCompare(b.file) || a.line - b.line);

const counts = {};
for (const finding of allFindings) {
  for (const issue of finding.issues) {
    counts[issue.kind] = (counts[issue.kind] ?? 0) + 1;
  }
}

const findings = allFindings.filter((finding) => finding.score >= minScore);

if (asJson) {
  console.log(JSON.stringify({ scanned: questions.length, flagged: allFindings.length, counts, minScore, findings }, null, 2));
} else {
  console.log('EFIPER oral content audit');
  console.log(`Scanned: ${questions.length} oral questions`);
  console.log(`Flagged: ${allFindings.length}`);
  console.log(`Shown with score >= ${minScore}: ${findings.length}`);
  console.log(`Counts: ${Object.entries(counts).map(([key, value]) => `${key}=${value}`).join(', ') || 'none'}`);
  console.log('');

  for (const finding of findings.slice(0, limit)) {
    const relative = path.relative(process.cwd(), finding.file);
    console.log(`${relative}:${finding.line}  ${finding.id}  score=${finding.score}`);
    console.log(`  ${norm(finding.question)}`);
    for (const issue of finding.issues) {
      console.log(`  - ${issue.kind}: ${issue.detail}`);
    }
    console.log('');
  }

  if (findings.length > limit) {
    console.log(`Showing ${limit} of ${findings.length}. Use --limit=${findings.length}, --min-score=1, or --json for the full report.`);
  }
}

if (failOnIssues && findings.length > 0) {
  process.exitCode = 1;
}
