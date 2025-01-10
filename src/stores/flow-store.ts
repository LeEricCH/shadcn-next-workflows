import { BuilderNodeType, BuilderNode } from "@/components/flow-builder/components/blocks/types";
import { createNodeWithDefaultData } from "@/components/flow-builder/components/blocks/utils";
import { nanoid } from "nanoid";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  type XYPosition,
} from "@xyflow/react";
import { create } from "zustand";
import { Tag } from "@/types/tag";
import { produce } from "immer";
import { SidebarPanel } from "@/components/flow-builder/components/blocks/sidebar/constants/panels";
import { subscribeWithSelector } from 'zustand/middleware';

// Create a debounced function
const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

export interface ValidationError {
  nodeId: string;
  type: string;
  message: string;
  severity: 'error' | 'warning';
}

interface State {
  nodes: Node[];
  edges: Edge[];
  nodePosition: XYPosition | null;
  validation: {
    errors: ValidationError[];
    isValid: boolean;
    lastValidated: number | null;
  };
  sidebar: {
    activePanel: SidebarPanel | "none";
    panels: {
      nodeProperties: {
        selectedNode: { id: string; type: BuilderNodeType } | null | undefined;
      };
    };
  };
}

interface Actions {
  actions: {
    saveWorkflow: () => {
      id: string;
      name: string;
      nodes: Node[];
      edges: Edge[];
    };
    setWorkflow: (workflow: IFlowState["workflow"]) => void;
    nodes: {
      onNodesChange: (changes: NodeChange[]) => void;
      setNodes: (nodes: Node[]) => void;
      deleteNode: (node: Node) => void;
      setNodePosition: (position: XYPosition | null) => void;
    };
    edges: {
      onEdgesChange: (changes: EdgeChange[]) => void;
      onConnect: (connection: Connection) => void;
      setEdges: (edges: Edge[]) => void;
      deleteEdge: (edge: Edge) => void;
    };
    validation: {
      setValidationErrors: (errors: ValidationError[]) => void;
      clearValidationErrors: () => void;
      validateNode: (nodeId: string) => ValidationError[];
    };
    sidebar: {
      setActivePanel: (panel: SidebarPanel | "none") => void;
      showNodePropertiesOf: (node: {
        id: string;
        type: BuilderNodeType;
      }) => void;
      panels: {
        nodeProperties: {
          setSelectedNode: (
            node: { id: string; type: BuilderNodeType } | undefined | null
          ) => void;
        };
        tags: {
          setTags: (tags: Tag[]) => void;
          createTag: (tag: Tag) => void;
          deleteTag: (tag: Tag) => void;
          updateTag: (tag: Tag, newTag: Tag) => void;
        };
      };
    };
  };
}

export interface IFlowState {
  tags: Tag[];
  workflow: {
    id: string;
    name: string;
  } & State;
  actions: Actions["actions"];
}

const TAGS = [
  {
    value: "marketing",
    label: "Marketing",
    color: "#ef4444",
  },
  {
    value: "support",
    label: "Support",
    color: "#ef4444",
  },
  {
    value: "lead",
    label: "Lead",
    color: "#eab308",
  },
  {
    value: "new",
    label: "New",
    color: "#22c55e",
  },
] satisfies Tag[];

