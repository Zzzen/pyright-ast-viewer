import { useRef, useState } from "react";
import {
  normalizeSlashes,
  TestFileSystem,
  PyrightFileSystem,
  ConfigOptions,
  ImportResolver,
  TestAccessHost,
  Program,
  ParseNode,
  findNodeByOffset,
  typesheds,
  Diagnostic,
  PythonVersion,
} from "./compiler/api";
import { createContainer } from "unstated-next";

import { useMonaco } from "@monaco-editor/react";
import {
  type editor,
  type Range,
} from "monaco-editor/esm/vs/editor/editor.api";

const FILE_PATH = "/t.py";

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

foo = Foo("")
foo.str
`;

const tfs = new TestFileSystem(false, {
  files: {
    ...typesheds,
    [FILE_PATH]: defaultCode,
  },
});

const fs = new PyrightFileSystem(tfs);

const configOptions = new ConfigOptions(normalizeSlashes("/"));
configOptions.diagnosticRuleSet = ConfigOptions.getDiagnosticRuleSet('strict');
configOptions.typeshedPath = normalizeSlashes(
  "/node_modules/pyright/dist/typeshed-fallback"
);
configOptions.defaultPythonVersion = PythonVersion.V3_12
const importResolver = new ImportResolver(
  fs,
  configOptions,
  new TestAccessHost(fs.getModulePath(), [configOptions.typeshedPath + '/stdlib', configOptions.typeshedPath + '/stub'])
);
const program = new Program(importResolver, configOptions);
program.setTrackedFiles([FILE_PATH]);

while (program.analyze()) {
  // Continue to call analyze until it completes. Since we're not
  // specifying a timeout, it should complete the first time.
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
let sourceFile = program.getSourceFile(FILE_PATH)!;

export interface AppState {
  code: string;
  ast: ParseNode;
  selectedNode: ParseNode;
  program: Program;
  diagnostics: Diagnostic[] | undefined;
}

export function useAppState() {
  const [state, setState] = useState<AppState>(() => ({
    code: defaultCode,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    ast: sourceFile.getParseResults()!.parseTree,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    selectedNode: sourceFile.getParseResults()!.parseTree,
    program,
    diagnostics: sourceFile.getDiagnostics(configOptions),
  }));

  const monaco = useMonaco();

  const prevDecRef = useRef<string[]>([]);
  const editorRef = useRef<editor.IStandaloneCodeEditor | undefined>(undefined);

  function highlightRange(range: Range | undefined) {
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
        [FILE_PATH]: code,
      });

      program.markAllFilesDirty(false);

      while (program.analyze()) {
        // Continue to call analyze until it completes. Since we're not
        // specifying a timeout, it should complete the first time.
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      sourceFile = program.getSourceFile(FILE_PATH)!;
      const diagnostics = sourceFile.getDiagnostics(configOptions);

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const ast = sourceFile.getParseResults()!.parseTree;

      setState((state) => ({
        ...state,
        code,
        ast: ast,
        selectedNode: ast,
        program,
        diagnostics,
      }));
    },
    selectNode(node: ParseNode) {
      setState((x) => {
        if (node && editorRef.current) {
          const start = editorRef.current.getModel()?.getPositionAt(node.start);
          const end = editorRef.current
            .getModel()
            ?.getPositionAt(node.start + node.length);
          if (start && end && monaco) {
            const range = monaco.Range.fromPositions(start, end);
            highlightRange(range);
            try {
              editorRef.current.revealRangeInCenterIfOutsideViewport(
                range,
                monaco.editor.ScrollType.Smooth
              );
            } catch {
              // ignore, for some reason this was throwing
            }
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
    handleEditorInit(editor: editor.IStandaloneCodeEditor) {
      editorRef.current = editor;
    },
  };
}

export const AppState = createContainer(useAppState);
