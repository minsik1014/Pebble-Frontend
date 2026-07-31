import { useEffect, useRef, useState, type UIEvent, type WheelEvent } from "react";
import { CompletedCategoryGrid } from "@/features/mypage/components/CompletedCategoryGrid";
import { useCalendarLayoutContext } from "@/features/calendar/context/useCalendarLayoutContext";
import { MyPageStats } from "@/features/mypage/components/MyPageStats";
import { MyProfileSection } from "@/features/mypage/components/MyProfileSection";
import { MonthlyReportBanner } from "@/features/mypage/components/MonthlyReportBanner";
import { useNavigate } from "react-router-dom";
import { useProfileStore } from "@/features/mypage/store/useProfileStore";

const PROFILE_SCROLL_START = 80;
const COMPACT_PROFILE_SCROLL_TOP = 64;
const CATEGORY_HEADER_SCROLL_TOP = 324;
const WHEEL_GESTURE_LOCK_MS = 650;

export default function MyPage() {
  const navigate = useNavigate();
  const { isSidebarOpen } = useCalendarLayoutContext();
  const loadProfile = useProfileStore((state) => state.loadProfile);
  const isLoaded = useProfileStore((state) => state.isLoaded);
  const [isCompact, setIsCompact] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const isWheelGestureLockedRef = useRef(false);
  const wheelUnlockTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isLoaded) {
      void loadProfile();
    }
  }, [isLoaded, loadProfile]);

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const currentScrollTop = event.currentTarget.scrollTop;

    setScrollTop(currentScrollTop);

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

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    const scrollContainer = event.currentTarget;
    const currentScrollTop = scrollContainer.scrollTop;
    const isScrollingDown = event.deltaY > 0;
    const isScrollingUp = event.deltaY < 0;
    let targetScrollTop: number | null = null;

    if (isWheelGestureLockedRef.current) {
      event.preventDefault();
      return;
    }

    if (isScrollingDown) {
      if (currentScrollTop < COMPACT_PROFILE_SCROLL_TOP - 8) {
        targetScrollTop = COMPACT_PROFILE_SCROLL_TOP;
      } else if (currentScrollTop < CATEGORY_HEADER_SCROLL_TOP - 8) {
        targetScrollTop = CATEGORY_HEADER_SCROLL_TOP;
      }
    } else if (isScrollingUp) {
      if (
        currentScrollTop <= CATEGORY_HEADER_SCROLL_TOP + 8 &&
        currentScrollTop > COMPACT_PROFILE_SCROLL_TOP + 8
      ) {
        targetScrollTop = COMPACT_PROFILE_SCROLL_TOP;
      } else if (currentScrollTop <= COMPACT_PROFILE_SCROLL_TOP + 8) {
        targetScrollTop = 0;
      }
    }

    if (targetScrollTop === null) {
      return;
    }

    event.preventDefault();
    isWheelGestureLockedRef.current = true;
    scrollContainer.scrollTo({
      top: targetScrollTop,
      behavior: "smooth",
    });

    if (wheelUnlockTimerRef.current !== null) {
      window.clearTimeout(wheelUnlockTimerRef.current);
    }

    wheelUnlockTimerRef.current = window.setTimeout(() => {
      isWheelGestureLockedRef.current = false;
      wheelUnlockTimerRef.current = null;
    }, WHEEL_GESTURE_LOCK_MS);
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
        onWheel={handleWheel}
      >
        <div className="relative mx-auto flex w-full max-w-[780px] flex-col">
          <MyProfileSection
            isCompact={isCompact}
            scrollOffset={Math.max(0, scrollTop - PROFILE_SCROLL_START)}
            onEditProfile={() => navigate("/my/profile")}
          />
          <MonthlyReportBanner onOpenReport={() => navigate("/report/monthly")} />
          <MyPageStats isCompact={isCompact} />
          <CompletedCategoryGrid
            isCompact={isCompact}
            onSelectCategory={(categoryId) =>
              navigate(`/my/categories/${categoryId}`)
            }
          />
        </div>
      </div>
    </section>
  );
}
