import type { ReactNode } from 'react';

type ModalBackdropProps = {
  children: ReactNode;
  className?: string;
  layerClassName?: 'z-50' | 'z-[60]' | 'z-[100]';
};

export const ModalBackdrop = ({
  children,
  className = '',
  layerClassName = 'z-50',
}: ModalBackdropProps) => (
  <div
    className={[
      'fixed inset-0 flex items-center justify-center',
      'bg-[#2C2C2C4D] backdrop-blur-[8px] dark:bg-[#171717B2]',
      layerClassName,
      className,
    ].join(' ')}
  >
    {children}
  </div>
);
