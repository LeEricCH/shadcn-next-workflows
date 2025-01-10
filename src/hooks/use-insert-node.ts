import { BuilderNodeType } from "@/components/flow-builder/components/blocks/types";
import { createNodeWithDefaultData } from "@/components/flow-builder/components/blocks/utils";
import { type XYPosition, useReactFlow } from "@xyflow/react";
import { useCallback } from "react";
import { useFlowStore } from "@/stores/flow-store";
import { useShallow } from "zustand/shallow";
import { SidebarPanel } from "@/components/flow-builder/components/blocks/sidebar/constants/panels";

export function useInsertNode() {
  const { addNodes, screenToFlowPosition, getNodes, updateNode } = useReactFlow();
  const [nodePosition, setNodePosition, showNodeProperties, setActivePanel, setNodes] = useFlowStore(
    useShallow((s) => [
      s.workflow.nodePosition, 
      s.actions.nodes.setNodePosition,
      s.actions.sidebar.showNodePropertiesOf,
      s.actions.sidebar.setActivePanel,
      s.actions.nodes.setNodes
    ])
  );

  return useCallback(
    (type: BuilderNodeType, pos?: XYPosition) => {
      let position: XYPosition;
      
      if (pos) {
        position = pos;
      } else if (nodePosition) {
        position = nodePosition;
        setNodePosition(null);
      } else {
        position = screenToFlowPosition({
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
        });
      }

      // Deselect all nodes
      getNodes().forEach((node) => {
        if (node.selected) {
          updateNode(node.id, { selected: false });
        }
      });

      // Create the node with default data and position
      const newNode = createNodeWithDefaultData(type, {
        position,
        selected: true,
      });

      // Add the node to the flow using addNodes first
      addNodes(newNode);
      
      // Then update the store
      const currentNodes = getNodes();
      setNodes(currentNodes);

      // Use setTimeout to ensure the node is added before showing properties
      setTimeout(() => {
        showNodeProperties({ 
          id: newNode.id, 
          type: newNode.type as BuilderNodeType
        });
        setActivePanel(SidebarPanel.NODE_PROPERTIES);
      }, 0);

      return newNode;
    },
    [screenToFlowPosition, getNodes, updateNode, nodePosition, setNodePosition, showNodeProperties, setActivePanel, setNodes, addNodes]
  );
}
