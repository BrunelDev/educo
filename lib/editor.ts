import { $generateHtmlFromNodes } from "@lexical/html";
import { createEditor } from "lexical";

// Fonction pour convertir le JSON stocké en HTML
export const renderLexicalJsonAsHtml = (jsonString : string) => {
  const editor = createEditor(); // Créer un éditeur temporaire
  editor.setEditorState(editor.parseEditorState(jsonString));
  return $generateHtmlFromNodes(editor, null);
};




