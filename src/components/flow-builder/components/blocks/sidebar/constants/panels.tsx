import type { ComponentType } from "react";
import AvailableNodesPanel from "../panels/available-nodes/available-nodes-panel";
import { NodePropertiesPanel } from "../panels/node-properties/node-properties-panel";
import { ValidationPanel } from "../panels/validation/validation-panel";

export enum SidebarPanel {
  AVAILABLE_NODES = "available-nodes",
  NODE_PROPERTIES = "node-properties",
  VALIDATION = "validation"
}

export const PANEL_COMPONENTS: Record<SidebarPanel | "none", ComponentType> = {
  [SidebarPanel.AVAILABLE_NODES]: AvailableNodesPanel,
  [SidebarPanel.NODE_PROPERTIES]: NodePropertiesPanel,
  [SidebarPanel.VALIDATION]: ValidationPanel,
  none: () => null,
};
