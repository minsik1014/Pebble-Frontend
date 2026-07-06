import { useMemo, useState } from "react";
import { categories } from "@/features/milestone/constants";
import CardViewIcon from "@/assets/icons/card-view.svg?react";
import ListViewIcon from "@/assets/icons/list-view.svg?react";

import { CategoryFormModal } from "./CategoryFormModal";
import { GlobalNavigationBar } from "@/components/layout/GlobalNavigationBar";
import { MilestoneAccordion } from "./MilestoneAccordion";
import { AddButton } from "@/components/ui/AddButton";

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
  >({
    expo: true,
    "final-exam": true,
    "startup-contest": true,
  });
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
      className={`flex mt-token-m shrink-0 h-[1000px] relative items-stretch rounded-[20px] overflow-hidden shadow-shadow-m transition-all duration-300 ${
        isSidebarOpen ? "w-[476px]" : "w-[84px]"
      }`}
    >
      {/* 얇은 좌측 네비게이션 */}
      <GlobalNavigationBar />

      {/* 메인 마일스톤 관리 영역 */}
      <section 
        className={`relative h-[1000px] bg-fill-inverse rounded-[0px_32px_32px_0px] flex flex-col transition-all duration-300 overflow-hidden ${
          isSidebarOpen ? "w-[392px] opacity-100" : "w-0 opacity-0"
        }`}
      >
        <div className="w-[392px] min-w-[392px] h-[1000px] flex flex-col">
          <header className="flex w-full h-[100px] shrink-0 items-center justify-between pt-token-xl pb-token-l px-token-l bg-fill-inverse z-10 rounded-tr-[32px]">
          <div className="text-heading-02 text-text-strong">
            {monthLabel}
          </div>
          <div
            className="inline-flex items-center gap-1 p-1 bg-btn-quaternary rounded-token-s"
            role="tablist"
            aria-label="보기 전환"
          >
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === "card"}
              aria-label="카드 보기"
              onClick={() => setViewMode("card")}
              className={`flex items-center justify-center p-2 rounded-[9px] transition-colors ${
                viewMode === "card" ? "bg-fill-inverse shadow-sm text-text-strong" : "text-text-secondary hover:text-text-strong"
              }`}
            >
              <CardViewIcon className="w-6 h-6" />
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === "list"}
              aria-label="리스트 보기"
              onClick={() => setViewMode("list")}
              className={`flex items-center justify-center p-2 rounded-[9px] transition-colors ${
                viewMode === "list" ? "bg-fill-inverse shadow-sm text-text-strong" : "text-text-secondary hover:text-text-strong"
              }`}
            >
              <ListViewIcon className="w-6 h-6" />
            </button>
          </div>
        </header>
        {/* Flexbox에서 내용이 부모를 뚫고 나가는 것을 방지하기 위해 min-h-0 추가 */}
        <div className="w-full h-[888px] min-h-0 flex flex-col items-center gap-5 pt-1 pb-3 px-5 border-l border-border-default overflow-y-auto overflow-x-hidden custom-scrollbar">
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
            label="카테고리 생성" 
            variant="primary" 
            className="w-[352px]" 
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
