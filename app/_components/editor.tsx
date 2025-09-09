"use client";

import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import {
  $isTextNode,
  DOMConversionMap,
  DOMExportOutput,
  DOMExportOutputMap,
  EditorState,
  isHTMLElement,
  Klass,
  LexicalEditor,
  LexicalNode,
  ParagraphNode,
  TextNode,
} from "lexical";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useState, useCallback } from "react";
import ExampleTheme from "./editorPlugins/ExampleTheme";
import {
  parseAllowedColor,
  parseAllowedFontSize,
} from "./editorPlugins/styleConfig";
import ToolbarPlugin from "./editorPlugins/toolbarPlugin";
import { useMeetingForm } from "@/store/meetingForm";

const placeholder = "Entre du texte";

const removeStylesExportDOM = (
  editor: LexicalEditor,
  target: LexicalNode
): DOMExportOutput => {
  const output = target.exportDOM(editor);
  if (output && isHTMLElement(output.element)) {
    
    for (const el of [
      output.element,
      ...output.element.querySelectorAll('[style],[class],[dir="ltr"]'),
    ]) {
      el.removeAttribute("class");
      el.removeAttribute("style");
      if (el.getAttribute("dir") === "ltr") {
        el.removeAttribute("dir");
      }
    }
  }
  return output;
};

const exportMap: DOMExportOutputMap = new Map<
  Klass<LexicalNode>,
  (editor: LexicalEditor, target: LexicalNode) => DOMExportOutput
>([
  [ParagraphNode, removeStylesExportDOM],
  [TextNode, removeStylesExportDOM],
]);

const getExtraStyles = (element: HTMLElement): string => {
  // Parse styles from pasted input, but only if they match exactly the
  // sort of styles that would be produced by exportDOM
  let extraStyles = "";
  const fontSize = parseAllowedFontSize(element.style.fontSize);
  const backgroundColor = parseAllowedColor(element.style.backgroundColor);
  const color = parseAllowedColor(element.style.color);
  if (fontSize !== "" && fontSize !== "15px") {
    extraStyles += `font-size: ${fontSize};`;
  }
  if (backgroundColor !== "" && backgroundColor !== "rgb(255, 255, 255)") {
    extraStyles += `background-color: ${backgroundColor};`;
  }
  if (color !== "" && color !== "rgb(0, 0, 0)") {
    extraStyles += `color: ${color};`;
  }
  return extraStyles;
};

const constructImportMap = (): DOMConversionMap => {
  const importMap: DOMConversionMap = {};

  // Wrap all TextNode importers with a function that also imports
  // the custom styles implemented by the playground
  for (const [tag, fn] of Object.entries(TextNode.importDOM() || {})) {
    importMap[tag] = (importNode) => {
      const importer = fn(importNode);
      if (!importer) {
        return null;
      }
      return {
        ...importer,
        conversion: (element) => {
          const output = importer.conversion(element);
          if (
            output === null ||
            output.forChild === undefined ||
            output.after !== undefined ||
            output.node !== null
          ) {
            return output;
          }
          const extraStyles = getExtraStyles(element);
          if (extraStyles) {
            const { forChild } = output;
            return {
              ...output,
              forChild: (child, parent) => {
                const textNode = forChild(child, parent);
                if ($isTextNode(textNode)) {
                  textNode.setStyle(textNode.getStyle() + extraStyles);
                }
                return textNode;
              },
            };
          }
          return output;
        },
      };
    };
  }

  return importMap;
};

const editorConfig = {
  html: {
    export: exportMap,
    import: constructImportMap(),
  },
  namespace: "React.js Demo",
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
  onError(error: Error) {
    throw error;
  },
  theme: ExampleTheme,
};

export default function Editor( {disabled = false, _editorStateJSON}: {disabled?: boolean, _editorStateJSON?: string}) {
  const { updateStep4 } = useMeetingForm();
  const [editorStateJSON, setEditorStateJSON] = useState(_editorStateJSON || "");
  
  // Utilisez useCallback pour éviter la recréation de cette fonction à chaque rendu
  const onChange = useCallback((editorState: EditorState) => {
    const json = JSON.stringify(editorState.toJSON());
    setEditorStateJSON(json);
    console.log(json)
  }, []);

  // Utilisez une dépendance stable pour le useEffect
  useEffect(() => {
    if (editorStateJSON) {
      updateStep4([{ description: editorStateJSON }]);
    }
  }, [editorStateJSON, updateStep4]);

  function MyOnChangePlugin({ onChange }: { onChange: (editorState: EditorState) => void }) {
    const [editor] = useLexicalComposerContext();
    
    useEffect(() => {
      return editor.registerUpdateListener(({ editorState }) => {
        onChange(editorState);
      });
    }, [editor, onChange]);
    
    return null;
  }

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="editor-container border w-full">
        <ToolbarPlugin />
        <div className="editor-inner">
          <RichTextPlugin
          
            contentEditable={
              <ContentEditable
              disabled={disabled}
              // hide scrollbar with tailwind
                className="editor-input w-full h-[300px] border rounded-[8px] pt-4 px-2 overflow-scroll no-scrollbar"
                aria-placeholder={placeholder}
                placeholder={
                  <div className="editor-placeholder">{placeholder}</div>
                }
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
        </div>
      </div>
      <MyOnChangePlugin onChange={onChange} />
    </LexicalComposer>
  );
}