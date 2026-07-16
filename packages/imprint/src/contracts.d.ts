export interface CrankEvaluation {
    cran: 1 | 2 | 3 | 4 | 5;
    iqs: number;
    word_count: number;
    bloom_level?: string;
    concept_coverage_pct?: number;
    has_example: boolean;
    has_analogy: boolean;
}
export interface ImprintEvaluationInput {
    content: string;
    conceptCount?: number;
}
export interface ImprintNoteInput {
    sourceId: string;
    conceptId: string;
    content: string;
}
export declare function evaluateCrank(input: ImprintEvaluationInput): CrankEvaluation;
