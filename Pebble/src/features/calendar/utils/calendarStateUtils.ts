import type { Category, ScheduleItem } from "@/types";
import type {
  CreateCategoryInput,
  CreateScheduleItemInput,
  UpdateCategoryInput,
} from "@/features/calendar/types";

export const cloneScheduleItems = (items: ScheduleItem[]): ScheduleItem[] =>
  items.map((item) => ({
    ...item,
    tasks: item.tasks ? cloneScheduleItems(item.tasks) : undefined,
  }));

const createClientCategoryId = () => `category-${crypto.randomUUID()}`;
const createClientMilestoneId = () => `milestone-${crypto.randomUUID()}`;
const createClientTaskId = () => `task-${crypto.randomUUID()}`;

export const createCategoryEntity = (
  input: CreateCategoryInput,
): Category => ({
  ...input,
  id: input.id ?? createClientCategoryId(),
  items: input.items ? cloneScheduleItems(input.items) : [],
  tasks: input.tasks ? cloneScheduleItems(input.tasks) : undefined,
});

export const createMilestoneEntity = (
  input: CreateScheduleItemInput,
): ScheduleItem => ({
  ...input,
  id: input.id ?? createClientMilestoneId(),
  tasks: input.tasks ? cloneScheduleItems(input.tasks) : [],
});

export const createTaskEntity = (
  input: CreateScheduleItemInput,
): ScheduleItem => ({
  ...input,
  id: input.id ?? createClientTaskId(),
});

export const replaceCategoryList = (categories: Category[]) =>
  categories.map(createCategoryEntity);

export const updateCategoryInList = (
  categories: Category[],
  categoryId: string,
  input: UpdateCategoryInput,
) =>
  categories.map((category) =>
    category.id === categoryId
      ? {
          ...category,
          ...input,
          items: input.items ? cloneScheduleItems(input.items) : category.items,
          tasks: input.tasks ? cloneScheduleItems(input.tasks) : category.tasks,
        }
      : category,
  );

export const appendMilestoneToCategory = (
  categories: Category[],
  categoryId: string,
  milestone: ScheduleItem,
) =>
  categories.map((category) =>
    category.id === categoryId
      ? {
          ...category,
          items: [...category.items, milestone],
        }
      : category,
  );

export const appendTaskToMilestone = (
  categories: Category[],
  categoryId: string,
  milestoneId: string,
  task: ScheduleItem,
) =>
  categories.map((category) =>
    category.id === categoryId
      ? {
          ...category,
          items: category.items.map((item) =>
            item.id === milestoneId
              ? {
                  ...item,
                  tasks: [...(item.tasks ?? []), task],
                }
              : item,
          ),
        }
      : category,
  );

export const appendTaskToCategory = (
  categories: Category[],
  categoryId: string,
  task: ScheduleItem,
) =>
  categories.map((category) =>
    category.id === categoryId
      ? {
          ...category,
          tasks: [...(category.tasks ?? []), task],
        }
      : category,
  );

export const updateCategoryTaskInList = (
  categories: Category[],
  categoryId: string,
  taskId: string,
  input: CreateScheduleItemInput,
) =>
  categories.map((category) =>
    category.id === categoryId
      ? {
          ...category,
          tasks: category.tasks?.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  ...input,
                }
              : task,
          ),
        }
      : category,
  );

export const removeCategoryTaskFromList = (
  categories: Category[],
  categoryId: string,
  taskId: string,
) =>
  categories.map((category) =>
    category.id === categoryId
      ? {
          ...category,
          tasks: category.tasks?.filter((task) => task.id !== taskId),
        }
      : category,
  );

export const removeMilestoneFromCategory = (
  categories: Category[],
  categoryId: string,
  milestoneId: string,
) =>
  categories.map((category) =>
    category.id === categoryId
      ? {
          ...category,
          items: category.items.filter((item) => item.id !== milestoneId),
        }
      : category,
  );

export const removeTaskFromMilestone = (
  categories: Category[],
  categoryId: string,
  milestoneId: string,
  taskId: string,
) =>
  categories.map((category) =>
    category.id === categoryId
      ? {
          ...category,
          items: category.items.map((item) =>
            item.id === milestoneId
              ? {
                  ...item,
                  tasks: item.tasks?.filter((task) => task.id !== taskId),
                }
              : item,
          ),
        }
      : category,
  );