const validateFlow = (state: IFlowState): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  // Validate each node
  state.workflow.nodes.forEach((node: Node) => {
    if (!node.id) return;
    
    // Check for lonely nodes (except start node)
    if (node.type !== BuilderNode.START) {
      const hasIncoming = state.workflow.edges.some((e) => e.target === node.id);
      if (!hasIncoming) {
        errors.push({
          nodeId: node.id,
          type: 'connection',
          message: 'Node has no incoming connections',
          severity: 'error',
        });
      }
    }
    
    // Check for nodes without outgoing connections based on type
    if (node.type === BuilderNode.LOOP) {
      // For loop nodes, check exit connection
      const hasExitConnection = state.workflow.edges.some((e) => e.source === node.id && e.sourceHandle === 'exit');
      if (!hasExitConnection) {
        errors.push({
          nodeId: node.id,
          type: 'connection',
          message: 'Loop node must have an exit connection',
          severity: 'error',
        });
      }
    } else if (node.type !== BuilderNode.END) {
      // Check if this node is in a loop body
      const isInLoopBody = state.workflow.edges.some(e => {
        const sourceNode = state.workflow.nodes.find(n => n.id === e.source);
        return sourceNode?.type === BuilderNode.LOOP && e.sourceHandle === 'body' && e.target === node.id;
      });

      // Only check for outgoing connections if not in a loop body
      if (!isInLoopBody) {
        const hasOutgoing = state.workflow.edges.some((e) => e.source === node.id);
        if (!hasOutgoing) {
          errors.push({
            nodeId: node.id,
            type: 'connection',
            message: 'Node has no outgoing connections',
            severity: 'error',
          });
        }
      }
    }
  });

  // Flow-level validation
  const startNode = state.workflow.nodes.find((n: Node) => n.type === BuilderNode.START);
  const endNode = state.workflow.nodes.find((n: Node) => n.type === BuilderNode.END);

  if (!startNode || !endNode) {
    errors.push({
      nodeId: 'flow',
      type: 'flow',
      message: 'Flow must have both start and end nodes',
      severity: 'error'
    });
  }

  return errors;
};

