import { useFlowStore } from "@/stores/flow-store";
import { useNodes, useReactFlow } from "@xyflow/react";
import { produce } from "immer";
import { useMemo, useRef, useEffect, useCallback } from "react";
import { useNodeList } from "./hooks/use-node-list";
import SidebarPanelWrapper from "../../components/sidebar-panel-wrapper";
import { BuilderNode } from "../../../types";
import SidebarPanelHeading from "../../components/sidebar-panel-heading";
import { NodeListItem } from "./components/node-list-item";
import { NodePropertyPanel } from "./components/node-propery-panel";
import IntroductionPropertyPanel from "./property-panels/introduction-property-panel";
import { HeaderWithIcon } from "@/components/flow-builder/components/ui/header-with-icon";

export function NodePropertiesPanel() {
  const selectedNode = useFlowStore(
    (s) => s.workflow.sidebar.panels.nodeProperties.selectedNode
  );

  const setSelectedNode = useFlowStore(
    (s) => s.actions.sidebar.panels.nodeProperties.setSelectedNode
  );

  const nodes = useNodes();
  const nodeList = useNodeList(nodes);
  const { setNodes } = useReactFlow();

  // Add ref for the list container
  const listRef = useRef<HTMLDivElement>(null);

  // Scroll to selected node when it changes
  useEffect(() => {
    if (selectedNode && listRef.current) {
      const nodeElement = listRef.current.querySelector(`[data-node-id="${selectedNode.id}"]`);
      if (nodeElement) {
        nodeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [selectedNode]);

  const onNodeClick = useCallback((id: string, event: React.MouseEvent) => {
    setNodes((nds) =>
      produce(nds, (draft) => {
        // If Ctrl key is pressed, toggle selection of clicked node
        if (event.ctrlKey) {
          const node = draft.find(n => n.id === id);
          if (node) {
            node.selected = !node.selected;
          }
        } else {
          // If Ctrl is not pressed, select only the clicked node
          draft.forEach((node) => {
            node.selected = node.id === id;
          });
        }
      })
    );

    // Only update the property panel selection if Ctrl is not pressed
    if (!event.ctrlKey) {
      setSelectedNode({
        id,
        type: nodeList.find((n) => n.id === id)?.type as BuilderNode,
      });
    }
  }, [nodeList, setNodes, setSelectedNode]);

  const selectedNodeData = useMemo(() => {
    return nodes.find((n) => n.id === selectedNode?.id)?.data;
  }, [nodes, selectedNode?.id]);

  return (
    <SidebarPanelWrapper>
      <div className="h-80 w-80 flex flex-col">
        <SidebarPanelHeading className="shrink-0">
          <HeaderWithIcon icon="mynaui:layers-three" title="Nodes in Flow" />
        </SidebarPanelHeading>

        <div ref={listRef} className="flex w-full flex-col gap-1 p-1.5 overflow-y-auto">
          {nodeList.map((node) => (
            <NodeListItem
              key={node.id}
              data-node-id={node.id}
              id={
                node.type === BuilderNode.START || node.type === BuilderNode.END
                  ? undefined
                  : node.id
              }
              title={node.detail.title}
              icon={node.detail.icon}
              selected={selectedNode?.id === node.id}
              pseudoSelected={node.selected}
              onClick={(e: React.MouseEvent) => {
                onNodeClick(node.id, e);
              }}
            />
          ))}
        </div>
      </div>

      <div className="w-80 max-h-[360px] 2xl:max-h-[594px] flex flex-col">
        <SidebarPanelHeading className="shrink-0">
          <HeaderWithIcon icon="mynaui:cog" title="Node Properties" />
        </SidebarPanelHeading>

        <div className="flex w-full flex-col overflow-y-auto" data-property-panel>
          {selectedNode ? (
            <NodePropertyPanel
              id={selectedNode.id}
              type={selectedNode.type}
              data={selectedNodeData}
            />
          ) : (
            <IntroductionPropertyPanel />
          )}
        </div>
      </div>
    </SidebarPanelWrapper>
  );
}
