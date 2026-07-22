import type {
  CalendarStateModel,
  CreateCategoryInput,
  CreateScheduleItemInput,
  UpdateCategoryInput,
} from "@/features/calendar/types";
import type { TaskFormSubmitInput } from "@/features/task/components/TaskFormModal";
import type { Category } from "@/types";

export type CalendarLayoutContextValue = {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  currentYear: number;
  currentMonth: number;
  onChangeCalendarMonth: (year: number, month: number) => void;
  selectedCategoryId: string | null;
  categories: Category[];
  standaloneTasks: CalendarStateModel["standaloneTasks"];
  replaceCategories: CalendarStateModel["replaceCategories"];
  selectCategory: (categoryId: string) => void;
  createCategory: (input: CreateCategoryInput) => void;
  createMilestone: (
    categoryId: string,
    input: CreateScheduleItemInput,
  ) => void;
  createTask: (input: TaskFormSubmitInput) => void;
  updateCategoryTask: CalendarStateModel["updateCategoryTask"];
  deleteCategoryTask: CalendarStateModel["deleteCategoryTask"];
  updateCategory: (categoryId: string, input: UpdateCategoryInput) => void;
  deleteCategory: (categoryId: string) => void;
  deleteMilestone: (categoryId: string, milestoneId: string) => void;
  deleteTask: (
    categoryId: string,
    milestoneId: string,
    taskId: string,
  ) => void;
  updateStandaloneTask: CalendarStateModel["updateStandaloneTask"];
  deleteStandaloneTask: CalendarStateModel["deleteStandaloneTask"];
};
