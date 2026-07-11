import { CalendarBoard } from "@/features/milestone/components/CalendarBoard";
import { CalendarSidebar } from "@/features/milestone/components/CalendarSidebar";
import { dummyCategories } from "@/mocks/dummyData";
import { CategoryDetailSection } from "@/features/category/components/CategoryDetailSection";
import { type Category } from "@/types";
import { useEffect, useState } from "react";

export const CalendarMainPage = (): JSX.Element => {
  const [scale, setScale] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>(dummyCategories);

  // 전체 레이아웃의 원본 총 크기는 Figma 프레임 기준 1416px로 고정됩니다.
  // 사이드바가 닫히면 줄어든 392px만큼 캘린더가 넓어져서 총합을 유지합니다.
  const ORIGINAL_WIDTH = 1416;
  const ORIGINAL_HEIGHT = 1000;

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      const availableWidth = width - 24;
      const availableHeight = height - 24;

      const widthScale = availableWidth / ORIGINAL_WIDTH;
      const heightScale = availableHeight / ORIGINAL_HEIGHT;
      
      const newScale = Math.min(widthScale, heightScale, 1);
      setScale(Math.max(0.5, newScale));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [ORIGINAL_WIDTH]);

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

  const handleDeleteCategory = (categoryId: string) => {
    setCategories((prev) => prev.filter((category) => category.id !== categoryId));
    setSelectedCategoryId(null);
  };

  const handleDeleteMilestone = (categoryId: string, milestoneId: string) => {
    setCategories((prev) =>
      prev.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              items: category.items.filter((item) => item.id !== milestoneId),
            }
          : category,
      ),
    );
  };

  const handleDeleteTask = (categoryId: string, milestoneId: string, taskId: string) => {
    setCategories((prev) =>
      prev.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              items: category.items.map((item) =>
                item.id === milestoneId
                  ? {
                      ...item,
                      tasks: item.tasks?.filter((task) => task.id !== taskId),
                    }
                  : item,
              ),
            }
          : category,
      ),
    );
  };

  return (
    <main
      className="bg-fill-surface w-full min-h-screen flex items-center justify-center overflow-hidden"
      data-id="main-screen"
    >
      <div 
        style={{ 
          width: ORIGINAL_WIDTH * scale, 
          height: ORIGINAL_HEIGHT * scale 
        }} 
        className="relative"
      >
        <div 
          className="flex gap-4 absolute left-0 top-0 origin-top-left"
          style={{ transform: `scale(${scale})` }}
        >
          <CalendarSidebar 
            isSidebarOpen={isSidebarOpen} 
            categories={categories}
            onSelectCategory={setSelectedCategoryId}
            selectedCategoryId={selectedCategoryId}
          />
          {selectedCategory ? (
            <CategoryDetailSection
              isSidebarOpen={isSidebarOpen}
              category={selectedCategory}
              onBack={() => setSelectedCategoryId(null)}
              categories={categories}
              onDeleteCategory={handleDeleteCategory}
              onDeleteMilestone={handleDeleteMilestone}
              onDeleteTask={handleDeleteTask}
            />
          ) : (
            <CalendarBoard 
              isSidebarOpen={isSidebarOpen} 
              onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
            />
          )}
        </div>
      </div>
    </main>
  );
};
