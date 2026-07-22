import { Outlet } from "react-router-dom";

import { AppShellLayout } from "@/components/layout/AppShellLayout";
import { GlobalNavigationBar } from "@/components/layout/GlobalNavigationBar";
import { CalendarLayoutProvider } from "@/features/calendar/context/CalendarLayoutProvider";
import { useCalendarLayoutContext } from "@/features/calendar/context/useCalendarLayoutContext";
import { CalendarSidebar } from "@/features/calendar/components/sidebar/CalendarSidebar";
import { SidebarDivider } from "@/features/calendar/components/sidebar/SidebarDivider";

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
    <AppShellLayout
      sidePanel={
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
      }
    >
      <Outlet />
    </AppShellLayout>
  );
};

export const MainLayout = (): JSX.Element => (
  <CalendarLayoutProvider>
    <MainLayoutFrame />
  </CalendarLayoutProvider>
);
