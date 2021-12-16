import { TransactionEvent } from "../../../prosemirror-plugin/comms/send-to-backend";

import { JSONTree } from "../../Components/JSONTree";
import { ToolbarAndContentContainer } from "../../Components/Layout";
import {
  Toolbar,
  ToolbarGroup,
  ToolbarHeading,
} from "../../Components/Toolbar";
import { Structure } from "./DocumentVisualisations/Structure";
import { EnhancedToString } from "./DocumentVisualisations/EnhancedToString";
import { ResizerWidget, useResize } from "../../Components/ResizablePanes";
import { StateOverview } from "./StateOverview";

export function LogEntryTransaction({
  transactionEvent,
}: {
  transactionEvent: TransactionEvent;
}) {
  const { size, paneProps, resizerProps } = useResize({
    initialSize: 500,
    sideToResize: "left",
  });

  return (
    <ToolbarAndContentContainer>
      <Toolbar>
        <ToolbarGroup>
          <ToolbarHeading Tag="h3">
            Transaction: {transactionEvent.time}
          </ToolbarHeading>
        </ToolbarGroup>
      </Toolbar>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignContent: "stretch",
          overflow: "scroll",
          height: "100%",
        }}
        {...paneProps}
      >
        <div style={{ overflow: "scroll", width: size }}>
          <div style={{ width: "100%" }}>
            <p>{transactionEvent.documentRepresentations.string}</p>
            <EnhancedToString
              editorState={transactionEvent.serializableState}
            />
            <Structure editorState={transactionEvent.serializableState} />
            <JSONTree
              data={transactionEvent.serializableState}
              invertTheme={false}
              hideRoot
            />
          </div>
        </div>
        <ResizerWidget {...resizerProps} />
        <div style={{ flexGrow: 1, overflow: "scroll" }}>
          <StateOverview
            serializableEditorState={transactionEvent.serializableState}
          />
        </div>
      </div>
    </ToolbarAndContentContainer>
  );
}
