import { describe, it, expect } from 'vitest';
import { ImprintEngine, evaluateCrank } from '../index.js';
import type { CapturedSource } from '@nainoforge/core/src/domain.js';

const source: CapturedSource = {
  id: 'src-1',
  source_type: 'web_article',
  title: 'Test Article',
  url: 'https://example.com/test',
  content_markdown: '# Test content\n\nBody here.',
  metadata: {},
  privacy_level: 'public',
  status: 'ready',
  created_at: Date.now(),
};

const engine = new ImprintEngine();

describe('ImprintEngine.generateImprint', () => {
  it('returns ImprintNote with cran level derived from content depth', async () => {
    const content = 'This is a topic. Because it connects ideas. For example, code demonstrates it. Such as tests.';
    const note = await engine.generateImprint(source, content);
    expect(note.source_id).toBe('src-1');
    expect(note.cran_level).toBeGreaterThanOrEqual(1);
    expect(note.cran_level).toBeLessThanOrEqual(5);
    expect(note.quality_score).toBeGreaterThanOrEqual(0);
    expect(note.quality_score).toBeLessThanOrEqual(100);
  });

  it('returns blossom level when taxonomy signal detected', async () => {
    const content = 'We apply the function to solve real problems. We analyze the results.';
    const note = await engine.generateImprint(source, content);
    expect(note.bloom_level).toBe('analyze');
  });

  it('evaluateCrank marks has_example when example connectors present', async () => {
    const content = 'For instance, consider the following test case.';
    const evaluation = evaluateCrank({ content });
    expect(evaluation.has_example).toBe(true);
  });

  it('evaluateCrank marks has_analogy when analogy markers present', async () => {
    const content = 'A function is like a machine that transforms input to output.';
    const evaluation = evaluateCrank({ content });
    expect(evaluation.has_analogy).toBe(true);
  });

  it('word_count reflects actual word count', async () => {
    const content = 'one two three four five six seven eight nine ten';
    const note = await engine.generateImprint(source, content);
    expect(note.word_count).toBe(10);
  });
});

describe('ImprintEngine.evaluateCrank', () => {
  it('returns level and wordCount', async () => {
    const result = await engine.evaluateCrank('Analyze the data carefully and compare results.');
    expect(result.level).toBeGreaterThanOrEqual(1);
    expect(result.level).toBeLessThanOrEqual(5);
    expect(result.wordCount).toBeGreaterThan(0);
  });
});
