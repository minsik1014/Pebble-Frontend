import { type ScheduleItem } from "@/types";
import { SidebarScheduleCheckbox } from "@/features/calendar/components/sidebar/SidebarScheduleCheckbox";
import { getScheduleTextColorClass } from "@/features/calendar/utils/scheduleCompletionStyle";
import { formatScheduleDisplayLabel } from "@/utils/scheduleDate";

type TaskListItemProps = {
  item: ScheduleItem;
  checked: boolean;
  onToggle: () => void;
};

export const TaskListItem = ({
  item,
  checked,
  onToggle,
}: TaskListItemProps) => {
  const dateLabel = formatScheduleDisplayLabel(item);
  const accentColor = item.accent ?? "#171717";
  const titleColorClass = getScheduleTextColorClass(checked);

  return (
    <label
      className="w-80 gap-2 pr-2 py-2 flex items-center relative rounded-token-s overflow-hidden cursor-pointer hover:bg-fill-surface transition-colors shrink-0"
    >
      <div className="flex flex-1 grow items-center gap-2 relative min-w-0">
        <div
          className="relative w-2 h-8 rounded shrink-0"
          style={{ backgroundColor: accentColor }}
        />
        <div className={`relative min-w-0 max-w-[170px] truncate text-body-02-m ${titleColorClass}`}>
          {item.title}
        </div>
      </div>
      <div className="inline-flex items-center justify-end gap-3 shrink-0">
        <div className="inline-flex items-center justify-end">
          <div className="text-body-02-m text-text-teritary whitespace-nowrap">
            {dateLabel}
          </div>
        </div>
        <SidebarScheduleCheckbox
          checked={checked}
          ariaLabel={`${item.title} 일정 완료`}
          onChange={onToggle}
        />
      </div>
      <span className="sr-only">{dateLabel}</span>
    </label>
  );
};
