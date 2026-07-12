import type { DCM } from '../../shared/src/types.js';
import type { CapturedSource, Chapter, TranscriptSegment, ImprintNote } from './domain.js';

// ─── Extractor contracts ─────────────────────────────────────

export interface IWebArticleExtractor {
  extract(doc: Document, url: string): Promise<DCM>;
  isArticlePage(doc: Document): boolean;
}

export interface IYouTubeExtractor {
  extractFromPlayerResponse(playerResponse: unknown, url: string): Promise<DCM>;
  extractTranscript(playerResponse: unknown, preferredLang?: string): Promise<{
    transcript: TranscriptSegment[];
    chapters: Chapter[];
  }>;
}

export interface IFormatDetector {
  detectFormat(file: File): Promise<'pdf' | 'docx' | 'md' | 'txt' | 'epub' | 'unknown'>;
}

// ─── Engine contracts ────────────────────────────────────────

export interface IImprintEngine {
  generateImprint(source: CapturedSource, content: string): Promise<ImprintNote>;
  evaluateCrank(content: string): Promise<{ level: number; wordCount: number }>;
}

export interface ICleaningEngine {
  clean(raw: string): string;
}

export interface IChunkingEngine {
  chunkText(
    text: string,
    options?: { minTokens?: number; maxTokens?: number; overlapTokens?: number }
  ): Chunk[];
}

// ─── Types for chunking ──────────────────────────────────────

export interface Chunk {
  id: string;
  content: string;
  token_count: number;
  section_title?: string;
}
