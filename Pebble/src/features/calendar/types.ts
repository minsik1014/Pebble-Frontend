import type {
  Category,
  MilestoneItem,
  ScheduleEntityBase,
  ScheduleStyleFields,
  TaskItem,
} from "@/types";

export type CreateCategoryInput = Omit<Category, "id" | "items"> & {
  id?: string;
  items?: MilestoneItem[];
  tasks?: TaskItem[];
};

export type UpdateCategoryInput = Partial<Omit<Category, "id" | "items">> & {
  items?: MilestoneItem[];
};

export type CreateScheduleItemInput = Omit<ScheduleEntityBase, "id"> &
  ScheduleStyleFields & {
  id?: string;
  tasks?: TaskItem[];
};

export type CalendarState = {
  categories: Category[];
  standaloneTasks: TaskItem[];
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
  ) => MilestoneItem;
  createTask: (
    categoryId: string,
    milestoneId: string,
    input: CreateScheduleItemInput,
  ) => TaskItem;
  createCategoryTask: (
    categoryId: string,
    input: CreateScheduleItemInput,
  ) => TaskItem;
  updateCategoryTask: (
    categoryId: string,
    taskId: string,
    input: CreateScheduleItemInput,
  ) => void;
  deleteCategoryTask: (categoryId: string, taskId: string) => void;
  createStandaloneTask: (input: CreateScheduleItemInput) => TaskItem;
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
