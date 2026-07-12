import { JSDOM } from 'jsdom';
const { window } = new JSDOM('');
globalThis.DOMParser = window.DOMParser as unknown as typeof DOMParser;

import { cleanHtml } from '../extract/cleaner.js';

const CASES: Array<{ name: string; input: string; contains: string; notContains?: string }> = [
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

for (const c of CASES) {
  const out = cleanHtml(c.input);
  if (!out.includes(c.contains)) throw new Error(`cleaner ${c.name}: missing "${c.contains}"`);
  if (c.notContains && out.includes(c.notContains)) throw new Error(`cleaner ${c.name}: leaked "${c.notContains}"`);
}

console.log(`cleaner: ${CASES.length} cases passed`);
