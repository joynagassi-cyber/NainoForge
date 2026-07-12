// ─── Shared domain types ─────────────────────────────────────
// Used by extension, core, and all downstream packages.

/** Captured source record — persisted in IndexedDB nf_sources. */
export interface CapturedSource {
  id: string;
  source_type: 'web_article' | 'youtube' | 'pdf';
  title: string;
  url?: string;
  content_markdown: string;
  metadata: Record<string, unknown>;
  privacy_level: 'public' | 'personal' | 'enterprise';
  status: SourceStatus;
  created_at: number; // unix ms
}

/** Digital Content Model — normalized output of any extractor. */
export interface DCM {
  id: string;
  title: string;
  content_markdown: string;
  source_url: string;
  source_type: 'web_article' | 'youtube' | 'pdf';
  metadata: Record<string, unknown>;
  captured_at: number; // unix timestamp ms
}

/** Pipeline status for a captured source. */
export type SourceStatus =
  | 'pending'
  | 'processing'
  | 'ready'
  | 'error';

/** FSRS review rating. */
export type ReviewRating = 'again' | 'hard' | 'good' | 'easy';
