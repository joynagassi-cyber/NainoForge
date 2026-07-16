"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const index_js_1 = require("../index.js");
const source = {
    id: 'src-1',
    source_type: 'web_article',
    title: 'Test Article',
    url: 'https://example.com/test',
    content_markdown: '# Test content',
    metadata: {},
    privacy_level: 'public',
    status: 'ready',
    created_at: Date.now(),
};
const engine = new index_js_1.ImprintEngine();
(0, vitest_1.describe)('ImprintEngine.generateImprint', () => {
    (0, vitest_1.it)('returns note with cran level derived from content', async () => {
        const content = 'This is a topic. Because it connects ideas. For example, code demonstrates it. Such as tests.';
        const note = await engine.generateImprint(source, content);
        (0, vitest_1.expect)(note.source_id).toBe('src-1');
        (0, vitest_1.expect)(note.cran_level).toBeGreaterThanOrEqual(1);
        (0, vitest_1.expect)(note.cran_level).toBeLessThanOrEqual(5);
        (0, vitest_1.expect)(note.quality_score).toBeGreaterThanOrEqual(0);
        (0, vitest_1.expect)(note.quality_score).toBeLessThanOrEqual(100);
    });
    (0, vitest_1.it)('detects bloom taxonomy signal', async () => {
        const content = 'We apply the function to solve real problems. We analyze the results.';
        const note = await engine.generateImprint(source, content);
        (0, vitest_1.expect)(note.bloom_level).toBe('analyze');
    });
    (0, vitest_1.it)('marks has_example via evaluateCrank', async () => {
        const evaluation = (0, index_js_1.evaluateCrank)({ content: 'For instance, consider the following test case.' });
        (0, vitest_1.expect)(evaluation.has_example).toBe(true);
    });
    (0, vitest_1.it)('marks has_analogy via evaluateCrank', async () => {
        const evaluation = (0, index_js_1.evaluateCrank)({ content: 'A function is like a machine that transforms input to output.' });
        (0, vitest_1.expect)(evaluation.has_analogy).toBe(true);
    });
    (0, vitest_1.it)('word_count reflects actual count', async () => {
        const content = 'one two three four five six seven eight nine ten';
        const note = await engine.generateImprint(source, content);
        (0, vitest_1.expect)(note.word_count).toBe(10);
    });
});
(0, vitest_1.describe)('ImprintEngine.evaluateCrank', () => {
    (0, vitest_1.it)('returns level and wordCount', async () => {
        const result = await engine.evaluateCrank('Analyze the data carefully and compare results.');
        (0, vitest_1.expect)(result.level).toBeGreaterThanOrEqual(1);
        (0, vitest_1.expect)(result.level).toBeLessThanOrEqual(5);
        (0, vitest_1.expect)(result.wordCount).toBeGreaterThan(0);
    });
});
//# sourceMappingURL=engine.test.js.map