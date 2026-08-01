import { useState } from "react";
import { type Category, type ScheduleItem } from "@/types";
import ChevronUpIcon from "@/assets/icons/chevron-up.svg?react";
import EyeOnIcon from "@/assets/icons/eye-on.svg?react";
import EyeOffIcon from "@/assets/icons/eye-off.svg?react";
import { AddButton } from "@/components/ui/AddButton";
import { SidebarScheduleCheckbox } from "@/features/calendar/components/sidebar/SidebarScheduleCheckbox";
import { getScheduleTextColorClass } from "@/features/calendar/utils/scheduleCompletionStyle";
import { isTaskCompleted } from "@/features/task/utils/taskCompletion";
import { formatScheduleDisplayLabel } from "@/utils/scheduleDate";

type MilestoneAccordionProps = {
  category: Category;
  expanded: boolean;
  onToggleExpanded: () => void;
  onToggleMilestoneCompleted?: (
    categoryId: string,
    milestoneId: string,
  ) => void | Promise<void>;
  onToggleCategoryTaskCompleted?: (
    categoryId: string,
    taskId: string,
  ) => void | Promise<void>;
  onToggleTaskCompleted?: (
    categoryId: string,
    milestoneId: string,
    taskId: string,
  ) => void | Promise<void>;
  onAddSchedule?: (categoryId: string) => void;
  onSelectCategory?: (categoryId: string) => void;
  isSelected?: boolean;
};

type SidebarScheduleRowProps = {
  item: ScheduleItem;
  checked: boolean;
  onToggle: () => void;
  barColor: string;
  widthClassName: string;
};

const SidebarScheduleRow = ({
  item,
  checked,
  onToggle,
  barColor,
  widthClassName,
}: SidebarScheduleRowProps) => {
  const dateLabel = formatScheduleDisplayLabel(item);
  const titleColorClass = getScheduleTextColorClass(checked);

  return (
    <label
      className={`${widthClassName} flex shrink-0 cursor-pointer items-center gap-2 overflow-hidden rounded-token-s bg-fill-inverse py-2 pr-2 transition-colors hover:bg-fill-surface`}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <div
          className="h-8 w-2 shrink-0 rounded"
          style={{ backgroundColor: barColor }}
        />
        <span className={`min-w-0 max-w-[190px] flex-1 truncate text-body-02-m ${titleColorClass}`}>
          {item.title}
        </span>
      </div>

      <div className="flex shrink-0 items-center justify-end gap-3">
        <span className="whitespace-nowrap text-body-02-m text-text-teritary">
          {dateLabel}
        </span>
        <SidebarScheduleCheckbox
          checked={checked}
          ariaLabel={`${item.title} 일정 완료`}
          onChange={onToggle}
        />
      </div>
    </label>
  );
};

export const MilestoneAccordion = ({
  category,
  expanded,
  onToggleExpanded,
  onToggleMilestoneCompleted,
  onToggleCategoryTaskCompleted,
  onToggleTaskCompleted,
  onAddSchedule,
  onSelectCategory,
  isSelected = false,
}: MilestoneAccordionProps) => {
  const [visible, setVisible] = useState(true);

  return (
    <section
      className={`w-[352px] shrink-0 flex flex-col items-center justify-center relative bg-fill-inverse rounded-[20px] shadow-shadow-s overflow-hidden border-[1.5px] ${
        isSelected ? "border-border-selected" : "border-transparent"
      }`}
    >
      <div 
        className="flex w-full items-center justify-between pl-5 pr-3 py-3 relative bg-fill-inverse rounded-[20px] overflow-hidden cursor-pointer hover:bg-fill-surface transition-colors"
        onClick={() => onSelectCategory?.(category.id)}
      >
        <div className="flex items-center gap-3 relative">
          <div
            className="relative w-2 h-10 rounded"
            style={{ backgroundColor: category.accent }}
          />
          <h2 className="text-title-03-sb text-text-strong">
            {category.title}
          </h2>
        </div>
        <div className="inline-flex items-center justify-end">
          <button
            type="button"
            aria-label={`${category.title} 접기`}
            aria-expanded={expanded}
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpanded();
            }}
            className="relative flex items-center justify-center w-11 h-11 rounded-token-s hover:bg-fill-surface-hover transition-colors"
          >
            <ChevronUpIcon
              className={`w-6 h-6 text-text-secondary transition-transform ${
                expanded ? "" : "rotate-180"
              }`}
            />
          </button>
          <button
            type="button"
            aria-label={`${category.title} 보기`}
            onClick={(e) => {
              e.stopPropagation();
              setVisible(!visible);
            }}
            className="relative flex items-center justify-center w-11 h-11 rounded-token-s hover:bg-fill-surface-hover transition-colors"
          >
            {visible ? (
              <EyeOnIcon className="w-6 h-6 text-text-strong" />
            ) : (
              <EyeOffIcon className="w-6 h-6 text-text-strong" />
            )}
          </button>
        </div>
      </div>
      {expanded && (
        <div className="flex flex-col items-center gap-3 pt-0 pb-3 w-full relative">
          <div className="flex flex-col items-end justify-start gap-2 pl-5 pr-3 w-full max-h-[216px] overflow-y-auto custom-scrollbar">
            {category.tasks?.map((task) => (
              <SidebarScheduleRow
                key={task.id}
                item={task}
                checked={isTaskCompleted(task)}
                onToggle={() => onToggleCategoryTaskCompleted?.(category.id, task.id)}
                barColor={category.themeLight}
                widthClassName="w-80"
              />
            ))}

            {category.items.map((item) => (
              <div key={item.id} className="flex w-full flex-col items-end gap-2">
                <SidebarScheduleRow
                  item={item}
                  checked={Boolean(item.isCompleted)}
                  onToggle={() =>
                    onToggleMilestoneCompleted?.(category.id, item.id)
                  }
                  barColor={category.themeMid}
                  widthClassName="w-80"
                />
                {item.tasks?.map((task) => (
                  <SidebarScheduleRow
                    key={task.id}
                    item={task}
                    checked={isTaskCompleted(task)}
                    onToggle={() =>
                      onToggleTaskCompleted?.(category.id, item.id, task.id)
                    }
                    barColor={category.themeLight}
                    widthClassName="w-[308px]"
                  />
                ))}
              </div>
            ))}
          </div>
          <AddButton 
            label="일정 추가하기" 
            variant="secondary" 
            className="w-[312px]" 
            onClick={() => onAddSchedule?.(category.id)}
          />
        </div>
      )}
    </section>
  );
};
