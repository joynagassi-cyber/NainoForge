export interface SummarizeInput {
    text: string;
    maxTokens?: number;
}
export interface SummarizeOutput {
    summary: string;
    keyPoints: string[];
}
export interface Concept {
    name: string;
    relevance: number;
}
export interface ExtractConceptsInput {
    text: string;
    maxConcepts?: number;
}
export interface ExtractConceptsOutput {
    concepts: Concept[];
}
