/**
 * UUID v7 — RFC 4122 compliant, no external deps.
 *
 * Timestamp occupies the first 48 bits (unix ms).
 * Version nibble (0x7) is placed in the high nibble of byte 6.
 * Variant bits (10xx) are placed in byte 8.
 * Remaining bytes are random.
 */

const HEX = '0123456789abcdef';

function byteToHex(b: number): string {
  return HEX[(b >> 4) & 0x0f] + HEX[b & 0x0f];
}

export function uuidv7(): string {
  const now = Date.now();
  const bytes = new Uint8Array(16);

  // 48-bit timestamp
  for (let i = 0; i < 6; i++) {
    bytes[i] = (now / Math.pow(2, 40 - i * 8)) & 0xff;
  }

  // version 7 in high nibble of byte 6
  bytes[6] = 0x70 | (bytes[6] & 0x0f);

  // remaining timestamp-prefixed byte
  bytes[7] = (now / Math.pow(2, 0)) & 0xff;

  // variant RFC 4122 => 10xx xxxx
  crypto.getRandomValues(bytes.subarray(8, 16));
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
