import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IFlowState } from "@/stores/flow-store";

interface WorkflowJsonModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  workflow: IFlowState["workflow"];
}

export function WorkflowJsonModal({
  isOpen,
  onOpenChange,
  workflow,
}: WorkflowJsonModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[800px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Workflow JSON</DialogTitle>
          <DialogDescription>
            Below is the JSON representation of your workflow
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[500px] w-full rounded-md border p-4">
          <pre className="text-sm">
            {JSON.stringify(workflow, null, 2)}
          </pre>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
} 