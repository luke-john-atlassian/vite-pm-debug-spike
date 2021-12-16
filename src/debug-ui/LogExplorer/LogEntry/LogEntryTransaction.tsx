import { TransactionEvent } from "../../../prosemirror-plugin/comms/send-to-backend";

import { JSONTree } from "../../Components/JSONTree";
import { ToolbarAndContentContainer } from "../../Components/Layout";
import {
  Toolbar,
  ToolbarGroup,
  ToolbarHeading,
} from "../../Components/Toolbar";
import { Structure } from "./DocumentVisualisations/Structure";

export function LogEntryTransaction({
  transactionEvent,
}: {
  transactionEvent: TransactionEvent;
}) {
  return (
    <ToolbarAndContentContainer>
      <Toolbar>
        <ToolbarGroup>
          <ToolbarHeading Tag="h3">
            Transaction: {transactionEvent.time}
          </ToolbarHeading>
        </ToolbarGroup>
      </Toolbar>
      <div>
        <pre>{transactionEvent.documentRepresentations.string}</pre>
        <Structure editorState={transactionEvent.serializableState} />
        <JSONTree
          data={transactionEvent.serializableState}
          invertTheme={false}
          hideRoot
        />
      </div>
    </ToolbarAndContentContainer>
  );
}
