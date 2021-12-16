// Visualisation vendored from
// https://github.com/d4rkr00t/prosemirror-dev-tools/search?q=nodeColors

import React from "react";

import { SerializableEditorState } from "../../../../prosemirror-plugin/comms/send-to-backend";

import { buildColors } from "./Structure_buildColors";

const jsonTreeTheme = {
  scheme: "monokai",
  base00: "#363755",
  base01: "#604D49",
  base02: "#6D5A55",
  base03: "#D1929B",
  base04: "#B79F8D",
  base05: "#F9F8F2",
  base06: "#F7F4F1",
  base07: "#FAF8F5",
  base08: "#FA3E7E",
  base09: "#FD993C",
  base0A: "#F6BF81",
  base0B: "#B8E248",
  base0C: "#B4EFE4",
  base0D: "#85D9EF",
  base0E: "#BE87FF",
  base0F: "#D6724C",
};

const theme = {
  main: "#ffa2b1",
  main20: "rgba(255, 162, 177, .2)",
  main40: "rgba(255, 162, 177, .4)",
  main60: "rgba(255, 162, 177, .6)",
  main80: "rgba(255, 162, 177, .8)",
  main90: "rgba(255, 162, 177, .9)",
  mainBg: "#363755",
  softerMain: "#BB91A3",

  white: "#fff",
  white05: "rgba(255, 255, 255, .05)",
  white10: "rgba(255, 255, 255, .1)",
  white20: "rgba(255, 255, 255, .2)",
  white60: "rgba(255, 255, 255, .6)",
  white80: "rgba(255, 255, 255, .8)",

  black30: "rgba(0, 0, 0, .3)",

  // For diffs and structure
  lightYellow: "#FFF9C4",
  lightPink: "#FB4B85",
  darkGreen: "#81AF6D",

  syntax: jsonTreeTheme,
};

function Side({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: "3px 6px",
        background: "rgba(255, 255, 255, 0.3)",
      }}
    >
      {children}
    </div>
  );
}

function Center({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        flexGrow: 1,
        padding: "3px 9px",
        whiteSpace: "pre",
      }}
    >
      {children}
    </div>
  );
}

// @ts-ignore
export function BlockNodeContent(props) {
  if (!props.content || !props.content.content || !props.content.content.length)
    return null;

  const content = props.content.content;

  if (content[0].isBlock) {
    let startPos = props.startPos + 1;
    return (
      <div
        style={{
          padding: "0 12px",
          boxSizing: "border-box",
          borderLeft: `1px solid ${theme.white20}`,
          borderRight: `1px solid ${theme.white20}`,
        }}
      >
        {/** @ts-ignore */}
        {content.map((childNode, index) => {
          const pos = startPos;
          startPos += childNode.content.size;
          return (
            <BlockNode
              key={index}
              node={childNode}
              colors={props.colors}
              onNodeSelected={props.onNodeSelected}
              startPos={pos}
            />
          );
        })}
      </div>
    );
  }

  let startPos = props.startPos;
  return (
    <div
      style={{
        padding: "0 12px",
        display: "flex",
        width: "100%",
        boxSizing: "border-box",
        borderLeft: `1px solid ${theme.white20}`,
        borderRight: `1px solid ${theme.white20}`,
        flexWrap: "wrap",
      }}
    >
      {/** @ts-ignore */}
      {content.map((childNode, index) => {
        const pos = startPos;
        startPos += childNode.content.size;
        return (
          <InlineNode
            key={index}
            index={index}
            node={childNode}
            bg={props.colors[childNode.type.name]}
            onNodeSelected={props.onNodeSelected}
            startPos={pos}
          />
        );
      })}
    </div>
  );
}

// @ts-ignore
export function BlockNode(props) {
  const { colors, node, startPos } = props;
  const color = colors[node.type.name];
  return (
    <div>
      <div
        style={{
          width: "100%",
          marginBottom: "3px",
          boxSizing: "border-box",
          display: "flex",
          cursor: "pointer",

          background: color,
        }}
        onClick={() => props.onNodeSelected({ node })}
      >
        <Side>{startPos}</Side>
        <Center>{node.type.name}</Center>
        <Side>{startPos + node.content.size - 1}</Side>
      </div>
      <BlockNodeContent
        content={node.content}
        colors={colors}
        onNodeSelected={props.onNodeSelected}
        startPos={startPos}
      />
    </div>
  );
}

// @ts-ignore
export function InlineNode(props) {
  const { node, bg, startPos, index } = props;
  const marks =
    node.marks.length === 1
      ? ` - [${node.marks[0].type.name}]`
      : node.marks.length > 1
      ? ` - [${node.marks.length} marks]`
      : "";
  return (
    <div
      onClick={() => props.onNodeSelected({ node })}
      style={{
        flexGrow: 1,
        marginBottom: "3px",
        display: "flex",
        boxSizing: "border-box",

        cursor: "pointer",
        background: bg,
      }}
    >
      {index === 0 ? <Side>{startPos}</Side> : null}
      <Center>
        {node.type.name} {marks}
      </Center>
      <Side>{startPos + node.content.size}</Side>
    </div>
  );
}

export function Structure({
  editorState,
}: {
  editorState: SerializableEditorState;
}) {
  // SerializableEditorState type is wrong
  // @ts-ignore
  const nodeColors = buildColors(editorState.config.schema);

  return (
    <BlockNode
      colors={nodeColors}
      node={editorState.doc}
      startPos={0}
      onNodeSelected={() => {}}
    />
  );
}
