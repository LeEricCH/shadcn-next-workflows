import { useCallback } from "react";
import { useFlowStore } from "@/stores/flow-store";
import { useShallow } from "zustand/shallow";
import { useReactFlow } from "@xyflow/react";
import { SidebarPanel } from "../constants/panels";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";

interface FlowContextMenuProps {
  position: { x: number; y: number };
  onClose: () => void;
}

export default function FlowContextMenu({ position, onClose }: FlowContextMenuProps) {
  const { project } = useReactFlow();
  const [setActivePanel, setNodePosition] = useFlowStore(
    useShallow((s) => [
      s.actions.sidebar.setActivePanel,
      s.actions.nodes.setNodePosition,
    ])
  );

  const handleOpenSidebar = useCallback(() => {
    // Convert screen coordinates to flow coordinates
    const flowPosition = project({ x: position.x, y: position.y });
    
    // Store the position where we want to add the node
    setNodePosition(flowPosition);
    
    // Open the available nodes panel
    setActivePanel(SidebarPanel.AVAILABLE_NODES);
    
    // Close the context menu
    onClose();
  }, [position, project, setActivePanel, setNodePosition, onClose]);

  return (
    <div
      className="absolute z-50 min-w-48 rounded-md border bg-popover p-1 shadow-md"
      style={{
        top: position.y,
        left: position.x,
      }}
    >
      <Button
        variant="ghost"
        className="w-full justify-start gap-2"
        onClick={handleOpenSidebar}
      >
        <Icon icon="ph:plus-bold" className="h-4 w-4" />
        Add Node
      </Button>
    </div>
  );
} 