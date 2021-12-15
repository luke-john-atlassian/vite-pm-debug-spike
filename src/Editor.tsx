import { useEffect, useRef } from "react";

import { schema } from "prosemirror-schema-basic";
import { EditorState, Transaction } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { baseKeymap, toggleMark } from "prosemirror-commands";
import { keymap } from "prosemirror-keymap";
import { undo, redo, history } from "prosemirror-history";

import "prosemirror-view/style/prosemirror.css";

import { devtoolsPlugin } from "./prosemirror-plugin/plugin";

export function Editor() {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let state = EditorState.create({
      schema,
      plugins: [
        history(),
        keymap({ "Mod-z": undo, "Mod-y": redo }),
        keymap(baseKeymap),
        keymap({ "Mod-b": toggleMark(schema.marks.strong) }),
        devtoolsPlugin,
      ],
    });
    const editorView = new EditorView(editorRef.current!, { state });

    return () => {
      editorView.destroy();
    };
  }, []);

  return <div style={{ border: "1px solid pink" }} ref={editorRef}></div>;
}
