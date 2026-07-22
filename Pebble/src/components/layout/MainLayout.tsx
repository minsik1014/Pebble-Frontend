import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import { GlobalNavigationBar } from "@/components/layout/GlobalNavigationBar";
import { CalendarLayoutProvider } from "@/features/calendar/context/CalendarLayoutProvider";
import { useCalendarLayoutContext } from "@/features/calendar/context/useCalendarLayoutContext";
import { CalendarSidebar } from "@/features/calendar/components/sidebar/CalendarSidebar";
import { SidebarDivider } from "@/features/calendar/components/sidebar/SidebarDivider";

const ORIGINAL_WIDTH = 1416;
const ORIGINAL_HEIGHT = 1000;

const MainLayoutFrame = (): JSX.Element => {
  const {
    isSidebarOpen,
    onToggleSidebar,
    currentYear,
    currentMonth,
    selectedCategoryId,
    categories,
    standaloneTasks,
    selectCategory,
    createCategory,
    createMilestone,
    createTask,
    updateStandaloneTask,
    deleteStandaloneTask,
  } = useCalendarLayoutContext();
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const availableWidth = window.innerWidth - 24;
      const availableHeight = window.innerHeight - 24;
      const widthScale = availableWidth / ORIGINAL_WIDTH;
      const heightScale = availableHeight / ORIGINAL_HEIGHT;
      const nextScale = Math.min(widthScale, heightScale, 1);

      setScale(Math.max(0.5, nextScale));
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <main className="flex min-h-screen w-full items-center justify-center overflow-hidden bg-fill-surface">
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
              onSelectCategory={selectCategory}
              selectedCategoryId={selectedCategoryId}
              onCreateCategory={createCategory}
              onCreateMilestone={createMilestone}
              onCreateTask={createTask}
              onUpdateStandaloneTask={updateStandaloneTask}
              onDeleteStandaloneTask={deleteStandaloneTask}
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
