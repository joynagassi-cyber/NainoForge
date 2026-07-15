// ─── Student AI public API ─────────────────────────────────────
// Feature-flagged premium module — nothing leaks when disabled.

export * from './contracts.js';
export {
  RelationalStateEngine,
  TurnInterruptionEngine,
  LearnerEvidencePack,
  AssessmentEngine,
  SessionArcEngine,
  AntiCopyMoat,
} from './engine.js';
