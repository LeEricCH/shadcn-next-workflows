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
import BranchNodePropertyPanel from "../../sidebar/panels/node-properties/property-panels/branch-property-panel";
import { cn } from "@/lib/utils";

const NODE_TYPE = BuilderNode.BRANCH;

// Fixed handle IDs for branch node
const HANDLE_IDS = {
  target: 'target',
  true: 'true',
  false: 'false'
} as const;

export type ComparisonType = 
  | "equals" 
  | "not_equals" 
  | "greater_than" 
  | "less_than" 
  | "greater_than_equals" 
  | "less_than_equals"
  | "contains" 
  | "starts_with" 
  | "ends_with"
  | "is_empty"
  | "is_not_empty";

export type ValueType = "string" | "number" | "boolean" | "date";

export interface BranchNodeData extends BaseNodeData {
  variable: string;
  valueType: ValueType;
  comparisonType: ComparisonType;
  compareValue: string;
  trueLabel: string;
  falseLabel: string;
}

const ComparisonLabels: Record<ComparisonType, string> = {
  equals: "equals",
  not_equals: "does not equal",
  greater_than: "is greater than",
  less_than: "is less than",
  greater_than_equals: "is greater than or equal to",
  less_than_equals: "is less than or equal to",
  contains: "contains",
  starts_with: "starts with",
  ends_with: "ends with",
  is_empty: "is empty",
  is_not_empty: "is not empty"
};

type BranchNodeProps = NodeProps<Node<BranchNodeData, typeof NODE_TYPE>>;

export function BranchNode({ id, isConnectable, selected, data }: BranchNodeProps) {
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

  const getConditionText = () => {
    if (["is_empty", "is_not_empty"].includes(data.comparisonType)) {
      return `${data.variable} ${ComparisonLabels[data.comparisonType]}`;
    }
    return `${data.variable} ${ComparisonLabels[data.comparisonType]} ${data.compareValue}`;
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
              If Statement
            </div>

            <div className="line-clamp-4 mt-2 text-sm leading-snug">
              <span className={cn(
                "text-card-foreground",
                !data.variable && "italic text-card-foreground/60"
              )}>
                {data.variable ? getConditionText() : "No condition set..."}
              </span>
            </div>

            <div className="mt-2 text-xs text-card-foreground/60">
              Type: {data.valueType}
            </div>
          </div>
        </div>

        <div className="flex flex-col p-4 z-50">
          <div className="text-xs font-medium text-card-foreground mb-2">
            Branches
          </div>

          <div className="relative flex items-center gap-x-2 px-4 -mx-4 mb-2">
            <div className="w-[60px] flex shrink-0 items-center text-xs text-green-500 gap-x-0.5">
              True Path
            </div>

            <div className="w-[140px] px-2 py-1.5 text-sm bg-green-500/10 rounded border border-green-500/20 truncate">
              {data.trueLabel}
            </div>

            <CustomHandle
              type="source"
              id={HANDLE_IDS.true}
              position={Position.Right}
              isConnectable={isConnectable}
              className="!bg-green-500"
            />
          </div>

          <div className="relative flex items-center gap-x-2 px-4 -mx-4">
            <div className="w-[60px] flex shrink-0 items-center text-xs text-red-500 gap-x-0.5">
              False Path
            </div>

            <div className="w-[140px] px-2 py-1.5 text-sm bg-red-500/10 rounded border border-red-500/20 truncate">
              {data.falseLabel}
            </div>

            <CustomHandle
              type="source"
              id={HANDLE_IDS.false}
              position={Position.Right}
              isConnectable={isConnectable}
              className="!bg-red-500"
            />
          </div>
        </div>

        <NodeCardDescription description="Branch the flow based on a condition with advanced comparison options" />
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

export const metadata: RegisterNodeMetadata<BranchNodeData> = {
  type: NODE_TYPE,
  node: memo(BranchNode),
  detail: {
    icon: "ph:git-branch-fill",
    title: "If Branch",
    description: "Split the flow based on variable comparison with multiple operators",
    gradientColor: "indigo",
  },
  connection: {
    inputs: 1,
    outputs: 2,
  },
  defaultData: {
    variable: "",
    valueType: "string",
    comparisonType: "equals",
    compareValue: "",
    trueLabel: "True",
    falseLabel: "False",
  },
  propertyPanel: BranchNodePropertyPanel,
}; 