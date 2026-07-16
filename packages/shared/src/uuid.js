"use strict";
/**
 * UUID v7 — RFC 4122 compliant, no external deps.
 *
 * Timestamp occupies the first 48 bits (unix ms).
 * Version nibble (0x7) is placed in the high nibble of byte 6.
 * Variant bits (10xx) are placed in byte 8.
 * Remaining bytes are random.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.uuidv7 = uuidv7;
const HEX = '0123456789abcdef';
function byteToHex(b) {
    return HEX[(b >> 4) & 0x0f] + HEX[b & 0x0f];
}
function uuidv7() {
    const now = Date.now();
    const bytes = new Uint8Array(16);
    // 48-bit timestamp big-endian dans bytes[0..5]
    for (let i = 0; i < 6; i++) {
        bytes[i] = (now / Math.pow(2, 40 - i * 8)) & 0xff;
    }
    // 12 bits aléatoires (rand_a)
    const randA = crypto.getRandomValues(new Uint8Array(2));
    // byte 6: version 0x7 en nibble haut | rand_a[11:8] en nibble bas
    bytes[6] = 0x70 | (randA[0] & 0x0f);
    // byte 7: rand_a[7:0]
    bytes[7] = randA[1];
    // reste aléatoire (bytes 8..15)
    crypto.getRandomValues(bytes.subarray(8, 16));
    // variant RFC 4122 => 10xx xxxx sur byte 8
    bytes[8] = 0x80 | (bytes[8] & 0x3f);
    return [
        byteToHex(bytes[0]),
        byteToHex(bytes[1]),
        byteToHex(bytes[2]),
        byteToHex(bytes[3]),
        '-',
        byteToHex(bytes[4]),
        byteToHex(bytes[5]),
        byteToHex(bytes[6]),
        byteToHex(bytes[7]),
        '-',
        byteToHex(bytes[8]),
        byteToHex(bytes[9]),
        byteToHex(bytes[10]),
        '-',
        byteToHex(bytes[11]),
        byteToHex(bytes[12]),
        byteToHex(bytes[13]),
    ].join('');
}
//# sourceMappingURL=uuid.js.map