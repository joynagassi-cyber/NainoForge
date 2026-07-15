import { describe, it, expect } from 'vitest';
import { BundleExporter } from '../engine.js';
import type { CapturedSource, ImprintNote } from '@nainoforge/core/domain.js';

const SOURCE: CapturedSource = {
  id: 'src-1',
  source_type: 'web_article',
  title: 'Test',
  content_markdown: '# Test',
  content_hash: 'abc',
  metadata: {},
  privacy_level: 'personal',
  status: 'ready',
  created_at: Date.now(),
};

const NOTE: ImprintNote = {
  id: 'note-1',
  source_id: 'src-1',
  concept_id: 'c-1',
  content: 'contenu de la note',
  word_count: 4,
  cran_level: 3,
  quality_score: 70,
  created_at: Date.now(),
};

describe('BundleExporter', () => {
  const exporter = new BundleExporter();

  it('build returns bundle with exported_at', () => {
    const bundle = exporter.build([SOURCE], [NOTE]);
    expect(bundle.sources).toHaveLength(1);
    expect(bundle.notes).toHaveLength(1);
    expect(bundle.exported_at).toBeGreaterThan(0);
  });

  it('render produces valid JSON for json format', () => {
    const bundle = exporter.build([SOURCE], [NOTE]);
    bundle.format = 'json';
    const out = exporter.render(bundle);
    expect(() => JSON.parse(out)).not.toThrow();
  });

  it('render markdown starts with heading', () => {
    const bundle = exporter.build([SOURCE], [NOTE]);
    bundle.format = 'markdown';
    const out = exporter.render(bundle);
    expect(out.startsWith('# NainoForge Export')).toBe(true);
  });
});
