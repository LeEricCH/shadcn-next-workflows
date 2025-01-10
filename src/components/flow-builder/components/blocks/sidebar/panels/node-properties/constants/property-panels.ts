import { BuilderNode } from "@/components/flow-builder/components/blocks/types";
import BranchNodePropertyPanel from "../property-panels/branch-property-panel";
import MenuNodePropertyPanel from "../property-panels/menu-property-panel";
import TextMessageNodePropertyPanel from "../property-panels/text-message-property-panel";
import TagsNodePropertyPanel from "../property-panels/tags-property";
import DelayNodePropertyPanel from "../property-panels/delay-property-panel";
import LoopNodePropertyPanel from "../property-panels/loop-property-panel";

export const PROPERTY_PANELS = {
  [BuilderNode.BRANCH]: BranchNodePropertyPanel,
  [BuilderNode.MENU]: MenuNodePropertyPanel,
  [BuilderNode.TEXT_MESSAGE]: TextMessageNodePropertyPanel,
  [BuilderNode.TAGS]: TagsNodePropertyPanel,
  [BuilderNode.DELAY]: DelayNodePropertyPanel,
  [BuilderNode.LOOP]: LoopNodePropertyPanel,
};
