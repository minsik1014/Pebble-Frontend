import { useCallback } from "react";
import type { Dispatch, SetStateAction } from "react";

import type { Category } from "@/types";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/features/calendar/types";
import {
  createCategory as createCategoryApi,
  deleteCategory as deleteCategoryApi,
  updateCategory as updateCategoryApi,
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
      const category = await createCategoryApi(input);

      if (!category) {
        throw new Error("카테고리 생성 응답을 확인하지 못했어요.");
      }

      setCategories((previousCategories) => [...previousCategories, category]);
      setSelectedCategoryId(null);

      return category;
    },
    [setCategories, setSelectedCategoryId],
  );

  const updateCategory = useCallback(
    async (categoryId: string, input: UpdateCategoryInput) => {
      const category = await updateCategoryApi(categoryId, input);

      setCategories((previousCategories) =>
        category
          ? previousCategories.map((previousCategory) =>
              previousCategory.id === categoryId
                ? {
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
      await deleteCategoryApi(categoryId);

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
