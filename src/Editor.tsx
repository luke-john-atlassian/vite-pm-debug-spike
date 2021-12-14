import { schema } from "prosemirror-schema-basic";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { baseKeymap } from "prosemirror-commands";
import { keymap } from "prosemirror-keymap";
import { undo, redo, history } from "prosemirror-history";

export function Editor() {
  return (
    <div
      style={{ border: "1px solid pink" }}
      ref={(node) => {
        let state = EditorState.create({
          schema,
          plugins: [
            history(),
            keymap({ "Mod-z": undo, "Mod-y": redo }),
            keymap(baseKeymap),
          ],
        });
        new EditorView(node!, { state });
      }}
    ></div>
  );
}
