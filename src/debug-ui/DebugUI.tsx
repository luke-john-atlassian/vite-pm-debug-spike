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
  const activeTrackedEditor = listOfTrackedEditors.length
    ? listOfTrackedEditors[0]
    : null;

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
          <select>
            {listOfTrackedEditors.map((trackedEditor) => {
              return (
                <option key={trackedEditor.id}>
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
