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
