import React, { createContext, useContext, useEffect, useState } from "react";
import { Node as ProsemirrorNode } from "prosemirror-model";

const nodeSelectionContext = createContext({
  selectedNode: undefined as ProsemirrorNode | undefined,
  selectNode: (node: ProsemirrorNode) => {},
});

let lastSelectedNode: {
  [transactionTime: string]: ProsemirrorNode | undefined;
} = {};
export function NodeSelectionContextProvider({
  children,
  transactionTime,
}: {
  children: React.ReactNode;
  transactionTime: number;
}) {
  const [selectedNode, selectNode] = useState<ProsemirrorNode | undefined>(
    lastSelectedNode[`${transactionTime}`]
  );

  useEffect(() => {
    selectNode(lastSelectedNode[`${transactionTime}`]);
  }, [transactionTime]);

  function _selectNode(node: ProsemirrorNode) {
    lastSelectedNode[`${transactionTime}`] = node;
    selectNode(node);
  }
  return (
    <nodeSelectionContext.Provider
      value={{
        selectedNode,
        selectNode: _selectNode,
      }}
    >
      {children}
    </nodeSelectionContext.Provider>
  );
}

export function useNodeSelectionContextValue() {
  const nodeSelectionContextValue = useContext(nodeSelectionContext);

  return nodeSelectionContextValue;
}
