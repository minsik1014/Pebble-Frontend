import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { HomeOverviewCards } from "@/features/home/components/HomeOverviewCards";
import { HomeProfileStrip } from "@/features/home/components/HomeProfileStrip";
import { useHomeOverview } from "@/features/home/hooks/useHomeOverview";
import { useCalendarLayoutContext } from "@/features/calendar/context/useCalendarLayoutContext";
import { CalendarBoard } from "@/features/milestone/components/CalendarBoard";

const VIEWED_FRIEND_CALENDARS_STORAGE_KEY = "pebble:viewed-friend-calendars";

const getStoredViewedFriendIds = () => {
  if (typeof window === "undefined") {
    return new Set<number>();
  }

  try {
    const parsedValue = JSON.parse(
      window.sessionStorage.getItem(VIEWED_FRIEND_CALENDARS_STORAGE_KEY) ??
        "[]",
    );

    if (!Array.isArray(parsedValue)) {
      return new Set<number>();
    }

    return new Set(
      parsedValue.filter(
        (value): value is number =>
          typeof value === "number" && Number.isFinite(value),
      ),
    );
  } catch {
    return new Set<number>();
  }
};

const storeViewedFriendIds = (viewedFriendIds: Set<number>) => {
  window.sessionStorage.setItem(
    VIEWED_FRIEND_CALENDARS_STORAGE_KEY,
    JSON.stringify([...viewedFriendIds]),
  );
};

export const HomePage = (): JSX.Element => {
  const navigate = useNavigate();
  const [viewedFriendIds, setViewedFriendIds] = useState<Set<number>>(
    getStoredViewedFriendIds,
  );
  const {
    isSidebarOpen,
    currentYear,
    currentMonth,
    onChangeCalendarMonth,
    selectedCalendarDate,
    onSelectCalendarDate,
    onClearSelectedCalendarDate,
    categories,
    currentUserId,
    standaloneTasks,
    viewedUserId,
    isCalendarLoading,
    calendarErrorMessage,
    reloadCalendarData,
  } = useCalendarLayoutContext();
  const { profile, friends, pendingCount, activity } =
    useHomeOverview(viewedUserId);
  const selectedUserId = viewedUserId ?? currentUserId ?? profile.id;
  const isFriendCalendarView = viewedUserId !== null;
  const selectedFriend = isFriendCalendarView
    ? friends.find((friend) => friend.userId === viewedUserId)
    : null;
  const overviewProfile = isFriendCalendarView
    ? {
        nickname: selectedFriend?.nickname ?? "친구",
        bio: selectedFriend?.bio ?? "",
        imageUrl: selectedFriend?.profileImageUrl ?? null,
      }
    : {
        nickname: profile.nickname,
        bio: profile.bio,
        imageUrl: profile.imageUrl,
      };

  useEffect(() => {
    if (viewedUserId === null) {
      return;
    }

    setViewedFriendIds((previousIds) => {
      if (previousIds.has(viewedUserId)) {
        return previousIds;
      }

      const nextIds = new Set(previousIds).add(viewedUserId);

      storeViewedFriendIds(nextIds);
      return nextIds;
    });
  }, [viewedUserId]);

  const handleOpenFriendCalendar = (friendId: number) => {
    setViewedFriendIds((previousIds) => {
      if (previousIds.has(friendId)) {
        return previousIds;
      }

      const nextIds = new Set(previousIds).add(friendId);

      storeViewedFriendIds(nextIds);
      return nextIds;
    });
    navigate(`/?friendId=${friendId}`);
  };

  return (
    <section
      className={`flex w-full shrink-0 flex-col transition-all duration-300 md:h-[1000px] ${
        isSidebarOpen ? "md:w-[924px]" : "md:w-[1316px]"
      }`}
    >
      <HomeProfileStrip
        profile={profile}
        friends={friends}
        pendingCount={pendingCount}
        selectedUserId={selectedUserId}
        isMyCalendarSelected={!isFriendCalendarView}
        viewedFriendIds={viewedFriendIds}
        onOpenMyCalendar={() => navigate("/")}
        onOpenFriends={() => navigate("/friends")}
        onOpenFriendCalendar={(friend) => handleOpenFriendCalendar(friend.userId)}
      />

      <div className="mt-6">
        <HomeOverviewCards
          profile={overviewProfile}
          profileLabel={isFriendCalendarView ? "친구" : "나"}
          activityColor={activity.color}
          activities={activity.logs}
        />
      </div>

      <div className="mt-4">
        <CalendarBoard
          variant="home"
          isSidebarOpen={isSidebarOpen}
          categories={categories}
          standaloneTasks={standaloneTasks}
          currentYear={currentYear}
          currentMonth={currentMonth}
          onChangeCalendarMonth={onChangeCalendarMonth}
          selectedDate={selectedCalendarDate}
          onSelectDate={onSelectCalendarDate}
          onClearSelectedDate={onClearSelectedCalendarDate}
          isLoading={isCalendarLoading}
          errorMessage={calendarErrorMessage}
          emptyTitle={
            isFriendCalendarView
              ? "아직 친구가 일정을 생성하지 않았어요."
              : undefined
          }
          onRetry={reloadCalendarData}
        />
      </div>
    </section>
  );
};

export default HomePage;
