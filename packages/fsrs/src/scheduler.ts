// ponytail: simplified FSRS-4 scheduling in pure TypeScript.
// WASM migration deferred until real review data justifies calibration.

import type { ReviewRating } from '@nainoforge/shared/src/types.js';

export interface Card {
  id: string;
  stability: number; // days
  difficulty: number; // 0.01..1.0
  lastReviewAt: number; // unix ms
  lastRating?: ReviewRating;
  nextReviewAt: number; // unix ms
  reps: number;
}

export interface ReviewLogEntry {
  cardId: string;
  rating: ReviewRating;
  reviewedAt: number;
  stabilityBefore: number;
  stabilityAfter: number;
  intervalBefore: number;
  intervalAfter: number;
}

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

const DEFAULTS: Required<SchedulerDefaults> = {
  initialStability: 0.5,
  initialDifficulty: 0.3,
  againFactor: 0.2,
  hardFactor: 1.2,
  goodFactor: 1.0,
  easyFactor: 1.3,
  hardDiffDelta: -0.14,
  goodDiffDelta: -0.14,
  easyDiffDelta: -0.18,
};

export function createCard(id: string, now = Date.now()): Card {
  return {
    id,
    stability: DEFAULTS.initialStability,
    difficulty: DEFAULTS.initialDifficulty,
    lastReviewAt: now,
    nextReviewAt: now,
    reps: 0,
  };
}

export function reviewCard(card: Card, rating: ReviewRating, now = Date.now()): ReviewLogEntry {
  const intervalBefore = card.reps > 0 ? Math.max(1, Math.round((now - card.lastReviewAt) / 86_400_000)) : 0;
  const stabilityBefore = card.stability;
  const difficultyBefore = card.difficulty;

  const d = DEFAULTS;
  let nextStability = card.stability;
  let nextDifficulty = Math.max(0.01, Math.min(1, card.difficulty));

  if (rating === 'again') {
    nextStability = Math.max(0.1, card.stability * d.againFactor);
  } else if (rating === 'hard') {
    nextStability = card.stability * d.hardFactor;
    nextDifficulty = Math.max(0.01, Math.min(1, card.difficulty + d.hardDiffDelta));
  } else if (rating === 'good') {
    nextStability = card.stability * d.goodFactor;
    nextDifficulty = Math.max(0.01, Math.min(1, card.difficulty + d.goodDiffDelta));
  } else if (rating === 'easy') {
    nextStability = card.stability * d.easyFactor;
    nextDifficulty = Math.max(0.01, Math.min(1, card.difficulty + d.easyDiffDelta));
  }

  const nextInterval = rating === 'again' ? 1 : Math.max(1, Math.round(nextStability));

  card.stability = nextStability;
  card.difficulty = nextDifficulty;
  card.lastReviewAt = now;
  card.lastRating = rating;
  card.nextReviewAt = now + nextInterval * 86_400_000;
  card.reps += 1;

  return {
    cardId: card.id,
    rating,
    reviewedAt: now,
    stabilityBefore,
    stabilityAfter: nextStability,
    intervalBefore,
    intervalAfter: nextInterval,
  };
}

export function retrievability(card: Card, now = Date.now()): number {
  if (card.reps === 0) return 0;
  const daysSince = (now - card.lastReviewAt) / 86_400_000;
  return Math.exp(-Math.LN2 * daysSince / card.stability);
}
