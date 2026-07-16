"use strict";
// ponytail: optional pgvector backend for @nainoforge/vector.
// Requires Supabase Postgres + pgvector extension.
// Falls back to in-memory when no client is configured.
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgVectorStore = void 0;
class PgVectorStore {
    opts;
    constructor(opts = {}) {
        this.opts = opts;
    }
    async upsert(record) {
        if (!this.opts.client || !this.opts.userId)
            return;
        await this.opts.client.rpc('upsert_embedding', {
            p_user_id: this.opts.userId,
            p_id: record.id,
            p_embedding: record.embedding,
            p_metadata: record.metadata,
        });
    }
    async search(query, topK = 5) {
        if (!this.opts.client || !this.opts.userId)
            return [];
        const { data, error } = await this.opts.client.rpc('search_embeddings', {
            p_user_id: this.opts.userId,
            p_query: query,
            p_limit: topK,
        });
        if (error || !data)
            return [];
        return data.map((row) => ({
            record: { id: row.id, embedding: row.embedding, metadata: row.metadata ?? {} },
            score: Number(row.score ?? 0),
        }));
    }
}
exports.PgVectorStore = PgVectorStore;
//# sourceMappingURL=pgvector.js.map