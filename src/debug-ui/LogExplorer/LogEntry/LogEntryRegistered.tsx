import { RegisteredEvent } from "../../../prosemirror-plugin/comms/send-to-backend";

import { StateOverview } from "./StateOverview";

export function LogEntryRegistered({
  registeredEvent,
}: {
  registeredEvent: RegisteredEvent;
}) {
  return (
    <StateOverview
      serializableEditorState={registeredEvent.serializableState}
    />
  );
}
