import { BuilderNodeType } from "@/components/flow-builder/components/blocks/types";
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

interface State {
  nodes: Node[];
  edges: Edge[];
  nodePosition: XYPosition | null;
  sidebar: {
    active: SidebarPanel | "none";
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

export const useFlowStore = create<IFlowState>()((set, get) => ({
  tags: TAGS,
  workflow: {
    id: nanoid(),
    name: "",
    edges: [],
    nodes: [],
    nodePosition: null,
    sidebar: {
      active: "none",
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
    },
    sidebar: {
      setActivePanel: (panel: SidebarPanel | "none") =>
        set((state) => ({
          workflow: {
            ...state.workflow,
            sidebar: { ...state.workflow.sidebar, active: panel },
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
                active: SidebarPanel.NODE_PROPERTIES,
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
    nodes: {
      onNodesChange: (changes) => {
        set((state) =>
          produce(state, (draft) => {
            const updatedNodes = applyNodeChanges(changes, draft.workflow.nodes);
            
            draft.workflow.nodes = updatedNodes.map(updatedNode => {
              const existingNode = draft.workflow.nodes.find(n => n.id === updatedNode.id);
              
              if (existingNode) {
                return {
                  ...existingNode,
                  ...updatedNode,
                  data: {
                    ...existingNode.data,
                    ...updatedNode.data
                  }
                };
              }
              return updatedNode;
            });
          })
        );
      },
      setNodes: (nodes) => {
        const nodesWithData = nodes.map(node => {
          if (!node.data && node.type) {
            const defaultNode = createNodeWithDefaultData(node.type as BuilderNodeType, node);
            const resultNode = { ...node, data: defaultNode.data };
            return resultNode;
          }
          return node;
        });
        set(produce((state) => {
          state.workflow.nodes = nodesWithData;
        }));
      },
      deleteNode: (node: Node) => {
        set((state) => ({
          workflow: {
            ...state.workflow,
            nodes: state.workflow.nodes.filter((n) => n.id !== node.id),
          },
        }));
      },
      setNodePosition: (position: XYPosition | null) => {
        set((state) => ({
          workflow: {
            ...state.workflow,
            nodePosition: position,
          },
        }));
      },
    },
    edges: {
      onEdgesChange: (changes) => {
        set((state) =>
          produce(state, (draft) => {
            const updatedEdges = applyEdgeChanges(
              changes,
              draft.workflow.edges
            );

            draft.workflow.edges = updatedEdges;
          })
        );
      },
      onConnect: (connection) => {
        const edge = { ...connection, id: nanoid(), type: "deletable" } as Edge;
        set({
          workflow: {
            ...get().workflow,
            edges: addEdge(edge, get().workflow.edges),
          },
        });
      },
      setEdges: (edges) => {
        set({ workflow: { ...get().workflow, edges } });
      },
      deleteEdge: (edge: Edge) => {
        set((state) => ({
          workflow: {
            ...state.workflow,
            edges: state.workflow.edges.filter((e) => e.id !== edge.id),
          },
        }));
      },
    },
  },
}));
