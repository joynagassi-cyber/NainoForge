import { describe, it, expect } from 'vitest';
import { JSDOM } from 'jsdom';
import { cleanHtml } from '../extract/cleaner.js';

const { window } = new JSDOM('');
globalThis.DOMParser = window.DOMParser as unknown as typeof DOMParser;

describe('cleanHtml', () => {
  const cases = [
    {
      name: 'strip nav and normalize spaces',
      input: '<nav>skip</nav><main><p>hello   world</p><p>line1\n\n\n\nline2</p></main>',
      contains: 'hello world',
      notContains: '<nav>',
    },
    {
      name: 'strip script and style',
      input: '<script>bad()</script><style>.x{}</style><p>clean</p>',
      contains: 'clean',
      notContains: '<script>',
    },
  ];

  for (const c of cases) {
    it(c.name, () => {
      const out = cleanHtml(c.input);
      expect(out).toContain(c.contains);
      if (c.notContains) expect(out).not.toContain(c.notContains);
    });
  }
});
