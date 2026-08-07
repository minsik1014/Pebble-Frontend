import { useEffect, useState } from "react";
import { type Category, type MilestoneItem } from "@/types";
import { ScheduleDatePicker } from "@/components/ui/ScheduleDatePicker";
import { CategorySelect } from "@/features/calendar/components/ScheduleRelationSelects";
import { ScheduleFormModalFrame } from "@/features/calendar/components/ScheduleFormModalFrame";
import { ScheduleNameInput } from "@/features/calendar/components/ScheduleNameInput";
import { useScheduleDatePicker } from "@/hooks/useScheduleDatePicker";
import type { CreateScheduleItemInput } from "@/features/calendar/types";
import {
  getScheduleRangeFromSelection,
  parseIsoScheduleDate,
} from "@/utils/scheduleDate";

type MilestoneFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  mode?: "create" | "edit";
  milestone?: MilestoneItem | null;
  defaultCategoryId?: string | null;
  onSubmit?: (
    categoryId: string,
    input: CreateScheduleItemInput,
  ) => void | Promise<void>;
  onRequestDelete?: () => void | Promise<void>;
};

export const MilestoneFormModal = ({
  isOpen,
  onClose,
  categories,
  mode = "create",
  milestone = null,
  defaultCategoryId = null,
  onSubmit,
  onRequestDelete,
}: MilestoneFormModalProps) => {
  const [milestoneName, setMilestoneName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    defaultCategoryId,
  );
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const datePicker = useScheduleDatePicker();
  const {
    reset,
    setDateRange,
    setDateType,
    setMultiDates,
    setSelectedDate,
  } = datePicker;
  const activeCategory = categories.find(
    (category) => category.id === selectedCategory,
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setSelectedCategory(
      defaultCategoryId &&
        categories.some(
          (category) => category.id === defaultCategoryId && !category.isHidden,
        )
        ? defaultCategoryId
        : null,
    );

    if (!milestone) {
      setMilestoneName("");
      reset();
      return;
    }

    setMilestoneName(milestone.title);

    if (milestone.dates && milestone.dates.length > 0) {
      setDateType("다중");
      setMultiDates(
        milestone.dates
          .map(parseIsoScheduleDate)
          .filter((date): date is Date => Boolean(date)),
      );
      return;
    }

    if (milestone.end) {
      setDateType("기간");
      setDateRange({
        start: parseIsoScheduleDate(milestone.start),
        end: parseIsoScheduleDate(milestone.end),
      });
      return;
    }

    setDateType("하루");
    setSelectedDate(parseIsoScheduleDate(milestone.start));
  }, [
    defaultCategoryId,
    categories,
    isOpen,
    milestone,
    reset,
    setDateRange,
    setDateType,
    setMultiDates,
    setSelectedDate,
  ]);

  const handleSubmit = async () => {
    const scheduleRange = getScheduleRangeFromSelection(datePicker);
    const trimmedName = milestoneName.trim();

    if (!selectedCategory || !trimmedName || !scheduleRange) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit?.(selectedCategory, {
        title: trimmedName,
        start: scheduleRange.start,
        end: scheduleRange.end,
        dates: scheduleRange.dates,
        accent: activeCategory?.accent ?? "#171717",
      });
      setMilestoneName("");
      onClose();
    } catch (error) {
      console.error("Failed to submit milestone:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ScheduleFormModalFrame
      title={mode === "edit" ? "마일스톤 수정하기" : "마일스톤 추가하기"}
      submitLabel={mode === "edit" ? "수정" : "추가"}
      disabled={
        !selectedCategory ||
        !milestoneName ||
        !datePicker.isDateSelectionComplete ||
        isSubmitting
      }
      gapClassName="gap-10"
      onCancel={onClose}
      onSubmit={handleSubmit}
      onDelete={mode === "edit" ? onRequestDelete : undefined}
    >
      <div className="flex items-center gap-4 w-full">
        <div className="relative flex-[4]">
          <CategorySelect
            categories={categories}
            selectedCategoryId={selectedCategory}
            isOpen={isCategoryDropdownOpen}
            onToggleOpen={() =>
              setIsCategoryDropdownOpen(!isCategoryDropdownOpen)
            }
            onSelectCategory={(categoryId) => {
              setSelectedCategory(categoryId);
              setIsCategoryDropdownOpen(false);
            }}
          />
        </div>

        <div className="flex-[6]">
          <ScheduleNameInput
            placeholder="마일스톤 이름을 입력해 주세요"
            value={milestoneName}
            onChange={setMilestoneName}
            className="bg-transparent placeholder:text-text-teritary"
          />
        </div>
      </div>

      <ScheduleDatePicker
        variant="milestone"
        dateType={datePicker.dateType}
        onDateTypeChange={datePicker.setDateType}
        currentYear={datePicker.currentYear}
        currentMonth={datePicker.currentMonth}
        daysInMonth={datePicker.daysInMonth}
        firstDay={datePicker.firstDay}
        onPrevMonth={datePicker.handlePrevMonth}
        onNextMonth={datePicker.handleNextMonth}
        onDateClick={datePicker.handleDateClick}
        getDayStatus={datePicker.getDayStatus}
        themeBaseColor={activeCategory?.themeBase}
        themeMidColor={activeCategory?.themeMid}
        themeLightColor={activeCategory?.themeLight}
      />
    </ScheduleFormModalFrame>
  );
};
