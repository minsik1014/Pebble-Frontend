import { useCallback } from "react";
import type { Dispatch, SetStateAction } from "react";

import type { Category } from "@/types";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/features/calendar/types";
import {
  createCategoryEntity,
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
    (input: CreateCategoryInput) => {
      const category = createCategoryEntity(input);

      setCategories((previousCategories) => [...previousCategories, category]);
      setSelectedCategoryId(null);

      return category;
    },
    [setCategories, setSelectedCategoryId],
  );

  const updateCategory = useCallback(
    (categoryId: string, input: UpdateCategoryInput) => {
      setCategories((previousCategories) =>
        updateCategoryInList(previousCategories, categoryId, input),
      );
    },
    [setCategories],
  );

  const deleteCategory = useCallback(
    (categoryId: string) => {
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
