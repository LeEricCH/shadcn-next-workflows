"use client";

import { BuilderNodeType, BuilderNode } from "@/components/flow-builder/components/blocks/types";
import { AVAILABLE_NODES } from "@/components/flow-builder/components/blocks";
import { useInsertNode } from "@/hooks/use-insert-node";
import { useFlowStore } from "@/stores/flow-store";
import { useShallow } from "zustand/shallow";
import { useState, useEffect } from "react";
import { SidebarPanel } from "../../constants/panels";
import { useReactFlow } from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { Input } from "@/components/ui/input";
import { NodePreviewDraggable } from "./components/node-preview-draggable";
import SidebarPanelHeading from "../../components/sidebar-panel-heading";
import SidebarPanelWrapper from "../../components/sidebar-panel-wrapper";
import { HeaderWithIcon } from "@/components/flow-builder/components/ui/header-with-icon";
import { cn } from "@/lib/utils";

type Category = {
  title: string;
  description: string;
  icon: string;
  nodes: typeof AVAILABLE_NODES;
};

const CATEGORIES: Category[] = [
  {
    title: "Flow Control",
    description: "Control the flow of your workflow",
    icon: "ph:flow-arrow-bold",
    nodes: AVAILABLE_NODES.filter((node) => node.type === BuilderNode.BRANCH || node.type === BuilderNode.LOOP),
  },
  {
    title: "Interaction",
    description: "Interact with your users",
    icon: "ph:chat-circle-dots-bold",
    nodes: AVAILABLE_NODES.filter((node) => node.type === BuilderNode.MENU || node.type === BuilderNode.TEXT_MESSAGE),
  },
  {
    title: "Time",
    description: "Control the timing of your workflow",
    icon: "ph:timer-bold",
    nodes: AVAILABLE_NODES.filter((node) => node.type === BuilderNode.DELAY),
  },
  {
    title: "Organization",
    description: "Organize and categorize your workflow",
    icon: "ph:tag-bold",
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
  const [isHighlighted, setIsHighlighted] = useState(false);

  const insertNode = useInsertNode();
  const { screenToFlowPosition } = useReactFlow();

  useEffect(() => {
    if (nodePosition) {
      setIsHighlighted(true);
      const timer = setTimeout(() => setIsHighlighted(false), 650);
      return () => clearTimeout(timer);
    }
  }, [nodePosition]);

  // Get all nodes across categories for search
  const allNodes = CATEGORIES.flatMap(category => 
    category.nodes.map(node => ({ ...node, category: category.title }))
  );

  // Filter nodes when searching
  const searchResults = searchQuery
    ? allNodes.filter(node =>
        node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

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
            {selectedCategory.nodes
              .filter(node =>
                node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                node.description.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((node) => (
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

      <div className="p-4">
        <div className="relative mb-4">
          <Input
            type="text"
            placeholder="Search all nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
          <Icon 
            icon="ph:magnifying-glass" 
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-card-foreground/40" 
          />
        </div>

        {searchQuery ? (
          <div className="flex flex-col gap-2">
            {searchResults.map((node) => (
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
        ) : (
          <div className="grid grid-cols-1 gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category.title}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl border border-card-foreground/10 bg-gradient-to-br from-card to-card/80 p-4 text-left transition-all hover:shadow-md hover:from-primary/5 hover:to-primary/10 hover:border-primary/20 active:scale-[0.98]",
                  isHighlighted && "animate-subtle-bounce"
                )}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-primary/5">
                  <Icon icon={category.icon} className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    {category.title}
                    <Icon 
                      icon="ph:arrow-right" 
                      className="h-3 w-3 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" 
                    />
                  </h3>
                  <p className="text-xs text-card-foreground/60 line-clamp-2 mt-0.5">
                    {category.description}
                  </p>
                </div>
                <div className="absolute right-4 top-4 text-xs text-card-foreground/40">
                  {category.nodes.length} nodes
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </SidebarPanelWrapper>
  );
}
