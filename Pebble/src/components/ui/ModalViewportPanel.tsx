import {
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
} from "react";

import { useModalViewportScale } from "@/hooks/useModalViewportScale";

type ModalViewportPanelProps<T extends ElementType> = {
  as?: T;
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

export const ModalViewportPanel = <T extends ElementType = "div">({
  as,
  className = "",
  style,
  children,
  ...props
}: ModalViewportPanelProps<T>): JSX.Element => {
  const scale = useModalViewportScale();
  const Component = as ?? "div";

  return (
    <Component
      className={["origin-center", className].filter(Boolean).join(" ")}
      style={{ ...style, transform: `scale(${scale})` }}
      {...props}
    >
      {children}
    </Component>
  );
};
