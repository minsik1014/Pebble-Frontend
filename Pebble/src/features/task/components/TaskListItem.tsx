import { type ScheduleItem } from "@/types";

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
  const dateLabel = item.end ? `${item.start} ~ ${item.end}` : item.start;

  return (
    <label
      className={`${item.rowWidthClass} gap-2 pr-2 py-2 flex items-center relative rounded-token-s overflow-hidden cursor-pointer hover:bg-fill-surface transition-colors shrink-0`}
    >
      <div className="flex flex-1 grow items-center gap-2 relative min-w-0">
        <div
          className="relative w-2 h-8 rounded shrink-0"
          style={{ backgroundColor: item.accent }}
        />
        <div className="relative min-w-0 max-w-[170px] text-body-02-m text-text-strong truncate">
          {item.title}
        </div>
      </div>
      <div className="inline-flex items-center justify-end gap-3 shrink-0">
        <div className="inline-flex items-center justify-end">
          <div className="text-body-02-m text-text-quaternary whitespace-nowrap">
            {dateLabel}
          </div>
        </div>
        <span className="relative inline-flex h-6 w-6 items-center justify-center">
          <input
            type="checkbox"
            aria-label={`${item.title} 일정 완료`}
            checked={checked}
            onChange={onToggle}
            className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
          <span className="relative w-6 h-6 rounded border border-border-default bg-fill-inverse peer-checked:border-fill-primary peer-checked:bg-fill-primary" />
        </span>
      </div>
      <span className="sr-only">{dateLabel}</span>
    </label>
  );
};
