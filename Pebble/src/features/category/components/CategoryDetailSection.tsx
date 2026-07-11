import React from "react";
import ChevronLeftIcon from "@/assets/icons/chevron-left.svg?react";
import { CategoryFormModal } from "./CategoryFormModal";
import { DeleteCategoryModal } from "./DeleteCategoryModal";
import { CategoryDetailHeader } from "./CategoryDetailHeader";
import { MilestoneDetailItem } from "@/features/milestone/components/MilestoneDetailItem";
import { MilestoneFormModal } from "@/features/milestone/components/MilestoneFormModal";
import { TaskFormModal } from "@/features/task/components/TaskFormModal";
import { type Category } from "@/types";

export const CategoryDetailSection = ({
  isSidebarOpen,
  category,
  onBack,
  categories,
  onDeleteCategory,
  onDeleteMilestone,
  onDeleteTask,
}: {
  isSidebarOpen: boolean;
  category: Category;
  onBack: () => void;
  categories: Category[];
  onDeleteCategory: (categoryId: string) => void;
  onDeleteMilestone: (categoryId: string, milestoneId: string) => void;
  onDeleteTask: (categoryId: string, milestoneId: string, taskId: string) => void;
}) => {
  const [expandedMilestones, setExpandedMilestones] = React.useState<Record<string, boolean>>({
    "startup-1": true, // 창업 공모전 - 백엔드 프로젝트 기본 열림
  });
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [editingMilestoneId, setEditingMilestoneId] = React.useState<string | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = React.useState(false);
  const [taskMode, setTaskMode] = React.useState<"create" | "edit">("create");
  const [editingTaskId, setEditingTaskId] = React.useState<string | null>(null);
  const [selectedMilestoneForTask, setSelectedMilestoneForTask] = React.useState<string | null>(null);

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

      <CategoryDetailHeader 
        category={category} 
        onEdit={() => setIsEditModalOpen(true)} 
      />

      {/* 마일스톤 목록 섹션 */}
      <div className="absolute left-[72px] top-[392px] flex items-end gap-2">
        <h2 className="text-title-02-sb text-text-strong">마일스톤</h2>
        <span className="text-[20px] font-medium leading-6 text-text-teritary">
          {category.items.length}
        </span>
      </div>

      <div className="absolute left-[72px] top-[443px] flex flex-col gap-5 w-[780px]">
        {category.items.map((item) => (
          <MilestoneDetailItem
            key={item.id}
            item={item}
            themeMid={category.themeMid}
            themeLight={category.themeLight}
            isExpanded={Boolean(expandedMilestones[item.id])}
            onToggle={() => toggleMilestone(item.id)}
            onEdit={() => setEditingMilestoneId(item.id)}
            onAddTask={() => {
              setTaskMode("create");
              setSelectedMilestoneForTask(item.id);
              setIsTaskModalOpen(true);
            }}
            onEditTask={(taskId) => {
              setTaskMode("edit");
              setEditingTaskId(taskId);
              setSelectedMilestoneForTask(item.id);
              setIsTaskModalOpen(true);
            }}
          />
        ))}
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
          onDeleteCategory(category.id);
          setIsDeleteModalOpen(false);
        }}
      />

      <MilestoneFormModal 
        isOpen={!!editingMilestoneId}
        onClose={() => setEditingMilestoneId(null)}
        categories={categories}
        mode="edit"
        onRequestDelete={() => {
          if (editingMilestoneId) {
            onDeleteMilestone(category.id, editingMilestoneId);
          }
          setEditingMilestoneId(null);
        }}
      />

      <TaskFormModal 
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTaskId(null);
        }}
        categories={categories}
        defaultCategoryId={category.id}
        defaultMilestoneId={selectedMilestoneForTask}
        mode={taskMode}
        onRequestDelete={() => {
          if (selectedMilestoneForTask && editingTaskId) {
            onDeleteTask(category.id, selectedMilestoneForTask, editingTaskId);
          }
          setIsTaskModalOpen(false);
          setEditingTaskId(null);
        }}
      />
    </section>
  );
};
