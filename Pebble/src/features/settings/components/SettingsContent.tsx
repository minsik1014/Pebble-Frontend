import type { ReactNode } from "react";

interface SettingsContentProps {
    children:ReactNode;
}

export function SettingsContent ({children} : SettingsContentProps) {
    return (
        <main className="flex min-h-0 flex-1 flex-col gap-token-m overflow-y-auto bg-fill-surface p-token-m">
            {children}
        </main>
    );
}