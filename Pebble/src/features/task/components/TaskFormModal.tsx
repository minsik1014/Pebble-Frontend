import { useEffect, useState } from "react";
import { type Category, type ScheduleItem } from "@/types";
import { ScheduleDatePicker } from "@/components/ui/ScheduleDatePicker";
import {
  CategorySelect,
  MilestoneSelect,
} from "@/features/calendar/components/ScheduleRelationSelects";
import { ScheduleFormModalFrame } from "@/features/calendar/components/ScheduleFormModalFrame";
import { ScheduleNameInput } from "@/features/calendar/components/ScheduleNameInput";
import { useScheduleFormDateInitializer } from "@/features/calendar/hooks/useScheduleFormDateInitializer";
import { useScheduleDatePicker } from "@/hooks/useScheduleDatePicker";
import type { CreateScheduleItemInput } from "@/features/calendar/types";
import { getScheduleRangeFromSelection } from "@/utils/scheduleDate";

type TaskFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  defaultCategoryId?: string | null;
  defaultMilestoneId?: string | null;
  task?: ScheduleItem | null;
  mode?: "create" | "edit";
  onSubmit?: (input: TaskFormSubmitInput) => void | Promise<void>;
  onRequestDelete?: () => void | Promise<void>;
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
  mode = "create",
  onSubmit,
  onRequestDelete,
}: TaskFormModalProps) => {
  const [taskName, setTaskName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    defaultCategoryId,
  );
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(
    defaultMilestoneId,
  );
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isMilestoneDropdownOpen, setIsMilestoneDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const datePicker = useScheduleDatePicker();

  useScheduleFormDateInitializer({
    isOpen,
    task,
    datePicker,
  });

  useEffect(() => {
    if (isOpen) {
      setSelectedCategory(defaultCategoryId);
      setSelectedMilestone(defaultMilestoneId);
      setTaskName(task?.title ?? "");
    }
  }, [isOpen, defaultCategoryId, defaultMilestoneId, task]);

  if (!isOpen) return null;

  const activeCategory = categories.find(
    (category) => category.id === selectedCategory,
  );
  const availableMilestones = activeCategory?.items || [];

  const handleSubmit = async () => {
    const scheduleRange = getScheduleRangeFromSelection(datePicker);
    const trimmedName = taskName.trim();

    if (!trimmedName || !scheduleRange) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit?.({
        categoryId: selectedCategory,
        milestoneId: selectedMilestone,
        task: {
          title: trimmedName,
          start: scheduleRange.start,
          end: scheduleRange.end,
          dates: scheduleRange.dates,
          accent: activeCategory?.accent ?? "#171717",
        },
      });
      setTaskName("");
      onClose();
    } catch (error) {
      console.error("Failed to submit task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScheduleFormModalFrame
      title={mode === "edit" ? "태스크 편집" : "태스크 추가하기"}
      submitLabel={mode === "edit" ? "수정" : "추가"}
      disabled={!taskName || !datePicker.isDateSelectionComplete || isSubmitting}
      titleClassName="leading-[1.3]"
      onCancel={onClose}
      onSubmit={handleSubmit}
      onDelete={mode === "edit" ? onRequestDelete : undefined}
    >
      <div className="flex flex-col gap-3 w-full mt-2">
        <div className="flex items-center gap-3 w-full">
          <div className="flex-[1]">
            <CategorySelect
              categories={categories}
              selectedCategoryId={selectedCategory}
              isOpen={isCategoryDropdownOpen}
              allowEmpty
              onToggleOpen={() => {
                setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
                setIsMilestoneDropdownOpen(false);
              }}
              onSelectCategory={(categoryId) => {
                setSelectedCategory(categoryId);
                setSelectedMilestone(null);
                setIsCategoryDropdownOpen(false);
              }}
            />
          </div>

          <div className="flex-[1]">
            <MilestoneSelect
              milestones={availableMilestones}
              selectedMilestoneId={selectedMilestone}
              themeColor={activeCategory?.themeMid}
              disabled={!activeCategory}
              isOpen={isMilestoneDropdownOpen}
              onToggleOpen={() => {
                if (activeCategory) {
                  setIsMilestoneDropdownOpen(!isMilestoneDropdownOpen);
                }
                setIsCategoryDropdownOpen(false);
              }}
              onSelectMilestone={(milestoneId) => {
                setSelectedMilestone(milestoneId);
                setIsMilestoneDropdownOpen(false);
              }}
            />
          </div>
        </div>

        <ScheduleNameInput
          placeholder="태스크 이름을 입력해 주세요"
          value={taskName}
          onChange={setTaskName}
        />
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
        themeMidColor={activeCategory?.themeMid}
        themeLightColor={activeCategory?.themeLight}
      />
    </ScheduleFormModalFrame>
  );
};
