import { describe, it, expect } from 'vitest';
import { JSDOM } from 'jsdom';
import { isArticlePage } from '../extract/article-detector.js';

function doc(html: string): Document {
  return new JSDOM(html).window.document;
}

describe('isArticlePage', () => {
  it('returns true for a real article page', () => {
    const html = `
      <html><head><meta property="og:type" content="article"></head>
      <body>
        <article><p>Lorem ipsum dolor sit amet.</p><p>Second paragraph here.</p>
        <p>Third paragraph with enough text.</p><p>Fourth paragraph.</p><p>Fifth paragraph.</p>
        <p>Sixth.</p><p>Seventh.</p><p>Eighth.</p>
      </body></html>`;
    expect(isArticlePage(doc(html))).toBe(true);
  });

  it('returns false for a generic page without article signals', () => {
    const html = '<html><body><p>hi</p></body></html>';
    expect(isArticlePage(doc(html))).toBe(false);
  });

  it('returns false with only 2 positive signals', () => {
    // og:type=article + article tag = 2 signals, needs 3
    const html = `
      <html><head><meta property="og:type" content="article"></head>
      <body><article><p>one</p></article></body></html>`;
    expect(isArticlePage(doc(html))).toBe(false);
  });

  it('returns true when article tag + rich paragraphs detected', () => {
    const paragraph = '<p>' + 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(12) + '</p>';
    const html = `<html><body><article>\n${Array.from({ length: 8 }, () => paragraph).join('\n')}\n</article></body></html>`;
    expect(isArticlePage(doc(html))).toBe(true);
  });
});
