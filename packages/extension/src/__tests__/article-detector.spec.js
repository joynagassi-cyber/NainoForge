"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const jsdom_1 = require("jsdom");
const article_detector_js_1 = require("../extract/article-detector.js");
function doc(html) {
    return new jsdom_1.JSDOM(html).window.document;
}
(0, vitest_1.describe)('isArticlePage', () => {
    (0, vitest_1.it)('returns true for a real article page', () => {
        const html = `
      <html><head><meta property="og:type" content="article"></head>
      <body>
        <article><p>Lorem ipsum dolor sit amet.</p><p>Second paragraph here.</p>
        <p>Third paragraph with enough text.</p><p>Fourth paragraph.</p><p>Fifth paragraph.</p>
        <p>Sixth.</p><p>Seventh.</p><p>Eighth.</p>
      </body></html>`;
        (0, vitest_1.expect)((0, article_detector_js_1.isArticlePage)(doc(html))).toBe(true);
    });
    (0, vitest_1.it)('returns false for a generic page without article signals', () => {
        const html = '<html><body><p>hi</p></body></html>';
        (0, vitest_1.expect)((0, article_detector_js_1.isArticlePage)(doc(html))).toBe(false);
    });
    (0, vitest_1.it)('returns false with only 2 positive signals', () => {
        // og:type=article + article tag = 2 signals, needs 3
        const html = `
      <html><head><meta property="og:type" content="article"></head>
      <body><article><p>one</p></article></body></html>`;
        (0, vitest_1.expect)((0, article_detector_js_1.isArticlePage)(doc(html))).toBe(false);
    });
    (0, vitest_1.it)('returns true when article tag + rich paragraphs detected', () => {
        const paragraph = '<p>' + 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(12) + '</p>';
        const html = `<html><body><article>\n${Array.from({ length: 8 }, () => paragraph).join('\n')}\n</article></body></html>`;
        (0, vitest_1.expect)((0, article_detector_js_1.isArticlePage)(doc(html))).toBe(true);
    });
});
//# sourceMappingURL=article-detector.spec.js.map