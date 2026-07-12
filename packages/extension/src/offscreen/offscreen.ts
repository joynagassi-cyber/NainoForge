import { extractTextFromPDF } from './pdf.js';

function isPDFPayload(msg: unknown): msg is { type: 'extract-pdf'; arrayBuffer: ArrayBuffer; filename: string } {
  return typeof msg === 'object' && msg !== null && (msg as Record<string, unknown>).type === 'extract-pdf';
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (isPDFPayload(msg)) {
    extractTextFromPDF(msg.arrayBuffer, msg.filename)
      .then(result => sendResponse({ ok: true, result }))
      .catch(err => sendResponse({ ok: false, error: String(err) }));
    return true; // async response
  }
  return false;
});

console.log('Offscreen document loaded');
