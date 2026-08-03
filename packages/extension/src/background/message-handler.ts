import { swBus } from './event-bus-sw.js';
import { ImprintEngine } from '@nainoforge/imprint';
import type { ImprintNote } from '@nainoforge/imprint';
import type { DCM } from '@nainoforge/shared';
import { storage } from './storage.js';

// ── Storage keys ──────────────────────────────────────────────
const KEY_SOURCES = 'sources';       // DCM[]
const KEY_IMPRINTS = 'imprints';     // ImprintNote[]

export interface ContentMessage<T = unknown> {
  type: string;
  payload: T;
}

export interface CaptureRequest {
  dcm: DCM;
}

export interface ImprintSaveRequest {
  sourceId: string;
  conceptId: string;
  content: string;
}

export interface GetSourcesRequest {}

export type MessageResponse =
  | { ok: true; data?: unknown }
  | { ok: false; error: string };

/** Load all persisted sources from storage. */
async function loadSources(): Promise<DCM[]> {
  return storage.get_list<DCM>(KEY_SOURCES);
}

/** Load all persisted imprints from storage. */
async function loadImprints(): Promise<ImprintNote[]> {
  return storage.get_list<ImprintNote>(KEY_IMPRINTS);
}

export async function handleContentMessage(
  msg: ContentMessage<unknown>,
): Promise<MessageResponse> {
  switch (msg.type) {
    case 'nf:capture:request': {
      const { dcm } = msg.payload as CaptureRequest;
      // Persist the source
      await storage.push_list(KEY_SOURCES, dcm, 200);
      // Notify SW listeners
      swBus.emit('source:captured', dcm);
      return { ok: true, data: { dcmId: dcm.id } };
    }

    case 'nf:imprint:save': {
      const { sourceId, conceptId, content } = msg.payload as ImprintSaveRequest;
      const engine = new ImprintEngine();
      const note: ImprintNote = await engine.generateImprint(
        { id: sourceId },
        content,
      );
      note.concept_id = conceptId;
      // Persist the imprint
      await storage.push_list(KEY_IMPRINTS, note, 500);
      // Notify SW listeners
      swBus.emit('imprint:validated', note);
      return { ok: true, data: note };
    }

    case 'nf:sources:load': {
      // Side panel asks for all persisted sources
      const sources = await loadSources();
      return { ok: true, data: { sources } };
    }

    case 'nf:imprints:load': {
      // Side panel asks for all persisted imprints
      const imprints = await loadImprints();
      return { ok: true, data: { imprints } };
    }

    default:
      return { ok: false, error: 'Unknown message type' };
  }
}
