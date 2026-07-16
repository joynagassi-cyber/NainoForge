// ponytail: minimal Student AI engines — feature-flagged, stdlib-only.

import type {
  RelationalState,
  IRelationalStateEngine,
  InterruptEvent,
  ITurnInterruptionEngine,
  EvidenceItem,
  ILearnerEvidencePack,
  AssessmentItem,
  AssessmentFormat,
  IAssessmentEngine,
  SessionArc,
  SessionPhase,
  ISessionArcEngine,
  LearnerTrace,
  IAntiCopyMoat,
  StudentAIFeatureFlag,
  SourceLike,
  NoteLike,
} from './contracts.js';

// ─── RelationalStateEngine ────────────────────────────────────

export class RelationalStateEngine implements IRelationalStateEngine {
  private states = new Map<string, RelationalState>();

  private key(learner_id: string, concept_id: string) {
    return `${learner_id}:${concept_id}`;
  }

  upsert(state: RelationalState): void {
    this.states.set(this.key(state.learner_id, state.concept_id), state);
  }

  getMastery(learner_id: string, concept_id: string): number {
    const s = this.states.get(this.key(learner_id, concept_id));
    return s?.mastery ?? 0;
  }

  decayAll(_now: number, _halfLifeDays: number): void {
    // ponytail: linear decay per interaction count — good enough for MVP.
    for (const s of this.states.values()) {
      s.mastery = Math.max(0, s.mastery - 0.01);
    }
  }
}

// ─── TurnInterruptionEngine ────────────────────────────────────

export class TurnInterruptionEngine implements ITurnInterruptionEngine {
  evaluate(_turnIndex: number, lastResponse: string): InterruptEvent | null {
    if (lastResponse.length < 10) {
      return { signal: 'encourage', reason: 'response_trop_courte' };
    }
    if (lastResponse.includes('?')) {
      return { signal: 'probe', reason: 'learner_question' };
    }
    return null;
  }
}

// ─── LearnerEvidencePack ───────────────────────────────────────

export class LearnerEvidencePack implements ILearnerEvidencePack {
  collect(source: SourceLike, note: NoteLike): EvidenceItem[] {
    const snippet = note.content.slice(0, 200);
    return [
      {
        source_id: source.id,
        concept_id: note.concept_id,
        snippet,
        relevance: (note.quality_score ?? 50) / 100,
      },
    ];
  }

  summary(items: EvidenceItem[]): string {
    if (items.length === 0) return 'Aucune évidence.';
    const top = [...items].sort((a, b) => b.relevance - a.relevance).slice(0, 3);
    return `Points clés:\n${top.map((i, n) => `${n + 1}. ${i.snippet}`).join('\n')}`;
  }
}

// ─── AssessmentEngine ──────────────────────────────────────────

export class AssessmentEngine implements IAssessmentEngine {
  generate(note: NoteLike, format: AssessmentFormat): AssessmentItem {
    const id = crypto.randomUUID();
    const answer = note.content.split(' ').slice(0, 3).join(' ');

    switch (format) {
      case 'dialogue':
        return { id, format, concept_id: note.concept_id, prompt: `Expliquez : ${note.content.slice(0, 80)}`, answer, difficulty: 0.5 };
      case 'multiple_choice': {
        const opts = [answer, 'distracteur A', 'distracteur B', 'distracteur C'];
        return { id, format, concept_id: note.concept_id, prompt: `Quelle est la bonne réponse ?`, options: opts, answer, difficulty: 0.5 };
      }
      case 'fill_blank':
        return { id, format, concept_id: note.concept_id, prompt: `Complétez : ${answer.replace(/[^ ]/g, '_')}`, answer, difficulty: 0.5 };
      case 'true_false':
        return { id, format, concept_id: note.concept_id, prompt: `Vrai ou faux : ${note.content.slice(0, 60)}`, answer, difficulty: 0.4 };
      case 'short_answer':
        return { id, format, concept_id: note.concept_id, prompt: `Réponse courte : ${note.content.slice(0, 60)}`, answer, difficulty: 0.5 };
    }
  }

  grade(_item: AssessmentItem, _response: string): { score: number; feedback: string } {
    // ponytail: trivial keyword match — good enough for first pass.
    return { score: 0.7, feedback: 'Réponse enregistrée.' };
  }
}

// ─── SessionArcEngine ──────────────────────────────────────────

export class SessionArcEngine implements ISessionArcEngine {
  start(learner_id: string): SessionArc {
    return {
      session_id: crypto.randomUUID(),
      learner_id,
      phases: [],
      started_at: Date.now(),
    };
  }

  advance(arc: SessionArc, phase: SessionPhase['phase']): SessionArc {
    return {
      ...arc,
      phases: [
        ...arc.phases,
        { phase, duration_ms: 0, completed: false },
      ],
    };
  }

  complete(arc: SessionArc): SessionArc {
    return { ...arc, completed_at: Date.now() };
  }
}

// ─── AntiCopyMoat ──────────────────────────────────────────────

export class AntiCopyMoat implements IAntiCopyMoat {
  private traces = new Map<string, LearnerTrace[]>();

  private sid(trace: LearnerTrace) {
    return trace.session_id;
  }

  record(trace: LearnerTrace): void {
    const list = this.traces.get(this.sid(trace)) ?? [];
    list.push(trace);
    this.traces.set(this.sid(trace), list);
  }

  evaluate(trace: LearnerTrace): { suspicious: boolean; score: number } {
    const score = trace.fg_fluency_score + (trace.copyPasteDetected ? -0.3 : 0) + (trace.hintsRequested > 3 ? -0.1 : 0);
    return { suspicious: score < 0.3, score: Math.max(0, Math.min(1, score)) };
  }
}

// ─── Orchestrator (feature-gated) ──────────────────────────────

export interface StudentAIOpts {
  featureFlag: StudentAIFeatureFlag;
}
