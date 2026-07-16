import type { RelationalState, IRelationalStateEngine, InterruptEvent, ITurnInterruptionEngine, EvidenceItem, ILearnerEvidencePack, AssessmentItem, AssessmentFormat, IAssessmentEngine, SessionArc, SessionPhase, ISessionArcEngine, LearnerTrace, IAntiCopyMoat, StudentAIFeatureFlag, SourceLike, NoteLike } from './contracts.js';
export declare class RelationalStateEngine implements IRelationalStateEngine {
    private states;
    private key;
    upsert(state: RelationalState): void;
    getMastery(learner_id: string, concept_id: string): number;
    decayAll(_now: number, _halfLifeDays: number): void;
}
export declare class TurnInterruptionEngine implements ITurnInterruptionEngine {
    evaluate(_turnIndex: number, lastResponse: string): InterruptEvent | null;
}
export declare class LearnerEvidencePack implements ILearnerEvidencePack {
    collect(source: SourceLike, note: NoteLike): EvidenceItem[];
    summary(items: EvidenceItem[]): string;
}
export declare class AssessmentEngine implements IAssessmentEngine {
    generate(note: NoteLike, format: AssessmentFormat): AssessmentItem;
    grade(_item: AssessmentItem, _response: string): {
        score: number;
        feedback: string;
    };
}
export declare class SessionArcEngine implements ISessionArcEngine {
    start(learner_id: string): SessionArc;
    advance(arc: SessionArc, phase: SessionPhase['phase']): SessionArc;
    complete(arc: SessionArc): SessionArc;
}
export declare class AntiCopyMoat implements IAntiCopyMoat {
    private traces;
    private sid;
    record(trace: LearnerTrace): void;
    evaluate(trace: LearnerTrace): {
        suspicious: boolean;
        score: number;
    };
}
export interface StudentAIOpts {
    featureFlag: StudentAIFeatureFlag;
}
