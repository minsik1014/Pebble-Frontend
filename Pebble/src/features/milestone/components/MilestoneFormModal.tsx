import { useState } from "react";
import { type Category } from "@/types";
import { ScheduleDatePicker } from "@/components/ui/ScheduleDatePicker";
import { ModalActionBar } from "@/components/ui/ModalActionBar";
import { CategorySelect } from "@/features/calendar/components/ScheduleRelationSelects";
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
      rowWidthClass: "w-80",
    });
    setMilestoneName("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-fill-shadow">
      <div className="w-[640px] p-8 bg-fill-inverse rounded-[32px] flex flex-col gap-10 shadow-shadow-m relative">
        <h2 className="text-[24px] font-semibold text-text-strong leading-[1.4] tracking-[-0.24px]">
          {mode === "edit" ? "마일스톤 수정하기" : "마일스톤 추가하기"}
        </h2>

        {/* Inputs */}
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
          
          {/* Name Input */}
          <div className="flex-[6]">
            <input 
              type="text" 
              placeholder="마일스톤 이름을 입력해 주세요"
              value={milestoneName}
              onChange={(e) => setMilestoneName(e.target.value)}
              className="w-full h-[48px] bg-transparent border border-border-default rounded-[12px] px-4 text-[16px] text-text-strong placeholder:text-text-teritary outline-none focus:border-border-primary transition-colors"
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

        {/* Bottom Actions */}
        <div className="mt-4">
          <ModalActionBar
            submitLabel={mode === "edit" ? "수정" : "추가"}
            disabled={
              !selectedCategory ||
              !milestoneName ||
              !datePicker.isDateSelectionComplete
            }
            onCancel={onClose}
            onSubmit={handleSubmit}
            onDelete={mode === "edit" ? onRequestDelete : undefined}
          />
        </div>
      </div>
    </div>
  );
};
