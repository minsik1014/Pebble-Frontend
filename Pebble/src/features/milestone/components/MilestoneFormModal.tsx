import { useState } from "react";
import { type Category } from "@/types";
import { ScheduleDatePicker } from "@/components/ui/ScheduleDatePicker";
import { CategorySelect } from "@/features/calendar/components/ScheduleRelationSelects";
import { ScheduleFormModalFrame } from "@/features/calendar/components/ScheduleFormModalFrame";
import { ScheduleNameInput } from "@/features/calendar/components/ScheduleNameInput";
import { useScheduleDatePicker } from "@/hooks/useScheduleDatePicker";
import type { CreateScheduleItemInput } from "@/features/calendar/types";
import { getScheduleRangeFromSelection } from "@/utils/scheduleDate";

type MilestoneFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  mode?: "create" | "edit";
  onSubmit?: (categoryId: string, input: CreateScheduleItemInput) => void;
  onRequestDelete?: () => void;
};

export const MilestoneFormModal = ({
  isOpen,
  onClose,
  categories,
  mode = "create",
  onSubmit,
  onRequestDelete,
}: MilestoneFormModalProps) => {
  const [milestoneName, setMilestoneName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const datePicker = useScheduleDatePicker();
  const activeCategory = categories.find(
    (category) => category.id === selectedCategory,
  );

  const handleSubmit = () => {
    const scheduleRange = getScheduleRangeFromSelection(datePicker);
    const trimmedName = milestoneName.trim();

    if (!selectedCategory || !trimmedName || !scheduleRange) {
      return;
    }

    onSubmit?.(selectedCategory, {
      title: trimmedName,
      start: scheduleRange.start,
      end: scheduleRange.end,
      dates: scheduleRange.dates,
      accent: activeCategory?.accent ?? "#171717",
    });
    setMilestoneName("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ScheduleFormModalFrame
      title={mode === "edit" ? "마일스톤 수정하기" : "마일스톤 추가하기"}
      submitLabel={mode === "edit" ? "수정" : "추가"}
      disabled={
        !selectedCategory ||
        !milestoneName ||
        !datePicker.isDateSelectionComplete
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
            variant="inverse"
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
