import { EditorState, Transaction } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { Schema } from "prosemirror-model";

import { AppendTransaction, getSendToBackend } from "./comms/send-to-backend";
import "./comms/listen-to-backend";

import {
  getTransactionStack,
  TransactionStack,
} from "./utils/getTransactionStack";

let debugBackendSyncIdCounter = 0;
function getDebugBackendSyncIdCounter() {
  return `debugBackendSyncId-${debugBackendSyncIdCounter++}`;
}

export let editorTrackers: EditorTracker[] = [];

export class EditorTracker {
  private connected: boolean = false;

  // the constructor and plugin_view_update methods will be called in sequence
  // and following both, the editorView and editorState will be set.
  id: string;
  editorView!: EditorView;
  sendToBackend: ReturnType<typeof getSendToBackend>;
  constructor(public editorState: EditorState) {
    this.id = getDebugBackendSyncIdCounter();
    this.sendToBackend = getSendToBackend(this.id);

    editorTrackers.push(this);
    this.monkeyPatchApplyTransaction(editorState);
  }
  private registerEditorView(editorView: EditorView) {
    this.editorView = editorView;

    this.sendToBackend.logRegistered({ state: this.editorState });

    this.monkeyPatch_editorView_eventHandlers();
  }

  private lastApplyTransactionDuration: number | undefined = undefined;
  private lastTransactionStack: TransactionStack | undefined = undefined;
  private lastAppendTransactions: AppendTransaction[] | undefined = undefined;
  onTransactionComplete(transaction: Transaction<any>, newState: EditorState) {
    this.sendToBackend.logTransaction({
      transaction,
      state: newState,
      stack: this.lastTransactionStack!,
      duration: this.lastApplyTransactionDuration!,
      appendTransactions: this.lastAppendTransactions!,
    });
  }

  destroy() {
    this.sendToBackend.destroy();
  }

  // ---
  // Methods monkey patched on EditorView ...
  //

  //     view.dom.addEventListener(event, view.eventHandlers[event] = event => {
  monkeyPatch_editorView_eventHandlers() {}

  // ---
  // Methods monkey patched on EditorState ...
  //

  monkeyPatchApplyTransaction(editorState: EditorState) {
    const original_applyTransaction = editorState.applyTransaction;
    let newEditorState: EditorState;

    editorState.applyTransaction = (tr: any) => {
      let appendTransactionsRun: any[] = [];
      // @ts-ignore
      for (const pluginKey of Object.keys(editorState.config.plugins)) {
        let originalPluginAppendTransaction =
          // @ts-ignore
          editorState.config.plugins[pluginKey].spec.appendTransaction;
        function patchedPluginAppendTransaction(...args: any[]) {
          const startTime = performance.now();
          // @ts-ignore
          const pluginResult = originalPluginAppendTransaction
            // @ts-ignore
            .call(editorState.config.plugins[pluginKey], ...args);
          const endTime = performance.now();

          const appendTransactionDuration = endTime - startTime;

          appendTransactionsRun.push({
            duration: appendTransactionDuration,
            // @ts-ignore
            pluginKey: editorState.config.plugins[pluginKey].key,
          });
          // @ts-ignore
          editorState.config.plugins[pluginKey].spec.appendTransaction =
            originalPluginAppendTransaction;
          return pluginResult;
        }
        // @ts-ignore
        editorState.config.plugins[pluginKey].spec.appendTransaction =
          originalPluginAppendTransaction
            ? patchedPluginAppendTransaction
            : undefined;
      }

      const startTime = performance.now();

      this.lastTransactionStack = captureStack();
      let result = original_applyTransaction.call(editorState, tr);

      const endTime = performance.now();

      const applyTransactionDuration = endTime - startTime;
      this.lastApplyTransactionDuration = applyTransactionDuration;

      this.lastAppendTransactions = appendTransactionsRun;

      newEditorState = result.state;
      this.editorState = result.state;
      this.onTransactionComplete(tr, newEditorState);
      this.monkeyPatchApplyTransaction(newEditorState!);

      return result;
    };
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
    // called before applyTransaction completed
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

function captureStack() {
  try {
    throw new Error();
  } catch (err: any) {
    const stack = getTransactionStack(err.stack);
    return stack;
  }
}
