import { Fragment, Node as ProsemirrorNode } from "prosemirror-model";
import { SerializableEditorState } from "../../../../prosemirror-plugin/comms/send-to-backend";

function BlockNodeContent({
  parentNodeContent,
}: {
  parentNodeContent: Fragment;
}) {
  // note: the declarations for prosemirro-model Fragment
  // are missing the content property
  const parentNodeContentAny = parentNodeContent as any;
  if (
    !parentNodeContentAny ||
    !parentNodeContentAny.content ||
    !parentNodeContentAny.content.length
  ) {
    return null;
  }
  const content = parentNodeContentAny.content;

  return (
    <>
      {content.map((node: ProsemirrorNode, index: number) => {
        return (
          <span key={index}>
            <BlockNode node={node} />
          </span>
        );
      })}
    </>
  );
}

function Mark({ mark }: { mark: ProsemirrorNode["marks"][number] }) {
  return <span>{mark.type.name}</span>;
}

function Marks({ marks }: { marks: ProsemirrorNode["marks"] }) {
  if (!marks.length) {
    return null;
  }
  return (
    <span>
      [
      {marks.map((mark) => {
        return <Mark mark={mark} />;
      })}
      ]
    </span>
  );
}

function BlockNode({ node }: { node: ProsemirrorNode }) {
  if (node.type.name === "text") {
    return (
      <span>
        {node.text}
        <Marks marks={node.marks} />
      </span>
    );
  }

  if (node.content.size) {
    return (
      <>
        <span>{node.type.name}(</span>
        <BlockNodeContent parentNodeContent={node.content} />
        <span>)</span>
      </>
    );
  }

  return <span>{node.type.name}</span>;
}

export function EnhancedToString({
  editorState,
}: {
  editorState: SerializableEditorState;
}) {
  return <BlockNode node={editorState.doc} />;
}
