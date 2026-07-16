"use strict";
// ─── Clean HTML helper ────────────────────────────────────────
// Strips semantic cruft and normalizes whitespace for downstream ingestion.
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanHtml = cleanHtml;
const STRIP_SELECTORS = [
    'nav',
    'aside',
    'footer',
    'header',
    'script',
    'style',
    'noscript',
    'iframe',
    'svg',
    'form',
    '[role="navigation"]',
    '[role="complementary"]',
    '[role="contentinfo"]',
    '[role="banner"]',
    '.ad',
    '.ads',
    '.advertisement',
    '.social-share',
    '.newsletter',
    '.related-posts',
    '.cookie-banner',
];
function stripNodes(doc) {
    for (const sel of STRIP_SELECTORS) {
        try {
            for (const el of doc.querySelectorAll(sel)) {
                el.remove();
            }
        }
        catch {
            // selector may be invalid in some host documents — ignore
        }
    }
}
function collapseWhitespace(text) {
    return text
        .replace(/[^\S\n]+/g, ' ') // espaces multiples → single space
        .replace(/\n{3,}/g, '\n\n') // max 2 line breaks
        .trim();
}
function cleanHtml(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    stripNodes(doc);
    return collapseWhitespace(doc.body.textContent ?? '');
}
//# sourceMappingURL=cleaner.js.map