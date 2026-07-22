import { type Category, type TaskItem } from "@/types";

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
import { useCalendarSidebarModals } from "@/features/milestone/hooks/useCalendarSidebarModals";
import { useCalendarSidebarState } from "@/features/milestone/hooks/useCalendarSidebarState";
import { useSidebarButtonShadow } from "@/features/milestone/hooks/useSidebarButtonShadow";
import { RESPONSIVE_CALENDAR_SIDEBAR_WIDTH_CLASS } from "@/components/layout/layoutTokens";
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
  standaloneTasks: TaskItem[];
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
      className={`flex h-full shrink-0 relative items-stretch overflow-hidden transition-all duration-300 ${
        isSidebarOpen ? RESPONSIVE_CALENDAR_SIDEBAR_WIDTH_CLASS : "w-0"
      }`}
    >
      {/* 메인 마일스톤 관리 영역 */}
      <section 
        className={`relative h-full bg-fill-inverse rounded-[0px_32px_32px_0px] flex flex-col transition-all duration-300 overflow-hidden ${
          isSidebarOpen
            ? `${RESPONSIVE_CALENDAR_SIDEBAR_WIDTH_CLASS} opacity-100`
            : "w-0 opacity-0"
        }`}
      >
        <div
          className={`flex h-full min-w-[336px] flex-col ${RESPONSIVE_CALENDAR_SIDEBAR_WIDTH_CLASS}`}
        >
          <CalendarSidebarHeader
            monthLabel={monthLabel}
            viewMode={viewMode}
            onChangeViewMode={setViewMode}
          />
          {/* Flexbox에서 내용이 부모를 뚫고 나가는 것을 방지하기 위해 min-h-0 추가 */}
          <div className="relative -left-px flex min-h-0 flex-1 w-full flex-col px-5 pb-3 pt-1">
            <div
              ref={scrollContainerRef}
              className="-mx-3 flex max-h-[calc(100%-56px)] w-[calc(100%+24px)] flex-col items-start gap-5 overflow-y-auto overflow-x-hidden px-3 py-3 custom-scrollbar"
            >
              {displayedStandaloneTasks.length > 0 && (
                <StandaloneTaskSection
                  tasks={displayedStandaloneTasks}
                  checkedItems={checkedItems}
                  onToggleChecked={toggleCheckedItem}
                  onEditTask={openStandaloneTaskEditor}
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
        onSubmit={onCreateMilestone}
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
        onSubmit={({ task }) => {
          if (!editingStandaloneTaskId) {
            return;
          }

          onUpdateStandaloneTask?.(editingStandaloneTaskId, task);
          closeStandaloneTaskEditor();
        }}
        onRequestDelete={() => {
          if (!editingStandaloneTaskId) {
            return;
          }

          onDeleteStandaloneTask?.(editingStandaloneTaskId);
          closeStandaloneTaskEditor();
        }}
      />
    </aside>
  );
};
