export declare class EventBus {
    private listeners;
    on<K extends string>(event: K, handler: (payload: unknown) => void): () => void;
    off<K extends string>(event: K, handler: (payload: unknown) => void): void;
    emit<K extends string>(event: K, payload: unknown): void;
    removeAll(): void;
}
/**
 * Create a namespaced event name helper to avoid collisions:
 *
 *   const ev = namespace('extension');
 *   bus.on(ev('source:captured'), handler);
 *   bus.emit(ev('source:captured'), payload);
 */
export declare function namespace(prefix: string): (name: string) => string;
