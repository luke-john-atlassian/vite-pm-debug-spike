import { TransactionEvent } from "../../../prosemirror-plugin/comms/send-to-backend";

import {
  Toolbar,
  ToolbarAndContentContainer,
  ToolbarGroup,
  ToolbarHeading,
} from "../../Components/Toolbar";
import { ResizerWidget, useResize } from "../../Components/ResizablePanes";
import { TopTabs, ContentArea } from "../../Components/Layout";

import { Structure } from "./DocumentVisualisations/Structure";
import { EnhancedToString } from "./DocumentVisualisations/EnhancedToString";
import { StateDetails } from "./StateDetails";
import { NodeSelectionContextProvider } from "./DocumentVisualisations/NodeSelectionContext";
import { TransactionDetails } from "./TransactionDetails/TransactionDetails";

export function LogEntryTransaction({
  transactionEvent,
}: {
  transactionEvent: TransactionEvent;
}) {
  const { size, paneProps, resizerProps } = useResize({
    initialSize: 800,
    sideToResize: "left",
  });

  return (
    <ToolbarAndContentContainer height="22px">
      <Toolbar>
        <ToolbarGroup>
          <ToolbarHeading Tag="h3">
            Transaction: {transactionEvent.time}
          </ToolbarHeading>
        </ToolbarGroup>
      </Toolbar>

      <NodeSelectionContextProvider transactionTime={transactionEvent.time}>
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
          <div style={{ overflow: "scroll", width: size, fontSize: "13px" }}>
            <div style={{ width: "100%", height: "100%" }}>
              <TopTabs
                tabs={[
                  { label: "Classic" as const },
                  { label: "PM doc.toString()" as const },
                  { label: "Enhanced toString" as const },
                  { label: "Details" as const },
                ]}
                contentComponent={(tab) => {
                  if (tab.label === "Classic") {
                    return (
                      <ContentArea>
                        <Structure
                          editorState={transactionEvent.serializableState}
                        />
                      </ContentArea>
                    );
                  }
                  if (tab.label === "PM doc.toString()") {
                    return (
                      <ContentArea>
                        <span>
                          {transactionEvent.documentRepresentations.string}
                        </span>
                      </ContentArea>
                    );
                  }
                  if (tab.label === "Enhanced toString") {
                    return (
                      <ContentArea>
                        <EnhancedToString
                          editorState={transactionEvent.serializableState}
                        />
                      </ContentArea>
                    );
                  }
                  if (tab.label === "Details") {
                    return (
                      <TransactionDetails transactionEvent={transactionEvent} />
                    );
                  }
                  return null;
                }}
              />
            </div>
          </div>
          <ResizerWidget {...resizerProps} />
          <div style={{ flex: 1, overflow: "scroll" }}>
            <StateDetails
              serializableEditorState={transactionEvent.serializableState}
            />
          </div>
        </div>
      </NodeSelectionContextProvider>
    </ToolbarAndContentContainer>
  );
}
