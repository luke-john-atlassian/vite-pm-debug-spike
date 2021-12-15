type RunPlaygroundScript = {
  type: "run-playground-script";
  editorId: string;
  time: number;
  code: string;
};

export type BackendMessage = RunPlaygroundScript & { backendEvent: true };

function localPostMessage(message: Omit<BackendMessage, "backendEvent">) {
  window.postMessage({ ...message, backendEvent: true });
}

export type SendToEditorTracker = ReturnType<typeof getSendToEditorTracker>;

export function getSendToEditorTracker(editorId: string) {
  const sendToEditorTrackers = {
    runPlaygroundScript: ({ code, time }: { code: string; time: number }) => {
      localPostMessage({
        type: "run-playground-script",
        editorId,
        time,
        code,
      });
    },
  };

  return sendToEditorTrackers;
}
