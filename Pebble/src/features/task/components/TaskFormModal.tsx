import {
  useEffect,
  useState,
} from 'react';

import { ScheduleDatePicker } from '@/components/ui/ScheduleDatePicker';
import {
  CategorySelect,
  MilestoneSelect,
} from '@/features/calendar/components/ScheduleRelationSelects';
import { ScheduleFormModalFrame } from '@/features/calendar/components/ScheduleFormModalFrame';
import { ScheduleNameInput } from '@/features/calendar/components/ScheduleNameInput';
import { useScheduleFormDateInitializer } from '@/features/calendar/hooks/useScheduleFormDateInitializer';
import type { CreateScheduleItemInput } from '@/features/calendar/types';
import { useRetryableAction } from '@/hooks/useRetryableAction';
import { useScheduleDatePicker } from '@/hooks/useScheduleDatePicker';
import type {
  Category,
  ScheduleItem,
} from '@/types';
import { getScheduleRangeFromSelection } from '@/utils/scheduleDate';

type TaskFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  defaultCategoryId?: string | null;
  defaultMilestoneId?: string | null;
  task?: ScheduleItem | null;
  mode?: 'create' | 'edit';
  onSubmit?: (
    input: TaskFormSubmitInput,
  ) => void | Promise<void>;
  onRequestDelete?: () =>
    | void
    | Promise<void>;
};

export type TaskFormSubmitInput = {
  categoryId: string | null;
  milestoneId: string | null;
  task: CreateScheduleItemInput;
};

