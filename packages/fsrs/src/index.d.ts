export type { FsrsCard, ReviewLogEntry } from './__wasm__/fsrs_bindings';
import type { FsrsCard, ReviewLogEntry } from './__wasm__/fsrs_bindings';
export declare function ensureLoaded(): Promise<void>;
export type Rating = 'again' | 'hard' | 'good' | 'easy';
export declare function parseRating(s: string): Rating | undefined;
export interface SchedulerDefaults {
    initialStability?: number;
    initialDifficulty?: number;
    againFactor?: number;
    hardFactor?: number;
    goodFactor?: number;
    easyFactor?: number;
    hardDiffDelta?: number;
    goodDiffDelta?: number;
    easyDiffDelta?: number;
}
export declare class Scheduler {
    private _scheduler;
    constructor();
    createCard(opts: {
        id: string;
        now?: number;
    }): Promise<FsrsCard>;
    reviewCard(opts: {
        card: FsrsCard;
        rating: Rating;
        now?: number;
    }): Promise<ReviewLogEntry>;
    retrievability(card: FsrsCard, now: number): Promise<number>;
    due(now?: number): Promise<FsrsCard[]>;
    all(): Promise<FsrsCard[]>;
}
export declare function getScheduler(): Scheduler;
