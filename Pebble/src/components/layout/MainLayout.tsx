import { useEffect, useState } from "react";
import { Outlet, useNavigate, useSearchParams } from "react-router-dom";

import { GlobalNavigationBar } from "@/components/layout/GlobalNavigationBar";
import { CalendarSidebar } from "@/features/milestone/components/CalendarSidebar";
import { SidebarDivider } from "@/features/milestone/components/SidebarDivider";
import { dummyCategories } from "@/mocks/dummyData";
import type { Category } from "@/types";

const ORIGINAL_WIDTH = 1416;
const ORIGINAL_HEIGHT = 1000;

export interface MainLayoutContext {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  categories: Category[];
  onDeleteCategory: (categoryId: string) => void;
  onDeleteMilestone: (categoryId: string, milestoneId: string) => void;
  onDeleteTask: (
    categoryId: string,
    milestoneId: string,
    taskId: string,
  ) => void;
}

export const MainLayout = (): JSX.Element => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [scale, setScale] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [categories, setCategories] = useState<Category[]>(dummyCategories);
  const selectedCategoryId = searchParams.get("category");

  useEffect(() => {
    const handleResize = () => {
      const availableWidth = window.innerWidth - 24;
      const availableHeight = window.innerHeight - 24;

      const widthScale = availableWidth / ORIGINAL_WIDTH;
      const heightScale = availableHeight / ORIGINAL_HEIGHT;

      const nextScale = Math.min(widthScale, heightScale, 1);
      setScale(Math.max(0.5, nextScale));
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleToggleSidebar = () => {
    setIsSidebarOpen((previous) => !previous);
  };

  const handleSelectCategory = (categoryId: string) => {
    navigate(`/?category=${categoryId}`);
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories((prev) =>
      prev.filter((category) => category.id !== categoryId),
    );
    navigate("/");
  };

  const handleDeleteMilestone = (
    categoryId: string,
    milestoneId: string,
  ) => {
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

  const handleDeleteTask = (
    categoryId: string,
    milestoneId: string,
    taskId: string,
  ) => {
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
    <main className="flex min-h-screen w-full items-center justify-center overflow-hidden bg-fill-surface">
      <div
        className="relative"
        style={{
          width: ORIGINAL_WIDTH * scale,
          height: ORIGINAL_HEIGHT * scale,
        }}
      >
        <div
          className="absolute left-0 top-0 flex origin-top-left gap-4"
          style={{
            transform: `scale(${scale})`,
          }}
        >
          <div className="relative flex h-[1000px] shrink-0 overflow-hidden rounded-[20px] shadow-shadow-m">
            <GlobalNavigationBar />
            <SidebarDivider visible={isSidebarOpen} />
            <CalendarSidebar
              isSidebarOpen={isSidebarOpen}
              categories={categories}
              onSelectCategory={handleSelectCategory}
              selectedCategoryId={selectedCategoryId}
            />
          </div>

          <Outlet
            context={{
              isSidebarOpen,
              onToggleSidebar: handleToggleSidebar,
              categories,
              onDeleteCategory: handleDeleteCategory,
              onDeleteMilestone: handleDeleteMilestone,
              onDeleteTask: handleDeleteTask,
            }}
          />
        </div>
      </div>
    </main>
  );
};
