import type { ReactNode } from 'react';

interface SettingsContentProps {
  children: ReactNode;
}

export function SettingsContent({
  children,
}: SettingsContentProps) {
  return (
    <div
      className="flex h-full w-full min-w-0 flex-col gap-token-m overflow-y-auto bg-transparent transition-all duration-300 custom-scrollbar"
    >
      {children}
    </div>
  );
}
