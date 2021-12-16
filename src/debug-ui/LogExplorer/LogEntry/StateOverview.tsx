import { SerializableEditorState } from "../../../prosemirror-plugin/comms/send-to-backend";
import { JSONTree } from "../../Components/JSONTree";
import { ToolbarAndContentContainer } from "../../Components/Layout";
import {
  Toolbar,
  ToolbarGroup,
  ToolbarHeading,
} from "../../Components/Toolbar";

export function StateOverview({
  serializableEditorState,
}: {
  serializableEditorState: SerializableEditorState;
}) {
  return (
    <ToolbarAndContentContainer>
      <Toolbar>
        <ToolbarGroup>
          <ToolbarHeading Tag="h4">Editor State</ToolbarHeading>
        </ToolbarGroup>
      </Toolbar>
      <div style={{ overflow: "scroll" }}>
        <JSONTree data={serializableEditorState} invertTheme={false} hideRoot />
      </div>
    </ToolbarAndContentContainer>
  );
}
