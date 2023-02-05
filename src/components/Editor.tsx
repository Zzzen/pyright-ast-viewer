import React, { useEffect, useRef } from "react";

import Editor, { useMonaco } from "@monaco-editor/react";
import {
  type editor,
  MarkerSeverity,
} from "monaco-editor/esm/vs/editor/editor.api";

import { AppState } from "../state";
import { DiagnosticCategory } from "../compiler/api";

const DiagnosticCategoryMap: Record<DiagnosticCategory, MarkerSeverity> = {
  [DiagnosticCategory.Error]: MarkerSeverity.Error,
  [DiagnosticCategory.Warning]: MarkerSeverity.Warning,
  [DiagnosticCategory.Information]: MarkerSeverity.Info,
  [DiagnosticCategory.UnusedCode]: MarkerSeverity.Hint,
  [DiagnosticCategory.Deprecated]: MarkerSeverity.Hint,
};

function EditorWrapper() {
  const { state, handleCodeChange, handleCursorChange, handleEditorInit } =
    AppState.useContainer();
  const monaco = useMonaco();

  const { diagnostics } = state;
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    const textModel = editorRef.current?.getModel();
    if (textModel && monaco) {
      monaco.editor.setModelMarkers(
        textModel,
        "pyright",
        diagnostics?.map((diag) => {
          return {
            startLineNumber: diag.range.start.line + 1,
            startColumn: diag.range.start.character + 1,
            endLineNumber: diag.range.end.line + 1,
            endColumn: diag.range.end.character + 1,
            message: diag.message,
            severity: DiagnosticCategoryMap[diag.category],
          };
        }) || []
      );
    }
  }, [diagnostics, monaco]);

  function handleEditorDidMount(editor: editor.IStandaloneCodeEditor) {
    editorRef.current = editor;
    handleEditorInit(editor);
    handleCodeChange(state.code)
    editor.onMouseDown((e) => {
      if (!e.target.range) {
        return;
      }
      const model = editor.getModel();
      if (!model) {
        return;
      }
      // Sometimes e.target.range will be the column right before if clicked to the left enough,
      // but the cursor position will still be at the next column. For that reason, always
      // use the editor posiion.
      const pos = editor.getPosition();
      if (pos != null) {
        const offset = model.getOffsetAt(pos);
        handleCursorChange(offset);
      }
    });
  }

  return (
    <Editor
      height="90vh"
      value={state.code}
      onChange={(val) => {
        handleCodeChange(val || "");
      }}
      defaultLanguage="python"
      options={{ minimap: { enabled: false } }}
      onMount={handleEditorDidMount}
    />
  );
}
export default EditorWrapper;
