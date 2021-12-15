type StackEntryInfo = {
  name: string;
  filePath: string;
};

export type TransactionStack = {
  path: StackEntryInfo[];
  source: string;
};

function stackLineToStackEntryInfo(stackLine: string) {
  const [_at, name, filePathWithRoundBrackets] = stackLine.trim().split(" ");

  const filePath = filePathWithRoundBrackets.slice(1, -1);

  return { name, filePath };
}

export function getTransactionStack(stack: string): TransactionStack {
  const stackLines = stack.split("\n");
  const lastStackLine = stackLines[stackLines.length - 1];

  // Edit handler hit
  /* Error
    at EditorTracker.editorState_applyTransaction (EditorTracker.ts:69)
    at EditorState2.editorState.applyTransaction (EditorTracker.ts:57)
    at EditorState2.apply6 [as apply] (state.js:96)
    at EditorView2.dispatch (index.js:400)
    at histTransaction (history.js:343)
    at redo (history.js:439)
    at Plugin2.<anonymous> (keymap.js:85)
    at input.js:119
    at EditorView2.someProp (index.js:248)
    at editHandlers.keydown (input.js:119)
  */
  if (
    lastStackLine.includes("editHandlers.") ||
    lastStackLine.includes("handlers.")
  ) {
    // path 1. editHandler
    // path 2. Plugin
    // path 3. plugin functions

    // MAGIC depth from end to get sourcePlugin
    const magicDepth = 4;
    const _sourcePlugin = stackLines[stackLines.length - magicDepth];
    const lastLineWithDispatchIndex =
      stackLines.length -
      ([...stackLines]
        .reverse()
        .findIndex((line) => line.includes(".dispatch")) +
        1);

    const linesBetweenDispatchAndSourcePlugin = stackLines.slice(
      lastLineWithDispatchIndex + 1,
      -magicDepth
    );

    const path = [
      stackLineToStackEntryInfo(stackLines[stackLines.length - 1]),
      stackLineToStackEntryInfo(_sourcePlugin),
      ...linesBetweenDispatchAndSourcePlugin.map(
        (lineBetweenDispatchAndSourcePlugin) =>
          stackLineToStackEntryInfo(lineBetweenDispatchAndSourcePlugin)
      ),
    ];

    return { path, source: stack };
  }

  // handleDOMChange hit
  /* Error
    at EditorTracker.editorState_applyTransaction (EditorTracker.ts:69)
    at EditorState2.editorState.applyTransaction (EditorTracker.ts:57)
    at EditorState2.apply6 [as apply] (state.js:96)
    at EditorView2.dispatch (index.js:400)
    at readDOMChange (domchange.js:251)
    at DOMObserver2.handleDOMChange (input.js:35)
    at DOMObserver2.flush (domobserver.js:176)
    at MutationObserver.DOMObserver2.observer (domobserver.js:50)
  */
  if (lastStackLine.includes(".observer")) {
    const handleDOMChangeLineIndex = stackLines.findIndex((line) =>
      line.includes(".handleDOMChange")
    );
    return {
      path: [
        stackLineToStackEntryInfo(stackLines[stackLines.length - 1]),
        stackLineToStackEntryInfo(stackLines[handleDOMChangeLineIndex]),
      ],
      source: stack,
    };
  }

  /* Error
    at EditorTracker.editorState_applyTransaction (EditorTracker.ts:77)
    at EditorState2.editorState.applyTransaction (EditorTracker.ts:65)
    at EditorState2.apply6 [as apply] (state.js:96)
    at EditorView2.dispatch (index.js:400)
    at readDOMChange (domchange.js:84)
    at DOMObserver2.handleDOMChange (input.js:35)
    at DOMObserver2.flush (domobserver.js:176)
    at DOMObserver2.onSelectionChange (domobserver.js:122)
  */
  if (lastStackLine.includes(".onSelectionChange")) {
    const handleDOMChangeLineIndex = stackLines.findIndex((line) =>
      line.includes(".handleDOMChange")
    );
    return {
      path: [
        stackLineToStackEntryInfo(stackLines[stackLines.length - 1]),
        stackLineToStackEntryInfo(stackLines[handleDOMChangeLineIndex]),
      ],
      source: stack,
    };
  }

  /* Error
    at EditorTracker.editorState_applyTransaction (EditorTracker.ts:77)
    at EditorState2.editorState.applyTransaction (EditorTracker.ts:65)
    at EditorState2.apply6 [as apply] (state.js:96)
    at EditorView2.dispatch (index.js:400)
    at handlers.copy.editHandlers.cut (input.js:533)
    at HTMLDivElement.view.dom.addEventListener.view.eventHandlers.<computed> (input.js:46)
  */
  if (
    lastStackLine.includes(
      "HTMLDivElement.view.dom.addEventListener.view.eventHandlers."
    )
  ) {
    const dispatchLineIndex = stackLines.findIndex((line) =>
      line.includes(".dispatch")
    );

    const linesBetweenDispatchAndSourcePlugin = stackLines.slice(
      dispatchLineIndex + 1,
      stackLines.length - 1
    );

    return {
      path: [
        stackLineToStackEntryInfo(stackLines[stackLines.length - 1]),
        ...linesBetweenDispatchAndSourcePlugin.map(stackLineToStackEntryInfo),
      ],
      source: stack,
    };
  }

  return { path: [], source: stack };
}
