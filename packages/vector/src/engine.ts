// ponytail: in-memory cosine-search, good enough for MVP prototype.
// L2 norm per query is cached for the duration of a single search call.

import type { VectorRecord, SearchResult, IVectorStore } from './contracts.js';

function dot(a: number[], b: number[]): number {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
}

function norm(a: number[]): number {
  return Math.sqrt(dot(a, a));
}

export class VectorStore implements IVectorStore {
  private records: VectorRecord[] = [];

  upsert(record: VectorRecord): void {
    const idx = this.records.findIndex((r) => r.id === record.id);
    if (idx >= 0) this.records[idx] = record;
    else this.records.push(record);
  }

  search(query: number[], topK = 5): SearchResult[] {
    const qNorm = norm(query);
    if (qNorm === 0) return [];
    const scored = this.records
      .map((r) => ({ record: r, score: dot(query, r.embedding) / (qNorm * norm(r.embedding)) }))
      .filter((s) => Number.isFinite(s.score))
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
    return scored;
  }

  remove(id: string): void {
    this.records = this.records.filter((r) => r.id !== id);
  }

  clear(): void {
    this.records = [];
  }
}
