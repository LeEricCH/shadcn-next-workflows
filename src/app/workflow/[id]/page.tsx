import { getWorkflow } from "@/services/get-workflow";
import { FlowBuilderPage } from "../_components/flow-builder";
import { SidebarPanel } from "@/components/flow-builder/components/blocks/sidebar/constants/panels";

export default async function Workflow({ params }: { params: { id: string } }) {
  const workflow = await getWorkflow(params.id);
  const { id, name } = workflow;

  return <FlowBuilderPage workflow={{
    id,
    name,
    nodes: [],
    edges: [],
    nodePosition: null,
    validation: {
      errors: [],
      isValid: true,
      lastValidated: null
    },
    sidebar: {
      active: SidebarPanel.AVAILABLE_NODES,
      panels: {
        nodeProperties: {
          selectedNode: null
        }
      }
    }
  }} />
}
