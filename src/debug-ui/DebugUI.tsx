import { useEffect, useState } from "react";
import { backendDebugInterface } from "../backend/backend";
import { Tabs } from "./Components/Layout";
import { LogExplorer } from "./LogExplorer/LogExplorer";

export function DebugUI() {
  const { listOfTrackedEditors, activeTrackedEditor, setActiveTrackedEditor } =
    useListOfTrackedEditors();

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
      <Tabs
        tabs={[
          { label: "Log Explorer" as const },
          { label: "Transaction playground" as const },
        ]}
        contentComponent={(tab) => {
          if (!activeTrackedEditor) {
            return null;
          }
          if (tab.label === "Log Explorer") {
            return (
              <LogExplorer
                log={activeTrackedEditor.log}
                editorId={activeTrackedEditor.id}
              />
            );
          }
          return null;
        }}
      />
    </div>
  );
}

function useListOfTrackedEditors() {
  const liveBackendInterface = useLiveBackendInterface();
  const listOfTrackedEditors = Object.values(
    liveBackendInterface.trackedEditors
  );
  const [activeTrackedEditor, setActiveTrackedEditor] = useState(() => {
    return listOfTrackedEditors.length ? listOfTrackedEditors[0] : null;
  });
  useEffect(() => {
    setActiveTrackedEditor(listOfTrackedEditors[0]);
  }, [listOfTrackedEditors.length !== 0]);

  return {
    listOfTrackedEditors,
    activeTrackedEditor,
    setActiveTrackedEditor,
  };
}

function useLiveBackendInterface() {
  const [liveBackendDebugInterface, setLiveBackendDebugInterface] = useState(
    backendDebugInterface
  );

  useEffect(() => {
    setInterval(() => {
      setLiveBackendDebugInterface({
        trackedEditors: {
          ...backendDebugInterface.trackedEditors,
        },
      });
    }, 100);
  }, []);

  return liveBackendDebugInterface;
}
