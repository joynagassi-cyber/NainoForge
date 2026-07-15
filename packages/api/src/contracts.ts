// ─── API layer contracts ───────────────────────────────────────
// Supabase cloud sync — stub for MVP, real impl post-MVP.

export interface ApiClientConfig {
  url: string;
  anonKey: string;
}

export interface SourcePayload {
  title: string;
  content_markdown: string;
  source_type: 'web_article' | 'youtube' | 'pdf';
  url?: string;
  metadata: Record<string, unknown>;
}

export interface SyncResult {
  synced: string[];
  conflicts: Array<{ local_id: string; remote_id: string }>;
}

export interface IApiClient {
  pushSource(payload: SourcePayload): Promise<string>;
  pullSources(): Promise<SourcePayload[]>;
  sync(queue: SourcePayload[]): Promise<SyncResult>;
}
