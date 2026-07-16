import type { IApiClient } from './contracts.js';
export interface SyncQueueEntry {
    id: string;
    aggregate_type: string;
    aggregate_id: string;
    operation: string;
    payload_json: Record<string, unknown>;
}
export interface SyncWorkerResult {
    processed: number;
    failed: number;
}
export declare class SyncQueueWorker {
    private api;
    private maxRetries;
    constructor(api: IApiClient, maxRetries?: number);
    process(entries: SyncQueueEntry[]): Promise<SyncWorkerResult>;
    private toPayload;
}
