import type { IFlowState } from "@/stores/flow-store";

export const getWorkflow = async (
  id: string
): Promise<IFlowState["workflow"]> => {
  // TODO: Get data from API
  return {
    "id": "1",
    "name": "Initial Workflow",
    "nodePosition": null,
    "edges": [
      {
        "id": "27Uqm_guQgYOw81_ibdSu",
        "source": "rFM8ixvItA-i-bXblxZ_M",
        "target": "nESW80juDe8b5bB_tbmSc",
        "type": "deletable"
      },
      {
        "id": "aiMB_q-I713SLcttfM6PS",
        "source": "nESW80juDe8b5bB_tbmSc",
        "target": "5zne5FShP-jUCF1s7823h",
        "type": "deletable"
      },
      {
        "id": "gqnkF2AYRxqf8QUiZHuyr",
        "source": "5zne5FShP-jUCF1s7823h",
        "target": "8p15_Y66luCEbFS_J7vcO",
        "type": "deletable"
      },
      {
        "id": "wEgmkVqjI5s2VH32FIMvX",
        "source": "nESW80juDe8b5bB_tbmSc",
        "target": "9BP0qBxoQ70DKRq8gC1GX",
        "type": "deletable"
      },
      {
        "id": "VY2MoIexgvwqn-h8NU2Rp",
        "source": "9BP0qBxoQ70DKRq8gC1GX",
        "target": "F1zbrjG2vqeDEFElu1478",
        "type": "deletable"
      },
      {
        "id": "K9n9h4MV4dpHMbrTstf48",
        "source": "nESW80juDe8b5bB_tbmSc",
        "target": "Z-jW1DqKIqpw1SDVMnkra",
        "type": "deletable"
      },
      {
        "id": "bnm75BAIbdRkozdO7sE3I",
        "source": "Z-jW1DqKIqpw1SDVMnkra",
        "target": "ORKuDH3QHalm-h0zs8zd_",
        "type": "deletable"
      },
      {
        "source": "8p15_Y66luCEbFS_J7vcO",
        "target": "l3RG8HC59OtlzmzUJl9Pz",
        "id": "dCHAC5AvaV9N8aiNnmoiJ",
        "type": "deletable"
      },
      {
        "source": "F1zbrjG2vqeDEFElu1478",
        "target": "l3RG8HC59OtlzmzUJl9Pz",
        "id": "fWmDbnjekVetKchP3nuRs",
        "type": "deletable"
      },
      {
        "source": "ORKuDH3QHalm-h0zs8zd_",
        "target": "l3RG8HC59OtlzmzUJl9Pz",
        "id": "MQDXInY9-YI8MMzl9e0lM",
        "type": "deletable"
      },
      {
        "id": "dXLPF25_XWPGh0Ik_AQVm",
        "type": "deletable",
        "source": "l3RG8HC59OtlzmzUJl9Pz",
        "target": "RVfrwJZrwZLcFXKhZk5bV",
        "sourceHandle": "true"
      },
      {
        "id": "9ObGM6IqK7ei0wc8_r2kJ",
        "type": "deletable",
        "source": "l3RG8HC59OtlzmzUJl9Pz",
        "target": "eRkgas2fWWLX4GhnY_2Oj",
        "sourceHandle": "false"
      },
      {
        "source": "RVfrwJZrwZLcFXKhZk5bV",
        "target": "DtJ7scXmGEA101ommJOKc",
        "id": "_rL3QiFsCbf19-2g0uEbs",
        "type": "deletable"
      },
      {
        "source": "eRkgas2fWWLX4GhnY_2Oj",
        "target": "DtJ7scXmGEA101ommJOKc",
        "id": "K0e5OZrN3lTfuKiWpBwtd",
        "type": "deletable"
      }
    ],
    "nodes": [
      {
        "id": "rFM8ixvItA-i-bXblxZ_M",
        "type": "start",
        "position": {
          "x": 0,
          "y": 267
        },
        "data": {
          "label": "Start",
          "deletable": false
        }
      },
      {
        "id": "DtJ7scXmGEA101ommJOKc",
        "type": "end",
        "position": {
          "x": 2208,
          "y": 336
        },
        "data": {
          "label": "End",
          "deletable": true
        }
      },
      {
        "id": "5zne5FShP-jUCF1s7823h",
        "type": "tags",
        "position": {
          "x": 592,
          "y": -42
        },
        "data": {
          "tags": [
            "marketing",
            "lead"
          ]
        }
      },
      {
        "id": "nESW80juDe8b5bB_tbmSc",
        "type": "menu",
        "position": {
          "x": 192,
          "y": 96
        },
        "data": {
          "options": [
            {
              "id": "VDzoZ8Zy7ziN7Lk7-oCyr",
              "option": {
                "id": 0,
                "value": "Marketing"
              }
            },
            {
              "id": "oSWr4M-TyKs9xBYAFd1_R",
              "option": {
                "id": 1,
                "value": "Lead"
              }
            },
            {
              "id": "loCnMZeGPetaibXqZGyhp",
              "option": {
                "id": 2,
                "value": "Support"
              }
            }
          ],
          "question": "Please select an option:"
        }
      },
      {
        "id": "8p15_Y66luCEbFS_J7vcO",
        "type": "text-message",
        "position": {
          "x": 992,
          "y": -36
        },
        "data": {
          "message": "You choose Marketing."
        }
      },
      {
        "id": "9BP0qBxoQ70DKRq8gC1GX",
        "type": "tags",
        "position": {
          "x": 592,
          "y": 208
        },
        "data": {
          "tags": [
            "lead"
          ]
        }
      },
      {
        "id": "F1zbrjG2vqeDEFElu1478",
        "type": "text-message",
        "position": {
          "x": 992,
          "y": 208
        },
        "data": {
          "message": "You choose Lead."
        }
      },
      {
        "id": "Z-jW1DqKIqpw1SDVMnkra",
        "type": "tags",
        "position": {
          "x": 592,
          "y": 432
        },
        "data": {
          "tags": [
            "support"
          ]
        }
      },
      {
        "id": "ORKuDH3QHalm-h0zs8zd_",
        "type": "text-message",
        "position": {
          "x": 992,
          "y": 432
        },
        "data": {
          "message": "You choose Support."
        }
      },
      {
        "id": "l3RG8HC59OtlzmzUJl9Pz",
        "type": "branch",
        "data": {
          "variable": "Support",
          "valueType": "string",
          "comparisonType": "equals",
          "compareValue": "Support",
          "trueLabel": "True",
          "falseLabel": "False"
        },
        "position": {
          "x": 1408,
          "y": 112
        }
      },
      {
        "id": "RVfrwJZrwZLcFXKhZk5bV",
        "type": "text-message",
        "data": {
          "message": "Yay, Support!"
        },
        "position": {
          "x": 1824,
          "y": 176
        }
      },
      {
        "id": "eRkgas2fWWLX4GhnY_2Oj",
        "type": "text-message",
        "data": {
          "message": "Ahh no Support?"
        },
        "position": {
          "x": 1824,
          "y": 400
        }
      }
    ],
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
