import { describe, it, expect } from 'vitest';
import { VectorStore } from '../engine.js';

describe('VectorStore', () => {
  const store = new VectorStore();

  const a = { id: 'a', embedding: [1, 0, 0], metadata: {} };
  const b = { id: 'b', embedding: [0, 1, 0], metadata: {} };
  const c = { id: 'c', embedding: [1, 1, 0], metadata: {} };

  it('upsert + search: cosine ranking', () => {
    store.upsert(a);
    store.upsert(b);
    store.upsert(c);
    const results = store.search([1, 0, 0], 2);
    expect(results.map((r) => r.record.id)).toEqual(['a', 'c']);
  });

  it('remove drops record', () => {
    store.remove('a');
    const results = store.search([1, 0, 0], 2);
    expect(results.map((r) => r.record.id)).not.toContain('a');
  });

  it('clear empties store', () => {
    store.clear();
    expect(store.search([1, 0, 0])).toHaveLength(0);
  });
});
