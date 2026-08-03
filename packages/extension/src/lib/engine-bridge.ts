// packages/extension/src/lib/engine-bridge.ts
// Bridges the background SW EventBus to React component state.
// Sources and imprints are persisted in chrome.storage.local so they
// survive side panel close/reopen cycles.

import type { DCM } from '@nainoforge/shared';
import type { ImprintNote } from '@nainoforge/imprint';

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
  private sources: DCM[] = [];
  private imprints: ImprintNote[] = [];
  private listeners = new Map<string, Set<(data: unknown) => void>>();
  private initialized = false;

  /** Load persisted data from chrome.storage.local. */
  async initialize(): Promise<void> {
    if (this.initialized) return;
    this.initialized = true;

    try {
      const sourcesResp = await chrome.runtime.sendMessage({
        type: 'nf:sources:load',
      } as chrome.runtime.Message);
      if (sourcesResp.ok && sourcesResp.data) {
        this.sources = (sourcesResp.data as { sources: DCM[] }).sources ?? [];
      }
    } catch {
      // Storage unavailable — start empty
    }

    try {
      const imprintsResp = await chrome.runtime.sendMessage({
        type: 'nf:imprints:load',
      } as chrome.runtime.Message);
      if (imprintsResp.ok && imprintsResp.data) {
        this.imprints = (imprintsResp.data as { imprints: ImprintNote[] }).imprints ?? [];
      }
    } catch {
      // Storage unavailable — start empty
    }
  }

  async captureSource(dcm: DCM): Promise<{ ok: true; data?: unknown } | { ok: false, error: string }> {
    try {
      const result = await chrome.runtime.sendMessage({
        type: 'nf:capture:request',
        payload: { dcm },
      } as chrome.runtime.Message);
      if (result.ok) {
        this.sources.push(dcm);
        this.notify('source:captured', dcm);
      }
      return result as { ok: true; data?: unknown } | { ok: false; error: string };
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : String(err) };
    }
  }

  async saveImprint(sourceId: string, conceptId: string, content: string): Promise<ImprintResult> {
    const result = await chrome.runtime.sendMessage({
      type: 'nf:imprint:save',
      payload: { sourceId, conceptId, content },
    } as chrome.runtime.Message);
    if (result.ok && result.data) {
      this.imprints.push(result.data as ImprintNote);
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

  getImprints(): readonly ImprintNote[] {
    return this.imprints;
  }

  private notify(event: string, data: unknown): void {
    const set = this.listeners.get(event);
    if (!set) return;
    for (const handler of set) {
      try { handler(data); } catch { /* ignore handler errors */ }
    }
  }
}

// Singleton — initialized on first use
export const engineBridge = new EngineBridge();
