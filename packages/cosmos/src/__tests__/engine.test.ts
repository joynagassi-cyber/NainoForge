import { describe, it, expect } from 'vitest';
import { ConceptGraph } from '../engine.js';

describe('ConceptGraph', () => {
  const graph = new ConceptGraph();

  it('adds and retrieves concepts', () => {
    graph.addConcept({ id: 'c1', label: 'A', description: '', source_ids: [] });
    expect(graph.getConcept('c1')?.label).toBe('A');
    expect(graph.getConcept('missing')).toBeUndefined();
  });

  it('tracks relations and neighbors', () => {
    graph.addConcept({ id: 'c2', label: 'B', description: '', source_ids: [] });
    graph.addRelation({ id: 'r1', from_id: 'c1', to_id: 'c2', type: 'prereq', weight: 0.9 });
    expect(graph.getRelations('c1')).toHaveLength(1);
    expect(graph.neighbors('c1').map((c) => c.id)).toEqual(['c2']);
  });

  it('topologicalSort orders prereqs before dependents', () => {
    graph.addConcept({ id: 'c3', label: 'C', description: '', source_ids: [] });
    graph.addRelation({ id: 'r2', from_id: 'c2', to_id: 'c3', type: 'prereq', weight: 1 });
    const order = graph.topologicalSort().map((c) => c.id);
    expect(order.indexOf('c1')).toBeLessThan(order.indexOf('c2'));
    expect(order.indexOf('c2')).toBeLessThan(order.indexOf('c3'));
  });
});
