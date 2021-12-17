import type * as React from "react";
import { Fragment } from "react";

import { TrackedEditor } from "../../backend/backend";
import { EditorLogEvent } from "../../prosemirror-plugin/comms/send-to-backend";

import {
  Table,
  TableDataCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../Components/Table";

export function LogList({
  log,
  selectedLogEntry,
  setSelectedLogEntry,
}: {
  log: TrackedEditor["log"];
  selectedLogEntry?: EditorLogEvent;
  setSelectedLogEntry: (logEntry: EditorLogEvent) => void;
}) {
  const oddStart = log.length % 2;
  function getIsOdd(index: number) {
    return (index + 2 - oddStart) % 2 === 1;
  }

  return (
    <Fragment>
      <Table>
        <TableHead>
          <tr>
            <TableHeader>type</TableHeader>
            <TableHeader>time</TableHeader>
            <TableHeader>duration</TableHeader>
            <TableHeader isLast={true}>source</TableHeader>
          </tr>
        </TableHead>
        <tbody>
          {log.map((entry, index) => {
            const isSelected = selectedLogEntry?.time === entry.time;

            return (
              <LogListEntry
                key={entry.time}
                isOdd={getIsOdd(index)}
                isSelected={isSelected}
                onClick={() => setSelectedLogEntry(entry)}
                entry={entry}
              />
            );
          })}
        </tbody>
      </Table>
    </Fragment>
  );
}

function LogListEntry({
  entry,
  isSelected,
  isOdd,
  ...trAttrs
}: {
  entry: EditorLogEvent;
  isSelected: boolean;
  isOdd: boolean;
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLTableRowElement>,
  HTMLTableRowElement
>) {
  const sourcePath =
    entry.type === "transaction"
      ? entry.stack.path.map((entry) => entry.name).join(" > ")
      : "";

  const time = new Date(entry.time);

  const timeView = `${time.toLocaleTimeString()}.${time
    .getMilliseconds()
    .toString()
    .padStart(3, "0")}`;

  const duration =
    entry.type === "transaction" ? `${entry.duration.toFixed(1)}ms` : "--";

  return (
    <TableRow
      aria-selected={isSelected ? "true" : "false"}
      isOdd={isOdd}
      isSelected={isSelected}
      {...trAttrs}
    >
      <TableDataCell>{entry.type}</TableDataCell>
      <TableDataCell>{timeView}</TableDataCell>
      <TableDataCell>{duration}</TableDataCell>
      <TableDataCell>{sourcePath}</TableDataCell>
    </TableRow>
  );
}
