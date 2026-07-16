import type { DCM } from '@nainoforge/shared/src/types.js';
export interface ArticleExtractResult {
    dcm: DCM;
    word_count: number;
    extraction_confidence: number;
}
export declare function extractArticle(doc: Document, sourceUrl: string): ArticleExtractResult;
