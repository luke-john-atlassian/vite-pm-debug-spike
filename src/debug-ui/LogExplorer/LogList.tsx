import type * as React from "react";
import { Fragment } from "react";
import { TrackedEditor } from "../../backend/backend";
import { EditorLogEvent } from "../../prosemirror-plugin/sync-with-backend";

export function LogList({
  log,
  selectedLogEntry,
  setSelectedLogEntry,
}: {
  log: TrackedEditor["log"];
  selectedLogEntry?: EditorLogEvent;
  setSelectedLogEntry: (logEntry: EditorLogEvent) => void;
}) {
  return (
    <Fragment>
      <h2>Editor History</h2>
      <table>
        <thead>
          <tr>
            <th>type</th>
            <th>time</th>
            <th>source</th>
          </tr>
        </thead>
        <tbody>
          {log.map((entry, index) => {
            const isSelected = selectedLogEntry?.time === entry.time;
            return (
              <LogListEntry
                key={entry.time}
                onClick={() => setSelectedLogEntry(entry)}
                aria-selected={isSelected ? "true" : "false"}
                style={{
                  background: isSelected ? "blue" : undefined,
                  color: isSelected ? "white" : undefined,
                  cursor: "pointer",
                }}
                entry={entry}
              />
            );
          })}
        </tbody>
      </table>
    </Fragment>
  );
}

function LogListEntry({
  entry,
  ...trAttrs
}: {
  entry: EditorLogEvent;
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLTableRowElement>,
  HTMLTableRowElement
>) {
  const sourcePath =
    entry.type === "transaction"
      ? entry.stack.path.map((entry) => entry.name).join(" > ")
      : "";

  const time = new Date(entry.time);

  return (
    <tr {...trAttrs}>
      <td>{entry.type}</td>
      <td>
        {time.toLocaleTimeString()}.
        {time.getMilliseconds().toString().padStart(3, "0")}
      </td>
      <td>{sourcePath}</td>
    </tr>
  );
}
