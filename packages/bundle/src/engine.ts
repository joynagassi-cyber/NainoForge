// ponytail: bundle exporter — JSON and Markdown only, Anki/PDF deferred.

import type { CapturedSource } from '@nainoforge/core/domain.js';
import type { ImprintNote } from '@nainoforge/core/domain.js';
import type { ExportBundle, IBundleExporter, BundleFormat } from './contracts.js';

export class BundleExporter implements IBundleExporter {
  build(sources: CapturedSource[], notes: ImprintNote[]): ExportBundle {
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
      default:
        // ponytail: anki/pdf — return JSON as placeholder.
        return JSON.stringify(bundle, null, 2);
    }
  }

  private renderMarkdown(bundle: ExportBundle): string {
    const lines: string[] = ['# NainoForge Export', '', `> ${new Date(bundle.exported_at).toISOString()}`, ''];
    for (const note of bundle.notes) {
      lines.push(`## ${note.content_markdown ? note.content_markdown.slice(0, 80) : 'Note'}`, '');
      lines.push(note.content, '');
      lines.push(`*Cran: ${note.cran_level} · IQS: ${note.quality_score}*`, '');
    }
    return lines.join('\n');
  }
}
