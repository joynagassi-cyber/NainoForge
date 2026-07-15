import { describe, it, expect, beforeEach } from 'vitest';
import { createCard, reviewCard, retrievability, type Card } from '../scheduler.js';

describe('createCard', () => {
  it('initializes with default stability and difficulty', () => {
    const card = createCard('c-1');
    expect(card.id).toBe('c-1');
    expect(card.stability).toBeGreaterThan(0);
    expect(card.difficulty).toBeGreaterThan(0);
    expect(card.reps).toBe(0);
    expect(card.nextReviewAt).toBe(card.lastReviewAt);
  });
});

describe('reviewCard', () => {
  let card: Card;
  const now = 1_700_000_000_000;
  const DAY = 86_400_000;

  beforeEach(() => {
    card = createCard('c-1', now);
  });

  it('increments reps on every review', () => {
    reviewCard(card, 'good', now);
    reviewCard(card, 'good', now + DAY);
    expect(card.reps).toBe(2);
  });

  it('again resets interval to 1 day and lowers stability', () => {
    card.reps = 1;
    card.lastReviewAt = now - 5 * DAY;
    const entry = reviewCard(card, 'again', now);
    expect(entry.intervalAfter).toBe(1);
    expect(card.stability).toBeLessThan(0.5);
    expect(card.nextReviewAt).toBe(now + DAY);
  });

  it('easy produces interval and lowers difficulty', () => {
    const entry = reviewCard(card, 'easy', now);
    expect(entry.intervalAfter).toBeGreaterThanOrEqual(1);
    expect(card.difficulty).toBeLessThanOrEqual(0.3);
  });

  it('schedules next review at now + intervalDays', () => {
    const entry = reviewCard(card, 'good', now);
    expect(card.nextReviewAt).toBe(now + entry.intervalAfter * DAY);
  });

  it('records stabilityBefore and stabilityAfter in log', () => {
    card.stability = 2;
    const entry = reviewCard(card, 'good', now);
    expect(entry.stabilityBefore).toBe(2);
    expect(entry.stabilityAfter).toBeGreaterThan(0);
  });
});

describe('retrievability', () => {
  it('is near 1 immediately after review', () => {
    const card = createCard('c-1', 1_700_000_000_000);
    reviewCard(card, 'good', 1_700_000_000_000);
    expect(retrievability(card, 1_700_000_000_000)).toBeCloseTo(1, 1);
  });

  it('decays over time', () => {
    const card = createCard('c-1', 1_700_000_000_000);
    reviewCard(card, 'good', 1_700_000_000_000);
    const rLater = retrievability(card, 1_700_000_000_000 + 90 * 86_400_000);
    expect(rLater).toBeLessThan(0.5);
  });

  it('is 0 for unreviewed card', () => {
    const card = createCard('c-1', 1_700_000_000_000);
    expect(retrievability(card, 1_700_000_000_000)).toBe(0);
  });
});
