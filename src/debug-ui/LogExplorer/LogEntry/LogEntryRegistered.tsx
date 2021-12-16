import { RegisteredEvent } from "../../../prosemirror-plugin/comms/send-to-backend";

import { JSONTree } from "../../Components/JSONTree";
import { ToolbarAndContentContainer } from "../../Components/Layout";
import {
  Toolbar,
  ToolbarGroup,
  ToolbarHeading,
} from "../../Components/Toolbar";

export function LogEntryRegistered({
  registeredEvent,
}: {
  registeredEvent: RegisteredEvent;
}) {
  return (
    <ToolbarAndContentContainer>
      <Toolbar>
        <ToolbarGroup>
          <ToolbarHeading Tag="h3">Registered</ToolbarHeading>
        </ToolbarGroup>
      </Toolbar>
      <JSONTree
        data={registeredEvent.serializableState}
        invertTheme={false}
        hideRoot
      />
    </ToolbarAndContentContainer>
  );
}
