import { type Category } from "@/types";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { getTaskCompletionTargets } from "@/features/task/utils/taskCompletion";

type CategoryDetailHeaderProps = {
  category: Category;
  onEdit: () => void;
};

export const CategoryDetailHeader = ({ category, onEdit }: CategoryDetailHeaderProps) => {
  const categoryTasks = category.tasks ?? [];
  const milestoneTasks = category.items.flatMap((item) => item.tasks ?? []);
  const totalTasksCount = categoryTasks.length + milestoneTasks.length;
  const progressTargets = [
    ...category.items.map((item) => Boolean(item.isCompleted)),
    ...categoryTasks.flatMap(getTaskCompletionTargets),
    ...milestoneTasks.flatMap(getTaskCompletionTargets),
  ];
  const completedTargetsCount = progressTargets.filter(Boolean).length;
  const progress =
    progressTargets.length > 0
      ? Math.round((completedTargetsCount / progressTargets.length) * 100)
      : 0;
  const visibilityLabel = category.isPublic ? "공개" : "비공개";

  return (
    <div className="absolute left-[72px] top-[112px] flex items-center gap-10">
      {/* 썸네일 */}
      <div className="w-44 h-[240px] rounded-token-s border border-border-default overflow-hidden relative bg-fill-surface dark:border-border-secondary">
        {category.imageUrl ? (
          <img
            className="w-full h-full object-cover"
            src={category.imageUrl}
            alt={`${category.title} 썸네일`}
          />
        ) : (
          <div
            className="h-full w-full"
            style={{ backgroundColor: category.themeBase }}
            aria-label={`${category.title} 대표 색상`}
          />
        )}
      </div>

      {/* 카테고리 정보 */}
      <div className="w-[560px] flex flex-col gap-16">
        <div className="flex flex-col gap-5 w-full">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-3">
              <div
                className="w-2 h-12 rounded-sm"
                style={{ backgroundColor: category.themeBase }}
              />
              <h1 className="text-heading-02 text-text-strong">
                {category.title}
              </h1>
            </div>
            <button 
              onClick={onEdit}
              className="px-5 py-3 rounded-token-s border border-border-default text-body-02-m text-text-secondary hover:bg-fill-surface transition-colors dark:border-border-secondary"
            >
              카테고리 편집
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <div
              className="px-3 py-1 rounded-token-infinite"
              style={{ backgroundColor: category.themeLight }}
            >
              <span className="text-body-02-m text-text-primary">
                {visibilityLabel}
              </span>
            </div>
            <div className="px-3 py-1 bg-btn-quaternary rounded-token-infinite flex items-center gap-1">
              <span className="text-body-02-m text-text-primary">마일스톤</span>
              <span className="text-body-02-m text-text-primary">{category.items.length}개</span>
            </div>
            <div className="px-3 py-1 bg-btn-quaternary rounded-token-infinite flex items-center gap-1">
              <span className="text-body-02-m text-text-primary">태스크</span>
              <span className="text-body-02-m text-text-primary">
                {totalTasksCount}개
              </span>
            </div>
          </div>
        </div>

        <ProgressBar
          progress={category.isCompleted ? 100 : progress}
          themeBaseColor={category.themeBase}
        />
      </div>
    </div>
  );
};
