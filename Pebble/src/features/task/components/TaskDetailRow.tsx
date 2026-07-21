import { type ScheduleItem } from "@/types";
import EditIcon from "@/assets/icons/newedit.svg?react";
import { formatScheduleDisplayLabel } from "@/utils/scheduleDate";

// The task definition inside a category detail item seems to be just a standard ScheduleItem
type TaskDetailRowProps = {
  task: ScheduleItem;
  themeLightColor: string;
  themeTextColor: string;
  onEdit?: () => void;
};

export const TaskDetailRow = ({
  task,
  themeLightColor,
  themeTextColor,
  onEdit,
}: TaskDetailRowProps) => {
  const dateLabel = formatScheduleDisplayLabel(task);

  return (
    <div className="w-[736px] pr-2 py-2 bg-fill-inverse rounded-xl inline-flex justify-start items-center gap-2 overflow-hidden">
      <div className="flex-1 flex justify-start items-center gap-2">
        <div
          className="w-2 h-8 rounded-sm"
          style={{ backgroundColor: themeLightColor }}
        />
        <span
          className="max-w-64 text-body-02-m truncate"
          style={{ color: themeTextColor }}
        >
          {task.title}
        </span>
      </div>
      <div className="flex justify-end items-center gap-3">
        <div className="flex justify-end items-center">
          <span className="text-body-02-m" style={{ color: themeTextColor }}>
            {dateLabel}
          </span>
        </div>
        <div className="w-6 h-6 rounded-token-xs border border-border-default flex-shrink-0" />
        <button 
          className="w-11 h-11 flex items-center justify-center rounded-token-s hover:bg-fill-surface transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.();
          }}
        >
          <EditIcon className="w-6 h-6 text-border-default" />
        </button>
      </div>
    </div>
  );
};
