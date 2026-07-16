// ─── Bundle export contracts ──────────────────────────────────
// Serialise captured content + learned artefacts for offline/portable use.
// Local interfaces avoid cross-package build coupling (same pattern as imprint).

export type BundleFormat = 'json' | 'markdown' | 'anki' | 'pdf';

export interface SourceLike {
  id: string;
  title?: string;
  content_markdown?: string;
  source_type?: string;
}

export interface NoteLike {
  id: string;
  source_id: string;
  concept_id: string;
  content: string;
  cran_level: number;
  quality_score: number;
}

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
