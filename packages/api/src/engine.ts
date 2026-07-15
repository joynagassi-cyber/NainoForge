// ponytail: Supabase API stub — real calls delegated to @nainoforge/shared + fetch.
// Kept offline-safe for local-first: throws if no config, never crashes silently.

import type { ApiClientConfig, SourcePayload, SyncResult, IApiClient } from './contracts.js';

export class ApiClient implements IApiClient {
  constructor(private cfg: ApiClientConfig) {}

  async pushSource(_payload: SourcePayload): Promise<string> {
    throw new Error('ApiClient.pushSource: Supabase not configured in MVP');
  }

  async pullSources(): Promise<SourcePayload[]> {
    throw new Error('ApiClient.pullSources: Supabase not configured in MVP');
  }

  async sync(_queue: SourcePayload[]): Promise<SyncResult> {
    return { synced: [], conflicts: [] };
  }
}
