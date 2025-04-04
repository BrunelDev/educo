import { ParagraphNode } from "lexical";

export class CustomParagraphNode extends ParagraphNode {
  static getType(): string {
    return "paragraph";
  }

  static clone(node: CustomParagraphNode): CustomParagraphNode {
    return new CustomParagraphNode(node.__key);
  }
}
