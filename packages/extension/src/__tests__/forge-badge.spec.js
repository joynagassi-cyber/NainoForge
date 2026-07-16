"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const forge_badge_js_1 = require("../forge-badge.js");
(0, vitest_1.describe)('injectForgeBadge', () => {
    (0, vitest_1.beforeEach)(() => {
        document.head.innerHTML = '';
        document.body.innerHTML = '';
    });
    (0, vitest_1.it)('injects a button with label "Forger cette page"', () => {
        (0, forge_badge_js_1.injectForgeBadge)(document);
        const badge = document.getElementById('nf-forge-badge');
        (0, vitest_1.expect)(badge).not.toBeNull();
        const btn = badge?.querySelector('button');
        (0, vitest_1.expect)(btn?.textContent).toBe('Forger cette page');
    });
    (0, vitest_1.it)('does not duplicate badge on second call', () => {
        (0, forge_badge_js_1.injectForgeBadge)(document);
        (0, forge_badge_js_1.injectForgeBadge)(document);
        const badges = document.querySelectorAll('#nf-forge-badge');
        (0, vitest_1.expect)(badges.length).toBe(1);
    });
    (0, vitest_1.it)('injects a style tag with the badge CSS', () => {
        (0, forge_badge_js_1.injectForgeBadge)(document);
        const style = document.getElementById('nf-forge-badge-css');
        (0, vitest_1.expect)(style).not.toBeNull();
        (0, vitest_1.expect)(style?.textContent).toContain('.nf-forge-btn');
    });
});
//# sourceMappingURL=forge-badge.spec.js.map