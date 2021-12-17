import React from "react";

export function DescriptionList({ children }: { children: React.ReactNode }) {
  return <dl>{children}</dl>;
}

export function DescriptionListPair({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}

export function DescriptionTerm({ children }: { children: React.ReactNode }) {
  return (
    <dt
      style={{
        // sizes+colors copied from chrome devtools (Application>Frames)
        color: "rgb(95, 99, 104, 1)",
        width: "100px",
        display: "inline-block",
      }}
    >
      {children}
    </dt>
  );
}

export function DescriptionDetails({
  children,
}: {
  children: React.ReactNode;
}) {
  return <dd style={{ margin: 0, display: "inline-block" }}>{children}</dd>;
}
