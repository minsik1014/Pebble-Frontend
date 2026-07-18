import { useCallback, useMemo, useState } from "react";

import type { Category, ScheduleItem } from "@/types";

export type CreateCategoryInput = Omit<Category, "id" | "items"> & {
  id?: string;
  items?: ScheduleItem[];
  tasks?: ScheduleItem[];
};

export type UpdateCategoryInput = Partial<
  Omit<Category, "id" | "items">
> & {
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

const cloneScheduleItems = (items: ScheduleItem[]): ScheduleItem[] =>
  items.map((item) => {
    if (!item.tasks) {
      return { ...item };
    }

    return {
      ...item,
      tasks: cloneScheduleItems(item.tasks),
    };
  });

const createClientCategoryId = () => `category-${crypto.randomUUID()}`;
const createClientMilestoneId = () => `milestone-${crypto.randomUUID()}`;
const createClientTaskId = () => `task-${crypto.randomUUID()}`;

export const useCalendarState = (): CalendarStateModel => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [standaloneTasks, setStandaloneTasks] = useState<ScheduleItem[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );

  const selectedCategory = useMemo(
    () =>
      categories.find((category) => category.id === selectedCategoryId) ?? null,
    [categories, selectedCategoryId],
  );

  const replaceCategories = useCallback((nextCategories: Category[]) => {
    setCategories(
      nextCategories.map((category) => ({
        ...category,
        items: cloneScheduleItems(category.items),
        tasks: category.tasks ? cloneScheduleItems(category.tasks) : undefined,
      })),
    );
    setSelectedCategoryId(null);
  }, []);

  const selectCategory = useCallback((categoryId: string) => {
    setSelectedCategoryId(categoryId);
  }, []);

  const clearSelectedCategory = useCallback(() => {
    setSelectedCategoryId(null);
  }, []);

  const createCategory = useCallback((input: CreateCategoryInput) => {
    const category: Category = {
      ...input,
      id: input.id ?? createClientCategoryId(),
      items: input.items ? cloneScheduleItems(input.items) : [],
      tasks: input.tasks ? cloneScheduleItems(input.tasks) : undefined,
    };

    setCategories((previousCategories) => [...previousCategories, category]);
    setSelectedCategoryId(category.id);

    return category;
  }, []);

  const updateCategory = useCallback(
    (categoryId: string, input: UpdateCategoryInput) => {
      setCategories((previousCategories) =>
        previousCategories.map((category) =>
          category.id === categoryId
            ? {
                ...category,
                ...input,
                items: input.items
                  ? cloneScheduleItems(input.items)
                  : category.items,
                tasks: input.tasks
                  ? cloneScheduleItems(input.tasks)
                  : category.tasks,
              }
            : category,
        ),
      );
    },
    [],
  );

  const createMilestone = useCallback(
    (categoryId: string, input: CreateScheduleItemInput) => {
      const milestone: ScheduleItem = {
        ...input,
        id: input.id ?? createClientMilestoneId(),
        tasks: input.tasks ? cloneScheduleItems(input.tasks) : [],
      };

      setCategories((previousCategories) =>
        previousCategories.map((category) =>
          category.id === categoryId
            ? {
                ...category,
                items: [...category.items, milestone],
              }
            : category,
        ),
      );

      return milestone;
    },
    [],
  );

  const createTask = useCallback(
    (
      categoryId: string,
      milestoneId: string,
      input: CreateScheduleItemInput,
    ) => {
      const task: ScheduleItem = {
        ...input,
        id: input.id ?? createClientTaskId(),
      };

      setCategories((previousCategories) =>
        previousCategories.map((category) =>
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
        ),
      );

      return task;
    },
    [],
  );

  const createCategoryTask = useCallback(
    (categoryId: string, input: CreateScheduleItemInput) => {
      const task: ScheduleItem = {
        ...input,
        id: input.id ?? createClientTaskId(),
      };

      setCategories((previousCategories) =>
        previousCategories.map((category) =>
          category.id === categoryId
            ? {
                ...category,
                tasks: [...(category.tasks ?? []), task],
              }
            : category,
        ),
      );

      return task;
    },
    [],
  );

  const updateCategoryTask = useCallback(
    (categoryId: string, taskId: string, input: CreateScheduleItemInput) => {
      setCategories((previousCategories) =>
        previousCategories.map((category) =>
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
        ),
      );
    },
    [],
  );

  const deleteCategoryTask = useCallback(
    (categoryId: string, taskId: string) => {
      setCategories((previousCategories) =>
        previousCategories.map((category) =>
          category.id === categoryId
            ? {
                ...category,
                tasks: category.tasks?.filter((task) => task.id !== taskId),
              }
            : category,
        ),
      );
    },
    [],
  );

  const createStandaloneTask = useCallback((input: CreateScheduleItemInput) => {
    const task: ScheduleItem = {
      ...input,
      id: input.id ?? createClientTaskId(),
    };

    setStandaloneTasks((previousTasks) => [...previousTasks, task]);

    return task;
  }, []);

  const updateStandaloneTask = useCallback(
    (taskId: string, input: CreateScheduleItemInput) => {
      setStandaloneTasks((previousTasks) =>
        previousTasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                ...input,
              }
            : task,
        ),
      );
    },
    [],
  );

  const deleteStandaloneTask = useCallback((taskId: string) => {
    setStandaloneTasks((previousTasks) =>
      previousTasks.filter((task) => task.id !== taskId),
    );
  }, []);

  const deleteCategory = useCallback((categoryId: string) => {
    setCategories((previousCategories) =>
      previousCategories.filter((category) => category.id !== categoryId),
    );
    setSelectedCategoryId((previousSelectedCategoryId) =>
      previousSelectedCategoryId === categoryId ? null : previousSelectedCategoryId,
    );
  }, []);

  const deleteMilestone = useCallback(
    (categoryId: string, milestoneId: string) => {
      setCategories((previousCategories) =>
        previousCategories.map((category) =>
          category.id === categoryId
            ? {
                ...category,
                items: category.items.filter((item) => item.id !== milestoneId),
              }
            : category,
        ),
      );
    },
    [],
  );

  const deleteTask = useCallback(
    (categoryId: string, milestoneId: string, taskId: string) => {
      setCategories((previousCategories) =>
        previousCategories.map((category) =>
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
        ),
      );
    },
    [],
  );

  return {
    categories,
    standaloneTasks,
    selectedCategory,
    selectedCategoryId,
    replaceCategories,
    selectCategory,
    clearSelectedCategory,
    createCategory,
    updateCategory,
    createMilestone,
    createTask,
    createCategoryTask,
    updateCategoryTask,
    deleteCategoryTask,
    createStandaloneTask,
    updateStandaloneTask,
    deleteStandaloneTask,
    deleteCategory,
    deleteMilestone,
    deleteTask,
  };
};
