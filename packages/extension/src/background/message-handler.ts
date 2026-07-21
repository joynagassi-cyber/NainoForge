import { swBus } from './event-bus-sw.js';
import { ImprintEngine } from '@nainoforge/imprint';
import type { ImprintNote } from '@nainoforge/imprint';
import type { DCM } from '@nainoforge/shared';

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

export type MessageResponse =
  | { ok: true; data?: unknown }
  | { ok: false; error: string };

export async function handleContentMessage(
  msg: ContentMessage<unknown>,
): Promise<MessageResponse> {
  switch (msg.type) {
    case 'nf:capture:request': {
      const { dcm } = msg.payload as CaptureRequest;
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
      // Override concept_id from the request (engine defaults to source.id).
      note.concept_id = conceptId;
      swBus.emit('imprint:validated', note);
      return { ok: true, data: note };
    }

    default:
      return { ok: false, error: 'Unknown message type' };
  }
}

chrome.runtime.onMessage.addListener(
  (
    msg: ContentMessage<unknown>,
    _sender: chrome.runtime.MessageSender,
    sendResponse: (r: MessageResponse) => void,
  ) => {
    handleContentMessage(msg).then(sendResponse);
    return true;
  },
);
