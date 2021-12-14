import { schema } from "prosemirror-schema-basic";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";

export function Editor() {
  return (
    <div
      style={{ border: "1px solid pink" }}
      ref={(node) => {
        let state = EditorState.create({ schema });
        new EditorView(node!, { state });
      }}
    ></div>
  );
}
