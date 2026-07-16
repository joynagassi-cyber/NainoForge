"use strict";
// ─── Article extraction via Readability + Turndown ────────────
// Zero runtime style: pure Markdown output conforming to DCM.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractArticle = extractArticle;
const readability_1 = require("@mozilla/readability");
const turndown_1 = __importDefault(require("turndown"));
const turndown = new turndown_1.default({
    headingStyle: 'atx',
    hr: '---',
    bulletListMarker: '-',
    codeBlockStyle: 'fenced',
});
function estimateWordCount(text) {
    if (!text)
        return 0;
    return text.split(/[\s\n]+/).filter(Boolean).length;
}
function extractArticle(doc, sourceUrl) {
    const article = new readability_1.Readability(doc, { charThreshold: 100 }).parse();
    if (!article?.textContent || article.textContent.trim().length === 0) {
        throw new Error('ARTICLE_EXTRACTION_FAILED: empty article');
    }
    const contentMarkdown = turndown.turndown(article.content ?? '');
    const wordCount = estimateWordCount(contentMarkdown);
    const confidence = Math.min(100, Math.round((wordCount / 300) * 100));
    const metadata = {};
    if (article.excerpt)
        metadata.excerpt = article.excerpt;
    if (article.byline)
        metadata.byline = article.byline;
    if (article.publishedTime)
        metadata.publishedTime = article.publishedTime;
    if (article.siteName)
        metadata.siteName = article.siteName;
    if (article.lang)
        metadata.lang = article.lang;
    const dcm = {
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
//# sourceMappingURL=readability.js.map