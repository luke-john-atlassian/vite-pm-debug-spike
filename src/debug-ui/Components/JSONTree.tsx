import React from "react";
import ReactJSONTree from "react-json-tree";

export function JSONTree(
  props: Partial<React.ComponentPropsWithoutRef<typeof ReactJSONTree>>
) {
  return (
    <div style={{ fontSize: "12px", marginTop: "-5px" }}>
      <ReactJSONTree {...props} theme={ReactJSONTreeTheme} />
    </div>
  );
}

export const ReactJSONTreeTheme = {
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
