import type { Category, ScheduleItem, TaskItem } from "@/types";
import { parseScheduleDate } from "@/features/milestone/components/scheduleDateUtils";
import { formatScheduleDisplayLabel } from "@/utils/scheduleDate";
import { getReadableCategoryTextColor } from "@/utils/categoryColorTheme";

type CalendarSidebarListViewProps = {
  categories: Category[];
  standaloneTasks: TaskItem[];
  currentYear: number;
  currentMonth: number;
  checkedItems: Record<string, boolean>;
  onToggleChecked: (itemId: string) => void;
};

type DatedSidebarItem = {
  item: ScheduleItem;
  date: Date;
  barColor: string;
  textColor: string;
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

const isSameMonth = (date: Date, year: number, month: number) =>
  date.getFullYear() === year && date.getMonth() + 1 === month;

const formatGroupTitle = (date: Date) =>
  `${date.getMonth() + 1}월 ${date.getDate()}일`;

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

    getItemDates(task, currentYear)
      .filter((date) => isSameMonth(date, currentYear, currentMonth))
      .forEach((date) => {
        datedItems.push({
          item: task,
          date,
          barColor,
          textColor: "#171717",
        });
      });
  });

  categories.forEach((category) => {
    const milestoneTextColor =
      category.themeTextOnMid ??
      getReadableCategoryTextColor(category.themeBase, category.themeMid);
    const taskTextColor =
      category.themeTextOnLight ??
      getReadableCategoryTextColor(category.themeBase, category.themeLight);

    category.tasks?.forEach((task) => {
      getItemDates(task, currentYear)
        .filter((date) => isSameMonth(date, currentYear, currentMonth))
        .forEach((date) => {
          datedItems.push({
            item: task,
            date,
            barColor: category.themeLight,
            textColor: taskTextColor,
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
            textColor: milestoneTextColor,
          });
        });

      milestone.tasks?.forEach((task) => {
        getItemDates(task, currentYear)
          .filter((date) => isSameMonth(date, currentYear, currentMonth))
          .forEach((date) => {
            datedItems.push({
              item: task,
              date,
              barColor: category.themeLight,
              textColor: taskTextColor,
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
  checkedItems,
  onToggleChecked,
}: CalendarSidebarListViewProps): JSX.Element => {
  const groupedItems = collectSidebarItemsByDate({
    categories,
    standaloneTasks,
    currentYear,
    currentMonth,
  });

  return (
    <div className="flex w-[352px] flex-col gap-5">
      {groupedItems.map((group) => (
        <section key={group.key} className="flex w-full flex-col gap-3">
          <h2 className="text-body-01-sb text-text-primary">{group.title}</h2>
          <div className="flex w-full flex-col gap-2">
            {group.items.map(({ item, date, barColor, textColor }) => (
              <label
                key={`${group.key}-${item.id}-${date.toISOString()}`}
                className="flex h-12 w-full shrink-0 cursor-pointer items-center gap-2 overflow-hidden rounded-token-s bg-fill-inverse py-2 pr-2 shadow-shadow-s transition-colors hover:bg-fill-surface"
              >
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <div
                    className="h-8 w-2 shrink-0 rounded"
                    style={{ backgroundColor: barColor }}
                  />
                  <span
                    className="min-w-0 max-w-[190px] flex-1 truncate text-body-02-m"
                    style={{ color: textColor }}
                  >
                    {item.title}
                  </span>
                </div>

                <div className="flex shrink-0 items-center justify-end gap-3">
                  <span className="whitespace-nowrap text-body-02-m text-text-teritary">
                    {formatScheduleDisplayLabel(item)}
                  </span>
                  <span className="relative inline-flex h-6 w-6 items-center justify-center">
                    <input
                      type="checkbox"
                      aria-label={`${item.title} 일정 완료`}
                      checked={Boolean(checkedItems[item.id])}
                      onChange={() => onToggleChecked(item.id)}
                      className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    />
                    <span className="relative h-6 w-6 rounded border border-border-default bg-fill-inverse peer-checked:border-fill-primary peer-checked:bg-fill-primary" />
                  </span>
                </div>
              </label>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};
