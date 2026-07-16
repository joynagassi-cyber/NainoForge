"use strict";
// ponytail: minimal sync queue worker.
// Processes nf_sync_queue entries via @nainoforge/api transport.
// Single-flight, retry capped at 3, success/failure recorded locally.
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncQueueWorker = void 0;
class SyncQueueWorker {
    api;
    maxRetries;
    constructor(api, maxRetries = 3) {
        this.api = api;
        this.maxRetries = maxRetries;
    }
    async process(entries) {
        let processed = 0;
        let failed = 0;
        for (const entry of entries) {
            if (entry.retry_count >= this.maxRetries) {
                failed++;
                continue;
            }
            try {
                const payload = this.toPayload(entry);
                await this.api.sync([payload]);
                processed++;
            }
            catch {
                failed++;
            }
        }
        return { processed, failed };
    }
    toPayload(entry) {
        const payload = entry.payload_json ?? {};
        return {
            title: String(payload.title ?? entry.aggregate_id),
            content_markdown: String(payload.content_markdown ?? payload.text ?? ''),
            source_type: payload.source_type ?? 'web_article',
            url: payload.url ? String(payload.url) : undefined,
            metadata: {
                aggregate_type: entry.aggregate_type,
                operation: entry.operation,
            },
        };
    }
}
exports.SyncQueueWorker = SyncQueueWorker;
//# sourceMappingURL=sync-worker.js.map