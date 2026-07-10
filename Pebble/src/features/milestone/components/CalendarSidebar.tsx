import { useMemo, useState } from "react";
import { dummyCategories as categories } from "@/mocks/dummyData";

import { CategoryFormModal } from "@/features/category/components/CategoryFormModal";
import { MilestoneFormModal } from "./MilestoneFormModal";
import { AddMenuModal } from "./AddMenuModal";
import { GlobalNavigationBar } from "@/components/layout/GlobalNavigationBar";
import { MilestoneAccordion } from "./MilestoneAccordion";
import { AddButton } from "@/components/ui/AddButton";
import { CalendarSidebarHeader } from "./CalendarSidebarHeader";
import { SidebarDivider } from "./SidebarDivider";

export const CalendarSidebar = ({
  isSidebarOpen = true,
  onSelectCategory,
  selectedCategoryId
}: {
  isSidebarOpen?: boolean;
  onSelectCategory?: (categoryId: string) => void;
  selectedCategoryId?: string | null;
}): JSX.Element => {
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);

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
      className={`flex shrink-0 h-[1000px] relative items-stretch rounded-[20px] overflow-hidden shadow-shadow-m transition-all duration-300 ${
        isSidebarOpen ? "w-[476px]" : "w-[84px]"
      }`}
    >
      {/* 얇은 좌측 네비게이션 */}
      <GlobalNavigationBar />
      <SidebarDivider visible={isSidebarOpen} />

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
                isSelected={selectedCategoryId === category.id}
              />
            ))}

            <AddButton 
              label="추가하기" 
              variant="primary" 
              className="w-[352px]" 
              showIcon={false}
              onClick={() => setIsAddMenuOpen(true)}
            />
          </div>
        </div>
      </section>
      
      <AddMenuModal
        isOpen={isAddMenuOpen}
        onClose={() => setIsAddMenuOpen(false)}
        onSelectCategory={() => setIsCreateModalOpen(true)}
        onSelectMilestone={() => setIsMilestoneModalOpen(true)}
        onSelectTask={() => alert("태스크 추가는 추후 구현 예정입니다.")}
      />

      <CategoryFormModal 
        isOpen={isCreateModalOpen} 
        mode="create"
        onClose={() => setIsCreateModalOpen(false)} 
      />

      <MilestoneFormModal
        isOpen={isMilestoneModalOpen}
        onClose={() => setIsMilestoneModalOpen(false)}
        categories={categories}
      />
    </aside>
  );
};
