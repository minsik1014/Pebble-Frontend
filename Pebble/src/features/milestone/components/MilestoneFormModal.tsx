import {
  useEffect,
  useState,
} from 'react';

import { ScheduleDatePicker } from '@/components/ui/ScheduleDatePicker';
import { CategorySelect } from '@/features/calendar/components/ScheduleRelationSelects';
import { ScheduleFormModalFrame } from '@/features/calendar/components/ScheduleFormModalFrame';
import { ScheduleNameInput } from '@/features/calendar/components/ScheduleNameInput';
import type { CreateScheduleItemInput } from '@/features/calendar/types';
import { useRetryableAction } from '@/hooks/useRetryableAction';
import { useScheduleDatePicker } from '@/hooks/useScheduleDatePicker';
import type {
  Category,
  MilestoneItem,
} from '@/types';
import {
  getScheduleRangeFromSelection,
  parseIsoScheduleDate,
} from '@/utils/scheduleDate';

type MilestoneFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  mode?: 'create' | 'edit';
  milestone?: MilestoneItem | null;
  defaultCategoryId?: string | null;
  onSubmit?: (
    categoryId: string,
    input: CreateScheduleItemInput,
  ) => void | Promise<void>;
  onRequestDelete?: () =>
    | void
    | Promise<void>;
};

export const MilestoneFormModal = ({
  isOpen,
  onClose,
  categories,
  mode = 'create',
  milestone = null,
  defaultCategoryId = null,
  onSubmit,
  onRequestDelete,
}: MilestoneFormModalProps) => {
  const [
    milestoneName,
    setMilestoneName,
  ] = useState('');

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState<string | null>(
    defaultCategoryId,
  );

  const [
    isCategoryDropdownOpen,
    setIsCategoryDropdownOpen,
  ] = useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState('');

  const datePicker =
    useScheduleDatePicker();

  const {
    reset: resetDatePicker,
    setDateRange,
    setDateType,
    setMultiDates,
    setSelectedDate,
  } = datePicker;

  const { isRunning, run } =
    useRetryableAction();

  const activeCategory =
    categories.find(
      (category) =>
        category.id ===
        selectedCategory,
    );

  const submitDisabledReason =
    !selectedCategory
      ? '카테고리를 선택해 주세요'
      : !milestoneName.trim()
        ? '제목을 입력해 주세요'
        : !datePicker.isDateSelectionComplete
          ? '날짜를 선택해 주세요'
          : undefined;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setErrorMessage('');
    setIsCategoryDropdownOpen(false);

    const availableDefaultCategoryId =
      defaultCategoryId &&
      categories.some(
        (category) =>
          category.id ===
          defaultCategoryId,
      )
        ? defaultCategoryId
        : null;

    setSelectedCategory(
      availableDefaultCategoryId,
    );

    if (!milestone) {
      setMilestoneName('');
      resetDatePicker();
      return;
    }

    setMilestoneName(
      milestone.title,
    );

    if (
      milestone.dates &&
      milestone.dates.length > 0
    ) {
      setDateType('다중');

      setMultiDates(
        milestone.dates
          .map(parseIsoScheduleDate)
          .filter(
            (date): date is Date =>
              Boolean(date),
          ),
      );

      return;
    }

    if (milestone.end) {
      setDateType('기간');

      setDateRange({
        start:
          parseIsoScheduleDate(
            milestone.start,
          ),
        end:
          parseIsoScheduleDate(
            milestone.end,
          ),
      });

      return;
    }

    setDateType('하루');

    setSelectedDate(
      parseIsoScheduleDate(
        milestone.start,
      ),
    );
  }, [
    categories,
    defaultCategoryId,
    isOpen,
    milestone,
    resetDatePicker,
    setDateRange,
    setDateType,
    setMultiDates,
    setSelectedDate,
  ]);

  const handleSubmit = async () => {
    const scheduleRange =
      getScheduleRangeFromSelection(
        datePicker,
      );

    const trimmedName =
      milestoneName.trim();

    if (
      !selectedCategory ||
      !trimmedName ||
      !scheduleRange ||
      isRunning
    ) {
      return;
    }

    setErrorMessage('');

    /*
     * 다시 시도할 때도 동일한 카테고리와 입력값을
     * 사용하도록 요청 시점의 값을 복사합니다.
     */
    const categoryIdSnapshot =
      selectedCategory;

    const inputSnapshot:
      CreateScheduleItemInput = {
      title: trimmedName,
      start: scheduleRange.start,
      end: scheduleRange.end,
      dates: scheduleRange.dates,
      accent:
        activeCategory?.accent ??
        '#171717',
    };

    await run(
      async () => {
        await onSubmit?.(
          categoryIdSnapshot,
          inputSnapshot,
        );

        /*
         * 요청이 성공한 경우에만 입력 상태를
         * 초기화하고 모달을 닫습니다.
         */
        setMilestoneName('');
        onClose();
      },
      {
        onError: (error) => {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : '마일스톤을 저장하지 못했어요.',
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
              : '마일스톤을 삭제하지 못했어요.',
          );
        },
      },
    );
  };

  if (!isOpen) {
    return null;
  }

  return (
    <ScheduleFormModalFrame
      title={
        mode === 'edit'
          ? '마일스톤 수정하기'
          : '마일스톤 추가하기'
      }
      submitLabel={
        mode === 'edit'
          ? '수정'
          : '추가'
      }
      disabled={Boolean(
        submitDisabledReason,
      )}
      isBusy={isRunning}
      disabledReason={
        submitDisabledReason
      }
      gapClassName="gap-10"
      onCancel={onClose}
      onSubmit={handleSubmit}
      onDelete={
        mode === 'edit' &&
        onRequestDelete
          ? handleDelete
          : undefined
      }
    >
      <div className="flex w-full items-center gap-4">
        <div className="relative flex-[4]">
          <CategorySelect
            categories={categories}
            selectedCategoryId={
              selectedCategory
            }
            isOpen={
              isCategoryDropdownOpen
            }
            onToggleOpen={() => {
              setIsCategoryDropdownOpen(
                (previousValue) =>
                  !previousValue,
              );
            }}
            onSelectCategory={(
              categoryId,
            ) => {
              setSelectedCategory(
                categoryId,
              );

              setIsCategoryDropdownOpen(
                false,
              );

              setErrorMessage('');
            }}
          />
        </div>

        <div className="flex-[6]">
          <ScheduleNameInput
            placeholder="마일스톤 이름을 입력해 주세요"
            value={milestoneName}
            onChange={(value) => {
              setMilestoneName(value);
              setErrorMessage('');
            }}
            className="bg-transparent placeholder:text-text-teritary"
          />
        </div>
      </div>

      <ScheduleDatePicker
        variant="milestone"
        dateType={
          datePicker.dateType
        }
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
        firstDay={
          datePicker.firstDay
        }
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
