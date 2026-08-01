import type { Category, ScheduleItem, TaskItem } from "@/types";
import { SidebarScheduleCheckbox } from "@/features/calendar/components/sidebar/SidebarScheduleCheckbox";
import { getScheduleTextColorClass } from "@/features/calendar/utils/scheduleCompletionStyle";
import { parseScheduleDate } from "@/features/milestone/components/scheduleDateUtils";
import { formatScheduleDisplayLabel } from "@/utils/scheduleDate";

type CalendarSidebarListViewProps = {
  categories: Category[];
  standaloneTasks: TaskItem[];
  currentYear: number;
  currentMonth: number;
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
  onToggleStandaloneTaskCompleted?: (
    taskId: string,
    taskDateId?: number,
  ) => void | Promise<void>;
  onEditStandaloneTask?: (taskId: string) => void;
  onEditCategoryTask?: (categoryId: string, taskId: string) => void;
  onEditMilestone?: (categoryId: string, milestoneId: string) => void;
  onEditTask?: (
    categoryId: string,
    milestoneId: string,
    taskId: string,
  ) => void;
};

type DatedSidebarItem = {
  item: ScheduleItem;
  date: Date;
  barColor: string;
  isCompleted?: boolean;
} & (
  | { type: "standaloneTask"; taskId: string; taskDateId?: number }
  | {
      type: "categoryTask";
      categoryId: string;
      taskId: string;
      taskDateId?: number;
    }
  | { type: "milestone"; categoryId: string; milestoneId: string }
  | {
      type: "milestoneTask";
      categoryId: string;
      milestoneId: string;
      taskId: string;
      taskDateId?: number;
    }
);

type TaskDateOccurrence = {
  date: Date;
  taskDateId?: number;
  isCompleted?: boolean;
};

