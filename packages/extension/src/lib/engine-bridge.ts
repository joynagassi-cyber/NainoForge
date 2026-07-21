// packages/extension/src/lib/engine-bridge.ts
// Bridges the background SW EventBus to React component state.
// In MV3, the SW and side panel share IndexedDB but NOT JS context.
// Communication is via chrome.runtime.sendMessage + chrome.storage.

import { Storage } from '../background/storage.js';
import type { DCM } from '@nainoforge/shared';

export interface ImprintResult {
  id: string;
  source_id: string;
  concept_id: string;
  content: string;
  word_count: number;
  cran_level: number;
  quality_score: number;
  bloom_level?: string;
  created_at: number;
}

export class EngineBridge {
  private static readonly MAX_SOURCES = 100;
  private storage: Storage;
  private sources: DCM[] = [];
  private listeners = new Map<string, Set<(data: unknown) => void>>();

  constructor() {
    this.storage = new Storage();
  }

  async captureSource(dcm: DCM): Promise<{ ok: true; data?: unknown } | { ok: false; error: string }> {
    try {
      const result = await chrome.runtime.sendMessage({
        type: 'nf:capture:request',
        payload: { dcm },
      });
      if (result.ok) {
        this.sources.push(dcm);
        if (this.sources.length > EngineBridge.MAX_SOURCES) {
          this.sources = this.sources.slice(-EngineBridge.MAX_SOURCES);
        }
        this.notify('source:captured', dcm);
      }
      return result;
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : String(err) };
    }
  }

  async saveImprint(sourceId: string, conceptId: string, content: string): Promise<ImprintResult> {
    const result = await chrome.runtime.sendMessage({
      type: 'nf:imprint:save',
      payload: { sourceId, conceptId, content },
    });
    if (result.ok && result.data) {
      this.notify('imprint:validated', result.data);
    }
    return result.data as ImprintResult;
  }

  subscribe(event: string, handler: (data: unknown) => void): () => void {
    const set = this.listeners.get(event) ?? new Set();
    set.add(handler);
    this.listeners.set(event, set);
    return () => {
      set.delete(handler);
      if (set.size === 0) this.listeners.delete(event);
    };
  }

  getSources(): readonly DCM[] {
    return this.sources;
  }

  private notify(event: string, data: unknown): void {
    const set = this.listeners.get(event);
    if (!set) return;
    for (const handler of set) {
      try { handler(data); } catch { /* ignore handler errors */ }
    }
  }

  dispose(): void {
    this.storage.dispose();
  }
}

// ponytail: singleton instance shared across the app
export const engineBridge = new EngineBridge();
