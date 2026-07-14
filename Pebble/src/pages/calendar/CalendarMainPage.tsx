import { CalendarBoard } from "@/features/milestone/components/CalendarBoard";
import { dummyCategories as categories } from "@/mocks/dummyData";
import { CategoryDetailSection } from "@/features/category/components/CategoryDetailSection";
import type { MainLayoutContext } from "@/components/layout/MainLayout";
import { useOutletContext, useSearchParams } from "react-router-dom";

export const CalendarMainPage = (): JSX.Element => {
  const { isSidebarOpen, onToggleSidebar } =
    useOutletContext<MainLayoutContext>();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategoryId = searchParams.get("category");

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

  return selectedCategory ? (
    <CategoryDetailSection
      isSidebarOpen={isSidebarOpen}
      category={selectedCategory}
      onBack={() => setSearchParams({})}
    />
  ) : (
    <CalendarBoard
      isSidebarOpen={isSidebarOpen}
      onToggleSidebar={onToggleSidebar}
    />
  );
};
