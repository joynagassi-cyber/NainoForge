import type { Concept, Relation, IConceptGraph } from './contracts.js';
export declare class ConceptGraph implements IConceptGraph {
    private concepts;
    private relations;
    private adjacency;
    addConcept(c: Concept): void;
    addRelation(r: Relation): void;
    getConcept(id: string): Concept | undefined;
    getRelations(from_id: string): Relation[];
    neighbors(id: string): Concept[];
    topologicalSort(): Concept[];
}
