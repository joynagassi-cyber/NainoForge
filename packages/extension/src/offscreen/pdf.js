"use strict";
// ─── PDF Extraction — Offscreen Document ─────────────────────
// Uses pdfjs-dist (no worker: main-thread fallback for MV3 CSP).
// Returns a DCM-shaped record; invoked via chrome.runtime message.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractTextFromPDF = extractTextFromPDF;
// pdfjs-dist v6 entry
const pdfjsLib = __importStar(require("pdfjs-dist"));
// Disable worker: MV3 offscreen cannot load a separate worker script from this context easily.
// Main-thread parsing is slower but acceptable for S1 batch sizes.
pdfjsLib.GlobalWorkerOptions.workerSrc = '';
async function extractTextFromPDF(arrayBuffer, filename) {
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer.slice(0) });
    const pdf = await loadingTask.promise;
    const pageCount = pdf.numPages;
    let fullText = '';
    for (let i = 1; i <= pageCount; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items
            .map(item => ('str' in item ? item.str : '')).join('');
        fullText += pageText + '\n';
        if (i < pageCount)
            fullText += '\n---\n';
    }
    const dcm = {
        id: crypto.randomUUID(),
        title: filename.replace(/\.[^.]+$/, '') || filename,
        content_markdown: fullText.trim(),
        source_url: '',
        source_type: 'pdf',
        metadata: {
            filename,
            page_count: pageCount,
        },
        captured_at: Date.now(),
    };
    return { dcm };
}
//# sourceMappingURL=pdf.js.map