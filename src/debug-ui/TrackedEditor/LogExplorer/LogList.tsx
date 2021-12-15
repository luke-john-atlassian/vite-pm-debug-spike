import type * as React from "react";
import { Fragment } from "react";
import { TrackedEditor } from "../../../backend/backend";
import { EditorLogEvent } from "../../../prosemirror-plugin/sync-with-backend";

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
            <th>source</th>
          </tr>
        </thead>
        <tbody>
          {log.map((entry, index) => {
            return (
              <LogListEntry
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

  return (
    <tr {...trAttrs}>
      <td>{entry.type}</td>
      <td>{entry.time}</td>
      <td>{sourcePath}</td>
    </tr>
  );
}
