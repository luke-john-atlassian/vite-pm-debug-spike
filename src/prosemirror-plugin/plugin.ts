import { Plugin, PluginKey } from "prosemirror-state";
import { EditorTracker } from "./EditorTracker";

export const pluginKey = new PluginKey("debug-plugin");

export type DebugPluginState = {
  editorTracker: EditorTracker;
};

export const devtoolsPlugin = new Plugin({
  key: pluginKey,
  // The function will be called when the plugin's state is associated with an editor view.
  view: (editorView) => {
    const { editorTracker }: DebugPluginState = pluginKey.getState(
      editorView.state
    );
    editorTracker.plugin_view(editorView);

    return {
      update: (view, prevState) => {
        editorTracker.plugin_view_update(view, prevState);
      },

      destroy: () => {
        editorTracker.plugin_view_destroy();
      },
    };
  },
  state: {
    // Initialize the value of the field.
    init(_config, editorState): DebugPluginState {
      const editorTracker = new EditorTracker(editorState);
      return { editorTracker };
    },
    apply(
      tr,
      pluginStateValue: DebugPluginState,
      oldEditorState,
      newEditorState
    ) {
      pluginStateValue.editorTracker.plugin_state_apply(
        tr,
        pluginStateValue,
        oldEditorState,
        newEditorState
      );
      return pluginStateValue;
    },
  },
  appendTransaction(transactions, oldEditorState, newEditorState) {
    const { editorTracker }: DebugPluginState =
      pluginKey.getState(newEditorState);

    editorTracker.plugin_appendTransaction(
      transactions,
      oldEditorState,
      newEditorState
    );
  },
});
