import { useState } from "react";
import { type Category, type ScheduleItem } from "@/types";

import { CategoryFormModal } from "@/features/category/components/CategoryFormModal";
import { MilestoneFormModal } from "./MilestoneFormModal";
import {
  TaskFormModal,
  type TaskFormSubmitInput,
} from "@/features/task/components/TaskFormModal";
import { StandaloneTaskSection } from "@/features/task/components/StandaloneTaskSection";
import { AddMenuModal } from "./AddMenuModal";
import { MilestoneAccordion } from "./MilestoneAccordion";
import { AddButton } from "@/components/ui/AddButton";
import { CalendarSidebarHeader } from "./CalendarSidebarHeader";
import { useCalendarSidebarState } from "@/features/milestone/hooks/useCalendarSidebarState";
import { useSidebarButtonShadow } from "@/features/milestone/hooks/useSidebarButtonShadow";
import type {
  CreateCategoryInput,
  CreateScheduleItemInput,
} from "@/features/calendar/types";

export const CalendarSidebar = ({
  isSidebarOpen = true,
  categories,
  standaloneTasks,
  currentYear,
  currentMonth,
  onSelectCategory,
  selectedCategoryId,
  onCreateCategory,
  onCreateMilestone,
  onCreateTask,
  onUpdateStandaloneTask,
  onDeleteStandaloneTask,
}: {
  isSidebarOpen?: boolean;
  categories: Category[];
  standaloneTasks: ScheduleItem[];
  currentYear: number;
  currentMonth: number;
  onSelectCategory?: (categoryId: string) => void;
  selectedCategoryId?: string | null;
  onCreateCategory?: (input: CreateCategoryInput) => void;
  onCreateMilestone?: (
    categoryId: string,
    input: CreateScheduleItemInput,
  ) => void;
  onCreateTask?: (input: TaskFormSubmitInput) => void;
  onUpdateStandaloneTask?: (
    taskId: string,
    input: CreateScheduleItemInput,
  ) => void;
  onDeleteStandaloneTask?: (taskId: string) => void;
}): JSX.Element => {
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingStandaloneTaskId, setEditingStandaloneTaskId] = useState<
    string | null
  >(null);

  const {
    viewMode,
    setViewMode,
    expandedCategories,
    checkedItems,
    monthLabel,
    displayedCategories,
    displayedStandaloneTasks,
    hasDisplayedSchedules,
    toggleCategory,
    toggleCheckedItem,
  } = useCalendarSidebarState({
    categories,
    standaloneTasks,
    currentYear,
    currentMonth,
  });
  const { scrollContainerRef, hasHiddenContentUnderButton } =
    useSidebarButtonShadow({
      displayedCategories,
      displayedStandaloneTasks,
      expandedCategories,
    });
  const editingStandaloneTask =
    standaloneTasks.find((task) => task.id === editingStandaloneTaskId) ?? null;

  return (
    <aside 
      className={`flex shrink-0 h-[1000px] relative items-stretch overflow-hidden transition-all duration-300 ${
        isSidebarOpen ? "w-[392px]" : "w-0"
      }`}
    >
      {/* 메인 마일스톤 관리 영역 */}
      <section 
        className={`relative h-[1000px] bg-fill-inverse rounded-[0px_32px_32px_0px] flex flex-col transition-all duration-300 overflow-hidden ${
          isSidebarOpen ? "w-[392px] opacity-100" : "w-0 opacity-0"
        }`}
      >
        <div className="w-[392px] min-w-[392px] h-[1000px] flex flex-col">
          <CalendarSidebarHeader
            monthLabel={monthLabel}
            viewMode={viewMode}
            onChangeViewMode={setViewMode}
          />
          {/* Flexbox에서 내용이 부모를 뚫고 나가는 것을 방지하기 위해 min-h-0 추가 */}
          <div className="relative -left-px flex min-h-0 h-[888px] w-full flex-col px-5 pb-3 pt-1">
            <div
              ref={scrollContainerRef}
              className="flex max-h-[calc(100%-56px)] flex-col items-start gap-5 overflow-y-auto overflow-x-hidden custom-scrollbar"
            >
              {displayedStandaloneTasks.length > 0 && (
                <StandaloneTaskSection
                  tasks={displayedStandaloneTasks}
                  checkedItems={checkedItems}
                  onToggleChecked={toggleCheckedItem}
                  onEditTask={setEditingStandaloneTaskId}
                />
              )}

              {displayedCategories.map((category) => (
                <MilestoneAccordion
                  key={category.id}
                  category={category}
                  expanded={Boolean(expandedCategories[category.id])}
                  onToggleExpanded={() => toggleCategory(category.id)}
                  checkedItems={checkedItems}
                  onToggleChecked={toggleCheckedItem}
                  onSelectCategory={onSelectCategory}
                  isSelected={selectedCategoryId === category.id}
                />
              ))}
            </div>

            <div
              className={`relative z-10 shrink-0 transition-shadow ${
                hasDisplayedSchedules ? "mt-2" : "mt-auto"
              } ${
                hasHiddenContentUnderButton
                  ? "shadow-[0_-12px_24px_rgba(33,37,41,0.08)]"
                  : "shadow-none"
              }`}
            >
              <AddButton
                label="추가하기"
                variant="primary"
                className="w-[352px]"
                showIcon={false}
                onClick={() => setIsAddMenuOpen(true)}
              />
            </div>
          </div>
        </div>
      </section>
      
      <AddMenuModal
        isOpen={isAddMenuOpen}
        onClose={() => setIsAddMenuOpen(false)}
        onSelectCategory={() => setIsCreateModalOpen(true)}
        onSelectMilestone={() => setIsMilestoneModalOpen(true)}
        onSelectTask={() => setIsTaskModalOpen(true)}
      />

      <CategoryFormModal 
        isOpen={isCreateModalOpen} 
        mode="create"
        onSubmit={onCreateCategory}
        onClose={() => setIsCreateModalOpen(false)} 
      />

      <MilestoneFormModal
        isOpen={isMilestoneModalOpen}
        onClose={() => setIsMilestoneModalOpen(false)}
        categories={categories}
        onSubmit={onCreateMilestone}
      />

      <TaskFormModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        categories={categories}
        onSubmit={onCreateTask}
      />

      <TaskFormModal
        isOpen={Boolean(editingStandaloneTask)}
        onClose={() => setEditingStandaloneTaskId(null)}
        categories={categories}
        task={editingStandaloneTask}
        mode="edit"
        onSubmit={({ task }) => {
          if (!editingStandaloneTaskId) {
            return;
          }

          onUpdateStandaloneTask?.(editingStandaloneTaskId, task);
          setEditingStandaloneTaskId(null);
        }}
        onRequestDelete={() => {
          if (!editingStandaloneTaskId) {
            return;
          }

          onDeleteStandaloneTask?.(editingStandaloneTaskId);
          setEditingStandaloneTaskId(null);
        }}
      />
    </aside>
  );
};
