import { HeaderWithIcon } from "@/components/flow-builder/components/ui/header-with-icon";
import { Button } from "@/components/ui/button";
import { cn, truncateMiddle } from "@/lib/utils";

import { isEmpty } from "radash";

import type { ComponentPropsWithoutRef, MouseEvent } from "react";

type NodeListItemProps = Readonly<
  Omit<ComponentPropsWithoutRef<"button">, "onClick"> & {
    icon: string;
    title: string;
    id?: string;
    selected?: boolean;
    pseudoSelected?: boolean;
    "data-node-id"?: string;
    onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  }
>;

export function NodeListItem({
  id,
  title,
  className,
  icon,
  selected,
  pseudoSelected,
  "data-node-id": dataNodeId,
  onClick,
  ...props
}: NodeListItemProps) {
  return (
    <Button
      type="button"
      variant={selected ? "default" : "ghost"}
      className={cn(
        "h-8 select-none flex items-center justify-between gap-4 ",
        pseudoSelected && "bg-primary/10",
        className
      )}
      data-node-id={dataNodeId}
      onClick={onClick}
      {...props}
    >
      <HeaderWithIcon icon={icon} title={title} />

      {id && !isEmpty(id) && (
        <div className="rounded-md text-xs max-w-20 overflow-hidden bg-card px-2 py-1.5 text-2.5 text-card-foreground/80 font-semibold leading-none tracking-wide">
          {truncateMiddle(id, 4)}
        </div>
      )}
    </Button>
  );
}
