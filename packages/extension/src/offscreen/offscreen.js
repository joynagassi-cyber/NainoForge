"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pdf_js_1 = require("./pdf.js");
function isPDFPayload(msg) {
    return typeof msg === 'object' && msg !== null && msg.type === 'extract-pdf';
}
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (isPDFPayload(msg)) {
        (0, pdf_js_1.extractTextFromPDF)(msg.arrayBuffer, msg.filename)
            .then(result => sendResponse({ ok: true, result }))
            .catch(err => sendResponse({ ok: false, error: String(err) }));
        return true; // async response
    }
    return false;
});
console.log('Offscreen document loaded');
//# sourceMappingURL=offscreen.js.map