import { BuilderNodeType } from "@/components/flow-builder/components/blocks/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoopNodeData, LoopType } from "@/components/flow-builder/components/blocks/nodes/loop-node/loop.node";
import { Icon } from "@iconify/react";

interface LoopNodePropertyPanelProps {
  id: string;
  type: BuilderNodeType;
  data: LoopNodeData;
  updateData: (data: Partial<LoopNodeData>) => void;
}

const LOOP_TYPES: { label: string; value: LoopType; icon: string }[] = [
  { label: "Fixed Count", value: "count", icon: "ph:repeat-bold" },
  { label: "While Condition", value: "condition", icon: "ph:arrows-counter-clockwise-bold" },
  { label: "For Each Item", value: "collection", icon: "ph:list-numbers-bold" },
];

export default function LoopNodePropertyPanel({
  id,
  data,
  updateData,
}: LoopNodePropertyPanelProps) {
  return (
    <div className="flex flex-col gap-4 p-4">
      <Card className="p-4 border-none bg-card-foreground/5">
        <div className="space-y-4">
          <div>
            <Label className="text-xs font-medium text-card-foreground/60">Loop Type</Label>
            <Select
              value={data.type}
              onValueChange={(value: LoopType) => updateData({ type: value })}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue>
                  {LOOP_TYPES.find(t => t.value === data.type)?.label}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {LOOP_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <Icon icon={type.icon} className="h-4 w-4" />
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {data.type === "count" && (
            <div>
              <Label className="text-xs font-medium text-card-foreground/60">Number of Iterations</Label>
              <Input
                type="number"
                min={1}
                value={data.maxIterations}
                onChange={(e) => updateData({ maxIterations: parseInt(e.target.value) || 1 })}
                placeholder="Enter number of iterations..."
                className="mt-1.5"
              />
            </div>
          )}

          {data.type === "condition" && (
            <div>
              <Label className="text-xs font-medium text-card-foreground/60">Condition</Label>
              <Input
                value={data.condition}
                onChange={(e) => updateData({ condition: e.target.value })}
                placeholder="Enter condition..."
                className="mt-1.5"
              />
            </div>
          )}

          {data.type === "collection" && (
            <div>
              <Label className="text-xs font-medium text-card-foreground/60">Collection</Label>
              <Input
                value={data.collection}
                onChange={(e) => updateData({ collection: e.target.value })}
                placeholder="Enter collection name..."
                className="mt-1.5"
              />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
} 