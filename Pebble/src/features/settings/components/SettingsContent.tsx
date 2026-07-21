import type { ReactNode } from 'react';

interface SettingsContentProps {
  children: ReactNode;
}

export function SettingsContent({ children }: SettingsContentProps) {
  return (
    <main className="flex h-[1000px] w-[1316px] flex-col gap-token-m overflow-y-auto bg-transparent custom-scrollbar">
      {children}
    </main>
  );
}
