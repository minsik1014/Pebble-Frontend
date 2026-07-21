import { useState, type UIEvent } from "react";
import type { MainLayoutContext } from "@/components/layout/MainLayout";
import { CompletedCategoryGrid } from "@/features/mypage/components/CompletedCategoryGrid";
import { MyPageStats } from "@/features/mypage/components/MyPageStats";
import { MyProfileSection } from "@/features/mypage/components/MyProfileSection";
import { useOutletContext } from "react-router-dom";

export default function MyPage() {
  const { isSidebarOpen } = useOutletContext<MainLayoutContext>();
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
      <div
        className="h-full overflow-y-auto px-[72px] pb-12 [overflow-anchor:none] custom-scrollbar"
        onScroll={handleScroll}
      >
        <div className="relative mx-auto flex w-full max-w-[780px] flex-col">
          <MyProfileSection isCompact={isCompact} />
          <MyPageStats isCompact={isCompact} />
          <CompletedCategoryGrid isCompact={isCompact} />
        </div>
      </div>
    </section>
  );
}
