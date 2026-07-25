import { useCallback } from "react";
import type { Dispatch, SetStateAction } from "react";

import type { Category } from "@/types";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/features/calendar/types";
import {
  createCategory as requestCreateCategory,
  deleteCategory as requestDeleteCategory,
  updateCategory as requestUpdateCategory,
} from "@/features/category/api/categoryApi";
import {
  replaceCategoryList,
  updateCategoryInList,
} from "@/features/calendar/utils/calendarStateUtils";

type UseCalendarCategoryActionsParams = {
  setCategories: Dispatch<SetStateAction<Category[]>>;
  setSelectedCategoryId: Dispatch<SetStateAction<string | null>>;
};

export const useCalendarCategoryActions = ({
  setCategories,
  setSelectedCategoryId,
}: UseCalendarCategoryActionsParams) => {
  const replaceCategories = useCallback(
    (nextCategories: Category[]) => {
      setCategories(replaceCategoryList(nextCategories));
      setSelectedCategoryId(null);
    },
    [setCategories, setSelectedCategoryId],
  );

  const selectCategory = useCallback(
    (categoryId: string) => {
      setSelectedCategoryId(categoryId);
    },
    [setSelectedCategoryId],
  );

  const clearSelectedCategory = useCallback(() => {
    setSelectedCategoryId(null);
  }, [setSelectedCategoryId]);

  const createCategory = useCallback(
    async (input: CreateCategoryInput) => {
      const category = await requestCreateCategory(input);

      if (!category) {
        return null;
      }

      setCategories((previousCategories) => [...previousCategories, category]);
      setSelectedCategoryId(null);

      return category;
    },
    [setCategories, setSelectedCategoryId],
  );

  const updateCategory = useCallback(
    async (categoryId: string, input: UpdateCategoryInput) => {
      const category = await requestUpdateCategory(categoryId, input);

      setCategories((previousCategories) =>
        category
          ? previousCategories.map((previousCategory) =>
              previousCategory.id === categoryId
                ? {
                    ...previousCategory,
                    ...category,
                    items: previousCategory.items,
                    tasks: previousCategory.tasks,
                  }
                : previousCategory,
            )
          : updateCategoryInList(previousCategories, categoryId, input),
      );
    },
    [setCategories],
  );

  const deleteCategory = useCallback(
    async (categoryId: string) => {
      await requestDeleteCategory(categoryId);

      setCategories((previousCategories) =>
        previousCategories.filter((category) => category.id !== categoryId),
      );
      setSelectedCategoryId((previousSelectedCategoryId) =>
        previousSelectedCategoryId === categoryId
          ? null
          : previousSelectedCategoryId,
      );
    },
    [setCategories, setSelectedCategoryId],
  );

  return {
    replaceCategories,
    selectCategory,
    clearSelectedCategory,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};
