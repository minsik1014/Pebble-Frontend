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
  inviteCategoryMember,
  removeCategoryMember,
  shareCategory,
} from "@/features/category/api/sharedCategoryApi";
import {
  replaceCategoryList,
  updateCategoryInList,
} from "@/features/calendar/utils/calendarStateUtils";

type UseCalendarCategoryActionsParams = {
  categories: Category[];
  setCategories: Dispatch<SetStateAction<Category[]>>;
  setSelectedCategoryId: Dispatch<SetStateAction<string | null>>;
};

export const useCalendarCategoryActions = ({
  categories,
  setCategories,
  setSelectedCategoryId,
}: UseCalendarCategoryActionsParams) => {
  const syncSharedCategoryMembers = useCallback(
    async (
      categoryId: string,
      previousMembers: Category["members"] = [],
      nextMembers: Category["members"] = [],
      wasShared = false,
      shouldBeShared = false,
    ) => {
      if (!shouldBeShared) {
        return;
      }

      const membersToAdd = nextMembers.filter(
        (nextMember) =>
          !previousMembers.some(
            (previousMember) => previousMember.id === nextMember.id,
          ),
      );
      const membersToRemove = previousMembers.filter(
        (previousMember) =>
          !nextMembers.some((nextMember) => nextMember.id === previousMember.id),
      );

      if (!wasShared) {
        await shareCategory(categoryId, nextMembers);
        return;
      }

      await Promise.all([
        ...membersToAdd.map((member) => inviteCategoryMember(categoryId, member)),
        ...membersToRemove.map((member) =>
          removeCategoryMember(categoryId, member.id),
        ),
      ]);
    },
    [],
  );

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

      const members = input.isShared ? input.members ?? [] : [];

      await syncSharedCategoryMembers(
        category.id,
        [],
        members,
        false,
        Boolean(input.isShared),
      );

      setCategories((previousCategories) => [
        ...previousCategories,
        {
          ...category,
          isShared: members.length > 0 ? true : category.isShared,
          members: members.length > 0 ? members : category.members,
        },
      ]);
      setSelectedCategoryId(null);

      return category;
    },
    [setCategories, setSelectedCategoryId, syncSharedCategoryMembers],
  );

  const updateCategory = useCallback(
    async (categoryId: string, input: UpdateCategoryInput) => {
      const previousCategory = categories.find(
        (category) => category.id === categoryId,
      );
      const category = await updateCategoryApi(categoryId, input);
      const nextMembers = input.isShared ? input.members ?? [] : [];

      await syncSharedCategoryMembers(
        categoryId,
        input.previousMembers ?? previousCategory?.members,
        nextMembers,
        Boolean(previousCategory?.isShared),
        Boolean(input.isShared),
      );

      setCategories((previousCategories) =>
        category
          ? previousCategories.map((previousCategory) =>
              previousCategory.id === categoryId
                ? {
                    ...category,
                    items: previousCategory.items,
                    tasks: previousCategory.tasks,
                    isShared:
                      input.isShared ??
                      category.isShared ??
                      previousCategory.isShared,
                    members: input.isShared
                      ? nextMembers
                      : category.members ?? previousCategory.members,
                  }
                : previousCategory,
            )
          : updateCategoryInList(previousCategories, categoryId, input),
      );
    },
    [categories, setCategories, syncSharedCategoryMembers],
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
