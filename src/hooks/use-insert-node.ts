import { BuilderNodeType } from "@/components/flow-builder/components/blocks/types";
import { createNodeWithDefaultData } from "@/components/flow-builder/components/blocks/utils";
import { type XYPosition, useReactFlow } from "@xyflow/react";
import { useCallback } from "react";
import { useFlowStore } from "@/stores/flow-store";
import { useShallow } from "zustand/shallow";
import { SidebarPanel } from "@/components/flow-builder/components/blocks/sidebar/constants/panels";

export function useInsertNode() {
  const { addNodes, screenToFlowPosition } = useReactFlow();
  const [nodePosition, setNodePosition, showNodeProperties, setActivePanel] = useFlowStore(
    useShallow((s) => [
      s.workflow.nodePosition, 
      s.actions.nodes.setNodePosition,
      s.actions.sidebar.showNodePropertiesOf,
      s.actions.sidebar.setActivePanel
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

      // Create the node with default data and position
      const newNode = createNodeWithDefaultData(type, {
        position,
        selected: false,
      });

      // Add the node to the flow
      addNodes(newNode);

      // Update the node properties and panel
      Promise.resolve().then(() => {
        showNodeProperties({ 
          id: newNode.id, 
          type: newNode.type as BuilderNodeType
        });
        setActivePanel(SidebarPanel.NODE_PROPERTIES);
      });

      return newNode;
    },
    [screenToFlowPosition, nodePosition, setNodePosition, showNodeProperties, setActivePanel, addNodes]
  );
}
