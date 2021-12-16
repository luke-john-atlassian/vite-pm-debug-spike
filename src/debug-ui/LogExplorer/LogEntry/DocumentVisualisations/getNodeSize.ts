import { Node as ProsemirrorNode } from "prosemirror-model";

export function getNodeSize(node: ProsemirrorNode) {
  if (node.type.name === "text") {
    return node.text!.length;
  }

  return node.content.size + 2;
}
