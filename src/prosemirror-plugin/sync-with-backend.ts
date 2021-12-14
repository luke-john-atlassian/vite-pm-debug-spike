import { EditorState, Transaction } from "prosemirror-state";
import { serialize } from "../serialisation-util/cycle";

// note: we skip out of the type system when passing data between environments
// this works via ts-ignores in this file, and deserialization in sync-with-editor-trackers
type SerializableTransaction = Transaction;
type SerializableEditorState = EditorState;

// serialized state challenges
// 1. cyclical references in pm objects
// 2. dom node references
// 3. functions on objects -- funky functions with toString methods setup on them that require overwriting (ie. provide your own implementation or it throws)

export type TransactionEvent = {
  type: "transaction";
  editorId: string;
  time: number;
  serializableTransaction: SerializableTransaction;
  serializableState: SerializableEditorState;
};

export type RegisteredEvent = {
  type: "registered";
  editorId: string;
  time: number;
  serializableState: SerializableEditorState;
};

export type EditorLogEvent = TransactionEvent | RegisteredEvent;

export type DestroyEvent = {
  type: "destroy";
  editorId: string;
  time: number;
};

export type EditorTrackerMessage = (EditorLogEvent | DestroyEvent) & {
  pmEditorTrackerEvent: true;
};

function localPostMessage(
  message: Omit<EditorTrackerMessage, "pmEditorTrackerEvent">
) {
  window.postMessage({ ...message, pmEditorTrackerEvent: true });
}

export function getBackendNotifier(editorId: string) {
  const notifier = {
    logRegistered({ state }: { state: EditorState }) {
      const registeredEvent: RegisteredEvent = {
        type: "registered",
        editorId,
        time: Date.now(),
        // @ts-ignore
        serializableState: serialize(state),
      };

      localPostMessage(registeredEvent);
    },
    logTransaction({
      transaction,
      state,
    }: {
      transaction: Transaction;
      state: EditorState;
    }) {
      const transactionEvent: TransactionEvent = {
        type: "transaction",
        editorId,
        time: transaction.time,
        // @ts-ignore
        serializableTransaction: serialize(transaction),
        // @ts-ignore
        serializableState: serialize(state),
      };

      localPostMessage(transactionEvent);
    },
    destroy() {
      const destroyEvent: DestroyEvent = {
        type: "destroy",
        editorId,
        time: Date.now(),
      };

      localPostMessage(destroyEvent);
    },
  };

  return notifier;
}
