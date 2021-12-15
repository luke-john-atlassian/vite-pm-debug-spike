import { useEffect, useState } from "react";
import { TrackedEditor } from "../../backend/backend";
import type { EditorLogEvent } from "../../prosemirror-plugin/comms/send-to-backend";

import { LogList } from "./LogList";
import { LogEntryOverview } from "./LogEntryOverview";

export function LogExplorer({
  log,
  editorId,
}: {
  log: TrackedEditor["log"];
  editorId: string;
}) {
  const { selectedLogEntry, currentLogEntry, selectLogEntryTime } =
    useSelectableLogEntry({ log, editorId });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignContent: "stretch",
        overflow: "scroll",
        height: "100%",
      }}
    >
      <div style={{ overflow: "scroll" }}>
        <LogList
          log={log}
          selectedLogEntry={selectedLogEntry}
          setSelectedLogEntry={selectLogEntryTime}
        />
      </div>
      <div style={{ flexGrow: 1 }}>
        <LogEntryOverview entry={currentLogEntry} />
      </div>
    </div>
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
