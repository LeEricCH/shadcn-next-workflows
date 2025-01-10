import { NODE_TYPE_DRAG_DATA_FORMAT } from "@/contants/symbols";
import { useInsertNode } from "@/hooks/use-insert-node";
import { type DragEvent, type ReactNode, useCallback } from "react";
import { BuilderNodeType } from "../../../../types";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { SidebarPanel } from "../../../constants/panels";

type NodePreviewDraggableProps = Readonly<{
  icon: string | ReactNode;
  title: string;
  description: string;
  type: string;
  children?: never;
  setActivePanel: (panel: "none" | SidebarPanel) => void;
  insertNode: ReturnType<typeof useInsertNode>;
}>;

export function NodePreviewDraggable({
  icon,
  title,
  description,
  type,
  setActivePanel,
  insertNode,
}: NodePreviewDraggableProps) {
  const onDragStart = useCallback(
    (e: DragEvent, type: string) => {
      e.dataTransfer.setData(NODE_TYPE_DRAG_DATA_FORMAT, type);
      e.dataTransfer.effectAllowed = "move";
    },
    []
  );

  const onClick = useCallback(() => {
    insertNode(type as BuilderNodeType);
  }, [insertNode, type]);

  return (
    <div
      className="group w-full flex items-start gap-3 rounded-lg border border-card-foreground/5 bg-card/30 p-3 cursor-grab select-none transition-all hover:bg-primary/5 hover:border-primary/20 active:cursor-grabbing"
      onClick={onClick}
      onDragStart={(e) => onDragStart(e, type)}
      draggable
      data-vaul-no-drag
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-primary/10 to-primary/5">
        {typeof icon === "string" ? (
          <Icon icon={icon} className="h-4 w-4 text-primary" />
        ) : (
          icon
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium">{title}</h4>
        <p className="text-xs text-card-foreground/60 line-clamp-2 mt-0.5">
          {description}
        </p>
      </div>
    </div>
  );
}
