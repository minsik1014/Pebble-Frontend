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
      className={`relative z-10 h-[1000px] shrink-0 overflow-visible bg-transparent transition-all duration-300 ${
        isSidebarOpen ? "w-[924px]" : "w-[1316px]"
      }`}
    >
      <div className="-ml-[28px] flex h-full w-[calc(100%+56px)] flex-col gap-token-m overflow-y-auto px-[28px] custom-scrollbar">
        {children}
      </div>
    </main>
  );
}
