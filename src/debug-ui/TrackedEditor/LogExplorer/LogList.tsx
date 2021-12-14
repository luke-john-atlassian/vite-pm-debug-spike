import { Fragment } from "react";
import { TrackedEditor } from "../../../backend/backend";

export function LogList({
  log,
  selectedLogEntryIndex,
  setSelectedLogEntryIndex,
}: {
  log: TrackedEditor["log"];
  selectedLogEntryIndex: number;
  setSelectedLogEntryIndex: (logIndex: number) => void;
}) {
  return (
    <Fragment>
      <h3>Editor History</h3>
      <table>
        <thead>
          <tr>
            <th>type</th>
            <th>time</th>
          </tr>
        </thead>
        <tbody>
          {log.map((entry, index) => {
            return (
              <tr
                key={entry.time}
                onClick={() => setSelectedLogEntryIndex(index)}
                aria-selected={
                  selectedLogEntryIndex === index ? "true" : "false"
                }
                style={{
                  background:
                    selectedLogEntryIndex === index ? "blue" : undefined,
                  color: selectedLogEntryIndex === index ? "white" : undefined,
                  cursor: "pointer",
                }}
              >
                <td>{entry.type}</td>
                <td>{entry.time}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Fragment>
  );
}
