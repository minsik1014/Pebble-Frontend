import { useEffect, useMemo, useRef, useState } from "react";
import { type Category } from "@/types";

import { CategoryFormModal } from "@/features/category/components/CategoryFormModal";
import { MilestoneFormModal } from "./MilestoneFormModal";
import { TaskFormModal } from "@/features/task/components/TaskFormModal";
import { AddMenuModal } from "./AddMenuModal";
import { MilestoneAccordion } from "./MilestoneAccordion";
import { AddButton } from "@/components/ui/AddButton";
import { CalendarSidebarHeader } from "./CalendarSidebarHeader";
import type {
  CreateCategoryInput,
  CreateScheduleItemInput,
} from "@/features/calendar/hooks/useCalendarState";

export const CalendarSidebar = ({
  isSidebarOpen = true,
  categories,
  onSelectCategory,
  selectedCategoryId,
  onCreateCategory,
  onCreateMilestone,
  onCreateTask,
}: {
  isSidebarOpen?: boolean;
  categories: Category[];
  onSelectCategory?: (categoryId: string) => void;
  selectedCategoryId?: string | null;
  onCreateCategory?: (input: CreateCategoryInput) => void;
  onCreateMilestone?: (
    categoryId: string,
    input: CreateScheduleItemInput,
  ) => void;
  onCreateTask?: (
    categoryId: string,
    milestoneId: string,
    input: CreateScheduleItemInput,
  ) => void;
}): JSX.Element => {
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [hasHiddenContentUnderButton, setHasHiddenContentUnderButton] = useState(false);
  const categoryListRef = useRef<HTMLDivElement>(null);

  const monthLabel = useMemo(() => `${new Date().getMonth() + 1}월`, []);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const toggleCheckedItem = (itemId: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  useEffect(() => {
    const categoryList = categoryListRef.current;

    if (!categoryList) {
      return;
    }

    const updateButtonShadow = () => {
      const hasOverflow = categoryList.scrollHeight > categoryList.clientHeight;
      const isScrolledToBottom =
        categoryList.scrollTop + categoryList.clientHeight >=
        categoryList.scrollHeight - 1;

      setHasHiddenContentUnderButton(hasOverflow && !isScrolledToBottom);
    };

    updateButtonShadow();
    categoryList.addEventListener("scroll", updateButtonShadow);

    const resizeObserver = new ResizeObserver(updateButtonShadow);
    resizeObserver.observe(categoryList);

    return () => {
      categoryList.removeEventListener("scroll", updateButtonShadow);
      resizeObserver.disconnect();
    };
  }, [categories, expandedCategories]);

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
              ref={categoryListRef}
              className="flex max-h-[calc(100%-56px)] flex-col items-start gap-5 overflow-y-auto overflow-x-hidden custom-scrollbar"
            >
              {categories.map((category) => (
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
              className={`relative z-10 mt-2 shrink-0 transition-shadow ${
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
    </aside>
  );
};
