"use strict";
// ponytail: bundle exporter — JSON, Markdown, Anki placeholder, PDF placeholder.
// Real Anki APKG/PDF export is deferred; formats are explicit stubs with metadata.
Object.defineProperty(exports, "__esModule", { value: true });
exports.BundleExporter = void 0;
class BundleExporter {
    build(sources, notes) {
        return {
            format: 'json',
            sources,
            notes,
            exported_at: Date.now(),
        };
    }
    render(bundle) {
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
    renderMarkdown(bundle) {
        const lines = ['# NainoForge Export', '', `> ${new Date(bundle.exported_at).toISOString()}`, ''];
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
    renderAnki(bundle) {
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
    renderPdfPlaceholder(bundle) {
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
exports.BundleExporter = BundleExporter;
//# sourceMappingURL=engine.js.map