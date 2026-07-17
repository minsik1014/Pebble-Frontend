import { type Category, type ScheduleItem } from "@/types";
import { type CalendarDay, type CalendarEvent, type CalendarWeek } from "./types";

const DAY_COUNT_IN_WEEK = 7;
const EVENT_START_TOP_OFFSET = 43;
const EVENT_ROW_HEIGHT = 33;

type DatedScheduleItem = {
  item: ScheduleItem;
  category: Category;
  variant: "milestone" | "task";
  startDate: Date;
  endDate: Date;
};

const parseScheduleDate = (
  value: string,
  fallbackYear: number,
): Date | null => {
  const normalizedValue = value.trim();
  const isoMatch = normalizedValue.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);

  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  const shortDateMatch = normalizedValue.match(/^(\d{1,2})\/(\d{1,2})$/);

  if (shortDateMatch) {
    const [, month, day] = shortDateMatch;
    return new Date(fallbackYear, Number(month) - 1, Number(day));
  }

  return null;
};

const normalizeScheduleItem = (
  item: ScheduleItem,
  category: Category,
  variant: DatedScheduleItem["variant"],
  fallbackYear: number,
): DatedScheduleItem | null => {
  const startDate = parseScheduleDate(item.start, fallbackYear);
  const endDate = item.end ? parseScheduleDate(item.end, fallbackYear) : startDate;

  if (!startDate || !endDate) {
    return null;
  }

  return {
    item,
    category,
    variant,
    startDate: startDate.getTime() <= endDate.getTime() ? startDate : endDate,
    endDate: startDate.getTime() <= endDate.getTime() ? endDate : startDate,
  };
};

const collectScheduleItems = (
  categories: Category[],
  fallbackYear: number,
): DatedScheduleItem[] =>
  categories.flatMap((category) =>
    category.items.flatMap((item) => {
      const milestone = normalizeScheduleItem(
        item,
        category,
        "milestone",
        fallbackYear,
      );
      const tasks = (item.tasks ?? [])
        .map((task) => normalizeScheduleItem(task, category, "task", fallbackYear))
        .filter((task): task is DatedScheduleItem => Boolean(task));

      return milestone ? [milestone, ...tasks] : tasks;
    }),
  );

const createCalendarEvent = (
  datedItem: DatedScheduleItem,
  weekStartDate: Date,
  weekEndDate: Date,
  laneIndex: number,
): CalendarEvent | null => {
  const eventStartDate =
    datedItem.startDate.getTime() > weekStartDate.getTime()
      ? datedItem.startDate
      : weekStartDate;
  const eventEndDate =
    datedItem.endDate.getTime() < weekEndDate.getTime()
      ? datedItem.endDate
      : weekEndDate;

  if (eventStartDate.getTime() > eventEndDate.getTime()) {
    return null;
  }

  const startColumn = eventStartDate.getDay();
  const endColumn = eventEndDate.getDay();
  const columnSpan = endColumn - startColumn + 1;

  return {
    id: `${datedItem.variant}-${datedItem.item.id}-${weekStartDate.toISOString()}`,
    title: datedItem.item.title,
    leftPercent: (startColumn / DAY_COUNT_IN_WEEK) * 100,
    widthPercent: (columnSpan / DAY_COUNT_IN_WEEK) * 100,
    topOffset: EVENT_START_TOP_OFFSET + laneIndex * EVENT_ROW_HEIGHT,
    bgClass:
      datedItem.variant === "milestone"
        ? datedItem.category.themeMid
        : datedItem.category.themeLight,
    accentClass: datedItem.category.themeBase,
  };
};

export const generateWeeks = (
  year: number,
  month: number,
  categories: Category[],
): CalendarWeek[] => {
  const firstDayOfMonth = new Date(year, month - 1, 1);
  const startDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const daysInPrevMonth = new Date(year, month - 1, 0).getDate();
  const scheduleItems = collectScheduleItems(categories, year);

  const weeks: CalendarWeek[] = [];
  let currentDay = 1;
  let nextMonthDay = 1;

  for (let weekIndex = 0; weekIndex < 6; weekIndex++) {
    const days: CalendarDay[] = [];

    for (let dayOfWeek = 0; dayOfWeek < DAY_COUNT_IN_WEEK; dayOfWeek++) {
      if (weekIndex === 0 && dayOfWeek < startDayOfWeek) {
        days.push({
          day: daysInPrevMonth - startDayOfWeek + dayOfWeek + 1,
          monthOffset: -1,
        });
      } else if (currentDay <= daysInMonth) {
        days.push({
          day: currentDay,
          monthOffset: 0,
        });
        currentDay++;
      } else {
        days.push({
          day: nextMonthDay,
          monthOffset: 1,
        });
        nextMonthDay++;
      }
    }

    const firstVisibleDay = days[0];
    const lastVisibleDay = days[days.length - 1];
    const weekStartDate = new Date(
      year,
      month - 1 + firstVisibleDay.monthOffset,
      firstVisibleDay.day,
    );
    const weekEndDate = new Date(
      year,
      month - 1 + lastVisibleDay.monthOffset,
      lastVisibleDay.day,
    );
    const events = scheduleItems
      .filter(
        (scheduleItem) =>
          scheduleItem.startDate.getTime() <= weekEndDate.getTime() &&
          scheduleItem.endDate.getTime() >= weekStartDate.getTime(),
      )
      .map((scheduleItem, laneIndex) =>
        createCalendarEvent(scheduleItem, weekStartDate, weekEndDate, laneIndex),
      )
      .filter((event): event is CalendarEvent => Boolean(event));

    weeks.push({ days, events });

    if (currentDay > daysInMonth) {
      break;
    }
  }

  return weeks;
};
