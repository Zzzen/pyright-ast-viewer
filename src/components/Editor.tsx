import React, { useRef } from "react";

import Editor from "@monaco-editor/react";
import { AppState } from "../state";
import { monaco } from "react-monaco-editor";

function EditorWrapper() {
  const { state, handleCodeChange, handleCursorChange, handleEditorInit } =
    AppState.useContainer();

  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  function handleEditorDidMount(editor: monaco.editor.IStandaloneCodeEditor) {
    editorRef.current = editor;
    handleEditorInit(editor)
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
