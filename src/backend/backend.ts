import type { Node as ProsemirrorNode } from "prosemirror-model";
import type { Transaction as ProsemirrorTransaction } from "prosemirror-state";
import type {
  EditorTrackerMessage,
  TransactionEvent,
} from "../prosemirror-plugin/sync-with-backend";

import "./sync-with-editor-trackers";

type TransactionHistoryEntry = TransactionEvent;

export type TrackedEditor = {
  activelyTracked: boolean;
  // TODO decide where this comes from
  id: string;
  // TODO decide where this comes from
  // suggestion > dom path
  label: string;
  transactionHistory: TransactionHistoryEntry[];
};

export type BackendDebugInterface = {
  trackedEditors: { [id: string]: TrackedEditor };
};

export const backendDebugInterface: BackendDebugInterface = {
  trackedEditors: {},
};

export function receiveTransaction(
  transactionMessage: Extract<EditorTrackerMessage, { type: "transaction" }>
) {
  if (!backendDebugInterface.trackedEditors[transactionMessage.editorId]) {
    backendDebugInterface.trackedEditors[transactionMessage.editorId] = {
      activelyTracked: true,
      id: transactionMessage.editorId,
      label: transactionMessage.editorId,
      transactionHistory: [],
    };
  }

  backendDebugInterface.trackedEditors[
    transactionMessage.editorId
  ].transactionHistory.unshift(transactionMessage);
}

export function markEditorAsNotActivelyTracked(editorId: string) {
  if (backendDebugInterface.trackedEditors[editorId]) {
    backendDebugInterface.trackedEditors[editorId].activelyTracked = false;
  }
}
