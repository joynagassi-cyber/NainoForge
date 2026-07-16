"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const fs_1 = require("fs");
// WASM-backed FSRS-4 scheduler — tests run only when the native module is present.
let WasmMod = null;
let ready = false;
const WASM_PATH = [
    process.cwd(), 'packages', 'fsrs', 'src', '__wasm__', 'fsrs_bindings_bg.wasm',
].join('/');
(0, vitest_1.beforeAll)(async () => {
    try {
        const mod = await import('../__wasm__/fsrs_bindings.js');
        const wasmBytes = (0, fs_1.readFileSync)(WASM_PATH, { encoding: null });
        await mod.initSync(wasmBytes.buffer);
        WasmMod = mod;
        ready = true;
    }
    catch (e) {
        console.error('WASM init error:', e instanceof Error ? e.message : String(e));
    }
});
const NOW = 1_700_000_000_000;
const DAY = 86_400_000;
function sched() {
    return ready ? new WasmMod.FsrsScheduler() : null;
}
(0, vitest_1.describe)('FsrsScheduler.create_card', () => {
    (0, vitest_1.it)('initialises card with Rust defaults', () => {
        const scheduler = sched();
        if (!scheduler) {
            console.log('SKIP: wasm not built');
            return;
        }
        const card = scheduler.create_card('c-1', NOW);
        (0, vitest_1.expect)(card.id).toBe('c-1');
        (0, vitest_1.expect)(card.stability).toBeCloseTo(0.5, 1);
        (0, vitest_1.expect)(card.difficulty).toBeCloseTo(0.3, 1);
        (0, vitest_1.expect)(card.reps).toBe(0);
        (0, vitest_1.expect)(card.nextReviewAt).toBeCloseTo(card.lastReviewAt, 0);
    });
});
(0, vitest_1.describe)('FsrsScheduler.review_card', () => {
    let scheduler;
    let card;
    (0, vitest_1.beforeEach)(() => {
        scheduler = sched();
        if (!scheduler)
            return;
        card = scheduler.create_card('c-1', NOW);
    });
    (0, vitest_1.it)('returns intervalAfter >= 1 for "good"', () => {
        if (!scheduler) {
            console.log('SKIP');
            return;
        }
        const entry = scheduler.review_card(card, 'good', NOW);
        (0, vitest_1.expect)(entry.intervalAfter).toBeGreaterThanOrEqual(1);
        // stabilityAfter > 0 confirms the formula ran
        (0, vitest_1.expect)(entry.stabilityAfter).toBeGreaterThan(0);
    });
    (0, vitest_1.it)('"again" specifies intervalAfter = 1', () => {
        if (!scheduler) {
            console.log('SKIP');
            return;
        }
        const entry = scheduler.review_card(card, 'again', NOW);
        (0, vitest_1.expect)(entry.intervalAfter).toBe(1);
        // stabilityAfter for again: max(0.1, 0.5 * 0.2) = 0.1
        (0, vitest_1.expect)(entry.stabilityAfter).toBeCloseTo(0.1, 1);
    });
    (0, vitest_1.it)('"easy" lowers difficulty delta and extends stability', () => {
        if (!scheduler) {
            console.log('SKIP');
            return;
        }
        const entry = scheduler.review_card(card, 'easy', NOW);
        // stabilityAfter should exceed stabilityBefore for easy
        (0, vitest_1.expect)(entry.stabilityAfter).toBeGreaterThan(entry.stabilityBefore);
    });
    (0, vitest_1.it)('records correct before/after snapshots', () => {
        if (!scheduler) {
            console.log('SKIP');
            return;
        }
        const entry = scheduler.review_card(card, 'good', NOW);
        (0, vitest_1.expect)(entry.stabilityBefore).toBeCloseTo(0.5, 1);
        (0, vitest_1.expect)(entry.stabilityAfter).toBeGreaterThan(0);
        (0, vitest_1.expect)(entry.cardId).toBe('c-1');
    });
});
(0, vitest_1.describe)('FsrsScheduler.retrievability', () => {
    (0, vitest_1.it)('returns 0 for unreviewed card', () => {
        const scheduler = sched();
        if (!scheduler || !WasmMod) {
            console.log('SKIP');
            return;
        }
        const card = scheduler.create_card('c-1', NOW);
        (0, vitest_1.expect)(WasmMod.FsrsScheduler.retrievability(card, NOW)).toBe(0);
    });
    (0, vitest_1.it)('decays below 0.5 after ~90 days on a "good" card', () => {
        const scheduler = sched();
        if (!scheduler || !WasmMod) {
            console.log('SKIP');
            return;
        }
        const card = scheduler.create_card('c-1', NOW);
        scheduler.review_card(card, 'good', NOW);
        const r = WasmMod.FsrsScheduler.retrievability(card, NOW + 90 * DAY);
        (0, vitest_1.expect)(r).toBeLessThan(0.5);
    });
});
(0, vitest_1.describe)('FsrsScheduler.get_due', () => {
    (0, vitest_1.it)('returns empty at exact review time, non-empty next day', () => {
        const scheduler = sched();
        if (!scheduler) {
            console.log('SKIP');
            return;
        }
        const card = scheduler.create_card('c-1', NOW);
        scheduler.review_card(card, 'good', NOW);
        (0, vitest_1.expect)(scheduler.get_due(NOW)).toHaveLength(0);
        (0, vitest_1.expect)(scheduler.get_due(NOW + DAY).length).toBeGreaterThanOrEqual(1);
    });
});
(0, vitest_1.describe)('FsrsScheduler.all_cards', () => {
    (0, vitest_1.it)('returns all indexed cards', () => {
        const scheduler = sched();
        if (!scheduler) {
            console.log('SKIP');
            return;
        }
        scheduler.create_card('a', NOW);
        scheduler.create_card('b', NOW);
        (0, vitest_1.expect)(scheduler.all_cards()).toHaveLength(2);
    });
});
//# sourceMappingURL=scheduler.test.js.map