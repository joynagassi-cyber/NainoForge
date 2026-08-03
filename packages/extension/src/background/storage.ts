/**
 * NainoForge — Storage layer for MV3.
 *
 * Wraps chrome.storage.local with typed get/set/remove and list helpers.
 * All keys are namespaced under 'nf:' to avoid collisions.
 */

const NS = 'nf:';

export class Storage {
  async get<T>(key: string): Promise<T | null> {
    const result = await chrome.storage.local.get(NS + key);
    return (result[NS + key] ?? null) as T | null;
  }

  async set<T>(key: string, value: T): Promise<void> {
    await chrome.storage.local.set({ [NS + key]: value });
  }

  async remove(key: string): Promise<void> {
    await chrome.storage.local.remove(NS + key);
  }

  /** Get an array stored under a key, or an empty array if missing. */
  async get_list<T>(key: string): Promise<T[]> {
    const result = await chrome.storage.local.get(NS + key);
    const val = result[NS + key];
    return Array.isArray(val) ? (val as T[]) : [];
  }

  /** Append an item to a stored array (atomic). */
  async push_list<T>(key: string, item: T, max?: number): Promise<void> {
    const list = await this.get_list<T>(key);
    list.push(item);
    if (max && list.length > max) {
      list.splice(0, list.length - max);
    }
    await this.set(key, list);
  }

  /** Replace the entire array. */
  async set_list<T>(key: string, list: T[]): Promise<void> {
    await this.set(key, list);
  }

  /** Remove an item by id from a list. */
  async remove_from_list<T extends { id: string }>(
    key: string,
    id: string,
  ): Promise<void> {
    const list = await this.get_list<T>(key);
    const filtered = list.filter((item) => item.id !== id);
    await this.set_list(key, filtered);
  }

  /** Clear all NainoForge keys. */
  async clear_all(): Promise<void> {
    const keys = await this.all_keys();
    if (keys.length > 0) {
      await chrome.storage.local.remove(keys);
    }
  }

  private async all_keys(): Promise<string[]> {
    const all = await chrome.storage.local.get(null);
    return Object.keys(all).filter((k) => k.startsWith(NS));
  }
}

// Singleton — same instance across SW and side panel contexts
export const storage = new Storage();