const getDatesInRange = (startDate: Date, endDate: Date) => {
  const dates: Date[] = [];
  const startTime = startDate.getTime();
  const endTime = endDate.getTime();
  const cursor = new Date(startTime <= endTime ? startDate : endDate);
  const lastDate = new Date(startTime <= endTime ? endDate : startDate);

  while (cursor.getTime() <= lastDate.getTime()) {
    dates.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return dates;
};

const getItemDates = (item: ScheduleItem, fallbackYear: number) => {
  if (item.dates && item.dates.length > 0) {
    return item.dates
      .map((date) => parseScheduleDate(date, fallbackYear))
      .filter((date): date is Date => Boolean(date));
  }

  const startDate = parseScheduleDate(item.start, fallbackYear);
  const endDate = item.end ? parseScheduleDate(item.end, fallbackYear) : startDate;

  if (!startDate || !endDate) {
    return [];
  }

  return getDatesInRange(startDate, endDate);
};

const getTaskDateOccurrences = (
  task: TaskItem,
  fallbackYear: number,
): TaskDateOccurrence[] => {
  if (task.taskDates?.length) {
    const occurrences: TaskDateOccurrence[] = [];

    task.taskDates.forEach((taskDate) => {
      const date = parseScheduleDate(taskDate.date, fallbackYear);

      if (date) {
        occurrences.push({
          date,
          taskDateId: taskDate.taskDateId,
          isCompleted: taskDate.isCompleted,
        });
      }
    });

    return occurrences;
  }

  return getItemDates(task, fallbackYear).map((date) => ({
    date,
    isCompleted: task.isCompleted,
  }));
};

const isSameMonth = (date: Date, year: number, month: number) =>
  date.getFullYear() === year && date.getMonth() + 1 === month;

const formatGroupTitle = (date: Date) =>
  `${date.getMonth() + 1}월 ${date.getDate()}일`;

const getDatedItemKey = (groupKey: string, datedItem: DatedSidebarItem) => {
  const baseKey = [
    groupKey,
    datedItem.type,
    datedItem.item.id,
    datedItem.date.toISOString(),
  ];

  if ("categoryId" in datedItem) {
    baseKey.push(datedItem.categoryId);
  }

  if ("milestoneId" in datedItem) {
    baseKey.push(datedItem.milestoneId);
  }

  if ("taskDateId" in datedItem && datedItem.taskDateId) {
    baseKey.push(String(datedItem.taskDateId));
  }

  return baseKey.join("-");
};

const collectSidebarItemsByDate = ({
  categories,
  standaloneTasks,
  currentYear,
  currentMonth,
}: Pick<
  CalendarSidebarListViewProps,
  "categories" | "standaloneTasks" | "currentYear" | "currentMonth"
>) => {
  const datedItems: DatedSidebarItem[] = [];

  standaloneTasks.forEach((task) => {
    const barColor = task.accent ?? "#171717";

    getTaskDateOccurrences(task, currentYear)
      .filter(({ date }) => isSameMonth(date, currentYear, currentMonth))
      .forEach(({ date, taskDateId, isCompleted }) => {
        datedItems.push({
          item: task,
          date,
          barColor,
          isCompleted,
          type: "standaloneTask",
          taskId: task.id,
          taskDateId,
        });
      });
  });

  categories.forEach((category) => {
    category.tasks?.forEach((task) => {
      getTaskDateOccurrences(task, currentYear)
        .filter(({ date }) => isSameMonth(date, currentYear, currentMonth))
        .forEach(({ date, taskDateId, isCompleted }) => {
          datedItems.push({
            item: task,
            date,
            barColor: category.themeLight,
            isCompleted,
            type: "categoryTask",
            categoryId: category.id,
            taskId: task.id,
            taskDateId,
          });
        });
    });

    category.items.forEach((milestone) => {
      getItemDates(milestone, currentYear)
        .filter((date) => isSameMonth(date, currentYear, currentMonth))
        .forEach((date) => {
          datedItems.push({
            item: milestone,
            date,
            barColor: category.themeMid,
            isCompleted: Boolean(milestone.isCompleted),
            type: "milestone",
            categoryId: category.id,
            milestoneId: milestone.id,
          });
      });

      milestone.tasks?.forEach((task) => {
        getTaskDateOccurrences(task, currentYear)
          .filter(({ date }) => isSameMonth(date, currentYear, currentMonth))
          .forEach(({ date, taskDateId, isCompleted }) => {
            datedItems.push({
              item: task,
              date,
              barColor: category.themeLight,
              isCompleted,
              type: "milestoneTask",
              categoryId: category.id,
              milestoneId: milestone.id,
              taskId: task.id,
              taskDateId,
            });
          });
      });
    });
  });

  const sortedItems = datedItems.sort((a, b) => {
    const dateDiff = a.date.getTime() - b.date.getTime();

    if (dateDiff !== 0) {
      return dateDiff;
    }

    return a.item.title.localeCompare(b.item.title, "ko");
  });

  return sortedItems.reduce<{ key: string; title: string; items: DatedSidebarItem[] }[]>(
    (groups, item) => {
      const key = [
        item.date.getFullYear(),
        item.date.getMonth() + 1,
        item.date.getDate(),
      ].join("-");
      const previousGroup = groups.at(-1);

      if (previousGroup?.key === key) {
        previousGroup.items.push(item);
        return groups;
      }

      groups.push({
        key,
        title: formatGroupTitle(item.date),
        items: [item],
      });

      return groups;
    },
    [],
  );
};

export const CalendarSidebarListView = ({
  categories,
  standaloneTasks,
  currentYear,
  currentMonth,
  onToggleMilestoneCompleted,
  onToggleCategoryTaskCompleted,
  onToggleTaskCompleted,
  onToggleStandaloneTaskCompleted,
  onEditStandaloneTask,
  onEditCategoryTask,
  onEditMilestone,
  onEditTask,
}: CalendarSidebarListViewProps): JSX.Element => {
  const groupedItems = collectSidebarItemsByDate({
    categories,
    standaloneTasks,
    currentYear,
    currentMonth,
  });

  const handleToggleCompleted = (datedItem: DatedSidebarItem) => {
    if (datedItem.type === "standaloneTask") {
      void onToggleStandaloneTaskCompleted?.(
        datedItem.taskId,
        datedItem.taskDateId,
      );
      return;
    }

    if (datedItem.type === "categoryTask") {
      void onToggleCategoryTaskCompleted?.(
        datedItem.categoryId,
        datedItem.taskId,
        datedItem.taskDateId,
      );
      return;
    }

    if (datedItem.type === "milestone") {
      void onToggleMilestoneCompleted?.(
        datedItem.categoryId,
        datedItem.milestoneId,
      );
      return;
    }

    void onToggleTaskCompleted?.(
      datedItem.categoryId,
      datedItem.milestoneId,
      datedItem.taskId,
      datedItem.taskDateId,
    );
  };

  const handleEdit = (datedItem: DatedSidebarItem) => {
    if (datedItem.type === "standaloneTask") {
      onEditStandaloneTask?.(datedItem.taskId);
      return;
    }

    if (datedItem.type === "categoryTask") {
      onEditCategoryTask?.(datedItem.categoryId, datedItem.taskId);
      return;
    }

    if (datedItem.type === "milestone") {
      onEditMilestone?.(datedItem.categoryId, datedItem.milestoneId);
      return;
    }

    onEditTask?.(
      datedItem.categoryId,
      datedItem.milestoneId,
      datedItem.taskId,
    );
  };

  return (
    <div className="flex w-[352px] flex-col gap-5">
      {groupedItems.map((group) => (
        <section key={group.key} className="flex w-full flex-col gap-3">
          <h2 className="text-body-01-sb text-text-primary">{group.title}</h2>
          <div className="flex w-full flex-col gap-2">
            {group.items.map((datedItem) => {
              const { item, barColor } = datedItem;
              const titleColorClass = getScheduleTextColorClass(
                Boolean(datedItem.isCompleted),
              );

              return (
                <div
                  key={getDatedItemKey(group.key, datedItem)}
                  className="flex h-12 w-full shrink-0 items-center gap-2 overflow-hidden rounded-token-s bg-fill-inverse py-2 pr-2 shadow-shadow-s transition-colors hover:bg-fill-surface"
                >
                  <button
                    type="button"
                    className="flex min-w-0 flex-1 items-center gap-2 text-left"
                    onClick={() => handleEdit(datedItem)}
                  >
                    <div
                      className="h-8 w-2 shrink-0 rounded"
                      style={{ backgroundColor: barColor }}
                    />
                    <span className={`min-w-0 max-w-[190px] flex-1 truncate text-body-02-m ${titleColorClass}`}>
                      {item.title}
                    </span>
                  </button>

                  <div
                    role="button"
                    tabIndex={0}
                    className="flex shrink-0 cursor-pointer items-center justify-end gap-3"
                    onClick={() => handleToggleCompleted(datedItem)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        handleToggleCompleted(datedItem);
                      }
                    }}
                  >
                    <span className="whitespace-nowrap text-body-02-m text-text-teritary">
                      {formatScheduleDisplayLabel(item)}
                    </span>
                    <SidebarScheduleCheckbox
                      checked={Boolean(datedItem.isCompleted)}
                      ariaLabel={`${item.title} 일정 완료`}
                      onChange={() => {
                        handleToggleCompleted(datedItem);
                      }}
                      stopPropagation
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
};
