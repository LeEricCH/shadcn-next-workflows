import type { IFlowState } from "@/stores/flow-store";

export const getWorkflow = async (
  id: string
): Promise<IFlowState["workflow"]> => {
  // TODO: Get data from API
  return {
    "id": "1",
    "name": "Initial Workflow",
    "nodePosition": null,
    "edges": [],
    "nodes": [
      {
        "id": "start-node",
        "type": "start",
        "position": {
          "x": 0,
          "y": 0
        },
        "data": {
          "label": "Start",
          "deletable": false
        }
      },
      {
        "id": "end-node",
        "type": "end",
        "position": {
          "x": 1500,
          "y": 0
        },
        "data": {
          "label": "End",
          "deletable": true
        }
      }
    ],
    "validation": {
      "errors": [],
      "isValid": true,
      "lastValidated": null
    },
    "sidebar": {
      "active": "none",
      "panels": {
        "nodeProperties": {
          "selectedNode": null
        }
      }
    }
  };
}
