import { useState } from "react";
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
} from "./compiler/api";
import { createContainer } from "unstated-next";

const defaultCode = `
def f(a):
  return a
f(1)
`;

// console.log(process.execArgv.join())
const libraryRoot = combinePaths(normalizeSlashes("/"), lib, sitePackages);

console.log(libraryRoot);
const tfs = new TestFileSystem(false, {
  files: {
    "/t.py": `
def f(a):
  return a
f(1)
`,
  },
});

const fs = new PyrightFileSystem(tfs);

const configOptions = new ConfigOptions(normalizeSlashes("/"));
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
  selectedNode?: ParseNode;
  program: Program;
}

export function useAppState() {
  const [state, setState] = useState<AppState>(() => ({
    code: defaultCode,
    ast: sourceFile["_parseResults"].parseTree,
    selectedNode: undefined,
    program,
  }));

  return {
    state,
    handleCodeChange(code: string) {
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

      setState({
        code,
        ast: ast,
        selectedNode: ast,
        program,
      });
    },
    selectNode(node: ParseNode) {
      setState((x) => ({ ...x, selectedNode: node }));
    },
    handleCursorChange(offset: number) {
      setState((x) => {
        const ast = x.ast;
        const node = findNodeByOffset(ast, offset);
        return { ...x, selectedNode: node };
      });
    },
  };
}

export const AppState = createContainer(useAppState);
