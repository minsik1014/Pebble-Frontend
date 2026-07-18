import { useEffect, useState } from "react";
import { type Category } from "@/types";
import { ScheduleDatePicker } from "@/components/ui/ScheduleDatePicker";
import { useScheduleDatePicker } from "@/hooks/useScheduleDatePicker";
import type { CreateScheduleItemInput } from "@/features/calendar/hooks/useCalendarState";

type TaskFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  defaultCategoryId?: string | null;
  defaultMilestoneId?: string | null;
  mode?: "create" | "edit";
  onSubmit?: (
    categoryId: string,
    milestoneId: string,
    input: CreateScheduleItemInput,
  ) => void;
  onRequestDelete?: () => void;
};

const formatScheduleDate = (date: Date) =>
  [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");

export const TaskFormModal = ({ 
  isOpen, 
  onClose, 
  categories,
  defaultCategoryId = null,
  defaultMilestoneId = null,
  mode = "create",
  onSubmit,
  onRequestDelete,
}: TaskFormModalProps) => {
  const [taskName, setTaskName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(defaultCategoryId);
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(defaultMilestoneId);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isMilestoneDropdownOpen, setIsMilestoneDropdownOpen] = useState(false);
  const datePicker = useScheduleDatePicker();
  const { reset } = datePicker;
  
  // Update defaults when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedCategory(defaultCategoryId);
      setSelectedMilestone(defaultMilestoneId);
      setTaskName("");
      reset();
    }
  }, [isOpen, defaultCategoryId, defaultMilestoneId, reset]);

  if (!isOpen) return null;

  const activeCategory = categories.find(c => c.id === selectedCategory);
  const availableMilestones = activeCategory?.items || [];

  const getScheduleRange = () => {
    if (datePicker.dateType === "하루" && datePicker.selectedDate) {
      return {
        start: formatScheduleDate(datePicker.selectedDate),
        end: undefined,
      };
    }

    if (
      datePicker.dateType === "기간" &&
      datePicker.dateRange.start &&
      datePicker.dateRange.end
    ) {
      return {
        start: formatScheduleDate(datePicker.dateRange.start),
        end: formatScheduleDate(datePicker.dateRange.end),
      };
    }

    if (datePicker.dateType === "다중" && datePicker.multiDates.length > 0) {
      const selectedDates = [...datePicker.multiDates].sort(
        (a, b) => a.getTime() - b.getTime(),
      );

      return {
        start: formatScheduleDate(selectedDates[0]),
        end:
          selectedDates.length > 1
            ? formatScheduleDate(selectedDates[selectedDates.length - 1])
            : undefined,
      };
    }

    return null;
  };

  const handleSubmit = () => {
    const scheduleRange = getScheduleRange();
    const trimmedName = taskName.trim();

    if (!selectedCategory || !selectedMilestone || !trimmedName || !scheduleRange) {
      return;
    }

    onSubmit?.(selectedCategory, selectedMilestone, {
      title: trimmedName,
      start: scheduleRange.start,
      end: scheduleRange.end,
      accent: activeCategory?.accent ?? "#171717",
      rowWidthClass: "w-[308px]",
    });
    setTaskName("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-fill-shadow">
      <div className="w-[640px] p-8 bg-fill-inverse rounded-[32px] flex flex-col gap-5 shadow-shadow-m relative">
        <h2 className="text-[24px] font-semibold text-text-strong leading-[1.3] tracking-[-0.24px]">
          {mode === "edit" ? "태스크 편집" : "태스크 추가하기"}
        </h2>

        {/* Form Inputs Container */}
        <div className="flex flex-col gap-3 w-full mt-2">
          
          {/* Row 1: Dropdowns */}
          <div className="flex items-center gap-3 w-full">
            {/* Category Dropdown */}
            <div className="relative flex-[1]">
              <button 
                className="w-full h-[48px] bg-fill-surface border border-border-secondary rounded-[12px] flex items-center justify-between px-5"
                onClick={() => {
                  setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
                  setIsMilestoneDropdownOpen(false);
                }}
              >
                {selectedCategory ? (
                  <div className="flex items-center gap-2 w-full relative">
                    <div
                      className="w-[6px] h-[24px] rounded-[4px]"
                      style={{ backgroundColor: activeCategory?.themeBase || "#171717" }}
                    />
                    <span className="text-[16px] text-text-strong font-medium">
                      {activeCategory?.title}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center w-full relative">
                    <span className="text-[16px] text-text-strong font-medium">카테고리</span>
                  </div>
                )}
                <div className="absolute right-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 10L12 15L17 10H7Z" fill="#171717"/>
                  </svg>
                </div>
              </button>
              {isCategoryDropdownOpen && (
                <div className="absolute top-[52px] left-0 w-full bg-fill-inverse border border-border-default rounded-[12px] shadow-shadow-m z-20 max-h-[200px] overflow-y-auto flex flex-col gap-1 p-2">
                  {categories.map(cat => (
                    <button 
                      key={cat.id} 
                      className="flex items-center gap-2 p-2 hover:bg-fill-surface rounded-[8px] transition-colors text-left"
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setSelectedMilestone(null); // Reset milestone when category changes
                        setIsCategoryDropdownOpen(false);
                      }}
                    >
                      <div
                        className="w-[6px] h-[24px] rounded-[4px]"
                        style={{ backgroundColor: cat.themeBase || "#171717" }}
                      />
                      <span className="text-[16px] font-medium text-text-strong">{cat.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Milestone Dropdown */}
            <div className="relative flex-[1]">
              <button 
                className="w-full h-[48px] bg-fill-surface border border-border-secondary rounded-[12px] flex items-center justify-between px-5"
                onClick={() => {
                  if (activeCategory) setIsMilestoneDropdownOpen(!isMilestoneDropdownOpen);
                  setIsCategoryDropdownOpen(false);
                }}
              >
                {selectedMilestone ? (
                  <div className="flex items-center gap-2 w-full relative">
                    <div
                      className="w-[6px] h-[24px] rounded-[4px]"
                      style={{ backgroundColor: activeCategory?.themeMid || "rgba(23,23,23,0.5)" }}
                    />
                    <span className="text-[16px] text-text-strong font-medium">
                      {availableMilestones.find(m => m.id === selectedMilestone)?.title}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center w-full relative">
                    <span className="text-[16px] text-text-strong font-medium">마일스톤</span>
                  </div>
                )}
                <div className="absolute right-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 10L12 15L17 10H7Z" fill="#171717"/>
                  </svg>
                </div>
              </button>
              {isMilestoneDropdownOpen && (
                <div className="absolute top-[52px] left-0 w-full bg-fill-inverse border border-border-default rounded-[12px] shadow-shadow-m z-20 max-h-[200px] overflow-y-auto flex flex-col gap-1 p-2">
                  {availableMilestones.length > 0 ? (
                    availableMilestones.map(ms => (
                      <button 
                        key={ms.id} 
                        className="flex items-center gap-2 p-2 hover:bg-fill-surface rounded-[8px] transition-colors text-left"
                        onClick={() => {
                          setSelectedMilestone(ms.id);
                          setIsMilestoneDropdownOpen(false);
                        }}
                      >
                        <div
                          className="w-[6px] h-[24px] rounded-[4px]"
                          style={{ backgroundColor: activeCategory?.themeMid || "rgba(23,23,23,0.5)" }}
                        />
                        <span className="text-[16px] font-medium text-text-strong">{ms.title}</span>
                      </button>
                    ))
                  ) : (
                    <div className="p-2 text-center text-text-teritary text-sm">
                      마일스톤이 없습니다.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Row 2: Name Input */}
          <div className="w-full">
            <input 
              type="text" 
              placeholder="태스크 이름을 입력해 주세요"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="w-full h-[48px] bg-fill-inverse border border-border-default rounded-[12px] px-4 text-[16px] font-medium text-text-strong placeholder:text-text-quaternary outline-none focus:border-border-primary transition-colors"
            />
          </div>
        </div>

        <ScheduleDatePicker
          variant="task"
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
          themeLightColor={activeCategory?.themeLight}
        />

        {/* Bottom Actions */}
        <div className="flex gap-3 w-full mt-4">
          {mode === "edit" && (
            <button
              onClick={onRequestDelete}
              className="w-11 h-11 bg-fill-danger rounded-[12px] flex items-center justify-center hover:opacity-90 transition-opacity flex-shrink-0"
              aria-label="삭제"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" fill="white"/>
              </svg>
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-[1] h-11 bg-btn-quaternary text-text-strong rounded-[12px] font-medium hover:bg-black/5 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="flex-[1] h-11 bg-btn-primary text-text-onFill rounded-[12px] font-medium hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
            disabled={
              !selectedCategory || 
              !selectedMilestone ||
              !taskName || 
              !datePicker.isDateSelectionComplete
            }
          >
            {mode === "edit" ? "수정" : "추가"}
          </button>
        </div>
      </div>
    </div>
  );
};
