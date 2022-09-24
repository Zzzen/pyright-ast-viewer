export { TestFileSystem } from "@zzzen/pyright-internal/dist/tests/harness/vfs/filesystem";
export { TestAccessHost } from "@zzzen/pyright-internal/dist/tests/harness/testAccessHost";
export { PyrightFileSystem } from "@zzzen/pyright-internal/dist/pyrightFileSystem";
export { ConfigOptions } from "@zzzen/pyright-internal/dist/common/configOptions";
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

export {
  findNodeByOffset,
  printParseNodeType,
} from "@zzzen/pyright-internal/dist/analyzer/parseTreeUtils";

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

export enum SymbolFlags {
  None = 0,

  // Indicates that the symbol is unbound at the start of
  // execution. Some symbols are initialized by the module
  // loader, so they are bound even before the first statement
  // in the module is executed.
  InitiallyUnbound = 1 << 0,

  // Indicates that the symbol is not visible from other files.
  // Used for module-level symbols.
  ExternallyHidden = 1 << 1,

  // Indicates that the symbol is a class member of a class.
  ClassMember = 1 << 2,

  // Indicates that the symbol is an instance member of a class.
  InstanceMember = 1 << 3,

  // Indicates that the symbol is considered "private" to the
  // class or module and should not be accessed outside or overridden.
  PrivateMember = 1 << 5,

  // Indicates that the symbol is not considered for protocol
  // matching. This applies to some built-in symbols like __class__.
  IgnoredForProtocolMatch = 1 << 6,

  // Indicates that the symbol is a ClassVar, so it cannot be
  // set when accessed through a class instance.
  ClassVar = 1 << 7,

  // Indicates that the symbol is in __all__.
  InDunderAll = 1 << 8,

  // Indicates that the symbol is a private import in a py.typed module.
  PrivatePyTypedImport = 1 << 9,

  // Indicates that the symbol is an InitVar as specified in PEP 557.
  InitVar = 1 << 10,
}

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
  "/node_modules/pyright/dist/typeshed-fallback/stdlib/*.pyi",
  { as: "raw" }
);
