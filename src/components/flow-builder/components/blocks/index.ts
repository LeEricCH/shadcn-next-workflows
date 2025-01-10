import { type NodeTypes } from "@xyflow/react";
import { BuilderNode } from "./types";
import { metadata as startNodeMetadata } from "./nodes/start.node";
import { metadata as endNodeMetadata } from "./nodes/end.node";
import { metadata as menuNodeMetadata } from "./nodes/menu-node/menu.node";
import { metadata as branchNodeMetadata } from "./nodes/branch-node/branch.node";
import { metadata as textMessageNodeMetadata } from "./nodes/text-message-node/text-message.node";
import { metadata as tagsNodeMetadata } from "./nodes/tags-node/tags.node";
import { metadata as delayNodeMetadata } from "./nodes/delay-node/delay.node";
import { metadata as loopNodeMetadata } from "./nodes/loop-node/loop.node";

export const NODES = [
  startNodeMetadata,
  endNodeMetadata,
  menuNodeMetadata,
  branchNodeMetadata,
  textMessageNodeMetadata,
  tagsNodeMetadata,
  delayNodeMetadata,
  loopNodeMetadata,
];

export const NODE_TYPES: NodeTypes = {
  [BuilderNode.START]: startNodeMetadata.node,
  [BuilderNode.END]: endNodeMetadata.node,
  [BuilderNode.MENU]: menuNodeMetadata.node,
  [BuilderNode.BRANCH]: branchNodeMetadata.node,
  [BuilderNode.TEXT_MESSAGE]: textMessageNodeMetadata.node,
  [BuilderNode.TAGS]: tagsNodeMetadata.node,
  [BuilderNode.DELAY]: delayNodeMetadata.node,
  [BuilderNode.LOOP]: loopNodeMetadata.node,
};


export const NODES_METADATA = NODES.reduce((acc, current) => {
  acc[current.type] = {
    ...current,
    __details: { type: current.type, ...current.detail },
  };
  return acc;
}, {} as Record<string, any>);


export const AVAILABLE_NODES = NODES.filter(
  (node) => node.available === undefined || node.available
).map((node) => ({
  type: node.type,
  icon: node.detail.icon,
  title: node.detail.title,
  description: node.detail.description,
  gradientColor: node.detail.gradientColor,
}));
