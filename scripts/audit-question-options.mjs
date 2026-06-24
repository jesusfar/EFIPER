import ts from 'typescript';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const roots = [
  path.join('src', 'data', 'questions', 'banks'),
  path.join('src', 'data', 'questions', 'theory'),
];

const CUE_WORDS = [
  'siempre', 'nunca', 'jamas', 'jamás', 'por completo', 'exclusivamente',
  'obligatoria', 'obligatorio', 'todos', 'todas', 'ningun', 'ningún',
  'ninguna', 'imposible', 'garantiza', 'elimina', 'solo', 'únicamente', 'unicamente',
];

function getArg(name, fallback = undefined) {
  const prefix = `--${name}=`;
  const raw = process.argv.find((arg) => arg.startsWith(prefix));
  return raw ? raw.slice(prefix.length) : fallback;
}

const limit = Number(getArg('limit', '50'));
const minScore = Number(getArg('min-score', '75'));
const asJson = process.argv.includes('--json');
const failOnIssues = process.argv.includes('--fail-on-issues');

function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((entry) => {
    const full = path.join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) return walk(full);
    return full.endsWith('.ts') ? [full] : [];
  });
}

function norm(value) {
  return String(value).trim().replace(/\s+/g, ' ').toLowerCase();
}

function wordCount(value) {
  const clean = norm(value);
  return clean ? clean.split(/\s+/).length : 0;
}

function average(values) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function textOf(node) {
  if (!node) return null;
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  return null;
}

function numberOf(node) {
  if (!node) return null;
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (ts.isPrefixUnaryExpression(node) && node.operator === ts.SyntaxKind.MinusToken && ts.isNumericLiteral(node.operand)) {
    return -Number(node.operand.text);
  }
  return null;
}

function stringArrayOf(node) {
  if (!node || !ts.isArrayLiteralExpression(node)) return null;
  const values = [];
  for (const element of node.elements) {
    const value = textOf(element);
    if (value === null) return null;
    values.push(value);
  }
  return values;
}

function numberArrayOf(node) {
  if (!node || !ts.isArrayLiteralExpression(node)) return null;
  const values = [];
  for (const element of node.elements) {
    const value = numberOf(element);
    if (value === null) return null;
    values.push(value);
  }
  return values;
}

function hasCueWord(value) {
  const normalized = norm(value);
  return CUE_WORDS.some((word) => normalized.includes(word));
}

function analyze(question) {
  const correctSet = new Set(question.correctOptions.map(norm));
  const options = question.options.map((text, index) => ({
    index,
    label: String.fromCharCode(65 + index),
    text,
    normalized: norm(text),
    words: wordCount(text),
    correct: correctSet.has(norm(text)),
    cue: hasCueWord(text),
  }));
  const correct = options.filter((option) => option.correct);
  const wrong = options.filter((option) => !option.correct);
  if (!correct.length || !wrong.length) return [];

  const issues = [];
  const correctAvg = average(correct.map((option) => option.words));
  const wrongAvg = average(wrong.map((option) => option.words));
  const longest = [...options].sort((a, b) => b.words - a.words)[0];
  const shortest = [...options].sort((a, b) => a.words - b.words)[0];
  const lengthSpread = longest.words - shortest.words;

  if (question.kind === 'mc' && longest.correct && correctAvg >= wrongAvg + 3) {
    issues.push({
      kind: 'correcta_mas_larga',
      severity: 45,
      detail: `La correcta (${longest.label}) tiene ${longest.words} palabras; promedio incorrectas: ${wrongAvg.toFixed(1)}.`,
    });
  }

  if (question.kind === 'ms') {
    const longestSet = new Set([...options]
      .sort((a, b) => b.words - a.words)
      .slice(0, correct.length)
      .map((option) => option.normalized));
    if (correct.every((option) => longestSet.has(option.normalized)) && correctAvg >= wrongAvg + 2) {
      issues.push({
        kind: 'correctas_mas_largas',
        severity: 55,
        detail: `Las ${correct.length} correctas coinciden con las opciones mas largas.`,
      });
    }
  }

  if (correctAvg >= wrongAvg * 1.45 && correctAvg >= wrongAvg + 2) {
    issues.push({
      kind: 'brecha_de_longitud',
      severity: 30,
      detail: `Promedio correctas: ${correctAvg.toFixed(1)} palabras; incorrectas: ${wrongAvg.toFixed(1)}.`,
    });
  }

  if (lengthSpread >= 10) {
    issues.push({
      kind: 'opciones_desparejas',
      severity: 15,
      detail: `La opcion mas larga tiene ${longest.words} palabras y la mas corta ${shortest.words}.`,
    });
  }

  const wrongCueCount = wrong.filter((option) => option.cue).length;
  const correctCueCount = correct.filter((option) => option.cue).length;
  if (wrongCueCount > correctCueCount && wrongCueCount >= 2) {
    issues.push({
      kind: 'palabras_absolutas',
      severity: 20,
      detail: `${wrongCueCount} distractores usan palabras como siempre/nunca/todos/solo.`,
    });
  }

  return issues;
}

function parseFile(file) {
  const sourceText = readFileSync(file, 'utf8');
  const sourceFile = ts.createSourceFile(file, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const questions = [];

  function visit(node) {
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression)) {
      const name = node.expression.text;
      if (name === 'mc' || name === 'ms') {
        const args = node.arguments;
        const id = textOf(args[0]);
        const statement = textOf(args[3]);
        const options = stringArrayOf(args[4]);
        const correctArg = args[5];
        const correctIndexes = name === 'mc' ? [numberOf(correctArg)] : numberArrayOf(correctArg);

        if (id && statement && options && correctIndexes && correctIndexes.every((index) => Number.isInteger(index))) {
          const validIndexes = correctIndexes.filter((index) => index >= 0 && index < options.length);
          if (validIndexes.length === correctIndexes.length) {
            questions.push({
              id,
              file,
              line: sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1,
              kind: name,
              statement,
              options,
              correctIndexes,
              correctOptions: correctIndexes.map((index) => options[index]),
            });
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return questions;
}

const files = roots.flatMap(walk);
const questions = files.flatMap(parseFile);
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
const findings = allFindings.filter((finding) => finding.score >= minScore);

if (asJson) {
  console.log(JSON.stringify({ scanned: questions.length, flagged: allFindings.length, minScore, findings }, null, 2));
} else {
  console.log('EFIPER question option audit');
  console.log(`Scanned: ${questions.length} static MC/MS questions`);
  console.log(`Flagged: ${allFindings.length}`);
  console.log(`Shown with score >= ${minScore}: ${findings.length}`);
  console.log('');

  for (const finding of findings.slice(0, limit)) {
    const relative = path.relative(process.cwd(), finding.file);
    const correctLabels = finding.correctIndexes.map((index) => String.fromCharCode(65 + index)).join(', ');
    console.log(`${relative}:${finding.line}  ${finding.id}  score=${finding.score}  correct=${correctLabels}`);
    console.log(`  ${finding.statement}`);
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
