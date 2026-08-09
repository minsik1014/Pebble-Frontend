import type { ReactNode } from 'react';

import { ModalActionBar } from '@/components/ui/ModalActionBar';

type ScheduleFormModalFrameProps = {
  title: string;
  children: ReactNode;
  submitLabel: string;
  disabled: boolean;
  isBusy?: boolean;
  disabledReason?: string;
  onCancel: () => void;
  onSubmit: () => void | Promise<void>;
  onDelete?: () => void | Promise<void>;
  gapClassName?: string;
  titleClassName?: string;
};

export const ScheduleFormModalFrame = ({
  title,
  children,
  submitLabel,
  disabled,
  isBusy = false,
  disabledReason,
  onCancel,
  onSubmit,
  onDelete,
  gapClassName = 'gap-5',
  titleClassName = 'leading-[1.4]',
}: ScheduleFormModalFrameProps) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2C2C2C4D] backdrop-blur-[8px] dark:bg-[#171717B2]">
    <div
      className={[
        'relative flex w-[640px] flex-col',
        'rounded-[32px] border-[0.5px] border-transparent bg-fill-inverse p-8 shadow-[0px_0px_28px_0px_rgba(23,23,23,0.05)] dark:border-border-secondary',
        gapClassName,
      ].join(' ')}
    >
      <h2
        className={[
          'text-[24px] font-semibold tracking-[-0.24px] text-text-strong',
          titleClassName,
        ].join(' ')}
      >
        {title}
      </h2>

      {children}

      <div className="mt-4">
        <ModalActionBar
          submitLabel={submitLabel}
          disabled={disabled}
          isBusy={isBusy}
          disabledReason={disabledReason}
          onCancel={onCancel}
          onSubmit={onSubmit}
          onDelete={onDelete}
        />
      </div>
    </div>
  </div>
);
