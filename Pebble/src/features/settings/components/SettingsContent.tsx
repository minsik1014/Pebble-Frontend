import type { ReactNode } from 'react';

interface SettingsContentProps {
  children: ReactNode;
}

export function SettingsContent({ children }: SettingsContentProps) {
  return (
    <main className="flex h-[1010px] w-[1288px] flex-col gap-token-m overflow-visible bg-transparent">
      {children}
    </main>
  );
}