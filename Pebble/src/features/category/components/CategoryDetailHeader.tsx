import { type Category } from "@/types";
import { ProgressBar } from "@/components/ui/ProgressBar";

type CategoryDetailHeaderProps = {
  category: Category;
  onEdit: () => void;
};

export const CategoryDetailHeader = ({ category, onEdit }: CategoryDetailHeaderProps) => {
  const totalTasksCount = category.items.reduce((acc, item) => acc + (item.tasks?.length || 0), 0);

  return (
    <div className="absolute left-[72px] top-[112px] flex items-center gap-10">
      {/* 썸네일 */}
      <div className="w-44 h-[240px] rounded-token-s border border-border-default overflow-hidden relative bg-fill-surface">
        <img
          className="w-full h-full object-cover"
          src="https://placehold.co/180x240"
          alt={`${category.title} 썸네일`}
        />
      </div>

      {/* 카테고리 정보 */}
      <div className="w-[560px] flex flex-col gap-16">
        <div className="flex flex-col gap-5 w-full">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-12 rounded-sm ${category.themeBase}`} />
              <h1 className="text-heading-02 text-text-strong">
                {category.title}
              </h1>
            </div>
            <button 
              onClick={onEdit}
              className="px-5 py-3 rounded-token-s border border-border-default text-body-02-m text-text-secondary hover:bg-fill-surface transition-colors"
            >
              카테고리 편집
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <div className={`px-3 py-1 rounded-token-infinite ${category.themeLight}`}>
              <span className="text-body-02-m text-text-primary">공개</span>
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
          progress={0} 
          themeBaseClass={category.themeBase}
        />
      </div>
    </div>
  );
};
