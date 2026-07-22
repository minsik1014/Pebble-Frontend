import { Outlet } from "react-router-dom";

import { GlobalNavigationBar } from "@/components/layout/GlobalNavigationBar";
import {
  APP_SHELL_GAP_CLASS,
  APP_SHELL_MAX_HEIGHT_CLASS,
  APP_SHELL_MAX_WIDTH_CLASS,
  APP_SHELL_PADDING_CLASS,
} from "@/components/layout/layoutTokens";
import {
  CalendarLayoutProvider,
} from "@/features/calendar/context/CalendarLayoutProvider";
import { useCalendarLayoutContext } from "@/features/calendar/context/useCalendarLayoutContext";
import { CalendarSidebar } from "@/features/milestone/components/CalendarSidebar";
import { SidebarDivider } from "@/features/milestone/components/SidebarDivider";

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

  return (
    <main
      className={`flex h-screen w-screen items-center justify-center overflow-hidden bg-fill-surface ${APP_SHELL_PADDING_CLASS}`}
    >
      <div
        className={`flex h-full ${APP_SHELL_MAX_HEIGHT_CLASS} min-h-0 w-full ${APP_SHELL_MAX_WIDTH_CLASS} min-w-0 ${APP_SHELL_GAP_CLASS}`}
      >
        <div className="relative flex h-full shrink-0 overflow-hidden rounded-[20px] shadow-shadow-m">
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

        <div className="min-w-0 flex-1">
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
