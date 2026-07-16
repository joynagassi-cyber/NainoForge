import { describe, it, expect, vi } from 'vitest';
import { LiteLLMProvider } from '../engine.js';

describe('LiteLLMProvider', () => {
  it('returns completion text on success', async () => {
    const fetch = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ choices: [{ message: { role: 'assistant', content: 'ok' } }] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    const provider = new LiteLLMProvider({
      provider: 'litellm',
      baseUrl: 'http://localhost:8000',
      defaultModel: 'gpt-4o-mini',
    });

    const result = await provider.complete([{ role: 'user', content: 'ping' }]);
    expect(result.text).toBe('ok');
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8000/v1/chat/completions',
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('throws on non-ok response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response('boom', { status: 500, headers: { 'Content-Type': 'text/plain' } })
    );

    const provider = new LiteLLMProvider({
      provider: 'litellm',
      baseUrl: 'http://localhost:8000',
      defaultModel: 'gpt-4o-mini',
    });

    await expect(provider.complete([{ role: 'user', content: 'ping' }])).rejects.toThrow('AiProvider 500');
  });

  it('throws on empty choices', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ choices: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    const provider = new LiteLLMProvider({
      provider: 'litellm',
      baseUrl: 'http://localhost:8000',
      defaultModel: 'gpt-4o-mini',
    });

    await expect(provider.complete([{ role: 'user', content: 'ping' }])).rejects.toThrow('empty completion');
  });
});
