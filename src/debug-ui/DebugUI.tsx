import { useEffect, useState } from "react";
import { backendDebugInterface } from "../backend/backend";
import { LogExplorer } from "./LogExplorer/LogExplorer";
export function DebugUI() {
  const [syncBackendDebugInterface, setSyncBackendDebugInterface] = useState(
    backendDebugInterface
  );

  useEffect(() => {
    setInterval(() => {
      setSyncBackendDebugInterface({
        trackedEditors: {
          ...backendDebugInterface.trackedEditors,
        },
      });
    }, 100);
  }, []);

  const listOfTrackedEditors = Object.values(
    syncBackendDebugInterface.trackedEditors
  );
  const [activeTrackedEditor, setActiveTrackedEditor] = useState(() => {
    return listOfTrackedEditors.length ? listOfTrackedEditors[0] : null;
  });
  useEffect(() => {
    setActiveTrackedEditor(listOfTrackedEditors[0]);
  }, [listOfTrackedEditors.length !== 0]);

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        overflow: "hidden",

        display: "grid",
        gridTemplateColumns: "100%",
        gridTemplateRows: "20px 1fr",
        gridRowGap: "0px",
        justifyItems: "stretch",
        alignItems: "stretch",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          borderBottom: "1px solid black",
        }}
      >
        <div>
          <h1>ProseMirror debug tool</h1>
        </div>
        <div>
          <select
            onChange={(e) => {
              const relatedEditor = listOfTrackedEditors.find(
                (trackedEditor) => {
                  return trackedEditor.id === e.currentTarget.value;
                }
              )!;

              setActiveTrackedEditor(relatedEditor);
            }}
          >
            {listOfTrackedEditors.map((trackedEditor) => {
              return (
                <option key={trackedEditor.id} value={trackedEditor.id}>
                  {trackedEditor.label}
                  {trackedEditor.activelyTracked ? null : " (destroyed)"}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      {activeTrackedEditor ? (
        <LogExplorer log={activeTrackedEditor.log} />
      ) : null}
    </div>
  );
}
