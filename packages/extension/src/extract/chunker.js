"use strict";
// ─── Chunking Engine (S1) ────────────────────────────────────
// Splits markdown text into 300–500 token chunks with 50 token overlap.
// Preserves H1-H3 section titles.
// Token heuristic: ~1 token per 4 chars (EN/FR). Zéro external dep.
Object.defineProperty(exports, "__esModule", { value: true });
exports.chunkText = chunkText;
function tokenCount(text) {
    return Math.max(1, Math.ceil(text.length / 4));
}
function splitSections(text) {
    const parts = text.split(/(?=^#{1,3}\s+.+$)/m);
    return parts.map(p => {
        const m = p.match(/^(#{1,3})\s+(.+)$/m);
        return {
            title: m ? m[2].trim() : null,
            body: p.trim(),
        };
    }).filter(s => s.body.length > 0);
}
function splitIntoChunks(sectionTitle, body, minTokens, maxTokens, overlapTokens) {
    const sentences = body.split(/(?<=[.!?])\s+/);
    const chunks = [];
    let cur = '';
    let curTokens = 0;
    const flush = () => {
        if (!cur)
            return;
        chunks.push({
            id: crypto.randomUUID(),
            content: cur.trim(),
            token_count: tokenCount(cur),
            section_title: sectionTitle ?? undefined,
        });
    };
    for (const s of sentences) {
        const sTokens = tokenCount(s);
        if (curTokens > 0 && curTokens + sTokens > maxTokens && curTokens >= minTokens) {
            flush();
            // Overlap: rewind ~overlapTokens worth of text
            const words = cur.split(/\s+/);
            const keep = Math.max(1, Math.floor(overlapTokens / 4));
            cur = words.slice(-keep).join(' ') + ' ' + s;
            curTokens = tokenCount(cur);
        }
        else {
            cur = cur ? cur + ' ' + s : s;
            curTokens += sTokens;
        }
    }
    flush();
    return chunks;
}
function chunkText(text, options) {
    const minTokens = options?.minTokens ?? 300;
    const maxTokens = options?.maxTokens ?? 500;
    const overlapTokens = options?.overlapTokens ?? 50;
    const sections = splitSections(text);
    const chunks = [];
    for (const s of sections) {
        const t = tokenCount(s.body);
        if (t <= maxTokens) {
            chunks.push({
                id: crypto.randomUUID(),
                content: s.body,
                token_count: t,
                section_title: s.title ?? undefined,
            });
        }
        else {
            chunks.push(...splitIntoChunks(s.title, s.body, minTokens, maxTokens, overlapTokens));
        }
    }
    return chunks;
}
//# sourceMappingURL=chunker.js.map