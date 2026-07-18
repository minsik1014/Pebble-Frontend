import { type Category, type ScheduleItem } from "@/types";

export const parseScheduleDate = (
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

const getScheduleDateRange = (
  item: ScheduleItem,
  fallbackYear: number,
) => {
  const startDate = parseScheduleDate(item.start, fallbackYear);
  const endDate = item.end ? parseScheduleDate(item.end, fallbackYear) : startDate;

  if (!startDate || !endDate) {
    return null;
  }

  return startDate.getTime() <= endDate.getTime()
    ? { startDate, endDate }
    : { startDate: endDate, endDate: startDate };
};

export const isScheduleItemInMonth = (
  item: ScheduleItem,
  year: number,
  month: number,
) => {
  const dateRange = getScheduleDateRange(item, year);

  if (!dateRange) {
    return false;
  }

  const monthStartDate = new Date(year, month - 1, 1);
  const monthEndDate = new Date(year, month, 0);

  return (
    dateRange.startDate.getTime() <= monthEndDate.getTime() &&
    dateRange.endDate.getTime() >= monthStartDate.getTime()
  );
};

export const filterCategoriesByMonth = (
  categories: Category[],
  year: number,
  month: number,
): Category[] =>
  categories.map((category) => ({
    ...category,
    tasks: category.tasks?.filter((task) =>
      isScheduleItemInMonth(task, year, month),
    ),
    items: category.items
      .map((item) => {
        const filteredTasks = item.tasks?.filter((task) =>
          isScheduleItemInMonth(task, year, month),
        );
        const shouldKeepMilestone = isScheduleItemInMonth(item, year, month);

        if (!shouldKeepMilestone && (!filteredTasks || filteredTasks.length === 0)) {
          return null;
        }

        return {
          ...item,
          tasks: filteredTasks,
        };
      })
      .filter((item): item is ScheduleItem => Boolean(item)),
  }));
