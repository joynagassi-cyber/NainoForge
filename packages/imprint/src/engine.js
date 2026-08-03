import { evaluateCrank } from './contracts.js';
export class ImprintEngine {
    async generateImprint(source, content) {
        const evaluation = evaluateCrank({ content, conceptCount: 1 });
        const word_count = content.split(/\s+/).filter(Boolean).length;
        return {
            id: crypto.randomUUID(),
            source_id: source.id,
            concept_id: source.id,
            content,
            word_count,
            cran_level: evaluation.cran,
            quality_score: evaluation.iqs,
            bloom_level: evaluation.bloom_level,
            concept_coverage_pct: evaluation.concept_coverage_pct,
            created_at: Date.now(),
        };
    }
    async evaluateCrank(content) {
        const evaluation = evaluateCrank({ content });
        return { level: evaluation.cran, wordCount: evaluation.word_count };
    }
}
//# sourceMappingURL=engine.js.map