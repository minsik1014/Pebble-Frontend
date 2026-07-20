import type { Category, ScheduleItem } from "@/types";

export type CreateCategoryInput = Omit<Category, "id" | "items"> & {
  id?: string;
  items?: ScheduleItem[];
  tasks?: ScheduleItem[];
};

export type UpdateCategoryInput = Partial<Omit<Category, "id" | "items">> & {
  items?: ScheduleItem[];
};

export type CreateScheduleItemInput = Omit<ScheduleItem, "id" | "tasks"> & {
  id?: string;
  tasks?: ScheduleItem[];
};

export type CalendarState = {
  categories: Category[];
  standaloneTasks: ScheduleItem[];
  selectedCategory: Category | null;
  selectedCategoryId: string | null;
};

export type CalendarActions = {
  replaceCategories: (categories: Category[]) => void;
  selectCategory: (categoryId: string) => void;
  clearSelectedCategory: () => void;
  createCategory: (input: CreateCategoryInput) => Category;
  updateCategory: (categoryId: string, input: UpdateCategoryInput) => void;
  createMilestone: (
    categoryId: string,
    input: CreateScheduleItemInput,
  ) => ScheduleItem;
  createTask: (
    categoryId: string,
    milestoneId: string,
    input: CreateScheduleItemInput,
  ) => ScheduleItem;
  createCategoryTask: (
    categoryId: string,
    input: CreateScheduleItemInput,
  ) => ScheduleItem;
  updateCategoryTask: (
    categoryId: string,
    taskId: string,
    input: CreateScheduleItemInput,
  ) => void;
  deleteCategoryTask: (categoryId: string, taskId: string) => void;
  createStandaloneTask: (input: CreateScheduleItemInput) => ScheduleItem;
  updateStandaloneTask: (
    taskId: string,
    input: CreateScheduleItemInput,
  ) => void;
  deleteStandaloneTask: (taskId: string) => void;
  deleteCategory: (categoryId: string) => void;
  deleteMilestone: (categoryId: string, milestoneId: string) => void;
  deleteTask: (
    categoryId: string,
    milestoneId: string,
    taskId: string,
  ) => void;
};

export type CalendarStateModel = CalendarState & CalendarActions;
