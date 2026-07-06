import React from "react";
import ChevronLeftIcon from "@/assets/icons/chevron-left.svg?react";
import ChevronDownIcon from "@/assets/icons/chevron-down.svg?react";
import { CategoryFormModal } from "./CategoryFormModal";
import { DeleteCategoryModal } from "./DeleteCategoryModal";

type ScheduleItem = {
  id: string;
  title: string;
  start: string;
  end?: string;
  accent: string;
};

type Category = {
  id: string;
  title: string;
  accent: string;
  themeBase: string;
  themeMid: string;
  themeLight: string;
  items: ScheduleItem[];
};

export const CategoryDetailSection = ({
  isSidebarOpen,
  category,
  onBack,
}: {
  isSidebarOpen: boolean;
  category: Category;
  onBack: () => void;
}) => {
  const [expandedMilestones, setExpandedMilestones] = React.useState<Record<string, boolean>>({
    "startup-1": true, // 창업 공모전 - 백엔드 프로젝트 기본 열림
  });
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

  const toggleMilestone = (id: string) => {
    setExpandedMilestones((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section
      className={`relative h-[1000px] bg-fill-inverse rounded-[20px] shadow-shadow-m transition-all duration-300 overflow-hidden ${
        isSidebarOpen ? "w-[898px]" : "w-[1290px]"
      }`}
    >
      {/* 캘린더 돌아가기 버튼 */}
      <button
        onClick={onBack}
        className="absolute left-[20px] top-[36px] flex items-center gap-2 hover:opacity-80 transition-opacity"
        aria-label="캘린더로 돌아가기"
      >
        <div className="w-11 h-11 flex items-center justify-center rounded-xl relative">
          <ChevronLeftIcon className="w-6 h-6 text-text-strong" />
        </div>
        <span className="text-[24px] font-medium leading-8 text-text-strong font-['Pretendard']">
          캘린더
        </span>
      </button>

      {/* 카테고리 상세 상단부 */}
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
                onClick={() => setIsEditModalOpen(true)}
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
                  {category.items.reduce((acc, item) => acc + (item.tasks?.length || 0), 0)}개
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <div className="flex items-end gap-2">
              <span className="text-body-02-sb text-text-strong">현재 진행률</span>
              <span className={`text-[14px] font-medium leading-5 ${category.themeBase?.replace('bg-', 'text-') || ''}`}>
                0%
              </span>
            </div>
            <div className="w-full h-2 bg-fill-teritory rounded-token-infinite overflow-hidden">
              <div className={`h-full ${category.themeBase} w-0`} />
            </div>
          </div>
        </div>
      </div>

      {/* 마일스톤 목록 섹션 */}
      <div className="absolute left-[72px] top-[392px] flex items-end gap-2">
        <h2 className="text-title-02-sb text-text-strong">마일스톤</h2>
        <span className="text-[20px] font-medium leading-6 text-text-teritary">
          {category.items.length}
        </span>
      </div>

      <div className="absolute left-[72px] top-[443px] flex flex-col gap-5 w-[780px]">
        {category.items.map((item) => {
          const isExpanded = expandedMilestones[item.id];
          return (
            <div key={item.id} className="w-full bg-fill-inverse rounded-[20px] shadow-[0px_0px_14px_0px_rgba(23,23,23,0.05)] flex flex-col overflow-hidden">
              <div 
                className="w-full pl-5 pr-3 py-3 flex justify-between items-center bg-fill-inverse hover:bg-fill-surface transition-colors cursor-pointer"
                onClick={() => toggleMilestone(item.id)}
              >
                <div className="flex items-center gap-3 w-56">
                  <div className={`w-2 h-10 rounded-sm ${category.themeMid}`} />
                  <span className="text-title-03-sb text-text-strong truncate">
                    {item.title}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center">
                    <span className="text-body-02-m text-text-teritary">{item.start}</span>
                    {item.end && (
                      <>
                        <span className="text-body-02-m text-text-teritary mx-1">~</span>
                        <span className="text-body-02-m text-text-teritary">{item.end}</span>
                      </>
                    )}
                  </div>
                  <div className="w-6 h-6 rounded-token-xs border border-border-default" />
                  <button 
                    className="w-11 h-11 flex items-center justify-center rounded-token-s hover:bg-fill-surface transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMilestone(item.id);
                    }}
                  >
                    <ChevronDownIcon className={`w-6 h-6 text-text-secondary transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="w-full flex flex-col items-center">
                  {/* Tasks */}
                  {item.tasks && item.tasks.length > 0 && (
                    <div className="w-full pl-8 pr-3 flex flex-col justify-center items-end gap-2">
                      {item.tasks.map((task) => (
                        <div key={task.id} className="w-[736px] pr-2 py-2 bg-fill-inverse rounded-xl inline-flex justify-start items-center gap-2 overflow-hidden">
                          <div className="flex-1 flex justify-start items-center gap-2">
                            <div className={`w-2 h-8 rounded-sm ${category.themeLight}`} />
                            <span className="max-w-64 text-body-02-m text-text-strong truncate">
                              {task.title}
                            </span>
                          </div>
                          <div className="flex justify-end items-center gap-3">
                            <div className="flex justify-end items-center">
                              <span className="text-body-02-m text-text-teritary">{task.start}</span>
                              {task.end && (
                                <>
                                  <span className="text-body-02-m text-text-teritary mx-1">~</span>
                                  <span className="text-body-02-m text-text-teritary">{task.end}</span>
                                </>
                              )}
                            </div>
                            <div className="w-6 h-6 rounded-token-xs border border-border-default" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Add Task Button */}
                  <div className="w-full px-5 py-3 flex flex-col justify-start items-start gap-2.5">
                    <div className="w-[740px] py-3 bg-btn-quaternary hover:bg-fill-surface transition-colors rounded-xl flex justify-center items-center cursor-pointer">
                      <span className="text-body-02-m text-text-secondary">태스크 추가하기</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <CategoryFormModal 
        isOpen={isEditModalOpen} 
        mode="edit"
        category={category}
        onClose={() => setIsEditModalOpen(false)} 
        onRequestDelete={() => {
          setIsEditModalOpen(false);
          setIsDeleteModalOpen(true);
        }}
      />

      <DeleteCategoryModal
        isOpen={isDeleteModalOpen}
        category={category}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={() => {
          console.log(`Deleted category: ${category.title}`);
          setIsDeleteModalOpen(false);
          onBack(); // Go back to calendar after deleting
        }}
      />
    </section>
  );
};
