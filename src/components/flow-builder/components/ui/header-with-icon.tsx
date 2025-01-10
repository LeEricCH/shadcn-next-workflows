import { Icon } from "@iconify/react";

interface HeaderWithIconProps {
  icon: string;
  title: string;
}

export const HeaderWithIcon = ({ icon, title }: HeaderWithIconProps) => {
  return (
    <div className="flex items-center">
      <Icon icon={icon} className="h-6 w-6" />
      <div className="ml-3 flex items-center text-sm font-medium leading-none tracking-wide uppercase opacity-90">
        <span className="translate-y-px">{title}</span>
      </div>
    </div>
  );
};
