"use client";

import { useFlowStore, type IFlowState, type ValidationError } from "@/stores/flow-store";
import { useShallow } from "zustand/shallow";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Node, useReactFlow } from "@xyflow/react";
import { useMemo, useCallback, useRef, useEffect } from "react";
import SidebarPanelWrapper from "../../components/sidebar-panel-wrapper";
import SidebarPanelHeading from "../../components/sidebar-panel-heading";
import { HeaderWithIcon } from "@/components/flow-builder/components/ui/header-with-icon";
import { BuilderNodeType } from "@/components/flow-builder/components/blocks/types";
import { SidebarPanel } from "../../constants/panels";

export function ValidationPanel() {
  const selector = useMemo(
    () => (s: IFlowState) => ({
      errors: s.workflow.validation.errors,
      nodes: s.workflow.nodes,
      showNodeProperties: s.actions.sidebar.showNodePropertiesOf,
      setActivePanel: s.actions.sidebar.setActivePanel,
    }),
    []
  );

  const { errors, nodes, showNodeProperties, setActivePanel } = useFlowStore(useShallow(selector));
  const { setCenter, getNode, setNodes } = useReactFlow();

  // Keep a cache of node labels
  const nodeLabelCache = useRef<Record<string, string>>({});

  // Update the cache whenever nodes change
  useEffect(() => {
    nodes.forEach((node) => {
      const label = String(node.data?.label || node.type);
      if (label) {
        nodeLabelCache.current[node.id] = label;
      }
    });
  }, [nodes]);

  const getNodeDetails = useCallback((nodeId: string) => {
    const node = nodes.find((n: Node) => n.id === nodeId);
    if (!node) {
      // If node is not found but we have a cached label, return that
      if (nodeLabelCache.current[nodeId]) {
        return {
          id: nodeId,
          label: nodeLabelCache.current[nodeId],
          // We don't need position since the node is deleted
        };
      }
      return null;
    }
    
    const label = String(node.data?.label || node.type);
    // Update cache
    nodeLabelCache.current[nodeId] = label;
    
    return {
      id: node.id,
      type: node.type as BuilderNodeType,
      label,
      position: node.position,
    };
  }, [nodes]);

  const handleViewNode = useCallback((nodeId: string) => {
    const node = getNode(nodeId);
    if (!node) return;

    // Center the viewport on the node with some padding
    setCenter(node.position.x, node.position.y, { duration: 800, zoom: 1.2 });

    // Select the node
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        selected: n.id === nodeId,
      }))
    );

    // Open the node properties panel
    showNodeProperties({
      id: node.id,
      type: node.type as BuilderNodeType,
    });
    setActivePanel(SidebarPanel.NODE_PROPERTIES);
  }, [getNode, setCenter, setNodes, showNodeProperties, setActivePanel]);

  const errorsByType = useMemo(() => {
    const grouped = errors.reduce((acc, error) => {
      const type = error.severity;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(error);
      return acc;
    }, {} as Record<'error' | 'warning', ValidationError[]>);
    
    return {
      errors: grouped.error || [],
      warnings: grouped.warning || []
    };
  }, [errors]);

  if (errors.length === 0) {
    return (
      <SidebarPanelWrapper>
        <SidebarPanelHeading>
          <HeaderWithIcon icon="ph:check-circle" title="Validation" />
        </SidebarPanelHeading>
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="size-16 flex items-center justify-center rounded-full bg-green-500/10">
            <Icon icon="ph:check-circle-fill" className="size-8 text-green-500" />
          </div>
          <h3 className="mt-4 font-medium">All Clear!</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Your workflow is valid and ready to go.
          </p>
        </div>
      </SidebarPanelWrapper>
    );
  }

  return (
    <SidebarPanelWrapper>
      <SidebarPanelHeading>
        <HeaderWithIcon icon="ph:warning-circle" title="Validation" />
      </SidebarPanelHeading>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {errorsByType.errors.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-red-500 text-sm font-medium">
                <Icon icon="ph:warning-circle-fill" className="size-4" />
                <span>Errors ({errorsByType.errors.length})</span>
              </div>
              <div className="space-y-2">
                {errorsByType.errors.map((error, index) => {
                  const nodeDetails = getNodeDetails(error.nodeId);
                  if (!nodeDetails) return null;
                  
                  return (
                    <div
                      key={`${error.nodeId}-${index}`}
                      onClick={() => {
                        const node = getNode(error.nodeId);
                        if (node) handleViewNode(error.nodeId);
                      }}
                      className={cn(
                        "group relative rounded-lg border bg-card p-3",
                        "border-red-500/10 hover:border-red-500/30 transition-colors",
                        "hover:shadow-[0_0_0_1px] hover:shadow-red-500/30",
                        !getNode(error.nodeId) && "opacity-50",
                        getNode(error.nodeId) ? "cursor-pointer" : "cursor-not-allowed"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 size-5 shrink-0 rounded-full bg-red-500/10 flex items-center justify-center">
                          <Icon icon="ph:warning-circle-fill" className="size-3.5 text-red-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium truncate uppercase">
                              {nodeDetails.label}
                              {!getNode(error.nodeId) && " (Deleted)"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              #{error.nodeId}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {error.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {errorsByType.warnings.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-yellow-500 text-sm font-medium">
                <Icon icon="ph:warning" className="size-4" />
                <span>Warnings ({errorsByType.warnings.length})</span>
              </div>
              <div className="space-y-2">
                {errorsByType.warnings.map((warning, index) => {
                  const nodeDetails = getNodeDetails(warning.nodeId);
                  if (!nodeDetails) return null;
                  
                  return (
                    <div
                      key={`${warning.nodeId}-${index}`}
                      onClick={() => {
                        const node = getNode(warning.nodeId);
                        if (node) handleViewNode(warning.nodeId);
                      }}
                      className={cn(
                        "group relative rounded-lg border bg-card p-3",
                        "border-yellow-500/10 hover:border-yellow-500/30 transition-colors",
                        "hover:shadow-[0_0_0_1px] hover:shadow-yellow-500/30",
                        !getNode(warning.nodeId) && "opacity-50",
                        getNode(warning.nodeId) ? "cursor-pointer" : "cursor-not-allowed"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 size-5 shrink-0 rounded-full bg-yellow-500/10 flex items-center justify-center">
                          <Icon icon="ph:warning" className="size-3.5 text-yellow-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium truncate uppercase">
                              {nodeDetails.label}
                              {!getNode(warning.nodeId) && " (Deleted)"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              #{warning.nodeId}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {warning.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </SidebarPanelWrapper>
  );
} 