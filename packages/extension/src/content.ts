// ─── Content Script — Article Page Capture ───────────────────

import { isArticlePage } from './extract/article-detector.js';
import { injectForgeBadge } from './forge-badge.js';

function init(): void {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
    return;
  }
  onReady();
}

function onReady(): void {
  if (isArticlePage(document)) {
    injectForgeBadge(document);
  }
}

init();

// ─── YouTube Auto Capture ────────────────────────────────────
// Observes YouTube SPA navigation; injects badge when video detected.

import { injectYouTubeBadge } from './forge-badge.js';

const YT_URL_RE = /[?&]v=([A-Za-z0-9_-]{11})/;
const POLL_INTERVAL_MS = 100;
const POLL_MAX_MS = 5000;

type YtWatchCB = () => void;

function extractVideoId(href: string): string | null {
  const m = href.match(YT_URL_RE);
  return m ? m[1] : null;
}

function isYouTubeWatchPage(doc: Document): boolean {
  if (!doc.location?.hostname.includes('youtube.com')) return false;
  return extractVideoId(doc.location.href) !== null;
}

function waitForPlayerResponse(doc: Document, cb: YtWatchCB): void {
  const start = Date.now();
  const poll = (): void => {
    const raw = (doc.defaultView as unknown as Record<string, unknown>).ytInitialPlayerResponse;
    if (raw && typeof raw === 'object') {
      cb();
      return;
    }
    if (Date.now() - start > POLL_MAX_MS) return;
    setTimeout(poll, POLL_INTERVAL_MS);
  };
  poll();
}

class YouTubeAutoCapture {
  private lastVideoId: string | null = null;
  private observer: MutationObserver;

  constructor() {
    this.observer = new MutationObserver(() => this.onMutation());
  }

  start(): void {
    if (isYouTubeWatchPage(document)) {
      this.inject();
    }
    this.observer.observe(document.body ?? document.documentElement, {
      childList: true,
      subtree: true,
    });
  }

  private onMutation(): void {
    if (!document.location?.href) return;
    const vid = extractVideoId(document.location.href);
    if (vid && vid !== this.lastVideoId) {
      this.lastVideoId = vid;
      this.inject();
    }
  }

  private inject(): void {
    waitForPlayerResponse(document, () => {
      injectYouTubeBadge(document);
    });
  }
}

const ytAuto = new YouTubeAutoCapture();
if (isYouTubeWatchPage(document)) {
  ytAuto.start();
}
