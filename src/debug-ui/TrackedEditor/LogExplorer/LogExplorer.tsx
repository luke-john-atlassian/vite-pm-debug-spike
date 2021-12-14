import { useState } from "react";
import { TrackedEditor } from "../../../backend/backend";

import { LogList } from "./LogList";
import { LogEntryOverview } from "./LogEntryOverview";

export function LogExplorer({ log }: { log: TrackedEditor["log"] }) {
  const [selectedLogEntryIndex, setSelectedLogEntryIndex] = useState(0);

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
            selectedLogEntryIndex={selectedLogEntryIndex}
            setSelectedLogEntryIndex={(transactionIndex: number) => {
              setSelectedLogEntryIndex(transactionIndex);
            }}
          />
        </div>
        <div style={{ flexGrow: 1 }}>
          <LogEntryOverview entry={log[selectedLogEntryIndex]} />
        </div>
      </div>
    </div>
  );
}
