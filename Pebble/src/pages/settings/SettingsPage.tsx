import { GlobalNavigationBar } from "@/components/layout/GlobalNavigationBar";
import { SettingsView } from "@/features/settings/components/SettingsView";

export default function SettingsPage() {
    return (
        <div className="flex h-dvh min-w-0 bg-fill-surface">
            <GlobalNavigationBar />
            <SettingsView />
        </div>
    )
}