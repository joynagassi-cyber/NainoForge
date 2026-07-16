import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiClient } from '../engine.js';

const SAMPLE = {
  title: 't',
  content_markdown: 'md',
  source_type: 'web_article' as const,
  metadata: {},
};

function makeResponse(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('ApiClient', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('pushSource posts to supabase and returns id', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(makeResponse({ id: 'remote-1' }) as any);

    const client = new ApiClient({ url: 'http://localhost', anonKey: 'x' });
    const id = await client.pushSource(SAMPLE);
    expect(id).toBe('remote-1');
  });

  it('pullSources maps rows to SourcePayload[]', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      makeResponse({
        options: [
          { id: 'r1', title: 't', raw_text: 'md', source_type: 'web_article', url: null, created_at: '2026-01-01T00:00:00Z' },
        ],
      }) as any
    );

    const client = new ApiClient({ url: 'http://localhost', anonKey: 'x' });
    const rows = await client.pullSources();
    expect(rows).toHaveLength(1);
    expect(rows[0].title).toBe('t');
  });

  it('sync pushes queued items and aggregates conflicts', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(makeResponse({ id: 'remote-1' }) as any);

    const client = new ApiClient({ url: 'http://localhost', anonKey: 'x' });
    const result = await client.sync([SAMPLE, SAMPLE]);
    expect(result.synced).toEqual(['remote-1', 'remote-1']);
    expect(result.conflicts).toEqual([]);
  });
});
