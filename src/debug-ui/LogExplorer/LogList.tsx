import type * as React from "react";
import { Fragment } from "react";

import { TrackedEditor } from "../../backend/backend";
import { EditorLogEvent } from "../../prosemirror-plugin/comms/send-to-backend";

const tableHeaderStyle = {
  fontWeight: 400,
  fontSize: "13px",
  color: "rgb(51, 51, 51)",
  borderBottom: "1px solid rgb(202, 205, 209)",
  borderRight: "1px solid rgb(202, 205, 209)",
  height: "20px",
};

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
      <table
        style={{
          width: "100%",
          // sizes+colors copied from chrome devtools
          borderSpacing: 0,
          fontFamily: "sans-serif",
        }}
      >
        <thead
          style={{
            backgroundColor: "rgb(241, 243, 244)",
          }}
        >
          <tr>
            <th style={tableHeaderStyle}>type</th>
            <th style={tableHeaderStyle}>time</th>
            <th style={tableHeaderStyle}>duration</th>
            <th style={{ ...tableHeaderStyle, borderRight: "none" }}>source</th>
          </tr>
        </thead>
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
      </table>
    </Fragment>
  );
}

const tableDataCellStyle = {
  padding: "2px 4px",
};

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
    <tr
      {...trAttrs}
      style={{
        fontSize: "13px",
        lineHeight: "14.4px",
        color: isSelected ? "white" : undefined,
        cursor: "pointer",
        ...getTableRowStyles({ isOdd, isSelected }),

        ...trAttrs.style,
      }}
      aria-selected={isSelected ? "true" : "false"}
    >
      <td style={tableDataCellStyle}>{entry.type}</td>
      <td style={tableDataCellStyle}>{timeView}</td>
      <td style={tableDataCellStyle}>{duration}</td>
      <td style={tableDataCellStyle}>{sourcePath}</td>
    </tr>
  );
}

function getTableRowStyles({
  isOdd,
  isSelected,
}: {
  isOdd: boolean;
  isSelected: boolean;
}) {
  if (isSelected) {
    return {
      background: "rgb(26, 115, 232)",
      color: "white",
    };
  }
  if (isOdd) {
    return { background: "rgb(245, 245, 245)" };
  }
  return {};
}
