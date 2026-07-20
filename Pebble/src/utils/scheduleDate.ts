import type { DateType } from "@/hooks/useScheduleDatePicker";

export type ScheduleDateRange = {
  start: string;
  end?: string;
};

export type ScheduleDateSelection = {
  dateType: DateType;
  selectedDate: Date | null;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  multiDates: Date[];
};

export const formatScheduleDate = (date: Date) =>
  [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");

export const parseIsoScheduleDate = (value: string) => {
  const dateMatch = value.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);

  if (!dateMatch) {
    return null;
  }

  const [, year, month, day] = dateMatch;
  return new Date(Number(year), Number(month) - 1, Number(day));
};

export const getScheduleRangeFromSelection = ({
  dateType,
  selectedDate,
  dateRange,
  multiDates,
}: ScheduleDateSelection): ScheduleDateRange | null => {
  if (dateType === "하루" && selectedDate) {
    return {
      start: formatScheduleDate(selectedDate),
      end: undefined,
    };
  }

  if (dateType === "기간" && dateRange.start && dateRange.end) {
    return {
      start: formatScheduleDate(dateRange.start),
      end: formatScheduleDate(dateRange.end),
    };
  }

  if (dateType === "다중" && multiDates.length > 0) {
    const selectedDates = [...multiDates].sort(
      (a, b) => a.getTime() - b.getTime(),
    );

    return {
      start: formatScheduleDate(selectedDates[0]),
      end:
        selectedDates.length > 1
          ? formatScheduleDate(selectedDates[selectedDates.length - 1])
          : undefined,
    };
  }

  return null;
};
