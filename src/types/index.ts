// ── Tipos de dominio de EFIPER (ver spec v0.2, sección 7) ──

export type QuestionType =
  | 'multiple_choice'
  | 'true_false'
  | 'fill_blank'
  | 'short_answer'
  | 'matching';

export type Topic =
  | 'arquitectura_computadoras'
  | 'sistemas_operativos'
  | 'redes_comunicaciones'
  | 'base_de_datos'
  | 'algoritmos_estructuras'
  | 'paradigmas_lenguajes'
  | 'analisis_diseno';

export interface Question {
  id: string;
  topic: Topic;
  subtopic: string;
  type: QuestionType;
  difficulty: 1 | 2 | 3;
  statement: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  tags?: string[];
  source?: string;
  active: boolean;
}

export type OralFrequency = 'recurrente' | 'frecuente' | 'posible';

export interface OralQuestion {
  id: string;
  topic: Topic;
  subtopic: string;
  question: string;
  modelAnswer: string;
  keywords: string[];
  frequency: OralFrequency;
  difficulty: 1 | 2 | 3;
}

export type RubricKind = 'rf' | 'rnf' | 'use_cases' | 'classes' | 'der' | 'network';

export interface RubricItem {
  id: string;
  kind: RubricKind;
  label: string;
  weight: number;
}

export interface CaseStudy {
  id: string;
  title: string;
  domain: string;
  difficulty: 1 | 2 | 3;
  scenario: string;
  subCases: string[];
  expectedActors: string[];
  expectedFunctionalRequirements: string[];
  expectedNonFunctionalRequirements: string[];
  expectedUseCases: string[];
  expectedClasses: string[];
  expectedTables: string[];
  expectedNetworkElements: string[];
  oralQuestionIds: string[];
  rubric: RubricItem[];
}

export interface CaseSubmission {
  id: string;
  caseId: string;
  createdAt: number;
  actors: string;
  functionalRequirements: string;
  nonFunctionalRequirements: string;
  useCasesMermaid: string;
  classesMermaid: string;
  derMermaid: string;
  networkMermaid: string;
  oralDefense: string;
  score: number;
  feedback: string;
}

export type RefType = 'question' | 'oral';

export interface Attempt {
  id?: number;
  refId: string;
  refType: RefType;
  userAnswer: string;
  correct: boolean;
  timestamp: number;
  timeSpent: number;
  topic: Topic;
  confidence?: number;
  mode: string;
}

export type LeitnerBox = 1 | 2 | 3 | 4 | 5;
export type ReviewStatus = 'new' | 'learning' | 'review' | 'mastered';

export interface ReviewItem {
  id: string; // `${refType}:${refId}`
  refId: string;
  refType: RefType;
  topic: Topic;
  box: LeitnerBox;
  nextReviewAt: number;
  failures: number;
  successes: number;
  status: ReviewStatus;
}

export interface TopicStat {
  answered: number;
  correct: number;
}

export interface Settings {
  soundEnabled: boolean;
  volume: number; // 0..1
  noPressure: boolean; // simulador sin timer
}

export interface UserProgress {
  id: 'progress';
  examDate: string | null; // ISO date
  streak: number;
  lastStreakDay: string | null; // YYYY-MM-DD
  xp: number;
  level: number;
  topicStats: Record<string, TopicStat>;
  dailyMissionDone: boolean;
  dailyMissionDay: string | null;
  lastSessionAt: number | null;
  settings: Settings;
}

export interface BackupFile {
  app: 'EFIPER';
  version: string;
  exportedAt: number;
  progress: UserProgress | null;
  attempts: Attempt[];
  reviews: ReviewItem[];
  submissions: CaseSubmission[];
}
