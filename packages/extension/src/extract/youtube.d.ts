import type { DCM } from '@nainoforge/shared/src/types.js';
interface YtCaptionTrack {
    baseUrl: string;
    name: {
        simpleText: string;
        rtl?: boolean;
    };
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
        thumbnail?: {
            thumbnails?: Array<{
                url: string;
            }>;
        };
    };
}
interface YtPlayerResponse {
    videoDetails: YtPlayerResponseVideoDetails;
    captions?: YtPlayerResponseCaptions;
    microformat?: YtPlayerResponseMicroformat;
    chapters?: Array<{
        title: string;
        startMillis: number;
    }>;
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
export declare function extractYouTubeTranscript(playerResponse: YtInitialPlayerResponse, preferredLang?: string): Promise<{
    dcm: DCM;
    chapters: Chapter[];
    transcript: TranscriptSegment[];
}>;
export {};