export const TaskFormModal = ({
  isOpen,
  onClose,
  categories,
  defaultCategoryId = null,
  defaultMilestoneId = null,
  task = null,
  mode = 'create',
  onSubmit,
  onRequestDelete,
}: TaskFormModalProps) => {
  const [taskName, setTaskName] =
    useState('');

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState<string | null>(
    defaultCategoryId,
  );

  const [
    selectedMilestone,
    setSelectedMilestone,
  ] = useState<string | null>(
    defaultMilestoneId,
  );

  const [
    isCategoryDropdownOpen,
    setIsCategoryDropdownOpen,
  ] = useState(false);

  const [
    isMilestoneDropdownOpen,
    setIsMilestoneDropdownOpen,
  ] = useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState('');

  const datePicker =
    useScheduleDatePicker();

  const { isRunning, run } =
    useRetryableAction();

  useScheduleFormDateInitializer({
    isOpen,
    task,
    datePicker,
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const nextCategory =
      defaultCategoryId
        ? categories.find(
            (category) =>
              category.id ===
                defaultCategoryId &&
              !category.isHidden,
          )
        : undefined;

    const nextCategoryId =
      nextCategory?.id ?? null;

    const nextMilestoneId =
      nextCategory &&
      defaultMilestoneId &&
      nextCategory.items.some(
        (milestone) =>
          milestone.id ===
          defaultMilestoneId,
      )
        ? defaultMilestoneId
        : null;

    setSelectedCategory(nextCategoryId);
    setSelectedMilestone(
      nextMilestoneId,
    );
    setTaskName(task?.title ?? '');
    setErrorMessage('');
    setIsCategoryDropdownOpen(false);
    setIsMilestoneDropdownOpen(false);
  }, [
    categories,
    defaultCategoryId,
    defaultMilestoneId,
    isOpen,
    task,
  ]);

  if (!isOpen) {
    return null;
  }

  const activeCategory =
    categories.find(
      (category) =>
        category.id ===
          selectedCategory &&
        !category.isHidden,
    );

  const availableMilestones =
    activeCategory?.items ?? [];

  const handleSubmit = async () => {
    const scheduleRange =
      getScheduleRangeFromSelection(
        datePicker,
      );

    const trimmedName =
      taskName.trim();

    if (
      !trimmedName ||
      !scheduleRange ||
      isRunning
    ) {
      return;
    }

    setErrorMessage('');

    /*
     * 재시도 시에도 처음 제출했던 관계와 날짜 정보를
     * 사용하도록 요청 시점의 값을 복사합니다.
     */
    const inputSnapshot:
      TaskFormSubmitInput = {
      categoryId: selectedCategory,
      milestoneId:
        selectedCategory
          ? selectedMilestone
          : null,
      task: {
        title: trimmedName,
        start: scheduleRange.start,
        end: scheduleRange.end,
        dates: scheduleRange.dates,
        accent:
          activeCategory?.accent ??
          '#171717',
      },
    };

    await run(
      async () => {
        await onSubmit?.(
          inputSnapshot,
        );

        /*
         * 요청 성공 후에만 입력값을 초기화하고
         * 모달을 닫습니다.
         */
        setTaskName('');
        onClose();
      },
      {
        onError: (error) => {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : '태스크를 저장하지 못했어요.',
          );
        },
      },
    );
  };

  const handleDelete = async () => {
    if (
      !onRequestDelete ||
      isRunning
    ) {
      return;
    }

    setErrorMessage('');

    await run(
      async () => {
        await onRequestDelete();
      },
      {
        onError: (error) => {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : '태스크를 삭제하지 못했어요.',
          );
        },
      },
    );
  };

  return (
    <ScheduleFormModalFrame
      title={
        mode === 'edit'
          ? '태스크 편집'
          : '태스크 추가하기'
      }
      submitLabel={
        mode === 'edit'
          ? '수정'
          : '추가'
      }
      disabled={
        !taskName.trim() ||
        !datePicker.isDateSelectionComplete
      }
      isBusy={isRunning}
      titleClassName="leading-[1.3]"
      onCancel={onClose}
      onSubmit={handleSubmit}
      onDelete={
        mode === 'edit' &&
        onRequestDelete
          ? handleDelete
          : undefined
      }
    >
      <div className="mt-2 flex w-full flex-col gap-3">
        <div className="flex w-full items-center gap-3">
          <div className="flex-[1]">
            <CategorySelect
              categories={categories}
              selectedCategoryId={
                selectedCategory
              }
              isOpen={
                isCategoryDropdownOpen
              }
              allowEmpty
              onToggleOpen={() => {
                setIsCategoryDropdownOpen(
                  (value) => !value,
                );
                setIsMilestoneDropdownOpen(
                  false,
                );
              }}
              onSelectCategory={(
                categoryId,
              ) => {
                setSelectedCategory(
                  categoryId,
                );
                setSelectedMilestone(
                  null,
                );
                setIsCategoryDropdownOpen(
                  false,
                );
                setErrorMessage('');
              }}
            />
          </div>

          <div className="flex-[1]">
            <MilestoneSelect
              milestones={
                availableMilestones
              }
              selectedMilestoneId={
                selectedMilestone
              }
              themeColor={
                activeCategory?.themeMid
              }
              disabled={!activeCategory}
              isOpen={
                isMilestoneDropdownOpen
              }
              onToggleOpen={() => {
                if (activeCategory) {
                  setIsMilestoneDropdownOpen(
                    (value) => !value,
                  );
                }

                setIsCategoryDropdownOpen(
                  false,
                );
              }}
              onSelectMilestone={(
                milestoneId,
              ) => {
                setSelectedMilestone(
                  milestoneId,
                );
                setIsMilestoneDropdownOpen(
                  false,
                );
                setErrorMessage('');
              }}
            />
          </div>
        </div>

        <ScheduleNameInput
          placeholder="태스크 이름을 입력해 주세요"
          value={taskName}
          onChange={(value) => {
            setTaskName(value);
            setErrorMessage('');
          }}
        />
      </div>

      <ScheduleDatePicker
        variant="task"
        dateType={datePicker.dateType}
        onDateTypeChange={
          datePicker.setDateType
        }
        currentYear={
          datePicker.currentYear
        }
        currentMonth={
          datePicker.currentMonth
        }
        daysInMonth={
          datePicker.daysInMonth
        }
        firstDay={datePicker.firstDay}
        onPrevMonth={
          datePicker.handlePrevMonth
        }
        onNextMonth={
          datePicker.handleNextMonth
        }
        onDateClick={
          datePicker.handleDateClick
        }
        getDayStatus={
          datePicker.getDayStatus
        }
        themeBaseColor={
          activeCategory?.themeBase
        }
        themeMidColor={
          activeCategory?.themeMid
        }
        themeLightColor={
          activeCategory?.themeLight
        }
      />

      {errorMessage ? (
        <p
          role="alert"
          className="text-caption-01 text-fill-danger"
        >
          {errorMessage}
        </p>
      ) : null}
    </ScheduleFormModalFrame>
  );
};