// ponytail: bundle exporter — JSON, Markdown, Anki placeholder, PDF placeholder.
// Real Anki APKG/PDF export is deferred; formats are explicit stubs with metadata.

import type { BundleFormat, ExportBundle, IBundleExporter, SourceLike, NoteLike } from './contracts.js';

export class BundleExporter implements IBundleExporter {
  build(sources: SourceLike[], notes: NoteLike[]): ExportBundle {
    return {
      format: 'json',
      sources,
      notes,
      exported_at: Date.now(),
    };
  }

  render(bundle: ExportBundle): string {
    switch (bundle.format) {
      case 'json':
        return JSON.stringify(bundle, null, 2);
      case 'markdown':
        return this.renderMarkdown(bundle);
      case 'anki':
        return this.renderAnki(bundle);
      case 'pdf':
        return this.renderPdfPlaceholder(bundle);
      default:
        return JSON.stringify(bundle, null, 2);
    }
  }

  private renderMarkdown(bundle: ExportBundle): string {
    const lines: string[] = ['# NainoForge Export', '', `> ${new Date(bundle.exported_at).toISOString()}`, ''];
    for (const source of bundle.sources) {
      lines.push(`## ${source.title ?? 'Source'}`, '');
      if (source.content_markdown) {
        lines.push(source.content_markdown, '');
      }
    }
    for (const note of bundle.notes) {
      lines.push(`## ${note.content ? note.content.slice(0, 80) : 'Note'}`, '');
      lines.push(note.content, '');
      lines.push(`*Cran: ${note.cran_level} · IQS: ${note.quality_score}*`, '');
    }
    return lines.join('\n');
  }

  private renderAnki(bundle: ExportBundle): string {
    const cards = bundle.notes.map((note, idx) => ({
      Front: note.content.slice(0, 120),
      Back: note.content,
      Tags: [`nainoforge`, `cran-${note.cran_level}`, `iqs-${Math.round(note.quality_score)}`],
    }));

    return [
      '# Anki Deck Export — NainoForge',
      '',
      `> Generated: ${new Date(bundle.exported_at).toISOString()}`,
      `> Cards: ${cards.length}`,
      '',
      '## Cards (TSV-ready)',
      '',
      'Front\tBack\tTags',
      ...cards.map((c) => `${c.Front}\t${c.Back}\t${c.Tags.join(' ')}`),
    ].join('\n');
  }

  private renderPdfPlaceholder(bundle: ExportBundle): string {
    const summary = {
      format: 'pdf',
      exported_at: bundle.exported_at,
      sources: bundle.sources.length,
      notes: bundle.notes.length,
      note: 'PDF export requires a renderer/build step; use JSON/Markdown exports for now.',
    };
    return JSON.stringify(summary, null, 2);
  }
}
