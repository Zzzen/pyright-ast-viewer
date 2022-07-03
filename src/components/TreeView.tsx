import React, { useEffect, useRef } from "react";
import TreeView from "react-treeview";
import { ParseNode, ParseTreeWalker, ParseNodeType, printParseNodeType } from "../compiler/api";
import { AppState } from "../state";

export default function TreeViewer() {
  const { state, selectNode } = AppState.useContainer();
  const containerRef = useRef<HTMLDivElement>(undefined!);
  const selectedNodeRef = useRef<HTMLDivElement>(undefined!);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (containerRef.current && selectedNodeRef.current) {
        selectedNodeRef.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "nearest",
        });
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [state.selectedNode]);

  return (
    <div ref={containerRef} className="verticalContainer">
      {renderNode(state.ast)}
    </div>
  );

  function renderNode(node: ParseNode) {
    const children = new ParseTreeWalker().visitNode(node);

    const nodeLabel = (
      <div
        key={node.id}
        ref={node === state.selectedNode ? selectedNodeRef : undefined}
        className={
          (node === state.selectedNode ? " selectedNode " : "") +
          (!children.length ? " endNode " : " nodeText ")
        }
        onClick={() => selectNode(node)}
      >
        {printParseNodeType(node.nodeType)}
      </div>
    );

    if (!children.length) {
      return nodeLabel;
    }

    return (
      <TreeView key={node.id} nodeLabel={nodeLabel}>
        {children.map((_) => _ && renderNode(_))}
      </TreeView>
    );
  }
}
