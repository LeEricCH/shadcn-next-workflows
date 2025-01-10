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
import DelayNodePropertyPanel from "../../sidebar/panels/node-properties/property-panels/delay-property-panel";
import { cn } from "@/lib/utils";

const NODE_TYPE = BuilderNode.DELAY;

export type TimeUnit = "seconds" | "minutes" | "hours" | "days";

export interface DelayNodeData extends BaseNodeData {
  duration: number;
  unit: TimeUnit;
}

const TimeUnitLabels: Record<TimeUnit, string> = {
  seconds: "seconds",
  minutes: "minutes",
  hours: "hours",
  days: "days",
};

type DelayNodeProps = NodeProps<Node<DelayNodeData, typeof NODE_TYPE>>;

export function DelayNode({ id, isConnectable, selected, data }: DelayNodeProps) {
  const meta = useMemo(() => getNodeDetail(NODE_TYPE), []);
  const [showNodePropertiesOf] = useFlowStore(
    useShallow((s) => [s.actions.sidebar.showNodePropertiesOf])
  );

  const [handleId] = useState<string>(nanoid());

  const deleteNode = useDeleteNode();

  const handleDeleteNode = () => {
    deleteNode(id);
  };

  const handleShowNodeProperties = useCallback(() => {
    showNodePropertiesOf({ id, type: NODE_TYPE });
  }, [id, showNodePropertiesOf]);

  const getDelayText = () => {
    if (!data.duration) return "No delay set...";
    return `Wait for ${data.duration} ${TimeUnitLabels[data.unit]}`;
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
        <div className="flex flex-col p-4">
          <div className="text-xs font-medium text-card-foreground">
            Delay Duration
          </div>

          <div className="line-clamp-4 mt-2 text-sm leading-snug">
            <span className={cn(
              "text-card-foreground",
              !data.duration && "italic text-card-foreground/60"
            )}>
              {getDelayText()}
            </span>
          </div>
        </div>

        <NodeCardDescription description="Add a delay before proceeding to the next step" />
        <NodeCardFooter nodeId={id} />
      </NodeCardContent>

      <CustomHandle
        type="target"
        id={handleId}
        position={Position.Left}
        isConnectable={isConnectable}
      />

      <CustomHandle
        type="source"
        id={handleId}
        position={Position.Right}
        isConnectable={isConnectable}
      />
    </NodeCard>
  );
}

export const metadata: RegisterNodeMetadata<DelayNodeData> = {
  type: NODE_TYPE,
  node: memo(DelayNode),
  detail: {
    icon: "ph:timer-fill",
    title: "Delay",
    description: "Add a delay between steps in the workflow",
    gradientColor: "yellow",
  },
  connection: {
    inputs: 1,
    outputs: 1,
  },
  defaultData: {
    duration: 0,
    unit: "seconds",
  },
  propertyPanel: DelayNodePropertyPanel,
}; 