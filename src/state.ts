import { useRef, useState } from "react";
import {
  combinePaths,
  normalizeSlashes,
  sitePackages,
  lib,
  TestFileSystem,
  PyrightFileSystem,
  ConfigOptions,
  ImportResolver,
  TestAccessHost,
  Program,
  ParseNode,
  findNodeByOffset,
  typesheds,
} from "./compiler/api";
import { createContainer } from "unstated-next";
import { monaco } from "react-monaco-editor";

const defaultCode = `
def f(a = 1):
  return a
f(1)

class Foo:
    bar: str = "hi"

    def __init__(self, baz: str) -> None:
        self.str = baz

    @classmethod
    def from_baz(cls, baz: str) -> None:
        cls.str = baz

foo = Foo()
foo.str
`;

// console.log(process.execArgv.join())
const libraryRoot = combinePaths(normalizeSlashes("/"), lib, sitePackages);

console.log(libraryRoot);
const tfs = new TestFileSystem(false, {
  files: {
    ...typesheds,
    "/t.py": defaultCode,
  },
});

const fs = new PyrightFileSystem(tfs);

const configOptions = new ConfigOptions(normalizeSlashes("/"));
configOptions.typeshedPath = normalizeSlashes(
  "/node_modules/pyright/dist/typeshed-fallback"
);
const importResolver = new ImportResolver(
  fs,
  configOptions,
  new TestAccessHost(fs.getModulePath(), [libraryRoot])
);
const program = new Program(importResolver, configOptions);
program.setTrackedFiles(["/t.py"]);

while (program.analyze()) {
  // Continue to call analyze until it completes. Since we're not
  // specifying a timeout, it should complete the first time.
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
let sourceFile = program.getSourceFile("/t.py")!;

export interface AppState {
  code: string;
  ast: ParseNode;
  selectedNode: ParseNode;
  program: Program;
}

export function useAppState() {
  const [state, setState] = useState<AppState>(() => ({
    code: defaultCode,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    ast: sourceFile.getParseResults()!.parseTree,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    selectedNode: sourceFile.getParseResults()!.parseTree,
    program,
  }));

  const prevDecRef = useRef<string[]>([]);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | undefined>(
    undefined
  );

  function highlightRange(range: monaco.Range | undefined) {
    if (!editorRef.current) {
      return;
    }
    prevDecRef.current = editorRef.current.deltaDecorations(
      prevDecRef.current,
      range
        ? [
            {
              range: range,
              options: { className: "editorRangeHighlight" },
            },
          ]
        : []
    );
  }

  return {
    state,
    handleCodeChange(code: string) {
      highlightRange(undefined);

      tfs.apply({
        "t.py": code,
      });

      program.markAllFilesDirty(false);

      while (program.analyze()) {
        // Continue to call analyze until it completes. Since we're not
        // specifying a timeout, it should complete the first time.
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      sourceFile = program.getSourceFile("/t.py")!;

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const ast = sourceFile.getParseResults()!.parseTree;

      setState((state) => ({
        ...state,
        code,
        ast: ast,
        selectedNode: ast,
        program,
      }));
    },
    selectNode(node: ParseNode) {
      setState((x) => {
        if (node && editorRef.current) {
          const start = editorRef.current.getModel()?.getPositionAt(node.start);
          const end = editorRef.current
            .getModel()
            ?.getPositionAt(node.start + node.length);
          if (start && end) {
            highlightRange(monaco.Range.fromPositions(start, end));
          }
        }
        return { ...x, selectedNode: node };
      });
    },
    handleCursorChange(offset: number) {
      highlightRange(undefined);
      setState((x) => {
        const ast = x.ast;
        const node = findNodeByOffset(ast, offset);
        return { ...x, selectedNode: node || ast };
      });
    },
    handleEditorInit(editor: monaco.editor.IStandaloneCodeEditor) {
      editorRef.current = editor;
    },
  };
}

export const AppState = createContainer(useAppState);
