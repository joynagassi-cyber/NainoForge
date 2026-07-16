// ponytail: simple global fetch shim. Test registers URL->Response pairs via register.
const overrides = new Map<string, Response | Promise<Response>>();

const fetchMock = async (input: globalThis.RequestInfo, init?: RequestInit): Promise<Response> => {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;

  for (const [pattern, response] of overrides) {
    if (url.includes(pattern)) return response;
  }

  return new Response(JSON.stringify({}), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Prefer': 'return=representation' },
  });
};

(globalThis as any).fetch = fetchMock;

export function register(pattern: string, response: Response | Promise<Response>) {
  overrides.set(pattern, response);
}

export function clearAll() {
  overrides.clear();
}
