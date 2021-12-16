import { TransactionEvent } from "../../../prosemirror-plugin/comms/send-to-backend";

import { JSONTree } from "../../Components/JSONTree";
import { ToolbarAndContentContainer } from "../../Components/Layout";
import {
  Toolbar,
  ToolbarGroup,
  ToolbarHeading,
} from "../../Components/Toolbar";

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
        <JSONTree
          data={transactionEvent.serializableState}
          invertTheme={false}
          hideRoot
        />
      </div>
    </ToolbarAndContentContainer>
  );
}
