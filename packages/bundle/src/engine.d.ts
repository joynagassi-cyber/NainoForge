import type { ExportBundle, IBundleExporter, SourceLike, NoteLike } from './contracts.js';
export declare class BundleExporter implements IBundleExporter {
    build(sources: SourceLike[], notes: NoteLike[]): ExportBundle;
    render(bundle: ExportBundle): string;
    private renderMarkdown;
    private renderAnki;
    private renderPdfPlaceholder;
}
