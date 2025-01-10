import { nanoid } from "nanoid";

import type { Node } from "@xyflow/react";
import { BuilderNode, BuilderNodeType } from "./types";
import { NODES } from ".";

export function getNodeDetail(nodeType: BuilderNodeType | string | undefined) {
  const node = NODES.find((node) => node.type === nodeType);
  if (!node) throw new Error(`Node type "${nodeType}" not found`);

  return node.detail;
}

export function createNodeData<T extends BuilderNodeType>(
  type: T,
  data: unknown
) {
  return {
    id: nanoid(),
    type,
    data,
  };
}

export function createNodeWithDefaultData(
  type: BuilderNodeType,
  nodeData?: Partial<Node>
) {
  const node = NODES.find((node) => node.type === type);
  if (!node?.defaultData) {
    throw new Error(`No default data found for node type "${type}"`);
  }

  // Create the base node structure
  const newNode = {
    id: nanoid(),
    type,
    position: nodeData?.position || { x: 0, y: 0 },
    selected: nodeData?.selected || false,
    data: nodeData?.data ? { ...node.defaultData, ...nodeData.data } : { ...node.defaultData },
    deletable: nodeData?.deletable ?? true,
    draggable: nodeData?.draggable ?? true,
    connectable: nodeData?.connectable ?? true,
  };

  return newNode;
}

export function createNodeWithData<T>(
  type: BuilderNode,
  data: T,
  node: Partial<Node> = {}
) {
  return Object.assign(createNodeData(type, data), node) as Node;
}
