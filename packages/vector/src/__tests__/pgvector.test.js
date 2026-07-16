"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const pgvector_js_1 = require("../pgvector.js");
function mockClient(data = []) {
    return {
        rpc: async (_name, args) => {
            if (_name === 'search_embeddings') {
                return { data: data.map((row) => ({ ...row, score: 0.99 })), error: null };
            }
            return { data: null, error: null };
        },
    };
}
(0, vitest_1.describe)('PgVectorStore', () => {
    (0, vitest_1.it)('upsert delegates to client rpc', async () => {
        const client = mockClient();
        const store = new pgvector_js_1.PgVectorStore({ client: client, userId: 'u-1' });
        const record = { id: 'v-1', embedding: [1, 0, 0], metadata: {} };
        await store.upsert(record);
    });
    (0, vitest_1.it)('search returns scored results', async () => {
        const data = [{ id: 'v-1', embedding: [1, 0, 0], metadata: {} }];
        const client = mockClient(data);
        const store = new pgvector_js_1.PgVectorStore({ client: client, userId: 'u-1' });
        const results = await store.search([1, 0, 0], 1);
        (0, vitest_1.expect)(results).toHaveLength(1);
        (0, vitest_1.expect)(results[0].record.id).toBe('v-1');
    });
    (0, vitest_1.it)('returns empty when no client configured', async () => {
        const store = new pgvector_js_1.PgVectorStore({});
        const results = await store.search([1, 0, 0], 1);
        (0, vitest_1.expect)(results).toEqual([]);
    });
});
//# sourceMappingURL=pgvector.test.js.map