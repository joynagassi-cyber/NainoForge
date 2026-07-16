import { describe, it, expect } from 'vitest';
import {
  RelationalStateEngine,
  TurnInterruptionEngine,
  LearnerEvidencePack,
  AssessmentEngine,
  SessionArcEngine,
  AntiCopyMoat,
  type LearnerTrace,
  type NoteLike,
  type SourceLike,
} from '../index.js';

const FAKE_NOTE: NoteLike = {
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

const FAKE_SOURCE: SourceLike = {
  id: 'src-1',
  title: 'Trigonométrie',
};

describe('RelationalStateEngine', () => {
  const engine = new RelationalStateEngine();

  it('upsert + getMastery roundtrip', () => {
    engine.upsert({ learner_id: 'l-1', concept_id: 'c-1', mastery: 0.7, last_seen: Date.now(), interactions: 3 });
    expect(engine.getMastery('l-1', 'c-1')).toBe(0.7);
    expect(engine.getMastery('unknown', 'c-1')).toBe(0);
  });

  it('decayAll reduces mastery', () => {
    engine.upsert({ learner_id: 'l-1', concept_id: 'c-2', mastery: 0.5, last_seen: Date.now(), interactions: 1 });
    engine.decayAll(Date.now(), 7);
    expect(engine.getMastery('l-1', 'c-2')).toBeLessThan(0.5);
  });
});

describe('TurnInterruptionEngine', () => {
  const engine = new TurnInterruptionEngine();

  it('returns null for normal response', () => {
    expect(engine.evaluate(5, 'Je pense que la réponse dépend du contexte.')).toBeNull();
  });

  it('flags very short responses', () => {
    const ev = engine.evaluate(2, 'non.');
    expect(ev).not.toBeNull();
    expect(ev!.signal).toBe('encourage');
  });

  it('flags questions', () => {
    const ev = engine.evaluate(3, 'Pourquoi fait-on ça ?');
    expect(ev).not.toBeNull();
    expect(ev!.signal).toBe('probe');
  });
});

describe('LearnerEvidencePack', () => {
  const pack = new LearnerEvidencePack();

  it('collect returns one EvidenceItem per note', () => {
    const items = pack.collect(FAKE_SOURCE, FAKE_NOTE);
    expect(items).toHaveLength(1);
    expect(items[0].source_id).toBe('src-1');
    expect(items[0].relevance).toBeCloseTo(0.8, 1);
  });

  it('summary sorts by relevance descending', () => {
    const items = [
      { source_id: 's1', concept_id: 'c1', snippet: 'alpha', relevance: 0.3 },
      { source_id: 's2', concept_id: 'c2', snippet: 'beta', relevance: 0.8 },
    ];
    const s = pack.summary(items);
    expect(s.split('\n')[1]).toContain('beta');
  });
});

describe('AssessmentEngine', () => {
  const engine = new AssessmentEngine();

  for (const format of ['dialogue', 'multiple_choice', 'fill_blank', 'true_false', 'short_answer'] as const) {
    it(`generates ${format} assessment`, () => {
      const item = engine.generate(FAKE_NOTE, format);
      expect(item.format).toBe(format);
      expect(item.concept_id).toBe('c-1');
      expect(item.answer.length).toBeGreaterThan(0);
    });
  }

  it('multiple_choice includes 4 options', () => {
    const item = engine.generate(FAKE_NOTE, 'multiple_choice');
    expect(item.options).toHaveLength(4);
  });

  it('grade returns score + feedback', () => {
    const item = engine.generate(FAKE_NOTE, 'dialogue');
    const result = engine.grade(item, 'bad réponse');
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.feedback.length).toBeGreaterThan(0);
  });
});

describe('SessionArcEngine', () => {
  const engine = new SessionArcEngine();

  it('start creates arc with learner_id', () => {
    const arc = engine.start('l-1');
    expect(arc.learner_id).toBe('l-1');
    expect(arc.session_id).toBeTruthy();
    expect(arc.started_at).toBeGreaterThan(0);
  });

  it('advance adds a phase', () => {
    const arc = engine.start('l-1');
    const a2 = engine.advance(arc, 'warmup');
    expect(a2.phases).toHaveLength(1);
    expect(a2.phases[0].phase).toBe('warmup');
  });

  it('complete sets completed_at', () => {
    const arc = engine.start('l-1');
    const done = engine.complete(arc);
    expect(done.completed_at).toBeGreaterThan(0);
  });
});

describe('AntiCopyMoat', () => {
  const moat = new AntiCopyMoat();

  it('normal trace: not suspicious', () => {
    const trace: LearnerTrace = {
      session_id: 's-1',
      hintsRequested: 1,
      avgResponseTimeMs: 5000,
      copyPasteDetected: false,
      fg_fluency_score: 0.8,
    };
    const result = moat.evaluate(trace);
    expect(result.suspicious).toBe(false);
    expect(result.score).toBeGreaterThan(0.5);
  });

  it('cheater trace: suspicious', () => {
    const trace: LearnerTrace = {
      session_id: 's-2',
      hintsRequested: 10,
      avgResponseTimeMs: 200,
      copyPasteDetected: true,
      fg_fluency_score: 0.1,
    };
    const result = moat.evaluate(trace);
    expect(result.suspicious).toBe(true);
    expect(result.score).toBeLessThan(0.3);
  });

  it('record stores traces per session', () => {
    moat.record({ session_id: 's-3', hintsRequested: 0, avgResponseTimeMs: 1000, copyPasteDetected: false, fg_fluency_score: 0.5 });
    moat.record({ session_id: 's-3', hintsRequested: 0, avgResponseTimeMs: 1000, copyPasteDetected: false, fg_fluency_score: 0.5 });
  });
});
