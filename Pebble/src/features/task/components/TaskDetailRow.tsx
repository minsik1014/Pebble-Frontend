import { type ScheduleItem } from "@/types";
import { SidebarScheduleCheckbox } from "@/features/calendar/components/sidebar/SidebarScheduleCheckbox";
import { getScheduleTextColorClass } from "@/features/calendar/utils/scheduleCompletionStyle";
import { isTaskCompleted } from "@/features/task/utils/taskCompletion";
import { formatScheduleDisplayLabel } from "@/utils/scheduleDate";

// The task definition inside a category detail item seems to be just a standard ScheduleItem
type TaskDetailRowProps = {
  task: ScheduleItem;
  themeLightColor: string;
  onToggleCompleted?: () => void | Promise<void>;
  onEdit?: () => void;
};

export const TaskDetailRow = ({
  task,
  themeLightColor,
  onToggleCompleted,
  onEdit,
}: TaskDetailRowProps) => {
  const dateLabel = formatScheduleDisplayLabel(task);
  const isCompleted = isTaskCompleted(task);
  const titleColorClass = getScheduleTextColorClass(isCompleted);

  return (
    <div className="w-[736px] pr-2 py-2 bg-fill-inverse rounded-xl inline-flex justify-start items-center gap-2 overflow-hidden">
      <button
        type="button"
        className="flex-1 flex justify-start items-center gap-2 text-left"
        onClick={onEdit}
      >
        <div
          className="w-2 h-8 rounded-sm"
          style={{ backgroundColor: themeLightColor }}
        />
        <span className={`max-w-64 truncate text-body-02-m ${titleColorClass}`}>
          {task.title}
        </span>
      </button>
      <div className="flex justify-end items-center gap-3">
        <div
          role="button"
          tabIndex={0}
          className="flex cursor-pointer items-center gap-3"
          onClick={() => {
            void onToggleCompleted?.();
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              void onToggleCompleted?.();
            }
          }}
        >
          <span className="text-body-02-m text-text-teritary">
            {dateLabel}
          </span>
          <SidebarScheduleCheckbox
            checked={isCompleted}
            ariaLabel={`${task.title} 일정 완료`}
            onChange={() => {
              void onToggleCompleted?.();
            }}
            stopPropagation
          />
        </div>
      </div>
    </div>
  );
};
