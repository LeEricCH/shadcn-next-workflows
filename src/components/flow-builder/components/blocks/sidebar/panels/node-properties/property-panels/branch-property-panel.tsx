import { BuilderNodeType } from "@/components/flow-builder/components/blocks/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BranchNodeData, ComparisonType, ValueType } from "@/components/flow-builder/components/blocks/nodes/branch-node/branch.node";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Icon } from "@iconify/react";

interface BranchNodePropertyPanelProps {
  id: string;
  type: BuilderNodeType;
  data: BranchNodeData;
  updateData: (data: Partial<BranchNodeData>) => void;
}

const VALUE_TYPES: { label: string; value: ValueType; icon: string }[] = [
  { label: "Text", value: "string", icon: "ph:text-t-bold" },
  { label: "Number", value: "number", icon: "ph:hash-bold" },
  { label: "True/False", value: "boolean", icon: "ph:toggle-left-bold" },
  { label: "Date", value: "date", icon: "ph:calendar-bold" },
];

const COMPARISON_TYPES: { label: string; value: ComparisonType; types: ValueType[]; icon: string }[] = [
  { label: "Equals", value: "equals", types: ["string", "number", "boolean", "date"], icon: "ph:equals-bold" },
  { label: "Does not equal", value: "not_equals", types: ["string", "number", "boolean", "date"], icon: "ph:not-equals-bold" },
  { label: "Greater than", value: "greater_than", types: ["number", "date"], icon: "ph:caret-right-bold" },
  { label: "Less than", value: "less_than", types: ["number", "date"], icon: "ph:caret-left-bold" },
  { label: "Greater than or equals", value: "greater_than_equals", types: ["number", "date"], icon: "ph:caret-double-right-bold" },
  { label: "Less than or equals", value: "less_than_equals", types: ["number", "date"], icon: "ph:caret-double-left-bold" },
  { label: "Contains", value: "contains", types: ["string"], icon: "ph:text-columns-bold" },
  { label: "Starts with", value: "starts_with", types: ["string"], icon: "ph:text-indent-bold" },
  { label: "Ends with", value: "ends_with", types: ["string"], icon: "ph:text-outdent-bold" },
  { label: "Is empty", value: "is_empty", types: ["string", "number", "boolean", "date"], icon: "ph:circle-bold" },
  { label: "Is not empty", value: "is_not_empty", types: ["string", "number", "boolean", "date"], icon: "ph:circle-half-bold" },
];

export default function BranchNodePropertyPanel({
  data,
  updateData,
}: BranchNodePropertyPanelProps) {
  const availableComparisons = COMPARISON_TYPES.filter(comp => 
    comp.types.includes(data.valueType)
  );

  const renderValueTypeContent = (selectedValue: string) => {
    const type = VALUE_TYPES.find(t => t.value === selectedValue);
    return type ? (
      <div className="flex items-center gap-2">
        <Icon icon={type.icon} className="h-4 w-4" />
        {type.label}
      </div>
    ) : null;
  };

  const renderComparisonContent = (selectedValue: string) => {
    const type = COMPARISON_TYPES.find(t => t.value === selectedValue);
    return type ? (
      <div className="flex items-center gap-2">
        <Icon icon={type.icon} className="h-4 w-4" />
        {type.label}
      </div>
    ) : null;
  };

  const renderBooleanContent = (selectedValue: string) => (
    <div className="flex items-center gap-2">
      <Icon 
        icon={selectedValue === "true" ? "ph:check-circle-bold" : "ph:x-circle-bold"} 
        className="h-4 w-4" 
      />
      {selectedValue === "true" ? "True" : "False"}
    </div>
  );

  return (
    <div className="flex flex-col gap-4 p-4">
      <Card className="p-4 border-none bg-card-foreground/5">
        <div className="space-y-4">
          <div>
            <Label className="text-xs font-medium text-card-foreground/60">Variable Name</Label>
            <Input
              placeholder="Enter variable name..."
              value={data.variable}
              onChange={(e) => updateData({ variable: e.target.value })}
              className="mt-1.5"
            />
          </div>

          <div>
            <Label className="text-xs font-medium text-card-foreground/60">Value Type</Label>
            <Select
              value={data.valueType}
              onValueChange={(value: ValueType) => {
                const newCompType = availableComparisons.find(comp => comp.value === data.comparisonType)
                  ? data.comparisonType
                  : availableComparisons[0]?.value || "equals";
                
                updateData({ 
                  valueType: value,
                  comparisonType: newCompType,
                  compareValue: ""
                });
              }}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue>
                  {renderValueTypeContent(data.valueType)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {VALUE_TYPES.map((type) => (
                  <SelectItem 
                    key={type.value} 
                    value={type.value}
                  >
                    <div className="flex items-center gap-2">
                      <Icon icon={type.icon} className="h-4 w-4" />
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs font-medium text-card-foreground/60">Comparison</Label>
            <Select
              value={data.comparisonType}
              onValueChange={(value: ComparisonType) => updateData({ comparisonType: value })}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue>
                  {renderComparisonContent(data.comparisonType)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {availableComparisons.map((type) => (
                  <SelectItem 
                    key={type.value} 
                    value={type.value}
                  >
                    <div className="flex items-center gap-2">
                      <Icon icon={type.icon} className="h-4 w-4" />
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {!["is_empty", "is_not_empty"].includes(data.comparisonType) && (
            <div>
              <Label className="text-xs font-medium text-card-foreground/60">Compare Value</Label>
              {data.valueType === "boolean" ? (
                <Select
                  value={data.compareValue}
                  onValueChange={(value: string) => updateData({ compareValue: value })}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue>
                      {renderBooleanContent(data.compareValue)}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">
                      <div className="flex items-center gap-2">
                        <Icon icon="ph:check-circle-bold" className="h-4 w-4" />
                        True
                      </div>
                    </SelectItem>
                    <SelectItem value="false">
                      <div className="flex items-center gap-2">
                        <Icon icon="ph:x-circle-bold" className="h-4 w-4" />
                        False
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  placeholder={`Enter ${data.valueType} value...`}
                  value={data.compareValue}
                  type={data.valueType === "number" ? "number" : data.valueType === "date" ? "date" : "text"}
                  onChange={(e) => updateData({ compareValue: e.target.value })}
                  className="mt-1.5"
                />
              )}
            </div>
          )}
        </div>
      </Card>

      <Card className="p-4 border-none bg-card-foreground/5">
        <div className="space-y-4">
          <div>
            <Label className="text-xs font-medium text-card-foreground/60">True Branch Label</Label>
            <div className="mt-1.5 flex items-center gap-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-green-500/20 bg-green-500/10">
                <Icon icon="ph:check-bold" className="h-4 w-4 text-green-500" />
              </div>
              <Input
                placeholder="Label for true branch..."
                value={data.trueLabel}
                onChange={(e) => updateData({ trueLabel: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label className="text-xs font-medium text-card-foreground/60">False Branch Label</Label>
            <div className="mt-1.5 flex items-center gap-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-red-500/20 bg-red-500/10">
                <Icon icon="ph:x-bold" className="h-4 w-4 text-red-500" />
              </div>
              <Input
                placeholder="Label for false branch..."
                value={data.falseLabel}
                onChange={(e) => updateData({ falseLabel: e.target.value })}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
} 