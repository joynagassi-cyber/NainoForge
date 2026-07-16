import { describe, it, expect, vi, beforeEach } from 'vitest';
import { stubFetch, clearFetchStubs } from './setup-fetch-mock.js';

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Prefer': 'return=representation' },
  });
}

const SAMPLE = {
  title: 't',
  content_markdown: 'md',
  source_type: 'web_article' as const,
  metadata: {},
};

describe('ApiClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearFetchStubs();
  });

  it('pushSource inserts and returns remote id', async () => {
    stubFetch('/rest/v1/nf_sources', () => json({ id: 'remote-1' }));

    const { ApiClient } = await import('../engine.js');
    const client = new ApiClient({ url: 'http://localhost', anonKey: 'x' });
    const id = await client.pushSource(SAMPLE);
    expect(id).toBe('remote-1');
  });

  it('pullSources maps rows to SourcePayload[]', async () => {
    stubFetch('/rest/v1/nf_sources', () => json({
      data: [
        { id: 'r1', title: 't', raw_text: 'md', source_type: 'web_article', url: null, created_at: '2026-01-01T00:00:00Z' },
      ],
    }));

    const { ApiClient } = await import('../engine.js');
    const client = new ApiClient({ url: 'http://localhost', anonKey: 'x' });
    const rows = await client.pullSources();
    console.log('rows=', rows, 'len=', rows?.length);
    expect(rows).toHaveLength(1);
    expect(rows[0].title).toBe('t');
  });

  it('sync reports conflicts when push errors', async () => {
    stubFetch('/rest/v1/nf_sources', () => json({ error: { message: 'conflict' } }, 400));

    const { ApiClient } = await import('../engine.js');
    const client = new ApiClient({ url: 'http://localhost', anonKey: 'x' });
    const result = await client.sync([SAMPLE, SAMPLE]);
    expect(result.synced).toEqual([]);
    expect(result.conflicts).toHaveLength(2);
  });
});
