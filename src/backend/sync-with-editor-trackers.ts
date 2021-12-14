import { EditorTrackerMessage } from "../prosemirror-plugin/sync-with-backend";
import { markEditorAsNotActivelyTracked, receiveTransaction } from "./backend";

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
      receiveTransaction(message);
      break;
    }
    case "destroy": {
      markEditorAsNotActivelyTracked(message.editorId);
      break;
    }
  }
}

window.addEventListener("message", editorTrackerEventHandler);
