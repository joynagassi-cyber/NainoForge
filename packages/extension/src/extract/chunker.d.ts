export interface Chunk {
    id: string;
    content: string;
    token_count: number;
    section_title?: string;
}
export declare function chunkText(text: string, options?: {
    minTokens?: number;
    maxTokens?: number;
    overlapTokens?: number;
}): Chunk[];
