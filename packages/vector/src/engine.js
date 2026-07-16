"use strict";
// ponytail: in-memory cosine-search, good enough for MVP prototype.
// L2 norm per query is cached for the duration of a single search call.
Object.defineProperty(exports, "__esModule", { value: true });
exports.VectorStore = void 0;
function dot(a, b) {
    let s = 0;
    for (let i = 0; i < a.length; i++)
        s += a[i] * b[i];
    return s;
}
function norm(a) {
    return Math.sqrt(dot(a, a));
}
class VectorStore {
    records = [];
    upsert(record) {
        const idx = this.records.findIndex((r) => r.id === record.id);
        if (idx >= 0)
            this.records[idx] = record;
        else
            this.records.push(record);
    }
    search(query, topK = 5) {
        const qNorm = norm(query);
        if (qNorm === 0)
            return [];
        const scored = this.records
            .map((r) => ({ record: r, score: dot(query, r.embedding) / (qNorm * norm(r.embedding)) }))
            .filter((s) => Number.isFinite(s.score))
            .sort((a, b) => b.score - a.score)
            .slice(0, topK);
        return scored;
    }
    remove(id) {
        this.records = this.records.filter((r) => r.id !== id);
    }
    clear() {
        this.records = [];
    }
}
exports.VectorStore = VectorStore;
//# sourceMappingURL=engine.js.map