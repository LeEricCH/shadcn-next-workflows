import { SidebarPanel } from "@/components/flow-builder/components/blocks/sidebar/constants/panels";

export const getWorkflow = async (id: string) => {
  // Mock API call - in a real app, this would fetch from an API
  const workflow = {
    id: "1",
    name: "Initial Workflow",
    edges: [
      {
        id: "e1-2",
        source: "start-node",
        target: "end-node",
        type: "deletable"
      }
    ],
    nodes: [
      {
        id: "start-node",
        type: "start",
        position: { x: 0, y: 0 },
        data: {
          label: "Start",
          deletable: false
        }
      },
      {
        id: "end-node",
        type: "end",
        position: { x: 200, y: 0 },
        data: {
          label: "End",
          deletable: false
        }
      }
    ],
    nodePosition: null,
    validation: {
      errors: [],
      isValid: true,
      lastValidated: Date.now()
    },
    sidebar: {
      active: SidebarPanel.AVAILABLE_NODES,
      panels: {
        nodeProperties: {
          selectedNode: null
        }
      }
    }
  };

  return workflow;
};
