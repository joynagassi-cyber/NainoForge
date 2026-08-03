/**
 * NainoForge — Background Service Worker (MV3)
 *
 * All listeners are registered synchronously at the top level so they
 * survive the SW being killed and re-awakened by Chrome.
 *
 * IMPORTANT: do NOT wrap chrome.runtime.onMessage.addListener() inside
 * an async function, a Promise, or a setTimeout — those will not
 * execute when the SW is re-created after a kill.
 */

// ── Register content-script listener ──────────────────────────
import { handleContentMessage } from './background/message-handler.js';

chrome.runtime.onMessage.addListener(
  (msg: unknown, sender: chrome.runtime.MessageSender, sendResponse) => {
    handleContentMessage(msg as Parameters<typeof handleContentMessage>[0])
      .then(sendResponse)
      .catch(err => sendResponse({ ok: false, error: String(err) }));
    return true; // keep the message channel open for the async handler
  },
);

// ── Register action click → open/close side panel ────────────
// Chrome has no direct "close side panel" API, so we toggle by
// navigating the panel to a blank about:blank page and back.
// Clicking the toolbar icon again will re-open the panel.
let panelOpen = false;
chrome.action.onClicked.addListener((tab) => {
  if (tab.id == null) return;
  if (panelOpen) {
    // Close: navigate panel to blank page
    chrome.sidePanel.setOptions({ tabId: tab.id, path: '' });
    panelOpen = false;
  } else {
    // Open
    chrome.sidePanel.open({ tabId: tab.id });
    panelOpen = true;
  }
});

// ── Register offscreen manager ────────────────────────────────
import { setupOffscreen } from './background/offscreen-manager.js';

setupOffscreen();

// ── Action icon light/dark adaptive theme ─────────────────────
// Set adaptive icons for the action (toolbar) button.
// Chrome automatically switches between light/dark versions based on
// the browser theme, and updates when the theme changes.
const ACTION_ICONS = {
  16: {
    light: 'icons/action/16-light.png',
    dark: 'icons/action/16-dark.png',
  },
  48: {
    light: 'icons/action/48-light.png',
    dark: 'icons/action/48-dark.png',
  },
  128: {
    light: 'icons/action/128-light.png',
    dark: 'icons/action/128-dark.png',
  },
};

// Set initial icons
chrome.action.setIcon({ path: ACTION_ICONS });

// Update when the browser theme changes (light ↔ dark)
chrome.action.onThemeChanged.addListener(() => {
  chrome.action.setIcon({ path: ACTION_ICONS });
});

console.log('[NainoForge SW] registered listeners, ready.');
