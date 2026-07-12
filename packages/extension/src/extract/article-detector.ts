// ─── Article Page Detector ───────────────────────────────────
// Heuristic: ≥3/5 signals detected.

function countTextDepth(doc: Document): { paragraphs: number; chars: number } {
  let pCount = 0;
  let chars = 0;
  for (const el of doc.querySelectorAll('p')) {
    const t = (el.textContent ?? '').trim();
    if (t.length > 0) pCount += 1;
    chars += t.length;
  }
  return { paragraphs: pCount, chars };
}

function hasOgbTypeArticle(doc: Document): boolean {
  const og = doc.querySelector('meta[property="og:type"]');
  if (!og) return false;
  return (og.getAttribute('content') ?? '').toLowerCase() === 'article';
}

export function isArticlePage(doc: Document): boolean {
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
