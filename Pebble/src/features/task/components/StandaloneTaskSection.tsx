import { type TaskItem } from "@/types";
import { SidebarScheduleCheckbox } from "@/features/calendar/components/sidebar/SidebarScheduleCheckbox";
import { getScheduleTextColorClass } from "@/features/calendar/utils/scheduleCompletionStyle";
import { isTaskCompleted } from "@/features/task/utils/taskCompletion";
import { getScheduleDisplayLabels } from "@/utils/scheduleDate";

type StandaloneTaskSectionProps = {
  tasks: TaskItem[];
  onToggleTaskCompleted?: (taskId: string) => void | Promise<void>;
  onEditTask: (taskId: string) => void;
};

export const StandaloneTaskSection = ({
  tasks,
  onToggleTaskCompleted,
  onEditTask,
}: StandaloneTaskSectionProps): JSX.Element => (
  <>
    {tasks.flatMap((task) => {
      const dateLabels = getScheduleDisplayLabels(task);
      const accentColor = task.accent ?? "#171717";
      const isCompleted = isTaskCompleted(task);
      const titleColorClass = getScheduleTextColorClass(
        isCompleted,
        "text-text-strong",
      );

      return dateLabels.map((dateLabel) => (
        <section
          key={`${task.id}-${dateLabel}`}
          className="flex w-[352px] shrink-0 flex-col overflow-hidden rounded-[20px] bg-fill-inverse shadow-shadow-s"
        >
          <div
            className="flex w-full items-center justify-between gap-3 rounded-[20px] bg-fill-inverse py-3 pl-5 pr-3 text-left transition-colors hover:bg-fill-surface"
          >
            <button
              type="button"
              className="flex min-w-0 flex-1 items-center gap-2 text-left"
              onClick={() => onEditTask(task.id)}
            >
              <div
                className="h-10 w-2 shrink-0 rounded"
                style={{ backgroundColor: accentColor }}
              />
              <span className={`min-w-0 flex-1 truncate text-title-03-sb ${titleColorClass}`}>
                {task.title}
              </span>
            </button>

            <div
              role="button"
              tabIndex={0}
              className="flex shrink-0 cursor-pointer items-center justify-end gap-2"
              onClick={() => onToggleTaskCompleted?.(task.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onToggleTaskCompleted?.(task.id);
                }
              }}
            >
              <span className="whitespace-nowrap text-body-02-m text-text-teritary">
                {dateLabel}
              </span>
              <SidebarScheduleCheckbox
                checked={isCompleted}
                ariaLabel={`${task.title} 일정 완료`}
                onChange={() => onToggleTaskCompleted?.(task.id)}
                stopPropagation
              />
            </div>
          </div>
        </section>
      ));
    })}
  </>
);
