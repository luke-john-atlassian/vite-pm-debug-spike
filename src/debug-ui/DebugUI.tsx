import { useEffect, useState } from "react";
import { backendDebugInterface, TrackedEditor } from "../backend/backend";
import { TrackedEditorUI } from "./TrackedEditor/TrackedEditor";

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
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <div>Debug ui</div>
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
        <TrackedEditorUI trackedEditor={activeTrackedEditor} />
      ) : null}
    </div>
  );
}
