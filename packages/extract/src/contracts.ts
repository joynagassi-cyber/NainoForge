// ─── Extract contracts ────────────────────────────────────────
// File format detection + plain-text extraction.

export type SupportedFormat = 'pdf' | 'docx' | 'md' | 'txt' | 'epub' | 'unknown';

export interface IFormatDetector {
  detectFromExtension(filename: string): SupportedFormat;
  detectFromMime(mime: string): SupportedFormat;
}

export interface ExtractedText {
  format: SupportedFormat;
  title: string;
  text: string;
  metadata: Record<string, unknown>;
}

export interface ITextExtractor {
  extract(file: File | Blob, format: SupportedFormat): Promise<ExtractedText>;
}
