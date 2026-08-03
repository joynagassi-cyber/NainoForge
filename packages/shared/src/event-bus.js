// ─── EventBus — simple pub/sub, no external deps ─────────────
// Used for cross-module communication inside the extension.
export class EventBus {
    listeners = new Map();
    on(event, handler) {
        const set = this.listeners.get(event) ?? new Set();
        set.add(handler);
        this.listeners.set(event, set);
        return () => {
            set.delete(handler);
            if (set.size === 0)
                this.listeners.delete(event);
        };
    }
    off(event, handler) {
        const set = this.listeners.get(event);
        if (!set)
            return;
        set.delete(handler);
        if (set.size === 0)
            this.listeners.delete(event);
    }
    emit(event, payload) {
        const set = this.listeners.get(event);
        if (!set)
            return;
        for (const handler of set) {
            try {
                handler(payload);
            }
            catch (err) {
                console.debug('[nf-bus] handler error', err);
            }
        }
    }
    removeAll() {
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
export function namespace(prefix) {
    return (name) => `${prefix}:${name}`;
}
//# sourceMappingURL=event-bus.js.map