import { Button } from "@/components/ui/button";
import { useFlowValidator } from "@/hooks/use-flow-validator";
import { useFlowStore } from "@/stores/flow-store";
import { Icon } from "@iconify/react/dist/iconify.js";
import { toast } from "sonner";
import { useShallow } from "zustand/shallow";
import { useState } from "react";
import { WorkflowJsonModal } from "./workflow-json-modal";

export const SaveFlowButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [workflow, saveWorkflow] = useFlowStore(
    useShallow((s) => [s.workflow, s.actions.saveWorkflow])
  );

  const [isValidating, validateFlow] = useFlowValidator((isValid) => {
    if (isValid) {
      const savedWorkflow = saveWorkflow();
      setIsModalOpen(true);
      toast.success("Flow is valid", {
        description: "You can now proceed to the next step",
        dismissible: true,
      });
    } else
      toast.error("Flow is invalid", {
        description:
          "Please check if the flow is complete and has no lone nodes",
      });
  });

  return (
    <>
      <Button
        onClick={validateFlow}
        disabled={isValidating}
        variant={"outline"}
        size={"sm"}
        className="flex gap-4"
      >
        <Icon icon="fluent:save-28-filled" /> Save Flow
      </Button>

      <WorkflowJsonModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        workflow={workflow}
      />
    </>
  );
};
