import { useEffect, useState } from "react";
import JSONTree from "react-json-tree";

import { TrackedEditor } from "../../backend/backend";
import { SendToEditorTracker } from "../../backend/comms/send-to-editor-tracker";
import { useAppStateContextValue } from "../AppStateProvider";
import { JSONTreeTheme } from "../LogExplorer/LogEntryOverview";

const preCode = `
function runTransaction(editorView, editorState) {
`.trim();

export function Playground() {
  const { activeTrackedEditor } = useAppStateContextValue();

  const {
    id: editorId,
    lastPlaygroundRunResult,
    sendToEditorTracker: { runPlaygroundScript },
  } = activeTrackedEditor!;

  const { code, setCode, runCode, result } = useCode({
    lastPlaygroundRunResult,
    runPlaygroundScript,
    editorId,
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        overflow: "scroll",
        height: "100%",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <code>function script(editorView, editorState) {"{"}</code>
        <textarea
          rows={15}
          style={{ width: "400px", marginLeft: "1rem" }}
          value={code}
          onChange={(event) => {
            setCode(event.currentTarget.value);
          }}
        />
        <code>{"}"}</code>
        <button onClick={runCode}>run script(editorView, editorState)</button>
      </div>
      {result ? (
        <div style={{ overflow: "scroll", flex: "1" }}>
          <p>result</p>
          {typeof result === "object" ? (
            <JSONTree
              data={result}
              theme={JSONTreeTheme}
              invertTheme={false}
              hideRoot
            />
          ) : (
            result
          )}
        </div>
      ) : null}
    </div>
  );
}

let lastCode: string | undefined = undefined;
let lastCodeByEditorId: { [editorId: string]: string } = {};
function useCode({
  lastPlaygroundRunResult,
  runPlaygroundScript,
  editorId,
}: {
  lastPlaygroundRunResult: TrackedEditor["lastPlaygroundRunResult"];
  runPlaygroundScript: SendToEditorTracker["runPlaygroundScript"];
  editorId: string;
}) {
  const [code, setCode] = useState(() => {
    return lastCodeByEditorId[editorId] || lastCode || `return "test"`;
  });
  const [lastRunTime, setLastRunTime] = useState<number>();

  useEffect(() => {
    setCode(lastCodeByEditorId[editorId] || lastCode || `return "test"`);
  }, [editorId]);

  function runCode() {
    const runTime = Date.now();
    setLastRunTime(runTime);
    runPlaygroundScript({ code, time: runTime });
  }

  function setCodeWithHistory(code: string) {
    setCode(code);
    lastCode = code;
    lastCodeByEditorId[editorId] = code;
  }

  let result =
    lastPlaygroundRunResult && lastRunTime === lastPlaygroundRunResult?.time
      ? lastPlaygroundRunResult.result
      : undefined;

  return {
    code,
    setCode: setCodeWithHistory,
    runCode,
    result,
  };
}
