import { describe, it, expect } from 'vitest';
import { ApiClient } from '../engine.js';

describe('ApiClient', () => {
  const client = new ApiClient({ url: 'http://localhost', anonKey: 'x' });

  it('pushSource throws stub error', async () => {
    await expect(client.pushSource({ title: 't', content_markdown: '', source_type: 'web_article', metadata: {} })).rejects.toThrow('Supabase not configured');
  });

  it('pullSources throws stub error', async () => {
    await expect(client.pullSources()).rejects.toThrow('Supabase not configured');
  });

  it('sync returns empty result', async () => {
    const result = await client.sync([]);
    expect(result.synced).toEqual([]);
    expect(result.conflicts).toEqual([]);
  });
});
