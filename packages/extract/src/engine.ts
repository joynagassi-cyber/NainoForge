// ponytail: format detector + text extractor stubs.
// Real parsers (pdf.js, mammoth.js) are deferred to post-MVP.

import type { SupportedFormat, IFormatDetector, ExtractedText, ITextExtractor } from './contracts.js';

const EXT_MAP: Record<string, SupportedFormat> = {
  '.pdf': 'pdf',
  '.docx': 'docx',
  '.md': 'md',
  '.txt': 'txt',
  '.epub': 'epub',
};

const MIME_MAP: Record<string, SupportedFormat> = {
  'application/pdf': 'pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'text/markdown': 'md',
  'text/plain': 'txt',
  'application/epub+zip': 'epub',
};

export class FormatDetector implements IFormatDetector {
  detectFromExtension(filename: string): SupportedFormat {
    const ext = filename.slice(filename.lastIndexOf('.')).toLowerCase();
    return EXT_MAP[ext] ?? 'unknown';
  }

  detectFromMime(mime: string): SupportedFormat {
    return MIME_MAP[mime] ?? 'unknown';
  }
}

export class TextExtractor implements ITextExtractor {
  async extract(file: File | Blob, format: SupportedFormat): Promise<ExtractedText> {
    const name = 'name' in file ? file.name : 'blob';
    if (format === 'txt' || format === 'md') {
      const text = await file.text();
      return { format, title: name, text, metadata: { size: file.size } };
    }
    // ponytail: stub for non-text formats — returns empty text + format hint.
    return { format, title: name, text: `[extraction pending for ${format}]`, metadata: { size: file.size, stub: true } };
  }
}
