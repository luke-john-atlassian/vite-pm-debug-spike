import { useEffect, useState } from "react";

import { useAppStateContextValue } from "./AppStateProvider";
import { Tabs } from "./Components/Layout";
import {
  ToolbarGroup,
  ToolbarHeading,
  ToolbarSelect,
  ToolbarSelectOption,
} from "./Components/Toolbar";
import { LogExplorer } from "./LogExplorer/LogExplorer";
import { Playground } from "./Playground/Playground";

export function DebugUI() {
  const { listOfTrackedEditors, activeTrackedEditor, setActiveTrackedEditor } =
    useAppStateContextValue();

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        overflow: "hidden",

        display: "grid",
        gridTemplateColumns: "100%",
        gridTemplateRows: "27px 1fr",
        gridRowGap: "1px",
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

          // sizes+colors copied from chrome devtools
          backgroundColor: "rgb(241, 243, 244)",
          borderBottomColor: "rgb(202, 205, 209)",
          height: "27px",
        }}
      >
        <ToolbarGroup>
          <ToolbarHeading Tag="h1">ProseMirror debug tool</ToolbarHeading>
        </ToolbarGroup>
        <ToolbarGroup>
          <ToolbarSelect
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
                <ToolbarSelectOption
                  key={trackedEditor.id}
                  value={trackedEditor.id}
                >
                  {trackedEditor.label}
                  {trackedEditor.activelyTracked ? null : " (destroyed)"}
                </ToolbarSelectOption>
              );
            })}
          </ToolbarSelect>
        </ToolbarGroup>
      </div>
      <Tabs
        tabs={[
          { label: "Log Explorer" as const },
          { label: "Playground" as const },
        ]}
        contentComponent={(tab) => {
          if (!activeTrackedEditor) {
            return null;
          }
          if (tab.label === "Log Explorer") {
            return <LogExplorer />;
          }
          if (tab.label === "Playground") {
            return <Playground />;
          }
          return null;
        }}
      />
    </div>
  );
}
