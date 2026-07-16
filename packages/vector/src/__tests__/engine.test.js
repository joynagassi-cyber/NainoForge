"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const engine_js_1 = require("../engine.js");
(0, vitest_1.describe)('VectorStore', () => {
    const store = new engine_js_1.VectorStore();
    const a = { id: 'a', embedding: [1, 0, 0], metadata: {} };
    const b = { id: 'b', embedding: [0, 1, 0], metadata: {} };
    const c = { id: 'c', embedding: [1, 1, 0], metadata: {} };
    (0, vitest_1.it)('upsert + search: cosine ranking', () => {
        store.upsert(a);
        store.upsert(b);
        store.upsert(c);
        const results = store.search([1, 0, 0], 2);
        (0, vitest_1.expect)(results.map((r) => r.record.id)).toEqual(['a', 'c']);
    });
    (0, vitest_1.it)('remove drops record', () => {
        store.remove('a');
        const results = store.search([1, 0, 0], 2);
        (0, vitest_1.expect)(results.map((r) => r.record.id)).not.toContain('a');
    });
    (0, vitest_1.it)('clear empties store', () => {
        store.clear();
        (0, vitest_1.expect)(store.search([1, 0, 0])).toHaveLength(0);
    });
});
//# sourceMappingURL=engine.test.js.map