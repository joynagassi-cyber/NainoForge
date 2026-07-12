// ─── Core domain interfaces ──────────────────────────────────
// Shared vocabulary used across extension, fsrs, cosmos, ai, etc.

export interface CapturedSource {
  id: string;
  source_type: 'web_article' | 'youtube' | 'pdf';
  title: string;
  url?: string;
  content_markdown: string;
  metadata: Record<string, unknown>;
  privacy_level: 'public' | 'personal' | 'enterprise';
  status: 'captured' | 'processing' | 'ready' | 'error';
  created_at: number; // unix ms
}

export interface Chapter {
  start_ms: number;
  title: string;
}

export interface TranscriptSegment {
  start_ms: number;
  end_ms: number;
  text: string;
  chapter_title?: string;
}

export type CranLevel = 1 | 2 | 3 | 4 | 5;

export type BloomLevel =
  | 'remember'
  | 'understand'
  | 'apply'
  | 'analyze'
  | 'synthesize'
  | 'evaluate';

export interface ImprintNote {
  id: string;
  source_id: string;
  concept_id: string;
  content: string;
  word_count: number;
  cran_level: CranLevel;
  quality_score: number; // 0-100 IQS
  bloom_level?: BloomLevel;
  concept_coverage_pct?: number; // 0-100
  created_at: number;
}
