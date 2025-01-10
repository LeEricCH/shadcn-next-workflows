import { useEffect } from "react";
import { SwitchSidebarPanel } from "../components/sidebar-switch-panel";
import SidebarButtonItem from "../components/sidebar-button-item";
import { Icon } from "@iconify/react";
import { useFlowStore } from "@/stores/flow-store";
import { useShallow } from "zustand/shallow";

type DesktopSidebarFragmentProps = Readonly<{
  activePanel: "node-properties" | "available-nodes" | "validation" | "none";
  setActivePanel: (
    panel: "node-properties" | "available-nodes" | "validation" | "none"
  ) => void;
}>;

export function DesktopSidebarFragment({
  activePanel,
  setActivePanel,
}: DesktopSidebarFragmentProps) {
  const errors = useFlowStore(
    useShallow((s) => s.workflow.validation.errors)
  );

  const hasErrors = errors.some(e => e.severity === 'error');
  const hasWarnings = errors.some(e => e.severity === 'warning');

  useEffect(() => {
    if (activePanel === "none") {
      setActivePanel("available-nodes");
    }
  }, [activePanel, setActivePanel]);

  return (
    <div className="relative max-w-sm w-fit flex shrink-0 divide-x divide-card-foreground/10">
      {activePanel !== "none" && (
        <div className="min-w-xs grow bg-card">
          <SwitchSidebarPanel active={activePanel} />
        </div>
      )}

      <div className="shrink-0 bg-card p-1.5">
        <div className="h-full flex flex-col gap-2">
          <SidebarButtonItem
            active={activePanel === "available-nodes"}
            onClick={() => setActivePanel("available-nodes")}
          >
            <Icon icon="mynaui:grid" className="size-5" />
          </SidebarButtonItem>

          <div className="mx-auto h-px w-4 bg-card-foreground/10" />

          <SidebarButtonItem
            active={activePanel === "node-properties"}
            onClick={() => setActivePanel("node-properties")}
          >
            <Icon icon="mynaui:layers-three" className="size-5" />
          </SidebarButtonItem>

          <SidebarButtonItem
            active={activePanel === "validation"}
            onClick={() => setActivePanel("validation")}
          >
            {hasErrors ? (
              <Icon icon="ph:warning-circle-fill" className="size-5 text-red-500" />
            ) : hasWarnings ? (
              <Icon icon="ph:warning-fill" className="size-5 text-yellow-500" />
            ) : (
              <Icon icon="ph:check-circle-fill" className="size-5 text-green-500" />
            )}
          </SidebarButtonItem>
        </div>
      </div>
    </div>
  );
}
