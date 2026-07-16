"use strict";
// ─── Content Script — Article Page Capture ───────────────────
Object.defineProperty(exports, "__esModule", { value: true });
const article_detector_js_1 = require("./extract/article-detector.js");
const forge_badge_js_1 = require("./forge-badge.js");
function init() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', onReady);
        return;
    }
    onReady();
}
function onReady() {
    if ((0, article_detector_js_1.isArticlePage)(document)) {
        (0, forge_badge_js_1.injectForgeBadge)(document);
    }
}
init();
// ─── YouTube Auto Capture ────────────────────────────────────
// Observes YouTube SPA navigation; injects badge when video detected.
const forge_badge_js_2 = require("./forge-badge.js");
const YT_URL_RE = /[?&]v=([A-Za-z0-9_-]{11})/;
const POLL_INTERVAL_MS = 100;
const POLL_MAX_MS = 5000;
function extractVideoId(href) {
    const m = href.match(YT_URL_RE);
    return m ? m[1] : null;
}
function isYouTubeWatchPage(doc) {
    if (!doc.location?.hostname.includes('youtube.com'))
        return false;
    return extractVideoId(doc.location.href) !== null;
}
function waitForPlayerResponse(doc, cb) {
    const start = Date.now();
    const poll = () => {
        const raw = doc.defaultView.ytInitialPlayerResponse;
        if (raw && typeof raw === 'object') {
            cb();
            return;
        }
        if (Date.now() - start > POLL_MAX_MS)
            return;
        setTimeout(poll, POLL_INTERVAL_MS);
    };
    poll();
}
class YouTubeAutoCapture {
    lastVideoId = null;
    observer;
    constructor() {
        this.observer = new MutationObserver(() => this.onMutation());
    }
    start() {
        if (isYouTubeWatchPage(document)) {
            this.inject();
        }
        this.observer.observe(document.body ?? document.documentElement, {
            childList: true,
            subtree: true,
        });
    }
    onMutation() {
        if (!document.location?.href)
            return;
        const vid = extractVideoId(document.location.href);
        if (vid && vid !== this.lastVideoId) {
            this.lastVideoId = vid;
            this.inject();
        }
    }
    inject() {
        waitForPlayerResponse(document, () => {
            (0, forge_badge_js_2.injectYouTubeBadge)(document);
        });
    }
}
const ytAuto = new YouTubeAutoCapture();
if (isYouTubeWatchPage(document)) {
    ytAuto.start();
}
//# sourceMappingURL=content.js.map