export const useFlowStore = create<IFlowState>()(
  subscribeWithSelector((set, get) => {
    let validationTimeout: NodeJS.Timeout;

    const validateAndUpdate = debounce(() => {
      const state = get();
      const errors = validateFlow(state);
      
      set(produce((state) => {
        state.workflow.validation = {
          errors,
          isValid: errors.length === 0,
          lastValidated: Date.now(),
        };
      }));
    }, 500);

    return {
      tags: TAGS,
      workflow: {
        id: nanoid(),
        name: "",
        edges: [],
        nodes: [],
        nodePosition: null,
        validation: {
          errors: [],
          isValid: true,
          lastValidated: null,
        },
        sidebar: {
          activePanel: "none",
          panels: {
            nodeProperties: {
              selectedNode: null,
            },
          },
        },
      },
      actions: {
        saveWorkflow: () => {
          const { workflow } = get();
          set({ workflow });
          return workflow;
        },
        setWorkflow: (workflow: IFlowState["workflow"]) => {
          set((state) => ({
            workflow: {
              ...state.workflow,
              ...workflow,
            },
          }));
          validateAndUpdate();
        },
        nodes: {
          onNodesChange: (changes: NodeChange[]) => {
            set(produce((state) => {
              const updatedNodes = applyNodeChanges(changes, state.workflow.nodes);
              state.workflow.nodes = updatedNodes;
            }));
            validateAndUpdate();
          },
          setNodes: (nodes: Node[]) => {
            const nodesWithData = nodes.map(node => {
              if (!node.data && node.type) {
                const defaultNode = createNodeWithDefaultData(node.type as BuilderNodeType, node);
                return { ...node, data: defaultNode.data };
              }
              return node;
            });
            
            set(produce((state) => {
              state.workflow.nodes = nodesWithData;
            }));
            validateAndUpdate();
          },
          deleteNode: (node: Node) => {
            set(produce((state) => {
              state.workflow.nodes = state.workflow.nodes.filter((n: Node) => n.id !== node.id);
            }));
            validateAndUpdate();
          },
          setNodePosition: (position: XYPosition | null) => {
            set(produce((state) => {
              state.workflow.nodePosition = position;
            }));
          },
        },
        edges: {
          onEdgesChange: (changes: EdgeChange[]) => {
            set(produce((state) => {
              state.workflow.edges = applyEdgeChanges(changes, state.workflow.edges);
            }));
            validateAndUpdate();
          },
          onConnect: (connection: Connection) => {
            const edge = { ...connection, id: nanoid(), type: "deletable" } as Edge;
            set(produce((state) => {
              state.workflow.edges = addEdge(edge, state.workflow.edges);
            }));
            validateAndUpdate();
          },
          setEdges: (edges: Edge[]) => {
            set(produce((state) => {
              state.workflow.edges = edges;
            }));
            validateAndUpdate();
          },
          deleteEdge: (edge: Edge) => {
            set(produce((state) => {
              state.workflow.edges = state.workflow.edges.filter((e: Edge) => e.id !== edge.id);
            }));
            validateAndUpdate();
          },
        },
        validation: {
          setValidationErrors: (errors: ValidationError[]) => {
            set(produce((state) => {
              state.workflow.validation = {
                errors,
                isValid: errors.length === 0,
                lastValidated: Date.now(),
              };
            }));
          },
          clearValidationErrors: () => {
            set(produce((state) => {
              state.workflow.validation = {
                errors: [],
                isValid: true,
                lastValidated: null,
              };
            }));
          },
          validateNode: (nodeId: string) => {
            const state = get();
            const node = state.workflow.nodes.find((n: Node) => n.id === nodeId);
            if (!node) return [];
            
            const errors: ValidationError[] = [];
            
            // Check incoming connections for all nodes except START
            if (node.type !== BuilderNode.START) {
              const hasIncoming = state.workflow.edges.some((e) => e.target === node.id);
              if (!hasIncoming) {
                errors.push({
                  nodeId: node.id,
                  type: 'connection',
                  message: 'Node has no incoming connections',
                  severity: 'error',
                });
              }
            }
            
            // Check outgoing connections based on node type
            if (node.type === BuilderNode.LOOP) {
              // For loop nodes, check both body and exit connections
              const hasBodyConnection = state.workflow.edges.some((e) => e.source === node.id && e.sourceHandle === 'body');
              const hasExitConnection = state.workflow.edges.some((e) => e.source === node.id && e.sourceHandle === 'exit');

              if (!hasExitConnection) {
                errors.push({
                  nodeId: node.id,
                  type: 'connection',
                  message: 'Loop node must have an exit connection',
                  severity: 'error',
                });
              }

              if (!hasBodyConnection) {
                errors.push({
                  nodeId: node.id,
                  type: 'connection',
                  message: 'Loop node must have a body connection',
                  severity: 'error',
                });
              }
            } else if (node.type !== BuilderNode.END) {
              // For non-loop, non-end nodes, check for any outgoing connection
              const hasOutgoing = state.workflow.edges.some((e) => e.source === node.id);
              if (!hasOutgoing) {
                errors.push({
                  nodeId: node.id,
                  type: 'connection',
                  message: 'Node has no outgoing connections',
                  severity: 'error',
                });
              }
            }
            
            return errors;
          }
        },
        sidebar: {
          setActivePanel: (panel: SidebarPanel | "none") =>
            set((state) => ({
              workflow: {
                ...state.workflow,
                sidebar: { ...state.workflow.sidebar, activePanel: panel },
              },
            })),
          showNodePropertiesOf: (node: { id: string; type: BuilderNodeType }) => {
            set((state) => {
              // Find the actual node with data from the workflow nodes
              const actualNode = state.workflow.nodes.find(n => n.id === node.id);
              
              return {
                workflow: {
                  ...state.workflow,
                  sidebar: {
                    ...state.workflow.sidebar,
                    activePanel: SidebarPanel.NODE_PROPERTIES,
                    panels: {
                      ...state.workflow.sidebar.panels,
                      nodeProperties: {
                        ...state.workflow.sidebar.panels.nodeProperties,
                        selectedNode: actualNode ? {
                          id: actualNode.id,
                          type: actualNode.type as BuilderNodeType,
                          data: actualNode.data
                        } : null,
                      },
                    },
                  },
                },
              };
            });
          },
          panels: {
            nodeProperties: {
              setSelectedNode: (
                node: { id: string; type: BuilderNodeType } | undefined | null
              ) =>
                set((state) => ({
                  workflow: {
                    ...state.workflow,
                    sidebar: {
                      ...state.workflow.sidebar,
                      panels: {
                        ...state.workflow.sidebar.panels,
                        nodeProperties: {
                          ...state.workflow.sidebar.panels.nodeProperties,
                          selectedNode: node,
                        },
                      },
                    },
                  },
                })),
            },
            tags: {
              setTags: (tags: Tag[]) => set({ tags }),
              createTag: (tag: Tag) =>
                set((state) => ({
                  tags: [...state.tags, tag],
                })),
              updateTag: (tag: Tag, newTag: Tag) =>
                set((state) => ({
                  tags: state.tags.map((f) => (f.value === tag.value ? newTag : f)),
                })),
              deleteTag: (tag: Tag) =>
                set((state) => ({
                  tags: state.tags.filter((f) => f.value !== tag.value),
                })),
            },
          },
        },
      }
    };
  })
);
