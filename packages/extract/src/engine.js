"use strict";
// ponytail: text extraction for common formats.
// Uses pdfjs-dist for PDF and mammoth for DOCX.
// Falls back to stub behavior for unsupported formats.
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextExtractor = exports.FormatDetector = void 0;
const EXT_MAP = {
    '.pdf': 'pdf',
    '.docx': 'docx',
    '.md': 'md',
    '.txt': 'txt',
    '.epub': 'epub',
};
const MIME_MAP = {
    'application/pdf': 'pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'text/markdown': 'md',
    'text/plain': 'txt',
    'application/epub+zip': 'epub',
};
class FormatDetector {
    detectFromExtension(filename) {
        const ext = filename.slice(filename.lastIndexOf('.')).toLowerCase();
        return EXT_MAP[ext] ?? 'unknown';
    }
    detectFromMime(mime) {
        return MIME_MAP[mime] ?? 'unknown';
    }
}
exports.FormatDetector = FormatDetector;
class TextExtractor {
    async extract(file, format) {
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
    async #extractPdf(file, title) {
        try {
            const [{ getDocument, GlobalWorkerOptions }, ...pdfjs] = await Promise.all([
                import('pdfjs-dist'),
            ]);
            // pdfjs-dist 4.x requires the worker for text extraction.
            // Best-effort worker init: skip if .wasm asset layout differs by install.
            try {
                const workerPath = 'pdfjs-dist/build/pdf.worker.mjs';
                GlobalWorkerOptions.workerSrc = workerPath;
            }
            catch {
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
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            return { format: 'pdf', title, text: `[pdf extraction failed: ${message}]`, metadata: { size: file.size, stub: true, error: message } };
        }
    }
    async #extractDocx(file, title) {
        try {
            const mammoth = await import('mammoth');
            const buffer = file instanceof File ? await file.arrayBuffer() : await file.arrayBuffer();
            const result = await mammoth.extractRawText({ arrayBuffer: buffer });
            return { format: 'docx', title, text: result.value, metadata: { size: file.size } };
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            return { format: 'docx', title, text: `[docx extraction failed: ${message}]`, metadata: { size: file.size, stub: true, error: message } };
        }
    }
}
exports.TextExtractor = TextExtractor;
//# sourceMappingURL=engine.js.map