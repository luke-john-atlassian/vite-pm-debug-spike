import { BackendMessage } from "../../backend/comms/send-to-editor-tracker";
import { editorTrackers } from "../EditorTracker";
import { codeEval } from "../utils/code-eval";

function isBackendMessage(message: any): message is BackendMessage {
  return message.backendEvent;
}

function getEditorTrackerById(id: string) {
  const editorTracker = editorTrackers.find((possibleMatch) => {
    return possibleMatch.id === id;
  });

  return editorTracker;
}

export function backendEventHandler(event: any) {
  const message = event.data;

  if (!isBackendMessage(message)) {
    return;
  }

  const editorTracker = getEditorTrackerById(message.editorId);

  if (!editorTracker) {
    return;
  }

  switch (message.type) {
    case "run-playground-script":
      const result = codeEval(message.code, {
        editorView: editorTracker.editorView,
        editorState: editorTracker.editorState,
      });

      editorTracker.sendToBackend.sendLastPlaygroundRunResult({
        time: message.time,
        result,
      });

      break;
  }
}

window.addEventListener("message", backendEventHandler);
