import { PANEL_COMPONENTS } from "../constants/panels";
import { SidebarPanel } from "../constants/panels";

type SwitchSidebarPanelProps = Readonly<{
  active: SidebarPanel | "none";
}>;

export function SwitchSidebarPanel({ active }: SwitchSidebarPanelProps) {
  const PanelComponent = PANEL_COMPONENTS[active];
  return PanelComponent ? <PanelComponent /> : null;
}
