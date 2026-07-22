import { useState, type ReactNode } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { CalendarLayoutContext } from "@/features/calendar/context/calendarLayoutContext";
import type { CalendarLayoutContextValue } from "@/features/calendar/context/calendarLayoutContext.types";
import { useCalendarState } from "@/features/calendar/hooks/useCalendarState";
import type { CreateCategoryInput } from "@/features/calendar/types";
import type { TaskFormSubmitInput } from "@/features/task/components/TaskFormModal";

type CalendarLayoutProviderProps = {
  children: ReactNode;
};

export const CalendarLayoutProvider = ({
  children,
}: CalendarLayoutProviderProps): JSX.Element => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(
    () => new Date().getMonth() + 1,
  );
  const {
    categories,
    standaloneTasks,
    replaceCategories,
    selectCategory,
    createCategory,
    createMilestone,
    createTask,
    createCategoryTask,
    updateCategoryTask,
    deleteCategoryTask,
    createStandaloneTask,
    updateStandaloneTask,
    deleteStandaloneTask,
    updateCategory,
    deleteCategory,
    deleteMilestone,
    deleteTask,
  } = useCalendarState();
  const selectedCategoryId = searchParams.get("category");

  const handleToggleSidebar = () => {
    setIsSidebarOpen((previous) => !previous);
  };

  const handleChangeCalendarMonth = (year: number, month: number) => {
    setCurrentYear(year);
    setCurrentMonth(month);
  };

  const handleSelectCategory = (categoryId: string) => {
    selectCategory(categoryId);
    navigate(`/?category=${categoryId}`);
  };

  const handleCreateCategory = (input: CreateCategoryInput) => {
    createCategory(input);
    navigate("/");
  };

  const handleDeleteCategory = (categoryId: string) => {
    deleteCategory(categoryId);
    navigate("/");
  };

  const handleCreateTask = ({
    categoryId,
    milestoneId,
    task,
  }: TaskFormSubmitInput) => {
    if (categoryId && milestoneId) {
      createTask(categoryId, milestoneId, task);
      return;
    }

    if (categoryId) {
      createCategoryTask(categoryId, task);
      return;
    }

    createStandaloneTask(task);
  };

  const value: CalendarLayoutContextValue = {
    isSidebarOpen,
    onToggleSidebar: handleToggleSidebar,
    currentYear,
    currentMonth,
    onChangeCalendarMonth: handleChangeCalendarMonth,
    selectedCategoryId,
    categories,
    standaloneTasks,
    replaceCategories,
    selectCategory: handleSelectCategory,
    createCategory: handleCreateCategory,
    createMilestone,
    createTask: handleCreateTask,
    updateCategoryTask,
    deleteCategoryTask,
    updateCategory,
    deleteCategory: handleDeleteCategory,
    deleteMilestone,
    deleteTask,
    updateStandaloneTask,
    deleteStandaloneTask,
  };

  return (
    <CalendarLayoutContext.Provider value={value}>
      {children}
    </CalendarLayoutContext.Provider>
  );
};
