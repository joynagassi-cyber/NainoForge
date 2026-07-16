"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const engine_js_1 = require("../engine.js");
(0, vitest_1.describe)('FormatDetector', () => {
    const d = new engine_js_1.FormatDetector();
    (0, vitest_1.it)('detects by extension', () => {
        (0, vitest_1.expect)(d.detectFromExtension('notes.pdf')).toBe('pdf');
        (0, vitest_1.expect)(d.detectFromExtension('readme.md')).toBe('md');
        (0, vitest_1.expect)(d.detectFromExtension('data.unknown')).toBe('unknown');
    });
    (0, vitest_1.it)('detects by mime', () => {
        (0, vitest_1.expect)(d.detectFromMime('application/pdf')).toBe('pdf');
        (0, vitest_1.expect)(d.detectFromMime('text/plain')).toBe('txt');
        (0, vitest_1.expect)(d.detectFromMime('application/zip')).toBe('unknown');
    });
});
(0, vitest_1.describe)('TextExtractor', () => {
    const ex = new engine_js_1.TextExtractor();
    (0, vitest_1.it)('extracts text from txt File', async () => {
        const file = new File(['hello world'], 'a.txt', { type: 'text/plain' });
        const result = await ex.extract(file, 'txt');
        (0, vitest_1.expect)(result.format).toBe('txt');
        (0, vitest_1.expect)(result.text).toBe('hello world');
    });
    (0, vitest_1.it)('extracts text from md File', async () => {
        const file = new File(['# Title\n\nbody'], 'a.md', { type: 'text/markdown' });
        const result = await ex.extract(file, 'md');
        (0, vitest_1.expect)(result.format).toBe('md');
        (0, vitest_1.expect)(result.text).toContain('Title');
    });
    (0, vitest_1.it)('returns explicit stub for unsupported format', async () => {
        const blob = new Blob(['x'], { type: 'application/epub+zip' });
        const result = await ex.extract(blob, 'epub');
        (0, vitest_1.expect)(result.metadata.stub).toBe(true);
    });
    (0, vitest_1.it)('pdf extraction falls back gracefully on failure', async () => {
        const bad = new Blob(['not-a-pdf'], { type: 'application/pdf' });
        const result = await ex.extract(bad, 'pdf');
        (0, vitest_1.expect)(result.format).toBe('pdf');
        (0, vitest_1.expect)(result.text).toContain('[pdf extraction failed');
    });
});
//# sourceMappingURL=engine.test.js.map