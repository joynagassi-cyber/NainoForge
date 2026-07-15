/* tslint:disable */
/* eslint-disable */
/**
* @returns {any}
*/
export function defaults(): any;
/**
* @param {any} opts
*/
export function set_defaults(opts: any): void;
/**
*/
export class FsrsCard {
  free(): void;
/**
*/
  readonly difficulty: number;
/**
*/
  readonly id: string;
/**
*/
  readonly lastRating: string | undefined;
/**
*/
  readonly lastReviewAt: number;
/**
*/
  readonly nextReviewAt: number;
/**
*/
  readonly reps: number;
/**
*/
  readonly stability: number;
}
/**
*/
export class FsrsScheduler {
  free(): void;
/**
*/
  constructor();
/**
* Create a new card and index it. Returns the card so TS can hold a reference.
* @param {string} id
* @param {number} now
* @returns {FsrsCard}
*/
  create_card(id: string, now: number): FsrsCard;
/**
* Review a card. `rating` is parsed from a string ("again"|"hard"|"good"|"easy").
* @param {FsrsCard} card
* @param {string} rating_str
* @param {number} now
* @returns {ReviewLogEntry}
*/
  review_card(card: FsrsCard, rating_str: string, now: number): ReviewLogEntry;
/**
* Retrievability 0..1 for a card at a given timestamp.
* @param {FsrsCard} card
* @param {number} now
* @returns {number}
*/
  static retrievability(card: FsrsCard, now: number): number;
/**
* Due cards sorted by next_review_at ascending.
* @param {number} now
* @returns {(FsrsCard)[]}
*/
  get_due(now: number): (FsrsCard)[];
/**
* All cards in insertion order.
* @returns {(FsrsCard)[]}
*/
  all_cards(): (FsrsCard)[];
}
/**
*/
export class ReviewLogEntry {
  free(): void;
/**
*/
  readonly cardId: string;
/**
*/
  readonly intervalAfter: number;
/**
*/
  readonly intervalBefore: number;
/**
*/
  readonly rating: string;
/**
*/
  readonly reviewedAt: number;
/**
*/
  readonly stabilityAfter: number;
/**
*/
  readonly stabilityBefore: number;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_fsrscard_free: (a: number) => void;
  readonly fsrscard_id: (a: number, b: number) => void;
  readonly fsrscard_stability: (a: number) => number;
  readonly fsrscard_difficulty: (a: number) => number;
  readonly fsrscard_last_review_at: (a: number) => number;
  readonly fsrscard_next_review_at: (a: number) => number;
  readonly fsrscard_reps: (a: number) => number;
  readonly fsrscard_last_rating: (a: number, b: number) => void;
  readonly defaults: () => number;
  readonly set_defaults: (a: number) => void;
  readonly __wbg_reviewlogentry_free: (a: number) => void;
  readonly reviewlogentry_card_id: (a: number, b: number) => void;
  readonly reviewlogentry_rating: (a: number, b: number) => void;
  readonly reviewlogentry_interval_after: (a: number) => number;
  readonly __wbg_fsrsscheduler_free: (a: number) => void;
  readonly fsrsscheduler_new: () => number;
  readonly fsrsscheduler_create_card: (a: number, b: number, c: number, d: number) => number;
  readonly fsrsscheduler_review_card: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly fsrsscheduler_retrievability: (a: number, b: number) => number;
  readonly fsrsscheduler_get_due: (a: number, b: number, c: number) => void;
  readonly fsrsscheduler_all_cards: (a: number, b: number) => void;
  readonly reviewlogentry_reviewed_at: (a: number) => number;
  readonly reviewlogentry_stability_before: (a: number) => number;
  readonly reviewlogentry_stability_after: (a: number) => number;
  readonly reviewlogentry_interval_before: (a: number) => number;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_exn_store: (a: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
