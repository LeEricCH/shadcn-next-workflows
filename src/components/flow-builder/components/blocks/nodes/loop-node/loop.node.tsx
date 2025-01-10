import { type Node, type NodeProps, Position } from "@xyflow/react";
import { nanoid } from "nanoid";
import { memo, useCallback, useMemo, useState } from "react";
import { BaseNodeData, BuilderNode, RegisterNodeMetadata } from "../../types";
import { getNodeDetail } from "../../utils";
import { useFlowStore } from "@/stores/flow-store";
import { useDeleteNode } from "@/hooks/use-delete-node";
import CustomHandle from "@/components/flow-builder/components/handles/custom-handler";
import { useShallow } from "zustand/shallow";
import {
  NodeCard,
  NodeCardContent,
  NodeCardDescription,
  NodeCardFooter,
  NodeCardHeader,
} from "@flow-builder-ui/node-card";
import LoopNodePropertyPanel from "../../sidebar/panels/node-properties/property-panels/loop-property-panel";
import { cn } from "@/lib/utils";

const NODE_TYPE = BuilderNode.LOOP;

export type LoopType = "count" | "condition" | "collection";

export interface LoopNodeData extends BaseNodeData {
  type: LoopType;
  maxIterations: number;
  variable?: string;
  condition?: string;
  collection?: string;
}

const LoopTypeLabels: Record<LoopType, string> = {
  count: "Fixed Count",
  condition: "While Condition",
  collection: "For Each Item",
};

type LoopNodeProps = NodeProps<Node<LoopNodeData, typeof NODE_TYPE>>;

export function LoopNode({ id, isConnectable, selected, data }: LoopNodeProps) {
  const meta = useMemo(() => getNodeDetail(NODE_TYPE), []);
  const [showNodePropertiesOf] = useFlowStore(
    useShallow((s) => [s.actions.sidebar.showNodePropertiesOf])
  );

  const [targetHandleId] = useState<string>(nanoid());
  const [bodyHandleId] = useState<string>(nanoid());
  const [exitHandleId] = useState<string>(nanoid());

  const deleteNode = useDeleteNode();

  const handleDeleteNode = () => {
    deleteNode(id);
  };

  const handleShowNodeProperties = useCallback(() => {
    showNodePropertiesOf({ id, type: NODE_TYPE });
  }, [id, showNodePropertiesOf]);

  const getLoopText = () => {
    switch (data.type) {
      case "count":
        return `Repeat ${data.maxIterations} times`;
      case "condition":
        return `While ${data.condition || "condition"}`;
      case "collection":
        return `For each item in ${data.collection || "collection"}`;
      default:
        return "No loop configuration...";
    }
  };

  return (
    <NodeCard data-selected={selected} onDoubleClick={handleShowNodeProperties}>
      <NodeCardHeader
        icon={meta.icon}
        title={meta.title}
        handleDeleteNode={handleDeleteNode}
        handleShowNodeProperties={handleShowNodeProperties}
        gradientColor={meta.gradientColor}
      />

      <NodeCardContent>
        <div className="min-h-10 flex flex-col">
          <div className="flex flex-col p-4">
            <div className="text-xs font-medium text-card-foreground">
              Loop Type: {LoopTypeLabels[data.type]}
            </div>

            <div className="line-clamp-4 mt-2 text-sm leading-snug">
              <span className={cn(
                "text-card-foreground",
                !data.type && "italic text-card-foreground/60"
              )}>
                {getLoopText()}
              </span>
            </div>

            {data.maxIterations > 0 && (
              <div className="mt-2 text-xs text-card-foreground/60">
                Max Iterations: {data.maxIterations}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col p-4 z-50">
          <div className="text-xs font-medium text-card-foreground mb-2">
            Paths
          </div>

          <div className="relative flex items-center gap-x-2 px-4 -mx-4 mb-2">
            <div className="w-[60px] flex shrink-0 items-center text-xs text-blue-500 gap-x-0.5">
              Loop Body
            </div>

            <div className="w-[140px] px-2 py-1.5 text-sm bg-blue-500/10 rounded border border-blue-500/20 truncate">
              Execute Loop
            </div>

            <CustomHandle
              type="source"
              id="body"
              position={Position.Right}
              isConnectable={isConnectable}
              className="!bg-blue-500"
            />
          </div>

          <div className="relative flex items-center gap-x-2 px-4 -mx-4">
            <div className="w-[60px] flex shrink-0 items-center text-xs text-green-500 gap-x-0.5">
              Exit Loop
            </div>

            <div className="w-[140px] px-2 py-1.5 text-sm bg-green-500/10 rounded border border-green-500/20 truncate">
              Continue Flow
            </div>

            <CustomHandle
              type="source"
              id="exit"
              position={Position.Right}
              isConnectable={isConnectable}
              className="!bg-green-500"
            />
          </div>
        </div>

        <NodeCardDescription description="Create a loop to repeat actions based on a condition or count" />
        <NodeCardFooter nodeId={id} />
      </NodeCardContent>

      <CustomHandle
        type="target"
        id={targetHandleId}
        position={Position.Left}
        isConnectable={isConnectable}
      />
    </NodeCard>
  );
}

export const metadata: RegisterNodeMetadata<LoopNodeData> = {
  type: NODE_TYPE,
  node: memo(LoopNode),
  detail: {
    icon: "ph:repeat-fill",
    title: "Loop",
    description: "Create loops to repeat actions based on conditions or counts",
    gradientColor: "blue",
  },
  connection: {
    inputs: 1,
    outputs: 2,
  },
  defaultData: {
    type: "count",
    maxIterations: 1,
  },
  propertyPanel: LoopNodePropertyPanel,
}; 