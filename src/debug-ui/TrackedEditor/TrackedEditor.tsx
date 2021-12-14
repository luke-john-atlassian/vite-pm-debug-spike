import { TrackedEditor } from "../../backend/backend";
import { TransactionExplorer } from "./TransactionExplorer/TransactionExplorer";

export function TrackedEditorUI({
  trackedEditor,
}: {
  trackedEditor: TrackedEditor;
}) {
  return (
    <div>
      <h2>Tracked UI</h2>
      <TransactionExplorer transactions={trackedEditor.transactionHistory} />
    </div>
  );
}
