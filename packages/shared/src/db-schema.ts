// ─── IndexedDB schema contract for nf_sources ─────────────────
// This file documents the expected shape of the store.
// The actual migration lives in repository.ts openDB().

export interface NfSourceRecord {
  id: string;
  type: 'web_article' | 'youtube' | 'pdf';
  content_hash: string; // SHA-256 hex
  status: 'pending' | 'processing' | 'ready' | 'error';
  metadata: Record<string, unknown>;
  created_at: number; // unix ms
}

export const DB_NAME = 'nainoforge';
export const STORE_NAME = 'nf_sources';
