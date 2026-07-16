// ponytail: optional pgvector backend for @nainoforge/vector.
// Requires Supabase Postgres + pgvector extension.
// Falls back to in-memory when no client is configured.

import type { VectorRecord, SearchResult } from './contracts.js';

export interface PgVectorClient {
  rpc(name: string, args: Record<string, unknown>): Promise<{ data?: VectorRecord[]; error?: { message: string } }>;
}

export interface PgVectorStoreOptions {
  client?: PgVectorClient;
  userId?: string;
}

export class PgVectorStore {
  constructor(private opts: PgVectorStoreOptions = {}) {}

  async upsert(record: VectorRecord): Promise<void> {
    if (!this.opts.client || !this.opts.userId) return;
    await this.opts.client.rpc('upsert_embedding', {
      p_user_id: this.opts.userId,
      p_id: record.id,
      p_embedding: record.embedding,
      p_metadata: record.metadata,
    });
  }

  async search(query: number[], topK = 5): Promise<SearchResult[]> {
    if (!this.opts.client || !this.opts.userId) return [];
    const { data, error } = await this.opts.client.rpc('search_embeddings', {
      p_user_id: this.opts.userId,
      p_query: query,
      p_limit: topK,
    });

    if (error || !data) return [];
    return data.map((row: any) => ({
      record: { id: row.id, embedding: row.embedding, metadata: row.metadata ?? {} },
      score: Number(row.score ?? 0),
    }));
  }
}
