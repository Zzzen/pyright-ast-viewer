import { JSONTree } from "react-json-tree";
import {
  isExpressionNode,
  ParseNodeType,
  TypeCategory,
  TypeFlags,
} from "../compiler/api";
import { AppState } from "../state";

const theme = {
  scheme: 'monokai',
  author: 'wimer hazenberg (http://www.monokai.nl)',
  base00: '#272822',
  base01: '#383830',
  base02: '#49483e',
  base03: '#75715e',
  base04: '#a59f85',
  base05: '#f8f8f2',
  base06: '#f5f4f1',
  base07: '#f9f8f5',
  base08: '#f92672',
  base09: '#fd971f',
  base0A: '#f4bf75',
  base0B: '#a6e22e',
  base0C: '#a1efe4',
  base0D: '#66d9ef',
  base0E: '#ae81ff',
  base0F: '#cc6633',
};

export default function PropertiesViewer() {
  const { state } = AppState.useContainer();
  const selectedNode = state.selectedNode;
  const isExpr = isExpressionNode(selectedNode);
  const type =
    isExpr && state.program.evaluator?.getTypeOfExpression(selectedNode);
  const decl = (selectedNode.nodeType as unknown as ParseNodeType) === ParseNodeType.Name && state.program.evaluator?.getDeclarationsForNameNode(selectedNode) || "[None]";

  return (
    <div className="verticalContainer">
      <h2>Node</h2>
      <JSONTree
        theme={theme}
        invertTheme
        data={state.selectedNode || "[None]"}
        hideRoot
        valueRenderer={(str, val, ...keypaths) => {
          if (keypaths[0] === "nodeType") {
            return ParseNodeType[val];
          }
          return str;
        }}
      />
      <h2>Type</h2>
      <JSONTree
        theme={theme}
        invertTheme
        data={type || "[None]"}
        hideRoot
        valueRenderer={(str, val, ...keypaths) => {
          if (keypaths[0] === "nodeType") {
            return ParseNodeType[val];
          }
          if (keypaths[0] === "category") {
            return TypeCategory[val];
          }
          if (keypaths[0] === "flags" && typeof val === "number") {
            if (val === 0) {
              return "None";
            }
            const bits = val.toString(2) as string;
            const str = bits
              .split("")
              .reverse()
              .map((bit, i) => {
                if (bit === "0") {
                  return "";
                }
                return TypeFlags[1 << i];
              })
              .filter(Boolean)
              .join("|");
            return val + "(" + str + ")";
          }
          return str;
        }}
        shouldExpandNode={(keypaths, data, level) => {
          if (level === 1 && keypaths[0] === "type") {
            return true;
          }
          return false;
        }}
      />
      <h2>Declarations</h2>
      <JSONTree
        theme={theme}
        invertTheme
        data={decl}
        hideRoot
        valueRenderer={(str, val, ...keypaths) => {
          if (keypaths[0] === "nodeType") {
            return ParseNodeType[val];
          }
          return str;
        }}
      />
    </div>
  );
}
