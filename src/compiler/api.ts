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
export { ParseNode, isExpressionNode } from "@zzzen/pyright-internal/dist/parser/parseNodes";

export { findNodeByOffset } from "@zzzen/pyright-internal/dist/analyzer/parseTreeUtils";

export enum ParseNodeType {
  Error = 0,
  Argument = 1,
  Assert = 2,
  Assignment = 3,
  AssignmentExpression = 4,
  AugmentedAssignment = 5,
  Await = 6,
  BinaryOperation = 7,
  Break = 8,
  Call = 9,
  Class = 10,
  Constant = 11,
  Continue = 12,
  Decorator = 13,
  Del = 14,
  Dictionary = 15,
  DictionaryExpandEntry = 16,
  DictionaryKeyEntry = 17,
  Ellipsis = 18,
  If = 19,
  Import = 20,
  ImportAs = 21,
  ImportFrom = 22,
  ImportFromAs = 23,
  Index = 24,
  Except = 25,
  For = 26,
  FormatString = 27,
  Function = 28,
  Global = 29,
  Lambda = 30,
  List = 31,
  ListComprehension = 32,
  ListComprehensionFor = 33,
  ListComprehensionIf = 34,
  MemberAccess = 35,
  Module = 36,
  ModuleName = 37,
  Name = 38,
  Nonlocal = 39,
  Number = 40,
  Parameter = 41,
  Pass = 42,
  Raise = 43,
  Return = 44,
  Set = 45,
  Slice = 46,
  StatementList = 47,
  StringList = 48,
  String = 49,
  Suite = 50,
  Ternary = 51,
  Tuple = 52,
  Try = 53,
  TypeAnnotation = 54,
  UnaryOperation = 55,
  Unpack = 56,
  While = 57,
  With = 58,
  WithItem = 59,
  Yield = 60,
  YieldFrom = 61,
  FunctionAnnotation = 62,
  Match = 63,
  Case = 64,
  PatternSequence = 65,
  PatternAs = 66,
  PatternLiteral = 67,
  PatternClass = 68,
  PatternCapture = 69,
  PatternMapping = 70,
  PatternMappingKeyEntry = 71,
  PatternMappingExpandEntry = 72,
  PatternValue = 73,
  PatternClassArgument = 74,
}

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