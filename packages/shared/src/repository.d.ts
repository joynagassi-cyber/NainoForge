import type { CapturedSource, SourceStatus } from './types.js';
export declare class SourceRepository {
    insert(source: Omit<CapturedSource, 'id' | 'created_at'>): Promise<string>;
    getByHash(hash: string): Promise<CapturedSource | null>;
    getById(id: string): Promise<CapturedSource | null>;
    updateStatus(id: string, status: SourceStatus): Promise<void>;
    listAll(): Promise<CapturedSource[]>;
}
