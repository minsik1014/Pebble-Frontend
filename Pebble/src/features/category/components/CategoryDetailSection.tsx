import React from 'react';

import ChevronLeftIcon from '@/assets/icons/chevron-left.svg?react';
import { leaveSharedCategory } from '@/features/category/api/sharedCategoryApi';
import type {
  CreateScheduleItemInput,
  UpdateCategoryInput,
} from '@/features/calendar/types';
import { MilestoneDetailItem } from '@/features/milestone/components/MilestoneDetailItem';
import { MilestoneFormModal } from '@/features/milestone/components/MilestoneFormModal';
import { TaskDetailRow } from '@/features/task/components/TaskDetailRow';
import {
  TaskFormModal,
  type TaskFormSubmitInput,
} from '@/features/task/components/TaskFormModal';
import type { Category } from '@/types';

import { CategoryDetailHeader } from './CategoryDetailHeader';
import { CategoryFormModal } from './CategoryFormModal';
import { DeleteCategoryModal } from './DeleteCategoryModal';

type CategoryDetailSectionProps = {
  isSidebarOpen: boolean;
  category: Category;
  backLabel?: string;
  currentUserId: number | null;
  onBack: () => void;
  categories: Category[];

  onUpdateCategory: (
    categoryId: string,
    input: UpdateCategoryInput,
  ) => Promise<void>;

  onCreateTask: (
    input: TaskFormSubmitInput,
  ) => void | Promise<void>;

  onUpdateCategoryTask: (
    categoryId: string,
    taskId: string,
    input: CreateScheduleItemInput,
  ) => void | Promise<void>;

  onDeleteCategoryTask: (
    categoryId: string,
    taskId: string,
  ) => void | Promise<void>;

  onDeleteCategory: (
    categoryId: string,
  ) => Promise<void>;

  onReloadCalendarData: () => Promise<void>;

  onUpdateMilestone: (
    categoryId: string,
    milestoneId: string,
    input: CreateScheduleItemInput,
  ) => Promise<void>;

  onDeleteMilestone: (
    categoryId: string,
    milestoneId: string,
  ) => Promise<void>;

  onUpdateTask: (
    categoryId: string,
    milestoneId: string,
    taskId: string,
    input: CreateScheduleItemInput,
  ) => Promise<void>;

  onDeleteTask: (
    categoryId: string,
    milestoneId: string,
    taskId: string,
  ) => Promise<void>;

  onToggleMilestoneCompleted: (
    categoryId: string,
    milestoneId: string,
  ) => Promise<void>;

  onToggleCategoryTaskCompleted: (
    categoryId: string,
    taskId: string,
    taskDateId?: number,
  ) => Promise<void>;

  onToggleTaskCompleted: (
    categoryId: string,
    milestoneId: string,
    taskId: string,
  ) => Promise<void>;
};

