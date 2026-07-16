import type { VectorRecord, SearchResult } from './contracts.js';
export interface PgVectorClient {
    rpc(name: string, args: Record<string, unknown>): Promise<{
        data?: VectorRecord[];
        error?: {
            message: string;
        };
    }>;
}
export interface PgVectorStoreOptions {
    client?: PgVectorClient;
    userId?: string;
}
export declare class PgVectorStore {
    private opts;
    constructor(opts?: PgVectorStoreOptions);
    upsert(record: VectorRecord): Promise<void>;
    search(query: number[], topK?: number): Promise<SearchResult[]>;
}
