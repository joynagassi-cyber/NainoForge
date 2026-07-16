"use strict";
// ─── Article Page Detector ───────────────────────────────────
// Heuristic: ≥3/5 signals detected.
Object.defineProperty(exports, "__esModule", { value: true });
exports.isArticlePage = isArticlePage;
function countTextDepth(doc) {
    let pCount = 0;
    let chars = 0;
    for (const el of doc.querySelectorAll('p')) {
        const t = (el.textContent ?? '').trim();
        if (t.length > 0)
            pCount += 1;
        chars += t.length;
    }
    return { paragraphs: pCount, chars };
}
function hasOgbTypeArticle(doc) {
    const og = doc.querySelector('meta[property="og:type"]');
    if (!og)
        return false;
    return (og.getAttribute('content') ?? '').toLowerCase() === 'article';
}
function isArticlePage(doc) {
    const signals = [
        doc.querySelector('article') !== null,
        doc.querySelector('[itemprop="articleBody"]') !== null,
        hasOgbTypeArticle(doc),
        countTextDepth(doc).paragraphs > 5,
        countTextDepth(doc).chars > 500,
    ];
    const hits = signals.filter(Boolean).length;
    return hits >= 3;
}
//# sourceMappingURL=article-detector.js.map