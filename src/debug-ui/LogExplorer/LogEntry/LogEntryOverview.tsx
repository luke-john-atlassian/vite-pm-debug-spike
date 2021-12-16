import { TrackedEditor } from "../../../backend/backend";

import { LogEntryTransaction } from "./LogEntryTransaction";
import { LogEntryRegistered } from "./LogEntryRegistered";

export function LogEntryOverview({
  entry,
}: {
  entry?: TrackedEditor["log"][number];
}) {
  if (!entry) {
    return null;
  }

  if (entry.type === "registered") {
    return <LogEntryRegistered registeredEvent={entry} />;
  }

  return <LogEntryTransaction transactionEvent={entry} />;
}
