import { CalendarBoard } from "@/features/milestone/components/CalendarBoard";
import { CategoryDetailSection } from "@/features/category/components/CategoryDetailSection";
import { useCalendarLayoutContext } from "@/features/calendar/context/useCalendarLayoutContext";
import { useSearchParams } from "react-router-dom";

export const CalendarMainPage = (): JSX.Element => {
  const {
    isSidebarOpen,
    currentYear,
    currentMonth,
    onChangeCalendarMonth,
    categories,
    standaloneTasks,
    isCalendarLoading,
    calendarErrorMessage,
    reloadCalendarData,
    createTask,
    updateCategoryTask,
    deleteCategoryTask,
    updateCategory,
    deleteCategory,
    updateMilestone,
    deleteMilestone,
    updateTask,
    deleteTask,
    toggleMilestoneCompleted,
    toggleCategoryTaskCompleted,
    toggleTaskCompleted,
  } = useCalendarLayoutContext();
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
      onUpdateCategoryTask={updateCategoryTask}
      onDeleteCategoryTask={deleteCategoryTask}
      onDeleteCategory={deleteCategory}
      onUpdateMilestone={updateMilestone}
      onDeleteMilestone={deleteMilestone}
      onUpdateTask={updateTask}
      onDeleteTask={deleteTask}
      onToggleMilestoneCompleted={toggleMilestoneCompleted}
      onToggleCategoryTaskCompleted={toggleCategoryTaskCompleted}
      onToggleTaskCompleted={toggleTaskCompleted}
    />
  ) : (
    <CalendarBoard
      isSidebarOpen={isSidebarOpen}
      categories={categories}
      standaloneTasks={standaloneTasks}
      currentYear={currentYear}
      currentMonth={currentMonth}
      onChangeCalendarMonth={onChangeCalendarMonth}
      isLoading={isCalendarLoading}
      errorMessage={calendarErrorMessage}
      onRetry={reloadCalendarData}
    />
  );
};
