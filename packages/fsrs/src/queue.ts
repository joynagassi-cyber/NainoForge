import type { Card, ReviewLogEntry } from './scheduler.js';

export interface ReviewQueue {
  enqueue(card: Card): void;
  due(now?: number): Card[];
  markReviewed(entry: ReviewLogEntry): void;
  all(): Card[];
}

export function createQueue(): ReviewQueue {
  const cards = new Map<string, Card>();
  return {
    enqueue(card: Card): void {
      cards.set(card.id, card);
    },
    due(now = Date.now()): Card[] {
      return [...cards.values()]
        .filter((c) => c.nextReviewAt <= now)
        .sort((a, b) => a.nextReviewAt - b.nextReviewAt);
    },
    markReviewed(_entry: ReviewLogEntry): void {
      // reviewCard mutates the card in-place; nothing additional to do here.
      // Kept as a hook for persistence side-effects.
    },
    all(): Card[] {
      return [...cards.values()];
    },
  };
}
