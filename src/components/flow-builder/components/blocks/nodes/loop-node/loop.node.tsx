import { type Node, type NodeProps, Position } from "@xyflow/react";
import { memo, useCallback, useMemo } from "react";
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

// Fixed handle IDs for loop node
const HANDLE_IDS = {
  target: 'target',
  body: 'body',
  exit: 'exit'
} as const;

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
        return data.condition ? `While ${data.condition}` : "No condition set...";
      case "collection":
        return data.collection ? `For each item in ${data.collection}` : "No collection set...";
      default:
        return "No loop type set...";
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
              id={HANDLE_IDS.body}
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
              id={HANDLE_IDS.exit}
              position={Position.Right}
              isConnectable={isConnectable}
              className="!bg-green-500"
            />
          </div>
        </div>

        <NodeCardDescription description="Repeat a section of the flow based on a condition or count" />
        <NodeCardFooter nodeId={id} />
      </NodeCardContent>

      <CustomHandle
        type="target"
        id={HANDLE_IDS.target}
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
    icon: "ph:repeat-bold",
    title: "Loop",
    description: "Repeat a section of the flow",
    gradientColor: "purple",
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