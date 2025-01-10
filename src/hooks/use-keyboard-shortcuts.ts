import { useCallback } from "react";
import { Node, useReactFlow } from "@xyflow/react";
import { useFlowStore } from "@/stores/flow-store";
import { useShallow } from "zustand/shallow";
import { BuilderNodeType } from "@/components/flow-builder/components/blocks/types";

interface UseKeyboardShortcutsProps {
  selectedNode: Node | null;
  copiedNode: Node | null;
  onCopy?: () => void;
  onPaste?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onSelectAll?: () => void;
}

export function useKeyboardShortcuts({
  selectedNode,
  copiedNode,
  onCopy,
  onPaste,
  onDuplicate,
  onDelete,
  onSelectAll,
}: UseKeyboardShortcutsProps) {
  const { getNodes } = useReactFlow();

  const isTargetInput = useCallback((event: KeyboardEvent) => {
    const target = event.target as HTMLElement;
    
    // Always allow input if we're in an input-like element
    if (
      target.isContentEditable ||
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.tagName === 'SELECT' ||
      target.closest('input') ||
      target.closest('textarea') ||
      target.closest('select') ||
      target.closest('[data-property-panel]')
    ) {
      return true;
    }

    return false;
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // If we're in any form control or editable element, don't handle shortcuts
    if (isTargetInput(event)) {
      return;
    }

    if (event.key === 'Delete') {
      onDelete?.();
    }
    
    if (event.key === 'a' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      if (getNodes().length > 2) {
        onSelectAll?.();
      }
    }

    if (event.key === 'c' && (event.ctrlKey || event.metaKey) && selectedNode) {
      event.preventDefault();
      onCopy?.();
    }

    if (event.key === 'd' && (event.ctrlKey || event.metaKey) && selectedNode) {
      event.preventDefault();
      onDuplicate?.();
    }

    if (event.key === 'v' && (event.ctrlKey || event.metaKey) && copiedNode) {
      event.preventDefault();
      onPaste?.();
    }
  }, [
    isTargetInput,
    selectedNode,
    copiedNode,
    getNodes,
    onCopy,
    onPaste,
    onDuplicate,
    onDelete,
    onSelectAll,
  ]);

  return { handleKeyDown };
} 