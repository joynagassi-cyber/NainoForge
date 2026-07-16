"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SourceRepository = void 0;
const crypto_js_1 = require("./crypto.js");
// ─── IndexedDB-backed repository for nf_sources ──────────────
const DB_NAME = 'nainoforge';
const STORE = 'nf_sources';
function openDB() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, 1);
        req.onupgradeneeded = () => {
            const db = req.result;
            if (!db.objectStoreNames.contains(STORE)) {
                const store = db.createObjectStore(STORE, { keyPath: 'id' });
                store.createIndex('content_hash', 'content_hash', { unique: false });
                store.createIndex('status', 'status', { unique: false });
            }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}
function tx(storeName, mode) {
    return openDB().then((db) => {
        const t = db.transaction(storeName, mode);
        return t.objectStore(storeName);
    });
}
class SourceRepository {
    async insert(source) {
        const hash = await (0, crypto_js_1.hashMessage)(source.content_markdown);
        const existing = await this.getByHash(hash);
        if (existing) {
            console.debug(`[nf-repo] dedup skip hash=${hash} id=${existing.id}`);
            return existing.id;
        }
        const record = {
            ...source,
            id: crypto.randomUUID(),
            content_hash: hash,
            created_at: Date.now(),
        };
        return new Promise((resolve, reject) => {
            tx(STORE, 'readwrite')
                .then((store) => {
                const req = store.put(record);
                req.onsuccess = () => resolve(record.id);
                req.onerror = () => reject(req.error);
            })
                .catch(reject);
        });
    }
    async getByHash(hash) {
        return new Promise((resolve, reject) => {
            tx(STORE, 'readonly')
                .then((store) => {
                const idx = store.index('content_hash');
                const req = idx.get(hash);
                req.onsuccess = () => resolve(req.result ?? null);
                req.onerror = () => reject(req.error);
            })
                .catch(reject);
        });
    }
    async getById(id) {
        return new Promise((resolve, reject) => {
            tx(STORE, 'readonly')
                .then((store) => {
                const req = store.get(id);
                req.onsuccess = () => resolve(req.result ?? null);
                req.onerror = () => reject(req.error);
            })
                .catch(reject);
        });
    }
    async updateStatus(id, status) {
        const existing = await this.getById(id);
        if (!existing)
            throw new Error(`Source not found: ${id}`);
        existing.status = status;
        return new Promise((resolve, reject) => {
            tx(STORE, 'readwrite')
                .then((store) => {
                const req = store.put(existing);
                req.onsuccess = () => resolve();
                req.onerror = () => reject(req.error);
            })
                .catch(reject);
        });
    }
    async listAll() {
        return new Promise((resolve, reject) => {
            tx(STORE, 'readonly')
                .then((store) => {
                const req = store.getAll();
                req.onsuccess = () => resolve(req.result);
                req.onerror = () => reject(req.error);
            })
                .catch(reject);
        });
    }
}
exports.SourceRepository = SourceRepository;
//# sourceMappingURL=repository.js.map