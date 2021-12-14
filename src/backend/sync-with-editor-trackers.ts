import { EditorTrackerMessage } from "../prosemirror-plugin/sync-with-backend";
import { deserialize } from "../serialisation-util/cycle";

import {
  markEditorAsNotActivelyTracked,
  receiveTransaction,
  registerTrackedEditor,
} from "./backend";

function isPmEditorTrackerMessage(
  message: any
): message is EditorTrackerMessage {
  return message.pmEditorTrackerEvent;
}

export function editorTrackerEventHandler(event: any) {
  const message = event.data;

  if (!isPmEditorTrackerMessage(message)) {
    return;
  }

  switch (message.type) {
    case "transaction": {
      const messageWithDeserializedValues: typeof message = {
        ...message,
        serializableState: deserialize(message.serializableState),
        serializableTransaction: deserialize(message.serializableTransaction),
      };

      receiveTransaction(messageWithDeserializedValues);
      break;
    }
    case "registered": {
      const messageWithDeserializedValues: typeof message = {
        ...message,
        serializableState: deserialize(message.serializableState),
      };
      registerTrackedEditor(messageWithDeserializedValues);
    }
    case "destroy": {
      markEditorAsNotActivelyTracked(message.editorId);
      break;
    }
  }
}

window.addEventListener("message", editorTrackerEventHandler);
