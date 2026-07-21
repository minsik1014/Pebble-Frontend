import { useMemo, useState } from "react";

import type { TaskItem } from "@/types";

type CreateModalType = "category" | "milestone" | "task";

type UseCalendarSidebarModalsParams = {
  standaloneTasks: TaskItem[];
};

export const useCalendarSidebarModals = ({
  standaloneTasks,
}: UseCalendarSidebarModalsParams) => {
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [createModalType, setCreateModalType] =
    useState<CreateModalType | null>(null);
  const [editingStandaloneTaskId, setEditingStandaloneTaskId] = useState<
    string | null
  >(null);

  const editingStandaloneTask = useMemo(
    () =>
      standaloneTasks.find((task) => task.id === editingStandaloneTaskId) ??
      null,
    [standaloneTasks, editingStandaloneTaskId],
  );

  const closeCreateModal = () => {
    setCreateModalType(null);
  };

  const closeStandaloneTaskEditor = () => {
    setEditingStandaloneTaskId(null);
  };

  return {
    isAddMenuOpen,
    openAddMenu: () => setIsAddMenuOpen(true),
    closeAddMenu: () => setIsAddMenuOpen(false),
    isCategoryModalOpen: createModalType === "category",
    isMilestoneModalOpen: createModalType === "milestone",
    isTaskModalOpen: createModalType === "task",
    openCategoryModal: () => setCreateModalType("category"),
    openMilestoneModal: () => setCreateModalType("milestone"),
    openTaskModal: () => setCreateModalType("task"),
    closeCreateModal,
    editingStandaloneTaskId,
    editingStandaloneTask,
    openStandaloneTaskEditor: setEditingStandaloneTaskId,
    closeStandaloneTaskEditor,
  };
};
