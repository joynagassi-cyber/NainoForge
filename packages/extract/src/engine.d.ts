import type { SupportedFormat, IFormatDetector, ExtractedText, ITextExtractor } from './contracts.js';
export declare class FormatDetector implements IFormatDetector {
    detectFromExtension(filename: string): SupportedFormat;
    detectFromMime(mime: string): SupportedFormat;
}
export declare class TextExtractor implements ITextExtractor {
    #private;
    extract(file: File | Blob, format: SupportedFormat): Promise<ExtractedText>;
}
