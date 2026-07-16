"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const engine_js_1 = require("../engine.js");
(0, vitest_1.describe)('ConceptGraph', () => {
    const graph = new engine_js_1.ConceptGraph();
    (0, vitest_1.it)('adds and retrieves concepts', () => {
        graph.addConcept({ id: 'c1', label: 'A', description: '', source_ids: [] });
        (0, vitest_1.expect)(graph.getConcept('c1')?.label).toBe('A');
        (0, vitest_1.expect)(graph.getConcept('missing')).toBeUndefined();
    });
    (0, vitest_1.it)('tracks relations and neighbors', () => {
        graph.addConcept({ id: 'c2', label: 'B', description: '', source_ids: [] });
        graph.addRelation({ id: 'r1', from_id: 'c1', to_id: 'c2', type: 'prereq', weight: 0.9 });
        (0, vitest_1.expect)(graph.getRelations('c1')).toHaveLength(1);
        (0, vitest_1.expect)(graph.neighbors('c1').map((c) => c.id)).toEqual(['c2']);
    });
    (0, vitest_1.it)('topologicalSort orders prereqs before dependents', () => {
        graph.addConcept({ id: 'c3', label: 'C', description: '', source_ids: [] });
        graph.addRelation({ id: 'r2', from_id: 'c2', to_id: 'c3', type: 'prereq', weight: 1 });
        const order = graph.topologicalSort().map((c) => c.id);
        (0, vitest_1.expect)(order.indexOf('c1')).toBeLessThan(order.indexOf('c2'));
        (0, vitest_1.expect)(order.indexOf('c2')).toBeLessThan(order.indexOf('c3'));
    });
});
//# sourceMappingURL=engine.test.js.map