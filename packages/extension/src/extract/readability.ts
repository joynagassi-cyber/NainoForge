// ─── Article extraction via Readability + Turndown ────────────
// Zero runtime style: pure Markdown output conforming to DCM.

import { Readability } from '@mozilla/readability';
import TurndownService from 'turndown';
import type { DCM } from '@nainoforge/shared/src/types.js';

const turndown = new TurndownService({
  headingStyle: 'atx',
  hr: '---',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
});

export interface ArticleExtractResult {
  dcm: DCM;
  word_count: number;
  extraction_confidence: number; // 0-100 heuristic
}

function estimateWordCount(text: string): number {
  if (!text) return 0;
  return text.split(/[\s\n]+/).filter(Boolean).length;
}

export function extractArticle(
  doc: Document,
  sourceUrl: string,
): ArticleExtractResult {
  const article = new Readability(doc, { charThreshold: 100 }).parse();

  if (!article?.textContent || article.textContent.trim().length === 0) {
    throw new Error('ARTICLE_EXTRACTION_FAILED: empty article');
  }

  const contentMarkdown = turndown.turndown(article.content ?? '');
  const wordCount = estimateWordCount(contentMarkdown);
  const confidence = Math.min(100, Math.round((wordCount / 300) * 100));

  const metadata: Record<string, unknown> = {};
  if (article.excerpt) metadata.excerpt = article.excerpt;
  if (article.byline) metadata.byline = article.byline;
  if (article.publishedTime) metadata.publishedTime = article.publishedTime;
  if (article.siteName) metadata.siteName = article.siteName;
  if (article.lang) metadata.lang = article.lang;

  const dcm: DCM = {
    id: crypto.randomUUID(),
    title: article.title ?? doc.title ?? 'Untitled',
    content_markdown: contentMarkdown,
    source_url: sourceUrl,
    source_type: 'web_article',
    metadata,
    captured_at: Date.now(),
  };

  return { dcm, word_count: wordCount, extraction_confidence: confidence };
}
