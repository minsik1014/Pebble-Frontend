import { type ScheduleItem } from "@/types";
import EditIcon from "@/assets/icons/newedit.svg?react";

// The task definition inside a category detail item seems to be just a standard ScheduleItem
type TaskDetailRowProps = {
  task: ScheduleItem;
  themeLightColor: string;
  onEdit?: () => void;
};

const formatDisplayDate = (value: string) => {
  const isoMatch = value.match(/^\d{4}-(\d{1,2})-(\d{1,2})$/);

  if (!isoMatch) {
    return value;
  }

  const [, month, day] = isoMatch;
  return `${Number(month)}/${Number(day)}`;
};

export const TaskDetailRow = ({ task, themeLightColor, onEdit }: TaskDetailRowProps) => {
  return (
    <div className="w-[736px] pr-2 py-2 bg-fill-inverse rounded-xl inline-flex justify-start items-center gap-2 overflow-hidden">
      <div className="flex-1 flex justify-start items-center gap-2">
        <div
          className="w-2 h-8 rounded-sm"
          style={{ backgroundColor: themeLightColor }}
        />
        <span className="max-w-64 text-body-02-m text-text-strong truncate">
          {task.title}
        </span>
      </div>
      <div className="flex justify-end items-center gap-3">
        <div className="flex justify-end items-center">
          <span className="text-body-02-m text-text-teritary">{formatDisplayDate(task.start)}</span>
          {task.end && (
            <>
              <span className="text-body-02-m text-text-teritary mx-1">~</span>
              <span className="text-body-02-m text-text-teritary">{formatDisplayDate(task.end)}</span>
            </>
          )}
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
