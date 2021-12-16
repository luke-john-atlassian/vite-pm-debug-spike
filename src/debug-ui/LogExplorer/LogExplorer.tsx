import { useEffect, useState } from "react";
import { TrackedEditor } from "../../backend/backend";
import type { EditorLogEvent } from "../../prosemirror-plugin/comms/send-to-backend";

import { LogList } from "./LogList";
import { LogEntryOverview } from "./LogEntryOverview";
import { useAppStateContextValue } from "../AppStateProvider";
import { ToolbarAndContentContainer } from "../Components/Layout";
import { Toolbar, ToolbarGroup, ToolbarHeading } from "../Components/Toolbar";
import { ResizerWidget, useResize } from "../Components/ResizablePanes";

export function LogExplorer() {
  const { activeTrackedEditor } = useAppStateContextValue();
  const { log, id: editorId } = activeTrackedEditor!;

  const { selectedLogEntry, currentLogEntry, selectLogEntryTime } =
    useSelectableLogEntry({ log, editorId });

  const { size, paneProps, resizerRef, resizerProps } = useResize({
    initialSize: 500,
    sideToResize: "left",
  });

  return (
    <ToolbarAndContentContainer>
      <Toolbar>
        <ToolbarGroup>
          <ToolbarHeading Tag="h2">Editor History</ToolbarHeading>
        </ToolbarGroup>
      </Toolbar>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignContent: "stretch",
          overflow: "scroll",
          height: "100%",
        }}
        {...paneProps}
      >
        <div style={{ overflow: "scroll", width: size }}>
          <LogList
            log={log}
            selectedLogEntry={selectedLogEntry}
            setSelectedLogEntry={selectLogEntryTime}
          />
        </div>
        <ResizerWidget ref={resizerRef} {...resizerProps} />
        <div style={{ flexGrow: 1 }}>
          <LogEntryOverview entry={currentLogEntry} />
        </div>
      </div>
    </ToolbarAndContentContainer>
  );
}

let lastLogSelection: { [editorId: string]: EditorLogEvent | undefined } = {};
function useSelectableLogEntry({
  log,
  editorId,
}: {
  log: TrackedEditor["log"];
  editorId: string;
}) {
  const [selectedLogEntry, setSelectedLogEntry] = useState<
    EditorLogEvent | undefined
  >(() => {
    return lastLogSelection[editorId];
  });

  useEffect(() => {
    const previousSelection = lastLogSelection[editorId];
    setSelectedLogEntry(previousSelection || log[0]);
  }, [editorId]);

  const currentLogEntry = log.find((logEntry) => {
    return logEntry.time === selectedLogEntry?.time;
  });

  function selectLogEntryTime(logEntry: TrackedEditor["log"][number]) {
    lastLogSelection[editorId] = logEntry;
    setSelectedLogEntry(logEntry);
  }
  return { selectedLogEntry, currentLogEntry, selectLogEntryTime };
}