export const CategoryDetailSection = ({
  isSidebarOpen,
  category,
  backLabel = '캘린더',
  currentUserId,
  onBack,
  categories,
  onUpdateCategory,
  onCreateTask,
  onUpdateCategoryTask,
  onDeleteCategoryTask,
  onDeleteCategory,
  onReloadCalendarData,
  onUpdateMilestone,
  onDeleteMilestone,
  onUpdateTask,
  onDeleteTask,
  onToggleMilestoneCompleted,
  onToggleCategoryTaskCompleted,
  onToggleTaskCompleted,
}: CategoryDetailSectionProps) => {
  const [
    expandedMilestones,
    setExpandedMilestones,
  ] = React.useState<Record<string, boolean>>({});

  const [
    isEditModalOpen,
    setIsEditModalOpen,
  ] = React.useState(false);

  const [
    isDeleteModalOpen,
    setIsDeleteModalOpen,
  ] = React.useState(false);

  const [
    editingMilestoneId,
    setEditingMilestoneId,
  ] = React.useState<string | null>(null);

  const [
    isTaskModalOpen,
    setIsTaskModalOpen,
  ] = React.useState(false);

  const [taskMode, setTaskMode] =
    React.useState<'create' | 'edit'>('create');

  const [
    editingTaskId,
    setEditingTaskId,
  ] = React.useState<string | null>(null);

  const [
    editingCategoryTaskId,
    setEditingCategoryTaskId,
  ] = React.useState<string | null>(null);

  const [
    selectedMilestoneForTask,
    setSelectedMilestoneForTask,
  ] = React.useState<string | null>(null);

  const editingCategoryTask =
    category.tasks?.find(
      (task) =>
        task.id === editingCategoryTaskId,
    ) ?? null;

  const editingMilestone =
    category.items.find(
      (item) => item.id === editingMilestoneId,
    ) ?? null;

  const editingTask =
    category.items
      .find(
        (item) =>
          item.id === selectedMilestoneForTask,
      )
      ?.tasks?.find(
        (task) => task.id === editingTaskId,
      ) ?? null;

  const canDeleteCategory =
    !category.isShared ||
    (currentUserId !== null &&
      category.userId !== undefined &&
      category.userId === currentUserId);

  const toggleMilestone = (id: string) => {
    setExpandedMilestones((previous) => ({
      ...previous,
      [id]: !previous[id],
    }));
  };

  const closeMilestoneTaskModal = () => {
    setIsTaskModalOpen(false);
    setEditingTaskId(null);
    setSelectedMilestoneForTask(null);
    setTaskMode('create');
  };

  return (
    <section
      className={[
        'relative h-[1000px] overflow-hidden rounded-[20px]',
        'bg-fill-inverse shadow-shadow-m dark:shadow-[0px_0px_28px_0px_rgba(23,23,23,0.05)]',
        'transition-all duration-300',
        isSidebarOpen
          ? 'w-[898px]'
          : 'w-[1290px]',
      ].join(' ')}
    >
      <button
        type="button"
        onClick={onBack}
        className={[
          'absolute left-[20px] top-[36px]',
          'flex items-center gap-2',
          'transition-opacity hover:opacity-80',
        ].join(' ')}
        aria-label={`${backLabel}로 돌아가기`}
      >
        <div className="relative flex h-11 w-11 items-center justify-center rounded-xl">
          <ChevronLeftIcon className="h-6 w-6 text-text-strong" />
        </div>

        <span className="text-[24px] font-medium leading-8 text-text-strong">
          {backLabel}
        </span>
      </button>

      <CategoryDetailHeader
        category={category}
        onEdit={() =>
          setIsEditModalOpen(true)
        }
      />

      <div className="absolute left-[72px] top-[392px] flex items-end gap-2">
        <h2 className="text-title-02-sb text-text-strong">
          마일스톤
        </h2>

        <span className="text-[20px] font-medium leading-6 text-text-teritary">
          {category.items.length}
        </span>
      </div>

      <div className="absolute left-[72px] top-[443px] flex w-[780px] flex-col gap-5">
        {category.tasks &&
        category.tasks.length > 0 ? (
          <div className="flex w-full flex-col gap-2 rounded-[20px] bg-fill-inverse p-5 shadow-[0px_0px_14px_0px_rgba(23,23,23,0.05)]">
            <div className="flex items-end gap-2">
              <h3 className="text-title-03-sb text-text-strong">
                태스크
              </h3>

              <span className="text-body-02-m text-text-teritary">
                {category.tasks.length}
              </span>
            </div>

            <div className="flex flex-col items-end gap-2">
              {category.tasks.map((task) => (
                <TaskDetailRow
                  key={task.id}
                  task={task}
                  themeLightColor={
                    category.themeLight
                  }
                  onToggleCompleted={(
                    taskDateId,
                  ) =>
                    onToggleCategoryTaskCompleted(
                      category.id,
                      task.id,
                      taskDateId,
                    )
                  }
                  onEdit={() =>
                    setEditingCategoryTaskId(
                      task.id,
                    )
                  }
                />
              ))}
            </div>
          </div>
        ) : null}

        {category.items.map((item) => (
          <MilestoneDetailItem
            key={item.id}
            item={item}
            themeMidColor={category.themeMid}
            themeLightColor={
              category.themeLight
            }
            isExpanded={Boolean(
              expandedMilestones[item.id],
            )}
            onToggle={() =>
              toggleMilestone(item.id)
            }
            onToggleCompleted={() =>
              onToggleMilestoneCompleted(
                category.id,
                item.id,
              )
            }
            onEdit={() =>
              setEditingMilestoneId(item.id)
            }
            onAddTask={() => {
              setTaskMode('create');
              setEditingTaskId(null);
              setSelectedMilestoneForTask(
                item.id,
              );
              setIsTaskModalOpen(true);
            }}
            onEditTask={(taskId) => {
              setTaskMode('edit');
              setEditingTaskId(taskId);
              setSelectedMilestoneForTask(
                item.id,
              );
              setIsTaskModalOpen(true);
            }}
            onToggleTaskCompleted={(taskId) =>
              onToggleTaskCompleted(
                category.id,
                item.id,
                taskId,
              )
            }
          />
        ))}
      </div>

      <CategoryFormModal
        isOpen={isEditModalOpen}
        mode="edit"
        category={category}
        onSubmit={async (input) => {
          await onUpdateCategory(
            category.id,
            input,
          );
        }}
        onClose={() =>
          setIsEditModalOpen(false)
        }
        onRequestDelete={
          canDeleteCategory
            ? () => {
                setIsEditModalOpen(false);
                setIsDeleteModalOpen(true);
              }
            : undefined
        }
        currentUserId={currentUserId}
        onLeaveCategory={async () => {
          await leaveSharedCategory(
            category.id,
          );
          await onReloadCalendarData();

          setIsEditModalOpen(false);
          onBack();
        }}
      />

      <DeleteCategoryModal
        isOpen={isDeleteModalOpen}
        category={category}
        onClose={() =>
          setIsDeleteModalOpen(false)
        }
        onDelete={async () => {
          await onDeleteCategory(category.id);

          // 삭제 성공 후에만 모달을 닫습니다.
          setIsDeleteModalOpen(false);
        }}
      />

      <MilestoneFormModal
        isOpen={Boolean(editingMilestoneId)}
        onClose={() =>
          setEditingMilestoneId(null)
        }
        categories={categories}
        mode="edit"
        milestone={editingMilestone}
        defaultCategoryId={category.id}
        onSubmit={async (
          categoryId,
          input,
        ) => {
          if (!editingMilestoneId) {
            return;
          }

          await onUpdateMilestone(
            categoryId,
            editingMilestoneId,
            input,
          );

          // 수정 성공 후에만 편집 상태를 초기화합니다.
          setEditingMilestoneId(null);
        }}
        onRequestDelete={async () => {
          if (!editingMilestoneId) {
            return;
          }

          await onDeleteMilestone(
            category.id,
            editingMilestoneId,
          );

          // 삭제 성공 후에만 편집 상태를 초기화합니다.
          setEditingMilestoneId(null);
        }}
      />

      <TaskFormModal
        isOpen={isTaskModalOpen}
        onClose={closeMilestoneTaskModal}
        categories={categories}
        defaultCategoryId={category.id}
        defaultMilestoneId={
          selectedMilestoneForTask
        }
        task={editingTask}
        mode={taskMode}
        onSubmit={async (input) => {
          if (
            taskMode === 'edit' &&
            selectedMilestoneForTask &&
            editingTaskId
          ) {
            await onUpdateTask(
              category.id,
              selectedMilestoneForTask,
              editingTaskId,
              {
                ...input.task,
                categoryId:
                  input.categoryId ?? undefined,
                milestoneId:
                  input.milestoneId ?? undefined,
              },
            );

            return;
          }

          await onCreateTask(input);
        }}
        onRequestDelete={async () => {
          if (
            !selectedMilestoneForTask ||
            !editingTaskId
          ) {
            return;
          }

          await onDeleteTask(
            category.id,
            selectedMilestoneForTask,
            editingTaskId,
          );

          // 삭제 성공 후에만 모달 상태를 초기화합니다.
          closeMilestoneTaskModal();
        }}
      />

      <TaskFormModal
        isOpen={Boolean(editingCategoryTask)}
        onClose={() =>
          setEditingCategoryTaskId(null)
        }
        categories={categories}
        defaultCategoryId={category.id}
        task={editingCategoryTask}
        mode="edit"
        onSubmit={async ({
          categoryId,
          milestoneId,
          task,
        }) => {
          if (!editingCategoryTaskId) {
            return;
          }

          await onUpdateCategoryTask(
            category.id,
            editingCategoryTaskId,
            {
              ...task,
              categoryId:
                categoryId ?? undefined,
              milestoneId:
                milestoneId ?? undefined,
            },
          );

          /*
           * TaskFormModal이 성공한 제출 이후 onClose를
           * 호출하므로 여기서는 편집 상태를 먼저 비우지 않습니다.
           * 요청 실패 시 입력값과 모달이 그대로 유지됩니다.
           */
        }}
        onRequestDelete={async () => {
          if (!editingCategoryTaskId) {
            return;
          }

          await onDeleteCategoryTask(
            category.id,
            editingCategoryTaskId,
          );

          // 삭제 성공 후에만 편집 상태를 초기화합니다.
          setEditingCategoryTaskId(null);
        }}
      />
    </section>
  );
};
