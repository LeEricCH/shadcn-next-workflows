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
import { Badge } from "@/components/ui/badge";
import TagsNodePropertyPanel from "../../sidebar/panels/node-properties/property-panels/tags-property";
import { cn } from "@/lib/utils";

const NODE_TYPE = BuilderNode.TAGS;

// Fixed handle IDs for tags node
const HANDLE_IDS = {
  target: 'target',
  source: 'source'
} as const;

export interface TagsNodeData extends BaseNodeData {
  tags: string[];
}

type TagsNodeProps = NodeProps<Node<TagsNodeData, typeof NODE_TYPE>>;

export function TagsNode({ id, isConnectable, selected, data }: TagsNodeProps) {
  const meta = useMemo(() => getNodeDetail(NODE_TYPE), []);
  const [showNodePropertiesOf, tags] = useFlowStore(
    useShallow((s) => [s.actions.sidebar.showNodePropertiesOf, s.tags])
  );

  const deleteNode = useDeleteNode();

  const handleDeleteNode = () => {
    deleteNode(id);
  };

  const handleShowNodeProperties = useCallback(() => {
    showNodePropertiesOf({ id, type: NODE_TYPE });
  }, [id, showNodePropertiesOf]);

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
          <div className="text-xs font-medium text-card-foreground">Tags</div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {data.tags.length > 0 ? (
              data.tags.map((tagValue) => {
                const tag = tags.find((t) => t.value === tagValue);
                if (!tag) return null;
                return (
                  <Badge
                    key={tag.value}
                    style={{
                      borderColor: `${tag.color}20`,
                      backgroundColor: `${tag.color}10`,
                      color: tag.color,
                    }}
                  >
                    {tag.label}
                  </Badge>
                );
              })
            ) : (
              <div className="text-sm text-card-foreground/60 italic">
                No tags set...
              </div>
            )}
          </div>
        </div>

        <NodeCardDescription description="Add tags to organize and categorize your workflow" />
        <NodeCardFooter nodeId={id} />
      </NodeCardContent>

      <CustomHandle
        type="target"
        id={HANDLE_IDS.target}
        position={Position.Left}
        isConnectable={isConnectable}
      />

      <CustomHandle
        type="source"
        id={HANDLE_IDS.source}
        position={Position.Right}
        isConnectable={isConnectable}
      />
    </NodeCard>
  );
}

export const metadata: RegisterNodeMetadata<TagsNodeData> = {
  type: NODE_TYPE,
  node: memo(TagsNode),
  detail: {
    icon: "ph:tag-bold",
    title: "Tags",
    description: "Add tags to your workflow",
    gradientColor: "lime",
  },
  connection: {
    inputs: 1,
    outputs: 1,
  },
  defaultData: {
    tags: [],
  },
  propertyPanel: TagsNodePropertyPanel,
};
