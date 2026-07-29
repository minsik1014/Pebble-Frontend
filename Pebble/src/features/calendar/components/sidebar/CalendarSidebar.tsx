import { type Category, type MilestoneItem, type TaskItem } from "@/types";

import { CategoryFormModal } from "@/features/category/components/CategoryFormModal";
import { MilestoneFormModal } from "@/features/milestone/components/MilestoneFormModal";
import {
  TaskFormModal,
  type TaskFormSubmitInput,
} from "@/features/task/components/TaskFormModal";
import { StandaloneTaskSection } from "@/features/task/components/StandaloneTaskSection";
import { AddMenuModal } from "./AddMenuModal";
import { MilestoneAccordion } from "@/features/milestone/components/MilestoneAccordion";
import { AddButton } from "@/components/ui/AddButton";
import { CalendarSidebarHeader } from "./CalendarSidebarHeader";
import { CalendarSidebarListView } from "./CalendarSidebarListView";
import { useCalendarSidebarModals } from "@/features/calendar/hooks/useCalendarSidebarModals";
import { useCalendarSidebarState } from "@/features/calendar/hooks/useCalendarSidebarState";
import { useSidebarButtonShadow } from "@/features/calendar/hooks/useSidebarButtonShadow";
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
  onToggleMilestoneCompleted,
  onToggleCategoryTaskCompleted,
  onToggleTaskCompleted,
  onToggleStandaloneTaskCompleted,
}: {
  isSidebarOpen?: boolean;
  categories: Category[];
  standaloneTasks: TaskItem[];
  currentYear: number;
  currentMonth: number;
  onSelectCategory?: (categoryId: string) => void;
  selectedCategoryId?: string | null;
  onCreateCategory?: (input: CreateCategoryInput) => void | Promise<void>;
  onCreateMilestone?: (
    categoryId: string,
    input: CreateScheduleItemInput,
  ) => void | Promise<MilestoneItem[]>;
  onCreateTask?: (input: TaskFormSubmitInput) => void | Promise<void>;
  onUpdateStandaloneTask?: (
    taskId: string,
    input: CreateScheduleItemInput,
  ) => void | Promise<void>;
  onDeleteStandaloneTask?: (taskId: string) => void | Promise<void>;
  onToggleMilestoneCompleted?: (
    categoryId: string,
    milestoneId: string,
  ) => void | Promise<void>;
  onToggleCategoryTaskCompleted?: (
    categoryId: string,
    taskId: string,
  ) => void | Promise<void>;
  onToggleTaskCompleted?: (
    categoryId: string,
    milestoneId: string,
    taskId: string,
  ) => void | Promise<void>;
  onToggleStandaloneTaskCompleted?: (taskId: string) => void | Promise<void>;
}): JSX.Element => {
  const {
    viewMode,
    setViewMode,
    expandedCategories,
    monthLabel,
    displayedCategories,
    displayedStandaloneTasks,
    hasDisplayedSchedules,
    toggleCategory,
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
      viewMode,
    });
  const {
    isAddMenuOpen,
    openAddMenu,
    closeAddMenu,
    isCategoryModalOpen,
    isMilestoneModalOpen,
    isTaskModalOpen,
    openCategoryModal,
    openMilestoneModal,
    openTaskModal,
    closeCreateModal,
    editingStandaloneTaskId,
    editingStandaloneTask,
    openStandaloneTaskEditor,
    closeStandaloneTaskEditor,
  } = useCalendarSidebarModals({ standaloneTasks });

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
              className="-mx-3 flex max-h-[calc(100%-56px)] w-[calc(100%+24px)] flex-col items-start gap-5 overflow-y-auto overflow-x-hidden px-3 py-3 custom-scrollbar"
            >
              {viewMode === "list" ? (
                <CalendarSidebarListView
                  categories={displayedCategories}
                  standaloneTasks={displayedStandaloneTasks}
                  currentYear={currentYear}
                  currentMonth={currentMonth}
                  onToggleMilestoneCompleted={onToggleMilestoneCompleted}
                  onToggleCategoryTaskCompleted={onToggleCategoryTaskCompleted}
                  onToggleTaskCompleted={onToggleTaskCompleted}
                  onToggleStandaloneTaskCompleted={onToggleStandaloneTaskCompleted}
                />
              ) : (
                <>
                  {displayedStandaloneTasks.length > 0 && (
                    <StandaloneTaskSection
                      tasks={displayedStandaloneTasks}
                      onToggleTaskCompleted={onToggleStandaloneTaskCompleted}
                      onEditTask={openStandaloneTaskEditor}
                    />
                  )}

                  {displayedCategories.map((category) => (
                    <MilestoneAccordion
                      key={category.id}
                      category={category}
                      expanded={Boolean(expandedCategories[category.id])}
                      onToggleExpanded={() => toggleCategory(category.id)}
                      onToggleMilestoneCompleted={onToggleMilestoneCompleted}
                      onToggleCategoryTaskCompleted={onToggleCategoryTaskCompleted}
                      onToggleTaskCompleted={onToggleTaskCompleted}
                      onSelectCategory={onSelectCategory}
                      isSelected={selectedCategoryId === category.id}
                    />
                  ))}
                </>
              )}
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
                onClick={openAddMenu}
              />
            </div>
          </div>
        </div>
      </section>
      
      <AddMenuModal
        isOpen={isAddMenuOpen}
        onClose={closeAddMenu}
        onSelectCategory={openCategoryModal}
        onSelectMilestone={openMilestoneModal}
        onSelectTask={openTaskModal}
      />

      <CategoryFormModal
        isOpen={isCategoryModalOpen}
        mode="create"
        onSubmit={onCreateCategory}
        onClose={closeCreateModal}
      />

      <MilestoneFormModal
        isOpen={isMilestoneModalOpen}
        onClose={closeCreateModal}
        categories={categories}
        onSubmit={async (categoryId, input) => {
          await onCreateMilestone?.(categoryId, input);
        }}
      />

      <TaskFormModal
        isOpen={isTaskModalOpen}
        onClose={closeCreateModal}
        categories={categories}
        onSubmit={onCreateTask}
      />

      <TaskFormModal
        isOpen={Boolean(editingStandaloneTask)}
        onClose={closeStandaloneTaskEditor}
        categories={categories}
        task={editingStandaloneTask}
        mode="edit"
        onSubmit={async ({ task }) => {
          if (!editingStandaloneTaskId) {
            return;
          }

          await onUpdateStandaloneTask?.(editingStandaloneTaskId, task);
          closeStandaloneTaskEditor();
        }}
        onRequestDelete={async () => {
          if (!editingStandaloneTaskId) {
            return;
          }

          await onDeleteStandaloneTask?.(editingStandaloneTaskId);
          closeStandaloneTaskEditor();
        }}
      />
    </aside>
  );
};
