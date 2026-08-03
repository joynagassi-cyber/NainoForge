// ─── Shared types — re-export from core to avoid duplication ──
// CapturedSource, DCM, SourceStatus, ReviewRating are defined in core/src/domain.ts
// and re-exported here for backwards compatibility.

export type {
  CapturedSource,
  DCM,
  SourceStatus,
  ReviewRating,
  Chapter,
  TranscriptSegment,
  CranLevel,
  BloomLevel,
  ImprintNote,
  SourceLike,
  NoteLike,
} from '@nainoforge/core';
