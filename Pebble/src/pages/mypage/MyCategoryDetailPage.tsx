import ChevronLeftIcon from "@/assets/icons/chevron-left.svg?react";
import { useCalendarLayoutContext } from "@/features/calendar/context/useCalendarLayoutContext";
import { MyCategoryDetailHeader } from "@/features/mypage/components/MyCategoryDetailHeader";
import { MyCategoryMilestoneItem } from "@/features/mypage/components/MyCategoryMilestoneItem";
import { completedCategoryMocks } from "@/features/mypage/mock/completedCategoryMock";
import { useNavigate, useParams } from "react-router-dom";

export default function MyCategoryDetailPage(): JSX.Element {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const { isSidebarOpen } = useCalendarLayoutContext();
  const detail = completedCategoryMocks.find(
    ({ category }) => category.id === categoryId,
  );

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
          {detail ? (
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
