import ChevronLeftIcon from "@/assets/icons/chevron-left.svg?react";
import { useCalendarLayoutContext } from "@/features/calendar/context/useCalendarLayoutContext";
import { MyCategoryDetailHeader } from "@/features/mypage/components/MyCategoryDetailHeader";
import { MyCategoryMilestoneItem } from "@/features/mypage/components/MyCategoryMilestoneItem";
import { getCompletedOwnedCategories } from "@/features/category/api/categoryApi";
import { getMilestones } from "@/features/milestone/api/milestoneApi";
import type { CompletedCategoryDetail } from "@/features/mypage/types/completedCategory";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function MyCategoryDetailPage(): JSX.Element {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const { isSidebarOpen } = useCalendarLayoutContext();
  const [detail, setDetail] = useState<CompletedCategoryDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!categoryId) {
      setIsLoading(false);
      return;
    }

    let isActive = true;

    void Promise.all([
      getCompletedOwnedCategories(),
      getMilestones(categoryId),
    ])
      .then(([categories, milestones]) => {
        if (!isActive) {
          return;
        }

        const category = categories.find(({ id }) => id === categoryId);

        setDetail(
          category
            ? {
                category: { ...category, items: milestones },
                isPrivate: !category.isPublic,
                progress: 100,
              }
            : null,
        );
      })
      .catch(() => {
        if (isActive) {
          setDetail(null);
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [categoryId]);

  return (
    <section
      className={`relative h-[1000px] shrink-0 overflow-hidden rounded-[20px] bg-fill-inverse shadow-shadow-m transition-all duration-300 ${
        isSidebarOpen ? "w-[924px]" : "w-[1316px]"
      }`}
    >
      <button
        type="button"
        onClick={() => navigate("/my")}
        className="absolute left-6 top-8 z-20 flex h-11 items-center gap-2 rounded-token-s px-2 text-title-03-m text-text-strong transition-colors hover:bg-fill-surface"
        aria-label="마이페이지로 돌아가기"
      >
        <ChevronLeftIcon className="size-6" />
        <span>마이페이지</span>
      </button>

      <div className="h-full overflow-y-auto px-[72px] pb-12 custom-scrollbar">
        <div className="mx-auto w-[780px] pt-[110px]">
          {isLoading ? (
            <div className="flex h-[700px] items-center justify-center text-body-02-m text-text-teritary">
              카테고리를 불러오는 중이에요...
            </div>
          ) : detail ? (
            <>
              <MyCategoryDetailHeader detail={detail} />

              <section className="mt-9" aria-labelledby="milestone-heading">
                <div className="mb-5 flex items-end gap-2">
                  <h2
                    id="milestone-heading"
                    className="text-title-02-sb text-text-strong"
                  >
                    마일스톤
                  </h2>
                  <span className="text-title-03-m text-text-teritary">
                    {detail.category.items.length}
                  </span>
                </div>

                <div className="flex flex-col gap-4">
                  {detail.category.items.map((milestone, index) => (
                    <MyCategoryMilestoneItem
                      key={milestone.id}
                      milestone={milestone}
                      milestoneColor={detail.category.themeMid}
                      taskColor={detail.category.themeLight}
                      defaultExpanded={index === 1}
                    />
                  ))}
                </div>
              </section>
            </>
          ) : (
            <div className="flex h-[700px] flex-col items-center justify-center gap-3">
              <h1 className="text-title-02-sb text-text-strong">
                카테고리를 찾을 수 없어요
              </h1>
              <button
                type="button"
                onClick={() => navigate("/my")}
                className="text-body-02-m text-text-secondary underline"
              >
                마이페이지로 돌아가기
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
