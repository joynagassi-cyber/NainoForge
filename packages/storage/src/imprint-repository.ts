import type { ImprintNote } from '@nainoforge/core';
import { tx } from './db.js';

export class ImprintRepository {
  async insert(note: ImprintNote): Promise<string> {
    return tx('nf_imprints', 'readwrite', async (store) => {
      return new Promise((resolve, reject) => {
        const req = store.put(note);
        req.onsuccess = () => resolve(note.id);
        req.onerror = () => reject(req.error);
      });
    });
  }

  async getById(id: string): Promise<ImprintNote | null> {
    return tx('nf_imprints', 'readonly', async (store) => {
      return new Promise((resolve, reject) => {
        const req = store.get(id);
        req.onsuccess = () => resolve((req.result as ImprintNote | undefined) ?? null);
        req.onerror = () => reject(req.error);
      });
    });
  }

  async listBySource(sourceId: string): Promise<ImprintNote[]> {
    const all = await this.listAll();
    return all.filter(n => n.source_id === sourceId);
  }

  async listAll(): Promise<ImprintNote[]> {
    return tx('nf_imprints', 'readonly', async (store) => {
      return new Promise((resolve, reject) => {
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result as ImprintNote[]);
        req.onerror = () => reject(req.error);
      });
    });
  }

  async delete(id: string): Promise<void> {
    return tx('nf_imprints', 'readwrite', async (store) => {
      return new Promise((resolve, reject) => {
        const req = store.delete(id);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    });
  }
}
