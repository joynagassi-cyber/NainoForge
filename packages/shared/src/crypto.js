"use strict";
// ─── Crypto helpers — Web Crypto API only ────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashMessage = hashMessage;
async function hashMessage(message) {
    const data = new TextEncoder().encode(message);
    const hashBuf = await crypto.subtle.digest('SHA-256', data);
    const bytes = new Uint8Array(hashBuf);
    return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}
//# sourceMappingURL=crypto.js.map