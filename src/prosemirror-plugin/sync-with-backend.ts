import { Transaction } from "prosemirror-state";

export type TransactionEvent = {
  type: "transaction";
  editorId: string;
  time: number;
  serializableTransaction: any;
};

export type DestroyEvent = {
  type: "destroy";
  editorId: string;
  time: number;
};

export type EditorTrackerMessage = (TransactionEvent | DestroyEvent) & {
  pmEditorTrackerEvent: true;
};

function localPostMessage(
  message: Omit<EditorTrackerMessage, "pmEditorTrackerEvent">
) {
  window.postMessage({ ...message, pmEditorTrackerEvent: true });
}

function getSerializableTransaction(transaction: Transaction) {
  return { time: transaction.time };
}

export function getBackendNotifier(editorId: string) {
  return {
    transaction({ transaction }: { transaction: Transaction }) {
      const serializableTransaction = getSerializableTransaction(transaction);

      const transactionEvent: TransactionEvent = {
        type: "transaction",
        editorId,
        time: transaction.time,
        serializableTransaction,
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
}
