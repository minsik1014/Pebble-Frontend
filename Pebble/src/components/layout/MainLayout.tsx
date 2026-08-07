import { useEffect, useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { GlobalNavigationBar } from "@/components/layout/GlobalNavigationBar";
import { CalendarLayoutProvider } from "@/features/calendar/context/CalendarLayoutProvider";
import { useCalendarLayoutContext } from "@/features/calendar/context/useCalendarLayoutContext";
import { CalendarSidebar } from "@/features/calendar/components/sidebar/CalendarSidebar";
import { SidebarDivider } from "@/features/calendar/components/sidebar/SidebarDivider";
import { CalendarStatusView } from "@/features/calendar/components/CalendarStatusView";
import { getScheduleDisplayLabels } from "@/utils/scheduleDate";
import type { Category, ScheduleItem } from "@/types";

const ORIGINAL_WIDTH = 1416;
const ORIGINAL_HEIGHT = 1000;
const SAFE_MARGIN = 24;

const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;

const getMinimumScale = (viewportWidth: number) =>
  viewportWidth < TABLET_BREAKPOINT ? 0.42 : 0.5;

const isScheduleInMonth = (
  item: ScheduleItem,
  year: number,
  month: number,
) => {
  const monthKey = `${year}-${String(month).padStart(2, "0")}`;

  if (item.dates?.some((date) => date.startsWith(monthKey))) {
    return true;
  }

  if (item.start.startsWith(monthKey) || item.end?.startsWith(monthKey)) {
    return true;
  }

  if (!item.end) {
    return false;
  }

  return item.start <= `${monthKey}-31` && item.end >= `${monthKey}-01`;
};

const getVisibleCategoryItems = (
  category: Category,
  year: number,
  month: number,
) => ({
  milestones: category.items.filter((item) =>
    isScheduleInMonth(item, year, month),
  ),
  tasks: (category.tasks ?? []).filter((task) =>
    isScheduleInMonth(task, year, month),
  ),
});

type MobileScheduleRowProps = {
  item: ScheduleItem;
  accentColor: string;
  backgroundColor?: string;
};

type MobileRouteNavProps = {
  activePath: string;
};

const MobileRouteNav = ({ activePath }: MobileRouteNavProps): JSX.Element => {
  const navigate = useNavigate();

  const getButtonClassName = (isActive: boolean) =>
    isActive
      ? "rounded-token-s bg-fill-primary py-3 text-body-02-sb text-text-onFill"
      : "rounded-token-s bg-fill-inverse py-3 text-body-02-sb text-text-strong shadow-shadow-s";

  return (
    <nav className="grid grid-cols-3 gap-2">
      <button
        type="button"
        className={getButtonClassName(activePath === "/calendar")}
        onClick={() => navigate("/calendar")}
      >
        캘린더
      </button>
      <button
        type="button"
        className={getButtonClassName(activePath.startsWith("/my"))}
        onClick={() => navigate("/my")}
      >
        마이
      </button>
      <button
        type="button"
        className={getButtonClassName(activePath.startsWith("/settings"))}
        onClick={() => navigate("/settings")}
      >
        설정
      </button>
    </nav>
  );
};

const MobileScheduleRow = ({
  item,
  accentColor,
  backgroundColor = "#F4F4F5",
}: MobileScheduleRowProps) => (
  <>
    {getScheduleDisplayLabels(item).map((dateLabel) => (
      <div
        key={`${item.id}-${dateLabel}`}
        className="flex items-center gap-3 rounded-token-s px-3 py-2"
        style={{ backgroundColor }}
      >
        <span
          className="h-8 w-1.5 shrink-0 rounded-token-infinite"
          style={{ backgroundColor: accentColor }}
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-body-02-sb text-text-strong">{item.title}</p>
          <p className="text-body-03-r text-text-teritary">
            {dateLabel}
          </p>
        </div>
      </div>
    ))}
  </>
);

const MobileMainLayout = (): JSX.Element => {
  const { pathname } = useLocation();
  const {
    currentYear,
    currentMonth,
    onChangeCalendarMonth,
    categories,
    standaloneTasks,
    isCalendarLoading,
    calendarErrorMessage,
    reloadCalendarData,
    selectCategory,
  } = useCalendarLayoutContext();

  const displayedStandaloneTasks = useMemo(
    () =>
      standaloneTasks.filter((task) =>
        isScheduleInMonth(task, currentYear, currentMonth),
      ),
    [currentMonth, currentYear, standaloneTasks],
  );

  const visibleCategoryGroups = useMemo(
    () =>
      categories
        .map((category) => ({
          category,
          ...getVisibleCategoryItems(category, currentYear, currentMonth),
        }))
        .filter(
          ({ category, milestones, tasks }) =>
            !category.isHidden && (milestones.length > 0 || tasks.length > 0),
        ),
    [categories, currentMonth, currentYear],
  );

  const handlePreviousMonth = () => {
    if (currentMonth === 1) {
      onChangeCalendarMonth(currentYear - 1, 12);
      return;
    }

    onChangeCalendarMonth(currentYear, currentMonth - 1);
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      onChangeCalendarMonth(currentYear + 1, 1);
      return;
    }

    onChangeCalendarMonth(currentYear, currentMonth + 1);
  };

  const handleToday = () => {
    const today = new Date();
    onChangeCalendarMonth(today.getFullYear(), today.getMonth() + 1);
  };

  return (
    <main className="min-h-screen bg-fill-surface px-4 py-5">
      <section className="mx-auto flex w-full max-w-[430px] flex-col gap-4">
        <header className="rounded-token-l bg-fill-inverse p-5 shadow-shadow-s">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-body-03-r text-text-teritary">Pebble</p>
              <h1 className="text-title-02-sb text-text-strong">
                {currentYear}년 {currentMonth}월
              </h1>
            </div>
            <button
              type="button"
              className="rounded-token-infinite bg-btn-primary px-4 py-2 text-body-02-sb text-text-onFill"
              onClick={handleToday}
            >
              오늘
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              className="rounded-token-s bg-btn-quaternary py-3 text-body-02-sb text-text-strong"
              onClick={handlePreviousMonth}
            >
              이전 달
            </button>
            <button
              type="button"
              className="rounded-token-s bg-btn-quaternary py-3 text-body-02-sb text-text-strong"
              onClick={handleNextMonth}
            >
              다음 달
            </button>
          </div>
        </header>

        <MobileRouteNav activePath={pathname} />

        {isCalendarLoading ? (
          <section className="min-h-[320px] rounded-token-l bg-fill-inverse shadow-shadow-s">
            <CalendarStatusView
              title="캘린더를 불러오는 중이에요"
              description="카테고리, 마일스톤, 태스크 정보를 확인하고 있어요."
            />
          </section>
        ) : calendarErrorMessage ? (
          <section className="min-h-[320px] rounded-token-l bg-fill-inverse shadow-shadow-s">
            <CalendarStatusView
              title="캘린더를 불러오지 못했어요"
              description={calendarErrorMessage}
              actionLabel="다시 시도"
              onAction={reloadCalendarData}
            />
          </section>
        ) : (
          <>
            {displayedStandaloneTasks.length > 0 && (
              <section className="rounded-token-l bg-fill-inverse p-4 shadow-shadow-s">
                <div className="mb-3 flex items-end gap-2">
                  <h2 className="text-title-03-sb text-text-strong">
                    단일 태스크
                  </h2>
                  <span className="text-body-02-m text-text-teritary">
                    {displayedStandaloneTasks.length}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  {displayedStandaloneTasks.map((task) => (
                    <MobileScheduleRow
                      key={task.id}
                      item={task}
                      accentColor={task.accent ?? "#171717"}
                    />
                  ))}
                </div>
              </section>
            )}

            {visibleCategoryGroups.map(({ category, milestones, tasks }) => (
              <section
                key={category.id}
                className="rounded-token-l bg-fill-inverse p-4 shadow-shadow-s"
              >
                <button
                  type="button"
                  className="mb-3 flex w-full items-center gap-3 text-left"
                  onClick={() => selectCategory(category.id)}
                >
                  <span
                    className="h-10 w-2 rounded-token-infinite"
                    style={{ backgroundColor: category.themeBase }}
                  />
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-title-03-sb text-text-strong">
                      {category.title}
                    </h2>
                    <p className="text-body-03-r text-text-teritary">
                      마일스톤 {milestones.length} · 태스크 {tasks.length}
                    </p>
                  </div>
                </button>

                <div className="flex flex-col gap-2">
                  {milestones.map((milestone) => (
                    <MobileScheduleRow
                      key={milestone.id}
                      item={milestone}
                      accentColor={category.themeBase}
                      backgroundColor={category.themeMid}
                    />
                  ))}
                  {tasks.map((task) => (
                    <MobileScheduleRow
                      key={task.id}
                      item={task}
                      accentColor={category.themeBase}
                      backgroundColor={category.themeLight}
                    />
                  ))}
                </div>
              </section>
            ))}

            {displayedStandaloneTasks.length === 0 &&
              visibleCategoryGroups.length === 0 && (
                <section className="min-h-[320px] rounded-token-l bg-fill-inverse shadow-shadow-s">
                  <CalendarStatusView
                    title="이번 달 일정이 없어요"
                    description="데스크톱에서 카테고리, 마일스톤, 태스크를 추가해보세요."
                  />
                </section>
              )}
          </>
        )}
      </section>
    </main>
  );
};

