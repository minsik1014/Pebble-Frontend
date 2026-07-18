import { CalendarBoard } from "@/features/milestone/components/CalendarBoard";
import { CategoryDetailSection } from "@/features/category/components/CategoryDetailSection";
import type { MainLayoutContext } from "@/components/layout/MainLayout";
import { useOutletContext, useSearchParams } from "react-router-dom";

export const CalendarMainPage = (): JSX.Element => {
  const {
    isSidebarOpen,
    onToggleSidebar,
    currentYear,
    currentMonth,
    onChangeCalendarMonth,
    categories,
    createTask,
    updateCategory,
    onDeleteCategory,
    onDeleteMilestone,
    onDeleteTask,
  } = useOutletContext<MainLayoutContext>();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategoryId = searchParams.get("category");

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

  return selectedCategory ? (
    <CategoryDetailSection
      isSidebarOpen={isSidebarOpen}
      category={selectedCategory}
      onBack={() => setSearchParams({})}
      categories={categories}
      onUpdateCategory={updateCategory}
      onCreateTask={createTask}
      onDeleteCategory={onDeleteCategory}
      onDeleteMilestone={onDeleteMilestone}
      onDeleteTask={onDeleteTask}
    />
  ) : (
    <CalendarBoard
      isSidebarOpen={isSidebarOpen}
      onToggleSidebar={onToggleSidebar}
      categories={categories}
      currentYear={currentYear}
      currentMonth={currentMonth}
      onChangeCalendarMonth={onChangeCalendarMonth}
    />
  );
};
