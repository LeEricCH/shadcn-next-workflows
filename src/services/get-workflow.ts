export const getWorkflow = async (id: string) => {
  return {
    "id": "1",
    "name": "Initial Workflow",
    "edges": [
      {
        "source": "start-node",
        "sourceHandle": "source",
        "target": "ICw6B5V_4BZlAGwfl3ajo",
        "targetHandle": "target",
        "id": "DJdzsxUgC0KHbu7DMlcf2",
        "type": "deletable"
      },
      {
        "id": "AobP6-3JeSe6pOefMgqZg",
        "type": "deletable",
        "target": "zlCd-kL9h6-_aYsLt67Yx",
        "sourceHandle": "eddYx2qqTRSjnK4tTYi3k",
        "source": "ICw6B5V_4BZlAGwfl3ajo"
      },
      {
        "id": "XsCG0Z7uRN8h5JWJ3PHyk",
        "type": "deletable",
        "target": "QHANtCx_XsBnBeMxCGgFp",
        "sourceHandle": "body",
        "source": "zlCd-kL9h6-_aYsLt67Yx"
      },
      {
        "source": "zlCd-kL9h6-_aYsLt67Yx",
        "sourceHandle": "exit",
        "target": "end-node",
        "targetHandle": "target",
        "id": "jMaaBoMnDAXBNn0raw3O5",
        "type": "deletable"
      },
      {
        "id": "yf3XbepOwYurO19NDpAmE",
        "type": "deletable",
        "target": "SgJfbiM3QV_PeDZINTKWY",
        "sourceHandle": "9aSIpY8kjCIFJtIPvgFCN",
        "source": "ICw6B5V_4BZlAGwfl3ajo"
      },
      {
        "id": "ucKrgCpQfoVwxBodb9iWa",
        "type": "deletable",
        "target": "UnaEEkTyNpH8rknXJEIaw",
        "sourceHandle": "HTG9Nhm9OPHo9rkhmTlOM",
        "source": "ICw6B5V_4BZlAGwfl3ajo"
      },
      {
        "id": "QETq_adSiDZRXMALG9GnY",
        "type": "deletable",
        "target": "liV7jHZC83ocWkJNbTRv4",
        "sourceHandle": "source",
        "source": "UnaEEkTyNpH8rknXJEIaw"
      },
      {
        "source": "liV7jHZC83ocWkJNbTRv4",
        "sourceHandle": "true",
        "target": "end-node",
        "targetHandle": "target",
        "id": "q-kPWS5agtKo2gbeK5Tb0",
        "type": "deletable"
      },
      {
        "source": "SgJfbiM3QV_PeDZINTKWY",
        "sourceHandle": "source",
        "target": "end-node",
        "targetHandle": "target",
        "id": "ixivY5q6dqeS1ukUhrB9O",
        "type": "deletable"
      }
    ],
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
        },
        "measured": {
          "width": 96,
          "height": 42
        },
        "selected": false
      },
      {
        "id": "end-node",
        "type": "end",
        "position": {
          "x": 1632,
          "y": 128
        },
        "data": {
          "label": "End",
          "deletable": true
        },
        "measured": {
          "width": 91,
          "height": 42
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "ICw6B5V_4BZlAGwfl3ajo",
        "type": "menu",
        "position": {
          "x": 224,
          "y": -112
        },
        "selected": false,
        "data": {
          "question": "What is it you desire?",
          "options": [
            {
              "id": "HTG9Nhm9OPHo9rkhmTlOM",
              "option": {
                "id": 0,
                "value": "Money"
              }
            },
            {
              "id": "9aSIpY8kjCIFJtIPvgFCN",
              "option": {
                "id": 1,
                "value": "Fame"
              }
            },
            {
              "id": "eddYx2qqTRSjnK4tTYi3k",
              "option": {
                "id": 2,
                "value": "Patience"
              }
            }
          ]
        },
        "deletable": true,
        "draggable": true,
        "connectable": true,
        "measured": {
          "width": 288,
          "height": 308
        },
        "dragging": false
      },
      {
        "id": "zlCd-kL9h6-_aYsLt67Yx",
        "type": "loop",
        "position": {
          "x": 624,
          "y": 208
        },
        "selected": false,
        "data": {
          "type": "count",
          "maxIterations": 5
        },
        "deletable": true,
        "draggable": true,
        "connectable": true,
        "measured": {
          "width": 288,
          "height": 355
        },
        "dragging": false
      },
      {
        "id": "QHANtCx_XsBnBeMxCGgFp",
        "type": "delay",
        "position": {
          "x": 944,
          "y": 259
        },
        "selected": false,
        "data": {
          "duration": 69,
          "unit": "days"
        },
        "deletable": true,
        "draggable": true,
        "connectable": true,
        "measured": {
          "width": 288,
          "height": 180
        },
        "dragging": false
      },
      {
        "id": "SgJfbiM3QV_PeDZINTKWY",
        "type": "text-message",
        "position": {
          "x": 624,
          "y": 32
        },
        "selected": false,
        "data": {
          "message": "You are soooo cool!"
        },
        "deletable": true,
        "draggable": true,
        "connectable": true,
        "measured": {
          "width": 288,
          "height": 115
        },
        "dragging": false
      },
      {
        "id": "UnaEEkTyNpH8rknXJEIaw",
        "type": "tags",
        "position": {
          "x": 624,
          "y": -224
        },
        "selected": false,
        "data": {
          "tags": [
            "lead"
          ]
        },
        "deletable": true,
        "draggable": true,
        "connectable": true,
        "measured": {
          "width": 288,
          "height": 200
        },
        "dragging": false
      },
      {
        "id": "liV7jHZC83ocWkJNbTRv4",
        "type": "branch",
        "position": {
          "x": 1024,
          "y": -272
        },
        "selected": false,
        "data": {
          "variable": "Tags",
          "valueType": "string",
          "comparisonType": "equals",
          "compareValue": "Lead",
          "trueLabel": "True",
          "falseLabel": "False"
        },
        "deletable": true,
        "draggable": true,
        "connectable": true,
        "measured": {
          "width": 288,
          "height": 355
        },
        "dragging": false
      }
    ],
    "nodePosition": null,
    "validation": {
      "errors": [],
      "isValid": true,
      "lastValidated": 1736542471914
    },
    "sidebar": {
      "active": "none",
      "panels": {
        "nodeProperties": {
          "selectedNode": {
            "id": "liV7jHZC83ocWkJNbTRv4",
            "type": "branch",
            "data": {
              "variable": "",
              "valueType": "string",
              "comparisonType": "equals",
              "compareValue": "",
              "trueLabel": "True",
              "falseLabel": "False"
            }
          }
        }
      }
    }
  }
};
