import { type Node } from "@xyflow/react";
import { useReactFlow } from "@xyflow/react";
import { BuilderNodeType } from "@/components/flow-builder/components/blocks/types";
import { PROPERTY_PANELS } from "../constants/property-panels";
import { useCallback } from "react";

interface NodePropertyPanelProps {
  id: string;
  type: BuilderNodeType;
  data: any;
}

export function NodePropertyPanel({ id, type, data }: NodePropertyPanelProps) {
  const { setNodes } = useReactFlow();

  const handleUpdateData = useCallback((newData: Partial<Node["data"]>) => {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                ...newData,
              },
            }
          : node
      )
    );
  }, [id, setNodes]);

  if (!(type in PROPERTY_PANELS)) {
    return null;
  }
  
  const PanelComponent = PROPERTY_PANELS[type as keyof typeof PROPERTY_PANELS];

  if (!PanelComponent || !data) {
    return null;
  }

  return (
    <div data-property-panel>
      <PanelComponent
        id={id}
        type={type}
        data={data}
        updateData={handleUpdateData}
      />
    </div>
  );
}
