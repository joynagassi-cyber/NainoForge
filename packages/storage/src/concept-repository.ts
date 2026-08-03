import type { Concept } from '@nainoforge/cosmos';
import { tx } from './db.js';

export class ConceptRepository {
  async insert(concept: Concept): Promise<string> {
    return tx('nf_concepts', 'readwrite', async (store) => {
      return new Promise((resolve, reject) => {
        const req = store.put(concept);
        req.onsuccess = () => resolve(concept.id);
        req.onerror = () => reject(req.error);
      });
    });
  }

  async getById(id: string): Promise<Concept | null> {
    return tx('nf_concepts', 'readonly', async (store) => {
      return new Promise((resolve, reject) => {
        const req = store.get(id);
        req.onsuccess = () => resolve((req.result as Concept | undefined) ?? null);
        req.onerror = () => reject(req.error);
      });
    });
  }

  async listAll(): Promise<Concept[]> {
    return tx('nf_concepts', 'readonly', async (store) => {
      return new Promise((resolve, reject) => {
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result as Concept[]);
        req.onerror = () => reject(req.error);
      });
    });
  }

  async delete(id: string): Promise<void> {
    return tx('nf_concepts', 'readwrite', async (store) => {
      return new Promise((resolve, reject) => {
        const req = store.delete(id);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    });
  }
}
