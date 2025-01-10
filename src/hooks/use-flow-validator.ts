import {
  BuilderNode,
  BuilderNodeType,
} from "@/components/flow-builder/components/blocks/types";
import {
  type Edge,
  type Node,
  getConnectedEdges,
  useReactFlow,
} from "@xyflow/react";
import { useCallback, useState } from "react";

function findEdges(node: Node, connectedEdges: Edge[]) {
  const outgoingEdges = connectedEdges.filter(
    (edge) => edge.source === node.id
  );
  const incomingEdges = connectedEdges.filter(
    (edge) => edge.target === node.id
  );
  return { outgoingEdges, incomingEdges };
}

function checkFlowTerminalNode(
  outgoingEdges: Edge[],
  incomingEdges: Edge[],
  type: string
) {
  switch (type) {
    case BuilderNode.START:
      return outgoingEdges.length >= 1;
    case BuilderNode.END:
      return incomingEdges.length >= 1;
    default:
      return false;
  }
}

function checkLoneNode(
  outgoingEdges: Edge[],
  incomingEdges: Edge[],
  type: string,
  nodes: Node[],
  edges: Edge[],
  nodeId: string
) {
  console.log(`Checking node ${nodeId} of type ${type}:`);
  console.log('- Incoming edges:', incomingEdges);
  console.log('- Outgoing edges:', outgoingEdges);

  // Check if this node is connected to a loop body
  const isInLoopBody = incomingEdges.some(edge => {
    const sourceNode = nodes.find(n => n.id === edge.source);
    const isFromLoop = sourceNode?.type === BuilderNode.LOOP && edge.sourceHandle === 'body';
    console.log(`- Edge ${edge.id} from ${edge.source}: isFromLoop=${isFromLoop}`);
    return isFromLoop;
  });

  console.log('- Is in loop body:', isInLoopBody);

  switch (type) {
    case BuilderNode.START:
      // Start node only needs outgoing
      const isLoneStart = outgoingEdges.length === 0;
      console.log('- Is lone start:', isLoneStart);
      return isLoneStart;

    case BuilderNode.END:
      // End node only needs incoming
      const isLoneEnd = incomingEdges.length === 0;
      console.log('- Is lone end:', isLoneEnd);
      return isLoneEnd;

    case BuilderNode.LOOP:
      // Loop node needs incoming + exit connection
      const hasExitConnection = outgoingEdges.some(e => e.sourceHandle === 'exit');
      const isLoneLoop = !hasExitConnection || incomingEdges.length === 0;
      console.log('- Has exit connection:', hasExitConnection);
      console.log('- Is lone loop:', isLoneLoop);
      return isLoneLoop;

    default:
      if (isInLoopBody) {
        console.log('- Node is in loop body, skipping outgoing check');
        return false;
      }
      // All other nodes need both incoming and outgoing unless they're in a loop body
      const isLoneNode = incomingEdges.length === 0 || (!isInLoopBody && outgoingEdges.length === 0);
      console.log('- Is lone node:', isLoneNode);
      return isLoneNode;
  }
}

export function useFlowValidator(
  onValidate?: (isValid: boolean) => void
): [boolean, () => void] {
  const [isValidating, setIsValidating] = useState(false);
  const { getNodes, getEdges } = useReactFlow();

  const validate = useCallback(async () => {
    setIsValidating(true);

    await new Promise((resolve) => setTimeout(resolve, 300));

    const nodes = getNodes();
    const edges = getEdges();
    const connectedEdges = getConnectedEdges(nodes, edges);

    console.log('Validating flow:');
    console.log('- Nodes:', nodes);
    console.log('- Edges:', edges);

    let isStartConnected = false;
    let isEndConnected = false;
    const nodesWithEmptyTarget: Node[] = [];

    for (const node of nodes) {
      const { outgoingEdges, incomingEdges } = findEdges(node, connectedEdges);

      if (node.type === BuilderNode.START) {
        isStartConnected = outgoingEdges.length >= 1;
      } else if (node.type === BuilderNode.END) {
        isEndConnected = incomingEdges.length >= 1;
      }

      if (
        checkLoneNode(
          outgoingEdges,
          incomingEdges,
          node.type as BuilderNodeType,
          nodes,
          edges,
          node.id
        )
      ) {
        console.log(`Adding node ${node.id} to empty target list`);
        nodesWithEmptyTarget.push(node);
      }
    }

    const hasAnyLoneNode = nodesWithEmptyTarget.length > 0;
    const isFlowComplete =
      isStartConnected && isEndConnected && !hasAnyLoneNode;

    console.log('Validation results:');
    console.log('- Start connected:', isStartConnected);
    console.log('- End connected:', isEndConnected);
    console.log('- Nodes with empty target:', nodesWithEmptyTarget);
    console.log('- Flow complete:', isFlowComplete);

    onValidate?.(isFlowComplete);

    setIsValidating(false);
  }, [getNodes, getEdges, onValidate]);

  return [isValidating, validate];
}
