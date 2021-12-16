import React, { createContext, useContext } from "react";

const toolbarAndContentContext = createContext({ height: "27px" });
export function ToolbarAndContentContainer({
  children,
  height = "27px",
}: {
  children: React.ReactNode;
  height?: string;
}) {
  return (
    <toolbarAndContentContext.Provider value={{ height }}>
      <div
        style={{
          height: "100%",
          width: "100%",
          overflow: "hidden",

          display: "grid",
          gridTemplateColumns: "100%",
          gridTemplateRows: `${height} 1fr`,
          gridRowGap: "1px",
          justifyItems: "stretch",
          alignItems: "stretch",

          fontFamily: "sans-serif",
        }}
      >
        {children}
      </div>
    </toolbarAndContentContext.Provider>
  );
}

export function Toolbar({ children }: { children: React.ReactNode }) {
  const { height } = useContext(toolbarAndContentContext);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottom: "1px solid black",

        // sizes+colors copied from chrome devtools
        backgroundColor: "rgb(241, 243, 244)",
        borderBottomColor: "rgb(202, 205, 209)",
        height,
      }}
    >
      {children}
    </div>
  );
}

export function ToolbarGroup({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
    >
      {children}
    </div>
  );
}

export function ToolbarHeading({
  Tag,
  children,
}: {
  Tag: `h${1 | 2 | 3 | 4 | 5 | 6}`;
  children: React.ReactNode;
}) {
  return (
    <Tag
      style={{
        // sizes+colors copied from chrome devtools
        color: "rgb(51, 51, 51)",
        fontSize: "13px",
        fontFamily: "sans-serif",
        fontWeight: "400",
        padding: "0 1rem",
        margin: 0,
      }}
    >
      {children}
    </Tag>
  );
}

export function ToolbarSelect({
  children,
  ...selectProps
}: React.DetailedHTMLProps<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  HTMLSelectElement
>) {
  return (
    <select
      {...selectProps}
      style={{
        // sizes+colors copied from chrome devtools
        border: "none",
        backgroundColor: "rgba(0, 0, 0, 0)",
        fontSize: "13px",
        color: "rgb(95, 99, 104)",
        display: "flex",
        flexBasis: "auto",
        fontStretch: "100%",
        height: "22px",

        ...selectProps.style,
      }}
    >
      {children}
    </select>
  );
}

export function ToolbarSelectOption({
  children,
  ...optionProps
}: React.DetailedHTMLProps<
  React.OptionHTMLAttributes<HTMLOptionElement>,
  HTMLOptionElement
>) {
  return <option {...optionProps}>{children}</option>;
}
