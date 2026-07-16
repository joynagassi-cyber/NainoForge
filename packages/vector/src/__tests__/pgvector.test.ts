import { describe, it, expect } from 'vitest';
import { PgVectorStore } from '../pgvector.js';
import type { VectorRecord } from '../contracts.js';

function mockClient(data: { id: string; embedding: number[]; metadata?: Record<string, unknown> }[] = []) {
  return {
    rpc: async (_name: string, args: Record<string, unknown>) => {
      if (_name === 'search_embeddings') {
        return { data: data.map((row) => ({ ...row, score: 0.99 })), error: null };
      }
      return { data: null, error: null };
    },
  };
}

describe('PgVectorStore', () => {
  it('upsert delegates to client rpc', async () => {
    const client = mockClient();
    const store = new PgVectorStore({ client: client as any, userId: 'u-1' });

    const record: VectorRecord = { id: 'v-1', embedding: [1, 0, 0], metadata: {} };
    await store.upsert(record);
  });

  it('search returns scored results', async () => {
    const data = [{ id: 'v-1', embedding: [1, 0, 0], metadata: {} }];
    const client = mockClient(data);
    const store = new PgVectorStore({ client: client as any, userId: 'u-1' });

    const results = await store.search([1, 0, 0], 1);
    expect(results).toHaveLength(1);
    expect(results[0].record.id).toBe('v-1');
  });

  it('returns empty when no client configured', async () => {
    const store = new PgVectorStore({});
    const results = await store.search([1, 0, 0], 1);
    expect(results).toEqual([]);
  });
});
