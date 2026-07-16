import type { DCM } from '@nainoforge/shared/src/types.js';
export interface ExtractPdfResult {
    dcm: DCM;
}
export declare function extractTextFromPDF(arrayBuffer: ArrayBuffer, filename: string): Promise<ExtractPdfResult>;
