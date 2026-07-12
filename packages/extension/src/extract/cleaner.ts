// ─── Clean HTML helper ────────────────────────────────────────
// Strips semantic cruft and normalizes whitespace for downstream ingestion.

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

function stripNodes(doc: Document): void {
  for (const sel of STRIP_SELECTORS) {
    try {
      for (const el of doc.querySelectorAll(sel)) {
        el.remove();
      }
    } catch {
      // selector may be invalid in some host documents — ignore
    }
  }
}

function collapseWhitespace(text: string): string {
  return text
    .replace(/[^\S\n]+/g, ' ') // espaces multiples → single space
    .replace(/\n{3,}/g, '\n\n') // max 2 line breaks
    .trim();
}

export function cleanHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  stripNodes(doc);
  return collapseWhitespace(doc.body.textContent ?? '');
}
