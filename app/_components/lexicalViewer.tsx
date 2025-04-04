"use client";

import { $generateHtmlFromNodes } from "@lexical/html";
import { $createParagraphNode, $getRoot, createEditor } from "lexical";
import { useEffect, useState } from "react";

const LexicalViewer = ({ jsonString }: { jsonString: string }) => {
  const [htmlContent, setHtmlContent] = useState<string>("");

  useEffect(() => {
    if (!jsonString) {
      setHtmlContent("<p></p>");
      return;
    }

    try {
      const editor = createEditor();
      editor.update(() => {
        const editorState = editor.parseEditorState(jsonString);

        // Validate if the editor state is empty
        if (editorState.isEmpty()) {
          const root = $getRoot();
          const paragraph = $createParagraphNode();
          root.append(paragraph);
        }

        editor.setEditorState(editorState);
        const html = $generateHtmlFromNodes(editor, null);
        setHtmlContent(html);
      });
    } catch (error) {
      console.error("Error parsing editor state:", error);
      setHtmlContent("<p></p>");
    }
  }, [jsonString]);

  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};

export default LexicalViewer;
