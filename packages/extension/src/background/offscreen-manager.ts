/**
 * Offscreen document manager.
 *
 * Creates the offscreen document once and caches the handle.
 * Re-creating an already-existing offscreen document throws in Chrome,
 * so we guard with a check before each call.
 */

async function createOffscreen(): Promise<void> {
  try {
    await chrome.offscreen.createDocument({
      url: 'offscreen/offscreen.html',
      reasons: [chrome.offscreen.Reason.DOM_PARSER],
      justification: 'Extract text from PDFs via pdfjs-dist',
    });
  } catch (err) {
    // DOM_PARSER reason already covered — ignore.
    const msg = err instanceof Error ? err.message : String(err);
    if (!msg.includes('already exists')) {
      console.error('[NainoForge] offscreen createDocument failed:', msg);
    }
  }
}

export function setupOffscreen(): void {
  void createOffscreen();
}
