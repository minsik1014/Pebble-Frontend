import { useCallback, useMemo, useState } from "react";

import type { Category, ScheduleItem } from "@/types";

export type CreateCategoryInput = Omit<Category, "id" | "items"> & {
  id?: string;
  items?: ScheduleItem[];
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
    selectedCategory,
    selectedCategoryId,
    replaceCategories,
    selectCategory,
    clearSelectedCategory,
    createCategory,
    updateCategory,
    createMilestone,
    createTask,
    deleteCategory,
    deleteMilestone,
    deleteTask,
  };
};
