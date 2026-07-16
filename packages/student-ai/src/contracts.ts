// ─── Student AI domain contracts ───────────────────────────────
// Feature-flagged premium module. 6 engine contracts.
// Local interfaces avoid cross-package build coupling (same pattern as imprint).

export type StudentAIFeatureFlag = {
  enabled: boolean;
  tier: 'free' | 'premium';
  quota: number; // max sessions per day
};

// Minimal source/note shapes used by Student AI engines.
export interface SourceLike {
  id: string;
  title?: string;
}

export interface NoteLike {
  id: string;
  source_id: string;
  concept_id: string;
  content: string;
  word_count: number;
  cran_level: number;
  quality_score: number;
  bloom_level?: string;
  concept_coverage_pct?: number;
  created_at: number;
}

// ─── RelationalStateEngine ─────────────────────────────────────

export interface RelationalState {
  learner_id: string;
  concept_id: string;
  mastery: number; // 0..1
  last_seen: number;
  interactions: number;
}

export interface IRelationalStateEngine {
  upsert(state: RelationalState): void;
  getMastery(learner_id: string, concept_id: string): number;
  decayAll(now: number, halfLifeDays: number): void;
}

// ─── TurnInterruptionEngine ─────────────────────────────────────

export type InterruptSignal = 'probe' | 'remind' | 'challenge' | 'encourage';

export interface InterruptEvent {
  signal: InterruptSignal;
  reason: string;
  data?: Record<string, unknown>;
}

export interface ITurnInterruptionEngine {
  evaluate(turnIndex: number, lastResponse: string): InterruptEvent | null;
}

// ─── LearnerEvidencePack ───────────────────────────────────────

export interface EvidenceItem {
  source_id: string;
  concept_id: string;
  snippet: string;
  relevance: number;
}

export interface ILearnerEvidencePack {
  collect(source: SourceLike, note: NoteLike): EvidenceItem[];
  summary(items: EvidenceItem[]): string;
}

// ─── 5+ Assessment formats ─────────────────────────────────────

export type AssessmentFormat =
  | 'dialogue'
  | 'multiple_choice'
  | 'fill_blank'
  | 'true_false'
  | 'short_answer';

export interface AssessmentItem {
  id: string;
  format: AssessmentFormat;
  concept_id: string;
  prompt: string;
  options?: string[];
  answer: string;
  difficulty: number;
}

export interface IAssessmentEngine {
  generate(note: NoteLike, format: AssessmentFormat): AssessmentItem;
  grade(item: AssessmentItem, response: string): { score: number; feedback: string };
}

// ─── SessionArcEngine ──────────────────────────────────────────

export interface SessionArc {
  session_id: string;
  learner_id: string;
  phases: SessionPhase[];
  started_at: number;
  completed_at?: number;
}

export interface SessionPhase {
  phase: 'warmup' | 'teach' | 'probe' | 'wrapup';
  duration_ms: number;
  completed: boolean;
}

export interface ISessionArcEngine {
  start(learner_id: string): SessionArc;
  advance(arc: SessionArc, phase: SessionPhase['phase']): SessionArc;
  complete(arc: SessionArc): SessionArc;
}

// ─── Anti-copy moat ────────────────────────────────────────────

export interface LearnerTrace {
  session_id: string;
  hintsRequested: number;
  avgResponseTimeMs: number;
  copyPasteDetected: boolean;
  fg_fluency_score: number;
}

export interface IAntiCopyMoat {
  record(trace: LearnerTrace): void;
  evaluate(trace: LearnerTrace): { suspicious: boolean; score: number };
}
