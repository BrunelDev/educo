"use client";

import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { useEffect } from "react";
import ExampleTheme from "./editorPlugins/ExampleTheme";

const editorConfig = {
  namespace: "React.js View",
  editable: false,
  nodes: [
    HeadingNode,
    QuoteNode,
    ListNode,
    ListItemNode,
    CodeNode,
    CodeHighlightNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    LinkNode,
  ],
  onError(error: Error) {
    ;
  },
  theme: ExampleTheme,
};

function InitialStatePlugin({ initialState }: { initialState: string }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (initialState) {
      const parsedState = JSON.parse(initialState);
      editor.setEditorState(editor.parseEditorState(parsedState));
    }
  }, [editor, initialState]);

  return null;
}

interface LexicalViewProps {
  editorStateJSON: string;
}

export default function LexicalView({ editorStateJSON }: LexicalViewProps) {
  return (
    <LexicalComposer initialConfig={editorConfig}>
     
          <RichTextPlugin
            contentEditable={
              <ContentEditable/>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
     
      <InitialStatePlugin initialState={editorStateJSON} />
    </LexicalComposer>
  );
}
