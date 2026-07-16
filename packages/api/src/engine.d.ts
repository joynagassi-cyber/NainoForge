import type { ApiClientConfig, SourcePayload, SyncResult, IApiClient } from './contracts.js';
export declare class ApiClient implements IApiClient {
    #private;
    private cfg;
    constructor(cfg: ApiClientConfig);
    pushSource(payload: SourcePayload): Promise<string>;
    pullSources(): Promise<SourcePayload[]>;
    sync(queue: SourcePayload[]): Promise<SyncResult>;
}
