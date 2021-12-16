import { RegisteredEvent } from "../../../prosemirror-plugin/comms/send-to-backend";
import { StateDetails } from "./StateDetails";

export function LogEntryRegistered({
  registeredEvent,
}: {
  registeredEvent: RegisteredEvent;
}) {
  return (
    <StateDetails serializableEditorState={registeredEvent.serializableState} />
  );
}
