import { useState, type UIEvent } from "react";
import type { MainLayoutContext } from "@/components/layout/MainLayout";
import { SidebarToggleButton } from "@/features/milestone/components/SidebarToggleButton";
import { CompletedCategoryGrid } from "@/features/mypage/components/CompletedCategoryGrid";
import { MyPageStats } from "@/features/mypage/components/MyPageStats";
import { MyProfileSection } from "@/features/mypage/components/MyProfileSection";
import { useNavigate, useOutletContext } from "react-router-dom";

export default function MyPage() {
  const navigate = useNavigate();
  const { isSidebarOpen, onToggleSidebar } =
    useOutletContext<MainLayoutContext>();
  const [isCompact, setIsCompact] = useState(false);

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const scrollTop = event.currentTarget.scrollTop;

    setIsCompact((previous) => {
      if (!previous && scrollTop >= 48) {
        return true;
      }

      if (previous && scrollTop <= 16) {
        return false;
      }

      return previous;
    });
  };

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

      <div
        className="h-full overflow-y-auto px-[72px] pb-12 [overflow-anchor:none] custom-scrollbar"
        onScroll={handleScroll}
      >
        <div className="relative mx-auto flex w-full max-w-[780px] flex-col">
          <MyProfileSection
            isCompact={isCompact}
            onEditProfile={() => navigate("/my/profile")}
          />
          <MyPageStats isCompact={isCompact} />
          <CompletedCategoryGrid isCompact={isCompact} />
        </div>
      </div>
    </section>
  );
}
