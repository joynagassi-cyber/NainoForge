import type { VectorRecord, SearchResult, IVectorStore } from './contracts.js';
export declare class VectorStore implements IVectorStore {
    private records;
    upsert(record: VectorRecord): void;
    search(query: number[], topK?: number): SearchResult[];
    remove(id: string): void;
    clear(): void;
}
