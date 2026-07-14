import type { MainLayoutContext } from "@/components/layout/MainLayout";
import { SidebarToggleButton } from "@/features/milestone/components/SidebarToggleButton";
import { useOutletContext } from "react-router-dom";

export default function MyPage() {
  const { isSidebarOpen, onToggleSidebar } =
    useOutletContext<MainLayoutContext>();

  return (
    <section
      className={`relative h-[1000px] shrink-0 rounded-[20px] bg-fill-inverse shadow-shadow-m transition-all duration-300 ${
        isSidebarOpen ? "w-[924px]" : "w-[1316px]"
      }`}
    >
      <div className="absolute left-6 top-8">
        <SidebarToggleButton
          isSidebarOpen={isSidebarOpen}
          onToggle={onToggleSidebar}
        />
      </div>
    </section>
  );
}
