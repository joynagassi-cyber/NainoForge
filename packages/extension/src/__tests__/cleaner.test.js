"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const jsdom_1 = require("jsdom");
const cleaner_js_1 = require("../extract/cleaner.js");
const { window } = new jsdom_1.JSDOM('');
globalThis.DOMParser = window.DOMParser;
(0, vitest_1.describe)('cleanHtml', () => {
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
        (0, vitest_1.it)(c.name, () => {
            const out = (0, cleaner_js_1.cleanHtml)(c.input);
            (0, vitest_1.expect)(out).toContain(c.contains);
            if (c.notContains)
                (0, vitest_1.expect)(out).not.toContain(c.notContains);
        });
    }
});
//# sourceMappingURL=cleaner.test.js.map