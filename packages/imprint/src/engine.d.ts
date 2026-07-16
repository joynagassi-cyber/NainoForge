interface SourceLike {
    id: string;
    title?: string;
}
export interface ImprintNote {
    id: string;
    source_id: string;
    concept_id: string;
    content: string;
    word_count: number;
    cran_level: number;
    quality_score: number;
    bloom_level?: string;
    concept_coverage_pct?: number;
    created_at: number;
}
export declare class ImprintEngine {
    generateImprint(source: SourceLike, content: string): Promise<ImprintNote>;
    evaluateCrank(content: string): Promise<{
        level: number;
        wordCount: number;
    }>;
}
export {};
