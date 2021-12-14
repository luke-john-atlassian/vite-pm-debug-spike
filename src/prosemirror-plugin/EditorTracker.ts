import { EditorState, Plugin, Transaction } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { Schema } from "prosemirror-model";
import { getBackendNotifier } from "./sync-with-backend";

let debugBackendSyncIdCounter = 0;
function getDebugBackendSyncIdCounter() {
  return `debugBackendSyncId-${debugBackendSyncIdCounter++}`;
}

export class EditorTracker {
  private connected: boolean = false;

  // the constructor and plugin_view_update methods will be called in sequence
  // and following both, the editorView and editorState will be set.
  id: string;
  private editorView!: EditorView;
  backendNotifier: ReturnType<typeof getBackendNotifier>;

  constructor(private editorState: EditorState) {
    this.id = getDebugBackendSyncIdCounter();
    this.backendNotifier = getBackendNotifier(this.id);
  }
  private registerEditorView(editorView: EditorView) {
    this.editorView = editorView;

    this.backendNotifier.logRegistered({ state: this.editorState });
  }

  onTransactionComplete(transaction: Transaction<any>, newState: any) {
    this.backendNotifier.logTransaction({ transaction, state: newState });
  }

  destroy() {
    this.backendNotifier.destroy();
  }

  // ---
  // Methods registered on the plugin
  //

  // The function will be called when the plugin's state is associated with an editor view.
  public plugin_view(editorView: EditorView) {
    // required for this class to work "correctly"
    this.registerEditorView(editorView);
  }

  // Called whenever the view's state is updated.
  public plugin_view_update<S extends Schema = any>(
    view: EditorView<S>,
    prevState: EditorState<S>
  ) {}

  // Called when the view is destroyed or receives a state with different plugins.
  public plugin_view_destroy() {
    this.destroy();
  }

  // Apply the given transaction to this state field, producing a new field value.
  // Called on all transactions (once transaction resolved, and prior to "committing").
  public plugin_state_apply<T = any, S extends Schema = any>(
    tr: Transaction<S>,
    value: T,
    oldState: EditorState<S>,
    newState: EditorState<S>
  ): Transaction<S> {
    this.onTransactionComplete(tr, newState);
    return tr;
  }

  public plugin_appendTransaction<T = any, S extends Schema = any>(
    transactions: Array<Transaction<S>>,
    oldState: EditorState<S>,
    newState: EditorState<S>
  ): Transaction<S> | null | undefined | void {
    return null;
  }
}
