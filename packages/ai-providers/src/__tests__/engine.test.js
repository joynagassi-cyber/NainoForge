"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const engine_js_1 = require("../engine.js");
(0, vitest_1.describe)('LiteLLMProvider', () => {
    (0, vitest_1.it)('returns completion text on success', async () => {
        const fetch = vitest_1.vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(new Response(JSON.stringify({ choices: [{ message: { role: 'assistant', content: 'ok' } }] }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        }));
        const provider = new engine_js_1.LiteLLMProvider({
            provider: 'litellm',
            baseUrl: 'http://localhost:8000',
            defaultModel: 'gpt-4o-mini',
        });
        const result = await provider.complete([{ role: 'user', content: 'ping' }]);
        (0, vitest_1.expect)(result.text).toBe('ok');
        (0, vitest_1.expect)(fetch).toHaveBeenCalledWith('http://localhost:8000/v1/chat/completions', vitest_1.expect.objectContaining({ method: 'POST' }));
    });
    (0, vitest_1.it)('throws on non-ok response', async () => {
        vitest_1.vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(new Response('boom', { status: 500, headers: { 'Content-Type': 'text/plain' } }));
        const provider = new engine_js_1.LiteLLMProvider({
            provider: 'litellm',
            baseUrl: 'http://localhost:8000',
            defaultModel: 'gpt-4o-mini',
        });
        await (0, vitest_1.expect)(provider.complete([{ role: 'user', content: 'ping' }])).rejects.toThrow('AiProvider 500');
    });
    (0, vitest_1.it)('throws on empty choices', async () => {
        vitest_1.vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(new Response(JSON.stringify({ choices: [] }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        }));
        const provider = new engine_js_1.LiteLLMProvider({
            provider: 'litellm',
            baseUrl: 'http://localhost:8000',
            defaultModel: 'gpt-4o-mini',
        });
        await (0, vitest_1.expect)(provider.complete([{ role: 'user', content: 'ping' }])).rejects.toThrow('empty completion');
    });
});
//# sourceMappingURL=engine.test.js.map