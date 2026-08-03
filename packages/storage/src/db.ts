// ─── IndexedDB database management ────────────────────────────

export const DB_NAME = 'nainoforge';
export const DB_VERSION = 1;

export interface DBSchema {
  nf_sources: CapturedSourceRecord;
  nf_imprints: ImprintRecord;
  nf_concepts: ConceptRecord;
}

export interface CapturedSourceRecord {
  id: string;
  type: 'web_article' | 'youtube' | 'pdf';
  content_hash: string;
  status: 'pending' | 'processing' | 'ready' | 'error';
  metadata: Record<string, unknown>;
  created_at: number;
}

export interface ImprintRecord {
  id: string;
  source_id: string;
  concept_id: string;
  content: string;
  word_count: number;
  cran_level: number;
  quality_score: number;
  created_at: number;
}

export interface ConceptRecord {
  id: string;
  label: string;
  description: string;
  source_ids: string[];
}

let _db: IDBDatabase | null = null;
let _initPromise: Promise<IDBDatabase> | null = null;

export async function openDB(): Promise<IDBDatabase> {
  if (_db) return _db;
  if (!_initPromise) {
    _initPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        // Sources store
        if (!db.objectStoreNames.contains('nf_sources')) {
          const store = db.createObjectStore('nf_sources', { keyPath: 'id' });
          store.createIndex('content_hash', 'content_hash', { unique: false });
          store.createIndex('status', 'status', { unique: false });
        }
        // Imprints store
        if (!db.objectStoreNames.contains('nf_imprints')) {
          db.createObjectStore('nf_imprints', { keyPath: 'id' });
        }
        // Concepts store
        if (!db.objectStoreNames.contains('nf_concepts')) {
          db.createObjectStore('nf_concepts', { keyPath: 'id' });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
  return _initPromise;
}

export async function tx<T>(
  storeName: string,
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => Promise<T>
): Promise<T> {
  const db = await openDB();
  const transaction = db.transaction(storeName, mode);
  const store = transaction.objectStore(storeName);
  return fn(store);
}
