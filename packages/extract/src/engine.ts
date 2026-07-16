// ponytail: text extraction for common formats.
// Uses pdfjs-dist for PDF and mammoth for DOCX.
// Falls back to stub behavior for unsupported formats.

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

    if (format === 'pdf') {
      return await this.#extractPdf(file, name);
    }

    if (format === 'docx') {
      return await this.#extractDocx(file, name);
    }

    // ponytail: unsupported format — explicit stub with metadata.
    return { format, title: name, text: `[extraction pending for ${format}]`, metadata: { size: file.size, stub: true } };
  }

  async #extractPdf(file: File | Blob, title: string): Promise<ExtractedText> {
    try {
      const [{ getDocument, GlobalWorkerOptions }, ...pdfjs] = await Promise.all([
        import('pdfjs-dist'),
      ]);

      // pdfjs-dist 4.x requires the worker for text extraction.
      // Best-effort worker init: skip if .wasm asset layout differs by install.
      try {
        const workerPath = 'pdfjs-dist/build/pdf.worker.mjs';
        GlobalWorkerOptions.workerSrc = workerPath;
      } catch {
        // ignore worker setup issues; some environments just need `getDocument`.
      }

      const buffer = file instanceof File ? await file.arrayBuffer() : await file.arrayBuffer();
      const task = getDocument({ data: buffer.slice(0) });
      const pdf = await task.promise;

      const pages = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map((item) => ('str' in item ? item.str : '')).join(' ');
        pages.push(pageText);
      }

      await pdf.destroy();
      const text = pages.join('\n\n').trim();
      return { format: 'pdf', title, text: text || `[no text extracted from ${title}]`, metadata: { size: file.size, pages: pdf.numPages } };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return { format: 'pdf', title, text: `[pdf extraction failed: ${message}]`, metadata: { size: file.size, stub: true, error: message } };
    }
  }

  async #extractDocx(file: File | Blob, title: string): Promise<ExtractedText> {
    try {
      const mammoth = await import('mammoth');
      const buffer = file instanceof File ? await file.arrayBuffer() : await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer: buffer });
      return { format: 'docx', title, text: result.value, metadata: { size: file.size } };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return { format: 'docx', title, text: `[docx extraction failed: ${message}]`, metadata: { size: file.size, stub: true, error: message } };
    }
  }
}
