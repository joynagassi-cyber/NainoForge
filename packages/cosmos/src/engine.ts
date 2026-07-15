// ponytail: minimal COSMOS concept graph — stdlib only, O(n²) sort fine for MVP.

import type { Concept, Relation, IConceptGraph } from './contracts.js';

export class ConceptGraph implements IConceptGraph {
  private concepts = new Map<string, Concept>();
  private relations: Relation[] = [];
  private adjacency = new Map<string, Relation[]>();

  addConcept(c: Concept): void {
    this.concepts.set(c.id, c);
    if (!this.adjacency.has(c.id)) this.adjacency.set(c.id, []);
  }

  addRelation(r: Relation): void {
    this.relations.push(r);
    const list = this.adjacency.get(r.from_id) ?? [];
    list.push(r);
    this.adjacency.set(r.from_id, list);
  }

  getConcept(id: string): Concept | undefined {
    return this.concepts.get(id);
  }

  getRelations(from_id: string): Relation[] {
    return this.relations.filter((r) => r.from_id === from_id);
  }

  neighbors(id: string): Concept[] {
    const rels = this.adjacency.get(id) ?? [];
    return rels.map((r) => this.concepts.get(r.to_id)).filter((c): c is Concept => c !== undefined);
  }

  // ponytail: Kahn's algorithm simplified — only prerequisite edges.
  topologicalSort(): Concept[] {
    const inDegree = new Map<string, number>();
    for (const c of this.concepts.keys()) inDegree.set(c, 0);
    for (const r of this.relations) {
      if (r.type === 'prereq') inDegree.set(r.to_id, (inDegree.get(r.to_id) ?? 0) + 1);
    }
    const queue: string[] = [];
    for (const [id, d] of inDegree.entries()) {
      if (d === 0) queue.push(id);
    }
    const sorted: string[] = [];
    while (queue.length > 0) {
      const n = queue.shift()!;
      sorted.push(n);
      for (const r of this.relations) {
        if (r.from_id === n && r.type === 'prereq') {
          const next = r.to_id;
          inDegree.set(next, (inDegree.get(next) ?? 1) - 1);
          if (inDegree.get(next) === 0) queue.push(next);
        }
      }
    }
    return sorted.map((id) => this.concepts.get(id)!).filter(Boolean);
  }
}
