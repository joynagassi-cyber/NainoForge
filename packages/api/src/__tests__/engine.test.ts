import { describe, it, expect, vi } from 'vitest';

// ponytail: manual mock for Supabase client factory.
// Patching module-level export avoids timing issues with vi.mock hoisting.

const mockFrom = vi.fn(() => ({
  insert: vi.fn(() => ({
    select: vi.fn(() => ({
      single: vi.fn(),
    })),
  })),
  select: vi.fn(() => ({
    order: vi.fn(),
  })),
}));

vi.mock('../supabase.js', () => ({
  createSupabaseClient: () => ({
    from: mockFrom,
  }),
}));

const SAMPLE = {
  title: 't',
  content_markdown: 'md',
  source_type: 'web_article' as const,
  metadata: {},
};

describe('ApiClient', () => {
  it('pushSource delegates to supabase from("nf_sources").insert().select().single()', async () => {
    const { ApiClient } = await import('../engine.js');
    const client = new ApiClient({ url: 'http://localhost', anonKey: 'x' });

    mockFrom.mockReturnValue({
      insert: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: { id: 'remote-1' }, error: null }),
        }),
      }),
    });

    const id = await client.pushSource(SAMPLE);
    expect(id).toBe('remote-1');
  });

  it('pullSources maps rows to SourcePayload[]', async () => {
    const { ApiClient } = await import('../engine.js');
    const client = new ApiClient({ url: 'http://localhost', anonKey: 'x' });

    mockFrom.mockReturnValueOnce({
      select: () => ({
        order: () =>
          Promise.resolve({
            data: [{ id: 'r1', title: 't', raw_text: 'md', source_type: 'web_article', url: null, created_at: '2026-01-01T00:00:00Z' }],
            error: null,
          }),
      }),
    });

    const rows = await client.pullSources();
    expect(rows).toHaveLength(1);
    expect(rows[0].title).toBe('t');
  });

  it('sync pushes all queued items and reports conflicts', async () => {
    const { ApiClient } = await import('../engine.js');
    const client = new ApiClient({ url: 'http://localhost', anonKey: 'x' });

    mockFrom.mockReturnValue({
      insert: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: { id: 'remote-1' }, error: null }),
        }),
      }),
    });

    const result = await client.sync([SAMPLE, SAMPLE]);
    expect(result.synced).toEqual(['remote-1', 'remote-1']);
    expect(result.conflicts).toEqual([]);
  });

  it('sync reports conflicts when pushSource throws', async () => {
    const { ApiClient } = await import('../engine.js');
    const client = new ApiClient({ url: 'http://localhost', anonKey: 'x' });

    mockFrom.mockReturnValue({
      insert: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: null, error: { message: 'conflict' } }),
        }),
      }),
    });

    const result = await client.sync([SAMPLE]);
    expect(result.synced).toEqual([]);
    expect(result.conflicts).toHaveLength(1);
    expect(result.conflicts[0]).toEqual({ local_id: 't', remote_id: 'unknown' });
  });
});
