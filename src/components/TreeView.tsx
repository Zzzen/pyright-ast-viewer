import React from "react";
import TreeView from "react-treeview";
import { ParseNode, ParseTreeWalker, ParseNodeType } from "../compiler/api";
import { AppState } from "../state";

export default function TreeViewer() {
  const { state, selectNode } = AppState.useContainer();

  return <div>{renderNode(state.ast)}</div>;

  function renderNode(node: ParseNode) {
    const children = new ParseTreeWalker().visitNode(node);

    return (
      <TreeView
        key={node.id}
        nodeLabel={
          <div
            className={node === state.selectedNode ? "selectedNode" : ""}
            onClick={() => selectNode(node)}
          >
            {ParseNodeType[node.nodeType]}
          </div>
        }
      >
        {children.map((_) => _ && renderNode(_))}
      </TreeView>
    );
  }
}
