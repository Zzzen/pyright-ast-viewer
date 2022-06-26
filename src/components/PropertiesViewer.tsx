import { JSONTree } from "react-json-tree";
import {
  isExpressionNode,
  ParseNodeType,
  TypeCategory,
  TypeFlags,
} from "../compiler/api";
import { AppState } from "../state";

export default function PropertiesViewer() {
  const { state } = AppState.useContainer();
  const selectedNode = state.selectedNode;
  const isExpr = isExpressionNode(selectedNode);
  const type =
    isExpr && state.program.evaluator?.getTypeOfExpression(selectedNode);

  return (
    <div className="verticalContainer">
      <h2>Node</h2>
      <JSONTree
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
    </div>
  );
}
