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
      className={`relative h-[1000px] shrink-0 overflow-visible bg-transparent transition-all duration-300 ${
        isSidebarOpen ? "w-[924px]" : "w-[1316px]"
      }`}
    >
      <div className="-m-[28px] flex h-[calc(100%+56px)] w-[calc(100%+56px)] flex-col gap-token-m overflow-y-auto p-[28px] custom-scrollbar">
        {children}
      </div>
    </main>
  );
}
