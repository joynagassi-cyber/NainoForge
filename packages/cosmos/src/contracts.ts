// ─── COSMOS — Concept Space ───────────────────────────────────
// Minimal in-memory concept graph.  Relations are typed edges.

export interface Concept {
  id: string;
  label: string;
  description: string;
  source_ids: string[];
}

export type RelationType = 'prereq' | 'related' | 'contradicts' | 'example_of' | 'generalizes';

export interface Relation {
  id: string;
  from_id: string;
  to_id: string;
  type: RelationType;
  weight: number; // 0..1
}

export interface IConceptGraph {
  addConcept(c: Concept): void;
  addRelation(r: Relation): void;
  getConcept(id: string): Concept | undefined;
  getRelations(from_id: string): Relation[];
  neighbors(id: string): Concept[];
  topologicalSort(): Concept[];
}
