// ─── Bundle export contracts ──────────────────────────────────
// Serialise captured content + learned artefacts for offline/portable use.

import type { CapturedSource } from '@nainoforge/core/domain.js';
import type { ImprintNote } from '@nainoforge/core/domain.js';

export type BundleFormat = 'json' | 'markdown' | 'anki' | 'pdf';

export interface ExportBundle {
  format: BundleFormat;
  sources: CapturedSource[];
  notes: ImprintNote[];
  exported_at: number;
}

export interface IBundleExporter {
  build(sources: CapturedSource[], notes: ImprintNote[]): ExportBundle;
  render(bundle: ExportBundle): string;
}
