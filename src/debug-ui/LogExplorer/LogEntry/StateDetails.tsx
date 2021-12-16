import React, { Fragment } from "react";

import { SerializableEditorState } from "../../../prosemirror-plugin/comms/send-to-backend";
import { Details, DetailsContent, Summary } from "../../Components/Layout";
import { JSONTree } from "../../Components/JSONTree";

export function StateDetails({
  serializableEditorState,
}: {
  serializableEditorState: SerializableEditorState;
}) {
  return (
    <Fragment>
      <Details>
        <Summary isTop={true}>Document</Summary>
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
