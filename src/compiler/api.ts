export { TestFileSystem } from "@zzzen/pyright-internal/dist/tests/harness/vfs/filesystem";
export { TestAccessHost } from "@zzzen/pyright-internal/dist/tests/harness/testAccessHost";
export { PyrightFileSystem } from "@zzzen/pyright-internal/dist/pyrightFileSystem";
export { ConfigOptions } from "@zzzen/pyright-internal/dist/common/configOptions";
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
export { ParseNode, ParseNodeType, isExpressionNode } from "@zzzen/pyright-internal/dist/parser/parseNodes";

export { findNodeByOffset, printParseNodeType } from "@zzzen/pyright-internal/dist/analyzer/parseTreeUtils";

export enum TypeCategory {
  // Name is not bound to a value of any type.
  Unbound,

  // Type exists but is not currently known by the
  // type analyzer (e.g. there is no available typings file).
  // Unknown types are treated the same as "Any" at analysis time.
  Unknown,

  // Type can be anything.
  Any,

  // Special "None" type defined in Python.
  None,

  // Used in type narrowing to indicate that all possible
  // subtypes in a union have been eliminated, and execution
  // should never get to this point.
  Never,

  // Callable type with typed input parameters and return parameter.
  Function,

  // Functions defined with @overload decorator in stub files that
  // have multiple function declarations for a common implementation.
  OverloadedFunction,

  // Class definition, including associated instance methods,
  // class methods, static methods, properties, and variables.
  Class,

  // Module instance.
  Module,

  // Composite type (e.g. Number OR String OR None).
  Union,

  // Type variable (defined with TypeVar)
  TypeVar,
}

export enum TypeFlags {
  None = 0,

  // This type refers to something that can be instantiated.
  Instantiable = 1 << 0,

  // This type refers to something that has been instantiated.
  Instance = 1 << 1,

  // This type refers to a type that is wrapped an "Annotated"
  // (PEP 593) annotation.
  Annotated = 1 << 2,

  // This type is a special form like "UnionType".
  SpecialForm = 1 << 3,
}

export const typesheds = import.meta.glob('/node_modules/pyright/dist/typeshed-fallback/stdlib/*.pyi', { as: 'raw' });