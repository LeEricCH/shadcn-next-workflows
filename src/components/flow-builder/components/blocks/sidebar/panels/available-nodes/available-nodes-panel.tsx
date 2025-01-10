import { BuilderNodeType, BuilderNode } from "@/components/flow-builder/components/blocks/types";
import { AVAILABLE_NODES } from "@/components/flow-builder/components/blocks";
import { useInsertNode } from "@/hooks/use-insert-node";
import { useFlowStore } from "@/stores/flow-store";
import { useShallow } from "zustand/shallow";
import { useState } from "react";
import { SidebarPanel } from "../../constants/panels";
import { useReactFlow } from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { Input } from "@/components/ui/input";
import { NodePreviewDraggable } from "./components/node-preview-draggable";
import SidebarPanelHeading from "../../components/sidebar-panel-heading";
import SidebarPanelWrapper from "../../components/sidebar-panel-wrapper";
import { HeaderWithIcon } from "@/components/flow-builder/components/ui/header-with-icon";

type Category = {
  title: string;
  description: string;
  nodes: typeof AVAILABLE_NODES;
};

const CATEGORIES: Category[] = [
  {
    title: "Flow Control",
    description: "Control the flow of your workflow",
    nodes: AVAILABLE_NODES.filter((node) => node.type === BuilderNode.BRANCH || node.type === BuilderNode.LOOP),
  },
  {
    title: "Interaction",
    description: "Interact with your users",
    nodes: AVAILABLE_NODES.filter((node) => node.type === BuilderNode.MENU || node.type === BuilderNode.TEXT_MESSAGE),
  },
  {
    title: "Time",
    description: "Control the timing of your workflow",
    nodes: AVAILABLE_NODES.filter((node) => node.type === BuilderNode.DELAY),
  },
  {
    title: "Organization",
    description: "Organize and categorize your workflow",
    nodes: AVAILABLE_NODES.filter((node) => node.type === BuilderNode.TAGS),
  },
];

export default function AvailableNodesPanel() {
  const [setActivePanel, nodePosition, setNodePosition, showNodeProperties] = useFlowStore(
    useShallow((s) => [
      s.actions.sidebar.setActivePanel,
      s.workflow.nodePosition,
      s.actions.nodes.setNodePosition,
      s.actions.sidebar.showNodePropertiesOf
    ])
  );
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const insertNode = useInsertNode();
  const { screenToFlowPosition } = useReactFlow();

  const filteredNodes = selectedCategory?.nodes.filter(node => 
    node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    node.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNodeClick = (node: typeof AVAILABLE_NODES[0]) => {
    let position;
    if (nodePosition) {
      position = nodePosition;
      setNodePosition(null);
    } else {
      position = screenToFlowPosition({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      });
    }
    
    const newNode = insertNode(node.type as BuilderNodeType, position);
    showNodeProperties({ 
      id: newNode.id, 
      type: newNode.type as BuilderNodeType 
    });
    setActivePanel(SidebarPanel.NODE_PROPERTIES);
  };

  if (selectedCategory) {
    return (
      <SidebarPanelWrapper>
        <div className="flex items-center gap-2 border-b p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedCategory(null)}
          >
            <Icon icon="ph:arrow-left-bold" className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h3 className="text-sm font-medium">{selectedCategory.title}</h3>
            <p className="text-xs text-card-foreground/60">{selectedCategory.description}</p>
          </div>
        </div>

        <div className="p-4">
          <Input
            type="text"
            placeholder="Search nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-4"
          />

          <div className="flex flex-col gap-2">
            {filteredNodes?.map((node) => (
              <NodePreviewDraggable
                key={node.type}
                icon={node.icon}
                title={node.title}
                description={node.description}
                type={node.type}
                setActivePanel={setActivePanel}
                insertNode={insertNode}
              />
            ))}
          </div>
        </div>
      </SidebarPanelWrapper>
    );
  }

  return (
    <SidebarPanelWrapper>
      <SidebarPanelHeading>
        <HeaderWithIcon icon="mynaui:plus" title="Add Node" />
      </SidebarPanelHeading>

      <div className="flex flex-col gap-2 p-4">
        {CATEGORIES.map((category) => (
          <button
            key={category.title}
            onClick={() => setSelectedCategory(category)}
            className="flex items-center gap-2 border border-card-foreground/10 rounded-xl bg-card p-2.5 shadow-sm transition hover:ring-2 hover:ring-primary/50"
          >
            <div className="flex-1 text-left">
              <h3 className="text-sm font-medium">{category.title}</h3>
              <p className="text-xs text-card-foreground/60">{category.description}</p>
            </div>
            <Icon icon="ph:arrow-right-bold" className="h-4 w-4" />
          </button>
        ))}
      </div>
    </SidebarPanelWrapper>
  );
}