const MobileNestedPageLayout = (): JSX.Element => {
  const { pathname } = useLocation();

  return (
    <main className="min-h-screen bg-fill-surface px-4 py-5">
      <section className="mx-auto flex w-full max-w-[430px] flex-col gap-4">
        <MobileRouteNav activePath={pathname} />
        {pathname === "/" ? (
          <Outlet />
        ) : (
          <div className="overflow-hidden rounded-token-l bg-fill-inverse shadow-shadow-s">
            <Outlet />
          </div>
        )}
      </section>
    </main>
  );
};

const MainLayoutFrame = (): JSX.Element => {
  const { pathname } = useLocation();
  const {
    isSidebarOpen,
    onToggleSidebar,
    currentYear,
    currentMonth,
    selectedCalendarDate,
    selectedCategoryId,
    viewedUserId,
    categories,
    standaloneTasks,
    selectCategory,
    toggleCategoryVisibility,
    createCategory,
    createMilestone,
    createTask,
    updateMilestone,
    deleteMilestone,
    updateCategoryTask,
    deleteCategoryTask,
    updateTask,
    deleteTask,
    updateStandaloneTask,
    deleteStandaloneTask,
    toggleMilestoneCompleted,
    toggleCategoryTaskCompleted,
    toggleTaskCompleted,
    toggleStandaloneTaskCompleted,
  } = useCalendarLayoutContext();
  const [scale, setScale] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const isFriendCalendarView = viewedUserId !== null;

  useEffect(() => {
    const handleResize = () => {
      const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
      const viewportHeight =
        window.visualViewport?.height ?? window.innerHeight;
      const availableWidth = viewportWidth - SAFE_MARGIN;
      const availableHeight = viewportHeight - SAFE_MARGIN;
      const widthScale = availableWidth / ORIGINAL_WIDTH;
      const heightScale = availableHeight / ORIGINAL_HEIGHT;
      const nextScale = Math.min(widthScale, heightScale, 1);

      setIsMobile(viewportWidth < MOBILE_BREAKPOINT);
      setScale(Math.max(getMinimumScale(viewportWidth), nextScale));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    window.visualViewport?.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.visualViewport?.removeEventListener("resize", handleResize);
    };
  }, []);

  if (isMobile && pathname === "/calendar") {
    return <MobileMainLayout />;
  }

  if (isMobile) {
    return <MobileNestedPageLayout />;
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center overflow-auto bg-fill-surface p-3">
      <div
        className="relative"
        style={{
          width: ORIGINAL_WIDTH * scale,
          height: ORIGINAL_HEIGHT * scale,
        }}
      >
        <div
          className="absolute left-0 top-0 flex origin-top-left gap-4"
          style={{
            transform: `scale(${scale})`,
          }}
        >
          <div className="relative flex h-[1000px] shrink-0 overflow-hidden rounded-[20px] shadow-shadow-m">
            <GlobalNavigationBar
              isSidebarOpen={isSidebarOpen}
              onToggleSidebar={onToggleSidebar}
            />
            <SidebarDivider visible={isSidebarOpen} />
            <CalendarSidebar
              isSidebarOpen={isSidebarOpen}
              categories={categories}
              standaloneTasks={standaloneTasks}
              currentYear={currentYear}
              currentMonth={currentMonth}
              selectedDate={selectedCalendarDate}
              onSelectCategory={selectCategory}
              isReadOnly={isFriendCalendarView}
              onToggleCategoryVisibility={toggleCategoryVisibility}
              selectedCategoryId={selectedCategoryId}
              onCreateCategory={createCategory}
              onCreateMilestone={createMilestone}
              onCreateTask={createTask}
              onUpdateMilestone={updateMilestone}
              onDeleteMilestone={deleteMilestone}
              onUpdateCategoryTask={updateCategoryTask}
              onDeleteCategoryTask={deleteCategoryTask}
              onUpdateTask={updateTask}
              onDeleteTask={deleteTask}
              onUpdateStandaloneTask={updateStandaloneTask}
              onDeleteStandaloneTask={deleteStandaloneTask}
              onToggleMilestoneCompleted={toggleMilestoneCompleted}
              onToggleCategoryTaskCompleted={toggleCategoryTaskCompleted}
              onToggleTaskCompleted={toggleTaskCompleted}
              onToggleStandaloneTaskCompleted={toggleStandaloneTaskCompleted}
            />
          </div>

          <Outlet />
        </div>
      </div>
    </main>
  );
};

export const MainLayout = (): JSX.Element => (
  <CalendarLayoutProvider>
    <MainLayoutFrame />
  </CalendarLayoutProvider>
);
