/**
 * UUID v7 — RFC 4122 compliant, no external deps.
 *
 * Timestamp occupies the first 48 bits (unix ms).
 * Version nibble (0x7) is placed in the high nibble of byte 6.
 * Variant bits (10xx) are placed in byte 8.
 * Remaining bytes are random.
 */
export declare function uuidv7(): string;
