import React, { useEffect, useRef, useState } from "react";

function getNewSize({
  previousSize,
  previousPosition,
  newPosition,
}: {
  previousSize: number;
  previousPosition: number;
  newPosition: number;
}): number {
  const changed = newPosition - previousPosition;

  const newSize = previousSize + changed;

  return newSize;
}

export function useResize({
  initialSize,
  sideToResize,
}: {
  // TODO accept percentages (calculate init using parent position)
  initialSize: number;
  sideToResize: "left" | "right";
}) {
  const [previousPosition, setPreviousPosition] = useState(initialSize);
  const [size, setSize] = useState(initialSize);
  const [dragging, setDragging] = useState(false);

  const resizerRef = useRef<HTMLDivElement>(null);

  const paneProps: React.HtmlHTMLAttributes<HTMLElement> = {
    onMouseMove(event) {
      if (!dragging) {
        return;
      }
      setPreviousPosition(event.clientX);
      setSize(
        getNewSize({
          previousSize: size,
          previousPosition,
          newPosition: event.clientX,
        })
      );
    },
    onMouseUp(event) {
      setDragging(false);
    },
  };

  const resizerProps: React.HtmlHTMLAttributes<HTMLElement> = {
    onMouseDown(event) {
      setDragging(true);
      setPreviousPosition(event.clientX);
    },
  };

  return { size, paneProps, resizerRef, resizerProps };
}

export function ResizerWidget(
  props: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >
) {
  return (
    <div
      style={{
        height: "100%",
        position: "relative",
        width: "1px",
        background: "rgb(202, 205, 209)",
        cursor: "pointer",
      }}
    >
      <div
        {...props}
        style={{
          ...props.style,
          position: "absolute",
          top: 0,
          bottom: 0,
          left: "-4px",
          right: "-4px",
          zIndex: 1,
        }}
      />
    </div>
  );
}
