// ─── Storage package — unified IndexedDB repositories ─────────

export { openDB, DB_NAME } from './db.js';
export { SourceRepository } from './source-repository.js';
export { ImprintRepository } from './imprint-repository.js';
export { ConceptRepository } from './concept-repository.js';

// Re-export types for convenience
export type { CapturedSource, ImprintNote } from '@nainoforge/core';
export type { Concept } from '@nainoforge/cosmos';
