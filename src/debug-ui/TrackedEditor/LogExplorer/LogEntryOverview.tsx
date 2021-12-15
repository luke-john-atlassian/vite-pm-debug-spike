import { Fragment } from "react";
import JSONTree from "react-json-tree";

import { TrackedEditor } from "../../../backend/backend";

export function LogEntryOverview({
  entry,
}: {
  entry?: TrackedEditor["log"][number];
}) {
  if (!entry) {
    return null;
  }

  if (entry.type === "registered") {
    return (
      <Fragment>
        <h3>Transaction Overview</h3>
        <JSONTree
          data={entry.serializableState}
          theme={theme}
          invertTheme={false}
          hideRoot
        />
      </Fragment>
    );
  }

  return (
    <Fragment>
      <h3>Transaction Overview</h3>
      <JSONTree
        data={entry.serializableTransaction}
        theme={theme}
        invertTheme={false}
        hideRoot
      />
    </Fragment>
  );
}
const theme = {
  scheme: "Cupertino",
  author: "Defman21",
  base00: "#ffffff",
  base01: "#c0c0c0",
  base02: "#c0c0c0",
  base03: "#808080",
  base04: "#808080",
  base05: "#404040",
  base06: "#404040",
  base07: "#5e5e5e",
  base08: "#c41a15",
  base09: "#eb8500",
  base0A: "#826b28",
  base0B: "#007400",
  base0C: "#318495",
  base0D: "#0000ff",
  base0E: "#a90d91",
  base0F: "#826b28",
};
