/* eslint-disable @typescript-eslint/ban-ts-comment */
export { TestFileSystem } from "@zzzen/pyright-internal/dist/tests/harness/vfs/filesystem";
export { TestAccessHost } from "@zzzen/pyright-internal/dist/tests/harness/testAccessHost";
export { PyrightFileSystem } from "@zzzen/pyright-internal/dist/pyrightFileSystem";
export { ConfigOptions } from "@zzzen/pyright-internal/dist/common/configOptions";
export { PythonVersion } from "@zzzen/pyright-internal/dist/common/pythonVersion";
export { Diagnostic, DiagnosticCategory } from "@zzzen/pyright-internal/dist/common/diagnostic";
export {
  combinePaths,
  normalizeSlashes,
} from "@zzzen/pyright-internal/dist/common/pathUtils";
export {
  lib,
  sitePackages,
} from "@zzzen/pyright-internal/dist/common/pathConsts";
export { ImportResolver } from "@zzzen/pyright-internal/dist/analyzer/importResolver";
export { Program } from "@zzzen/pyright-internal/dist/analyzer/program";
export { ParseTreeWalker } from "@zzzen/pyright-internal/dist/analyzer/parseTreeWalker";
export {
  ParseNode,
  ParseNodeType,
  isExpressionNode,
} from "@zzzen/pyright-internal/dist/parser/parseNodes";
import { FunctionTypeFlags as _FunctionTypeFlags, TypeFlags as _TypeFlags, TypeCategory as _TypeCategory } from '@zzzen/pyright-internal/dist/analyzer/types'
import { SymbolFlags as _SymbolFlags } from '@zzzen/pyright-internal/dist/analyzer/symbol'

export {
  findNodeByOffset,
  printParseNodeType,
} from "@zzzen/pyright-internal/dist/analyzer/parseTreeUtils";


// @ts-expect-error
export const TypeCategory = _TypeCategory;
export type TypeCategory = _TypeCategory;

// @ts-expect-error
export const TypeFlags = _TypeFlags;
export type TypeFlags = _TypeFlags;

// @ts-expect-error
export const FunctionTypeFlags = _FunctionTypeFlags;
export type FunctionTypeFlags = _FunctionTypeFlags;

// @ts-expect-error
export const SymbolFlags = _SymbolFlags;
export type SymbolFlags = _SymbolFlags;


export enum DeclarationType {
  Intrinsic,
  Variable,
  Parameter,
  Function,
  Class,
  SpecialBuiltInClass,
  Alias,
}

export const typesheds = import.meta.glob(
  "/node_modules/pyright/dist/typeshed-fallback/**/*.pyi",
  { as: "raw" }
);
