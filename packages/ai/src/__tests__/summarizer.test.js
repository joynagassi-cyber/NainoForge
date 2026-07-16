"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const summarizer_js_1 = require("../summarizer.js");
(0, vitest_1.describe)('summarize', () => {
    (0, vitest_1.it)('returns first 3 sentences as summary', () => {
        const text = 'Alpha is the first. Beta is the second. Gamma is the third. Delta is extra.';
        const out = (0, summarizer_js_1.summarize)({ text });
        (0, vitest_1.expect)(out.summary).toContain('Alpha');
        (0, vitest_1.expect)(out.summary).toContain('Beta');
        (0, vitest_1.expect)(out.summary).toContain('Gamma');
        (0, vitest_1.expect)(out.summary).not.toContain('Delta');
    });
    (0, vitest_1.it)('returns up to 2 key points', () => {
        const text = 'Point one here. Point two here. Third point.';
        const out = (0, summarizer_js_1.summarize)({ text });
        (0, vitest_1.expect)(out.keyPoints.length).toBeLessThanOrEqual(2);
    });
    (0, vitest_1.it)('returns summary as-is for short single-block text without punctuation', () => {
        const text = 'no punctuation here just words';
        const out = (0, summarizer_js_1.summarize)({ text, maxTokens: 10 });
        // sentences() treats the full string as one block when no splitter is present
        (0, vitest_1.expect)(out.summary).toBe(text);
    });
});
(0, vitest_1.describe)('extractConcepts', () => {
    (0, vitest_1.it)('extracts capitalized candidates', () => {
        const text = 'Jean-Michel studied Thermodynamics and Quantum Mechanics at Stanford University.';
        const out = (0, summarizer_js_1.extractConcepts)({ text });
        const names = out.concepts.map((c) => c.name);
        (0, vitest_1.expect)(names.some((n) => n.toLowerCase().includes('thermodynamics'))).toBe(true);
    });
    (0, vitest_1.it)('deduplicates case-insensitively', () => {
        const text = 'React react REACT are all the same framework.';
        const out = (0, summarizer_js_1.extractConcepts)({ text });
        const names = out.concepts.map((c) => c.name.toLowerCase());
        const reactCount = names.filter((n) => n === 'react').length;
        (0, vitest_1.expect)(reactCount).toBeLessThanOrEqual(1);
    });
    (0, vitest_1.it)('respects maxConcepts cap', () => {
        const text = Array.from({ length: 20 }, (_, i) => `Alpha${i} is a concept.`).join(' ');
        const out = (0, summarizer_js_1.extractConcepts)({ text, maxConcepts: 3 });
        (0, vitest_1.expect)(out.concepts.length).toBeLessThanOrEqual(3);
    });
});
//# sourceMappingURL=summarizer.test.js.map