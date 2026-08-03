/**
 * Service-worker-scoped EventBus singleton.
 *
 * The EventBus class is inlined here (instead of re-exporting from
 * @nainoforge/shared) because Rolldown tree-shakes re-exports that are
 * not used locally, which would leave `EventBus` undefined at runtime
 * and crash the service worker with:
 *   "Uncaught ReferenceError: EventBus is not defined"
 */

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
 * Singleton instance shared across the SW module scope.
 * The SW module is re-evaluated on each wake-up; this file's top-level
 * code runs once per evaluation, so the instance is fresh but
 * deterministic.
 */
export const swBus = new EventBus();
