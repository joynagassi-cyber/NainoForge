// ponytail: minimal sync queue worker.
// Processes nf_sync_queue entries via @nainoforge/api transport.
// Single-flight, retry capped at 3, success/failure recorded locally.

import type { IApiClient, SourcePayload } from './contracts.js';

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

export class SyncQueueWorker {
  constructor(private api: IApiClient, private maxRetries = 3) {}

  async process(entries: SyncQueueEntry[]): Promise<SyncWorkerResult> {
    let processed = 0;
    let failed = 0;

    for (const entry of entries) {
      if ((entry as any).retry_count >= this.maxRetries) {
        failed++;
        continue;
      }

      try {
        const payload = this.toPayload(entry);
        await this.api.sync([payload]);
        processed++;
      } catch {
        failed++;
      }
    }

    return { processed, failed };
  }

  private toPayload(entry: SyncQueueEntry): SourcePayload {
    const payload = entry.payload_json ?? {};
    return {
      title: String(payload.title ?? entry.aggregate_id),
      content_markdown: String(payload.content_markdown ?? payload.text ?? ''),
      source_type: (payload.source_type as SourcePayload['source_type']) ?? 'web_article',
      url: payload.url ? String(payload.url) : undefined,
      metadata: {
        aggregate_type: entry.aggregate_type,
        operation: entry.operation,
      },
    };
  }
}
