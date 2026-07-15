// ─── Vector store contracts ───────────────────────────────────
// MVP: in-memory cosine similarity.  Post-MVP → IndexedDB / pgvector.

export interface VectorRecord {
  id: string;
  embedding: number[];
  metadata: Record<string, unknown>;
}

export interface SearchResult {
  record: VectorRecord;
  score: number;
}

export interface IVectorStore {
  upsert(record: VectorRecord): void;
  search(query: number[], topK?: number): SearchResult[];
  remove(id: string): void;
  clear(): void;
}
