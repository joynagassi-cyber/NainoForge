"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const engine_js_1 = require("../engine.js");
const SOURCE = {
    id: 'src-1',
    title: 'Test',
    content_markdown: '# Test',
    source_type: 'web_article',
};
const NOTE = {
    id: 'note-1',
    source_id: 'src-1',
    concept_id: 'c-1',
    content: 'contenu de la note',
    cran_level: 3,
    quality_score: 70,
};
(0, vitest_1.describe)('BundleExporter', () => {
    const exporter = new engine_js_1.BundleExporter();
    (0, vitest_1.it)('build returns bundle with exported_at', () => {
        const bundle = exporter.build([SOURCE], [NOTE]);
        (0, vitest_1.expect)(bundle.sources).toHaveLength(1);
        (0, vitest_1.expect)(bundle.notes).toHaveLength(1);
        (0, vitest_1.expect)(bundle.exported_at).toBeGreaterThan(0);
    });
    (0, vitest_1.it)('render produces valid JSON for json format', () => {
        const bundle = exporter.build([SOURCE], [NOTE]);
        bundle.format = 'json';
        const out = exporter.render(bundle);
        (0, vitest_1.expect)(() => JSON.parse(out)).not.toThrow();
    });
    (0, vitest_1.it)('render markdown starts with heading', () => {
        const bundle = exporter.build([SOURCE], [NOTE]);
        bundle.format = 'markdown';
        const out = exporter.render(bundle);
        (0, vitest_1.expect)(out.startsWith('# NainoForge Export')).toBe(true);
    });
    (0, vitest_1.it)('render anki returns TSV-like card format', () => {
        const bundle = exporter.build([SOURCE], [NOTE]);
        bundle.format = 'anki';
        const out = exporter.render(bundle);
        (0, vitest_1.expect)(out).toContain('Front\tBack\tTags');
        (0, vitest_1.expect)(out).toContain('nainoforge');
    });
    (0, vitest_1.it)('render pdf returns structured JSON placeholder', () => {
        const bundle = exporter.build([SOURCE], [NOTE]);
        bundle.format = 'pdf';
        const out = exporter.render(bundle);
        (0, vitest_1.expect)(() => JSON.parse(out)).not.toThrow();
        (0, vitest_1.expect)(JSON.parse(out).format).toBe('pdf');
    });
});
//# sourceMappingURL=engine.test.js.map