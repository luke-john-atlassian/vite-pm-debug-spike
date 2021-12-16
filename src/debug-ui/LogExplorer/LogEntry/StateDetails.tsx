import React, { Fragment } from "react";

import { SerializableEditorState } from "../../../prosemirror-plugin/comms/send-to-backend";
import { Details, DetailsContent, Summary } from "../../Components/Layout";
import { JSONTree } from "../../Components/JSONTree";
import { useNodeSelectionContextValue } from "./DocumentVisualisations/NodeSelectionContext";

export function StateDetails({
  serializableEditorState,
}: {
  serializableEditorState: SerializableEditorState;
}) {
  const { selectedNode } = useNodeSelectionContextValue();
  return (
    <Fragment>
      {selectedNode ? (
        <Details>
          <Summary isTop={true}>Selected node</Summary>
          <DetailsContent>
            <JSONTree
              data={selectedNode}
              invertTheme={false}
              hideRoot
              shouldExpandNode={(keyPath) => {
                if (keyPath[0] === "content") {
                  return true;
                }
                return false;
              }}
            />
          </DetailsContent>
        </Details>
      ) : null}
      <Details>
        <Summary isTop={selectedNode ? false : true}>Document</Summary>
        <DetailsContent>
          <JSONTree
            data={serializableEditorState.doc}
            invertTheme={false}
            hideRoot
          />
        </DetailsContent>
      </Details>
      <Details>
        <Summary>Selection</Summary>
        <DetailsContent>
          <JSONTree
            data={serializableEditorState.selection}
            invertTheme={false}
            hideRoot
          />
        </DetailsContent>
      </Details>
      <Details>
        <Summary isBottom={true}>State</Summary>
        <DetailsContent>
          <JSONTree
            data={serializableEditorState}
            invertTheme={false}
            hideRoot
          />
        </DetailsContent>
      </Details>
    </Fragment>
  );
}
