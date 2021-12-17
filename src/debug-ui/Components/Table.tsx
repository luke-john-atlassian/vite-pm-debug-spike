import React from "react";

export function Table({ children }: { children: React.ReactNode }) {
  return (
    <table
      style={{
        width: "100%",
        // sizes+colors copied from chrome devtools
        borderSpacing: 0,
        fontFamily: "sans-serif",
      }}
    >
      {children}
    </table>
  );
}

export function TableHead({ children }: { children: React.ReactNode }) {
  return (
    <thead
      style={{
        backgroundColor: "rgb(241, 243, 244)",
      }}
    >
      {children}
    </thead>
  );
}

export function TableHeader({
  children,
  isLast = false,
  ...thAttrs
}: { children: React.ReactNode; isLast?: boolean } & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLTableCellElement>,
  HTMLTableCellElement
>) {
  return (
    <th
      {...thAttrs}
      style={{
        fontWeight: 400,
        fontSize: "13px",
        color: "rgb(51, 51, 51)",
        borderBottom: "1px solid rgb(202, 205, 209)",
        borderRight: isLast ? "1px solid rgb(202, 205, 209)" : "none",
        height: "20px",
      }}
    >
      {children}
    </th>
  );
}

export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody>{children}</tbody>;
}

export function TableRow({
  isOdd,
  isSelected,
  children,
  ...trAttrs
}: {
  children: React.ReactNode;
  isOdd: boolean;
  isSelected: boolean;
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLTableRowElement>,
  HTMLTableRowElement
>) {
  let dynamicStyles: React.CSSProperties = {};

  if (isOdd) {
    dynamicStyles = { background: "rgb(245, 245, 245)" };
  }

  if (isSelected) {
    dynamicStyles = {
      background: "rgb(26, 115, 232)",
      color: "white",
    };
  }

  return (
    <tr
      {...trAttrs}
      style={{
        ...trAttrs.style,
        fontSize: "13px",
        lineHeight: "14.4px",
        color: isSelected ? "white" : undefined,
        cursor: "pointer",
        ...dynamicStyles,
      }}
    >
      {children}
    </tr>
  );
}

export function TableDataCell({
  children,
  ...tdAttrs
}: { children: React.ReactNode } & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLTableCellElement>,
  HTMLTableCellElement
>) {
  return (
    <td {...tdAttrs} style={{ ...tdAttrs.style, padding: "2px 4px" }}>
      {children}
    </td>
  );
}
