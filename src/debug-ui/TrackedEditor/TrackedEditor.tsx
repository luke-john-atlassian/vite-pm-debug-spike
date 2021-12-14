import { TrackedEditor } from "../../backend/backend";
import { LogExplorer } from "./LogExplorer/LogExplorer";

export function TrackedEditorUI({
  trackedEditor,
}: {
  trackedEditor: TrackedEditor;
}) {
  return (
    <div>
      <h2>Editor - {trackedEditor.label}</h2>
      <LogExplorer log={trackedEditor.log} />
    </div>
  );
}
