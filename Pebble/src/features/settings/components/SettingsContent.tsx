import type { ReactNode } from 'react';

interface SettingsContentProps {
  children: ReactNode;
  isSidebarOpen: boolean;
}

export function SettingsContent({
  children,
  isSidebarOpen,
}: SettingsContentProps) {
  return (
    <main
      className={`flex h-[1000px] shrink-0 flex-col gap-token-m overflow-y-auto bg-transparent transition-all duration-300 custom-scrollbar ${
        isSidebarOpen ? "w-[924px]" : "w-[1316px]"
      }`}
    >
      {children}
    </main>
  );
}
