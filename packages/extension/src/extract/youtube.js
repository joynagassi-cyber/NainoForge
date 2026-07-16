"use strict";
// ─── YouTube transcript extraction ────────────────────────────
// Reads ytInitialPlayerResponse, fetches caption JSON3, normalises
// into DCM + Chapter[] + TranscriptSegment[].
// Zéro dépendance externe, zéro any.
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractYouTubeTranscript = extractYouTubeTranscript;
// Priority order for caption selection
const LAN_PRIORITY = [
    (t) => t.kind === 'asr' && t.langCode.startsWith('fr'),
    (t) => t.kind === 'asr' && t.langCode.startsWith('en'),
    (t) => t.langCode.startsWith('fr'),
    (t) => t.langCode.startsWith('en'),
];
function pickCaptionTrack(tracks) {
    for (const matches of LAN_PRIORITY) {
        const t = tracks.find(matches);
        if (t)
            return t;
    }
    return tracks[0] ?? null;
}
function toMs(raw) {
    if (raw === undefined || raw === null)
        return 0;
    if (typeof raw === 'string')
        return Number(raw);
    return raw;
}
function parseJson3(text) {
    const parsed = JSON.parse(text);
    return parsed.events ?? [];
}
function estimateWordCount(text) {
    if (!text)
        return 0;
    return text.split(/[\s\n]+/).filter(Boolean).length;
}
async function extractYouTubeTranscript(playerResponse, preferredLang) {
    const pr = playerResponse.player_response;
    const vd = pr.videoDetails;
    const captionTracks = (pr.captions?.playerCaptionsTracklistRenderer?.captionTracks ?? []);
    if (captionTracks.length === 0) {
        throw new Error('NO_CAPTIONS_AVAILABLE');
    }
    const track = captionTracks.find(t => t.langCode === preferredLang) ?? pickCaptionTrack(captionTracks);
    if (!track) {
        throw new Error('NO_CAPTIONS_AVAILABLE');
    }
    const url = `${track.baseUrl}&fmt=json3`;
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`TRANSCRIPT_FETCH_FAILED: HTTP ${res.status}`);
    }
    const json = await res.json();
    const events = json.events ?? [];
    const segments = [];
    let curStartMs = toMs(events[0]?.tStartMs);
    let curEndMs = toMs(events[0]?.tEndMs);
    let buf = '';
    for (const ev of events) {
        const words = (ev.segs ?? [])
            .map(s => (s.utf8 ?? s.urw ?? '').trim())
            .filter(Boolean);
        const text = words.join(' ');
        if (!text)
            continue;
        const s = toMs(ev.tStartMs);
        const e = toMs(ev.tEndMs);
        // Phrase break on terminal punctuation + start of new segment range
        const prevEndsSentence = /[.!?]["']?$/.test(curBuf());
        const gapExceeds = s > curEndMs + 500;
        if ((prevEndsSentence || gapExceeds) && buf.length > 0) {
            segments.push({ start_ms: curStartMs, end_ms: curEndMs, text: buf });
            curStartMs = s;
        }
        buf += (buf ? ' ' : '') + text;
        curEndMs = Math.max(curEndMs, e);
    }
    if (buf.length > 0) {
        segments.push({ start_ms: curStartMs, end_ms: curEndMs, text: buf });
    }
    function curBuf() {
        return buf;
    }
    // Chapters
    const chapters = [];
    const rawChapters = (pr.chapters ?? []);
    for (const ch of rawChapters) {
        chapters.push({
            start_ms: toMs(ch.startMillis) / 1000,
            title: ch.title,
        });
    }
    // Attach chapter_title to segments
    if (chapters.length > 0) {
        let ci = 0;
        for (const seg of segments) {
            while (ci < chapters.length - 1 && seg.start_ms >= chapters[ci + 1].start_ms) {
                ci += 1;
            }
            seg.chapter_title = chapters[ci]?.title;
        }
    }
    const contentMarkdown = [
        pr.videoDetails.shortDescription?.trim() ?? '',
        chapters.length > 0 ? '\n\n## Chapters\n' + chapters.map(c => `- ${c.title}`).join('\n') : '',
        segments.length > 0 ? '\n\n## Transcript\n' + segments.map(s => s.text).join('\n\n') : '',
    ].join('').trim();
    const dcm = {
        id: crypto.randomUUID(),
        title: vd.title,
        content_markdown: contentMarkdown || vd.title,
        source_url: `https://www.youtube.com/watch?v=${vd.videoId}`,
        source_type: 'youtube',
        metadata: {
            videoId: vd.videoId,
            lengthSeconds: vd.lengthSeconds,
            langCode: track.langCode,
            wordCount: estimateWordCount(contentMarkdown),
            thumbnail: pr.microformat?.playerMicroformatRenderer?.thumbnail?.thumbnails?.[0]?.url ?? null,
        },
        captured_at: Date.now(),
    };
    return { dcm, chapters, transcript: segments };
}
//# sourceMappingURL=youtube.js.map