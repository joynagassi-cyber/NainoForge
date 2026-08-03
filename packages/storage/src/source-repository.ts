import type { CapturedSource, SourceStatus } from '@nainoforge/core';
import { tx } from './db.js';

export class SourceRepository {
  async insert(source: Omit<CapturedSource, 'id' | 'created_at'>): Promise<string> {
    return tx('nf_sources', 'readwrite', async (store) => {
      // Check dedup by content_hash
      const existing = await this.getByHash(source.content_hash);
      if (existing) return existing.id;

      const record: CapturedSource = {
        ...source,
        id: crypto.randomUUID(),
        created_at: Date.now(),
      };
      return new Promise((resolve, reject) => {
        const req = store.put(record);
        req.onsuccess = () => resolve(record.id);
        req.onerror = () => reject(req.error);
      });
    });
  }

  async getByHash(hash: string): Promise<CapturedSource | null> {
    return tx('nf_sources', 'readonly', async (store) => {
      const index = store.index('content_hash');
      return new Promise((resolve, reject) => {
        const req = index.get(hash);
        req.onsuccess = () => resolve((req.result as CapturedSource | undefined) ?? null);
        req.onerror = () => reject(req.error);
      });
    });
  }

  async getById(id: string): Promise<CapturedSource | null> {
    return tx('nf_sources', 'readonly', async (store) => {
      return new Promise((resolve, reject) => {
        const req = store.get(id);
        req.onsuccess = () => resolve((req.result as CapturedSource | undefined) ?? null);
        req.onerror = () => reject(req.error);
      });
    });
  }

  async updateStatus(id: string, status: SourceStatus): Promise<void> {
    const existing = await this.getById(id);
    if (!existing) throw new Error(`Source not found: ${id}`);
    existing.status = status;
    return tx('nf_sources', 'readwrite', async (store) => {
      return new Promise((resolve, reject) => {
        const req = store.put(existing);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    });
  }

  async listAll(): Promise<CapturedSource[]> {
    return tx('nf_sources', 'readonly', async (store) => {
      return new Promise((resolve, reject) => {
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result as CapturedSource[]);
        req.onerror = () => reject(req.error);
      });
    });
  }
}
