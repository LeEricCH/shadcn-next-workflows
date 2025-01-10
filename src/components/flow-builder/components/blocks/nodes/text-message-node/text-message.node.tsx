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
  NodeCardHeader,
} from "@flow-builder-ui/node-card";
import TextMessageNodePropertyPanel from "../../sidebar/panels/node-properties/property-panels/text-message-property-panel";
import { cn } from "@/lib/utils";

const NODE_TYPE = BuilderNode.TEXT_MESSAGE;

// Fixed handle IDs for text message node
const HANDLE_IDS = {
  target: 'target',
  source: 'source'
} as const;

export interface TextMessageNodeData extends BaseNodeData {
  message: string;
}

type TextMessageNodeProps = NodeProps<Node<TextMessageNodeData, typeof NODE_TYPE>>;

function TextMessageNode({
  id,
  data,
  selected,
  isConnectable = true,
}: TextMessageNodeProps) {
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
          <div className="text-xs font-medium text-card-foreground">Message</div>
          <div
            className={cn(
              "line-clamp-4 mt-2 text-sm leading-snug",
              !data.message && "italic text-card-foreground/60"
            )}
          >
            {data.message || "No message set..."}
          </div>
        </div>
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

export const metadata: RegisterNodeMetadata<TextMessageNodeData> = {
  type: NODE_TYPE,
  node: memo(TextMessageNode),
  detail: {
    icon: "ph:chat-circle-text-fill",
    title: "Text Message",
    description: "Send a text message to the user",
    gradientColor: "green",
  },
  connection: {
    inputs: 1,
    outputs: 1,
  },
  defaultData: {
    message: "",
  },
  propertyPanel: TextMessageNodePropertyPanel,
};
