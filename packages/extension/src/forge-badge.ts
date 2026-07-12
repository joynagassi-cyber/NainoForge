// ─── Forge Badge injection ───────────────────────────────────
// Injects a fixed, scoped CTA into the host article page.

import { extractArticle } from './extract/readability.js';

const BADGE_ID = 'nf-forge-badge';
const BADGE_STYLE_ID = 'nf-forge-badge-css';

const CSS = `
#${BADGE_ID} {
  position: fixed;
  top: 60px;
  right: 16px;
  z-index: 2147483647;
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
  inset-block-start: 60px;
  inset-inline-end: 16px;
}
.nf-forge-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 44px;
  padding: 12px 16px;
  border-radius: 14px;
  border: none;
  background: #7C3AED;
  color: #FFFFFF;
  font: 500 14px/1 system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica, Arial, sans-serif;
  letter-spacing: 0.01em;
  cursor: pointer;
  box-shadow: none;
  transition: background-color 120ms ease, transform 120ms ease, box-shadow 120ms ease;
  min-width: 140px;
}
.nf-forge-btn:hover:not(:disabled):not(.nf-forge-btn--loading) {
  background: #6D28D9;
  transform: translateY(-1px);
  box-shadow: 0 1px 3px rgba(0,0,0,0.3);
}
.nf-forge-btn:active:not(:disabled):not(.nf-forge-btn--loading) {
  background: #5B21B6;
  transform: translateY(0);
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.25);
}
.nf-forge-btn.nf-forge-btn--loading,
.nf-forge-btn:disabled {
  background: #6D28D9;
  color: #FFFFFF;
  cursor: not-allowed;
  opacity: 0.85;
}
.nf-forge-btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px #7C3AED, 0 0 0 4px #13111C;
}
.nf-forge-btn .nf-forge-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,0.25);
  border-top-color: #FFFFFF;
  border-radius: 50%;
  animation: nf-forge-spin 600ms linear infinite;
  flex-shrink: 0;
}
@keyframes nf-forge-spin {
  to { transform: rotate(360deg); }
}
.nf-forge-btn-label {
  white-space: nowrap;
}
`;

function injectStyle(): void {
  if (document.getElementById(BADGE_STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = BADGE_STYLE_ID;
  style.textContent = CSS;
  (document.head ?? document.documentElement).appendChild(style);
}

function createSpinner(): HTMLElement {
  const el = document.createElement('span');
  el.className = 'nf-forge-spinner';
  el.setAttribute('aria-hidden', 'true');
  return el;
}

function createButton(label: string, onClick: () => void): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.className = 'nf-forge-btn';
  btn.type = 'button';
  btn.setAttribute('aria-label', label);

  const span = document.createElement('span');
  span.className = 'nf-forge-btn-label';
  span.textContent = label;

  btn.appendChild(span);
  btn.addEventListener('click', onClick);
  return btn;
}

export function injectForgeBadge(doc: Document): void {
  if (doc.getElementById(BADGE_ID)) return;
  injectStyle();

  const root = doc.createElement('div');
  root.id = BADGE_ID;

  const btn = createButton('Forger cette page', async () => {
    btn.disabled = true;
    btn.classList.add('nf-forge-btn--loading');

    const content = btn.querySelector('.nf-forge-btn-label');
    if (content) {
      content.setAttribute('data-original', content.textContent ?? '');
      content.textContent = 'Forging…';
    }
    btn.prepend(createSpinner());

    try {
      const result = extractArticle(doc, location.href);
      console.log('[nf-badge] captured', result.dcm);
      const evt = new CustomEvent('nf:article:captured', { detail: result.dcm, bubbles: true });
      doc.dispatchEvent(evt);
    } catch (err) {
      console.debug('[nf-badge] capture failed', err);
    } finally {
      btn.removeChild(btn.firstElementChild as HTMLElement);
      if (content) content.textContent = (content.getAttribute('data-original') ?? 'Forger cette page');
      btn.classList.remove('nf-forge-btn--loading');
      btn.disabled = false;
    }
  });

  root.appendChild(btn);
  (doc.body ?? doc.documentElement).appendChild(root);
}
