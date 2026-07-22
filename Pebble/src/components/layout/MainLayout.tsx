import { useState } from "react";
import {
  Outlet,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { GlobalNavigationBar } from "@/components/layout/GlobalNavigationBar";
import type {
  CalendarStateModel,
  CreateCategoryInput,
  CreateScheduleItemInput,
  UpdateCategoryInput,
} from "@/features/calendar/types";
import { useCalendarState } from "@/features/calendar/hooks/useCalendarState";
import { CalendarSidebar } from "@/features/milestone/components/CalendarSidebar";
import { SidebarDivider } from "@/features/milestone/components/SidebarDivider";
import type { TaskFormSubmitInput } from "@/features/task/components/TaskFormModal";
import type { Category } from "@/types";

export interface MainLayoutContext {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  currentYear: number;
  currentMonth: number;
  onChangeCalendarMonth: (year: number, month: number) => void;
  categories: Category[];
  standaloneTasks: CalendarStateModel["standaloneTasks"];
  replaceCategories: CalendarStateModel["replaceCategories"];
  createCategory: (input: CreateCategoryInput) => void;
  createMilestone: (
    categoryId: string,
    input: CreateScheduleItemInput,
  ) => void;
  createTask: (input: TaskFormSubmitInput) => void;
  updateCategoryTask: CalendarStateModel["updateCategoryTask"];
  deleteCategoryTask: CalendarStateModel["deleteCategoryTask"];
  updateCategory: (categoryId: string, input: UpdateCategoryInput) => void;
  onDeleteCategory: (categoryId: string) => void;
  onDeleteMilestone: (categoryId: string, milestoneId: string) => void;
  onDeleteTask: (
    categoryId: string,
    milestoneId: string,
    taskId: string,
  ) => void;
}

export const MainLayout = (): JSX.Element => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(() => new Date().getMonth() + 1);
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

  const handleDeleteMilestone = (
    categoryId: string,
    milestoneId: string,
  ) => {
    deleteMilestone(categoryId, milestoneId);
  };

  const handleDeleteTask = (
    categoryId: string,
    milestoneId: string,
    taskId: string,
  ) => {
    deleteTask(categoryId, milestoneId, taskId);
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

  return (
    <main className="flex h-screen w-screen items-center justify-center overflow-hidden bg-fill-surface p-3">
      <div className="flex h-full max-h-[1100px] min-h-0 w-full max-w-[1728px] min-w-0 gap-4">
        <div className="relative flex h-full shrink-0 overflow-hidden rounded-[20px] shadow-shadow-m">
          <GlobalNavigationBar
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={handleToggleSidebar}
          />
          <SidebarDivider visible={isSidebarOpen} />
          <CalendarSidebar
            isSidebarOpen={isSidebarOpen}
            categories={categories}
            standaloneTasks={standaloneTasks}
            currentYear={currentYear}
            currentMonth={currentMonth}
            onSelectCategory={handleSelectCategory}
            selectedCategoryId={selectedCategoryId}
            onCreateCategory={handleCreateCategory}
            onCreateMilestone={createMilestone}
            onCreateTask={handleCreateTask}
            onUpdateStandaloneTask={updateStandaloneTask}
            onDeleteStandaloneTask={deleteStandaloneTask}
          />
        </div>

        <div className="min-w-0 flex-1">
          <Outlet
            context={{
              isSidebarOpen,
              onToggleSidebar: handleToggleSidebar,
              currentYear,
              currentMonth,
              onChangeCalendarMonth: handleChangeCalendarMonth,
              categories,
              standaloneTasks,
              replaceCategories,
              createCategory: handleCreateCategory,
              createMilestone,
              createTask: handleCreateTask,
              updateCategoryTask,
              deleteCategoryTask,
              updateCategory,
              onDeleteCategory: handleDeleteCategory,
              onDeleteMilestone: handleDeleteMilestone,
              onDeleteTask: handleDeleteTask,
            }}
          />
        </div>
      </div>
    </main>
  );
};
