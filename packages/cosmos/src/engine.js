"use strict";
// ponytail: minimal COSMOS concept graph — stdlib only, O(n²) sort fine for MVP.
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConceptGraph = void 0;
class ConceptGraph {
    concepts = new Map();
    relations = [];
    adjacency = new Map();
    addConcept(c) {
        this.concepts.set(c.id, c);
        if (!this.adjacency.has(c.id))
            this.adjacency.set(c.id, []);
    }
    addRelation(r) {
        this.relations.push(r);
        const list = this.adjacency.get(r.from_id) ?? [];
        list.push(r);
        this.adjacency.set(r.from_id, list);
    }
    getConcept(id) {
        return this.concepts.get(id);
    }
    getRelations(from_id) {
        return this.relations.filter((r) => r.from_id === from_id);
    }
    neighbors(id) {
        const rels = this.adjacency.get(id) ?? [];
        return rels.map((r) => this.concepts.get(r.to_id)).filter((c) => c !== undefined);
    }
    // ponytail: Kahn's algorithm simplified — only prerequisite edges.
    topologicalSort() {
        const inDegree = new Map();
        for (const c of this.concepts.keys())
            inDegree.set(c, 0);
        for (const r of this.relations) {
            if (r.type === 'prereq')
                inDegree.set(r.to_id, (inDegree.get(r.to_id) ?? 0) + 1);
        }
        const queue = [];
        for (const [id, d] of inDegree.entries()) {
            if (d === 0)
                queue.push(id);
        }
        const sorted = [];
        while (queue.length > 0) {
            const n = queue.shift();
            sorted.push(n);
            for (const r of this.relations) {
                if (r.from_id === n && r.type === 'prereq') {
                    const next = r.to_id;
                    inDegree.set(next, (inDegree.get(next) ?? 1) - 1);
                    if (inDegree.get(next) === 0)
                        queue.push(next);
                }
            }
        }
        return sorted.map((id) => this.concepts.get(id)).filter(Boolean);
    }
}
exports.ConceptGraph = ConceptGraph;
//# sourceMappingURL=engine.js.map