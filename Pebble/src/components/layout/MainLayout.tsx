import { useEffect, useState } from "react";
import { Outlet, useNavigate, useSearchParams } from "react-router-dom";

import { GlobalNavigationBar } from "@/components/layout/GlobalNavigationBar";
import type {
  CalendarStateModel,
  CreateCategoryInput,
  CreateScheduleItemInput,
  UpdateCategoryInput,
} from "@/features/calendar/hooks/useCalendarState";
import { useCalendarState } from "@/features/calendar/hooks/useCalendarState";
import { CalendarSidebar } from "@/features/milestone/components/CalendarSidebar";
import { SidebarDivider } from "@/features/milestone/components/SidebarDivider";
import type { Category } from "@/types";

const ORIGINAL_WIDTH = 1416;
const ORIGINAL_HEIGHT = 1000;

export interface MainLayoutContext {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  currentYear: number;
  currentMonth: number;
  onChangeCalendarMonth: (year: number, month: number) => void;
  categories: Category[];
  replaceCategories: CalendarStateModel["replaceCategories"];
  createCategory: (input: CreateCategoryInput) => void;
  createMilestone: (
    categoryId: string,
    input: CreateScheduleItemInput,
  ) => void;
  createTask: (
    categoryId: string,
    milestoneId: string,
    input: CreateScheduleItemInput,
  ) => void;
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

  const [scale, setScale] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(() => new Date().getMonth() + 1);
  const {
    categories,
    replaceCategories,
    selectCategory,
    createCategory,
    createMilestone,
    createTask,
    updateCategory,
    deleteCategory,
    deleteMilestone,
    deleteTask,
  } = useCalendarState();
  const selectedCategoryId = searchParams.get("category");

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
    const category = createCategory(input);
    navigate(`/?category=${category.id}`);
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
            <GlobalNavigationBar />
            <SidebarDivider visible={isSidebarOpen} />
            <CalendarSidebar
              isSidebarOpen={isSidebarOpen}
              categories={categories}
              currentYear={currentYear}
              currentMonth={currentMonth}
              onSelectCategory={handleSelectCategory}
              selectedCategoryId={selectedCategoryId}
              onCreateCategory={handleCreateCategory}
              onCreateMilestone={createMilestone}
              onCreateTask={createTask}
            />
          </div>

          <Outlet
            context={{
              isSidebarOpen,
              onToggleSidebar: handleToggleSidebar,
              currentYear,
              currentMonth,
              onChangeCalendarMonth: handleChangeCalendarMonth,
              categories,
              replaceCategories,
              createCategory: handleCreateCategory,
              createMilestone,
              createTask,
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
