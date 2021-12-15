import { useState } from "react";
import { TrackedEditor } from "../../../backend/backend";

import { LogList } from "./LogList";
import { LogEntryOverview } from "./LogEntryOverview";
import type { EditorLogEvent } from "../../../prosemirror-plugin/sync-with-backend";

export function LogExplorer({ log }: { log: TrackedEditor["log"] }) {
  const [selectedLogEntry, setSelectedLogEntry] = useState<EditorLogEvent>();

  const currentLogEntry = log.find((logEntry) => {
    return logEntry.time === selectedLogEntry?.time;
  });

  function selectLogEntryTime(logEntry: TrackedEditor["log"][number]) {
    setSelectedLogEntry(logEntry);
  }

  return (
    <div>
      <h2>Tracked UI</h2>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignContent: "stretch",
        }}
      >
        <div>
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
    </div>
  );
}
