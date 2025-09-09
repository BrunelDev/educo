"use client";

import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { $generateHtmlFromNodes } from "@lexical/html";
import { LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import {
  $createParagraphNode,
  $getRoot,
  createEditor,
  ParagraphNode,
  TextNode,
} from "lexical";
import { useEffect, useState } from "react";
import ExampleTheme from "./editorPlugins/ExampleTheme";

// Utility function to convert Lexical JSON to HTML (no hooks)
export const convertLexicalJsonToHtml = (jsonString: string): string => {
  if (!jsonString) {
    return "<p></p>";
  }

  try {
    // Create editor with the same configuration as the main editor
    const editor = createEditor({
      namespace: "HTML Export",
      nodes: [
        TextNode,
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
        ParagraphNode,
      ],
      theme: ExampleTheme,
      onError(error: Error) {
        console.error("Lexical Editor Error:", error);
      },
    });

    let htmlContent = "";

    // Parse and set the editor state
    const editorState = editor.parseEditorState(jsonString);
    editor.setEditorState(editorState);

    // Read the editor state and generate HTML
    editor.getEditorState().read(() => {
      const root = $getRoot();

      console.log("Root children count:", root.getChildren().length);
      console.log(
        "Root children:",
        root.getChildren().map((child) => child.getType())
      );

      // If the root is empty, add a default paragraph
      if (root.getChildren().length === 0) {
        const paragraph = $createParagraphNode();
        root.append(paragraph);
        console.log("Added default paragraph");
      }

      htmlContent = $generateHtmlFromNodes(editor, null);
      console.log("Generated HTML length:", htmlContent.length);
      console.log("Generated HTML preview:", htmlContent.substring(0, 200));
    });

    // If still empty, return default content
    if (!htmlContent || htmlContent.trim() === "") {
      return "<p></p>";
    }

    return htmlContent;
  } catch (error) {
    console.error("Error parsing editor state:", error);
    console.error("JSON String:", jsonString);
    return "<p></p>";
  }
};

const LexicalViewer = ({ jsonString }: { jsonString: string }) => {
  const [htmlContent, setHtmlContent] = useState<string>("");

  useEffect(() => {
    const html = convertLexicalJsonToHtml(jsonString);
    setHtmlContent(html);
  }, [jsonString]);

  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};

export default LexicalViewer;
