import { type Category, type ScheduleItem } from "@/types";
import ChevronUpIcon from "@/assets/icons/chevron-up.svg?react";
import EyeOnIcon from "@/assets/icons/eye-on.svg?react";
import EyeOffIcon from "@/assets/icons/eye-off.svg?react";
import { AddButton } from "@/components/ui/AddButton";
import { SidebarScheduleCheckbox } from "@/features/calendar/components/sidebar/SidebarScheduleCheckbox";
import { getScheduleTextColorClass } from "@/features/calendar/utils/scheduleCompletionStyle";
import { isTaskCompleted } from "@/features/task/utils/taskCompletion";
import {
  formatScheduleDisplayDate,
  getScheduleDisplayLabels,
  parseIsoScheduleDate,
} from "@/utils/scheduleDate";

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
    taskDateId?: number,
  ) => void | Promise<void>;
  onToggleTaskCompleted?: (
    categoryId: string,
    milestoneId: string,
    taskId: string,
    taskDateId?: number,
  ) => void | Promise<void>;
  onEditMilestone?: (categoryId: string, milestoneId: string) => void;
  onEditCategoryTask?: (categoryId: string, taskId: string) => void;
  onEditTask?: (
    categoryId: string,
    milestoneId: string,
    taskId: string,
  ) => void;
  onAddSchedule?: (categoryId: string) => void;
  onSelectCategory?: (categoryId: string) => void;
  onToggleVisibility?: (categoryId: string) => void | Promise<void>;
  isSelected?: boolean;
};

type SidebarScheduleRowProps = {
  item: ScheduleItem;
  checked: boolean;
  onToggle: (taskDateId?: number) => void;
  onEdit: () => void;
  barColor: string;
  widthClassName: string;
};

const SCHEDULE_LEVEL_CLASS = {
  child: "w-[320px]",
  grandchild: "w-[308px]",
} as const;

const getScheduleSortTime = (item: ScheduleItem) => {
  const dateValues =
    "taskDates" in item && item.taskDates?.length
      ? item.taskDates.map((taskDate) => taskDate.date.slice(0, 10))
      : item.dates?.length
        ? item.dates
        : [item.start];
  const sortedTimes = dateValues
    .map((date) => parseIsoScheduleDate(date)?.getTime())
    .filter((time): time is number => time !== undefined)
    .sort((a, b) => a - b);

  return sortedTimes[0] ?? Number.MAX_SAFE_INTEGER;
};

const sortScheduleItemsByDate = <T extends ScheduleItem>(items: T[]) =>
  [...items].sort((a, b) => {
    const dateDiff = getScheduleSortTime(a) - getScheduleSortTime(b);

    if (dateDiff !== 0) {
      return dateDiff;
    }

    return a.title.localeCompare(b.title, "ko");
  });

const getScheduleRows = (item: ScheduleItem, checked: boolean) => {
  if ("taskDates" in item && item.taskDates?.length) {
    return [...item.taskDates]
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((taskDate) => ({
        key: String(taskDate.taskDateId),
        dateLabel: formatScheduleDisplayDate(taskDate.date.slice(0, 10)),
        checked: Boolean(taskDate.isCompleted),
        taskDateId: taskDate.taskDateId,
      }));
  }

  if (item.dates && item.dates.length > 0) {
    return [...item.dates]
      .sort((a, b) => a.localeCompare(b))
      .map((date) => ({
        key: date,
        dateLabel: formatScheduleDisplayDate(date),
        checked,
        taskDateId: undefined,
      }));
  }

  return getScheduleDisplayLabels(item).map((dateLabel) => ({
    key: dateLabel,
    dateLabel,
    checked,
    taskDateId: undefined,
  }));
};

const SidebarScheduleRow = ({
  item,
  checked,
  onToggle,
  onEdit,
  barColor,
  widthClassName,
}: SidebarScheduleRowProps) => {
  const rows = getScheduleRows(item, checked);

  return (
    <>
      {rows.map((row) => {
        const titleColorClass = getScheduleTextColorClass(row.checked);

        return (
          <div
            key={`${item.id}-${row.key}`}
            className={`${widthClassName} flex shrink-0 items-center gap-2 overflow-hidden rounded-token-s bg-fill-inverse py-2 pr-2 transition-colors hover:bg-fill-surface dark:bg-[#222222]`}
          >
            <button
              type="button"
              className="flex min-w-0 flex-1 items-center gap-2 text-left"
              onClick={onEdit}
            >
              <div
                className="h-8 w-2 shrink-0 rounded"
                style={{ backgroundColor: barColor }}
              />
              <span
                className={`min-w-0 max-w-[190px] flex-1 truncate text-body-02-m ${titleColorClass}`}
              >
                {item.title}
              </span>
            </button>

            <div
              role="button"
              tabIndex={0}
              className="flex shrink-0 cursor-pointer items-center justify-end gap-3"
              onClick={() => onToggle(row.taskDateId)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onToggle(row.taskDateId);
                }
              }}
            >
              <span className="whitespace-nowrap text-body-02-m text-text-teritary">
                {row.dateLabel}
              </span>
              <SidebarScheduleCheckbox
                checked={row.checked}
                ariaLabel={`${item.title} 일정 완료`}
                onChange={() => onToggle(row.taskDateId)}
                stopPropagation
              />
            </div>
          </div>
        );
      })}
    </>
  );
};

