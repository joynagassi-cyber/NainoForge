import { describe, it, expect } from 'vitest';
import { summarize, extractConcepts } from '../summarizer.js';

describe('summarize', () => {
  it('returns first 3 sentences as summary', () => {
    const text = 'Alpha is the first. Beta is the second. Gamma is the third. Delta is extra.';
    const out = summarize({ text });
    expect(out.summary).toContain('Alpha');
    expect(out.summary).toContain('Beta');
    expect(out.summary).toContain('Gamma');
    expect(out.summary).not.toContain('Delta');
  });

  it('returns up to 2 key points', () => {
    const text = 'Point one here. Point two here. Third point.';
    const out = summarize({ text });
    expect(out.keyPoints.length).toBeLessThanOrEqual(2);
  });

  it('returns summary as-is for short single-block text without punctuation', () => {
    const text = 'no punctuation here just words';
    const out = summarize({ text, maxTokens: 10 });
    // sentences() treats the full string as one block when no splitter is present
    expect(out.summary).toBe(text);
  });
});

describe('extractConcepts', () => {
  it('extracts capitalized candidates', () => {
    const text = 'Jean-Michel studied Thermodynamics and Quantum Mechanics at Stanford University.';
    const out = extractConcepts({ text });
    const names = out.concepts.map((c) => c.name);
    expect(names.some((n) => n.toLowerCase().includes('thermodynamics'))).toBe(true);
  });

  it('deduplicates case-insensitively', () => {
    const text = 'React react REACT are all the same framework.';
    const out = extractConcepts({ text });
    const names = out.concepts.map((c) => c.name.toLowerCase());
    const reactCount = names.filter((n) => n === 'react').length;
    expect(reactCount).toBeLessThanOrEqual(1);
  });

  it('respects maxConcepts cap', () => {
    const text = Array.from({ length: 20 }, (_, i) => `Alpha${i} is a concept.`).join(' ');
    const out = extractConcepts({ text, maxConcepts: 3 });
    expect(out.concepts.length).toBeLessThanOrEqual(3);
  });
});
