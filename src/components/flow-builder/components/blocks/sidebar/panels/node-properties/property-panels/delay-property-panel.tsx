import { BuilderNodeType } from "@/components/flow-builder/components/blocks/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DelayNodeData, TimeUnit } from "@/components/flow-builder/components/blocks/nodes/delay-node/delay.node";

interface DelayNodePropertyPanelProps {
  id: string;
  type: BuilderNodeType;
  data: DelayNodeData;
  updateData: (data: Partial<DelayNodeData>) => void;
}

const TIME_UNITS: { label: string; value: TimeUnit }[] = [
  { label: "Seconds", value: "seconds" },
  { label: "Minutes", value: "minutes" },
  { label: "Hours", value: "hours" },
  { label: "Days", value: "days" },
];

export default function DelayNodePropertyPanel({
  id,
  data,
  updateData,
}: DelayNodePropertyPanelProps) {
  return (
    <div className="flex flex-col gap-4 p-4">
      <Card className="p-4 border-none bg-card-foreground/5">
        <div className="space-y-4">
          <div>
            <Label className="text-xs font-medium text-card-foreground/60">Duration</Label>
            <Input
              type="number"
              min={0}
              value={data.duration}
              onChange={(e) => updateData({ duration: parseInt(e.target.value) || 0 })}
              placeholder="Enter duration..."
              className="mt-1.5"
            />
          </div>

          <div>
            <Label className="text-xs font-medium text-card-foreground/60">Time Unit</Label>
            <Select
              value={data.unit}
              onValueChange={(value: TimeUnit) => updateData({ unit: value })}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIME_UNITS.map((unit) => (
                  <SelectItem key={unit.value} value={unit.value}>
                    {unit.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>
    </div>
  );
} 