export const MilestoneAccordion = ({
  category,
  expanded,
  onToggleExpanded,
  onToggleMilestoneCompleted,
  onToggleCategoryTaskCompleted,
  onToggleTaskCompleted,
  onEditMilestone,
  onEditCategoryTask,
  onEditTask,
  onAddSchedule,
  onSelectCategory,
  onToggleVisibility,
  isSelected = false,
}: MilestoneAccordionProps) => {
  const isVisible = !category.isHidden;

  return (
    <section
      className={`w-[352px] shrink-0 flex flex-col items-center justify-center relative overflow-visible rounded-token-m bg-fill-inverse dark:bg-[#222222] ${
        isSelected
          ? "after:pointer-events-none after:absolute after:inset-0 after:z-10 after:rounded-token-m after:border-2 after:border-border-selected after:content-[''] shadow-[0px_0px_14px_0px_rgba(23,23,23,0.05)] dark:shadow-[0px_0px_8px_0px_rgba(255,255,255,0.025)]"
          : "shadow-[0px_0px_14px_0px_rgba(23,23,23,0.05)] dark:shadow-[0px_0px_8px_0px_rgba(255,255,255,0.025)]"
      }`}
    >
      <div
        className="flex w-full items-center justify-between pl-5 pr-3 py-3 relative bg-fill-inverse rounded-token-m overflow-hidden cursor-pointer hover:bg-fill-surface transition-colors dark:bg-[#222222]"
        onClick={() => onSelectCategory?.(category.id)}
      >
        <div className="flex w-[232px] min-w-0 items-center gap-3 relative">
          <div
            className="relative w-2 h-10 rounded"
            style={{ backgroundColor: category.accent }}
          />
          <h2 className="min-w-0 truncate text-title-03-sb text-text-strong">
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
          {onToggleVisibility && (
            <button
              type="button"
              aria-label={`${category.title} ${isVisible ? "숨기기" : "보이기"}`}
              aria-pressed={!isVisible}
              onClick={(e) => {
                e.stopPropagation();
                void onToggleVisibility(category.id);
              }}
              className="relative flex items-center justify-center w-11 h-11 rounded-token-s hover:bg-fill-surface-hover transition-colors"
            >
              {isVisible ? (
                <EyeOnIcon className="w-6 h-6 text-text-secondary" />
              ) : (
                <EyeOffIcon className="w-6 h-6 text-text-secondary dark:text-btn-secondary" />
              )}
            </button>
          )}
        </div>
      </div>
      {expanded && (
        <div className="flex w-full flex-col items-center">
          <div className="flex w-full max-h-[216px] flex-col items-end justify-start gap-2 overflow-y-auto pl-5 pr-3 custom-scrollbar">
            {sortScheduleItemsByDate(category.items).map((item) => (
              <div
                key={item.id}
                className="flex w-full flex-col items-end gap-2"
              >
                <div className={SCHEDULE_LEVEL_CLASS.child}>
                  <SidebarScheduleRow
                    item={item}
                    checked={Boolean(item.isCompleted)}
                    onToggle={() =>
                      onToggleMilestoneCompleted?.(category.id, item.id)
                    }
                    onEdit={() => onEditMilestone?.(category.id, item.id)}
                    barColor={category.themeMid}
                    widthClassName="w-full"
                  />
                </div>

                {Boolean(item.tasks?.length) && (
                  <div className="flex w-full flex-col items-end gap-2">
                    {sortScheduleItemsByDate(item.tasks ?? []).map((task) => (
                      <div
                        key={task.id}
                        className={SCHEDULE_LEVEL_CLASS.grandchild}
                      >
                        <SidebarScheduleRow
                          item={task}
                          checked={isTaskCompleted(task)}
                          onToggle={(taskDateId) =>
                            onToggleTaskCompleted?.(
                              category.id,
                              item.id,
                              task.id,
                              taskDateId,
                            )
                          }
                          onEdit={() =>
                            onEditTask?.(category.id, item.id, task.id)
                          }
                          barColor={category.themeLight}
                          widthClassName="w-full"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {sortScheduleItemsByDate(category.tasks ?? []).map((task) => (
              <div key={task.id} className={SCHEDULE_LEVEL_CLASS.child}>
                <SidebarScheduleRow
                  item={task}
                  checked={isTaskCompleted(task)}
                  onToggle={(taskDateId) =>
                    onToggleCategoryTaskCompleted?.(
                      category.id,
                      task.id,
                      taskDateId,
                    )
                  }
                  onEdit={() => onEditCategoryTask?.(category.id, task.id)}
                  barColor={category.themeLight}
                  widthClassName="w-full"
                />
              </div>
            ))}
          </div>
          {onAddSchedule && (
            <div className="flex w-full flex-col items-start px-5 py-3">
              <AddButton
                label="일정 추가하기"
                variant="secondary"
                className="w-[312px]"
                onClick={() => onAddSchedule(category.id)}
              />
            </div>
          )}
        </div>
      )}
    </section>
  );
};
