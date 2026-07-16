"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const index_js_1 = require("../index.js");
const FAKE_NOTE = {
    id: 'note-1',
    source_id: 'src-1',
    concept_id: 'c-1',
    content: 'Les fonctions trigonométriques reliant les angles aux côtés du triangle.',
    word_count: 12,
    cran_level: 3,
    quality_score: 80,
    bloom_level: 'apply',
    concept_coverage_pct: 60,
    created_at: Date.now(),
};
const FAKE_SOURCE = {
    id: 'src-1',
    title: 'Trigonométrie',
};
(0, vitest_1.describe)('RelationalStateEngine', () => {
    const engine = new index_js_1.RelationalStateEngine();
    (0, vitest_1.it)('upsert + getMastery roundtrip', () => {
        engine.upsert({ learner_id: 'l-1', concept_id: 'c-1', mastery: 0.7, last_seen: Date.now(), interactions: 3 });
        (0, vitest_1.expect)(engine.getMastery('l-1', 'c-1')).toBe(0.7);
        (0, vitest_1.expect)(engine.getMastery('unknown', 'c-1')).toBe(0);
    });
    (0, vitest_1.it)('decayAll reduces mastery', () => {
        engine.upsert({ learner_id: 'l-1', concept_id: 'c-2', mastery: 0.5, last_seen: Date.now(), interactions: 1 });
        engine.decayAll(Date.now(), 7);
        (0, vitest_1.expect)(engine.getMastery('l-1', 'c-2')).toBeLessThan(0.5);
    });
});
(0, vitest_1.describe)('TurnInterruptionEngine', () => {
    const engine = new index_js_1.TurnInterruptionEngine();
    (0, vitest_1.it)('returns null for normal response', () => {
        (0, vitest_1.expect)(engine.evaluate(5, 'Je pense que la réponse dépend du contexte.')).toBeNull();
    });
    (0, vitest_1.it)('flags very short responses', () => {
        const ev = engine.evaluate(2, 'non.');
        (0, vitest_1.expect)(ev).not.toBeNull();
        (0, vitest_1.expect)(ev.signal).toBe('encourage');
    });
    (0, vitest_1.it)('flags questions', () => {
        const ev = engine.evaluate(3, 'Pourquoi fait-on ça ?');
        (0, vitest_1.expect)(ev).not.toBeNull();
        (0, vitest_1.expect)(ev.signal).toBe('probe');
    });
});
(0, vitest_1.describe)('LearnerEvidencePack', () => {
    const pack = new index_js_1.LearnerEvidencePack();
    (0, vitest_1.it)('collect returns one EvidenceItem per note', () => {
        const items = pack.collect(FAKE_SOURCE, FAKE_NOTE);
        (0, vitest_1.expect)(items).toHaveLength(1);
        (0, vitest_1.expect)(items[0].source_id).toBe('src-1');
        (0, vitest_1.expect)(items[0].relevance).toBeCloseTo(0.8, 1);
    });
    (0, vitest_1.it)('summary sorts by relevance descending', () => {
        const items = [
            { source_id: 's1', concept_id: 'c1', snippet: 'alpha', relevance: 0.3 },
            { source_id: 's2', concept_id: 'c2', snippet: 'beta', relevance: 0.8 },
        ];
        const s = pack.summary(items);
        (0, vitest_1.expect)(s.split('\n')[1]).toContain('beta');
    });
});
(0, vitest_1.describe)('AssessmentEngine', () => {
    const engine = new index_js_1.AssessmentEngine();
    for (const format of ['dialogue', 'multiple_choice', 'fill_blank', 'true_false', 'short_answer']) {
        (0, vitest_1.it)(`generates ${format} assessment`, () => {
            const item = engine.generate(FAKE_NOTE, format);
            (0, vitest_1.expect)(item.format).toBe(format);
            (0, vitest_1.expect)(item.concept_id).toBe('c-1');
            (0, vitest_1.expect)(item.answer.length).toBeGreaterThan(0);
        });
    }
    (0, vitest_1.it)('multiple_choice includes 4 options', () => {
        const item = engine.generate(FAKE_NOTE, 'multiple_choice');
        (0, vitest_1.expect)(item.options).toHaveLength(4);
    });
    (0, vitest_1.it)('grade returns score + feedback', () => {
        const item = engine.generate(FAKE_NOTE, 'dialogue');
        const result = engine.grade(item, 'bad réponse');
        (0, vitest_1.expect)(result.score).toBeGreaterThanOrEqual(0);
        (0, vitest_1.expect)(result.feedback.length).toBeGreaterThan(0);
    });
});
(0, vitest_1.describe)('SessionArcEngine', () => {
    const engine = new index_js_1.SessionArcEngine();
    (0, vitest_1.it)('start creates arc with learner_id', () => {
        const arc = engine.start('l-1');
        (0, vitest_1.expect)(arc.learner_id).toBe('l-1');
        (0, vitest_1.expect)(arc.session_id).toBeTruthy();
        (0, vitest_1.expect)(arc.started_at).toBeGreaterThan(0);
    });
    (0, vitest_1.it)('advance adds a phase', () => {
        const arc = engine.start('l-1');
        const a2 = engine.advance(arc, 'warmup');
        (0, vitest_1.expect)(a2.phases).toHaveLength(1);
        (0, vitest_1.expect)(a2.phases[0].phase).toBe('warmup');
    });
    (0, vitest_1.it)('complete sets completed_at', () => {
        const arc = engine.start('l-1');
        const done = engine.complete(arc);
        (0, vitest_1.expect)(done.completed_at).toBeGreaterThan(0);
    });
});
(0, vitest_1.describe)('AntiCopyMoat', () => {
    const moat = new index_js_1.AntiCopyMoat();
    (0, vitest_1.it)('normal trace: not suspicious', () => {
        const trace = {
            session_id: 's-1',
            hintsRequested: 1,
            avgResponseTimeMs: 5000,
            copyPasteDetected: false,
            fg_fluency_score: 0.8,
        };
        const result = moat.evaluate(trace);
        (0, vitest_1.expect)(result.suspicious).toBe(false);
        (0, vitest_1.expect)(result.score).toBeGreaterThan(0.5);
    });
    (0, vitest_1.it)('cheater trace: suspicious', () => {
        const trace = {
            session_id: 's-2',
            hintsRequested: 10,
            avgResponseTimeMs: 200,
            copyPasteDetected: true,
            fg_fluency_score: 0.1,
        };
        const result = moat.evaluate(trace);
        (0, vitest_1.expect)(result.suspicious).toBe(true);
        (0, vitest_1.expect)(result.score).toBeLessThan(0.3);
    });
    (0, vitest_1.it)('record stores traces per session', () => {
        moat.record({ session_id: 's-3', hintsRequested: 0, avgResponseTimeMs: 1000, copyPasteDetected: false, fg_fluency_score: 0.5 });
        moat.record({ session_id: 's-3', hintsRequested: 0, avgResponseTimeMs: 1000, copyPasteDetected: false, fg_fluency_score: 0.5 });
    });
});
//# sourceMappingURL=engine.test.js.map