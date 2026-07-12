// ─── YouTube transcript extraction ────────────────────────────
// Reads ytInitialPlayerResponse, fetches caption JSON3, normalises
// into DCM + Chapter[] + TranscriptSegment[].
// Zéro dépendance externe, zéro any.

// --- Minimal typed shapes for YouTube player response ---

import type { DCM } from '@nainoforge/shared/src/types.js';

// --- Minimal typed shapes for YouTube player response ---

interface YtCaptionTrack {
  baseUrl: string;
  name: { simpleText: string; rtl?: boolean };
  langCode: string;
  kind?: string;
  isTranslatable?: boolean;
}

interface YtPlayerResponseCaptions {
  playerCaptionsTracklistRenderer: {
    captionTracks: YtCaptionTrack[];
  };
}

interface YtPlayerResponseVideoDetails {
  videoId: string;
  title: string;
  shortDescription: string;
  lengthSeconds?: string;
}

interface YtPlayerResponseMicroformat {
  playerMicroformatRenderer?: {
    thumbnail?: { thumbnails?: Array<{ url: string }> };
  };
}

interface YtPlayerResponse {
  videoDetails: YtPlayerResponseVideoDetails;
  captions?: YtPlayerResponseCaptions;
  microformat?: YtPlayerResponseMicroformat;
  chapters?: Array<{ title: string; startMillis: number }>;
}

interface YtInitialPlayerResponse {
  player_response: YtPlayerResponse;
}

export interface Chapter {
  start_ms: number;
  title: string;
}

export interface TranscriptSegment {
  start_ms: number;
  end_ms: number;
  text: string;
  chapter_title?: string;
}

interface Json3Event {
  tStartMs?: string | number;
  tEndMs?: string | number;
  segs?: Array<{
    utf8?: string;
    urw?: string;
  }>;
}

// Priority order for caption selection
const LAN_PRIORITY = [
  (t: YtCaptionTrack): boolean => t.kind === 'asr' && t.langCode.startsWith('fr'),
  (t: YtCaptionTrack): boolean => t.kind === 'asr' && t.langCode.startsWith('en'),
  (t: YtCaptionTrack): boolean => t.langCode.startsWith('fr'),
  (t: YtCaptionTrack): boolean => t.langCode.startsWith('en'),
];

function pickCaptionTrack(tracks: YtCaptionTrack[]): YtCaptionTrack | null {
  for (const matches of LAN_PRIORITY) {
    const t = tracks.find(matches);
    if (t) return t;
  }
  return tracks[0] ?? null;
}

function toMs(raw: string | number | undefined): number {
  if (raw === undefined || raw === null) return 0;
  if (typeof raw === 'string') return Number(raw);
  return raw;
}

function parseJson3(text: string): Json3Event[] {
  const parsed = JSON.parse(text) as { events: Json3Event[] };
  return parsed.events ?? [];
}

function estimateWordCount(text: string): number {
  if (!text) return 0;
  return text.split(/[\s\n]+/).filter(Boolean).length;
}

export async function extractYouTubeTranscript(
  playerResponse: YtInitialPlayerResponse,
  preferredLang?: string,
): Promise<{ dcm: DCM; chapters: Chapter[]; transcript: TranscriptSegment[] }> {
  const pr = playerResponse.player_response;
  const vd = pr.videoDetails;
  const captionTracks = (pr.captions?.playerCaptionsTracklistRenderer?.captionTracks ?? []) as YtCaptionTrack[];

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

  const json: { events: Json3Event[] } = await res.json();
  const events = json.events ?? [];

  const segments: TranscriptSegment[] = [];
  let curStartMs = toMs(events[0]?.tStartMs);
  let curEndMs = toMs(events[0]?.tEndMs);
  let buf = '';

  for (const ev of events) {
    const words = (ev.segs ?? [])
      .map(s => (s.utf8 ?? s.urw ?? '').trim())
      .filter(Boolean);
    const text = words.join(' ');
    if (!text) continue;

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

  function curBuf(): string {
    return buf;
  }

  // Chapters
  const chapters: Chapter[] = [];
  const rawChapters = (pr.chapters ?? []) as Array<{ title: string; startMillis: number }>;
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
    source_type: 'youtube' as const,
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
