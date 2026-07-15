import type { CrankEvaluation } from './contracts.js';
import { evaluateCrank } from './contracts.js';

// ponytail: minimal SourceLike — avoids cross-package import at build time.
// Matches CapturedSource fields used by generateImprint.
interface SourceLike {
  id: string;
  title?: string;
}

export interface ImprintNote {
  id: string;
  source_id: string;
  concept_id: string;
  content: string;
  word_count: number;
  cran_level: number; // 1-5
  quality_score: number; // 0-100
  bloom_level?: string;
  concept_coverage_pct?: number;
  created_at: number;
}

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
