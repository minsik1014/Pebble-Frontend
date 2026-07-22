import { type ReactNode } from "react";

import { ModalActionBar } from "@/components/ui/ModalActionBar";
import { ModalViewportPanel } from "@/components/ui/ModalViewportPanel";

type ScheduleFormModalFrameProps = {
  title: string;
  children: ReactNode;
  submitLabel: string;
  disabled: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  onDelete?: () => void;
  gapClassName?: string;
  titleClassName?: string;
};

export const ScheduleFormModalFrame = ({
  title,
  children,
  submitLabel,
  disabled,
  onCancel,
  onSubmit,
  onDelete,
  gapClassName = "gap-5",
  titleClassName = "leading-[1.4]",
}: ScheduleFormModalFrameProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-fill-shadow">
      <ModalViewportPanel
        className={`relative flex w-[640px] flex-col ${gapClassName} rounded-[32px] bg-fill-inverse p-8 shadow-shadow-m`}
      >
        <h2
          className={`text-[24px] font-semibold text-text-strong tracking-[-0.24px] ${titleClassName}`}
        >
          {title}
        </h2>

        {children}

        <div className="mt-4">
          <ModalActionBar
            submitLabel={submitLabel}
            disabled={disabled}
            onCancel={onCancel}
            onSubmit={onSubmit}
            onDelete={onDelete}
          />
        </div>
      </ModalViewportPanel>
    </div>
  );
};
