// ─── Crypto helpers — Web Crypto API only ────────────────────

export async function hashMessage(message: string): Promise<string> {
  const data = new TextEncoder().encode(message);
  const hashBuf = await crypto.subtle.digest('SHA-256', data);
  const bytes = new Uint8Array(hashBuf);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}
