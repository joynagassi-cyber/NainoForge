// ponytail: real Supabase transport for @nainoforge/api.
// Offline-safe: requires config, surfaces backend errors, never silently drops.

import type { ApiClientConfig, SourcePayload, SyncResult, IApiClient } from './contracts.js';
import { createSupabaseClient } from './supabase.js';

export class ApiClient implements IApiClient {
  constructor(private cfg: ApiClientConfig) {}

  #client() {
    return createSupabaseClient(this.cfg);
  }

  async pushSource(payload: SourcePayload): Promise<string> {
    const supabase = this.#client();
    const { data, error } = await supabase
      .from('nf_sources')
      .insert({
        title: payload.title,
        raw_text: payload.content_markdown,
        source_type: payload.source_type,
        url: payload.url ?? null,
        privacy_level: 'personal',
        is_syncable: true,
        status: 'captured',
        metadata: payload.metadata,
      })
      .select('id')
      .single();

    if (error) throw new Error(`pushSource failed: ${error.message}`);
    return data.id as string;
  }

  async pullSources(): Promise<SourcePayload[]> {
    const supabase = this.#client();
    const { data, error } = await supabase
      .from('nf_sources')
      .select('id, title, raw_text, source_type, url, created_at')
      .order('created_at', { ascending: false });

    if (error) throw new Error(`pullSources failed: ${error.message}`);
    return (data ?? []).map((row) => ({
      title: row.title,
      content_markdown: row.raw_text ?? '',
      source_type: row.source_type,
      url: row.url ?? undefined,
      metadata: {},
    }));
  }

  async sync(queue: SourcePayload[]): Promise<SyncResult> {
    const synced: string[] = [];
    const conflicts: SyncResult['conflicts'] = [];

    for (const item of queue) {
      try {
        const id = await this.pushSource(item);
        synced.push(id);
      } catch (e) {
        conflicts.push({
          local_id: item.title,
          remote_id: 'unknown',
        });
      }
    }

    return { synced, conflicts };
  }
}
