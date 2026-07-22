import type { CompletedCategoryDetail } from "@/features/mypage/types/completedCategory";

type MyCategoryDetailHeaderProps = {
  detail: CompletedCategoryDetail;
};

export const MyCategoryDetailHeader = ({
  detail,
}: MyCategoryDetailHeaderProps): JSX.Element => {
  const { category, cardBackgroundClassName, isPrivate, progress } = detail;
  const taskCount = category.items.reduce(
    (total, milestone) => total + (milestone.tasks?.length ?? 0),
    0,
  );

  return (
    <header className="flex items-center gap-10">
      <div
        className={`h-[188px] w-[142px] shrink-0 rounded-token-s ${cardBackgroundClassName}`}
        aria-hidden="true"
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <span
                className="h-10 w-2 rounded-token-xs"
                style={{ backgroundColor: category.themeBase }}
                aria-hidden="true"
              />
              <h1 className="text-heading-02 text-text-strong">
                {category.title}
              </h1>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <span
                className="rounded-token-infinite px-3 py-1 text-body-03-r text-text-primary"
                style={{ backgroundColor: category.themeLight }}
              >
                {isPrivate ? "비공개" : "공개"}
              </span>
              <span className="rounded-token-infinite bg-btn-quaternary px-3 py-1 text-body-03-r text-text-primary">
                마일스톤 {category.items.length}개
              </span>
              <span className="rounded-token-infinite bg-btn-quaternary px-3 py-1 text-body-03-r text-text-primary">
                태스크 {taskCount}개
              </span>
            </div>
          </div>

          <button
            type="button"
            className="h-12 shrink-0 rounded-token-s border border-border-default px-5 text-body-02-m text-text-secondary transition-colors hover:bg-fill-surface"
          >
            카테고리 편집
          </button>
        </div>

        <div className="mt-14">
          <div className="mb-2 flex items-center gap-2 text-body-03-r">
            <strong className="text-text-primary">현재 진행률</strong>
            <span style={{ color: category.themeBase }}>{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-token-infinite bg-fill-teritory">
            <div
              className="h-full rounded-token-infinite"
              style={{ width: `${progress}%`, backgroundColor: category.themeBase }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
