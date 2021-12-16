import { useAppStateContextValue } from "./AppStateProvider";
import { SideTabs } from "./Components/Layout";

import {
  ToolbarAndContentContainer,
  Toolbar,
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
    <ToolbarAndContentContainer>
      <Toolbar>
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
      </Toolbar>
      <SideTabs
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
    </ToolbarAndContentContainer>
  );
}
