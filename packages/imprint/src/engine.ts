import type { CrankEvaluation } from './contracts.js';
import { evaluateCrank } from './contracts.js';
import type { ImprintNote, SourceLike } from '@nainoforge/core';

export class ImprintEngine {
  async generateImprint(source: SourceLike, content: string): Promise<ImprintNote> {
    const evaluation = evaluateCrank({ content, conceptCount: 1 });
    const word_count = content.split(/\s+/).filter(Boolean).length;

    return {
      id: crypto.randomUUID(),
      source_id: source.id,
      concept_id: source.id,
      content,
      word_count,
      cran_level: evaluation.cran,
      quality_score: evaluation.iqs,
      bloom_level: evaluation.bloom_level,
      concept_coverage_pct: evaluation.concept_coverage_pct,
      created_at: Date.now(),
    };
  }

  async evaluateCrank(content: string): Promise<{ level: number; wordCount: number }> {
    const evaluation = evaluateCrank({ content });
    return { level: evaluation.cran, wordCount: evaluation.word_count };
  }
}
