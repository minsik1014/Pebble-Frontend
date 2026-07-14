import { useMemo, useState } from "react";
import { dummyCategories as categories } from "@/mocks/dummyData";

import { CategoryFormModal } from "@/features/category/components/CategoryFormModal";
import { MilestoneAccordion } from "./MilestoneAccordion";
import { AddButton } from "@/components/ui/AddButton";
import { CalendarSidebarHeader } from "./CalendarSidebarHeader";

export const CalendarSidebar = ({
  isSidebarOpen = true,
  onSelectCategory
}: {
  isSidebarOpen?: boolean;
  onSelectCategory?: (categoryId: string) => void;
}): JSX.Element => {
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const monthLabel = useMemo(() => "6월", []);

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
          <div className="relative -left-px w-full h-[888px] min-h-0 flex flex-col items-start gap-5 pt-1 pb-3 px-5 overflow-y-auto overflow-x-hidden custom-scrollbar">
            {categories.map((category) => (
              <MilestoneAccordion
                key={category.id}
                category={category}
                expanded={Boolean(expandedCategories[category.id])}
                onToggleExpanded={() => toggleCategory(category.id)}
                checkedItems={checkedItems}
                onToggleChecked={toggleCheckedItem}
                onSelectCategory={onSelectCategory}
              />
            ))}

            <AddButton 
              label="추가하기" 
              variant="primary" 
              className="w-[352px]" 
              showIcon={false}
              onClick={() => setIsCreateModalOpen(true)}
            />
          </div>
        </div>
      </section>
      
      <CategoryFormModal 
        isOpen={isCreateModalOpen} 
        mode="create"
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </aside>
  );
};
