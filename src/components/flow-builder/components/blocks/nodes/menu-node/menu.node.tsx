import { type Node, type NodeProps, Position } from "@xyflow/react";
import { memo, useCallback, useMemo } from "react";
import { BaseNodeData, BuilderNode, RegisterNodeMetadata } from "../../types";
import { getNodeDetail } from "../../utils";
import { useDeleteNode } from "@/hooks/use-delete-node";
import CustomHandle from "../../../handles/custom-handler";
import { NodeOption } from "./components/node-option";
import { cn } from "@/lib/utils";

import {
  NodeCard,
  NodeCardContent,
  NodeCardHeader,
} from "@flow-builder-ui/node-card";
import { useFlowStore } from "@/stores/flow-store";
import { useShallow } from "zustand/shallow";
import { isEmpty } from "lodash";
import MenuNodePropertyPanel from "../../sidebar/panels/node-properties/property-panels/menu-property-panel";

const NODE_TYPE = BuilderNode.MENU;

// Fixed handle ID for menu node target
const HANDLE_IDS = {
  target: 'target'
} as const;

export interface MenuNodeData extends BaseNodeData {
  question: string | null;
  options: { id: string; option: { id: number; value: string } }[];
}

type MenuNodeProps = NodeProps<Node<MenuNodeData, typeof NODE_TYPE>>;

function MenuNode({
  id,
  data,
  selected,
  isConnectable = true,
}: MenuNodeProps) {
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
          <div className="text-xs font-medium text-card-foreground">Question</div>
          <div
            className={cn(
              "line-clamp-4 mt-2 text-sm leading-snug",
              !data.question && "italic text-card-foreground/60"
            )}
          >
            {data.question || "No question set..."}
          </div>
        </div>

        <div className="flex flex-col p-4">
          <div className="text-xs font-medium text-card-foreground mb-2">
            Options
          </div>

          <div className="flex flex-col gap-2">
            {data.options.map((optionData) => (
              <NodeOption
                key={optionData.id}
                id={optionData.id}
                option={optionData.option}
                isConnectable={isConnectable}
              />
            ))}

            {isEmpty(data.options) && (
              <div className="text-sm text-card-foreground/60 italic">
                No options set...
              </div>
            )}
          </div>
        </div>
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

export const metadata: RegisterNodeMetadata<MenuNodeData> = {
  type: NODE_TYPE,
  node: memo(MenuNode),
  detail: {
    icon: "ph:list-numbers-bold",
    title: "Menu",
    description: "Present a menu of options to the user",
    gradientColor: "blue",
  },
  connection: {
    inputs: 1,
    outputs: 1,
  },
  defaultData: {
    question: null,
    options: [],
  },
  propertyPanel: MenuNodePropertyPanel,
};
