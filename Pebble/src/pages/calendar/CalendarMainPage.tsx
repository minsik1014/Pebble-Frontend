import { CalendarBoard } from "@/features/milestone/components/CalendarBoard";
import { CategoryDetailSection } from "@/features/category/components/CategoryDetailSection";
import { useCalendarLayoutContext } from "@/features/calendar/context/useCalendarLayoutContext";
import { useSearchParams } from "react-router-dom";

export const CalendarMainPage = (): JSX.Element => {
  const {
    currentYear,
    currentMonth,
    onChangeCalendarMonth,
    categories,
    standaloneTasks,
    createTask,
    updateCategoryTask,
    deleteCategoryTask,
    updateCategory,
    deleteCategory,
    deleteMilestone,
    deleteTask,
  } = useCalendarLayoutContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategoryId = searchParams.get("category");

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

  return selectedCategory ? (
    <CategoryDetailSection
      category={selectedCategory}
      onBack={() => setSearchParams({})}
      categories={categories}
      onUpdateCategory={updateCategory}
      onCreateTask={createTask}
      onUpdateCategoryTask={updateCategoryTask}
      onDeleteCategoryTask={deleteCategoryTask}
      onDeleteCategory={deleteCategory}
      onDeleteMilestone={deleteMilestone}
      onDeleteTask={deleteTask}
    />
  ) : (
    <CalendarBoard
      categories={categories}
      standaloneTasks={standaloneTasks}
      currentYear={currentYear}
      currentMonth={currentMonth}
      onChangeCalendarMonth={onChangeCalendarMonth}
    />
  );
};
