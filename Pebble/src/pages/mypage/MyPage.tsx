import { useEffect, useState, type UIEvent } from "react";
import { CompletedCategoryGrid } from "@/features/mypage/components/CompletedCategoryGrid";
import { useCalendarLayoutContext } from "@/features/calendar/context/useCalendarLayoutContext";
import { MyPageStats } from "@/features/mypage/components/MyPageStats";
import { MyProfileSection } from "@/features/mypage/components/MyProfileSection";
import { MonthlyReportBanner } from "@/features/mypage/components/MonthlyReportBanner";
import { useNavigate } from "react-router-dom";
import { useProfileStore } from "@/features/mypage/store/useProfileStore";
import { getCompletedOwnedCategories } from "@/features/category/api/categoryApi";
import type { Category } from "@/types";

export default function MyPage() {
  const navigate = useNavigate();
  const { isSidebarOpen } = useCalendarLayoutContext();
  const loadProfile = useProfileStore((state) => state.loadProfile);
  const isLoaded = useProfileStore((state) => state.isLoaded);
  const [isCompact, setIsCompact] = useState(false);
  const [completedCategories, setCompletedCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (!isLoaded) {
      void loadProfile();
    }
  }, [isLoaded, loadProfile]);

  useEffect(() => {
    let isActive = true;

    void getCompletedOwnedCategories()
      .then((categories) => {
        if (isActive) {
          setCompletedCategories(categories);
        }
      })
      .catch(() => {
        if (isActive) {
          setCompletedCategories([]);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const currentScrollTop = event.currentTarget.scrollTop;

    setIsCompact((previous) => {
      if (!previous && currentScrollTop >= 48) {
        return true;
      }

      if (previous && currentScrollTop <= 16) {
        return false;
      }

      return previous;
    });
  };

  return (
    <section
      className={`relative h-[1000px] shrink-0 overflow-hidden rounded-[20px] bg-fill-inverse shadow-shadow-m transition-all duration-300 ${
        isSidebarOpen ? "w-[924px]" : "w-[1316px]"
      }`}
    >
      <div
        className="h-full overflow-y-auto px-[72px] pb-12 [overflow-anchor:none] custom-scrollbar"
        onScroll={handleScroll}
      >
        <div className="relative mx-auto flex w-full max-w-[780px] flex-col">
          <MyProfileSection
            isCompact={isCompact}
            completedCategoryCount={completedCategories.length}
            onEditProfile={() => navigate("/my/profile")}
          />
          <MonthlyReportBanner onOpenReport={() => navigate("/report/monthly")} />
          <MyPageStats
            isCompact={isCompact}
            completedCategoryCount={completedCategories.length}
          />
          <CompletedCategoryGrid
            isCompact={isCompact}
            categories={completedCategories}
            onSelectCategory={(categoryId) =>
              navigate(`/?category=${categoryId}&from=my`)
            }
          />
        </div>
      </div>
    </section>
  );
}
