import { describe, it, expect } from 'vitest';
import { BundleExporter } from '../engine.js';
import type { SourceLike, NoteLike } from '../contracts.js';

const SOURCE: SourceLike = {
  id: 'src-1',
  title: 'Test',
  content_markdown: '# Test',
  source_type: 'web_article',
};

const NOTE: NoteLike = {
  id: 'note-1',
  source_id: 'src-1',
  concept_id: 'c-1',
  content: 'contenu de la note',
  cran_level: 3,
  quality_score: 70,
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

  it('render anki returns TSV-like card format', () => {
    const bundle = exporter.build([SOURCE], [NOTE]);
    bundle.format = 'anki';
    const out = exporter.render(bundle);
    expect(out).toContain('Front\tBack\tTags');
    expect(out).toContain('nainoforge');
  });

  it('render pdf returns structured JSON placeholder', () => {
    const bundle = exporter.build([SOURCE], [NOTE]);
    bundle.format = 'pdf';
    const out = exporter.render(bundle);
    expect(() => JSON.parse(out)).not.toThrow();
    expect(JSON.parse(out).format).toBe('pdf');
  });
});
