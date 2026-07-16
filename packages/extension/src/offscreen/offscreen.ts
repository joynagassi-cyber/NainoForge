import { extractTextFromPDF } from './pdf.js';

function isPDFPayload(msg: unknown): msg is { type: 'extract-pdf'; arrayBuffer: ArrayBuffer; filename: string } {
  return typeof msg === 'object' && msg !== null && (msg as Record<string, unknown>).type === 'extract-pdf';
}

chrome.runtime.onMessage.addListener((msg: unknown, _sender: unknown, sendResponse: unknown) => {
  if (isPDFPayload(msg)) {
    extractTextFromPDF(msg.arrayBuffer, msg.filename)
      .then(result => (sendResponse as (r: unknown) => void)({ ok: true, result }))
      .catch(err => (sendResponse as (r: unknown) => void)({ ok: false, error: String(err) }));
    return true; // async response
  }
  return false;
});

console.log('Offscreen document loaded');
