// ─── EventBus — simple pub/sub, no external deps ─────────────
// Used for cross-module communication inside the extension.

type Handler = (payload: unknown) => void;

export class EventBus {
  private listeners = new Map<string, Set<Handler>>();

  on<K extends string>(event: K, handler: (payload: unknown) => void): () => void {
    const set = this.listeners.get(event) ?? new Set<Handler>();
    set.add(handler);
    this.listeners.set(event, set);

    return () => {
      set.delete(handler);
      if (set.size === 0) this.listeners.delete(event);
    };
  }

  off<K extends string>(event: K, handler: (payload: unknown) => void): void {
    const set = this.listeners.get(event);
    if (!set) return;
    set.delete(handler);
    if (set.size === 0) this.listeners.delete(event);
  }

  emit<K extends string>(event: K, payload: unknown): void {
    const set = this.listeners.get(event);
    if (!set) return;
    for (const handler of set) {
      try { handler(payload); } catch (err) {
        console.debug('[nf-bus] handler error', err);
      }
    }
  }

  removeAll(): void {
    this.listeners.clear();
  }
}

/**
 * Create a namespaced event name helper to avoid collisions:
 *
 *   const ev = namespace('extension');
 *   bus.on(ev('source:captured'), handler);
 *   bus.emit(ev('source:captured'), payload);
 */
export function namespace(prefix: string) {
  return (name: string) => `${prefix}:${name}`;
}
