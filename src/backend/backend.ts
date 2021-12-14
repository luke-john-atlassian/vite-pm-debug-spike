import type {
  EditorLogEvent,
  EditorTrackerMessage,
  TransactionEvent,
} from "../prosemirror-plugin/sync-with-backend";

import "./sync-with-editor-trackers";

export type TrackedEditor = {
  activelyTracked: boolean;
  // TODO decide where this comes from
  id: string;
  // TODO decide where this comes from
  // suggestion > dom path
  label: string;
  log: EditorLogEvent[];
};

export type BackendDebugInterface = {
  trackedEditors: { [id: string]: TrackedEditor };
};

export const backendDebugInterface: BackendDebugInterface = {
  trackedEditors: {},
};

export function registerTrackedEditor(
  registeredMessage: Extract<EditorTrackerMessage, { type: "registered" }>
) {
  const { editorId } = registeredMessage;

  backendDebugInterface.trackedEditors[editorId] = {
    activelyTracked: true,
    id: editorId,
    label: editorId,
    log: [registeredMessage],
  };
}

export function receiveTransaction(
  transactionMessage: Extract<EditorTrackerMessage, { type: "transaction" }>
) {
  const { editorId } = transactionMessage;
  if (!backendDebugInterface.trackedEditors[editorId]) {
    backendDebugInterface.trackedEditors[editorId] = {
      activelyTracked: true,
      id: editorId,
      label: editorId,
      log: [],
    };
  }

  backendDebugInterface.trackedEditors[editorId].log.unshift(
    transactionMessage
  );
}

export function markEditorAsNotActivelyTracked(editorId: string) {
  if (backendDebugInterface.trackedEditors[editorId]) {
    backendDebugInterface.trackedEditors[editorId].activelyTracked = false;
  }
}
