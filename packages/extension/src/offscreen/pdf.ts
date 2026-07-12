// ─── PDF Extraction — Offscreen Document ─────────────────────
// Uses pdfjs-dist (no worker: main-thread fallback for MV3 CSP).
// Returns a DCM-shaped record; invoked via chrome.runtime message.

import type { DCM } from '@nainoforge/shared/src/types.js';

// pdfjs-dist v6 entry
import * as pdfjsLib from 'pdfjs-dist';

// Disable worker: MV3 offscreen cannot load a separate worker script from this context easily.
// Main-thread parsing is slower but acceptable for S1 batch sizes.
pdfjsLib.GlobalWorkerOptions.workerSrc = '';

export interface ExtractPdfResult {
  dcm: DCM;
}

export async function extractTextFromPDF(arrayBuffer: ArrayBuffer, filename: string): Promise<ExtractPdfResult> {
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer.slice(0) });
  const pdf = await loadingTask.promise;
  const pageCount = pdf.numPages;

  let fullText = '';
  for (let i = 1; i <= pageCount; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map(item => ('str' in item ? (item as { str: string }).str : '')).join('');
    fullText += pageText + '\n';
    if (i < pageCount) fullText += '\n---\n';
  }

  const dcm: DCM = {
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
