"use strict";
// ponytail: deterministic stub. Replace with LiteLLM call when router is wired.
// No new deps; stdlib only.
Object.defineProperty(exports, "__esModule", { value: true });
exports.summarize = summarize;
exports.extractConcepts = extractConcepts;
function sentences(text) {
    return text
        .replace(/\n+/g, ' ')
        .split(/[.!?]+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
}
function firstN(arr, n) {
    return arr.slice(0, n);
}
const STOP = new Set([
    'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
    'do', 'does', 'did', 'will', 'would', 'shall', 'should', 'may', 'might', 'must', 'can', 'could',
    'i', 'me', 'my', 'we', 'our', 'you', 'your', 'he', 'him', 'his', 'she', 'her', 'it', 'its', 'they',
    'them', 'their', 'this', 'that', 'these', 'those', 'am', 'and', 'but', 'or', 'nor', 'for', 'yet',
    'so', 'if', 'then', 'else', 'when', 'where', 'why', 'how', 'all', 'each', 'every', 'both', 'few',
    'more', 'most', 'other', 'some', 'such', 'no', 'not', 'only', 'own', 'same', 'than', 'too', 'very',
    'just', 'because', 'about', 'against', 'between', 'through', 'during', 'before', 'after', 'above',
    'below', 'to', 'from', 'of', 'in', 'on', 'at', 'by', 'with', 'without', 'into', 'out', 'up', 'down',
]);
function tokenize(text) {
    return text.toLowerCase().replace(/[^a-z0-9À-ÿ]+/g, ' ').split(/\s+/).filter(Boolean);
}
function freqMap(tokens) {
    const m = new Map();
    for (const t of tokens) {
        if (STOP.has(t) || t.length < 3)
            continue;
        m.set(t, (m.get(t) ?? 0) + 1);
    }
    return m;
}
function properNounCandidates(text) {
    const re = /\b[A-Z][a-zÀ-ÿ]{2,}(?:\s+[A-Z][a-zÀ-ÿ]{2,})*\b/g;
    const hits = text.match(re) ?? [];
    return [...new Set(hits.map((s) => s.trim()))];
}
function scoreCandidates(candidates, freq, total) {
    const seen = new Set();
    const out = [];
    for (const c of candidates) {
        const key = c.toLowerCase();
        if (seen.has(key))
            continue;
        seen.add(key);
        const f = freq.get(key) ?? 0;
        const relevance = total > 0 ? Math.min(1, f / (total * 0.15)) : 0;
        out.push({ name: c, relevance: Math.round(relevance * 100) / 100 });
    }
    return out;
}
function summarize(input) {
    const { text, maxTokens = 180 } = input;
    const pool = firstN(sentences(text), 8);
    const summary = pool.slice(0, 3).join('. ') + (pool.length > 3 ? '.' : '');
    const keyPoints = pool.slice(0, 2).map((s) => s.trim());
    return { summary: summary || text.slice(0, maxTokens), keyPoints };
}
function extractConcepts(input) {
    const { text, maxConcepts = 10 } = input;
    const tokens = tokenize(text);
    const freq = freqMap(tokens);
    const candidates = properNounCandidates(text);
    const scored = scoreCandidates(candidates, freq, tokens.length);
    const concepts = scored
        .sort((a, b) => b.relevance - a.relevance)
        .slice(0, maxConcepts);
    return { concepts };
}
//# sourceMappingURL=summarizer.js.map