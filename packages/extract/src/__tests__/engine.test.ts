import { describe, it, expect, vi } from 'vitest';
import { FormatDetector, TextExtractor } from '../engine.js';

describe('FormatDetector', () => {
  const d = new FormatDetector();

  it('detects by extension', () => {
    expect(d.detectFromExtension('notes.pdf')).toBe('pdf');
    expect(d.detectFromExtension('readme.md')).toBe('md');
    expect(d.detectFromExtension('data.unknown')).toBe('unknown');
  });

  it('detects by mime', () => {
    expect(d.detectFromMime('application/pdf')).toBe('pdf');
    expect(d.detectFromMime('text/plain')).toBe('txt');
    expect(d.detectFromMime('application/zip')).toBe('unknown');
  });
});

describe('TextExtractor', () => {
  const ex = new TextExtractor();

  it('extracts text from txt File', async () => {
    const file = new File(['hello world'], 'a.txt', { type: 'text/plain' });
    const result = await ex.extract(file, 'txt');
    expect(result.format).toBe('txt');
    expect(result.text).toBe('hello world');
  });

  it('extracts text from md File', async () => {
    const file = new File(['# Title\n\nbody'], 'a.md', { type: 'text/markdown' });
    const result = await ex.extract(file, 'md');
    expect(result.format).toBe('md');
    expect(result.text).toContain('Title');
  });

  it('returns explicit stub for unsupported format', async () => {
    const blob = new Blob(['x'], { type: 'application/epub+zip' });
    const result = await ex.extract(blob, 'epub');
    expect((result.metadata as any).stub).toBe(true);
  });

  it('pdf extraction falls back gracefully on failure', async () => {
    const bad = new Blob(['not-a-pdf'], { type: 'application/pdf' });
    const result = await ex.extract(bad, 'pdf');
    expect(result.format).toBe('pdf');
    expect(result.text).toContain('[pdf extraction failed');
  });
});
