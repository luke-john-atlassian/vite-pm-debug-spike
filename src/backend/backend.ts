import type {
  EditorLogEvent,
  EditorTrackerMessage,
  TransactionEvent,
} from "../prosemirror-plugin/comms/send-to-backend";

import "./comms/listen-to-editor-trackers";
import {
  getSendToEditorTracker,
  SendToEditorTracker,
} from "./comms/send-to-editor-tracker";

export type TrackedEditor = {
  activelyTracked: boolean;
  // TODO decide where this comes from
  id: string;
  // TODO decide where this comes from
  // suggestion > dom path
  label: string;
  log: EditorLogEvent[];

  sendToEditorTracker: SendToEditorTracker;
  lastPlaygroundRunResult?: { time: number; result: any };
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
    sendToEditorTracker: getSendToEditorTracker(editorId),
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
      sendToEditorTracker: getSendToEditorTracker(editorId),
    };
  }

  backendDebugInterface.trackedEditors[editorId].log.unshift(
    transactionMessage
  );
}

export function receiveLastPlaygroundRunResult(
  transactionMessage: Extract<
    EditorTrackerMessage,
    { type: "last-playground-run-result" }
  >
) {
  const { editorId } = transactionMessage;
  backendDebugInterface.trackedEditors[editorId].lastPlaygroundRunResult = {
    time: transactionMessage.time,
    result: transactionMessage.serializableLastPlaygroundRunResult,
  };
}

export function markEditorAsNotActivelyTracked(editorId: string) {
  if (backendDebugInterface.trackedEditors[editorId]) {
    backendDebugInterface.trackedEditors[editorId].activelyTracked = false;
  }
}
