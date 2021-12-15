import { EditorTrackerMessage } from "../../prosemirror-plugin/comms/send-to-backend";
import { deserialize } from "../../serialisation-util/cycle";

import {
  markEditorAsNotActivelyTracked,
  receiveLastPlaygroundRunResult,
  receiveTransaction,
  registerTrackedEditor,
} from "../backend";

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
      break;
    }
    case "last-playground-run-result": {
      const messageWithDeserializedValues: typeof message = {
        ...message,
        serializableLastPlaygroundRunResult: deserialize(
          message.serializableLastPlaygroundRunResult
        ),
      };

      receiveLastPlaygroundRunResult(messageWithDeserializedValues);

      break;
    }
    case "destroy": {
      markEditorAsNotActivelyTracked(message.editorId);
      break;
    }
  }
}

window.addEventListener("message", editorTrackerEventHandler);
