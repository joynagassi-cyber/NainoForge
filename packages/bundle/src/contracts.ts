// ─── Bundle export contracts ──────────────────────────────────
// Serialise captured content + learned artefacts for offline/portable use.

import type { SourceLike, NoteLike } from '@nainoforge/core';

// Re-export for backwards compatibility
export type { SourceLike, NoteLike };

export type BundleFormat = 'json' | 'markdown' | 'anki' | 'pdf';

export interface ExportBundle {
  format: BundleFormat;
  sources: SourceLike[];
  notes: NoteLike[];
  exported_at: number;
}

export interface IBundleExporter {
  build(sources: SourceLike[], notes: NoteLike[]): ExportBundle;
  render(bundle: ExportBundle): string;
}
